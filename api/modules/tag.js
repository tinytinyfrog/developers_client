/**
 * 标签
 * */
import _get from 'lodash/get'
const tagApi = ($axios) => {
  return {
    /**
     * 获取所有标签 - 排除引用类型的数据
     */
    async getTagsByRef () {
      return await $axios.post('/rest/tag/query-all-ref').then((res) => {
        return _get(res, 'data.data', null)
      })
    }
  }
}

export default tagApi
