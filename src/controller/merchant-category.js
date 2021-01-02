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
    elem: '#LAY-category-manage'
    ,url: setter.remoteurl+'/merchant-category/list'
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
    }
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'categoryType', title: '类别',templet:function(d){
        if (d.categoryType == 1) {
          return '商家';
        } else if(d.categoryType == 2) {
          return '商品';
        }
      }}
      ,{field: 'categoryName', title: '类名'}
      ,{field: 'sort', title: '排序'}
      ,{title: '操作', width: 210, align: 'center', fixed: 'right', toolbar: '#table-category-manager'}
    ]]
    ,done: function(res, curr, count) {
      // layer.closeAll();
    }
    ,text: {
        none: '暂无数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-category-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        layer.confirm('确定删除此类别？', function(index){
           admin.req({
            url: setter.remoteurl+'/merchant-category/category'
            ,method: 'DELETE'
            ,data: {category_id: data.categoryId}
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
        title: '编辑分类'
        ,area: ['420px', '400px']
        ,id: 'LAY-popup-user-add'
        ,success: function(layero, index){
          view(this.id).render('merchant/category', data).done(function(){
            form.render(null, 'layuiadmin-form-admin');
            
            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              admin.req({
                url: setter.remoteurl+'/merchant-category/category'
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

  exports('merchant-category', {})
});