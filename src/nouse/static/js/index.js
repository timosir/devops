$(function(){
   // login.html
	$(".btn-register").on("click",function(){
         $(".btnlogin").fadeOut(function(){
               $(".body-register").fadeIn();
         });
	});
	$(".btnlogin").on("click",function(){
         $(".body-register").fadeOut(function(){
               $(".body-login").fadeIn();
         });
	});

   
   // create.html
   $(":input[name='project_id']").change(function () {
      if ($("select option:selected").val() != "") {
         $(".btn-next").attr('disabled', false);
      } else {
         $(".btn-next").attr('disabled', true);
      }
   });



});