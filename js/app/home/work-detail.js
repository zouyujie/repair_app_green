var _database = new smpWebSql();
var owDetail = null; //明细的父webview
var nwaiting = null;
var nav = new Vue({
    el: '#nav',
    data: {
        typeid: '', //业务类型ID
        uid: '', //工单主键、编号
        statusid: '', //工单状态
        roleid: g.AppRoleType, //app角色类型
        ACCEPT_USER_ID: '', //接受人
        CREATE_USER_ID: '', //报修人
        IsOverTime: '',//是否过期
        showTool: false, //是否显示按钮工具栏
        showAcceptText: '立即抢单', //显示初始化工单状态文本
        frompage: '', //列表来源标记
        PRESS_NUM: '',
        IS_WAITING: 0,//待料
        NoRepertoryTxt: '无库存提醒',
        NoRepertoryIng: false,//无库存提醒按钮是否禁用
        OverOrderIng: false,//完工按钮是否禁用
        showCtr: {
            iswaitOrder: false,
            iswaitSignin: false,
            iscustomer: false, //是否报修人员
            isleader: false, //是否是班组
            ispm: false,//是否是项目经理
            isrepairman: false,//是否是维修人员
            isaccept: false, //是否是接单人
            iscreate: false,//是否是工单报修人
            canOverOrder: false,//可进行完工操作
            canAudit: false,//可进行审核
            canSignin: false,//可签到
            iscancleOrder: false, //可撤单
            canReminderOrder: false //可催单
        }
    },
    mounted: function () {
        var _self = this;
        mui.init();
        mui.previewImage();
        mui.plusReady(function () {
            var self = plus.webview.currentWebview();
            owDetail = self.opener();
        });
    },
    methods: {
        //控制催单按钮文本
        ctrlReminderOrderTxt: function () {
            return (nav.PRESS_NUM == '' || nav.PRESS_NUM == 0) ? '催单' : '已催单';
        },
        //撤单-维修
        cancleOrder: function (item) {
            var orderNumber = '';
            if (item == '') {
                orderNumber = nav.uid;
            } else {
                orderNumber = item.orderNumber;
            }
            g.ajax(config.RepairBillRevoke, {
                data: {
                    billNo: orderNumber,
                    userId: config.USER_ID
                },
                success: function (data) {
                    console.log('撤单-维修:'+JSON.stringify(data))
                    if (data.StatusCode == '200' && data.Data == '1') {
                        mui.toast('撤单成功');
                        if (nav.statusid == WorkOrderStatus.waitOrder.value) //待处理工单
                        {
                            owDetail.evalJS("refleshView(0,'" + nav.uid + "','" + WorkOrderStatus.Revoke.value + "','" + nav.typeid + "');");
                        } else {
                            owDetail.evalJS("refleshView(1,'" + nav.uid + "','" + WorkOrderStatus.Revoke.value + "','" + nav.typeid + "');");
                        }
                        setTimeout(mui.back(), 300);
                    } else {
                        mui.toast('撤单失败');
                    }
                }
            });
        },
        //退单-维修
        backOrder: function () {
            var orderNumber = nav.uid;
            var api = '';
            if (nav.typeid == TaskType.repair.value) {
                api = config.RepairBillBack;
            }
            g.ajax(api, {
                data: {
                    billNo: orderNumber,
                    userId: config.USER_ID
                },
                success: function (data) {
                    console.log('退单-维修:'+JSON.stringify(data))
                    if (data.StatusCode == '200' && data.Data == '1') {
                        mui.toast('退单成功');
                        owDetail.evalJS("refleshView(1,'" + nav.uid + "','" + WorkOrderStatus.waitOrder.value + "','" + nav.typeid + "');");
                        setTimeout(mui.back(), 300);
                    } else {
                        mui.toast('退单失败');
                    }
                }
            });
        },
        //催单-维修
        reminderOrder: function (item) {
            var orderNumber = '';
            if (item == '') {
                orderNumber = nav.uid;
            } else {
                orderNumber = item.orderNumber;
            }
            g.ajax(config.RepairBillPress, {
                data: {
                    NO: orderNumber,
                    ORG_CODE: config.ORG_CODE
                },
                success: function (data) {
                    console.log('催单-维修:'+JSON.stringify(data))
                    if (data.StatusCode == '200' && data.Data == '1') {
                        mui.toast('催单成功');
                        owDetail.evalJS("getListAll()"); //刷新列表
                        setTimeout(mui.back(), 300);
                    } else {
                        mui.toast('催单失败');
                    }
                }
            });
        },
        //派工
        dispatching: function (tag) {
            persons.NO = nav.uid;
            persons.typeid = nav.typeid;
            persons.getUsers(persons);
            if (tag != undefined) {
                persons.operationType = tag;
            }
            mui('#popover').popover('show'); //show hide toggle
        },
        //请求支援
        forHelp: function (typeid) {
            g.openWindowWithTitle({
                url: '../for-help.html',
                id: 'for-help',
                extras: {
                    NO: nav.uid,
                    typeid: typeid
                }
            }, '申请请求支援');
        },
        //填写完工单
        writeOrder: function (tag) {
            g.openWindow({
                url: 'over-order.html',
                id: nav.typeid + '_over-order',
                extras: {
                    NO: nav.uid,
                    tag: tag
                }
            });
        },
        //立即抢单
        getOrder: function () {
            var v = {},
				api = '';
            var userId = config.USER_ID;
            if (nav.typeid == TaskType.repair.value) {
                v = JSON.stringify({
                    NO: nav.uid,
                    HELP_SEND_USER_ID: userId,
                    STATE: WorkOrderStatus.waitSignin.value,
                    HELP_SEND_TIME: g.formatDate('D', 'YMDHMS'),
                    ORG_CODE: config.ORG_CODE,
                    ACCEPT_USER_ID: userId
                });
                api = config.AssignPersonRepair;
            } 
            else {
                return;
            }
            g.ajax(api, {
                data: v,
                type: 'post', //HTTP请求类型
                success: function (data) {
                    console.log('立即抢单:' + JSON.stringify(data));
                    if (data.StatusCode == '200') {
                        mui.toast('抢单成功');
                        owDetail.evalJS("refleshView(-1,'" + nav.uid + "','" + WorkOrderStatus.waitSignin.value + "','" + nav.typeid + "');");
                        setTimeout(mui.back(), 300);
                        persons.getUsers(persons);
                    }
                }
            })
        },
        //无库存提醒
        noRepertoryWarn: function () {
            nav.NoRepertoryIng = true;
            var _tag = nav.IS_WAITING == 0 ? 1 : 0;
            g.ajax(config.SendPuchaseNote, {
                data: {
                    NO: nav.uid,
                    UserId: config.USER_ID,
                    Tag: _tag
                },
                success: function (data) {
                    console.log('无库存提醒:' + JSON.stringify(data));
                    if (data.StatusCode == '200') {
                        if (_tag == 1) {
                            nav.IS_WAITING = 1;
                            nav.NoRepertoryTxt = "继续维修";
                            nav.OverOrderIng = true;
                        } else {
                            nav.IS_WAITING = 0;
                            nav.NoRepertoryTxt = "无库存提醒";
                            nav.OverOrderIng = false;
                        }
                        mui.toast('操作成功');
                        getListAll(); //刷新列表
                    }
                    nav.NoRepertoryIng = false;
                },
                error: function () {
                    nav.NoRepertoryIng = false;
                }
            })
        },
        //签到
        signin: function (page, money, hour) {
            if (true) {//维修
                var data_v = {};
                var api = '';
                if (nav.typeid == TaskType.repair.value) {
                    api = config.SignRepair;
                    data_v = {
                        NO: nav.uid,
                        STATE: WorkOrderStatus.waitSignin.value,
                        SOURCE: 1,
                        money: money,
                        hour: hour,
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
                                if (page == 'home') {
                                    owDetail.evalJS("refleshView(0,'" + nav.uid + "','" + WorkOrderStatus.waitOver.value + "','" + nav.typeid + "');");
                                }
                                setTimeout(mui.back(), 300);
                            }
                        }
                    });
                } else {
                    if (nav.typeid == TaskType.repair.value) { //维修
                        _database.add(smp_tb.signin_tb, [data_v], function (ares) {
                            console.log('ares:' + ares);
                        });
                        //本地修改工单状态、更新签到时间
                        _database.update(smp_tb.repair_tb, 'NO', nav.uid, { "STATE": "C", "SIGN_TIME": g.operationDate(0) }, function (ures) {
                            console.log("ures:" + ures);
                            mui.toast('离线签到成功！');
                            owDetail.evalJS("refleshView(0,'" + nav.uid + "','" + WorkOrderStatus.waitOver.value + "','" + nav.typeid + "');");
                            setTimeout(mui.back(), 300);
                        });
                    }
                }
            } else {
                g.openWindowWithTitle({
                    url: '../img-signin.html',
                    id: 'img-signin',
                    extras: {
                        typeid: nav.typeid,
                        NO: nav.uid,
                        money: money,
                        hour: hour,
                        page: page,
                        isWating: nav.IS_WAITING
                    }
                }, '拍照签到');
            }
        },
        //评价
        audit: function (tag) {
            g.openWindow({
                url: 'sure.html',
                id: 'sure',
                extras: {
                    typeid: nav.typeid,
                    NO: nav.uid,
                    tag: tag
                }
            });
        },
        show_Ctr: function (statusid, isWating) {
            showBtnCtrFun(nav, statusid, isWating);
        }
    }
});
//按钮显示控制
function showBtnCtrFun(nav, statusid, isWating) {
    var roleid = nav.roleid;
    nav.showCtr.iscustomer = (roleid == comm.customer); //是医护人员
    nav.showCtr.ispm = (roleid == comm.pm); //是项目经理
    nav.showCtr.isleader = (roleid == comm.leader); //是班组
    nav.showCtr.isrepairman = (roleid == comm.repairman); //是运维

    var _iswaitOrder = statusid == WorkOrderStatus.waitOrder.value; //是否是待处理订单
    nav.showCtr.iswaitOrder = _iswaitOrder; //待派工
    nav.showCtr.isaccept = (nav.ACCEPT_USER_ID == config.USER_ID); //是接受人 
    nav.showCtr.iscreate = (nav.CREATE_USER_ID == config.USER_ID); //是工单创建者
    nav.showCtr.canAction = (nav.showCtr.isrepairman || nav.showCtr.isleader);//可以进行接单操作的角色
    nav.showCtr.iswaitSignin = statusid == WorkOrderStatus.waitSignin.value; //待签到
    nav.showCtr.iswaitOver = statusid == WorkOrderStatus.waitOver.value; //待完工

    if (isWating != undefined) {
        nav.IS_WAITING = isWating;
    }
    if (nav.IS_WAITING == 1) {
        nav.NoRepertoryTxt = "继续维修";
        nav.OverOrderIng = true;
    } else if (nav.IS_WAITING == 0) {
        nav.NoRepertoryTxt = "无库存提醒";
        nav.OverOrderIng = false;
    }
    nav.showCtr.isqdan = _iswaitOrder && !nav.showCtr.iscreate && nav.showCtr.canAction;//【抢单】
    nav.showCtr.ispg = (roleid == comm.pm || roleid == comm.leader) && _iswaitOrder;//是否可以派工【派工】
    nav.showCtr.canSignin = (statusid == WorkOrderStatus.waitSignin.value && nav.showCtr.isaccept && nav.showCtr.canAction); //可拍照签到【签到】
    nav.showCtr.canOverOrder = (statusid == WorkOrderStatus.waitOver.value && nav.showCtr.isaccept && nav.showCtr.canAction); //可执行完工【完工】
    if (roleid == comm.repairman) //运维/外包运维
    {
        nav.showCtr.canAudit = statusid == WorkOrderStatus.waitAudit.value && nav.showCtr.iscreate;
    } else {
        nav.showCtr.canAudit = statusid == WorkOrderStatus.waitAudit.value && ((nav.showCtr.iscreate && nav.typeid == TaskType.repair.value) || nav.typeid != TaskType.repair.value); //可评价审核 【评价】
    }
    nav.showCtr.iscancleOrder = nav.showCtr.iscreate && nav.typeid == TaskType.repair.value && (_iswaitOrder || statusid == WorkOrderStatus.waitSignin.value); //可撤单【撤单】
    nav.showCtr.isbackOrder = nav.showCtr.isaccept && statusid == WorkOrderStatus.waitSignin.value;//可退单【退单】
    nav.showCtr.canReminderOrder = nav.showCtr.iscreate && _iswaitOrder; //可催单【催单】
    nav.showCtr.iszd = (statusid == WorkOrderStatus.waitSignin.value || statusid == WorkOrderStatus.waitOver.value) && nav.showCtr.ispm;//可转单【转单】

    if (statusid == WorkOrderStatus.Over.value || statusid == WorkOrderStatus.Revoke.value) { //总部查看、已完工、已撤单
        nav.showTool = false;
    }
    else if (roleid == comm.customer) {
        nav.showTool = (nav.showCtr.iscancleOrder || nav.showCtr.canReminderOrder || nav.showCtr.canAudit);
    }

    else if ((statusid == WorkOrderStatus.waitOrder.value || statusid == WorkOrderStatus.waitSignin.value || statusid == WorkOrderStatus.waitOver.value)
        && (nav.showCtr.ispm || nav.showCtr.isleader) && (nav.showCtr.isaccept || nav.showCtr.iscreate || nav.showCtr.ispg || nav.showCtr.iszd)) {
        nav.showTool = true;
    }
    else {
        if (_iswaitOrder) {
            if (nav.typeid == TaskType.repair.value && nav.showCtr.ispm) {
                nav.showTool = false;
            } else { nav.showTool = true; }
        } else {
            nav.showTool = nav.showCtr.canOverOrder || nav.showCtr.canAudit || nav.showCtr.canSignin || nav.showCtr.iscancleOrder || nav.showCtr.isbackOrder
                || nav.showCtr.canReminderOrder || nav.showCtr.iszd || nav.showCtr.ispg;
        }
    }
    //console.log('nav.showTool:' + nav.showTool);
}
//初始化返回，对mui back进行重写
function initBack(vm) {
    //重写返回逻辑，返回时隐藏详情页webview并清除数据
    mui.back = function () {
        if (vm.resetData) {
            vm.resetData();//重置页面数据
        }
        window.scrollTo(0, 0);//重置滚动条位置
        plus.webview.currentWebview().hide("auto", 300)
    }
}
function initEvent(vm) {
    //添加showPage自定义事件监听
    window.addEventListener('showPage', function (event) {
        g.showWaiting();
        console.log('event.detail:' + JSON.stringify(event.detail))
        //获得事件参数
        var uid = event.detail.orderNumber;
        if (uid == null || uid == "") {
            return;
        }
        var _typeid = event.detail.typeid;
        var _isOverTime = event.detail.IsOverTime || '';
        var statusid = event.detail.statusid;
        var money = event.detail.money;
        var hour = event.detail.hour;
        if (nav.typeid == TaskType.repair.value) {
            nav.PRESS_NUM = event.detail.PRESS_NUM;
        }
        nav.uid = uid;
        nav.typeid = _typeid;
        nav.statusid = statusid;
        nav.money = money;
        nav.hour = hour;
        nav.ACCEPT_USER_ID = event.detail.ACCEPT_USER_ID;
        nav.CREATE_USER_ID = event.detail.CREATE_USER_ID;
        nav.IsOverTime = event.detail.IsOverTime;//是否过期
        nav.IS_WAITING = event.detail.IS_WAITING;//是否待料

        nav.frompage = event.detail.frompage;
        vm.frompage = event.detail.frompage;
        console.log('event:' + JSON.stringify(event))
        vm.bcolor = g.getStatusColorById(statusid, 'mui-badge-');
        var _isRepair = nav.typeid == TaskType.repair.value ? true : false;
        vm.statusName = g.getStatusNameById(statusid, _isRepair);

        vm.where.NO = uid;
        vm.where.STATE = statusid;
        vm.where.money = money;
        vm.where.hour = hour;
        var _where = JSON.stringify(vm.where);
        showBtnCtrFun(nav, statusid, nav.IS_WAITING); //按钮显示控制
        if (vm.getDetail != undefined && vm.getDetail != '') { //非报修单
            vm.getDetail();
            return;
        }
        if (vm.targetUrl == undefined || vm.targetUrl == '') {
            return;
        }
        vm.data_r = {};
        g.ajax(vm.targetUrl, {
            data: _where,
            type: 'POST',
            nwaiting: nwaiting,
            success: function (data) {
                if (data.Data.length > 0) {
                    vm.data_r = data.Data[0];
                    if (vm.data_r.hasOwnProperty('BOOK_TIME')) {
                        vm.data_r.BOOK_TIME = g.formatDate(vm.data_r.BOOK_TIME, 'YMDHMS');
                    }
                }
            }
        });
    })
    mui.ready(function () {
        document.getElementById('rackRecord').addEventListener('tap', function () {
            var _id = '../track-record.html';
            g.openWindowWithTitle({
                id: 'track-record',
                url: _id,
                extras: {
                    NO: nav.uid
                }
            }, '跟踪记录');
        });
    });
}

//刷新列表页面
function getListAll() {
    owDetail.evalJS("getListAll()"); //刷新列表
}
//获取建筑信息(工单号，app挂载对象）
function getBuildInfoFun(bid, vm) {
    //加载建筑信息
    g.ajax(config.GetBuildInfo, {
        data: {
            bid: bid,
        },
        success: function (data) {
            console.log('加载建筑信息:' + JSON.stringify(data))
            if (data && data.Data) {
                vm.buildInfo.BUILD_NAME = data.Data.BUILD_NAME;
                vm.buildInfo.ADDRESS = data.Data.ADDRESS;
                vm.buildInfo.TOTAL_AREA = data.Data.TOTAL_AREA + "(㎡)";
                vm.buildInfo.BUILD_TYPE_NAME = data.Data.BUILD_TYPE_NAME;
                vm.buildInfo.TEL = data.Data.TEL;
                vm.buildInfo.CONTACT = data.Data.CONTACT;
                vm.buildInfo.BUILD_ID = data.Data.BUILD_ID;
                if (g.isEmpty(data.Data.CONTACT) && g.isEmpty(data.Data.TEL)) {
                    vm.AddOrEditTxt = '添加';
                } else {
                    vm.AddOrEditTxt = '编辑';
                }
            }
        }
    });
}
/**
 * ----------------------------------展开折叠---------------------------------
 */
//在页面加载完后立即执行多个函数方案。
function addloadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != "function") {
        window.onload = func;
    } else {
        window.onload = function () {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}
addloadEvent(getBlings);
//在页面加载完后立即执行多个函数方案结束。
//获取同级所有元素开始
function siblings(elm) {
    var a = [];
    var p = elm.parentNode.children;
    for (var i = 0, pl = p.length; i < pl; i++) {
        if (p[i] !== elm) a.push(p[i]);
    }
    return a;
}
//获取同级所有元素结束
function getBlings() {
    //获取查看全文的a标签
    var show = document.getElementsByClassName("show");
    //遍历a
    for (var i = 0; i < show.length; i++) {
        show[i].addEventListener('tap', function () {
            //找到a的父级
            var father = this.parentNode;
            //设置隐藏
            father.style.display = "none";
            //找到父级的下一个节点
            var next = father.nextSibling;
            //判断下一个节点的数据类型，如果不是1（元素节点），那就接着往下找
            if (next.nodeType != 1) {
                next = next.nextSibling;
            }
            //正文显示
            next.style.display = "block";
            //获取整个list0
            var ff = this.parentNode.parentNode;
            //获取除去list0的所有同级元素
            var bro = siblings(ff);
            for (var y = 0; y < bro.length; y++) {
                //获取每个list0里的第一个content类名
                var w = bro[y].getElementsByClassName("content")[0];
                //获取content类名的前一个节点
                var wt = w.previousSibling;
                //判断前一个节点的数据类型，如果不是1（元素节点），那就接着往上找
                if (wt.nodeType != 1) {
                    wt = wt.previousSibling;
                }
                //同级摘要部分显示
                wt.style.display = "block";
                //同级全文部分隐藏
                w.style.display = "none";
            }
        })
    }
    //下面就是点击收回全文的部分与展开原理一样
    var hidd = document.getElementsByClassName("hidd");
    for (var i = 0; i < hidd.length; i++) {
        hidd[i].addEventListener('tap', function () {
            var fafa = this.parentNode;
            fafa.style.display = "none";
            var pre = fafa.previousSibling;
            if (pre.nodeType != 1) {
                pre = pre.previousSibling;
            }
            pre.style.display = "block";
        })
    }
}