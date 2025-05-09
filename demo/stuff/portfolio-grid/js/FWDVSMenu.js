/* FWDVSMenu */
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
}(window));