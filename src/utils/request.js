/**
 * Created by yangyuting on 2019/2/16.
 */
import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()

const host = 'https://h.xlzhao.com/'
fly.config.baseURL = host

function reqfn (url, data, cb, method, token) {
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  // var header = { 'Content-Type': 'application/x-www-form-urlencoded' }
  // console.log(request)
  fly.config.headers = {
    'content-type': 'application/json',
    Authorization: 'Bearer ' + token
  }
  if (!method) {
    method = 'GET'
    fly.get(url)
      .then(function (response) {
        // console.log(response)
        wx.hideLoading()
        return typeof cb === 'function' && cb(response)
      })
      .catch(function (error) {
        // console.log(error)
        wx.hideLoading()
        return typeof cb === 'function' && cb(error)
      })
  }
  if (method === 'POST') {
    // header = {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    //   Authorization: 'Bearer ' + token
    // }
    fly.config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + token
    }
    fly.post(url, data)
      .then(function (response) {
        wx.hideLoading()
        // console.log(response)
        return typeof cb === 'function' && cb(response)
      })
      .catch(function (error) {
        wx.hideLoading()
        // console.log(error)
        return typeof cb === 'function' && cb(error)
      })
  } else {
    method = 'GET'
    fly.get(url)
      .then(function (response) {
        // console.log(response)
        wx.hideLoading()
        return typeof cb === 'function' && cb(response)
      })
      .catch(function (error) {
        wx.hideLoading()
        // console.log(error)
        return typeof cb === 'function' && cb(error)
      })
  }
}
// 添加响应拦截器
fly.interceptors.response.use(
  response => {
    wx.hideLoading()
    return response.data // 请求成功之后将返回值返回
  },
  err => {
    // 请求出错，根据返回状态码判断出错原因
    console.log(err)
    wx.hideLoading()
    if (err) {
      return '请求失败'
    }
  }
)

export {
  reqfn
}
