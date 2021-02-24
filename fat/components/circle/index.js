Component({
  options: {
    multipleSlots: true 
  },
  properties: {
    bg: {      
      type: String, 
      value: 'bg'    
    },
    draw: {
      type: String,
      value: 'draw'
    },
  },

  data: { 
    size: 0, 
    step: 1,
    num: 100
  },
  methods: {
   drawCircleBg: function (id, x, w) {
      this.setData({
        size: 2 * x  
      });
      var ctx = wx.createCanvasContext(id,this)
      ctx.setLineWidth(w / 2);
      ctx.setStrokeStyle('#F7F7F7');
      ctx.setLineCap('round')
      ctx.beginPath();
      ctx.arc(x, x, x - w, 0, 2 * Math.PI, false);
      ctx.stroke();
      ctx.draw();
    },
    drawCircle: function (id, x, w, val,total) {
      var context = wx.createCanvasContext(id,this);
      var gradient = context.createLinearGradient(2 * x, x, 0);
      gradient.addColorStop("0", "#68DBCA");
      gradient.addColorStop("0.5", "#41B7A1");
      gradient.addColorStop("1.0", "#3BB19B");
      context.setLineWidth(w);
      context.setStrokeStyle(gradient);
      context.setLineCap('round')
      context.beginPath();

      var p = Number(val) / Number(total);
      p = p > 1 ? 1 : p < 0 ? 0 : p;
      
      context.arc(x, x, x - w, -90 * Math.PI / 180, (p*360 - 90)*Math.PI / 180, false);
      context.stroke();
      context.draw()
    },
    _runEvent() {
      this.triggerEvent("runEvent")
    }
  },
  onReady: function () {
  }
})