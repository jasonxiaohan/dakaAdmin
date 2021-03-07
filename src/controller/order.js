/**

 @Name： 订单管理 
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
    elem: '#LAY-order-manage'
    ,url: setter.remoteurl+'/order/orders' //模拟接口
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
    }
    ,totalRow: true
    ,cols: [[
      // {field:'id', title:'ID', width:80, fixed: 'left', unresize: true, sort: true, totalRowText: '合计'}
      {field: 'orderNo', width: 250, title: '订单号', sort: true, totalRowText: '合计'}
      ,{field: 'nickName', title: '用户名', width: 120}
      ,{field: 'username', title: '商户名称', width: 180}
      ,{field: 'realAmount', title: '实付金额', width: 100,templet: function(d) {
        return '￥'+d.realAmount;
      }}
      ,{field: 'payableAmount', title: '应付金额', width: 100, templet: function(d) {
          return '￥'+d.payableAmount; 
      }}
      ,{field: 'discount', title: '折扣优惠', width: 100, templet: function(d) {
        return '￥'+d.discount;
      }}
      ,{field: 'ticketNums', title: '购票数量', width: 100}
      ,{field: 'payStatus', title: '支付状态', width: 100, templet:function(d) {
        if (d.payStatus == 0) {
          return '未付款';
        } 
        return '已付款';
      }} 
      ,{field: 'consumeStatus', title: '消费状态', width: 90, templet: '#buttonTpl', align: 'center'}
      ,{field: 'refundStatus', title: '退款状态', width: 90, templet: '#refundTpl', align: 'center'}
      ,{field: 'createTime', title: '下单时间', sort: true,templet:function(d){return util.toDateString(d.createTime, "yyyy-MM-dd HH:mm:ss");}}
      ,{title: '操作', width: 160, align:'center', fixed: 'right', toolbar: '#table-order-webuser'}
    ]]
    ,page: true
    ,limit: 10
    // ,height: 'full-320'
    ,text: {
        none: '暂无数据'
    },
    done: function(res, curr, count){
      console.log(res);
      this.elem.next().find('.layui-table-total td[data-field="realAmount"] .layui-table-cell').text('¥'+res.total_amount.toFixed(2));
    }
  });
  
  //监听工具条
  table.on('tool(LAY-order-manage)', function(obj){
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
    } else if(obj.event === 'edit'){
      admin.popup({
        title: '订单详情页'
        ,area: ['600px', '580px']
        ,id: 'LAY-popup-order-add'
        ,success: function(layero, index){
          view(this.id).render('order/order', data).done(function(){
            form.render(null, 'layuiadmin-form-order');
            
            //监听提交
            form.on('submit(LAY-order-back-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              //$.ajax({});
              admin.req({
                url: setter.remoteurl+'/order/orders'
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

              layui.table.reload('LAY-order-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
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
    }else if(obj.event === 'edit'){
      admin.popup({
        title: '编辑管理员'
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

  exports('order', {})
});