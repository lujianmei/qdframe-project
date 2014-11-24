/*表单校验功能*/
(function($){
	var errorobj=null,//指示当前验证失败的表单元素;//the form element of failer validate
		msgobj,//pop box object 
		msghidden=true, //msgbox hidden
		tipmsg={//默认提示文字;//The default prompt words
			w:"请输入正确信息！",//默认错误提示信息//The default error message
			s:"请填入信息！"//默认空提示信息//The default empty message
		},
		creatMsgbox=function(){
			if($("#validform_dialog").length!==0){return false;}
			msgobj=$('<div id="validform_dialog"><div class="validform_title">提示信息<a class="validform_close" href="javascript:void(0);">&chi;</a></div><div class="validform_info"></div></div>').appendTo("body");//提示信息框;//MessageBox
			msgobj.find("a.validform_close").click(function(){
				msgobj.hide();
				msghidden=true;
				if(errorobj){
					errorobj.focus().addClass("validform_error");
				}
				return false;
			}).focus(function(){this.blur();});

			$(window).bind("scroll resize",function(){
				if(!msghidden){				  
					var left=($(window).width()-msgobj.width())/2;
					var top=($(window).height()-msgobj.height())/2;
					var topTo=(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)+(top>0?top:0);
					msgobj.animate({
						left : left,
						top : topTo
					},{ duration:400 , queue:false });
				}
			});
		};
	
	$.fn.validform=function(settings){
		var defaults={};
		settings=$.extend({},$.fn.validform.sn.defaults,settings);
		
		this.each(function(){
			var $this=$(this);
			$this.find("[tip]").each(function(){//tip是表单元素的默认提示信息,这是点击清空效果;//Tip is the default message form elements, this is click clear effect
				var defaultvalue=$(this).attr("tip");
				var altercss=$(this).attr("altercss");
				$(this).focus(function(){
					if($(this).val()==defaultvalue){
						$(this).val('');
						if(altercss){$(this).removeClass(altercss);}
					}
				}).blur(function(){
					if($.trim($(this).val())===''){
						$(this).val(defaultvalue);
						if(altercss){$(this).addClass(altercss);}
					}
				});
			});
			
			//绑定blur事件;//bind blur event
			$this.find("[datatype]").blur(function(){
				var flag=true;
				flag=$.fn.validform.sn.checkform($(this),$this,settings.tiptype,"hide",settings.rightinfo);
				if(!flag){return false;}
				if(typeof(flag)!="boolean"){//如果是radio, checkbox, select则不需再执行下面的代码; //If it is a radio, a checkbox, select do not need to execute the following code
					$(this).removeClass("validform_error");
					return false;
				}
									
				flag=$.fn.validform.sn.regcheck($(this));
				if(!flag){
					//不需要空校验，添加了ignore="ignore"
					if($(this).attr("ignore")==="ignore" && ( $(this).val()==="" || $(this).val()===$(this).attr("tip") )){
						if(settings.tiptype==2){
							$(this).parent().next().find(".Validform_checktip").removeClass().addClass("Validform_checktip").text($(this).attr("tip"));
						}
						flag=true;
						return true;
					}
					errorobj=$(this);
					$.fn.validform.sn.showmsg($(this).attr("errormsg")||tipmsg.w,settings.tiptype,{obj:$(this)},"hide"); //当tiptype=1的情况下，传入"hide"则让提示框不弹出,tiptype=2的情况下附加参数“hide”不起作用;
				}else{
						errorobj=null;
						if(settings.rightinfo){//设置了正确提示信息,右侧提示的方式//Set the correct message, tips on the right side
							$.fn.validform.sn.showmsg(settings.rightinfo,settings.tiptype,{obj:$(this),type:2},"hide");
						}else{
							$.fn.validform.sn.showmsg("",settings.tiptype,{obj:$(this),type:1},"hide");
						}
				}
				
			});
			
		});
		
		//预创建pop box;
		if(settings.tiptype!=2){		
			creatMsgbox();
		}
		
	};
	
	$.fn.submitvalidform=function(settings){
		var defaults={};
		settings=$.extend({},$.fn.validform.sn.defaults,settings);
		
		if(settings.tiptype!=2){//不为2时表示要弹出框，创建//Not for 2 said to pop-up box, create
			creatMsgbox();
		}
		
		this.each(function(){
			var $this=$(this);

			var flag=true;

			$this.find("[datatype]").each(function(){
				flag=$.fn.validform.sn.checkform($(this),$this,settings.tiptype,settings.rightinfo);
				if(!flag){
					//errorobj.focus();
					return false;
				}
				
				if(typeof(flag)!="boolean"){
					flag=true;
					return true;
				}
				
				flag=$.fn.validform.sn.regcheck($(this));
				
				if(!flag){
					//不需要空校验，添加了ignore="ignore"
					if($(this).attr("ignore")==="ignore" && ( $(this).val()==="" || $(this).val()===$(this).attr("tip") )){
						flag=true;
						return true;
					}
				
					errorobj=$(this);
					errorobj.focus();
					$.fn.validform.sn.showmsg($(this).attr("errormsg")||tipmsg.w,settings.tiptype,{obj:$(this)});
					return false;
				}else{
						errorobj=null;
						if(settings.rightinfo){//设置了正确提示信息,右侧提示的方式//Set the correct message, tips on the right side
							$.fn.validform.sn.showmsg(settings.rightinfo,settings.tiptype,{obj:$(this),type:2},"hide");
						}else{
							$.fn.validform.sn.showmsg("",settings.tiptype,{obj:$(this),type:1},"hide");
						}
				}
				
			});
				
		});
		
	};
	$.fn.resetform=function(){
		var $this=$(this);
		$this.find(".validform_checktip").removeClass().addClass("validform_checktip").text("");//清空右侧提示错误信息
		$this.find(".validform_error").removeClass("validform_error");
		
	};
	
	$.fn.validform.sn={
		defaults:{
			tiptype:1//1表示 弹窗模式  2表示右侧提示模式
		},
		
		regcheck:function(thisobj){
            var reg;
			var datatype=thisobj.attr("datatype");
			var val=thisobj.val();
			switch(datatype){
				case "*": /* 确认密码 */
					return true;
				case "num": /* 数字输入*/
					return !isNaN(val);
				case "mobile": /* 手机验证 */
					reg= /^13[0-9]{1}[0-9]{8}$|15[0189]{1}[0-9]{8}$|18[0-9]{1}[0-9]{8}$/;
					return reg.test(val);
				case "shenfenzheng": /* 身份证 */
					reg = /^(\d{15}|\d{18}|\d{17}[a-zA-Z]{1})$/;
					return reg.test(val);
				case "length": /*限制长度*/
					var lengthmin=thisobj.attr("lengthmin");
					isNaN(lengthmin)&&(lengthmin=0);//如果没有设置最小长度使用长度2
					var lengthmax=thisobj.attr("lengthmax");
					isNaN(lengthmax)&&(lengthmax=100);//如果没有设置最大长度使用最大长度100
					var lenval=$.trim(val).length;
					if(lenval>=lengthmin&&lenval<=lengthmax){
						return true;
					}else{
						return false;	
					}
				case "bankcard": /* 银行卡号码16-19位 */
					reg = /^[\d]{16,19}$/;
					return reg.test(val);		
				case "email": /* 验证邮箱格式 */
					reg = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
					return reg.test(val);
				default:
					return false;
			}
		},
		
		showmsg:function(msg,type,o,show){//o:{obj:当前对象, type:1=>填写正确不提示信息 | 2=>填写正确提示信息}, show用来判断tiptype=1的情况下是否弹出信息框;
			if(errorobj){errorobj.addClass("validform_error");}
			if(type==1 || show=="alwaysshow"){
				msgobj.find(".validform_info").text(msg);
			}
			if(type==1 && show!="hide" || show=="alwaysshow"){
				msghidden=false;
				var left=($(window).width()-msgobj.width())/2;
				var top=($(window).height()-msgobj.height())/2;
				top=(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)+(top>0?top:0);
				msgobj.css({
					"left":left
				}).show().animate({
					top:top
				},100);
			}
			
			if(type==2){
				if(o.type){
					switch(o.type){
						case 1://校验通过，不需要提示正确
							o.obj.parent().next().find(".validform_checktip").removeClass().addClass("validform_checktip").text("");
							break;
						case 2://检测通过;提示校验正确
							o.obj.parent().next().find(".validform_checktip").removeClass().addClass("validform_checktip validform_right").text(msg);	
					}
				}else{
					o.obj.parent().next().find(".validform_checktip").removeClass().addClass("validform_wrong validform_checktip").text(msg);
				}
			}
			
		},
		
		checkform:function(obj,parentobj,tiptype,show,rightinfo){//show用来判断是表达提交还是blur事件引发的检测;
			var errormsg=obj.attr("errormsg") || tipmsg.w;
			
			if(obj.is("[datatype='radio']")){  //判断radio表单元素;
				var inputname=obj.attr("name");
				var radiovalue=parentobj.find(":radio[name="+inputname+"]:checked").val();
				if(!radiovalue){
					errorobj=obj;
					this.showmsg(errormsg,tiptype,{obj:obj},show);
					return false;
				}
				errorobj=null;
				if(rightinfo){//提示正确信息
					this.showmsg(rightinfo,tiptype,{obj:obj,type:2},"hide");
				}else{//不提示正确信息
					this.showmsg("",tiptype,{obj:obj,type:1},"hide");
				}
				
				return "radio";
			}

			if(obj.is("[datatype='checkbox']")){  //判断checkbox表单元素;
				var inputname=obj.attr("name");
				var checkboxvalue=parentobj.find(":checkbox[name="+inputname+"]:checked").val();
				if(!checkboxvalue){
					errorobj=obj;
					this.showmsg(errormsg,tiptype,{obj:obj},show);
					return false;
				}
				errorobj=null;
				if(rightinfo){//提示正确信息
					this.showmsg(rightinfo,tiptype,{obj:obj,type:2},"hide");
				}else{//不提示正确信息
					this.showmsg("",tiptype,{obj:obj,type:1},"hide");
				}
				
				return "checkbox";
			}

			if(obj.is("[datatype='select']")){  //判断select表单元素;
				if(!obj.val()){
				  errorobj=obj;
				  this.showmsg(errormsg,tiptype,{obj:obj},show);
				  return false;
				}
				errorobj=null;
				if(rightinfo){//提示正确信息
					this.showmsg(rightinfo,tiptype,{obj:obj,type:2},"hide");
				}else{
					this.showmsg("",tiptype,{obj:obj,type:1},"hide");
				}
				
				return "select";
			}
			
			var defaultvalue=obj.attr("tip");//获取标签中的提示信息
			if((obj.val()==="" || obj.val()===defaultvalue) && obj.attr("ignore")!="ignore"){//只有没有ignore 属性才校验
				errorobj=obj;
				this.showmsg(obj.attr("nullmsg") || tipmsg.s,tiptype,{obj:obj},show);
				return false;
			}

			if(obj.attr("recheck")){
				var theother=parentobj.find("input[name="+obj.attr("recheck")+"]:first");
				if(obj.val()!=theother.val()){
					errorobj=obj;
					this.showmsg(errormsg,tiptype,{obj:obj},show);
					return false;
				}
			}
			obj.removeClass("validform_error");
			errorobj=null;
			return true;
		}
		
	};
	
	//公用方法显示&关闭信息提示框;
	$.Showmsg=function(msg){
		creatMsgbox();
		$.fn.validform.sn.showmsg(msg,1);
	};
	$.Hidemsg=function(){
		msgobj.hide();
		msghidden=true;
	};

})(jQuery);
/*表单校验功能，封装为QD.ValidForm,QD.SubmitValidForm,QD.ResetForm*/
(function($){
	/*
		idobj：form表单标识对象
		tiptype: 1表示 弹窗模式  2表示右侧提示模式
		rightinfo:为当校验正确之后需要展示的信息，如果不需要提示校验正确信息，只需要设置值为空
	*/
	var ValidForm=function(idobj,tiptype,rightinfo){
		if(!idobj){
			alert("idobj is null");
			return false;
		}
		idobj.validform({
			tiptype:tiptype,
			rightinfo:rightinfo
		});
	}
	/*
		idobj：form表单标识对象
		tiptype: 1表示 弹窗模式  2表示右侧提示模式
		rightinfo:为当校验正确之后需要展示的信息，如果不需要提示校验正确信息，只需要设置值为空
	*/
	var SubmitValidForm=function(idobj,tiptype,rightinfo){
		if(!idobj){
			alert("idobj is null");
			return false;
		}
		idobj.submitvalidform({
			tiptype:tiptype,
			rightinfo:rightinfo
		});
	}
	/*
		idobj：form表单标识对象
	*/
	var ResetForm=function(idobj){
		if(!idobj){
			alert("idobj is null");
			return false;
		}
		idobj.resetform();//重置错误提示
		idobj[0].reset();//重置填充数据
	}
	QD = {
		ValidForm:ValidForm,
		SubmitValidForm:SubmitValidForm,
		ResetForm:ResetForm
	};
})(jQuery);