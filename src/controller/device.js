/**

 @Name： 设备管理 
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
    elem: '#LAY-device-manage'
    ,url: setter.remoteurl+'/system-device/devices' //模拟接口
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
    }
    ,cols: [[
      {type: 'checkbox', fixed: 'left'}
      // ,{field: 'adId', width: 100, title: 'ID', sort: true}
      ,{field: 'device_name', title: '设备名称', width: 265}
      ,{field: 'username', title: '商户名称', width: 255}
      ,{field: 'device_uuid', title: '设备编号', width: 230}
      ,{field: 'status', title: '状态',templet: '#buttonTpl',align: 'center',width: 100}
      // ,{field: 'img', title: '照片', width: 200, templet: '#imgTpl'}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-ad-webuser'}
    ]]
    ,page: true
    ,limit: 30
    // ,height: 'full-320'
    ,text: {
        none: '暂无数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-device-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        
        layer.confirm('真的删除行么', function(index){
          admin.req({
            url: setter.remoteurl+'/system-device/devices'
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
        title: '编辑设备'
        ,area: ['550px', '450px']
        ,id: 'LAY-popup-ad-add'
        ,success: function(layero, index){
          view(this.id).render('device/device', data).done(function(){
            form.render(null, 'layuiadmin-form-ad');
            
            //监听提交
            form.on('submit(LAY-ad-back-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              //$.ajax({});
              admin.req({
                url: setter.remoteurl+'/system-device/device'
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

              layui.table.reload('LAY-device-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    }else if(obj.event === 'open'){
      var field = obj.data; //获取提交的字段
      field.device_status = 1;
      admin.req({
        url: setter.remoteurl+'/system-device/bootup'
        ,method: 'PUT'
        ,data: field
        ,success: function(res){
          if (res.code == 0) {
            layer.msg("开机成功",{time: 1000,icon: 1},function(){
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
      layui.table.reload('LAY-device-manage'); //重载表格
      layer.close(index);
    } else if(obj.event === 'close'){
      var field = obj.data; //获取提交的字段
      field.device_status = 0;
      admin.req({
        url: setter.remoteurl+'/system-device/bootup'
        ,method: 'PUT'
        ,data: field
        ,success: function(res){
          if (res.code == 0) {
            layer.msg("开机成功",{time: 1000,icon: 1},function(){
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
      layui.table.reload('LAY-device-manage'); //重载表格
      layer.close(index);
    } else if(obj.event === 'delete'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        
        layer.confirm('真的删除行么', function(index){
          admin.req({
            url: setter.remoteurl+'/system-device/device'
            ,method: 'DELETE'
            ,data: {id: data.id}
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
          layui.table.reload('LAY-device-manage'); //重载表格
          layer.close(index);
        });
      });
    }
  });

  exports('device', {})
});