/**
 * 批量选择上传图片 created by zouqj 2017-9-22
 */
var smpImgArray = []; //图片列表--压缩后的
var showDetaiFun = undefined; //选择图片后回调函数
var smpCurUrl = ''; //图片的地址  
var sltImgCount=0;//当前选中的图片数
var callBackFun = undefined;//显示图片后回调函数

var localImgUrl = '';//压缩后本地相对路径
var fullLocalImgUrl = '';//压缩后本地全路径

/**
 * 1.选取图片的来源，拍照和相册
 * @param {Object} conf:（图片对象）{id:string,multiple:Boolean,imgCount:int}
 */
function showActionSheet(conf) {
	console.log('showActionSheet')
	var divid = conf.id;
	conf.imgCount=conf.imgCount||5;//默认限制最多上传5张图片
	showDetaiFun = conf.showDetaiFun;
	callBackFun=conf.callBackFun||undefined;
     if(conf.type == 'paizhao') {
		getImage(divid,conf);
	} else {
		var actionbuttons = [{
			title: "拍照"
		}, {
			title: "相册选取"
		}];
		var actionstyle = {
			title: "选择照片",
			cancel: "取消",
			buttons: actionbuttons
		};
		plus.nativeUI.actionSheet(actionstyle, function(e) {
			if(e.index == 1) {
				getImage(divid,conf);
			} else if(e.index == 2) {
				galleryImg(divid, conf);
			}
		});
	}
}
/**
 * 2. 从相册获取
 * @param {string} divid:（图片id）
 * @param {string} multiple：是否多选
 * @param {int} 限制上传图片数
 */
function galleryImg(divid,conf) {
	console.log('multiple:' + conf.multiple)
	if(conf.multiple == undefined || conf.multiple == false) { //单选
		plus.gallery.pick(function(p) {
			plus.io.resolveLocalFileSystemURL(p, function(entry) {
				compressImage(entry.toLocalURL(), entry.name, divid);
				sltImgCount=1;
				if(callBackFun!=undefined){
				  callBackFun('sltImgEl',sltImgCount);
				}
			}, function(e) {
				plus.nativeUI.toast("读取相册文件错误：" + e.message);
			});
		}, function(e) {
			console.log("取消选择图片");
		}, {
			multiple: false,
			filename: "_doc/camera/",
			filter: "image"
		});
	} else {
		plus.gallery.pick(function(p) {
			var zm = 0;
			sltImgCount += p.files.length; console.log(p.files.length);
			if (sltImgCount > conf.imgCount) {
			    mui.toast('最多只能选择' + conf.imgCount + '张图片');
			    sltImgCount -= p.files.length;
			    return;
			}
			setTimeout(file, 200);
            if(callBackFun!=undefined){
            callBackFun('sltImgEl',sltImgCount);}
			function file() {
				plus.io.resolveLocalFileSystemURL(p.files[zm], function(entry) {
					compressImage(entry.toLocalURL(), entry.name, divid);
				}, function(e) {
					plus.nativeUI.toast("读取相册文件错误：" + e.message);
				});
				zm++;
				if(zm < p.files.length) {
					setTimeout(file, 200);
				}
			}
		}, function(e) {
			console.log("取消选择图片");
		}, {
			filename: "_doc/camera/",
			filter: "image",
			multiple: true,
			maximum: conf.imgCount,
			system: false,
			onmaxed: function () {
			    mui.toast('最多只能选择' + conf.imgCount + '张图片');
				//plus.nativeUI.alert('最多只能选择'+conf.imgCount+'张图片');
			}
		});
	}
}
/**
 * 拍照  （图片id）
 * @param {string} divid:（图片id）
 */
function getImage(divid,conf) {
	var cmr = plus.camera.getCamera();
	if(sltImgCount>=conf.imgCount){
		mui.toast('最多只能选择'+conf.imgCount+'张图片');
		return;
	}
	cmr.captureImage(function(p) {
		//alert(p);//_doc/camera/1467602809090.jpg  
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			//alert(entry.toLocalURL());//file:///storage/emulated/0/Android/data/io.dcloud...../doc/camera/1467602809090.jpg  
			//alert(entry.name);//1467602809090.jpg  
			compressImage(entry.toLocalURL(), entry.name, divid);
			sltImgCount+=1;
			 if(callBackFun!=undefined){
			 	callBackFun('sltImgEl',sltImgCount);
			 }
		}, function(e) {
			plus.nativeUI.toast("读取拍照文件错误：" + e.message);
		});
	}, function(e) {}, {
		filename: "_doc/camera/",
		index: 1
	});
}
/**
 * 3.压缩图片 
 * @param {string} url：图片绝对路径
 * @param {string} filename：图片名称
 * @param {string} divid：图片容器id
 */
function compressImage(url, filename, divid) {
	console.log(url); //file:///storage/emulated/0/Pictures/Screenshots/S70915-001739.jpg
	var path = "_doc/upload/" + divid + "-" + g.getCurrentTimeFormat() + filename; //_doc/upload/F_SMP-1467602809090.jpg  
	plus.zip.compressImage({
			src: url, //src: (String 类型 )压缩转换原始图片的路径  
			dst: path, //压缩转换目标图片的路径  
			quality: 20, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100  
			overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件  
		},
		function (event) {
		    //检查图片是否已存在
		    plus.io.resolveLocalFileSystemURL(path, function (entry) {
		        var compress_path = entry.toLocalURL(); // 输入图片的路径,将相对路径转换为绝对路径
		        fullLocalImgUrl = compress_path;
		        localImgUrl = path;
		        console.log('compress_path:' + compress_path);
		        //event.target获取压缩转换后的图片url路  
		        saveimage(event.target, divid, filename, compress_path);
		        // 其他逻辑	       
		    }, function (e) {
		        // 本地保存失败逻辑		        
		    });
		},
		function(error) {
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
function saveimage(url, divid, name, path) {
	//alert(url);//file:///storage/emulated/0/Android/data/io.dcloud...../doc/upload/F_SMP-1467602809090.jpg  
	plus.nativeUI.showWaiting();
	smpImgArray.push(path);
	console.log('path:' + path); //_doc/upload/F_SMP-1467602809090.jpg  
	if(showDetaiFun == undefined) {
		showImgDetail(name, divid, url, path);
	} else {
		smpCurUrl = url;
		showDetaiFun(name, divid, url, path);
	}
	plus.nativeUI.closeWaiting()
}
/**
 * 5.加载页面初始化需要加载的图片信息
 * @param {string} name 图片名称：1467602809090.jpg 
 * @param {string} divid 字段例如：F_SMP 
 * @param {string} url "file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/.HBuilder/apps/HBuilder/doc/upload/F_SMP-1467602809090.jpg"  
 * @param {string} path :_doc/upload/F_SMP-1467602809090.jpg 
 */
function showImgDetail(name, divid, url, path) {
	name = name.substring(0, name.indexOf(".")); //1467602809090
	var html = "";
	html += '<div  id="Img' + name + divid + '" class="image-item">';
	html += '    <img id="picBig" data-preview-src="" data-preview-group="1" src="' + url + '"/>';
	html += '    <span class="del" onclick="delImg(\'' + name + '\',\'' + divid + '\',\'' + path + '\');">';
	html += '        <div class="mui-icon mui-icon-close"></div>';
	html += '    </span>';
	html += '</div>';
	//console.log("#"+divid+"S")//#F_SMPS
	//console.log(html);
	document.getElementById(divid + "S").innerHTML += html;
	//console.log(document.getElementById(divid + "S").innerHTML)
}
/**
 * 删除图片
 * @param {string} name:图片名称：20160704_112614  
 * @param {string} divid:字段，例如F_SMP  
 * @param {string} path :_doc/upload/F_SMP-1467602809090.jpg 
 */
function delImg(name, divid, path) {
    var bts = ["是", "否"];
    var _ret = false;
    plus.nativeUI.confirm("是否删除图片？", function(e) {
		console.log(e.index)
		if(e.index == 0) {
			delImgFromLocal(name, divid, path);
			if(callBackFun!=undefined){
			    callBackFun('sltImgEl', sltImgCount);
			}
			_ret = true;
		}
	}, "删除确认", bts);
	return _ret;
}

function delImgFromLocal(name, divid, path) {
	plus.nativeUI.showWaiting();
	//myAlert("删除成功");  
	//h("#Img" + name + divid).remove();
	var thisNode = document.getElementById("Img" + name + divid);
	thisNode.remove();
	//从集合中删除
	removeImgItem(path);
	console.log('删除后数组：' + smpImgArray.length);
	for(var i = 0; i < smpImgArray.length; i++) {
		console.log(smpImgArray[i]);
	}
	plus.nativeUI.closeWaiting();
	sltImgCount-=1;
	if(callBackFun!=undefined){
	callBackFun('sltImgEl',sltImgCount);
	}
}

function removeImgItem(name) {
	for(var i = 0; i < smpImgArray.length; i++) {
		if(smpImgArray[i] == name) {
			smpImgArray.splice(i, 1)
			break;
		}
	}
}
// 产生一个随机数
function getUid() {
    return Math.floor(Math.random() * 100000000).toString();
}
//上传图片
function uploadimge(url, userId, fun) {	
	//if(smpImgArray.length <= 0) {
	console.log(smpImgArray.length);
	if (smpImgArray.length == 0) {
	    fun(null);
	    return false;
	}
	var nwaiting=plus.nativeUI.showWaiting();
	var task = plus.uploader.createUpload(url, {
			method: "POST"
		},
		function(t, status) {
			if(status == 200) {
				console.log('上传成功:'+JSON.stringify(t));
				fun(t.responseText);				 
			} else {
				console.log('上传失败');
			}
			//plus.nativeUI.closeWaiting();
		}
	);

	task.addData("USERID", userId);
	for(var i = 0; i < smpImgArray.length; i++) {
		var itemkey = smpImgArray[i];
		console.log(itemkey);
		task.addFile(itemkey, {
			key: itemkey
		});
	}
	task.start();	
	return true;
}
function bindAndroidScroll() { // that 输入框  
    if (mui.os.android) {
        console.log('02');
        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
            window.setTimeout(function () {
                console.log('03');
                document.activeElement.scrollIntoView(true);
            }, 300);
        }
    }
}