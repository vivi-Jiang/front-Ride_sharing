// pages/carpoolList/carpoolList.js
Page({
  data: {
    carpoolList: [], // 拼车列表数据
    loading: true // 加载状态
  },

  onLoad() {
    this.fetchCarpoolList();
  },

  // 获取拼车列表数据
  fetchCarpoolList() {
    const that = this;
    wx.request({
      url: 'https://127.0.0.1:5000/api/carpools', // 替换为你的后端接口地址
      method: 'GET',
      success(res) {
        if (res.data.code === 200) {
          that.setData({
            carpoolList: res.data.data,
            loading: false
          });
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
          that.setData({ loading: false });
        }
      },
      fail() {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        that.setData({ loading: false });
      }
    });
  },

  // 跳转详情页
  gotoDetail(e) {
    const cid = e.currentTarget.dataset.cid;
    wx.navigateTo({
      url: `/pages/carpoolDetail/carpoolDetail?c_id=${cid}`
    });
  },
  gotoCreate() {
    wx.navigateTo({
      url: '/pages/createCarpool/createCarpool'
    });
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.fetchCarpoolList();
    wx.stopPullDownRefresh();
  }
});