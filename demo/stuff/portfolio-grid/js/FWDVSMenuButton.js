/* FWDVSMenuButton */
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
}(window));