/**
 * 系统配置项  create by zouqj  2018-10-20
 */
(function (owner) {
    owner.isPublish = false; //是否发布到正式环境
    owner.appTitle = "财务借款报销余额查询"; //App项目标题
    owner.uuid = localStorage.getItem('$uuid');//获取设备的唯一标识号
    owner.ORG_CODE = localStorage.getItem('$ORG_CODE') || '440001'; //默认项目编码
    owner.ROLE_ID = localStorage.getItem('$ROLE_ID'); //登录角色编号
    owner.USER_ID = localStorage.getItem('$USER_ID') || 'yujie'; //登录用户编号
    owner.getCount = localStorage.getItem('$EXE_COUNT') || '';
    var apiDomain = ''; //api域名地址
    if (owner.isPublish == true) {//生产 
        apiDomain = 'http://www.repair.com';//API域名 
        owner.apkUrl = apiDomain + '/app/android.apk'; //Android安装包下载地址
        owner.OpenLog = false;//是否开启日志 ，控制台日志开关
    } else { //测试
    	owner.isMock = true; //是否是mock数据
        owner.OpenLog = false;//是否开启日志 ，控制台日志开关
        apiDomain = 'http://www.repairtest.com';//API域名
        owner.apkUrl = apiDomain + '/app/android.apk';//Android安装包下载地址
        owner.pcDomain = 'http://192.168.1.2:1002'; //PC图片地址
    }

    /*基础类*/
    owner.GetUserHeaderPic = apiDomain + '/api/Base/GetUserHeaderPic';//获取用户头像信息
    owner.SetUserHeaderPic = apiDomain + '/api/Base/SetUserHeaderPic';//设置头像信息
    owner.GetAppVersion = apiDomain + "/api/Base/GetAppVersion";//获取app版本
    owner.loginUrl = apiDomain + "/api/Base/LoginApp"; //登录
    owner.uploadImgUrl = apiDomain + "/api/file/FileUpload"; //上传图片路径
    owner.GetDict = apiDomain + '/api/Base/GetDict?'; //获取字典类型
    owner.GetSysInit = apiDomain + '/api/Base/GetSysInit';
    owner.GetEquipment = apiDomain + '/api/Base/GetEquipment'; //获取设置运行状态 
    owner.GetUserAppRights = apiDomain + '/api/Base/GetUserAppRights'; //菜单权限
    owner.GetDepartment = apiDomain + '/api/Base/GetDepartment'; //部门列表
    owner.GetEquipmentPage = apiDomain + '/api/Base/GetEquipmentPage'; //获取设备分页列表
    owner.AddEquipment = apiDomain + '/api/Base/AddEquipment'; //添加设备信息
    owner.UpdateEquipment = apiDomain + '/api/Base/UpdateEquipment'; //更新设备信息
    owner.QueryAddrList = apiDomain + '/api/Base/QueryAddrList'; //获取通讯录
    owner.QueryJudgeDegree = apiDomain + '/api/Base/QueryJudgeDegree'; //满意度
    owner.QueryWorkLoadQty = apiDomain + '/api/Base/QueryWorkLoadQty'; //工作量	
    owner.AddProductComplaint = apiDomain + '/api/Base/AddProductComplaint'; //意见反馈		
    owner.QueryAppHelpPage = apiDomain + '/api/Base/QueryAppHelpPage'; //帮助分页查询 
    owner.GetAppHelpById = apiDomain + '/api/Base/GetAppHelpById'; //帮助详情
    owner.ModifyPassword = apiDomain + '/api/Base/ModifyPassword'; //修改密码
    owner.GetBuildsPage = apiDomain + '/api/Base/GetBuildsPage'; //建筑信息列表	
    owner.GetBuildInfo = apiDomain + '/api/Base/GetBuildInfo'; //获取建筑详情
    owner.QueryAllDistrictTree = apiDomain + '/api/Base/QueryAllDistrictTree'; //获取行政区域树
    owner.EditBuildContactInfo = apiDomain + '/api/Base/EditBuildContactInfo'; // 编辑建筑联系人信息

    /*工单类*/
    owner.BillWorkbench = apiDomain + '/api/Maintain/BillWorkbench'; //工作台	
    owner.GetBillExecute = apiDomain + '/api/Bill/GetBillExecute'; //跟踪记录
    owner.AddBillFile = apiDomain + '/api/Bill/AddBillFile'; //添加文件
    owner.GetBillFile = apiDomain + '/api/Bill/GetBillFile'; //获取文件	
    owner.QuerySignFile = apiDomain + '/api/Bill/QuerySignFile'; //获取文件-方法重复
    owner.GetBillFilePage = apiDomain + '/api/Bill/GetBillFilePage'; //获取文件分页	
    owner.QueryExecuteUserList = apiDomain + '/api/Bill/QueryExecuteUserList'; //查询执行人员列表
    owner.Punch = apiDomain + '/api/Bill/Punch'; //打卡
    owner.GetPunch = apiDomain + '/api/Bill/GetPunch'; //打卡记录
    owner.GetScheduleInfo = apiDomain + '/api/Bill/GetScheduleInfo'; //获取接收提交全部信息	
    owner.GetSchedule = apiDomain + '/api/Bill/GetSchedule'; //获取当前值班
    owner.SubmitScheduleInfo = apiDomain + '/api/Bill/SubmitScheduleInfo'; //填写值班记录
    owner.GetEqtWorkIDs = apiDomain + '/api/Bill/GetEqtWorkIDs'; //设备类型
    owner.ScheduleInfoExchange = apiDomain + '/api/Bill/ScheduleInfoExchange'; //提交交接班	
    owner.GetJudge = apiDomain + '/api/Bill/GetJudge'; //查询工单评价
    owner.GetPunchStats = apiDomain + '/api/Bill/GetPunchStats'; //我的考勤
    owner.GetBuilds = apiDomain + '/api/Bill/GetBuilds'; //获取报警楼栋查询条件信息 

    /*维修*/
    owner.GetFaultType = apiDomain + '/api/Repair/GetFaultType'; //故障类型表
    owner.GetRepairBill = apiDomain + '/api/Repair/GetRepairBill'; //维修查询
    owner.GetRepairBillHistroyPage = apiDomain + '/api/Repair/GetRepairBillHistroyPage'; //维修查询-分页
    owner.GetRepairBillUntreatedPage = apiDomain + '/api/Repair/GetRepairBillUntreatedPage'; //维修查询-分页-待处理
    owner.AddRepairBill = apiDomain + '/api/Repair/AddRepairBill'; //维修报修
    owner.AssignPersonRepair = apiDomain + '/api/Repair/AssignPersonRepair'; //维修抢单、派工
    owner.TransferRepair = apiDomain + '/api/Repair/TransferRepair';//转单
    owner.SignRepair = apiDomain + '/api/Repair/SignRepair'; //维修签到
    owner.FinishRepair = apiDomain + '/api/Repair/FinishRepair'; //维修完工
    owner.ConfirmRepair = apiDomain + '/api/Repair/ConfirmRepair'; //维修审核
    owner.SubmitSchedueRequest = apiDomain + '/api/Repair/SubmitSchedueRequest'; //维修请求支持
    owner.JudgeRepair = apiDomain + '/api/Repair/JudgeRepair'; //维修评价
    owner.AddRepairPart = apiDomain + '/api/Repair/AddRepairPart'; //添加耗材
    owner.GetRepairPart = apiDomain + '/api/Repair/GetRepairPart'; //获取 维修费用与耗材
    owner.GetRepairBillDoctorPage = apiDomain + '/api/Repair/GetRepairBillDoctorPage'; //医护人员获取历史列表
    owner.RepairBillPress = apiDomain + '/api/Repair/RepairBillPress'; //催单成功	
    owner.RepairBillRevoke = apiDomain + '/api/Repair/RepairBillRevoke'; //撤单成功
    owner.GetAssignPerson = apiDomain + '/api/Repair/GetAssignPerson'; //维修查询执行人员列表
    owner.RepairBillBack = apiDomain + '/api/Repair/RepairBillBack'; //退单

    owner.GetRepairBillHistroyPageToOffline = apiDomain + '/api/Repair/GetRepairBillHistroyPageToOffline'; //维修查询-分页-待处理—离线

    /*其它*/
    /*知识库*/
    owner.AddKnowledge = apiDomain + '/api/Knowledge/AddKnowledge'; //添加知识库
    owner.UpdateKnowledge = apiDomain + '/api/Knowledge/UpdateKnowledge'; //修改知识库	
    owner.GetKnowledgePage = apiDomain + '/api/Knowledge/GetKnowledgePage'; //获取知识库
    owner.DeleteKnowledge = apiDomain + '/api/Knowledge/DeleteKnowledge'; //删除某知识库信息
    owner.GetRepairPartByUser = apiDomain + '/api/Equipment/GetRepairPartByUser'; //选择维修耗材 
    owner.GetEqPartsStore = apiDomain + '/api/Equipment/GetEqPartsStore'; //备件库存查询	
    owner.GetEqPartsStorePage = apiDomain + '/api/Equipment/GetEqPartsStorePage'; //备件库存查询
    owner.GetExperiencePage = apiDomain + '/api/Experience/GetExperiencePage'; //知识库故障库
    owner.SendPuchaseNote = apiDomain + '/api/Equipment/SendPuchaseNote'; //无库存提醒	
    owner.GetEquipmentParam = apiDomain + '/api/Equipment/GetEquipmentParam'; //台帐保养记录
    owner.GetExperience = apiDomain + '/api/Experience/GetExperience'; //故障库详情
    owner.GetKnowledge = apiDomain + '/api/Knowledge/GetKnowledge'; //知识库详情	
    owner.FileDownForPC = owner.pcDomain + "/api/file/FileDownForPC";//下载附件
    /*统计信息*/
    owner.GetTotalBillInfo = apiDomain + '/api/Bill/GetTotalBillInfo';//获取今日工单统计信息
    owner.GetGroupBillList = apiDomain + '/api/Bill/GetGroupBillList';//获取今年/近七天完工单统计信息
    owner.BillRewardForUser = apiDomain + '/api/Maintain/BillRewardForUser'; //奖励金额	 

}(window.config = {}));
//App角色类型
(function (owner) {
    owner.pm = 'pm'; //项目经理
    owner.leader = 'leader'; //班组
    owner.repairman = 'repairman'; //维修人员
    owner.customer = 'customer'; //报修人员
}(window.comm = {}));
/** 
 * 任务类型 -工作台模块
 */
var TaskType = {
    //维修
    repair: {
        value: 'repair',
        name: 'repair'
    },
    polling: {
        value: 'polling',
        name: 'polling'
    },
    maintain: {
        value: 'maintain',
        name: 'maintain'
    }
}
//websql 数据表 （离线存储数据表）
var smp_tb = {
    repair_tb: 'tb_repair_order', //维修工单表
    img_tb: 'tb_img_order', //工单图片表
    signin_tb: 'tb_signin', //拍照签到表
    over_tb: 'tb_over',//完工表
    fault_type_tb: 'tb_faultType', //故障类型
}