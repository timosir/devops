 $(function(){
			function listCommits(e, projectId) {
				 $.ajax({
	                url : '/list_tags?project_id='+projectId,
	                type : 'GET',
	                success: function(res){
	                  
		                    var data = JSON.parse(res);
	
		                    $.each(data.data.infos[0],function(index, value){
		                        	e.append(
		                                $("<option>").html(value)
						.attr(
						"data-content",
				"<span class='commit-name'>" + value  + "</span> <br>"
						)
						)
	
		                    })
						    e.selectpicker();
						    e.val(data.data.current).trigger('change');
							 
					}
				})
			}
			
			function DeployVersion(projectId, version, callback) {
				 postData = {
					"project_id": projectId,
					"current": version
				}
				 $.ajax({
	                url : '/deploy_project',
	                type : 'POST',
				    data: postData,
	                success: function(res){
		                var data = JSON.parse(res);
		                alert(data.msg)
					    callback();
					}
				})
			}
			
			
//             $.ajax({
//                 url : '/show_project_list_json1',
//                 type : 'GET',
//                 success: function(res){
//                     var tr = $('<tr>')
					
//         		.append($('<td>').attr('class', 'id'));
//                         tr.append($('<td>').attr('class', 'name'));
// 			tr.append($('<td>').attr('class', 'title'));
// 			tr.append($('<td>').attr('class', 'link'));
// 		        tr.append($('<td>').attr('class', 'description'));
// 			tr.append($('<td>').attr('class', 'current'));
// 			tr.append($('<td>').attr('class', 'create_time'));
// 			tr.append($('<td>').attr('class', 'deploy_time'));
// 			tr.append($('<td>').attr('class', 'update-btn'));
// 	         	tr.append($('<td>').append($('<span>').attr('class','action-btn')));
                                    
                    
                    
//                     var wishObj = JSON.parse(res);
//                     var wish = '';
                    
//                     $.each(wishObj,function(index, value){
//                         wish = $(tr).clone();
//                         $(wish).find('td.id').text(value.id);
// 			$(wish).find('td.name').text(value.name);
// 			$(wish).find('td.link').text(value.link);
//                         $(wish).find('td.title').text(value.title);
// 			$(wish).find('td.description').text(value.description);
// 			$(wish).find('td.current').text(value.current);
// 			$(wish).find('td.create_time').text(value.create_time);
// 			$(wish).find('td.deploy_time').text(value.deploy_time);
// 			$(wish).find('.update-btn').html("<input data-id=\""+value.id+"\"  type=\"button\"  class=\"update-btn-action\"  value=\"更新\"/>");
// 			$(wish).find('.action-btn').text("发布");
//                         $('.deploy-rows').append(wish);
//                     });

// 					$(".action-btn").click(function() {
// 						btn = this;
// 						BootstrapDialog.show({
// 				            title: $(this).parent().parent().find("td.name").html() + ' ' +'发布代码',
// 				            message: function(dialog) {
// 							   current = $(btn).parent().parent().find("td.current").html();

// 				                var $content = $('<div>当前版本：' + current +'</div>');
// 				                var $footerButton = dialog.getButton('btn-deploy');
// //				                dialog.getButton('btn-stop').click({$footerButton: $footerButton}, function(event) {
// //				                    event.data.$footerButton.enable();
// //				                    event.data.$footerButton.stopSpin();
// //				                    dialog.setClosable(true);
// //				                });
// 								$content.append($("<br>"));
								
// 								var $select = $('<select class="selectpicker"></select>')
								
// 								projectId = $(btn).parent().parent().find("td.id").html();
// 								if (projectId=="") {
// 									return alert("请选择项目")
// 								}
								
// 								listCommits($select, projectId);
// 								//setTimeout(function() {$select.selectpicker();}, 500)
// 								$content.append($select);
// 				                return $content;
// 				            },
// 				            buttons: [
// 							{
// 				                id: 'btn-deploy',
// 				                label: '确认发布',
// 				                action: function(dialog) {
// 									window.dialog = dialog;
// 				                    var $button = this; // 'this' here is a jQuery object that wrapping the <button> DOM element.
// 									projectId = $(btn).parent().parent().find("td.id").html();
// 									current = $(".selectpicker").val();
// 									$button.disable();
// 				                    $button.spin();
// 				                    dialog.setClosable(false);
									
// 									DeployVersion(projectId, current, function (){
// 										$button.enable();
// 					                     $button.stopSpin();
// 					                     dialog.setClosable(true);
// 										dialog.close();
// 									});
				                    
// 				                }
// 				            }]
// 				        });
// 					});
// 					$(".update-btn").find("input").click(function(){
// 						var id=$(this).attr("data-id");
// 						// if(id!=null&&id!=''){
// 						// 	$.ajax({
// 						// 		type:"post",
// 						// 		url:"/update_project",
// 						// 		data:{"project_id":id},
// 						// 		beforeSend:fucntion(xhr){

// 						// 		},
// 						// 		success:function(obj){
// 						// 			var data=eval(obj);
// 						// 			if(data.code=='0'||data.code==0){
// 						// 				alert(data.msg);
// 						// 			}
// 						// 		}
// 						// 	});
// 						// }
// 						BootstrapDialog.show({
// 				            title: '更新代码',
// 				            message: $(this).parent().parent().find("td.name").html() + ' ' + '更新代码',
// 				            buttons: [
// 							{
// 				                id: 'btn-deploy',
// 				                label: '确认更新',
// 				                action: function(dialog) {
// 									window.dialog = dialog;
// 				                    var button = this; // 'this' here is a jQuery object that wrapping the <button> DOM element.
// 									projectId = id;
// 									current = $(".selectpicker").val();
// 									$.ajax({
// 										type:"post",
// 										url:"/update_project",
// 										data:{"project_id":id},
// 										beforeSend:function(xhr){
// 											button.disable();
// 				                    		button.spin();
// 				                    		dialog.setClosable(false);
// 										},
// 										success:function(updateResult){
// 											var result=JSON.parse(updateResult);
// 						 					if(result.code=='0'||result.code==0){
// 						 						BootstrapDialog.show({
//             										title: '提示',
//             										message: result.msg,
//             										buttons:[{
// 														id: 'btn-deploy',
// 				                						label: '确认',
// 				                						action: function(dialog1) {
// 				                							button.enable();
// 					                     					button.stopSpin();
// 					                     					dialog.setClosable(true);
// 															dialog.close();
// 															dialog1.close();
// 				                						}
//             										}]
//         										});
// 						 					}
// 										}
// 									});
// 				                }
// 				            }]
// 				        });
// 					});
			
//                 },
//                 error: function(error){
//                     console.log(error);
//                 }
//             });
		
        });
