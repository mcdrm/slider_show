(function (window){
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
			
			if(self.main_do.getRect().top >= -self.stageHeight && self.main_do.getRect().top + 150 < self.ws.h){
				window.removeEventListener("scroll", self.onInitlalizeScrollHandler);
				setTimeout(self.setupSlider, 200);
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
	
}(window));/* Context menu */