var persons = new Vue({
	el: '#popover',
	data: {
		list: [],
		sltTypeList: [],
		data_d: {
			lstUser: [{
				NO: '',
				ACCEPT_USER_ID: '',
				BILL_NO: '',
				BUSINESS_TYPE: '',
				BUSINESS_TYPE: '',
				USER_ID: '',
				USER_TYPE: '',
				STATE: '',
				CREATE_TIME: '',
				ORG_CODE: config.ORG_CODE
			}]
		},
		NO: '',
		typeid: '',
		operationType: 'P', //P：派工 Z：转单
        isDel:false
	},
	mounted: function() {
		mui.ready(function() {
		    g.initScroll({
		        id:'mui-scroll-wrapper',
				h: '160px'
			});
		})
	},
	methods: {
		getUsers: function(_self) {
			var persons = _self;
			persons.list = [];
			var v = {
				orgCode: config.ORG_CODE
			};
			var api = config.QueryExecuteUserList;
			if (config.isMock) {
			    _database.read('tb_executeuser_g', '', function (res) {
			        console.log('res:' + JSON.stringify(res))
			        let data = {
			            "StatusCode": 200,
			            "Message": null,
			            "Data": res
			        };
			        //查询执行人员列表
			        if (data.Data) {
			            var dv = [];
			            if (data.Data.length > 0) {
			                for (var i = 0; i < data.Data.length; i++) {
			                    var d = {};
			                    d.id = data.Data[i].USER_ID;
			                    d.typeName = '<span class="person">' + data.Data[i].NAME + '</span><span>目前任务量</span><span class="counts">&nbsp;&nbsp;&nbsp;' + data.Data[i].TaskQty + '</span>';
			                    persons.list.push(d);
			                }
			            }
			        }
			    });
			} else {
			    g.ajax(api, {
			        data: v,
			        type: 'POST',
			        success: function (data) {
			            console.log('QueryExecuteUserList:' + JSON.stringify(data));
			            if (data.Data) {
			                var dv = [];
			                if (data.Data.length > 0) {
			                    for (var i = 0; i < data.Data.length; i++) {
			                        var d = {};
			                        d.id = data.Data[i].USER_ID;
			                        d.typeName = '<span class="person">' + data.Data[i].NAME + '</span><span>目前任务量</span><span class="counts">&nbsp;&nbsp;&nbsp;' + data.Data[i].TaskQty + '</span>';
			                        persons.list.push(d);
			                    }
			                }
			            }
			        }
			    });
			}
		},
		btnSure: function (isBack, frompage) {
			persons.data_d.billNo = persons.NO;
			persons.data_d.dispatchUser = config.USER_ID;

			persons.sltTypeList.splice(0, persons.sltTypeList.length);
			var lst = g.getCheckBoxRes('cbx');

			//根据Id获取集合
			if(lst.length > 0) {
				for(var i = 0; i < 1; i++) { //lst.length
					var _item = g.findDataById(persons.list, lst[i]);
					persons.data_d.lstUser[0].BILL_NO = persons.NO;
					persons.data_d.lstUser[0].NO = persons.NO;
					persons.data_d.lstUser[0].ACCEPT_USER_ID = lst[0];
					persons.data_d.lstUser[0].USER_ID = lst[0];// config.USER_ID;
					persons.data_d.lstUser[0].USER_TYPE = 'B';
					persons.data_d.lstUser[0].STATE = 'B';
					persons.data_d.lstUser[0].CREATE_TIME = new Date();
					console.log('lst[0]：' + lst[0]);
					persons.sltTypeList.push(_item);
				}
			} else {
				mui.toast('请选择派工人');
				return;
			}

			var api = ''
			v = {};
			var billNo = persons.data_d.lstUser[0].BILL_NO;
           if(persons.typeid == TaskType.repair.value) {
				persons.data_d.lstUser[0].BUSINESS_TYPE = BillType.wx.value;
				v = persons.data_d.lstUser[0];
				if (persons.operationType == 'P') {
				    api = config.AssignPersonRepair;
				} else {//转单
				    api = config.TransferRepair;
				}
			}
			console.log('操作参数提交:' + api + ';' + JSON.stringify(v))
			var _userid = persons.data_d.lstUser[0].ACCEPT_USER_ID;
			console.log('frompage:' + frompage);
			persons.isDel = frompage == 'waitdo' ? true : persons.isDel;
			g.ajax(api, {
				data: v,
				type: 'POST',
				success: function(data) {
					if(data.Data == 1) {
						mui('#popover').popover('hide'); //show hide toggle
						persons.getUsers(persons);
						mui.toast('操作成功');
						console.log('billNo:' + billNo)
						if (isBack == true) {//详情
						    owDetail.evalJS("refleshView(1,'" + billNo + "','" + WorkOrderStatus.waitSignin.value + "','" + persons.typeid + "'," + persons.isDel + ",'" + _userid + "');");
							setTimeout(function() {
								mui.back();
							}, 300);
						} else { //主列表界面
						    refleshView(1, billNo, WorkOrderStatus.waitSignin.value, persons.typeid, persons.isDel, _userid);
						}
					} else if(data.Data == 0) {
						mui.toast('操作失败'); 
					}
				}
			})
		}
	}
})