/**

 @Name： 广告管理 
 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,setter = layui.setter
  ,table = layui.table
  ,form = layui.form;

  //网红项目管理
  table.render({
    elem: '#LAY-ad-manage'
    ,url: setter.remoteurl+'/ad/adverts' //模拟接口
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
      enabled: -1,
      position: -1
    }
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      // ,{field: 'adId', width: 100, title: 'ID', sort: true}
      ,{field: 'title', title: '项目名称', width: 200}
      ,{field: 'enabled', title: '状态',templet: '#buttonTpl',align: 'center',width: 100}
      ,{field: 'position', title: '显示位置', width: 150, templet:function(d) {
        if (d.position == 1) {
          return '验票页';
        } else if(d.position == 2) {
          return '支付成功页';
        }
      }}
      ,{field: 'img', title: '相片', width: 200, templet: '#imgTpl'}
      ,{field: 'link', title: '链接', width: 300}     
      ,{title: '操作', align:'center', fixed: 'right',width: 150, toolbar: '#table-ad-webuser'}
    ]]
    ,page: true
    ,limit: 30
    // ,height: 'full-320'
    ,text: {
        none: '暂无数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-ad-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        
        layer.confirm('真的删除行么', function(index){
          admin.req({
            url: setter.remoteurl+'/ad/adverts'
            ,method: 'DELETE'
            ,data: {advert_id: data.id}
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
        title: '编辑广告'
        ,area: ['550px', '450px']
        ,id: 'LAY-popup-ad-add'
        ,success: function(layero, index){
          view(this.id).render('set/system/ad', data).done(function(){
            form.render(null, 'layuiadmin-form-ad');
            
            //监听提交
            form.on('submit(LAY-ad-back-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              //$.ajax({});
              admin.req({
                url: setter.remoteurl+'/ad/adverts'
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

              layui.table.reload('LAY-ad-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    }
  });

  exports('ad', {})
});