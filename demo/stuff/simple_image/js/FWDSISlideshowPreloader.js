/* Thumb */
(function (window){
	
	var FWDISPSlideshowPreloader = function(parent, preloaderPostion, radius, backgroundColor, fillColor, strokeSize, animDuration){
		
		var self  = this;
		var prototype = FWDISPSlideshowPreloader.prototype;
		self.preloaderPostion = preloaderPostion;
		self.backgroundColor = backgroundColor;
		self.fillColor = fillColor;
		self.radius = radius;
		self.strokeSize = strokeSize;
		this.animDuration = animDuration || 300;
		this.strtAngle = 270;
		this.countAnimation = 0;
		this.isShowed_bl = true;
		this.slideshowAngle = {n:0};
		
		//###################################//
		/* init */
		//###################################//
		this.init = function(){
			self.setOverflow('visible');
			self.setWidth((self.radius * 2) + self.strokeSize);
			self.setHeight((self.radius * 2) + self.strokeSize);
			this.bkCanvas =  new FWDISPDisplayObject("canvas");
			this.bkCanvasContext = this.bkCanvas.screen.getContext('2d');
			this.fillCircleCanvas = new FWDISPDisplayObject("canvas");
			this.fillCircleCanvasContext = this.fillCircleCanvas.screen.getContext('2d');
		
			this.addChild(this.bkCanvas);
			this.addChild(this.fillCircleCanvas);
			self.drawBackground();
			self.drawFill();
			self.hide();
		};

		/*
			Postion
		*/
		this.positionAndResize = function(){

			if(self.preloaderPostion == 'bottomleft'){
				self.setX(parent.offsetPreloader);
				self.setY(parent.stageHeight - self.h - parent.offsetPreloader);
			}else if(self.preloaderPostion == 'bottomright'){
				self.setX(parent.stageWidth - self.w - parent.offsetPreloader);
				self.setY(parent.stageHeight - self.h - parent.offsetPreloader);
			}else if(self.preloaderPostion == 'topright'){
				self.setX(parent.stageWidth - self.w - parent.offsetPreloader);
				self.setY(parent.offsetPreloader);
			}else if(self.preloaderPostion == 'topleft'){
				self.setX(parent.offsetPreloader);
				self.setY(parent.offsetPreloader);
			}else if(self.preloaderPostion == 'center'){

			}

			self.getStyle().left = Math.round(parent.stageWidth - self.w)/2 + "px";
			self.getStyle().top = Math.round(parent.stageHeight - self.h)/2 + "px";
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
			FWDAnimation.to(self.screen, self.animDuration, {rotation:360,  repeat:100});
		}

		this.stopPreloader = function(){
			FWDAnimation.killTweensOf(self.slideshowAngle);
			FWDAnimation.killTweensOf(self.screen);
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
			self.dispatchEvent(FWDISPSlideshowPreloader.HIDE_COMPLETE);
		};
		
		this.init();
	};
	
	/* set prototype */
    FWDISPSlideshowPreloader.setPrototype = function(){
    	FWDISPSlideshowPreloader.prototype = new FWDISPDisplayObject("div");
    };
    
    FWDISPSlideshowPreloader.HIDE_COMPLETE = "hideComplete";
    
    FWDISPSlideshowPreloader.prototype = null;
	window.FWDISPSlideshowPreloader = FWDISPSlideshowPreloader;
}(window));