(function(win) {
    function smpWebSql(options){
        options = options || {};
        this.database = null;
        this.DateBaseName = options.DateBaseName || 'SmpDB';
        this.Version = options.Version || '1.0';
        this.Description = options.Description || 'SmpDB';
        this.DataBaseSize = options.DataBaseSize || 2 * 1024 * 1024;
        this.init();
    }
    smpWebSql.prototype = {
        init: function() {
            this.database = openDatabase(this.DateBaseName, this.Version, this.Description, this.DataBaseSize); //初始化数据库
        },
        addBlob: function (tableName, arr,index,isFirst,callback) {//批量添加字段
            /*
                注 ： 数据里面的第一个key存储类型为BLOB
                @param  tableName 表名
                @param  arr 更新的数据    [{key1：value1 , key2 : value2 ...},{key1：value1 , key2 : value2 ...}]
                @param  index BLOG字段所在的索引位置
                @param  isFirst 是否是第一次创建表
                @param  callback  回调
             */
            if (arr == null) {
                return this;
            }
            callback = this.isFunction(callback) ? callback : new Function();
            var _me = this,
                _db = this.database,
                keyC = [],
                keyI = [],
                _key = '';
            arr = arr || [];
            if (arr && arr.constructor == Array) {
                for (var i in arr[0]) {
                    keyC.push(i);
                    keyI.push(i);
                }
                _key = keyI.join(",");
                index = index == undefined ? 0 : index;
                keyC[index] = keyC[index] + ' BLOB';
                _db.transaction(function (tx, result) {
                    //var csql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + keyC.join(",") + ')';
                    //console.log('csql:' + csql);
                    if (isFirst == true) {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + keyC.join(",") + ')');
                    }
                    //var sql = "";
                    for (var s = 0, _len = arr.length; s < _len ; s++) {
                        var _value = _me.split(arr[s]);
                        //sql += 'INSERT INTO ' + tableName + ' (' + _key + ') VALUES (' + _value + ')';
                        //console.log("sql:" + sql);
                        tx.executeSql('INSERT INTO ' + tableName + ' (' + _key + ') VALUES (' + _value + ')',[],function (tx, result) {
                            callback(result.rowsAffected);
                            //console.log('添加成功'+result.rowsAffected);
                        },function (tx, error) {
                            console.error('添加失败');
                            callback(false);
                        });
                    }
                    _key = keyI = keyC = null;
                    callback();
                });
            }
            return this;
        },
        add: function (tableName, arr, callback, noKey) {//批量添加字段
            /*
                注 ： 数据里面的第一个key 为主键
                @param  tableName 表名
                @param  arr 更新的数据    [{key1：value1 , key2 : value2 ...},{key1：value1 , key2 : value2 ...}]
                @param  callback  回调
                @param  noKey 第一个字段是否是主键（默认是）
             */
            if(arr==null){
            	return this;
            }
            callback = this.isFunction(callback) ? callback : new Function();
            var _me = this,
                _db = this.database,
                keyC = [],
                keyI = [],
                _key = '';
            arr = arr || [];
            if (arr && arr.constructor == Array) {
                for(var i in arr[0]){
                    keyC.push(i);
                    keyI.push(i);
                }
                if (noKey==undefined) {
                    keyC[0] = keyC[0] + ' unique';
                }
                _key = keyI.join(",");
                _db.transaction(function (tx) {
                   ///var csql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + keyC.join(",") + ')';
                    // console.log('csql:' + csql);
                     tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + keyC.join(",") + ')');
                    //var sql = "";
                    for(var s = 0 , _len = arr.length; s < _len ; s++){
                        var _value = _me.split(arr[s]);
                        //sql += 'INSERT INTO ' + tableName + ' (' + _key + ') VALUES (' + _value + ')';
                        //console.log("sql:" + sql);
                        tx.executeSql('INSERT INTO '+tableName+' ('+_key+') VALUES ('+_value+')',[],function (tx, result) {
                            callback(result.rowsAffected);
                            //console.log('添加成功'+result.rowsAffected);
                        },function (tx, error) {
                            console.error('添加失败');
                            callback(false);
                        });
                    }
                    _key = keyI = keyC = null;
                    callback();
                });
            }
            return this;
        },
        update : function(tableName,key,value,obj,callback){//更新指定数据
            /*
                @param  tableName 表名
                @param  key 查询的键 
                @param  value 对应键的值
                @param  obj 更新的数据    {key1：value1 , key2 : value2 ...} 
                @param  callback  回调  传递参数为真则查询成功 反之更新失败
             */
            callback = this.isFunction(callback) ? callback : new Function();
            var _db = this.database,
                _value = this.splitU(obj);
            _db.transaction(function (tx) {
                //console.log('sql:' + 'UPDATE ' + tableName + ' set ' + _value + ' where ' + key + '="' + value + '"')
                tx.executeSql('UPDATE '+tableName+' set '+_value+' where '+key+'="'+value+'"',[],function (tx, result) {
                    callback(result.rowsAffected);
                },function (tx, error) {
                    console.error('更新失败');
                    callback(false);
                });
            });
            return this;
        },
        updateWhere: function (tableName, where, obj, callback) {//更新指定数据
            /*
                @param  tableName 表名
                @param  查询条件 
                @param  obj 更新的数据    {key1：value1 , key2 : value2 ...} 
                @param  callback  回调  传递参数为真则查询成功 反之更新失败
             */
            callback = this.isFunction(callback) ? callback : new Function();
            var _db = this.database,
                _value = this.splitU(obj);
            _db.transaction(function (tx) {
                console.log('UPDATE ' + tableName + ' set ' + _value + ' where ' + where + '"')
                tx.executeSql('UPDATE ' + tableName + ' set ' + _value + ' where ' + where + '"', [], function (tx, result) {
                    callback(result.rowsAffected);
                }, function (tx, error) {
                    console.error('更新失败');
                    callback(false);
                });
            });
            return this;
        },
        read : function(tableName,condition,callback){ //读取表数据
            /*
                @param  tableName 表名
                @param  condition 查询条件   'where name="汪文君"'
                @param  callback  回调  传递参数为真则查询成功 反之查询失败
             */
            var _condition = this.isString(condition) ? condition : '';
            var _callback = this.isFunction(condition) ? condition : this.isFunction(callback) ? callback : new Function;
            var _db = this.database,
                _me = this,
                _re = [];
                _db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM ' + tableName + ' ' + _condition + ' ', [], function (tx, results) {
                        if(results && results.rows){
                            _re =_me.toArray(results.rows);
                            _callback(_re);
                        }else{
                            _callback([]);
                        }
                    },function(tx,error){
                        _callback([]);
                        console.error('查询失败');
                    });
                });
                return this;
        },
        remove:function(tableName,condition,callback){//删除数据
            /*
                @param  tableName 表名
                @param  condition 查询条件   'where name="汪文君"'
                @param  callback  回调  传递参数为真则删除成功 反之删除失败
             */
            var _me = this;
            var _condition = this.isString(condition) ? condition : '';
            var _callback = this.isFunction(condition) ? condition : this.isFunction(callback) ? callback : new Function;
            _me.database.transaction(function (tx) {
                tx.executeSql('DELETE FROM '+tableName+ ' '+ _condition+' ',[],function (tx, result) {
                    _callback(result.rowsAffected);
                },function (tx, error) {
                    _callback(false);
                    console.error('删除失败');
                });
            });
        },
        counts: function (tableName, condition, callback) { //读取表数据
            /*
                @param  tableName 表名
                @param  condition 查询条件   'where name="汪文君"'
                @param  callback  回调  传递参数为真则查询成功 反之查询失败
             */
            var _condition = this.isString(condition) ? condition : '';
            var _callback = this.isFunction(condition) ? condition : this.isFunction(callback) ? callback : new Function;
            var _db = this.database,
                _me = this,
                _re = [];
            if (mui.os.ios) { //ios下面特有的
                _db.transaction(function (tx) {
                    tx.executeSql('SELECT NO FROM ' + tableName + ' ' + _condition + ' ', [], function (tx, results) {// count (*) as num
                        if (results && results.rows) {
                            _re = _me.toArray(results.rows);
                            _callback(_re.length);
                        } else {
                            _callback(0);
                        }
                    }, function (tx, error) {
                        _callback(0);
                        console.error('查询失败');
                    });
                });
            } else {
                _db.transaction(function (tx) {
                    tx.executeSql('SELECT count (*) as num FROM ' + tableName + ' ' + _condition + ' ', [], function (tx, results) {// count (*) as num
                        if (results && results.rows) {
                            if (results.rows[0]) {
                                _callback(results.rows[0].num);
                            } else {
                                _callback(0);
                            }
                        } else {
                            _callback(0);
                        }
                    }, function (tx, error) {
                        _callback(0);
                        console.error('查询失败');
                    });
                });
            }
            return this;
        },
        delTable:function(tableName,callback){ //删除数据表
            callback = this.isFunction(callback) ? callback : new Function();
            this.database.transaction(function(tx){
                tx.executeSql('DROP TABLE IF EXISTS '+tableName,[],function(tx,res){
                    callback();
                },function(tx,err){
                    console.error(err);
                });
            });
            return this;
        },
        splitU: function(obj){//更新字符处理
            var _arr = [];
            for(var t in obj){
                _arr.push(t+'="'+obj[t]+'"');
            }
            return _arr.join(',');
        },
        split : function(obj){//添加字符处理
            var _arr = [];
            for(var m in obj){
                _arr.push("'"+obj[m]+"'");
            }
            return _arr.join(',');
        },
        isFunction : function(callback){
            return typeof callback != 'undefined' && callback.constructor == Function ? true : false
        },
        isString : function(string){
            return typeof string == 'string' ? true : false
        },
        toArray : function(obj){
            var _arr = [],
                _len = obj.length;
                if(_len > 0){
                    for (var i = 0; i < _len; i++) {
                        _arr.push(obj.item(i));
                    };
                }
                return _arr;
        }
    }
    win.smpWebSql = smpWebSql;
}(window))
