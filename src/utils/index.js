function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

/**
 * 获取最新数据
 * @param {string} url // 请求地址
 * @param {string} data // 参数
 * @inner
*/
export function fetch (url, data) {
  return Reflect.construct(Promise, [(resolve, reject) => {
      wx.request({
          url,
          method: 'post',
          data,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success (res) {
              resolve(res)
          },
          fail (err) {
              reject(err)
          }
      })
  }])
  .then(res => {
    const {statusCode, data} = res
    if (!(statusCode >= 200 && (statusCode === 304 || statusCode < 300))) throw new Error('statusCode错误码: ' + statusCode)
    if (data.status) throw new Error(data.msg)
    return data.data || {}
  })
  .catch(err => {
    wx.showModal({
        title: '错误信息',
        content: err.errMsg || err.message,
        showCancel: false
    })
    return false
  })
}

export const uploadFile = (url, file, formData = {}) =>
  Reflect.construct(Promise, [(resolve, reject) => {
    wx.uploadFile({
      url,
      filePath: file,
      name: 'lice_pic',
      formData,
      header: {'if-match': '0000'},
      success (data) {
        resolve(data)
      },
      fail (err) {
        reject(err)
      }
    })
  }])
  .then(res => {
    const {statusCode, data} = res
    if (!(statusCode >= 200 && (statusCode === 304 || statusCode < 300))) throw new Error('statusCode错误码: ' + statusCode)
    const dataObj = JSON.parse(data)
    if (dataObj.status) throw new Error(dataObj.msg)
    return dataObj.data || {}
  })
  .catch(err => {
    wx.showModal({
        title: '错误信息',
        content: err.errMsg || err.message,
        showCancel: false
    })
    return false
  })

  export const selectAndUpload = (url, data, title = '证照上传中...') => {
    // 先选择图片，如果成功再上传图片
    const choosePic = () =>
      Reflect.construct(Promise, [(resolve, reject) => {
        wx.chooseImage({
          count: 1,
          // sizeType: 'origin',
          success (fileObj) {
            resolve(fileObj)
          },

          fail (e) {
            reject(e.errMsg.search('fail cancel') ? {noSelect: true} : e)
          }
        })
      }])

    async function getPos () {
      const fileObj = await choosePic()
      wx.showLoading({
        title,
        mask: true
      })
      const file = fileObj.tempFilePaths[0]
      const resData = await uploadFile(url, file, data)
      if (resData === false) throw new Error('upload file error')
      return Object.assign(resData, {licePic: file})
    }

    return getPos()
    .then(data => {
      wx.hideLoading()
      return data
    })
    .catch(err => {
      if (err.noSelect) return null
      wx.hideLoading()
      return false
    })
  }
