Page({
  data: {
    u_name: '',
    u_telphone: '',
    u_password: ''
  },

  inputUName(e) { this.setData({ u_name: e.detail.value }) },
  inputUTelphone(e) { this.setData({ u_telphone: e.detail.value }) },
  inputPassword(e) { this.setData({ u_password: e.detail.value }) },

  handleRegister() {
    const { u_name, u_telphone, u_password } = this.data
    if (!u_name || !u_password) {
      wx.showToast({ title: '用户名和密码必填', icon: 'none' })
      return
    }

    wx.request({
      url: 'https://127.0.0.1:5000/api/register',
      method: 'POST',
      data: { u_name, u_telphone, u_password },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({ title: '注册成功' })
          wx.navigateBack()  // 返回上一页
        } else {
          wx.showToast({ title: res.data.msg, icon: 'none' })
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'none' })
      }
    })
  }
})