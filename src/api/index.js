import axios from 'axios'

function extendWithToken (axios, base) {
  var extend = axios.create({baseURL: base})
  extend.interceptors.request.use(function (config) {
    config.headers.authorization = 'Bearer ' + token()
    return config
  })
  return extend
}
export const token = () => {
  return getLocal('token')
}

var domainBase = 'https://brew.photoredux.com/'
export const apiAuth = domainBase + 'auth'
export const apiBrew = extendWithToken(axios, domainBase + 'brew')
export const apiMonitor = extendWithToken(axios, domainBase + 'monitor')

function getLocal (str) { return window.localStorage.getItem(str) }
