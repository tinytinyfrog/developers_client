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
    }
  }
}

export default infoApi
