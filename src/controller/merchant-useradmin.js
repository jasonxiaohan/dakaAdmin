/**
 @Name： 用户管理 管理员管理 角色管理
 */


layui.define(['table', 'form','util'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,setter = layui.setter
  ,table = layui.table
  ,util = layui.util
  ,form = layui.form;

  //管理员管理
  table.render({
    elem: '#LAY-user-merchant-back-manage'
    ,url: setter.remoteurl+'/systemadmin/merchantUserList'
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
    }
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      // ,{field: 'adminId', width: 80, title: 'ID', sort: false}
      ,{field: 'username', title: '登录名'}
      ,{field: 'cellphone', title: '手机'}
      ,{field: 'email', title: '邮箱'}
      ,{field: 'roleName', title: '岗位'}
      ,{field: 'address', title: '地址'}
      ,{field: 'createTime', title: '创建时间',templet:function(d){return util.toDateString(d.createTime, "yyyy-MM-dd HH:mm:ss");}}
      ,{field: 'isDel', title:'审核状态', templet: '#buttonTpl', minWidth: 80, align: 'center'}
      ,{title: '操作', width: 210, align: 'center', fixed: 'right', toolbar: '#table-useradmin-admin'}
    ]]
    ,done: function(res, curr, count) {
      // layer.closeAll();
    }
    ,text: {
        none: '暂无数据'
      }
  });

  
  //监听工具条
  table.on('tool(LAY-user-merchant-back-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        layer.confirm('确定删除此管理员？', function(index){
           admin.req({
            url: setter.remoteurl+'/systemadmin/users'
            ,method: 'DELETE'
            ,data: {adminId: data.adminId}
            ,success: function(res){
              if (res.code == 0) {
                layer.msg("删除成功",{time: 1000,icon: 1},function(){
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                    window.parent.location.reload();
                });
              } else {
                layer.msg(res.msg, {icon: 5});
              }
            }
          }); 
          obj.del();
          layer.close(index);
        });
      });
    }else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑员工'
        ,area: ['520px', '700px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('setting/administrators/adminform', data).done(function(){
            form.render(null, 'layuiadmin-form-admin');
            
            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              admin.req({
                url: setter.remoteurl+'/systemadmin/users'
                ,method: 'PUT'
                ,data: field
                ,success: function(res){
                  if (res.code == 0) {
                    layer.msg("修改成功",{time: 1000,icon: 1},function(){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        window.parent.location.reload();
                    });
                  } else {
                    layer.msg(res.msg, {icon: 5});
                  }
                }
              }); 

              layui.table.reload('LAY-user-merchant-back-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    } else if (obj.event === 'add') {
      admin.popup({
        title: '添加支付信息'
        ,area: ['420px', '400px']
        ,id: 'LAY-popup-user-payment-add'
        ,success: function(layero, index){
          view(this.id).render('setting/administrators/payment', data).done(function(){
            form.render(null, 'layuiadmin-form-admin');
            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              admin.req({
                url: setter.remoteurl+'/merchant/payments'
                ,method: 'POST'
                ,data: field
                ,success: function(res){
                  if (res.code == 0) {
                    layer.msg("修改成功",{time: 1000,icon: 1},function(){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        window.parent.location.reload();
                    });
                  } else {
                    layer.msg(res.msg, {icon: 5});
                  }
                }
              }); 

              layui.table.reload('LAY-user-merchant-back-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    }
  });

  //角色管理
  table.render({
    elem: '#LAY-user-back-role'
    ,url: setter.remoteurl+'/systemrole/roles'
    ,where: {
      access_token: layui.data(setter.tableName).access_token
    }
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'roleId', width: 80, title: 'ID', sort: true}
      ,{field: 'roleName', title: '角色名'}
      ,{field: 'rights', title: '拥有权限'}
      ,{field: 'descr', title: '具体描述'}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-useradmin-admin'}
    ]]
    ,text: {
        none: '暂无数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-user-back-role)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定删除此角色？', function(index){
        admin.req({
          url: setter.remoteurl+'/systemrole/roles'
          ,method: 'DELETE'
          ,data: {"roleId": obj.data.roleId}
          ,success: function(res){
            if (res.code == 0) {
              layer.msg("删除成功",{time: 1000,icon: 1},function(){
                  var index = parent.layer.getFrameIndex(window.name);
                  parent.layer.close(index);
                  window.parent.location.reload();
              });
            } else {
              layer.msg(res.msg, {icon: 5});
            }
          }
        }); 
        obj.del();
        layer.close(index);
      });
    }else if(obj.event === 'edit'){
      admin.popup({
        title: '修改新角色'
        ,area: ['500px', '480px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('user/administrators/roleform', data).done(function(){
            form.render(null, 'layuiadmin-form-role');
            
            //监听提交
            form.on('submit(LAY-user-role-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              admin.req({
                url: setter.remoteurl+'/systemrole/roles'
                ,method: 'PUT'
                ,data: field
                ,success: function(res){
                  if (res.code == 0) {
                    layer.msg("修改成功",{time: 1000,icon: 1},function(){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        window.parent.location.reload();
                    });
                  } else {
                    layer.msg(res.msg, {icon: 5});
                  }
                }
              }); 
              layui.table.reload('LAY-user-back-role'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    } else {
       admin.req({
        url: setter.remoteurl+'/systemrole/roles'
        ,method: 'POST'
        ,data: obj.field
        ,success: function(res){
          if (res.code == 0) {
            layer.msg("添加成功",{time: 1000,icon: 1},function(){
                var index = parent.layer.getFrameIndex(window.name);
                parent.layer.close(index);
                window.parent.location.reload();
            });
          } else {
            layer.msg(res.msg, {icon: 5});
          }
        }
      }); 
    }
  });

  exports('merchant-useradmin', {})
});