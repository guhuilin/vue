import moment from 'moment'

/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
}

export function isAllDate(s) { 
  let reg1 = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  let reg2 = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
  let reg3 = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
  if (new RegExp(reg1).test(s)) {
    return moment(s, 'YYYY-MM-DD')
  } else if (new RegExp(reg2).test(s)) {
    return moment(s, 'HH:mm:ss')
  } else if (new RegExp(reg3).test(s)) {
    return moment(s,'YYYY-MM-DD HH:mm:ss')
  } else {
    return s
  }
}

export function dateToString(s) { 
  if (typeof(s) === 'object') {
    return moment(s).format('YYYY-MM-DD')
  } else {
    return s
  }
}

export function isDate(s) {
  let reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  if (new RegExp(reg).test(s)) {
    return moment(s, 'YYYY-MM-DD')
  } else {
    return s
  }
}

export function isTime(s) {
  let reg = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
  if (new RegExp(reg).test(s)) {
    return moment(s, 'HH:mm:ss')
  } else {
    return s
  }
}

export function isDateTime(s) {
  let reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
  if (new RegExp(reg).test(s)) {
    return moment(s, 'YYYY-MM-DD HH:mm:ss')
  } else {
    return s
  }
}
