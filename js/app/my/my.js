var smpImgArray = [];//选择的头像数组
//获取头像
function InitHeaderPic() {
    if (config.isMock) {
        _database.read('tb_myheader_g', "where userId='" + config.USER_ID + "'", function (res) {
            console.log('res[0].FILE_PATH:' + res[0].pathCode);
           var data= {
                    "StatusCode": 200,
                    "Message": null,
                    "Data": {
                        "source": "APP",
                        "headerPic": {
                            "FILE_PATH": res[0].pathCode,
                        }
                    }
                }
            if (data.StatusCode == '200') {
                if (data.Data.headerPic) {
                    var _path = data.Data.headerPic.FILE_PATH;
                    var _source = data.Data.source;
                    var _url = config.isMock?_path: g.getImgByType(_path, _source);
                    if (_url) {
                        document.getElementById("head-img").src = _url;
                    } else {
                        document.getElementById("head-img").src = defaultUrl;
                    }
                } else {
                    mui.plusReady(function () {
                        g.initHeadImg("head-img", defaultUrl);
                    });
                }
            } else {
                mui.toast(data.Message);
            }
        });
    } else {
        g.ajax(config.GetUserHeaderPic, {
            data: {
                userId: config.USER_ID
            },
            success: function (data) {
                console.log('获取头像data:' + JSON.stringify(data))
                if (data.StatusCode == '200') {
                    if (data.Data.headerPic) {
                        var _path = data.Data.headerPic.FILE_PATH;
                        var _source = data.Data.source;
                        var _url = '';
                        _url = g.getImgByType(_path, _source);
                        if (_url) {
                            document.getElementById("head-img").src = _url;
                        } else {
                            document.getElementById("head-img").src = defaultUrl;
                        }
                    } else {
                        mui.plusReady(function () {
                            g.initHeadImg("head-img", defaultUrl);
                        });
                    }
                } else {
                    mui.toast(data.Message);
                }
            },
            error: function () {
                mui.plusReady(function () {
                    g.initHeadImg("head-img", defaultUrl);
                });
            }
        });
    }
}
//设置头像efc5dc7e-e977-4700-a89f-0c17a886ff40
function SetHeaderPic(pathCode) {
    g.ajax(config.SetUserHeaderPic, {
        data: {
            userId: config.USER_ID,
            pathCode: pathCode
        },
        success: function (data) {
            console.log('设置头像data:' + JSON.stringify(data))
            if (data.StatusCode == '200') {
                if (data.Data==1) {
                    mui.toast('头像更新成功');
                    plus.nativeUI.closeWaiting();
                }
            } else {
                mui.toast(data.Message);
            }
        }, error: function () {
            plus.nativeUI.closeWaiting();
        }
    });
}
/**
 * 3.压缩图片 
 * @param {string} url：图片绝对路径
 * @param {string} filename：图片名称
 * @param {string} divid：图片容器id
 */
function compressImage(url, filename) {
    console.log(url); //file:///storage/emulated/0/Pictures/Screenshots/S70915-001739.jpg
    var path = "_doc/upload/" + filename; //_doc/upload/F_SMP-1467602809090.jpg  
    plus.zip.compressImage({
        src: url, //src: (String 类型 )压缩转换原始图片的路径  
        dst: path, //压缩转换目标图片的路径  
        quality: 20, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100  
        overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件  
    },
		function (event) {
		    //event.target获取压缩转换后的图片url路  
		    saveimage(event.target, filename, path);
		},
		function (error) {
		    plus.nativeUI.toast("压缩图片失败，请稍候再试");
		});
}
//4.保存信息到本地
/**  
 * @param {string} url  图片的地址  
 * @param {string} divid  字段的名称  
 * @param {string} name   图片的名称  
 * @param {string} path  压缩转换目标图片的路径  
 */
function saveimage(url, name, path) {
    //alert(url);//file:///storage/emulated/0/Android/data/io.dcloud...../doc/upload/F_SMP-1467602809090.jpg  
    smpImgArray.push(path);
    console.log('path:' + path); //_doc/upload/F_SMP-1467602809090.jpg  
    if (config.isMock) {
        SetHeaderPic(url);
    } else {
        uploadimgeFun(config.uploadImgUrl);
    }
}
var fun = function (d) {
    if (d == null || d == '' || JSON.parse(d).Data.length < 1) {
        mui.toast('请上传图片');
        return;
    }
    var FILE_PATH = JSON.parse(d).Data[0].code;
    SetHeaderPic(FILE_PATH);
}
//上传图片
function uploadimgeFun(url) {
    console.log('开始' + url);
    console.log(smpImgArray.length);
    //if(smpImgArray.length <= 0) {
    console.log(smpImgArray.length);
    if (smpImgArray.length == 0) {
        fun(null);
        return false;
    }
    nwaiting=plus.nativeUI.showWaiting();
    var task = plus.uploader.createUpload(url, {
        method: "POST"
    },
		function (t, status) {
		    if (status == 200) {
		        console.log('上传成功');
		        fun(t.responseText);
		    } else {
		        console.log('上传失败');
		    }
		    //plus.nativeUI.closeWaiting();
		}
	);
    for (var i = 0; i < smpImgArray.length; i++) {
        var itemkey = smpImgArray[i];
        console.log(itemkey);
        task.addFile(itemkey, {
            key: itemkey
        });
    }
    task.start();
    return true;
}