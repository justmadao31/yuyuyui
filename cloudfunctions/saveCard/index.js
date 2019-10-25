// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  if (event.cid == '') {
    return await db.collection('cards').add({
      data: event.card
    })
  } else {
    return await db.collection('cards').doc(event.cid).set({
      data: event.card
    })
  }
}