var smpSigninImgArray = []; //图片列表--压缩后的
//var smpOverImgArray = [];//完工图片数组
function clearDb(_database, func) {
    _database.delTable(smp_tb.repair_tb, function () {
        console.log("数据表repair_tb删除成功");
    });
    _database.delTable(smp_tb.img_tb, function () {
        console.log("数据表img_tb删除成功");
    });
    _database.delTable(smp_tb.signin_tb, function () {
        console.log("数据表signin_tb删除成功");
    });
    _database.delTable(smp_tb.over_tb, function () {
        console.log("数据表over_tb删除成功");
        if (func) {
            //_database.remove(smp_tb.repair_tb);
            //_database.remove(smp_tb.img_tb);
            //_database.remove(smp_tb.signin_tb);
            //_database.remove(smp_tb.over_tb);
            func();
        }
    })
}
//0.开始离线下载
function startDownLoad(typeid) {
    switch (typeid) {
        case TaskType.repair.value:
            startDownLoadRepair();
            break;
        case TaskType.polling.value:
            startDownLoadPolling();
            break;
        case TaskType.maintain.value:
            startDownLoadMaintain();
            break;
        default:
            startDownLoadRepair();
            break;
    }
}
//下载确认
function confirmDownLoad(title,func) {
    mui.confirm('有未上传的'+title+'工单，下载将会进行覆盖，确认继续下载吗？', '下载确认', ['取消', '确定'], function (e) {
        console.log('e.index:' + e.index)
        if (e.index == 1) {
            if (func) {
                func();
            }
        } 
    });
}
//1.维修离线下载
function startDownLoadRepair() {
   // var repairMsg = "有未上传的维修工单，要先上传才能重新下载";
    var result = true;
        _database.counts(smp_tb.signin_tb, "", function (res) {
            result = res > 0 ? false : result;
            console.log(3)
            _database.counts(smp_tb.over_tb, "", function (res) {
                result = res > 0 ? false : result;
                console.log(4 + "," + result)
                if (result == false) {
                    confirmDownLoad('维修',offlineDownLoad);
                    //return;
                } else {
                    offlineDownLoad();
                }
            });
        });
}
//2.离线下载
function offlineDownLoad() {
    var _msg = "维修工单正在开始离线下载，这可能需要几分钟时间，请稍后...";
    mui.toast(_msg);
    g.showWaiting("下载中...");
    if (config.isMock) {      
        _database.read('tb_repairbill_g', "where STATE='C' or STATE='B'", function (res) {
            console.log("res：" + JSON.stringify(res));//成功
            let data = {
                "StatusCode": 200,
                "Message": null,
                "Data": res
            };
            clearDb(_database, function () {
                if (data != null && data.Data != null) {
                    var _list = data.Data;
                    //console.log("_list:" + JSON.stringify(_list));
                    _database.add(smp_tb.repair_tb, _list, function (res1) {
                        console.log("工单：" + res1);//成功
                    });
                    //mui.toast("开始存储工单图片")
                    for (var i = 0; i < _list.length; i++) {
                        (function (i) {
                            app.loadImg(_list[i].NO, _list[i].SOURCE, BillType.wx.value);
                        })(i);
                    }
                    app.loadGetFaultType(_list.length);
                }
            });
        });
    } else {
        //工单信息同步
        g.ajax(config.GetRepairBillHistroyPageToOffline, {//'00006'|| 
            data: { "orgCode": config.ORG_CODE, "userId": config.USER_ID, "state": null, "deptCode": null, "reportTime_BT": g.operationDate(-365), "reportTime_ET": g.operationDate(+1), "start": 0, "pageSize": 20 },
            type: 'POST',
            isShowing: true,
            async: false, //同步请求
            success: function (data) {
                //console.log("data.Data.lstData:" + JSON.stringify(data.Data.lstData));
                clearDb(_database, function () {
                    if (data != null && data.Data != null && data.Data.lstData != null) {
                        var _list = data.Data.lstData;
                        //console.log("_list:" + JSON.stringify(_list));
                        _database.add(smp_tb.repair_tb, _list, function (res) {
                            console.log("工单：" + res);//成功
                        });
                        //mui.toast("开始存储工单图片")
                        for (var i = 0; i < _list.length; i++) {
                            (function (i) {
                                app.loadImg(_list[i].NO, _list[i].SOURCE, BillType.wx.value);
                            })(i);
                        }
                        app.loadGetFaultType(_list.length);
                    }
                });
            }
        });
    }
}
/******************************************上传签到操作start*****************************************************/
var errorNums = 0;//异常工单数
var smp_signinNums = 0;//需要上报的签到工单数
var uploadSigninNums = 0;//已上报的签到工单数
var smp_overNums = 0;//需要上传的总的完工单数
var uploadOverNums = 0;//已经上传的完工单数

function initNums() {
    errorNums = 0;
    smp_signinNums = 0;
    uploadSigninNums = 0;
    uploadOverNums = 0;
    smp_overNums = 0;
}
//0.上传工单
function startUpload(typeid) {
    switch (typeid) {
        case TaskType.repair.value:
            getSigninOrderNo();
            break;
        case TaskType.polling.value:
            getPollingSigninOrderNo();
            break;
        case TaskType.maintain.value:
            getMaintainSigninOrderNo();
            break;
        default:
            getSigninOrderNo();
            break;
    }
}
//1.获取需要上传的签到工单
function getSigninOrderNo() {
    initNums();
    _database.read(smp_tb.signin_tb, 'ORDER BY NO DESC', function (res) {
        //console.log('res:' + JSON.stringify(res))
        smp_signinNums = res.length;
        if (res != [] && res.length > 0) {
            mui.toast("开始进行维修工单上传,共" + res.length + "条签到记录")
            for (var i = 0; i < res.length; i++) {
                (function (i) {
                    if (!g.isEmpty(res[i].NO)) {
                        console.log('签到no:' + res[i].NO)
                        uploadSigninOrder(res[i]);
                    }
                })(i);
            }
        }
        else {
            getOverOrderNo();
            mui.toast("没有需要上传的维修签到记录");
        }
    });
}
//2.获取要上传的签到图片 smp_tb.img_tb
function uploadSigninOrder(signin_tb) {
    console.log('signin_tb:' + signin_tb.NO)
    if (app.typeid == TaskType.repair.value) {//维修没有签到图片
        addSigninDataOffline(config.SignRepair, signin_tb);
    } else {
        _database.read(smp_tb.img_tb, "where NO='" + signin_tb.NO + "' and SUB_TYPE='B' and BUSINESS_TYPE='R'", function (res) {
            console.log('res:' + JSON.stringify(res))
            smpSigninImgArray = [];
            if (res != [] && res.length > 0) {
                console.log('签到BILL_NO:' + signin_tb.NO);
                var _signin = 0;
                for (var i = 0; i < res.length; i++) {
                    (function (i) {
                        var _path = res[i].fullLocalImgUrl;
                        if (_path != "") {
                            smpSigninImgArray.push(_path);
                        }
                        _signin++;
                        if (_signin == res.length) {
                            if (smpSigninImgArray.length == 0) {
                                console.log("工单：" + signin_tb.NO + "没有签到图片")
                                //mui.toast("维修工单：" + signin_tb.NO + "没有签到图片");
                                setTimeout(g.closeWaiting(), 5000);
                                delSigninData(signin_tb.NO);
                            }
                            console.log('smpSigninImgArray:' + JSON.stringify(smpSigninImgArray))
                            //return;
                            uploadimgeOffline(config.uploadImgUrl, config.USER_ID, signinFunOffline, signin_tb);
                        }
                    })(i);
                }
            }
        });
    } 
}
//3.上传图片
function uploadimgeOffline(url, userId, fun, obj) {
    console.log(smpSigninImgArray.length);
    //if(smpSigninImgArray.length <= 0) {
    if (smpSigninImgArray.length == 0) {
        fun(null,obj);
        return false;
    }
    //var nwaiting = plus.nativeUI.showWaiting();
    var task = plus.uploader.createUpload(url, {
        method: "POST"
    },
		function (t, status) {
		    if (status == 200) {
		        console.log('上传成功:' + JSON.stringify(t));
		        fun(t.responseText, obj);
		        //delSigninData(obj.NO);
		    } else {
		        console.log('上传失败');
		        fun(null, obj);
		    }
		    //plus.nativeUI.closeWaiting();
		}
	);
    task.addData("USERID", userId);
    for (var i = 0; i < smpSigninImgArray.length; i++) {
        var itemkey = smpSigninImgArray[i];
        console.log(itemkey);
        task.addFile(itemkey, {
            key: itemkey
        });
    }
    task.start();
    return true;
}
//4.图片上传成功、回调添加数据
var signinFunOffline = function (d, signin_tb) {
    if (d) {
        console.log('d:' + JSON.stringify(d));
    }
    if (d == null || d == '' || JSON.parse(d).Data.length < 1) {
        return;
    }
    var v_f = {
        BILL_NO: signin_tb.NO,
        BUSINESS_TYPE: BillType.wx.value,
        SUB_TYPE: WorkOrderStatus.waitSignin.value,
        FILENAME: JSON.parse(d).Data[0].Name,
        FILE_PATH: JSON.parse(d).Data[0].code,
        CREATE_USER_ID: config.USER_ID
    };
    console.log('v_f:' + JSON.stringify(v_f));
    g.ajax(config.AddBillFile, {
        data: v_f,
        async: false, //同步请求
        isShowing: true,
        success: function (data) {
            if (data && data.Data != '1') {
                console.log('签到文件上传失败');
            } else if (data && data.Data != 0) {
                console.log('签到文件上传成功');
                console.log('v_d:' + JSON.stringify(signin_tb));
                addSigninDataOffline(config.SignRepair, signin_tb);
            }
        }, error: function () {
            errorNums++;
            addSigninDataOffline(config.SignRepair, signin_tb);
        }
    });
}
//5.添加维修签到
function addSigninDataOffline(api, signin_tb) {
    g.ajax(api, {
        data: signin_tb,
        async: false, //同步请求
        isShowing: true,
        success: function (data) {
            if (data.Data == 1) {
                console.log('维修签到,操作成功');
                uploadSigninNums++;
                delSigninData(signin_tb.NO);
                if (uploadSigninNums == smp_signinNums) {
                    mui.toast("维修签到工单上传成功！共" + smp_signinNums + "条记录。");
                    setTimeout(getOverOrderNo(), 2000 + smp_signinNums * 500);
                    //if (uploadSigninNums == smp_signinNums) {
                    //    getOverOrderNo()
                    //}
                }
            }
        }, error: function () {
            uploadSigninNums++;
            errorNums++;
            delSigninData(signin_tb.NO);
        }
    });
}
//6.删除已上报的签到工单数据
function delSigninData(no) {
    //_database.remove(smp_tb.img_tb, "where NO='" + no + "' and SUB_TYPE='B' and BUSINESS_TYPE='R'");
    _database.remove(smp_tb.signin_tb, "where NO='" + no + "'");
    closeWatingNow();
}
/******************************************上传签到操作end*****************************************************/
/******************************************上传完工操作start*****************************************************/
//1.获取需要上传的完工工单over_tb
function getOverOrderNo() {
    _database.read(smp_tb.over_tb, 'ORDER BY NO DESC', function (res) {
        console.log('res:' + JSON.stringify(res))
        if (res != [] && res.length > 0) {
            mui.toast("开始上传维修完工记录，共" + res.length + "条完工记录需要上传");
            smp_overNums = res.length;
            for (var i = 0; i < res.length; i++) {
                (function (i) {
                    setTimeout(function () {
                        if (!g.isEmpty(res[i].NO)) {
                            uploadOverOrder(res[i])
                        }
                    }, 500)
                })(i);
            }
        } else {
            g.closeWaiting();
            mui.toast("没有要上传的维修完工记录")
        }
    });
}
//2.获取要上传的完工图片 smp_tb.img_tb
function uploadOverOrder(over_tb) {
    console.log('over_tb:' + JSON.stringify(over_tb))
    _database.read(smp_tb.img_tb, "where NO='" + over_tb.NO + "' and SUB_TYPE='C' and BUSINESS_TYPE='R'", function (res) {
        console.log('res:' + JSON.stringify(res))
        var smpOverImgArray = [];
        if (res != [] && res.length > 0) {
            console.log('完工图片BILL_NO:' + over_tb.NO)
            for (var i = 0; i < res.length; i++) {
                var _path = res[i].fullLocalImgUrl;
                if (_path != "") {
                    smpOverImgArray.push(_path);
                }
                if (smpOverImgArray.length == 0) {
                    break;
                }
            }
            console.log('smpOverImgArray:' + JSON.stringify(smpOverImgArray))
            //return;
            if (config.isMock) {
                var strRes = "";
                for (var i = 0; i < smpOverImgArray.length; i++) {
                    var itemkey = smpOverImgArray[i];
                    console.log(itemkey);//file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/upload/F_SMP-20181012133808632P81008-122534.jpg
                    strRes += '{ "Name": "' + itemkey + '","code": "' + itemkey + '" }';
                }
                overFunOffline('{ "StatusCode": 200, "Message": "上传成功", "Data": [' + strRes + '] }', over_tb);
            } else {
                uploadOverImgeOffline(config.uploadImgUrl, config.USER_ID, overFunOffline, over_tb, smpOverImgArray);
            }
        }
    });
}
//3.上传图片
function uploadOverImgeOffline(url, userId, fun, over_tb, smpOverImgArray) {
    console.log(smpOverImgArray.length);
    if (smpOverImgArray.length == 0) {
        fun(null, over_tb);
        return false;
    }
    console.log('url:' + url);
    //var nwaiting = plus.nativeUI.showWaiting();
    var task = plus.uploader.createUpload(url, {
        method: "POST"
    },
		function (t, status) {
		    if (status == 200) {
		        //console.log('上传成功:' + JSON.stringify(t));
		        fun(t.responseText, over_tb);
		    } else {
		        console.log('上传失败');
		        fun(null, over_tb);
		    }
		    //plus.nativeUI.closeWaiting();
		}
	);
    task.addData("USERID", userId);
    for (var i = 0; i < smpOverImgArray.length; i++) {
        var itemkey = smpOverImgArray[i];
        //console.log('itemkey:'+itemkey);
        task.addFile(itemkey, {
            key: itemkey
        });
    }
    task.start();
    return true;
}
//4.完工图片上传成功、回调添加数据
var overFunOffline = function (d, over_tb) {
    if (d) {
        console.log('d:' + JSON.stringify(d));
    }
    if (d == null || d == '' || JSON.parse(d).Data.length < 1) {
        console.log('请重新上传完工图片');
        addOverDataOffline(over_tb);
        return;
    }
    var FILENAMES = '',
        FILE_PATHS = '',
        v = {};

    for (var i = 0; i < JSON.parse(d).Data.length; i++) {
        console.log(JSON.parse(d).Data[i].code);
        FILENAMES += JSON.parse(d).Data[i].Name;
        FILE_PATHS += JSON.parse(d).Data[i].code;
        var j = i + 1;
        if (j < JSON.parse(d).Data.length) {
            FILENAMES += ',';
            FILE_PATHS += ',';
        }
    }
    console.log('FILENAMES:' + FILENAMES);
    console.log('FILE_PATHS:' + FILE_PATHS);
    v = {
        BUSINESS_TYPE: BillType.wx.value,
        SUB_TYPE: WorkOrderStatus.waitOver.value,
        BILL_NO: over_tb.NO,
        FILENAME: FILENAMES,
        FILE_PATH: FILE_PATHS,
        CREATE_USER_ID: config.USER_ID,
        CREATE_TIME: over_tb.FINISH_TIME
    }
    if (FILENAMES != '') {
        console.log('files' + JSON.stringify(FILENAMES))
        g.ajax(config.AddBillFile, {
            data: v,
            dataType: 'json',
            async: false, //同步请求
            isShowing: true,
            type: 'post',
            success: function (data) {
                console.log('完工文件上传:' + JSON.stringify(data));
                if (data && data.Data != 0) {
                    console.log('完工文件上传成功');
                    addOverDataOffline(over_tb);
                } else {
                    console.log('操作失败');
                    addOverDataOffline(over_tb);
                }
            },
            error: function () {
                errorNums++;
                addOverDataOffline(over_tb);
            }
        });
    }
}
//5.完工addOverDataOffline
function addOverDataOffline(over_tb) {
    //over_tb.FINISH_SIGN = config.USER_ID;
    //over_tb.CREATE_USER_ID = config.CREATE_USER_ID;
    console.log('over_tb:' + JSON.stringify(over_tb))
    g.ajax(config.FinishRepair, {
        data: over_tb,
        dataType: 'json', //服务器返回json格式数据
        type: 'post', //HTTP请求类型
        async: false, //同步请求
        isShowing: true,
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (data) {
            if (data && data.Data == '1') {
                console.log('完工操作成功');
                delOverData(over_tb.NO);
                uploadOverNums++;
                if (smp_overNums == uploadOverNums) {
                    mui.toast("维修完工工单上传成功！共" + smp_overNums + "条记录。");
                    g.closeWaiting();
                    if (app.getTaskList) {
                        app.getTaskList(TaskType.repair.value);
                    }
                    //setTimeout(getSigninOrderNo(), 2000);
                }
            } else {
                delOverData(over_tb.NO);
                uploadOverNums++;
                console.log(data.Message);
            }
        },
        error: function () {
            errorNums++;
            delOverData(over_tb.NO);
            uploadOverNums++;
        }
    });
}
//6.删除已上报的完工工单数据
function delOverData(no) {
    //_database.remove(smp_tb.img_tb, "where NO='" + no + "' and SUB_TYPE='C' and BUSINESS_TYPE='R'");
    _database.remove(smp_tb.over_tb, "where NO='" + no + "'");
    closeWatingNow();
}
function closeWatingNow(){
    if (errorNums > 0) {
        console.log("errorNums:" + errorNums);
        setTimeout(g.closeWaiting(),5000);
    }
}
/******************************************维修上传完工操作end*****************************************************/
//根据业务类型获取图片表名称
function getImgTbByType(btype) {
    var _img_tb = '';
    switch (btype) {
        case BillType.wx.value:
            _img_tb = smp_tb.img_tb;
            break;
        case BillType.xj.value:
            _img_tb = smp_tb.tb_polling;
            break;
        case BillType.by.value:
            _img_tb = smp_tb.tb_maintain;
            break;
        default:
            _img_tb = smp_tb.img_tb;
            break;
    }
    return _img_tb;
}
//根据业务类型获取业务名称
function getTypeTextByTypeId(typeid) {
    var res = "";
    switch (typeid) {
        case TaskType.repair.value:
            res = "维修";
            break;
        case TaskType.polling.value:
            res = "巡检";
            break;
        case TaskType.maintain.value:
            res = "保养";
            break;
        default:
            res = "维修";
            break;
    }
    return res;
}
