/**
     * Provides how to fix a item on page via a Plugin
     * 
     * 
     * @module fixed
     * 
     * @TODO 
     */
(function($){
  var QD = {},
      ua = navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/),
      ve=ua&&ua[1] || "0";
      isIE6 = function(){
	       return ve==="6.0" || ve==="7.0";
	  },
      access = function($this , val , fn){
          var name = "qd_fix_"+val;
		      if(!$this.hasClass(name)){
				 $this.addClass(name);
				 if(!!fn){
				    fn(name);
				 }
			  }
	  },
	  styleHook = {"auto":"0px"},
	  oldStyleFn = function($this , name){
		 var obj = oldStyle[$this] , val = {} , tem = "";
		 if(!obj){
		    obj = oldStyle[$this] = {};
		 } 
		 tem = val[name] = $this.css(name); 
		 if(isIE6){
		   val[name] = styleHook[tem] || tem;
		 }
	     $.extend(obj,val);
	  },
	  /***固定位置处理方法***/
      fixHook = {} , removeFix = {} , oldStyle={} ,typeName = ["top","bottom","left","right","center","middle"];
	  $.each(typeName,function(i,val){
	      fixHook[val] = val==="center" ?
		  function($this){
			 access($this , val , function(){
				oldStyleFn($this , "margin-left");
			    $this.css("margin-left","-"+$this.width()/2+"px");
			 });
		  }
		  : val==="middle" ?
		  function($this){
			 access($this , val , function(){
				 oldStyleFn($this , "margin-top");
			     $this.css("margin-top","-"+$this.height()/2+"px");
			 });
		  }
		  :function($this){
			 access($this , val);
		  };
	  });
  /***元素固定方法***/
  QD.fix = function(id , type , clas){
	 var types = type.split(",") , i = 0 , l = types.length , $this = $("#"+id);
	 if(!$this.hasClass("qd_fix")){
	    $this.addClass("qd_fix");
	 }
	 try {
		for(; i<l ; i++){
		   type = types[i];
		   if(!!type){
		      fixHook[type]($this);
		   }
		}
	 }catch (e) {throw new Error(e);}
	 if(!!clas){
	    $this.addClass(clas);
	 }
  };
  /***移除元素固定方法***/
  QD.fixRemove = function(id , type , clas){
	 var types = type&&type.split(",") || typeName , i = 0 , l = types.length , $this = $("#"+id) , css = oldStyle[$this];
	 $this.removeClass("qd_fix");
	 for(; i<l ; i++){
	   type = types[i];
	   if(!!type){
		  $this.removeClass("qd_fix_"+type);
	   }
	 }
	 if(!!clas){
	    $this.removeClass(clas);
	 }
	 $this.css(css);
	 delete oldStyle[$this];
  };
  window.QD = QD;
})(jQuery);