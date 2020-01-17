/**

 @Name： 分账人员管理 
 */
layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,admin = layui.admin
  ,view = layui.view
  ,setter = layui.setter
  ,table = layui.table
  ,util = layui.util
  ,form = layui.form;

  //分账人员管理
  table.render({
    elem: '#LAY-profit-manage'
    ,url: setter.remoteurl+'/profit/profits' //模拟接口
    ,where: {
      access_token: layui.data(setter.tableName).access_token,
    }
    ,cols: [[
    {type: 'checkbox', fixed: 'left'}
      // ,{field: 'profitId', width: 100, title: 'ID', sort: true}
      ,{field: 'type', title: '接收方类型', width: 150, templet:function(d){
        if(d.type == 'MERCHANT_ID') {
          return '商户ID';
        } else if(d.type == 'PERSONAL_WECHATID') {
          return '个人微信';
        } 
        return '个人openid';
      }}
      ,{field: 'name', title: '姓名', width: 120}
      ,{field: 'account', title: '账号', width: 170}
      ,{field: 'relation_type', title: '关系类型', width: 200, templet:function(d) {
        if(d == 'SERVICE_PROVIDER') {
          return '服务商';
        }else if(d.relation_type == 'STORE') {
          return '门店';
        }else if(d.relation_type == 'STAFF') {
          return '员工';
        }else if(d.relation_type == 'STORE_OWNER') {
          return '店主';
        }else if(d.relation_type == 'PARTNER') {
          return '合作伙伴';
        }else if(d.relation_type == 'HEADQUARTER') {
          return '总部';
        } else if(d.relation_type == 'BRAND') {
          return '品牌方';
        }else if(d.relation_type == 'DISTRIBUTOR') {
          return '分销商';
        }else if(d.relation_type == 'USER') {
          return '用户';
        }else if(d.relation_type == 'SUPPLIER') {
          return '供应商';
        }
      }}
      ,{field: 'merchname', title: '商户名称', width: 200}
      ,{field: 'productname', title: '分账项目名称', width: 200}
      ,{field: 'enabled', title: '状态',templet: '#buttonTpl', width: 200, align: 'center'}
      ,{field: 'time', title: '添加时间',templet: '#buttonTpl', align: 'center', templet:function(d){
        return util.toDateString(d.time, "yyyy-MM-dd HH:mm:ss");
      }}
      ,{title: '操作', align:'center', fixed: 'right',width: 150, toolbar: '#table-profit-webuser'}
    ]]
    ,page: true
    ,limit: 30
    // ,height: 'full-320'
    ,text: {
        none: '暂无数据'
      }
  });
  
  //监听工具条
  table.on('tool(LAY-profit-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.prompt({
        formType: 1
        ,title: '敏感操作，请验证口令'
      }, function(value, index){
        layer.close(index);
        
        layer.confirm('真的删除行么', function(index){
          admin.req({
            url: setter.remoteurl+'/profit/profits'
            ,method: 'DELETE'
            ,data: {profitId: data.profitId}
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
        title: '编辑分账人员'
        ,area: ['450px', '550px']
        ,id: 'LAY-popup-profit-edit'
        ,success: function(layero, index){
          view(this.id).render('set/system/profit', data).done(function(){
            form.render(null, 'layuiadmin-form-profit');
            
            //监听提交
            form.on('submit(LAY-profit-back-submit)', function(data){
              var field = data.field; //获取提交的字段

              //提交 Ajax 成功后，关闭当前弹层并重载表格
              //$.ajax({});
              admin.req({
                url: setter.remoteurl+'/profit/profits'
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

              layui.table.reload('LAY-profit-manage'); //重载表格
              layer.close(index); //执行关闭 
            });
          });
        }
      });
    }else if(obj.event === 'download') {
      alert("下载图片");
    }
  });


  exports('profit', {})
});