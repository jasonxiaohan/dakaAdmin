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


  var router = layui.router();
  var merchant_id = router.search.merchant_id;

  // 价格协议列表
  table.render({
    elem: '#LAY-protocol-manage'
    ,url: setter.remoteurl+'/system-protocol/protocols'
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
      merchant_id: merchant_id,
    }
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'protocol_name', title: '协议名称', width: 150}
      ,{field: 'product_num', title: '授权商品', width: 150, templet:function(d){
        return '票 '+d.product_num;
      }}
      ,{field: 'merchant_num', title: '授权商户', width: 100}
      ,{field: 'protocol_remark', title: '备注', width: 300}
      ,{title: '操作', width: 300, align: 'center', fixed: 'right', toolbar: '#table-protocol-manager'}
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
  table.on('tool(LAY-protocol-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        layer.confirm('确定删除此商品？', function(index){
           admin.req({
            url: setter.remoteurl+'/system-protocol/protocol'
            ,method: 'DELETE'
            ,data: {protocol_id: data.protocol_id}
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
        title: '编辑价格协议'
        ,area: ['420px', '400px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('channel/product-list', data).done(function(){
            form.render(null, 'layuiadmin-form-protocol');
                     
            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段
              var required= new Array();
              $("input[name='required']:checked").each(function(){
                  required.push($(this).val());
              });
              field.required = required.join(',');

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              admin.req({
                url: setter.remoteurl+'/system-protocol/protocol'
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
    } else if(obj.event === 'author_product'){ 
      admin.popup({
        title: '授权产品'
        ,area: ['920px', '700px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('channel/product-list', data).done(function(){
            form.render(null, 'layuiadmin-form-protocol');
                     
            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段
              var required= new Array();
              $("input[name='required']:checked").each(function(){
                  required.push($(this).val());
              });
              field.required = required.join(',');

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              admin.req({
                url: setter.remoteurl+'/system-protocol/protocol'
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

  exports('channel-protocol', {})
});