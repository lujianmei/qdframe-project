/*页面滚动功能*/
(function($){
	$.fn.productScroll=function(options){
		//scrollnum 每次单击滚动个数 ; timer 鼠标左右指向移动多长时间滚动到尽头毫秒; hidebtn 没有滚动对象之后是否隐藏按钮 1 隐藏  0 不隐藏;prevclassname 单击向左的class名   nextclassname 单击向右的class名  scrolldirect:滚动方向  0 左右滚动  1 上下滚动
		//scrollnum: scroll num per click    timer:how time to scroll to the end    hidebtn:if hide button when no scroll products  1 is hide;0 is show  prevclassname:the classname of the left button   nextclassname:the classname of the right buttton  scrolldirect：scroll direction  0 is left right  1 is top down
		var defaults={scrollnum:1,timer:4000,hidebtn:1,prevclassname:"js_scroll_prev",nextclassname:"js_scroll_next",scrolldirect:0};
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
	}
})(jQuery);
/*页面滚动功能封装为QD.Scroll*/
(function($){
	/*
	scrollnum表示一次滚动的数目，参照值为1
	timer表示鼠标以上多长时间滚动到尽头，单位为毫秒，参照值为4000
	hidebtn表示是否隐藏左右/上下滚动按钮0表示不隐藏，1表示隐藏，参照值为 1
	prevclassname表示左/上按钮的类名，便于前端开发人员自由传递定义的自己的类名，参照值为js_scroll_prev
	nextclassname表示右/下按钮的类名，便于前端开发人员自由传递定义的自己的类名，参照值为js_scroll_next
	scrolldirect表示滚动方向，0表示左右滚动 1表示上下滚动 当然左右滚动还是上下滚动前端通过样式控制，参照值为0
	*/
	var Scroll=function(idobj,scrollnum,timer,hidebtn,prevclassname,nextclassname,scrolldirect){
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
			scrolldirect:scrolldirect
		});
	}
	QD = {
		Scroll:Scroll
	};
})(jQuery);