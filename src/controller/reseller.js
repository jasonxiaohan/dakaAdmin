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

  //分销商列表
  table.render({
    elem: '#LAY-reseller-manage'
    ,url: setter.remoteurl+'/systemadmin/resource-list'
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
      level: 1,
      is_resource: 1,
      partner_type: 3,
    }
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      ,{field: 'partner_name', title: '分销商账号'}
      ,{field: 'protocol_name', title: '价格协议', width: 250}
      ,{field: 'contract', title: '联系人', width: 160,templet:function(d) {
        return d.contract+" "+d.cellphone; 
      }}
      ,{field: 'username', title: '登录账号'}
      ,{field: 'createTime', title: '创建时间',templet:function(d){return util.toDateString(d.createTime, "yyyy-MM-dd");}}
      ,{field: 'isDel', title:'审核状态', templet: '#buttonTpl', minWidth: 80, align: 'center'}
      ,{title: '操作', width: 210, align: 'center', fixed: 'right', toolbar: '#table-reseller-manager'}
    ]]
    ,done: function(res, curr, count) {
      // layer.closeAll();
    }
    ,page: true
    ,limit: 10
    ,text: {
        none: '暂无数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-reseller-manage)', function(obj){
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
          view(this.id).render('channel/reseller', data).done(function(){
            form.render(null, 'layuiadmin-form-merchant');
                     
            //监听提交
            form.on('submit(LAY-user-back-submit)', function(data){
              var field = data.field; //获取提交的字段
              var authority = new Array();
              $("input[name='authority']:checked").each(function(){
                  authority.push($(this).val());
              });
              field.authority = authority.join(',');

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
    } else if(obj.event === 'merchant-product-list'){ 
      console.log(data);
      location.href = '#/merchant/product-list/merchant_id='+data.adminId;
    } 
  });

  exports('reseller', {})
});