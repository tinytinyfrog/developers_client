import Vue from 'vue'
import dayjs from 'dayjs'
export function formatDate (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(fmt)
}

export function dateCountDown (date) {
  const minute = 60000
  const hour = minute * 60
  const day = hour * 24
  const monthDiff = (dayjs().year() * 12 + dayjs().month()) - (dayjs(date).year() * 12 + dayjs(date).month())

  const timeDiff = Date.now() - dayjs(date).valueOf()
  const weekC = timeDiff / (7 * day)
  const dayC = timeDiff / day
  const hourC = timeDiff / hour
  const minC = timeDiff / minute

  let res = ''
  if (monthDiff >= 3) {
    res = dayjs(date).format('YYYY-MM-DD')
  } else if (monthDiff > 1) {
    res = parseInt(monthDiff) + '个月前'
  } else if (weekC >= 1) {
    res = parseInt(weekC) + '周前'
  } else if (dayC >= 1) {
    res = parseInt(dayC) + '天前'
  } else if (hourC >= 1) {
    res = parseInt(hourC) + '小时前'
  } else if (minC >= 1) {
    res = parseInt(minC) + '分钟前'
  } else {
    res = '刚刚'
  }
  return res
}

const filters = {
  formatDate,
  dateCountDown
}
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
