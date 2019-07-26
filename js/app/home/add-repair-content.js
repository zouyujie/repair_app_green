var wsCache = new WebStorageCache();//可设置时间的本地存储
var start = 0, pageSize = 1000, pageIndex = 0; //起始记录数,每页取10条
var end = pageSize; //截止记录数
var operatorType = 0; //操作类型,1:代表下拉刷新,2:上拉加载
var nwaiting = null;
var dvAll = [];//总记录集合
var findData = [];//查找后的记录集合
mui.init();
mui.previewImage();
var wo = null; //父webview
var isOver = false;
//备份mui.back， mui.back已将窗口关闭逻辑封装的比较完善（ 预加载及父子窗口）， 因此最好复用mui.back
var old_back = mui.back;
var defaultTxt = "搜索建筑名称（必填）";
var btnArray = ['取消', '确定'];
mui.back = function () {
    var btn = ["放弃", "继续提交"];
    //判断是否打开图片预览，如果是，就先关掉图片，否则直接关闭当前页面
    if (document.querySelector(".mui-preview-in")) {
        mui.previewImage().close();
        return;
    } else {
        mui.confirm('确认放弃报修提交吗？', '退出确认', btn, function (e) {
            if (e.index == 0) {
                if (wo) {
                    wo.evalJS("app.loadTaskNum()"); //刷新任务数
                }
                //执行mui封装好的窗口关闭逻辑；
                old_back();
            }
        });
    }
}
var app = new Vue({
    el: "#app",
    data: {
        isSubmiting: false, //正在提交
        imgItemList: [],
        list: [],
        where1: {
            title: '',
            ftype: 'C036', //故障类型
            start: '0',
            end: '100'
        },
        repairType:0,//文字报修
        buildWhere: { start: 0, end: 10, lstOrgCode: config.ORG_CODE, buildName:''},//建筑查询
        //----------------搜索相关的end---------------------
        //way: "0",
        NO: '',
        data_v: {
            STATE: WorkOrderStatus.waitOrder.value,
            FAULT_INFO: '',
            FAULT_TYPE: '0',
            BUILD_ID: '',
            BUILD_NAME: defaultTxt,
            ADDRESS: '',
        },
        img_list: {},
        isBtnSubmit: true,

        autoSearchList: [], //自动搜索下拉列表
        historyList: [], //历史记录
        search: {
            title: ''
        },
    },
    mounted: function () {
        console.log('BUILD_ID:' + this.data_v.BUILD_ID)
        var _self = this;
        mui.ready(function () {
            //mui('.mui-content').scroll().scrollTo(0, 0, 100); //100毫秒滚动到顶
            document.getElementById('F_SMP').addEventListener('tap', function () {
                showActionSheet({
                    id: 'F_SMP',
                    multiple: true,
                    imgCount: 6,
                    showDetaiFun: function (name, divid, url, path) {
                        var _temp = { name: name, divid: divid, url: url, path: path };
                        _self.imgItemList.push(_temp);
                    }
                });
            });
            getListAll();
            if (mui.os.ios) {
                document.getElementById('search').addEventListener('input', function (e) {
                    console.log('this.value:' + this.value)
                    getListByKey(this.value);
                });
            }
            var _h = g.getScreenInfo('height') + 'px';
            g.initScroll({ id: 'mui-content', h: _h });
        })
        mui.plusReady(function () {
            //g.getCurrentPosition(function (address) {
            //    _self.data_v.ADDRESS = address;
            //});
            var self = plus.webview.currentWebview();
            wo = self.opener();
            if (self.buildInfo) {
                _self.data_v.BUILD_ID = self.buildInfo.BUILD_ID;
                _self.data_v.BUILD_NAME = self.buildInfo.BUILD_NAME;
                _self.data_v.ADDRESS = self.buildInfo.ADDRESS;
                _self.repairType = 1;
            }
            var userInfo = g.getUserInfo();
            if (userInfo && userInfo.USER_ID) {
                _self.data_v.REPORT_USER_NAME = userInfo.NAME;
                _self.data_v.PHONE = userInfo.PHONE;
                _self.data_v.ORG_CODE = userInfo.ORG_CODE;
                _self.data_v.REPORT_USER_ID = userInfo.USER_ID;
                _self.data_v.DEPT_CODE = userInfo.DEPT_CODE;
                _self.data_v.CREATE_USER_ID = userInfo.USER_ID;
                _self.data_v.REPORT_USER_CODE = userInfo.CODE;
                _self.data_v.REPORT_ROLE_ID = config.ROLE_ID;
            }
        });
    },
    methods: {
        showSearchArea: function () { //显示查询界面
            displayHistory();
            //mui.trigger(document.getElementById("search"), "focusin");
            document.getElementById("search").click();
        },
        //取消查询
        cancleSearchArea: function () {
            //console.log('取消')
            app.search.title = ''; //清空搜索关键字
            findData = [];
        },
        //语音识别完成事件
        searchRecognized: function (e) {
            //console.log(e.detail.value);
        },
        //清空历史记录
        clearHistoryList: function () {
            //console.log('clear')
            mui.confirm('确定删除历史记录吗', '删除确认', btnArray, function (e) {
                if (e.index == 1) {
                    var _key = 'BuildHistory';
                    wsCache.delete(_key);
                    displayHistory();
                }
            });
        },
        //选择搜索结果进行查询
        sltWordsSearch: function (val) {
            //console.log(val)
            //1.添加历史记录
            var _key = 'BuildHistory';
            addHistory(_key, val.TITLE, val.ID,val.ADDRESS);
            app.search.title = ''; //清空搜索关键字
            //3.执行搜索
            //console.log('val.ADDRESS:' + val.ADDRESS)
            this.data_v.ADDRESS = val.ADDRESS;
            this.data_v.BUILD_NAME = val.TITLE;
            this.data_v.BUILD_ID = val.ID;
            this.goBack();
        },
        //记录详情
        historyDetail: function (item) {
        	//console.log(JSON.stringify(item))
            this.data_v.ADDRESS = item.address;
            this.data_v.BUILD_NAME = item.name;
            this.data_v.BUILD_ID = item.id;
            this.goBack();
        },
        showActionSheetFun: function () {
            console.log('showActionSheetFun')
            showActionSheet({
                id: 'F_SMP',
                multiple: true,
                imgCount: 6
            });
        },
        sltMsg: function () {
            mui('#searchArea').offCanvas().show();
        },
        faultType: function () {
            var userPicker = new mui.PopPicker();
            var dv = [];
            //如果没网从缓存中取
            g.ajax(config.GetFaultType, {
                data: '',
                dataType: 'json', //服务器返回json格式数据
                type: 'get',
                success: function (data) {
                    console.log('GetFaultType:' + JSON.stringify(data));
                    dv.push({ text: '请选择', value: '' });
                    for (var i = 0; i < data.Data.length; i++) {
                        var d = {};
                        d.text = data.Data[i].NAME;
                        d.value = data.Data[i].CODE;
                        dv.push(d);
                    }
                    userPicker.setData(dv);
                    userPicker.show(function (items) {
                        userResult.value = items[0].text;
                        app.data_v.FAULT_TYPE = items[0].value;
                    });
                }
            });
        },
        btnTime: function () {
            var dtPicker = new mui.DtPicker();
            dtPicker.show(function (rs) {
                console.log(rs.text);
                btnTimeT.value = rs.text;
                app.data_v.LIMIT_TIME = rs.text;
            })
        },
        btnSubmit: function () {
            try {
                if (!app.data_v.FAULT_INFO) {
                    mui.toast('故障描述不能为空');
                    return;
                } else if (!app.data_v.ADDRESS) {
                    mui.toast('维修地点不能为空');
                    return;
                }
                if (!app.data_v.BUILD_NAME || app.data_v.BUILD_NAME == defaultTxt) {
                    mui.toast('建筑名称不能为空');
                    return;
                }
                //							else if(!app.data_v.FAULT_TYPE) {
                //								mui.toast('请选择故障类型');
                //								return;
                //							}

                //else if(app.imgItemList.length<1) {
                //	mui.toast('请上传图片');
                //	return;
                //}
                //else if (!app.data_v.BOOK_TIME) {
                //	mui.toast('预约时间不能为空');
                //	return;
                //}

                if (document.getElementById("IS_URGENCY").classList.contains('mui-active')) {
                    app.data_v.IS_URGENCY = 1;
                } else {
                    app.data_v.IS_URGENCY = 0;
                }
                console.log(app.data_v.IS_URGENCY);
                app.data_v.REPORT_TIME = g.formatDate('D', 'YMDHMS');
                //app.data_v.BOOK_TIME = app.data_v.BOOK_TIME;					 
                var userInfo = g.getUserInfo();
                app.data_v.REPORT_USER_NAME = userInfo.NAME;
                app.data_v.PHONE = userInfo.PHONE;
                document.getElementById("btnSubmit").setAttribute("disabled", true);
                if (app.imgItemList.length == 0) {
                    fun('{ "StatusCode": 200, "Message": "上传成功", "Data": [{ "Name": "", "code": "" }] }');
                } else {
                    if (config.isMock) {
                        var strRes="";
                        for (var i = 0; i < smpImgArray.length; i++) {
                            var itemkey = smpImgArray[i];
                            console.log(itemkey);//file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/upload/F_SMP-20181012133808632P81008-122534.jpg
                            strRes+='{ "Name": "'+itemkey+'","code": "'+itemkey+'" }';
                        }
                        fun('{ "StatusCode": 200, "Message": "上传成功", "Data": ['+strRes+'] }');
                    } else {
                        uploadimge(config.uploadImgUrl, config.USER_ID, fun); //真实环境下应该调用这个上传方法
                    }
                }
            } catch (e) {
                document.getElementById("btnSubmit").disabled = false;
            }
        },
        //------------搜索相关的---------
        //返回
        goBack: function () {
            mui('#searchArea').offCanvas().close();
        },
        //确定
        sure: function () {
            console.log('确定');
            app.data_v.FAULT_INFO = document.getElementById("txtSearch").value; //app.where1.title;
            mui('#searchArea').offCanvas().close();
            document.activeElement.blur(); //关闭软键盘
        },
        searchList: function (event) {
            var txt = event.target.value;
            //console.log('txt:'+txt);
            getListByKey(txt);
        }
    }
});
function getListByKey(key) {
    findData = [];
    if (dvAll.length > 0) {
        for (var i = 0; i < dvAll.length; i++) {
            if (dvAll[i].TITLE.indexOf(key) != -1) {
                findData.push(dvAll[i]);
            }
        }
    }
    app.autoSearchList = findData;
}
//图片上传成功、回调添加数据
var fun = function (d) {
    if (d == null || d == '' || JSON.parse(d).Data.length < 1) {
        return;
    } else {
        mui.plusReady(function () {
            console.log(app.data_v)
            var v = JSON.stringify(app.data_v);
            console.log('请求参数：' + v); //正在提交数据，请勿重复提交
            app.isSubmiting = true;
            g.ajax(config.AddRepairBill, {
                data: v,
                dataType: 'json',
                type: 'post',
                success: function (data) {
                    console.log('AddRepairBill:'+JSON.stringify(data));
                    app.isSubmiting = false;
                    if (data.StatusCode == '200') {
                        app.NO = data.Data;
                        addimg(d, app.NO);
                        //g.exeCount(TaskType.repair.value, 'add');
                        mui.toast('数据操作成功');
                        isOver = true;
                        wo.evalJS("getListAll()"); //刷新列表
                        setTimeout(old_back(), 1000);
                        plus.nativeUI.closeWaiting();
                    }
                },
                error: function () {
                    app.isSubmiting = false;
                }
            });
        });
    }
}

function addimg(d, no) {
    console.log('fun' + JSON.parse(d));

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
    var t = new Date();
    v = {
        BILL_NO: no,
        BUSINESS_TYPE: BillType.wx.value,
        SUB_TYPE: WorkOrderStatus.waitOrder.value,
        FILENAME: FILENAMES,
        FILE_PATH: FILE_PATHS,
        CREATE_USER_ID: config.USER_ID,
        CREATE_TIME: t
    }

    if (FILENAMES != '') {
        console.log('files' + JSON.stringify(FILENAMES))
        g.ajax(config.AddBillFile, {
            data: v,
            dataType: 'json',
            type: 'post',
            success: function (data) {
                console.log('报修文件上传:' + JSON.stringify(data));
                if (data.Data == 0) {
                    mui.toast('文件上传失败');
                } else {
                    console.log('报修文件上传成功');
                }
            }
        });
        app.img_list = d;
    }
}
//加载数据列表
function getListAll() {
    pageIndex = 0;
    initSearch(pageIndex, pageSize);
    dvAll = [];
    operatorType = 0;
    //有重新触发上拉加载的需求（比如当前类别已无更多数据，但切换到另外一个类别后，应支持继续上拉加载）
    if (mui('#pullrefresh').pullRefresh() != false) {
        //console.log(mui('#pullrefresh').pullRefresh().refresh(true))
    }
    toList(operatorType); //具体取数据的方法
}
//初始化分页条件
function initSearch(pageIndex, pageSize) {
    if (app.buildWhere) {
        app.buildWhere.start = pageIndex * pageSize; //刷新并显示
        app.buildWhere.end = pageSize * pageIndex + pageSize;
        app.buildWhere.lstOrgCode = config.ORG_CODE;
    }
}
//加载数据列表
function toList(type) {
    var nwaiting = window.plus == undefined ? null : plus.nativeUI.showWaiting();
    g.ajax(config.GetBuildsPage, {
        data: initSerachWhere(app),
        nwaiting: nwaiting,
        success: function (data) {
            //console.log('data:' + JSON.stringify(data))
            var dv = [];
            if (data.StatusCode == '200') {
                if (data != null && data.Data != null && data.Data.List != null) {
                    for (var i = 0; i < data.Data.List.length; i++) {
                        var d = {};
                        d.ID = data.Data.List[i].BUILD_ID;
                        d.TITLE = data.Data.List[i].BUILD_NAME;
                        d.ADDRESS = data.Data.List[i].ADDRESS;
                        dv.push(d);
                        dvAll.push(d);
                    }
                }
            }
            app.autoSearchList = dvAll;
            if (window.plus != undefined) {
                plus.nativeUI.closeWaiting();
            }
        },
        error: function (xhr, type, errerThrown) {
            if (nwaiting) {
                nwaiting.close();
            }
        }
    });
    return;
}
//初始化查询条件
function initSerachWhere(app) {
    if (app.buildWhere) {
        app.buildWhere.buildName = app.search.title == '' ? null : app.search.title;
        return app.buildWhere;
    }
}
//显示历史记录
function displayHistory() {
    var _historyList = [];
    var _key = 'BuildHistory';
    var historyJSON = wsCache.get(_key);
    //console.log(historyJSON)
    if (historyJSON == null || historyJSON == "") {
        app.historyList = _historyList;
        return;
    }
    var json = new S_JSON(historyJSON);
    //console.log(json)
    if (json[_key] == undefined || json[_key] == null) {
        app.historyList = _historyList;
        return;
    }
    var displayNum = 5;
    for (i = json[_key].length - 1; i >= 0; i--) {
        var _name = json[_key][i].name;
        var _id = json[_key][i].id
        var _address = json[_key][i].address;
        //console.log(_name);
        //去重，不显示重复的历史记录
        if (findDataFromArr(_historyList, _name) != null) {
            continue;
        }
        _historyList.push({
            name: _name,
            id: _id,
            address:_address
        });
        displayNum--;
        if (displayNum == 0) {
            break;
        }
    }
    app.historyList = _historyList;
}
//添加历史记录
function addHistory(_key, name, id,address) {
    var stringCookie = wsCache.get(_key);
    var stringHistory = (stringCookie == null || stringCookie == "") ? "{" + _key + ":[]}" : stringCookie;
    //console.log(stringHistory)
    var json = new S_JSON(stringHistory);
    var e = "{name:'" + name + "',id:'" + id + "',address:'" + address + "'}";
    json[_key].push(e); //添加一个新的记录
    wsCache.set(_key, json.toString(), {
        exp: 30 * 24 * 3600
    });
}
function findDataFromArr(arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == id) {
            return arr[i];
        }
    }
    return null;
}