window.PointerEvent = void 0
var old_back = mui.back;
var wo = null; //父webview
var ppView = null; //上上webview
var draw = null;
var app = new Vue({
	el: "#app",
	data: {
		data_v: {
			BUSINESS_TYPE: 'R',
			RESULT: 'true'
		},
		tag: '',
		typeid: ''
	},
	mounted: function() {
		var _self = this;
		mui.init();
		mui.ready(function() {
			var _height = g.getScreenInfo('height');
			//console.log(_width+','+_height);
			g.id("signName").style.height = _height - 345 + 'px';
			draw = new DrawCanvas();
			// 清屏
			var clear = document.getElementById("clearCanvas");
			clear.addEventListener("click", function() {
				draw.clear();
			}, false);
			g.initStar('starInfo'); //初始化评分
			var _btn = document.getElementById("star4"); //默认4星
			mui.trigger(_btn, 'tap');
		});
		mui.plusReady(function() {
			var self = plus.webview.currentWebview();
			wo = self.opener();
			app.data_v.ORG_CODE = config.ORG_CODE;
			_self.data_v.BILL_NO = self.NO;
			_self.data_v.REPORT_USER_ID = config.USER_ID;
			_self.typeid = self.typeid;

			_self.tag = self.tag;
			if(_self.tag == 'detail') {
				ppView = wo.opener(); //当前页的上上页
			}
		});
	},
	methods: {
		btnSubmit: function(url) {
			var score = document.querySelectorAll('.mui-icon-star-filled').length;
			//console.log('score:' + score)
			if(score == 0) {
				mui.toast('服务评价请打分');
				return;
			}
			app.data_v.SCORE = score;

			//生成图片
			var _image = draw.getFile();
			//console.log('_image:' + _image);
			//console.log('haveWriteCanvas:' + haveWriteCanvas);
			if(haveWriteCanvas == false) {
				mui.toast('请填写签名');
				return;
			}

			app.data_v.RESULT = document.getElementById('repairType').checked ? 'true' : 'false';
			//console.log('app.data_v.RESULT:' + app.data_v.RESULT)
			app.data_v.CREATE_TIME = g.formatDate('D', 'YMDHMS');
			app.data_v.CREATE_USER_ID = config.USER_ID;
			app.data_v.NAME = _image.split(',')[1];

			var v = {};
			if(app.typeid == TaskType.maintain.value) {
				v = {
					judge: app.data_v
				};

			} else {
				v = app.data_v;
			}

			g.ajax(url, {
				data: v,
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				headers: {
					'Content-Type': 'application/json'
				},
				success: function(data) {
					if(data && data.Data == 1) {
						mui.toast('评价成功');
						if(app.tag == 'detail' && ppView) { //从详情页过来的，返回到上上页
							if(app.data_v.RESULT=='true'){
							g.reFresh(wo, {
								STATE: WorkOrderStatus.Over.value
							});
							}
							else{
								g.reFresh(wo, {
								STATE: WorkOrderStatus.waitOver.value
							});
							}
							setTimeout(function() {
								old_back();
								//console.log('回退');
							}, 300);
						    ppView.evalJS("getListAll()"); //刷新列表  
						} else {
							setTimeout(function() {
								old_back();
								//console.log('回退');
							}, 300);
							old_back();
							wo.evalJS("getListAll()"); //刷新列表  
						}
					} else {
						mui.toast('评价失败');
					}
				}
			});
		}
	}
});