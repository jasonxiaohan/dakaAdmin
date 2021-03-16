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
    elem: '#LAY-merchant-manage'
    ,url: setter.remoteurl+'/system-merchant/merchants'
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
    }
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'merchant_id', title: '#ID', width: 80}
      ,{field: 'merchant_name', title: '商家名称', width: 300}
      ,{field: 'category_name', title: '商家类型', width: 300}
      ,{field: 'hot_line', title: '咨询电话', width: 300}
      ,{field: 'ticket_mode', title: '换票凭证', width: 300}
      ,{title: '操作', width: 230, align: 'center', fixed: 'right', toolbar: '#table-merchant-manager'}
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
  table.on('tool(LAY-merchant-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        layer.confirm('确定删除此类别？', function(index){
           admin.req({
            url: setter.remoteurl+'/system-merchant/merchant'
            ,method: 'DELETE'
            ,data: {merchant_id: data.merchant_id}
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
        title: '编辑商家'
        ,area: ['700px', '620px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('scenic/merchant/merchant', data).done(function(){
            form.render(null, 'layuiadmin-form-merchant');
                     
            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段
              var ticketMode= new Array();
              $("input[name='ticketMode']:checked").each(function(){
                  ticketMode.push($(this).val());
              });
              field.ticketMode = ticketMode.join(',');

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              admin.req({
                url: setter.remoteurl+'/system-merchant/merchant'
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
    } else if(obj.event === 'merchant-product-list'){ 
      location.href = '#/merchant/product-list/merchant_id='+data.merchant_id;
    } 
  });

  exports('merchant', {})
});