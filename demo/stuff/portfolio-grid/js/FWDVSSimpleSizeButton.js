/* FWDVSSimpleSizeButton */
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
}(window));