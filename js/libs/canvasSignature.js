/**
 * 画canvas组件
 * @param {
 *        targetId : "signName",
 *        strokeStyle : "black",
 *        lineCap : "round",
 *        lineJoin: "round",
 *        lineWidth : 5
 * }
 * @method: 
 * 		  clear() : 清除屏幕
 * 		  saveFile(): 返回保存的文件对象
 * 		  
 */
var haveWriteCanvas = false;//记录是否已经触发绘图—移动端专用
(function () {
    var defaults = {
        targetId: "signName",
        strokeStyle: "red",
        lineCap: "round",
        lineJoin: "round",
        lineWidth: 1,
        shadowBlur: 1,         // 边缘模糊，防止直线边缘出现锯齿
        shadowColor: 'black'
    };
    var pressed = false; // 绘图的开关（用于在PC端判断是否按下按钮）
    // 移动端，使用手指操作，需要绑定的是touchstart和touchmove；PC端，使用鼠标操作，需要绑定的是mousedown和mousemove。如下一行代码可用于判断是否移动端：
    var isMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
    var point = {};
    var DrawCanvas = function (opts) {
        this.opts = defaults;
        for (var property in opts) {
            this.opts[property] = opts[property];
        }
        this.opts.shadowColor = this.opts.strokeStyle;
        this.init();
        return this;
    };
    // 初始化生成canvas
    DrawCanvas.prototype.init = function () {
        this.container = document.getElementById(this.opts.targetId);
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext("2d");
        this.setSize();
        this.addEvent();
        this.container.appendChild(this.canvas);
    };
    // 设置canvas的大小
    DrawCanvas.prototype.setSize = function () {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.offsetTop = this.container.offsetTop;
        this.offsetLeft = this.container.offsetLeft;
        this.canvas.width = this.canvas.style.width = this.width;
        this.canvas.height = this.canvas.style.height = this.height;
    };
    DrawCanvas.prototype.addEvent = function () {
        var that = this;
        var canvas = that.canvas;
        if (isMobile) {
            canvas.addEventListener("touchstart", start, false);
            canvas.addEventListener("touchmove", move, false);
        } else {
            canvas.addEventListener('mousedown', start);
            canvas.addEventListener('mousemove', move);
            canvas.addEventListener('mouseup', function () {
                pressed = false;
            });
            canvas.addEventListener('mouseleave', function () {
                pressed = false;
            });
        }

        function start(e) {
            //console.log(that);
            e.preventDefault();
            e = isMobile ? e.touches[0] : e;
            pressed = true;
            if (haveWriteCanvas == false) {
                haveWriteCanvas = true;
            }
            //console.log('e.clientX:' + e.clientX + ',that.offsetLeft:' + that.offsetLeft)
            //console.log('e.clientY:' + e.clientY + ',that.offsetTop:' + that.offsetTop + ',screenY:' + that.screenY)
            point = {
                x: e.clientX - that.offsetLeft,
                y: e.clientY - that.offsetTop-30
            }
            // console.log(point);
            that.create(1);
        }
        function move(e) {
            e.preventDefault();
            if (requestAnimationFrame) {

            }
            e = isMobile ? e.touches[0] : e;
            point = {
                x: e.clientX - that.offsetLeft,
                y: e.clientY - that.offsetTop-30
            }
            that.create(2);
        }
    };
    // 生成图像
    DrawCanvas.prototype.create = function (flag) {
        var ctx = this.context;
        var opts = this.opts;
        if (pressed) {
            switch (flag) {
                case 1: // 开始路径
                    ctx.beginPath();
                    ctx.strokeStyle = opts.strokeStyle;
                    ctx.lineCap = opts.lineCap;
                    ctx.lineJoin = opts.lineJoin;
                    ctx.lineWidth = opts.lineWidth;
                    ctx.shadowBlur = opts.shadowBlur;         // 边缘模糊，防止直线边缘出现锯齿
                    ctx.shadowColor = opts.shadowColor;  // 边缘颜色
                    ctx.moveTo(point.x, point.y);
                case 2: //前面之所以没有break语句，是为了点击时能够描画出一个点
                    ctx.lineTo(point.x, point.y);
                    ctx.stroke();
                    break;
            }
        }
    };
    DrawCanvas.prototype.clear = function () {
        var that = this;
        haveWriteCanvas = false;
        that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
    };
    DrawCanvas.prototype.getFile = function () {
        var image = this.canvas.toDataURL("image/png");
        return image;
    };
    DrawCanvas.prototype.changeOpts = function (opts) {
        for (var property in opts) {
            this.opts[property] = opts[property];
        }
        this.opts.shadowColor = this.opts.strokeStyle;
    };

    window.DrawCanvas = DrawCanvas;
})()