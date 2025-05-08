Page({
  data: {
    u_name: '',
    u_password: ''
  },

  inputUName(e) { this.setData({ u_name: e.detail.value }) },
  inputPassword(e) { this.setData({ u_password: e.detail.value }) },

  handleLogin() {
    const { u_name, u_password } = this.data
    if (!u_name || !u_password) {
      wx.showToast({ title: '用户名和密码必填', icon: 'none' })
      return
    }

    wx.request({
      url: 'https://127.0.0.1:5000/api/login',  // 确保URL正确
      method: 'POST',
      data: { u_name, u_password },
      success: (res) => {
        if (res.data.code === 200) {
          const u_id = res.data.data.u_id;  // 从后端获取u_id
          wx.setStorageSync('u_id', u_id);  // 存入缓存（关键步骤）
          wx.showToast({ title: '登录成功' })
          wx.navigateBack();  // 返回上一页（或跳转到创建页）
          // 或直接跳转到拼车列表页
          // wx.navigateTo({ url: '/pages/carpoolList/carpoolList' })
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