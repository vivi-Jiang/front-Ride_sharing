// pages/createCarpool/createCarpool.js
const app = getApp();

Page({
  data: {
    typeOptions: ['车找人', '人找车'],  // 拼车类型选项
    selectedType: 0,  // 默认选择车找人（索引0）
    isCarSeeking: true,  // 是否显示车找人额外字段
    formData: {
      c_type: '车找人',  // 默认类型
      c_departure: '',
      c_destination: '',
      date: '',  // 日期（YYYY-MM-DD）
      time: '',  // 时间（HH:MM）
      c_price: '',
      c_car_model: '',
      c_remaining_seats: '',
      c_note: ''
    },
    today: ''  // 今日日期（用于日期选择器start）
  },

  onLoad() {
    // 初始化今日日期（格式YYYY-MM-DD）
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    this.setData({ today: `${y}-${m}-${d}` });

    // 从缓存获取用户ID（假设登录后存储了u_id）
    const u_id = wx.getStorageSync('u_id');
    if (!u_id) {
      // 未登录时，引导到登录页（替代直接返回）
      wx.showModal({
        title: '提示',
        content: '请先登录以发布拼车',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/login/login' });  // 跳转到登录页
          } else {
            wx.navigateBack();  // 用户取消时返回上一页
          }
        }
      });
      return;
    }
    this.data.formData.u_id = u_id;  // 隐藏字段：用户ID
  },

  // 处理类型选择变化
  handleTypeChange(e) {
    const selectedType = e.detail.value;
    const c_type = this.data.typeOptions[selectedType];
    this.setData({
      selectedType,
      isCarSeeking: c_type === '车找人',
      'formData.c_type': c_type
    });
  },

  // 处理输入框/textarea输入
  handleInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`formData.${field}`]: e.detail.value });
  },

  // 处理日期选择
  handleDateChange(e) {
    this.setData({ 'formData.date': e.detail.value });
  },

  // 处理时间选择
  handleTimeChange(e) {
    this.setData({ 'formData.time': e.detail.value });
  },

  // 提交表单
  submitForm() {
    const { formData } = this.data;
    const { u_id, c_type, c_departure, c_destination, date, time, c_price, c_car_model, c_remaining_seats } = formData;

    // 验证必填字段
    if (!u_id) {
      wx.showToast({ title: '用户未登录', icon: 'none' });
      return;
    }
    if (!c_departure || !c_destination || !date || !time) {
      wx.showToast({ title: '请填写出发地、目的地、日期和时间', icon: 'none' });
      return;
    }
    if (c_type === '车找人' && (!c_price || !c_car_model || !c_remaining_seats)) {
      wx.showToast({ title: '车找人需填写价格、车型和剩余座位', icon: 'none' });
      return;
    }

    // 合并日期时间（格式YYYY-MM-DD HH:MM:SS）
    const c_date = `${date} ${time}:00`;  // 秒数补0

    // 调用后端接口
    wx.request({
      url: 'https://127.0.0.1:5000/api/create_carpool',  // 替换为实际接口地址
      method: 'POST',
      data: {
        ...formData,
        c_date  // 合并后的日期时间
      },
      success: (res) => {
        if (res.data.code === 200) {
          wx.showToast({ title: '发布成功', icon: 'success' });
          wx.navigateBack();  // 返回上一页（列表页）
        } else {
          wx.showToast({ title: res.data.msg || '发布失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      }
    });
  }
});