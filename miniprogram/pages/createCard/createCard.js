// miniprogram/pages/createCard/createCard.js
var COS = require('../cos-wx-sdk-v5.js')
import {
  $wuxSelect
} from '../../dist/index'
import {
  $wuxDialog
} from '../../dist/index'
const app = getApp()

var cos = new COS({
  SecretId: 'AKIDc4h8MPUQEyg5XpnFNObczK0tv1AUoHiy',
  SecretKey: 'YFxaGeuzs0BF8uhXSN7f2FJQOEuPhmR5',
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
        title: 'MR',
        value: '5'
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
    beforeImg: '',
    afterImg: '',
    beforeImgName: '',
    afterImgName: '',
    cardName: '',
    id: '',
    info: {
      leaderSkillName: '',
      leaderSkillConctent: '',
      skillName: '',
      skillContent: '',
      abilityName: '',
      abilityContent: '',
      akt: '',
      hp: '',
      grown: '',
      strength: '',
      crt: '',
      speed: '',
      cost: '',
      description: ''
    },
    spinning: false,
    isManager: false
  },
  selectColor: function() {
    $wuxSelect('#color').open({
      value: this.data.activeColorValue,
      options: this.data.color,
      onConfirm: (value, index, options) => {
        //console.log('onConfirm', value, index, options)
        this.setData({
          activeColorValue: value,
          activeColor: options[index].title,
        })
        //console.log(this.data.activeColorValue)
      },
    })
  },
  selectRate: function() {
    $wuxSelect('#rate').open({
      value: this.data.activeRateValue,
      options: this.data.rate,
      onConfirm: (value, index, options) => {
        //console.log('onConfirm', value, index, options)
        this.setData({
          activeRateValue: value,
          activeRate: options[index].title,
        })
      },
    })
  },
  selectCharacter: function() {
    $wuxSelect('#character').open({
      value: this.data.activeCharacterValue,
      options: this.data.character,
      onConfirm: (value, index, options) => {
        //console.log('onConfirm', value, index, options)
        this.setData({
          activeCharacterValue: value,
          activeCharacter: options[index].title,
        })
      },
    })
  },
  // 上传图片
  doUpload: function(e) {
    // 选择图片
    if (this.data.cardName == '') {
      $wuxDialog('#wux-dialog--alert').alert({
        resetOnClose: true,
        title: '注意！',
        content: '请先输入卡名！',
        onConfirm(e) {

        },
      })
      return
    }
    var vm = this
    vm.setData({
      spinning: true
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'yuyuyui/' + vm.data.cardName + '·' + vm.data.activeCharacter + (e.currentTarget.dataset['index'] == 1 ? 'before' : 'after') + filePath.match(/\.[^.]+?$/)[0]

        cos.postObject({
          Bucket: 'yuyuyui-1257913680',
          Region: 'ap-chengdu',
          Key: cloudPath,
          FilePath: filePath,
          onProgress: function(info) {
            console.log(JSON.stringify(info));

          }
        }, function(err, data) {
          console.log(err || data);
          if (data) {
            if (e.currentTarget.dataset['index'] == 1) {
              vm.setData({
                beforeImg: 'https://' + data.Location,
                beforeImgName: cloudPath
              })
            } else {
              vm.setData({
                afterImg: 'https://' + data.Location,
                afterImgName: cloudPath
              })
            }
            wx.showToast({
              icon: 'none',
              title: '上传成功',
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          }

          vm.setData({
            spinning: false
          })
        });

      },
      fail: e => {
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
        vm.setData({
          spinning: false
        })
        console.log(e)
      }
    })
  },
  deleteImg: function(e) {
    var vm=this
    const cloudPath = vm.data.cardName + '·' + vm.data.activeCharacter + (e.currentTarget.dataset['index'] == 1 ? 'before' : 'after') + 
      (e.currentTarget.dataset['index'] == 1 ? this.data.beforeImg : this.data.afterImg).match(/\.[^.]+?$/)[0]
    console.log(cloudPath)
    cos.deleteObject({
      Bucket: 'yuyuyui-1257913680',
      Region: 'ap-chengdu',
      Key: 'yuyuyui/'+cloudPath,
    }, function (err, data) {
      console.log(err || data);
      if(data){
        if (e.currentTarget.dataset['index'] == 1){
          vm.setData({
            beforeImg: ''
          })
        }else{
          vm.setData({
            afterImg: ''
          })
        }
        
        wx.showToast({
          icon: 'none',
          title: '删除成功',
        })
      }else{
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
      }
    });
  },
  textChange: function(e) {
    var p = e.currentTarget.dataset['title']
    this.data.info[p] = e.detail.value
    this.setData({
      info: this.data.info
    })
  },
  onChange: function(e) {
    this.setData({
      cardName: e.detail.value
    })
  },
  saveCard: function() {
    var vm = this
    vm.setData({
      spinning: true
    })
    var cardData = {
      title: vm.data.cardName,
      color: vm.data.activeColor,
      rate: vm.data.activeRate,
      character: vm.data.activeCharacter,
      beforeImg: vm.data.beforeImg,
      afterImg: vm.data.afterImg,
      beforeImgName: vm.data.beforeImgName,
      afterImgName: vm.data.afterImgName,
      time: new Date(),
      info: vm.data.info
    }
    var cid = this.data.id
    var sf = function(res) {
      vm.setData({
        spinning: false
      })
      vm.setData({
        id: res._id
      })
      $wuxDialog('#wux-dialog--alert').alert({
        resetOnClose: true,
        title: '成功',
        content: '保存成功！',
        onConfirm(e) {
          wx.navigateTo({
            url: '../yuyuyui/index',
          })
        },
      })
    }
    wx.cloud.callFunction({
      name: 'saveCard',
      data: {
        card: cardData,
        cid: cid
      },
      success: function(res) {
        //console.log(res)
        sf(res)
      },
      fail: function(res) {
        console.log(res)
        vm.setData({
          spinning: false
        })
        $wuxDialog('#wux-dialog--alert').alert({
          resetOnClose: true,
          title: '失败',
          content: JSON.stringify(res),
          onConfirm(e) {

          },
        })
      }
    })
  },
  getCardById: function() {
    var vm = this
    //console.log(app.globalData.editCard)
    var res = {
      data: ''
    }
    res.data = JSON.parse(app.globalData.editCard)
    vm.setData({
      id: res.data._id,
      activeCharacter: res.data.character,
      activeColor: res.data.color,
      activeRate: res.data.rate,
      cardName: res.data.title,
      afterImg: res.data.afterImg,
      beforeImg: res.data.beforeImg,
      beforeImgName: res.data.beforeImgName||'',
      afterImgName: res.data.afterImgName||'',
      info: res.data.info
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(app.globalData.eidtId)
    this.setData({
      isManager: app.globalData.isManager
    })
    if (app.globalData.eidtId != '') {
      this.getCardById()
      app.globalData.eidtId = ''
      app.globalData.editCard = ''
    }
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