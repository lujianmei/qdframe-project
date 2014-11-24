/*
QDFrame 1.0.0 (build 63049cb)
Copyright 2014 TRS Inc. All rights reserved.
*/

/*
 method validform v1.0.0
 method submitvalidform v1.0.0
 method resetform v1.0.0
 =================================

 Infomation
 ----------------------
 Author : renchengxiang
 E-Mail : ren.chengxiang@trs.com.cn
 Date : 2014-02-10
 Readme:validate form for jquery plugin

 Example
 ----------------------
 settings:	//get configed parameters
 
 $("#formid").validform({
		tiptype:tiptype,
		rightinfo:rightinfo
});//blur validate

 $("#formid").submitvalidform({
			tiptype:tiptype,
			rightinfo:rightinfo
		});//submit validate
 
 $("#formid").resetform();//reset to clear error flag
 
 Supported in Internet Explorer, Mozilla Firefox,Chrome
 */
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
					reg= /^13[0-9]{1}[0-9]{8}$|15[0189]{1}[0-9]{8}$|18[0-9]{1}[0-9]{8}$|14[0-9]{1}[0-9]{8}$/;
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



/*
 method productScroll v1.0.0
 =================================

 Infomation
 ----------------------
 Author : renchengxiang
 E-Mail : ren.chengxiang@trs.com.cn
 Date : 2014-02-10
 Readme:scroll products

 Example
 ----------------------
 options:	//get configed parameters
 
 $("#productsdiv").productScroll({
	scrollnum:scrollnum,//scroll number per click
	timer:timer,//how time to scroll to the end
	hidebtn:hidebtn,//if hide button when no scroll products  1 is hide;0 is show
	prevclassname:prevclassname,//the classname of the left/top button
	nextclassname:nextclassname,//the classname of the right/down buttton
	scrolldirect:scrolldirect//scroll direction  0 is left right  1 is top down
});

 Supported in Internet Explorer, Mozilla Firefox,Chrome
 */
(function($){
	$.fn.productScroll=function(options){
		//scrollnum 每次单击滚动个数 ; timer 鼠标左右指向移动多长时间滚动到尽头毫秒; hidebtn 没有滚动对象之后是否隐藏按钮 1 隐藏  0 不隐藏;prevclassname 单击向左的class名   nextclassname 单击向右的class名  scrolldirect:滚动方向  0 左右滚动  1 上下滚动 istoscroll:是否鼠标移向滚动 1 滚动  0不滚动 
		//scrollnum: scroll num per click    timer:how time to scroll to the end    hidebtn:if hide button when no scroll products  1 is hide;0 is show  prevclassname:the classname of the left/top button   nextclassname:the classname of the right buttton  scrolldirect：scroll direction  0 is left right  1 is top down  istoscroll：if scroll when mouse over 1 scroll 0 not scroll
		var defaults={scrollnum:1,timer:4000,hidebtn:1,prevclassname:"js_scroll_prev",nextclassname:"js_scroll_next",scrolldirect:0,istoscroll:1};
		$.extend(defaults,options);
		return this.each(function(){
			var $scrollRoot=$(this);//滚动div//scroll div
			var $scrollItem = $scrollRoot.find("ul");//滚动ul//scroll ul
			var $prev = $scrollRoot.parent().find("."+defaults.prevclassname);//左侧按钮prev //left button prev
			var $next = $scrollRoot.parent().find("."+defaults.nextclassname);//右侧按钮next //right button next
			var rootW = $scrollRoot.width();//滚动容器宽度 // the width of the scroll container
			if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
				rootW=$scrollRoot.height();//滚动容器高度// the height of the scroll container
			}
			var rootX = $scrollRoot.offset().left;
			if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
				rootX =$scrollRoot.offset().top;
			}
			var listLen = $scrollItem.find("li").size();//需要滚动li个数   //the length of the li
			var listW=$scrollItem.find("li").eq(0).outerWidth();// 一个滚动单位的宽度  //the width of one li
			if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
				listW=$scrollItem.find("li").eq(0).outerHeight();// 一个滚动单位的高度度  //the height of one li
			}
			var scrollwPerClick=listW*defaults.scrollnum;//每次单击滚动宽度  //scroll width per click button
			var slideW = listW*listLen - rootW;	
			var direction = 0;	// 0: 表示向左,  1: 表示向右   //0  is  to left   1 is to right
			
			if(defaults.istoscroll){//如果需要滚动
			$scrollRoot.on({
				'mouseenter': function(e){
					if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
						moveTo(e.pageY - rootX < (rootW / 2) ? 0 : 1);
					}else{// 左右滚动  left right scroll
						moveTo(e.pageX - rootX < (rootW / 2) ? 0 : 1);
					}
					moveTo(e.pageX - rootX < (rootW / 2) ? 0 : 1);
				},
				'mousemove' : function(e){
					if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
						if (e.pageY - rootX < (rootW / 2) && direction == 1){
							moveTo(0);
						}
						if (e.pageY - rootX > (rootW / 2) && direction == 0){
							moveTo(1);
						}
					}else{// 左右滚动  left right scroll
						if (e.pageX - rootX < (rootW / 2) && direction == 1){
							moveTo(0);
						}
						if (e.pageX - rootX > (rootW / 2) && direction == 0){
							moveTo(1);
						}
					}
				},
				'mouseleave': function(e){
					if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
						var x = parseFloat($scrollItem.css('top')),
						i = Math[direction ? 'floor' : 'ceil'](x / listW);
						$scrollItem.stop(true, false).animate({ 'top': listW * i }, {
						'duration': 'fast',
						'step': hideButton,
						'complete': hideButton
						});
					}else{// 左右滚动  left right scroll
						var x = parseFloat($scrollItem.css('left')),
						i = Math[direction ? 'floor' : 'ceil'](x / listW);
						$scrollItem.stop(true, false).animate({ 'left': listW * i }, {
						'duration': 'fast',
						'step': hideButton,
						'complete': hideButton
						});
					}
				}
			});
			}
			
			$prev.click(function(){
				if ($scrollItem.filter(':animated').length) return;

				var $this = $(this);
				var curLeft = parseFloat($scrollItem.css("left"));
				if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
					curLeft = parseFloat($scrollItem.css("top"));
				}
				var posX = curLeft+scrollwPerClick;
				$next.show();//可能设置的被隐藏了，因此需要显示 // it may be hide so should be show
				if(curLeft <= "-" + scrollwPerClick){
					if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
						$scrollItem.animate({
							"top": posX
						},300);
					}else{// 左右滚动  left right scroll
						$scrollItem.animate({
							"left": posX
						},300);
					}
				}else{
					if(defaults.hidebtn){//隐藏按钮 //hide the button
						$this.hide();
					}
					if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
						$scrollItem.animate({
							"top": 0
						},300);
					}else{// 左右滚动  left right scroll
						$scrollItem.animate({
							"left": 0
						},300);
					}
				}
			});
			
			$next.click(function(){
				if ($scrollItem.filter(':animated').length) return;
				
				var $this = $(this);
				var curLeft = parseFloat($scrollItem.css("left"));
				if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
					curLeft = parseFloat($scrollItem.css("top"));
				}
				isNaN(curLeft) && (curLeft = 0);
				var posX = curLeft -scrollwPerClick;

				$prev.show();//可能设置的被隐藏了，因此需要显示 // it may be hide so should be show
				if((listW*listLen + curLeft) >= (rootW + 1 + scrollwPerClick)){
					if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
						$scrollItem.animate({
							"top": posX
						},300);
					}else{// 左右滚动  left right scroll
						$scrollItem.animate({
							"left": posX
						},300);
					}
				}else{
					if(defaults.hidebtn){//隐藏按钮 //hide the button
						$this.hide();
					}
					if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
						$scrollItem.animate({
							"top": "-" + slideW
						},300);
					}else{// 左右滚动  left right scroll
						$scrollItem.animate({
							"left": "-" + slideW
						},300);
					}
				}
			});
			
			function moveTo(dir){
				direction = dir;//设置转换方向  //set scroll direction
				if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
					$scrollItem.stop(true, false).animate({ 'top': dir ? -slideW : 0 }, {
						'duration': defaults.timer,//鼠标滑动时间控制  //mouse scroll of control timer
						'step': hideButton,
						'complete': hideButton
					});
				}else{
					$scrollItem.stop(true, false).animate({ 'left': dir ? -slideW : 0 }, {
						'duration': defaults.timer,//鼠标滑动时间控制  //mouse scroll of control timer
						'step': hideButton,
						'complete': hideButton
					});

				}
			}
			//鼠标事件进行按钮的隐藏操作 //hide the left/right button if set hide
			function hideButton(){
				var x = $scrollItem.css('left');		
				if(defaults.scrolldirect){//如果 上下滚动 // if scroll top down
					x = $scrollItem.css('top');
				}
				x == 'auto' && (x = 0);
				x = parseFloat(x);
				$prev.show();
				$next.show();

				if (x >= 0&&defaults.hidebtn){
					$prev.hide();
				}
				if (x <= -slideW&&defaults.hidebtn) {
					$next.hide();
				}
			}
			hideButton();
		});
	};
})(jQuery);


/*
 method openQDWin v1.0.0
 =================================

 Infomation
 ----------------------
 Author : renchengxiang
 E-Mail : ren.chengxiang@trs.com.cn
 Date : 2014-02-10
 Readme:pop up window for jquery plugin

 Example
 ----------------------
 settings:	//get configed parameters
 
 $.openQDWin({
	width:width,//window width
	height:height,//window height
	bgvisibel:bgvisibel,//if grey background display
	title:title,//window titile
	html:htmlcontent,//the html content of the window
	iframe:iframeurl//the url or filepath of iframe to load
 });

 Supported in Internet Explorer, Mozilla Firefox,Chrome
 */
$.extend({
	openQDWin:function(settings){
		var _x,_y,moveflag;
		//width 弹出窗口宽度,默认弹出窗口宽度400;height 弹出窗口高度，默认高度250;bgvisibel 是否显示遮罩，false不显示遮罩 true显示遮罩 默认不显示遮罩;html 为弹出框中需要展示的html内容，默认只是提示内容"please fill content"
		var option={width:400,height:250,bgvisibel:false,title:"",html:"please fill content"};
		$.extend(option,settings);;
		
		option['qd_locked']='qd_locked';//标题类名称
		$(document).ready(function(e){
			$('.qd_container').remove();//弹出框隐藏
			$('.qd_backlayer').remove();//背景隐藏
			$('.qd_ie6_popup_bgframe').remove();//iframe隐藏
			var width=option['width']?option['width']:400;
			var height=option['height']?option['height']:250;
			$('body').append('<div class="qd_backlayer" style="display:none;"></div><div class="qd_container" style="width:'+width+'px;height:'+height+'px;display:none;"><div class="qd_inside" style="height:'+height+'px;"><span class="qd_locked" onselectstart="return false;">'+(option['title']?option['title']:'')+'<a class="close" href="javascript:void(0);"></a></span>'+(option['iframe']?'<iframe name="qd_win_iframe" id="qd_win_iframe" class="qd_iframe" src="'+option['iframe']+'" frameborder="0" width="100%" scrolling="yes" style="border:none;overflow-x:hidden;height:'+parseInt(height-30)+'px;"></iframe>':option['html']?option['html']:'')+'</div></div>');
			//解决ie6列表bug
			if($.browser.msie && $.browser.version == "6.0"&&!$.support.style){
				$('body').append('<iframe class="qd_ie6_popup_bgframe" style="display:none;"></iframe>');
			}
			if(navigator.userAgent.indexOf('MSIE 7')>0||navigator.userAgent.indexOf('MSIE 8')>0){
				$('.qd_container').css({'filter':'progid:DXImageTransform.Microsoft.gradient(startColorstr=#55000000,endColorstr=#55000000)'});
			}
			if(option['bgvisibel']){//显示遮罩
				$('.qd_backlayer').fadeTo('slow',0.3);
				$('.qd_ie6_popup_bgframe').show();
			};
			$('.qd_container').css({display:'block'});//弹出框弹出
			$('.'+option['qd_locked']+' .close').click(function(){//关闭弹出框,如果单击遮罩也需要关闭弹出窗口只需要添加   ,.qd_backlayer
				$('.qd_container').css({display:'none'});
				$('.qd_backlayer').css({display:'none'});
				$('.qd_ie6_popup_bgframe').css({display:'none'});
			});
			//ie6、ie7对iframe弹出窗口不加载，重新加载
			if($.browser.msie && ($.browser.version == "6.0"||$.browser.version == "7.0")&&!$.support.style){
				$("#qd_win_iframe").attr("src",option['iframe']);
			}
			var marginLeft=parseInt(width/2);
			var marginTop=parseInt(height/2);
			var winWidth=parseInt($(window).width()/2);
			var winHeight=parseInt($(window).height()/2.2);
			var left=winWidth-marginLeft;
			var top=winHeight-marginTop;
			$('.qd_container').css({left:left,top:top});//弹出框在中央
			$('.'+option['qd_locked']).mousedown(function(e){//鼠标设置标志变量
				if(e.which){
					moveflag=true;
					_x=e.pageX-parseInt($('.qd_container').css('left'));
					_y=e.pageY-parseInt($('.qd_container').css('top'));
				}
				});
			}).mousemove(function(e){//移动到鼠标移到的位置
				if(moveflag){
					var x=e.pageX-_x;
					var y=e.pageY-_y;
					$('.qd_container').css({left:x});
					$('.qd_container').css({top:y});
				}
			}).mouseup(function(){//抬起鼠标设置标志变量
				moveflag=false;
			});
	}
});

(function($) {
	/*
	 QD.Page v1.0.0
	 =================================

	 Infomation
	 ----------------------
	 Author : lipengyang
	 E-Mail : lipengyang@trs.com.cn
	 Date : 2004-01-24
	 Readme:分页效果

	 Example
	 ----------------------
	 pram1:	//分页数据URL
	 pram2:	//分页输入选择器
	 pram3:	//数据输入选择器
	 insertItem: //定义分页数据样式

	 QD.Page('data/data[n].xml','#page','#data');
	 function insertItem(data) {
	 return "<li><a href=\""+$(data).attr('url')+"\" title=\""+$(data).attr('title')+"\" target=\"_blank\">"+$(data).text()+"</a></li>";
	 }

	 Supported in Internet Explorer, Mozilla Firefox
	 */
	var xmlData = null;
	var dataUrl = null;
	var dataUrlTpl = null;
	var pageCountTpl = 0;
	var pageIdTpl = null;
	var pageDataTpl = null;
	var pageIncludeTpl = 0;
	var pageIndexTpl = 0;
	var record_Count = 0;
	var makeUrl = function() {
		dataUrl = dataUrlTpl.replace("[n]", (pageIndexTpl - 1) > 0 ? '_' + (pageIndexTpl - 1) : '');
	};
	var showData = function() {
		pageDataTpl.html("");
		for (var i = 0; i < xmlData.length; i++) {
			pageDataTpl.append(insertItem(xmlData[i]));
		}
		new Pager().render();
	};
	var getPage = function() {
		makeUrl();
		$.ajax({
			type : "get",
			dataType : "xml",
			url : dataUrl,
			cache : false,
			async : false,
			success : function(xml) {
				xmlData = $(xml).find("item");
				pageCountTpl = $(xml).find("pageCount").text();
				record_Count = $(xml).find("record_Count").text();
				showData();
			},
			error : function(xml) {
				xmlData = null;
			}
		});
	};

	var Pager = function() {
		var $this = this;
		this._start = 1;
		this._end = 1;
		/**
		 * 在显示之前计算各种页码变量的值
		 */
		this._calculate = function() {
			if (pageCountTpl < 5) {
				pageIncludeTpl = pageCountTpl;
			}
			pageIndexTpl = parseInt(pageIndexTpl);
			if (pageIndexTpl > pageCountTpl) {
				pageIndexTpl = pageCountTpl;
			}
			if (pageIndexTpl < 1) {
				pageIndexTpl = 1;
			}
			$this._start = Math.max(1, pageIndexTpl - parseInt(pageIncludeTpl / 2));
			//
			$this._end = Math.min(pageCountTpl, $this._start + pageIncludeTpl - 1);
			//最后一个页码按钮的页码数
			$this._start = Math.max(1, $this._end - pageIncludeTpl + 1);
			//第一个页码按钮的页码数
		};

		this.render = function() {
			$this._calculate();
			var htmlStr = "";
			var currpage = pageIndexTpl;
			htmlStr += '<span class="paginations">';
			if (1 != currpage) {
				htmlStr += '<span class="n"><a href="javascript:;" page=' + (currpage - 1) + ' class="hi_bl"><b>上一页</b></a></span>';
			}
			htmlStr += '<span class="p"> ';
			if (1 != currpage) {
				htmlStr += '<a href="javascript:;" page="1">1</a>';
			}
			var temp1 = 4;
			if (pageCountTpl < 6) {
				temp1 = 5;
			}
			if (currpage > temp1) {
				htmlStr += '<a href="javascript:;">...</a>';
			}
			for (var i = $this._start; i <= $this._end; i++) {
				if (i == currpage) {
					htmlStr += "<em>" + i + "</em>";
				} else {
					if (i != 1 && i != pageCountTpl) {
						htmlStr += '<a href="javascript:;" page="' + i + '">' + i + '</a>';
					}
				}
			}
			var temp = 3;
			if (pageCountTpl < 6) {
				temp = 5;
			}
			if (currpage + temp < pageCountTpl)
				htmlStr += '<a href="javascript:;">...</a>';
			if (currpage != pageCountTpl)
				htmlStr += '<a href="javascript:;" page="' + pageCountTpl + '">' + pageCountTpl + '</a>';

			htmlStr += "</span>";
			if (pageCountTpl != currpage) {
				htmlStr += '<span class="n"><a href="javascript:;" page=' + (currpage + 1) + ' class="hi_br"><b>下一页</b></a></span>';
			}

			htmlStr += '</span>';
			htmlStr += ' 共计 ' + record_Count + ' 当前' + currpage + ' / ' + pageCountTpl;
			pageIdTpl.html(htmlStr);
			var a_list = pageIdTpl.find("a");
			for (var i = 0; i < a_list.length; i++) {
				a_list[i].onclick = function() {
					var index = this.getAttribute("page");
					if (index != undefined && index != '') {
						pageIndexTpl = index;
						getPage();
					}
				};
			}
		};
	};
	var Page = function(pram1, pram2, pram3) {
		pageIncludeTpl = 5;
		dataUrlTpl = pram1;
		pageIdTpl = pram2;
		pageDataTpl = pram3;
		xmlData = null;
		dataUrl = null;
		pageCountTpl = 0;
		pageIndexTpl = 0;
		getPage();
	};

	/*
	 getValue v1.0.0
	 =================================

	 Infomation
	 ----------------------
	 Author : lipengyang
	 E-Mail : lipengyang@trs.com.cn
	 Date : 2004-01-24
	 Readme:获取URL参数

	 Example
	 ----------------------
	 pram1:	//获取参数名

	 Supported in Internet Explorer, Mozilla Firefox
	 */
	var getValue = function(pram1) {
		var str = window.location.search;
		if (str.indexOf(pram1) != -1) {
			var pos_start = str.indexOf(pram1) + pram1.length + 1;
			var pos_end = str.indexOf("&", pos_start);
			if (pos_end == -1) {
				return str.substring(pos_start);
			} else {
				return str.substring(pos_start, pos_end);
			}
		} else {
			return "";
		}
	};

	/*
	 ChangeTab v1.0.0
	 =================================

	 Infomation
	 ----------------------
	 Author : lipengyang
	 E-Mail : lipengyang@trs.com.cn
	 Date : 2004-01-24
	 Readme:tab切换效果

	 Example
	 ----------------------
	 pram1:	//定义标题切换选择器
	 pram2:	//定义内容切换选择器
	 pram3:	//切换定义class
	 pram4:	//是否异步请求tab
	 Supported in Internet Explorer, Mozilla Firefox
	 */
	var ChangeTab = function(pram1, pram2, pram3, pram4) {
		pram1.each(function(index) {
			var $this = $(this);
			if (index == 0) {
				$this.addClass(pram3);
				pram2.eq(index).show();
			}
			$this.click(function() {
				if (pram4) {
					var $parent = $this.parent();
					var curIdx = $parent.index();
					var relURL = $this.attr("rel");
					$.ajax({
						type : "get",
						dataType : "html",
						url : relURL,
						cache : false,
						async : false,
						success : function(data) {
							$this.addClass(pram3);
							$parent.siblings().find("a").removeClass(pram3);
							pram2.html(data);
						},
						error : function(xml) {
							//xmlData = null;
						}
					});
				} else {
					var $parent = $this.parent();
					var curIdx = $parent.index();
					$this.addClass(pram3);
					$parent.siblings().find("a").removeClass(pram3);
					pram2.eq(curIdx).show().siblings().hide();
				}
			});
		});
	};

	/*
	QD.Carousel v1.0.0
	=================================

	Infomation
	----------------------
	Author : lipengyang
	E-Mail : lipengyang@trs.com.cn
	Date : 2004-01-24

	Example
	----------------------
	pram1:	// Play Time 播放时间
	pram2:	//Autoplay 是否自动播放
	pram3:	//轮播按钮宽度
	Supported in Internet Explorer, Mozilla Firefox
	*/
	//BEGIN
	var Carousel = function(pram1, pram2, pram3,pram4,pram5) {
		var $carouselItem = pram4;
		var $carouselNav = pram5;
		var len = $carouselItem.size();
		var nav_w = pram3;
		var autoTime = pram1;
		var autoFlag = pram2;
		$carouselItem.each(function() {
			var $this = $(this);
			var bg = $this.data("kv_bg");
			$this.attr("style", "background-image" + ":" + "url('" + bg + "')");

		});
		if(nav_w!=0){
			$carouselNav.parent().css({
				"width" : len * nav_w + "px",
				"margin-left" : -len * nav_w / 2 + "px"
			});
		}
		$carouselNav.each(function(index) {
			var $this = $(this);
			if (index == 0) {
				$this.addClass("current");
			}
			$this.click(function() {
				var curIdx = $this.index();
				$carouselItem.eq(curIdx).fadeIn().siblings().fadeOut();
				$this.addClass("current").siblings().removeClass("current");
			});
		});
		var goTo = function() {
			var curLen = $carouselNav.filter(".current").index();

			$carouselItem.eq(curLen + 1).fadeIn().siblings().fadeOut();
			$carouselNav.eq(curLen + 1).addClass("current").siblings().removeClass("current");
			if (curLen == (len - 1)) {
				$carouselItem.eq(0).fadeIn().siblings().fadeOut();
				$carouselNav.eq(0).addClass("current").siblings().removeClass("current");
			};
		};

		var autoplay = setInterval(function() {
			if (autoFlag == true) {
				goTo();
			}
		}, autoTime);

		// Autoplay suspended over the object 滑过对象暂停自动播放
		$carouselNav.hover(function() {
			if (pram2) {
				autoFlag = false;
			}
		}, function() {
			if (pram2) {
				autoFlag = true;
			}
		});

	};
	//END

/*
 method fix v1.0.0
 =================================

 Infomation
 ----------------------
 Author : liuqiwen
 E-Mail : liu.qiwen@trs.com.cn
 Date : 2014-02-20
 Readme:固定元素位置

 Example
 ----------------------

 Supported in Internet Explorer, Mozilla Firefox
 */
	/*****************************************模块固定start*****************************************/
	var ve = $.browser,
	isIE6 = function() {
		return ve.msie && (ve.version === "6.0");
	}, 
	/**
	 * 设置固定节点样式
	 * @method to
	 * @param $this{Object} 当前节点
	 * @param val{String} 要记录的节点className.
	 * @param fn{Function} 处理方法
	 */
	access = function($this, val, fn) {
		var name = "qd_fix_" + val;
		if (!$this.hasClass(name)) {
			$this.addClass(name);
			if (!!fn) {
				fn(name);
			}
		}
	}, styleHook = {
		"auto" : "0px"
	},
	/**
	 * 记录节点固定前的样式
	 * @method to
	 * @param $this{Object} 当前节点
	 * @param name{String} 要记录的节点样式.
	 * 
	 */
	oldStyle = {}, 
	oldStyleFn = function($this, name) {
		var obj = oldStyle[$this], val = {}, tem = "";
		if (!obj) {
			obj = oldStyle[$this] = {};
		}
		tem = val[name] = $this.css(name);
		if (isIE6) {
			val[name] = styleHook[tem] || tem;
		}
		$.extend(obj, val);
	},
	/**
	 * 根据固定位置设置处理方法
	 * @method to
	 * @param $this{Object} 当前节点
	 * @param mar{String} 固定位置
	 * @param px{Number} 固定位置像素
	 */
	fixHook = {}, 
	typeName = ["top", "bottom", "left", "right", "center", "middle"],
	typeNameHook = {"top":"left", "bottom":"left", "left":"top", "right":"top","center":"top","middle":"left"};
	$.each(typeName, function(i, val) {
		fixHook[val] = val === "center" ? function($this) {
			access($this, val, function() {
				oldStyleFn($this, "margin-left");
				$this.css("margin-left", "-" + $this.width() / 2 + "px");
			});
		} : val === "middle" ? function($this) {
			access($this, val, function() {
				oldStyleFn($this, "margin-top");
				$this.css("margin-top", "-" + $this.height() / 2 + "px");
			});
		} : function($this) {
			access($this, val);
		};
	});
	fixHook.abs = function($this , mar , px){
		oldStyleFn($this, mar);
		if(isIE6()){
           if(mar==="top"){
		     $this.attr("style" , "top:expression((topwindowscroll=document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop)+"+px+"+'px' )"); 
		   }else{
		      $this.get(0).style[mar]=px+"px";
		   }
		}else{
		   $this.get(0).style[mar]=px+"px";  
		}
	};
	/**
	 * 元素固定位置对外处理方法
	 * @method to
	 * @param id{String} 元素id
	 * @param type{String} 固定位置
	 * @param id{String} 元素固定完成后需要添加的className
	 */
	var fix = function(id, type, clas) {
		var types = type.split(","), i = 0,
            $this = $("#" + id) ,
			mar = "",
			flag = false;
			fn = null;
		if (!$this.hasClass("qd_fix")) {
			$this.addClass("qd_fix");
		}
		try {
			for (; i < 2; i++) {
				type = types[i];
				fn = fixHook[type];
				if (!!type && !!fn) {
					fn($this);
					flag = true;
					continue;
				}
				type = parseInt(type);
				if(isNaN(type)){
				   continue;
				}
				mar = flag&&types[0] || i&&"top" || "left";
				mar = typeNameHook[mar];
				if(!!mar){
				   fixHook.abs($this , mar , type);
				}
				
			}
		} catch (e) {
			throw new Error(e);
		}
		if (!!clas) {
			$this.addClass(clas);
		}
	};
	/**
	 * 移除元素固定位置对外处理方法
	 * @method to
	 * @param id{String} 元素id
	 * @param type{String} 移除位置
	 * @param id{String} 元素固定移除后需要移除的className
	 */
	var fixRemove = function(id, type, clas) {
		var types = type && type.split(",") || typeName, 
			i = 0, l = types.length, 
			$this = $("#" + id), 
			css = oldStyle[$this];
		$this.removeClass("qd_fix");
		for (; i < l; i++) {
			type = types[i];
			if (!!type) {
				$this.removeClass("qd_fix_" + type);
			}
		}
		if (!!clas) {
			$this.removeClass(clas);
		}
		$this.css(css);
		delete oldStyle[$this];
	};
	/*****************************************模块固定end*****************************************/

	/*********************************表单校验start*************************************************/
	/**
	*validate the blur form.
	*@method ValidForm
	*@param idobj:form表单标识对象
	*@param tiptype: 1表示 弹窗模式  2表示右侧提示模式 default value 1
	*@param rightinfo:为当校验正确之后需要展示的信息，如果不需要提示校验正确信息，只需要设置值为空 default value ""
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
	};
	
	/**
	*validate the submit form.
	*@method SubmitValidForm
	*@param idobj:form表单标识对象
	*@param tiptype: 1表示 弹窗模式  2表示右侧提示模式 default value 1
	*@param rightinfo:为当校验正确之后需要展示的信息，如果不需要提示校验正确信息，只需要设置值为空 default value ""
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
	};

	/**
	*reset the form.
	*@method ResetForm
	*@param idobj:form表单标识对象
	*/
	var ResetForm=function(idobj){
		if(!idobj){
			alert("idobj is null");
			return false;
		}
		idobj.resetform();//重置错误提示
		idobj[0].reset();//重置填充数据
	};
	/*****************************************表单校验end*****************************************/
	/******************************页面滚动start****************************************************/
	/**
	*Scroll products.
	*@method Scroll
	*@param idobj:滚动对象容器
	*@param scrollnum表示一次滚动的数目  default value 1
	*@param timer表示鼠标以上多长时间滚动到尽头，单位为毫秒 default value 4000
	*@param hidebtn表示是否隐藏左右/上下滚动按钮0表示不隐藏，1表示隐藏 default value 1
	*@param prevclassname表示左/上按钮的类名，便于前端开发人员自由传递定义的自己的类名 default value "js_scroll_prev"
	*@param nextclassname表示右/下按钮的类名，便于前端开发人员自由传递定义的自己的类名 default value "js_scroll_next"
	*@param scrolldirect表示滚动方向，0表示左右滚动 1表示上下滚动 当然左右滚动还是上下滚动前端通过样式控制  default value 0
	*@param istoscroll表示鼠标移向是否滚动，1表示滚动 0表示不滚动   default value 1
	*/
	var Scroll=function(idobj,scrollnum,timer,hidebtn,prevclassname,nextclassname,scrolldirect,istoscroll){
		if(!idobj){
			alert("idobj is null");
			return false;
		}
		idobj.productScroll({
			scrollnum:scrollnum,
			timer:timer,
			hidebtn:hidebtn,
			prevclassname:prevclassname,
			nextclassname:nextclassname,
			scrolldirect:scrolldirect,
			istoscroll:istoscroll
		});
	};
	/***********************************页面滚动end***********************************************/
	/**********************************弹出层start************************************************/
	/**
	*Pop up the window.
	*@method FloagLayer
	*@param idobj:出发弹出窗口的对象
	*@param width:弹出框宽度 default value 400
	*@param height：弹出框高度 default value 250
	*@param bgvisibel：是否显示遮罩 true 显示 false 不显示 default value false
	*@param title：弹出框标题 default value ""
	*@param htmlcontent:要弹出的内容html default value "please fill content"
	*@param iframeurl:iframe加载的url
	*/
	var FloagLayer=function(idobj,width,height,bgvisibel,title,htmlcontent,iframeurl){
		if(!idobj){
			alert("idobj is null");
			return false;
		}
		idobj.click(function(){
		$.openQDWin({
			width:width,//弹出框宽度
			height:height,//弹出框高度 
			bgvisibel:bgvisibel,//是否显示遮罩
			title:title,//弹出框标题
			html:htmlcontent,//要弹出的内容html
			iframe:iframeurl//iframe加载的url
		});
	});
	};
	/************************************弹出层end**********************************************/

	window.QD = {
		Page : Page,
		getValue : getValue,
		ChangeTab : ChangeTab,
		Carousel : Carousel,
		fix : fix,
		fixRemove : fixRemove,
		ValidForm : ValidForm, //表单blur校验
		SubmitValidForm : SubmitValidForm, //表单submit校验
		ResetForm : ResetForm, //表单reset
		Scroll : Scroll, //页面滚动
		FloagLayer : FloagLayer//弹出层

	};

})(jQuery);
