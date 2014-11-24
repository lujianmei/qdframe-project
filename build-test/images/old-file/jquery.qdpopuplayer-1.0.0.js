/*弹出层功能*/
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
			var width=option['width']?option['width']:400;
			var height=option['height']?option['height']:250;
			$('body').append('<div class="qd_backlayer" style="display:none;"></div><div class="qd_container" style="width:'+width+'px;height:'+height+'px;display:none;"><div class="qd_inside" style="height:'+height+'px;"><span class="qd_locked" onselectstart="return false;">'+(option['title']?option['title']:'')+'<a class="close" href="javascript:void(0);"></a></span>'+(option['iframe']?'<iframe name="qd_win_iframe" id="qd_win_iframe" class="qd_iframe" src="'+option['iframe']+'" frameborder="0" width="100%" scrolling="yes" style="border:none;overflow-x:hidden;height:'+parseInt(height-30)+'px;"></iframe>':option['html']?option['html']:'')+'</div></div>');
			if(navigator.userAgent.indexOf('MSIE 7')>0||navigator.userAgent.indexOf('MSIE 8')>0){
				$('.qd_container').css({'filter':'progid:DXImageTransform.Microsoft.gradient(startColorstr=#55000000,endColorstr=#55000000)'});
			}
			if(option['bgvisibel']){//显示遮罩
				$('.qd_backlayer').fadeTo('slow',0.3);
			};
			$('.qd_container').css({display:'block'});//弹出框弹出
			$('.'+option['qd_locked']+' .close').click(function(){//关闭弹出框,如果单击遮罩也需要关闭弹出窗口只需要添加   ,.qd_backlayer
				$('.qd_container').css({display:'none'});
				$('.qd_backlayer').css({display:'none'});
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
/*弹出层功能封装为QD.FloagLayer*/
(function($){
	/*
		idobj:出发弹出窗口的对象
		width:弹出框宽度
		height：弹出框高度 
		bgvisibel：是否显示遮罩 true 显示 false 不显示
		title：弹出框标题
		htmlcontent:要弹出的内容html
		iframeurl:iframe加载的url
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
	}
	QD = {
		FloagLayer:FloagLayer
	};
})(jQuery);