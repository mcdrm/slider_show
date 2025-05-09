/* FWDVSArrow */
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
}(window));