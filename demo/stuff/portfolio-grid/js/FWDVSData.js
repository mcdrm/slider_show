/* Data */
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
}(window));