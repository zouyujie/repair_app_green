var btn = ["确定升级", "取消"];
//休眠方法
var ver;
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}
//获取app系统更新（是否手动点击获取更新）
function appUpdate(ismanual) {
    console.log('appUpdate');
    mui.plusReady(function () {
        plus.runtime.getProperty(plus.runtime.appid, function (inf) {
            ver = inf.version;
            console.log('ver:' + ver);
            var url = config.GetAppVersion;
            var client;
            var ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) {    //苹果手机            
                mui.ajax({
                    type: "get",
                    dataType: 'json',
                    url: "https://itunes.apple.com/lookup?id=1318127518",//获取当前上架APPStore版本信息
                    data: {
                        id: 1318127518 //APP唯一标识ID
                    },
                    contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                    success: function (data) {
                        console.log('data:' + JSON.stringify(data));
                        var resultCount = data.resultCount;
                        for (var i = 0; i < resultCount; i++) {
                            var normItem = data.results[i].version;
                            console.log('normItem:' + normItem)
                            if (normItem > ver) {
                                var _msg = "发现新版本:V" + normItem;
                                //plus.nativeUI.alert("发现新版本:V" + normItem);
                                mui.confirm(_msg, '升级确认', btn, function (e) {
                                    if (e.index == 0) { //执行升级操作
                                        document.location.href = 'https://itunes.apple.com/cn/app/san-gu-hui/id1318127518?mt=8'; //上新APPStore下载地址
                                    }
                                });
                                return;
                            } 
                        }
                        if (ismanual) {
                            mui.toast('当前版本号已是最新');
                        }
                        return;
                    }
                });
            } else if (/android/.test(ua)) {
                mui.ajax(url, {
                    data: {
                        apkVersion: ver,
                    },
                    dataType: 'json',
                    type: 'get',
                    timeout: 10000,
                    success: function (data) {
                    	//console.log('data:'+JSON.stringify(data))
                        if (data.StatusCode = 200 && data.Data > ver) {
                            //mui.toast("发现新版本:V" + data.Data);//获取远程数据库中上新andriod版本号 
                            var _msg="发现新版本:V" + data.Data;
                            mui.confirm(_msg, '升级确认', btn, function (e) {
                                if (e.index == 0) { //执行升级操作
                                    plus.nativeUI.toast("正在准备环境，请稍后！");
                                    var dtask = plus.downloader.createDownload(config.apkUrl, {}, function (d, status) {
                                        if (status == 200) {
                                            //sleep(1000);
                                            var path = d.filename;//下载apk
                                            plus.runtime.install(path); // 自动安装apk文件
                                        } else {
                                            plus.nativeUI.alert('版本更新失败:' + status);
                                        }
                                    });
                                    dtask.start();
                                }
                            });
                        } else {
                            console.log('当前版本号已是最新');
                            if (ismanual) {
                                mui.toast('当前版本号已是最新');
                            }
                            return;
                        }
                    },
                    error: function (xhr, type, errerThrown) {
                        if (ismanual) {
                            mui.toast('网络异常,请稍候再试');
                        }
                    }
                });
            }
        });
    });
}