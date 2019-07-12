import 'universal-fetch'
import { joinContentStructure, metaEntity, addChildrenPermalink, getAuthenticator, joinMediumInfo } from './helpers'
import { algoliaIndex } from './algolia'
import { modelMaker } from './api'

export default class MeSalva {
  constructor(env) {
    let credentials = {}
    const Model = modelMaker(env, () => credentials)
    const authenticate = getAuthenticator(Model, env, credentials.accessToken, value => (credentials = value))

    this.getMedium = (permalink_slug, full = true, retry = true) => {
      const slug = permalink_slug.split('/').pop()
      return authenticate()
        .then(() => Model('media').get({ route: slug, data: { permalink_slug } }))
        .then(joinMediumInfo(full, env))
        .catch(e => {
          if (!retry) return Promise.reject()
          credentials = {}
          return this.getMedium(permalink_slug, full, false)
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
