/* FWDVSClassicVerticalThumbnailsManager */
(function (window){
	
	var FWDVSClassicVerticalThumbnailsManager = function(data, parent){
		
		var self = this;
		this.parent = parent;
		var prototype = FWDVSClassicVerticalThumbnailsManager.prototype;
		
		this.sourcePlaylist_ar = data.gallery_ar.galleryItems;
		this.originalDataThumbnails_ar = [];
		this.dataThumbnails_ar = [];
		this.thumbnails_ar = [];
		this.createdThumbnails_ar = [];
		this.tempPlaylist_ar;
	
		this.columnHeights_ar = [];
		this.loadMoreCatsData_ar = [];
		this.catId_ar = data.startAtCategory_ar;
		this.catId = this.catId_ar[0];

		this.curDataThumbnail;
		this.thumbnailLoadingType_str = data.thumbnailLoadingType_str;
		
		this.totalLoadedThumbnails = 0;
		this.loadMoreButtonOffsetTop = data.loadMoreButtonOffsetTop;
		this.loadMoreButtonOffsetBottom = data.loadMoreButtonOffsetBottom;
		this.thumbnailsPerSet = data.thumbnailsPerSet;
		this.thumbsHOffset = data.thumbnailsHorizontalOffset;
		this.thumbsVOffset = data.thumbnailsVerticalOffset;
		this.offsetTotalHeight = 0;
		this.maxH = 0;
		this.thumbOffsetX = 0;
		this.searchValue = '';
		
		this.stageWidth = 0;
		this.prevStageWidth = 0;
		this.thumbnailMaxWidth = data.thumbnailMaxWidth;
		this.thumbnailMaxHeight = data.thumbnailMaxHeight;
		this.leftWidth = 0;
		this.thumbWidth;
		this.thumbHeight;
		this.thumbsHSpace = data.horizontalSpaceBetweenThumbnails;
		this.thumbsVSpace = data.verticalSpaceBetweenThumbnails;
		this.countLoadedThumbs = 0;
		this.borderSize = data.thumbnailBorderSize;
		this.totalThumbnails = this.sourcePlaylist_ar.length;
		this.tempTotalThumbnails = this.sourcePlaylist_ar.length;
		this.totalOriginalThumbnails = this.sourcePlaylist_ar.length;
		this.globalX = 0;
		this.globalY = 0;
		this.gridType = data.gridType;
		this.catChanging_to;
		this.arangeFaterTweenId_to;
		this.allCategoriesLabel_str = data.allCategoriesLabel_str;
		this.isLoadAtTheEnd_bl = false;
		this.isLoadMoreButtonShowed_bl = true;
		this.isCatChanging_bl = false;
		this.isFirstThumbnailLoaded_bl = false;
		this.firstThumbnailShowed_bl = false;
		this.animateParent_bl = data.animateParent_bl;
		this.hasExtraText_bl = data.hasExtraText_bl;
		this.isVerticalType_bl = data.isVerticalType_bl;
	
		
		this.showAllCategories_bl = data.showAllCategories_bl;
		this.categories_ar = data.categories_ar;
		this.totalCats = this.showAllCategories_bl ? data.categories_ar.length-1 : data.categories_ar.length;
		
		this.isMobile_bl = FWDVSUtils.isMobile;
		
		
		//#######################################//
		/* initialize */
		//#######################################//
		this.init = function(){
			if(this.initialized) return;
			this.initialized = true;
			this.loadMore_do = new FWDVSDisplayObject("div");
			this.loadMore_do.screen.style.zIndex = 1000000000;
			this.loadMore_do.screen.style.backgroundColor = "#FFFFFF"
			this.screen.className = 'thumbs-holder';
			this.loadMore_do.setInnerHTML('load more');
			this.loadMore_do.setY(200);
			this.loadMore_do.setButtonMode(true);
			//self.addChild(this.loadMore_do);

			this.setBkColor(parent.backgroundColor);

			this.getStyle().position = 'relative';
			//this.getStyle().float = 'left';
			self.getStyle().wdith = '100%';
			this.setupNoSearch();
			this.setOverflow('visible');
			this.setDataForResize();
			this.setThumbsExtraTextWidth();
			this.setupThumbnails();
			this.initData();
			this.updateData(true);
			this.filterCategories();
			//this.loadThumbnailId_to = setTimeout(this.loadThumbImage, 200);
			this.startGetMousePosition();
			this.setupInfiniteScroll();
			setTimeout(this.resizeAndPosition, 100);

			this.loadMore_do.screen.addEventListener('click', function(){
				self.updateData(true);
				self.filterCategories();
				self.loadThumbImage();
			});
		};

		this.initData = function(){
			this.dataThumbnails_ar;
			for(var i=0; i<this.sourcePlaylist_ar.length; i++){
				var obj ={}
				obj.cats_ar = this.sourcePlaylist_ar[i].cats;
				obj.id = i;
				obj.thumbnailAdded = null;
				obj.thumbnail = this.createdThumbnails_ar[i];
				this.dataThumbnails_ar[i] = obj;
			}
		}
		
		//#######################################//
		/* Position and resize */
		//#######################################//
		this.resizeAndPosition = function(){
			self.stageWidth = parent.stageWidth;
			self.init();
			self.setDataForResize();
			self.positionThumbnailsAndMain();
		};
		
		//#######################################//
		/* Get mouse position */
		//#######################################//
		this.startGetMousePosition = function(){
			if(window.addEventListener){
				if(!self.isMobile_bl){
					window.addEventListener("touchstart", this.getMousePosition);
				}
				window.addEventListener("mousemove", this.getMousePosition);
			}else if(document.attachEvent){
				document.attachEvent("onmousemove", this.getMousePosition);
			}
		};
		
		this.getMousePosition = function(e){
			var mc = FWDVSUtils.getViewportMouseCoordinates(e);
			if(!self.isMobile_bl){
				self.globalX = mc.screenX;
				self.globalY = mc.screenY;
			}
		};
	
		//#######################################//
		/* Setup thumbnails */
		//#######################################//
		this.getThumbnail =  function(cats, id){
			
			var props_obj = {};
		
			props_obj.parent = this;
			props_obj.parent = this;
			props_obj.previewText = data.previewText;
			props_obj.hSize = this.sourcePlaylist_ar[id].hSize;
			props_obj.cats_ar = cats;
			props_obj.searchText = this.sourcePlaylist_ar[id].searchText;
			props_obj.slideshow_ar = this.sourcePlaylist_ar[id].slideshow;
			props_obj.showThumbnailOnlyWhenImageIsLoaded_bl = data.showThumbnailOnlyWhenImageIsLoaded_bl;
			props_obj.id = id;
			props_obj.useThumbnailSlideshow_bl = data.useThumbnailSlideshow_bl;
			props_obj.thumbnailPath_str = self.sourcePlaylist_ar[id].thumbnailPath_str;
			props_obj.presetType_str = data.presetType_str;
			props_obj.backgroundColor_str = data.thumbnailBackgroundColor_str;
			props_obj.borderNormalColor_str = this.sourcePlaylist_ar[id].thumbnailBorderNormalColor || data.thumbnailBorderNormalColor_str;
			props_obj.borderSelectedColor_str = this.sourcePlaylist_ar[id].thumbnailBorderSelectedColor || data.thumbnailBorderSelectedColor_str;
			props_obj.borderSize = data.thumbnailBorderSize;
			props_obj.borderRadius = data.thumbnailBorderRadius;
			props_obj.thumbnailOverlayColor_str = this.sourcePlaylist_ar[id].thumbnailOverlayColor || data.thumbnailOverlayColor_str;
			props_obj.thumbnailOverlayOpacity = data.thumbnailOverlayOpacity;
			props_obj.spaceBetweenTextAndIcons = data.spaceBetweenTextAndIcons;
			props_obj.extraButtonUrl_str = this.sourcePlaylist_ar[id].extraButtonUrl_str;
			props_obj.extraButtonUrlTarget_str = this.sourcePlaylist_ar[id].extraButtonUrlTarget_str;
			props_obj.thumbIconPathN_str = this.sourcePlaylist_ar[id].thumbIconPathN_str; 
			props_obj.thumbIconPathS_str = this.sourcePlaylist_ar[id].thumbIconPathS_str; 
			props_obj.thumbnailIconWidth = data.thumbnailIconWidth;
			props_obj.thumbnailIconHeight = data.thumbnailIconHeight;
			props_obj.linkIconPathN_str = data.linkIconPathN_str;
			props_obj.linkIconPathS_str = data.linkIconPathS_str;
			props_obj.spaceBetweenThumbanilIcons = data.spaceBetweenThumbanilIcons;
			props_obj.hideAndShowTransitionType_str = data.hideAndShowTransitionType_str;
			props_obj.textVerticalAlign_str = data.textVerticalAlign_str;
			props_obj.imageTransitionDirection_str = data.imageTransitionDirection_str;
			props_obj.thumbanilBoxShadow_str = data.thumbanilBoxShadow_str;
			props_obj.textAnimType_str = data.textAnimType_str;
			props_obj.disableThumbnails_bl = data.disableThumbnails_bl;
			props_obj.useIconButtons_bl = data.useIconButtons_bl;
			props_obj.alt_str = this.sourcePlaylist_ar[id].alt_str;
			props_obj.linkUrl_str = this.sourcePlaylist_ar[id].url;
			props_obj.linkTarget_str = this.sourcePlaylist_ar[id].target;
			props_obj.contentOffsetY = data.contentOffsetY;
			props_obj.buttonsOffest = data.buttonsOffestY;
			props_obj.isVerticalType_bl = data.isVerticalType_bl;
			props_obj.isDisabled_bl = this.sourcePlaylist_ar[id].disabled_bl;
			props_obj.title_str = this.sourcePlaylist_ar[id].title;
			props_obj.client_str = this.sourcePlaylist_ar[id].client;
			props_obj.likes_str = this.sourcePlaylist_ar[id].likes;
			
			
			props_obj.htmlContent2_str = this.sourcePlaylist_ar[id].htmlContent2_str;
			props_obj.htmlExtraContent_str = this.sourcePlaylist_ar[id].htmlExtraContent_str;
			
			FWDVSThumbnail.setPrototype();
			thumbnail = new FWDVSThumbnail(props_obj);
			thumbnail.addListener(FWDVSThumbnail.MOUSE_UP, this.thumbanilOnMouseUpHandler);
			
			this.addChild(thumbnail);
			return thumbnail;
		};
		
		this.thumbanilOnMouseUpHandler = function(e){
			var thumbnail = self.dataThumbnails_ar[e.id]['thumbnail'];
			window.open(thumbnail.linkUrl_str, thumbnail.linkTarget_str);
		};

		//###############################################//
		/* Scroll top */
		//###############################################//
		this.scrollTop = function(){
			var so = FWDVSUtils.getScrollOffsets();
			if(FWDAnimation.isTweening(self.scrollObj) || so.y == 0) return;
        		self.scrollObj = {posY:so.y}
        		FWDAnimation.killTweensOf(self.scrollObj);
        		FWDAnimation.to(self.scrollObj, .8, {posY:0, ease:Expo.easeInOut, onUpdate:function(){
        		 window.scrollTo(0,self.scrollObj.posY);
        	}})
		}
		
		//###############################################//
		/* Update category */
		//###############################################//
		this.updateCategory =  function(catId_ar){
			if(this.catId_ar == catId_ar) return;
			this.catId_ar = catId_ar;
			this.catId = this.catId_ar[0];
			//self.scrollTop();
			self.updateData();
			this.filterCategories();
			self.loadThumbImage();
			this.positionThumbnailsAndMain();
			this.dispatchEvent(FWDVSClassicVerticalThumbnailsManager.CATEGORY_UPDATE);
		};

		//####################################//
		/* Setup no search found */
		//####################################//
		this.setupNoSearch = function(){
			
			this.noSearch_do =  new FWDVSDisplayObject("div");
			this.noSearch_do.setOverflow("visible");
			this.noSearch_do.setDisplay("inline-block");
			this.noSearch_do.getStyle().whiteSpace = "nowrap";
			this.noSearch_do.setBackfaceVisibility();
			
			this.noSearch_do.screen.className = 'p-nothing-found'; 
			this.noSearch_do.hasTransform3d_bl =  false;
			this.noSearch_do.hasTransform2d_bl =  false;
			this.noSearch_do.setAlpha(0);
			this.noSearch_do.setInnerHTML(data.notFoundLabel);
			
			this.addChild(this.noSearch_do);
			setTimeout(function(){
				self.noSearch_do.w = self.noSearch_do.getWidth();
				self.noSearch_do.h = self.noSearch_do.getHeight();
				self.removeChild(self.noSearch_do);
			}, 70);
		};

		this.showNoSearch = function(){
			if(this.isNoSearchFoundShowed_bl) return;
			this.isNoSearchFoundShowed_bl = true;
			this.addChild(this.noSearch_do);
			this.positionNoSearchLabel();
			FWDAnimation.killTweensOf(this.noSearch_do);
			FWDAnimation.to(this.noSearch_do, .1, {alpha:1, delay:.6, yoyo:true, repeat:8});
		};
		
		this.hideNoSearch = function(){
			if(!this.isNoSearchFoundShowed_bl) return;
			this.isNoSearchFoundShowed_bl = false;
			FWDAnimation.killTweensOf(this.noSearch_do);
			FWDAnimation.to(this.noSearch_do, .1, {alpha:0, onComplete:function(){
				self.removeChild(self.noSearch_do);
			}});
			
		};
		
		this.positionNoSearchLabel = function(){
			if(!this.isNoSearchFoundShowed_bl) return;
			var stageHeight = FWDVSUtils.getViewportSize().h;
			this.noSearch_do.setX(Math.round((this.stageWidth - this.noSearch_do.w)/2));
			this.noSearch_do.setY(Math.round((stageHeight - this.noSearch_do.h)/2));
		};

		//#####################################//
		/* Setup thumbnails */
		//#####################################//
		this.setupThumbnails = function(){
			for(var i=0; i<this.totalThumbnails; i++){
				var curThumbnail_do = self.getThumbnail(self.sourcePlaylist_ar[i]["cats"], i);
				self.createdThumbnails_ar[i] = curThumbnail_do;
			}
		}
		
		//###############################################//
		/* Load thumbnails */
		//###############################################//
		this.stopToLoadImage = function(){
			clearTimeout(this.loadThumbnailId_to);
			clearTimeout(this.loadTumbImageId_to);
			if (self.image_img){
				self.image_img.onerror = null;
				self.image_img.onload = null;
				//self.image_img.src = "";
			}
		};
		
		this.startToLoadImage = function(imagePath){
			self.image_img = new Image();
			self.image_img.onerror = self.onImageLoadErrorHandler;
			self.image_img.onload = self.onImageLoadHandler;
			self.image_img.src = imagePath;
		};
		
		
		this.loadThumbImage = function(){
			self.stopToLoadImage();
		
			if(self.thumbnails_ar[self.loadedId]){
				var found = false;
				var index;
				if(self.showAllCategories_bl && self.catId == 0){
					found = true;
				}else{
					for(var i=0; i<self.thumbnails_ar[self.loadedId].cats_ar.length; i++){
						if(self.thumbnails_ar[self.loadedId].cats_ar[i] == self.categories_ar[self.catId]){
							found = true;
							break;
						}
					}
				}
				if(!found){
					self.loadedId += 1;
					this.loadThumbImage();
					return;
					if(self.loadedId >= self.thumbnails_ar.length - 1) return;
				}
			}

		
			if(!self.thumbnails_ar[self.loadedId]) return;
			if(self.thumbnails_ar[self.loadedId].hasImg_bl){
				self.loadedId ++;
				self.loadThumbImage();
				return;
			}
			
			self.startToLoadImage(self.thumbnails_ar[self.loadedId].thumbnailPath_str);	
		};

		this.onImageLoadErrorHandler = function(e){
			var message = "Thumbnail image can't be loaded, probably the path is incorrect <font color='#FFFFFF'>"
					+ self.sourcePlaylist_ar[self.curDataThumbnail.id].thumbnailPath_str + "</font>";
			self.dispatchEvent(FWDVSClassicVerticalThumbnailsManager.ERROR, {text : message});
		};

		this.onImageLoadHandler = function(e){
			
			var curThumbnail_do = self.thumbnails_ar[self.loadedId];
			curThumbnail_do.hasImg_bl = true;
			curThumbnail_do.originalWidth = self.image_img.width;
			curThumbnail_do.originalHeight = self.image_img.height;
			self.loadedId ++;
			curThumbnail_do.addImage(self.image_img);

			self.loadTumbImageId_to = setTimeout(function(){
				self.loadThumbImage();
			}, 50);
			if(!self.isFirstThumbnailLoaded_bl){
				setTimeout(function(){
					self.firstThumbnailShowed_bl = true;
				}, 50);
			}
			self.positionThumbnailsAndMain();
		};
		
		//#################################################//
		/* Search */
		//#################################################//
		this.search = function(searchValue){
			self.searchValue = searchValue;
			
			clearTimeout(self.updateSearch_to);
			self.updateSearch_to = setTimeout(function(){
				//self.scrollTop();
				self.updateData();
				self.filterCategories();
				self.loadThumbImage();
				self.positionThumbnailsAndMain();
			}, 200);
		}
		
		//#################################################//
		/* Uupdate data */
		//#################################################//

		this.updateData = function(loadMore){
			self.thumbnails_ar = [];
			
			self.toAdd = 0;
			self.totalAdded = 0;
			var firstSetPerCatFound_bl = false;
			var firstSetSearchPerCatFound_bl = false;
			var noMoreLoad = true;

			var catsCountOffeset = 0;
			if(this.showAllCategories_bl) catsCountOffeset = 1;
		
			//self.loadedId = data.finalCatsCount[Math.max(0,self.catId - catsCountOffeset)];
			self.loadedId = 0;

			//All categories
			var dataThumbnail;
			if(self.catId == 0){
				var added = 0;
				var checkAdded = 0;

				if(self.searchValue.length == 0){
					for(var i=0; i<self.dataThumbnails_ar.length; i++){
						if(self.dataThumbnails_ar[i]['thumbnailAdded'] != undefined){
							firstSetPerCatFound_bl = true;
							checkAdded ++;
							if(checkAdded >= self.thumbnailsPerSet) firstSetPerCatFound_bl = true;
						}
					}
				}else{
					for(var i=0; i<self.dataThumbnails_ar.length; i++){
						if(self.dataThumbnails_ar[i]['thumbnailAdded'] != undefined
							&& self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
							checkAdded ++;
							if(checkAdded >= self.thumbnailsPerSet) firstSetSearchPerCatFound_bl = true;
						}
					}
				}

				var limit = self.thumbnailsPerSet;
				if(checkAdded < self.thumbnailsPerSet){
					limit = self.thumbnailsPerSet - checkAdded;
				}

				for(var i=0; i<self.dataThumbnails_ar.length; i++){
					if(added == limit) break;
					if(self.searchValue.length == 0){
						if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined && (!firstSetPerCatFound_bl || loadMore)){
							self.dataThumbnails_ar[i]['thumbnailAdded'] = true;
							added++;
						}
					}else{
						if(self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1 && (!firstSetSearchPerCatFound_bl || loadMore)){
							if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined){
								self.dataThumbnails_ar[i]['thumbnailAdded'] = true;
								added++;
							}
						}
					}
				}
				
				for(var i=0; i<self.dataThumbnails_ar.length; i++){
					if(self.searchValue.length == 0){
						if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined){
							noMoreLoad = false;
							break;
						}
					}else{
						if(self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
							if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined){
								noMoreLoad = false;
								break;
							}
						}
					}
				}
			}else{
				var added = 0;
				var checkAdded = 0;
				for(var i=0; i<self.dataThumbnails_ar.length; i++){
					for(var j=0; j<self.dataThumbnails_ar[i]['cats_ar'].length; j++){
						if(self.dataThumbnails_ar[i]['cats_ar'][j] == self.categories_ar[self.catId]){
							if(self.searchValue.length == 0){
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] != undefined){
									checkAdded ++;
									if(checkAdded >= self.thumbnailsPerSet) firstSetPerCatFound_bl = true;
								}
							}else{
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] != undefined
								   && self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
								   checkAdded ++;
								   if(checkAdded >= self.thumbnailsPerSet) firstSetPerCatFound_bl = true;
								}
							}
						}
					}
				}

				if(self.searchValue.length != 0){
					checkAdded = 0;
					for(var i=0; i<self.dataThumbnails_ar.length; i++){
						for(var j=0; j<self.dataThumbnails_ar[i]['cats_ar'].length; j++){
							if(self.dataThumbnails_ar[i]['cats_ar'][j] == self.categories_ar[self.catId]){
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] != undefined
								   && self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
								   checkAdded ++;
								   if(checkAdded >= self.thumbnailsPerSet) firstSetSearchPerCatFound_bl = true;
								}
							}
						}
					}
				}
			
				var limit = self.thumbnailsPerSet;
				if(checkAdded < self.thumbnailsPerSet){
					limit = self.thumbnailsPerSet - checkAdded;
				}

				addedLoop:for(var i=0; i<self.dataThumbnails_ar.length; i++){
					if(added == limit) break;
					for(var j=0; j<self.dataThumbnails_ar[i]['cats_ar'].length; j++){
						if(self.searchValue.length == 0){
							if(self.dataThumbnails_ar[i]['cats_ar'][j] == self.categories_ar[self.catId]){
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined && (!firstSetPerCatFound_bl || loadMore)){
									self.dataThumbnails_ar[i]['thumbnailAdded'] = true;
									added++
									continue addedLoop;
								}
							}
						}else{

							if(self.dataThumbnails_ar[i]['cats_ar'][j] == self.categories_ar[self.catId]){
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined && (!firstSetSearchPerCatFound_bl || loadMore)
								   && self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
									self.dataThumbnails_ar[i]['thumbnailAdded'] = true;

									added++;
									continue addedLoop;
								}
							}
						}
					}
				}

				for(var i=0; i<self.dataThumbnails_ar.length; i++){
					for(var j=0; j<self.dataThumbnails_ar[i]['cats_ar'].length; j++){
						if(self.dataThumbnails_ar[i]['cats_ar'][j] == self.categories_ar[self.catId]){
							if(self.searchValue.length == 0){
								if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined){
									noMoreLoad = false;
									break;
								}
							}else{
								if(self.dataThumbnails_ar[i]['thumbnail']['searchText'].toLowerCase().indexOf(self.searchValue) != -1){
									if(self.dataThumbnails_ar[i]['thumbnailAdded'] == undefined){
										noMoreLoad = false;
										break;
									}
								}
							}
						}
					}
				}
			}
			
			for(var i=0; i< self.dataThumbnails_ar.length; i++){
				if(self.dataThumbnails_ar[i]['thumbnailAdded']){
					self.thumbnails_ar.push(self.dataThumbnails_ar[i].thumbnail);
				}
			}
			self.noMoreLoad = noMoreLoad;
			clearTimeout(this.loadInifiniteId_to);
			this.loadInifiniteId_to = setTimeout(self.updateLoadMore, 200);
		}

		this.updateLoadMore = function(){
			if(self.noMoreLoad){
				self.loadMore_do.setX(-5000)
			}else{
				self.loadMore_do.setX(0);
			}
			
		}

		//####################################//
		/* Filter categories */
		//###################################//
		this.setupInfiniteScroll = function(){
			if(window.addEventListener){
				window.addEventListener("scroll", this.onScrollHandler);
			}
		};

		this.onScrollHandler = function(){
			if(self.noMoreLoad) return;
			
		};

		this.load= function(){
			if(!self.tempThumbnails_ar || self.noMoreLoad) return;
			var lastThumbnail = self.tempThumbnails_ar[self.tempThumbnails_ar.length - 1];
			clearTimeout(self.loadInifiniteId_to);
			this.loadInifiniteId_to = setTimeout(function(){
				if((self.getGlobalY() + lastThumbnail.finalY) + lastThumbnail.finalH - 10 <= FWDVSUtils.getViewportSize().h){
					self.updateData(true);
					self.filterCategories();
					self.loadThumbImage();
				}
			}, 100);
		};
	
		//####################################//
		/* Filter categories */
		//###################################//
		this.filterCategories = function(){
			
			var thumbnail;
			self.tempThumbnails_ar = [];
			var catId = self.catId_ar[0];
			
			thumbnailsLoop:for (var i=0; i<self.thumbnails_ar.length; i++){
				thumbnail = self.thumbnails_ar[i];
				thumbnail.isFound_bl = false;
				if(catId == 0){
					if(self.searchValue.length == 0){
						thumbnail.isFound_bl = true;
						self.tempThumbnails_ar.push(thumbnail);
						continue thumbnailsLoop;
					}else{
						if(thumbnail.searchText.toLowerCase().indexOf(self.searchValue) != -1){
							thumbnail.isFound_bl = true;
							self.tempThumbnails_ar.push(thumbnail);
							continue thumbnailsLoop;
						}else{
							thumbnail.isFound_bl = false;
						}
					}
				}else{
					for(var j=0; j<thumbnail.cats_ar.length; j++){
						if(self.searchValue.length == 0){
							if(self.categories_ar[catId] == thumbnail.cats_ar[j] || self.categories_ar[catId] == self.allCategoriesLabel_str){
								thumbnail.isFound_bl = true;
								self.tempThumbnails_ar.push(thumbnail);
								continue thumbnailsLoop;
							}else{
								thumbnail.isFound_bl = false;
							}
						}else{
							if((self.categories_ar[catId] == thumbnail.cats_ar[j] || self.categories_ar[catId] == self.allCategoriesLabel_str)
							  && (thumbnail.searchText.toLowerCase().indexOf(self.searchValue) != -1)){
								thumbnail.isFound_bl = true;
								self.tempThumbnails_ar.push(thumbnail);
								continue thumbnailsLoop;
							}else{
								thumbnail.isFound_bl = false;
							}
						}
					}
				}
			}
			
			for(var i=0; i<self.thumbnails_ar.length; i++){
				thumbnail = self.thumbnails_ar[i];
				if(thumbnail.isFound_bl){
					thumbnail.show(true);
				}else{
					thumbnail.hide(true);
				}
				if(i == self.thumbnails_ar.length -1){
					clearTimeout(self.ttId_to);
					self.ttId_to = setTimeout(function(){
						self.setFinalSize(true);
					},100);
				}
			}

			if(self.tempThumbnails_ar.length == 0){
				this.showNoSearch();
			}else{
				this.hideNoSearch();
			}
			
			self.totalThumbnails = self.tempThumbnails_ar.length;
		};
		
		
		//###############################################//
		/* set data for thumbnail resize */
		//###############################################//
		this.setDataForResize = function(){
			if(!this.stageWidth) return;
			
			this.totalColumns = Math.ceil((this.stageWidth - this.thumbsHOffset * 2 + this.thumbsHSpace) / (this.thumbnailMaxWidth + this.borderSize * 2 + this.thumbsHSpace));
			this.thumbWidth = Math.floor((this.stageWidth - this.thumbsHOffset * 2 + this.thumbsHSpace - this.totalColumns * (this.thumbsHSpace + this.borderSize * 2)) / this.totalColumns);
			if(this.thumbWidth < 300 && this.stageWidth > this.thumbWidth){
				this.totalColumns -= 1;
				this.thumbWidth = Math.floor((this.stageWidth - this.thumbsHOffset * 2 + this.thumbsHSpace - this.totalColumns * (this.thumbsHSpace + this.borderSize * 2)) / this.totalColumns);
			}

			this.totalRows = Math.ceil((FWDVS.viewportHeight - this.thumbsVOffset * 2 + this.thumbsVSpace) / (this.thumbnailMaxHeight + this.borderSize * 2 + this.thumbsVSpace));
			this.totalVisibleThumbnails = this.totalColumns * this.totalRows;

			this.thumbHeight = Math.floor(this.thumbWidth * (this.thumbnailMaxHeight / this.thumbnailMaxWidth));

			this.leftHeight = 0;
			if(data.fitToViewportHeight_bl && !self.isMobile_bl){
				this.thumbHeight = Math.floor((FWDVS.viewportHeight - this.thumbsVOffset * 2 + this.thumbsVSpace - this.totalRows * (this.thumbsVSpace + this.borderSize * 2)) / this.totalRows);
				this.totalThumbnailRows = Math.ceil((self.totalThumbnails/this.totalColumns));
				this.leftHeight = FWDVS.viewportHeight - (self.totalRows * this.thumbHeight);
			}
			
			
			var totalWidth = this.totalColumns * (this.thumbWidth + this.borderSize * 2 + this.thumbsHSpace) - this.thumbsHSpace;
			this.leftWidth = this.stageWidth - this.thumbsHOffset * 2 - totalWidth;

			this.prevStageWidth = this.stageWidth;
		};
		
		//#############################################//
		/* Position and resize main thumbnails and main div's */
		//##############################################//
		this.positionThumbnailsAndMain = function(){

			self.columnHeights_ar = [];
			for (var i=0; i<self.totalColumns; i++){
				self.columnHeights_ar[i] = 0;
			}
			
			for (var i=0; i<self.tempThumbnails_ar.length; i++){
				thumbnail = self.tempThumbnails_ar[i];
				thumbnail.used_bl = false;
			}

			if(this.hasExtraText_bl){
				self.setThumbsExtraTextWidth();
				clearTimeout(self.resizeWithExtraContentId_to);
				
				self.positionThumbnailWithExtraContent();
				self.setFinalSize();

				self.resizeWithExtraContentId_to = setTimeout(function(){
					self.positionThumbnailWithExtraContent();
					self.setFinalSize();
				}, 150);
			}else{
				if(self.gridType == 'dynamic'){
					self.positionThumbnailsDynamic();
					self.positionThumbnails2();
				}else{
					self.positionThumbnailsClassic();
				}
				
				self.setFinalSize();
			}
		};
		
		this.setFinalSize = function(overwrite){
			
			if(self.maxH){
				self.totalHeight = Math.max(0, this.maxH * (this.thumbHeight + this.thumbsVSpace + this.borderSize * 2) - this.thumbsVSpace + this.thumbsVOffset * 2);
			}

			self.totalHeight += self.offsetTotalHeight;

		
			if(self.prevTotalHeight != self.totalHeight || overwrite){
				
				self.setHeight(self.totalHeight);
				
				clearTimeout(self.arangeFaterTweenId_to);
				self.arangeFaterTweenId_to = setTimeout(function(){
					if(self.stageWidth !=  parent.stageContainer.offsetWidth){
						parent.onResizeHandler();
					}
				}, 900);
			}
			
			parent.setFinalSize();
			
			parent.stageWidth = parent.stageContainer.offsetWidth;
			
			if(self.stageWidth != parent.stageWidth || self.prevTotalHeight != self.totalHeight){
				parent.onResizeHandler();
			}
			self.prevTotalHeight = self.totalHeight;
		};
		
		//###############################################//
		/* position thumbmails dynamic*/
		//###############################################//
		this.positionThumbnailsDynamic = function(){
			var minH;
			var minHVal;
			var wSize;
			var hSize;
			var found_bl;
			var fPlace;
			var tempFinalX;
			var tempFinalY;
			var tempFinalW;
			var tempFinalH;
			var thumbnail;
			var finalW_ar = [];
			var finalX_ar = [];

			for (var i=0; i<self.totalColumns; i++){
				finalW_ar[i] = self.thumbWidth + self.borderSize * 2;

				if((self.leftWidth > 0) && (i < self.leftWidth)){
					finalW_ar[i]++;
				}

				if (i == 0){
					finalX_ar[i] = self.thumbsHOffset;
				}else{
					finalX_ar[i] = finalX_ar[i - 1] + finalW_ar[i - 1] + self.thumbsHSpace;
				}
			}

			for(var i=0; i<self.tempThumbnails_ar.length; i++){
				thumbnail = self.tempThumbnails_ar[i];
				if(thumbnail.used_bl) continue;
				
				wSize = thumbnail.wSize;
				hSize = thumbnail.hSize;
				if(self.totalColumns == 1){
					if(wSize == 2){
						wSize = 1;
						hSize = 1;
					}
				} 
				
				minHVal = 1000;
				
				if(wSize == 1){
					thumbnail.used_bl = true;
					
					for(var j=0; j<self.totalColumns; j++){
						if(self.columnHeights_ar[j] < minHVal){
							minHVal = self.columnHeights_ar[j];
						}
					}
					
					for (var j=0; j<self.totalColumns; j++){
						if (self.columnHeights_ar[j] == minHVal){
							minH = j;
							break;
						}
					}
				
					tempFinalX = finalX_ar[minH];
					tempFinalW = finalW_ar[minH];

					tempFinalY = self.columnHeights_ar[minH] * (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) + self.thumbsVOffset;
					tempFinalH = (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) * hSize - self.thumbsVSpace;
					
					thumbnail.finalW = tempFinalW;
					thumbnail.finalH = tempFinalH;
					
					thumbnail.finalX = tempFinalX;
					thumbnail.finalY = tempFinalY;
				
					thumbnail.resizeAndPosition();
					
					self.columnHeights_ar[minH] += hSize;
				}else{
					found_bl = false;
					
					for (var j=0; j<self.totalColumns - (wSize-1); j++){
						fPlace = true;
						
						for (var k=0; k<wSize; k++){
							if (self.columnHeights_ar[j] != self.columnHeights_ar[j+k]) fPlace = false;
						}
						
						if (fPlace && (self.columnHeights_ar[j] < minHVal)){
							minHVal = self.columnHeights_ar[j];
							minH = j;
							found_bl = true;
						}
					}
					
					if (found_bl){	
						thumbnail.used_bl = true;
						
						tempFinalX = finalX_ar[minH];
						tempFinalY = self.columnHeights_ar[minH] * (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) + self.thumbsVOffset;
						
						tempFinalW = -self.thumbsHSpace;
						for (var k=0; k<wSize; k++){
							tempFinalW += finalW_ar[minH + k] + self.thumbsHSpace;
						}
						
						tempFinalH = (self.thumbHeight + self.thumbsVSpace + self.borderSize * 2) * hSize - self.thumbsVSpace;
						
						thumbnail.finalW = tempFinalW;
						thumbnail.finalH = tempFinalH;
						
						thumbnail.finalX = tempFinalX;
						thumbnail.finalY = tempFinalY;
						
						thumbnail.resizeAndPosition();
						
						for (var k=0; k<wSize; k++){
							self.columnHeights_ar[minH + k] += hSize;
						}
					}
				}
			}
			
			self.maxH = 0;
			
			for (var i=0; i<self.totalColumns; i++){
				if (self.columnHeights_ar[i] > self.maxH){
					self.maxH = self.columnHeights_ar[i];
				}
			}
		};

		this.positionThumbnails2 = function(){
			var tempFinalX;
			var tempFinalY;
			var tempFinalW;
			var tempFinalH;
			var finalW_ar = [];
			
			for (var i=0; i<self.totalColumns; i++){
				finalW_ar[i] = self.thumbWidth + self.borderSize * 2;
				if ((self.leftWidth > 0) && (i < self.leftWidth)){
					finalW_ar[i]++;
				}
			}
			
			this.maxH = 0;
			
			for (var i=0; i<this.totalColumns; i++){
				if (this.columnHeights_ar[i] > this.maxH){
					this.maxH = this.columnHeights_ar[i];
				}
			}
			
			for (var i=0; i<this.tempThumbnails_ar.length; i++){
				thumbnail = this.tempThumbnails_ar[i];
				
				if (thumbnail.used_bl) continue;
				
				thumbnail.used_bl = true;
			
				wSize = thumbnail.wSize;
				hSize = thumbnail.hSize;
				
				if (this.totalColumns < wSize){
					wSize = this.totalColumns;
				}
				
				tempFinalX = this.thumbsHOffset;
				tempFinalY = this.maxH * (this.thumbHeight + this.thumbsVSpace + this.borderSize * 2) + this.thumbsVOffset;
				
				tempFinalW = -self.thumbsHSpace;
				for (var k=0; k<wSize; k++){
					tempFinalW += finalW_ar[k] + self.thumbsHSpace;
				}
	
				tempFinalH = (this.thumbHeight + this.thumbsVSpace + this.borderSize * 2) * hSize - this.thumbsVSpace;
				
				thumbnail.finalX = tempFinalX;
				thumbnail.finalY = tempFinalY;
				
				thumbnail.finalW = tempFinalW;
				thumbnail.finalH = tempFinalH;
				
				thumbnail.resizeAndPosition();
				
				this.maxH += hSize;

				for (var k=0; k<wSize; k++){
					this.columnHeights_ar[k] = this.maxH;
				}
			}
		};

		//###############################################//
		/* position thumbmails classic*/
		//###############################################//
		this.positionThumbnailsClassic = function(){
			if(!self.tempThumbnails_ar) return;

			var tempFinalX;
			var tempFinalY;
			var tempFinalW;
			var tempFinalH;
			var thumbnail;
			var lastFinalX;

			for (var i=0; i<self.tempThumbnails_ar.length; i++){

				thumbnail = self.tempThumbnails_ar[i];

				tempFinalW = self.thumbWidth + self.borderSize * 2;
				tempFinalH = self.thumbHeight + self.borderSize * 2;

				if ((self.leftWidth > 0) && ((i%self.totalColumns) < self.leftWidth)){
					tempFinalW++;
				}
				tempFinalY = Math.floor(i/self.totalColumns) * (tempFinalH + self.thumbsVSpace) + self.thumbsVOffset;
				if((self.leftHeight > 0) && i == (self.totalRows -1) * self.totalColumns + i%self.totalColumns){
					tempFinalH += self.leftHeight;
				}

				if ((self.leftHeight > 0) && i == self.totalRows * self.totalColumns + i%self.totalColumns){
					tempFinalY += self.leftHeight;
				}

				if (i%self.totalColumns == 0){
					lastFinalX = self.thumbsHOffset;
					tempFinalX = self.thumbsHOffset;
				}else{
					tempFinalX = lastFinalX;
				}

				lastFinalX += tempFinalW + self.thumbsHSpace;

				thumbnail.finalW = tempFinalW;
				thumbnail.finalH = tempFinalH;

				thumbnail.finalX = tempFinalX;
				thumbnail.finalY = tempFinalY;

				thumbnail.resizeAndPosition();
			}

			if (thumbnail){
				self.totalHeight = tempFinalY + tempFinalH + self.thumbsVOffset;
			}else{
				self.totalHeight = 0;
			}

		};
		
		this.setThumbsExtraTextWidth = function(){
			var tempFinalW;
			var thumbnail;
			
			for (var i=0; i<self.thumbnails_ar.length; i++){
				thumbnail = self.thumbnails_ar[i];
				tempFinalW = self.thumbWidth + self.borderSize * 2;
				
				if ((self.leftWidth > 0) && ((i%self.totalColumns) < self.leftWidth)){
					tempFinalW++;
				}
				
				if (thumbnail.hasExtraText_bl){
					thumbnail.textHolder_do.setWidth(tempFinalW - self.borderSize * 2);
				}
			}
		};
				
		this.positionThumbnailWithExtraContent = function(){
			if(!self.tempThumbnails_ar) return;

			var tempFinalX;
			var tempFinalY;
			var tempFinalW;
			var tempFinalH;
			var thumbnail;
			var lastFinalX;
			var lastFinalY = 0;
			var maxExtraHeight = 0;
			var addToMainMaxExtraHeight = 0;

			for (var i=0; i<self.tempThumbnails_ar.length; i++){

				thumbnail = self.tempThumbnails_ar[i];
				
				tempFinalW = self.thumbWidth + self.borderSize * 2;
				tempFinalH = self.thumbHeight + self.borderSize * 2;


				if(thumbnail.hasExtraText_bl){
					thumbnail.textHeight = thumbnail.text3_do.getHeight();
				}

				if ((self.leftWidth > 0) && ((i%self.totalColumns) < self.leftWidth)){
					tempFinalW++;
				}

				tempFinalY = Math.floor(i/self.totalColumns) * (tempFinalH + self.thumbsVSpace) + self.thumbsVOffset;
				
				if(i > 0 && (i%self.totalColumns) == 0){
					maxExtraHeight = 0;
					addToMainMaxExtraHeight = 0;
					
					for(var j = i - self.totalColumns; j<i; j++){
						if (self.tempThumbnails_ar[j].textHeight > maxExtraHeight){
							maxExtraHeight = self.tempThumbnails_ar[j].textHeight;
						}
					}

					for(var j = i; j<i + self.totalColumns; j++){
						if(self.tempThumbnails_ar[j]){
							if (self.tempThumbnails_ar[j].textHeight > addToMainMaxExtraHeight){
								addToMainMaxExtraHeight = self.tempThumbnails_ar[j].textHeight;
							}
						}
					}
				}

				if(self.totalThumbnails <= self.totalColumns){
					for(var j = 0; j<self.totalThumbnails; j++){
						if (self.tempThumbnails_ar[j].textHeight > addToMainMaxExtraHeight){
							addToMainMaxExtraHeight = self.tempThumbnails_ar[j].textHeight;
						}
					}
				}

				if ((i != 0) && (i%self.totalColumns == 0)){
					lastFinalY += tempFinalH  + maxExtraHeight + self.thumbsVSpace;
				}

				if(i%self.totalColumns == 0){
					lastFinalX = self.thumbsHOffset;
					tempFinalX = self.thumbsHOffset;
				}else{
					tempFinalX = lastFinalX;
				}

				lastFinalX += tempFinalW + self.thumbsHSpace;
				tempFinalY = lastFinalY;
				
				thumbnail.finalW = tempFinalW;
				thumbnail.finalH = tempFinalH;
				
				thumbnail.finalX = tempFinalX;
				thumbnail.finalY = tempFinalY ;

				thumbnail.resizeAndPosition();
			}
			
			if (thumbnail){
				self.totalHeight = tempFinalY + tempFinalH + self.thumbsVOffset + addToMainMaxExtraHeight;
			}else{
				self.totalHeight = 0;
			}
		};
	};
	
	/* set prototype */
	FWDVSClassicVerticalThumbnailsManager.setPrototype = function(){
		FWDVSClassicVerticalThumbnailsManager.prototype = new FWDVSDisplayObject("div", "relative");
	};
	
	FWDVSClassicVerticalThumbnailsManager.OPEN_LIGHTBOX = "openLightbox";
	FWDVSClassicVerticalThumbnailsManager.CATEGORY_UPDATE = "categoryUpdate";
	FWDVSClassicVerticalThumbnailsManager.ERROR = "error";
	
	FWDVSClassicVerticalThumbnailsManager.prototype = null;
	window.FWDVSClassicVerticalThumbnailsManager = FWDVSClassicVerticalThumbnailsManager;
	
}(window));