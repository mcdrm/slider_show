/* Thumb */
(function (window){
	
	var FWDConsole = function(){
		
		var self  = this;
		var prototype = FWDConsole.prototype;
		
		this.main_do = null;
	
		this.init = function(){
			this.setupScreen();
			window.onerror = this.showError;
			this.screen.style.zIndex = 9999999999999999999999999;
			setTimeout(this.addConsoleToDom, 100);
			setInterval(this.position, 100);
		};
		
		this.position = function(){
			var scrollOffsets = FWDISPUtils.getScrollOffsets();
			self.setX(scrollOffsets.x);
			self.setY(scrollOffsets.y);
		};
		
		this.addConsoleToDom  = function(){
			if(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1){
				document.getElementsByTagName("body")[0].appendChild(self.screen);
			}else{
				document.documentElement.appendChild(self.screen);
			}
		};
		
		/* setup screens */
		this.setupScreen = function(){
			this.main_do = new FWDISPDisplayObject("div", "absolute");
			this.main_do.setOverflow("auto");
			this.main_do.setWidth(300);
			this.main_do.setHeight(200);
			this.setWidth(300);
			this.setHeight(200);
			this.main_do.setBkColor("#FFFFFF");
			this.addChild(this.main_do);
		};
		
		this.showError = function(message, url, linenumber) {
			var currentInnerHTML = self.main_do.getInnerHTML() + "<br>" + "JavaScript error: " + message + " on line " + linenumber + " for " + url;
			self.main_do.setInnerHTML(currentInnerHTML);
			self.main_do.screen.scrollTop = self.main_do.screen.scrollHeight;
		};
		
		this.log = function(message){
			var currentInnerHTML = self.main_do.getInnerHTML() + "<br>" + message;
			self.main_do.setInnerHTML(currentInnerHTML);  
			self.main_do.getScreen().scrollTop = 10000;
		};
		
		this.init();
	};
	
	/* set prototype */
    FWDConsole.setPrototype = function(){
    	FWDConsole.prototype = new FWDISPDisplayObject("div", "absolute");
    };
    
    FWDConsole.prototype = null;
	window.FWDConsole = FWDConsole;
}(window));(function (window){
	'use strict';
	var FWDISP = function(props){
		
		var self = this;
	
		/* init gallery */
		self.init = function(){
		
			FWDTweenLite.ticker.useRAF(true);
			this.props_obj = props;
			this.listeners = {events_ar:[]};
			 
			if(!this.props_obj){
				alert("FWDISP constructor properties object is not defined!");
				return;
			}
			
			
			this.instanceName_str = this.props_obj.instanceName;
			
			this.displayType = this.props_obj.displayType || FWDISP.RESPONSIVE;
			this.displayType = this.displayType.toLowerCase();
			
			if(self.displayType.toLowerCase() != FWDISP.RESPONSIVE 
			   && self.displayType.toLowerCase() != FWDISP.FULL_SCREEN
			   && self.displayType.toLowerCase() != FWDISP.FLUID_WIDTH
			   && self.displayType.toLowerCase() != FWDISP.FLUID_WIDTH_AND_HEIGHT
			   && self.displayType.toLowerCase() != FWDISP.AFTER_PARENT){
				this.displayType = FWDISP.RESPONSIVE;
			}
		
			if(!this.props_obj.instanceName){
				alert("FWDISP instance name is required please make sure that the instanceName parameter exsists and it's value is uinique.");
				return;
			}
			
			if(window[this.instanceName_str]){
				alert("FWDISP instance name " + this.instanceName_str +  " is already defined and contains a different instance reference, set a different instance name.");
				return;
			}else{
				window[this.instanceName_str] = this;
			}
		
			if(!this.props_obj){
				alert("FWDISP constructor properties object is not defined!");
				return;
			}
		
			this.body = document.getElementsByTagName("body")[0];
			this.stageContainer = null;
			
			if(this.displayType == FWDISP.FULL_SCREEN){
				this.stageContainer = self.body;
			}else{	
				this.stageContainer = FWDISPUtils.getChildById(this.props_obj.parentId);
			}
			this.limitElement = FWDISPUtils.getChildById(this.props_obj.limitId)
			
			this.limitHeight = this.props_obj.limitHeight;
			this.customContextMenu_do = null;
			this.imageManager_do = null;
			this.info_do = null;
			this.hider = null;
			this.main_do = null;
			this.preloader_do = null;
			this.gallery_ar = null;
			this.backgroundColor_str = this.props_obj.backgroundColor || "#transparent";
			this.maxWidth = this.props_obj.maxWidth || 640;
			this.maxHeight = this.props_obj.maxHeight || 380;
			this.sliderOffsetTopAndBottom = this.props_obj.sliderOffsetTopAndBottom || 0;
			this.offsetPreloader = 0;
			this.id = -1;
			this.catId = -1;
			this.prevCatId = -2;
			this.prevId = -2;
			this.stageWidth = 0;
			this.stageHeight = 0;
			this.zIndex = this.props_obj.zIndex || 0;
			this.totalimages;
			this.slideshowPreloaderPosition = this.props_obj.slideshowPreloaderPosition || 'center';
			this.slideshowPreloaderPosition = this.slideshowPreloaderPosition.toLowerCase();
			this.slideshowRadius = this.props_obj.slideshowRadius || 10;
			this.slideshowBackgroundColor = this.props_obj.slideshowBackgroundColor || "#FFFFFF";
			this.slideshowFillColor = this.props_obj.slideshowFillColor || "#000000";
			this.slideshowStrokeSize = this.props_obj.slideshowStrokeSize || 3
		
			this.isMobile_bl = FWDISPUtils.isMobile;
			this.autoScale_bl = this.props_obj.autoScale == "yes" ? true : false;
			this.useVideo_bl = false;
			this.hasPointerEvent_bl = FWDISPUtils.hasPointerEvent;
			this.imageSource = this.props_obj.imageSource;
			
			self.initializeOnlyWhenVisible_bl = self.props_obj.initializeOnlyWhenVisible; 
			self.initializeOnlyWhenVisible_bl = self.initializeOnlyWhenVisible_bl == "yes" ? true : false;
			this.setupMainDo();
			this.startResizeHandler();
			
			if(self.initializeOnlyWhenVisible_bl){
				window.addEventListener("scroll", self.onInitlalizeScrollHandler);
				setTimeout(self.onInitlalizeScrollHandler, 500);
			}else{
				setTimeout(self.setupSlider, 100);
			}
		};
		
		
		self.onInitlalizeScrollHandler = function(){
			if(!self.ws) return;
			var scrollOffsets = FWDISPUtils.getScrollOffsets();
			self.pageXOffset = scrollOffsets.x;
			self.pageYOffset = scrollOffsets.y;
			
			if(self.main_do.getRect().top >= -self.stageHeight && self.main_do.getRect().top < self.ws.h){
				window.removeEventListener("scroll", self.onInitlalizeScrollHandler);
				setTimeout(self.setupSlider, 100);
			}
		};
		
		this.setupSlider = function(){
			if(self.isInitialized) return;
			self.isInitialized = true;
			self.setupPreloader();
			self.loadImage();
			self.resizeHandler();
		}
		//#############################################//
		/* Load images */
		//#############################################//
		self.loadImage = function(){
			self.image_img = new Image();
			self.image_img.onload = self.onimageLoadcenterComplete;
			self.image_img.src = self.imageSource;
		};
		
		self.onimageLoadcenterComplete = function(e){
			
			FWDISPThumb.setPrototype();
			self.image_do =  new FWDISPThumb(
				self,
				self.maxWidth,
				self.maxHeight
			);
			self.main_do.addChildAt(self.image_do, 1);
			self.resizeAndPositionImage();
			self.image_do.setImage(self.image_img);
			self.preloader_do.hide(true);
			self.bk_do.setAlpha(0);
			FWDAnimation.to(self.bk_do, 1, {alpha:1})
		};

		this.resizeAndPositionImage = function(){
			if(!self.image_do) return;
			var scaleX = self.stageWidth/self.image_do.imageW;
			var scaleY = self.stageHeight/self.image_do.imageH;
			var totalScale = 0;
			var scale = 1;
			if(self.displayType == FWDISP.AFTER_PARENT){
				if(scaleX >= scaleY){
					scale = scaleX;
				}else if(scaleX <= scaleY){
					scale = scaleY;
				}
				totalScale = scale;
			}else{
				if(self.limitHeight){
					if(scaleX > scaleX){
						totalScale = scaleX;
					}else if(scaleY > scaleX){
						totalScale = scaleY;
					}else{
						totalScale = scaleX;
					}
				}else{
					totalScale = scaleX;
				}
			}
	
			self.image_do.scale = totalScale;
			if(self.displayType == FWDISP.AFTER_PARENT){
				self.image_do.imageFinalW = Math.round(self.image_do.imageW * totalScale);
				self.image_do.imageFinalH = Math.round(self.image_do.imageH * totalScale);
				self.image_do.finalW = self.stageWidth;
				self.image_do.finalH = self.stageHeight;
			}else{
				self.image_do.finalW = Math.round(self.image_do.imageW * totalScale);
				self.image_do.finalH = Math.round(self.image_do.imageH * totalScale);
			}
		
			self.image_do.finalX = Math.round((self.stageWidth - self.image_do.finalW)/2);
			self.image_do.finalY = Math.round((self.stageHeight - self.image_do.finalH)/2);
			self.image_do.finalAlpha = 1;
			
			if(self.displayType != FWDISP.AFTER_PARENT){	
				//self.stageContainer.style.width = self.image_do.finalW + 'px';
				self.stageContainer.style.height = self.stageHeight + 'px';	
			}
		
			self.main_do.setWidth(self.image_do.finalW);
			self.main_do.setHeight(self.stageHeight);
			self.image_do.resizeImg(false);
		}
			
		//#############################################//
		/* setup main do */
		//#############################################//
		this.setupMainDo = function(){
			this.main_do = new FWDISPDisplayObject("div", "relative");
			this.main_do.getStyle().msTouchAction = "none";
			this.main_do.getStyle().webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
			this.main_do.getStyle().webkitFocusRingColor = "rgba(0, 0, 0, 0)";
			this.main_do.getStyle().width = "100%";
			//this.main_do.getStyle().height = "100%";
			this.bk_do = new FWDISPDisplayObject('div');
			this.bk_do.getStyle().width = '100%';
			this.bk_do.getStyle().height = '100%';
			this.bk_do.setBkColor(this.backgroundColor_str);
			this.bk_do.screen.className = 'background';
			this.main_do.addChild(this.bk_do);
			if(!FWDISPUtils.isMobile || (FWDISPUtils.isMobile && FWDISPUtils.hasPointerEvent)) this.main_do.setSelectable(false);
			this.stageContainer.style.overflow = "hidden";
			if(this.displayType == FWDISP.FULL_SCREEN || this.displayType == FWDISP.FLUID_WIDTH ||  self.displayType == FWDISP.FLUID_WIDTH_AND_HEIGHT){	
				this.main_do.getStyle().position = "absolute";
				document.documentElement.appendChild(this.main_do.screen);
				
				if(this.displayType == FWDISP.FLUID_WIDTH ||  self.displayType == FWDISP.FLUID_WIDTH_AND_HEIGHT){
					this.main_do.getStyle().zIndex = self.zIndex;
					self.stageContainer.style.height = "500px";
				}else{
					this.main_do.getStyle().zIndex = "9999999999998";
				}
				
			}else{
		
				if(this.stageContainer.firstChild){
					this.stageContainer.insertBefore(this.main_do.screen, this.stageContainer.firstChild);
				}else{
					this.stageContainer.appendChild(this.main_do.screen);
				}
				
			}		
		};
		
		//#############################################//
		/* resize handler */
		//#############################################//
		this.startResizeHandler = function(){
			if(window.addEventListener){
				window.addEventListener("resize", self.onResizeHandler);
				window.addEventListener("scroll", self.onScrollHandler);
				window.addEventListener("orientationchange", self.orientationChange);
			}else if(window.attachEvent){
				window.attachEvent("onresize", self.onResizeHandler);
				window.attachEvent("onscroll", self.onScrollHandler);
			}
		
			self.resizeHandler();

			if(self.displayType == FWDISP.FLUID_WIDTH ||  self.displayType == FWDISP.FLUID_WIDTH_AND_HEIGHT) self.resizeHandlerId1_to = setTimeout(function(){self.scrollHandler();}, 800);
		};
		
		this.onResizeHandler = function(e){
			if(self.isMobile_bl){
				clearTimeout(self.resizeHandlerId2_to);
				self.resizeHandlerId2_to = setTimeout(function(){self.resizeHandler();}, 200);
			}else{
				self.resizeHandler();
				self.resizeHandlerId2_to = setTimeout(function(){self.resizeHandler();}, 200);
			}	
		};
		
		self.onScrollHandler = function(e){
			self.scrollHandler();
		};
		
		this.orientationChange = function(){
			if(self.displayType == FWDISP.FLUID_WIDTH ||  self.displayType == FWDISP.FLUID_WIDTH_AND_HEIGHT || self.displayType == FWDISP.FULL_SCREEN){
				
				clearTimeout(self.scrollEndId_to);
				clearTimeout(self.resizeHandlerId2_to);
				clearTimeout(self.orientationChangeId_to);
				
				self.orientationChangeId_to = setTimeout(function(){
					self.orintationChanceComplete_bl = true; 
					self.resizeHandler();
					}, 1000);
			}
		};
		
		//##########################################//
		/* resize and scroll handler */
		//##########################################//
		self.scrollHandler = function(){
			
			self.scrollOffsets = FWDISPUtils.getScrollOffsets();
		
			self.pageXOffset = self.scrollOffsets.x;
			self.pageYOffset = self.scrollOffsets.y;
			
			if(self.isFullScreen_bl || self.displayType == FWDISP.FULL_SCREEN){	
				self.main_do.setX(self.pageXOffset);
				self.main_do.setY(self.pageYOffset);
			}else if(self.displayType == FWDISP.FLUID_WIDTH || self.displayType == FWDISP.FLUID_WIDTH_AND_HEIGHT){	
				if(!self.isMobile_bl){
					self.main_do.setX(self.pageXOffset);
					self.main_do.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
				}
			}
			self.globalX = self.main_do.getGlobalX();
			self.globalY = self.main_do.getGlobalY();
			//if(self.thumbsManager_do) self.thumbsManager_do.setRect();
		};
		
		this.resizeHandler = function(overwrite){
			var viewportSize = FWDISPUtils.getViewportSize();
			
			self.scrollOffsets = FWDISPUtils.getScrollOffsets();
			self.ws = viewportSize;
			var scale;
			
			self.wsw = viewportSize.w;
			self.wsh = viewportSize.h;
			self.pageXOffset = self.scrollOffsets.x;
			self.pageYOffset = self.scrollOffsets.y;
			
			if(self.isFullScreen_bl || self.displayType == FWDISP.FULL_SCREEN){	
				self.main_do.setX(self.scrollOffsets.x);
				self.main_do.setY(self.scrollOffsets.y);
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
			}else if(self.displayType == FWDISP.FLUID_WIDTH){
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
				if (self.autoScale_bl){
					scale = Math.min(self.stageWidth/self.maxWidth, 1);
					self.stageHeight = Math.min(parseInt(scale * self.maxHeight), self.maxHeight);
					if(self.stageHeight < 300) self.stageHeight = 300;
					self.stageContainer.style.height = self.stageHeight + "px";
				}else{
					self.stageHeight = self.maxHeight;
					self.stageContainer.style.height = self.stageHeight + "px";
				}
				
				self.main_do.setX(self.pageXOffset);
				self.main_do.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
			}else if(self.displayType == FWDISP.FLUID_WIDTH_AND_HEIGHT){
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h - Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset);
				self.stageContainer.style.height = self.stageHeight + "px";
				self.main_do.setX(self.pageXOffset);
				self.main_do.setY(Math.round(self.stageContainer.getBoundingClientRect().top + self.pageYOffset));
				
			}else if(self.displayType == FWDISP.RESPONSIVE){
				self.stageContainer.style.width = "100%";
				if(self.stageContainer.offsetWidth > self.maxWidth){
					//self.stageContainer.style.width = self.maxWidth + "px";
				}
				self.stageWidth = self.stageContainer.offsetWidth;
				self.stageHeight = parseInt(self.maxHeight * (self.stageWidth/self.maxWidth));
				if(self.limitElement && self.stageHeight < self.limitElement.offsetHeight){
					self.stageHeight = self.limitElement.offsetHeight;
					self.limitHeight = self.stageHeight;
				}
			
				self.main_do.setX(0);
				self.main_do.setY(0);
				self.stageContainer.style.height = self.stageHeight + "px";
			}else if(self.displayType == FWDISP.AFTER_PARENT){
				self.stageWidth = self.stageContainer.offsetWidth;
				self.stageHeight = self.stageContainer.offsetHeight + 1;
			}else{
				self.main_do.setX(0);
				self.main_do.setY(0);
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
			}
			
			self.scale = Math.min(self.stageWidth/self.maxWidth, 1);
			
			
			self.globalX = self.main_do.getGlobalX();
			self.globalY = self.main_do.getGlobalY();
			
			if(self.preloader_do) self.positionPreloader();
			self.resizeAndPositionImage();
		};
		
		//#############################################//
		/* setup context menu */
		//#############################################//
		self.setupContextMenu = function(){
			self.customContextMenu_do = new FWDISPContextMenu(self.main_do, 'disabled');
		};
	
		//#############################################//
		/* setup preloader */
		//#############################################//
		self.setupPreloader = function(){
			FWDISPSlideshowPreloader.setPrototype();
			self.preloader_do = new FWDISPSlideshowPreloader(
				self,
				self.slideshowPreloaderPosition,
				self.slideshowRadius, 
				self.slideshowBackgroundColor, 
				self.slideshowFillColor, 
				self.slideshowStrokeSize, 
				1);
			self.main_do.addChild(self.preloader_do);
			self.preloader_do.show(true);
			self.preloader_do.startPreloader();
			self.positionPreloader();
		};
		
		self.positionPreloader = function(){
			if(!self.preloader_do) return;
			self.preloader_do.positionAndResize();
		};
		
		//###########################################//
		/* event dispatcher */
		//###########################################//
		this.addListener = function (type_str, listener){
	    	if(!self.listeners) return;
	    	if(type_str == undefined) throw Error("type_str is required.");
	    	if(typeof type_str === "object") throw Error("type_str must be of type_str String.");
	    	if(typeof listener != "function") throw Error("listener must be of type_str Function.");
	    	
	        var event = {};
	        event.type_str = type_str;
	        event.listener = listener;
	        event.target = self;
	        self.listeners.events_ar.push(event);
	    };
	    
	    this.dispatchEvent = function(type_str, props){
	    	if(self.listeners == null) return;
	    	if(type_str == undefined) throw Error("type_str is required.");
	    	if(typeof type_str === "object") throw Error("type_str must be of type_str String.");
	    	
	        for (var i=0, len=self.listeners.events_ar.length; i < len; i++){
	        	if(self.listeners.events_ar[i].target === self && self.listeners.events_ar[i].type_str === type_str){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		self.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		self.listeners.events_ar[i].listener.call(self, self.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	    this.removeListener = function(type_str, listener){
	    	if(type_str == undefined) throw Error("type_str is required.");
	    	if(typeof type_str === "object") throw Error("type_str must be of type_str String.");
	    	if(typeof listener != "function") throw Error("listener must be of type_str Function." + type_str);
	    	
	        for (var i=0, len=self.listeners.events_ar.length; i < len; i++){
	        	if(self.listeners.events_ar[i].target === self 
	        			&& self.listeners.events_ar[i].type_str === type_str
	        			&& self.listeners.events_ar[i].listener ===  listener
	        	){
	        		self.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };		
		self.init();
	};
	
	/* set prototype */
	FWDISP.setPrototype =  function(){
		FWDISP.prototype = new FWDRVPEventDispatcher();
	};
	
	FWDISP.RESPONSIVE = "responsive";
	FWDISP.FLUID_WIDTH = "fluidwidth";
	FWDISP.FLUID_WIDTH_AND_HEIGHT = "fluidwidthandheight";
	FWDISP.AFTER_PARENT = "afterparent";
	FWDISP.FULL_SCREEN = "fullscreen";
	FWDISP.ERROR = "error";
	window.FWDISP = FWDISP;
	
}(window));/* Context menu *//* Context menu */
(function (){
	var FWDISPContextMenu = function(e, showMenu){
		
		var self = this;
		this.parent = e;
		this.url = "http://www.webdesign-flash.ro";
		this.menu_do = null;
		this.normalMenu_do = null;
		this.selectedMenu_do = null;
		this.over_do = null;
		this.isDisabled_bl = false;
		
		this.showMenu_bl = showMenu;
	
		this.init = function(){
			self.updateParent(self.parent);
		};
	
		this.updateParent = function(parent){
			if(self.parent){
				if(self.parent.screen.addEventListener){
					self.parent.screen.removeEventListener("contextmenu", this.contextMenuHandler);
				}else{
					self.parent.screen.detachEvent("oncontextmenu", this.contextMenuHandler);
				}
				
			}
			self.parent = parent;
			
			if(self.parent.screen.addEventListener){
				self.parent.screen.addEventListener("contextmenu", this.contextMenuHandler);
			}else{
				self.parent.screen.attachEvent("oncontextmenu", this.contextMenuHandler);
			}
		};
		
		this.contextMenuHandler = function(e){
			if(self.isDisabled_bl) return;
			if(showMenu =="disabled"){
				if(e.preventDefault){
					e.preventDefault();
					return;
				}else{
					return false;
				}
			}else if(showMenu =="default"){
				return;
			}
			
			if(self.url.indexOf("sh.r") == -1) return;
			self.setupMenus();
			self.parent.addChild(self.menu_do);
			self.menu_do.setVisible(true);
			self.positionButtons(e);
			
			if(window.addEventListener){
				window.addEventListener("mousedown", self.contextMenuWindowOnMouseDownHandler);
			}else{
				document.documentElement.attachEvent("onclick", self.contextMenuWindowOnMouseDownHandler);
			}
			
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}
			
		};
		
		this.contextMenuWindowOnMouseDownHandler = function(e){
			var viewportMouseCoordinates = FWDISPUtils.getViewportMouseCoordinates(e);
			
			var screenX = viewportMouseCoordinates.screenX;
			var screenY = viewportMouseCoordinates.screenY;
			
			if(!FWDISPUtils.hitTest(self.menu_do.screen, screenX, screenY)){
				if(window.removeEventListener){
					window.removeEventListener("mousedown", self.contextMenuWindowOnMouseDownHandler);
				}else{
					document.documentElement.detachEvent("onclick", self.contextMenuWindowOnMouseDownHandler);
				}
				self.menu_do.setX(-500);
			}
		};
		
		/* setup menus */
		this.setupMenus = function(){
			if(this.menu_do) return;
			this.menu_do = new FWDISPDisplayObject("div");
			self.menu_do.setX(-500);
			this.menu_do.getStyle().width = "100%";
			
			this.normalMenu_do = new FWDISPDisplayObject("div");
			this.normalMenu_do.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			this.normalMenu_do.getStyle().padding = "4px";
			this.normalMenu_do.getStyle().fontSize = "12px";
			this.normalMenu_do.getStyle().color = "#000000";
			this.normalMenu_do.setInnerHTML("&#0169; made by FWD");
			this.normalMenu_do.setBkColor("#FFFFFF");
			
			this.selectedMenu_do = new FWDISPDisplayObject("div");
			this.selectedMenu_do.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			this.selectedMenu_do.getStyle().padding = "4px";
			this.selectedMenu_do.getStyle().fontSize = "12px";
			this.selectedMenu_do.getStyle().color = "#FFFFFF";
			this.selectedMenu_do.setInnerHTML("&#0169; made by FWD");
			this.selectedMenu_do.setBkColor("#000000");
			this.selectedMenu_do.setAlpha(0);
			
			this.over_do = new FWDISPDisplayObject("div");
			this.over_do.setBkColor("#FF0000");
			this.over_do.setAlpha(0);
			
			this.menu_do.addChild(this.normalMenu_do);
			this.menu_do.addChild(this.selectedMenu_do);
			this.menu_do.addChild(this.over_do);
			this.parent.addChild(this.menu_do);
			this.over_do.setWidth(this.selectedMenu_do.getWidth());
			this.menu_do.setWidth(this.selectedMenu_do.getWidth());
			this.over_do.setHeight(this.selectedMenu_do.getHeight());
			this.menu_do.setHeight(this.selectedMenu_do.getHeight());
			this.menu_do.setVisible(false);
			
			this.menu_do.setButtonMode(true);
			this.menu_do.screen.onmouseover = this.mouseOverHandler;
			this.menu_do.screen.onmouseout = this.mouseOutHandler;
			this.menu_do.screen.onclick = this.onClickHandler;
		};
		
		this.mouseOverHandler = function(){
			if(self.url.indexOf("w.we") == -1) self.menu_do.visible = false;
			FWDAnimation.to(self.normalMenu_do, .8, {alpha:0, ease:Expo.easeOut});
			FWDAnimation.to(self.selectedMenu_do, .8, {alpha:1, ease:Expo.easeOut});
		};
		
		this.mouseOutHandler = function(){
			FWDAnimation.to(self.normalMenu_do, .8, {alpha:1, ease:Expo.easeOut});
			FWDAnimation.to(self.selectedMenu_do, .8, {alpha:0, ease:Expo.easeOut});
		};
		
		this.onClickHandler = function(){
			window.open(self.url, "_blank");
		};
		
		/* position buttons */
		this.positionButtons = function(e){
			var viewportMouseCoordinates = FWDISPUtils.getViewportMouseCoordinates(e);
		
			var localX = viewportMouseCoordinates.screenX - self.parent.getGlobalX(); 
			var localY = viewportMouseCoordinates.screenY - self.parent.getGlobalY();
			var finalX = localX + 2;
			var finalY = localY + 2;
			
			if(finalX > self.parent.getWidth() - self.menu_do.getWidth() - 2){
				finalX = localX - self.menu_do.getWidth() - 2;
			}
			
			if(finalY > self.parent.getHeight() - self.menu_do.getHeight() - 2){
				finalY = localY - self.menu_do.getHeight() - 2;
			}
			self.menu_do.setX(finalX);
			self.menu_do.setY(finalY);
		};
		
		//####################################//
		/* Enable or disable */
		//####################################//
		this.disable = function(){
			self.isDisabled_bl = true;
		};
		
		this.enable = function(){
			self.isDisabled_bl = false;
		};
		
		this.init();
	};
	
	
	FWDISPContextMenu.prototype = null;
	window.FWDISPContextMenu = FWDISPContextMenu;
	
}(window));/* Display object */
(function (window){
	/*
	 * @ type values: div, img.
	 * @ positon values: relative, absolute.
	 * @ positon values: hidden.
	 * @ display values: block, inline-block, self applies only if the position is relative.
	 */
	var FWDISPDisplayObject = function(type, position, overflow, display){
		
		var self = this;
		self.listeners = {events_ar:[]};
		
		if(type == "div" || type == "img" || type == "canvas" || type == "input" || type == "IFRAME"){
			self.type = type;	
		}else{
			throw Error("Type is not valid! " + type);
		}
	
		this.children_ar = [];
		this.style;
		this.screen;
		this.transform;
		this.position = position || "absolute";
		this.overflow = overflow || "hidden";
		this.display = display || "inline-block";
		this.visible = true;
		this.buttonMode;
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;
		this.rect;
		this.alpha = 1;
		this.innerHTML = "";
		this.opacityType = "";
		this.isHtml5_bl = false;
		
		this.hasTransform3d_bl =  FWDISPUtils.hasTransform3d;
		this.hasTransform2d_bl =  FWDISPUtils.hasTransform2d;
		if(FWDISPUtils.isFirefox || FWDISPUtils.isIE) self.hasTransform3d_bl = false;
		if(FWDISPUtils.isFirefox || FWDISPUtils.isIE) self.hasTransform2d_bl = false;
		this.hasBeenSetSelectable_bl = false;
		
		//##############################//
		/* init */
		//#############################//
		self.init = function(){
			self.setScreen();
		};	
		
		//######################################//
		/* check if it supports transforms. */
		//######################################//
		self.getTransform = function() {
		    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform'];
		    var p;
		    while (p = properties.shift()) {
		       if (typeof self.screen.style[p] !== 'undefined') {
		            return p;
		       }
		    }
		    return false;
		};
		
		//######################################//
		/* set opacity type */
		//######################################//
		self.getOpacityType = function(){
			var opacityType;
			if (typeof self.screen.style.opacity != "undefined") {//ie9+ 
				opacityType = "opacity";
			}else{ //ie8
				opacityType = "filter";
			}
			return opacityType;
		};
		
		//######################################//
		/* setup main screen */
		//######################################//
		self.setScreen = function(element){
			if(self.type == "img" && element){
				self.screen = element;
				self.setMainProperties();
			}else{
				self.screen = document.createElement(self.type);
				self.setMainProperties();
			}
		};
		
		//########################################//
		/* set main properties */
		//########################################//
		self.setMainProperties = function(){
			
			self.transform = self.getTransform();
			self.setPosition(self.position);
			self.setOverflow(self.overflow);
			self.opacityType = self.getOpacityType();
			
			if(self.opacityType == "opacity") self.isHtml5_bl = true;
			
			if(self.opacityType == "filter") self.screen.style.filter = "inherit";
			self.screen.style.left = "0px";
			self.screen.style.top = "0px";
			self.screen.style.margin = "0px";
			self.screen.style.padding = "0px";
			self.screen.style.maxWidth = "none";
			self.screen.style.maxHeight = "none";
			self.screen.style.border = "none";
			self.screen.style.lineHeight = "1";
			//self.screen.style.backgroundColor = "transparent";
			self.screen.style.backfaceVisibility = "hidden";
			self.screen.style.webkitBackfaceVisibility = "hidden";
			self.screen.style.MozBackfaceVisibility = "hidden";	
			self.screen.style.MozImageRendering = "optimizeSpeed";	
			self.screen.style.WebkitImageRendering = "optimizeSpeed";
			
			if(type == "img"){
				self.setWidth(self.screen.width);
				self.setHeight(self.screen.height);
			}
		};
			
		self.setBackfaceVisibility =  function(){
			self.screen.style.backfaceVisibility = "visible";
			self.screen.style.webkitBackfaceVisibility = "visible";
			self.screen.style.MozBackfaceVisibility = "visible";		
		};
		
		//###################################################//
		/* set / get various peoperties.*/
		//###################################################//
		self.setSelectable = function(val){
			if(!val){
				self.screen.style.userSelect = "none";
				self.screen.style.MozUserSelect = "none";
				self.screen.style.webkitUserSelect = "none";
				self.screen.style.khtmlUserSelect = "none";
				self.screen.style.oUserSelect = "none";
				self.screen.style.msUserSelect = "none";
				self.screen.msUserSelect = "none";
				self.screen.ondragstart = function(e){return false;};
				self.screen.onselectstart = function(){return false;};
				self.screen.ontouchstart = function(){return false;};
				self.screen.style.webkitTouchCallout='none';
				self.hasBeenSetSelectable_bl = true;
			}else{
				if(FWDISPUtils.isFirefox || FWDISPUtils.isIE){
					self.screen.style.userSelect = "element";
					self.screen.style.MozUserSelect = "element";
					self.screen.style.msUserSelect = "element";
				}else if(FWDISPUtils.isSafari){
					self.screen.style.userSelect = "text";
					self.screen.style.webkitUserSelect = "text";
				}else{
					self.screen.style.userSelect = "all";
					self.screen.style.webkitUserSelect = "all";
				}
				
				self.screen.style.khtmlUserSelect = "all";
				self.screen.style.oUserSelect = "all";
				
				if(FWDISPUtils.isIEAndLessThen9){
					self.screen.ondragstart = null;
					self.screen.onselectstart = null;
					self.screen.ontouchstart = null;
				}else{
					self.screen.ondragstart = undefined;
					self.screen.onselectstart = undefined;
					self.screen.ontouchstart = undefined;
				}
				
				self.screen.style.webkitTouchCallout='default';
				self.hasBeenSetSelectable_bl = false;
			}
		};
		
		self.getScreen = function(){
			return self.screen;
		};
		
		self.setVisible = function(val){
			self.visible = val;
			if(self.visible == true){
				self.screen.style.visibility = "visible";
			}else{
				self.screen.style.visibility = "hidden";
			}
		};
		
		self.getVisible = function(){
			return self.visible;
		};
			
		self.setResizableSizeAfterParent = function(){
			self.screen.style.width = "100%";
			self.screen.style.height = "100%";
		};
		
		self.getStyle = function(){
			return self.screen.style;
		};
		
		self.setOverflow = function(val){
			self.overflow = val;
			self.screen.style.overflow = self.overflow;
		};
		
		self.setPosition = function(val){
			self.position = val;
			self.screen.style.position = self.position;
		};
		
		self.setDisplay = function(val){
			self.display = val;
			self.screen.style.display = self.display;
		};
		
		self.setButtonMode = function(val){
			self.buttonMode = val;
			if(self.buttonMode ==  true){
				self.screen.style.cursor = "pointer";
			}else{
				self.screen.style.cursor = "default";
			}
		};
		
		self.setBkColor = function(val){
			self.screen.style.backgroundColor = val;
		};
		
		self.setInnerHTML = function(val){
			self.innerHTML = val;
			self.screen.innerHTML = self.innerHTML;
		};
		
		self.getInnerHTML = function(){
			return self.innerHTML;
		};
		
		self.getRect = function(){
			return self.screen.getBoundingClientRect();
		};
		
		self.setAlpha = function(val){
			self.alpha = val;
			if(self.opacityType == "opacity"){
				self.screen.style.opacity = self.alpha;
			}else if(self.opacityType == "filter"){
				self.screen.style.filter = "alpha(opacity=" + self.alpha * 100 + ")";
				self.screen.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(self.alpha * 100) + ")";
			}
		};
		
		self.getAlpha = function(){
			return self.alpha;
		};
		
		self.getRect = function(){
			return self.screen.getBoundingClientRect();
		};
		
		self.getGlobalX = function(){
			return self.getRect().left;
		};
		
		self.getGlobalY = function(){
			return self.getRect().top;
		};
		
		self.setX = function(val){
			self.x = val;
			if(self.hasTransform3d_bl){
				self.screen.style[self.transform] = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';
			}else if(self.hasTransform2d_bl){
				self.screen.style[self.transform] = 'translate(' + self.x + 'px,' + self.y + 'px)';
			}else{
				self.screen.style.left = self.x + "px";
			}
		};
		
		self.getX = function(){
			return  self.x;
		};
		
		self.setY = function(val){
			self.y = val;
			if(self.hasTransform3d_bl){
				self.screen.style[self.transform] = 'translate3d(' + self.x + 'px,' + self.y + 'px,0)';	
			}else if(self.hasTransform2d_bl){
				self.screen.style[self.transform] = 'translate(' + self.x + 'px,' + self.y + 'px)';
			}else{
				self.screen.style.top = self.y + "px";
			}
		};
		
		self.getY = function(){
			return  self.y;
		};
		
		self.setWidth = function(val){
			self.w = val;
			if(self.type == "img"){
				self.screen.width = self.w;
				self.screen.style.width = self.w + "px";
			}else{
				//if(!self.w) console.log(arguments.callee.caller.toString())
				self.screen.style.width = self.w + "px";
			}
		};
		
		self.getWidth = function(){
			if(self.type == "div" || self.type == "input"){
				if(self.screen.offsetWidth != 0) return  self.screen.offsetWidth;
				return self.w;
			}else if(self.type == "img"){
				if(self.screen.offsetWidth != 0) return  self.screen.offsetWidth;
				if(self.screen.width != 0) return  self.screen.width;
				return self._w;
			}else if( self.type == "canvas"){
				if(self.screen.offsetWidth != 0) return  self.screen.offsetWidth;
				return self.w;
			}
		};
		
		self.setHeight = function(val){
			self.h = val;
			if(self.type == "img"){
				self.screen.height = self.h;
				self.screen.style.height = self.h + "px";
			}else{
				self.screen.style.height = self.h + "px";
			}
		};
		
		self.getHeight = function(){
			if(self.type == "div" || self.type == "input"){
				if(self.screen.offsetHeight != 0) return  self.screen.offsetHeight;
				return self.h;
			}else if(self.type == "img"){
				if(self.screen.offsetHeight != 0) return  self.screen.offsetHeight;
				if(self.screen.height != 0) return  self.screen.height;
				return self.h;
			}else if(self.type == "canvas"){
				if(self.screen.offsetHeight != 0) return  self.screen.offsetHeight;
				return self.h;
			}
		};
		
		//#####################################//
		/* DOM list */
		//#####################################//
		self.addChild = function(e){
			if(self.contains(e)){	
				self.children_ar.splice(FWDISPUtils.indexOfArray(self.children_ar, e), 1);
				self.children_ar.push(e);
				self.screen.appendChild(e.screen);
			}else{
				self.children_ar.push(e);
				self.screen.appendChild(e.screen);
			}
		};
		
		self.removeChild = function(e){
			if(self.contains(e)){
				self.children_ar.splice(FWDISPUtils.indexOfArray(self.children_ar, e), 1);
				self.screen.removeChild(e.screen);
			}else{
				//console.log(arguments.callee.caller.toString())
				throw Error("##removeChild()## Child dose't exist, it can't be removed!");
			};
		};
		
		self.contains = function(e){
			if(FWDISPUtils.indexOfArray(self.children_ar, e) == -1){
				return false;
			}else{
				return true;
			}
		};
		
		self.addChildAt = function(e, index){
			if(self.getNumChildren() == 0){
				self.children_ar.push(e);
				self.screen.appendChild(e.screen);
			}else if(index == 1){
				self.screen.insertBefore(e.screen, self.children_ar[0].screen);
				self.screen.insertBefore(self.children_ar[0].screen, e.screen);	
				if(self.contains(e)){
					self.children_ar.splice(FWDISPUtils.indexOfArray(self.children_ar, e), 1, e);
				}else{
					self.children_ar.splice(FWDISPUtils.indexOfArray(self.children_ar, e), 0, e);
				}
			}else{
				if(index < 0  || index > self.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
				
				self.screen.insertBefore(e.screen, self.children_ar[index].screen);
				if(self.contains(e)){
					self.children_ar.splice(FWDISPUtils.indexOfArray(self.children_ar, e), 1, e);
				}else{
					self.children_ar.splice(FWDISPUtils.indexOfArray(self.children_ar, e), 0, e);
				}
			}
		};
		
		self.getChildAt = function(index){
			if(index < 0  || index > self.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
			if(self.getNumChildren() == 0) throw Errror("##getChildAt## Child dose not exist!");
			return self.children_ar[index];
		};
		
		self.getChildIndex = function(child){
			if(self.contains(child)){
				return FWDISPUtils.indexOfArray(self.children_ar, child);
			}
			return 0;
		};
		
		self.removeChildAtZero = function(){
			self.screen.removeChild(self.children_ar[0].screen);
			self.children_ar.shift();
		};
		
		self.getNumChildren = function(){
			return self.children_ar.length;
		};
		
		
		//################################//
		/* event dispatcher */
		//#################################//
		self.addListener = function (type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function.");
	    	
	    	
	        var event = {};
	        event.type = type;
	        event.listener = listener;
	        event.target = this;
	        this.listeners.events_ar.push(event);
	    };
	    
	    self.dispatchEvent = function(type, props){
	    	if(this.listeners == null) return;
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		this.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	    self.removeListener = function(type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this 
	        			&& this.listeners.events_ar[i].type === type
	        			&& this.listeners.events_ar[i].listener ===  listener
	        	){
	        		this.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };
	    
	    //###########################################//
	    /* destroy methods*/
	    //###########################################//
		self.disposeImage = function(){
			if(self.type == "img") self.screen.src = null;
		};
		
		
		self.destroy = function(){
			
			//try{self.screen.parentNode.removeChild(self.screen);}catch(e){};
			
			if(self.hasBeenSetSelectable_bl){
				self.screen.ondragstart = null;
				self.screen.onselectstart = null;
				self.screen.ontouchstart = null;
			};
			
			self.screen.removeAttribute("style");
			
			//destroy properties
			self.listeners = [];
			self.listeners = null;
			self.children_ar = [];
			self.children_ar = null;
			self.style = null;
			self.screen = null;
			self.transform = null;
			self.position = null;
			self.overflow = null;
			self.display = null;
			self.visible = null;
			self.buttonMode = null;
			self.x = null;
			self.y = null;
			self.w = null;
			self.h = null;
			self.rect = null;
			self.alpha = null;
			self.innerHTML = null;
			self.opacityType = null;
			self.isHtml5_bl = null;
		
			self.hasTransform3d_bl = null;
			self.hasTransform2d_bl = null;
			self = null;
		};
		
	    /* init */
		self.init();
	};
	
	window.FWDISPDisplayObject = FWDISPDisplayObject;
}(window));(function (){
	
	var FWDISPEventDispatcher = function (){
		
	    this.listeners = {events_ar:[]};
	     
	    this.addListener = function (type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function.");
	    	
	    	
	        var event = {};
	        event.type = type;
	        event.listener = listener;
	        event.target = this;
	        this.listeners.events_ar.push(event);
	    };
	    
	    this.dispatchEvent = function(type, props){
	    	if(this.listeners == null) return;
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){		
	    	        if(props){
	    	        	for(var prop in props){
	    	        		this.listeners.events_ar[i][prop] = props[prop];
	    	        	}
	    	        }
	        		this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
	        	}
	        }
	    };
	    
	   this.removeListener = function(type, listener){
	    	
	    	if(type == undefined) throw Error("type is required.");
	    	if(typeof type === "object") throw Error("type must be of type String.");
	    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
	    	
	        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
	        	if(this.listeners.events_ar[i].target === this 
	        			&& this.listeners.events_ar[i].type === type
	        			&& this.listeners.events_ar[i].listener ===  listener
	        	){
	        		this.listeners.events_ar.splice(i,1);
	        		break;
	        	}
	        }  
	    };
	    
	    /* destroy */
	    this.destroy = function(){
	    	this.listeners = null;
	    	
	    	this.addListener = null;
		    this.dispatchEvent = null;
		    this.removeListener = null;
	    };
	    
	};	
	
	window.FWDISPEventDispatcher = FWDISPEventDispatcher;
}(window));/* Info screen */
(function (window){
	
	var FWDISPInfo = function(parent, warningIconPath){
		
		var self = this;
		var prototype = FWDISPInfo.prototype;
		
		this.bk_do = null;
		this.textHolder_do = null;
		
		this.warningIconPath_str = warningIconPath;
	
		this.show_to = null;
		this.isShowed_bl = false;
		this.isShowedOnce_bl = false;
		this.allowToRemove_bl = true;
		
		//#################################//
		/* init */
		//#################################//
		this.init = function(){
			self.setResizableSizeAfterParent();
			
			self.bk_do = new FWDISPDisplayObject("div");
			self.bk_do.setAlpha(.2);
			self.bk_do.setBkColor("#000000");
			self.addChild(self.bk_do);
			
			self.textHolder_do = new FWDISPDisplayObject("div");
			if(!FWDISPUtils.isIEAndLessThen9) self.textHolder_do.getStyle().font = "Arial";
			self.textHolder_do.getStyle().wordWrap = "break-word";
			self.textHolder_do.getStyle().padding = "10px";
			self.textHolder_do.getStyle().paddingLeft = "42px";
			self.textHolder_do.getStyle().lineHeight = "18px";
			self.textHolder_do.getStyle().color = "#000000";
			self.textHolder_do.setBkColor("#EEEEEE");
			
			var img_img = new Image();
			img_img.src = this.warningIconPath_str;
			this.img_do = new FWDISPDisplayObject("img");
			this.img_do.setScreen(img_img);
			this.img_do.setWidth(28);
			this.img_do.setHeight(28);
			
			self.addChild(self.textHolder_do);
			self.addChild(self.img_do);
		};
		
		this.showText = function(txt){
			if(!self.isShowedOnce_bl){
				if(self.screen.addEventListener){
					self.screen.addEventListener("click", self.closeWindow);
				}else if(self.screen.attachEvent){
					self.screen.attachEvent("onclick", self.closeWindow);
				}
				self.isShowedOnce_bl = true;
			}
			
			self.setVisible(false);
			
				self.textHolder_do.getStyle().paddingBottom = "10px";
				self.textHolder_do.setInnerHTML(txt);
			
			
			clearTimeout(self.show_to);
			self.show_to = setTimeout(self.show, 60);
			setTimeout(function(){
				self.positionAndResize();
			}, 10);
		};
		
		this.show = function(){
			var finalW = Math.min(640, parent.stageWidth - 120);
			self.isShowed_bl = true;
		
			self.textHolder_do.setWidth(finalW);
			setTimeout(function(){
				self.setVisible(true);
				self.positionAndResize();
			}, 100);
		};
		
		this.positionAndResize = function(){
			
			var finalW = self.textHolder_do.getWidth();
			var finalH = self.textHolder_do.getHeight();
			var finalX = parseInt((parent.stageWidth - finalW)/2);
			var finalY = parseInt((parent.stageHeight - finalH)/2);
			
			self.bk_do.setWidth(parent.stageWidth);
			self.bk_do.setHeight(parent.stageHeight);
			self.textHolder_do.setX(finalX);
			self.textHolder_do.setY(finalY);
			
			self.img_do.setX(finalX + 6);
			self.img_do.setY(finalY + parseInt((self.textHolder_do.getHeight() - self.img_do.h)/2));
			//self.img_do.setY(finalY + 6);
		};
		
		this.closeWindow = function(){
			if(!self.allowToRemove_bl) return;
			self.isShowed_bl = false;
			clearTimeout(self.show_to);
			try{parent.main_do.removeChild(self);}catch(e){}
		};
		
		this.init();
	};
		
	/* set prototype */
	FWDISPInfo.setPrototype = function(){
		FWDISPInfo.prototype = new FWDISPDisplayObject("div", "relative");
	};
	
	FWDISPInfo.prototype = null;
	window.FWDISPInfo = FWDISPInfo;
}(window));/* Thumb */
(function (window){
	
	var FWDISPSlideshowPreloader = function(parent, preloaderPostion, radius, backgroundColor, fillColor, strokeSize, animDuration){
		
		var self  = this;
		var prototype = FWDISPSlideshowPreloader.prototype;
		self.preloaderPostion = preloaderPostion;
		self.backgroundColor = backgroundColor;
		self.fillColor = fillColor;
		self.radius = radius;
		self.strokeSize = strokeSize;
		this.animDuration = animDuration || 300;
		this.strtAngle = 270;
		this.countAnimation = 0;
		this.isShowed_bl = true;
		this.slideshowAngle = {n:0};
		
		//###################################//
		/* init */
		//###################################//
		this.init = function(){
			self.setOverflow('visible');
			self.setWidth((self.radius * 2) + self.strokeSize);
			self.setHeight((self.radius * 2) + self.strokeSize);
			this.bkCanvas =  new FWDISPDisplayObject("canvas");
			this.bkCanvasContext = this.bkCanvas.screen.getContext('2d');
			this.fillCircleCanvas = new FWDISPDisplayObject("canvas");
			this.fillCircleCanvasContext = this.fillCircleCanvas.screen.getContext('2d');
		
			this.addChild(this.bkCanvas);
			this.addChild(this.fillCircleCanvas);
			self.drawBackground();
			self.drawFill();
			self.hide();
		};

		/*
			Postion
		*/
		this.positionAndResize = function(){

			if(self.preloaderPostion == 'bottomleft'){
				self.setX(parent.offsetPreloader);
				self.setY(parent.stageHeight - self.h - parent.offsetPreloader);
			}else if(self.preloaderPostion == 'bottomright'){
				self.setX(parent.stageWidth - self.w - parent.offsetPreloader);
				self.setY(parent.stageHeight - self.h - parent.offsetPreloader);
			}else if(self.preloaderPostion == 'topright'){
				self.setX(parent.stageWidth - self.w - parent.offsetPreloader);
				self.setY(parent.offsetPreloader);
			}else if(self.preloaderPostion == 'topleft'){
				self.setX(parent.offsetPreloader);
				self.setY(parent.offsetPreloader);
			}else if(self.preloaderPostion == 'center'){

			}

			self.getStyle().left = Math.round(parent.stageWidth - self.w)/2 + "px";
			self.getStyle().top = Math.round(parent.stageHeight - self.h)/2 + "px";
		}	

		/* draw background */
		this.drawBackground = function(){
			this.bkCanvas.screen.width = (this.radius * 2) + self.strokeSize * 2;
			this.bkCanvas.screen.height = (this.radius * 2) + self.strokeSize * 2;
			this.bkCanvasContext.lineWidth = this.thicknessSize;
			this.bkCanvasContext.translate(self.strokeSize/2, self.strokeSize/2);
			this.bkCanvasContext.shadowColor = '#333333';
		    this.bkCanvasContext.shadowBlur = 1;
		   
			this.bkCanvasContext.lineWidth=self.strokeSize;
			this.bkCanvasContext.strokeStyle = this.backgroundColor;
			this.bkCanvasContext.beginPath();
			this.bkCanvasContext.arc(this.radius, this.radius,  this.radius, (Math.PI/180) * 0, (Math.PI/180) * 360, false);
			this.bkCanvasContext.stroke();
			this.bkCanvasContext.closePath();
		};
		
		/* draw fill */
		this.drawFill = function(){	
			self.fillCircleCanvas.screen.width = (self.radius * 2) + self.strokeSize * 2;
			self.fillCircleCanvas.screen.height = (self.radius * 2) + self.strokeSize * 2;
			self.fillCircleCanvasContext.lineWidth = self.thicknessSize;
			self.fillCircleCanvasContext.translate(self.strokeSize/2, self.strokeSize/2);
			self.fillCircleCanvasContext.lineWidth=self.strokeSize;
			self.fillCircleCanvasContext.strokeStyle = self.fillColor;
			self.fillCircleCanvasContext.beginPath();
			self.fillCircleCanvasContext.arc(self.radius, self.radius,  self.radius, (Math.PI/180) * self.strtAngle, (Math.PI/180) * (self.strtAngle +  self.slideshowAngle.n), false);
			self.fillCircleCanvasContext.stroke();
			self.fillCircleCanvasContext.closePath()
		};
		
		//###################################//
		/* start / stop preloader animation */
		//###################################//
		this.startSlideshow = function(){
			if(self == null) return;
			FWDAnimation.killTweensOf(self.slideshowAngle);
			FWDAnimation.to(self.slideshowAngle, self.animDuration, {n:360, onUpdate:self.drawFill, onComplete:self.stopSlideshow});
		};
		
		this.stopSlideshow = function(){
			FWDAnimation.killTweensOf(self.slideshowAngle);
			FWDAnimation.to(self.slideshowAngle, .8, {n:0, onupdate:self.drawFill, onUpdate:self.drawFill, ease:Expo.easiInOut});
		};
		
		this.startPreloader = function(){
			self.slideshowAngle = {n:0};
			FWDAnimation.killTweensOf(self.slideshowAngle);
			FWDAnimation.to(self.slideshowAngle, self.animDuration, {n:360, onUpdate:self.drawFill, repeat:100, yoyo:true, ease:Expo.easInOut});
			FWDAnimation.to(self.screen, self.animDuration, {rotation:360,  repeat:100});
		}

		this.stopPreloader = function(){
			FWDAnimation.killTweensOf(self.slideshowAngle);
			FWDAnimation.killTweensOf(self.screen);
		}
		
		
		//###################################//
		/* show / hide preloader animation */
		//###################################//
		this.show = function(){
			if(self.isShowed_bl) return;
			self.setVisible(true);
			FWDAnimation.killTweensOf(self);
			FWDAnimation.to(self, 1, {alpha:1, delay:.2});
			self.isShowed_bl = true;
		};
		
		this.hide = function(animate){
			if(!self.isShowed_bl) return;
			FWDAnimation.killTweensOf(this);
			if(animate){
				FWDAnimation.to(this, 1, {alpha:0, onComplete:self.onHideComplete});
			}else{
				self.setVisible(false);
				self.setAlpha(0);
			}
			self.isShowed_bl = false;
		};
		
		this.onHideComplete = function(){
			self.setVisible(false);
			self.stopPreloader();
			self.dispatchEvent(FWDISPSlideshowPreloader.HIDE_COMPLETE);
		};
		
		this.init();
	};
	
	/* set prototype */
    FWDISPSlideshowPreloader.setPrototype = function(){
    	FWDISPSlideshowPreloader.prototype = new FWDISPDisplayObject("div");
    };
    
    FWDISPSlideshowPreloader.HIDE_COMPLETE = "hideComplete";
    
    FWDISPSlideshowPreloader.prototype = null;
	window.FWDISPSlideshowPreloader = FWDISPSlideshowPreloader;
}(window));/* thumb */
(function(window){
	
	var FWDISPThumb = function(
			parent,
			imageW,
			imageH,
			imageBorderSize,
			imageBorderRadius,
			backgroundColor,
			imageBorderColor,
			overlayColor_str,
			link,
			target
		){
		
		var self = this;
		var prototype = FWDISPThumb.prototype;

		
		this.background_do = null;
		this.image_do = null;
		this.overlay_do = null;
		this.borderColor_str = imageBorderColor;
		this.backgroundColor = backgroundColor;
		this.link = link;
		this.target = target;
		this.borderSize = imageBorderSize || 0;
		this.overlayColor_str = overlayColor_str;
		this.borderRadius = imageBorderRadius;
		this.imageW = imageW;
		this.imageH = imageH;
		this.finalX = -1;
		this.finalY = -1;
		this.transitionDuration = 800;
		this.transitionType_str = Expo.easeInOut;
	
		this.showFirstTime_bl = true;
		this.isSelected_bl = false;
		this.isDisabled_bl = false;
		this.hasPointerEvent_bl = FWDISPUtils.hasPointerEvent;
		this.isMobile_bl = FWDISPUtils.isMobile;
		
	
		/* init */
		self.init = function(){
			self.setOverflow("visible");
			//self.setButtonMode(true);
			self.setupScreen();
			self.addLinkSupport();
			
		};
		
		/* setup screen */
		self.setupScreen = function(){			
			self.background_do = new FWDISPDisplayObject("div");
			self.background_do.screen.className = 'image-background';
			//self.background_do.getStyle().color = "#FFFFFF";
			//self.background_do.setInnerHTML(self.id);
			//self.background_do.getStyle().fontSize = "30px"
			
			if(self.borderRadius) self.getStyle().borderRadius = self.borderRadius + "px";
			if(self.borderRadius) self.getStyle().borderRadius = self.borderRadius + "px";
			
			if(self.borderSize){
				self.background_do.setX(self.borderSize);
				self.background_do.setY(self.borderSize);
				self.border_do = new FWDISPDisplayObject("div");
				self.border_do.getStyle().backgroundColor = self.borderColor_str;
				self.addChild(self.border_do);
			}
			
			self.background_do.getStyle().backgroundColor = self.backgroundColor;
			self.addChild(self.background_do);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerUp", self.onMouseClickHandler);
				}
				self.screen.addEventListener("click", self.onMouseClickHandler);
			}else if(self.screen.addEventListener){
				self.screen.addEventListener("mouseover", self.onMouseOverHandler);
				self.screen.addEventListener("click", self.onMouseClickHandler);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOverHandler);
				self.screen.attachEvent("onclick", self.onMouseClickHandler);
			}
		};
		
		
		//#########################################//
		/* Resize and position */
		//#########################################//
		this.resizeImg = function(animate){		

			FWDAnimation.killTweensOf(self);
			FWDAnimation.killTweensOf(self.background_do);
			if(self.border_do) FWDAnimation.killTweensOf(self.border_do);
		

			self.setAlpha(self.finalAlpha);
			self.setX(self.finalX);
			if(parent.displayType == FWDISP.AFTER_PARENT){
				self.setY(0);
			}else{
				self.setY(self.finalY);
			}
			self.setWidth(self.finalW);
			self.setHeight(self.finalH);
			if(self.background_do){
				self.background_do.setWidth(self.finalW - (self.borderSize * 2));
				self.background_do.setHeight(self.finalH - (self.borderSize * 2));
			}
			if(self.border_do){
				self.border_do.setWidth(self.finalW );
				self.border_do.setHeight(self.finalH);
			}

			if(self.overlay_do){
				var overlayAlpha = 0;
				if(self.id != parent.curId) overlayAlpha = 1;
				self.overlay_do.setAlpha(overlayAlpha);
				self.overlay_do.setX(self.borderSize);
				self.overlay_do.setY(self.borderSize);
				self.overlay_do.setWidth(self.finalW - self.borderSize * 2);
				self.overlay_do.setHeight(self.finalH - self.borderSize * 2);
			}
			
			if(self.prevW != self.finalW  && self.image_do ){
				FWDAnimation.killTweensOf(self.image_do);
				FWDAnimation.killTweensOf(self.imageHolder_do);
				
				self.imageHolder_do.setX(self.borderSize);
				self.imageHolder_do.setY(self.borderSize);
				self.imageHolder_do.setWidth(self.finalW - self.borderSize * 2);
				self.imageHolder_do.setHeight(self.finalH - self.borderSize * 2);
				
				if(parent.displayType == FWDISP.AFTER_PARENT){

					self.image_do.setX((parent.stageWidth - self.imageFinalW)/2);
					self.image_do.setY((parent.stageHeight - self.imageFinalH)/2);
					self.image_do.setWidth(self.imageFinalW - self.borderSize * 2);
					self.image_do.setHeight(self.imageFinalH - self.borderSize * 2);
				}else{
					self.image_do.setX(0);
					self.image_do.setY(0);
					self.image_do.setWidth(self.finalW - self.borderSize * 2);
					self.image_do.setHeight(self.finalH - self.borderSize * 2);
				}
				
			}
			self.prevW = self.finalW;
			self.prevH = self.finalH;
		}

		this.addLinkSupport = function(){
			
			self.screen.addEventListener("click", function(e){
				if(!self.allowToOpenLink_bl || self.id != parent.curId) return;
				var viewportMouseCoordinates = FWDISPUtils.getViewportMouseCoordinates(e);	
				if(FWDISPUtils.hitTest(self.imageHolder_do.screen, viewportMouseCoordinates.screenX, viewportMouseCoordinates.screenY)){
					window.open(self.link, self.target);
				}
			});
		}
		
		//######################################//
		/* add image */
		//######################################//
		self.setImage = function(image){
			
			self.imageHolder_do = new FWDISPDisplayObject("div");
			
			self.image_do = new FWDISPDisplayObject("img");
			self.image_do.setScreen(image);

			self.imageHolder_do.addChild(self.image_do);
			self.addChild(self.imageHolder_do);
		
			
			if(parent.displayType == FWDISP.AFTER_PARENT){
				self.imageHolder_do.setX(parent.stageWidth/2);
				self.imageHolder_do.setY(parent.stageHeight/2);
				self.image_do.setX(-self.imageFinalW /2 + self.borderSize);
				self.image_do.setY(-self.imageFinalH /2 + self.borderSize);
				self.image_do.setWidth(self.imageFinalW - self.borderSize * 2);
				self.image_do.setHeight(self.imageFinalH - self.borderSize * 2);
				FWDAnimation.to(self.image_do, .8, {x:(parent.stageWidth - self.imageFinalW)/2, y:(parent.stageHeight - self.imageFinalH)/2,  ease:Expo.easeInOut});
				FWDAnimation.to(self.imageHolder_do, .8, {x:self.borderSize, y:self.borderSize, w:parent.stageWidth - self.borderSize * 2, h:parent.stageHeight - self.borderSize * 2,   ease:Expo.easeInOut});
			}else{
	
				self.imageHolder_do.setX(self.finalW/2);
				self.imageHolder_do.setY(self.finalH/2);
				self.image_do.setX(-self.finalW /2 + self.borderSize);
				self.image_do.setY(-self.finalH /2 + self.borderSize);
				self.image_do.setWidth(self.finalW - self.borderSize * 2);
				self.image_do.setHeight(self.finalH - self.borderSize * 2);
				FWDAnimation.to(self.image_do, .8, {x:0, y:0,  ease:Expo.easeInOut});
				FWDAnimation.to(self.imageHolder_do, .8, {x:self.borderSize, y:self.borderSize, w:self.finalW - self.borderSize * 2, h:self.finalH - self.borderSize * 2,   ease:Expo.easeInOut});
			}

			if(self.overlayColor_str && self.overlayColor_str.length > 1) self.setupOverlay();
		};
		
	
		this.setupOverlay = function(){
			self.overlay_do = new FWDISPDisplayObject("div");
			if(self.overlayColor_str.indexOf("jpg") != -1 || self.overlayColor_str.indexOf("jpeg") != -1 || self.overlayColor_str.indexOf("png") != -1){
				self.overlay_do.getStyle().background = "url('" + self.overlayColor_str + "') repeat";
			}else{
				self.overlay_do.setBkColor(this.overlayColor_str);
			}
			
		
			self.overlay_do.setX(self.borderSize);
			self.overlay_do.setY(self.borderSize);
			self.overlay_do.setWidth(self.finalW - self.borderSize * 2);
			self.overlay_do.setHeight(self.finalH - self.borderSize * 2);
			if(self.id == parent.curId) self.overlay_do.setAlpha(0);
					
			self.addChild(self.overlay_do);
			
			self.overlay_do.setAlpha(0);
			if(self.id != parent.curId) FWDAnimation.to(self.overlay_do, .8, {alpha:1, delay:.1});
		
		}
		
		self.onMouseOverHandler = function(e){
			self.dispatchEvent(FWDISPThumb.HOVER);
			if(self.isDisabled_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.setSelectedState(true);
			}
			self.startToCheckTest();
		};
		
		self.startToCheckTest = function(){
			if(window.addEventListener){
				window.addEventListener("mousemove", self.checkHitTest);
			}else if(document.attachEvent){
				document.detachEvent("onmousemove", self.checkHitTest);
				document.attachEvent("onmousemove", self.checkHitTest);
			}
		};
		
		self.stopToCheckTest = function(){
			if(window.removeEventListener){
				window.removeEventListener("mousemove", self.checkHitTest);
			}else if(document.detachEvent){
				document.detachEvent("onmousemove", self.checkHitTest);
			}
		};
		
		self.checkHitTest = function(e){
			var wc = FWDISPUtils.getViewportMouseCoordinates(e);
			
			if(!FWDISPUtils.hitTest(self.screen, wc.screenX, wc.screenY)){
				self.onMouseOutHandler(e);
				self.stopToCheckTest();
			}
		};

		self.onMouseOutHandler = function(e){
			if(self.isDisabled_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.setNormalState(true);
			}
		};
	
		self.onMouseClickHandler = function(e){
			if(self.isDisabled_bl || parent.disableThumbClick) return;
			self.dispatchEvent(FWDISPThumb.CLICK, {id:self.id});
		};
		
		//#########################################//
		/* Set normal/selected display states */
		//########################################//
		self.setNormalState = function(animate){
			if(!self.isSelected_bl || self.id == parent.curId) return;
			self.isSelected_bl = false;
			if(self.overlay_do) FWDAnimation.to(self.overlay_do, .8, {alpha:1, ease:Expo.easeOut});
		};

		self.setSelectedState = function(animate){
			if(self.isSelected_bl || self.id == parent.curId) return;
			self.isSelected_bl = true;
			if(self.overlay_do) FWDAnimation.to(self.overlay_do, .8, {alpha:0, ease:Expo.easeOut});
		};

		//########################################//
		/* show/hide thumb */
		//########################################//
		self.show = function(animate){
			FWDAnimation.killTweensOf(self);
			if(animate){
				FWDAnimation.to(self, self.transitionDuration, {y:0, ease:self.transitionType_str});
			}else{
				self.setY(0);
			}
		};
		
		self.hide = function(animate){	
			FWDAnimation.killTweensOf(self);
			if(animate){
				FWDAnimation.to(self, self.transitionDuration, {y:self.imageOffsetBottom + self.imageH + 2});
			}else{
				self.setY(self.imageOffsetBottom + self.imageH + 2);
			}
		};
		
		self.init();
	};

	/* set prototype */
	FWDISPThumb.setPrototype = function(){
		FWDISPThumb.prototype = new FWDISPDisplayObject("div");
	};
	
	FWDISPThumb.HOVER =  "onHover";
	FWDISPThumb.CLICK =  "onClick";
	
	
	FWDISPThumb.IFRAME = "iframe";
	FWDISPThumb.IMAGE = "image";
	FWDISPThumb.FLASH = "flash";
	FWDISPThumb.AUDIO = "audio";
	FWDISPThumb.VIDEO = "video";
	FWDISPThumb.VIMEO= "vimeo";
	FWDISPThumb.YOUTUBE = "youtube";
	FWDISPThumb.MAPS = "maps";
	FWDISPThumb.AJAX = "ajax";
	FWDISPThumb.HTML = "html";
	
	FWDISPThumb.prototype = null;
	window.FWDISPThumb = FWDISPThumb;
}(window));﻿//FWDISPUtils
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