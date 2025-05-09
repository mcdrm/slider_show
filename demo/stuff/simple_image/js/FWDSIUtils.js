//FWDISPUtils
(function (window){
	
	var FWDISPUtils = function(){};
	
	FWDISPUtils.dumy = document.createElement("div");
	
	//###################################//
	/* String */
	//###################################//
	FWDISPUtils.trim = function(str){
		return str.replace(/\s/gi, "");
	};
			
	FWDISPUtils.trimAndFormatUrl = function(str){
		str = str.toLocaleLowerCase();
		str = str.replace(/ /g, "-");
		return str;
	};
	
	FWDISPUtils.splitAndTrim = function(str, trim_bl){
		var array = str.split(",");
		var length = array.length;
		for(var i=0; i<length; i++){
			if(trim_bl) array[i] = FWDISPUtils.trim(array[i]);
		};
		return array;
	};
	
	FWDISPUtils.formatTime = function(secs){
		var hours = Math.floor(secs / (60 * 60));
		
		var divisor_for_minutes = secs % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);

		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.ceil(divisor_for_seconds);
		
		minutes = (minutes >= 10) ? minutes : "0" + minutes;
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		
		if(isNaN(seconds)) return "00:00";
		if(self.hasHours_bl){
			 return hours + ":" + minutes + ":" + seconds;
		}else{
			 return minutes + ":" + seconds;
		}
	};
	
	FWDISPUtils.getSecondsFromString = function(str){
		var hours = 0;
		var minutes = 0;
		var seconds = 0;
		var duration = 0;
		
		if(!str) return undefined;
		
		str = str.split(":");
		
		hours = str[0];
		if(hours[0] == "0" && hours[1] != "0"){
			hours = parseInt(hours[1]);
		}
		if(hours == "00") hours = 0;
		
		minutes = str[1];
		if(minutes[0] == "0" && minutes[1] != "0"){
			minutes = parseInt(minutes[1]);
		}
		if(minutes == "00") minutes = 0;
		
		secs = parseInt(str[2].replace(/,.*/ig, ""));
		if(secs[0] == "0" && secs[1] != "0"){
			secs = parseInt(secs[1]);
		}
		if(secs == "00") secs = 0;
		
		if(hours != 0){
			duration += (hours * 60 * 60)
		}
		
		if(minutes != 0){
			duration += (minutes * 60)
		}
		
		duration += secs;
		
		return duration;
	 };

	//#############################################//
	//Array //
	//#############################################//
	FWDISPUtils.indexOfArray = function(array, prop){
		var length = array.length;
		for(var i=0; i<length; i++){
			if(array[i] === prop) return i;
		};
		return -1;
	};
	
	FWDISPUtils.randomizeArray = function(aArray) {
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
	

	//#############################################//
	/*DOM manipulation */
	//#############################################//
	FWDISPUtils.parent = function (e, n){
		if(n === undefined) n = 1;
		while(n-- && e) e = e.parentNode;
		if(!e || e.nodeType !== 1) return null;
		return e;
	};
	
	FWDISPUtils.sibling = function(e, n){
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
	
	FWDISPUtils.getChildAt = function (e, n){
		var kids = FWDISPUtils.getChildren(e);
		if(n < 0) n += kids.length;
		if(n < 0) return null;
		return kids[n];
	};
	
	FWDISPUtils.getChildById = function(id){
		return document.getElementById(id) || undefined;
	};
	
	FWDISPUtils.getChildren = function(e, allNodesTypes){
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
	
	FWDISPUtils.getChildrenFromAttribute = function(e, attr, allNodesTypes){
		var kids = [];
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDISPUtils.hasAttribute(c, attr)){
				kids.push(c);
			}else if(c.nodeType === 1 && FWDISPUtils.hasAttribute(c, attr)){
				kids.push(c);
			}
		}
		return kids.length == 0 ? undefined : kids;
	};
	
	FWDISPUtils.getChildFromNodeListFromAttribute = function(e, attr, allNodesTypes){
		for(var c = e.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes && FWDISPUtils.hasAttribute(c, attr)){
				return c;
			}else if(c.nodeType === 1 && FWDISPUtils.hasAttribute(c, attr)){
				return c;
			}
		}
		return undefined;
	};
	
	FWDISPUtils.getAttributeValue = function(e, attr){
		if(!FWDISPUtils.hasAttribute(e, attr)) return undefined;
		return e.getAttribute(attr);	
	};
	
	FWDISPUtils.hasAttribute = function(e, attr){
		if(e.hasAttribute){
			return e.hasAttribute(attr); 
		}else {
			var test = e.attributes[attr];
			return  test ? true : false;
		}
	};
	
	FWDISPUtils.insertNodeAt = function(parent, child, n){
		var children = FWDISPUtils.children(parent);
		if(n < 0 || n > children.length){
			throw new Error("invalid index!");
		}else {
			parent.insertBefore(child, children[n]);
		};
	};
	
	FWDISPUtils.hasCanvas = function(){
		return Boolean(document.createElement("canvas"));
	};
	
	FWDISPUtils.getCanvasWithModifiedColor = function(img, hexColor, returnImage){
		if(!img) return;
		var newImage;
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var originalPixels = null;
		var currentPixels = null;
		var long = parseInt(hexColor.replace(/^#/, ""), 16);
		var hexColorRGB = {
			R: (long >>> 16) & 0xff,
			G: (long >>> 8) & 0xff,
			B: long & 0xff
		};
		
		canvas.style.position = "absolute";
		canvas.style.left = "0px";
		canvas.style.top = "0px";
		canvas.style.margin = "0px";
		canvas.style.padding = "0px";
		canvas.style.maxWidth = "none";
		canvas.style.maxHeight = "none";
		canvas.style.border = "none";
		canvas.style.lineHeight = "1";
		canvas.style.backgroundColor = "transparent";
		canvas.style.backfaceVisibility = "hidden";
		canvas.style.webkitBackfaceVisibility = "hidden";
		canvas.style.MozBackfaceVisibility = "hidden";	
		canvas.style.MozImageRendering = "optimizeSpeed";	
		canvas.style.WebkitImageRendering = "optimizeSpeed";
		canvas.width = img.width;
		canvas.height = img.height;
		
		ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
		originalPixels = ctx.getImageData(0, 0, img.width, img.height);
		currentPixels = ctx.getImageData(0, 0, img.width, img.height);

        for(var I = 0, L = originalPixels.data.length; I < L; I += 4){
            if(currentPixels.data[I + 3] > 0) // If it's not a transparent pixel
            {
                currentPixels.data[I] = originalPixels.data[I] / 255 * hexColorRGB.R;
                currentPixels.data[I + 1] = originalPixels.data[I + 1] / 255 * hexColorRGB.G;
                currentPixels.data[I + 2] = originalPixels.data[I + 2] / 255 * hexColorRGB.B;
            }
        }
		
		ctx.globalAlpha = .5;
        ctx.putImageData(currentPixels, 0, 0);
		ctx.drawImage(canvas, 0, 0);
        
		if(returnImage){
			newImage = new Image();
			newImage.src = canvas.toDataURL();
		}
		return {canvas:canvas, image:newImage};
	};
	
	FWDISPUtils.changeCanvasHEXColor = function(img, canvas, hexColor, returnNewImage){
		if(!img) return;
		var canvas = canvas;
		var ctx = canvas.getContext("2d");
		var originalPixels = null;
		var currentPixels = null;
		var long = parseInt(hexColor.replace(/^#/, ""), 16);
		var hexColorRGB = {
			R: (long >>> 16) & 0xff,
			G: (long >>> 8) & 0xff,
			B: long & 0xff
		};
		
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
		originalPixels = ctx.getImageData(0, 0, img.width, img.height);
		currentPixels = ctx.getImageData(0, 0, img.width, img.height);

        for(var I = 0, L = originalPixels.data.length; I < L; I += 4){
            if(currentPixels.data[I + 3] > 0) // If it's not a transparent pixel
            {
                currentPixels.data[I] = originalPixels.data[I] / 255 * hexColorRGB.R;
                currentPixels.data[I + 1] = originalPixels.data[I + 1] / 255 * hexColorRGB.G;
                currentPixels.data[I + 2] = originalPixels.data[I + 2] / 255 * hexColorRGB.B;
            }
        }
		
		ctx.globalAlpha = .5;
        ctx.putImageData(currentPixels, 0, 0);
		ctx.drawImage(canvas, 0, 0);
		
		if(returnNewImage){
			var newImage = new Image();
			newImage.src = canvas.toDataURL();
			return newImage;
		}
    }
	
	//###################################//
	/* DOM geometry */
	//##################################//
	FWDISPUtils.hitTest = function(target, x, y){
		var hit = false;
		if(!target) throw Error("Hit test target is null!");
		var rect = target.getBoundingClientRect();
		
		if(x >= rect.left && x <= rect.left +(rect.right - rect.left) && y >= rect.top && y <= rect.top + (rect.bottom - rect.top)) return true;
		return false;
	};
	
	FWDISPUtils.getScrollOffsets = function(){
		//all browsers
		if(window.pageXOffset != null) return{x:window.pageXOffset, y:window.pageYOffset};
		
		//ie7/ie8
		if(document.compatMode == "CSS1Compat"){
			return({x:document.documentElement.scrollLeft, y:document.documentElement.scrollTop});
		}
	};
	
	FWDISPUtils.getViewportSize = function(){
		if(FWDISPUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1){
			return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
		}
		
		if(FWDISPUtils.isMobile) return {w:window.innerWidth, h:window.innerHeight};
		return {w:document.documentElement.clientWidth || window.innerWidth, h:document.documentElement.clientHeight || window.innerHeight};
	};
	
	FWDISPUtils.getViewportMouseCoordinates = function(e){
		var offsets = FWDISPUtils.getScrollOffsets();
		
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
	FWDISPUtils.hasPointerEvent = (function(){
		return Boolean(window.navigator.msPointerEnabled) || Boolean(window.navigator.pointerEnabled);
	}());
	
	FWDISPUtils.isMobile = (function (){
		if((FWDISPUtils.hasPointerEvent && navigator.msMaxTouchPoints > 1) || (FWDISPUtils.hasPointerEvent && navigator.maxTouchPoints > 1)) return true;
		var agents = ['android', 'webos', 'iphone', 'ipad', 'blackberry', 'kfsowi'];
	    for(i in agents) {
	    	 if(navigator.userAgent.toLowerCase().indexOf(agents[i]) != -1) {
	            return true;
	        }
	    }
	    if(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
	    return false;
	}());
	
	FWDISPUtils.isAndroid = (function(){
		 return (navigator.userAgent.toLowerCase().indexOf("android".toLowerCase()) != -1);
	}());
	
	FWDISPUtils.hasWEBGL = (function(){
		try{
			var canvas = document.createElement( 'canvas' ); 
			return !! window.WebGLRenderingContext && ( 
				 canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
		   }catch( e ) { return false; } 
	}());
	
	FWDISPUtils.isLocal = (function(){
		if(document.location.protocol == "file:"){
			return true;
		}else{
			return false;
		}
	}());
	
	
	FWDISPUtils.isChrome = (function(){
		return navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
	}());
	
	FWDISPUtils.isSafari = (function(){
		return navigator.userAgent.toLowerCase().indexOf('safari') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
	}());
	
	FWDISPUtils.isOpera = (function(){
		return navigator.userAgent.toLowerCase().indexOf('opr') != -1;
	}());
	
	FWDISPUtils.isFirefox = (function(){
		return navigator.userAgent.toLowerCase().indexOf('firefox') != -1;
	}());
	
	FWDISPUtils.isIEWebKit = (function(){
		return Boolean(document.documentElement.msRequestFullscreen);
	}());
	
	FWDISPUtils.isIE = (function(){
		var isIE = Boolean(navigator.userAgent.toLowerCase().indexOf('msie') != -1) || Boolean(navigator.userAgent.toLowerCase().indexOf('edge') != -1);
		return isIE || Boolean(document.documentElement.msRequestFullscreen);
	}());
	
	FWDISPUtils.isIEAndLessThen9 = (function(){
		return Boolean(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1) || Boolean(navigator.userAgent.toLowerCase().indexOf("msie 8") != -1);
	}());
	
	FWDISPUtils.isIE7 = (function(){
		return Boolean(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1);
	}());
	
	FWDISPUtils.isApple = (function(){
		return Boolean(navigator.appVersion.toLowerCase().indexOf('mac') != -1);
	}());
	
	FWDISPUtils.isIphone = (function(){
		return navigator.userAgent.match(/(iPhone|iPod)/g);
	}());
	
	FWDISPUtils.hasFullScreen = (function(){
		return FWDISPUtils.dumy.requestFullScreen || FWDISPUtils.dumy.mozRequestFullScreen || FWDISPUtils.dumy.webkitRequestFullScreen || FWDISPUtils.dumy.msieRequestFullScreen;
	}());
	
	function get3d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    var position;
	    while (p = properties.shift()) {
	       if (typeof FWDISPUtils.dumy.style[p] !== 'undefined') {
	    	   FWDISPUtils.dumy.style.position = "absolute";
	    	   position = FWDISPUtils.dumy.getBoundingClientRect().left;
	    	   FWDISPUtils.dumy.style[p] = 'translate3d(500px, 0px, 0px)';
	    	   position = Math.abs(FWDISPUtils.dumy.getBoundingClientRect().left - position);
	    	   
	           if(position > 100 && position < 900){
	        	   try{document.documentElement.removeChild(FWDISPUtils.dumy);}catch(e){}
	        	   return true;
	           }
	       }
	    }
	    try{document.documentElement.removeChild(FWDISPUtils.dumy);}catch(e){}
	    return false;
	};
	
	function get2d(){
	    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform', 'KhtmlTransform'];
	    var p;
	    while (p = properties.shift()) {
	       if (typeof FWDISPUtils.dumy.style[p] !== 'undefined') {
	    	   return true;
	       }
	    }
	    try{document.documentElement.removeChild(FWDISPUtils.dumy);}catch(e){}
	    return false;
	};
	
	//###############################################//
	/* Media. */
	//###############################################//
	
	
	FWDISPUtils.volumeCanBeSet = (function(){
		var soundTest_el = document.createElement("audio");
		if(!soundTest_el) return;
		soundTest_el.volume = 0;
		return soundTest_el.volume == 0 ? true : false;
	}());
	
	
	FWDISPUtils.getVideoFormat = (function(){
		var video  =  document.createElement("video");
		if(!video.canPlayType) return;
		var extention_str;
		if(video.canPlayType("video/mp4") == "probably" || video.canPlayType("video/mp4") == "maybe"){
			extention_str = ".mp4";
		}else if(video.canPlayType("video/ogg") == "probably" || video.canPlayType("video/ogg") == "maybe"){
			extention_str = ".ogg";
		}else if(video.canPlayType("video/webm") == "probably" || video.canPlayType("video/webm") == "maybe"){
			extention_str = ".webm";
		}
		video = null;
		return extention_str;
	})();
	
	
	//###############################################//
	/* various utils */
	//###############################################//
	FWDISPUtils.onReady =  function(callbalk){
		if (document.addEventListener) {
			window.addEventListener("DOMContentLoaded", function(){
				FWDISPUtils.checkIfHasTransofrms();
				FWDISPUtils.hasFullScreen = FWDISPUtils.checkIfHasFullscreen();
				setTimeout(callbalk, 100);
			});
		}else{
			document.onreadystatechange = function () {
				FWDISPUtils.checkIfHasTransofrms();
				FWDISPUtils.hasFullScreen = FWDISPUtils.checkIfHasFullscreen();
				if (document.readyState == "complete") setTimeout(callbalk, 100);
			};
		 }
		
	};
	
	FWDISPUtils.checkIfHasTransofrms = function(){
		document.documentElement.appendChild(FWDISPUtils.dumy);
		FWDISPUtils.hasTransform3d = get3d();
		FWDISPUtils.hasTransform2d = get2d();
		FWDISPUtils.isReadyMethodCalled_bl = true;
	};
	
	FWDISPUtils.checkIfHasFullscreen = function(){
		return Boolean(document.documentElement.requestFullScreen
		|| document.documentElement.mozRequestFullScreen
		|| document.documentElement.webkitRequestFullScreen
		|| document.documentElement.msRequestFullscreen);
	};
	
	FWDISPUtils.disableElementSelection = function(e){
		try{e.style.userSelect = "none";}catch(e){};
		try{e.style.MozUserSelect = "none";}catch(e){};
		try{e.style.webkitUserSelect = "none";}catch(e){};
		try{e.style.khtmlUserSelect = "none";}catch(e){};
		try{e.style.oUserSelect = "none";}catch(e){};
		try{e.style.msUserSelect = "none";}catch(e){};
		try{e.msUserSelect = "none";}catch(e){};
		e.onselectstart = function(){return false;};
	};
	
	FWDISPUtils.getUrlArgs = function urlArgs(string){
		var args = {};
		var query = string.substr(string.indexOf("?") + 1) || location.search.substring(1);
		query = query.replace(/(\?*)(\/*)/g, "");
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
	
	FWDISPUtils.getHashUrlArgs = function urlArgs(string){
		var args = {};
		var query = string.substr(string.indexOf("#") + 1) || location.search.substring(1);
		query = query.replace(/(\?*)(\/*)/g, "");
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

	
	FWDISPUtils.validateEmail = function(mail){  
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){  
			return true;  
		}  
		return false;  
    }; 
    
	
	FWDISPUtils.isReadyMethodCalled_bl = false;
	
	window.FWDISPUtils = FWDISPUtils;
}(window));

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());