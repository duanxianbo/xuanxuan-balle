// user/components/canvas/canvas.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    canvasId: {
      type: String
    }
  },

  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
 
  lifetimes: {
    ready: function () {
      wx.getSystemInfo({
        success: (res) => {

          const _context = wx.createCanvasContext(this.properties.canvasId, this);
          this.setData({
            _canvasw: res.windowWidth,
            _canvash : res.windowHeight,
            _context : _context
          })


          // 使用 wx.createContext 获取绘图上下文 _context
          _context.beginPath()
          _context.setStrokeStyle('#000000');
          _context.setLineWidth(4);
          _context.setLineCap('round');
          _context.setLineJoin('round');
  
         
  
        }
      });
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _context: null,
    _isButtonDown: false,
    _arrx: [],
    _arry: [],
    _arrz: [],
    _canvasw: 0,
    _canvash: 0,
    drawn: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    canvasIdErrorCallback: function (e) {
      console.error(e.detail.errMsg)
    },
    canvasStart: function (event) {
      this.setData({
        _isButtonDown: true,
        _arrz: [...this.data._arrz, 0],
        _arrx: [...this.data._arrx, event.changedTouches[0].x],
        _arry: [...this.data._arry, event.changedTouches[0].y]
      })
  
    },
    canvasMove: function (event) {
      if (this.data._isButtonDown) {
        this.setData({
          _arrz: [...this.data._arrz, 1],
          _arrx: [...this.data._arrx, event.changedTouches[0].x],
          _arry: [...this.data._arry, event.changedTouches[0].y]
        })
      };
  
      const _context = this.data._context;
  
      for (let i = 0; i < this.data._arrx.length; i++) {
        if (this.data._arrz[i] == 0) {
          _context.moveTo(this.data._arrx[i], this.data._arry[i])
        } else {
          _context.lineTo(this.data._arrx[i], this.data._arry[i])
        };
      };
  
  
      _context.clearRect(0, 0, this.data._canvasw, this.data._canvash);
  
      _context.setStrokeStyle('#000000');
      _context.setLineWidth(4);
      _context.setLineCap('round');
      _context.setLineJoin('round');
      _context.stroke();
  
      _context.draw(false);
  
      if (!this.data.drawn) {
        this.setData({
          drawn: true
        })
      }
    },
    
    cleardraw: function () {
      //清除画布
      this.setData({
        drawn: false,
        _arrz: [],
        _arrx: [],
        _arry: []
      })

      this.data._context.clearRect(0, 0, this.data._canvasw, this.data._canvash);
      this.data._context.draw(true);
    },
    canvasEnd: function (event) {
      this.setData({
        _isButtonDown: false
      })
    },
    confirmSignature() {
      new Promise((resolve, reject) => wx.canvasToTempFilePath({
        destWidth: 80,
        destHeight: 80,
        canvasId: "canvas",
        success: resolve,
        fail: reject
      }, this))
        .then((res) => {
          return new Promise((resolve, reject) => wx.getFileSystemManager()
          .readFile({
            filePath: res.tempFilePath, //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: resolve,
            fail: reject
          }))
        })
        .then((res) => {
          this.triggerEvent('drawn',  res.data);
        });
    }
  }
})
