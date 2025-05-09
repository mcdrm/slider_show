//FWDVSUtils
(function (window){
	
	var FWDVSUtils = function(){};
	
	FWDVSUtils.dumy = document.createElement("div");
	
	//###################################//
	/* String */
	//###################################//
	FWDVSUtils.trim = function(str){
		return str.replace(/\s/gi, "");
	};
	
	FWDVSUtils.splitAndTrim = function(str, trim_bl){
		var array = str.split(",");
		var length = array.length;
		for(var i=0; i<length; i++){
			if(trim_bl) array[i] = FWDVSUtils.trim(array[i]);
		};
		return array;
	};

	//#############################################//
	//Array //
	//#############################################//
	FWDVSUtils.indexOfArray = function(array, prop){
		var length = array.length;
		for(var i=0; i<length; i++){
			if(array[i] === prop) return i;
		};
		return -1;
	};
	
	FWDVSUtils.randomizeArray = function(aArray) {
		var randomizedArray = [];
		var copyArray = aArray.concat();
			
		var length = copyArray.length;
		for(var i=0; i< length; i++) {
			var index = Math.floor(Math.random() * copyArray.length);
			randomizedArray.push(copyArray[index]);
			copyArray.splice(index,1);
		}
		return randomizedArray;
	};
	
	FWDVSUtils.removeArrayDuplicates = function(arr, key){ 
		var newArr = [],
	        origLen = arr.length,
	        found,
	        x, y;

	    for (x = 0; x < origLen; x++) {
	        found = undefined;
	        for (y = 0; y < newArr.length; y++) {
	            if(arr[x][key] === newArr[y][key]) { 
	              found = true;
	              break;
	            }
	        }
	        if(!found) newArr.push(arr[x]);    
	    }
	    return newArr;
	};

	//#############################################//
	/*DOM manipulation */
	//#############################################//
	FWDVSUtils.parent = function (e, n){
		if(n === undefined) n = 1;
		while(n-- && e) e = e.parentNode;
		if(!e || e.nodeType !== 1) return null;
		return e;
	};
	
	FWDVSUtils.sibling = function(e, n){
		while (e && n !== 0){
			if(n > 0){
				if(e.nextElementSibling){
					 e = e.nextElementSibling;	 
				}else{
					for(var e = e.nextSibling; e && e.nodeType !== 1; e = e.nextSibling);
				}
				n--;
			}else{
				if(e.previousElementSibling){
					 e = e.previousElementSibling;	 
				}else{
					for(var e = e.previousSibling; e && e.nodeType !== 1; e = e.previousSibling);
				}
				n++;
			}
		}
		return e;
	};
	
	FWDVSUtils.getChildAt = function (e, n){
		var kids = FWDVSUtils.getChildren(e);
		if(n < 0) n += kids.length;
		if(n < 0) return null;
		return kids[n];
	};
	
	FWDVSUtils.getChildById = function(id){
		return document.getElementById(id) || undefined;
	};
	
	FWDVSUtils.getChildren = function(e, allNodesTypes){
		var kids = [];
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes){
				kids.push(c);
			}else if(c.nodeType === 1){
				kids.push(c);
			}
		}
		return kids;
	};
	
	FWDVSUtils.getChildrenFromAttribute = function(e, attr, allNodesTypes){
		var kids = [];
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDVSUtils.hasAttribute(c, attr)){
				kids.push(c);
			}else if(c.nodeType === 1 && FWDVSUtils.hasAttribute(c, attr)){
				kids.push(c);
			}
		}
		return kids.length == 0 ? undefined : kids;
	};
	
	FWDVSUtils.getChildFromNodeListFromAttribute = function(e, attr, allNodesTypes){
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDVSUtils.hasAttribute(c, attr)){
				return c;
			}else if(c.nodeType === 1 && FWDVSUtils.hasAttribute(c, attr)){
				return c;
			}
		}
		return undefined;
	};
	
	FWDVSUtils.getAttributeValue = function(e, attr){
		if(!FWDVSUtils.hasAttribute(e, attr)) return undefined;
		return e.getAttribute(attr);	
	};
	
	FWDVSUtils.hasAttribute = function(e, attr){
		if(e.hasAttribute){
			return e.hasAttribute(attr); 
		}else {
			var test = e.getAttribute(attr);
			return  test ? true : false;
		}
	};
	
	FWDVSUtils.insertNodeAt = function(parent, child, n){
		var children = FWDVSUtils.children(parent);
		if(n < 0 || n > children.length){
			throw new Error("invalid index!");
		}else {
			parent.insertBefore(child, children[n]);
		};
	};
	
	FWDVSUtils.hasCanvas = function(){
		return Boolean(document.createElement("canvas"));
	};
	
	//###################################//
	/* DOM geometry */
	//##################################//
	FWDVSUtils.hitTest = function(target, x, y){
		var hit = false;
		if(!target) throw Error("Hit test target is null!");
		var rect = target.getBoundingClientRect();
		
		if(x >= rect.left && x <= rect.left +(rect.right - rect.left) && y >= rect.top && y <= rect.top + (rect.bottom - rect.top)) return true;
		return false;
	};
	
	FWDVSUtils.getScrollOffsets = function(){
		//all browsers
		if(window.pageXOffset != null) return{x:window.pageXOffset, y:window.pageYOffset};
		
		//ie7/ie8
		if(document.compatMode == "CSS1Compat"){
			return({x:document.documentElement.scrollLeft, y:document.documentElement.scrollTop});
		}
	};
	
	FWDVSUtils.getViewportSize = function(){
		if(FWDVSUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1){
			return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
		}
		
		if(FWDVSUtils.isMobile) return {w:window.innerWidth, h:window.innerHeight};
		return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
	};
	
	FWDVSUtils.getViewportMouseCoordinates = function(e){
		var offsets = FWDVSUtils.getScrollOffsets();
		
		if(e.touches){
			return{
				screenX:e.touches[0] == undefined ? e.touches.pageX - offsets.x :e.touches[0].pageX - offsets.x,
				screenY:e.touches[0] == undefined ? e.touches.pageY - offsets.y :e.touches[0].pageY - offsets.y
			};
		}
		
		return{
			screenX: e.clientX == undefined ? e.pageX - offsets.x : e.clientX,
			screenY: e.clientY == undefined ? e.pageY - offsets.y : e.clientY
		};
	};
	
	
	//###################################//
	/* Browsers test */
	//##################################//
	FWDVSUtils.hasPointerEvent = (function(){
		return Boolean(window.navigator.msPointerEnabled) || Boolean(window.navigator.pointerEnabled);
	}());
	
	FWDVSUtils.isMobile = (function (){
		if((FWDVSUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1) || (FWDVSUtils.hasPointerEvent && navigator.maxTouchPoints > 1)) return true;
		var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry', 'kfsowi'];
	    for(i in agents) {
	    	 if(String(navigator.userAgent).toLowerCase().indexOf(String(agents[i]).toLowerCase()) != -1) {
	            return true;
	        }
	    }
	    if(navigator.platform.toLowerCase() === 'macintel' && navigator.maxTouchPoints > 1 && !window.MSStream) return true;
	    return false;
	}());
	
	FWDVSUtils.isAndroid = (function(){
		 return (navigator.userAgent.toLowerCase().indexOf("android".toLowerCase()) != -1);
	}());
	
	FWDVSUtils.isChrome = (function(){
		return navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
	}());
	
	FWDVSUtils.isSafari = (function(){
		return navigator.userAgent.toLowerCase().indexOf('safari') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
	}());
	
	FWDVSUtils.isOpera = (function(){
		return navigator.userAgent.toLowerCase().indexOf('opera') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
	}());
	
	FWDVSUtils.isFirefox = (function(){
		return navigator.userAgent.toLowerCase().indexOf('firefox') != -1;
	}());
	
	FWDVSUtils.isIE = (function(){
		var isIE = Boolean(navigator.userAgent.toLowerCase().indexOf('msie') != -1) || Boolean(navigator.userAgent.toLowerCase().indexOf('edge') != -1);
		return isIE || Boolean(document.documentElement.msRequestFullscreen);
	}());
	
	FWDVSUtils.isIE11 = (function(){
		return Boolean(!FWDVSUtils.isIE && document.documentElement.msRequestFullscreen);
	}());
	
	FWDVSUtils.isIEAndLessThen9 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1;
	}());
	
	FWDVSUtils.isIEAndLessThen10 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 
		|| navigator.userAgent.toLowerCase().indexOf("msie 8") != -1
		|| navigator.userAgent.toLowerCase().indexOf("msie 9") != -1;
	}());
	
	FWDVSUtils.isIE7 = (function(){
		return navigator.userAgent.toLowerCase().indexOf("msie 7") != -1;
	}());
	
	FWDVSUtils.isIOS = (function(){
		return navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
	}());
	
	FWDVSUtils.isIphone = (function(){
		return navigator.userAgent.match(/(iPhone|iPod)/g);
	}());
	
	FWDVSUtils.isApple = (function(){
		return navigator.appVersion.toLowerCase().indexOf('mac') != -1;
	}());
	
	FWDVSUtils.isLocal = (function(){
		return location.href.indexOf('file:') != -1;
	}());
	
	FWDVSUtils.hasFullScreen = (function(){
		return FWDVSUtils.dumy.requestFullScreen || FWDVSUtils.dumy.mozRequestFullScreen || FWDVSUtils.dumy.webkitRequestFullScreen || FWDVSUtils.dumy.msieRequestFullScreen;
	}());
	
	function get3d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    var position;
	    while (p = properties.shift()) {
	       if (typeof FWDVSUtils.dumy.style[p] !== 'undefined') {
	    	   FWDVSUtils.dumy.style.position = "absolute";
	    	   position = FWDVSUtils.dumy.getBoundingClientRect().left;
	    	   FWDVSUtils.dumy.style[p] = 'translate3d(500px, 0px, 0px)';
	    	   position = Math.abs(FWDVSUtils.dumy.getBoundingClientRect().left - position);
	    	   
	           if(position > 100 && position < 900){
	        	   try{document.documentElement.removeChild(FWDVSUtils.dumy);}catch(e){}
	        	   return true;
	           }
	       }
	    }
	    try{document.documentElement.removeChild(FWDVSUtils.dumy);}catch(e){}
	};
	
	function get2d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    while (p = properties.shift()) {
	       if (typeof FWDVSUtils.dumy.style[p] !== 'undefined') {
	    	   return true;
	       }
	    }
	    try{document.documentElement.removeChild(FWDVSUtils.dumy);}catch(e){}
	    return false;
	};	
	
	//###############################################//
	/* various utils */
	//###############################################//
	FWDVSUtils.onReady =  function(callbalk){
		if (document.addEventListener) {
			document.addEventListener( "DOMContentLoaded", function(){
				FWDVSUtils.checkIfHasTransofrms();
				callbalk();
			});
		}else{
			document.onreadystatechange = function () {
				FWDVSUtils.checkIfHasTransofrms();
				if (document.readyState == "complete") callbalk();
			};
		 }
	};
	
	FWDVSUtils.checkIfHasTransofrms = function(){
		document.documentElement.appendChild(FWDVSUtils.dumy);
		FWDVSUtils.hasTransform3d = get3d();
		FWDVSUtils.hasTransform2d = get2d();
		FWDVSUtils.isReadyMethodCalled_bl = true;
	};
	
	FWDVSUtils.disableElementSelection = function(e){
		try{e.style.userSelect = "none";}catch(e){};
		try{e.style.MozUserSelect = "none";}catch(e){};
		try{e.style.webkitUserSelect = "none";}catch(e){};
		try{e.style.khtmlUserSelect = "none";}catch(e){};
		try{e.style.oUserSelect = "none";}catch(e){};
		try{e.style.msUserSelect = "none";}catch(e){};
		try{e.msUserSelect = "none";}catch(e){};
		e.onselectstart = function(){return false;};
	};
	
	FWDVSUtils.getSearchArgs = function urlArgs(string){
		var args = {};
		var query = string.substr(string.indexOf("?") + 1) || location.search.substring(1);
		var pairs = query.split("&");
		for(var i=0; i< pairs.length; i++){
			var pos = pairs[i].indexOf("=");
			var name = pairs[i].substring(0,pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[name] = value;
		}
		return args;
	};
	
	FWDVSUtils.getHashArgs = function urlArgs(string){
		var args = {};
		var query = string.substr(string.indexOf("#") + 1) || location.hash.substring(1);
		var pairs = query.split("&");
		for(var i=0; i< pairs.length; i++){
			var pos = pairs[i].indexOf("=");
			var name = pairs[i].substring(0,pos);
			var value = pairs[i].substring(pos + 1);
			value = decodeURIComponent(value);
			args[name] = value;
		}
		return args;
	};
	
	
	FWDVSUtils.isReadyMethodCalled_bl = false;
	
	window.FWDVSUtils = FWDVSUtils;
}(window));

