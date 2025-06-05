import _get from 'lodash/get'
const infoApi = ($axios) => {
  return {
    getInfoNews (params) {
      return $axios.post('rest/config/page-activity-info', params).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    getInfoHonorList (params) {
      return $axios.post('rest/config/page-honors', params).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    getInfoDetail (params) {
      return $axios.post('rest/config/activity-info-detail', params).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    getHonorDetail (params) {
      return $axios.post('developers-server/rest/config/honors-detail', params).then((res) => {
        return _get(res, 'data.data', [])
      })
    }
  }
}

export default infoApi
