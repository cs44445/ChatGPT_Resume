class DevicePixelRatio {
  constructor() {
    this.flag = 'win';
  }
  // 获取系统类型
  _getSystem() {
    // let flag = false;
    var agent = navigator.userAgent.toLowerCase();
    //   Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36
    // mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/89.0.4389.114 safari/537.36
    // console.log(agent, 'agent--------------agent')
    let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (isMac) {
      if ((/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))) {
        this.flag = 'saf'
      } else {
        this.flag = 'mac'
      }
      return true;
    }
    // 现只针对windows处理，其它系统暂无该情况，如有，继续在此添加
    if (agent.indexOf('windows') >= 0 || agent.indexOf('Macintosh') >= 0) {
      return true;
    }
  }
  // 获取页面缩放比例
  //	_getDevicePixelRatio() {
  //		let t = this;
  //	}
  // 监听方法兼容写法
  _addHandler(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  }
  // 校正浏览器缩放比例
  _correct() {
    let t = this;
    if (this.flag == 'saf') {
      console.log('saf')
      document.getElementsByTagName('body')[0].style.zoom = 1.7 / window.devicePixelRatio;
    } else if (this.flag == 'mac') {
      console.log('mac')
      // 页面devicePixelRatio（设备像素比例）变化后，计算页面body标签zoom修改其大小，来抵消devicePixelRatio带来的变化。
      document.getElementsByTagName('body')[0].style.zoom = 1.6 / window.devicePixelRatio;
    } else {
      document.getElementsByTagName('body')[0].style.zoom = 1.0 / window.devicePixelRatio;
    }
  }
  // 监听页面缩放
  _watch() {
    let t = this;
    t._addHandler(window, 'resize', function () { // 注意这个方法是解决全局有两个window.resize
      // 重新校正
      t._correct()
    })
  }
  // 初始化页面比例
  init() {
    let t = this;
    if (t._getSystem()) { // 判断设备，目前只在windows系统下校正浏览器缩放比例
      // 初始化页面校正浏览器缩放比例
      t._correct();
      // 开启监听页面缩放
      t._watch();
    }
  }
}
export default DevicePixelRatio