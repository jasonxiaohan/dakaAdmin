/**

 @Name： 退单记录管理 
 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,setter = layui.setter
  ,table = layui.table
  ,util = layui.util
  ,form = layui.form;

  // 订单管理
  table.render({
    elem: '#LAY-refund-manage'
    ,url: setter.remoteurl+'/refund/system-refunds' //模拟接口
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
      source: 1,
    }
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'orderNo', width: 250, title: '订单号', sort: true}
      ,{field: 'cellName', title: '客人信息', width: 160, templet: function(d){
        return d.userName+' '+d.cellPhone;
      }}
      ,{field: 'ticketNums', title: '数量', width: 120, templet: function(d){
          var ticket = '购'+d.ticketNums+'/退';
          if (d.refundStatus == 1) {
            ticket+=d.ticketNums;
          } else {
            ticket+='0';
          }
          if (d.consumeStatus == 1) {
            ticket+='/用'+d.ticketNums;
          } else {
              ticket+='/用0';
          }
          return ticket;
       }}
      ,{field: 'merchantName', title: '分销商名称', width: 180}
      ,{field: 'realAmount', title: '金额', width: 80, templet: function(d) {
        return '￥'+d.realAmount;
      }}
      ,{field: 'refundStatus', title: '退款状态', width: 90, templet: '#refundTpl', align: 'center'}
      ,{field: 'createTime', title: '申请时间', sort: true,templet:function(d){return util.toDateString(d.updateTime, "yyyy-MM-dd HH:mm:ss");}}
      ,{title: '操作', width: 160, align:'center', fixed: 'right', toolbar: '#table-refund-webuser'}
    ]]
    ,page: true
    ,limit: 10
    // ,height: 'full-320'
    ,text: {
        none: '暂无数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-refund-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        
        layer.confirm('真的删除行么', function(index){
          admin.req({
            url: setter.remoteurl+'/product/products'
            ,method: 'DELETE'
            ,data: {productId: data.productId}
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
    } else if(obj.event === 'view'){
      layer.open({
        title: '退单记录'
        ,area: ['600px', '580px']
        ,id: 'LAY-popup-refund-add'
        ,success: function(layero, index){
          view(this.id).render('scenic/ticket-order/refund-order', data).done(function(){
            form.render(null, 'layuiadmin-form-order');
            
          });
        }
      });
    } else if(obj.event === 'refund'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        
        layer.confirm('真的退款么?', function(index){
          admin.req({
            url: setter.remoteurl+'/order/refund-order'
            ,method: 'PUT'
            ,data: {order_no: data.orderNo}
            ,success: function(res){
              if (res.code == 0) {
                layer.msg("退款成功",{time: 1000,icon: 1},function(){
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
    } else if(obj.event === 'download') {
      alert("下载图片");
    }
  });

  //管理员管理
  table.render({
    elem: '#LAY-user-back-manage'
    ,url: setter.remoteurl+'/systemadmin/userlist'
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
    }
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'adminId', width: 80, title: 'ID', sort: false}
      ,{field: 'username', title: '登录名'}
      ,{field: 'cellphone', title: '手机'}
      ,{field: 'email', title: '邮箱'}
      ,{field: 'roleName', title: '角色'}
      ,{field: 'address', title: '地址'}
      ,{field: 'isDel', title:'审核状态', templet: '#buttonTpl', minWidth: 80, align: 'center'}
      ,{title: '操作', width: 150, align: 'center', fixed: 'right', toolbar: '#table-useradmin-admin'}
    ]]
    ,done: function(res, curr, count) {
      // layer.closeAll();
    }
    ,text: {
        none: '暂无相关数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-user-back-manage)', function(obj){
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
    }else if(obj.event === 'view'){
      admin.popup({
        title: '退单记录'
        ,area: ['420px', '450px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('user/administrators/adminform', data).done(function(){
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

              layui.table.reload('LAY-user-back-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    }
  });

  exports('refund', {})
});