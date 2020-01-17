/**

 @Name： 扫码人员管理 
 */


layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,setter = layui.setter
  ,table = layui.table
  ,util = layui.util
  ,form = layui.form;

  //网红项目管理
  table.render({
    elem: '#LAY-scan-manage'
    ,url: setter.remoteurl+'/scan/scans' //模拟接口
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
    }
    ,cols: [[
    {type: 'checkbox', fixed: 'left'}
      // ,{field: 'scanId', width: 100, title: 'ID', sort: true}
      ,{field: 'username', title: '姓名', width: 230}
      ,{field: 'cellphone', title: '手机号', width: 200}
      ,{field: 'merchname', title: '商户名称', width: 200}
      ,{field: 'productname', title: '扫码项目', width: 350}
      ,{field: 'enabled', title: '状态',templet: '#buttonTpl', width: 200, align: 'center'}
      ,{field: 'time', title: '添加时间',templet: '#buttonTpl', width: 250, align: 'center', templet:function(d){
        return util.toDateString(d.time, "yyyy-MM-dd HH:mm:ss");
      }}
      ,{title: '操作', align:'center', fixed: 'right',width: 150, toolbar: '#table-scan-webuser'}
    ]]
    ,page: true
    ,limit: 30
    // ,height: 'full-320'
    ,text: {
        none: '暂无数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-scan-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        
        layer.confirm('真的删除行么', function(index){
          admin.req({
            url: setter.remoteurl+'/scan/scans'
            ,method: 'DELETE'
            ,data: {scanId: data.scanId}
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
        title: '编辑扫码人员'
        ,area: ['420px', '450px']
        ,id: 'LAY-popup-scan-edit'        
        ,success: function(layero, index){
          view(this.id).render('set/system/scan', data).done(function(){
            form.render(null, 'layuiadmin-form-scan');
            
            //监听提交
            form.on('submit(LAY-scan-back-submit)', function(data){
              var field = data.field; //获取提交的字段              

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              //$.ajax({});
              admin.req({
                url: setter.remoteurl+'/scan/scans'
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

              layui.table.reload('LAY-scan-manage'); //重载表格
              layer.close(index); //执行关闭                         
            });            
          });
        }
      });
    }else if(obj.event === 'download') {
      alert("下载图片");
    }
  });


  exports('scan', {})
});