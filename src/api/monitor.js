import {apiMonitor} from './index'

export default {
  toggleRelay: (id) => apiMonitor.post(`/relay/toggle/${id}`),
  getSensorBuffer: () => apiMonitor.get(`/sensor`)
}
