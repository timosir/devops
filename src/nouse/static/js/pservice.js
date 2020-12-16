function fn_loadtags(itemid,selectobj){//傳入項目名稱返回所有tags

}

function fn_binditems(obj){//綁定所有項目
    var data=fn_loaditems();
    if(data!=null){

    }
}

function fn_loaditems(){//獲取所有項目

}

var itemstep_id=new Array(1,2,3,4);
var itemstep_name=new Array("测试中","审批中","上线中","已完成");
function fn_get_step_name(stepnum){
    return itemstep_name[stepnum-1];
}