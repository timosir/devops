/*上线申请 -- 开始*/
function fn_get_project() {//获取项目
    var url = "api/v1/project/list";
    var jsondata = {};
    var redata = fn_get_ajaxvalue(url, jsondata);
    if (redata != null) {
        if (redata.code == 1000) {
            for (i = 0; i < redata.data.length; i++) {
                var val = redata.data[i];
                $("#s_project").append("<option value=\"" + val.name + "\">" + val.name + "</option>");
            }
        }
        else {
            alert(redata.msg);
        }
    }
}

function fn_get_taglist(lv_project) {//获取tag
    if (lv_project != "") {
        var url = "api/v1/project/taglist";
        var jsondata = { "name": lv_project };
        var redata = fn_ajaxvalue_get(url, jsondata, "GET");
        if (redata != null) {
            if (redata.code == 1000) {
                $("#s_tag").empty();
                for (i = 0; i < redata.data.infos.length; i++) {
                    var val = redata.data.infos[i];
                    $("#s_tag").append("<option value=\"" + val + "\">" + val + "</option>");
                }
            }
            else {
                alert(redata.msg);
            }
        }
    }
}


function fn_get_publishlist(status,projectname,devertag,dever,devertime,tester,leader,opser,opsertime) {
    var url = "api/v1/publish/list";
    var jsondata = {
        "status":status,
        "projectname":projectname,
        "devertag":devertag,
        "dever":dever,
        "devertime":devertime,
        "tester":tester,
        "leader":leader,
        "opser":opser,
        "opsertime":opsertime,
    };
    var redata = fn_get_ajaxvalue_get(url, jsondata,"GET");
    if (redata != null) {
        if (redata.code == "1000") {
            for (i = 0; i < redata.data.length; i++) {
                var val = redata.data[i];
                var lvinfo = "<tr>" +
                    "<td class=\"center status" + val.status + "\"><a href=\"/publish/list?status="+val.status+"\">" + fn_get_status_name(val.status) + "</a></td>" +
                    "<td><a href=\"/publish/list?projectname="+val.project_name+"\">" + val.project_name + "</a></td>" +
                    "<td>" + val.devertag + "</td>" +
                    "<td><a href=\"/publish/list?dever="+encodeURIComponent(val.dever)+"\">" + val.dever + "</a></td>" +
                    "<td>" + val.devertime + "</td>" +
                    "<td>" + (val.tester=="None" ? "" : val.tester) + "</td>" +
                    "<td>" + (val.leader=="None" ? "" : val.leader)+ "</td>" +
                    "<td>" + (val.opser=="None" ? "" : val.opser) + "</td>" +
                    "<td>" + (val.opsertime=="None" ? "" : val.opsertime) + "</td>" +
                    "<td>" + (val.opsstatus=="None"  ? "" : val.opsstatus) + "</td>" +
                    "<td><button type=\"button\" class=\"btn btn-sm operation_publish_item bt" + val.status + "\" data-id=\"" + val.id + "\" data-status=\"" + val.status + "\">" + fn_get_status_name(parseInt(val.status) + 5) + "</button></td>" +
                    "<td><button type=\"button\" class=\"btn delete_publish_item btn-sm btn-danger" + "\" data-id=\"" + val.id + "\" data-status=\"" + val.status + "\">" + fn_get_status_name(10) + "</button></td>" +
                    "</tr>";
                $("#bodylist").append(lvinfo);
            }
            $(".delete_publish_item").click(function () {
                var item_id = $(this).attr("data-id");
                var datajson = {
                    "id": item_id,
                };
                var purl = "api/v1/publish/delete?id=" + item_id;
                if(!window.confirm("确定删除？")){
                     return ;
                 }
                var redata = fn_get_ajaxvalue(purl, datajson);
                if (redata != null) {
                    if (redata.code == "1000") {
                        alert("删除成功");
                        location.reload();
                    }
                    else {
                        alert(redata.msg);
                    }
                }
            });
            $(".operation_publish_item").click(function () {
                var id = $(this).attr("data-id");
                var status = $(this).attr("data-status");
                if (status == "0") {
                    location.href = "/publish/add?id=" + id + "&status=" + status;
                } else if (status == "4") {
                    location.href = "/publish/view?id=" + id + "&status=" + status;
                } else if (status == "3") {
                    location.href = "/publish/ops?id=" + id + "&status=" + status;
                }else {
                    location.href = "/publish/next?id=" + id + "&status=" + status;
                }
            });
        }
        else {
            alert(redata.msg);
        }
    }
}




function fn_bind_publish() {
    var pourl = "api/v1/publish/content";
    var jsondata = { "id": pvid };
    var redata = fn_get_ajaxvalue_get(pourl, jsondata,"GET");
    if (redata != null) {
        if (redata.code == "1000") {
            //if (status == 1) {
            //    fn_get_taglist(redata.data.project_name);
            //}
            var info = "<li><p><b>项目名称</b><br></p><p>" + redata.data[0].project_name + "</p></li>" +
                "<li><p><b>提测分支</b><br></p><p>" + redata.data[0].devertag + " "+ ''+"</p></li>" +
                "<li><p><b>提测内容</b><br></p><p>" + redata.data[0].project_context + "</p></li>";
            if (redata.data[0].tester != null && redata.data[0].tester != "") {
                info += "<li><p><b>测试(" + redata.data[0].tester + ")</b><br></p><p>" + redata.data[0].testertime + "<br>" + redata.data[0].testercontent + "<br></p></li>";
            }
            else if (redata.data[0].tester  == "None"){
            info += "<li><p><b>测试(" + '' + ")</b><br></p><p>" + '' + "<br>" + ' ' + "<br></p></li>";
            }
            else{
                         info += "<li><p><b>测试审核(" + '' + ")</b><br></p><p>" + '' + "<br>" + ' ' + "<br></p></li>";

            }


            if (redata.data[0].leader != null && redata.data[0].leader != "") {
                info += "<li><p><b>开发审批(" + redata.data[0].leader + ")</b><br></p><p>" + redata.data[0].leadertime + "<br>" + redata.data[0].leadercontent + "<br></p></li>";
            }
            if (redata.data[0].opser != null && redata.data[0].opser != "") {
                info += "<li><p><b>运维上线(" + redata.data[0].opser + ")</b><br></p><p>" + redata.data[0].opsertime + "</p></li>";
            }
            $("#projectbody").html(info);
            $(".btn-info").attr("project-name", redata.data[0].project_name)
        }
        else {
            alert(redata.msg);
        }
    }
}

function fn_get_project_Description(id){
    var data="";
    var url = "api/v1/publish/content";
    var jsondata = {
        "id": id
    }
    $.ajax({
        type: 'get',
        url: '/' + url,
        data: jsondata,
        cache: false,
        async: false,
        dataType: 'text',
        success: function (redata) {
            data=redata;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
    return data;
}


function fn_update_publish_status(newstatus, purl, ptype) {
    var vinfo = htmlclear($("#inputDescription").val());
    var tag = $("#s_tag").val();
    var datajson = {
        "project_id": pvid,
        "s_tag": tag,
        "pass": newstatus,
        "inputDescription": vinfo,
        "code": ptype,
    };
    var redata = fn_get_ajaxvalue(purl, datajson);
    if (redata != null) {
        if (redata.code == "1000") {
            location.href = "/publish/list";
        }
        else {
            $(".test_pass").removeAttr("disabled");
            $(".test_fail").removeAttr("disabled");
            alert(redata.msg);

        }
    }
}

function fn_update_publis_ops(purl) {
    var env = $("#env").val();
    var datajson = {
        "id": pvid,
        "pass": status,
        "env": $.trim(env)
    };
     if ( env == "" ) {
        alert("请输入上线名称！")
        return;
    }
    var redata = fn_get_ajaxvalue(purl, datajson);
    if (redata != null) {
        if (redata.code == "1000") {
            location.href = "/publish/list";
        }
        else {
            $(".project_deploy").removeAttr("disabled");
            alert(redata.msg);
        }
    }
}

/*上线申请 -- 结束*/

/*项目管理 -- 开始 */
function fn_get_project_list() {
    $("#bodylist").empty();
    var url = "api/v1/project/list";
    var jsondata = {};
    var redata = fn_get_ajaxvalue(url, jsondata);
    var boolreflash=false;
    var pid = 0;
    var booldev = false;
    var devpid = 0;
    if (redata != null) {
        if (redata.code == 1000) {
            for (i = 0; i < redata.data.length; i++) {
                var val = redata.data[i];
                    //alert(val.current)
                    //alert(val.deploy_version)
                if (val.deploy_version == "发布失败") {
                    var lvinfo = "<tr>" +
                        "<td class=\"center id\">" + val.id + "</td>" +
                        "<td class=\"name\">" + val.name + "</td>" +
                         "<td class=\"manager\">" + val.manager + "</td>" +
                        "<td class=\"version text-red\">" + val.version + "</td>" +
                        "<td class=\"compiletime \">" + val.compiletime + "</td>" +
                         "<td class=\"project_deploy\">" + val.project_deploy + "</td>" +
                        "<td>" +val.deploytime + "</td>" +
                        "<td class=\"deploy_version text-red\">" + val.deploy_version + "</td>" +
                        "<td>" +val.opoer + "</td>" ;

                }else {
                    var lvinfo = "<tr>" +
                        "<td class=\"center id\">" + val.id + "</td>" +
                        "<td class=\"name\">" + val.name + "</td>" +
                         "<td class=\"manager\">" + val.manager + "</td>" +
                        "<td class=\"version\">" + val.version + "</td>" +
                        "<td class=\"compiletime\">" + val.compiletime + "</td>" +
                         "<td class=\"project_deploy\">" + val.project_deploy + "</td>" +
                        "<td>" + val.deploytime + "</td>" +
                        "<td class=\"deploy_version text-red\">" + val.deploy_version + "</td>" +
                        "<td>" +val.opoer + "</td>" ;

                }
                    if(val.status==0||val.compilestatus==0||val.deploystatus==0){
                        var txt='正在下载中...'
                        if(val.compilestatus==0){
                            txt='正在编译中...'
                        };
                        if(val.deploystatus==0){
                            txt='正在发布中...'
                        };
                        lvinfo += "<td colspan='3' align='center' style='color:#dc0000;font-size:16px;font-weight:bold;'>"+txt+"</td></tr>";
                        boolreflash=true;
                        pid=val.id;
                    }
                    else{
                         lvinfo += "<td><button type=\"button\" class=\"btn btn-sm btn-primary btn-update\" data-id=\"" + val.id + "\">更新</button></td>";
                        lvinfo += "<td><button type=\"button\" class=\"btn btn-sm btn-success\" data-id=\"" + val.id + "\" data-toggle=\"modal\" data-target=\"#myModal\">编译</button></td>";
                        lvinfo += "<td><button type=\"button\" class=\"btn btn-sm btn-info\" data-id=\"" + val.id + "\">发布</button></td>";
//                         lvinfo += "<td><button type=\"button\" class=\"btn btn-sm btn-primary btn-download\" data-id=\"" + val.id + "\">下载</button></td>";
                         if(val.download_url){
                                                  lvinfo += "<td><a href='"+(val.download_url||'')+"'  type=\"button\" class=\"btn btn-sm btn-primary\" data-id=\"" + val.id + "\">下载</a></td>";
                         }else{
                                                  lvinfo += "<td><button  type=\"button\" class=\"btn btn-sm btn-primary btn-download\" data-id=\"" + val.id + "\">下载</button></td>";

                         }


                        /*if (val.deploystatus == "0") {
                            lvinfo += "<td><button type=\"button\" class=\"btn btn-sm btn-danger\" data-id=\"" + val.id + "\" disabled>发布中…</button></td>";
                            devpid = val.id;
                            booldev = true;
                        } else {

                        };*/

                    }
                $("#bodylist").append(lvinfo);
            }
             $(".btn-update").click(function () {//更新tag
                var id = $(this).attr("data-id");
                var projectname = $(this).parent().parent().find("td.name").html();
                $(this).text("处理中").attr("disabled","disabled");
                fn_get_ajaxvalue("api/v1/project/updatetags",{project_name:projectname});
                $(this).text("更新").attr("disabled",false);
            });


             /*$(".btn-primary").click(function () {//修改
                var id = $(this).attr("data-id");
                location.href="/task/create?id="+id;
            });*/
            $(".btn-download").click(function () {//下载
                window.alert('文件地址不存在')
//                var id = $(this).attr("data-id");
//                var projectname = $(this).parent().parent().find("td.name").html();
//                $(this).text("处理中").attr("disabled","disabled")
//                var jsondata = {
//                    "project_name": projectname
//                };
//                fn_get_ajaxvalue("api/v1/project/downloadpackage",jsondata);
//                $(this).text("下载").attr("disabled",false);
            });

            $(".btn-info").click(function () {//发布
                var _id = $(this).parent().parent().find("td.id").html();
                var _name = $(this).parent().parent().find("td.name").html();
                var _project_deploy = $(this).parent().parent().find("td.project_deploy").html();
                var url = "api/v1/project/deploy";
                var jsondata = {
                    "name": _name,
                    "project_deploy": _project_deploy,
                    "id": _id
                };
                fn_project_publish(url,jsondata,this);

                //var redata = fn_get_ajaxvalue(url, jsondata, "POST");
                /*if (redata != null) {
                    if (redata.code == 1000) {
                        alert("发布中");
                    } else {
                        alert(redata.msg);
                    }
                }*/
            });
        }
        else {
            alert(redata.msg);
        }
    }
    if(boolreflash){
        setTimeout("fn_checkstatus('"+pid+"');",5000);
    }
    if (booldev) {
        setTimeout("fn_check_devstatus('" + devpid + "');", 5000);
    }
}

function fn_check_devstatus(pid) {
    var pvurl = "deploystatus";
    var rejsondata = { "id": pid };
    var redata = fn_get_ajaxvalue(pvurl, rejsondata);
    if (redata != null) {
        if (redata.code == "1000" && redata.data.deploy_status=="0") {//表示更新成功
            window.location.reload();
        }
        else {
            setTimeout("fn_check_devstatus('" + pid + "');", 5000);
        }
    }
}

function fn_checkstatus(pid){
    var pvurl="api/v1/project/status";
    var rejsondata={"id":pid};
    var redata = fn_get_ajaxvalue(pvurl, rejsondata);
    if (redata != null) {
        if (redata.code == "1000" && redata.data.status=="0") {//表示更新成功
            window.location.reload();
        }
        else {
            setTimeout("fn_checkstatus('"+pid+"');",5000);
        }
    }
}
// function DeployVersion(projectId, version, callback) {//发布
//     var pvurl = "deploy_project";
//     var postData = {
//         "project_id": projectId,
//         "current": version
//     }
//     fn_get_ajaxvalue_async(pvurl, postData);
// }



function fn_project_update(project_name, id, vurl) {
    BootstrapDialog.show({
        title: '更新编译',
//        message: function (content) {
//           var html=$('<select id="projectSelect" class="form-control project-tag n-chosen">' + get_branchList(project_name) + '</select>');
//
//            return html;
//        },
        message:function () {
            return $('<div></div>').load(fn_get_ajaxhtml('task/update_compile',{}));
        },

        buttons: [
            {
                id: 'btn-deploy',
                label: '确认',
                cssClass : "btn-primary",
                action: function (dialog) {
                    window.dialog = dialog;
                    var button = this; // 'this' here is a jQuery object that wrapping the <button> DOM element.
                    var tags = $(button).parent().parent().parent().parent().find(".project-tag").val();

                    if (tags != "") {
                        $.ajax({
                            type: "post",
                            url: vurl,
                            dataType: 'json',
                            data: { "project_name": project_name, "tags": tags },
                            beforeSend: function (xhr) {
                                button.disable();
                                button.spin();
                                dialog.setClosable(false);
                            },
                            success: function (updateResult) {
                                if (updateResult.code == 1000) {
                                    BootstrapDialog.show({
                                        title: '提示',
                                        message: '更新编译成功',
                                        buttons: [{
                                            id: 'btn-deploy',
                                            label: '确认',
                                            cssClass:'btn-primary',
                                            action: function (dialog1) {
                                                button.enable();
                                                button.stopSpin();
                                                dialog.setClosable(true);
                                                dialog.close();
                                                window.location.reload();
                                            }
                                        }]
                                    });
                                }
                                else {
                                    alert(updateResult.msg);
                                    button.enable();
                                    button.stopSpin();
                                    dialog.setClosable(true);
                                    dialog.close();
                                    window.location.reload();
                                }
                            }
                        });
                    } else {
                        alert("请选择要发布的版本！");
                        return;
                    }
                }
            }]
    });
    $(".type-primary").attr("style", "z-index: 1050; display: block;");
}
function fn_project_publish (url,jsonData,btn) {
    BootstrapDialog.show({
        title: '端口号修改',
        message: function (content) {
           return $('<input class="form-control project-port" />');
        },
        buttons: [
            {
                id: 'btn-publish',
                label: '确认',
                cssClass : "btn-primary",
                action: function (dialog) {
                    window.dialog = dialog;
                    var button = this; // 'this' here is a jQuery object that wrapping the <button> DOM element.
                    var tags = $(button).parent().parent().parent().parent().find(".project-port").val();
                    if (tags != "") {
                        jsonData.project_deploy=$.trim(tags);
                        var redata = fn_get_ajaxvalue_publish(url, jsonData,button)
//                        if (redata != null) {
//                            if (redata.code == 1000) {
//                                alert("发布中");
//                                fn_get_project_list();
//
//                            } else {
//                                alert(redata.msg);
//                            }
//                        }
                        dialog.close();
                    } else {
                        //alert("请选择要发布的版本！");
                        return;
                    }
                }
            }]
    });
}

function listCommits(projectId) {//获取tag
    var taglisturl = "list_tags?project_id=" + projectId;
    var rejsondata = {};
    var redata = fn_ajaxvalue(taglisturl, rejsondata);
    var info = "";
    if (redata != null) {

        if (redata.code == "1000") {

            info += "<option value=\"\">请选择要发布的版本</option>";
            for (i = 0; i < redata.data.infos.length; i++) {
                var v = redata.data.infos[i];
                info += "<option value=\"" + v + "\">" + v + "</option>";
            }
        }
        else {
            alert(redata.msg);
        }
    }
    return info;
}





function fn_add_project() {
    var inputName = $("#inputName").val();
    var inputLink = $("#inputLink").val();
    var inputTitle = $("#inputTitle").val();
    var inputDescription = $("#inputDescription").val();
    if (inputTitle == "" || inputName == "" || inputLink == "") {
        alert("项目名称、项目地址、项目负责人、必须填写！");
        return;
    }
    var jsondata = {
        "inputName": inputName,
        "inputTitle": inputTitle,
        "inputLink": inputLink,
        "inputDescription": inputDescription

    };
    var reurl = "api/v1/project/add";
    /*if (pvid != undefined && pvid != "") {
        reurl = "show_edit_project_member";
        jsondata = {
            "id":pvid,
            "title": inputTitle,
            "description": inputDescription,
            "member": userlist,
        };
    }*/
    var redata = fn_get_ajaxvalue(reurl, jsondata);
    if (redata.code == 1000) {
        alert("项目添加成功！");
        location.href = "/task/list";
    }
    else {
        alert(redata.msg);
        $(".project_add").removeAttr("disabled");
    }
}
/*项目管理 -- 结束 */
/*用户管理 -- 开始*/
function fn_get_userlist() {
    var url = "api/v1/user/list";
    var jsondata = {};
    var redata = fn_get_ajaxvalue_get(url, jsondata, "GET");
    if (redata != null) {
        if (redata.code == 1000) {
            for (i = 0; i < redata.data.length; i++) {
                var val = redata.data[i];
                var lvinfo = "<tr>" +
                    "<td class=\"center\">" + (i + 1) + "</td>" +
                    "<td>" + val.name + "</td>" +
                    "<td>" + val.username + "</td>"+
                    "<td>" + val.role + "</td>"+
                    "<td> <a href=\"\" onclick=\"fn_del_userlist(" + val.id + ");\" class=\"delete_confirm\">删除</a></td></tr>";

                     "</tr>";
                $("#bodylist").append(lvinfo);

            }
        }
        else {
            alert(redata.msg);
        }
    }
}

//版本列表
function fn_get_publishapplist(id,projectname,version,devertime,dever) {
    var url = "api/v1/publish/applist";
    var jsondata = {

        "id":id,
        "projectname":projectname,
        "version":version,
        "devertime":devertime,
        "dever":dever,

    }
    var redata = fn_get_ajaxvalue_get(url, jsondata, "GET");
    if (redata != null) {
        if (redata.code == 1000) {
            for (i = 0; i < redata.data.length; i++) {
                var val = redata.data[i];
                var lvinfo = "<tr>" +
                    "<td>" + val.project_name + "</td>" +
                    "<td>" + val.version + "</td>"+
                    "<td>" + val.packagename + "</td>"+
                    "<td>" + val.devertime + "</td>"+
                     "<td>" + val.dever + "</td>"+
                    "<td>" + val.status + "</td>"+

                     "</tr>";
                $("#bodylist").append(lvinfo);

            }
        }
        else {
            alert(redata.msg);
        }
    }
}

//增加用户
function fn_add_userlist(id) {
    var user_name = $("#user_name").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var roles = "";
    $("input[name='roles']").each(function () {
        if ($(this).is(":checked")) {
            roles = $(this).val();
        }
    });
    if(!roles){
        alert('请选择角色')
        return ;
    }

    if ( user_name == "" || email == "") {
        alert("用户名、邮箱、角色都是必填项！")
        return;
    }
    var jsondata = {
        "inputName": user_name,
        "inputEmail": email,
        "imputRoleid": roles,
        "inputPassword": password,
    };
    var url = "api/v1/user/add";
    if (id != "") {
        var url = "api/v1/user/detail";
        jsondata = {
            "id": id,
            "inputName": user_name,
            "inputEmail": email,
            "inputRole": roles,
            "inputPassword": password,
        };
    } else {
        if (password.length < 5) {
            alert("密码长度不能小于6位");
            return;
        }
    }

    var redata = fn_get_ajaxvalue(url, jsondata);
    if (redata.code == 1000) {
        alert("用户添加成功！");
        location.href = "/user/list";
    }
    else {
        alert(redata.msg);
    }
}


function fn_del_userlist(id) {
    var url = "api/v1/user/delete";
    fn_del_data(id, "用户", url, "/user/list");

}
/*用户管理 -- 结束*/

/*角色操作  --  开始 */
function fn_add_rolelist(id) {
    var url = "show_role_add";
    var jsondata = {
        "inputName": $("#rolename").val(),
        "inputDescription": $("#description").val(),
    };
    if (id != "") {
        url = "show_role_edit";
        jsondata = {
            "id": id,
            "inputName": $("#rolename").val(),
            "inputDescription": $("#description").val(),
        };
    }
    var redata = fn_get_ajaxvalue(url, jsondata);
    if (redata.code == 1000) {
        alert("角色添加成功！");
        location.href = "/role/list";
    }
    else {
        alert(redata.msg);
    }
}
function fn_get_roles() {//获取角色
    var url = "api/v1/role/list";
    var jsondata = {};
    var redata = fn_get_ajaxvalue_get(url, jsondata, "GET");
       return redata;
}

function fn_get_rolelist() {//获取角色
    var url = "api/v1/role/list";
    var jsondata = {};
    var redata = fn_get_ajaxvalue_get(url, jsondata, "GET");
    if (redata != null) {
        if (redata.code == 1000) {
            for (i = 0; i < redata.data.length; i++) {
                var datai = redata.data[i];
                var lv_info = "<tr>" +
                    "<td>" + datai.role_name + "</td>" +
                    "<td>" + datai.permission + "</td>"
                $("#bodylist").append(lv_info);
            }
        }
        else {
            alert(redata.msg);
        }
    }
}
function get_permissions() {
    var url = "api/v1/role/rolepermisson";
    var jsondata = {};
    var redata = fn_get_ajaxvalue_get(url, jsondata, "GET");
    if (redata != null) {
        if (redata.code == 1000) {
         return redata.data
        }else{
            return []
        }
    }else{ return []}
}


function fn_get_permissionlist() {//获取角色
    var url = "api/v1/role/rolepermisson";
    var jsondata = {};
    var redata = fn_get_ajaxvalue_get(url, jsondata, "GET");
    if (redata != null) {
        if (redata.code == 1000) {
            for (i = 0; i < redata.data.length; i++) {
                var datai = redata.data[i];
                var lv_info = "<tr>" +
                    "<td>" + datai.permission + "</td>" +
                    "<td>" + datai.permission_desc + "</td>" +
                     "<td>" + datai.content + "</td>" +
                    "<td> <a href=\"/role_add?id=" + datai.id + "\">编辑</a> | <a href=\"\" onclick=\"fn_del_rolelist(" + datai.id + ");\" class=\"delete_confirm\">删除</a></td></tr>";
                $("#bodylist").append(lv_info);
            }
        }
        else {
            alert(redata.msg);
        }
    }
}

function fn_get_user_role_list() {//获取角色
    var url = "api/v1/role/userrole";
    var jsondata = {};
    var redata = fn_get_ajaxvalue_get(url, jsondata, "GET");
    if (redata != null) {
        if (redata.code == 1000) {
            for (i = 0; i < redata.data.length; i++) {
                var datai = redata.data[i];
                var lv_info = "<tr>" +
                    "<td>" + datai.user_id + "</td>" +
                    "<td>" + datai.role_id + "</td>" +
                    "<td><a href=\"/role_power?id=1\">权限</a> | <a href=\"/role_add?id=" + datai.id + "\">编辑</a> | <a href=\"\" onclick=\"fn_del_rolelist(" + datai.id + ");\" class=\"delete_confirm\">删除</a></td></tr>";
                $("#bodylist").append(lv_info);
            }
        }
        else {
            alert(redata.msg);
        }
    }
}



/*角色处理程序 --结束*/

//删除数据
function fn_del_data(id, name, url, reurl) {
    if (confirm("" + name + "信息一旦删除，无法恢复！确定要删除当前" + name + "吗？")) {
        var url = url;
        var jsondata = { "id": id, };
        var redata = fn_get_ajaxvalue(url, jsondata);
        if (redata.code == 1000) {
            alert("" + name + "删除成功！");
            location.href = "/" + reurl;
        }
        else {
            alert(redata.msg);
        }
    }
}

//公共程序
/*返回状态名称*/
var ps_status_name = new Array(11);
ps_status_name[0] = "开发中";
ps_status_name[1] = "测试中";
ps_status_name[2] = "审批中";
ps_status_name[3] = "上线中";
ps_status_name[4] = "已完成";
ps_status_name[5] = "提测";
ps_status_name[6] = "测试完成";
ps_status_name[7] = "审批";
ps_status_name[8] = "上线";
ps_status_name[9] = "查看";
ps_status_name[10] = "删除";
function fn_get_status_name(num) {
    if (parseInt(num) < 11) {
        return ps_status_name[parseInt(num)];
    } else {
        return "";
    }
}
function fn_get_ajaxhtml(url, jsondata) {//传入地址和入参，通过ajax返回json结果
    var redata = null;
    $.ajax({
        type: 'post',
        url: '/' + url,
        //data: jsondata,
        cache: false,
        async: false,
        dataType: 'html',
        success: function (html) {

            return html
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
    return redata;
}
function fn_get_ajaxvalue(url, jsondata) {//传入地址和入参，通过ajax返回json结果
    var redata = null;
    $.ajax({
        type: 'post',
        url: '/' + url,
        data: jsondata,
        cache: false,
        async: false,
        dataType: 'json',
        success: function (data) {
            redata=data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
    return redata;
}


function fn_get_ajaxvalues(url, jsondata) {//传入地址和入参，通过ajax返回json结果
    var redata = null;
    $.ajax({
        type: 'post',
        url: '/' + url,
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
        contentType:'application/json; charset=utf-8',
        cache: false,
        async: false,
        dataType: 'json',
        data: JSON.stringify(jsondata),
        success: function (data) {
            redata=data;

            if (data != null) {
                            if (data.code == 1000) {
                                alert("添加成功");
                                location.href = "/permission/list";
                            } else {
                                alert(data.msg);
                            }
                        }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
    return redata;
}
function fn_get_ajaxvalue_publish(url, jsondata,button) {//传入地址和入参，通过ajax返回json结果
    var redata = null;
    $.ajax({
        type: 'post',
        url: '/' + url,
        data: jsondata,
        cache: false,
        async: false,
        dataType: 'json',

        success: function (data) {

            if (data != null) {
                            if (data.code == 1000) {
                                //alert("发布中");
                                fn_get_project_list();

                            } else {
                                alert(data.msg);
                            }
                        }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
    return redata;
}

function fn_get_ajaxvalue_get(url, jsondata,type) {//传入地址和入参，通过ajax返回json结果
    var redata = null;
    $.ajax({
        type: type,
        url: '/' + url,
        data: jsondata,
        cache: false,
        async: false,
        dataType: 'json',
        success: function (data) {
            redata = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
    return redata;
}



function fn_get_ajaxvalue_async(projectId, version, callback) {//传入地址和入参，通过ajax返回json结果
    var redata = null;
    var url = "deploy_project";
    var jsondata = {
        "project_id": projectId,
        "current": version
    }
    $.ajax({
        type: 'post',
        url: '/' + url,
        data: jsondata,
        cache: false,
        async: true,
        dataType: 'json',
        success: function (data) {
            if (data.code == "1000") {
                alert("发布成功！");
                callback();
            }

            else {
                alert(data.msg);
                callback();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
            callback();
        }
    });
    return redata;
}

function getQueryString(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}


function htmlEncode(value) {
    if (value) {
        return jQuery('<div />').text(value).html();
    } else {
        return '';
    }
}

function htmlDecode(value) {
    if (value) {
        return $('<div />').html(value).text();
    } else {
        return '';
    }
}

function htmlclear(vinfo) {
    vinfo = vinfo.replace(/"/g, "'");
    vinfo = vinfo.replace(/	/g, "");
    vinfo=vinfo.replace(/\n/g,"<br>");
    return vinfo;
}


function fn_ajaxvalue_get(url, jsondata, type) {//传入地址和入参，通过ajax返回json结果
    var redata = null;
    $.ajax({
        type: type,
        url: '/' + url,
        data: jsondata,
        cache: false,
        async: false,
        dataType: 'json',
        success: function (data) {
            redata = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
    return redata;
}

function get_branchList(project_name) {
    var url = "api/v1/project/taglist";
    var jsondata = {
            "name": project_name
        };
    var redata = fn_ajaxvalue_get(url, jsondata, "GET");
    var info = "";
    if (redata != null) {
        if (redata.code == 1000) {

            //info += "<option value=\"\">请选择分支</option>";
            for (i = 0; i < redata.data.infos.length; i++) {
                var v = redata.data.infos[i];
                info += "<option value=\"" + v + "\">" + v + "</option>";
            }
        } else {
            alert(redata.msg);
        }
        return info;
    }
}
