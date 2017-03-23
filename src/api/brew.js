import {apiBrew} from './index'

export default {
  getById: (id) => apiBrew.get(`/id/${id}`),
  postById: (id, brew) => apiBrew.post(`/id/${id}`, brew),
  getBrewList: () => apiBrew.get(`/list`),
  postNewBrew: (brew) => apiBrew.post(`/new`, brew),
  getSchema: () => apiBrew.get('/schema'),
  deleteById: (id) => apiBrew.delete(`/id/${id}`)
}
