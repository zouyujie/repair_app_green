/**
 * 根据类型ID加载数据列表
 * @param {id} typeId
 */
function getList(typeId) {
	//console.log(typeId)
    var _list = [];
    return _list;
	switch(typeId) {
		case 'alarm':
			_list = [{
					id: 1,
					orderNumber: 'BX20170019260101',
					title: '电梯故障报警',
					msg: '报警时间：2017-6-21 16:20',
					status: WorkOrderStatus.waitOver.value,
					datetime: '2017-09-19:17'
				},
				{
					id: 2,
					orderNumber: 'BX201700192602',
					title: '电梯故障报警',
					msg: '报警时间：2017-6-21 16:20',
					status: WorkOrderStatus.waitAudit.value,
					datetime: '2017-09-19:17'
				},
				{
					id: 3,
					orderNumber: 'BX201700192602',
					title: '电梯故障报警',
					msg: '报警时间：2017-6-21 16:20',
					status: WorkOrderStatus.Over.value,
					datetime: '2017-09-19:17'
				},
				{
					id: 4,
					orderNumber: 'BX201700192602',
					title: '电梯故障报警',
					msg: '报警时间：2017-6-21 16:20',
					status: WorkOrderStatus.waitOrder.value,
					datetime: '2017-09-19:17'
				}
				,
				{
					id: 5,
					orderNumber: 'BX201700192602',
					title: '电梯故障报警',
					msg: '报警时间：2017-6-21 16:20',
					status: 'Q',
					datetime: '2017-09-19:17'
				}
				,
				{
					id: 6,
					orderNumber: 'BX201700192602',
					title: '电梯故障报警',
					msg: '报警时间：2017-6-21 16:20',
					status: WorkOrderStatus.waitSignin.value,
					datetime: '2017-09-19:17'
				}
			];
			break;
		case 'repair':
			_list = [{
					id: 5,
					orderNumber: 'BX2017001901',
					title: '报修部门：门诊科',
					msg: '#1电梯不能允许',
					status: WorkOrderStatus.waitOver.value,
					datetime: '2017-09-19:17'
				},
				{
					id: 2,
					orderNumber: 'BX20170019',
					title: '报修部门：门诊科',
					msg: '#1电梯不能允许',
					status: WorkOrderStatus.waitAudit.value,
					datetime: '2017-09-19:17'
				},
				{
					id: 3,
					orderNumber: 'BX20170019',
					title: '报修部门：门诊科',
					msg: '#1电梯不能允许',
					status: WorkOrderStatus.Over.value,
					datetime: '2017-09-19:17'
				},
				{
					id: 4,
					orderNumber: 'BX20170019',
					title: '报修部门：门诊科',
					msg: '#1电梯不能允许',
					status: WorkOrderStatus.waitOrder.value,
					datetime: '2017-09-19:17'
				},
				{
					id: 5,
					orderNumber: 'BX20170019',
					title: '报修部门：门诊科',
					msg: '#1电梯不能允许',
					status: 'R',
					datetime: '2017-09-19:17'
				},
				{
					id: 6,
					orderNumber: 'BX20170019',
					title: '报修部门：门诊科',
					msg: '#1电梯不能允许',
					status: WorkOrderStatus.waitSignin.value,
					datetime: '2017-09-19:17'
				},
				{
					id: 7,
					orderNumber: 'BX20170019',
					title: '报修部门：门诊科',
					msg: '#1电梯不能允许',
					status: WorkOrderStatus.waitSignin.value,
					datetime: '2017-09-19:17'
				}
			];
			break;
			case 'polling':
			_list = [{
					id: 1,
					orderNumber: 'BX20170019',
					title: '电梯半月保',
					msg: '已完成5/5',
					status: WorkOrderStatus.waitOver.value,
					datetime: '2017-09-19:17'
				},
				{
					id: 2,
					orderNumber: 'BX20170019',
					title: '电梯半月保',
					msg: '已完成5/5',
					status: WorkOrderStatus.waitAudit.value,
					datetime: '2017-09-19:17'
				}
			];
			break;
		case 'maintain':
			_list = [{
					id: 1,
					orderNumber: 'BX20170019',
					title: '电梯半月保',
					msg: '已完成5/5',
					status: WorkOrderStatus.waitOver.value,
					datetime: '2017-09-19:17'
				},
				{
					id: 2,
					orderNumber: 'BX20170019',
					title: '电梯半月保',
					msg: '已完成5/5',
					status: WorkOrderStatus.waitAudit.value,
					datetime: '2017-09-19:17'
				},
								{
					id: 3,
					orderNumber: 'BX20170019',
					title: '电梯半月保',
					msg: '已完成5/5',
					status: WorkOrderStatus.waitSignin.value,
					datetime: '2017-09-19:17'
				},
												{
					id: 4,
					orderNumber: 'BX20170019',
					title: '电梯半月保',
					msg: '已完成5/5',
					status: WorkOrderStatus.Over.value,
					datetime: '2017-09-19:17'
				},
																{
					id: 5,
					orderNumber: 'BX20170019',
					title: '电梯半月保',
					msg: '已完成5/5',
					status: 'R',
					datetime: '2017-09-19:17'
				}
			];
			break;
	}
	return _list;
	//console.log(app.newid)
}
