/**
 * 知识库
 * */
import _get from 'lodash/get'
const wikiApi = ($axios) => {
  return {
    createWiki (params) {
      return $axios.post('/rest/wiki/create', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    delWiki (wikiId) {
      return $axios.post(`/rest/wiki/delete/${wikiId}`, {}).then((res) => {
        return _get(res, 'data', null)
      })
    },
    updateWiki (params) {
      return $axios.post('/rest/wiki/update', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    getWikiList (params) {
      return $axios.post('/rest/wiki/list', params).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    getWikiListBySelf (params) {
      return $axios.post('/rest/wiki/my-create', params).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    addWikiCollaborator (params) {
      return $axios.post('/rest/wiki/collaborator/add', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    delWikiCollaborator (params) {
      return $axios.post('/rest/wiki/collaborator/delete', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    getWikiCollaboratorList (params) {
      return $axios.post('/rest/wiki/collaborator/list', params).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    wikiMoveNodeById (params) {
      return $axios.post('/rest/wiki/node/move', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    getWikiNodeListById (wikiId) {
      return $axios.post(`/rest/wiki/node/list/${wikiId}`, {}).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    getWikiNodeListInfoById (wikiId) {
      return $axios.post(`/rest/wiki/info/${wikiId}`, {}).then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    getMySelfWikiList () {
      return $axios.post('/rest/wiki/my-create', {}).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    delWikiNodeById (nodeId) {
      return $axios.post(`/rest/wiki/node/delete/${nodeId}`, {}).then((res) => {
        return _get(res, 'data', null)
      })
    },
    // 一级节点
    createWikiNode (params) {
      return $axios.post('/rest/wiki/node/create', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    // 二级
    addWikiNode (params) {
      return $axios.post('/rest/wiki/node/add', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    updateNodeName (params) {
      return $axios.post('/rest/wiki/node/update', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    getWikiNodeCheckRecordList (params) {
      return $axios.post('/rest/wiki/node-submit-record/list', params).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    createWikiNodeRecord (params) {
      return $axios.post('/rest/wiki/node-submit-record/create', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    auditWikiNodeRecord (params) {
      return $axios.post('/rest/wiki/node-submit-record/audit', params).then((res) => {
        return _get(res, 'data', null)
      })
    },
    async getWikiMenuDetail (id) {
      return await $axios.post(`/rest/posts/info/${id}`).then((res) => {
        return _get(res, 'data.data', null)
      })
    },
    async getWikiCategoryList () {
      return await $axios.post('/rest/wiki/category/all').then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    async getCaseList () {
      return await $axios.post('/rest/wiki/excellent-case').then((res) => {
        return _get(res, 'data.data', [])
      })
    },
    async getReviewList () {
      return await $axios.post('/rest/wiki/accident-review').then((res) => {
        console.log(res, '----')
        return _get(res, 'data.data', [])
      })
    },
    async getWikiMaps (params) {
      return await $axios.post('/rest/wiki/maps', params).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    async getWikiNodes (params) {
      return await $axios.post('/rest/wiki/page-node-posts', params).then((res) => {
        return _get(res, 'data.data.list', [])
      })
    },
    async getWikiTag (params) {
      return await $axios.post('/rest/wiki/wiki-posts-tag', params).then((res) => {
        return _get(res, 'data.data', [])
      })
    }
  }
}

export default wikiApi
