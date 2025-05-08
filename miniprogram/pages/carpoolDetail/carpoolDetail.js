// pages/carpoolDetail/carpoolDetail.js
Page({
  data: {
    detailData: {},  // 拼车详情数据
    loading: true,   // 加载状态
    error: false,    // 错误状态
    errorMsg: ''     // 错误信息
  },

  onLoad(options) {
    const c_id = options.c_id;  // 从列表页传递的c_id
    if (!c_id) {
      this.setData({ error: true, errorMsg: '缺少拼车ID', loading: false });
      return;
    }
    this.fetchDetailData(c_id);
  },

  // 获取详情数据
  fetchDetailData(c_id) {
    const that = this;
    wx.request({
      url: `https://127.0.0.1:5000/api/carpools/${c_id}`,  // 替换为你的后端地址
      method: 'GET',
      success(res) {
        if (res.data.code === 200) {
          that.setData({
            detailData: res.data.data,
            loading: false,
            error: false
          });
        } else {
          that.setData({
            error: true,
            errorMsg: res.data.msg || '拼车信息不存在',
            loading: false
          });
        }
      },
      fail(err) {
        that.setData({
          error: true,
          errorMsg: '网络请求失败，请检查网络',
          loading: false
        });
      }
    });
  },

  // 重新加载数据
  reloadData() {
    this.setData({ loading: true, error: false });
    this.fetchDetailData(this.data.detailData.c_id);  // 从当前数据中获取c_id（或从onLoad的options中重新获取）
  }
});