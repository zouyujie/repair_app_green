var _database = new smpWebSql();
//生成一个GUID（取16位）伪随机数
function newGuid() {
    var guid = "";
    for (var i = 1; i <= 16; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12))
            guid += "-";
    }
    return guid;
}
function getUserNameByUserId(userid) {
    var result = '';
    switch (userid) {
        case '4403001':
            result = '李经理';
            break;
        case '4403006':
            result = '邹琼俊'; //班组长
            break;
        case '4403007':
            result = '邹玉杰'; //运维人员
            break;
        case '4403010':
            result = '业主丁某人';
            break;
        default:
            break;
    }
    return result;
}
function getDeptNameByUserId(userid) {
    var result = '';
    switch (userid) {
        case '4403001': //项目经理
            result = '维修部';
            break;
        case '4403006':
            result = '维修二部'; //班组长
            break;
        case '4403007':
            result = '维修一部'; //运维人员
            break;
        case '4403010': //报修人员
            result = '业主';
            break;
        default:
            break;
    }
    return result;
}
function getNamebyTypeId(typeId) {
    var result = "";
    switch (typeId) {
        case "GZDT01":
            result = "电梯故障";
            break;
        case "GZDT02":
            result = "水表坏了";
            break;
        default:
            break;
    }
    return result;
}
// 添加跟踪记录
function addBillExecute(data) {
    _database.add('tb_billexecute_g', [data], function (res) {
        console.log("添加跟踪记录：" + res);//成功
    });
}
// 添加执行人工单数 tb_executeuser_g
function addExecuteBillNums(userid) {
    //_database.update(smp_tb.repair_tb, 'NO', _no, { "STATE": "C", "SIGN_TIME": g.operationDate(0) }
    _database.read('tb_executeuser_g', "where USER_ID='" + userid + "'", function (res) {
        console.log("res：" + JSON.stringify(res));//成功
        if (res != [] && res.length > 0) {
            var _TaskQty = parseInt(res[0].TaskQty);
            _TaskQty =_TaskQty + 1;
            var obj={"TaskQty":_TaskQty};
            _database.update('tb_executeuser_g', "USER_ID",userid, obj, function (res1) {
                console.log("任务数+1：" + res1);//成功
            });
        }
    });
}
// 移除执行人工单数 tb_executeuser_g
function removeExecuteBillNums(userid) {
    _database.read('tb_executeuser_g', "where USER_ID='" + userid + "'", function (res) {
        console.log("res：" + JSON.stringify(res));//成功
        if (res != [] && res.length > 0) {
            var _TaskQty = parseInt(res[0].TaskQty);
            _TaskQty =_TaskQty>0? _TaskQty - 1:0;
            let obj = { "TaskQty": _TaskQty };
            _database.update('tb_executeuser_g', "USER_ID", userid, obj, function (res1) {
                console.log("任务数+1：" + res1);//成功
            });
        }
    });
}
//调用mock方法模拟数据
/*------------------------------用户登录权限start-------------------------------------*/
//项目经理菜单权限
var pmObj = {
    "StatusCode": 200,
    "Message": null,
    "Data": {
        "U": {
            "USER_ID": "4403001",
            "ORG_CODE": "4403Z01",
            "ORG_NAME": "XX维修项目",
            "DEPT_CODE": "WXB",
            "DEP_NAME": "维修部",
            "CODE": "4403Z01YWB110",
            "IS_SYS": false,
            "ROLE_ID": "U007",
            "UROLE_TYPE": 3,
            "ROLE_NAME": "项目经理",
            "PASSWORD": "e10adc3949ba59abbe56e057f20f883e",
            "GENDER": 1,
            "BIND_PHONE": true,
            "FACE": null,
            "MEMO": null,
            "ADDRESS": null,
            "DUTY_TYPE": null,
            "ACTION_TYPE": "-1,B",
            "EMAIL": null,
            "FIX": false,
            "IS_ACC": false,
            "IS_OUT": false,
            "JOB_TYPE": null,
            "NAME": "李经理",
            "PHONE": "13200000001",
            "POSITION": null,
            "TITLE": null,
            "SUPPER_ID": null,
            "SUPPER_NAME": null,
            "SUPPER_TYPE": null,
            "SUPPER_CONTACT": null,
            "SUPPER_ADDRESS": null,
            "SUPPER_TEL": null,
            "CREATE_TIME": "2018-08-29T00:00:00",
            "CREATE_USER_ID": "admin",
            "MODIFY_USER_ID": null,
            "MODIFY_TIME": null,
            "STATE": 1,
            "sys_updatetime": "2018-08-30T09:39:27.101386Z"
        },
        "P": [{
            "URIGHT_ID": 1,
            "URIGHT_NAME": "工作台",
            "RIGHT_TYPE": null,
            "PARENT_ID": null,
            "LEVEL": 1,
            "ORDER_NO": 0,
            "MODULE_NAME": "home",
            "IS_MENU": false,
            "ICON": "iconfont icon-gongzuotai",
            "BACKGROUND_COLOR": "",
            "FUNC": "pages/home.html",
            "PARAMETER": "",
            "IS_SINGLE": false,
            "MEMO": "",
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 5,
            "URIGHT_NAME": "维修",
            "RIGHT_TYPE": null,
            "PARENT_ID": 1,
            "LEVEL": 2,
            "ORDER_NO": 1,
            "MODULE_NAME": "repair",
            "IS_MENU": true,
            "ICON": "iconfont icon-weixiubaoyang",
            "BACKGROUND_COLOR": "#FFBD4D",
            "FUNC": "home/task-main.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 6,
            "URIGHT_NAME": "模块2",
            "RIGHT_TYPE": null,
            "PARENT_ID": 1,
            "LEVEL": 2,
            "ORDER_NO": 2,
            "MODULE_NAME": "polling",
            "IS_MENU": true,
            "ICON": "iconfont icon-xunjianguanli",
            "BACKGROUND_COLOR": "#6BA7F0",
            "FUNC": "home/polling/order-detail.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 7,
            "URIGHT_NAME": "模块3",
            "RIGHT_TYPE": null,
            "PARENT_ID": 1,
            "LEVEL": 2,
            "ORDER_NO": 3,
            "MODULE_NAME": "maintain",
            "IS_MENU": true,
            "ICON": "iconfont icon-Maintenance",
            "BACKGROUND_COLOR": "#5CBD9C",
            "FUNC": "home/maintain/order-detail.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 3,
            "URIGHT_NAME": "我的",
            "RIGHT_TYPE": null,
            "PARENT_ID": null,
            "LEVEL": 1,
            "ORDER_NO": 4,
            "MODULE_NAME": "my",
            "IS_MENU": true,
            "ICON": "iconfont icon-wode",
            "BACKGROUND_COLOR": null,
            "FUNC": "pages/my.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 4,
            "URIGHT_NAME": "模块4",
            "RIGHT_TYPE": null,
            "PARENT_ID": 1,
            "LEVEL": 2,
            "ORDER_NO": 4,
            "MODULE_NAME": "alarm",
            "IS_MENU": true,
            "ICON": "iconfont icon-alarm",
            "BACKGROUND_COLOR": "#F27475",
            "FUNC": "home/alarm/order-detail.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }],
        "R": true
    }
};
//班组菜单权限
var leaderObj = {
    "StatusCode": 200,
    "Message": null,
    "Data": {
        "U": {
            "USER_ID": "4403006",
            "ORG_CODE": "4403Z01",
            "ORG_NAME": "XX维修项目",
            "DEPT_CODE": "6201X01DEP1",
            "DEP_NAME": "运维二部",
            "DIST_ID": "440300",
            "CODE": "4403006",
            "IS_SYS": false,
            "BUILD_ID": null,
            "ROLE_ID": "U008",
            "UROLE_TYPE": 3,
            "ROLE_NAME": "运维班组",
            "PASSWORD": "e10adc3949ba59abbe56e057f20f883e",
            "GENDER": 1,
            "BIND_PHONE": true,
            "FACE": null,
            "MEMO": null,
            "ADDRESS": null,
            "DUTY_TYPE": null,
            "ACTION_TYPE": "A,B",
            "EMAIL": null,
            "FIX": false,
            "IS_ACC": false,
            "IS_OUT": false,
            "JOB_TYPE": null,
            "NAME": "邹琼俊",
            "PHONE": "15243641131",
            "POSITION": null,
            "TITLE": null,
            "SUPPER_ID": null,
            "SUPPER_NAME": null,
            "SUPPER_TYPE": null,
            "SUPPER_CONTACT": null,
            "SUPPER_ADDRESS": null,
            "SUPPER_TEL": null,
            "CREATE_TIME": "2018-09-18T00:00:00",
            "CREATE_USER_ID": "admin",
            "MODIFY_USER_ID": null,
            "MODIFY_TIME": null,
            "STATE": 1,
            "sys_updatetime": "2018-09-18T18:04:47.433957Z"
        },
        "P": [{
            "URIGHT_ID": 1,
            "URIGHT_NAME": "工作台",
            "RIGHT_TYPE": null,
            "PARENT_ID": null,
            "LEVEL": 1,
            "ORDER_NO": 0,
            "MODULE_NAME": "home",
            "IS_MENU": false,
            "ICON": "iconfont icon-gongzuotai",
            "BACKGROUND_COLOR": "",
            "FUNC": "pages/home.html",
            "PARAMETER": "",
            "IS_SINGLE": false,
            "MEMO": "",
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 5,
            "URIGHT_NAME": "维修",
            "RIGHT_TYPE": null,
            "PARENT_ID": 1,
            "LEVEL": 2,
            "ORDER_NO": 1,
            "MODULE_NAME": "repair",
            "IS_MENU": true,
            "ICON": "iconfont icon-weixiubaoyang",
            "BACKGROUND_COLOR": "#FFBD4D",
            "FUNC": "home/task-main.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 6,
            "URIGHT_NAME": "模块2",
            "RIGHT_TYPE": null,
            "PARENT_ID": 1,
            "LEVEL": 2,
            "ORDER_NO": 2,
            "MODULE_NAME": "polling",
            "IS_MENU": true,
            "ICON": "iconfont icon-xunjianguanli",
            "BACKGROUND_COLOR": "#6BA7F0",
            "FUNC": "home/polling/order-detail.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 7,
            "URIGHT_NAME": "模块3",
            "RIGHT_TYPE": null,
            "PARENT_ID": 1,
            "LEVEL": 2,
            "ORDER_NO": 3,
            "MODULE_NAME": "maintain",
            "IS_MENU": true,
            "ICON": "iconfont icon-Maintenance",
            "BACKGROUND_COLOR": "#5CBD9C",
            "FUNC": "home/maintain/order-detail.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 4,
            "URIGHT_NAME": "模块4",
            "RIGHT_TYPE": null,
            "PARENT_ID": 1,
            "LEVEL": 2,
            "ORDER_NO": 4,
            "MODULE_NAME": "alarm",
            "IS_MENU": true,
            "ICON": "iconfont icon-alarm",
            "BACKGROUND_COLOR": "#F27475",
            "FUNC": "home/alarm/order-detail.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 3,
            "URIGHT_NAME": "我的",
            "RIGHT_TYPE": null,
            "PARENT_ID": null,
            "LEVEL": 1,
            "ORDER_NO": 4,
            "MODULE_NAME": "my",
            "IS_MENU": true,
            "ICON": "iconfont icon-wode",
            "BACKGROUND_COLOR": null,
            "FUNC": "pages/my.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }],
        "R": true
    }
};
//维修人员菜单权限
var repairmanObj = {
    "StatusCode": 200,
    "Message": null,
    "Data": {
        "U": {
            "USER_ID": "4403007",
            "ORG_CODE": "4403Z01",
            "ORG_NAME": "XX维修项目",
            "DEPT_CODE": "6201X01DEP1",
            "DEP_NAME": "运维一部",
            "DIST_ID": "440300",
            "CODE": "GZDT02",
            "IS_SYS": false,
            "BUILD_ID": null,
            "ROLE_ID": "U009",
            "UROLE_TYPE": 3,
            "ROLE_NAME": "维修人员",
            "PASSWORD": "e10adc3949ba59abbe56e057f20f883e",
            "GENDER": 1,
            "BIND_PHONE": true,
            "FACE": null,
            "MEMO": null,
            "ADDRESS": null,
            "DUTY_TYPE": null,
            "ACTION_TYPE": "-1,A",
            "EMAIL": null,
            "FIX": false,
            "IS_ACC": false,
            "IS_OUT": false,
            "JOB_TYPE": "D",
            "NAME": "邹玉杰",
            "PHONE": "13249838330",
            "POSITION": null,
            "TITLE": null,
            "SUPPER_ID": null,
            "SUPPER_NAME": null,
            "SUPPER_TYPE": null,
            "SUPPER_CONTACT": null,
            "SUPPER_ADDRESS": null,
            "SUPPER_TEL": null,
            "CREATE_TIME": "2018-09-18T00:00:00",
            "CREATE_USER_ID": "admin",
            "MODIFY_USER_ID": null,
            "MODIFY_TIME": null,
            "STATE": 1,
            "sys_updatetime": "2018-09-18T18:05:13.008656Z"
        },
        "P": [{
            "URIGHT_ID": 2,
            "URIGHT_NAME": "工作台",
            "RIGHT_TYPE": null,
            "PARENT_ID": null,
            "LEVEL": 1,
            "ORDER_NO": 0,
            "MODULE_NAME": "action-home",
            "IS_MENU": true,
            "ICON": "iconfont icon-gongzuotai",
            "BACKGROUND_COLOR": null,
            "FUNC": "pages/action-home.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": "执行人员",
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 17,
            "URIGHT_NAME": "维修",
            "RIGHT_TYPE": null,
            "PARENT_ID": 2,
            "LEVEL": 2,
            "ORDER_NO": 1,
            "MODULE_NAME": "repair",
            "IS_MENU": true,
            "ICON": "iconfont icon-weixiubaoyang",
            "BACKGROUND_COLOR": "#FFBD4D",
            "FUNC": "home/task-main.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 18,
            "URIGHT_NAME": "模块1",
            "RIGHT_TYPE": null,
            "PARENT_ID": 2,
            "LEVEL": 2,
            "ORDER_NO": 2,
            "MODULE_NAME": "polling",
            "IS_MENU": true,
            "ICON": "iconfont icon-xunjianguanli",
            "BACKGROUND_COLOR": "#6BA7F0",
            "FUNC": "home/polling/order-detail.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 19,
            "URIGHT_NAME": "模块2",
            "RIGHT_TYPE": null,
            "PARENT_ID": 2,
            "LEVEL": 2,
            "ORDER_NO": 3,
            "MODULE_NAME": "maintain",
            "IS_MENU": true,
            "ICON": "iconfont icon-Maintenance",
            "BACKGROUND_COLOR": "#5CBD9C",
            "FUNC": "home/maintain/order-detail.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 3,
            "URIGHT_NAME": "我的",
            "RIGHT_TYPE": null,
            "PARENT_ID": null,
            "LEVEL": 1,
            "ORDER_NO": 4,
            "MODULE_NAME": "my",
            "IS_MENU": true,
            "ICON": "iconfont icon-wode",
            "BACKGROUND_COLOR": null,
            "FUNC": "pages/my.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": null,
            "PARENT_NAME": ""
        }],
        "R": true
    }
};
//报修人员菜单权限
var customerObj = {
    "StatusCode": 200,
    "Message": null,
    "Data": {
        "U": {
            "USER_ID": "4403010",
            "ORG_CODE": "4403Z01",
            "ORG_NAME": "XX维修项目",
            "DEPT_CODE": "WXB",
            "DEP_NAME": "事业部",
            "DIST_ID": "440300",
            "CODE": "4403010",
            "IS_SYS": false,
            "BUILD_ID": null,
            "ROLE_ID": "U011",
            "UROLE_TYPE": 4,
            "ROLE_NAME": "报修人员",
            "PASSWORD": "e10adc3949ba59abbe56e057f20f883e",
            "GENDER": 1,
            "BIND_PHONE": true,
            "FACE": "APP,4125e757-484c-4a62-b9b9-21aed6f0f037",
            "MEMO": null,
            "ADDRESS": null,
            "DUTY_TYPE": null,
            "ACTION_TYPE": null,
            "EMAIL": null,
            "FIX": false,
            "IS_ACC": false,
            "IS_OUT": false,
            "JOB_TYPE": null,
            "NAME": "业主丁某人",
            "PHONE": "15243641131",
            "POSITION": null,
            "TITLE": null,
            "SUPPER_ID": null,
            "SUPPER_NAME": null,
            "SUPPER_TYPE": null,
            "SUPPER_CONTACT": null,
            "SUPPER_ADDRESS": null,
            "SUPPER_TEL": null,
            "CREATE_TIME": "2018-10-11T00:00:00",
            "CREATE_USER_ID": "admin",
            "MODIFY_USER_ID": null,
            "MODIFY_TIME": null,
            "STATE": 1,
            "sys_updatetime": "2018-10-11T17:20:19.49005Z"
        },
        "P": [{
            "URIGHT_ID": 10,
            "URIGHT_NAME": "维修",
            "RIGHT_TYPE": null,
            "PARENT_ID": null,
            "LEVEL": 1,
            "ORDER_NO": 1,
            "MODULE_NAME": "repair-home",
            "IS_MENU": true,
            "ICON": "iconfont icon-weixiubaoyang",
            "BACKGROUND_COLOR": null,
            "FUNC": "pages/repair-home.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": "报修人员",
            "PARENT_NAME": ""
        }, {
            "URIGHT_ID": 11,
            "URIGHT_NAME": "我的",
            "RIGHT_TYPE": null,
            "PARENT_ID": null,
            "LEVEL": 1,
            "ORDER_NO": 2,
            "MODULE_NAME": "repair-my",
            "IS_MENU": true,
            "ICON": "iconfont icon-wode",
            "BACKGROUND_COLOR": null,
            "FUNC": "pages/repair-my.html",
            "PARAMETER": null,
            "IS_SINGLE": false,
            "MEMO": "报修人员",
            "PARENT_NAME": ""
        }],
        "R": true
    }
};
/*------------------------------用户登录权限end-------------------------------------*/
//初始化表数据
function initTableDataGlobal() {
    //执行人员表
    var list_executeuser = [{
        "USER_ID": "4403006",
        "NAME": "邹琼俊",
        "TaskQty": 0
    }, {
        "USER_ID": "4403007",
        "NAME": "邹玉杰",
        "TaskQty": 0
    }];
    //_database.delTable('tb_executeuser_g', function () {
    //    console.log("数据表'tb_executeuser_g'删除成功");
    //});
    _database.add('tb_executeuser_g', list_executeuser, function (res) {
        console.log("执行人员初始化：" + res);//成功
    });
}
//清除数据表
function clearTableDataGlobal() {
    _database.remove("tb_executeuser_g");
    _database.remove("tb_repairbill_g");
    //tb_billfile_g 工单图片表
    _database.remove("tb_billfile_g");
}
var GetRepairBillUntreatedPageData = {
    "StatusCode": 200,
    "Message": null,
    "Data": {
        "lstData": [{
            "NO": "W4403Z01181011001",
            "ORG_CODE": "4403Z01",
            "EQT_WORK_ID": "0",
            "IS_URGENCY": 0,
            "STATE": "A",
            "REPORT_USER_CODE": null,
            "CREATE_USER_ID": "4403001",
            "REPORT_USER_NAME": "邹玉杰",
            "REPORT_ROLE_ID": null,
            "PHONE": "15243641131",
            "DEPT_CODE": null,
            "FAULT_INFO": "灯泡坏了",
            "ADDRESS": "罗湖区宝安北路3019号",
            "SOURCE": "C",
            "FAULT_TYPE": "GZDT01",
            "LABOR_COST": 0,
            "PART_COST": 0,
            "SUMMARY": null,
            "RECEIVE_TYPE": 0,
            "BOOK_TIME": null,
            "EQ_ID": null,
            "EQP_NAME": null,
            "ACCEPT_USER_ID": "1",
            "SIGN_TIME": null,
            "ACCEPT_TIME": null,
            "DISPATCH_USER_ID": null,
            "FINISH_SIGN": null,
            "FINISH_TIME": null,
            "FINISH_INFO": null,
            "DISPATCH_TIME": null,
            "NEED_HELP": false,
            "NEED_DISPATCH": false,
            "HELP_SEND_USER_ID": null,
            "HELP_SEND_TIME": null,
            "CONFIRM_USER_ID": null,
            "CONFIRM_TIME": null,
            "CONFIRM_STATUS": 0,
            "CONFIRM_SIGN": null,
            "REPORT_TIME": "2018-10-11T15:40:40",
            "PRESS_NUM": 0,
            "PRESS_FIRST_TIME": "2018-10-11T15:40:40",
            "PRESS_LAST_TIME": "2018-10-11T15:40:40",
            "MEMO": null,
            "DEPT_CODE_NAME": "",
            "FAULT_NAME": null,
            "REPAIR_USER_NAME": null,
            "REPAIR_DEPT_NAME": null,
            "MONEY": 2,
            "HOURS": 1,
            "IS_WAITING": 0,
            "OTHER_DEV_NAME": null,
            "BUILD_ID": "440300B080",
            "LIMIT_TIME": "2018-10-12T15:35:00",
            "BUILD_NAME": "好百年总店",
            "DIST_ID": "440303",
            "IsOverTime": 0,
            "sys_updatetime": "2018-10-11T15:40:40"
        }],
        "recc": 1
    }
};
var GetBuildsPageData = {
    "StatusCode": 200,
    "Message": null,
    "Data": {
        "Total": 503,
        "List": [{
            "BUILD_ID": "440300A002",
            "BUILD_NAME": "xx小区6栋1705号",
            "DIST_ID": "440304",
            "org_code": "4403Z01",
            "OWNER": "test",
            "MANAGER": "st",
            "ADDRESS": "西单元[1705]号",
            "BUILD_YEAR": 2008,
            "FLOOR_SUM": null,
            "BUILD_TYPE": "D",
            "UP_FLOOR": null,
            "DOWN_FLOOR": null,
            "COORDINATE": "fsssssssssssssss",
            "FLOOR_HEIGHT": null,
            "TOTAL_HEIGHT": 0,
            "TOTAL_AREA": 6312,
            "AIR_AREA": 45726,
            "HEAT_AREA": 105,
            "AIR_TYPE": "A",
            "HEAT_TYPE": "A",
            "BUILD_COEFF": null,
            "STRUC_TYPE": "G",
            "WALL_MAT_TYPE": "B",
            "WALL_WARM_TYPE": "B",
            "ROOWARM_TYPE": "A",
            "WINDOW_TYPE": "A",
            "GLASS_TYPE": "A",
            "WIN_FRAME_TYPE": "A",
            "STATE": 1,
            "CREATE_TIME": "2018-01-03T14:00:00",
            "CREATE_USER_ID": "admin",
            "MODIFY_TIME": "2018-09-19T11:17:05",
            "MODIFY_USER_ID": "qyyy1",
            "BUILD_NATURE": "B",
            "BUILD_MONITOR_TYPE": null,
            "DIST_NAME": "福田区",
            "CONTACT": "周泽礵",
            "TEL": "13249838330",
            "EMAIL": null,
            "OPCS_URL": null,
            "OPEN_TIME": null,
            "CLOSE_TIME": null,
            "USED_CONTROL": false,
            "OPCS_USERNAME": null,
            "OPCS_PASSWORD": null,
            "OPCS_CERT": null,
            "OPCS_WRITE": null,
            "OPCS_REFRESH": null,
            "BUILD_TYPE_NAME": "文化教育建筑",
            "ONLINE_TIME": null,
            "MONITOR_MODE_SET": null,
            "ELEC_PRICE": null,
            "WATER_PRICE": null,
            "DAQ_INTERVAL": 15,
            "OPC_OPCTION_WCF_URL": null,
            "MH_OPCS_URL": null,
            "PROJECT_TYPE": null,
            "MARK_TYPE": null,
            "FA": null,
            "FB": null,
            "FC": null,
            "MARK_SUB": null,
            "POWER_MAIN_SUB": null,
            "POWER_CHILD_SUB": null,
            "HOUR_MAIN_SUB": null,
            "HOUR_CHILD_SUB": null,
            "PARA_SOURCE": null,
            "STAND_BEGIN": null,
            "STAND_END": null,
            "MATLAB_TYPE": null,
            "HOLIDAY_PARA": null,
            "ENERGY_RANK_TYPE": null,
            "MONITOR_TYPE": null,
            "MONITOR_LEFT_VISIBLE": null,
            "HOME_SOURCE": null,
            "FKQUOTA_SET": 1,
            "COLLECTOR_ADDRESS": null
        }, {
            "BUILD_ID": "440300A003",
            "BUILD_NAME": "xx小区4栋1205",
            "DIST_ID": "440304",
            "org_code": "4403Z01",
            "OWNER": null,
            "MANAGER": null,
            "ADDRESS": "xx小区4栋1205",
            "BUILD_YEAR": 0,
            "FLOOR_SUM": null,
            "BUILD_TYPE": "A",
            "UP_FLOOR": null,
            "DOWN_FLOOR": null,
            "COORDINATE": null,
            "FLOOR_HEIGHT": null,
            "TOTAL_HEIGHT": 0,
            "TOTAL_AREA": 85137,
            "AIR_AREA": 85137,
            "HEAT_AREA": null,
            "AIR_TYPE": "C",
            "HEAT_TYPE": "A",
            "BUILD_COEFF": null,
            "STRUC_TYPE": "A",
            "WALL_MAT_TYPE": "A",
            "WALL_WARM_TYPE": "A",
            "ROOWARM_TYPE": "A",
            "WINDOW_TYPE": "A",
            "GLASS_TYPE": "A",
            "WIN_FRAME_TYPE": "A",
            "STATE": 1,
            "CREATE_TIME": "2018-01-03T14:00:00",
            "CREATE_USER_ID": "admin",
            "MODIFY_TIME": "2018-09-17T12:18:39",
            "MODIFY_USER_ID": "qyyy1",
            "BUILD_NATURE": "A",
            "BUILD_MONITOR_TYPE": null,
            "DIST_NAME": "福田区",
            "CONTACT": null,
            "TEL": null,
            "EMAIL": null,
            "OPCS_URL": null,
            "OPEN_TIME": null,
            "CLOSE_TIME": null,
            "USED_CONTROL": false,
            "OPCS_USERNAME": null,
            "OPCS_PASSWORD": null,
            "OPCS_CERT": null,
            "OPCS_WRITE": null,
            "OPCS_REFRESH": null,
            "BUILD_TYPE_NAME": "办公及写字楼建筑",
            "ONLINE_TIME": null,
            "MONITOR_MODE_SET": null,
            "ELEC_PRICE": null,
            "WATER_PRICE": null,
            "DAQ_INTERVAL": 15,
            "OPC_OPCTION_WCF_URL": null,
            "MH_OPCS_URL": null,
            "PROJECT_TYPE": null,
            "MARK_TYPE": null,
            "FA": null,
            "FB": null,
            "FC": null,
            "MARK_SUB": null,
            "POWER_MAIN_SUB": null,
            "POWER_CHILD_SUB": null,
            "HOUR_MAIN_SUB": null,
            "HOUR_CHILD_SUB": null,
            "PARA_SOURCE": null,
            "STAND_BEGIN": null,
            "STAND_END": null,
            "MATLAB_TYPE": null,
            "HOLIDAY_PARA": null,
            "ENERGY_RANK_TYPE": null,
            "MONITOR_TYPE": null,
            "MONITOR_LEFT_VISIBLE": null,
            "HOME_SOURCE": null,
            "FKQUOTA_SET": 1,
            "COLLECTOR_ADDRESS": "2楼储物间"
        }]
    }
};
if (config.isMock) {
    //执行人员表tb_executeuser_g
    var QueryAllDistrictTreeData = {
        "StatusCode": 200,
        "Message": null,
        "Data": [{
            "value": "440000",
            "text": "广东省",
            "children": [{
                "value": "440100",
                "text": "广州市",
                "children": [{
                    "value": "440100",
                    "text": "全区",
                    "children": null
                }, {
                    "value": "440101",
                    "text": "天河区",
                    "children": null
                }]
            }, {
                "value": "440300",
                "text": "深圳市",
                "children": [{
                    "value": "440300",
                    "text": "全区",
                    "children": null
                }, {
                    "value": "440303",
                    "text": "罗湖区",
                    "children": null
                }, {
                    "value": "440304",
                    "text": "福田区",
                    "children": null
                }, {
                    "value": "440305",
                    "text": "南山区",
                    "children": null
                }, {
                    "value": "440306",
                    "text": "宝安区",
                    "children": null
                }, {
                    "value": "440307",
                    "text": "龙岗区",
                    "children": null
                }, {
                    "value": "440308",
                    "text": "盐田区",
                    "children": null
                }, {
                    "value": "440309",
                    "text": "龙华区",
                    "children": null
                }]
            }]
        }]
    };
    var GetRepairBillDoctorPageData = {
        "StatusCode": 200,
        "Message": null,
        "Data": {
            "lstData": [{
                "NO": "W4403Z01181011002",
                "ORG_CODE": "4403Z01",
                "EQT_WORK_ID": "0",
                "IS_URGENCY": 0,
                "STATE": "A",
                "REPORT_USER_CODE": "4403010",
                "CREATE_USER_ID": "4403010",
                "REPORT_USER_NAME": "报修人A",
                "REPORT_ROLE_ID": "U011",
                "PHONE": "15243641131",
                "DEPT_CODE": "WXB",
                "FAULT_INFO": "桌子坏了",
                "ADDRESS": "深圳市福田区深南大道  [4009]号",
                "SOURCE": "B",
                "FAULT_TYPE": "GZDT01",
                "LABOR_COST": 0,
                "PART_COST": 0,
                "SUMMARY": null,
                "RECEIVE_TYPE": 0,
                "BOOK_TIME": null,
                "EQ_ID": null,
                "EQP_NAME": null,
                "ACCEPT_USER_ID": "1",
                "SIGN_TIME": null,
                "ACCEPT_TIME": null,
                "DISPATCH_USER_ID": null,
                "FINISH_SIGN": null,
                "FINISH_TIME": null,
                "FINISH_INFO": null,
                "DISPATCH_TIME": null,
                "NEED_HELP": false,
                "NEED_DISPATCH": false,
                "HELP_SEND_USER_ID": null,
                "HELP_SEND_TIME": null,
                "CONFIRM_USER_ID": null,
                "CONFIRM_TIME": null,
                "CONFIRM_STATUS": 0,
                "CONFIRM_SIGN": null,
                "REPORT_TIME": "2018-10-11T17:01:33",
                "PRESS_NUM": 0,
                "PRESS_FIRST_TIME": "2018-10-11T17:01:33",
                "PRESS_LAST_TIME": "2018-10-11T17:01:33",
                "MEMO": null,
                "DEPT_CODE_NAME": "xx物业维修部",
                "FAULT_NAME": null,
                "REPAIR_USER_NAME": null,
                "REPAIR_DEPT_NAME": null,
                "MONEY": 2,
                "HOURS": 1,
                "IS_WAITING": 0,
                "OTHER_DEV_NAME": null,
                "BUILD_ID": "440300A002",
                "LIMIT_TIME": null,
                "BUILD_NAME": "深圳投资大厦",
                "DIST_ID": "440304",
                "IsOverTime": 0,
                "sys_updatetime": "2018-10-11T17:01:33"
            }],
            "recc": 1
        }
    };
    var BillWorkbenchData = {
        "StatusCode": 200,
        "Message": null,
        "Data": {
            "cCount": 0,
            "mCount": 0,
            "rCount": 2,
            "cRob": false,
            "mRob": false,
            "rRob": true
        }
    };
    var loginUrlErrorObj = {
        "StatusCode": 200,
        "Message": null,
        "Data": {
            "U": {
                "USER_ID": null,
                "ORG_CODE": null,
                "ORG_NAME": null,
                "DEPT_CODE": null,
                "DEP_NAME": null,
                "DIST_ID": null,
                "CODE": null,
                "IS_SYS": null,
                "BUILD_ID": null,
                "ROLE_ID": null,
                "UROLE_TYPE": 0,
                "ROLE_NAME": null,
                "PASSWORD": null,
                "GENDER": null,
                "BIND_PHONE": null,
                "FACE": null,
                "MEMO": null,
                "ADDRESS": null,
                "DUTY_TYPE": null,
                "ACTION_TYPE": null,
                "EMAIL": null,
                "FIX": null,
                "IS_ACC": null,
                "IS_OUT": null,
                "JOB_TYPE": null,
                "NAME": null,
                "PHONE": null,
                "POSITION": null,
                "TITLE": null,
                "SUPPER_ID": null,
                "SUPPER_NAME": null,
                "SUPPER_TYPE": null,
                "SUPPER_CONTACT": null,
                "SUPPER_ADDRESS": null,
                "SUPPER_TEL": null,
                "CREATE_TIME": "0001-01-01T00:00:00",
                "CREATE_USER_ID": null,
                "MODIFY_USER_ID": null,
                "MODIFY_TIME": null,
                "STATE": null,
                "sys_updatetime": "0001-01-01T00:00:00"
            },
            "P": [],
            "R": false
        }
    }
    //登录
    Mock.mock(config.loginUrl, null, function (options) {
        var _body = JSON.parse(options.body);
        var userid = _body.USER_ID;
        var result = null;
        if (_body.PASSWORD != 'e10adc3949ba59abbe56e057f20f883e') { //密码不等于123456
            return loginUrlErrorObj;
        }
        if (userid == '4403001') { //项目经理
            result = pmObj;
        } else if (userid == '4403006') { //班组
            result = leaderObj;
        } else if (userid == '4403007') { //维修人员
            result = repairmanObj;
        } else if (userid == '4403010') { //报修人员
            result = customerObj;
        }
        else {
            result = loginUrlErrorObj;
        }
        return result;
    });
    //获取列表条码数
    Mock.mock(config.BillWorkbench, BillWorkbenchData);
    //报修 AddRepairBill tb_repairbill_g
    //{\"STATE\":\"A\",\"FAULT_INFO\":\"桌子坏了\",\"FAULT_TYPE\":\"GZDT01\",\"BUILD_ID\":\"440300A002\",\"BUILD_NAME\":\"深圳投资大厦\",\"ADDRESS\":\"深圳市福田区深南大道  [4009]号\",\"REPORT_USER_NAME\":\"报修人A\",\"PHONE\":\"15243641131\",
    //\"ORG_CODE\":\"4403Z01\",\"REPORT_USER_ID\":\"4403010\",\"DEPT_CODE\":\"WXB\",\"CREATE_USER_ID\":\"4403010\",\"REPORT_USER_CODE\":\"4403010\",\"REPORT_ROLE_ID\":\"U011\",\"IS_URGENCY\":0,\"REPORT_TIME\":\"2018-10-11 17:01:35\"}"
    Mock.mock(config.AddRepairBill, null, function (options) {
        var _body = JSON.parse(options.body);
        var no = newGuid();
        console.log('no:' + no)
        let obj = {
            "NO": no,
            "ORG_CODE": _body.ORG_CODE,
            "EQT_WORK_ID": "0",
            "IS_URGENCY": _body.IS_URGENCY,
            "STATE": _body.STATE,
            "REPORT_USER_CODE": _body.REPORT_USER_CODE,
            "CREATE_USER_ID": _body.CREATE_USER_ID,
            "REPORT_USER_NAME": _body.REPORT_USER_NAME,
            "REPORT_ROLE_ID": _body.REPORT_ROLE_ID,
            "PHONE": _body.PHONE,
            "DEPT_CODE": _body.DEPT_CODE,
            "FAULT_INFO": _body.FAULT_INFO,
            "ADDRESS": _body.ADDRESS,
            "SOURCE": "C",
            "FAULT_TYPE": _body.FAULT_TYPE,
            "LABOR_COST": 0,
            "PART_COST": 0,
            "SUMMARY": null,
            "RECEIVE_TYPE": 0,
            "BOOK_TIME": null,
            "EQ_ID": null,
            "EQP_NAME": null,
            "ACCEPT_USER_ID": "1",
            "SIGN_TIME": null,
            "ACCEPT_TIME": null,
            "DISPATCH_USER_ID": null,
            "FINISH_SIGN": null,
            "FINISH_TIME": null,
            "FINISH_INFO": null,
            "DISPATCH_TIME": null,
            "NEED_HELP": false,
            "NEED_DISPATCH": false,
            "HELP_SEND_USER_ID": null,
            "HELP_SEND_TIME": null,
            "CONFIRM_USER_ID": null,
            "CONFIRM_TIME": null,
            "CONFIRM_STATUS": 0,
            "CONFIRM_SIGN": null,
            "REPORT_TIME": _body.REPORT_TIME,
            "PRESS_NUM": 0,
            "PRESS_FIRST_TIME": "2018-10-11T15:40:40",
            "PRESS_LAST_TIME": "2018-10-11T15:40:40",
            "MEMO": null,
            "DEPT_CODE_NAME": "",
            "FAULT_NAME": getNamebyTypeId(_body.FAULT_TYPE),
            "REPAIR_USER_NAME": null,
            "REPAIR_DEPT_NAME": null,
            "MONEY": 2,
            "HOURS": 1,
            "IS_WAITING": 0,
            "OTHER_DEV_NAME": null,
            "BUILD_ID": _body.BUILD_ID,
            "LIMIT_TIME": _body.LIMIT_TIME || null,
            "BUILD_NAME": _body.BUILD_NAME,
            "DIST_ID": "440303",
            "IsOverTime": 0,
            "sys_updatetime": new Date().toLocaleString()
        };
        console.log('obj:' + JSON.stringify(obj))
        _database.add('tb_repairbill_g', [obj], function (res) {
            console.log("添加维修工单：" + res);//成功
        });
        //添加跟踪记录
        let billExecute = {
            "ID": newGuid(),
            "createdate": "",
            "BILL_NO": no,
            "BUSINESS_TYPE": "R",
            "STATE": 'A',
            "CREATE_USER_ID": _body.CREATE_USER_ID,
            "CREATE_TIME": _body.REPORT_TIME,
            "RESULT": "提交报修单",
            "MESSAGE": null,
            "CREATE_TIMEStr": _body.REPORT_TIME,
            "STATE_Text": g.getStatusNameById('A'),
            "UserName": _body.REPORT_USER_NAME,
            "RoleName": null,
            "OpeType": null,
            "sys_updatetime": "0001-01-01T00:00:00"
        }
        addBillExecute(billExecute);
        return { "StatusCode": 200, "Message": null, "Data": no };
    });
    //获取工单图片GetBillFile 
    //获取故障类型 GetFaultType
    Mock.mock(config.GetFaultType, {
        "StatusCode": 200,
        "Message": null,
        "Data": [{
            "CODE": "GZDT01",
            "EQT_ID": "4403Z01",
            "NAME": "电梯故障",
            "sys_updatetime": "2018-09-19T11:03:55.670795Z",
            "STATE": 1,
            "CREATE_USER_ID": "zouqj",
            "MODIFY_TIME": null,
            "MODIFY_USER_ID": null,
            "CREATE_TIME": "2018-09-19T11:03:55"
        }, {
            "CODE": "GZDT02",
            "EQT_ID": "4403Z01",
            "NAME": "水表坏了",
            "sys_updatetime": "2018-09-19T11:04:06.984182Z",
            "STATE": 1,
            "CREATE_USER_ID": "zouqj",
            "MODIFY_TIME": null,
            "MODIFY_USER_ID": null,
            "CREATE_TIME": "2018-09-19T11:04:06"
        }
        , {
            "CODE": "GZDT03",
            "EQT_ID": "4403Z01",
            "NAME": "其它设备",
            "sys_updatetime": "2018-09-19T11:04:06.984182Z",
            "STATE": 1,
            "CREATE_USER_ID": "zouqj",
            "MODIFY_TIME": null,
            "MODIFY_USER_ID": null,
            "CREATE_TIME": "2018-09-19T11:04:06"
        }]
    });
    //行政区域
    Mock.mock(config.QueryAllDistrictTree, QueryAllDistrictTreeData);
    //建筑数据列表 GetBuildsPage
    Mock.mock(config.GetBuildsPage, GetBuildsPageData);
    //抢单/派工 AssignPersonRepair
    //"{\"NO\":\"W4403Z01181011002\",\"HELP_SEND_USER_ID\":\"4403006\",\"STATE\":\"B\",\"HELP_SEND_TIME\":\"2018-10-12 14:58:44\",\"ORG_CODE\":\"4403Z01\",\"ACCEPT_USER_ID\":\"4403006\"}"
    Mock.mock(config.AssignPersonRepair, null, function (options) {
        var _body = JSON.parse(options.body);
        //本地修改工单状态、更新时间
        _database.update('tb_repairbill_g', 'NO', _body.NO, { "STATE": "B", "ACCEPT_TIME": g.operationDate(0), "ACCEPT_USER_ID": _body.ACCEPT_USER_ID, "HELP_SEND_USER_ID": _body.HELP_SEND_USER_ID, "HELP_SEND_TIME": _body.HELP_SEND_TIME }, function (res) {
            console.log("res:" + res);
        });
        //添加跟踪记录
        let obj = {
            "ID": newGuid(),
            "createdate": "",
            "BILL_NO": _body.NO,
            "BUSINESS_TYPE": "R",
            "STATE": 'B',
            "CREATE_USER_ID": _body.ACCEPT_USER_ID,
            "CREATE_TIME": g.operationDate(0),
            "RESULT": "分配工作人员",
            "MESSAGE": null,
            "CREATE_TIMEStr": g.operationDate(0),
            "STATE_Text": g.getStatusNameById('B'),
            "UserName": getUserNameByUserId(_body.ACCEPT_USER_ID),
            "RoleName": null,
            "OpeType": null,
            "sys_updatetime": "0001-01-01T00:00:00"
        }
        addBillExecute(obj);
        addExecuteBillNums(_body.ACCEPT_USER_ID);
        return { "StatusCode": 200, "Message": null, "Data": 1 };
    });

    //转单
    Mock.mock(config.TransferRepair, null, function (options) {
        var _body = JSON.parse(options.body);
        //本地修改工单状态、更新时间
        _database.update('tb_repairbill_g', 'NO', _body.NO, { "STATE": _body.STATE, "ACCEPT_TIME": g.operationDate(0), "ACCEPT_USER_ID": _body.ACCEPT_USER_ID, "HELP_SEND_USER_ID": _body.HELP_SEND_USER_ID, "HELP_SEND_TIME": _body.HELP_SEND_TIME }, function (res) {
            console.log("res:" + res);
        });
        //添加跟踪记录
        let obj = {
            "ID": newGuid(),
            "createdate": "",
            "BILL_NO": _body.NO,
            "BUSINESS_TYPE": "R",
            "STATE": 'B',
            "CREATE_USER_ID": _body.ACCEPT_USER_ID,
            "CREATE_TIME": g.operationDate(0),
            "RESULT": "转单",
            "MESSAGE": null,
            "CREATE_TIMEStr": g.operationDate(0),
            "STATE_Text": g.getStatusNameById('B'),
            "UserName": getUserNameByUserId(_body.ACCEPT_USER_ID),
            "RoleName": null,
            "OpeType": null,
            "sys_updatetime": "0001-01-01T00:00:00"
        }
        addBillExecute(obj);
        return { "StatusCode": 200, "Message": null, "Data": 1 };
    });
    //退单RepairBillBack
    Mock.mock(config.RepairBillBack, null, function (options){
        var _body = JSON.parse(options.body);
        //本地修改工单状态、更新时间
        _database.update('tb_repairbill_g', 'NO', _body.billNo, { "STATE": "A", "ACCEPT_TIME": null, "ACCEPT_USER_ID": null, "HELP_SEND_USER_ID": "", "HELP_SEND_TIME": "" }, function (res) {
            console.log("res:" + res);
        });
        //添加跟踪记录
        let obj = {
            "ID": newGuid(),
            "createdate": "",
            "BILL_NO": _body.billNo,
            "BUSINESS_TYPE": "R",
            "STATE": 'A',
            "CREATE_USER_ID": config.USER_ID,
            "CREATE_TIME": g.operationDate(0),
            "RESULT": "退单",
            "MESSAGE": null,
            "CREATE_TIMEStr": g.operationDate(0),
            "STATE_Text": g.getStatusNameById('A'),
            "UserName": getUserNameByUserId(config.USER_ID),
            "RoleName": null,
            "OpeType": null,
            "sys_updatetime": "0001-01-01T00:00:00"
        }
        addBillExecute(obj);
        return { "StatusCode": 200, "Message": null, "Data": 1 };
    })
    //签到 SignRepair
    //{"NO":"W4403Z01181011002","STATE":"B","SOURCE":1,"money":2,"hour":1,"SIGN_TIME":"2018-10-12 15:08:18","REPORT_TIME":"2018-10-12 15:08:18","BOOK_TIME":"2018-10-12 15:08:18","ACCEPT_USER_ID":"4403006","REPORT_USER_NAME":"邹琼俊","PHONE":"15243641131","ORG_CODE":"4403Z01","REPORT_USER_ID":"4403006","DEPT_CODE":"6201X01DEP1"} at js/common/global.js:282
    Mock.mock(config.SignRepair, null, function (options) {
        var _body = JSON.parse(options.body);
        //本地修改工单状态、更新时间
        _database.update('tb_repairbill_g', 'NO', _body.NO, { "STATE": "C", "SIGN_TIME": g.operationDate(0), 'REPAIR_USER_NAME': getUserNameByUserId(config.USER_ID), 'REPAIR_DEPT_NAME': getDeptNameByUserId(config.USER_ID) }, function (res) {
            console.log("res:" + res);
        });
        //添加跟踪记录
        let obj = {
            "ID": newGuid(),
            "createdate": "",
            "BILL_NO": _body.NO,
            "BUSINESS_TYPE": "R",
            "STATE": 'C',
            "CREATE_USER_ID": config.USER_ID,
            "CREATE_TIME": g.operationDate(0),
            "RESULT": "工作人员到场签到",
            "MESSAGE": null,
            "CREATE_TIMEStr": g.operationDate(0),
            "STATE_Text": g.getStatusNameById('C'),
            "UserName": getUserNameByUserId(_body.ACCEPT_USER_ID),
            "RoleName": null,
            "OpeType": null,
            "sys_updatetime": "0001-01-01T00:00:00"
        }
        addBillExecute(obj);
        return { "StatusCode": 200, "Message": null, "Data": 1 };
    });
    //完工FinishRepair
    //"{\"NO\":\"W4403Z01181011002\",\"FINISH_SIGN\":\"4403006\",\"FINISH_TIME\":\"2018-10-12 15:26:02\",\"STATE\":\"C\",\"FAULT_TYPE\":\"GZDT01\",\"ORG_CODE\":\"4403Z01\",\"CREATE_USER_ID\":\"4403006\",\"FINISH_INFO\":\"完工\"}" at js/common/global.js:282
    Mock.mock(config.FinishRepair, null, function (options) {
        var _body = JSON.parse(options.body);
        var orderObj = { "STATE": "E", "FINISH_TIME": g.operationDate(0), FINISH_SIGN: _body.FINISH_SIGN, FAULT_TYPE: _body.FAULT_TYPE, "FINISH_INFO": _body.FINISH_INFO, FAULT_NAME:getNamebyTypeId(_body.FAULT_TYPE) };
        //本地修改工单状态、更新完工时间、
        _database.update('tb_repairbill_g', 'NO', _body.NO, orderObj, function (res) { });
        //添加跟踪记录
        let obj = {
            "ID": newGuid(),
            "createdate": "",
            "BILL_NO": _body.NO,
            "BUSINESS_TYPE": "R",
            "STATE": 'E',
            "CREATE_USER_ID": config.USER_ID,
            "CREATE_TIME": g.operationDate(0),
            "RESULT": "工单结束",
            "MESSAGE": null,
            "CREATE_TIMEStr": g.operationDate(0),
            "STATE_Text": g.getStatusNameById('E'),
            "UserName": getUserNameByUserId(config.USER_ID),
            "RoleName": null,
            "OpeType": null,
            "sys_updatetime": "0001-01-01T00:00:00"
        }
        addBillExecute(obj);
        removeExecuteBillNums(config.USER_ID);
        return { "StatusCode": 200, "Message": null, "Data": 1 };
    });
    //添加工单图片 tb_billfile_g
    Mock.mock(config.AddBillFile, null, function (options) {
        //{"BILL_NO":"W4403Z01181012001","BUSINESS_TYPE":"R","SUB_TYPE":"A","FILENAME":"F_SMP-20181012134401868P81008-122534.jpg","FILE_PATH":"c960ba12-cf85-41c3-860f-4aa1249b7898","CREATE_USER_ID":"4403006","CREATE_TIME":"2018-10-12T05:45:57.644Z"}
        var _body = JSON.parse(options.body);
        _database.add('tb_billfile_g', [_body], function (res) {
            console.log("添加工单图片：" + res);//成功
        },true);
        return { "StatusCode": 200, "Message": null, "Data": 1 };
    });
    //获取头像
    //Mock.mock(config.GetUserHeaderPic, {
    //    "StatusCode": 200,
    //    "Message": null,
    //    "Data": {
    //        "source": "APP",
    //        "headerPic": {
    //            "_id": "5bbf15783e652c19486be1e8",
    //            "PATH_CODE": "4125e757-484c-4a62-b9b9-21aed6f0f037",
    //            "FILE_PATH": "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3643687533,272026720&fm=58",//"\\logs\\FileUpload\\2018\\1011\\4125e757-484c-4a62-b9b9-21aed6f0f037.jpg",
    //            "SOURCENAME": "mmexport1538316890602.jpg",
    //            "CREATE_USER_ID": null,
    //            "CREATE_TIME": "2018-10-11T09:18:48.575Z",
    //            "sys_updatetime": "0001-01-01T00:00:00Z"
    //        }
    //    }
    //});
    //设置头像SetUserHeaderPic
    Mock.mock(config.SetUserHeaderPic, null, function (options) {
        var _body = JSON.parse(options.body);
        var data= {
            userId: config.USER_ID,
            pathCode: _body.pathCode
        }
        _database.remove('tb_myheader_g', "where userId='" + config.USER_ID + "'", function () {
            _database.add('tb_myheader_g', [data], function (res) {
                console.log("设置头像：" + res);//成功
            });
        });
        return { "StatusCode": 200, "Message": null, "Data": 1 };
    });
    //GetBuildInfo
    Mock.mock(config.GetBuildInfo, null, function (options) {
        var _body = JSON.parse(options.body); //{"bid":"440300A002"}
        var bid = _body.bid;
        var list = GetBuildsPageData.Data.List;
        var result = "";
        for (var i = 0; i < list.length; i++) {
            if (list[i].BUILD_ID == bid) {
                result = list[i];
                break;
            }
        }
        return { "StatusCode": 200, "Message": null, "Data": result };
    });
    //通讯录列表
    Mock.mock(config.QueryAddrList, {
        "StatusCode": 200,
        "Message": null,
        "Data": [{
            "DEP_NAME": "维修一部",
            "LSTUSER": [{
                "NAME": "报修人A",
                "PHONE": "15243641131"
            },{
                "NAME": "李存孝",
                "PHONE": "13249838340"
            }, {
                "NAME": "李星云",
                "PHONE": "18688837771"
            }]
        }, {
            "DEP_NAME": "维修二部",
            "LSTUSER": [{
                "NAME": "班组A",
                "PHONE": "13200000002"
            }, {
                "NAME": "狄仁杰",
                "PHONE": "13537872524"
            }, {
                "NAME": "李茂贞",
                "PHONE": "13923804430"
            }]
        }, {
            "DEP_NAME": "运维三部",
            "LSTUSER": [{
                "NAME": "邹玉杰",
                "PHONE": "13249838332"
            }, {
                "NAME": "钟哲颖",
                "PHONE": "13249838332"
            }, {
                "NAME": "邹琼俊",
                "PHONE": "18673126640"
            }]
        }]
    });
    //奖励金额 BillRewardForUser
    Mock.mock(config.BillRewardForUser, { "StatusCode": 200, "Message": null, "Data": { "Amount_ToDay": "0", "Amount_Month": "4.00", "Amount_One": "0.00", "Amount_Two": "0.00", "Amount_Three": "0.00", "Amount_Four": "0.00", "Amount_Five": "0.00", "Amount_Six": "0.00", "Amount_Seven": "0.00", "Amount_Eight": "0.00", "Amount_Nine": "1.00", "Amount_Ten": "4.00", "Amount_Eleven": "0.00", "Amount_Twelve": "0.00", "Detail_List": [] } });
    //打卡记录GetPunch
    Mock.mock(config.GetPunch, { "StatusCode": 200, "Message": null, "Data": [] });
    //备件库存信息
    Mock.mock(config.GetEqPartsStore, { "StatusCode": 200, "Message": null, "Data": [] });
    //值班管理
    Mock.mock(config.GetScheduleInfo, { "StatusCode": 200, "Message": null, "Data": [] });
    //数据中心QueryWorkLoadQty
    Mock.mock(config.QueryWorkLoadQty, {"StatusCode":200,"Message":null,"Data":[{"BusinessType":"R","NoFinishQty":4,"FinishQty":2},{"BusinessType":"C","NoFinishQty":2,"FinishQty":1},{"BusinessType":"M","NoFinishQty":3,"FinishQty":1},{"BusinessType":"A","NoFinishQty":2,"FinishQty":0}]});
    //经验库GetExperiencePage
    Mock.mock(config.GetExperiencePage, {"StatusCode":200,"Message":null,"Data":{"lstData":[{"_id":"5ba0b7e83e652c0480aed769","ID":"5ba0b7e83e652c0480aed769","CODE":"品牌二","EQT_TYPE":"监测运维500栋","FAULT_TYPE":"采集器掉线","TITLE":"空调不凉，没有冷风。","CONTENT":"髟","METHOD":"","CREATE_USER_ID":"qyyy1","FILE":"Isee0002调度巡检所有工单查询.png,992d94df-c8f7-4e62-9162-b4d6989e007b","CREATE_TIME":"2018-09-17T08:31:36Z","MOFIFY_USER_ID":"qyyy1","MODIFY_TIME":"2018-09-18T08:32:46Z","sys_updatetime":"0001-01-01T00:00:00Z"},{"_id":"5a34818c3e65310f0c299801","ID":"5a34818c3e65310f0c299801","CODE":"品牌二","EQT_TYPE":"E0F01","FAULT_TYPE":"GZKT01","TITLE":"压缩机吸合，空调系统不制冷","CONTENT":"压缩机吸合，空调系统不制冷","METHOD":"","CREATE_USER_ID":"07qyy1","FILE":null,"CREATE_TIME":"2017-12-14T18:14:36Z","MOFIFY_USER_ID":"00qyy1","MODIFY_TIME":"2017-12-26T06:20:10Z","sys_updatetime":"0001-01-01T00:00:00Z"},{"_id":"5a3096353e652c131c1f348a","ID":"5a3096353e652c131c1f348a","CODE":null,"EQT_TYPE":"Z0C1","FAULT_TYPE":"GZKT01","TITLE":"空调不制冷","CONTENT":"压缩机及其他零部件一直运行，但不制冷","METHOD":"","CREATE_USER_ID":"6qyy1","FILE":null,"CREATE_TIME":"2017-12-13T02:53:41Z","MOFIFY_USER_ID":null,"MODIFY_TIME":"0001-01-01T00:00:00Z","sys_updatetime":"0001-01-01T00:00:00Z"},{"_id":"5a2f44253e652c138001bc16","ID":"5a2f44253e652c138001bc16","CODE":"品牌二","EQT_TYPE":"E0B10","FAULT_TYPE":"GZKT03","TITLE":"制冷剂全部泄漏了","CONTENT":"压缩机不吸合，空调系统不工作，系统没有压力","METHOD":"","CREATE_USER_ID":"14qyy1","FILE":null,"CREATE_TIME":"2017-12-11T18:51:17Z","MOFIFY_USER_ID":"14qyy1","MODIFY_TIME":"2017-12-12T02:51:41Z","sys_updatetime":"0001-01-01T00:00:00Z"},{"_id":"5a2f48cb3e652c138001bc18","ID":"5a2f48cb3e652c138001bc18","CODE":null,"EQT_TYPE":null,"FAULT_TYPE":"GZKT05","TITLE":"空调系统内有空气混入","CONTENT":"空调系统高、低压压力偏高，高压侧压力表指针摆动较慢，摆幅大，压缩机排气管表面温度很高（烫手）\r\n","METHOD":"","CREATE_USER_ID":"14qyy1","FILE":"0014.jpg,9bd84b50-f623-4e02-9a20-d5619e1cfb99","CREATE_TIME":"2017-12-11T03:11:07Z","MOFIFY_USER_ID":"14qyy1","MODIFY_TIME":"2017-12-12T03:12:26Z","sys_updatetime":"0001-01-01T00:00:00Z"},{"_id":"5a27d9943e652c11f04f543c","ID":"5a27d9943e652c11f04f543c","CODE":null,"EQT_TYPE":"Z0C00","FAULT_TYPE":"GZKT03","TITLE":"空调制冷系统漏","CONTENT":"空调制冷系统漏","METHOD":"","CREATE_USER_ID":"hzqyy","FILE":null,"CREATE_TIME":"2017-12-06T11:50:44Z","MOFIFY_USER_ID":null,"MODIFY_TIME":"0001-01-01T00:00:00Z","sys_updatetime":"0001-01-01T00:00:00Z"},{"_id":"5a27d9603e652c11f04f543b","ID":"5a27d9603e652c11f04f543b","CODE":null,"EQT_TYPE":"Z0C00","FAULT_TYPE":"GZKT02","TITLE":"空调焊堵","CONTENT":"空调焊堵","METHOD":"","CREATE_USER_ID":"hzqyy","FILE":null,"CREATE_TIME":"2017-12-06T11:49:52Z","MOFIFY_USER_ID":null,"MODIFY_TIME":"0001-01-01T00:00:00Z","sys_updatetime":"0001-01-01T00:00:00Z"},{"_id":"5a27d9d83e652c11f04f543e","ID":"5a27d9d83e652c11f04f543e","CODE":"品牌一","EQT_TYPE":"Z0C00","FAULT_TYPE":"GZKT05","TITLE":"空调单向阀故障","CONTENT":"空调单向阀故障1","METHOD":"","CREATE_USER_ID":"hzqyy","FILE":null,"CREATE_TIME":"2017-12-06T03:51:52Z","MOFIFY_USER_ID":"12qyy1","MODIFY_TIME":"2017-12-09T08:22:51Z","sys_updatetime":"0001-01-01T00:00:00Z"},{"_id":"5a27d9b43e652c11f04f543d","ID":"5a27d9b43e652c11f04f543d","CODE":null,"EQT_TYPE":null,"FAULT_TYPE":null,"TITLE":"空调四通阀故障","CONTENT":"空调四通阀故障","METHOD":"","CREATE_USER_ID":"hzqyy","FILE":null,"CREATE_TIME":"2017-12-05T11:51:16Z","MOFIFY_USER_ID":"qyyy1","MODIFY_TIME":"2018-09-18T08:36:26Z","sys_updatetime":"0001-01-01T00:00:00Z"}],"recc":9}});
    //帮助QueryAppHelpPage
    Mock.mock(config.QueryAppHelpPage,{"StatusCode":200,"Message":null,"Data":{"List":[{"_id":"5a4afdb73e652c16506e8f0e","ID":null,"TITLE":"APP操作流程","CONTENT":"<p>&nbsp; &nbsp;维修：报修 —&gt;接单 —&gt;签到 —&gt;完工 —&gt;评价<br></p><p>&nbsp;&nbsp; 保养： 接单 —&gt;签到 —&gt;完工&nbsp;<br></p><p>&nbsp;&nbsp; 巡检： 接单 —&gt;签到 —&gt;完工&nbsp;<br></p><p>&nbsp;&nbsp; 报警： 接单 —&gt;签到 —&gt;完工</p>","CREATE_USER_ID":"admin","CREATE_TIME":"2018-01-02T03:34:15Z","MODIFY_USER_ID":null,"MODIFY_TIME":"0001-01-01T00:00:00Z","sys_updatetime":"0001-01-01T00:00:00Z"},{"_id":"5a41e730fc5ead4234a15f56","ID":"5a41e730fc5ead4234a15f56","TITLE":"APP驾驶舱使用方法","CONTENT":"<p>APP驾驶舱使用方法</p>","CREATE_USER_ID":"admin","CREATE_TIME":"2017-12-25T06:07:44Z","MODIFY_USER_ID":"admin","MODIFY_TIME":"2017-12-26T06:21:26Z","sys_updatetime":"0001-01-01T00:00:00Z"},{"_id":"5a3cc64b3e652d0224a59455","ID":"5a3cc64b3e652d0224a59455","TITLE":"一、操盘流程","CONTENT":"<p>1.医护人员</p><p>&nbsp;&nbsp; 报修—&gt;催单\r\n—&gt;评价</p><p>2.运维人员</p><p>&nbsp;&nbsp; 维修：报修\r\n—&gt;接单\r\n—&gt;签到\r\n—&gt;完工\r\n—&gt;评价</p><p>&nbsp;&nbsp; 保养：\r\n接单\r\n—&gt;签到\r\n—&gt;完工 <br></p><p>&nbsp;&nbsp; 巡检：\r\n接单\r\n—&gt;签到\r\n—&gt;完工 <br></p><p>&nbsp;&nbsp; 报警：\r\n接单\r\n—&gt;签到\r\n—&gt;完工 <br></p><p>3.班组人员</p><p>\r\n</p><p>&nbsp;&nbsp; 维修：派工-报修\r\n—&gt;接单\r\n—&gt;签到\r\n—&gt;完工\r\n—&gt;评价</p><p>&nbsp;&nbsp; 保养：\r\n\r\n派工-\r\n\r\n接单\r\n—&gt;签到\r\n—&gt;完工\r\n—&gt;评价 <br></p><p>&nbsp;&nbsp; 巡检：\r\n派工-\r\n\r\n\r\n接单\r\n—&gt;签到\r\n—&gt;完工 <br></p><p>&nbsp;&nbsp; 报警：\r\n派工-\r\n\r\n\r\n接单\r\n—&gt;签到\r\n—&gt;完工 \r\n\r\n—&gt;评价 <br></p><p>4.项目经理</p><p>\r\n</p><p>&nbsp;&nbsp; 维修：派工-报修&nbsp;\r\n—&gt;评价</p><p>&nbsp;&nbsp; 保养：\r\n\r\n派工-\r\n\r\n接单\r\n—&gt;签到\r\n—&gt;完工\r\n—&gt;评价 <br></p><p>&nbsp;&nbsp; 巡检：\r\n派工-\r\n\r\n\r\n接单\r\n—&gt;签到\r\n—&gt;完工 <br></p><p>&nbsp;&nbsp; 报警：\r\n派工-\r\n\r\n\r\n接单\r\n—&gt;签到\r\n—&gt;完工 \r\n\r\n—&gt;评价 </p>\r\n\r\n\r\n\r\n<p><br></p><p><br></p>","CREATE_USER_ID":"admin","CREATE_TIME":"2017-12-22T00:46:03Z","MODIFY_USER_ID":"admin","MODIFY_TIME":"2017-12-26T06:21:33Z","sys_updatetime":"0001-01-01T00:00:00Z"}],"recc":3}});
}
