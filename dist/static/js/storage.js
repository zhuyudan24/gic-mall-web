/**
 * Created by Administrator on 2017/1/19.
 */
/**
 * Created by a on 2016/9/22.
 * 对localStorage和sessionStorage封装，
 */
//  key即为存储的名字
const keys = [
  'NewActivity',
  'NewReductActivity',
  'NewMailActivity',
  'User'
]
//  存localStorage
const utility = {
  setObj(key, data, islocal = false) {
    if (islocal) {
      window.localStorage.setItem(key, JSON.stringify(data))
    } else {
      window.sessionStorage.setItem(key, JSON.stringify(data))
    }
  },
  //  取localStorage
  getObj(key, islocal = false) {
    try {
      let data
      if (islocal) {
        data = JSON.parse(window.localStorage.getItem(key))
      } else {
        data = JSON.parse(window.sessionStorage.getItem(key))
      }
      return data
    } catch (e) {
      return null
    }
  }
}
const storage = {}
for (let key of keys) {
  storage['set' + key] = (value, islocal = false) => {
    utility.setObj(key, value, islocal)
  }
  storage['get' + key] = (value, islocal = false) => {
    return utility.getObj(key, islocal)
  }
}
export default storage
