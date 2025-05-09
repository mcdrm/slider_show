(function (window){
	
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
				this.image_do.getStyle().left = 0;

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
}(window));﻿﻿