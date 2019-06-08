import MeSalvaApi from '@mesalva/api'
import algoliasearch from 'algoliasearch'

const MESALVA_ALGOLIA_ID = process.env.MESALVA_ALGOLIA_ID
const MESALVA_ALGOLIA_KEY = process.env.MESALVA_ALGOLIA_KEY

const onlyUserHeaderCredentials = ({ headers }) => ({
  accessToken: headers.accessToken,
  uid: headers.uid,
})

const modelMaker = (env, callback) => route =>
  new MeSalvaApi(
    route,
    { HMAC_KEY: env.MESALVA_HMAC, API_HOST: env.MESALVA_API, CLIENT: env.MESALVA_CLIENT },
    { get: callback }
  )

const joinContentStructure = ({ nodeModules = [], items = [], media = [], children = [], ...entity }) => {
  return {
    ...entity,
    children: [...children, ...nodeModules, ...items, ...media],
  }
}

const metaEntity = ({ meta }) => meta.entities[meta.entities.length - 1]

const addChildrenPermalink = parentPermalink => ({ children = [], ...entity }) => {
  return {
    ...entity,
    children: children.map(child => ({
      ...child,
      permalink: child.permalink || `${parentPermalink}/${child.slug}`,
    })),
  }
}

const getAuthenticator = (Model, env, accessToken, callback) => {
  return () => {
    if (accessToken) return Promise.resolve()
    return Model('user/sign_in')
      .request({
        method: 'POST',
        data: { email: env.MESALVA_USER, password: env.MESALVA_PASSWORD },
      })
      .then(onlyUserHeaderCredentials)
      .then(callback)
  }
}

export default class MeSalva {
  constructor(env) {
    let credentials = {}

    const algoliaClient = algoliasearch(MESALVA_ALGOLIA_ID, MESALVA_ALGOLIA_KEY)
    const algoliaIndex = algoliaClient.initIndex('SearchData')

    const Model = modelMaker(env, () => credentials)

    const authenticate = getAuthenticator(Model, env, credentials.accessToken, value => (credentials = value))

    this.getMedium = (permalink_slug, retry = true) => {
      const slug = permalink_slug.split('/').pop()
      return authenticate()
        .then(() =>
          Model('media').get({
            route: slug,
            data: { permalink_slug },
          })
        )
        .catch(e => {
          if (!retry) return Promise.reject()
          credentials = {}
          return this.getMedium(permalink_slug, false)
        })
    }

    this.getContent = permalink => {
      return Model('permalink_contents')
        .request({ route: permalink })
        .then(metaEntity)
        .then(joinContentStructure)
        .then(addChildrenPermalink(permalink))
    }

    this.search = key => {
      return new Promise((success, fail) => {
        if (['string', 'number'].indexOf(typeof key) < 0) return fail(key)
        algoliaIndex.search(key, (err, content) => (err ? fail(err) : success(content)))
      })
    }
  }
}
