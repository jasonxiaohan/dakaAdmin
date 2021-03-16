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

  //资金账户列表
  table.render({
    elem: '#LAY-financelist-manage'
    ,url: setter.remoteurl+'/system-finance/finance-list'
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
      level: 1,
      is_resource: 1,
      partner_type: 3,
    }
    ,cols: [[
      {field: 'partner_name', title: '商户'}
      ,{field: 'margin', title: '已消费', templet:function(d) {
        return parseFloat(d.margin-d.availableMargin);
      }}
      ,{field: 'availableMargin', title: '可消费', templet:function(d) {
        return d.availableMargin;
      }}
      ,{field: 'availableMargin', title: '账户结余'}
      ,{field: 'creditAmount', title: '账期限额'} 
      ,{title: '操作',  align: 'center', fixed: 'right', width: 200, toolbar: '#table-finance-manager'}
    ]]
    ,done: function(res, curr, count) {
      layer.closeAll();
    }
    ,page: true
    ,limit: 10
    ,text: {
        none: '暂无数据'
      }
  });


  var router = layui.router();
  var adminId = router.search.admin_id;
  //分销商充值记录列表
  table.render({
    elem: '#LAY-rechargelist-manage'
    ,url: setter.remoteurl+'/system-finance/recharge-list'
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
      admin_id: adminId,
    }
    ,cols: [[
       {field: 'admin_name', title: '商户名称', width: 150},
      ,{field: 'operate_code', title: '操作', templet:function(d) {
        if (d.operate_code == 1) {
          return '充值';
        } else if (d.operate_code == 2) {
          return '补差';
        } else if (d.operate_code == 3) {
          return '冲正';
        } else if (d.operate_code == 4) {
          return '扣款';
        }
      }}
      ,{field: 'pay_type', title: '支付方式', width: 120, templet:function(d) {
        if (d.pay_type == 1) {
          return "现金";
        } else if (d.pay_type == 2) {
          return "汇款";
        } else if (d.pay_type == 3) {
          return "授信";
        }
      }}
      ,{field: 'flow_money', title: '金额', width: 100}
      ,{field: 'note', title: '备注', width: 200} 
      ,{field: 'create_time', title: '时间', width: 180,templet:function(d){return util.toDateString(d.create_time, "yyyy-MM-dd HH:mm:ss");}}
      ,{field: 'transaction_no', title: '第三方流水号', width: 200} 
      ,{field: 'operator_name', title: '操作方', width: 180, templet:function(d){
        return d.operator_name + '@' + d.ip;
      }} 
    ]]
    ,done: function(res, curr, count) {
      layer.closeAll();
    }
    ,page: true
    ,limit: 10
    ,text: {
        none: '暂无数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-financelist-manage)', function(obj){
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
    }else if(obj.event === 'look'){
      location.href = '#/finance/account-recharge-record/admin_id='+data.adminId;
    } else if (obj.event === 'recharge') {
      admin.popup({
        title: '账户资金操作'
        ,area: ['470px', '500px']
        ,id: 'LAY-popup-user-payment-add'
        ,success: function(layero, index){
          view(this.id).render('finance/recharge', data).done(function(){
            form.render(null, 'layuiadmin-form-admin');
            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              admin.req({
                url: setter.remoteurl+'/system-finance/recharge'
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

              layui.table.reload('LAY-user-back-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    } else if (obj.event === 'credit') {
      admin.popup({
        title: '账户资金操作'
        ,area: ['470px', '500px']
        ,id: 'LAY-popup-user-payment-add'
        ,success: function(layero, index){
          view(this.id).render('finance/credit', data).done(function(){
            form.render(null, 'layuiadmin-form-admin');
            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              admin.req({
                url: setter.remoteurl+'/system-finance/credit'
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

              layui.table.reload('LAY-user-back-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    }
  });

  exports('finance', {})
});