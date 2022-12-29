export default class SocketService {
  static instance = null
  static get Instance() {
    if (!this.instance) {
      return (this.instance = new SocketService())
    } else {
      return this.instance
    }
  }
  ws = null
  //连接成功标识
  connected = false
  // 记录重试的次数
  sendRetryCount = 0
  //重新连接的操作
  connectRetryCount = 0

  connect() {
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持 WebSocket')
    }
    this.ws = new WebSocket('ws://localhost:9998')

    this.ws.onopen = () => {
      console.log('连接服务端成功')
      this.connected = true
      this.connectRetryCount = 0
    }
    // 1.连接服务器失败
    // 2.连接成功，服务器关闭
    this.ws.onclose = () => {
      console.log('连接服务端失败')
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, 500 * this.connectRetryCount)
    }

    this.ws.onmessage = (msg) => {
      console.log('从服务器获取数据成功')
      // console.log(msg.data)
      const { action, socketType, data } = JSON.parse(msg.data)
      // 判断回掉函数是否存在
      if (this.callbackMap[socketType]) {
        if (action === 'getData') {
          // console.log(this.callbackMap)
          this.callbackMap[socketType].call(this, JSON.parse(data))
        } else if (action === 'fullScreen') {
          this.callbackMap[socketType].call(this, JSON.parse(msg.data))
        } else if (action === 'themeChange') {
          this.callbackMap[socketType].call(this, JSON.parse(msg.data))
        }
      }
    }
  }
  callbackMap = {}
  registerCallback(socketType, callback) {
    this.callbackMap[socketType] = callback
  }
  unRegisterCallback(socketType) {
    this.callbackMap[socketType] = null
  }
  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, 500 * this.sendRetryCount)
    }
  }
}
