var nwaiting = null;
(function ($, owner) {
    /**
	 * 用户登录
	 **/
    owner.login = function (loginInfo, callback) {
        if (g.getNetStatus() == false) {
            mui.toast('网络异常,请稍候再试');
            return;
        }
        callback = callback || mui.noop;
        loginInfo = loginInfo || {};
        loginInfo.account = loginInfo.account || '';
        loginInfo.password = loginInfo.password || '';
        //if(loginInfo.account.length < 5) {
        //	return callback('账号最短为 5 个字符');
        //}
        //if(loginInfo.password.length < 3) {
        //	return callback('密码最短为 3 个字符');
        //}
        var pwd = md5(loginInfo.password);
        var _where = {
            USER_ID: loginInfo.account,
            PASSWORD: pwd
        };
        nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框
        g.ajax(config.loginUrl, {
            type: 'post',
            data: _where,
            nwaiting: nwaiting,
            success: function (result) {
                if (nwaiting) {
                    nwaiting.close();
                }
                console.log('loginUrl:' + JSON.stringify(result))
                if (result.StatusCode == 200) { //成功
                    var _user = result.Data.U;
                    if (_user.USER_ID == null) {
                        mui.toast('用户名或密码错误');
                        return;
                    }
                    var _GloabMenus = result.Data.P;
                    if (_GloabMenus != null && _GloabMenus.length > 0) {
                        g.setMenus(_GloabMenus);
                        localStorage.setItem('$loginstate', true); //设置登录成功状态，跳转到首页
                        u.createUserInfo(_user, callback); //存储登录用户信息
                    }
                }
            }
        })
    };
    /**
	 * 创建登录用户实体
	 * @param {Object} user：登录用户对象
	 * @param {Object} callback
	 */
    owner.createUserInfo = function (user, callback) {
        if (user.ORG_CODE != null) {
            localStorage.setItem('$ORG_CODE', user.ORG_CODE); //登录用户所属机构编号
        }
        if (user.ROLE_ID != null) {
            localStorage.setItem('$ROLE_ID', user.ROLE_ID); //登录用户角色编号
        }
        if (user.USER_ID != null) {
            localStorage.setItem('$USER_ID', user.USER_ID); //登录用户编号
        }
        user.token = "token123456789";
        if (user.PASSWORD != null && user.PASSWORD != "") {
            localStorage.setItem('$smp_cur_pwd', user.PASSWORD);//当前登录密码
        }
        g.setItem('$userinfo', user);
        saveAppRoleType(user);	//记录登录角色（app角色）
        return callback();
    };
    //保存app角色，对app而言就4种角色，不管系统有多少种角色
    function saveAppRoleType(_user) {
        var roleType = '';
        var action_type = _user.ACTION_TYPE;
        if (action_type == undefined || action_type == null) { roleType = comm.customer; }
        else {
            var canDispatching = action_type.indexOf('B') >= 0 ? true : false; //派工
            var canGetOrder = action_type.indexOf('A') >= 0 ? true : false; //抢单
            if (canGetOrder && canDispatching) {//可派可抢（班组人员）
                roleType = comm.leader;
            }
            else if (canGetOrder) { //可抢单 （维修人员）
                roleType = comm.repairman;
            }
            else if (canDispatching) {//可派工（项目经理）
                roleType = comm.pm;
            } else { //不可抢、不可派（报修人员）
                roleType = comm.customer;
            }
        }
        if (roleType != '') {
            localStorage.setItem('$appRoleType', roleType);
        }
    }
}(mui, window.u = {}));