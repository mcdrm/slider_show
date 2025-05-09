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
	
}(window));/* FWDVSArrow */
(function (window){
	
	var FWDVSArrow = function(
			parent,
			normalClass,
			selectedClass
	   ){
		
		var self = this;
		var prototype = FWDVSArrow.prototype;
	
		this.isDisabled_bl = false;
		this.isSelected_bl = false;
		this.isMobile_bl = FWDVSUtils.isMobile;
		this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent;

	
		this.init = function(){
			this.setOverflow("visible");
			
			this.setupDos();
			this.setNormalState(false);
			this.addEvents();
			self.setButtonMode(true);
		};
		
		//#######################################//
		/* Setup screens */
		//#######################################//
		this.setupDos = function(){
			
			this.arrow_do = new FWDVSTransformDisplayObject("div");
			this.arrow_do.setOverflow("visible");
			this.arrow_do.setDisplay("inline-block");
			this.arrow_do.getStyle().fontSmoothing = "antialiased";
			this.arrow_do.getStyle().webkitFontSmoothing = "antialiased";
			this.arrow_do.getStyle().textRendering = "optimizeLegibility";
			this.arrow_do.getStyle().whiteSpace = "nowrap";
			this.arrow_do.setBackfaceVisibility();
			this.arrow_do.getStyle().padding = "";
			this.arrow_do.getStyle().margin = "";
			this.arrow_do.getStyle().borderRight = "1px solid";
			this.arrow_do.getStyle().borderBottom = "1px solid";
			this.arrow_do.getStyle().top = 0;
			this.arrow_do.getStyle().left = 0;
			this.arrow_do.setWidth(13);
			this.arrow_do.setHeight(13);
			self.arrow_do.screen.className = 'arrow-mobile-i arrow-mobile-normal-i';

			
			self.arrow_do.setRotation(45);

			this.addChild(this.arrow_do);
		    this.setSize();
		};

		
		//#######################################//
		/* Add events */
		//#######################################//
		this.addEvents = function(){
			
			if(self.isMobile_bl){
				if(this.hasPointerEvent_bl){
					this.screen.addEventListener("pointerup", this.onMouseUp);
					this.screen.addEventListener("pointerover", this.onMouseOver);
					this.screen.addEventListener("pointerout", this.onMouseOut);
				}else{
					this.screen.addEventListener("click", this.onMouseUp);
				}
			}else if(this.screen.addEventListener){	
				this.screen.addEventListener("mouseover", this.onMouseOver);
				this.screen.addEventListener("mouseout", this.onMouseOut);
				this.screen.addEventListener("mouseup", this.onMouseUp);
			}
			
		};
		
		this.onMouseOver = function(e){
			if(!e.pointerType || e.pointerType == "mouse" ){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				//self.dispatchEvent(FWDVSArrow.MOUSE_OVER, {e:e});
				parent.resetButtons();
				self.setSelectedState(true);
			
			}
		};
			
		this.onMouseOut = function(e){
			if((!e.pointerType || e.pointerType == "mouse") && !FWDAnimation.isTweening(parent.buttonsHolder_do)){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				//self.dispatchEvent(FWDVSArrow.MOUSE_OUT, {e:e});
				self.setNormalState(true);
			}
		};
		
		this.onMouseUp = function(e){
			if(e.button == 2) return;
			self.dispatchEvent(FWDVSArrow.MOUSE_UP, {id:self.id});
		};
		
		
		//####################################//
		/* Set normal / selected state */
		//####################################//
		this.setNormalState = function(animate){
			//if(this.isSelected_bl) return;
			this.isSelected_bl = true;

			FWDAnimation.killTweensOf(this.screen);
			if(animate){
				FWDAnimation.to(this.screen, .6, {className:"arrow-mobile-normal"});
			}else{
				this.screen.className = "arrow-mobile-normal";
			}	
		};
		
		this.setSelectedState = function(animate){
			if(!this.isSelected_bl) return;
			this.isSelected_bl = false;
	
			FWDAnimation.killTweensOf(this.screen);
			if(animate){
				FWDAnimation.to(this.screen, .6, {className:"arrow-mobile-selected"});
			}else{
				this.screen.className = "arrow-mobile-selected";
			}
		};
		
		
		//####################################//
		/* Set selected / unselected */
		//####################################//
		this.setSelected = function(){
			if(this.isSelectedFinal_bl) return;
			this.isSelectedFinal_bl = true;
			this.setSelectedState(true);
		};
		
		this.setUnselected = function(){
			if(!this.isSelectedFinal_bl) return;
			this.isSelectedFinal_bl = false;
			this.setNormalState(true);
		};
		
		//####################################//
		/* Disable / enable */
		//####################################//
		this.disable = function(){
			//if(this.isDisabled_bl) return;
			if(this.id == 100) return
			this.isDisabled_bl = true;
			this.setButtonMode(true);
			this.dumy_do.setButtonMode(true);
			//this.setButtonMode(false);
			//this.dumy_do.setButtonMode(false);
			this.setSelectedState(true);
		};
		
		this.enable = function(){
			//if(!this.isDisabled_bl) return;
			if(this.id == 100) return
			this.isDisabled_bl = false;
			this.setButtonMode(true);
			this.dumy_do.setButtonMode(true);
			this.setNormalState(true);
		};
		
		//#########################################//
		/* Set label */
		//#########################################//
		this.setLabel = function(label_str){
			self.text_str = label_str;
			if(this.id == 100){
				this.text_do.screen.value = self.text_str;
			}else{
				this.text_do.setInnerHTML(self.text_str);
			}
		};
		
		//#########################################//
		/* Set size */
		//########################################//
		this.setSize = function(){
			setTimeout(function(){
		    	self.w = self.getWidth();
		    	self.h = self.getHeight();
		    }, 69);
		};
		
		this.init();
	};
	
	
	/* set prototype */
	FWDVSArrow.setPrototype = function(){
		FWDVSArrow.prototype = new FWDVSDisplayObject("div");
	};
	
	FWDVSArrow.MOUSE_UP = "onMouseDown";
	
	
	FWDVSArrow.prototype = null;
	window.FWDVSArrow = FWDVSArrow;
}(window));/* FWDVSClassicVerticalThumbnailsManager */
(function (window){
	
	var FWDVSClassicVerticalThumbnailsManager = function(data, parent){
		
		var self = this;
		this.parent = parent;
		var prototype = FWDVSClassicVerticalThumbnailsManager.prototype;
		
		this.sourcePlaylist_ar = data.gallery_ar.galleryItems;
		this.originalDataThumbnails_ar = [];
		this.dataThumbnails_ar = [];
		this.thumbnails_ar = [];
		this.createdThumbnails_ar = [];
		this.tempPlaylist_ar;
	
		this.columnHeights_ar = [];
		this.loadMoreCatsData_ar = [];
		this.catId_ar = data.startAtCategory_ar;
		this.catId = this.catId_ar[0];

		this.curDataThumbnail;
		this.thumbnailLoadingType_str = data.thumbnailLoadingType_str;
		
		this.totalLoadedThumbnails = 0;
		this.loadMoreButtonOffsetTop = data.loadMoreButtonOffsetTop;
		this.loadMoreButtonOffsetBottom = data.loadMoreButtonOffsetBottom;
		this.thumbnailsPerSet = data.thumbnailsPerSet;
		this.thumbsHOffset = data.thumbnailsHorizontalOffset;
		this.thumbsVOffset = data.thumbnailsVerticalOffset;
		this.offsetTotalHeight = 0;
		this.maxH = 0;
		this.thumbOffsetX = 0;
		this.searchValue = '';
		
		this.stageWidth = 0;
		this.prevStageWidth = 0;
		this.thumbnailMaxWidth = data.thumbnailMaxWidth;
		this.thumbnailMaxHeight = data.thumbnailMaxHeight;
		this.leftWidth = 0;
		this.thumbWidth;
		this.thumbHeight;
		this.thumbsHSpace = data.horizontalSpaceBetweenThumbnails;
		this.thumbsVSpace = data.verticalSpaceBetweenThumbnails;
		this.countLoadedThumbs = 0;
		this.borderSize = data.thumbnailBorderSize;
		this.totalThumbnails = this.sourcePlaylist_ar.length;
		this.tempTotalThumbnails = this.sourcePlaylist_ar.length;
		this.totalOriginalThumbnails = this.sourcePlaylist_ar.length;
		this.globalX = 0;
		this.globalY = 0;
		this.gridType = data.gridType;
		this.catChanging_to;
		this.arangeFaterTweenId_to;
		this.allCategoriesLabel_str = data.allCategoriesLabel_str;
		this.isLoadAtTheEnd_bl = false;
		this.isLoadMoreButtonShowed_bl = true;
		this.isCatChanging_bl = false;
		this.isFirstThumbnailLoaded_bl = false;
		this.firstThumbnailShowed_bl = false;
		this.animateParent_bl = data.animateParent_bl;
		this.hasExtraText_bl = data.hasExtraText_bl;
		this.isVerticalType_bl = data.isVerticalType_bl;
	
		
		this.showAllCategories_bl = data.showAllCategories_bl;
		this.categories_ar = data.categories_ar;
		this.totalCats = this.showAllCategories_bl ? data.categories_ar.length-1 : data.categories_ar.length;
		
		this.isMobile_bl = FWDVSUtils.isMobile;
		
		
		//#######################################//
		/* initialize */
		//#######################################//
		this.init = function(){
			if(this.initialized) return;
			this.initialized = true;
			this.loadMore_do = new FWDVSDisplayObject("div");
			this.loadMore_do.screen.style.zIndex = 1000000000;
			this.loadMore_do.screen.style.backgroundColor = "#FFFFFF"
			this.screen.className = 'thumbs-holder';
			this.loadMore_do.setInnerHTML('load more');
			this.loadMore_do.setY(200);
			this.loadMore_do.setButtonMode(true);
			//self.addChild(this.loadMore_do);

			this.setBkColor(parent.backgroundColor);

			this.getStyle().position = 'relative';
			//this.getStyle().float = 'left';
			self.getStyle().wdith = '100%';
			this.setupNoSearch();
			this.setOverflow('visible');
			this.setDataForResize();
			this.setThumbsExtraTextWidth();
			this.setupThumbnails();
			this.initData();
			this.updateData(true);
			this.filterCategories();
			this.loadThumbnailId_to = setTimeout(this.loadThumbImage, 200);
			this.startGetMousePosition();
			this.setupInfiniteScroll();
			setTimeout(this.resizeAndPosition, 100);

			this.loadMore_do.screen.addEventListener('click', function(){
				self.updateData(true);
				self.filterCategories();
				self.loadThumbImage();
			});
		};

		this.initData = function(){
			this.dataThumbnails_ar;
			for(var i=0; i<this.sourcePlaylist_ar.length; i++){
				var obj ={}
				obj.cats_ar = this.sourcePlaylist_ar[i].cats;
				obj.id = i;
				obj.thumbnailAdded = null;
				obj.thumbnail = this.createdThumbnails_ar[i];
				this.dataThumbnails_ar[i] = obj;
			}
		}
		
		//#######################################//
		/* Position and resize */
		//#######################################//
		this.resizeAndPosition = function(){
			self.stageWidth = parent.stageWidth;
			self.init();
			self.setDataForResize();
			self.positionThumbnailsAndMain();
		};
		
		//#######################################//
		/* Get mouse position */
		//#######################################//
		this.startGetMousePosition = function(){
			if(window.addEventListener){
				if(!self.isMobile_bl){
					window.addEventListener("touchstart", this.getMousePosition);
				}
				window.addEventListener("mousemove", this.getMousePosition);
			}else if(document.attachEvent){
				document.attachEvent("onmousemove", this.getMousePosition);
			}
		};
		
		this.getMousePosition = function(e){
			var mc = FWDVSUtils.getViewportMouseCoordinates(e);
			if(!self.isMobile_bl){
				self.globalX = mc.screenX;
				self.globalY = mc.screenY;
			}
		};
	
		//#######################################//
		/* Setup thumbnails */
		//#######################################//
		this.getThumbnail =  function(cats, id){
			
			var props_obj = {};
		
			props_obj.parent = this;
			props_obj.parent = this;
			props_obj.previewText = data.previewText;
			props_obj.hSize = this.sourcePlaylist_ar[id].hSize;
			props_obj.cats_ar = cats;
			props_obj.searchText = this.sourcePlaylist_ar[id].searchText;
			props_obj.slideshow_ar = this.sourcePlaylist_ar[id].slideshow;
			props_obj.showThumbnailOnlyWhenImageIsLoaded_bl = data.showThumbnailOnlyWhenImageIsLoaded_bl;
			props_obj.id = id;
			props_obj.useThumbnailSlideshow_bl = data.useThumbnailSlideshow_bl;
			props_obj.thumbnailPath_str = self.sourcePlaylist_ar[id].thumbnailPath_str;
			props_obj.presetType_str = data.presetType_str;
			props_obj.backgroundColor_str = data.thumbnailBackgroundColor_str;
			props_obj.borderNormalColor_str = this.sourcePlaylist_ar[id].thumbnailBorderNormalColor || data.thumbnailBorderNormalColor_str;
			props_obj.borderSelectedColor_str = this.sourcePlaylist_ar[id].thumbnailBorderSelectedColor || data.thumbnailBorderSelectedColor_str;
			props_obj.borderSize = data.thumbnailBorderSize;
			props_obj.borderRadius = data.thumbnailBorderRadius;
			props_obj.thumbnailOverlayColor_str = this.sourcePlaylist_ar[id].thumbnailOverlayColor || data.thumbnailOverlayColor_str;
			props_obj.thumbnailOverlayOpacity = data.thumbnailOverlayOpacity;
			props_obj.spaceBetweenTextAndIcons = data.spaceBetweenTextAndIcons;
			props_obj.extraButtonUrl_str = this.sourcePlaylist_ar[id].extraButtonUrl_str;
			props_obj.extraButtonUrlTarget_str = this.sourcePlaylist_ar[id].extraButtonUrlTarget_str;
			props_obj.thumbIconPathN_str = this.sourcePlaylist_ar[id].thumbIconPathN_str; 
			props_obj.thumbIconPathS_str = this.sourcePlaylist_ar[id].thumbIconPathS_str; 
			props_obj.thumbnailIconWidth = data.thumbnailIconWidth;
			props_obj.thumbnailIconHeight = data.thumbnailIconHeight;
			props_obj.linkIconPathN_str = data.linkIconPathN_str;
			props_obj.linkIconPathS_str = data.linkIconPathS_str;
			props_obj.spaceBetweenThumbanilIcons = data.spaceBetweenThumbanilIcons;
			props_obj.hideAndShowTransitionType_str = data.hideAndShowTransitionType_str;
			props_obj.textVerticalAlign_str = data.textVerticalAlign_str;
			props_obj.imageTransitionDirection_str = data.imageTransitionDirection_str;
			props_obj.thumbanilBoxShadow_str = data.thumbanilBoxShadow_str;
			props_obj.textAnimType_str = data.textAnimType_str;
			props_obj.disableThumbnails_bl = data.disableThumbnails_bl;
			props_obj.useIconButtons_bl = data.useIconButtons_bl;
			props_obj.alt_str = this.sourcePlaylist_ar[id].alt_str;
			props_obj.linkUrl_str = this.sourcePlaylist_ar[id].url;
			props_obj.linkTarget_str = this.sourcePlaylist_ar[id].target;
			props_obj.contentOffsetY = data.contentOffsetY;
			props_obj.buttonsOffest = data.buttonsOffestY;
			props_obj.isVerticalType_bl = data.isVerticalType_bl;
			props_obj.isDisabled_bl = this.sourcePlaylist_ar[id].disabled_bl;
			props_obj.title_str = this.sourcePlaylist_ar[id].title;
			props_obj.client_str = this.sourcePlaylist_ar[id].client;
			props_obj.likes_str = this.sourcePlaylist_ar[id].likes;
			
			
			props_obj.htmlContent2_str = this.sourcePlaylist_ar[id].htmlContent2_str;
			props_obj.htmlExtraContent_str = this.sourcePlaylist_ar[id].htmlExtraContent_str;
			
			FWDVSThumbnail.setPrototype();
			thumbnail = new FWDVSThumbnail(props_obj);
			thumbnail.addListener(FWDVSThumbnail.MOUSE_UP, this.thumbanilOnMouseUpHandler);
			
			this.addChild(thumbnail);
			return thumbnail;
		};
		
		this.thumbanilOnMouseUpHandler = function(e){
			var thumbnail = self.dataThumbnails_ar[e.id]['thumbnail'];
			window.open(thumbnail.linkUrl_str, thumbnail.linkTarget_str);
		};

		//###############################################//
		/* Scroll top */
		//###############################################//
		this.scrollTop = function(){
			var so = FWDVSUtils.getScrollOffsets();
			if(FWDAnimation.isTweening(self.scrollObj) || so.y == 0) return;
        		self.scrollObj = {posY:so.y}
        		FWDAnimation.killTweensOf(self.scrollObj);
        		FWDAnimation.to(self.scrollObj, .8, {posY:0, ease:Expo.easeInOut, onUpdate:function(){
        		 window.scrollTo(0,self.scrollObj.posY);
        	}})
		}
		
		//###############################################//
		/* Update category */
		//###############################################//
		this.updateCategory =  function(catId_ar){
			if(this.catId_ar == catId_ar) return;
			this.catId_ar = catId_ar;
			this.catId = this.catId_ar[0];
			//self.scrollTop();
			self.updateData();
			this.filterCategories();
			self.loadThumbImage();
			this.positionThumbnailsAndMain();
			this.dispatchEvent(FWDVSClassicVerticalThumbnailsManager.CATEGORY_UPDATE);
		};

		//####################################//
		/* Setup no search found */
		//####################################//
		this.setupNoSearch = function(){
			
			this.noSearch_do =  new FWDVSDisplayObject("div");
			this.noSearch_do.setOverflow("visible");
			this.noSearch_do.setDisplay("inline-block");
			this.noSearch_do.getStyle().whiteSpace = "nowrap";
			this.noSearch_do.setBackfaceVisibility();
			
			this.noSearch_do.screen.className = 'p-nothing-found'; 
			this.noSearch_do.hasTransform3d_bl =  false;
			this.noSearch_do.hasTransform2d_bl =  false;
			this.noSearch_do.setAlpha(0);
			this.noSearch_do.setInnerHTML(data.notFoundLabel);
			
			this.addChild(this.noSearch_do);
			setTimeout(function(){
				self.noSearch_do.w = self.noSearch_do.getWidth();
				self.noSearch_do.h = self.noSearch_do.getHeight();
				self.removeChild(self.noSearch_do);
			}, 70);
		};

		this.showNoSearch = function(){
			if(this.isNoSearchFoundShowed_bl) return;
			this.isNoSearchFoundShowed_bl = true;
			this.addChild(this.noSearch_do);
			this.positionNoSearchLabel();
			FWDAnimation.killTweensOf(this.noSearch_do);
			FWDAnimation.to(this.noSearch_do, .1, {alpha:1, delay:.6, yoyo:true, repeat:8});
		};
		
		this.hideNoSearch = function(){
			if(!this.isNoSearchFoundShowed_bl) return;
			this.isNoSearchFoundShowed_bl = false;
			FWDAnimation.killTweensOf(this.noSearch_do);
			FWDAnimation.to(this.noSearch_do, .1, {alpha:0, onComplete:function(){
				self.removeChild(self.noSearch_do);
			}});
			
		};
		
		this.positionNoSearchLabel = function(){
			if(!this.isNoSearchFoundShowed_bl) return;
			var stageHeight = FWDVSUtils.getViewportSize().h;
			this.noSearch_do.setX(Math.round((this.stageWidth - this.noSearch_do.w)/2));
			this.noSearch_do.setY(Math.round((stageHeight - this.noSearch_do.h)/2));
		};

		//#####################################//
		/* Setup thumbnails */
		//#####################################//
		this.setupThumbnails = function(){
			for(var i=0; i<this.totalThumbnails; i++){
				var curThumbnail_do = self.getThumbnail(self.sourcePlaylist_ar[i]["cats"], i);
				self.createdThumbnails_ar[i] = curThumbnail_do;
			}
		}
		
		//###############################################//
		/* Load thumbnails */
		//###############################################//
		this.stopToLoadImage = function(){
			clearTimeout(this.loadThumbnailId_to);
			clearTimeout(this.loadTumbImageId_to);
			if (self.image_img){
				self.image_img.onerror = null;
				self.image_img.onload = null;
				//self.image_img.src = "";
			}
		};
		
		this.startToLoadImage = function(imagePath){
			self.image_img = new Image();
			self.image_img.onerror = self.onImageLoadErrorHandler;
			self.image_img.onload = self.onImageLoadHandler;
			self.image_img.src = imagePath;
		};
		
		
		this.loadThumbImage = function(){
			self.stopToLoadImage();
		
			if(self.thumbnails_ar[self.loadedId]){
				var found = false;
				var index;
				if(self.showAllCategories_bl && self.catId == 0){
					found = true;
				}else{
					for(var i=0; i<self.thumbnails_ar[self.loadedId].cats_ar.length; i++){
						if(self.thumbnails_ar[self.loadedId].cats_ar[i] == self.categories_ar[self.catId]){
							found = true;
							break;
						}
					}
				}
				if(!found){
					self.loadedId += 1;
					this.loadThumbImage();
					return;
					if(self.loadedId >= self.thumbnails_ar.length - 1) return;
				}
			}

		
			if(!self.thumbnails_ar[self.loadedId]) return;
			if(self.thumbnails_ar[self.loadedId].hasImg_bl){
				self.loadedId ++;
				self.loadThumbImage();
				return;
			}
			
			self.startToLoadImage(self.thumbnails_ar[self.loadedId].thumbnailPath_str);	
		};

		this.onImageLoadErrorHandler = function(e){
			var message = "Thumbnail image can't be loaded, probably the path is incorrect <font color='#FFFFFF'>"
					+ self.sourcePlaylist_ar[self.curDataThumbnail.id].thumbnailPath_str + "</font>";
			self.dispatchEvent(FWDVSClassicVerticalThumbnailsManager.ERROR, {text : message});
		};

		this.onImageLoadHandler = function(e){
			
			var curThumbnail_do = self.thumbnails_ar[self.loadedId];
			curThumbnail_do.hasImg_bl = true;
			curThumbnail_do.originalWidth = self.image_img.width;
			curThumbnail_do.originalHeight = self.image_img.height;
			self.loadedId ++;
			curThumbnail_do.addImage(self.image_img);

			self.loadTumbImageId_to = setTimeout(function(){
				self.loadThumbImage();
			}, 50);
			if(!self.isFirstThumbnailLoaded_bl){
				setTimeout(function(){
					self.firstThumbnailShowed_bl = true;
				}, 50);
			}
			self.positionThumbnailsAndMain();
		};
		
		//#################################################//
		/* Search */
		//#################################################//
		this.search = function(searchValue){
			self.searchValue = searchValue;
			
			clearTimeout(self.updateSearch_to);
			self.updateSearch_to = setTimeout(function(){
				//self.scrollTop();
				self.updateData();
				self.filterCategories();
				self.loadThumbImage();
				self.positionThumbnailsAndMain();
			}, 200);
		}
		
		//#################################################//
		/* Uupdate data */
		//#################################################//

		this.updateData = function(loadMore){
			self.thumbnails_ar = [];
			
			self.toAdd = 0;
			self.totalAdded = 0;
			var firstSetPerCatFound_bl = false;
			var firstSetSearchPerCatFound_bl = false;
			var noMoreLoad = true;

			var catsCountOffeset = 0;
			if(this.showAllCategories_bl) catsCountOffeset = 1;
		
			//self.loadedId = data.finalCatsCount[Math.max(0,self.catId - catsCountOffeset)];
			self.loadedId = 0;

			//All categories
			var dataThumbnail;
			if(self.catId == 0){
				var added = 0;
				var checkAdded = 0;

				if(self.searchValue.length == 0){
					for(var i=0; i<self.dataThumbnails_ar.length; i++){
						if(self.dataThumbnails_ar[i]['thumbnailAdded'] != undefined){
							firstSetPerCatFound_bl = true;
							checkAdded ++;
							if(checkAdded >= self.thumbnailsPerSet) firstSetPerCatFound_bl = true;
						}
					}
				}else{
					for(var i=0; i<self.dataThumbnails_ar.length; i++){
						if(self.dataThumbnails_ar[i]['thumbnailAdded'] != undefined
							&& self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
							checkAdded ++;
							if(checkAdded >= self.thumbnailsPerSet) firstSetSearchPerCatFound_bl = true;
						}
					}
				}

				var limit = self.thumbnailsPerSet;
				if(checkAdded < self.thumbnailsPerSet){
					limit = self.thumbnailsPerSet - checkAdded;
				}

				for(var i=0; i<self.dataThumbnails_ar.length; i++){
					if(added == limit) break;
					if(self.searchValue.length == 0){
						if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined && (!firstSetPerCatFound_bl || loadMore)){
							self.dataThumbnails_ar[i]['thumbnailAdded'] = true;
							added++;
						}
					}else{
						if(self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1 && (!firstSetSearchPerCatFound_bl || loadMore)){
							if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined){
								self.dataThumbnails_ar[i]['thumbnailAdded'] = true;
								added++;
							}
						}
					}
				}
				
				for(var i=0; i<self.dataThumbnails_ar.length; i++){
					if(self.searchValue.length == 0){
						if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined){
							noMoreLoad = false;
							break;
						}
					}else{
						if(self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
							if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined){
								noMoreLoad = false;
								break;
							}
						}
					}
				}
			}else{
				var added = 0;
				var checkAdded = 0;
				for(var i=0; i<self.dataThumbnails_ar.length; i++){
					for(var j=0; j<self.dataThumbnails_ar[i]['cats_ar'].length; j++){
						if(self.dataThumbnails_ar[i]['cats_ar'][j] == self.categories_ar[self.catId]){
							if(self.searchValue.length == 0){
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] != undefined){
									checkAdded ++;
									if(checkAdded >= self.thumbnailsPerSet) firstSetPerCatFound_bl = true;
								}
							}else{
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] != undefined
								   && self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
								   checkAdded ++;
								   if(checkAdded >= self.thumbnailsPerSet) firstSetPerCatFound_bl = true;
								}
							}
						}
					}
				}

				if(self.searchValue.length != 0){
					checkAdded = 0;
					for(var i=0; i<self.dataThumbnails_ar.length; i++){
						for(var j=0; j<self.dataThumbnails_ar[i]['cats_ar'].length; j++){
							if(self.dataThumbnails_ar[i]['cats_ar'][j] == self.categories_ar[self.catId]){
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] != undefined
								   && self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
								   checkAdded ++;
								   if(checkAdded >= self.thumbnailsPerSet) firstSetSearchPerCatFound_bl = true;
								}
							}
						}
					}
				}
			
				var limit = self.thumbnailsPerSet;
				if(checkAdded < self.thumbnailsPerSet){
					limit = self.thumbnailsPerSet - checkAdded;
				}

				addedLoop:for(var i=0; i<self.dataThumbnails_ar.length; i++){
					if(added == limit) break;
					for(var j=0; j<self.dataThumbnails_ar[i]['cats_ar'].length; j++){
						if(self.searchValue.length == 0){
							if(self.dataThumbnails_ar[i]['cats_ar'][j] == self.categories_ar[self.catId]){
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined && (!firstSetPerCatFound_bl || loadMore)){
									self.dataThumbnails_ar[i]['thumbnailAdded'] = true;
									added++
									continue addedLoop;
								}
							}
						}else{

							if(self.dataThumbnails_ar[i]['cats_ar'][j] == self.categories_ar[self.catId]){
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined && (!firstSetSearchPerCatFound_bl || loadMore)
								   && self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
									self.dataThumbnails_ar[i]['thumbnailAdded'] = true;

									added++;
									continue addedLoop;
								}
							}
						}
					}
				}

				for(var i=0; i<self.dataThumbnails_ar.length; i++){
					for(var j=0; j<self.dataThumbnails_ar[i]['cats_ar'].length; j++){
						if(self.dataThumbnails_ar[i]['cats_ar'][j] == self.categories_ar[self.catId]){
							if(self.searchValue.length == 0){
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined){
									noMoreLoad = false;
									break;
								}
							}else{
								if(self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
									if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined){
										noMoreLoad = false;
										break;
									}
								}
							}
						}
					}
				}
			}
			
			for(var i=0; i< self.dataThumbnails_ar.length; i++){
				if(self.dataThumbnails_ar[i]['thumbnailAdded']){
					self.thumbnails_ar.push(self.dataThumbnails_ar[i].thumbnail);
				}
			}
			self.noMoreLoad = noMoreLoad;
			clearTimeout(this.loadInifiniteId_to);
			this.loadInifiniteId_to = setTimeout(self.updateLoadMore, 200);
		}

		this.updateLoadMore = function(){
			if(self.noMoreLoad){
				self.loadMore_do.setX(-5000)
			}else{
				self.loadMore_do.setX(0);
			}
			self.loadInfinite();
		}

		//####################################//
		/* Filter categories */
		//###################################//
		this.setupInfiniteScroll = function(){
			if(window.addEventListener){
				window.addEventListener("scroll", this.onScrollHandler);
			}
		};

		this.onScrollHandler = function(){
			if(self.noMoreLoad) return;
			self.loadInfinite();
		};

		this.load= function(){
			if(!self.tempThumbnails_ar || self.noMoreLoad) return;
			var lastThumbnail = self.tempThumbnails_ar[self.tempThumbnails_ar.length - 1];
			clearTimeout(self.loadInifiniteId_to);
			this.loadInifiniteId_to = setTimeout(function(){
				if((self.getGlobalY() + lastThumbnail.finalY) + lastThumbnail.finalH - 10 <= FWDVSUtils.getViewportSize().h){
					self.updateData(true);
					self.filterCategories();
					self.loadThumbImage();
				}
			}, 100);
		};
	
		//####################################//
		/* Filter categories */
		//###################################//
		this.filterCategories = function(){
			
			var thumbnail;
			self.tempThumbnails_ar = [];
			var catId = self.catId_ar[0];
			
			thumbnailsLoop:for (var i=0; i<self.thumbnails_ar.length; i++){
				thumbnail = self.thumbnails_ar[i];
				thumbnail.isFound_bl = false;
				if(catId == 0){
					if(self.searchValue.length == 0){
						thumbnail.isFound_bl = true;
						self.tempThumbnails_ar.push(thumbnail);
						continue thumbnailsLoop;
					}else{
						if(thumbnail.searchText.toLowerCase().indexOf(self.searchValue) != -1){
							thumbnail.isFound_bl = true;
							self.tempThumbnails_ar.push(thumbnail);
							continue thumbnailsLoop;
						}else{
							thumbnail.isFound_bl = false;
						}
					}
				}else{
					for(var j=0; j<thumbnail.cats_ar.length; j++){
						if(self.searchValue.length == 0){
							if(self.categories_ar[catId] == thumbnail.cats_ar[j] || self.categories_ar[catId] == self.allCategoriesLabel_str){
								thumbnail.isFound_bl = true;
								self.tempThumbnails_ar.push(thumbnail);
								continue thumbnailsLoop;
							}else{
								thumbnail.isFound_bl = false;
							}
						}else{
							if((self.categories_ar[catId] == thumbnail.cats_ar[j] || self.categories_ar[catId] == self.allCategoriesLabel_str)
							  && (thumbnail.searchText.toLowerCase().indexOf(self.searchValue) != -1)){
								thumbnail.isFound_bl = true;
								self.tempThumbnails_ar.push(thumbnail);
								continue thumbnailsLoop;
							}else{
								thumbnail.isFound_bl = false;
							}
						}
					}
				}
			}
			
			for(var i=0; i<self.thumbnails_ar.length; i++){
				thumbnail = self.thumbnails_ar[i];
				if(thumbnail.isFound_bl){
					thumbnail.show(true);
				}else{
					thumbnail.hide(true);
				}
				if(i == self.thumbnails_ar.length -1){
					clearTimeout(self.ttId_to);
					self.ttId_to = setTimeout(function(){
						self.setFinalSize(true);
					},100);
				}
			}

			if(self.tempThumbnails_ar.length == 0){
				this.showNoSearch();
			}else{
				this.hideNoSearch();
			}
			
			self.totalThumbnails = self.tempThumbnails_ar.length;
		};
		
		
		//###############################################//
		/* set data for thumbnail resize */
		//###############################################//
		this.setDataForResize = function(){
			if(!this.stageWidth) return;
			
			this.totalColumns = Math.ceil((this.stageWidth - this.thumbsHOffset * 2 + this.thumbsHSpace) / (this.thumbnailMaxWidth + this.borderSize * 2 + this.thumbsHSpace));
			this.thumbWidth = Math.floor((this.stageWidth - this.thumbsHOffset * 2 + this.thumbsHSpace - this.totalColumns * (this.thumbsHSpace + this.borderSize * 2)) / this.totalColumns);
			if(this.thumbWidth < 300 && this.stageWidth > this.thumbWidth){
				this.totalColumns -= 1;
				this.thumbWidth = Math.floor((this.stageWidth - this.thumbsHOffset * 2 + this.thumbsHSpace - this.totalColumns * (this.thumbsHSpace + this.borderSize * 2)) / this.totalColumns);
			}

			this.totalRows = Math.ceil((FWDVS.viewportHeight - this.thumbsVOffset * 2 + this.thumbsVSpace) / (this.thumbnailMaxHeight + this.borderSize * 2 + this.thumbsVSpace));
			this.totalVisibleThumbnails = this.totalColumns * this.totalRows;

			this.thumbHeight = Math.floor(this.thumbWidth * (this.thumbnailMaxHeight / this.thumbnailMaxWidth));

			this.leftHeight = 0;
			if(data.fitToViewportHeight_bl && !self.isMobile_bl){
				this.thumbHeight = Math.floor((FWDVS.viewportHeight - this.thumbsVOffset * 2 + this.thumbsVSpace - this.totalRows * (this.thumbsVSpace + this.borderSize * 2)) / this.totalRows);
				this.totalThumbnailRows = Math.ceil((self.totalThumbnails/this.totalColumns));
				this.leftHeight = FWDVS.viewportHeight - (self.totalRows * this.thumbHeight);
			}
			
			
			var totalWidth = this.totalColumns * (this.thumbWidth + this.borderSize * 2 + this.thumbsHSpace) - this.thumbsHSpace;
			this.leftWidth = this.stageWidth - this.thumbsHOffset * 2 - totalWidth;

			this.prevStageWidth = this.stageWidth;
		};
		
		//#############################################//
		/* Position and resize main thumbnails and main div's */
		//##############################################//
		this.positionThumbnailsAndMain = function(){

			self.columnHeights_ar = [];
			for (var i=0; i<self.totalColumns; i++){
				self.columnHeights_ar[i] = 0;
			}
			
			for (var i=0; i<self.tempThumbnails_ar.length; i++){
				thumbnail = self.tempThumbnails_ar[i];
				thumbnail.used_bl = false;
			}

			if(this.hasExtraText_bl){
				self.setThumbsExtraTextWidth();
				clearTimeout(self.resizeWithExtraContentId_to);
				
				self.positionThumbnailWithExtraContent();
				self.setFinalSize();

				self.resizeWithExtraContentId_to = setTimeout(function(){
					self.positionThumbnailWithExtraContent();
					self.setFinalSize();
				}, 150);
			}else{
				if(self.gridType == 'dynamic'){
					self.positionThumbnailsDynamic();
					self.positionThumbnails2();
				}else{
					self.positionThumbnailsClassic();
				}
				
				self.setFinalSize();
			}
		};
		
		this.setFinalSize = function(overwrite){
			
			if(self.maxH){
				self.totalHeight = Math.max(0, this.maxH * (this.thumbHeight + this.thumbsVSpace + this.borderSize * 2) - this.thumbsVSpace + this.thumbsVOffset * 2);
			}

			self.totalHeight += self.offsetTotalHeight;

		
			if(self.prevTotalHeight != self.totalHeight || overwrite){
				if(self.firstThumbnailShowed_bl && parent.animate_bl){
					FWDAnimation.to(self, .8, {h:self.totalHeight, ease:Quart.easeOut});
				}else{
					self.setHeight(self.totalHeight);
				}
				clearTimeout(self.arangeFaterTweenId_to);
				self.arangeFaterTweenId_to = setTimeout(function(){
					if(self.stageWidth !=  parent.stageContainer.offsetWidth){
						parent.onResizeHandler();
					}
				}, 900);
			}
			
			parent.setFinalSize();
			
			parent.stageWidth = parent.stageContainer.offsetWidth;
			
			if(self.stageWidth != parent.stageWidth || self.prevTotalHeight != self.totalHeight){
				parent.onResizeHandler();
			}
			self.prevTotalHeight = self.totalHeight;
		};
		
		//###############################################//
		/* position thumbmails dynamic*/
		//###############################################//
		this.positionThumbnailsDynamic = function(){
			var minH;
			var minHVal;
			var wSize;
			var hSize;
			var found_bl;
			var fPlace;
			var tempFinalX;
			var tempFinalY;
			var tempFinalW;
			var tempFinalH;
			var thumbnail;
			var finalW_ar = [];
			var finalX_ar = [];

			for (var i=0; i<self.totalColumns; i++){
				finalW_ar[i] = self.thumbWidth + self.borderSize * 2;

				if((self.leftWidth > 0) && (i < self.leftWidth)){
					finalW_ar[i]++;
				}

				if (i == 0){
					finalX_ar[i] = self.thumbsHOffset;
				}else{
					finalX_ar[i] = finalX_ar[i - 1] + finalW_ar[i - 1] + self.thumbsHSpace;
				}
			}

			for(var i=0; i<self.tempThumbnails_ar.length; i++){
				thumbnail = self.tempThumbnails_ar[i];
				if(thumbnail.used_bl) continue;
				
				wSize = thumbnail.wSize;
				hSize = thumbnail.hSize;
				if(self.totalColumns == 1){
					if(wSize == 2){
						wSize = 1;
						hSize = 1;
					}
				} 
				
				minHVal = 1000;
				
				if(wSize == 1){
					thumbnail.used_bl = true;
					
					for(var j=0; j<self.totalColumns; j++){
						if(self.columnHeights_ar[j] < minHVal){
							minHVal = self.columnHeights_ar[j];
						}
					}
					
					for (var j=0; j<self.totalColumns; j++){
						if (self.columnHeights_ar[j] == minHVal){
							minH = j;
							break;
						}
					}
				
					tempFinalX = finalX_ar[minH];
					tempFinalW = finalW_ar[minH];

					tempFinalY = self.columnHeights_ar[minH] * (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) + self.thumbsVOffset;
					tempFinalH = (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) * hSize - self.thumbsVSpace;
					
					thumbnail.finalW = tempFinalW;
					thumbnail.finalH = tempFinalH;
					
					thumbnail.finalX = tempFinalX;
					thumbnail.finalY = tempFinalY;
				
					thumbnail.resizeAndPosition();
					
					self.columnHeights_ar[minH] += hSize;
				}else{
					found_bl = false;
					
					for (var j=0; j<self.totalColumns - (wSize-1); j++){
						fPlace = true;
						
						for (var k=0; k<wSize; k++){
							if (self.columnHeights_ar[j] != self.columnHeights_ar[j+k]) fPlace = false;
						}
						
						if (fPlace && (self.columnHeights_ar[j] < minHVal)){
							minHVal = self.columnHeights_ar[j];
							minH = j;
							found_bl = true;
						}
					}
					
					if (found_bl){	
						thumbnail.used_bl = true;
						
						tempFinalX = finalX_ar[minH];
						tempFinalY = self.columnHeights_ar[minH] * (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) + self.thumbsVOffset;
						
						tempFinalW = -self.thumbsHSpace;
						for (var k=0; k<wSize; k++){
							tempFinalW += finalW_ar[minH + k] + self.thumbsHSpace;
						}
						
						tempFinalH = (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) * hSize - self.thumbsVSpace;
						
						thumbnail.finalW = tempFinalW;
						thumbnail.finalH = tempFinalH;
						
						thumbnail.finalX = tempFinalX;
						thumbnail.finalY = tempFinalY;
						
						thumbnail.resizeAndPosition();
						
						for (var k=0; k<wSize; k++){
							self.columnHeights_ar[minH + k] += hSize;
						}
					}
				}
			}
			
			self.maxH = 0;
			
			for (var i=0; i<self.totalColumns; i++){
				if (self.columnHeights_ar[i] > self.maxH){
					self.maxH = self.columnHeights_ar[i];
				}
			}
		};

		this.positionThumbnails2 = function(){
			var tempFinalX;
			var tempFinalY;
			var tempFinalW;
			var tempFinalH;
			var finalW_ar = [];
			
			for (var i=0; i<self.totalColumns; i++){
				finalW_ar[i] = self.thumbWidth + self.borderSize * 2;
				if ((self.leftWidth > 0) && (i < self.leftWidth)){
					finalW_ar[i]++;
				}
			}
			
			this.maxH = 0;
			
			for (var i=0; i<this.totalColumns; i++){
				if (this.columnHeights_ar[i] > this.maxH){
					this.maxH = this.columnHeights_ar[i];
				}
			}
			
			for (var i=0; i<this.tempThumbnails_ar.length; i++){
				thumbnail = this.tempThumbnails_ar[i];
				
				if (thumbnail.used_bl) continue;
				
				thumbnail.used_bl = true;
			
				wSize = thumbnail.wSize;
				hSize = thumbnail.hSize;
				
				if (this.totalColumns < wSize){
					wSize = this.totalColumns;
				}
				
				tempFinalX = this.thumbsHOffset;
				tempFinalY = this.maxH * (this.thumbHeight + this.thumbsVSpace + this.borderSize * 2) + this.thumbsVOffset;
				
				tempFinalW = -self.thumbsHSpace;
				for (var k=0; k<wSize; k++){
					tempFinalW += finalW_ar[k] + self.thumbsHSpace;
				}
	
				tempFinalH = (this.thumbHeight + this.thumbsVSpace + this.borderSize * 2) * hSize - this.thumbsVSpace;
				
				thumbnail.finalX = tempFinalX;
				thumbnail.finalY = tempFinalY;
				
				thumbnail.finalW = tempFinalW;
				thumbnail.finalH = tempFinalH;
				
				thumbnail.resizeAndPosition();
				
				this.maxH += hSize;

				for (var k=0; k<wSize; k++){
					this.columnHeights_ar[k] = this.maxH;
				}
			}
		};

		//###############################################//
		/* position thumbmails classic*/
		//###############################################//
		this.positionThumbnailsClassic = function(){
			if(!self.tempThumbnails_ar) return;

			var tempFinalX;
			var tempFinalY;
			var tempFinalW;
			var tempFinalH;
			var thumbnail;
			var lastFinalX;

			for (var i=0; i<self.tempThumbnails_ar.length; i++){

				thumbnail = self.tempThumbnails_ar[i];

				tempFinalW = self.thumbWidth + self.borderSize * 2;
				tempFinalH = self.thumbHeight + self.borderSize * 2;

				if ((self.leftWidth > 0) && ((i%self.totalColumns) < self.leftWidth)){
					tempFinalW++;
				}
				tempFinalY = Math.floor(i/self.totalColumns) * (tempFinalH + self.thumbsVSpace) + self.thumbsVOffset;
				if((self.leftHeight > 0) && i == (self.totalRows -1) * self.totalColumns + i%self.totalColumns){
					tempFinalH += self.leftHeight;
				}

				if ((self.leftHeight > 0) && i == self.totalRows * self.totalColumns + i%self.totalColumns){
					tempFinalY += self.leftHeight;
				}

				if (i%self.totalColumns == 0){
					lastFinalX = self.thumbsHOffset;
					tempFinalX = self.thumbsHOffset;
				}else{
					tempFinalX = lastFinalX;
				}

				lastFinalX += tempFinalW + self.thumbsHSpace;

				thumbnail.finalW = tempFinalW;
				thumbnail.finalH = tempFinalH;

				thumbnail.finalX = tempFinalX;
				thumbnail.finalY = tempFinalY;

				thumbnail.resizeAndPosition();
			}

			if (thumbnail){
				self.totalHeight = tempFinalY + tempFinalH + self.thumbsVOffset;
			}else{
				self.totalHeight = 0;
			}

		};
		
		this.setThumbsExtraTextWidth = function(){
			var tempFinalW;
			var thumbnail;
			
			for (var i=0; i<self.thumbnails_ar.length; i++){
				thumbnail = self.thumbnails_ar[i];
				tempFinalW = self.thumbWidth + self.borderSize * 2;
				
				if ((self.leftWidth > 0) && ((i%self.totalColumns) < self.leftWidth)){
					tempFinalW++;
				}
				
				if (thumbnail.hasExtraText_bl){
					thumbnail.textHolder_do.setWidth(tempFinalW - self.borderSize * 2);
				}
			}
		};
				
		this.positionThumbnailWithExtraContent = function(){
			if(!self.tempThumbnails_ar) return;

			var tempFinalX;
			var tempFinalY;
			var tempFinalW;
			var tempFinalH;
			var thumbnail;
			var lastFinalX;
			var lastFinalY = 0;
			var maxExtraHeight = 0;
			var addToMainMaxExtraHeight = 0;

			for (var i=0; i<self.tempThumbnails_ar.length; i++){

				thumbnail = self.tempThumbnails_ar[i];
				
				tempFinalW = self.thumbWidth + self.borderSize * 2;
				tempFinalH = self.thumbHeight + self.borderSize * 2;


				if(thumbnail.hasExtraText_bl){
					thumbnail.textHeight = thumbnail.text3_do.getHeight();
				}

				if ((self.leftWidth > 0) && ((i%self.totalColumns) < self.leftWidth)){
					tempFinalW++;
				}

				tempFinalY = Math.floor(i/self.totalColumns) * (tempFinalH + self.thumbsVSpace) + self.thumbsVOffset;
				
				if(i > 0 && (i%self.totalColumns) == 0){
					maxExtraHeight = 0;
					addToMainMaxExtraHeight = 0;
					
					for(var j = i - self.totalColumns; j<i; j++){
						if (self.tempThumbnails_ar[j].textHeight > maxExtraHeight){
							maxExtraHeight = self.tempThumbnails_ar[j].textHeight;
						}
					}

					for(var j = i; j<i + self.totalColumns; j++){
						if(self.tempThumbnails_ar[j]){
							if (self.tempThumbnails_ar[j].textHeight > addToMainMaxExtraHeight){
								addToMainMaxExtraHeight = self.tempThumbnails_ar[j].textHeight;
							}
						}
					}
				}

				if(self.totalThumbnails <= self.totalColumns){
					for(var j = 0; j<self.totalThumbnails; j++){
						if (self.tempThumbnails_ar[j].textHeight > addToMainMaxExtraHeight){
							addToMainMaxExtraHeight = self.tempThumbnails_ar[j].textHeight;
						}
					}
				}

				if ((i != 0) && (i%self.totalColumns == 0)){
					lastFinalY += tempFinalH  + maxExtraHeight + self.thumbsVSpace;
				}

				if(i%self.totalColumns == 0){
					lastFinalX = self.thumbsHOffset;
					tempFinalX = self.thumbsHOffset;
				}else{
					tempFinalX = lastFinalX;
				}

				lastFinalX += tempFinalW + self.thumbsHSpace;
				tempFinalY = lastFinalY;
				
				thumbnail.finalW = tempFinalW;
				thumbnail.finalH = tempFinalH;
				
				thumbnail.finalX = tempFinalX;
				thumbnail.finalY = tempFinalY ;

				thumbnail.resizeAndPosition();
			}
			
			if (thumbnail){
				self.totalHeight = tempFinalY + tempFinalH + self.thumbsVOffset + addToMainMaxExtraHeight;
			}else{
				self.totalHeight = 0;
			}
		};
	};
	
	/* set prototype */
	FWDVSClassicVerticalThumbnailsManager.setPrototype = function(){
		FWDVSClassicVerticalThumbnailsManager.prototype = new FWDVSDisplayObject("div", "relative");
	};
	
	FWDVSClassicVerticalThumbnailsManager.OPEN_LIGHTBOX = "openLightbox";
	FWDVSClassicVerticalThumbnailsManager.CATEGORY_UPDATE = "categoryUpdate";
	FWDVSClassicVerticalThumbnailsManager.ERROR = "error";
	
	FWDVSClassicVerticalThumbnailsManager.prototype = null;
	window.FWDVSClassicVerticalThumbnailsManager = FWDVSClassicVerticalThumbnailsManager;
	
}(window));/* FWDVSComplexButton */
(function (){
var FWDVSComplexButton = function(
			n1Img, 
			s1Path, 
			n2Img, 
			s2Path, 
			disptachMainEvent_bl
		){
		
		var self = this;
		var prototype = FWDVSComplexButton.prototype;
		
		this.n1Img = n1Img;
		this.s1Path_str = s1Path;
		this.n2Img = n2Img;
		this.s2Path_str = s2Path;
	
		this.buttonsHolder_do;
		this.firstButton_do;
		this.n1_do;
		this.s1_do;
		this.secondButton_do;
		this.n2_do;
		this.s2_do;
		
		this.buttonWidth = self.n1Img.width;
		this.buttonHeight = self.n1Img.height;
		
		this.isSelectedState_bl = false;
		this.currentState = 1;
		this.isDisabled_bl = false;
		this.isMaximized_bl = false;
		this.disptachMainEvent_bl = disptachMainEvent_bl;
		this.isDisabled_bl = false;
		this.isHoverDisabled_bl = false;
		this.isMobile_bl = FWDVSUtils.isMobile;
		this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent;
		this.allowToCreateSecondButton_bl = !self.isMobile_bl || self.hasPointerEvent_bl;
		
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.setButtonMode(true);
			self.setWidth(self.buttonWidth);
			self.setHeight(self.buttonHeight);
			self.setupMainContainers();
			self.secondButton_do.setX(-50);
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		self.setupMainContainers = function(){
			self.setBackfaceVisibility();
			self.hasTransform3d_bl = false;
			self.hasTransform2d_bl = false;
			
			
			self.buttonsHolder_do = new FWDVSDisplayObject("div");
			self.buttonsHolder_do.setOverflow("visible");
			self.buttonsHolder_do.setBackfaceVisibility();
			self.buttonsHolder_do.hasTransform3d_bl = false;
			self.buttonsHolder_do.hasTransform2d_bl = false;
			
			
			self.firstButton_do = new FWDVSDisplayObject("div");
			self.firstButton_do.setBackfaceVisibility();
			self.firstButton_do.hasTransform3d_bl = false;
			self.firstButton_do.hasTransform2d_bl = false;
			self.addChild(self.firstButton_do);
			self.n1_do = new FWDVSDisplayObject("img");	
			self.n1_do.setScreen(self.n1Img);
			self.n1_do.setBackfaceVisibility();
			self.n1_do.hasTransform3d_bl = false;
			self.n1_do.hasTransform2d_bl = false;
			self.firstButton_do.addChild(self.n1_do);
			if(self.allowToCreateSecondButton_bl){
				self.s1_do = new FWDVSDisplayObject("img");
				var img1 = new Image();
				img1.src = self.s1Path_str;
				self.s1_do.setScreen(img1);
				self.s1_do.setWidth(self.buttonWidth);
				self.s1_do.setHeight(self.buttonHeight);
				self.s1_do.setAlpha(0);
				self.s1_do.setBackfaceVisibility();
				self.s1_do.hasTransform3d_bl = false;
				self.s1_do.hasTransform2d_bl = false;
				self.firstButton_do.addChild(self.s1_do);
			}
			self.firstButton_do.setWidth(self.buttonWidth);
			self.firstButton_do.setHeight(self.buttonHeight);
			
			self.secondButton_do = new FWDVSDisplayObject("div");
			self.secondButton_do.setBackfaceVisibility();
			self.secondButton_do.hasTransform3d_bl = false;
			self.secondButton_do.hasTransform2d_bl = false;
			self.addChild(self.secondButton_do);
			self.n2_do = new FWDVSDisplayObject("img");	
			self.n2_do.setScreen(self.n2Img);
			self.n2_do.setBackfaceVisibility();
			self.n2_do.hasTransform3d_bl = false;
			self.n2_do.hasTransform2d_bl = false;
			self.secondButton_do.addChild(self.n2_do);
			
			if(self.allowToCreateSecondButton_bl){
				self.s2_do = new FWDVSDisplayObject("img");
				var img2 = new Image();
				img2.src = self.s2Path_str;
				self.s2_do.setScreen(img2);
				self.s2_do.setWidth(self.buttonWidth);
				self.s2_do.setHeight(self.buttonHeight);
				self.s2_do.setAlpha(0);
				self.s2_do.setBackfaceVisibility();
				self.s2_do.hasTransform3d_bl = false;
				self.s2_do.hasTransform2d_bl = false;
				self.secondButton_do.addChild(self.s2_do);
			}
			
			self.secondButton_do.setWidth(self.buttonWidth);
			self.secondButton_do.setHeight(self.buttonHeight);
			
			self.buttonsHolder_do.addChild(self.secondButton_do);
			self.buttonsHolder_do.addChild(self.firstButton_do);
			self.addChild(self.buttonsHolder_do);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("pointerdown", self.onMouseUp);
					self.screen.addEventListener("pointerover", self.onMouseOver);
					self.screen.addEventListener("pointerout", self.onMouseOut);
				}else{
					self.screen.addEventListener("toustart", self.onDown);
					self.screen.addEventListener("touchend", self.onMouseUp);
				}
			}else if(self.screen.addEventListener){	
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mouseup", self.onMouseUp);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmousedown", self.onMouseUp);
			}
		};
		
		self.onMouseOver = function(e, animate){
			self.dispatchEvent(FWDVSComplexButton.SHOW_TOOLTIP, {e:e});
			if(self.isDisabled_bl || self.isSelectedState_bl || self.isHoverDisabled_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				self.dispatchEvent(FWDVSComplexButton.MOUSE_OVER, {e:e});
				self.setSelectedState(true);
			}
		};
			
		self.onMouseOut = function(e){
			if(self.isDisabled_bl || !self.isSelectedState_bl || self.isHoverDisabled_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				self.setNormalState();
				self.dispatchEvent(FWDVSComplexButton.MOUSE_OUT);
			}
		};
		
		self.onDown = function(e){
			if(e.preventDefault) e.preventDefault();
		};
	
		self.onMouseUp = function(e){
			
			if(self.isDisabled_bl || e.button == 2) return;
			if(e.preventDefault) e.preventDefault();
			if(!self.isMobile_bl) self.onMouseOver(e, false);
		
			//if(self.hasPointerEvent_bl) self.setNormalState();
			if(self.disptachMainEvent_bl) self.dispatchEvent(FWDVSComplexButton.MOUSE_UP, {e:e});
		};
		
		//##############################//
		/* toggle button */
		//#############################//
		self.toggleButton = function(){
			if(self.currentState == 1){
				self.firstButton_do.setX(-50);
				self.secondButton_do.setX(0);
				self.currentState = 0;
				self.dispatchEvent(FWDVSComplexButton.FIRST_BUTTON_CLICK);
			}else{
				self.firstButton_do.setX(-50);
				self.secondButton_do.setX(0);
				self.currentState = 1;
				self.dispatchEvent(FWDVSComplexButton.SECOND_BUTTON_CLICK);
			}
		};
		
		//##############################//
		/* set second buttons state */
		//##############################//
		self.setButtonState = function(state){
			if(state == 1){
				self.firstButton_do.setX(0);
				self.secondButton_do.setX(-50);
				self.currentState = 1; 
			}else{
				self.firstButton_do.setX(-50);
				self.secondButton_do.setX(0);
				self.currentState = 0; 
			}
		};
		
		//###############################//
		/* set normal state */
		//################################//
		this.setNormalState = function(){
			if(self.isMobile_bl && !self.hasPointerEvent_bl) return;
			self.isSelectedState_bl = false;
			FWDAnimation.killTweensOf(self.s1_do);
			FWDAnimation.killTweensOf(self.s2_do);
			FWDAnimation.to(self.s1_do, .5, {alpha:0, ease:Expo.easeOut});	
			FWDAnimation.to(self.s2_do, .5, {alpha:0, ease:Expo.easeOut});
		};
		
		this.setSelectedState = function(animate){
			self.isSelectedState_bl = true;
			FWDAnimation.killTweensOf(self.s1_do);
			FWDAnimation.killTweensOf(self.s2_do);
			FWDAnimation.to(self.s1_do, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
			FWDAnimation.to(self.s2_do, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
		};
		
		
		//###################################//
		/* Enable disable */
		//###################################//
		this.disable = function(){
			self.isDisabled_bl = true;
			self.setButtonMode(false);
			FWDAnimation.to(self, .6, {alpha:.4});
		};
		
		this.enable = function(){
			self.isDisabled_bl = false;
			self.setButtonMode(true);
			FWDAnimation.to(self, .6, {alpha:1});
		};
		
		this.disableHover = function(){
			self.isHoverDisabled_bl = true;
			self.setSelectedState();
		};
		
		this.enableHover = function(){
			self.isHoverDisabled_bl = false;
			//self.setSelectedState();
		};
		
		self.init();
	};
	
	/* set prototype */
	FWDVSComplexButton.setPrototype = function(){
		FWDVSComplexButton.prototype = new FWDVSDisplayObject("div");
	};
	
	FWDVSComplexButton.FIRST_BUTTON_CLICK = "onFirstClick";
	FWDVSComplexButton.SECOND_BUTTON_CLICK = "secondButtonOnClick";
	FWDVSComplexButton.SHOW_TOOLTIP = "showToolTip";
	FWDVSComplexButton.MOUSE_OVER = "onMouseOver";
	FWDVSComplexButton.MOUSE_OUT = "onMouseOut";
	FWDVSComplexButton.MOUSE_UP = "onMouseUp";
	FWDVSComplexButton.CLICK = "onClick";
	
	FWDVSComplexButton.prototype = null;
	window.FWDVSComplexButton = FWDVSComplexButton;
}(window));/* Thumb */
(function (window){
	
	var FWDVSConsole = function(){
		
		var self  = this;
		var prototype = FWDVSConsole.prototype;
		
		this.main_do = null;
	
		this.init = function(){
			this.setupScreen();
			window.onerror = this.showError;
			this.screen.style.zIndex = 99999999999999999999;
			this.screen.style.position = 'fixed'
			this.screen.style.top = 0;
			this.screen.className = 'test';
			setTimeout(this.addConsoleToDom, 100);
			setInterval(this.position, 100);
		};
		
		this.position = function(){
			var scrollOffsets = FWDVSUtils.getScrollOffsets();
			self.setX(scrollOffsets.x);
			self.setY(scrollOffsets.y + 30);
		};
		
		this.addConsoleToDom  = function(){
			document.documentElement.appendChild(self.screen);
		};
		
		/* setup screens */
		this.setupScreen = function(){
			this.main_do = new FWDVSDisplayObject("div", "absolute");
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
    FWDVSConsole.setPrototype = function(){
    	FWDVSConsole.prototype = new FWDVSDisplayObject("div", "absolute");
    };
    
    FWDVSConsole.prototype = null;
	window.FWDVSConsole = FWDVSConsole;
}(window));/* Context menu */
(function (){
	var FWDVSContextMenu = function(e, showMenu){
		
		var self = this;
		this.parent = e;
		this.url = "http://www.webdesign-flash.ro";
		this.menu_do = null;
		this.normalMenu_do = null;
		this.selectedMenu_do = null;
		this.over_do = null;
		this.isDisabled_bl = false;
		
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
			var viewportMouseCoordinates = FWDVSUtils.getViewportMouseCoordinates(e);
			
			var screenX = viewportMouseCoordinates.screenX;
			var screenY = viewportMouseCoordinates.screenY;
			
			if(!FWDVSUtils.hitTest(self.menu_do.screen, screenX, screenY)){
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
			this.menu_do = new FWDVSDisplayObject("div");
			self.menu_do.setX(-500);
			this.menu_do.getStyle().width = "100%";
			
			this.normalMenu_do = new FWDVSDisplayObject("div");
			this.normalMenu_do.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			this.normalMenu_do.getStyle().padding = "4px";
			this.normalMenu_do.getStyle().fontSize = "12px";
			this.normalMenu_do.getStyle().color = "#000000";
			this.normalMenu_do.setInnerHTML("&#0169; made by FWDV");
			this.normalMenu_do.setBkColor("#FFFFFF");
			
			this.selectedMenu_do = new FWDVSDisplayObject("div");
			this.selectedMenu_do.getStyle().fontFamily = "Arial, Helvetica, sans-serif";
			this.selectedMenu_do.getStyle().padding = "4px";
			this.selectedMenu_do.getStyle().fontSize = "12px";
			this.selectedMenu_do.getStyle().color = "#FFFFFF";
			this.selectedMenu_do.setInnerHTML("&#0169; made by FWDV");
			this.selectedMenu_do.setBkColor("#000000");
			this.selectedMenu_do.setAlpha(0);
			
			this.over_do = new FWDVSDisplayObject("div");
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
			var viewportMouseCoordinates = FWDVSUtils.getViewportMouseCoordinates(e);
		
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
		}
		
		this.init();
	};
	
	
	FWDVSContextMenu.prototype = null;
	window.FWDVSContextMenu = FWDVSContextMenu;
	
}(window));/* Data */
(function(window){
	
	var FWDVSData = function(props, parent){
		
		var self = this;
		var prototype = FWDVSData.prototype;
		
		this.props_obj = props;
		this.rootElement_el = null;
		this.graphicsPaths_ar = [];
		this.skinPaths_ar = [];
		this.gallery_ar = [];
		this.lightboxPlaylist_ar = [];
		this.categories_ar = [];
		this.parsedPlaylist_ar = [];
		this.youtubeData_ar;
		
		
		this.grabIconPath_str;
		this.handIconPath_str;
		this.imageIconPath_str;
		this.videoIconPath_str;
		this.linkIconPath_str;
		this.mainFolderPath_str;
		this.gridSkinPath_str;
		this.rightClickContextMenu_str;
		this.selectLabel_str;
		this.allCategoriesLabel_str;
		this.accessToken_str;
		this.scClientId_str = "0aff03b3b79c2ac02fd2283b300735bd";
		
		this.totalGalleries;
		this.startAtCategory;
		this.thumbnailMaxWidth;
		this.thumbnailMaxHeight;
		this.thumbnailOverlayOpacity;
		this.countLoadedGraphics = 0;
		this.totalGraphics;
		this.totalItems;
		this.lightBoxInfoWindowBackgroundOpacity;
		this.lightBoxBackgroundOpacity;
		this.lightBoxBorderSize;
		this.lightBoxSlideShowDelay;
		this.countLoadedSkinImages = 0;
		this.youtubeLoadId = 0;
		this.nextPageToken_str = 0;
		
		
		this.parseDelayId_to;
		this.loadImageId_to;
		
		this.isYoutube_bl;
		this.showLightBoxZoomButton_bl;
		this.showLightBoxInfoButton_bl;
		this.showLighBoxSlideShowButton_bl;
		this.addLightBoxKeyboardSupport_bl;
		this.showLighBoxNextAndPrevButtons_bl;
		this.showContextMenu_bl;
		this.disableThumbnailsInteractivity_bl;
		this.isPlaylistDispatchingError_bl;
		
		
		this.isMobile_bl = FWDVSUtils.isMobile;
		this.showHelpScreen_bl;;
		
		//###################################//
		/*init*/
		//###################################//
		this.init = function(){
			self.parseProperties();
		};
		
		this.parseProperties = function(){
			var errorMessage_str;
			var mediaKid;
		
			self.mainFolderPath_str = self.props_obj.mainFolderPath;
			if(!self.mainFolderPath_str){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "The <font color='#FF0000'>mainFolderPath</font> property is not defined in the constructor function!";
					self.dispatchEvent(FWDVSData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
			if((self.mainFolderPath_str.lastIndexOf("/") + 1) != self.mainFolderPath_str.length){
				self.mainFolderPath_str += "/";
			}
			
			self.gridSkinPath_str = self.props_obj.gridSkinPath;
			if(!self.gridSkinPath_str){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "The <font color='#FF0000'>gridSkinPath</font> property is not defined in the constructor function!";
					self.dispatchEvent(FWDVSData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
		
			if((self.gridSkinPath_str.lastIndexOf("/") + 1) != self.gridSkinPath_str.length){
				self.gridSkinPath_str += "/";
			}
			self.gridSkinPath_str = self.mainFolderPath_str + self.gridSkinPath_str;
			
			//###############################//
			/* set main properties */
			//###############################//
			self.rightClickContextMenu_str = self.props_obj.rightClickContextMenu || "developer";
			test = self.rightClickContextMenu_str == "developer" 
				   || self.rightClickContextMenu_str == "disabled"
				   || self.rightClickContextMenu_str == "default";
			if(!test) self.rightClickContextMenu_str = "developer";
			self.handIconPath_str = self.gridSkinPath_str + "hand.cur";
			self.grabIconPath_str = self.gridSkinPath_str + "grab.cur";
		
			self.comboBoxPosition_str = self.props_obj.comboBoxPosition || "topright";
			self.comboBoxPosition_str = self.comboBoxPosition_str.toLowerCase();
			test = self.comboBoxPosition_str.toLowerCase() == "topright" 
				   || self.comboBoxPosition_str.toLowerCase() == "topleft";
			if(!test) self.comboBoxPosition_str = "topright";
			
		
			
			self.thumbnailLoadingType_str = String(self.props_obj.thumbnailLoadingType).toLowerCase() || "default";
			var test = self.thumbnailLoadingType_str == "loadmorewithbutton" 
				   || self.thumbnailLoadingType_str == "loadmoreonscroll"
				   || self.thumbnailLoadingType_str == "default";
			if(!test) self.thumbnailLoadingType_str = "default";
			
			
			self.hideAndShowTransitionType_str = String(self.props_obj.hideAndShowTransitionType).toLowerCase() || "scale";
			var test = self.hideAndShowTransitionType_str == "scale" 
				   || self.hideAndShowTransitionType_str == "opacity"
			       || self.hideAndShowTransitionType_str == "rotation"
				   || self.hideAndShowTransitionType_str == "none";
			if(!test) self.hideAndShowTransitionType_str = "scale";
			if(!FWDVSUtils.hasTransform2d) self.hideAndShowTransitionType_str = "none";
			
			self.textVerticalAlign_str = String(self.props_obj.textVerticalAlign).toLowerCase() || "center";
			var test = self.textVerticalAlign_str == "center" 
				   || self.textVerticalAlign_str == "top"
			       || self.textVerticalAlign_str == "bottom";
			if(!test) self.textVerticalAlign_str = "center";
		
			self.imageTransitionDirection_str = String(self.props_obj.curtainRevealDirection).toLowerCase() || "top";
			var test = self.imageTransitionDirection_str == "top" 
				   || self.imageTransitionDirection_str == "bottom"
				   || self.imageTransitionDirection_str == "left"
			       || self.imageTransitionDirection_str == "right";
			if(!test) self.imageTransitionDirection_str = "top";
			
			self.textAnimType_str = String(self.props_obj.textAnimationType).toLowerCase() || "opacity";
			var test = self.textAnimType_str == "opacity"
			 	     || self.textAnimType_str == "scale"
			 	     || self.textAnimType_str == "scalerandom"
					 || self.textAnimType_str == "largescale";
			
			self.previewText =  self.props_obj.previewText || 'preview';
		
			self.warningIconPath_str = self.gridSkinPath_str + "warning.png";
			
			self.searchClassName_str = self.props_obj.searchClassName;
			self.searchClassName_str = "searchClassName";
			self.searchNotFoundClassName_str = "searchNotFound";
	
			self.comboboxSelectorLabel_str = self.props_obj.comboboxSelectorLabel;
			self.ytbTitleClassName_str = self.props_obj.ytbTitleClassName;
			self.ytbDescriptionClassName_str = self.props_obj.ytbDescriptionClassName;
			self.showYtbTitle_bl = self.props_obj.showYtbTitle == "yes" ? true : false;
			self.fitToViewportHeight_bl = self.props_obj.fitToViewportHeight == "yes" ? true : false;
			self.showSearch_bl = self.props_obj.showSearch == "yes" ? true : false;
			self.searchLabel = self.props_obj.searchLabel;
			self.notFoundLabel = self.props_obj.notFoundLabel;
			self.gridType = self.props_obj.gridType;
		
			self.showThumbnailOnlyWhenImageIsLoaded_bl = self.props_obj.showThumbnailOnlyWhenImageIsLoaded == "yes" ? true : false;
			
		
			self.showYtbDescription_bl = self.props_obj.showYtbDescription == "yes" ? true : false;
			
			
			self.ytbTitleMaxLength = parseInt(self.props_obj.ytbTitleMaxLength);
			

			self.thumbnailsPerSet = self.props_obj.howManyThumbnailsToDisplayPerSet || 12;
			self.facesliderTitleClassName_str = self.props_obj.facesliderTitleClassName;
			self.facesliderDescriptionClassName_str = self.props_obj.facesliderDescriptionClassName;
			self.showFacesliderTitle_bl = self.props_obj.showFacesliderTitle == "yes" ? true : false;
			self.showFacesliderDescription_bl = self.props_obj.showFacesliderDescription == "yes" ? true : false;
			self.facesliderTitleMaxLength = parseInt(self.props_obj.facesliderTitleMaxLength);
			
			self.soundCloudTitleClassName_str = self.props_obj.soundCloudTitleClassName;
			self.soundCloudTrackClassName_str = self.props_obj.soundCloudTrackClassName;
			self.showSoundCloudUserName_bl = self.props_obj.showSoundCloudTitle == "yes" ? true : false;
			self.showSoundCloudTrack_bl = self.props_obj.showSoundCloudTrack == "yes" ? true : false;
			
			self.pintrestDescriptionClassName_str = self.props_obj.pintrestDescriptionClassName;
			self.showPintrestDescription_bl = self.props_obj.showPintrestDescription == "yes" ? true : false;
			self.showPinButton_bl = self.props_obj.usePinIconButton == "yes" ? true : false;
			
			self.flickrAPIKey_str = self.props_obj.flickrAppId;
			self.flickrTitleClassName_str = self.props_obj.flickrTitleClassName;
			self.showFlickrkDescription_bl = self.props_obj.showFlickrDescription == "yes" ? true : false;
			self.flickrTitleMaxLength = parseInt(self.props_obj.flickrDescriptionMaxLength);
			
			if(parent.gridType_str == "classicvertical"
			   || parent.gridType_str == "masonryvertical"
			   || parent.gridType_str == "flexiblevertical"){
				self.showAsExtraText_bl = self.props_obj.showAsExtraText == "yes" ? true : false;
			}
		
		
			if(!FWDVSUtils.hasTransform2d){
				test = false;
			}
			
			self.thumbanilBoxShadow_str = self.props_obj.thumbanilBoxShadow || "none";
			
			self.presetType_str = String(self.props_obj.preset).toLowerCase();
			if(self.presetType_str == "3d" && !FWDVSUtils.hasTransform3d){
				self.presetType_str = "movetext";
			}
		
			self.allCategoriesLabel_str = self.props_obj.allCategoriesLabel;

			
			self.useVideo_str = self.props_obj.useVideo;
			self.useAudio_str = self.props_obj.useAudio;

			self.lightBoxInfoWindowBackgroundColor_str =  self.props_obj.lightBoxInfoWindowBackgroundColor || "transparent";
			self.thumbnailBorderNormalColor_str = self.props_obj.thumbnailBorderNormalColor || "transparent";
			self.thumbnailBorderSelectedColor_str = self.props_obj.thumbnailBorderSelectedColor || "transparent";
			self.thumbnailBackgroundColor_str = self.props_obj.thumbnailBackgroundColor || "transparent";
			self.thumbnailOverlayColor_str = self.props_obj.thumbnailOverlayColor || "transparent";
			
			
			self.comboboxSelectorBackgroundNormalClassName_str = self.props_obj.comboboxSelectorBackgroundNormalClassName || "";
			self.comboboxSelectorBackgroundNormalClassName_str = "ISPMenuButtonBackgroundNormal";
			self.comboboxSelectorBackgroundSelectedClassName_str = self.props_obj.comboboxSelectorBackgroundSelectedClassName || "";
			self.comboboxSelectorBackgroundSelectedClassName_str = "ISPMenuButtonBackgroundSelected";
			self.comboboxSelectorTextNormalClassName_str = self.props_obj.comboboxSelectorTextNormalClassName || "";
			self.comboboxSelectorTextNormalClassName_str = "";
			self.comboboxSelectorTextSeectedClassName_str = self.props_obj.comboboxSelectorTextSeectedClassName || "";
			self.comboboxSelectorTextSeectedClassName_str = "ISPMenuButtonTextSelected";
			self.menuBackgroundClass_str = self.props_obj.menuBackgroundClassName || ""; 
			self.menuBackgroundClass_str = "ISPMenuBackground";
			self.menuButtonBackgroundNormalClassName_str = self.props_obj.menuButtonBackgroundNormalClassName || "";
			self.menuButtonBackgroundNormalClassName_str = "ISPMenuButtonBackgroundNormal";
			self.menuButtonBackgroundSelectedClassName_str = self.props_obj.menuButtonBackgroundSelectedClassName || "";
			self.menuButtonBackgroundSelectedClassName_str = "ISPMenuButtonBackgroundSelected";
			self.menuButtonTextNormalClassName_str = self.props_obj.menuButtonTextNormalClassName || "";
			self.menuButtonTextNormalClassName_str = "ISPMenuButtonTextNormal";
			self.menuButtonTextSeectedClassName_str = self.props_obj.menuButtonTextSeectedClassName || "";
			self.menuButtonTextSeectedClassName_str = "ISPMenuButtonTextSelected";
			self.menuButtonsSpacersClassName_str = self.props_obj.menuButtonsSpacersClassName || "";
			self.menuButtonsSpacersClassName_str = "ISPMenuButtonsSpacers";
			
			self.thumbnailMaxWidth = self.props_obj.thumbnailMaxWidth || 280;
			if(self.thumbnailMaxWidth < 20) self.thumbnailMaxWidth = 20;
			self.thumbnailMaxHeight = self.props_obj.thumbnailMaxHeight || 240;
			if(self.thumbnailMaxHeight < 20) self.thumbnailMaxHeight = 20;
			self.thumbnailOverlayOpacity = self.props_obj.thumbnailOverlayOpacity == undefined ? 1 : self.props_obj.thumbnailOverlayOpacity;
			self.spaceBetweenThumbanilIcons = self.props_obj.spaceBetweenThumbanilIcons || 5;
			self.spaceBetweenTextAndIcons = self.props_obj.spaceBetweenTextAndIcons || 0;

			self.menuButtonSpacerHeight = self.props_obj.menuButtonSpacerHeight || 0;
			self.thumbnailBorderSize = self.props_obj.thumbnailBorderSize || 0;
			self.thumbnailBorderRadius = self.props_obj.thumbnailBorderRadius || 0;
			self.loadMoreButtonOffsetTop = self.props_obj.loadMoreButtonOffsetTop || 0;
			self.loadMoreButtonOffsetBottom = self.props_obj.loadMoreButtonOffsetBottom || 0;
			
			
			
			self.buttonsOffestY = 0;
			self.contentOffsetY = 0;

			self.startAtCategory_ar = [parseInt(self.props_obj.startAtCategory)];
	
			
			self.thumbnailIconWidth = self.props_obj.thumbnailIconWidth || 20;
			self.thumbnailIconHeight = self.props_obj.thumbnailIconHeight || 0;
			self.horizontalSpaceBetweenThumbnails = self.props_obj.horizontalSpaceBetweenThumbnails || 0;
			self.verticalSpaceBetweenThumbnails = self.props_obj.verticalSpaceBetweenThumbnails || 0;
			self.thumbnailsHorizontalOffset = self.props_obj.thumbnailsHorizontalOffset || 0;
			self.thumbnailsVerticalOffset = self.props_obj.thumbnailsVerticalOffset || 0;
			
		
			self.useIconButtons_bl = self.props_obj.useIconButtons;
			self.useIconButtons_bl = self.useIconButtons_bl == "yes" ? true : false;
		
			self.disableThumbnailsInteractivity_bl = self.props_obj.disableThumbnailsInteractivity;
			self.disableThumbnailsInteractivity_bl = self.disableThumbnailsInteractivity_bl == "yes" ? true : false;
			
			self.disableThumbnails_bl = self.props_obj.disableThumbnails; 
			self.disableThumbnails_bl = self.disableThumbnails_bl == "no" ? false : true;

			self.useThumbnailSlideshow_bl = self.props_obj.useThumbnailSlideshow; 
			self.useThumbnailSlideshow_bl = self.useThumbnailSlideshow_bl == "yes" ? true : false;

			self.prelaoderAllScreen_bl = self.props_obj.prelaoderAllScreen; 
			self.prelaoderAllScreen_bl = self.prelaoderAllScreen_bl == "yes" ? true : false;
			
			self.addMouseWheelSupport_bl = self.props_obj.addMouseWheelSupport; 
			self.addMouseWheelSupport_bl = self.addMouseWheelSupport_bl == "yes" ? true : false;
			
			self.addLightBoxKeyboardSupport_bl = self.props_obj.addLightBoxKeyboardSupport; 
			self.addLightBoxKeyboardSupport_bl = self.addLightBoxKeyboardSupport_bl == "no" ? false : true;
			
			self.showLighBoxNextAndPrevButtons_bl = self.props_obj.showLightBoxNextAndPrevButtons; 
			self.showLighBoxNextAndPrevButtons_bl = self.showLighBoxNextAndPrevButtons_bl == "no" ? false : true;
			
			self.showLightBoxZoomButton_bl = self.props_obj.showLightBoxZoomButton; 
			self.showLightBoxZoomButton_bl = self.showLightBoxZoomButton_bl == "no" ? false : true;
			
			self.showLightBoxInfoButton_bl = self.props_obj.showLightBoxInfoButton;
			self.showLightBoxInfoButton_bl = self.showLightBoxInfoButton_bl == "no" ? false : true;
			
			self.showLighBoxSlideShowButton_bl =  self.props_obj.showLighBoxSlideShowButton;
			self.showLighBoxSlideShowButton_bl =  self.showLighBoxSlideShowButton_bl == "no" ? false : true;
		
			self.showAllCategories_bl = self.props_obj.showAllCategories;
			self.showAllCategories_bl = self.showAllCategories_bl == "yes" ? true : false;
			
			self.keepThumbnailsOriginalSizeOnGridStart_bl = self.props_obj.keepThumbnailsOriginalSizeOnGridStart;
			self.keepThumbnailsOriginalSizeOnGridStart_bl = self.keepThumbnailsOriginalSizeOnGridStart_bl == "yes" ? true : false;
		
			self.randomizeSlider_bl = self.props_obj.randomizeSlider;
			self.randomizeSlider_bl = self.randomizeSlider_bl == "yes" ? true : false;
			
			self.animateParent_bl = self.props_obj.animateParent;
			self.animateParent_bl = self.animateParent_bl == "yes" ? true : false;
			
			
			self.showMenu_bl = self.props_obj.showMenu;
			self.showMenu_bl = self.showMenu_bl == "yes" ? true : false;
			
			self.showMenuButtonsSpacers_bl = self.props_obj.showMenuButtonsSpacers;
			self.showMenuButtonsSpacers_bl = self.showMenuButtonsSpacers_bl == "yes" ? true : false;
			
			self.scaleImage_bl = self.scaleImage == "no" ? false : true;	
			
			//#################################//
			//create galleries
			//#################################//
			self.playListElement = FWDVSUtils.getChildById(self.props_obj.galleryId);
			if(!self.playListElement){
				self.galleryErrorHandler();
				return;
			}
			
			self.allGalleries_ar = FWDVSUtils.getChildren(self.playListElement);
			
			if(self.totalGalleries <= 1){
				self.showAllCategories_bl = false;
			}
			
			setTimeout(function(){
				self.dispatchEvent(FWDVSData.PRELOADER_LOAD_DONE);
				self.totalGraphics = self.skinPaths_ar.length;	
				self.loadHTMLPlaylist(self.allGalleries_ar);
				self.dispatchEvent(FWDVSData.LOAD_DONE);
			}, 50);
		
		};
	
		this.galleryErrorHandler = function(){
			var info_str;
			info_str = "Playlist div with the id! - <font color='#FF0000'>" + self.props_obj.galleryId + "</font> doesn't exists.";
			
			self.isPlaylistDispatchingError_bl = true;
			showLoadPlaylistErrorId_to = setTimeout(function(){
				self.dispatchEvent(FWDVSData.LOAD_ERROR, {text:info_str});
				self.isPlaylistDispatchingError_bl = false;
			}, 50);
			return;
		};
		
		//######################################//
		/* Load html gallery */
		//#####################################//
		this.loadHTMLPlaylist = function(allGalleries_ar){
			
			var curPlaylist_ar;
			self.parsedPlaylist_ar = [];
			self.lightboxParsedPlaylist_ar = [];
			var totalItems;
			var curCat;
			var curItem;
			var titleText_str;

			curPlaylist_ar = allGalleries_ar;
			
			self.cats = [{'label':self.allCategoriesLabel_str, 'tt':0}];
			var categories = FWDVSUtils.getChildren(curPlaylist_ar[0]);
			for(var i=0; i<categories.length; i++){
				self.categories_ar[i] = categories[i].innerHTML;
				self.cats.push({'label':self.categories_ar[i], 'tt':0});
			}
			curPlaylist_ar.splice(0,1);

			totalItems = curPlaylist_ar.length;
			curItem = 0;

			self.cats[0].tt = totalItems;
			
			for(var i=0; i<totalItems; i++){
				var obj = {};
				var ch = curPlaylist_ar[i];
				var test;
				titleText_str = "";
				curItem = i;
				
				if(!FWDVSUtils.hasAttribute(ch, "data-url")){
					errorMessage_str = "Attribute <font color='#FF0000'>data-url</font> is not found in the gallery at position nr: <font color='#FF0000'>" + i + "</font>.";
					self.dispatchEvent(FWDVSData.LOAD_ERROR, {text:errorMessage_str});
					return;
				}
				
				var contentCh = FWDVSUtils.getChildren(ch);
				var categories = FWDVSUtils.getChildren(contentCh[0]);
				obj.cats = [];
				for(var x=0; x<categories.length; x++ ){
					obj.cats.push(categories[x].innerText);
				}

				var slideshow = FWDVSUtils.getChildren(contentCh[1]);
				obj.slideshow = [];
				for(var x=0; x<slideshow.length; x++ ){
					obj.slideshow.push(slideshow[x].innerText);
				}

				obj.url = String(FWDVSUtils.getAttributeValue(ch, "data-url"));
				obj.target = FWDVSUtils.getAttributeValue(ch, "data-target") || "_self";
				obj.wSize = Number(FWDVSUtils.getAttributeValue(ch, "data-size-width")) || 1;
				obj.hSize = Number(FWDVSUtils.getAttributeValue(ch, "data-size-height")) || 1;

				var ch2;
				var hasThumbnail_bl = false;
				obj.searchText = '';
				for(var k=0; k<contentCh.length; k++){
					ch2 = contentCh[k];
					
					if(FWDVSUtils.hasAttribute(ch2, "src")){
						hasThumbnail_bl = true;
						obj.thumbnailPath_str = FWDVSUtils.getAttributeValue(ch2, "src");
						obj.alt_str = FWDVSUtils.getAttributeValue(ch2, "alt") || "";
					}
					if(FWDVSUtils.hasAttribute(ch2, "data-title")){
						obj.title = ch2.innerHTML;
						obj.searchText += obj.title;
					}

					if(FWDVSUtils.hasAttribute(ch2, "data-client")){
						obj.client = ch2.innerHTML;
						obj.searchText += ch2.innerText;
					}

					if(FWDVSUtils.hasAttribute(ch2, "data-likes")){
						obj.likes = ch2.innerHTML;
					}

					if(FWDVSUtils.hasAttribute(ch2, "data-thumbnail-extra-content")){
						obj.searchText += ch2.innerText;
						titleText_str += ch2.innerText || ch2.textContent;
						obj.htmlExtraContent_str = ch2.innerHTML;
						self.hasExtraText_bl = true;
						obj.searchText = />(.*)</.exec(obj.htmlExtraContent_str)[1];
					}

				}
				
				if(!hasThumbnail_bl){
					errorMessage_str = "Thumbnail image is not found at category: <font color='#FF0000'>" + (curCat + 1) + "</font> at position nr: <font color='#FF0000'>" + (curItem + 1) + "</font>";
					self.dispatchEvent(FWDVSData.LOAD_ERROR, {text:errorMessage_str});
					return;
				}
				
				
				if(obj.type_str == FWDVS.IMAGE_TYPE || obj.type_str == FWDVS.VIDEO_TYPE){
					var firstUrlPath = encodeURI(obj.url.substr(0,obj.url.lastIndexOf("/") + 1));
					var secondUrlPath = encodeURIComponent(obj.url.substr(obj.url.lastIndexOf("/") + 1));
					obj.url = firstUrlPath + secondUrlPath;
				}
				self.parsedPlaylist_ar.push(obj);
			}

			for(var i=0; i<self.categories_ar.length; i++){
				var curCat = self.categories_ar[i];
				
				for(var j=0; j<self.parsedPlaylist_ar.length; j++){
					for(var k=0; k<self.parsedPlaylist_ar[j].cats.length; k++){
						if(curCat == self.parsedPlaylist_ar[j].cats[k]){
							self.cats[i+1].tt ++;
						} 
					}
				}
			}

			start:for(var i=0; i<self.categories_ar.length; i++){
				var hasCat = false;
				var curCat = self.categories_ar[i];
				for(var j=0; j<self.parsedPlaylist_ar.length; j++){
					for(var k=0; k<self.parsedPlaylist_ar[j].cats.length; k++){
						if(curCat == self.parsedPlaylist_ar[j].cats[k]){
							hasCat = true;
							continue start;
						} 
					}
				}
				if(!hasCat){
					//self.categories_ar.splice(i, 1);
					i--;
				}
			}
			
			self.catsCount = [];
			for(var i=0; i<self.categories_ar.length; i++){
				var obj_ar = [];
				var curCat = self.categories_ar[i];
				start:for(var j=0; j<self.parsedPlaylist_ar.length; j++){
					for(var k=0; k<self.parsedPlaylist_ar[j].cats.length; k++){
						if(curCat == self.parsedPlaylist_ar[j].cats[k]){
							obj_ar.push(i);
							continue start;
						} 
					}
				}
				self.catsCount.push(obj_ar);
			}
			console.log(self.catsCount)

			self.finalCatsCount = [];
			var countCats = 0;
			for(var i=0; i<self.catsCount.length; i++){
				if(i == 0){
					self.finalCatsCount.push(0);
					countCats = self.catsCount[i].length;
				}else{
					self.finalCatsCount.push(countCats);
					countCats += self.catsCount[i].length;
				}
			}
			console.log(self.finalCatsCount)
			
			if(self.categories_ar.length <= 1) self.showMenu_bl = false;
			
			self.finalizePlaylist();
			
			try{
				self.playListElement.parentNode.removeChild(self.playListElement);
			}catch(e){};
		};
		
		
		this.finalizePlaylist = function(){
			
			var lightboxParsedPlaylist_ar = [];
			self.gallery_ar = {galleryItems:self.parsedPlaylist_ar};
			
			if(self.randomizeSlider_bl) self.gallery_ar.galleryItems = FWDVSUtils.randomizeArray(self.gallery_ar.galleryItems);
			
			for(var i=0; i<self.gallery_ar.galleryItems.length; i++){
				if(self.gallery_ar.galleryItems[i].type_str != FWDVS.LINK 
				   && self.gallery_ar.galleryItems[i].type_str != FWDVS.NONE){
					lightboxParsedPlaylist_ar.push(self.gallery_ar.galleryItems[i]);
				}
			}
			
			if(self.showAllCategories_bl){
				self.categories_ar.splice(0,0, self.allCategoriesLabel_str);
			}

			self.catsLength_ar = [];
			for (var i=0; i<self.categories_ar.length; i++){
				self.catsLength_ar[i] = 0;
			}
			
			for (var i=0; i< self.gallery_ar.galleryItems.length; i++){
				if(self.showAllCategories_bl){
					self.catsLength_ar[0]++;
					self.catsLength_ar[self.gallery_ar.galleryItems[i].catId + 1]++;
				}else{
					self.catsLength_ar[self.gallery_ar.galleryItems[i].catId]++;
				}
			}
			
			self.lightboxPlaylist_ar = {galleryItems:lightboxParsedPlaylist_ar};
		};
	
		this.init();
	};
	
	/* set prototype */
	FWDVSData.setPrototype = function(){
		FWDVSData.prototype = new FWDVSEventDispatcher();
	};
	
	FWDVSData.isSoundCloud_bl = false;
	FWDVSData.isFaceBook_bl = false;
	FWDVSData.prototype = null;
	FWDVSData.PRELOADER_LOAD_DONE = "onPreloaderLoadDone";
	FWDVSData.LOAD_DONE = "onLoadDone";
	FWDVSData.LOAD_ERROR = "onLoadError";
	FWDVSData.LIGHBOX_CLOSE_BUTTON_LOADED = "onLightBoxCloseButtonLoadDone";
	
	window.FWDVSData = FWDVSData;
}(window));/* Image manager */
(function (window){
	
	var FWDVSDescriptionWindow = function(
			parent,
			descriptionAnimationType,
			descriptionWindowPosition,
			margins,
			backgroundColor_str,
			backgroundOpacity
			){
		
		var self = this;
		var prototype = FWDVSDescriptionWindow.prototype;
		
		this.main_do;
		this.text_do;
		this.bk_do;
		
		this.descriptionAnimationType_str = descriptionAnimationType;
		this.backgroundColor_str = backgroundColor_str;
		this.position_str = descriptionWindowPosition;
		
		this.backgroundOpacity = backgroundOpacity;
		this.margins = margins;
		this.finalW = 0;
		this.finalH = 0;
		this.finalY = 0;

		this.resizeWithDelayId_to;
		
		this.isShowedFirstTime_bl = false;
		this.isShowed_bl = false;
		this.isHiddenDone_bl = true;
		
		self.init = function(){
			//self.setBkColor("#00FF00");
			self.setupMainContainers();
		};
		
		//#####################################//
		/* setup main containers */
		//####################################//
		self.setupMainContainers = function(){
			
			self.main_do = new FWDVSDisplayObject("div");
			self.main_do.getStyle().width = "100%";
			self.main_do.getStyle().height = "100%";
			self.main_do.setBackfaceVisibility();
			if(!self.isMobile_bl && FWDVSUtils.isChrome){
				self.main_do.hasTransform3d_bl =  false;
				self.main_do.hasTransform2d_bl =  false;
			}
			
			self.text_do = new FWDVSDisplayObject("div");
			self.text_do.getStyle().fontSmoothing = "antialiased";
			self.text_do.getStyle().webkitFontSmoothing = "antialiased";
			self.text_do.getStyle().textRendering = "optimizeLegibility";
			self.text_do.getStyle().width = "100%";
			self.text_do.setBackfaceVisibility();
			self.text_do.hasTransform3d_bl =  false;
			self.text_do.hasTransform2d_bl =  false;
			
			self.bk_do = new FWDVSDisplayObject("div");
			self.bk_do.setResizableSizeAfterParent();
			self.bk_do.setBkColor(self.backgroundColor_str);
			self.bk_do.setAlpha(self.backgroundOpacity);
			self.bk_do.setBackfaceVisibility();
			if(!self.isMobile_bl && FWDVSUtils.isChrome){
				self.bk_do.hasTransform3d_bl =  false;
				self.bk_do.hasTransform2d_bl =  false;
			}
			
			self.main_do.addChild(self.bk_do);
			self.main_do.addChild(self.text_do);
			self.addChild(self.main_do);
		};
		
		//#####################################//
		/* set text */
		//####################################//
		self.setText = function(pText){
			self.text_do.setInnerHTML(pText);
			self.resizeAndPosition();
		};
		
		self.resizeAndPosition = function(finalW, overwrite){
			if(finalW) self.finalW = finalW;
			self.finalH = self.text_do.getHeight();
			self.setFinalSize();
			clearTimeout(self.resizeWithDelayId_to);
			self.resizeWithDelayId_to = setTimeout(self.setFinalSize, 50);
			
		};
		
		self.setFinalSize = function(){
			self.finalH = self.text_do.getHeight();
			
			if(self.position_str == "top"){
				self.finalY = self.margins;
			}else{
				self.finalY = parent.mainItemHolder_do.h - self.finalH - self.margins;
			}
			
		
			self.setX(self.margins);
			self.setY(self.finalY);
			self.setWidth(self.finalW);
			self.main_do.setHeight(self.finalH);
			self.setHeight(self.finalH);
		};
		
		//#####################################//
		/* hide / show */
		//####################################//
		self.hide = function(animate, overwrite, isShowedFirstTime){
			if(!self.isShowed_bl && !overwrite) return;
			self.isShowed_bl = false;
			if(isShowedFirstTime) self.isShowedFirstTime_bl = false;
			FWDAnimation.killTweensOf(self.main_do);
			if(animate){
				if(self.descriptionAnimationType_str == "motion"){
					if(self.position_str == "top"){
						FWDAnimation.to(self.main_do, .8, {y:-self.finalH, ease:Expo.easeInOut, onComplete:self.hideComplete});
					}else{
						FWDAnimation.to(self.main_do, .8, {y:self.finalH, ease:Expo.easeInOut, onComplete:self.hideComplete});
					}
				}else{
					FWDAnimation.to(self.main_do, .8, {alpha:0, ease:Quint.easeOut, onComplete:self.hideComplete});
				}
			}else{
				self.hideComplete();
			}
		};
		
		self.hideComplete = function(){
			self.setVisible(false);
			if(self.descriptionAnimationType_str == "motion"){
				if(self.position_str == "top"){
					self.main_do.setY(-self.finalH);
				}else{
					self.main_do.setY(self.finalH);
				}
			}else{
				self.main_do.setAlpha(0);
			}
		};
		
		self.show = function(animate){
			if(self.isShowed_bl) return;
			self.isShowed_bl = true;
	
			if(!self.isShowedFirstTime_bl){
				self.isShowedFirstTime_bl = true;
				self.hideComplete();
				self.resizeAndPosition();
			}
			self.setVisible(true);
			
			FWDAnimation.killTweensOf(self.main_do);
			if(self.descriptionAnimationType_str == "motion"){
				if(self.main_do.alpha != 1) self.main_do.setAlpha(1);
				if(animate){
					FWDAnimation.to(self.main_do, .8, {y:0, ease:Expo.easeInOut});
				}else{
					self.main_do.setY(0);
				}
			}else{
				self.main_do.setY(0);
				if(animate){
					FWDAnimation.to(self.main_do, .8, {alpha:1, ease:Quint.easeOut});
				}else{
					self.main_do.setAlpha(1);
				}
			}
		};
		
		
		
		self.init();
	};
	
	/* set prototype */
	FWDVSDescriptionWindow.setPrototype =  function(){
		FWDVSDescriptionWindow.prototype = new FWDVSDisplayObject("div");
	};


	FWDVSDescriptionWindow.HIDE_COMPLETE = "infoWindowHideComplete";

	FWDVSDescriptionWindow.prototype = null;
	window.FWDVSDescriptionWindow = FWDVSDescriptionWindow;
	
}(window));/* Display object */
(function (window){
	/*
	 * @ type values: div, img.
	 * @ positon values: relative, absolute.
	 * @ positon values: hidden.
	 * @ display values: block, inline-block, self applies only if the position is relative.
	 */
	var FWDVSDisplayObject = function(type, position, overflow, display){
		
		var self = this;
		self.listeners = {events_ar:[]};
		self.type = type;	
	
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
		
		this.hasTransform3d_bl =  FWDVSUtils.hasTransform3d;
		this.hasTransform2d_bl =  FWDVSUtils.hasTransform2d;
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
			self.screen.style.margin = "0px";
			self.screen.style.padding = "0px";
			self.screen.style.maxWidth = "none";
			self.screen.style.maxHeight = "none";
			self.screen.style.border = "none";
			self.screen.style.backfaceVisibility = "hidden";
			
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
				if(FWDVSUtils.isFirefox || FWDVSUtils.isIE){
					self.screen.style.userSelect = "element";
					self.screen.style.MozUserSelect = "element";
					self.screen.style.msUserSelect = "element";
				}else if(FWDVSUtils.isSafari){
					self.screen.style.userSelect = "text";
					self.screen.style.webkitUserSelect = "text";
				}else{
					self.screen.style.userSelect = "all";
					self.screen.style.webkitUserSelect = "all";
				}
				
				self.screen.style.khtmlUserSelect = "all";
				self.screen.style.oUserSelect = "all";
				
				if(FWDVSUtils.isIEAndLessThen9){
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
				self.children_ar.splice(FWDVSUtils.indexOfArray(self.children_ar, e), 1);
				self.children_ar.push(e);
				self.screen.appendChild(e.screen);
			}else{
				self.children_ar.push(e);
				self.screen.appendChild(e.screen);
			}
		};
		
		self.removeChild = function(e){
			if(self.contains(e)){
				self.children_ar.splice(FWDVSUtils.indexOfArray(self.children_ar, e), 1);
				self.screen.removeChild(e.screen);
			}else{
				//console.log(arguments.callee.caller.toString())
				throw Error("##removeChild()## Child dose't exist, it can't be removed!");
			};
		};

		self.removeAllChilds = function(){
			for(var i=0; i<self.getNumChildren(); i++){
				var removeChild = self.children_ar.splice(0, 1);
				self.screen.removeChild(removeChild);
				i--;
			}
		};
		
		self.contains = function(e){
			if(FWDVSUtils.indexOfArray(self.children_ar, e) == -1){
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
					self.children_ar.splice(FWDVSUtils.indexOfArray(self.children_ar, e), 1, e);
				}else{
					self.children_ar.splice(FWDVSUtils.indexOfArray(self.children_ar, e), 0, e);
				}
			}else{
				if(index < 0  || index > self.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
				
				self.screen.insertBefore(e.screen, self.children_ar[index].screen);
				if(self.contains(e)){
					self.children_ar.splice(FWDVSUtils.indexOfArray(self.children_ar, e), 1, e);
				}else{
					self.children_ar.splice(FWDVSUtils.indexOfArray(self.children_ar, e), 0, e);
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
				return FWDVSUtils.indexOfArray(self.children_ar, child);
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
	
	window.FWDVSDisplayObject = FWDVSDisplayObject;
}(window));/* Display object */
(function (window){
	/*
	 * @ type values: div, img.
	 * @ positon values: relative, absolute.
	 * @ positon values: hidden.
	 * @ display values: block, inline-block, this applies only if the position is relative.
	 */
	var FWDVSDisplayObject3D = function(type, position, overflow, display){
		
		this.listeners = {events_ar:[]};
		var self = this;
		
		if(type == "div" || type == "img" || type == "canvas"){
			this.type = type;	
		}else{
			throw Error("Type is not valid! " + type);
		}
	
		this.children_ar = [];
		this.style;
		this.screen;
		this.numChildren;
		this.transform;
		this.position = position || "absolute";
		this.overflow = overflow || "hidden";
		this.display = display || "block";
		this.visible = true;
		this.buttonMode;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.angleX = 0;
		this.angleY = 0;
		this.angleZ = 0;
		this.perspective = 0;
		this.zIndex = 0;
		this.scale = 1;
		this.w = 0;
		this.h = 0;
		this.rect;
		this.alpha = 1;
		this.innerHTML = "";
		this.opacityType = "";
		this.isHtml5_bl = false;
		
		this.hasTransform3d_bl = true;
		this.hasTransform2d_bl = true;
		
		//##############################//
		/* init */
		//#############################//
		this.init = function(){
			this.setScreen();
		};	
		
		//######################################//
		/* check if it supports transforms. */
		//######################################//
		this.getTransform = function() {
		    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform'];
		    var p;
		    while (p = properties.shift()) {
		       if (typeof this.screen.style[p] !== 'undefined') {
		            return p;
		       }
		    }
		    return false;
		};
		
		//######################################//
		/* set opacity type */
		//######################################//
		this.getOpacityType = function(){
			var opacityType;
			if (typeof this.screen.style.opacity != "undefined") {//ie9+ 
				opacityType = "opacity";
			}else{ //ie8
				opacityType = "filter";
			}
			return opacityType;
		};
		
		//######################################//
		/* setup main screen */
		//######################################//
		this.setScreen = function(element){
			if(this.type == "img" && element){
				this.screen = element;
				this.setMainProperties();
			}else{
				this.screen = document.createElement(this.type);
				this.setMainProperties();
			}
		};
		
		//########################################//
		/* set main properties */
		//########################################//
		this.setMainProperties = function(){
			
			this.transform = this.getTransform();
			this.setPosition(this.position);
			//this.setDisplay(this.display);
			this.setOverflow(this.overflow);
			this.opacityType = this.getOpacityType();
			
			if(this.opacityType == "opacity") this.isHtml5_bl = true;
			
			if(self.opacityType == "filter") self.screen.style.filter = "inherit";
			
			this.screen.style.left = "0px";
			this.screen.style.top = "0px";
			this.screen.style.margin = "0px";
			this.screen.style.padding = "0px";
			this.screen.style.maxWidth = "none";
			this.screen.style.maxHeight = "none";
			this.screen.style.border = "none";
			this.screen.style.lineHeight = "1";
			this.screen.style.backgroundColor = "transparent";
			this.screen.style.backfaceVisibility = "hidden";
			this.screen.style.webkitBackfaceVisibility = "hidden";
			this.screen.style.MozBackfaceVisibility = "hidden";
			
			if(type == "img"){
				this.setWidth(this.screen.width);
				this.setHeight(this.screen.height);
				this.screen.onmousedown = function(e){return false;};
			}
		};
		
		self.setBackfaceVisibility =  function(){
			self.screen.style.backfaceVisibility = "visible";
			self.screen.style.webkitBackfaceVisibility = "visible";
			self.screen.style.MozBackfaceVisibility = "visible";		
		};
		
		self.removeBackfaceVisibility =  function(){
			self.screen.style.backfaceVisibility = "hidden";
			self.screen.style.webkitBackfaceVisibility = "hidden";
			self.screen.style.MozBackfaceVisibility = "hidden";		
		};
		
		//###################################################//
		/* set / get various peoperties.*/
		//###################################################//
		this.setSelectable = function(val){
			if(!val){
				try{this.screen.style.userSelect = "none";}catch(e){};
				try{this.screen.style.MozUserSelect = "none";}catch(e){};
				try{this.screen.style.webkitUserSelect = "none";}catch(e){};
				try{this.screen.style.khtmlUserSelect = "none";}catch(e){};
				try{this.screen.style.oUserSelect = "none";}catch(e){};
				try{this.screen.style.msUserSelect = "none";}catch(e){};
				try{this.screen.msUserSelect = "none";}catch(e){};
				this.screen.ondragstart = function(e){return  false;};
				this.screen.onselectstart = function(){return false;};
				this.screen.style.webkitTouchCallout='none';
			}
		};
		
		this.getScreen = function(){
			return self.screen;
		};
		
		this.setVisible = function(val){
			this.visible = val;
			if(this.visible == true){
				this.screen.style.visibility = "visible";
			}else{
				this.screen.style.visibility = "hidden";
			}
		};
		
		this.getVisible = function(){
			return this.visible;
		};
			
		this.setResizableSizeAfterParent = function(){
			this.screen.style.width = "100%";
			this.screen.style.height = "100%";
		};
		
		this.getStyle = function(){
			return this.screen.style;
		};
		
		this.setOverflow = function(val){
			self.overflow = val;
			self.screen.style.overflow = self.overflow;
		};
		
		this.setPosition = function(val){
			self.position = val;
			self.screen.style.position = self.position;
		};
		
		this.setDisplay = function(val){
			this.display = val;
			this.screen.style.display = this.display;
		};
		
		this.setButtonMode = function(val){
			this.buttonMode = val;
			if(this.buttonMode ==  true){
				this.screen.style.cursor = "pointer";
			}else{
				this.screen.style.cursor = "default";
			}
		};
		
		this.setBkColor = function(val){
			self.screen.style.backgroundColor = val;
		};
		
		this.setInnerHTML = function(val){
			self.innerHTML = val;
			self.screen.innerHTML = self.innerHTML;
		};
		
		this.getInnerHTML = function(){
			return self.innerHTML;
		};
		
		this.getRect = function(){
			return self.screen.getBoundingClientRect();
		};
		
		this.setAlpha = function(val){
			self.alpha = val;
			if(self.opacityType == "opacity"){
				self.screen.style.opacity = self.alpha;
			}else if(self.opacityType == "filter"){
				self.screen.style.filter = "alpha(opacity=" + self.alpha * 100 + ")";
				self.screen.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(self.alpha * 100) + ")";
			}
		};
		
		this.getAlpha = function(){
			return self.alpha;
		};
		
		this.getRect = function(){
			return this.screen.getBoundingClientRect();
		};
		
		this.getGlobalX = function(){
			return this.getRect().left;
		};
		
		this.getGlobalY = function(){
			return this.getRect().top;
		};
		
		this.setX = function(val){
			self.x = val;
			if(self.hasTransform3d_bl){
				self.screen.style[self.transform] = "translate3d(" + self.x + "px," + self.y + "px," + self.z + "px) rotateX(" + self.angleX + "deg) rotateY(" + self.angleY + "deg) rotateZ(" + self.angleZ + "deg)";
			}else if(self.hasTransform2d_bl){
				self.screen.style[self.transform] = "translate(" + self.x + "px," + self.y + "px) scale(" + self.scale + " , " + self.scale + ")";
			}else{
				self.screen.style.left = self.x + "px";
			}
		};
		
		this.getX = function(){
			return  self.x;
		};
		
		this.setY = function(val){
			self.y = val;
			if(self.hasTransform3d_bl){
				self.screen.style[self.transform] = "translate3d(" + self.x + "px," + self.y + "px," + self.z + "px) rotateX(" + self.angleX + "deg) rotateY(" + self.angleY + "deg) rotateZ(" + self.angleZ + "deg)";
			}else if(self.hasTransform2d_bl){
				self.screen.style[self.transform] = "translate(" + self.x + "px," + self.y + "px) scale(" + self.scale + " , " + self.scale + ")";
			}else{
				self.screen.style.top = self.y + "px";
			}
		};
		
		this.getY = function(){
			return  self.y;
		};
		
		this.setZ = function(val){
			self.z = val;
			if(self.hasTransform3d_bl){
				self.screen.style[self.transform] = "translate3d(" + self.x + "px," + self.y + "px," + self.z + "px) rotateX(" + self.angleX + "deg) rotateY(" + self.angleY + "deg) rotateZ(" + self.angleZ + "deg)";
			}
		};
		
		this.getZ = function(){
			return  self.z;
		};
		
		this.setAngleX = function(val){
			self.angleX = val;
			if(self.hasTransform3d_bl){
				self.screen.style[self.transform] = "translate3d(" + self.x + "px," + self.y + "px," + self.z + "px) rotateX(" + self.angleX + "deg) rotateY(" + self.angleY + "deg) rotateZ(" + self.angleZ + "deg)";
			}
		};
		
		this.getAngleX = function(){
			return  self.angleX;
		};
		
		this.setAngleY = function(val){
			self.angleY = val;
			if(self.hasTransform3d_bl){
				self.screen.style[self.transform] = "translate3d(" + self.x + "px," + self.y + "px," + self.z + "px) rotateX(" + self.angleX + "deg) rotateY(" + self.angleY + "deg) rotateZ(" + self.angleZ + "deg)";
			}
		};
		
		this.getAngleY = function(){
			return  self.angleY;
		};
		
		this.setAngleZ = function(val){
			self.angleZ = val;
			if(self.hasTransform3d_bl){
				self.screen.style[self.transform] = "translate3d(" + self.x + "px," + self.y + "px," + self.z + "px) rotateX(" + self.angleX + "deg) rotateY(" + self.angleY + "deg) rotateZ(" + self.angleZ + "deg)";
			}
		};
		
		this.getAngleZ = function(){
			return  self.angleZ;
		};
		
		this.setScale2 = function(val){
			self.scale = val;
			if(self.hasTransform2d_bl){
				self.screen.style[self.transform] = "translate(" + self.x + "px," + self.y + "px) scale(" + self.scale + " , " + self.scale + ")";
			}
		};
		
		this.getScale = function(){
			return  self.scale;
		};
		
		this.setPerspective = function(val){
			self.perspective = val;
			self.screen.style.perspective = self.perspective + "px";
			self.screen.style.WebkitPerspective = self.perspective + "px";
			self.screen.style.MozPerspective = self.perspective + "px";
			self.screen.style.msPerspective = self.perspective + "px";
			self.screen.style.OPerspective = self.perspective + "px";
		};
		
		this.setPreserve3D = function(){
			this.screen.style.transformStyle = "preserve-3d";
			this.screen.style.WebkitTransformStyle = "preserve-3d";
			this.screen.style.MozTransformStyle = "preserve-3d";
			this.screen.style.msTransformStyle = "preserve-3d";
			this.screen.style.OTransformStyle = "preserve-3d";
		};
		
		this.setZIndex = function(val)
		{
			self.zIndex = val;
			self.screen.style.zIndex = self.zIndex;
		};
		
		this.getZIndex = function()
		{
			return self.zIndex;
		};
		
		this.setWidth = function(val){
			self.w = val;
			if(self.type == "img"){
				self.screen.width = self.w;
			}else{
				self.screen.style.width = self.w + "px";
			}
		};
		
		this.getWidth = function(){
			if(self.type == "div"){
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
		
		this.setHeight = function(val){
			self.h = val;
			if(self.type == "img"){
				self.screen.height = self.h;
			}else{
				self.screen.style.height = self.h + "px";
			}
		};
		
		this.getHeight = function(){
			if(self.type == "div"){
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
		
		this.getNumChildren = function(){
			return self.children_ar.length;
		};
		
		//#####################################//
		/* DOM list */
		//#####################################//
		this.addChild = function(e){
			if(this.contains(e)){	
				this.children_ar.splice(FWDVSUtils.indexOfArray(this.children_ar, e), 1);
				this.children_ar.push(e);
				this.screen.appendChild(e.screen);
			}else{
				this.children_ar.push(e);
				this.screen.appendChild(e.screen);
			}
		};
		
		this.removeChild = function(e){
			if(this.contains(e)){
				this.children_ar.splice(FWDVSUtils.indexOfArray(this.children_ar, e), 1);
				this.screen.removeChild(e.screen);
			}else{
				throw Error("##removeChild()## Child doesn't exist, it can't be removed!");
			};
		};
		
		this.contains = function(e){
			if(FWDVSUtils.indexOfArray(this.children_ar, e) == -1){
				return false;
			}else{
				return true;
			}
		};
		
		this.addChildAtZero = function(e){
			if(this.numChildren == 0){
				this.children_ar.push(e);
				this.screen.appendChild(e.screen);
			}else{
				this.screen.insertBefore(e.screen, this.children_ar[0].screen);
				if(this.contains(e)){this.children_ar.splice(FWDVSUtils.indexOfArray(this.children_ar, e), 1);}	
				this.children_ar.unshift(e);
			}
		};
		
		this.getChildAt = function(index){
			if(index < 0  || index > this.numChildren -1) throw Error("##getChildAt()## Index out of bounds!");
			if(this.numChildren == 0) throw Errror("##getChildAt## Child dose not exist!");
			return this.children_ar[index];
		};
		
		this.removeChildAtZero = function(){
			this.screen.removeChild(this.children_ar[0].screen);
			this.children_ar.shift();
		};
		
	    
	    //###########################################//
	    /* destroy methods*/
	    //###########################################//
		this.disposeImage = function(){
			if(this.type == "img") this.screen.src = "";
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
		
	    /* init */
		this.init();
	};
	
	window.FWDVSDisplayObject3D = FWDVSDisplayObject3D;
}(window));(function (){
	
	var FWDVSEventDispatcher = function (){
		
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
	
	window.FWDVSEventDispatcher = FWDVSEventDispatcher;
}(window));/* Info screen */
(function (window){
	
	var FWDVSInfo = function(parent, warningIconPath){
		
		var self = this;
		var prototype = FWDVSInfo.prototype;
	
		this.textHolder_do = null;
		this.img_do;
		
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
		
			self.getStyle().width = "80%";
		
			self.textHolder_do = new FWDVSDisplayObject("div");
			if(!FWDVSUtils.isIEAndLessThen9) self.textHolder_do.getStyle().font = "Arial";
			self.textHolder_do.getStyle().wordWrap = "break-word";
			self.textHolder_do.getStyle().padding = "10px";
			self.textHolder_do.getStyle().paddingLeft = "42px";
			self.textHolder_do.getStyle().lineHeight = "18px";
			self.textHolder_do.setBkColor("#EEEEEE");
			
			var img_img = new Image();
			img_img.src = this.warningIconPath_str;
			this.img_do = new FWDVSDisplayObject("img");
			this.img_do.setScreen(img_img);
			this.img_do.setWidth(28);
			this.img_do.setHeight(28);
			
			
			self.addChild(self.textHolder_do);
			self.addChild(self.img_do);
		};
		
		this.showText = function(txt){
			if(!self.isShowedOnce_bl){
				window.addEventListener("click", self.closeWindow);
				self.isShowedOnce_bl = true;
			}
			
			//self.setX(-800);
			//if(self.allowToRemove_bl){
			//	self.textHolder_do.setInnerHTML(txt  + "<p style='margin:0px; padding-bottom:10px;'><font color='#FFFFFF'>Click or tap to close this window.</font>");
		//	}else{
				
				self.textHolder_do.setInnerHTML(txt);
			//}
			
			clearTimeout(self.show_to);
			self.show();
		};
		
		this.show = function(){
			self.isShowed_bl = true;
			self.setVisible(true);
			setTimeout(function(){
				self.positionAndResize();
			}, 60);
		};
		
		this.positionAndResize = function(){		
			self.setHeight(self.textHolder_do.getHeight());
			self.img_do.setX(6);
			self.img_do.setY(parseInt((self.h - self.img_do.h)/2));
	
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
	FWDVSInfo.setPrototype = function(){
		FWDVSInfo.prototype = new FWDVSDisplayObject("div", "relative");
	};
	
	FWDVSInfo.prototype = null;
	window.FWDVSInfo = FWDVSInfo;
}(window));/* FWDVSMenu */
(function (window){
	
	var FWDVSMenu = function(data, parent){
		
		var self = this;
		var prototype = FWDVSMenu.prototype;
		
		this.categories_ar = data.categories_ar;
		this.buttons_ar = [];
		this.buttonsOriginal_ar = [];
		this.spacers_ar = [];
		this.catId_ar =  data.startAtCategory_ar;
		
		this.allCategoriesButton_do;
		
		this.buttonsHolder_do;
		this.comboboxSelectorLabel_str = data.comboboxSelectorLabel_str;
		this.menuButtonsSpacersClassName_str = data.menuButtonsSpacersClassName_str;
		this.menuButtonSpacerHeight = data.menuButtonSpacerHeight;
		
		this.curId = this.catId_ar[0];

		this.totalButtons = self.categories_ar.length;
		this.selectorOriginalWidth = 0;
		this.stageWidth = 0;
		this.stageHeight = 0;
		
		this.isComboboxShowed_bl = false;
		this.showAllCategories_bl = data.showAllCategories_bl;
		this.showAllCategories2_bl = false;
		
		this.showMenuButtonsSpacers_bl = data.showMenuButtonsSpacers_bl;
		this.isShowed_bl = data.showMenu_bl;
		this.isMobile_bl = FWDVSUtils.isMobile;
		this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent;
	
		this.init = function(){
			this.screen.className = 'p-selector fwd-hide';

			setTimeout(function(){
				self.screen.className = 'p-selector fwd-hide';
			},50);
			
			this.setupButtons();
			this.setButtonsLabels();
			this.setButtons(this.catId_ar[0]);
			if(this.showMenuButtonsSpacers_bl) this.setupSpacers();
			this.setupCombobox();
			this.updateMenuStyle();
			
			setTimeout(function(){
				self.resizeAndPosition();
			}, 500);
			if(self.categories_ar.length <=2){
				//self.setX(-5000);
			} 
		};
		
		//#######################################//
		/* Resize and position */
		//#######################################//
		this.resizeAndPosition = function(){
			
			self.stageWidth = parent.stageWidth;
			if(!self.isShowed_bl || self.stageWidth == 0) return;
			
			if(self.isOpened_bl) return;
			self.positionButtons();
			self.resizeSelector();
		};
		
		//#######################################//
		/* Setup combobox holders */
		//#######################################//
		this.setupCombobox = function(){
			
			this.mainButtonsHolder_do = new FWDVSDisplayObject("div", 'relative');
			this.bk_do = new FWDVSDisplayObject("div");
			this.bk_do.screen.className = 'p-buttons-background';
			this.buttonsHolder_do = new FWDVSDisplayObject("div");
			this.buttonsHolder_do.setX(-10000);
			
			this.arrow_do = new FWDVSTransformDisplayObject("div");
			this.arrow_do.setOverflow("visible");
			this.arrow_do.setDisplay("inline-block");
			this.arrow_do.getStyle().fontSmoothing = "antialiased";
			this.arrow_do.getStyle().webkitFontSmoothing = "antialiased";
			this.arrow_do.getStyle().textRendering = "optimizeLegibility";
			this.arrow_do.getStyle().whiteSpace = "nowrap";
			this.arrow_do.setBackfaceVisibility();
			this.arrow_do.getStyle().padding = "";
			this.arrow_do.getStyle().margin = "";
			this.arrow_do.getStyle().borderRight = "1px solid";
			this.arrow_do.getStyle().borderBottom = "1px solid";
			this.arrow_do.getStyle().top = 0;
			this.arrow_do.getStyle().left = 0;
			this.arrow_do.setWidth(10);
			this.arrow_do.setHeight(10);
			self.arrow_do.screen.className = 'arrow arrowNormal';

			FWDVSMenuButton.setPrototype();
			this.selector_do = new FWDVSMenuButton(
				self,
				"NOT DEFINED",
				10,
				'PGMenuSelectorTextNormal',
				'PGMenuSelectorTextSelected'
			);
			
			this.selector_do.addListener(FWDVSMenuButton.MOUSE_OVER, self.selectorOverHandler);
			this.selector_do.addListener(FWDVSMenuButton.MOUSE_OUT, self.selectorOutHandler);
			
			if(!FWDVSUtils.isIEAndLessThen9) this.selector_do.addChild(this.arrow_do);
			this.selector_do.addListener(FWDVSMenuButton.MOUSE_UP, function(){
				if(self.isComboboxShowed_bl){
					self.closeComboBox();
				}else{
					self.openCombobox();
				}
			});
			this.selector_do.setLabel(self.comboboxSelectorLabel_str);
			this.selector_do.setSize();
			
			setTimeout(function(){
				self.selector_do.getStyle().width = (self.selector_do.getWidth() + 40) + "px";
				self.selectorOriginalWidth = self.selector_do.getWidth();
				
				self.arrow_do.setRotation(45);
				self.arrow_do.setY(Math.round(self.selector_do.h - self.arrow_do.h)/2 - 4);
				
			}, 60);

			FWDVSArrow.setPrototype();
			this.arrowMobile_do = new FWDVSArrow(self);
			this.arrowMobile_do.addListener(FWDVSMenuButton.MOUSE_UP, function(){
				if(self.isComboboxShowed_bl){
					self.closeComboBox();
				}else{
					self.openCombobox();
				}
			});
			

			this.addChild(this.mainButtonsHolder_do);
			this.mainButtonsHolder_do.addChild(this.bk_do);
			this.mainButtonsHolder_do.addChild(this.buttonsHolder_do);
			this.mainButtonsHolder_do.addChild(this.selector_do);
			this.addChild(this.arrowMobile_do);
		};
		
		this.selectorOverHandler = function(){
			FWDAnimation.to(self.arrow_do.screen, .8, {className:'arrow arrowSelected', ease:Expo.easeOut});
		};
		
		this.selectorOutHandler = function(){
			FWDAnimation.to(self.arrow_do.screen, .8, {className:'arrow arrowNormal', ease:Expo.easeOut});
		};

		this.resizeSelector = function(){
			self.mainButtonsHolder_do.setX(0);
			var searchIconW = parent.searchMain_do.getWidth();
			if(parent.searchIconW){
				searchIconW = parent.searchIconW;
			}
			
			/*if(self.stageWidth < 700){
				self.showOnlyArrow = true;
				self.selector_do.getStyle().visibility = 'hidden';
				self.arrowMobile_do.getStyle().visibility = 'visible';
				self.mainButtonsHolder_do.setY(self.arrowMobile_do.h);
				parent.searchMain_do.setX(Math.round(self.arrowMobile_do.getRect().x - parent.main_do.getGlobalX() - searchIconW) - 10);
			}else{*/
				self.showOnlyArrow = false;
				self.selector_do.getStyle().visibility = 'visible';
				self.arrowMobile_do.getStyle().visibility = 'hidden';
				self.mainButtonsHolder_do.setY(0);
				parent.searchMain_do.setX(Math.round(self.mainButtonsHolder_do.getRect().x - parent.main_do.getGlobalX() - searchIconW) - 10);
			//}
			//parent.searchMain_do.setAlpha(1);
		}

		this.resetButtons = function(){
			for(var i=0; i<self.buttons_ar.length; i++){
				var button = self.buttons_ar[i];
				if(self.curId != button.id){
					button.setNormalState(true);
				} 
			}
		}
		
		this.openCombobox = function(){
			if(self.isComboboxShowed_bl) return
			self.isComboboxShowed_bl = true;
	
			FWDAnimation.killTweensOf(self.mainButtonsHolder_do);
			FWDAnimation.killTweensOf(self.buttonsHolder_do);
			FWDAnimation.killTweensOf(self.arrow_do);
		
			if(parent.zIndex == 0){
				self.getStyle().zIndex = 1;
			}else{
				self.getStyle().zIndex = parent.zIndex + 1;
			}
		
			self.selector_do.isSelected_bl = self.selector_do.isDisabled_bl = true;
			self.selector_do.setSelectedState(true);
			self.isOpened_bl = true;
			self.buttonsHolder_do.setVisible(true);
			self.buttonsHolder_do.setX(0);
			self.mainButtonsHolder_do.setX(0);
			//self.mainButtonsHolder_do.setHeight(self.buttonsHolder_do.h + self.mainButtonsHolder_do.h);
			self.selector_do.h = self.selector_do.getHeight();

			var btnHolderY = 0;
			if(!self.buttonsHolder_do.y || self.buttonsHolder_do.y < 0){
				if(self.showOnlyArrow){
					self.buttonsHolder_do.setY(-self.buttonsHolder_do.h);
					btnHolderY = 0;
				}else{
					self.buttonsHolder_do.setY(-self.buttonsHolder_do.h + self.selector_do.h);
					btnHolderY = self.selector_do.h;
				}
			} 

			FWDAnimation.to(self.mainButtonsHolder_do, .8, {h:self.buttonsHolder_do.h + self.mainButtonsHolder_do.h, ease:Expo.easeInOut});
			FWDAnimation.to(self.buttonsHolder_do, .8, {y:btnHolderY, ease:Expo.easeInOut});
			FWDAnimation.to(self.arrow_do, .8, {rotation:-135, y:Math.round(self.selector_do.h - self.arrow_do.h)/2 + 1, ease:Expo.easeInOut});
			FWDAnimation.to(self.arrowMobile_do.arrow_do.screen, .8, {'transform':'translateY(8px) rotate(-135deg)', ease:Expo.easeInOut});

			if(self.stageWidth < 700){
				FWDAnimation.to(parent.searchMain_do, .6, {alpha:0});
			}
			
			self.startToCheckMenuHit();
			self.resetButtons();
		};
		
		this.closeComboBox = function(e){
			if(!self.isComboboxShowed_bl) return
			self.isComboboxShowed_bl = false;
		
			FWDAnimation.killTweensOf(self.buttonsHolder_do);
			FWDAnimation.killTweensOf(self.arrow_do);
			self.selector_do.isSelected_bl = self.selector_do.isDisabled_bl = false;
			self.isOpened_bl = false;

			FWDAnimation.to(self.buttonsHolder_do, .8, {y:-self.buttonsHolder_do.h + self.selector_do.h - 5, ease:Expo.easeInOut});
			FWDAnimation.to(self.mainButtonsHolder_do, .8, {h:self.selector_do.h, ease:Expo.easeInOut, onComplete:function(){
				self.isComboboxShowed_bl = false;
				self.buttonsHolder_do.setVisible(false);

				if(!self.menuHit_bl){
					if(!self.isMobile_bl){
						self.selector_do.setNormalState(true);
						self.arrowMobile_do.setNormalState(true);
					} 
					FWDAnimation.to(self.arrow_do.screen, .8, {className:'arrowNormal', ease:Expo.easeOut});
				} 
				if(self.isMobile_bl) self.selector_do.setNormalState(true);
				if(self.showOnlyArrow){
					self.mainButtonsHolder_do.setX(1000);
				}

			}});
			FWDAnimation.to(self.arrow_do, .8, {rotation:45, y:Math.round(self.selector_do.h - self.arrow_do.h)/2 - 4, ease:Expo.easeInOut});
			FWDAnimation.to(self.arrowMobile_do.arrow_do, .8, {rotation:45, ease:Expo.easeInOut});
			FWDAnimation.to(self.arrowMobile_do.arrow_do.screen, .8, {'transform':'translateY(0) rotate(45deg)', ease:Expo.easeInOut});

			FWDAnimation.to(parent.searchMain_do, .8, {alpha:1});
		};
		
		this.startToCheckMenuHit = function(){
			if(this.isCheckHitAdded_bl) return;
			this.isCheckHitAdded_bl = true;
			
			if(self.isMobile_bl){
				setTimeout(function(){
					self.hitThhumbnailId_to = window.addEventListener("touchstart", self.checkThumbnailHit);
				}, 50);
			}else{
				window.addEventListener("mousemove", self.checkThumbnailHit);
				window.addEventListener("mousedown", self.chechThumbnailsOnClick);
			}
		};
		
		this.stopToCheckMenuHit = function(){
			if(!self.isCheckHitAdded_bl) return;
			self.isCheckHitAdded_bl = false;
		
			if(self.isMobile_bl){
				self.hitThhumbnailId_to = window.removeEventListener("touchstart", self.checkThumbnailHit);
			}else{
				window.removeEventListener("mousemove", self.checkThumbnailHit);
				window.removeEventListener("mousedown", self.chechThumbnailsOnClick);
			}
			
			clearTimeout(self.hitThhumbnailId_to);
		};
		
		this.chechThumbnailsOnClick = function(e){
			var vc = FWDVSUtils.getViewportMouseCoordinates(e);	
			self.menuHit_bl = true;
			if(!FWDVSUtils.hitTest(self.mainButtonsHolder_do.screen, vc.screenX, vc.screenY)
			&& !FWDVSUtils.hitTest(self.arrowMobile_do.screen, vc.screenX, vc.screenY)){
				self.menuHit_bl = false;
				clearTimeout(self.hideComoboboxWithDelayId_to);
				self.stopToCheckMenuHit();
				self.closeComboBox();	
			}
		};
		
		this.checkThumbnailHit = function(e){
			var vc = FWDVSUtils.getViewportMouseCoordinates(e);	
			if(FWDVSUtils.hitTest(self.mainButtonsHolder_do.screen, vc.screenX, vc.screenY)
			|| FWDVSUtils.hitTest(self.arrowMobile_do.screen, vc.screenX, vc.screenY)){
				self.menuHit_bl = true;
				clearTimeout(self.hideComoboboxWithDelayId_to);
			}else{
				self.menuHit_bl = false;
				clearTimeout(self.hideComoboboxWithDelayId_to);
				self.hideComoboboxWithDelayId_to = setTimeout(function(){
					self.stopToCheckMenuHit();
					self.closeComboBox();	
				}, 200);
			}
		};
		
		//#######################################//
		/* Setup buttons */
		//#######################################//
		this.setupButtons = function(){
			var button;
			var label_str;
			
			for(var i=0; i<this.totalButtons; i++){
			
				FWDVSMenuButton.setPrototype();
				button = new FWDVSMenuButton(
					self,
					label_str,
					i
				);
				
				if(i == 0) this.allCategoriesButton_do = button;
				
				button.addListener(FWDVSMenuButton.MOUSE_UP, this.buttonOnMouseUpHandler);
				
				this.buttons_ar.push(button);
				this.buttonsOriginal_ar.push(button);
			}
		};
		
		this.buttonOnMouseUpHandler = function(e){
			if(parent.thumbsManager_do && parent.thumbsManager_do.isCategoryChanging_bl) return;
			if(e){
				self.setButtons(e.id);
				self.curId = e.id;
			}
			self.dispatchEvent(FWDVSMenu.MOUSE_UP, {id:self.getIdsArray()});
		};
	
		
		this.setButtonsLabels = function(showTotalNumbersPerCategory_bl){
			var button;
			for(var i=0; i<this.buttonsOriginal_ar.length; i++){
				button = this.buttonsOriginal_ar[i];
				button.w = 0;
				button.getStyle().width = "auto";
				label_str = this.categories_ar[i];
				if(this.categories_ar[i] != undefined) button.setLabel(label_str);
				button.setSize();
			}
		};
		
		this.setButtons = function(id){
			var button;
			var countSelectedButtons = 0;
			
			button = this.buttons_ar[id];
			var button;
			for (var i=0; i<self.totalButtons; i++){	
				button = self.buttons_ar[i];
				if(i == id){
					button.isSelectedFinal_bl = true;
					button.disable();
				}else{
					button.isSelectedFinal_bl = false;
					button.enable();
				}
			}
		};
		
		this.getIdsArray = function(){
			self.catId_ar = [];
			
			for(var i=0; i<self.totalButtons; i++){
				button = self.buttons_ar[i];
				if(button.isSelectedFinal_bl || button.isDisabled_bl) self.catId_ar.push(button.id);
			}
			
			return self.catId_ar;
		};
	
		//###############################################//
		/* Update menu style */
		//###############################################//
		this.updateMenuStyle = function(){
			var spacer;
			
			for(var i=0; i<this.totalButtons; i++){
				button = this.buttons_ar[i];
				this.buttonsHolder_do.addChild(button);
				if(this.showMenuButtonsSpacers_bl){
					spacer = this.spacers_ar[i];
					spacer.setHeight(1);
					this.buttonsHolder_do.addChild(spacer);
					if(i == this.totalButtons - 1) spacer.setVisible(true);
				}
			}
			this.selector_do.setVisible(true);
			
			this.positionButtons();
		};
	
		
		//###################################################//
		/*setup spacers */
		//###################################################//
		this.setupSpacers = function(){
			var spacer;
			var offsetTotalButtons = 0;
			
			for(var i=0; i<self.totalButtons; i++){
				spacer = new FWDVSDisplayObject("div");
				this.spacers_ar[i] = spacer;
				spacer.setHeight(this.menuButtonSpacerHeight);
				spacer.screen.className = 'PGMenuButtonsSpacers';
	
				if(this.showMenuButtonsSpacers_bl) spacer.setVisible(false);
				self.addChild(spacer);
			}
		};
	
		//########################################//
		/* Position buttons */
		//########################################//
		this.positionButtons = function(){
			if(self.stageWidth == 0) return;
			
			var button;
			var prevButton;
			var rows_ar = [];
			var rowsWidth_ar = [];
			var stageWidth = self.stageWidth;
			var tempX = 0;
			var tempY = 0;
			var maxY = 0;
			var totalRowWidth = 0;
			var rowsNr = 0;
			var spacerCount = 0;
			var startX = 0;
			var greaterButtonWidth = this.selectorOriginalWidth;
			if(greaterButtonWidth == 0) return;
			var curW = self.stageWidth - 2;
			
			var offsetButtonY = 0;
			
		
			maxY = 0;
			
			for (var i=0; i<self.totalButtons; i++){	
				button = self.buttons_ar[i];
				if(button.w >= greaterButtonWidth){
					greaterButtonWidth = button.w;
				}
			}
		
			for (var i=0; i<self.totalButtons; i++){	
				
				button = self.buttons_ar[i];
				if(this.showMenuButtonsSpacers_bl){
					spacer = self.spacers_ar[i];
					spacer.setX(0);
					spacer.setWidth(curW);
					if(i == 0){
						spacer.setY(0);
						button.setY(spacer.h);
					}else{
						spacer.setY(self.buttons_ar[i-1].y +  self.buttons_ar[i -1].h);
						button.setY(spacer.y + spacer.h);
					}
					
					
				}else{
					button.setY(i * button.h);
				}
				
				button.setX(0);
			
				//if(greaterButtonWidth > 35) 
				button.setWidth(curW);
			}
			
			//if(this.selectorOriginalWidth < greaterButtonWidth + 10){
				this.selector_do.setWidth(curW);
			//}
			
			this.buttonsHolder_do.setWidth(curW);
			this.buttonsHolder_do.setHeight(button.y + button.h);
			this.mainButtonsHolder_do.setWidth(curW);
			this.mainButtonsHolder_do.setHeight(self.selector_do.h);
			this.arrow_do.setX(curW - 43);
			this.arrow_do.setY(parseInt(self.selector_do.h - this.arrow_do.h)/2  - 4);
		
			self.stageHeight = maxY + self.buttons_ar[0].h;

		};
		
		this.init();
	};
	
	/* set prototype */
	FWDVSMenu.setPrototype = function(){
		FWDVSMenu.prototype = new FWDVSDisplayObject("div", "absolute", "hidden");
	};
	
	FWDVSMenu.MOUSE_OVER = "onMouseOver";
	FWDVSMenu.MOUSE_OUT = "onMouseOut";
	FWDVSMenu.MOUSE_UP = "onMouseDown";
	FWDVSMenu.RIGHT = "right";
	FWDVSMenu.LEFT = "left";
	FWDVSMenu.BOTTOM = "bottom";
	FWDVSMenu.TOP = "top";
	
	FWDVSMenu.prototype = null;
	window.FWDVSMenu = FWDVSMenu;
}(window));/* FWDVSMenuButton */
(function (window){
	
	var FWDVSMenuButton = function(
			parent,
			text_str,
			id,
			normalClass,
			selectedClass
	   ){
		
		var self = this;
		var prototype = FWDVSMenuButton.prototype;
		
		this.text_str = text_str;
		
	
		this.id = id;

		
		this.isDisabled_bl = true;
		this.isSelected_bl = false;
		this.isMobile_bl = FWDVSUtils.isMobile;
		this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent;

	
		this.init = function(){
			this.setOverflow("visible");
			this.hasTransform3d_bl = false;
			this.hasTransform2d_bl = false;

			
			this.getStyle().border = "";
			this.getStyle().backgroundColor = "";
			this.setupDos();
			this.setNormalState(false);
			this.enable();
			this.addEvents();
			this.dumy_do.setVisible(false);
			//this.setButtonMode(false);
			
		};
		
		//#######################################//
		/* Setup screens */
		//#######################################//
		this.setupDos = function(){
			if(this.id == 100){
				this.text_do = new FWDVSDisplayObject("input", "relative");
			}else{
				this.text_do = new FWDVSDisplayObject("div", "relative");
			}
			
			this.text_do.setOverflow("visible");
			this.text_do.hasTransform3d_bl = false;
			this.text_do.hasTransform2d_bl = false;
			this.text_do.setDisplay("inline-block");
			this.text_do.getStyle().fontSmoothing = "antialiased";
			this.text_do.getStyle().webkitFontSmoothing = "antialiased";
			this.text_do.getStyle().textRendering = "optimizeLegibility";
			this.text_do.getStyle().whiteSpace = "nowrap";
			this.text_do.setBackfaceVisibility();
			this.text_do.getStyle().padding = "";
			this.text_do.getStyle().margin = "";
			this.text_do.hasTransform3d_bl =  false;
			this.text_do.hasTransform2d_bl =  false;
		
			this.dumy_do = new FWDVSDisplayObject("div");
			this.dumy_do.getStyle().width = "100%";
			this.dumy_do.getStyle().height = "100%";
			if(FWDVSUtils.isIE){
				this.dumy_do.setBkColor("#00FF00");
				this.dumy_do.setAlpha(0);
			}
			this.addChild(this.text_do);
		    this.addChild(this.dumy_do);
		    this.setSize();
		};
		
		//#######################################//
		/* Add events */
		//#######################################//
		this.addEvents = function(){
			if(this.id == 100){
				if(self.text_do.screen.addEventListener){
					self.text_do.screen.addEventListener("focus", self.inputFocusInHandler);
					self.text_do.screen.addEventListener("blur", self.inputFocusOutHandler);
					self.text_do.screen.addEventListener("keyup", self.keyUpHandler);
				}else if(self.text_do.screen.attachEvent){
					self.text_do.screen.attachEvent("onfocus", self.inputFocusInHandler);
					self.text_do.screen.attachEvent("onblur", self.inputFocusOutHandler);
					self.text_do.screen.attachEvent("onkeyup", self.keyUpHandler);
				}
			}else{
				if(self.isMobile_bl){
					if(this.hasPointerEvent_bl){
						this.screen.addEventListener("pointerup", this.onMouseUp);
						this.screen.addEventListener("pointerover", this.onMouseOver);
						this.screen.addEventListener("pointerout", this.onMouseOut);
					}else{
						this.screen.addEventListener("click", this.onMouseUp);
					}
				}else if(this.screen.addEventListener){	
					this.screen.addEventListener("mouseover", this.onMouseOver);
					this.screen.addEventListener("mouseout", this.onMouseOut);
					this.screen.addEventListener("mouseup", this.onMouseUp);
				}
			}
		};
		
		this.onMouseOver = function(e){
			if(!e.pointerType || e.pointerType == "mouse" ){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDVSMenuButton.MOUSE_OVER, {e:e});
				parent.resetButtons();
				self.setSelectedState(true);
			}
		};
			
		this.onMouseOut = function(e){
			if((!e.pointerType || e.pointerType == "mouse") && !FWDAnimation.isTweening(parent.buttonsHolder_do)){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDVSMenuButton.MOUSE_OUT, {e:e});
				self.setNormalState(true);
			}
		};
		
		this.onMouseUp = function(e){
			if(e.button == 2) return;
			self.dispatchEvent(FWDVSMenuButton.MOUSE_UP, {id:self.id});
		};
		
		
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
						self.dispatchEvent(FWDVSMenu.SEARCH, {param:self.searchValue});
					}, 200);
				}
			}
			
			self.prevInputValue_str = self.text_do.screen.value;
		};
		
		
			//####################################//
		/* Set normal / selected state */
		//####################################//
		this.setNormalState = function(animate){
			//if(this.isSelected_bl) return;
			this.isSelected_bl = true;

			var nC = 'PGMenuButtonTextNormal';
			if(selectedClass){
				nC = normalClass;
			}

			FWDAnimation.killTweensOf(this.screen);
			FWDAnimation.killTweensOf(this.text_do.screen);
			if(this.id == 100){
				this.text_do.screen.className = "PGMenuButtonTextNormal";
			}else{
				if(animate){
					FWDAnimation.to(this.screen, .8, {className:"PGMenuButtonBackgroundNormal"});
					FWDAnimation.to(this.text_do.screen, .8, {className:nC});
				}else{
					this.screen.className = "PGMenuButtonBackgroundNormal";
					this.text_do.screen.className = nC;
				}
			}
		};
		
		this.setSelectedState = function(animate){
			if(!this.isSelected_bl) return;
			this.isSelected_bl = false;
			
			var sC = 'PGMenuButtonTextSelected';
			if(selectedClass){
				sC = selectedClass;
			}
			
			FWDAnimation.killTweensOf(this.screen);
			FWDAnimation.killTweensOf(this.text_do.screen);
			if(animate){
				FWDAnimation.to(this.screen, .8, {className:"PGMenuButtonBackgroundSelected"});
				FWDAnimation.to(this.text_do.screen, .8, {className:sC});
			}else{
				this.screen.className = "PGMenuButtonBackgroundSelected";
				this.text_do.screen.className = sC;
			}
		};
		
		
		//####################################//
		/* Set selected / unselected */
		//####################################//
		this.setSelected = function(){
			if(this.isSelectedFinal_bl) return;
			this.isSelectedFinal_bl = true;
			this.setSelectedState(true);
		};
		
		this.setUnselected = function(){
			if(!this.isSelectedFinal_bl) return;
			this.isSelectedFinal_bl = false;
			this.setNormalState(true);
		};
		
		//####################################//
		/* Disable / enable */
		//####################################//
		this.disable = function(){
			//if(this.isDisabled_bl) return;
			if(this.id == 100) return
			this.isDisabled_bl = true;
			this.setButtonMode(true);
			this.dumy_do.setButtonMode(true);
			//this.setButtonMode(false);
			//this.dumy_do.setButtonMode(false);
			this.setSelectedState(true);
		};
		
		this.enable = function(){
			//if(!this.isDisabled_bl) return;
			if(this.id == 100) return
			this.isDisabled_bl = false;
			this.setButtonMode(true);
			this.dumy_do.setButtonMode(true);
			this.setNormalState(true);
		};
		
		//#########################################//
		/* Set label */
		//#########################################//
		this.setLabel = function(label_str){
			self.text_str = label_str;
			if(this.id == 100){
				this.text_do.screen.value = self.text_str;
			}else{
				this.text_do.setInnerHTML(self.text_str);
			}
		};
		
		//#########################################//
		/* Set size */
		//########################################//
		this.setSize = function(){
			setTimeout(function(){
		    	self.w = self.getWidth();
		    	self.h = self.getHeight();
		    }, 69);
		};
		
		this.init();
	};
	
	
	/* set prototype */
	FWDVSMenuButton.setPrototype = function(){
		FWDVSMenuButton.prototype = new FWDVSDisplayObject("div");
		FWDVSMenuButton.prototype.hasTransform3d_bl = false;
			FWDVSMenuButton.prototype.hasTransform2d_bl = false;
	};
	
	FWDVSMenu.SEARCH = "search";
	FWDVSMenuButton.MOUSE_OVER = "onMouseOver";
	FWDVSMenuButton.MOUSE_OUT = "onMouseOut";
	FWDVSMenuButton.MOUSE_UP = "onMouseDown";
	
	
	FWDVSMenuButton.prototype = null;
	window.FWDVSMenuButton = FWDVSMenuButton;
}(window));/* Thumb */
(function (window){
	
	var FWDVSPreloader = function(parent, preloaderPostion, radius, backgroundColor, fillColor, strokeSize, animDuration, prelaoderAllScreen_bl){
		
		var self  = this;
		var prototype = FWDVSPreloader.prototype;
		self.main_do;
		self.preloaderPostion = preloaderPostion;
		self.backgroundColor = backgroundColor;
		self.fillColor = fillColor;
		self.radius = radius;
		self.strokeSize = strokeSize;
		self.allScreen = prelaoderAllScreen_bl;
		this.offsetPreloader = 30;
		this.animDuration = animDuration || 300;
		this.strtAngle = 270;
		this.countAnimation = 0;
		this.isShowed_bl = true;
		this.slideshowAngle = {n:0};
		
		//###################################//
		/* init */
		//###################################//
		this.init = function(){
			self.getStyle().top = 0;
			self.className = 'main';
			self.main_do = new FWDVSDisplayObject("div");
			self.main_do.setOverflow("visible");
			self.main_do.setWidth(self.radius * 2 + self.strokeSize);
			self.main_do.setHeight(self.radius * 2 + self.strokeSize);
			self.addChild(self.main_do);
			self.setOverflow('visible');
			self.setWidth((self.radius * 2) + self.strokeSize);
			self.setHeight((self.radius * 2) + self.strokeSize);
			this.bkCanvas =  new FWDVSDisplayObject("canvas");
			this.bkCanvasContext = this.bkCanvas.screen.getContext('2d');
			this.fillCircleCanvas = new FWDVSDisplayObject("canvas");
			this.fillCircleCanvasContext = this.fillCircleCanvas.screen.getContext('2d');
		
			self.main_do.addChild(this.bkCanvas);
			self.main_do.addChild(this.fillCircleCanvas);
			self.drawBackground();
			self.drawFill();
			self.hide();
			self.screen.style.transformOrigin = "50% 50%";
		};

		/*
			Postion
		*/
		this.positionAndResize = function(){
			if(self.preloaderPostion == 'bottomleft'){
				self.setX(parent.offsetPreloader);
				self.setY(parent.stageHeight - self.h - parent.offsetPreloader);
			}else if(self.preloaderPostion == 'bottomright'){
				self.setX(parent.stageWidth - self.w - self.offsetPreloader);
				var y = parent.stageHeight - self.h - self.offsetPreloader;
				if(self.allScreen) y = parent.viewportSize.h - self.h - self.offsetPreloader;
				self.setY(y);
			}else if(self.preloaderPostion == 'topright'){
				self.setX(parent.stageWidth - self.w - parent.offsetPreloader);
				self.setY(parent.offsetPreloader);
			}else if(self.preloaderPostion == 'topleft'){
				self.setX(self.offsetPreloader);
				self.setY(self.offsetPreloader);
			}else if(self.preloaderPostion == 'center'){
				self.setX(Math.round(parent.stageWidth - self.w)/2);
				var y = 50;
				if(self.allScreen) y = Math.round((parent.viewportSize.h - self.h)/2);
				self.setY(y);
			}
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
			FWDAnimation.to(self.main_do.screen, self.animDuration, {rotation:360, repeat:100});
		}

		this.stopPreloader = function(){
			FWDAnimation.killTweensOf(self.slideshowAngle);
			FWDAnimation.killTweensOf(self.main_do.screen);
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
			self.dispatchEvent(FWDVSPreloader.HIDE_COMPLETE);
		};
		
		this.init();
	};
	
	/* set prototype */
    FWDVSPreloader.setPrototype = function(){
    	FWDVSPreloader.prototype = new FWDVSDisplayObject("div");
    };
    
    FWDVSPreloader.HIDE_COMPLETE = "hideComplete";
    
    FWDVSPreloader.prototype = null;
	window.FWDVSPreloader = FWDVSPreloader;
}(window));/* FWDVSSimpleButton */
(function (window){
var FWDVSSimpleButton = function(nImg, sPath, dPath, alwaysShowSelectedPath){
		
		var self = this;
		var prototype = FWDVSSimpleButton.prototype;
		
		this.nImg = nImg;
		this.sPath_str = sPath;
		this.dPath_str = dPath;
	
		this.buttonsHolder_do;
		this.n_sdo;
		this.s_sdo;
		this.d_sdo;
		
		this.toolTipLabel_str;
		
		this.totalWidth = this.nImg.width;
		this.totalHeight = this.nImg.height;
		
		this.isShowed_bl = true;
		this.isSetToDisabledState_bl = false;
		this.isDisabled_bl = false;
		this.isDisabledForGood_bl = false;
		this.isSelectedFinal_bl = false;
		this.isActive_bl = false;
		this.isMobile_bl = FWDVSUtils.isMobile;
		this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent;
		this.allowToCreateSecondButton_bl = !self.isMobile_bl || self.hasPointerEvent_bl || alwaysShowSelectedPath;
	
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.setupMainContainers();
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		self.setupMainContainers = function(){
			self.setBackfaceVisibility();
			self.hasTransform3d_bl = false;
			self.hasTransform2d_bl = false;
			
			self.buttonsHolder_do = new FWDVSDisplayObject("div");
			self.buttonsHolder_do.setOverflow("visible");
			self.buttonsHolder_do.setBackfaceVisibility();
			self.buttonsHolder_do.hasTransform3d_bl = false;
			self.buttonsHolder_do.hasTransform2d_bl = false;
		
			self.n_sdo = new FWDVSDisplayObject("img");	
			self.n_sdo.setScreen(self.nImg);
			self.n_sdo.setBackfaceVisibility();
			self.n_sdo.hasTransform3d_bl = false;
			self.n_sdo.hasTransform2d_bl = false;
			self.buttonsHolder_do.addChild(self.n_sdo);
			
			if(self.allowToCreateSecondButton_bl){
				var img1 = new Image();
				img1.src = self.sPath_str;
				self.s_sdo = new FWDVSDisplayObject("img");
				self.s_sdo.setScreen(img1);
				self.s_sdo.setWidth(self.totalWidth);
				self.s_sdo.setHeight(self.totalHeight);
				self.s_sdo.setAlpha(0);
				self.s_sdo.setBackfaceVisibility();
				self.s_sdo.hasTransform3d_bl = false;
				self.s_sdo.hasTransform2d_bl = false;
				self.buttonsHolder_do.addChild(self.s_sdo);
				
				if(self.dPath_str){
					var img2 = new Image();
					img2.src = self.dPath_str;
					self.d_sdo = new FWDVSDisplayObject("img");
					self.d_sdo.setScreen(img2);
					self.d_sdo.setWidth(self.totalWidth);
					self.d_sdo.setHeight(self.totalHeight);
					self.d_sdo.setX(-100);
					self.d_sdo.setBackfaceVisibility();
					self.d_sdo.hasTransform3d_bl = false;
					self.d_sdo.hasTransform2d_bl = false;
					self.buttonsHolder_do.addChild(self.d_sdo);
				};
			}
			
			self.setWidth(self.totalWidth);
			self.setHeight(self.totalHeight);
			self.setButtonMode(true);
			self.screen.style.yellowOverlayPointerEvents = "none";
			self.addChild(self.buttonsHolder_do);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("pointerup", self.onMouseUp);
					self.screen.addEventListener("pointerover", self.onMouseOver);
					self.screen.addEventListener("pointerout", self.onMouseOut);
				}else{
					self.screen.addEventListener("touchend", self.onMouseUp);
				}
			}else if(self.screen.addEventListener){	
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mouseup", self.onMouseUp);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmouseup", self.onMouseUp);
			}
		};
		
		self.onMouseOver = function(e){
			self.dispatchEvent(FWDVSSimpleButton.SHOW_TOOLTIP, {e:e});
			if(self.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDVSSimpleButton.MOUSE_OVER, {e:e});
				self.setSelectedState();
			}
		};
			
		self.onMouseOut = function(e){
			if(self.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE || e.pointerType == "mouse"){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDVSSimpleButton.MOUSE_OUT, {e:e});
				self.setNormalState();
			}
		};
		
		self.onMouseUp = function(e){
			if(self.isDisabledForGood_bl) return;
			if(e.preventDefault) e.preventDefault();
			if(self.isDisabled_bl || e.button == 2) return;
			self.dispatchEvent(FWDVSSimpleButton.MOUSE_UP, {e:e});
		};
		
		//##############################//
		// set select / deselect final.
		//##############################//
		self.setSelected = function(){
			self.isSelectedFinal_bl = true;
			if(!self.s_sdo) return;
			FWDAnimation.killTweensOf(self.s_sdo);
			FWDAnimation.to(self.s_sdo, .8, {alpha:1, ease:Expo.easeOut});
		};
		
		self.setUnselected = function(){
			self.isSelectedFinal_bl = false;
			if(!self.s_sdo) return;
			FWDAnimation.to(self.s_sdo, .8, {alpha:0, delay:.1, ease:Expo.easeOut});
		};
		
		//####################################//
		/* Set normal / selected state */
		//####################################//
		this.setNormalState = function(){
			if(!self.s_sdo) return;
			FWDAnimation.killTweensOf(self.s_sdo);
			FWDAnimation.to(self.s_sdo, .5, {alpha:0, ease:Expo.easeOut});	
		};
		
		this.setSelectedState = function(){
			if(!self.s_sdo) return;
			FWDAnimation.killTweensOf(self.s_sdo);
			FWDAnimation.to(self.s_sdo, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
		};
		
		//####################################//
		/* Disable / enable */
		//####################################//
		this.setDisabledState = function(){
			if(self.isSetToDisabledState_bl) return;
			self.isSetToDisabledState_bl = true;
			if(self.d_sdo) self.d_sdo.setX(0);
		};
		
		this.setEnabledState = function(){
			if(!self.isSetToDisabledState_bl) return;
			self.isSetToDisabledState_bl = false;
			if(self.d_sdo) self.d_sdo.setX(-100);
		};
		
		this.disable = function(setNormalState){
			if(self.isDisabledForGood_bl  || self.isDisabled_bl) return;
			self.isDisabled_bl = true;
			self.setButtonMode(false);
			FWDAnimation.to(self, .6, {alpha:.4});
			if(!setNormalState) self.setNormalState();
		};
		
		this.enable = function(){
			if(self.isDisabledForGood_bl || !self.isDisabled_bl) return;
			self.isDisabled_bl = false;
			self.setButtonMode(true);
			FWDAnimation.to(self, .6, {alpha:1});
		};
		
		this.disableForGood = function(){
			self.isDisabledForGood_bl = true;
			self.setButtonMode(false);
		};
		
		this.showDisabledState = function(){
			if(self.d_sdo.x != 0) self.d_sdo.setX(0);
		};
		
		this.hideDisabledState = function(){
			if(self.d_sdo.x != -100) self.d_sdo.setX(-100);
		};
		
		//#####################################//
		/* show / hide */
		//#####################################//
		this.show = function(){
			if(self.isShowed_bl) return;
			self.isShowed_bl = true;
			
			FWDAnimation.killTweensOf(self);
			if(!FWDVSUtils.isIEAndLessThen9){
				if(FWDVSUtils.isIEWebKit){
					FWDAnimation.killTweensOf(self.n_sdo);
					self.n_sdo.setScale2(0);
					FWDAnimation.to(self.n_sdo, .8, {scale:1, delay:.4, onStart:function(){self.setVisible(true);}, ease:Elastic.easeOut});
				}else{
					self.setScale2(0);
					FWDAnimation.to(self, .8, {scale:1, delay:.4, onStart:function(){self.setVisible(true);}, ease:Elastic.easeOut});
				}
			}else if(FWDVSUtils.isIEAndLessThen9){
				self.setVisible(true);
			}else{
				self.setAlpha(0);
				FWDAnimation.to(self, .4, {alpha:1, delay:.4});
				self.setVisible(true);
			}
		};	
			
		this.hide = function(animate){
			if(!self.isShowed_bl) return;
			self.isShowed_bl = false;
			FWDAnimation.killTweensOf(self);
			FWDAnimation.killTweensOf(self.n_sdo);
			self.setVisible(false);
		};
		
		self.init();
	};
	
	/* set prototype */
	FWDVSSimpleButton.setPrototype = function(hasTransform){
		FWDVSSimpleButton.prototype = null;
		if(hasTransform){
			FWDVSSimpleButton.prototype = new FWDVSTransformDisplayObject("div");
		}else{
			FWDVSSimpleButton.prototype = new FWDVSDisplayObject("div");
		}
	};
	
	FWDVSSimpleButton.CLICK = "onClick";
	FWDVSSimpleButton.MOUSE_OVER = "onMouseOver";
	FWDVSSimpleButton.SHOW_TOOLTIP = "showTooltip";
	FWDVSSimpleButton.MOUSE_OUT = "onMouseOut";
	FWDVSSimpleButton.MOUSE_UP = "onMouseDown";
	
	FWDVSSimpleButton.prototype = null;
	window.FWDVSSimpleButton = FWDVSSimpleButton;
}(window));﻿/* FWDVSSimpleSizeButton */
(function (window){
var FWDVSSimpleSizeButton = function(
		nImgPath, 
		sImgPath,
		buttonWidth,
		buttonHeight){
		
		var self = this;
		
		this.nImg_img = null;
		this.sImg_img = null;
	
		this.n_do;
		this.s_do;
		
		this.nImgPath_str = nImgPath;
		this.sImgPath_str = sImgPath;
		
		this.buttonWidth = buttonWidth;
		this.buttonHeight = buttonHeight;
		
		this.isMobile_bl = FWDVSUtils.isMobile;
		this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent;
		this.isDisabled_bl = false;
		
		
		//##########################################//
		/* initialize this */
		//##########################################//
		this.init = function(){
			self.setupMainContainers();
			self.setWidth(self.buttonWidth);
			self.setHeight(self.buttonHeight);
			self.setButtonMode(true);
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		this.setupMainContainers = function(){
			
			self.n_do = new FWDVSDisplayObject("img");	
			self.nImg_img = new Image();
			self.nImg_img.src = self.nImgPath_str;
			self.nImg_img.width = self.buttonWidth;
			self.nImg_img.height = self.buttonHeight;
			self.n_do.setScreen(self.nImg_img);
			
			self.s_do = new FWDVSDisplayObject("img");	
			self.sImg_img = new Image();
			self.sImg_img.src = self.sImgPath_str;
			self.sImg_img.width = self.buttonWidth;
			self.sImg_img.height = self.buttonHeight;
			self.s_do.setScreen(self.sImg_img);
			
			self.addChild(self.s_do);
			self.addChild(self.n_do);
			
			self.screen.onmouseover = self.onMouseOver;
			self.screen.onmouseout = self.onMouseOut;
			self.screen.onclick = self.onClick;
			
		};
		
		this.onMouseOver = function(e){
			if(self.isMobile_bl) return;
			FWDAnimation.to(self.n_do, .9, {alpha:0, ease:Expo.easeOut});
		};
			
		this.onMouseOut = function(e){
			FWDAnimation.to(self.n_do, .9, {alpha:1, ease:Expo.easeOut});	
		};
			
		this.onClick = function(e){
			self.dispatchEvent(FWDVSSimpleSizeButton.CLICK);
		};
		
		
		self.init();
	};
	
	/* set prototype */
	FWDVSSimpleSizeButton.setPrototype = function(){
		FWDVSSimpleSizeButton.prototype = null;
		FWDVSSimpleSizeButton.prototype = new FWDVSTransformDisplayObject("div");
	};
	
	FWDVSSimpleSizeButton.CLICK = "onClick";
	
	FWDVSSimpleSizeButton.prototype = null;
	window.FWDVSSimpleSizeButton = FWDVSSimpleSizeButton;
}(window));(function (window){
	
	var FWDVSThumbnail = function(props_obj){
		
		var self = this;
		var prototype = FWDVSThumbnail.prototype;
		
		this.parent = props_obj.parent;

		this.main_do;
		this.bk_do;
		this.border_do;
		this.imageHolder_do;
		this.image_do;
		this.contentHolder_do;
		this.title_do;
		this.overlay_do;
		this.fakeBorder_do;
		this.button1_do;
		this.button2_do;
		this.icon_do;
		this.mySplitText;
		this.textHolder_do;
		this.cats_ar = props_obj.cats_ar;
		this.slideshowData_ar = props_obj.slideshow_ar;
		this.useThumbnailSlideshow_bl = props_obj.useThumbnailSlideshow_bl;
		this.showThumbnailOnlyWhenImageIsLoaded_bl = props_obj.showThumbnailOnlyWhenImageIsLoaded_bl;

		this.searchText = props_obj.searchText;
		this.id = props_obj.id;

		
		this.previewText = props_obj.previewText;
		this.wSize = props_obj.wSize;
		this.hSize = props_obj.hSize;
		this.title_str = props_obj.title_str;
		this.client_str = props_obj.client_str;
		this.likes_str = props_obj.likes_str;
		this.presetType_str = props_obj.presetType_str;
		this.borderNormalColor_str = props_obj.borderNormalColor_str;
		this.borderSelectedColor_str = props_obj.borderSelectedColor_str;
		this.htmlContent1_str = props_obj.htmlContent1_str;
		this.htmlContent2_str = props_obj.htmlContent2_str;
		this.htmlExtraContent_str = props_obj.htmlExtraContent_str;

		this.thumbnailPath_str = props_obj.thumbnailPath_str;
		this.overlayColor_str = props_obj.thumbnailOverlayColor_str;
		this.extraButtonUrl_str = props_obj.extraButtonUrl_str;
		this.extraButtonUrlTarget_str = props_obj.extraButtonUrlTarget_str;
		this.iconPathN_str = props_obj.thumbIconPathN_str;
		this.iconPathS_str = props_obj.thumbIconPathS_str;
		this.linkIconPathN_str = props_obj.linkIconPathN_str;
		this.linkIconPathS_str = props_obj.linkIconPathS_str;
		this.hideAndShowTransitionType_str = props_obj.hideAndShowTransitionType_str;
		this.prevAndShowTransitionType_str;
		this.textVerticalAlign_str = props_obj.textVerticalAlign_str;
		this.imageTransitionDirection_str = props_obj.imageTransitionDirection_str;
		this.thumbanilBoxShadow_str = props_obj.thumbanilBoxShadow_str;
		this.animStartDir_str = "top";
		this.textAnimType_str = props_obj.textAnimType_str;
		this.alt_str = props_obj.alt_str;
		this.linkUrl_str = props_obj.linkUrl_str;
		this.linkTarget_str = props_obj.linkTarget_str;
		
		this.catId = props_obj.catId;
		this.id = props_obj.id;
		this.textHeight = 0;
		
		this.contentOffest = props_obj.contentOffsetY;
		this.buttonsOffest = props_obj.buttonsOffest;
		this.borderSize = props_obj.borderSize;
		this.lastBorderSize = this.borderSize;
		this.borderRadius = props_obj.borderRadius; 
		this.overlayOpacity = props_obj.thumbnailOverlayOpacity;
		this.iconW = props_obj.thumbnailIconWidth;
		this.iconH = props_obj.thumbnailIconHeight;
		this.spaceBetweenThumbanilIcons = props_obj.spaceBetweenThumbanilIcons;
		this.spaceBetweenTextAndIcons = props_obj.spaceBetweenTextAndIcons;
		this.imageOriginalW = undefined;
		this.imageOriginalH;
		this.tempFinalX = -1;
		this.tempFinalY = -1;
		this.finalX = undefined;
		this.finalY = 0;
		this.finalW = 0;
		this.finalH = 0;
		this.prevFinalX = 0;
		this.prevFinalY = 0;
		this.prevFinalW = 0;
		this.prevFinalH = 0;
		this.angleY = -180;
		this.text1H = 0;
		this.text2H = 0;
		this.finalHOffset = 0; 
		this.hOffset = 0;
		
		this.showOrHideWithDelayId_to;
		this.isImageAnimCompleteId_to;
		this.resizeTextContent1Id_to;
		this.contentHideCompleteId_to;
		this.contentShowCompleteId_to;
		
		this.isVerticalType_bl = props_obj.isVerticalType_bl;
		this.isCheckHitAdded_bl = false;
		this.showIcon_bl = true;
		this.hasButtons_bl = props_obj.useIconButtons_bl;
		this.doNotOverwriteResizeContent_bl = false;
		this.disableThumbnails_bl = props_obj.disableThumbnails_bl;
		this.isImageAnimCompleteId_bl = false;
		this.isLightboxDisabled_bl = props_obj.isDisabled_bl;
		this.imageShowComplete_bl = false;
		this.isContentHidden_bl = true;
		this.hasImage_bl = false;
		this.used_bl = false;
		this.firstTimeLoad_bl = true;
		this.isImageShowed_bl = false;
		this.isFirstTimeShowed_bl = true;
		this.isContentShowed_bl = false;
		this.isHidden_bl = false;
		this.hasExtraText_bl = Boolean(this.htmlExtraContent_str);
		this.isMobile_bl = FWDVSUtils.isMobile;
		this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent;
		
		this.init = function(){
			this.setupMainInstances();
		};

		//###################################//
		/* setup main screen */
		//###################################//
		this.setupMainInstances = function(){
			this.setOverflow('visible');
			this.main_do = new FWDVSTransformDisplayObject("div");
			this.main_do.screen.className = 'main';
			this.main_do.setOverflow('visible');
			if(!self.showThumbnailOnlyWhenImageIsLoaded_bl) self.main_do.setAlpha(0);
			this.addChild(this.main_do);
			
			this.bk_do = new FWDVSDisplayObject("div");
			this.bk_do.screen.className = "background";
			
			this.border_do = new FWDVSDisplayObject("div");
			this.border_do.screen.className = 'border';
			this.border_do.setOverflow('visible');
			this.imageHolder_do = new FWDVSDisplayObject("div");
			this.imageHolder_do.setBkColor("#000");
			this.image_do = new FWDVSDisplayObject("img");
			
			if(!this.isLightboxDisabled_bl && !this.disableThumbnails_bl 
				&& !this.hasButtons_bl && self.presetType_str != 'preview'
				&& self.presetType_str != 'blog'
				&& self.presetType_str != 'team'){
				if(this.isVerticalType_bl) this.border_do.setButtonMode(true);
				if(this.isVerticalType_bl && this.presetType_str == "curtain") this.imageHolder_do.setButtonMode(true);
			}
			
			if(this.thumbanilBoxShadow_str) this.setBorderBoxShadow(this.thumbanilBoxShadow_str);
			this.setupContent();
			this.main_do.addChild(this.bk_do);
			this.main_do.addChild(this.border_do);
			
			if(this.borderSize != 0) this.setBorderSize(this.borderSize);
			if(this.borderRadius != 0) this.setBorderRadius(this.borderRadius);
			this.setBorderColor(this.borderNormalColor_str, this.borderSelectedColor_str);
			this.getStyle().zIndex = self.id;
		};
		
		//######################################//
		/* Add image */		//######################################//

		this.addImage = function(image){

			self.imageOriginalW = image.width;
			self.imageOriginalH = image.height;
			self.hasImage_bl = true;
			self.image_do.setScreen(image);
			image.setAttribute("alt", self.alt_str);
			
			//this.image_do.setAlpha(0);
			this.addEvents();
			this.resizeAndPosition(true);

			if(this.main_do.alpha == 0) FWDAnimation.to(this.main_do, .8, {alpha:1, delay:Math.random() * 0.5});
		};
		
		//######################################//
		/* Resize and position */
		//######################################//
		this.resizeAndPosition = function(overwrite){	

			var imageHolderW = this.finalW - this.borderSize * 2;
			var imageHolderH = this.finalH  - this.borderSize * 2;

			if(this.hasExtraText_bl){
				if(this.text3_do.alpha == 0){
					this.text3_do.setY(-this.text3_do.getHeight() - 5);
					FWDAnimation.to(this.text3_do, .4, {alpha:1, delay:.5});
					FWDAnimation.to(this.text3_do, .8, {y:0, delay:.5, ease:Expo.easeInOut});		
				}

				this.textHolder_do.setX(this.borderSize);
				this.textHolder_do.setWidth(this.finalW - this.borderSize * 2);
				this.textHolder_do.setY(this.finalH - this.borderSize);
			}

			if(!self.imageOriginalW && !self.showThumbnailOnlyWhenImageIsLoaded_bl){
				this.setX(this.finalX);
				this.setY(this.finalY);
				this.setWidth(this.finalW);
				this.setHeight(this.finalH + this.textHeight);
				this.main_do.setWidth(this.finalW);
				this.main_do.setHeight(this.finalH);
				this.bk_do.setX(this.borderSize);
				this.bk_do.setY(this.borderSize );
				this.bk_do.setWidth(imageHolderW);
				this.bk_do.setHeight(imageHolderH);
				this.border_do.setWidth(imageHolderW);
				this.border_do.setHeight(imageHolderH);
				return;
			}
		
			if ((this.finalX == this.prevFinalX) && (this.finalY == this.prevFinalY)
			&& (this.finalW == this.prevFinalW) && (this.finalH == this.prevFinalH)
			|| this.finalX == undefined || self.imageOriginalW  == undefined
			){
				return;
			}else{
				this.prevBorderSize = this.borderSize;
				this.prevFinalX = this.finalX;
				this.prevFinalY = this.finalY;
				this.prevFinalW = this.finalW;
				this.prevFinalH = this.finalH;
			}
			
			FWDAnimation.killTweensOf(this);
			
			//this.checkVisibility();
		
			var scX = imageHolderW/self.imageOriginalW;
			var scY = imageHolderH/self.imageOriginalH;
			var sct;
			
			if(scX >= scY){
				sct = scX;
			}else{
				sct = scY;
			}
			
			var imageW = Math.ceil(sct * self.imageOriginalW);
			var imageH = Math.ceil(sct * self.imageOriginalH);
			
			var globalY = Math.abs(Math.min(0, FWDVS.globalY));
			var totalVisibleHeight = FWDVS.globalY > 0 ? FWDVS.viewportHeight - FWDVS.globalY : FWDVS.viewportHeight;
			var animate_bl;

			if (this.firstTimeLoad_bl || !self.isImageShowed_bl){
				
				FWDAnimation.killTweensOf(this.image_do);
				FWDAnimation.killTweensOf(this.imageHolder_do);
				
				this.setX(this.finalX);
				this.setY(this.finalY);
				
				this.imageHolder_do.setX((imageHolderW)/2 + this.borderSize);
				this.imageHolder_do.setY((imageHolderH)/2 + this.borderSize);
				
				this.image_do.setWidth(imageW);
				this.image_do.setHeight(imageH);

				this.image_do.setX(-imageW/2);
				this.image_do.setY(-imageH/2);
				
				
				FWDAnimation.to(this.imageHolder_do, .8, {x:this.borderSize, y:this.borderSize, w:imageHolderW, h:imageHolderH, delay:.2, ease:Quint.easeInOut});
				FWDAnimation.to(this.image_do, .8, {x:parseInt((imageHolderW - imageW)/2), y:parseInt((imageHolderH - imageH)/2), delay:.2, ease:Quint.easeInOut});
				//FWDAnimation.to(this.image_do, .8, {alpha:1});
				
				this.isImageAnimCompleteId_to = setTimeout(function(){
					self.isImageAnimCompleteId_bl = true;
				}, 800);
				
				this.imageHolder_do.addChild(this.image_do);
				
				if(this.presetType_str == "curtain"
				   || this.presetType_str == "3d"){
					this.main_do.addChild(this.imageHolder_do);
				}else{
					this.main_do.addChildAt(this.imageHolder_do, 1);
				}
				
				
				this.isImageShowed_bl = true;
				this.firstTimeLoad_bl = false;	
			}else{
				
				if(this.w != this.finalW || this.h != this.finalH 
					|| this.finalHOffset != this.hOffset
				   || this.lastBorderSize != this.borderSize
				){
					FWDAnimation.killTweensOf(this.image_do);
					FWDAnimation.killTweensOf(this.imageHolder_do);
					this.imageHolder_do.setX(this.borderSize);
					this.imageHolder_do.setY(this.borderSize);
					this.imageHolder_do.setWidth(imageHolderW);
					this.imageHolder_do.setHeight(imageHolderH);
					this.image_do.setX(parseInt((imageHolderW - imageW)/2));
					this.image_do.setY(parseInt((imageHolderH - imageH)/2));
				}
			
				if(this.isHidden_bl 
					|| !((self.finalY + self.finalH > globalY || self.y + self.finalH > globalY) && (self.finalY - globalY < totalVisibleHeight || self.y - globalY < totalVisibleHeight))
					&& this.isVerticalType_bl){
					this.setX(this.finalX);
					this.setY(this.finalY);
				}else{
					FWDAnimation.to(this, .8, {x:this.finalX, y:this.finalY, ease:Expo.easeInOut});
				}
				this.isFirstTimeShowed_bl = false;
				if(self.presetType_str != "scaletextinverse") clearTimeout(this.isImageAnimCompleteId_to);
				this.isImageAnimCompleteId_bl = true;
			}
			
			if(this.w != this.finalW || this.h != this.finalH 
				   || this.finalHOffset != this.hOffset
				   || this.lastBorderSize != this.borderSize
				){
				this.setWidth(this.finalW);
				this.setHeight(this.finalH  + this.textHeight);
				this.main_do.setWidth(this.finalW);
				this.main_do.setHeight(this.finalH);
				this.bk_do.setX(this.borderSize);
				this.bk_do.setY(this.borderSize );
				this.bk_do.setWidth(imageHolderW);
				this.bk_do.setHeight(imageHolderH);
				this.border_do.setWidth(imageHolderW);
				this.border_do.setHeight(imageHolderH);
				if(this.main3dContainer_do){
					this.main3dContainer_do.setWidth(this.finalW);
					this.main3dContainer_do.setHeight(this.finalH);
				}
				
			
				this.image_do.setWidth(imageW);
				this.image_do.setHeight(imageH);
			
				this.stopToCheckThumbnailHit();
			}
			
			if(this.presetType_str == "media"
			   || this.presetType_str == "media2"
			   || this.presetType_str == "scaletextinverse"
			){
				this.resizeContent();
			}
			this.hOffset = this.finalHOffset;
			this.lastBorderSize = this.borderSize;
			self.ssId = 0;
		};
		
		//#############################################//
		/* Setup content */
		//#############################################//
		this.setupContent = function(){
			this.contentHolder_do = new FWDVSDisplayObject("div");
			this.contentHolder_do.getStyle().width = '100%';
			this.contentHolder_do.getStyle().height = '100%';
			this.contentHolder_do.setBkColor('transparent');
			
			this.contentHolder_do.setX(-1000);
			this.contentHolder_do.setOverflow('visible');
			
			this.overlay_do = new FWDVSDisplayObject("div");
			this.overlay_do.getStyle().width = "100%";
			this.overlay_do.getStyle().height = "100%";
			this.overlay_do.screen.className = "overlay";
			this.overlay_do.setAlpha(this.overlayOpacity);
			this.contentHolder_do.addChild(this.overlay_do);
			
			if(self.presetType_str == 'preview') this.title_str = self.previewText;

			this.title_do = new FWDVSDisplayObject("div");	
			this.title_do.getStyle().position = 'relative'; 	
			this.title_do.hasTransform2d_bl = false;
			this.title_do.hasTransform3d_bl = false;
		
			this.title_do.setInnerHTML('<div class="in">' + this.title_str + "</div>");
			
			
			if(this.presetType_str == "default"){
				this.contentHolder_do.setOverflow('visible');
				this.arrow_do = new FWDVSDisplayObject("div");
				this.arrow_do.screen.className = 'default-arrow-main';
				this.arrow_do.setInnerHTML('<span class="default-arrow fwdfwdicon-right-arrow-thin"></span>');
				this.contentHolder_do.addChild(this.arrow_do);

				if(this.cats_ar.length){
					this.cats_do = new FWDVSDisplayObject("div");	
					this.cats_do.screen.className = 'default-categories-main';
					this.cats_str = '<div class="categories"><span class="fwdicon fwdfwdicon-categories"></span>';
					for(var i= 0; i<this.cats_ar.length; i++){
						if(i < this.cats_ar.length -1){
							this.cats_str += '<span class="category">' + this.cats_ar[i] + "</span><span class='separator'>/</span>";
						}else{
							this.cats_str += '<span class="category">' + this.cats_ar[i];
						}
						
					}
					this.cats_str += "</div>";
					this.cats_do.setInnerHTML(this.cats_str);
					if(this.cats_ar.length == 0) this.cats_do.setVisible(false);
					this.contentHolder_do.addChild(this.cats_do);
				}

				this.title_do.screen.className = "title-default";
				this.contentHolder_do.addChild(this.title_do);

				if(this.client_str){
					this.client_do = new FWDVSDisplayObject("div");	
					this.client_do.screen.className = 'default-client-main';
					this.client_do.setInnerHTML(this.client_str);
					this.contentHolder_do.addChild(this.client_do);	
				}
				
				if(this.likes_str){
					this.likes_do = new FWDVSDisplayObject("div");
					this.likes_do.screen.className = 'default-likes-main';
					this.likes_do.setInnerHTML(this.likes_str);
					this.contentHolder_do.addChild(this.likes_do);
				}
			}if(this.presetType_str == "team"){
				this.title_do.screen.className = "text-holder";
				this.contentHolder_do.addChild(this.title_do);
			}

			
			this.setupExtraText();
		};
		
		this.btn1ClickHandler = function(e){
			/*if(self.isHidden_bl 
			|| self.presetType_str == 'blog'
			|| self.presetType_str == 'team'){
				return;
			} 
			self.dispatchEvent(FWDVSThumbnail.MOUSE_UP, {id:self.id, extraButton:false});*/
		};
		
		this.btn2ClickHandler = function(e){
			/*if(self.isHidden_bl 
			|| self.presetType_str == 'blog'
			|| self.presetType_str == 'team'){
				return;
			} 
			self.dispatchEvent(FWDVSThumbnail.MOUSE_UP, {id:self.id, extraButton:true});*/
		};
		
	
		this.resizeContent = function(){
			//if(!this.isContentShowed_bl) return;
		
			var text1Y = 0;
			var text2Y = 0;
			var offsetH = 0;
			var buttonoffsetW = 0;
			var button1X;
			var button2X;
			var text1H;
		
			
			clearTimeout(this.resizeTextContent1Id_to);
		};


		
		//#############################################//
		/* Add events */
		//#############################################//
		this.addEvents = function(){
			if(this.screen.addEventListener){
				if(this.isMobile_bl){
					if(this.hasPointerEvent_bl){
						this.main_do.screen.addEventListener("pointerdown", this.onMouseUp);
					}else{
						this.main_do.screen.addEventListener("click", this.onMouseUp);
					}
					
				}else{
					this.main_do.screen.addEventListener("mouseover", this.onMouseOver);
					this.main_do.screen.addEventListener("click", this.onMouseUp);
				}
			}
		};
		
		self.onMouseOver = function(e){
			if(self.isContentShowed_bl || self.disableThumbnails_bl) return;
			if((self.presetType_str == "default" || self.presetType_str == "preview") && !self.isImageAnimCompleteId_bl) return;
			if(e) self.getInOrOutAngle(e);
			self.isHovered_bl = true;
			for(var i=0; i<self.parent.thumbnails_ar.length; i++){
				thumbnail = self.parent.thumbnails_ar[i];
				thumbnail.hideContent();
			}
			self.showContent();
			self.startToCheckThumbnailHit();

		};
		
		self.onMouseUp = function(e){
			if(e.button == 2
			|| self.disableThumbnails_bl
			|| self.isHidden_bl
			|| self.presetType_str == 'blog'){
				return;
			} 
			if(!self.isContentShowed_bl && self.isMobile_bl){
				self.onMouseOver();
				return;
			}

			//self.dispatchEvent(FWDVSThumbnail.MOUSE_UP, {id:self.id});
		};
		
		//########################################//
		/* Check thumbanil hit */
		//########################################//
		this.startToCheckThumbnailHit = function(){
			if(this.isCheckHitAdded_bl) return;
			this.isCheckHitAdded_bl = true;
			
			if(self.isMobile_bl){
				setTimeout(function(){
					if(FWDVSUtils.isIOS){
						self.hitThhumbnailId_to = window.addEventListener("touchstart", self.checkThumbnailHit);
					}else{
						self.hitThhumbnailId_to = window.addEventListener("click", self.checkThumbnailHit);
					}
				}, 50);
			}else{
				if(window.addEventListener){
					window.addEventListener("mousemove", self.checkThumbnailHit);
				}
			}
		};
		
		this.stopToCheckThumbnailHit = function(){
			if(!self.isCheckHitAdded_bl) return;
			self.isCheckHitAdded_bl = false;
		
			if(self.isMobile_bl){
				if(FWDVSUtils.isIOS){
					self.hitThhumbnailId_to = window.removeEventListener("touchstart", self.checkThumbnailHit);
				}else{
					self.hitThhumbnailId_to = window.removeEventListener("click", self.checkThumbnailHit);
				}
			}else{
				if(window.removeEventListener){
					window.removeEventListener("mousemove", self.checkThumbnailHit);
				}
			}
			
			clearTimeout(self.hitThhumbnailId_to);
			self.hideContent(true);
			self.isHovered_bl = false;
		};
		
		this.checkThumbnailHit = function(e){
			
			var vc = FWDVSUtils.getViewportMouseCoordinates(e);	
			if(vc.screenX < self.finalW && vc.screenY < self.finalH){
				//self.parent.parent.menu_do.setAlpha(0);
			}
			if(!FWDVSUtils.hitTest(self.screen, vc.screenX, vc.screenY)
					|| (self.parent.parent.searchMain_do && FWDVSUtils.hitTest(self.parent.parent.searchMain_do.screen, vc.screenX, vc.screenY))
			   		|| (self.parent.parent.menu_do && FWDVSUtils.hitTest(self.parent.parent.menu_do.selector_do.screen, vc.screenX, vc.screenY))
			   		|| (self.parent.parent.menu_do && FWDVSUtils.hitTest(self.parent.parent.menu_do.buttonsHolder_do.screen, vc.screenX, vc.screenY))){
			
				self.stopToCheckThumbnailHit();
				if(self.parent.parent.menu_do) self.parent.parent.menu_do.setAlpha(1);
				return;
			}
		};

		//#########################################//
		/* Extra text */
		//#########################################//
		this.setupExtraText = function(){
			
			if(this.hasExtraText_bl){
				this.textHolder_do = new FWDVSDisplayObject("div");
				this.textHolder_do.setX(this.borderSize);
				this.textHolder_do.getStyle().height = "100%";
				this.addChild(this.textHolder_do);
				
				this.text3_do = new FWDVSTransformDisplayObject("div");
				this.text3_do.getStyle().width = "100%";
				this.text3_do.screen.className = 'extra-text-normal';
				this.text3_do.setInnerHTML(this.htmlExtraContent_str);
				this.text3_do.setAlpha(0);
				if(!this.hasButtons_bl && self.presetType_str != 'preview'
				&& self.presetType_str != 'blog'
				&& self.presetType_str != 'team'){
					this.text3_do.setButtonMode(true);
				} 
				this.textHolder_do.addChild(this.text3_do);
			}
		};
		
		//#############################################//
		/* Show / hide content */
		//#############################################//
		this.showContent = function(){
			if(this.isContentShowed_bl || this.isHidden_bl) return;
			var children;
			var child;
			var delay1 = 0;
			var button1Delay = 0;
			var button2Delay = 0;
			var contentDelay = 0;
			var text1H;
			var alpha = 0;
			var scale = 0;
			var overlayOpacity = 0;
			var mainTransitionDuration;
			var borderTweenDuration = .6;
			var offsetW;
			var button1X;
			var button1finalY;
			var button2X;
			var button2finalY;
			var borderEase_str;
			var button1Delay;
			var button2Delay;
			
			if(this.presetType_str == "team"){
				mainTransitionDuration = .8;
				borderTweenDuration = .7;
				borderEase_str = Circ.easeOut;

				this.border_do.addChild(this.contentHolder_do);
				this.resizeContent();

				this.contentHolder_do.setX(0);
				if(this.isContentHidden_bl){
					this.overlay_do.setAlpha(0);
					this.title_do.setY((self.finalH - this.title_do.getHeight())/2 + 30);
					this.title_do.setAlpha(0);
				}
				
				this.isContentHidden_bl = false;

				FWDAnimation.killTweensOf(this.overlay_do);	
				FWDAnimation.to(this.overlay_do, .7, {alpha:1});
				this.title_do.getStyle().pointerEvents = 'auto';
				FWDAnimation.killTweensOf(this.title_do);	
				FWDAnimation.to(this.title_do, .6, {y:Math.round((self.finalH - this.title_do.getHeight())/2), alpha:1, ease:Expo.easeInOut});
			}

			if(this.borderNormalColor_str != this.borderSelectedColor_str && this.borderSize != 0){
				FWDAnimation.to(this.border_do.screen, borderTweenDuration, {css:{borderColor:this.borderSelectedColor_str}, ease:borderEase_str});
			}
			
			this.isContentShowed_bl = true;
			clearTimeout(this.contentShowCompleteId_to);
			clearTimeout(this.contentHideCompleteId_to);
			this.contentShowCompleteId_to = setTimeout(this.showContentComplete, mainTransitionDuration * 1000);
		}
		
		this.showContentComplete = function(){
			clearTimeout(self.contentShowCompleteId_to);
			clearTimeout(self.contentHideCompleteId_to);
			self.ssId = 1;
		};
		
		this.hideContent = function(){
			if(!this.isContentShowed_bl) return;
		
			var child;
			var children;
			var borderEase_str;
			var delay1;
			var alpha = 0;
			var scale = 0;
			var overlayOpacity = 0;
			var mainTransitionDuration;
			var borderTweenDuration = .6;
			var newX;
			var newY;
			var dl;
			var textY;
			var textX;
			var button1Delay = 0;
			var button2Delay = 0;
			var button1X = 0;
			var button1Y = 0;
			var button2X = 0;
			var button2Y = 0;
			
			if(this.presetType_str == "team"){
				mainTransitionDuration = .8;
				borderTweenDuration = .7;
				borderEase_str = Circ.easeOut;
				clearTimeout(this.showOrHideWithDelayId_to);

				FWDAnimation.killTweensOf(this.overlay_do);	
				FWDAnimation.to(this.overlay_do, .7, {alpha:0});

				this.title_do.getStyle().pointerEvents = 'none';
				FWDAnimation.killTweensOf(this.text_do);	
				FWDAnimation.to(this.title_do, .6, {y:Math.round((self.finalH - this.title_do.getHeight())/2 + 30), alpha:0, ease:Expo.easeInOut});
			}
			
			if(this.borderNormalColor_str != this.borderSelectedColor_str && this.borderSize != 0){
				FWDAnimation.to(this.border_do.screen, borderTweenDuration, {css:{borderColor:this.borderNormalColor_str}, ease:borderEase_str});
			}
			
			this.isContentShowed_bl = false;
			clearTimeout(this.contentShowCompleteId_to);
			clearTimeout(this.contentHideCompleteId_to);
			self.contentHideCompleteId_to = setTimeout(self.hideContentComplete, mainTransitionDuration * 1000);
		}

		
		this.hideContentComplete = function(){
			clearTimeout(self.contentShowCompleteId_to);
			clearTimeout(self.contentHideCompleteId_to);
			
			if(self.presetType_str != "media" 
			   && self.presetType_str != "scaletextinverse"
			){
				
				try{
					self.border_do.removeChild(self.contentHolder_do);
				}catch(e){}
				
				try{
					self.removeChild(self.contentHolder_do);
				}catch(e){}
				
				try{
					self.removeChild(self.fakeBorder_do);
				}catch(e){}
				if(self.contentHolder_do) self.contentHolder_do.setX(-1000);
			}
			
			self.isContentHidden_bl = true;
		};
		
		//##############################################//
		/* Get in or out angle */
		//##############################################//
		this.getInOrOutAngle = function(e){
			
			var viewportMouseCoordinates = FWDVSUtils.getViewportMouseCoordinates(e);
			var globalX = self.getGlobalX();
			var globalY = self.getGlobalY();
			var screenX = viewportMouseCoordinates.screenX;
			var screenY = viewportMouseCoordinates.screenY;
			
			var dx = screenX - (globalX + self.finalW/2);
			var dy = screenY - (globalY + self.finalH/2);
			
			var angle = Math.atan2(dy, dx) * 180/Math.PI;
			
			var thumbAngle = Math.atan2(self.finalH, self.finalW) * 180/Math.PI;
			
			if ((angle < thumbAngle) && (angle > -thumbAngle))
				self.animStartDir_str = "right";
				
			if ((angle > thumbAngle) && (angle < (180 - thumbAngle)))
				self.animStartDir_str = "bottom";
				
			if ((angle < (-180 + thumbAngle)) || (angle > (180 - thumbAngle)))
				self.animStartDir_str = "left";
				
			if ((angle > (-180 + thumbAngle)) && (angle < -thumbAngle))
				self.animStartDir_str = "top";
		};
		

		//#############################################//
		/* Hide / show */
		//#############################################//
		this.hide = function(animate, overwrite){
			if(this.isHidden_bl) return;

			clearTimeout(this.showHideId_to);
			clearTimeout(self.hideId_to);
			FWDAnimation.to(self.main_do);
		
			var globalY = Math.abs(Math.min(0, FWDVS.globalY));
			var totalVisibleHeight = FWDVS.globalY > 0 ? FWDVS.viewportHeight - FWDVS.globalY : FWDVS.viewportHeight;
			
			this.showHideId_to = setTimeout(function(){
				self.isHidden_bl = true;
				var animate_bl = self.finalY + self.finalH > globalY && self.finalY - globalY < totalVisibleHeight;
			
				var dl = .05 + Math.random() * .1;
				self.hideId_to = setTimeout(function(){
					self.parent.removeChild(self);
				}, 800 + dl * 1000);
				if(animate_bl){
					FWDAnimation.to(self.main_do, .8, {scale:0, alpha:0, delay:dl, ease:Expo.easeInOut});
					if(self.text3_do){
						FWDAnimation.to(self.text3_do, .8, {scale:0, alpha:0, delay:dl, ease:Expo.easeInOut});
					}
				}else{
					FWDAnimation.to(self.main_do, 0.01, {scale:0, alpha:0, delay:dl, ease:Quart.easeOut});
					if(self.text3_do){
						FWDAnimation.to(self.text3_do,  0.01, {scale:0, alpha:0, delay:dl, ease:Expo.easeInOut});
					}
				}
			}, 50);
		};
	
		this.show = function(animate){
		
			if(!this.isHidden_bl) return;

			clearTimeout(self.hideId_to);
			clearTimeout(this.showHideId_to);
			FWDAnimation.to(self.main_do);
			self.parent.addChild(self);
		
			var globalY = Math.abs(Math.min(0, FWDVS.globalY));
			var totalVisibleHeight = FWDVS.globalY > 0 ? FWDVS.viewportHeight - FWDVS.globalY : FWDVS.viewportHeight;
			
			clearTimeout(self.contentShowCompleteId_to);
			self.isContentHidden_bl = true;
			
			this.showHideId_to = setTimeout(function(){
				self.isHidden_bl = false;
				var animate_bl = self.finalY + self.finalH > globalY && self.finalY - globalY < totalVisibleHeight;
				
				if(animate_bl){
					var dl = .05 + Math.random() * .1;
					FWDAnimation.to(self.main_do, .8, {scale:1, alpha:1, delay:dl, ease:Expo.easeInOut});
					if(self.text3_do){
						FWDAnimation.to(self.text3_do, .8, {scale:1, alpha:1, delay:dl, ease:Expo.easeInOut});
					}
				}else{
					FWDAnimation.to(self.main_do, 0.01, {scale:1, alpha:1, delay:.05 + Math.random() * .1, ease:Quart.easeOut});
					if(self.text3_do){
						FWDAnimation.to(self.text3_do, 0.01, {scale:1, alpha:1, delay:.05 + Math.random() * .1, ease:Expo.easeInOut});
					}
				};
			}, 50);
		};
		
		
		this.setOverlayColor = function(param){
			this.overlayColor_str = param;
			this.overlay_do.setBkColor(this.overlayColor_str);
		};
		
		this.setOverlayOpacityValue = function(param){
			if(param == undefined) return
			this.overlayOpacity = param;
		};
		
		this.setOverlayOpacity = function(){
			this.overlay_do.setAlpha(this.overlayOpacity);
		};
		
		this.setContentPosition = function(param, offset, buttonsOffest){
			this.textVerticalAlign_str = param;
			this.contentOffest = offset;
			if(buttonsOffest != undefined) this.buttonsOffest = buttonsOffest; 
			
		};
		
		this.setCurtainAnimationDirection = function(param){
			self.imageTransitionDirection_str = param;
		};
		
		this.setBorderSize = function(size){
			this.borderSize = parseInt(size);
			
			if(this.borderSize == 0){
				this.border_do.getStyle().borderStyle = "none";
				this.border_do.getStyle().boxShadow = "none";
			}else{
				this.border_do.getStyle().borderStyle = "solid";
				this.border_do.getStyle().boxShadow = this.thumbanilBoxShadow_str;
			}
			
			this.border_do.getStyle().borderWidth = this.borderSize + "px";
			
		};
		
		this.setBorderRadius = function(borderRadius){
			this.borderRadius = parseInt(borderRadius);
			this.border_do.getStyle().borderRadius = this.borderRadius + "px";
			this.getStyle().borderRadius = this.borderRadius + "px";
			if(this.presetType_str == "3d") this.main_do.getStyle().borderRadius = this.borderRadius + "px";
			
		};
		
		this.setBorderColor = function(normalColor, selectedColor){
			this.borderNormalColor_str = normalColor;
			this.borderSelectedColor_str = selectedColor;
			this.border_do.getStyle().borderColor = this.borderNormalColor_str;
		};
		
		this.setBorderBoxShadow = function(param){
			this.thumbanilBoxShadow_str = param;
			if(this.presetType_str == "3d"){
				this.main_do.getStyle().boxShadow = this.thumbanilBoxShadow_str;
			}else{
				this.getStyle().boxShadow = this.thumbanilBoxShadow_str;
			}
			
			
			//if(this.thumbanilBoxShadow_str == "none" || this.thumbanilBoxShadow_str == undefined) this.getStyle().borderRadius = 0;
		};
		
		this.init();
	};
	
	
	/* set prototype */
	FWDVSThumbnail.setPrototype = function(){
		if(FWDVSUtils.hasTransform2d){
			FWDVSThumbnail.prototype = new FWDVSTransformDisplayObject("div");
		}else{
			FWDVSThumbnail.prototype = new FWDVSDisplayObject("div");
		}
	};
	

	FWDVSThumbnail.MOUSE_UP = "onMouseDown";
	FWDVSThumbnail.RIGHT = "right";
	FWDVSThumbnail.LEFT = "left";
	FWDVSThumbnail.BOTTOM = "bottom";
	FWDVSThumbnail.TOP = "top";
	
	FWDVSThumbnail.prototype = null;
	window.FWDVSThumbnail = FWDVSThumbnail;
}(window));﻿﻿﻿/* Display object */
(function (window){
	/*
	 * @ type values: div, img.
	 * @ positon values: relative, absolute.
	 * @ positon values: hidden.
	 * @ display values: block, inline-block, this applies only if the position is relative.
	 */
	var FWDVSTransformDisplayObject = function(type, position, overflow, display){
		
		this.listeners = {events_ar:[]};
		var self = this;
		
		if(type == "div" || type == "img" || type == "canvas"){
			this.type = type;	
		}else{
			throw Error("Type is not valid! " + type);
		}
	
		this.children_ar = [];
		this.style;
		this.screen;
		this.numChildren;
		this.transform;
		this.position = position || "absolute";
		this.overflow = overflow || "hidden";
		this.display = display || "block";
		this.visible = true;
		this.buttonMode;
		this.x = 0;
		this.y = 0;	
		this.scale = 1;
		this.rotation = 0;
		this.w = 0;
		this.h = 0;
		this.rect;
		this.alpha = 1;
		this.innerHTML = "";
		this.opacityType = "";
		this.isHtml5_bl = false;
		
		this.hasTransform2d_bl = FWDVSUtils.hasTransform2d;
		
		//##############################//
		/* init */
		//#############################//
		this.init = function(){
			this.setScreen();
		};	
		
		//######################################//
		/* check if it supports transforms. */
		//######################################//
		this.getTransform = function() {
		    var properties = ['transform', 'msTransform', 'WebkitTransform', 'MozTransform', 'OTransform'];
		    var p;
		    while (p = properties.shift()) {
		       if (typeof this.screen.style[p] !== 'undefined') {
		            return p;
		       }
		    }
		    return false;
		};
		
		//######################################//
		/* set opacity type */
		//######################################//
		this.getOpacityType = function(){
			var opacityType;
			if (typeof this.screen.style.opacity != "undefined") {//ie9+ 
				opacityType = "opacity";
			}else{ //ie8
				opacityType = "filter";
			}
			return opacityType;
		};
		
		//######################################//
		/* setup main screen */
		//######################################//
		this.setScreen = function(element){
			if(this.type == "img" && element){
				this.screen = element;
				this.setMainProperties();
			}else{
				this.screen = document.createElement(this.type);
				this.setMainProperties();
			}
		};
		
		//########################################//
		/* set main properties */
		//########################################//
		this.setMainProperties = function(){
			
			this.transform = this.getTransform();
			this.setPosition(this.position);
			//this.setDisplay(this.display);
			this.setOverflow(this.overflow);
			this.opacityType = this.getOpacityType();
			
			if(this.opacityType == "opacity") this.isHtml5_bl = true;
			
			if(self.opacityType == "filter") self.screen.style.filter = "inherit";
			
			this.screen.style.margin = "0px";
			this.screen.style.padding = "0px";
			this.screen.style.maxWidth = "none";
			this.screen.style.maxHeight = "none";
			this.screen.style.border = "none";
			this.screen.style.lineHeight = "1";
			this.screen.style.backgroundColor = "transparent";
			this.screen.style.backfaceVisibility = "hidden";
			this.screen.style.webkitBackfaceVisibility = "hidden";
			this.screen.style.MozBackfaceVisibility = "hidden";
			//this.screen.style.MozImageRendering = "optimizeSpeed";	
			//this.screen.style.WebkitImageRendering = "optimizeSpeed";
			//self.screen.style.transition = "none";
			//self.screen.style.webkitTransition = "none";
			//self.screen.style.MozTransition = "none";
			//self.screen.style.OTransition = "none";
			
			if(type == "img"){
				this.setWidth(this.screen.width);
				this.setHeight(this.screen.height);
				this.screen.onmousedown = function(e){return false;};
			}
		};
		
		self.setBackfaceVisibility =  function(){
			self.screen.style.backfaceVisibility = "visible";
			self.screen.style.webkitBackfaceVisibility = "visible";
			self.screen.style.MozBackfaceVisibility = "visible";		
		};
		
		self.removeBackfaceVisibility =  function(){
			self.screen.style.backfaceVisibility = "hidden";
			self.screen.style.webkitBackfaceVisibility = "hidden";
			self.screen.style.MozBackfaceVisibility = "hidden";		
		};
		
		//###################################################//
		/* set / get various peoperties.*/
		//###################################################//
		this.setSelectable = function(val){
			if(!val){
				try{this.screen.style.userSelect = "none";}catch(e){};
				try{this.screen.style.MozUserSelect = "none";}catch(e){};
				try{this.screen.style.webkitUserSelect = "none";}catch(e){};
				try{this.screen.style.khtmlUserSelect = "none";}catch(e){};
				try{this.screen.style.oUserSelect = "none";}catch(e){};
				try{this.screen.style.msUserSelect = "none";}catch(e){};
				try{this.screen.msUserSelect = "none";}catch(e){};
				this.screen.ondragstart = function(e){return  false;};
				this.screen.onselectstart = function(){return false;};
				this.screen.style.webkitTouchCallout='none';
			}
		};
		
		this.getScreen = function(){
			return self.screen;
		};
		
		this.setVisible = function(val){
			this.visible = val;
			if(this.visible == true){
				this.screen.style.visibility = "visible";
			}else{
				this.screen.style.visibility = "hidden";
			}
		};
		
		this.getVisible = function(){
			return this.visible;
		};
			
		this.setResizableSizeAfterParent = function(){
			this.screen.style.width = "100%";
			this.screen.style.height = "100%";
		};
		
		this.getStyle = function(){
			return this.screen.style;
		};
		
		this.setOverflow = function(val){
			self.overflow = val;
			self.screen.style.overflow = self.overflow;
		};
		
		this.setPosition = function(val){
			self.position = val;
			self.screen.style.position = self.position;
		};
		
		this.setDisplay = function(val){
			this.display = val;
			this.screen.style.display = this.display;
		};
		
		this.setButtonMode = function(val){
			this.buttonMode = val;
			if(this.buttonMode ==  true){
				this.screen.style.cursor = "pointer";
			}else{
				this.screen.style.cursor = "default";
			}
		};
		
		this.setBkColor = function(val){
			self.screen.style.backgroundColor = val;
		};
		
		this.setInnerHTML = function(val){
			self.innerHTML = val;
			self.screen.innerHTML = self.innerHTML;
		};
		
		this.getInnerHTML = function(){
			return self.innerHTML;
		};
		
		this.getRect = function(){
			return self.screen.getBoundingClientRect();
		};
		
		this.setAlpha = function(val){
			self.alpha = val;
			if(self.opacityType == "opacity"){
				self.screen.style.opacity = self.alpha;
			}else if(self.opacityType == "filter"){
				self.screen.style.filter = "alpha(opacity=" + self.alpha * 100 + ")";
				self.screen.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(self.alpha * 100) + ")";
			}
		};
		
		this.getAlpha = function(){
			return self.alpha;
		};
		
		this.getRect = function(){
			return this.screen.getBoundingClientRect();
		};
		
		this.getGlobalX = function(){
			return this.getRect().left;
		};
		
		this.getGlobalY = function(){
			return this.getRect().top;
		};
		
		this.setX = function(val){
			self.x = val;
			if(self.hasTransform2d_bl){
				self.screen.style[self.transform] = "translate(" + self.x + "px," + self.y + "px) scale(" + self.scale + " , " + self.scale + ") rotate(" + self.rotation + "deg)";
			}else{
				self.screen.style.left = self.x + "px";
			}
		};
		
		this.getX = function(){
			return  self.x;
		};
		
		this.setY = function(val){
			self.y = val;
			if(self.hasTransform2d_bl){
				self.screen.style[self.transform] = "translate(" + self.x + "px," + self.y + "px) scale(" + self.scale + " , " + self.scale + ") rotate(" + self.rotation + "deg)";
			}else{
				self.screen.style.top = self.y + "px";
			}
		};
		
		this.getY = function(){
			return  self.y;
		};
		
		this.setScale2 = function(val){
			self.scale = val;
			if(self.hasTransform2d_bl){
				self.screen.style[self.transform] = "translate(" + self.x + "px," + self.y + "px) scale(" + self.scale + " , " + self.scale + ") rotate(" + self.rotation + "deg)";
			}
		};
		
		this.getScale = function(){
			return  self.scale;
		};
		
		this.setRotation = function(val){
			self.rotation = val;
		
			if(self.hasTransform2d_bl){
				self.screen.style[self.transform] = "translate(" + self.x + "px," + self.y + "px) scale(" + self.scale + " , " + self.scale + ") rotate(" + self.rotation + "deg)";
			}
		};
		
		this.setWidth = function(val){
			self.w = val;
			if(self.type == "img"){
				self.screen.width = self.w;
			}else{
				self.screen.style.width = self.w + "px";
			}
		};
		
		this.getWidth = function(){
			if(self.type == "div"){
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
		
		this.setHeight = function(val){
			self.h = val;
			if(self.type == "img"){
				self.screen.height = self.h;
			}else{
				self.screen.style.height = self.h + "px";
			}
		};
		
		this.getHeight = function(){
			if(self.type == "div"){
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
		
		this.getNumChildren = function(){
			return self.children_ar.length;
		};
		
		//#####################################//
		/* DOM list */
		//#####################################//
		this.addChild = function(e){
			if(this.contains(e)){	
				this.children_ar.splice(FWDVSUtils.indexOfArray(this.children_ar, e), 1);
				this.children_ar.push(e);
				this.screen.appendChild(e.screen);
			}else{
				this.children_ar.push(e);
				this.screen.appendChild(e.screen);
			}
		};
		
		this.removeChild = function(e){
			if(this.contains(e)){
				this.children_ar.splice(FWDVSUtils.indexOfArray(this.children_ar, e), 1);
				this.screen.removeChild(e.screen);
			}else{
				throw Error("##removeChild()## Child doesn't exist, it can't be removed!");
			};
		};
		
		this.contains = function(e){
			if(FWDVSUtils.indexOfArray(this.children_ar, e) == -1){
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
					self.children_ar.splice(FWDVSUtils.indexOfArray(self.children_ar, e), 1, e);
				}else{
					self.children_ar.splice(FWDVSUtils.indexOfArray(self.children_ar, e), 0, e);
				}
			}else{
				if(index < 0  || index > self.getNumChildren() -1) throw Error("##getChildAt()## Index out of bounds!");
				
				self.screen.insertBefore(e.screen, self.children_ar[index].screen);
				if(self.contains(e)){
					self.children_ar.splice(FWDVSUtils.indexOfArray(self.children_ar, e), 1, e);
				}else{
					self.children_ar.splice(FWDVSUtils.indexOfArray(self.children_ar, e), 0, e);
				}
			}
		};
		
		this.getChildAt = function(index){
			if(index < 0  || index > this.numChildren -1) throw Error("##getChildAt()## Index out of bounds!");
			if(this.numChildren == 0) throw Errror("##getChildAt## Child dose not exist!");
			return this.children_ar[index];
		};
		
		this.removeChildAtZero = function(){
			this.screen.removeChild(this.children_ar[0].screen);
			this.children_ar.shift();
		};
		
		//################################//
		/* event dispatcher */
		//#################################//
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
	        		break;
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
	    
	    //###########################################//
	    /* destroy methods*/
	    //###########################################//
		this.disposeImage = function(){
			if(this.type == "img") this.screen.src = null;
		};
		
		
		this.destroy = function(){
			
			try{this.screen.parentNode.removeChild(this.screen);}catch(e){};
			
			this.screen.onselectstart = null;
			this.screen.ondragstart = null;
			this.screen.ontouchstart = null;
			this.screen.ontouchmove = null;
			this.screen.ontouchend = null;
			this.screen.onmouseover = null;
			this.screen.onmouseout = null;
			this.screen.onmouseup = null;
			this.screen.onmousedown = null;
			this.screen.onmousemove = null;
			this.screen.onclick = null;
			
			delete this.screen;
			delete this.style;
			delete this.rect;
			delete this.selectable;
			delete this.buttonMode;
			delete this.position;
			delete this.overflow;
			delete this.visible;
			delete this.innerHTML;
			delete this.numChildren;
			delete this.x;
			delete this.y;
			delete this.w;
			delete this.h;
			delete this.opacityType;
			delete this.isHtml5_bl;
			delete this.hasTransform2d_bl;

			this.children_ar = null;
			this.style = null;
			this.screen = null;
			this.numChildren = null;
			this.transform = null;
			this.position = null;
			this.overflow = null;
			this.display= null;
			this.visible= null;
			this.buttonMode = null;
			this.globalX = null;
			this.globalY = null;
			this.x = null;
			this.y = null;
			this.w = null;;
			this.h = null;;
			this.rect = null;
			this.alpha = null;
			this.innerHTML = null;
			this.opacityType = null;
			this.isHtml5_bl = null;
			this.hasTransform3d_bl = null;
			this.hasTransform2d_bl = null;
			self = null;
		};
		
	    /* init */
		this.init();
	};
	
	window.FWDVSTransformDisplayObject = FWDVSTransformDisplayObject;
}(window));//FWDVSUtils
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

