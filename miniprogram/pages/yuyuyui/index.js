// miniprogram/pages/yuyuyui/index.js
const app = getApp()

import {
  $wuxSelect
} from '../../dist/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isManager: false,
    color: [{
        title: '赤',
        value: '1'
      },
      {
        title: '青',
        value: '2'
      },
      {
        title: '绿',
        value: '3'
      },
      {
        title: '黄',
        value: '4'
      },
      {
        title: '紫',
        value: '5'
      },
    ],
    activeColor: '',
    activeColorValue: '',
    rate: [{
        title: 'UR',
        value: '1'
      },
      {
        title: 'SSR',
        value: '2'
      },
      {
        title: 'SR',
        value: '3'
      },
      {
        title: 'R',
        value: '4'
      }
    ],
    activeRate: '',
    activeRateValue: '',
    character: [{
        title: '结城友奈',
        value: '1'
      },
      {
        title: '东乡美森',
        value: '2'
      },
      {
        title: '三好夏凛',
        value: '3'
      },
      {
        title: '犬吠埼风',
        value: '4'
      },
      {
        title: '犬吠埼树',
        value: '5'
      },
      {
        title: '乃木园子（中）',
        value: '6'
      },
      {
        title: '鹫尾须美',
        value: '7'
      },
      {
        title: '三之轮银',
        value: '8'
      },
      {
        title: '乃木园子（小）',
        value: '9'
      },
      {
        title: '乃木若叶',
        value: '10'
      },
      {
        title: '高嶋友奈',
        value: '11'
      },
      {
        title: '郡千景',
        value: '12'
      },
      {
        title: '土居球子',
        value: '13'
      },
      {
        title: '伊予岛杏',
        value: '14'
      },
      {
        title: '上里日向',
        value: '15'
      },
      {
        title: '白鸟歌野',
        value: '16'
      },
      {
        title: '藤森水都',
        value: '17'
      },
      {
        title: '古波藏棗',
        value: '18'
      },
      {
        title: '秋原雪花',
        value: '19'
      },
      {
        title: '赤岭友奈',
        value: '20'
      },
      {
        title: '楠芽吹',
        value: '21'
      },
      {
        title: '山伏雫',
        value: '22'
      },
      {
        title: '加贺城雀',
        value: '23'
      },
      {
        title: '弥勒夕海子',
        value: '24'
      },
      {
        title: '国土亚耶',
        value: '25'
      },
      {
        title: '其他',
        value: '26'
      }
    ],
    activeCharacter: '',
    activeCharacterValue: '',
    pageSize: 10,
    pageNo: 1,
    totalPage: 1,
    cardList: [],
    power: false,
    avatarUrl: null,
    userInfo: null,
    spinning: false,
    showError: false,
    errMsg: ''
  },
  selectColor: function() {
    $wuxSelect('#color').open({
      value: this.data.activeColorValue,
      multiple: true,
      options: this.data.color,
      onConfirm: (value, index, options) => {
        //console.log('onConfirm', value, index, options)
        this.setData({
          activeColorValue: value,
          activeColor: index.map((n) => options[n].title),
          pageNo: 1
        })
        this.getCardList()
      },
    })
  },
  selectRate: function() {
    $wuxSelect('#rate').open({
      value: this.data.activeRateValue,
      multiple: true,
      options: this.data.rate,
      onConfirm: (value, index, options) => {
        //console.log('onConfirm', value, index, options)
        this.setData({
          activeRateValue: value,
          activeRate: index.map((n) => options[n].title),
          pageNo: 1
        })
        this.getCardList()
      },
    })
  },
  selectCharacter: function() {
    $wuxSelect('#character').open({
      value: this.data.activeCharacterValue,
      multiple: true,
      options: this.data.character,
      onConfirm: (value, index, options) => {
        //console.log('onConfirm', value, index, options)
        this.setData({
          activeCharacterValue: value,
          activeCharacter: index.map((n) => options[n].title),
          pageNo: 1
        })
        this.getCardList()
      },
    })
  },
  onGetOpenid: function() {
    // 调用云函数
    if (app.globalData.openid != '') {
      this.setData({
        isManager: app.globalData.isManager
      })
      return
    }
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.getManager()
      },
      fail: err => {
        //console.error('[云函数] [login] 调用失败', err)
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })
  },
  getManager() {
    var vm = this
    const db = wx.cloud.database()
    db.collection('manager').where({
      open: app.globalData.openid
    }).get({
      success: function(res) {
        //console.log(res)
        if (res.data.length != 0) {
          vm.setData({
            isManager: true
          })
          app.globalData.isManager = true
        }
      }
    })
  },
  gotoCreate: function() {
    wx.navigateTo({
      url: '../createCard/createCard',
    })
  },
  getCardList: function() {
    var vm = this
    this.setData({
      spinning: true
    })
    const db = wx.cloud.database()
    const _ = db.command
    var ss = {}
    if (this.data.activeColor != '') {
      ss.color = _.in(this.data.activeColor)
    }
    if (this.data.activeRate != '') {
      ss.rate = _.in(this.data.activeRate)
    }
    if (this.data.activeCharacter != '') {
      ss.character = _.in(this.data.activeCharacter)
    }

    db.collection('cards').skip((vm.data.pageNo - 1) * vm.data.pageSize).limit(vm.data.pageSize).where(ss).orderBy('time', 'desc').get({
      success: function(res) {
        if (vm.data.pageNo == 1) {
          vm.data.cardList = []
        }
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        vm.setData({
          cardList: vm.data.cardList.concat(res.data),
          spinning: false
        })
        //console.log(res.data)
      }
    })
    db.collection('cards').skip((vm.data.pageNo - 1) * vm.data.pageSize).limit(vm.data.pageSize).where(ss).count({
      success: function(res) {
        //console.log(res)
        vm.setData({
          totalPage: res.total
        })
      }
    })

  },
  openCard: function(e) {
    var index = e.currentTarget.dataset['index']
    if (this.data.cardList[index].open == null || this.data.cardList[index].open == false) {
      this.data.cardList[index].open = true
    } else {
      this.data.cardList[index].open = false
    }
    this.setData({
      cardList: this.data.cardList
    })
  },
  // upper: function (e) {
  //   console.log(e)
  // },
  lower: function(e) {
    if (this.data.cardList.length >= this.data.totalPage) {
      //console.log('no more')
      return
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    this.getCardList()
  },
  gotoEdit: function(e) {
    var id = e.currentTarget.dataset['id']
    app.globalData.eidtId = id
    this.data.cardList.forEach(function(c) {
      if (c._id == id) {
        app.globalData.editCard = JSON.stringify(c)
      }
    })
    wx.navigateTo({
      url: '../createCard/createCard',
    })
    //console.log(id)
  },
  download: function(e) {
    this.setData({
      spinning: true
    })
    var that = this
    var url = e.currentTarget.dataset['url']
    
    //////////////////////
    wx.downloadFile({
      url: url, // 文件 ID
      success: res => {
        //保存下载的图片到本地
        //console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(data) {
            //console.log(data)
            wx.showToast({
              title: '下载成功',
              icon: '',
              mask: true,
              duration: 1500
            })
            that.setData({
              spinning: !that.data.spinning
            })
          },
          fail: error => {

            if (error.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.showModal({
                title: '警告',
                content: '若不打开授权，则无法将图片保存在相册中！',
                showCancel: false
              })
            } else {
              this.setData({
                errMsg: JSON.stringify(error),
                showError: true
              })
            }
            that.setData({
              spinning: !that.data.spinning
            })
          }
        })
      },
      fail: error => {
        this.setData({
          errMsg: JSON.stringify(error),
          showError: true
        })
        that.setData({
          spinning: !that.data.spinning
        })
      }
    })
  },
  close1: function() {
    this.setData({
      showError: false
    })
  },
  handleSetting: function(e) {
    let that = this;
    // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      })
      that.setData({
        saveImgBtnHidden: true,
        openSettingBtnHidden: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您已授权，赶紧将图片保存在相册中吧！',
        showCancel: false
      })
      that.setData({
        saveImgBtnHidden: false,
        openSettingBtnHidden: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.onGetOpenid()
    this.getCardList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})