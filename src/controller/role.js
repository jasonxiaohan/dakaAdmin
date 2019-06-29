// /**

//  @Name：layuiAdmin 用户管理 管理员管理 角色管理
//  @Author：jasonxiaohan
//  @Site：http://www.layui.com/admin/
//  @License：LPPL
    
//  */


// layui.define(['table', 'form'], function(exports){
//   var $ = layui.$
//   ,admin = layui.admin
//   ,view = layui.view
//   ,setter = layui.setter
//   ,table = layui.table
//   ,form = layui.form;

//   form.render();

//   form.on('submit(LAY-user-role-submit)', function(obj){
//     admin.req({
//       url: setter.remoteurl+'/systemrole/roles'
//       ,method: 'POST'
//       ,data: obj.field
//       ,success: function(res){
//         if (res.code == 0) {
//           layer.msg("添加成功",{time: 1000,icon: 1},function(){
//               var index = parent.layer.getFrameIndex(window.name);
//               parent.layer.close(index);
//               window.parent.location.reload();
//           });
//         } else {
//           layer.msg(res.msg, {icon: 5});
//         }
//       }
//     }); 
//     return true;
//   });

//   exports('role', {})
// });