/* FWDVSSimpleButton */
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
}(window));