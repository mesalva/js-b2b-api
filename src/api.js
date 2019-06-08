import MeSalvaApi from '@mesalva/api'

export const modelMaker = (env, callback) => route =>
  new MeSalvaApi(
    route,
    { HMAC_KEY: env.MESALVA_HMAC, API_HOST: env.MESALVA_API, CLIENT: env.MESALVA_CLIENT },
    { get: callback }
  )
