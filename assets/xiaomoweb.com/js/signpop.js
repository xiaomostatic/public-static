define(function (){

return {
	init: function (){
		var signHtml = '\
			<div class="sign">\
			    <div class="sign-mask"></div>\
			    <div class="container">\
			        <a href="#" class="close-link signclose-loader"><i class="fa fa-close"></i></a>\
			        <div class="sign-tips"></div>\
			        <form id="sign-in">  \
			            <h3><small class="signup-loader">切换注册</small>登录</h3>\
			            <h6>\
			                <label for="inputEmail">用户名</label>\
			                <input type="text" name="username" class="form-control" id="inputEmail" maxlength="10" placeholder="用户名">\
			            </h6>\
			            <h6>\
			                <label for="inputPassword">密码</label>\
			                <input type="password" name="password" class="form-control" id="inputPassword" maxlength="16" placeholder="登录密码">\
			            </h6>\
						<h6 id="h_inputcode">\
							<label for="inputcode">验证码</label>\
			                <input name="imgcode" type="text" maxlength="5" class="form-control"/>\
							<img src="'+(jsui.www)+'include/lib/checkcode.php"/>\
			            </h6>\
			            <div class="sign-submit">\
			                <input type="button" class="btn btn-primary signsubmit-loader" name="submit" value="登录">  \
			                <input type="hidden" name="action" value="signin">\
			                <label><input type="checkbox" checked="checked" name="remember" value="forever">记住我</label>\
			            </div>'+(jsui.url_rp ? '<div class="sign-info"><a href="'+jsui.url_rp+'">找回密码？</a></div>' : '')+
			        '</form>\
			        <form id="sign-up"> \
			            <h3><small class="signin-loader">切换登录</small>注册</h3>\
			            <h6>\
			                <label for="inputName">用户名</label>\
			                <input type="text" name="name" class="form-control" maxlength="10" id="inputName" placeholder="设置小写字母用户名">\
			            </h6>\
			            <h6>\
			                <label for="inputEmail">邮箱</label>\
			                <input type="email" name="email" class="form-control" maxlength="20" id="inputEmail" placeholder="邮箱">\
			            </h6>\
			            <h6>\
			                <label for="inputPassword">密码</label>\
			                <input type="password" name="password" class="form-control" maxlength="16" id="inputPassword" placeholder="密码">\
			            </h6>\
						<h6>\
			                <label for="inputPassword">邀请码</label>\
			                <input type="text" name="invite" class="form-control" maxlength="8" id="inputInvite" placeholder="请填写邀请码">\
			            </h6>\
			            <div class="sign-submit">\
			                <input type="button" class="btn btn-primary btn-block signsubmit-loader bit-reg" name="submit" value="快速注册">  \
			                <input type="hidden" name="action" value="signup">  \
			            </div>\
			        </form>\
			    </div>\
			</div>\
		'

	    jsui.bd.append( signHtml )
			
		if(jsui.logocode!="y"){
			$("#h_inputcode").hide();
		}
	    if( $('#issignshow').length ){
	        jsui.bd.addClass('sign-show')
	        // $('.close-link').hide()
	        setTimeout(function(){
	        	$('#sign-in').show().find('input:first').focus()
	        }, 300);
	        $('#sign-up').hide()
	    }


	    $('.signin-loader').on('click', function(){
	    	jsui.bd.addClass('sign-show')
	    	setTimeout(function(){
            	$('#sign-in').show().find('input:first').focus()
            }, 300);
            $('#sign-up').hide()
	    })

	    $('.signup-loader').on('click', function(){
	    	jsui.bd.addClass('sign-show');
	    	setTimeout(function(){
            	$('#sign-up').show().find('input:first').focus()
            }, 300);
            $('#sign-in').hide()
	    })

	    $('.signclose-loader').on('click', function(){
	    	jsui.bd.removeClass('sign-show')
	    })

		$('.sign-mask').on('click', function(){
	    	jsui.bd.removeClass('sign-show')
	    })

	    $('.sign form').keydown(function(e){
			var e = e || event,
			keycode = e.which || e.keyCode;
			if (keycode==13) {
				$(this).find('.signsubmit-loader').trigger("click");
			}
		})

	    $('.signsubmit-loader').on('click', function(){
	    	if( jsui.is_signin ) return
                    
            var form = $(this).parent().parent()
            var inputs = form.serializeObject()
            var isreg = (inputs.action == 'signup') ? true : false

            if( !inputs.action ){
                return
            }

            function is_mail(str) {
                return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(str)
            }

            if( isreg ){
            	if( !is_mail(inputs.email) ){
	                logtips('邮箱格式错误')
	                return
	            }
            }else{
            	if( inputs.password.length < 6 ){
	                logtips('密码太短，至少6位')
	                return
	            }
            }


            $.ajax({  
                type: "POST",  
                url:  jsui.uri+'/user/reg.php',  
                data: inputs,  
                dataType: 'json',
                success: function(data){  

				
						
                    if( data.msg ){
                    	if(data.msg == "注册成功，请登录"){
                    		//$('.signin-loader').delay(2000).click(0);
                    		$('.bit-reg').attr('disabled',"true");
                    	}
                        logtips(data.msg);
                    }

                    if( data.error ){
						logtips(data.error);
                        return
                    }

                    
                        if( data.goto ) {location.href = data.goto;}
                    
                }  
            });  
	    })

		var _loginTipstimer;
		function logtips(str){
		    if( !str ) return false
		    _loginTipstimer && clearTimeout(_loginTipstimer)
		    $('.sign-tips').html(str).animate({
		        height: 29
		    }, 220)
		    _loginTipstimer = setTimeout(function(){
		        $('.sign-tips').animate({
		            height: 0
		        }, 220)
		    }, 5000)
		}

	}
}

})