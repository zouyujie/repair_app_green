/*---------------------------------全局函数 create by zouqj--------------------------------------*/
document.addEventListener('plusready', function () {
    plus.navigator.setStatusBarBackground("#348D7F");// 设置系统状态栏背景为蓝色
    plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackOpaque");// 设置系统状态栏样式为浅色文字
}, false);
/*if (config.OpenLog == false) {
    console.log = (function (oriLogFunc) {
        return function (str) {
            oriLogFunc.call(console, '');
        }
    })(console.log);
}*/
/**
 * 全局函数
 * @param {Object} $ ： mui
 * @param {Object} owner：g
 */
(function ($, owner) {
    /**
    *  简单封装了绘制原生view控件的方法
    *  绘制内容支持font（文本，字体图标）,图片img , 矩形区域rect
    */
    owner.drawNative = function (id, styles, tags) {
        var view = new plus.nativeObj.View(id, styles, tags);
        return view;
    },
    owner.getIndexByTypeId = function (typeid) {
        var mindex = 0;
        switch (typeid) {
            case TaskType.repair.value:
                mindex = 0;
                break;
            case TaskType.polling.value:
                mindex = 1;
                break;
            case TaskType.maintain.value:
                mindex = 2;
                break;
            default:
                mindex = 0;
                break;
        }
        return mindex;
    }
    //根据建筑ID获取建筑信息
    owner.scanedRepair = function (bid) {
        g.ajax(config.GetBuildInfo, {
            data: {
                bid: bid,
            },
            success: function (data) {
                //console.log('data:' + JSON.stringify(data))
                if (data && data.Data) {
                    var jsonRes = {};
                    jsonRes.BUILD_ID = data.Data.BUILD_ID;
                    jsonRes.BUILD_NAME = data.Data.BUILD_NAME;
                    jsonRes.ADDRESS = data.Data.ADDRESS;
                    jsonRes.TOTAL_AREA = data.Data.TOTAL_AREA;
                    jsonRes.BUILD_TYPE_NAME = data.Data.BUILD_TYPE_NAME;
                    jsonRes.ORG_CODE = data.Data.ORG_CODE;
                    //二维码报修
                    g.openWindowWithTitle({
                        url: 'home/add-repair-content.html',
                        id: "add-repair-content",
                        extras: {
                            buildInfo: jsonRes
                        }
                    }, '填写报修内容');
                }
            }
        });
    }
    /**
	 * 识别二维码获取建筑ID
	 * @param {Object} url
	 */
    owner.getBuildId = function (url) {
        var index = url.indexOf("=");
        var buildId = url.substr(index + 1, url.length - index);
        console.log("buildId:" + buildId);
        return buildId;
    }
    owner.setBase64Img = function (src, imgobj, func) {//存储
        var img = new Image(); //document.createElement('img');
        img.src = src;
        //当图片加载完成时触发回调函数
        img.addEventListener("load", function () {
            var imgCanvas = document.createElement('canvas');
            imgContest = imgCanvas.getContext('2d');
            //确保canvas元素的大小和图片尺寸一致
            imgCanvas.width = this.width;
            imgCanvas.height = this.height;
            //渲染图片到canvas中
            imgContest.drawImage(this, 0, 0, this.width, this.height);
            var ext =this.src.length>0? this.src.substring(this.src.lastIndexOf(".") + 1).toLowerCase():'';
            console.log('ext:' + ext)
            //用data url的形式取出
            var imgAsDataURL = imgCanvas.toDataURL("image/" + ext);
            //console.log('imgAsDataURL:' + imgAsDataURL);
            imgobj.imgblog = imgAsDataURL;
            func(imgobj);
        }, false);
    }
    /**
	 * 获取应用本地配置
	 **/
    owner.setSettings = function (settings) {
        g.setItem('$settings', settings)
    }
    /**
	 * 设置应用本地配置
	 **/
    owner.getSettings = function () {
        return g.getItem('$settings');
    }
    /**
	 * 根据id获取dom
	 * @param {Object} id
	 */
    owner.id = function (id) {
        return document.getElementById(id);
    }
    /**
	 * 获取当前日期的前七天
	 */
    owner.getSevenDay = function () {
        //设置日期，当前日期的前六天
        var myDate = new Date(); //获取今天日期
        myDate.setDate(myDate.getDate() - 6);
        var dateArray = [];
        var dateTemp;
        var flag = 1;
        var td = {
            value: '今日',
            textStyle: {
                backgroundColor: {
                    image: '../img/login-logo.png'
                }
            }
        };
        for (var i = 0; i < 7; i++) {
            dateTemp = i == 6 ? td : myDate.getDate(); //(myDate.getMonth() + 1) + "-" +
            dateArray.push(dateTemp);
            myDate.setDate(myDate.getDate() + flag);
        }
        return dateArray;
    }
    /**
	 * 获取近12个月
	 */
    owner.getTwelveMonth = function () {
        var d = new Date();
        var result = [];
        for (var i = 0; i < 12; i++) {
            d.setMonth(d.getMonth() + 1);
            var m = d.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            //在这里可以自定义输出的日期格式
            result.push(m + '月');
        }
        return result;
    }

    function pad2(n) {
        return n < 10 ? '0' + n : n
    }
    /**
	 * 获得当前时间 格式：yyyyMMddHHmmss毫秒
	 */
    owner.getCurrentTimeFormat = function () {
        var oDate = new Date();
        return oDate.getFullYear().toString() + pad2(oDate.getMonth() + 1) + pad2(oDate.getDate()) + pad2(oDate.getHours()) + pad2(oDate.getMinutes()) + pad2(oDate.getSeconds()) + oDate.getMilliseconds().toString();
    }
    //获取当前时分秒
    owner.getTimeNow = function () {
        var oDate = new Date();
        return pad2(oDate.getHours()) + ":" + pad2(oDate.getMinutes()) + ":" + pad2(oDate.getSeconds());
    }
    //获取日期的一部分
    owner.getDatePart = function (tag, date) {
        var oDate = date || new Date();
        var _result = '';
        switch (tag) {
            case 'day':
                _result = pad2(oDate.getDate());
                break;
            case 'month':
                _result = pad2(oDate.getMonth() + 1);
                break;
            case 'week':
                _result = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[oDate.getDay()];
                break;
            default:
                break;
        }
        return _result;
    }
    //字符串转日期：输入的时间格式为yyyy-MM-dd
    owner.convertDateFromString = function (dateString) {
        if (dateString) {
            var date = new Date(dateString.replace(/-/, "/"))
            return date;
        }
    }
    /**
	 * 时间选择框
	 * @param {Object} jsonData
	 */
    owner.timeSelect = function (jsonData) {
        mui.plusReady(function () {
            var dTime = jsonData.defaultTime;
            dTime.setHours(dTime.getHours(), dTime.getMinutes());
            plus.nativeUI.pickTime(function (e) {
                var d = e.date;
                jsonData.info.innerHTML = d.getHours() + ":" + d.getMinutes();
                jsonData.info.classList.add('have-value');
            }, function (e) {
                //jsonData.info.innerHTML = "您没有选择时间";
                jsonData.info.classList.remove('have-value');
            }, {
                title: "请选择时间",
                is24Hour: true,
                time: dTime
            });
        })
    }
    /**
	 * tap 切换样式
	 * @param {Object} _this
	 * @param {Object} _class
	 */
    owner.toggleCss = function (_this, _class) {
        if (!h(_this).hasClass(_class)) {
            h(_this).addClass(_class)
        }
        var sib = h(_this).siblings();
        sib.each(function (obj) {
            if (h(obj).hasClass(_class)) {
                h(obj).removeClass(_class);
            }
        });
        var parentSib = h(_this).parent().siblings().find(".spn");
        parentSib.each(function (obj) {
            if (h(obj).parent().hasClass(_class)) {
                h(obj).parent().removeClass(_class);
            }
        });
    }
    /**
	 * 按钮状态切换
	 * @param {Object} _this
	 * @param {Object} _class
	 */
    owner.btnToggleCss = function (_this, _class) {
        if (h(_this).hasClass(_class)) {
            h(_this).removeClass(_class)
        }
        var sib = h(_this).siblings();
        sib.each(function (obj) {
            if (!h(obj).hasClass(_class)) {
                h(obj).addClass(_class);
            }
        });
    }
    //切换样式，给当前元素添加样式，其它兄弟节点移除样式
    owner.toggleBtnCss = function (_dom, _class) {
        _dom.classList.add(_class);
        var _siblings = g.siblings(_dom);
        for (var i = 0; i < _siblings.length; i++) {
            _siblings[i].classList.remove(_class);
        }
    }
    owner.ajax = function (url, jsonData) {
        console.log('ajax调用开始' + url)
        if (jsonData.type == undefined) {
            jsonData.type = 'post';
        }
        console.log('where:' + JSON.stringify(jsonData.data));
        var _uuid = config.uuid;
        //console.log('_uuid:' + _uuid)
        mui.ajax(url, {
            async: jsonData.async || true,
            data: jsonData.data,
            dataType: 'json', //服务器返回json格式数据
            type: jsonData.type, //HTTP请求类型
            timeout: 20000, //超时时间设置为10秒；
            //'Content-type': 'text/plain; charset=utf-8',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "USER_APP_ID": _uuid
            },
            beforeSend: function () {
                if (jsonData.mask) {
                    //plus.nativeUI.showWaiting(title, options);
                    jsonData.mask.show(); //显示遮罩层
                }
            },
            complete: function () {
                if (jsonData.nwaiting) {
                    jsonData.nwaiting.close();
                    g.closeWaiting();
                }
                if (jsonData.isShowing) {

                } else {
                    g.closeWaiting();
                }
                if (jsonData.mask) {
                    jsonData.mask.close(); //关闭遮罩层
                }
            },
            success: jsonData.success,
            error: function (xhr, type, errorThrown) {
                var btn = document.getElementById("btnSubmit");
                if (btn) {
                    btn.disabled = false;
                }
                if (jsonData.nwaiting) {
                    jsonData.nwaiting.close();
                }
                if (jsonData.error) {
                    jsonData.error();
                    if (g.getNetStatus() == false) {
                        mui.toast('网络异常,请稍候再试');
                        return;
                    }
                } else {
                    //console.log('接口' + url + '调用出错');
                    // mui.toast('接口' + url + '调用出错');
                    //return;
                }
                //console.log('xhr' + (xhr || '') + 'xhrobj' + JSON.stringify(xhr) + ',' + 'xhr.response:' + (xhr.response || ''))
                if (!g.getNetStatus()) {
                    return;
                }
                var _msg = '';
                try {
                    //console.log('JSON.parse(xhr.response):' + JSON.parse(xhr.response) || '')
                    if (xhr.response != null && JSON.parse(xhr.response) != null) {
                        _msg = JSON.parse(xhr.response).Message;
                    }
                } catch (e) {
                    //console.log(e);//Unexpected end of input
                    mui.toast(e);
                }
                if (xhr.status == 400) {
                    mui.toast(_msg);
                }
                else if (xhr.status == 403) {
                    mui.toast(_msg);
                    //console.log(url);
                    if (url == config.QueryMaintainResultById || url == config.QueryCheckResultById) {
                        setTimeout(function () {
                            old_back();
                            //console.log('回退');
                        }, 3000);
                    }
                }
                //console.log('接口' + url + '调用出错' + _msg);
                if (_msg == '无效用户') {//自动退出登录
                    g.logout();
                }
                //mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
            }
        });
    }
    /**
	 * 获得屏幕的高度
	 * @param {Object} element
	 */
    owner.getScreenInfo = function (element) {
        if (element == 'width') {
            return document.documentElement.clientWidth || document.body.clientWidth;
        } else {
            return document.documentElement.clientHeight || document.body.clientHeigth;
        }
    };
    owner.getScreen = function (maxW, maxH) {
        var arr = [
			document.documentElement.clientWidth || document.body.clientWidth,
			document.documentElement.clientHeight || document.body.clientHeigth
        ];
        maxW && (function () {
            if (arr[0] > maxW) {
                arr[0] = maxW;
            }
        }());
        maxH && (function () {
            if (arr[1] > maxH) {
                arr[1] = maxH;
            }
        }());
        return arr;
    }
    /**
	 * 打开新页面
	 * @param {Object} jsonData
	 */
    owner.openWindow = function (jsonData) {
        mui.openWindow({
            url: jsonData.url,
            id: jsonData.id,
            extras: jsonData.extras || {},
            styles: jsonData.styles || {},
            show: jsonData.show || {},
            waiting: jsonData.waiting || {}
        });
    }
    //打开新页面（H5+)
    owner.openWindowWithTitle = function (WebviewOptions, title) {
        var _styles = {                             // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
            titleNView: {                       // 窗口的标题栏控件
                titleText: title,                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
                titleColor: "#fff",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
                titleSize: "17px",                 // 字体大小,默认17px
                backgroundColor: "#348D7F",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
                progress: {                        // 标题栏控件的进度条样式
                    color: "#56CF87",                // 进度条颜色,默认值为"#00FF00"  
                    height: "2px"                    // 进度条高度,默认值为"2px"         
                },
                splitLine: {                       // 标题栏控件的底部分割线，类似borderBottom
                    color: "#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"  
                    height: "0px"                    // 分割线高度,默认值为"2px"
                },
                autoBackButton: true
            },
        };
        WebviewOptions.styles = _styles;
        mui.openWindow(WebviewOptions);
    }
    /**
	 * 初始化报表
	 * @param {Object} id
	 * @param {Object} chartOption
	 */
    owner.initECharts = function (id, chartOption) {
        var charts = g.id(id);
        var _chart = echarts.init(charts);
        _chart.setOption(chartOption);
        window.onresize = function () {
            _chart.resize();
        }
        return _chart;
    }
    /**
	 * 初始化报表
	 * @param {Object} id
	 * @param {Object} chartOption
	 */
    owner.initEChartsMin = function (_chart, chartOption) {
        _chart.setOption(chartOption);
        window.onresize = function () {
            _chart.resize();
        }
        return _chart;
    }
    /**
	 * 设置菜单本地配置
	 **/
    owner.setMenus = function (menus) {
        //g.setItem('$menus', menus);
        menus = JSON.stringify({
            data: menus
        });
        plus.storage.setItem('$menus', menus);
    }
    /**
	 * 获取菜单本地配置
	 **/
    owner.getMenus = function () {
        //return g.getItem('$menus');
        var jsonStr = plus.storage.getItem('$menus');
        return jsonStr ? JSON.parse(jsonStr).data : null;
    }
    /**
	 * 显示等待框
	 * @param {Object} watingPrompt
	 */
    owner.showWaiting = function (watingPrompt) {
        mui.plusReady(function () {
            plus.nativeUI.showWaiting(watingPrompt);
        });
    }
    /**
	 * 关闭等待框
	 */
    owner.closeWaiting = function () {
        mui.plusReady(function () {
            plus.nativeUI.closeWaiting();
        });
    }
    //日期格式化处理
    owner.formatDate = function (value, type) {
        ////console.log('formatDate;' + value);
        if (value == undefined || value == null || value == 'null') {
            return '';
        }

        var dataTime = "";
        var date;
        if (!value) {
            return dataTime;
        }
        else if (value == 'D') {
            date = new Date();
        }
        else if (value.toString().indexOf('T') >= 0) {
            value = value.toString().replace('T', ' ');
            date = new Date(value);
        } else {
            date = new Date(value);
        }
        if (date.toString() == 'Invalid Date') {
            if (type == 'YMDHMS') {
                return value;
            }
            else if (type == 'YMDHM') {
                //console.log(type + ':' + value.split(':')[0] + value.split(':')[1]);
                return value.split(':')[0] + ':' + value.split(':')[1];
            }
            else if (type == 'YMD') {
                return value.split(' ')[0];
            }
        }
        ////console.log('data:' + value + ',' + date);
        var year = date.getFullYear();
        var month = addZero(parseInt(date.getMonth()) + 1);
        var day = addZero(date.getDate());
        var hour = addZero(date.getHours());//getUTCHours
        var minute = addZero(date.getMinutes());
        var second = addZero(date.getSeconds());

        if (type == "YMD") {
            dataTime = year + "-" + month + "-" + day;
        } else if (type == "YMDHMS") {
            dataTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        } else if (type == "YMDHM") {
            dataTime = year + "-" + month + "-" + day + " " + hour + ":" + minute;
        }
        else if (type == "HMS") {
            dataTime = hour + ":" + minute + ":" + second;
        } else if (type == "YM") {
            dataTime = year + "-" + month;
        } else if (type == "MD") {
            dataTime = month + "-" + day;
        }
        ////console.log('dataTime;' + dataTime);
        return dataTime;
    }
    function addZero(val) {
        if (val < 10) {
            return "0" + val;
        } else {
            return val;
        }
    };
    //时间周期
    owner.operationDate = function (d) {
        var now = new Date();
        now.setDate(now.getDate() + d);
        var fmt = 'yyyy-MM-dd hh:mm:ss';
        var o = {
            "M+": now.getMonth() + 1, //月份
            "d+": now.getDate(), //日
            "h+": now.getHours(), //小时
            "m+": now.getMinutes(), //分
            "s+": now.getSeconds(), //秒
            "q+": Math.floor((now.getMonth() + 3) / 3), //季度
            "S": now.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt));
        fmt = fmt.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        ////console.log(fmt)
        return fmt;
    }
    //获取当前日期yy-mm-dd
    //date 为时间对象
    owner.getCurDate = function (date) {
        var year = "";
        var month = "";
        var day = "";
        var now = date;
        year = "" + now.getFullYear();
        if ((now.getMonth() + 1) < 10) {
            month = "0" + (now.getMonth() + 1);
        } else {
            month = "" + (now.getMonth() + 1);
        }
        if ((now.getDate()) < 10) {
            day = "0" + (now.getDate());
        } else {
            day = "" + (now.getDate());
        }
        return year + "-" + month + "-" + day;
    }
    /** 
    * 获得相对当前周AddWeekCount个周的起止日期 
    * AddWeekCount为0代表当前周   为-1代表上一个周   为1代表下一个周以此类推
    * **/
    owner.getWeekStartAndEnd = function (AddWeekCount) {
        //起止日期数组   
        var startStop = new Array();
        //一天的毫秒数   
        var millisecond = 1000 * 60 * 60 * 24;
        //获取当前时间   
        var currentDate = new Date();
        //相对于当前日期AddWeekCount个周的日期
        currentDate = new Date(currentDate.getTime() + (millisecond * 7 * AddWeekCount));
        //返回date是一周中的某一天
        var week = currentDate.getDay();
        //返回date是一个月中的某一天   
        var month = currentDate.getDate();
        //减去的天数   
        var minusDay = week != 0 ? week - 1 : 6;
        //获得当前周的第一天   
        var currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay));
        //获得当前周的最后一天
        var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6));
        //添加至数组   
        startStop.push(g.getCurDate(currentWeekFirstDay));
        startStop.push(g.getCurDate(currentWeekLastDay));

        return startStop;
    }
    /**
	 * 根据name属性查找所有的复选框按钮
	 * @param {Object} name
	 */
    owner.getCheckBoxRes = function (name) {
        var rdsObj = document.getElementsByName(name);
        var checkVal = new Array();
        var k = 0;
        for (i = 0; i < rdsObj.length; i++) {
            if (rdsObj[i].checked) {
                checkVal[k] = rdsObj[i].value;
                k++;
            }
        }
        return checkVal;
    }
    /**
	 * 根据数据对象查找对象
	 * @param {Object} obj
	 * @param {Object} id
	 */
    owner.findDataById = function (obj, id) {
        var res = null;
        for (var i in obj) {
            if (Array.isArray(obj)) {
                res = findDataInArr(obj, id);
            } else if (obj && typeof obj === "object") {
                res = findDataById(obj, id);
            }
            if (res) {
                return res;
            }
        }
        return null;
    }
    function findDataInArr(arr, id) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == id) {
                return arr[i];
            }
        }
        return null;
    }
    /**
	 * 获取网络状态
	 */
    owner.getNetStatus = function () {
        if (window.plus) {
            var ret = true;
            //获取当前网络类型
            var nt = plus.networkinfo.getCurrentType();
            switch (nt) {
                case plus.networkinfo.CONNECTION_ETHERNET:
                case plus.networkinfo.CONNECTION_WIFI:
                    ret = true;  //console.log("当前网络为WiFi");
                    break;
                case plus.networkinfo.CONNECTION_CELL2G:
                case plus.networkinfo.CONNECTION_CELL3G:
                case plus.networkinfo.CONNECTION_CELL4G:
                    ret = true;//console.log("当前网络非WiFi");
                    break;
                default:
                    ret = false;//console.log("当前没有网络");
                    break;
            }
            return ret;
        } else {
            return false;
        }
    }
    /*
	 * 退出登录
	 */
    owner.logout = function () {
        localStorage.removeItem('$loginstate');////console.log('退出')
        mui.plusReady(function () {
            plus.runtime.restart();
        })
    }
    owner.getItem = function (k) {
        var jsonStr = window.localStorage.getItem(k.toString());
        return jsonStr ? JSON.parse(jsonStr).data : null;
    }
    owner.setItem = function (k, value) {
        value = JSON.stringify({
            data: value
        });
        k = k.toString();
        localStorage.setItem(k, value);
    }
    //获取位置信息
    owner.getCurrentPosition = function (func) {
        //console.log('getCurrentPosition')
        plus.geolocation.getCurrentPosition(function (p) {
            //console.log(JSON.stringify(p));
            //alert(JSON.stringify(p))
            var txtAddress = (p.address.province || '') + (p.address.city || '') + (p.address.district || '') + (p.address.street || '') + (p.address.streetNum || '');//mui.toast('地址：' + txtAddress);
            //console.log('txtAddress:' + txtAddress)
            var latitude = p.coords.latitude; //纬度
            var longitude = p.coords.longitude; //经度
            if (func) {
                func(txtAddress, latitude, longitude);
            }
        }, function (e) {
            //alert('e.message:'+e.message)
            mui.toast('定位失败，请手动开启GPS');
            //console.log(e.message)
        });
    }
    //获取兄弟节点
    owner.siblings = function (elm) {
        var a = [];
        var p = elm.parentNode.children;
        for (var i = 0, pl = p.length; i < pl; i++) {
            if (p[i] !== elm) a.push(p[i]);
        }
        return a;
    }
    //获取字典集合
    owner.getDict = function (type, func) {
        mui.ajax(config.GetDict + type, {
            data: 'dicttype=' + type,
            success: function (data) {
                if (data && func) {
                    func(data);
                }
            }
        });
    }
    //字节转换为KB等大小
    owner.bytesToSize = function (bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024;
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        i = Math.floor(Math.log(bytes) / Math.log(k));
        var _size = (bytes / Math.pow(k, i));
        return _size.toFixed(2) + ' ' + sizes[i];
        //toPrecision(3) 后面保留一位小数，如1.0GB //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
    //初始化区域滚动
    owner.initScroll = function (options) {
        options = options || {};
        var deceleration = mui.os.ios ? 0.003 : 0.0009; //阻尼系数
        if (options.id == undefined) {
            var _mui_scroll_wrapper = document.querySelector('.mui-scroll-wrapper');
            if (_mui_scroll_wrapper == undefined || _mui_scroll_wrapper == null) {
                return;
            }
            var _h = _mui_scroll_wrapper.style.height;
            _mui_scroll_wrapper.style.height = options.h || (_h == 0 ? '200px' : _h);
            mui('.mui-scroll-wrapper').scroll({
                bounce: false,
                indicators: true, //是否显示滚动条
                deceleration: deceleration
            });
        } else {
            var _dom = document.querySelector("#" + options.id);
            var _h = _dom == undefined || _dom == null ? 0 : _dom.style.height;
            document.querySelector("#" + options.id).style.height = options.h || (_h == 0 ? '200px' : _h);
            mui("#" + options.id).scroll({
                bounce: false,
                indicators: true, //是否显示滚动条
                deceleration: deceleration
            });
        }
    }
    owner.defaultImg = function (imgId, defaultUrl, url) {
        if (url) {
            document.getElementById(imgId).src = url;
        } else {
            if (mui.os.plus) {
                var _url = url || "_doc/head.jpg";
                plus.io.resolveLocalFileSystemURL(_url, function (entry) {
                    var s = entry.fullPath + "?version=" + new Date().getTime();;
                    document.getElementById(imgId).src = s;
                }, function (e) {
                    document.getElementById(imgId).src = defaultUrl;
                })
            } else {
                document.getElementById(imgId).src = defaultUrl;
            }
        }
    }
    //初始化头像(图片id，默认图片地址，[图片存储地址])
    owner.initHeadImg = function (imgId, defaultUrl, url) {
        g.defaultImg(imgId, defaultUrl, url);
        //setTimeout(function() {
        //		g.defaultImg(imgId,defaultUrl,url);
        //	}, 500);
    }
    //图片预览
    owner.initImgPreview = function (name) {
        var imgs = document.querySelectorAll(name);
        imgs = mui.slice.call(imgs);
        if (imgs && imgs.length > 0) {
            var slider = document.createElement("div");
            slider.setAttribute("id", "__mui-imageview__");
            slider.classList.add("mui-slider");
            slider.classList.add("mui-fullscreen");
            slider.style.display = "none";
            slider.addEventListener("tap", function () {
                slider.style.display = "none";
            });
            slider.addEventListener("touchmove", function (event) {
                event.preventDefault();
            })
            var slider_group = document.createElement("div");
            slider_group.setAttribute("id", "__mui-imageview__group");
            slider_group.classList.add("mui-slider-group");
            imgs.forEach(function (value, index, array) {
                //给图片添加点击事件，触发预览显示；
                value.addEventListener('tap', function () {
                    slider.style.display = "block";
                    _slider.refresh();
                    _slider.gotoItem(index, 0);
                })
                var item = document.createElement("div");
                item.classList.add("mui-slider-item");
                var a = document.createElement("a");
                var img = document.createElement("img");
                img.setAttribute("src", value.src);
                a.appendChild(img)
                item.appendChild(a);
                slider_group.appendChild(item);
            });
            slider.appendChild(slider_group);
            document.body.appendChild(slider);
            var _slider = mui(slider).slider();
        }
    }
    //初始化下拉刷新
    owner.pullRefreshInit = function (jsonData) {
        var id = jsonData.id || '#pullrefresh';
        mui.init({
            pullRefresh: {
                container: id,
                down: { //下拉刷新
                    style: 'circle',
                    offset: '0px',
                    //auto: true,//可选,默认false.自动下拉刷新一次
                    callback: jsonData.pulldownRefresh
                },
                up: { //上拉加载
                    //auto:true,
                    //height: 100, //可选.默认50.触发上拉加载拖动距离
                    callback: jsonData.pullupRefresh
                }
            }
        });
    }
    //回到顶部
    owner.initGoTop = function () {
        //window.addEventListener("swipeup", function () {
        //    handleGoTop();
        //})
        //window.addEventListener('swipedown', function () {
        //    handleGoTop();
        //})
        window.onscroll = function () {
            // //console.log('scroll')
            var t = document.documentElement.scrollTop || document.body.scrollTop;
            if (t >= 300) {
                handleGoTop();
            }
        }
    }
    // Handles the go to top button at the footer
    function handleGoTop() {
        var offset = 300;
        var duration = 500;
        var el = document.querySelector('.scroll-to-top');
        var _h = getScrollTop();////console.log(_h)
        if (_h > offset) {
            fadeIn(el, duration);
        } else {
            fadeOut(el, duration);
        }
        if (_h == 0) {
            fadeOut(el, duration);
        }
        document.querySelector('.scroll-to-top').addEventListener('tap', function () {
            window.scroll(0, 0);
            fadeOut(el, duration);
        })
    };
    function fadeIn(el, time) {
        if (el.style.opacity === "") {
            el.style.opacity = 0;
        }
        if (el.style.display === "" || el.style.display === 'none') {
            el.style.display = 'block';
        }
        var t = setInterval(function () {
            if (el.style.opacity < 1) {
                el.style.opacity = parseFloat(el.style.opacity) + 0.01;
            } else {
                clearInterval(t);
            }
        }, time / 100);
    }
    function fadeOut(el, time) {
        if (el.style.opacity === "") {
            el.style.opacity = 1;
        }
        if (el.style.display === "" || el.style.display === 'none') {
            el.style.display = 'block';
        }
        var t = setInterval(function () {
            if (el.style.opacity > 0) {
                el.style.opacity = parseFloat(el.style.opacity) - 0.01;
            } else {
                clearInterval(t);
                el.style.display = 'none'
            }
        }, time / 100);
    }
    /**
	 * 获取滚动条距离顶端的距离
	 * @return {}支持IE6
	 */
    function getScrollTop() {
        var scrollPos;
        if (window.pageYOffset) {
            scrollPos = window.pageYOffset;
        } else if (document.compatMode && document.compatMode != 'BackCompat') {
            scrollPos = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollPos = document.body.scrollTop;
        }
        return scrollPos;
    }
    owner.stopCanvasFun = function (parentCanvasId) {
        //主界面容器 禁用手势侧滑
        var offCanvasInner = document.querySelector('.mui-inner-wrap');
        if (offCanvasInner) {
            offCanvasInner.addEventListener('drag', function (event) {
                event.stopPropagation();
            });
        }
        //实现ios平台的侧滑关闭页面；
        if (mui.os.plus && mui.os.ios) {
            var offCanvasWrapper = mui('#' + parentCanvasId); //侧滑容器父节点
            offCanvasWrapper[0].addEventListener('shown', function (e) { //菜单显示完成事件
                plus.webview.currentWebview().setStyle({
                    'popGesture': 'none'
                });
            });
            offCanvasWrapper[0].addEventListener('hidden', function (e) { //菜单关闭完成事件
                plus.webview.currentWebview().setStyle({
                    'popGesture': 'close'
                });
            });
        }
    }
    //初始化评分
    owner.initStar = function (id) {
        var starIndex = 4;
        //应用评分
        mui('.icons').on('tap', 'i', function () {
            var index = parseInt(this.getAttribute("data-index"));
            var parent = this.parentNode;
            var children = parent.children;
            if (this.classList.contains("mui-icon-star")) {
                for (var i = 0; i < index; i++) {
                    children[i].classList.remove('mui-icon-star');
                    children[i].classList.add('mui-icon-star-filled');
                }
            } else {
                for (var i = index; i < 5; i++) {
                    children[i].classList.add('mui-icon-star')
                    children[i].classList.remove('mui-icon-star-filled')
                }
            }
            starIndex = index;
            if (id != undefined && id != '') {
                ////console.log(starIndex);
                getStarTextById(id, index);
            }
        });
    }
    //初始化评分文本 old
    getStarTextById = function (id, index) {
        var _txt = '';
        switch (index) {
            case 1:
                _txt = '很不满意';
                break;
            case 2:
                _txt = '不满意';
                break;
            case 3:
                _txt = '一般';
                break;
            case 4:
                _txt = '满意';
                break;
            default:
                _txt = '非常满意';
                break;
        }
        document.getElementById(id).innerHTML = _txt;
    }
    //路径转行：反斜杠\转换成正斜杠/
    owner.getPathTransform = function (url) {
        if (url) {
            return url.replace(/\\/g, "/");
        }
    }
    //获取图片绝对路径
    owner.getImg = function (img) {
        console.log('img1:' + JSON.stringify(img))
        if (img) {
            if (img.fullLocalImgUrl != undefined && img.fullLocalImgUrl != '' && img.fullLocalImgUrl.indexOf("http") < 1) {
                return img.fullLocalImgUrl;
            }
            if (img.imgblog) {
                //console.log('img.imgblog:' + img.imgblog)
                return img.imgblog;
            }
            if(img.FILENAME){
            	if(img.FILENAME.indexOf('file:')>-1){
            		return img.FILENAME;
            	}
            }
            //	var src = config.apiDomain + img;
            //console.log('img:' + img);
            var _path = "";
            if (img.FILE_TRUEPATH) {
                _path = img.FILE_TRUEPATH.replace(/\\/g, "/")
            }
            var src = config.apiDomain + _path;
            //var src = config.apiDomain + '/' + img.split('\\')[3] + '/' + img.split('\\')[4] + '/' + img.split('\\')[5] + '/' + img.split('\\')[6] + '/' + img.split('\\')[7];
            console.log('图片:' + src);
            return src;
        } else {
            return '';
        }
    }
    owner.getImgByType = function (img, type) {
        if (img!=null&&img.indexOf('http') >-1) {
            return img;
        }
        if (img != null) {
            var apiIP = config.apiDomain;
            if (type == 'PC') {
                apiIP = config.pcDomain;
            }
            var src = apiIP + img.replace(/\\/g, "/");
            //console.log('图片显示：' + src);
            return src;
        }
    },
    //为空判断：是否为空
    owner.isEmpty = function (val) {
        if (val == undefined || val == null || val == '' || val.trim() == '') {
            return true;
        } else {
            return false;
        }
    }
    //为空时显示默认文本
    owner.emptyDefaultTxt = function (val) {
        if (val == undefined || val == null || val == '' || val.trim() == '' || val == 'null') {
            return '无';
        } else {
            return val;
        }
    }
    //跳转到上上页(父页，上上页）
    owner.goPrePrePage = function (pView, ppView, old_back, fuc) {
        //console.log('返回到上上页');
        if (fuc) {
            fuc();
        }
        if (old_back) {
            setTimeout(function () {
                old_back();
                //console.log('回退');
            }, 300);
            old_back();
        }
        if (pView) {
            pView.hide();
            //pView.close();
        }
        if (ppView) {
            //ppView.evalJS("getListAll()");//刷新列表
            //ppView.hide('none');
            //ppView.show('slide-in-rihgt');
        }
    }
    //获取登录用户信息实体
    owner.getUserInfo = function () {
        return g.getItem('$userinfo'); // || {};
    }
    /*-----------------------------状态相关的函数 start-----------------------------*/
    /**
    * 根据不同类型显示不同的时间文本
    * @param {Object} typeid
    */
    owner.getTimeText = function (typeid) {
        var txt = '';
        switch (typeid) {
            case TaskType.maintain.value:
                txt = '计划时间';
                break;
            case TaskType.polling.value:
                txt = '计划时间'
                break;
            default:
                txt = '报修时间';
                break;
        }
        return txt;
    }
    /**
	 * 获取工单状态
	 */
    owner.getOrderStatusPicker = function (typeid, tag) {
        var picker = new mui.PopPicker();
        var aVal = { value: 'A', text: '待接受' }; //巡检保养初始化状态
        var aInitVal = { value: 'A', text: g.getOrderInitStatusText() }; //维修初始化状态
        switch (typeid) {
            case TaskType.repair.value:
                if (tag == "action") {
                    picker.setData([{
                        value: null,
                        text: '全部'
                    }, aInitVal, WorkOrderStatus.waitSignin, WorkOrderStatus.waitOver, WorkOrderStatus.Revoke, WorkOrderStatus.Over]);
                } else if (tag == "manage") {
                    picker.setData([{
                        value: null,
                        text: '全部'
                    }, aInitVal, WorkOrderStatus.waitSignin, WorkOrderStatus.waitOver, WorkOrderStatus.Revoke, WorkOrderStatus.Over]);
                }
                else {
                    picker.setData([{
                        value: null,
                        text: '全部'
                    }, aInitVal, WorkOrderStatus.waitSignin, WorkOrderStatus.waitOver, WorkOrderStatus.waitAudit, WorkOrderStatus.Revoke, WorkOrderStatus.Over]);
                }
                break;
            default:
                break;
        }
        return picker;
    }
    //订单生成时的初始化状态名称
    owner.getOrderInitStatusText = function () {
        var txt = '';
        var roleType = g.AppRoleType;
        //console.log('roleType:' + roleType)
        switch (roleType) {
            case comm.repairman: //运维人员
            case comm.leader: //班组
                txt = '待抢单';
                break;
            case comm.customer:
                txt = '待接受';
                break;
            case comm.pm:
                txt = '待派工';
                break;
            default:
                txt = '待抢单';
                break;
        }
        ////console.log('角色ID:' + roleid)
        return txt;
    }
    /**
	 * 根据状态ID获取状态名称
	 * @param {string} id
	 */
    owner.getStatusNameById = function (id, isRepair) {
        var name = '';
        switch (id) {
            case WorkOrderStatus.waitOrder.value:
                name = g.getOrderInitStatusText(); // WorkOrderStatus.waitOrder.text;
                break;
            case WorkOrderStatus.waitSignin.value:
                name = WorkOrderStatus.waitSignin.text;
                break;
            case WorkOrderStatus.waitOver.value:
                name = WorkOrderStatus.waitOver.text;
                break;
            case WorkOrderStatus.waitAudit.value:
                name = WorkOrderStatus.waitAudit.text;
                break;
            case WorkOrderStatus.Over.value:
                name = WorkOrderStatus.Over.text;
                break;
            case WorkOrderStatus.Revoke.value:
                name = WorkOrderStatus.Revoke.text;
                break;

            default:
                name = '';
                break;
        }
        return name;
    }
    /**
	 * 根据状态ID获取状态颜色
	 * @param {Object} id
	 */
    owner.getStatusColorById = function (id, tag) {
        var _color = {};
        switch (id) {
            case WorkOrderStatus.waitOrder.value:
                    _color = tag == undefined ? {
                        red: true
                    } : {
                        'mui-badge-red': true
                    };
                break;
            case WorkOrderStatus.waitOver.value:
            case WorkOrderStatus.waitSignin.value:
            case WorkOrderStatus.waitAudit.value:
                _color = tag == undefined ? {
                    orange: true
                } : {
                    'mui-badge-orange': true
                };
                break;
            case WorkOrderStatus.Over.value:
            case WorkOrderStatus.Revoke.value:
                _color = tag == undefined ? {
                    gray: true
                } : {
                    'mui-badge-gray': true
                };
                break;
            default:
                _color = tag == undefined ? {
                    green: true
                } : {
                    'mui-badge-green': true
                };
                break;
        }
        ////console.log(JSON.stringify(_color))
        return _color;
    }
    /**
	 * 根据类型ID获取类型名称
	 * @param {Object} id
	 */
    owner.getTypeNameById = function (id) {
        var typeName = '';
        switch (id) {
            case TaskType.repair.value:
                typeName = TaskType.repair.name;
                break;
            case TaskType.polling.value:
                typeName = TaskType.polling.name;
                break;
            case TaskType.maintain.value:
                typeName = TaskType.maintain.name;
                break;
            default:
                break;
        }
        return typeName;
    }
    owner.AppRoleType = localStorage.getItem('$appRoleType');
    //获取考勤类型
    owner.getTimeCardTypeByVal = function (val) {
        var result = '';
        switch (val) {
            case TimeCardType.belate.value: //迟到
                result = TimeCardType.belate.name;
                break;
            case TimeCardType.leaveearly.value: //早退
                result = TimeCardType.leaveearly.name;
                break;
            default:
                break;
        }
        return result;
    }
    //获取考勤类型对应的背景颜色
    owner.getTimeCardTypeBcByVal = function (val) {
        var result = '';
        switch (val) {
            case TimeCardType.belate.value: //迟到
                result = 'mui-badge-warning';
                break;
            case TimeCardType.leaveearly.value: //早退
                result = 'mui-badge-red';
                break;
            default:
                break;
        }
        return result;
    }
    //获取危险tag
    owner.getRiskLevel = function (val, INPUT_TYPE, NEED_JUDGE) {
        if (INPUT_TYPE == 1 || NEED_JUDGE == 1) {
            return "不评估";
        }
        ////console.log(val)
        if (val == 0) {
            return '正常';
        } else if (val == 1) {
            return '低风险';
        } else if (val == 2) {
            return '中风险';
        } else if (val == 3) {
            return '高风险';
        } else {
            return '';
        }
    }
    //获取危险tag的颜色
    owner.getRiskLevelColor = function (val, INPUT_TYPE, NEED_JUDGE) {
        if (INPUT_TYPE == 1 || NEED_JUDGE == 1) {
            return "mui-badge-orange";
        }
        ////console.log(val)
        if (val == 0) { //正常
            return 'mui-badge-green';
        } else if (val == 1) { //低风险
            return 'mui-badge-orange';
        } else if (val == 2) { //'中风险
            return 'mui-badge-red';
        } else if (val == 3) { //高风险
            return 'mui-badge-red';
        }
        return '';
    }
    //根据扩展名获取样式
    owner.getClassByExt = function (suffix) {
        var _result = '';
        switch (suffix) {
            case 'pdf':
                _result = 'icon-pdf';
                break;
            case 'doc':
            case 'docx':
                _result = 'icon-word-copy';
                break;
            case 'xls':
            case 'xlsx':
                _result = 'icon-excel';
                break;
            default:
                _result = 'icon-tupian';
                break;
        }
        return _result;
    }
    //获取文件的扩展名
    owner.getFileSuffix = function (fileName) {
        var index1 = fileName.lastIndexOf(".");
        var index2 = fileName.length;
        var suffix =fileName.length>0? fileName.substring(index1 + 1, index2):'';//后缀名
        return suffix;
    }
    //添加操作日志
    /*-----------------------------状态相关的函数 end-------------------------------*/
    owner.addLog = function (BILL_NO, BUSINESS_TYPE, STATE, CREATE_USER_ID, RESULT, MESSAGE) {
        var v = JSON.stringify({
            BILL_NO: BILL_NO,
            BUSINESS_TYPE: BUSINESS_TYPE,
            STATE: STATE,
            CREATE_USER_ID: CREATE_USER_ID,
            RESULT: RESULT,
            MESSAGE: MESSAGE
        });
        g.ajax(config, {
            data: v,
            type: 'POST',
            nwaiting: nwaiting,
            success: function (data) {
                if (data.Data > 0) {
                    //console.log('操作日志写入成功');
                }
            }
        })
    }
    //获取列表条码数
    owner.getCount = function (menus, fun) {
        if (config.isMock) {
            //var _database = new smpWebSql();
            _database.counts('tb_repairbill_g', "where STATE<>'E'", function (res) {
                var data = {
                    "StatusCode": 200,
                    "Message": null,
                    "Data": {
                        "cCount": 0,
                        "mCount": 0,
                        "rCount": res,
                         allCount:0+0+res,
                        "cRob": false,
                        "mRob": false,
                        "rRob": true
                    }
                };
                if (data.StatusCode == '200' && data.Data) {
                    for (var i = 0; i < menus.length; i++) {
                        if (menus[i].name == TaskType.repair.value) {
                            menus[i].taskNum = data.Data.rCount;
                            menus[i].rad = data.Data.rRob;
                        } else
                            if (menus[i].name == TaskType.polling.value) {
                                menus[i].taskNum = data.Data.cCount;
                                menus[i].rad = data.Data.cRob;
                            } else
                                if (menus[i].name == TaskType.maintain.value) {
                                    menus[i].taskNum = data.Data.mCount;
                                    menus[i].rad = data.Data.mRob;
                                }
                    }
                    localStorage.setItem('$EXE_COUNT', JSON.stringify(data.Data));
                    if (fun != '') {
                        fun(data.Data.allCount);
                    }
                    return menus;
                } else {
                    mui.toast(data.Message);
                }
            });
        } else {
            g.ajax(config.BillWorkbench, {
                data: {
                    orgCode: config.ORG_CODE,
                    userId: config.USER_ID
                },
                success: function (data) {
                    if (data.StatusCode == '200' && data.Data) {
                        console.log('BillWorkbench:' + JSON.stringify(data))
                        for (var i = 0; i < menus.length; i++) {
                            if (menus[i].name == TaskType.repair.value) {
                                menus[i].taskNum = data.Data.rCount;
                                menus[i].rad = data.Data.rRob;
                            } else
                                if (menus[i].name == TaskType.polling.value) {
                                    menus[i].taskNum = data.Data.cCount;
                                    menus[i].rad = data.Data.cRob;
                                } else
                                    if (menus[i].name == TaskType.maintain.value) {
                                        menus[i].taskNum = data.Data.mCount;
                                        menus[i].rad = data.Data.mRob;
                                    }
                        }
                        localStorage.setItem('$EXE_COUNT', JSON.stringify(data.Data));
                        //console.log('getCount0:' + JSON.stringify(menus));
                        if (fun != '') {
                            fun(data.Data.allCount);
                        }
                        return menus;
                    } else {
                        mui.toast(data.Message);
                    }
                }, error: function () {
                    if (fun) {
                        fun();
                    }
                }
            })
        }
        /* //console.log('getCount:' + e);
     }
     //console.log('getCount1:' + JSON.stringify(menus));*/
        return menus;
    }
    //页面刷新
    owner.reFresh = function (wo, obj) {
        mui.plusReady(function () {
            var self = plus.webview.currentWebview();
            if (!wo) { wo = self.opener(); }
            var woOper = wo.opener();
            try {
                //console.log('wo:'+JSON.stringify(wo));
                var v = '{"STATE":"' + obj.STATE + '","isWating":"' + obj.isWating + '"}'
                //console.log('vm.reFresh(' + v + ')');
                wo.evalJS('vm.reFresh(' + v + ')'); //刷新列表
                console.log('woOper:' + woOper)
                if (woOper) {
                    woOper.evalJS("getListAll()");
                }
            } catch (e) {
                //console.log('reFresh:' + e);
            }
            plus.nativeUI.closeWaiting();
        });
    }
}(mui, window.g = window.g || {}));
/**
 * ------------------------------------------------菜单权限----------------------------------------
 */
var defaultInfo = '监控运行状态';
(function (m) {
    function getSmpMenus() {
        return g.getMenus() == '{}' ? {} : g.getMenus(); //GloabMenus
    }
    //获取一级菜单
    m.getFrstLevelMenus = function () {
        ////console.log('获取一级菜单')
        var smpMenus = getSmpMenus();
        //console.log(JSON.stringify(smpMenus[0]))
        if (smpMenus == undefined || smpMenus == null || smpMenus[0] == {}) {
            localStorage.removeItem('$loginstate');
            mui.openWindow({
                id: 'login',
                url: 'login.html'
            })
            return;
        }
        if (config.isTest) {
            var frstLevelMenus = [];
            var length = smpMenus.length;
            if (length > 0) {
                var _menu = null;
                for (var i = 0; i < length; i++) {
                    var temp = {};
                    _menu = smpMenus[i];
                    temp.id = _menu.id;
                    temp.icon = _menu.icon;
                    temp.title = _menu.title;
                    temp.url = _menu.url;
                    frstLevelMenus.push(temp);
                }
            }
            return frstLevelMenus;
        }
        var frstLevelMenus = [];
        ////console.log(JSON.stringify(smpMenus))
        var length = smpMenus.length;
        ////console.log('一级菜单长度:' + length)
        if (length > 0) {
            var _menu = {};
            for (var i = 0; i < length; i++) {
                _menu = smpMenus[i];
                ////console.log('LEVEL:' + _menu.LEVEL)
                if (_menu.LEVEL == 1) {
                    var temp = {};
                    temp.id = _menu.URIGHT_ID;
                    temp.icon = _menu.ICON;
                    temp.title = _menu.URIGHT_NAME;
                    temp.url = _menu.FUNC;
                    temp.name = _menu.MODULE_NAME;
                    frstLevelMenus.push(temp);
                }
            }
        }
        ////console.log('一级菜单：' + JSON.stringify(frstLevelMenus))
        return frstLevelMenus;
    };
    //获取二级菜单
    m.getTwoLevelMenus = function (id) {
        var smpMenus = getSmpMenus();
        if (config.isTest) {
            var twoLevelMenus = [];
            var length = smpMenus.length;
            if (length > 0) {
                var _menu = null;
                for (var i = 0; i < length; i++) {
                    _menu = smpMenus[i];
                    if (id == _menu.id) {
                        twoLevelMenus = _menu.children;
                        break;
                    }
                }
            }
            return twoLevelMenus;
        }
        var twoLevelMenus = [];
        var length = smpMenus.length;
        //console.log('length:' + length);
        //console.log(JSON.stringify(smpMenus[0]))
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                var _menu = smpMenus[i];
                if (id == _menu.PARENT_ID) {
                    var temp = {};
                    temp.id = _menu.URIGHT_ID;
                    temp.icon = _menu.ICON;
                    temp.title = _menu.URIGHT_NAME;
                    temp.url = _menu.FUNC;
                    temp.bgColor = _menu.BACKGROUND_COLOR;
                    temp.name = _menu.MODULE_NAME;
                    twoLevelMenus.push(temp);
                }
            }
        }
        return twoLevelMenus;
    }
}(window.smp_menu = {}));
/**
 * 工单状态
 */
var WorkOrderStatus = {
    waitOrder: {
        value: 'A',
        text: g.getOrderInitStatusText()
    },
    waitSignin: {
        value: 'B',
        text: '待签到'
    },
    waitOver: {
        value: 'C',
        text: '待完工'
    },
    waitAudit: {
        value: 'D',
        text: '待评价'
    },
    Revoke: {
        value: 'F',
        text: '已撤单'
    },
    Over: {
        value: 'E',
        text: '已结束'
    }
}
//风险值
var RiskLevel = {
    NORMAL: {
        value: '0',
        text: '正常'
    },
    LOW: {
        value: '1',
        text: '低风险'
    },
    MIDDLE: {
        value: '2',
        text: '中风险'
    },
    HIGH: {
        value: '3',
        text: '高风险'
    }
}
//风险评估:自动、人工、不评估
var RiskJudge = {
    Auto: {
        value: '0',
        text: '自动'
    },
    Man: {
        value: '1',
        text: '人工'
    },
    None: {
        value: '2',
        text: '不评估'
    }
}

// 输入类型：区间量、开关量、数值量、文本量
var InputType = {
    Range: {
        value: '0',
        text: '区间量'
    },
    Switch: {
        value: '1',
        text: '开关量'
    },
    Number: {
        value: '2',
        text: '数值量'
    },
    Text: {
        value: '3',
        text: '文本量 '
    }
}
//风险判定方法
var RiskJudeMethod = {
    Range: {
        value: '0',
        text: '区间 '
    },
    Biger: {
        value: '1',
        text: '越大越好'
    },
    Smaller: {
        value: '2',
        text: '越小越好'
    }
}

//工单类型
var BillType = {
    bj: {
        value: 'A',
        text: '报警'
    },
    xj: {
        value: 'C',
        text: '巡检'
    },
    by: {
        value: 'M',
        text: '保养'
    },
    wx: {
        value: 'R',
        text: '维修'
    }
}
// 执行人状态
var ExecuteUserStatus = {
    zd: {
        value: 'A',
        text: '主动抢单'
    },
    bd: {
        value: 'B',
        text: '被动接单'
    },
    yq: {
        value: 'C',
        text: '被邀请'
    }
}
//时间类型
var timeType = {
    month: {
        value: '0',
        text: '月'
    },
    season: {
        value: '1',
        text: '季'
    },
    year: {
        value: '2',
        text: '年'
    }
}
//考勤类型
var TimeCardType = {
    belate: {
        value: '1',
        name: '迟到'
    },
    leaveearly: {
        value: '2',
        name: '早退'
    }
}
//巡检保养周期
var MaintCycle = {
    byb: {
        value: 'A',
        name: '半月保'
    },
    yb: {
        value: 'B',
        name: '月保'
    },
    jb: {
        value: 'C',
        name: '季保'
    },
    nb: {
        value: 'D',
        name: '年保'
    },
    threenb: {
        value: 'E',
        name: '三年保'
    }
}
//保养保养周期
var CheckCycle = {
    A: {
        value: 'A',
        name: '分'
    },
    B: {
        value: 'B',
        name: '时'
    },
    C: {
        value: 'C',
        name: '天'
    },
    D: {
        value: 'D',
        name: '周'
    },
    E: {
        value: 'E',
        name: '月'
    },
    F: {
        value: 'F',
        name: '季'
    },
    G: {
        value: 'G',
        name: '年'
    }
}
//保修来源
var RepairSource = {
    tel: {
        value: 'A',
        name: '电话报修'
    },
    app: {
        value: 'B',
        name: 'APP报修'
    },
    pc: {
        value: 'C',
        name: 'PC报修'
    },
    wechat: {
        value: 'D',
        name: '微信公众号报修'
    }
}

/**
 * 监听消息推送-个推
 */
document.addEventListener('plusready', function () {
    plus.runtime.setBadgeNumber(0);
    plus.push.setAutoNotification(true);
    //监听推送消息接收
    plus.push.addEventListener('receive', function (msg) {
        try {
            //if (plus.os.name != "iOS") return;
            if (msg.payload && msg.payload.url) {
                mui.confirm(msg.content, msg.title, ['立即查看', '知道了'], function (e) {
                    if (e.index > 0) return;
                    redirect(msg.payload.url);
                });
            } else {
                mui.alert(msg.content, msg.title);
            }
        } catch (e) {
            plus.nativeUI.alert(e.message);
        }
    });
    //监听点击推送事件
    plus.push.addEventListener('click', function (msg) {
        try {
            if (plus.os.name == "iOS") {
                var data = eval('(' + msg.payload.payload + ')');
            } else {
                var data = eval('(' + msg.payload + ')');
            }
            pushCallback(data);
        } catch (e) {
            plus.nativeUI.alert(e.message);
        }
    });
});
//推送执行方法
function pushCallback(data) {
    try {
        alert(data.type);
        if (data.type == 'openWindow') {
            data.url && redirect(data.url);
        }
    } catch (e) {
        alert(e.message);
    }
}
function redirect(url) {
    window.location = url;
}
/**
 * -----------------------------------js扩展函数----------------------------------------------------
 */
//删除数据中指定项
Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}
//数据中是否包含指定元素
Array.prototype.contains = function (item) {
    for (i = 0; i < this.length; i++) {
        if (this[i] == item) {
            return true;
        }
    }
    return false;
};
//去除两边空格
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
//为空时默认显示值
String.prototype.emptyTxt = function () {
    return this || '无';
}
//声明----如果有此 contains 直接用最好
Array.prototype.contains = function (needle) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}