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

export const joinMediumInfo = (full, env) => medium => {
  if (!full || !medium.videoId || medium.provider !== 'sambatech') return Promise.resolve(medium)
  return fetch(`${process.env.BFF_URL}/b2b/samba-video-mp4/${medium.videoId}`, { headers: getBffHeaders(env) })
    .then(r => {
      if (r.status >= 300) return Promise.reject(r)
      if (!r.headers.get('content-type').match('json')) return Promise.reject(r)
      return r.json()
    })
    .then(infos => ({ ...medium, infos }))
    .catch(() => medium)
}

const getBffHeaders = ({ MESALVA_USER }) => ({
  'Content-Type': 'application/json',
  uid: MESALVA_USER,
})

const onlyUserHeaderCredentials = ({ headers }) => ({
  accessToken: headers.accessToken,
  uid: headers.uid,
})
