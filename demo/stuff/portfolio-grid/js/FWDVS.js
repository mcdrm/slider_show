/* Gallery */
(function (window){
	'use strict';
	var FWDVS = function(props_obj){
		
		var self = this;
	
		/* init gallery */
		this.init = function(){
			
			var test;
			FWDTweenLite.ticker.useRAF(true);
			this.props_obj = props_obj;
			this.listeners = {events_ar:[]};
			
			this.mustHaveHolderDiv_bl = false;
			this.instanceName_str = this.props_obj.instanceName;
			
			if(!self.props_obj.gridType){
				alert("FWDVS grid type is required please make sure that the gridType parameter is defined in the contructor function!");
				return;
			}
			
			self.gridType_str = self.props_obj.gridType || "classic";
			self.gridType_str = String(self.gridType_str).toLowerCase();
			
			if(!this.props_obj.instanceName){
				alert("FWDVS instance name is required please make sure that the instanceName parameter exsists and it's value is uinique.");
				return;
			}
			
			if(window[this.instanceName_str]){
				alert("FWDVS instance name " + this.instanceName_str +  " is already defined and contains a different instance reference, set a different instance name.");
				return;
			}else{
				window[this.instanceName_str] = this;
			}
		
			if(!this.props_obj){
				alert("FWDVS constructor properties object is not defined!");
				return;
			}
			
			if(!this.props_obj.parentId && this.mustHaveHolderDiv_bl){		
				alert("Property parentId is not defined in the FWDVS constructor, self property represents the div id into which the megazoom is added as a child!");
				return;
			}
			
			if(this.mustHaveHolderDiv_bl && !FWDVSUtils.getChildById(self.props_obj.parentId)){
				alert("FWDVS parent div is not found, please make sure that the div exsists and the id is correct! " + self.props_obj.parentId);
				return;
			}
			
			this.displayType = this.props_obj.displayType || FWDVS.RESPONSIVE;
			this.displayType = this.displayType.toLowerCase();
			
			if(self.displayType.toLowerCase() != FWDVS.RESPONSIVE 
			   && self.displayType.toLowerCase() != FWDVS.FULL_SCREEN
			   && self.displayType.toLowerCase() != FWDVS.FLUID_WIDTH
			   && self.displayType.toLowerCase() != FWDVS.AFTER_PARENT){
				this.displayType = FWDVS.RESPONSIVE;
			}
		
			this.body = document.getElementsByTagName("body")[0];
			if(this.displayType == FWDVS.FULL_SCREEN){
				this.stageContainer = self.body;
			}else{	
				this.stageContainer = FWDVSUtils.getChildById(this.props_obj.parentId);
			}

			this.customContextMenu;
			this.info_do;
			this.main_do;
			this.preloader_do;
			this.menu_do;
			this.thumbnailManager_do;
			this.lighBox_do;
			this.rect;

			this.backgroundColor = this.props_obj.backgroundColor || "transparent";
			this.slideshowRadius = this.props_obj.slideshowRadius || 10;
			this.slideshowBackgroundColor = this.props_obj.slideshowBackgroundColor || "#FFFFFF";
			this.slideshowFillColor = this.props_obj.slideshowFillColor || "#000000";
			this.slideshowStrokeSize = this.props_obj.slideshowStrokeSize || 3
			
			this.zIndex = parseInt(props_obj.zIndex) || 0;
			this.stageWidth = 0;
			this.stageHeight = 0;
			this.pageXOffset = window.pageXOffset;
			this.pageYOffset = window.pageYOffset;
			this.catId_ar = -1;
			this.maxWidth = this.props_obj.maxWidth || 640;
			this.maxHeight = this.props_obj.maxHeight || 380;
			this.thumbnailsVOffset = this.props_obj.thumbnailsVerticalOffset || 0; 
			this.searchIconW = 0;
			
			this.resizeHandlerId1_to;
			this.resizeHandlerId2_to;
			this.scrollEndId_to;
			this.orientationChangeId_to;
			
			this.isVerticalType_bl = true;
			this.isDataLoaded_bl = false;
			this.autoScale_bl = this.props_obj.autoScale == "yes" ? true : false;
			this.animate_bl = this.props_obj.animateParent == "yes" ? true : false;
			
			this.showFullScreenButton_bl = this.props_obj.showFullScreenButton == "yes" ? true : false;
			this.orintationChanceComplete_bl = true;
			this.isMobile_bl = FWDVSUtils.isMobile;
	    	this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent;
	    	this.isReady_bl = false;

	    	self.initializeOnlyWhenVisible_bl = self.props_obj.initializeOnlyWhenVisible; 
			self.initializeOnlyWhenVisible_bl = self.initializeOnlyWhenVisible_bl == "yes" ? true : false;
			this.setupMainDo();
			this.startResizeHandler();

	    	if(self.initializeOnlyWhenVisible_bl){
				window.addEventListener("scroll", self.onInitlalizeScrollHandler);
				setTimeout(self.onInitlalizeScrollHandler, 500);
			}else{
				self.setupGrid();
			}
		};

		self.onInitlalizeScrollHandler = function(){
			if(!self.viewportSize) return;
			var scrollOffsets = FWDVSUtils.getScrollOffsets();
			self.pageXOffset = scrollOffsets.x;
			self.pageYOffset = scrollOffsets.y;
			if(self.main_do.getRect().top >= -self.stageHeight && self.main_do.getRect().top < self.viewportSize.h){
				window.removeEventListener("scroll", self.onInitlalizeScrollHandler);
				self.setupGrid();
			}
		};
		
		this.setupGrid = function(){
			if(self.isInitialized) return;
			self.isInitialized = true;
			this.setupData();	
			this.setupInfo();
		}
		
		//#############################################//
		/* setup main do */
		//#############################################//
		this.setupMainDo = function(){
			this.main_do = new FWDVSDisplayObject("div", "relative");
			this.main_do.screen.className = 'main';
			this.main_do.setOverflow("visible");
			
			this.main_do.getStyle().webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
			this.main_do.getStyle().webkitFocusRingColor = "rgba(0, 0, 0, 0)";
			this.main_do.getStyle().width = "100%";
			this.main_do.getStyle().height = "100%";
			if(!FWDVSUtils.isMobile || (FWDVSUtils.isMobile && FWDVSUtils.hasPointerEvent)) this.main_do.setSelectable(false);
			
			if(self.gridType_str == "dynamichorizontal" 
			|| self.gridType_str == "classichorizontal"
			|| self.gridType_str == "masonryhorizontal"
			|| self.gridType_str == "flexiblehorizontal"){
				this.main_do.getStyle().msTouchAction = "none";
				
				if(this.displayType == FWDVS.FULL_SCREEN || this.displayType == FWDVS.FLUID_WIDTH){	
					this.main_do.getStyle().position = "absolute";
					this.stageContainer.appendChild(this.main_do.screen);
					this.main_do.getStyle().zIndex = self.zIndex;
				}else{
					this.stageContainer.appendChild(this.main_do.screen);
				}		
			}else{
				this.stageContainer.appendChild(this.main_do.screen);
			}
			
			this.stageContainer.style.overflow = "visible";
			this.startResizeHandler();
		};
		
		//#############################################//
		/* setup info_do */
		//#############################################//
		this.setupInfo = function(){
			FWDVSInfo.setPrototype();
			this.info_do = new FWDVSInfo(self, self.data.warningIconPath_str);
		};	
		
		//#############################################//
		/* resize handler */
		//#############################################//
		this.startResizeHandler = function(){
			if(window.addEventListener){
				window.addEventListener("resize", self.onResizeHandler);
				window.addEventListener("scroll", self.onScrollHandler);
			}else if(window.attachEvent){
				window.attachEvent("onresize", self.onResizeHandler);
				window.attachEvent("onscroll", self.onScrollHandler);
			}
			
			
			self.resizeHandler();
			self.resizeHandlerId2_to = setTimeout(function(){
				self.resizeHandler();
			}, 400);
		};
		
		this.onResizeHandler = function(e){
			clearTimeout(self.resizeHandlerId2_to);
			self.resizeHandlerId2_to = setTimeout(function(){self.resizeHandler();}, 100);
			//self.resizeHandler();
		};
		
		self.onScrollHandler = function(e){
			self.scrollOffsets = FWDVSUtils.getScrollOffsets();
			if(self.thumbnailManager_do) FWDVS.globalY = self.thumbnailManager_do.getGlobalY();
		};
		
		this.resizeHandler = function(){
			
			self.scrollOffsets = FWDVSUtils.getScrollOffsets();
			var viewportSize = FWDVSUtils.getViewportSize();
			self.viewportSize = viewportSize;
			var scale;
			var offsetStageHeight = 0;
		
			FWDVS.viewportHeight = viewportSize.h;
			
			self.pageXOffset = self.scrollOffsets.x;
			self.pageYOffset = self.scrollOffsets.y;
			self.stageWidth = self.stageContainer.offsetWidth;
		
			if(self.menu_do){
				if(self.menu_do.isShowed_bl){
					self.menu_do.resizeAndPosition(self.stageWidth);
				}else{
					self.menu_do.setHeight(0);
				}
			}
			self.positionPreloader();
			
			if(self.thumbnailManager_do) self.thumbnailManager_do.resizeAndPosition();
			
			if(self.fullScreenButton_do) self.positionFullScreenButton();
		};
		
		this.setFinalSize = function(){
			
			if(!self.isReady_bl){
				self.stageHeight = 84;
			}

			self.main_do.setHeight(self.stageHeight);
			
			if(self.thumbnailManager_do){
				self.stageHeight = self.thumbnailManager_do.totalHeight;
			}

			if(self.main_do && self.prevStageHeight != self.stageHeight){
				self.main_do.setWidth(self.stageWidth);
			}
			self.main_do.setOverflow("visible");
			if(self.menu_do){
				self.menu_do.resizeSelector();
			}

			self.stageContainer.style.height = self.stageHeight + 'px';
			
			self.prevStageHeight = self.stageHeight;
			self.resizeSearch();
			self.dispatchEvent(FWDVS.RESIZE);
		};
		
		
		
		//#############################################//
		/* setup context menu */
		//#############################################//
		this.setupContextMenu = function(){
			this.customContextMenu_do = new FWDVSContextMenu(this.main_do, self.data.rightClickContextMenu_str);
		};
		
		//#############################################//
		/* setup data */
		//#############################################//
		this.setupData = function(){
			FWDVSData.setPrototype();
			this.data = new FWDVSData(this.props_obj, this);
			this.data.addListener(FWDVSData.PRELOADER_LOAD_DONE, this.onPreloaderLoadDone);
			this.data.addListener(FWDVSData.LIGHBOX_CLOSE_BUTTON_LOADED, this.onLightBoxCloseButtonLoadDone);
			this.data.addListener(FWDVSData.LOAD_ERROR, this.dataLoadError);
			this.data.addListener(FWDVSData.LOAD_DONE, this.dataLoadComplete);
		};
		
		this.onLightBoxCloseButtonLoadDone = function(){
			
		};
		
		this.onPreloaderLoadDone = function(){
			self.setupPreloader();
			self.positionPreloader();
			self.resizeHandler();
		};
		
		this.dataLoadError = function(e, text){
			self.main_do.addChild(self.info_do);
			self.info_do.showText(e.text);
		};
		
		this.dataLoadComplete = function(e){
			
			self.isReady_bl = true;
			self.main_do.getStyle().height = "100%";
			self.catId_ar = self.data.startAtCategory;
		
			//self.updateCategory(self.data.startAtCategory, true);
			
			
			if(!self.isMobile_bl) self.setupContextMenu();
			self.setupThumbanilsManager();
			if(self.data.showMenu_bl) self.setupMenu();
			self.setupSeach();
			if(self.showFullScreenButton_bl) self.setupFullScreenButton();
			
			self.isDataLoaded_bl = true;
			self.resizeHandler();
			
			setTimeout(function(){
				self.preloader_do.hide(true);
			}, 500);
			self.main_do.addChild(self.preloader_do);
			setTimeout(self.resizeHandler, 200);
			self.dispatchEvent(FWDVS.READY);
		};
		
		//#############################################//
		/* setup preloader */
		//#############################################//
		this.setupPreloader = function(){
			FWDVSPreloader.setPrototype();
			self.preloader_do = new FWDVSPreloader(
				self,
				"center",
				self.slideshowRadius, 
				self.slideshowBackgroundColor, 
				self.slideshowFillColor, 
				self.slideshowStrokeSize, 
				1,
				self.data.prelaoderAllScreen_bl);
			this.preloader_do.startPreloader();
			this.preloader_do.show(true);
			this.main_do.addChild(this.preloader_do);
		};
		
		this.positionPreloader = function(){
			if(this.preloader_do){
				this.preloader_do.positionAndResize();
			}
		};
		
		this.onPreloaderHideCompleteHandler = function(){
			self.main_do.removeChild(self.preloader_do);
		};

		//###########################################//
		/* Setup search */
		//###########################################//
		this.setupSeach = function(){
			//if(!self.data.showSearch_bl) return;
			this.searchMain_do = new FWDVSDisplayObject('div');
			var str = '<span class="fwdicon search fwdfwdicon-search"></span>';
			this.searchMain_do.setInnerHTML(str);
			this.searchMain_do.hasTransform3d_bl =  false;
			this.searchMain_do.hasTransform2d_bl =  false;
			self.searchMain_do.screen.className = 'p-wrapper fwd-hide';

			self.text_str = self.data.searchLabel;
			this.text_do = new FWDVSDisplayObject('input');
			this.text_do.setOverflow("visible");
			this.text_do.setDisplay("inline-block");
			this.text_do.getStyle().whiteSpace = "nowrap";
			this.text_do.setBackfaceVisibility();
			self.text_do.setAlpha(0);
			self.text_do.screen.value = self.text_str;
			this.text_do.hasTransform3d_bl =  false;
			this.text_do.hasTransform2d_bl =  false;
			self.text_do.setVisible(false);
			self.text_do.screen.className = 'p-search';
			this.main_do.addChild(self.searchMain_do);
			this.searchMain_do.addChild(self.text_do);

			self.text_do.screen.addEventListener("focus", self.inputFocusInHandler);
			self.text_do.screen.addEventListener("blur", self.inputFocusOutHandler);
			self.text_do.screen.addEventListener("keyup", self.keyUpHandler);

			if(self.isMobile_bl){
				//self.searchMain_do.screen.firstChild.addEventListener('touchstart', self.openSearch);
				//window.addEventListener('touchstart', self.hideSearchOnMouseUp);
			}else{
				//self.searchMain_do.screen.firstChild.addEventListener('mousedown', self.openSearch);
				//self.searchMain_do.screen.addEventListener('mouseover', self.openSearchOnHover);
			}
		}

		this.openSearchOnHover = function(e){

			if(!self.isSearchShowed) return;
			self.isSearchShowed = true;
			clearTimeout(self.hideWithDelayId_to);
		
			window.addEventListener('mousemove', self.checkSearchOnMove);
			window.addEventListener('mouseup', self.hideSearchOnMouseUp);
		}

		this.hideSearchOnMouseUp =  function(e){
			self.checkSearchOnMove(e, true);
		}
			
		this.openSearch = function(e){
			return;
			if(self.text_do.screen.value.length != 0 && self.text_do.screen.value != self.text_str) return;
			if(!self.searchIconW){
				self.searchIconW = self.searchMain_do.getWidth();
			}
		
			self.curSearchX = self.searchMain_do.x;
			clearTimeout(self.hideWithDelayId_to);
			if(!self.isSearchShowed){
				self.isSearchShowed = true;
				self.text_do.setVisible(true);
				if(self.menu_do){
					FWDAnimation.to(self.searchMain_do.screen, .8, {className:'p-wrapper showed', 'transform':'translateX(' + -self.text_do.getWidth() +'px)', width:((self.text_do.getWidth() + self.searchIconW) + 'px'), onComplete:function(){
						self.searchMain_do.screen.style.transform = 'translateX(' + -self.text_do.getWidth() +'px)'
					}, ease:Expo.easeInOut});
				}else{
					FWDAnimation.to(self.searchMain_do.screen, .8, {className:'p-wrapper showed', width:((self.text_do.getWidth() + self.searchIconW) + 'px'), ease:Expo.easeInOut});
				}
				FWDAnimation.to(self.text_do.screen, .8, {alpha:1});

				
				if(self.isMobile_bl){
					window.addEventListener('touchstart', self.checkSearchOnMove);
				}else{
					window.addEventListener('mousemove', self.checkSearchOnMove);
				}
			}else{
				self.isSearchShowed = false;
				self.hideSearch(e, true);
			}
		}

		this.removeCheckSearchEvents = function(){
			return;
			if(self.isMobile_bl){
				window.removeEventListener('touchstart', self.checkSearchOnMove);
			}else{
				window.removeEventListener('mousemove', self.checkSearchOnMove);
			}
			
		}

		this.checkSearchOnMove = function(e, noDelay){
			if(self.text_do.screen.value.length != 0 && self.text_do.screen.value != self.text_str) return;
			var delay = 2000;
			if(noDelay) delay = 0;
			
			var vc = FWDVSUtils.getViewportMouseCoordinates(e);	
			if(!FWDVSUtils.hitTest(self.searchMain_do.screen, vc.screenX, vc.screenY)){
				clearTimeout(self.hideWithDelayId_to);
				self.removeCheckSearchEvents();
				self.hideWithDelayId_to = setTimeout(function(){
					self.hideSearch(e, true);
				}, delay);
			}
		}

		this.hideSearch = function(e, overwrite){
			if(self.text_do.screen.value.length != 0 && self.text_do.screen.value != self.text_str) return;
			clearTimeout(self.hideWithDelayId_to);
			var vc = FWDVSUtils.getViewportMouseCoordinates(e);	
			if(!FWDVSUtils.hitTest(self.searchMain_do.screen, vc.screenX, vc.screenY) || overwrite){
				self.removeCheckSearchEvents();
				FWDAnimation.to(self.searchMain_do.screen, .8, {className:'p-wrapper', 'transform':'translateX(0)', width:self.searchIconW, ease:Expo.easeInOut});
				FWDAnimation.to(self.text_do.screen, .8, {alpha:0, onComplete:function(){self.text_do.setVisible(false)}});
				$ = jQuery;
				if($('.vm-logo').length){
					FWDAnimation.to($('.vm-logo .has-logo')[0], .6, {alpha:1});
				}
			}
			self.isSearchShowed = false;
		}

		this.inputFocusInHandler = function(){
			if(self.hasInputFocus_bl) return;
			self.hasInputFocus_bl = true;
			if(self.text_do.screen.value == self.text_str){
				self.text_do.screen.value = "";
			}
		};
		
		this.inputFocusOutHandler = function(e){
			if(!self.hasInputFocus_bl) return;
			var vc = FWDVSUtils.getViewportMouseCoordinates(e);	
			if(!FWDVSUtils.hitTest(self.text_do.screen, vc.screenX, vc.screenY)){
				self.hasInputFocus_bl = false;
				if(self.text_do.screen.value == ""){
					self.text_do.screen.value = self.text_str;
				}
				return;
			}
		};
		
		this.keyUpHandler = function(e){
			
			if(e.stopPropagation) e.stopPropagation();
			var inputValue;
			
			if (self.prevInputValue_str != self.text_do.screen.value){
				inputValue = self.text_do.screen.value.toLowerCase();
				if (inputValue != self.text_str){
					self.searchValue = inputValue;
					clearTimeout(self.updateSearch_to);
					self.updateSearch_to = setTimeout(function(){
						self.thumbnailManager_do.search(self.searchValue.toLowerCase());
					}, 100);
				}
			}
			
			self.prevInputValue_str = self.text_do.screen.value;
		};

		this.resizeSearch = function(){
			self.searchMain_do.setWidth(self.menu_do.getWidth())
		}
		
		//###########################################//
		/* Setup menu buttons */
		//###########################################//
		this.setupMenu = function(){
			FWDVSMenu.setPrototype();
			this.menu_do = new FWDVSMenu(self.data, self);
			this.menu_do.addListener(FWDVSMenu.MOUSE_UP, this.menuOnMouseUpHandler);
			//this.menu_do.disableCurrentButton(this.catId_ar);
			this.main_do.addChild(this.menu_do);
			this.menu_do.addListener(FWDVSMenu.SEARCH, this.searchHandler);
		};
		
		this.menuOnMouseUpHandler =  function(e){
			self.updateCategory(e.id);
		};
		
		this.searchHandler = function(e){
			self.thumbnailManager_do.search(e.searchValue);
		};
		
		//###########################################//
		/* setup thumbs manager */
		//###########################################//
		this.setupThumbanilsManager = function(id){	
			
			self.data.isVerticalType_bl = true;
			FWDVSClassicVerticalThumbnailsManager.setPrototype();
			this.thumbnailManager_do = new FWDVSClassicVerticalThumbnailsManager(this.data, this);
			this.thumbnailManager_do.addListener(FWDVSClassicVerticalThumbnailsManager.CATEGORY_UPDATE, this.onTMCategoryUpdate);
			this.thumbnailManager_do.addListener(FWDVSClassicVerticalThumbnailsManager.OPEN_LIGHTBOX, this.openLightbox);
			
			this.main_do.addChild(this.thumbnailManager_do);
			FWDVS.globalY = self.thumbnailManager_do.getGlobalY();
			
		};
		
		this.onThumbsManagerLoadError = function(e){
			self.main_do.addChild(self.info_do);
			self.info_do.showText(e.text);
		};
		
		this.onTMCategoryUpdate = function(e){
			//if(self.menu_do) self.menu_do.disableCurrentButton(self.catId_ar);
		};
		
		this.openLightbox = function(e){
	
			window.open(self.data.parsedPlaylist_ar[e.id]['url'], "_blank");
		
		};
	
		
		//########################################//
		/* Event dispatcher */
		//########################################//
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
		    		
			
			this.disableMoveOnFullScreen = function(e){
				window.addEventListener("touchmove", self.onDisableMove);
			};
			
			this.removeDisableMoveOnFullScreen = function(e){
				window.removeEventListener("touchmove", self.onDisableMove);
			};
			
			this.onDisableMove = function(e){
				e.preventDefault();
			};
		    
		    //###########################################//
		    /* API */
		    //###########################################//
		    this.updateCategory = function(id_ar){
				if(!this.isReady_bl) return;
				
				this.catId_ar = id_ar;
				
				self.thumbnailManager_do.updateCategory(this.catId_ar);
				self.resizeHandler();
				
				setTimeout(function(){self.dispatchEvent(FWDVS.CATEGORY_UPDATE);}, 50);
			};
			
			this.getCategoryName = function(id){
				if(!this.isReady_bl) return;
				return this.data.categories_ar;
			};
			
			this.getCategoryId = function(){
				return this.catId_ar;
			};
			
		    this.updateSize = function(){
		    	if(!self.isReady_bl);
		    	self.resizeHandler();
		    };
		
		this.init();
	};
	
	
	FWDVS.RESIZE = 'resize';
	FWDVS.READY = "ready";
	FWDVS.LIGHTBOX_SHOW_START = "showStart";
	FWDVS.LIGHTBOX_SHOW_COMPLETE = "showComplete";
	FWDVS.LIGHTBOX_HIDE_START = "hideStart";
	FWDVS.LIGHTBOX_HIDE_COMPLETE = "hideComplete";
	FWDVS.CATEGORY_UPDATE = "categoryUpdate";
	FWDVS.FULL_SCREEN = "fullscreen";
	FWDVS.LIGHTBOX = "lightbox";
	FWDVS.RESPONSIVE = "responsive";
	FWDVS.FLUID_WIDTH = "fluidwidth";
	FWDVS.AFTER_PARENT = "afterparent";
	FWDVS.IFRAME = "iframe";
	FWDVS.IMAGE = "image";
	FWDVS.FLASH = "flash";
	FWDVS.AUDIO = "audio";
	FWDVS.VIDEO = "video";
	FWDVS.VIMEO = "vimeo";
	FWDVS.YOUTUBE = "youtube";
	FWDVS.MAPS = "maps";
	FWDVS.LINK = "link";
	FWDVS.NONE = "none";
	
	window.FWDVS = FWDVS;
	
}(window));