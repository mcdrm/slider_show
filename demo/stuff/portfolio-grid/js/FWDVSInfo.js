/* Info screen */
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
}(window));