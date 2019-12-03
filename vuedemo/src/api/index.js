import {get} from '@/utils/request'

// srticle文章列表
let list = (data) => {
  return get('/api/article/list', data)
}

// 首页文章详情
let detail = (id) => {
  return get('/api/article/details', {content_id: id})
}

// 我的药箱
let medicine = (params) => {
  return get('/api/medicine/list', params)
}

// 我的药箱详情
let medicinedetail = (id) => {
  return get('/api/medicine/details', {medicine_id: id})
}

// vip
let getMine = () => {
  return get('/api/user/login-test')
}

// let detail = (id) => {
//   return get('/api/article/details', {content_id: id})
// }

// // 我的药箱
// let medicine = (params) => {
//   return get('/api/medicine/list', params)
// }

// // 我的药箱详情
// let medicinedetail = (id) => {
//   return get('/api/medicine/details', {medicine_id: id})
// }

// // vip
// let getMine = () => {
//   return get('/api/user/login-test')
// }

let api = {
  list,
  detail,
  medicinedetail,
  getMine,
  medicine
}
export default {
  api
}
