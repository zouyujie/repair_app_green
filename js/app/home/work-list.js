var userId = config.USER_ID;
var from = ''; //注入标识
var currentPreVw = null; //当前预加载工单详情视图
var pageSize = 10; //每页显示记录数
var pageIndex = 0; //当前页索引
var dvAll = []; //上拉累加集合
var operatorType = 0; //操作类型,1:代表下拉刷新,2:上拉加载
var isfirst = '';
var DepartmentList = [];//部门列表
var DepartPopPicker = null;
var EquTypeList = [];//设备类型列表
var EquTypePopPicker = null;
var BuildsList = [];//楼栋列表
var BuildsPopPicker = null;
var AlarmLevelPopPicker = null;
var defaultDateText = "";//默认日期文本
var DistrictList = [];//行政区域树
var DistrictPopPicker = null;
//初始化上拉下拉
g.pullRefreshInit({
	pulldownRefresh: pulldownRefresh,
	pullupRefresh: pullupRefresh
});
var isEmptyScroll = false;//控制数据为空时是否显示滚动条
var app_Data = {
	title: '',
	typeid: '',//业务类型
	roleid: g.AppRoleType,//角色ID
	isEmptyData: false, //是否空数据，控制为空时界面显示
	curStatusName: '工单状态',//当前选中状态名称
	curDepartment: '报修部门',//当前选中的报修部门
	curDistrict: '行政区域',//当前行政区域
	curBuildName: '建筑名称',//当前建筑名称
	curEquType: '设备类型',//当前设备类型
	curBuilds: '所属楼栋',//当前楼栋
	curAlarmLevel: '报警级别',//当前报警级别
	menus: [],
	w_repair: {//维修查询条件
		orgCode: config.ORG_CODE,
		userId: userId,
		state: null,
		deptCode: null,
		districtId: null,
		buildId: '',
		reportTime_BT: g.operationDate(-365),
		reportTime_ET: g.operationDate(+1),
		start: 0,
		pageSize: pageSize
	},
	list: [],
	rad: {
		cRob: false,
		mRob: false,
		rRob: false, //维修-是否有小红点
	},
    //---------------建筑模糊搜索
	autoSearchList: [], //自动搜索下拉列表
	historyList: [], //历史记录
	search: {
	    title: ''
	}
};
//获取列表
function getListAll(from_page) {
    pageIndex = 0;
    dvAll = [];
    app.list = [];
    operatorType = 0;
    pullupRefresh();

	//pageIndex = 0;
	//initSearch(pageIndex, pageSize);
	//dvAll = [];
	//app.list = [];
	//operatorType = 0;
	////有重新触发上拉加载的需求（比如当前类别已无更多数据，但切换到另外一个类别后，应支持继续上拉加载）
	//if(mui('#pullrefresh').pullRefresh()!=undefined&& mui('#pullrefresh').pullRefresh() != false) {
	//	console.log('11')
	//	mui('#pullrefresh').pullRefresh().refresh(true);
	//}
	//if(from_page != undefined && from_page != '' && from == '') {
	//	from = from_page;
	//}
	//toList(operatorType); //具体取数据的方法
}
//分页
function initSearch(pageIndex, pageSize) {
    if(app.typeid == TaskType.repair.value) {
		app.w_repair.start = pageIndex; //刷新并显示第一页
		app.w_repair.pageSize = pageSize;
	} 
}
//下拉刷新
function pulldownRefresh() {
	mui('#pullrefresh').pullRefresh().refresh(true);
	setTimeout(function() {
		pageIndex = 0;
		initSearch(pageIndex, pageSize);
		operatorType = 1;
		toList(operatorType); //具体取数据的方法
	}, 100);
}
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	setTimeout(function() {
		pageIndex++; //翻下一页
		initSearch(pageIndex, pageSize);
		operatorType = 2; //代表上拉加载
		toList(operatorType); //具体取数据的方法
	}, 100);
}
function endPull(recc) {
    /*结束上拉加载，并根据情况切换“下拉显示更多数据”，以及“没有更多数据了”。执行endPullupToRefresh()方法，结束转雪花进度条的“正在加载...”过程,若还有更多数据，则传入false; 否则传入true，之后滚动条滚动到底时*/
    if (app.$data.list.length < recc) {
        if (mui('#pullrefresh').pullRefresh() != undefined) {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
        }
    } else {
        if (mui('#pullrefresh').pullRefresh() != undefined && mui('#pullrefresh').pullRefresh() != false) {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        }
    }
    if (window.plus != undefined) {
        plus.nativeUI.closeWaiting();
    }
    var _CLASS_PULL_BOTTOM_POCKET = document.querySelector('.mui-pull-bottom-pocket');
    if (_CLASS_PULL_BOTTOM_POCKET != undefined && _CLASS_PULL_BOTTOM_POCKET != null) {
        if (app.$data.list.length == 0) {
            app.isEmptyData = true;
            _CLASS_PULL_BOTTOM_POCKET.classList.add('hidden');
        } else {
            _CLASS_PULL_BOTTOM_POCKET.classList.remove('hidden');
            app.isEmptyData = false;
        }
    }
    console.log('app.isEmptyData :' + app.isEmptyData)
    if (app.$data.list.length <= 2) {
        console.log('isEmptyScroll:' + isEmptyScroll)
        if (isEmptyScroll) {
            if (app.$data.list.length == 0) {
                if (g.id("pullrefreshUl")) {
                    g.id("pullrefreshUl").style.height = g.getScreenInfo('height') + 1 + 'px';
                }
            } else {
                if (g.id("pullrefreshUl")) {
                    g.id("pullrefreshUl").style.height = g.getScreenInfo('height')-130 + 'px';
                }
            }
        } else {
            if (app.$data.list.length == 0) {
                g.id("pullrefreshUl").style.height = g.getScreenInfo('height') + 1 + 'px';
            }
            else if (app.$data.list.length <= 2) {
                g.id("pullrefreshUl").style.height = g.getScreenInfo('height') - 130 + "px";
            }
        }
    } else {
        if (g.id("pullrefreshUl")) { g.id("pullrefreshUl").style.height = 'auto'; }
    }
    isEmptyScroll = false;
}
function successFunc(type,data) {
    console.log('data:'+JSON.stringify(data))
    var dv = [];
    if (data != null && data.Data != null && data.Data.lstData != null) {
        for (var i = 0; i < data.Data.lstData.length; i++) {
            var d = {};
            d.ACCEPT_USER_ID = data.Data.lstData[i].ACCEPT_USER_ID;
            d.CREATE_USER_ID = data.Data.lstData[i].CREATE_USER_ID; 
            d.orderNumber = data.Data.lstData[i].NO;
            d.status = data.Data.lstData[i].STATE;
            d.money = data.Data.lstData[i].MONEY;
            d.hour = data.Data.lstData[i].HOURS;

          if (app.$data.typeid == TaskType.repair.value) {
                d.IsOverTime = data.Data.lstData[i].IsOverTime;
                d.title = data.Data.lstData[i].BUILD_NAME; 
                d.msg = data.Data.lstData[i].FAULT_INFO;
                d.datetime = g.formatDate(data.Data.lstData[i].REPORT_TIME, 'YMDHMS');
                d.PRESS_NUM = data.Data.lstData[i].PRESS_NUM; //催单次数
                d.IS_URGENCY = data.Data.lstData[i].IS_URGENCY;
                d.IS_WAITING = data.Data.lstData[i].IS_WAITING;//这里添加是否待料
            } 
            dv.push(d);
            dvAll.push(d);
        }
        if (isfirst != 'home/') {
            app.$data.menus = g.getCount(app.$data.menus, '');
        } else {
            isfirst = '';
        }
    }
    if (type == 1) { //下拉刷新
        app.$data.list = dv;
        dvAll = dv;
        if (mui('#pullrefresh').pullRefresh()) {
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新 endPulldown
        }
    }
    if (type == 2) { //上拉加载
        app.$data.list = dvAll;
    }
    if (type == 0) {
        app.$data.list = dv;
    }
    endPull(data.Data.recc);
}
//条件获取列表
function toList(type) {
	var nwaiting = window.plus == undefined ? null : plus.nativeUI.showWaiting();
	var v = {},
		api = '';
	console.log('from:' + from)
    if(app.$data.typeid == TaskType.repair.value) {
		v = app.$data.w_repair;
		if(from == 'waitdo') {
			api = config.GetRepairBillUntreatedPage; //待处理工单列表
		} else if(from == 'repair') {
			api = config.GetRepairBillDoctorPage; //报修人员工单列表
		} else {
			api = config.GetRepairBillHistroyPage; //历史工单列表
		}
	}
    console.log('toList_Where' + JSON.stringify(v));
    if (!g.getNetStatus()) { //无网
        if (app.$data.typeid == TaskType.repair.value) { //维修
            var _counts = 0;
                _database.counts(smp_tb.repair_tb, "", function (r) {
                    _counts = r;
                    console.log("r:" + r);
                });
            var _where = '';
            if (app.w_repair.state != null && app.w_repair.state != '') {
                _where += "where STATE='" + app.w_repair.state + "' ";
            }
            console.log('_where:' + _where)
            _database.read(smp_tb.repair_tb, _where + 'ORDER BY REPORT_TIME DESC Limit ' + pageIndex * pageSize + ' , ' + app.w_repair.pageSize, function (res) {
                console.log('_counts:' + _counts)
                var data = { "StatusCode": 200, "Message": null, Data: { lstData: res, recc: _counts } };
                if (res != [] && res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        console.log(res[i].NO);
                    }
                    successFunc(type, data);
                } else {
                    funEndPullRefresh();
                }
            });
        }
        g.closeWaiting();
        if (nwaiting) {
            nwaiting.close();
        }
    } else {
        if (config.isMock) {
            var _where = "where 1=1";
            if (v.buildId) {
                _where += " and BUILD_ID='" + v.buildId+"'";
            }
            if (v.districtId) {
                _where += " and DIST_ID='" + v.districtId + "'";
            }
            if (v.state) {
                _where += " and STATE='" + v.state + "'";
            }
            if (from == 'waitdo') {
                _where += " and STATE<>'E'";
                //api = config.GetRepairBillUntreatedPage; //待处理工单列表
            } else if (from == 'repair') {
                _where += " and CREATE_USER_ID='" + config.USER_ID +  "'";
                //api = config.GetRepairBillDoctorPage; //报修人员工单列表
            } else {
                //_where += " and (CREATE_USER_ID='" + config.USER_ID + "' or ACCEPT_USER_ID='" + config.USER_ID + "')";
                //api = config.GetRepairBillHistroyPage; //历史工单列表
            }
            _where += " ORDER BY REPORT_TIME DESC limit " + pageSize + " offset " + (pageIndex-1) * pageSize; 
            _database.read('tb_repairbill_g', _where, function (res) {
                console.log('res:' + JSON.stringify(res))
                let data = {
                    "StatusCode": 200,
                    "Message": null,
                    "Data": {
                        "lstData": res,
                        "recc": res.length
                    }
                };
                successFunc(type, data);
            });
        } else {
            g.ajax(api, {
                data: v,
                type: 'POST',
                nwaiting: nwaiting,
                success: function (data) {
                    successFunc(type, data);
                },
                error: function (xhr, type, errerThrown) {
                    if (nwaiting) {
                        nwaiting.close();
                    }
                    funEndPullRefresh();
                }
            });
        }
    }
};
//结束上拉下拉
function funEndPullRefresh() {
    if (mui('#pullrefresh').pullRefresh() != false) {
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //结束下拉刷新
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //结束上拉
    }
}
//抢单
function grabOrderFun(item) {
	var v = {},
		api = '';
	var userId = config.USER_ID;
   if(app.typeid == TaskType.repair.value) {
		v = JSON.stringify({
			NO: item.orderNumber,
			HELP_SEND_USER_ID: userId,
			STATE: WorkOrderStatus.waitSignin.value,
			HELP_SEND_TIME: g.formatDate('D', 'YMDHMS'),
			ORG_CODE: config.ORG_CODE,
			ACCEPT_USER_ID: userId
		});
		api = config.AssignPersonRepair;
	} else {
		return;
	}
	g.ajax(api, {
		data: v,
		type: 'post', //HTTP请求类型
		success: function(data) {
		    console.log('抢单:'+JSON.stringify(data));
			if(data.StatusCode == '200' && data.Data == '1') {
			    mui.toast('抢单成功');
			    refleshView(-1, item.orderNumber, WorkOrderStatus.waitSignin.value,app.typeid);
			    if (persons) {
			        persons.getUsers(persons);
			    }
			} else {
				mui.toast('该工单已被抢完，去看看其他工单吧!');
			}
		}
	})
}

function dateInitEvent() {
    //开始日期
    var txtStartDate = document.getElementById('txtStartDate');
    if (txtStartDate) {
        txtStartDate.addEventListener('tap', function () {
            var optionsJson = this.getAttribute('data-options') || '{}';
            var options = JSON.parse(optionsJson);
            var dtPicker = new mui.DtPicker(options);
            dtPicker.show(function (rs) {
                g.id('txtStartDate').value = rs.text;
            })
        })
    }
    //结束日期
    var txtEndDate = document.getElementById('txtEndDate');
    if (txtEndDate) {
        txtEndDate.addEventListener('tap', function () {
            var optionsJson = this.getAttribute('data-options') || '{}';
            var options = JSON.parse(optionsJson);
            var dtPicker = new mui.DtPicker(options);
            dtPicker.show(function (rs) {
                g.id('txtEndDate').value = rs.text;
            })
        })
    }
	//日期范围查询确定
	var btnRepairDateSure=document.getElementById('btnRepairDateSure');
	if(btnRepairDateSure){
		btnRepairDateSure.addEventListener('tap', function() {
		var txtB = document.getElementById("txtStartDate").value;
		var txtE = document.getElementById("txtEndDate").value;
		mui('#repair-datetime').popover('toggle');
		app.w_repair.REPORT_TIME_bt = txtB;
		app.w_repair.REPORT_TIME_et = txtE;
		mui('.mui-table-view.mui-table-view-radio .mui-table-view-cell').each(function(index, item) {
			item.classList.remove('mui-selected');
		})
		getListAll();
	});
	}
}
//根据所选报修时间筛选数据列表
function getListBySltRepairDate(val, start, end) {
    //console.log(val)
    if (defaultDateText == "") {
        defaultDateText = document.getElementById("spnSltDate").innerHTML;
    }
	if(val != null) {
		var Nowdate = new Date();
		var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
		var M = Number(WeekFirstDay.getMonth()) + 1;
		var s = g.formatDate('D', 'YMD') + ' 00:00:00',
			e = g.formatDate('D', 'YMD') + ' 23:59:59';
		if (val == -7) {//本周
		    document.getElementById("spnSltDate").innerHTML = '本周';
		    s = g.getWeekStartAndEnd(0)[0] + ' 00:00:00';//WeekFirstDay.getFullYear() + "-" + M + "-" + WeekFirstDay.getDate() + ' 00:00:00';
		} else if (val == -30) {//本月
		    document.getElementById("spnSltDate").innerHTML = '本月';
			s = WeekFirstDay.getFullYear() + "-" + M + '-1 00:00:00';
		} else if (val == -365) {//全部
		    document.getElementById("spnSltDate").innerHTML = defaultDateText;
			s = g.operationDate(val);
			e = g.operationDate(1);
		} else if (val == '-1') {//范围
		    document.getElementById("spnSltDate").innerHTML = g.formatDate(start, 'MD') + "-" + g.formatDate(end, 'MD');
			s = g.formatDate(start, 'YMD') + ' 00:00:00';
			e = g.formatDate(end, 'YMD') + ' 23:59:59';
		}
		else if (val == 0) {
		    document.getElementById("spnSltDate").innerHTML = '今天';
		}
      if(app.typeid == TaskType.repair.value) {
			app.w_repair.reportTime_BT = s;
			app.w_repair.reportTime_ET = e;
		}
	}
	getListAll();
}
//签到
function signinFun(typeid, item, prefix, page) {
    console.log('item:' + JSON.stringify(item))
	var _pre = prefix || '';
	var _url = _pre + "img-signin.html";
	var _no = item.orderNumber == undefined ? item.NO : item.orderNumber;
    //console.log('page:' + page)
	if (true) {//维修typeid == TaskType.repair.value
	    var data_v = {};
	    var api = '';
	    if (typeid == TaskType.repair.value) {
	        api = config.SignRepair;
	        data_v = {
	            NO: _no,
	            STATE: WorkOrderStatus.waitSignin.value,
	            SOURCE: 1,
	            money: item.money,
	            hour: item.hour,
	            SIGN_TIME: g.formatDate('D', 'YMDHMS'),
	            REPORT_TIME: g.formatDate('D', 'YMDHMS'),
	            BOOK_TIME: g.formatDate('D', 'YMDHMS'),
	            ACCEPT_USER_ID: config.USER_ID
	        };
	    }    
	    var userInfo = g.getUserInfo();
	    if (userInfo.USER_ID) {
	        data_v.REPORT_USER_NAME = userInfo.NAME;
	        data_v.PHONE = userInfo.PHONE;
	        data_v.ORG_CODE = userInfo.ORG_CODE;
	        data_v.REPORT_USER_ID = userInfo.USER_ID;
	        data_v.DEPT_CODE = userInfo.DEPT_CODE;
	    }	   
	    if (g.getNetStatus()) {
	        g.ajax(api, {
	            data: data_v,
	            success: function (data) {
                    console.log('签到：'+JSON.stringify(data))
	                if (data.Data == 1) {
	                    mui.toast('签到成功');
	                    refleshView(0, _no, WorkOrderStatus.waitOver.value ,app.typeid);
	                }
	            }
	        });
	    } else {
	        if (typeid == TaskType.repair.value) { //维修
	            _database.add(smp_tb.signin_tb, [data_v], function (ares) {
	                console.log('ares:' + ares);
	            });
	            //本地修改工单状态、更新签到时间
	            _database.update(smp_tb.repair_tb, 'NO', _no, { "STATE": "C", "SIGN_TIME": g.operationDate(0) }, function (ures) {
	                console.log("ures:" + ures);
	                mui.toast('离线签到成功！');
	                refleshView(0, _no, WorkOrderStatus.waitOver.value, app.typeid);
	            });
	        } 
	    }
	} else {
	    g.openWindowWithTitle({ //目标页面
	        id: 'img-signin',
	        url: _url,
	        extras: {
	            NO: _no,
	            money: item.money,
	            hour: item.hour,
	            item: item,
	            typeid: typeid,
	            page: page
	        }
	    }, '拍照签到');
	}
}
//完工
function overWorkFun(item, prefix) {
	var _pre = prefix || '';
	if(app.typeid == 'maintain' || app.typeid == 'polling') {
		//		g.openWindow({
		//			id: app.typeid + 'order-detail',
		//			url: _pre + app.typeid + '/order-detail.html',
		//			extras: {
		//				NO: item.orderNumber
		//			}
		//		});
		mui.fire(currentPreVw, 'showPage', {
			typeid: app.typeid,
			orderNumber: item.orderNumber,
			statusid: item.status,
			money: item.money,
			hour: item.hour,
			ACCEPT_USER_ID: item.ACCEPT_USER_ID,
			CREATE_USER_ID: item.CREATE_USER_ID,
			IsOverTime: item.IsOverTime
		});
		setTimeout(function() {
			currentPreVw.show("slide-in-right", 300);
		}, 150);
	} else {
		g.openWindow({
			id: app.typeid + '_over-order',
			url: _pre + app.typeid + '/over-order.html',
			extras: {
				NO: item.orderNumber
			}
		});
	}
}
function open_detailStr(str) {
	var item = JSON.parse(str);
	open_detailFun(item, _from);
}
//打开详情
function open_detailFun(item, _from) {
	if(_from) {
		from = _from;
	}
	mui.fire(currentPreVw, 'showPage', {
		typeid: app.typeid,
		orderNumber: item.orderNumber,
		statusid: item.status,
		money: item.money,
		hour: item.hour,
		ACCEPT_USER_ID: item.ACCEPT_USER_ID,
		CREATE_USER_ID: item.CREATE_USER_ID,
		IsOverTime: item.IsOverTime,
		IS_WAITING:item.IS_WAITING,
		frompage: _from || '',
		PRESS_NUM: item.PRESS_NUM || ''
	});
	setTimeout(function() {
		currentPreVw.show("slide-in-right", 300);
	}, 150);
}
//加载数据列表
function getTaskListFun(typeid, tag, roletype) {
	app.typeid = typeid;
	roletype = roletype || '';	 
    isfirst=tag; 
	getListAll(roletype);
	mui.plusReady(function() {
		tag = tag || '';
		headTag = tag;
		var _url = tag + app.typeid + "/order-detail.html";
		currentPreVw = mui.preload({
			id: app.typeid + "_order-detail",
			url: _url
		});
	})
}
//第一次加载报修部门
function firstLoadDepartmentFun() {
    g.ajax(config.GetDepartment, {
        data: {
            ORG_CODE: config.ORG_CODE
        },
        type: 'post', //HTTP请求类型
        success: function (data) {
            console.log('报修部门:'+JSON.stringify(data))
            if (data.Data.length > 0) {
                DepartmentList.push({
                    value: null,
                    text: '全部'
                });
                for (var i = 0; i < data.Data.length; i++) {
                    var d = {};
                    d.value = data.Data[i].DEP_CODE;
                    d.text = data.Data[i].DEP_NAME;
                    DepartmentList.push(d);
                }
                DepartPopPicker = new mui.PopPicker();
                DepartPopPicker.setData(DepartmentList);
            }
        }
    })
}
//选择部门
function GetDepartmentFun() {
    isEmptyScroll = true;
    window.scrollTo(1, 1);
    if (DepartmentList.length == 0) {
        mui.toast('报修部门暂无数据');
        return;
    }
	if (app.w_repair.deptCode) {
	    DepartPopPicker.pickers[0].setSelectedValue(app.w_repair.deptCode, 1000);
	}
	DepartPopPicker.show(function (items) {
	    app.$data.w_repair.deptCode = items[0].value;
	    app.curDepartment = items[0].value == null ? '报修部门' : items[0].text;
	    getListAll(null);
	});
}
//加载状态
function openOrderStatusFun(action) {
    isEmptyScroll = true;
	window.scrollTo(1, 1); //解决picker和下拉刷新同时存在的bug，picker显示时不执行下拉刷新
	var picker;
	if (app.typeid == 'repair') {
	    picker = g.getOrderStatusPicker(app.typeid, action);
	} else {
	    picker=g.getOrderStatusPicker(app.typeid);
	}
	if (app.typeid == 'repair') {
	    if (app.w_repair.state) {
	        picker.pickers[0].setSelectedValue(app.w_repair.state, 1000);
	    }
	}
	picker.show(function(items) {
		console.log(items[0].value)
		if(app.$data.typeid == 'repair') {
		    app.$data.w_repair.state = items[0].value;
		} 
		app.curStatusName =items[0].value == null?'工单状态': items[0].text;

		getListAll();
	});
}
//第一次加载设备类型
function firstLoadEquTypeFun() {
    EquTypeList = [];
    g.ajax(config.GetEqtWorkIDs, {
        data: {},
        success: function (data) {
            console.log('设备类型:'+JSON.stringify(data))
            if (data.Data.length > 0) {
                EquTypeList.push({
                    value: null,
                    text: '全部'
                });
                for (var i = 0; i < data.Data.length; i++) {
                    var d = {};
                    d.value = data.Data[i].EQT_ID;
                    d.text = data.Data[i].EQT_NAME;
                    EquTypeList.push(d);
                }
                EquTypePopPicker=new mui.PopPicker();
                EquTypePopPicker.setData(EquTypeList);
            }
        }
    })
}
//第一次加载行政区域
function firstLoadDistrictFun() {
    if (DistrictList.length > 0) {
        return;
    }
    g.ajax(config.QueryAllDistrictTree, {
        data: {},
        success: function (data) {
            console.log('行政区域:' + JSON.stringify(data))
            if (data.StatusCode=='200'&&data.Data.length > 0) {
                DistrictList = data.Data;
                var defaultObj ={
                    "value": "",
                    "text": "全国",
                    "children": null
                };
                DistrictList.unshift(defaultObj);
                DistrictPopPicker = new mui.PopPicker({ layer: 3 });
                DistrictPopPicker.setData(DistrictList);
            }
        }
    })
}
//获取行政区域树
function getAllDistrictTreeFun() {
    isEmptyScroll = true;
    window.scrollTo(1, 1);
    if (DistrictList.length == 0) {
        mui.toast('行政区域暂无数据');
        return;
    }
    if (app.w_repair.districtId) {
        DistrictPopPicker.pickers[0].setSelectedValue(app.w_repair.districtId, 1000);
    }
    DistrictPopPicker.show(function (items) {
        var selectItem = null
        if (items[2].value == undefined) {
            if (items[1].value == undefined) {
                selectItem = items[0];
            } else {
                selectItem = items[1];
            }
        } else {
            selectItem = items[2];
        }
        console.log('selectItem:' + JSON.stringify(selectItem))
        if (app.typeid == TaskType.repair.value) {
            app.$data.w_repair.districtId = selectItem.value;
        }
        if (selectItem == null || selectItem.value == "000000") {
            app.curDistrict = '行政区域';
        }
        else {
            app.curDistrict =selectItem.text=='全区'?items[1].text: selectItem.text;
        }
        getListAll(null);
    });
}
//加载设备类型
function GetEqtWorkFun() {
    isEmptyScroll = true;
    window.scrollTo(1, 1);
    if (EquTypeList.length == 0) {
        mui.toast('设备类型暂无数据');
        return;
    }
    EquTypePopPicker.show(function (items) {
        app.curEquType = items[0].value == null ? '设备类型' : items[0].text;
        getListAll();
    });
}
//第一次加载所属楼栋
function firstGetBuildsFun() { 
    g.ajax(config.GetBuilds, {
        data: {
            orgCode: config.ORG_CODE
        },
        success: function (data) {
            console.log('所属楼栋:'+JSON.stringify(data))
            if (data.Data.length > 0) {
                BuildsList.push({
                    value: null,
                    text: '全部'
                });
                for (var i = 0; i < data.Data.length; i++) {
                    var d = {};
                    d.value = data.Data[i].BUILD_ID;
                    d.text = data.Data[i].BUILD_NAME;
                    BuildsList.push(d);
                }
                BuildsPopPicker = new mui.PopPicker();
                BuildsPopPicker.setData(BuildsList);
            } 
        }
    })
}
//选择所属楼栋
function GetBuildsFun() {
    window.scrollTo(1, 1);
    if (BuildsList.length == 0) {
        mui.toast('所属楼栋暂无数据');
        return;
    }
    BuildsPopPicker.show(function (items) {
        app.curBuilds = items[0].value == null ? '报修部门' : items[0].text;
        getListAll();
    });
}
/*-----------------------------建筑模糊搜索--------------------------*/
var findData = [];//查找后的记录集合
var dvAllBuild = [];//建筑集合
var wsCache = new WebStorageCache();//可设置时间的本地存储
var btnArray = ['取消', '确定'];
function getListByKey(key) {
    findData = [];
    if (dvAllBuild.length > 0) {
        for (var i = 0; i < dvAllBuild.length; i++) {
            if (dvAllBuild[i].TITLE.indexOf(key) != -1) {
                findData.push(dvAllBuild[i]);
            }
        }
    }
    app.autoSearchList = findData;
}
//加载建筑数据列表
function toBuildList() {
    if (dvAllBuild.length > 0) {
        return;
    }
    var nwaiting = window.plus == undefined ? null : plus.nativeUI.showWaiting();
    var orgCode =config.ORG_CODE;
    g.ajax(config.GetBuildsPage, {
        data: { start: 0, end: 1000, lstOrgCode: orgCode, buildName: app.search.title },
        nwaiting: nwaiting,
        success: function (data) {
            console.log('建筑数据列表:' + JSON.stringify(data))
            var dv = [];
            if (data.StatusCode == '200') {
                if (data != null && data.Data != null && data.Data.List != null) {
                    for (var i = 0; i < data.Data.List.length; i++) {
                        var d = {};
                        d.ID = data.Data.List[i].BUILD_ID;
                        d.TITLE = data.Data.List[i].BUILD_NAME;
                        d.ADDRESS = data.Data.List[i].ADDRESS;
                        dv.push(d);
                        dvAllBuild.push(d);
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
//显示历史记录
function displayHistory() {
    var _historyList = [];
    var _key = 'BuildHistoryList' + app.typeid;
    console.log('_key:' + _key);
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
        var _id = json[_key][i].id;
        var _address = json[_key][i].address;
        //console.log(_name);
        //去重，不显示重复的历史记录
        if (findDataFromArr(_historyList, _name) != null) {
            continue;
        }
        _historyList.push({
            name: _name,
            id: _id,
            address: _address
        });
        displayNum--;
        if (displayNum == 0) {
            break;
        }
    }
    app.historyList = _historyList;
}
//添加历史记录
function addHistory(_key, name, id, address) {
    var stringCookie = wsCache.get(_key);
    var stringHistory = (stringCookie == null || stringCookie == "") ? "{" + _key + ":[]}" : stringCookie;
    var json = new S_JSON(stringHistory);
    var e = "{name:'" + name + "',id:'" + id + "',address:'" + address + "'}";
    json[_key].push(e); //添加一个新的记录
    wsCache.set(_key, json.toString(), {
        exp: 30 * 24 * 3600
    });
}
//查找数组中是否存在指定id
function findDataFromArr(arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == id) {
            return arr[i];
        }
    }
    return null;
}
//开启滚动
function openScroll(){
    if (app.list.length < 3) {
        document.getElementById('pullrefresh').style.height = g.getScreenInfo('height') + 1 + 'px';
    }
    window.scrollTo(1, 1);
}
//关闭滚动
function closeScroll(){
    var _height = document.getElementById('pullrefresh').style.height;
    if (_height) {
        document.getElementById('pullrefresh').style.height = 'auto';
    }
}
