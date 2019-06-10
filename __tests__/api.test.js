import { modelMaker } from '../src/api'
import MeSalvaApi from '@mesalva/api'

let mockArgs = []
jest.mock('@mesalva/api', () =>
  jest.fn().mockImplementation((...args) => {
    mockArgs = args
  })
)

test('modelMaker', () => {
  const baseRoute = 'some-route'
  const callback = () => {}
  const envs = { MESALVA_HMAC: 'abc', MESALVA_API: 'https://test.com/', MESALVA_CLIENT: 'CLIENT' }
  const expectedEnvs = { API_HOST: 'https://test.com/', CLIENT: 'CLIENT', HMAC_KEY: 'abc' }
  modelMaker(envs, callback)(baseRoute)
  expect(MeSalvaApi).toHaveBeenCalledTimes(1)
  expect(mockArgs[0]).toEqual(baseRoute)
  expect(mockArgs[1]).toEqual(expectedEnvs)
  expect(mockArgs[2].get).toEqual(callback)
})
