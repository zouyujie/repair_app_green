function set(key) {//存储
    var img = document.createElement('img');
    img.setAttribute('crossOrigin', 'anonymous');
    //当图片加载完成时触发回调函数
    img.addEventListener("load", function () {
        var imgCanvas = document.createElement('canvas');
        imgContest = imgCanvas.getContext('2d');
        //确保canvas元素的大小和图片尺寸一致
        imgCanvas.width = this.width;
        imgCanvas.height = this.height;

        //渲染图片到canvas中
        imgContest.drawImage(this, 0, 0, this.width, this.height);

        //用data url的形式取出
        var imgAsDataURL = imgCanvas.toDataURL("image/jpg");

        //保存到本地存储中
        try {
            localStorage.setItem(key, imgAsDataURL);
        }
        catch (e) {
            console.log("Storage failed" + e);
        }
    }, false);
    img.src = src;
}

function get(div, key) {//读取get(容器,图片)
    var srcStr = localStorage.getItem(key);
    var imgObj = document.createElement('img');
    imgObj.src = srcStr;
    div.appendChild(imgObj);
}