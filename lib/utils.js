import _get from 'lodash/get'
import { ROLE_ENUM } from './enum'

const handleDirectory = (obj, directoryList) => {
  const reg = /\./ig
  const pointObjLen = obj.id.match(reg).length
  directoryList.forEach((item) => {
    const pointItem = item.id.match(reg)
    const pointItemLen = pointItem ? pointItem.length : 0
    if (obj.id.includes(item.id + '.')) {
      if (pointObjLen - pointItemLen === 1) {
        item.children.push(obj)
        return directoryList
      } else {
        handleDirectory(obj, item.children)
      }
    }
  })
}

export const generateDirectory = (el) => {
  const stack = []
  const headers = el.querySelectorAll('h1,h2,h3,h4,h5,h6')
  const directoryList = []
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i]
    const level = parseInt(header.tagName.replace('H', ''), 10)
    while (stack.length < level) {
      stack.push(0)
    }
    while (stack.length > level) {
      stack.pop()
    }
    stack[stack.length - 1]++
    const index = stack.join('.')
    const id = 'head' + index
    header.setAttribute('id', id)
    const obj = {
      id,
      content: header.textContent,
      children: []
    }
    if (index >= 1) {
      if (+index % 1 !== 0) {
        handleDirectory(obj, directoryList)
      } else {
        directoryList.push(obj)
      }
    } else if (id.split('.').length > 2) {
      handleDirectory(obj, directoryList)
    } else {
      directoryList.push(obj)
    }
  }
  return directoryList
}

/**
 * url 拼接
 */
export const addQuery = (url, query = {}) => {
  const { protocol, host } = location
  let path = url
  const hasProtocol = path.includes('http')
  if (!hasProtocol) {
    path = `${protocol}//${host}${url}`
  }
  const _url = new URL(path)
  for (const key in query) {
    if (query[key]) {
      _url.searchParams.set(key, query[key])
    }
  }
  return hasProtocol ? _url.href : _url.pathname + _url.search
}

/**
 * getQueryByKey
 */
export const getQueryByKey = (key) => {
  const query = new URL(location.href)
  return query.searchParams.get(key) || ''
}

/**
 * getQueryObject
 */
export const getQueryObject = (url = location.href) => {
  const kvs = new URL(url).search.slice(1).split('&')
  const query = {}
  for (let i = 0; i < kvs.length; i++) {
    const q = kvs[i].split('=')
    if (q[1]) query[q[0]] = decodeURIComponent(q[1])
  }
  return query
}

export const replaceUrlByQuery = (data) => {
  const { protocol, host, pathname } = location
  const url = `${protocol}//${host}${pathname}`
  const query = Object.assign(getQueryObject(), data)
  window.history.replaceState('replace', 'null', addQuery(url, query))
}

const DPREVIEWHISTORY = '_dp_review_history_'

export const getViewHistoryTop = () => {
  const historyStr = sessionStorage.getItem(DPREVIEWHISTORY)
  return historyStr ? JSON.parse(historyStr) : null
}

export const setViewHistoryTop = (data = {}) => {
  const oldHistory = getViewHistoryTop() || {}
  const newHistory = Object.assign(oldHistory, data)
  sessionStorage.setItem(DPREVIEWHISTORY, JSON.stringify(newHistory))
}

export const userRoleStatus = (store) => {
  const role = _get(store, 'state.user.userInfo.role', '')
  return {
    isSuperAdmin: role === ROLE_ENUM.SUPER_ADMIN,
    isAdmin: role === ROLE_ENUM.ADMIN || role === ROLE_ENUM.SUPER_ADMIN,
    isUser: role === ROLE_ENUM.USER,
    isCollaborator: role === ROLE_ENUM.COLLABORATOR,
    noLogin: role === ''
  }
}
