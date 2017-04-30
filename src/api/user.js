import {apiUser} from './index'

export default {
  getStatus: () => apiUser.get('/status')
}
