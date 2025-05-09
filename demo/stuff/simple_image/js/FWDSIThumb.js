/* thumb */
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
			
			if(self.image_do){
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
}(window));