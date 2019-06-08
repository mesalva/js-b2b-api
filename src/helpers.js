export const joinContentStructure = ({ nodeModules = [], items = [], media = [], children = [], ...entity }) => {
  return {
    ...entity,
    children: [...children, ...nodeModules, ...items, ...media],
  }
}

export const metaEntity = ({ meta }) => meta.entities[meta.entities.length - 1]

export const addChildrenPermalink = parentPermalink => ({ children = [], ...entity }) => {
  return {
    ...entity,
    children: children.map(child => ({
      ...child,
      permalink: child.permalink || `${parentPermalink}/${child.slug}`,
    })),
  }
}

export const getAuthenticator = (Model, env, accessToken, callback) => {
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

const onlyUserHeaderCredentials = ({ headers }) => ({
  accessToken: headers.accessToken,
  uid: headers.uid,
})
