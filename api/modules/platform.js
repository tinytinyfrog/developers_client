
import _get from 'lodash/get'
const platformApi = ($axios) => {
  return {
    getPlatformTag (params) {
      return $axios.post('rest/tag/query-cate-ref', params).then((res) => {
        return _get(res, 'data.data', [])
      })
    }
  }
}

export default platformApi
