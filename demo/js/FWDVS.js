(function (t) {
    "use strict";
    var s = function (e) {
        var o = this;
        (this.init = function () {
            return (FWDTweenLite.ticker.useRAF(!0), (this.props_obj = e), (this.listeners = { events_ar: [] }), (this.mustHaveHolderDiv_bl = !1), (this.instanceName_str = this.props_obj.instanceName), !o.props_obj.gridType)
                ? void alert("FWDVS grid type is required please make sure that the gridType parameter is defined in the contructor function!")
                : ((o.gridType_str = o.props_obj.gridType || "classic"), (o.gridType_str = (o.gridType_str + "").toLowerCase()), !this.props_obj.instanceName)
                ? void alert("FWDVS instance name is required please make sure that the instanceName parameter exsists and it's value is uinique.")
                : t[this.instanceName_str]
                ? void alert("FWDVS instance name " + this.instanceName_str + " is already defined and contains a different instance reference, set a different instance name.")
                : ((t[this.instanceName_str] = this),
                  this.props_obj
                      ? !this.props_obj.parentId && this.mustHaveHolderDiv_bl
                          ? void alert("Property parentId is not defined in the FWDVS constructor, self property represents the div id into which the megazoom is added as a child!")
                          : this.mustHaveHolderDiv_bl && !FWDVSUtils.getChildById(o.props_obj.parentId)
                          ? void alert("FWDVS parent div is not found, please make sure that the div exsists and the id is correct! " + o.props_obj.parentId)
                          : void ((this.displayType = this.props_obj.displayType || s.RESPONSIVE),
                            (this.displayType = this.displayType.toLowerCase()),
                            o.displayType.toLowerCase() != s.RESPONSIVE &&
                                o.displayType.toLowerCase() != s.FULL_SCREEN &&
                                o.displayType.toLowerCase() != s.FLUID_WIDTH &&
                                o.displayType.toLowerCase() != s.AFTER_PARENT &&
                                (this.displayType = s.RESPONSIVE),
                            (this.body = document.getElementsByTagName("body")[0]),
                            (this.stageContainer = this.displayType == s.FULL_SCREEN ? o.body : FWDVSUtils.getChildById(this.props_obj.parentId)),
                            this.customContextMenu,
                            this.info_do,
                            this.main_do,
                            this.preloader_do,
                            this.menu_do,
                            this.thumbnailManager_do,
                            this.lighBox_do,
                            this.rect,
                            (this.backgroundColor = this.props_obj.backgroundColor || "transparent"),
                            (this.slideshowRadius = this.props_obj.slideshowRadius || 10),
                            (this.slideshowBackgroundColor = this.props_obj.slideshowBackgroundColor || "#FFFFFF"),
                            (this.slideshowFillColor = this.props_obj.slideshowFillColor || "#000000"),
                            (this.slideshowStrokeSize = this.props_obj.slideshowStrokeSize || 3),
                            (this.zIndex = parseInt(e.zIndex) || 0),
                            (this.stageWidth = 0),
                            (this.stageHeight = 0),
                            (this.pageXOffset = t.pageXOffset),
                            (this.pageYOffset = t.pageYOffset),
                            (this.catId_ar = -1),
                            (this.maxWidth = this.props_obj.maxWidth || 640),
                            (this.maxHeight = this.props_obj.maxHeight || 380),
                            (this.thumbnailsVOffset = this.props_obj.thumbnailsVerticalOffset || 0),
                            (this.searchIconW = 0),
                            this.resizeHandlerId1_to,
                            this.resizeHandlerId2_to,
                            this.scrollEndId_to,
                            this.orientationChangeId_to,
                            (this.isVerticalType_bl = !0),
                            (this.isDataLoaded_bl = !1),
                            (this.autoScale_bl = "yes" == this.props_obj.autoScale),
                            (this.animate_bl = "yes" == this.props_obj.animateParent),
                            (this.showFullScreenButton_bl = "yes" == this.props_obj.showFullScreenButton),
                            (this.orintationChanceComplete_bl = !0),
                            (this.isMobile_bl = FWDVSUtils.isMobile),
                            (this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent),
                            (this.isReady_bl = !1),
                            (o.initializeOnlyWhenVisible_bl = o.props_obj.initializeOnlyWhenVisible),
                            (o.initializeOnlyWhenVisible_bl = "yes" == o.initializeOnlyWhenVisible_bl),
                            this.setupMainDo(),
                            this.startResizeHandler(),
                            o.setupGrid(),
                            t.addEventListener("scroll", o.onInitlalizeScrollHandler),
                            setTimeout(o.onInitlalizeScrollHandler, 500))
                      : void alert("FWDVS constructor properties object is not defined!"));
        }),
            (o.onInitlalizeScrollHandler = function () {
                if (o.viewportSize) {
                    var e = FWDVSUtils.getScrollOffsets();
                    (o.pageXOffset = e.x),
                        (o.pageYOffset = e.y),
                        o.main_do.getRect().top >= -o.stageHeight && o.main_do.getRect().top < o.viewportSize.h && (t.removeEventListener("scroll", o.onInitlalizeScrollHandler), o.thumbnailManager_do.ssImages());
                }
            }),
            (this.setupGrid = function () {
                o.isInitialized || ((o.isInitialized = !0), this.setupData(), this.setupInfo());
            }),
            (this.setupMainDo = function () {
                (this.main_do = new FWDVSDisplayObject("div", "relative")),
                    (this.main_do.screen.className = "main"),
                    this.main_do.setOverflow("visible"),
                    (this.main_do.getStyle().webkitTapHighlightColor = "rgba(0, 0, 0, 0)"),
                    (this.main_do.getStyle().webkitFocusRingColor = "rgba(0, 0, 0, 0)"),
                    (this.main_do.getStyle().width = "100%"),
                    (this.main_do.getStyle().height = "100%"),
                    (!FWDVSUtils.isMobile || (FWDVSUtils.isMobile && FWDVSUtils.hasPointerEvent)) && this.main_do.setSelectable(!1),
                    "dynamichorizontal" == o.gridType_str || "classichorizontal" == o.gridType_str || "masonryhorizontal" == o.gridType_str || "flexiblehorizontal" == o.gridType_str
                        ? ((this.main_do.getStyle().msTouchAction = "none"),
                          this.displayType == s.FULL_SCREEN || this.displayType == s.FLUID_WIDTH
                              ? ((this.main_do.getStyle().position = "absolute"), this.stageContainer.appendChild(this.main_do.screen), (this.main_do.getStyle().zIndex = o.zIndex))
                              : this.stageContainer.appendChild(this.main_do.screen))
                        : this.stageContainer.appendChild(this.main_do.screen),
                    (this.stageContainer.style.overflow = "visible"),
                    this.startResizeHandler();
            }),
            (this.setupInfo = function () {
                FWDVSInfo.setPrototype(), (this.info_do = new FWDVSInfo(o, o.data.warningIconPath_str));
            }),
            (this.startResizeHandler = function () {
                t.addEventListener
                    ? (t.addEventListener("resize", o.onResizeHandler), t.addEventListener("scroll", o.onScrollHandler))
                    : t.attachEvent && (t.attachEvent("onresize", o.onResizeHandler), t.attachEvent("onscroll", o.onScrollHandler)),
                    o.resizeHandler(),
                    (o.resizeHandlerId2_to = setTimeout(function () {
                        o.resizeHandler();
                    }, 400));
            }),
            (this.onResizeHandler = function () {
                clearTimeout(o.resizeHandlerId2_to),
                    (o.resizeHandlerId2_to = setTimeout(function () {
                        o.resizeHandler();
                    }, 100));
            }),
            (o.onScrollHandler = function () {
                (o.scrollOffsets = FWDVSUtils.getScrollOffsets()), o.thumbnailManager_do && (s.globalY = o.thumbnailManager_do.getGlobalY());
            }),
            (this.resizeHandler = function () {
                o.scrollOffsets = FWDVSUtils.getScrollOffsets();
                var e = FWDVSUtils.getViewportSize();
                o.viewportSize = e;
                (s.viewportHeight = e.h),
                    (o.pageXOffset = o.scrollOffsets.x),
                    (o.pageYOffset = o.scrollOffsets.y),
                    (o.stageWidth = o.stageContainer.offsetWidth),
                    o.menu_do && (o.menu_do.isShowed_bl ? o.menu_do.resizeAndPosition(o.stageWidth) : o.menu_do.setHeight(0)),
                    o.positionPreloader(),
                    o.thumbnailManager_do && o.thumbnailManager_do.resizeAndPosition(),
                    o.fullScreenButton_do && o.positionFullScreenButton();
            }),
            (this.setFinalSize = function () {
                o.isReady_bl || (o.stageHeight = 84),
                    o.main_do.setHeight(o.stageHeight),
                    o.thumbnailManager_do && (o.stageHeight = o.thumbnailManager_do.totalHeight),
                    o.main_do && o.prevStageHeight != o.stageHeight && o.main_do.setWidth(o.stageWidth),
                    o.main_do.setOverflow("visible"),
                    o.menu_do && o.menu_do.resizeSelector(),
                    (o.stageContainer.style.height = o.stageHeight + "px"),
                    (o.prevStageHeight = o.stageHeight),
                    o.resizeSearch(),
                    o.dispatchEvent(s.RESIZE);
            }),
            (this.setupContextMenu = function () {
                this.customContextMenu_do = new FWDVSContextMenu(this.main_do, o.data.rightClickContextMenu_str);
            }),
            (this.setupData = function () {
                FWDVSData.setPrototype(),
                    (this.data = new FWDVSData(this.props_obj, this)),
                    this.data.addListener(FWDVSData.PRELOADER_LOAD_DONE, this.onPreloaderLoadDone),
                    this.data.addListener(FWDVSData.LIGHBOX_CLOSE_BUTTON_LOADED, this.onLightBoxCloseButtonLoadDone),
                    this.data.addListener(FWDVSData.LOAD_ERROR, this.dataLoadError),
                    this.data.addListener(FWDVSData.LOAD_DONE, this.dataLoadComplete);
            }),
            (this.onLightBoxCloseButtonLoadDone = function () {}),
            (this.onPreloaderLoadDone = function () {
                o.setupPreloader(), o.positionPreloader(), o.resizeHandler();
            }),
            (this.dataLoadError = function (t) {
                o.main_do.addChild(o.info_do), o.info_do.showText(t.text);
            }),
            (this.dataLoadComplete = function () {
                (o.isReady_bl = !0),
                    (o.main_do.getStyle().height = "100%"),
                    (o.catId_ar = o.data.startAtCategory),
                    o.isMobile_bl || o.setupContextMenu(),
                    o.setupThumbanilsManager(),
                    o.data.showMenu_bl && o.setupMenu(),
                    o.setupSeach(),
                    o.showFullScreenButton_bl && o.setupFullScreenButton(),
                    (o.isDataLoaded_bl = !0),
                    o.resizeHandler(),
                    setTimeout(function () {
                        o.preloader_do.hide(!0);
                    }, 500),
                    o.main_do.addChild(o.preloader_do),
                    setTimeout(o.resizeHandler, 200),
                    o.dispatchEvent(s.READY);
            }),
            (this.setupPreloader = function () {
                FWDVSPreloader.setPrototype(),
                    (o.preloader_do = new FWDVSPreloader(o, "center", o.slideshowRadius, o.slideshowBackgroundColor, o.slideshowFillColor, o.slideshowStrokeSize, 1, o.data.prelaoderAllScreen_bl)),
                    this.preloader_do.startPreloader(),
                    this.preloader_do.show(!0),
                    this.main_do.addChild(this.preloader_do);
            }),
            (this.positionPreloader = function () {
                this.preloader_do && this.preloader_do.positionAndResize();
            }),
            (this.onPreloaderHideCompleteHandler = function () {
                o.main_do.removeChild(o.preloader_do);
            }),
            (this.setupSeach = function () {
                this.searchMain_do = new FWDVSDisplayObject("div");
                this.searchMain_do.setInnerHTML('<span class="fwdicon search fwdfwdicon-search"></span>'),
                    (this.searchMain_do.hasTransform3d_bl = !1),
                    (this.searchMain_do.hasTransform2d_bl = !1),
                    (o.searchMain_do.screen.className = "p-wrapper fwd-hide"),
                    (o.text_str = o.data.searchLabel),
                    (this.text_do = new FWDVSDisplayObject("input")),
                    this.text_do.setOverflow("visible"),
                    this.text_do.setDisplay("inline-block"),
                    (this.text_do.getStyle().whiteSpace = "nowrap"),
                    this.text_do.setBackfaceVisibility(),
                    o.text_do.setAlpha(0),
                    (o.text_do.screen.value = o.text_str),
                    (this.text_do.hasTransform3d_bl = !1),
                    (this.text_do.hasTransform2d_bl = !1),
                    o.text_do.setVisible(!1),
                    (o.text_do.screen.className = "p-search"),
                    this.main_do.addChild(o.searchMain_do),
                    this.searchMain_do.addChild(o.text_do),
                    o.text_do.screen.addEventListener("focus", o.inputFocusInHandler),
                    o.text_do.screen.addEventListener("blur", o.inputFocusOutHandler),
                    o.text_do.screen.addEventListener("keyup", o.keyUpHandler),
                    o.isMobile_bl;
            }),
            (this.openSearchOnHover = function () {
                o.isSearchShowed && ((o.isSearchShowed = !0), clearTimeout(o.hideWithDelayId_to), t.addEventListener("mousemove", o.checkSearchOnMove), t.addEventListener("mouseup", o.hideSearchOnMouseUp));
            }),
            (this.hideSearchOnMouseUp = function (t) {
                o.checkSearchOnMove(t, !0);
            }),
            (this.openSearch = function (t) {}),
            (this.removeCheckSearchEvents = function () {}),
            (this.checkSearchOnMove = function (t, e) {
                if (0 == o.text_do.screen.value.length || o.text_do.screen.value == o.text_str) {
                    var s = 2e3;
                    e && (s = 0);
                    var n = FWDVSUtils.getViewportMouseCoordinates(t);
                    FWDVSUtils.hitTest(o.searchMain_do.screen, n.screenX, n.screenY) ||
                        (clearTimeout(o.hideWithDelayId_to),
                        o.removeCheckSearchEvents(),
                        (o.hideWithDelayId_to = setTimeout(function () {
                            o.hideSearch(t, !0);
                        }, s)));
                }
            }),
            (this.hideSearch = function (t, e) {
                if (0 == o.text_do.screen.value.length || o.text_do.screen.value == o.text_str) {
                    clearTimeout(o.hideWithDelayId_to);
                    var s = FWDVSUtils.getViewportMouseCoordinates(t);
                    (!FWDVSUtils.hitTest(o.searchMain_do.screen, s.screenX, s.screenY) || e) &&
                        (o.removeCheckSearchEvents(),
                        FWDAnimation.to(o.searchMain_do.screen, 0.8, { className: "p-wrapper", transform: "translateX(0)", width: o.searchIconW, ease: Expo.easeInOut }),
                        FWDAnimation.to(o.text_do.screen, 0.8, {
                            alpha: 0,
                            onComplete: function () {
                                o.text_do.setVisible(!1);
                            },
                        }),
                        ($ = jQuery),
                        $(".vm-logo").length && FWDAnimation.to($(".vm-logo .has-logo")[0], 0.6, { alpha: 1 })),
                        (o.isSearchShowed = !1);
                }
            }),
            (this.inputFocusInHandler = function () {
                o.hasInputFocus_bl || ((o.hasInputFocus_bl = !0), o.text_do.screen.value == o.text_str && (o.text_do.screen.value = ""));
            }),
            (this.inputFocusOutHandler = function (t) {
                if (o.hasInputFocus_bl) {
                    var e = FWDVSUtils.getViewportMouseCoordinates(t);
                    if (!FWDVSUtils.hitTest(o.text_do.screen, e.screenX, e.screenY)) return (o.hasInputFocus_bl = !1), void ("" == o.text_do.screen.value && (o.text_do.screen.value = o.text_str));
                }
            }),
            (this.keyUpHandler = function (t) {
                t.stopPropagation && t.stopPropagation();
                var e;
                o.prevInputValue_str != o.text_do.screen.value &&
                    ((e = o.text_do.screen.value.toLowerCase()),
                    e != o.text_str &&
                        ((o.searchValue = e),
                        clearTimeout(o.updateSearch_to),
                        (o.updateSearch_to = setTimeout(function () {
                            o.thumbnailManager_do.search(o.searchValue.toLowerCase());
                        }, 100)))),
                    (o.prevInputValue_str = o.text_do.screen.value);
            }),
            (this.resizeSearch = function () {}),
            (this.setupMenu = function () {
                FWDVSMenu.setPrototype(),
                    (this.menu_do = new FWDVSMenu(o.data, o)),
                    this.menu_do.addListener(FWDVSMenu.MOUSE_UP, this.menuOnMouseUpHandler),
                    this.main_do.addChild(this.menu_do),
                    this.menu_do.addListener(FWDVSMenu.SEARCH, this.searchHandler);
            }),
            (this.menuOnMouseUpHandler = function (t) {
                o.updateCategory(t.id);
            }),
            (this.searchHandler = function (t) {
                o.thumbnailManager_do.search(t.searchValue);
            }),
            (this.setupThumbanilsManager = function () {
                (o.data.isVerticalType_bl = !0),
                    FWDVSClassicVerticalThumbnailsManager.setPrototype(),
                    (this.thumbnailManager_do = new FWDVSClassicVerticalThumbnailsManager(this.data, this)),
                    this.thumbnailManager_do.addListener(FWDVSClassicVerticalThumbnailsManager.CATEGORY_UPDATE, this.onTMCategoryUpdate),
                    this.thumbnailManager_do.addListener(FWDVSClassicVerticalThumbnailsManager.OPEN_LIGHTBOX, this.openLightbox),
                    this.main_do.addChild(this.thumbnailManager_do),
                    (s.globalY = o.thumbnailManager_do.getGlobalY());
            }),
            (this.onThumbsManagerLoadError = function (t) {
                o.main_do.addChild(o.info_do), o.info_do.showText(t.text);
            }),
            (this.onTMCategoryUpdate = function () {}),
            (this.openLightbox = function (s) {
                t.open(o.data.parsedGallery_ar[s.id].url, "_blank");
            }),
            (this.addListener = function (e, t) {
                if (e == null) throw Error("type is required.");
                if ("object" == typeof e) throw Error("type must be of type String.");
                if ("function" != typeof t) throw Error("listener must be of type Function.");
                var s = {};
                (s.type = e), (s.listener = t), (s.target = this), this.listeners.events_ar.push(s);
            }),
            (this.dispatchEvent = function (e, t) {
                if (null != this.listeners) {
                    if (null == e) throw Error("type is required.");
                    if ("object" == typeof e) throw Error("type must be of type String.");
                    for (var s = 0, o = this.listeners.events_ar.length; s < o; s++)
                        if (this.listeners.events_ar[s].target === this && this.listeners.events_ar[s].type === e) {
                            if (t) for (var n in t) this.listeners.events_ar[s][n] = t[n];
                            this.listeners.events_ar[s].listener.call(this, this.listeners.events_ar[s]);
                        }
                }
            }),
            (this.removeListener = function (e, t) {
                if (e == null) throw Error("type is required.");
                if ("object" == typeof e) throw Error("type must be of type String.");
                if ("function" != typeof t) throw Error("listener must be of type Function." + e);
                for (var s = 0, o = this.listeners.events_ar.length; s < o; s++)
                    if (this.listeners.events_ar[s].target === this && this.listeners.events_ar[s].type === e && this.listeners.events_ar[s].listener === t) {
                        this.listeners.events_ar.splice(s, 1);
                        break;
                    }
            }),
            (this.disableMoveOnFullScreen = function () {
                t.addEventListener("touchmove", o.onDisableMove);
            }),
            (this.removeDisableMoveOnFullScreen = function () {
                t.removeEventListener("touchmove", o.onDisableMove);
            }),
            (this.onDisableMove = function (t) {
                t.preventDefault();
            }),
            (this.updateCategory = function (e) {
                this.isReady_bl &&
                    ((this.catId_ar = e),
                    o.thumbnailManager_do.updateCategory(this.catId_ar),
                    o.resizeHandler(),
                    setTimeout(function () {
                        o.dispatchEvent(s.CATEGORY_UPDATE);
                    }, 50));
            }),
            (this.getCategoryName = function () {
                return this.isReady_bl ? this.data.categories_ar : void 0;
            }),
            (this.getCategoryId = function () {
                return this.catId_ar;
            }),
            (this.updateSize = function () {
                if (!o.isReady_bl);
                o.resizeHandler();
            }),
            this.init();
    };
    (s.RESIZE = "resize"),
        (s.READY = "ready"),
        (s.LIGHTBOX_SHOW_START = "showStart"),
        (s.LIGHTBOX_SHOW_COMPLETE = "showComplete"),
        (s.LIGHTBOX_HIDE_START = "hideStart"),
        (s.LIGHTBOX_HIDE_COMPLETE = "hideComplete"),
        (s.CATEGORY_UPDATE = "categoryUpdate"),
        (s.FULL_SCREEN = "fullscreen"),
        (s.LIGHTBOX = "lightbox"),
        (s.RESPONSIVE = "responsive"),
        (s.FLUID_WIDTH = "fluidwidth"),
        (s.AFTER_PARENT = "afterparent"),
        (s.IFRAME = "iframe"),
        (s.IMAGE = "image"),
        (s.FLASH = "flash"),
        (s.AUDIO = "audio"),
        (s.VIDEO = "video"),
        (s.VIMEO = "vimeo"),
        (s.YOUTUBE = "youtube"),
        (s.MAPS = "maps"),
        (s.LINK = "link"),
        (s.NONE = "none"),
        (t.FWDVS = s);
})(window),
    (function (e) {
        var t = function (s) {
            var o = this,
                n = t.prototype;
            (this.isDisabled_bl = !1),
                (this.isSelected_bl = !1),
                (this.isMobile_bl = FWDVSUtils.isMobile),
                (this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent),
                (this.init = function () {
                    this.setOverflow("visible"), this.setupDos(), this.setNormalState(!1), this.addEvents(), o.setButtonMode(!0);
                }),
                (this.setupDos = function () {
                    (this.arrow_do = new FWDVSTransformDisplayObject("div")),
                        this.arrow_do.setOverflow("visible"),
                        this.arrow_do.setDisplay("inline-block"),
                        (this.arrow_do.getStyle().fontSmoothing = "antialiased"),
                        (this.arrow_do.getStyle().webkitFontSmoothing = "antialiased"),
                        (this.arrow_do.getStyle().textRendering = "optimizeLegibility"),
                        (this.arrow_do.getStyle().whiteSpace = "nowrap"),
                        this.arrow_do.setBackfaceVisibility(),
                        (this.arrow_do.getStyle().padding = ""),
                        (this.arrow_do.getStyle().margin = ""),
                        (this.arrow_do.getStyle().borderRight = "1px solid"),
                        (this.arrow_do.getStyle().borderBottom = "1px solid"),
                        (this.arrow_do.getStyle().top = 0),
                        (this.arrow_do.getStyle().left = 0),
                        this.arrow_do.setWidth(13),
                        this.arrow_do.setHeight(13),
                        (o.arrow_do.screen.className = "arrow-mobile-i arrow-mobile-normal-i"),
                        o.arrow_do.setRotation(45),
                        this.addChild(this.arrow_do),
                        this.setSize();
                }),
                (this.addEvents = function () {
                    o.isMobile_bl
                        ? this.hasPointerEvent_bl
                            ? (this.screen.addEventListener("pointerup", this.onMouseUp), this.screen.addEventListener("pointerover", this.onMouseOver), this.screen.addEventListener("pointerout", this.onMouseOut))
                            : this.screen.addEventListener("click", this.onMouseUp)
                        : this.screen.addEventListener && (this.screen.addEventListener("mouseover", this.onMouseOver), this.screen.addEventListener("mouseout", this.onMouseOut), this.screen.addEventListener("mouseup", this.onMouseUp));
                }),
                (this.onMouseOver = function (t) {
                    if (!t.pointerType || "mouse" == t.pointerType) {
                        if (o.isDisabled_bl || o.isSelectedFinal_bl) return;
                        s.resetButtons(), o.setSelectedState(!0);
                    }
                }),
                (this.onMouseOut = function (t) {
                    if ((!t.pointerType || "mouse" == t.pointerType) && !FWDAnimation.isTweening(s.buttonsHolder_do)) {
                        if (o.isDisabled_bl || o.isSelectedFinal_bl) return;
                        o.setNormalState(!0);
                    }
                }),
                (this.onMouseUp = function (s) {
                    2 == s.button || o.dispatchEvent(t.MOUSE_UP, { id: o.id });
                }),
                (this.setNormalState = function (e) {
                    (this.isSelected_bl = !0), FWDAnimation.killTweensOf(this.screen), e ? FWDAnimation.to(this.screen, 0.6, { className: "arrow-mobile-normal" }) : (this.screen.className = "arrow-mobile-normal");
                }),
                (this.setSelectedState = function (e) {
                    this.isSelected_bl &&
                        ((this.isSelected_bl = !1), FWDAnimation.killTweensOf(this.screen), e ? FWDAnimation.to(this.screen, 0.6, { className: "arrow-mobile-selected" }) : (this.screen.className = "arrow-mobile-selected"));
                }),
                (this.setSelected = function () {
                    this.isSelectedFinal_bl || ((this.isSelectedFinal_bl = !0), this.setSelectedState(!0));
                }),
                (this.setUnselected = function () {
                    this.isSelectedFinal_bl && ((this.isSelectedFinal_bl = !1), this.setNormalState(!0));
                }),
                (this.disable = function () {
                    100 == this.id || ((this.isDisabled_bl = !0), this.setButtonMode(!0), this.dumy_do.setButtonMode(!0), this.setSelectedState(!0));
                }),
                (this.enable = function () {
                    100 == this.id || ((this.isDisabled_bl = !1), this.setButtonMode(!0), this.dumy_do.setButtonMode(!0), this.setNormalState(!0));
                }),
                (this.setLabel = function (e) {
                    (o.text_str = e), 100 == this.id ? (this.text_do.screen.value = o.text_str) : this.text_do.setInnerHTML(o.text_str);
                }),
                (this.setSize = function () {
                    setTimeout(function () {
                        (o.w = o.getWidth()), (o.h = o.getHeight());
                    }, 69);
                }),
                this.init();
        };
        (t.setPrototype = function () {
            t.prototype = new FWDVSDisplayObject("div");
        }),
            (t.MOUSE_UP = "onMouseDown"),
            (t.prototype = null),
            (e.FWDVSArrow = t);
    })(window),
    (function (t) {
        var s = function (e, o) {
            var n = this;
            this.parent = o;
            s.prototype;
            (this.sourceGallery_ar = e.gallery_ar.galleryItems),
                (this.originalDataThumbnails_ar = []),
                (this.dataThumbnails_ar = []),
                (this.thumbnails_ar = []),
                (this.createdThumbnails_ar = []),
                this.tempGallery_ar,
                (this.columnHeights_ar = []),
                (this.loadMoreCatsData_ar = []),
                (this.catId_ar = e.startAtCategory_ar),
                (this.catId = this.catId_ar[0]),
                this.curDataThumbnail,
                (this.thumbnailLoadingType_str = e.thumbnailLoadingType_str),
                (this.totalLoadedThumbnails = 0),
                (this.loadMoreButtonOffsetTop = e.loadMoreButtonOffsetTop),
                (this.loadMoreButtonOffsetBottom = e.loadMoreButtonOffsetBottom),
                (this.thumbnailsPerSet = e.thumbnailsPerSet),
                (this.thumbsHOffset = e.thumbnailsHorizontalOffset),
                (this.thumbsVOffset = e.thumbnailsVerticalOffset),
                (this.offsetTotalHeight = 0),
                (this.maxH = 0),
                (this.thumbOffsetX = 0),
                (this.searchValue = ""),
                (this.stageWidth = 0),
                (this.prevStageWidth = 0),
                (this.thumbnailMaxWidth = e.thumbnailMaxWidth),
                (this.thumbnailMaxHeight = e.thumbnailMaxHeight),
                (this.leftWidth = 0),
                this.thumbWidth,
                this.thumbHeight,
                (this.thumbsHSpace = e.horizontalSpaceBetweenThumbnails),
                (this.thumbsVSpace = e.verticalSpaceBetweenThumbnails),
                (this.countLoadedThumbs = 0),
                (this.borderSize = e.thumbnailBorderSize),
                (this.totalThumbnails = this.sourceGallery_ar.length),
                (this.tempTotalThumbnails = this.sourceGallery_ar.length),
                (this.totalOriginalThumbnails = this.sourceGallery_ar.length),
                (this.globalX = 0),
                (this.globalY = 0),
                (this.gridType = e.gridType),
                this.catChanging_to,
                this.arangeFaterTweenId_to,
                (this.allCategoriesLabel_str = e.allCategoriesLabel_str),
                (this.isLoadAtTheEnd_bl = !1),
                (this.isLoadMoreButtonShowed_bl = !0),
                (this.isCatChanging_bl = !1),
                (this.isFirstThumbnailLoaded_bl = !1),
                (this.firstThumbnailShowed_bl = !1),
                (this.animateParent_bl = e.animateParent_bl),
                (this.hasExtraText_bl = e.hasExtraText_bl),
                (this.isVerticalType_bl = e.isVerticalType_bl),
                (this.showAllCategories_bl = e.showAllCategories_bl),
                (this.categories_ar = e.categories_ar),
                (this.totalCats = this.showAllCategories_bl ? e.categories_ar.length - 1 : e.categories_ar.length),
                (this.isMobile_bl = FWDVSUtils.isMobile),
                (this.init = function () {
                    this.initialized ||
                        ((this.initialized = !0),
                        (this.loadMore_do = new FWDVSDisplayObject("div")),
                        (this.loadMore_do.screen.style.zIndex = 1e9),
                        (this.loadMore_do.screen.style.backgroundColor = "#FFFFFF"),
                        (this.screen.className = "thumbs-holder"),
                        this.loadMore_do.setInnerHTML("load more"),
                        this.loadMore_do.setY(200),
                        this.loadMore_do.setButtonMode(!0),
                        this.setBkColor(o.backgroundColor),
                        (this.getStyle().position = "relative"),
                        (n.getStyle().wdith = "100%"),
                        this.setupNoSearch(),
                        this.setOverflow("visible"),
                        this.setDataForResize(),
                        this.setThumbsExtraTextWidth(),
                        this.setupThumbnails(),
                        this.initData(),
                        this.updateData(!0),
                        this.filterCategories(),
                        this.startGetMousePosition(),
                        this.setupInfiniteScroll(),
                        setTimeout(this.resizeAndPosition, 100),
                        this.loadMore_do.screen.addEventListener("click", function () {
                            n.updateData(!0), n.filterCategories(), n.loadThumbImage();
                        }));
                }),
                (this.initData = function () {
                    this.dataThumbnails_ar;
                    for (var e, t = 0; t < this.sourceGallery_ar.length; t++)
                        (e = {}), (e.cats_ar = this.sourceGallery_ar[t].cats), (e.id = t), (e.thumbnailAdded = null), (e.thumbnail = this.createdThumbnails_ar[t]), (this.dataThumbnails_ar[t] = e);
                }),
                (this.ssImages = function () {
                    this.loadThumbnailId_to = setTimeout(this.loadThumbImage, 200);
                }),
                (this.resizeAndPosition = function () {
                    (n.stageWidth = o.stageWidth), n.init(), n.setDataForResize(), n.positionThumbnailsAndMain();
                }),
                (this.startGetMousePosition = function () {
                    t.addEventListener
                        ? (!n.isMobile_bl && t.addEventListener("touchstart", this.getMousePosition), t.addEventListener("mousemove", this.getMousePosition))
                        : document.attachEvent && document.attachEvent("onmousemove", this.getMousePosition);
                }),
                (this.getMousePosition = function (t) {
                    var e = FWDVSUtils.getViewportMouseCoordinates(t);
                    n.isMobile_bl || ((n.globalX = e.screenX), (n.globalY = e.screenY));
                }),
                (this.getThumbnail = function (t, s) {
                    var o = {};
                    return (
                        (o.parent = this),
                        (o.parent = this),
                        (o.previewText = e.previewText),
                        (o.hSize = this.sourceGallery_ar[s].hSize),
                        (o.cats_ar = t),
                        (o.searchText = this.sourceGallery_ar[s].searchText),
                        (o.slideshow_ar = this.sourceGallery_ar[s].slideshow),
                        (o.showThumbnailOnlyWhenImageIsLoaded_bl = e.showThumbnailOnlyWhenImageIsLoaded_bl),
                        (o.id = s),
                        (o.useThumbnailSlideshow_bl = e.useThumbnailSlideshow_bl),
                        (o.thumbnailPath_str = n.sourceGallery_ar[s].thumbnailPath_str),
                        (o.presetType_str = e.presetType_str),
                        (o.backgroundColor_str = e.thumbnailBackgroundColor_str),
                        (o.borderNormalColor_str = this.sourceGallery_ar[s].thumbnailBorderNormalColor || e.thumbnailBorderNormalColor_str),
                        (o.borderSelectedColor_str = this.sourceGallery_ar[s].thumbnailBorderSelectedColor || e.thumbnailBorderSelectedColor_str),
                        (o.borderSize = e.thumbnailBorderSize),
                        (o.borderRadius = e.thumbnailBorderRadius),
                        (o.thumbnailOverlayColor_str = this.sourceGallery_ar[s].thumbnailOverlayColor || e.thumbnailOverlayColor_str),
                        (o.thumbnailOverlayOpacity = e.thumbnailOverlayOpacity),
                        (o.spaceBetweenTextAndIcons = e.spaceBetweenTextAndIcons),
                        (o.extraButtonUrl_str = this.sourceGallery_ar[s].extraButtonUrl_str),
                        (o.extraButtonUrlTarget_str = this.sourceGallery_ar[s].extraButtonUrlTarget_str),
                        (o.thumbIconPathN_str = this.sourceGallery_ar[s].thumbIconPathN_str),
                        (o.thumbIconPathS_str = this.sourceGallery_ar[s].thumbIconPathS_str),
                        (o.thumbnailIconWidth = e.thumbnailIconWidth),
                        (o.thumbnailIconHeight = e.thumbnailIconHeight),
                        (o.linkIconPathN_str = e.linkIconPathN_str),
                        (o.linkIconPathS_str = e.linkIconPathS_str),
                        (o.spaceBetweenThumbanilIcons = e.spaceBetweenThumbanilIcons),
                        (o.hideAndShowTransitionType_str = e.hideAndShowTransitionType_str),
                        (o.textVerticalAlign_str = e.textVerticalAlign_str),
                        (o.imageTransitionDirection_str = e.imageTransitionDirection_str),
                        (o.thumbanilBoxShadow_str = e.thumbanilBoxShadow_str),
                        (o.textAnimType_str = e.textAnimType_str),
                        (o.disableThumbnails_bl = e.disableThumbnails_bl),
                        (o.useIconButtons_bl = e.useIconButtons_bl),
                        (o.alt_str = this.sourceGallery_ar[s].alt_str),
                        (o.linkUrl_str = this.sourceGallery_ar[s].url),
                        (o.linkTarget_str = this.sourceGallery_ar[s].target),
                        (o.contentOffsetY = e.contentOffsetY),
                        (o.buttonsOffest = e.buttonsOffestY),
                        (o.isVerticalType_bl = e.isVerticalType_bl),
                        (o.isDisabled_bl = this.sourceGallery_ar[s]._bl),
                        (o.title_str = this.sourceGallery_ar[s].title),
                        (o.client_str = this.sourceGallery_ar[s].client),
                        (o.likes_str = this.sourceGallery_ar[s].likes),
                        (o.htmlContent2_str = this.sourceGallery_ar[s].htmlContent2_str),
                        (o.htmlExtraContent_str = this.sourceGallery_ar[s].htmlExtraContent_str),
                        FWDVSThumbnail.setPrototype(),
                        (thumbnail = new FWDVSThumbnail(o)),
                        thumbnail.addListener(FWDVSThumbnail.MOUSE_UP, this.thumbanilOnMouseUpHandler),
                        this.addChild(thumbnail),
                        thumbnail
                    );
                }),
                (this.thumbanilOnMouseUpHandler = function (s) {
                    var e = n.dataThumbnails_ar[s.id].thumbnail;
                    t.open(e.linkUrl_str, e.linkTarget_str);
                }),
                (this.scrollTop = function () {
                    var e = FWDVSUtils.getScrollOffsets();
                    FWDAnimation.isTweening(n.scrollObj) ||
                        0 == e.y ||
                        ((n.scrollObj = { posY: e.y }),
                        FWDAnimation.killTweensOf(n.scrollObj),
                        FWDAnimation.to(n.scrollObj, 0.8, {
                            posY: 0,
                            ease: Expo.easeInOut,
                            onUpdate: function () {
                                t.scrollTo(0, n.scrollObj.posY);
                            },
                        }));
                }),
                (this.updateCategory = function (e) {
                    this.catId_ar == e || ((this.catId_ar = e), (this.catId = this.catId_ar[0]), n.updateData(), this.filterCategories(), n.loadThumbImage(), this.positionThumbnailsAndMain(), this.dispatchEvent(s.CATEGORY_UPDATE));
                }),
                (this.setupNoSearch = function () {
                    (this.noSearch_do = new FWDVSDisplayObject("div")),
                        this.noSearch_do.setOverflow("visible"),
                        this.noSearch_do.setDisplay("inline-block"),
                        (this.noSearch_do.getStyle().whiteSpace = "nowrap"),
                        this.noSearch_do.setBackfaceVisibility(),
                        (this.noSearch_do.screen.className = "p-nothing-found"),
                        (this.noSearch_do.hasTransform3d_bl = !1),
                        (this.noSearch_do.hasTransform2d_bl = !1),
                        this.noSearch_do.setAlpha(0),
                        this.noSearch_do.setInnerHTML(e.notFoundLabel),
                        this.addChild(this.noSearch_do),
                        setTimeout(function () {
                            (n.noSearch_do.w = n.noSearch_do.getWidth()), (n.noSearch_do.h = n.noSearch_do.getHeight()), n.removeChild(n.noSearch_do);
                        }, 70);
                }),
                (this.showNoSearch = function () {
                    this.isNoSearchFoundShowed_bl ||
                        ((this.isNoSearchFoundShowed_bl = !0),
                        this.addChild(this.noSearch_do),
                        this.positionNoSearchLabel(),
                        FWDAnimation.killTweensOf(this.noSearch_do),
                        FWDAnimation.to(this.noSearch_do, 0.1, { alpha: 1, delay: 0.6, yoyo: !0, repeat: 8 }));
                }),
                (this.hideNoSearch = function () {
                    this.isNoSearchFoundShowed_bl &&
                        ((this.isNoSearchFoundShowed_bl = !1),
                        FWDAnimation.killTweensOf(this.noSearch_do),
                        FWDAnimation.to(this.noSearch_do, 0.1, {
                            alpha: 0,
                            onComplete: function () {
                                n.removeChild(n.noSearch_do);
                            },
                        }));
                }),
                (this.positionNoSearchLabel = function () {
                    if (this.isNoSearchFoundShowed_bl) {
                        var e = FWDVSUtils.getViewportSize().h;
                        this.noSearch_do.setX(Math.round((this.stageWidth - this.noSearch_do.w) / 2)), this.noSearch_do.setY(Math.round((e - this.noSearch_do.h) / 2));
                    }
                }),
                (this.setupThumbnails = function () {
                    for (var e, t = 0; t < this.totalThumbnails; t++) (e = n.getThumbnail(n.sourceGallery_ar[t].cats, t)), (n.createdThumbnails_ar[t] = e);
                }),
                (this.stopToLoadImage = function () {
                    clearTimeout(this.loadThumbnailId_to), clearTimeout(this.loadTumbImageId_to), n.image_img && ((n.image_img.onerror = null), (n.image_img.onload = null));
                }),
                (this.startToLoadImage = function (e) {
                    (n.image_img = new Image()), (n.image_img.onerror = n.onImageLoadErrorHandler), (n.image_img.onload = n.onImageLoadHandler), (n.image_img.src = e);
                }),
                (this.loadThumbImage = function () {
                    if ((n.stopToLoadImage(), n.thumbnails_ar[n.loadedId])) {
                        var e = !1;
                        if (n.showAllCategories_bl && 0 == n.catId) e = !0;
                        else
                            for (var t = 0; t < n.thumbnails_ar[n.loadedId].cats_ar.length; t++)
                                if (n.thumbnails_ar[n.loadedId].cats_ar[t] == n.categories_ar[n.catId]) {
                                    e = !0;
                                    break;
                                }
                        if (!e) {
                            return (n.loadedId += 1), void this.loadThumbImage();
                        }
                    }
                    return n.thumbnails_ar[n.loadedId] ? (n.thumbnails_ar[n.loadedId].hasImg_bl ? (n.loadedId++, void n.loadThumbImage()) : void n.startToLoadImage(n.thumbnails_ar[n.loadedId].thumbnailPath_str)) : void 0;
                }),
                (this.onImageLoadErrorHandler = function () {
                    var e = "Thumbnail image can't be loaded, probably the path is incorrect <font color='#FFFFFF'>" + n.sourceGallery_ar[n.curDataThumbnail.id].thumbnailPath_str + "</font>";
                    n.dispatchEvent(s.ERROR, { text: e });
                }),
                (this.onImageLoadHandler = function () {
                    var e = n.thumbnails_ar[n.loadedId];
                    (e.hasImg_bl = !0),
                        (e.originalWidth = n.image_img.naturalWidth),
                        (e.originalHeight = n.image_img.naturalHeight),
                        n.loadedId++,
                        e.addImage(n.image_img),
                        (n.loadTumbImageId_to = setTimeout(function () {
                            n.loadThumbImage();
                        }, 50)),
                        n.isFirstThumbnailLoaded_bl ||
                            setTimeout(function () {
                                n.firstThumbnailShowed_bl = !0;
                            }, 50),
                        n.positionThumbnailsAndMain();
                }),
                (this.search = function (e) {
                    (n.searchValue = e),
                        clearTimeout(n.updateSearch_to),
                        (n.updateSearch_to = setTimeout(function () {
                            n.updateData(), n.filterCategories(), n.loadThumbImage(), n.positionThumbnailsAndMain();
                        }, 200));
                }),
                (this.updateData = function (e) {
                    (n.thumbnails_ar = []), (n.toAdd = 0), (n.totalAdded = 0);
                    var t = !1,
                        s = !1,
                        o = !0,
                        a = 0;
                    this.showAllCategories_bl && (a = 1), (n.loadedId = 0);
                    if (0 == n.catId) {
                        var r = 0,
                            l = 0;
                        if (0 == n.searchValue.length) for (var d = 0; d < n.dataThumbnails_ar.length; d++) null != n.dataThumbnails_ar[d].thumbnailAdded && ((t = !0), l++, l >= n.thumbnailsPerSet && (t = !0));
                        else
                            for (var d = 0; d < n.dataThumbnails_ar.length; d++)
                                null != n.dataThumbnails_ar[d].thumbnailAdded && -1 != n.dataThumbnails_ar[d].thumbnail.searchText.toLowerCase().indexOf(n.searchValue) && (l++, l >= n.thumbnailsPerSet && (s = !0));
                        var h = n.thumbnailsPerSet;
                        l < n.thumbnailsPerSet && (h = n.thumbnailsPerSet - l);
                        for (var d = 0; d < n.dataThumbnails_ar.length && !(r == h); d++)
                            0 == n.searchValue.length
                                ? n.dataThumbnails_ar[d].thumbnailAdded == null && (!t || e) && ((n.dataThumbnails_ar[d].thumbnailAdded = !0), r++)
                                : -1 != n.dataThumbnails_ar[d].thumbnail.searchText.toLowerCase().indexOf(n.searchValue) && (!s || e) && n.dataThumbnails_ar[d].thumbnailAdded == null && ((n.dataThumbnails_ar[d].thumbnailAdded = !0), r++);
                        for (var d = 0; d < n.dataThumbnails_ar.length; d++)
                            if (0 == n.searchValue.length) {
                                if (null == n.dataThumbnails_ar[d].thumbnailAdded) {
                                    o = !1;
                                    break;
                                }
                            } else if (-1 != n.dataThumbnails_ar[d].thumbnail.searchText.toLowerCase().indexOf(n.searchValue) && null == n.dataThumbnails_ar[d].thumbnailAdded) {
                                o = !1;
                                break;
                            }
                    } else {
                        for (var r = 0, l = 0, d = 0; d < n.dataThumbnails_ar.length; d++)
                            for (var c = 0; c < n.dataThumbnails_ar[d].cats_ar.length; c++)
                                n.dataThumbnails_ar[d].cats_ar[c] == n.categories_ar[n.catId] &&
                                    (0 == n.searchValue.length
                                        ? null != n.dataThumbnails_ar[d].thumbnailAdded && (l++, l >= n.thumbnailsPerSet && (t = !0))
                                        : null != n.dataThumbnails_ar[d].thumbnailAdded && -1 != n.dataThumbnails_ar[d].thumbnail.searchText.toLowerCase().indexOf(n.searchValue) && (l++, l >= n.thumbnailsPerSet && (t = !0)));
                        if (0 != n.searchValue.length) {
                            l = 0;
                            for (var d = 0; d < n.dataThumbnails_ar.length; d++)
                                for (var c = 0; c < n.dataThumbnails_ar[d].cats_ar.length; c++)
                                    n.dataThumbnails_ar[d].cats_ar[c] == n.categories_ar[n.catId] &&
                                        null != n.dataThumbnails_ar[d].thumbnailAdded &&
                                        -1 != n.dataThumbnails_ar[d].thumbnail.searchText.toLowerCase().indexOf(n.searchValue) &&
                                        (l++, l >= n.thumbnailsPerSet && (s = !0));
                        }
                        var h = n.thumbnailsPerSet;
                        l < n.thumbnailsPerSet && (h = n.thumbnailsPerSet - l);
                        addedLoop: for (var d = 0; d < n.dataThumbnails_ar.length && !(r == h); d++)
                            for (var c = 0; c < n.dataThumbnails_ar[d].cats_ar.length; c++)
                                if (0 == n.searchValue.length) {
                                    if (n.dataThumbnails_ar[d].cats_ar[c] == n.categories_ar[n.catId] && null == n.dataThumbnails_ar[d].thumbnailAdded && (!t || e)) {
                                        (n.dataThumbnails_ar[d].thumbnailAdded = !0), r++;
                                        continue addedLoop;
                                    }
                                } else if (
                                    n.dataThumbnails_ar[d].cats_ar[c] == n.categories_ar[n.catId] &&
                                    null == n.dataThumbnails_ar[d].thumbnailAdded &&
                                    (!s || e) &&
                                    -1 != n.dataThumbnails_ar[d].thumbnail.searchText.toLowerCase().indexOf(n.searchValue)
                                ) {
                                    (n.dataThumbnails_ar[d].thumbnailAdded = !0), r++;
                                    continue addedLoop;
                                }
                        for (var d = 0; d < n.dataThumbnails_ar.length; d++)
                            for (var c = 0; c < n.dataThumbnails_ar[d].cats_ar.length; c++)
                                if (n.dataThumbnails_ar[d].cats_ar[c] == n.categories_ar[n.catId])
                                    if (0 == n.searchValue.length) {
                                        if (null == n.dataThumbnails_ar[d].thumbnailAdded) {
                                            o = !1;
                                            break;
                                        }
                                    } else if (-1 != n.dataThumbnails_ar[d].thumbnail.searchText.toLowerCase().indexOf(n.searchValue) && null == n.dataThumbnails_ar[d].thumbnailAdded) {
                                        o = !1;
                                        break;
                                    }
                    }
                    for (var d = 0; d < n.dataThumbnails_ar.length; d++) n.dataThumbnails_ar[d].thumbnailAdded && n.thumbnails_ar.push(n.dataThumbnails_ar[d].thumbnail);
                    (n.noMoreLoad = o), clearTimeout(this.loadInifiniteId_to), (this.loadInifiniteId_to = setTimeout(n.updateLoadMore, 200));
                }),
                (this.updateLoadMore = function () {
                    n.noMoreLoad ? n.loadMore_do.setX(-5e3) : n.loadMore_do.setX(0);
                }),
                (this.setupInfiniteScroll = function () {
                    t.addEventListener && t.addEventListener("scroll", this.onScrollHandler);
                }),
                (this.onScrollHandler = function () {
                    n.noMoreLoad;
                }),
                (this.load = function () {
                    if (n.tempThumbnails_ar && !n.noMoreLoad) {
                        var e = n.tempThumbnails_ar[n.tempThumbnails_ar.length - 1];
                        clearTimeout(n.loadInifiniteId_to),
                            (this.loadInifiniteId_to = setTimeout(function () {
                                n.getGlobalY() + e.finalY + e.finalH - 10 <= FWDVSUtils.getViewportSize().h && (n.updateData(!0), n.filterCategories(), n.loadThumbImage());
                            }, 100));
                    }
                }),
                (this.filterCategories = function () {
                    var e;
                    n.tempThumbnails_ar = [];
                    var t = n.catId_ar[0];
                    thumbnailsLoop: for (var s = 0; s < n.thumbnails_ar.length; s++)
                        if (((e = n.thumbnails_ar[s]), (e.isFound_bl = !1), 0 != t)) {
                            for (var o = 0; o < e.cats_ar.length; o++)
                                if (0 == n.searchValue.length) {
                                    if (n.categories_ar[t] == e.cats_ar[o] || n.categories_ar[t] == n.allCategoriesLabel_str) {
                                        (e.isFound_bl = !0), n.tempThumbnails_ar.push(e);
                                        continue thumbnailsLoop;
                                    } else e.isFound_bl = !1;
                                } else if ((n.categories_ar[t] == e.cats_ar[o] || n.categories_ar[t] == n.allCategoriesLabel_str) && -1 != e.searchText.toLowerCase().indexOf(n.searchValue)) {
                                    (e.isFound_bl = !0), n.tempThumbnails_ar.push(e);
                                    continue thumbnailsLoop;
                                } else e.isFound_bl = !1;
                        } else if (0 == n.searchValue.length) {
                            (e.isFound_bl = !0), n.tempThumbnails_ar.push(e);
                            continue thumbnailsLoop;
                        } else if (-1 != e.searchText.toLowerCase().indexOf(n.searchValue)) {
                            (e.isFound_bl = !0), n.tempThumbnails_ar.push(e);
                            continue thumbnailsLoop;
                        } else e.isFound_bl = !1;
                    for (var s = 0; s < n.thumbnails_ar.length; s++)
                        (e = n.thumbnails_ar[s]),
                            e.isFound_bl ? e.show(!0) : e.hide(!0),
                            s == n.thumbnails_ar.length - 1 &&
                                (clearTimeout(n.ttId_to),
                                (n.ttId_to = setTimeout(function () {
                                    n.setFinalSize(!0);
                                }, 100)));
                    0 == n.tempThumbnails_ar.length ? this.showNoSearch() : this.hideNoSearch(), (n.totalThumbnails = n.tempThumbnails_ar.length);
                }),
                (this.setDataForResize = function () {
                    if (this.stageWidth) {
                        (this.totalColumns = Math.ceil((this.stageWidth - 2 * this.thumbsHOffset + this.thumbsHSpace) / (this.thumbnailMaxWidth + 2 * this.borderSize + this.thumbsHSpace))),
                            (this.thumbWidth = Math.floor((this.stageWidth - 2 * this.thumbsHOffset + this.thumbsHSpace - this.totalColumns * (this.thumbsHSpace + 2 * this.borderSize)) / this.totalColumns)),
                            300 > this.thumbWidth &&
                                this.stageWidth > this.thumbWidth &&
                                ((this.totalColumns -= 1), (this.thumbWidth = Math.floor((this.stageWidth - 2 * this.thumbsHOffset + this.thumbsHSpace - this.totalColumns * (this.thumbsHSpace + 2 * this.borderSize)) / this.totalColumns))),
                            (this.totalRows = Math.ceil((FWDVS.viewportHeight - 2 * this.thumbsVOffset + this.thumbsVSpace) / (this.thumbnailMaxHeight + 2 * this.borderSize + this.thumbsVSpace))),
                            (this.totalVisibleThumbnails = this.totalColumns * this.totalRows),
                            (this.thumbHeight = Math.floor(this.thumbWidth * (this.thumbnailMaxHeight / this.thumbnailMaxWidth))),
                            (this.leftHeight = 0),
                            e.fitToViewportHeight_bl &&
                                !n.isMobile_bl &&
                                ((this.thumbHeight = Math.floor((FWDVS.viewportHeight - 2 * this.thumbsVOffset + this.thumbsVSpace - this.totalRows * (this.thumbsVSpace + 2 * this.borderSize)) / this.totalRows)),
                                (this.totalThumbnailRows = Math.ceil(n.totalThumbnails / this.totalColumns)),
                                (this.leftHeight = FWDVS.viewportHeight - n.totalRows * this.thumbHeight));
                        var t = this.totalColumns * (this.thumbWidth + 2 * this.borderSize + this.thumbsHSpace) - this.thumbsHSpace;
                        (this.leftWidth = this.stageWidth - 2 * this.thumbsHOffset - t), (this.prevStageWidth = this.stageWidth);
                    }
                }),
                (this.positionThumbnailsAndMain = function () {
                    n.columnHeights_ar = [];
                    for (var e = 0; e < n.totalColumns; e++) n.columnHeights_ar[e] = 0;
                    for (var e = 0; e < n.tempThumbnails_ar.length; e++) (thumbnail = n.tempThumbnails_ar[e]), (thumbnail.used_bl = !1);
                    this.hasExtraText_bl
                        ? (n.setThumbsExtraTextWidth(),
                          clearTimeout(n.resizeWithExtraContentId_to),
                          n.positionThumbnailWithExtraContent(),
                          n.setFinalSize(),
                          (n.resizeWithExtraContentId_to = setTimeout(function () {
                              n.positionThumbnailWithExtraContent(), n.setFinalSize();
                          }, 150)))
                        : ("dynamic" == n.gridType ? (n.positionThumbnailsDynamic(), n.positionThumbnails2()) : n.positionThumbnailsClassic(), n.setFinalSize());
                }),
                (this.setFinalSize = function (e) {
                    n.maxH && (n.totalHeight = Math.max(0, this.maxH * (this.thumbHeight + this.thumbsVSpace + 2 * this.borderSize) - this.thumbsVSpace + 2 * this.thumbsVOffset)),
                        (n.totalHeight += n.offsetTotalHeight),
                        (n.prevTotalHeight != n.totalHeight || e) &&
                            (n.setHeight(n.totalHeight),
                            clearTimeout(n.arangeFaterTweenId_to),
                            (n.arangeFaterTweenId_to = setTimeout(function () {
                                n.stageWidth != o.stageContainer.offsetWidth && o.onResizeHandler();
                            }, 900))),
                        o.setFinalSize(),
                        (o.stageWidth = o.stageContainer.offsetWidth),
                        (n.stageWidth != o.stageWidth || n.prevTotalHeight != n.totalHeight) && o.onResizeHandler(),
                        (n.prevTotalHeight = n.totalHeight);
                }),
                (this.positionThumbnailsDynamic = function () {
                    for (var e, t, s, o, a, r, l, d, h, c, _, u = [], b = [], p = 0; p < n.totalColumns; p++)
                        (u[p] = n.thumbWidth + 2 * n.borderSize), 0 < n.leftWidth && p < n.leftWidth && u[p]++, (b[p] = 0 == p ? n.thumbsHOffset : b[p - 1] + u[p - 1] + n.thumbsHSpace);
                    for (var p = 0; p < n.tempThumbnails_ar.length; p++)
                        if (((_ = n.tempThumbnails_ar[p]), !_.used_bl))
                            if (((s = _.wSize), (o = _.hSize), 1 == n.totalColumns && 2 == s && ((s = 1), (o = 1)), (t = 1e3), 1 == s)) {
                                _.used_bl = !0;
                                for (var m = 0; m < n.totalColumns; m++) n.columnHeights_ar[m] < t && (t = n.columnHeights_ar[m]);
                                for (var m = 0; m < n.totalColumns; m++)
                                    if (n.columnHeights_ar[m] == t) {
                                        e = m;
                                        break;
                                    }
                                (l = b[e]),
                                    (h = u[e]),
                                    (d = n.columnHeights_ar[e] * (n.thumbHeight + n.thumbsVSpace + 2 * n.borderSize) + n.thumbsVOffset),
                                    (c = (n.thumbHeight + n.thumbsVSpace + 2 * n.borderSize) * o - n.thumbsVSpace),
                                    (_.finalW = h),
                                    (_.finalH = c),
                                    (_.finalX = l),
                                    (_.finalY = d),
                                    _.resizeAndPosition(),
                                    (n.columnHeights_ar[e] += o);
                            } else {
                                a = !1;
                                for (var m = 0; m < n.totalColumns - (s - 1); m++) {
                                    r = !0;
                                    for (var g = 0; g < s; g++) n.columnHeights_ar[m] != n.columnHeights_ar[m + g] && (r = !1);
                                    r && n.columnHeights_ar[m] < t && ((t = n.columnHeights_ar[m]), (e = m), (a = !0));
                                }
                                if (a) {
                                    (_.used_bl = !0), (l = b[e]), (d = n.columnHeights_ar[e] * (n.thumbHeight + n.thumbsVSpace + 2 * n.borderSize) + n.thumbsVOffset), (h = -n.thumbsHSpace);
                                    for (var g = 0; g < s; g++) h += u[e + g] + n.thumbsHSpace;
                                    (c = (n.thumbHeight + n.thumbsVSpace + 2 * n.borderSize) * o - n.thumbsVSpace), (_.finalW = h), (_.finalH = c), (_.finalX = l), (_.finalY = d), _.resizeAndPosition();
                                    for (var g = 0; g < s; g++) n.columnHeights_ar[e + g] += o;
                                }
                            }
                    n.maxH = 0;
                    for (var p = 0; p < n.totalColumns; p++) n.columnHeights_ar[p] > n.maxH && (n.maxH = n.columnHeights_ar[p]);
                }),
                (this.positionThumbnails2 = function () {
                    for (var e, t, s, o, a = [], r = 0; r < n.totalColumns; r++) (a[r] = n.thumbWidth + 2 * n.borderSize), 0 < n.leftWidth && r < n.leftWidth && a[r]++;
                    this.maxH = 0;
                    for (var r = 0; r < this.totalColumns; r++) this.columnHeights_ar[r] > this.maxH && (this.maxH = this.columnHeights_ar[r]);
                    for (var r = 0; r < this.tempThumbnails_ar.length; r++)
                        if (((thumbnail = this.tempThumbnails_ar[r]), !thumbnail.used_bl)) {
                            (thumbnail.used_bl = !0),
                                (wSize = thumbnail.wSize),
                                (hSize = thumbnail.hSize),
                                this.totalColumns < wSize && (wSize = this.totalColumns),
                                (e = this.thumbsHOffset),
                                (t = this.maxH * (this.thumbHeight + this.thumbsVSpace + 2 * this.borderSize) + this.thumbsVOffset),
                                (s = -n.thumbsHSpace);
                            for (var l = 0; l < wSize; l++) s += a[l] + n.thumbsHSpace;
                            (o = (this.thumbHeight + this.thumbsVSpace + 2 * this.borderSize) * hSize - this.thumbsVSpace),
                                (thumbnail.finalX = e),
                                (thumbnail.finalY = t),
                                (thumbnail.finalW = s),
                                (thumbnail.finalH = o),
                                thumbnail.resizeAndPosition(),
                                (this.maxH += hSize);
                            for (var l = 0; l < wSize; l++) this.columnHeights_ar[l] = this.maxH;
                        }
                }),
                (this.positionThumbnailsClassic = function () {
                    if (n.tempThumbnails_ar) {
                        for (var e, t, s, o, a, r, l = 0; l < n.tempThumbnails_ar.length; l++)
                            (a = n.tempThumbnails_ar[l]),
                                (s = n.thumbWidth + 2 * n.borderSize),
                                (o = n.thumbHeight + 2 * n.borderSize),
                                0 < n.leftWidth && l % n.totalColumns < n.leftWidth && s++,
                                (t = Math.floor(l / n.totalColumns) * (o + n.thumbsVSpace) + n.thumbsVOffset),
                                0 < n.leftHeight && l == (n.totalRows - 1) * n.totalColumns + (l % n.totalColumns) && (o += n.leftHeight),
                                0 < n.leftHeight && l == n.totalRows * n.totalColumns + (l % n.totalColumns) && (t += n.leftHeight),
                                0 == l % n.totalColumns ? ((r = n.thumbsHOffset), (e = n.thumbsHOffset)) : (e = r),
                                (r += s + n.thumbsHSpace),
                                (a.finalW = s),
                                (a.finalH = o),
                                (a.finalX = e),
                                (a.finalY = t),
                                a.resizeAndPosition();
                        n.totalHeight = a ? t + o + n.thumbsVOffset : 0;
                    }
                }),
                (this.setThumbsExtraTextWidth = function () {
                    for (var e, t, s = 0; s < n.thumbnails_ar.length; s++)
                        (t = n.thumbnails_ar[s]), (e = n.thumbWidth + 2 * n.borderSize), 0 < n.leftWidth && s % n.totalColumns < n.leftWidth && e++, t.hasExtraText_bl && t.textHolder_do.setWidth(e - 2 * n.borderSize);
                }),
                (this.positionThumbnailWithExtraContent = function () {
                    if (n.tempThumbnails_ar) {
                        for (var e, t, s, o, a, r, l = 0, d = 0, h = 0, c = 0; c < n.tempThumbnails_ar.length; c++) {
                            if (
                                ((a = n.tempThumbnails_ar[c]),
                                (s = n.thumbWidth + 2 * n.borderSize),
                                (o = n.thumbHeight + 2 * n.borderSize),
                                a.hasExtraText_bl && (a.textHeight = a.text3_do.getHeight()),
                                0 < n.leftWidth && c % n.totalColumns < n.leftWidth && s++,
                                (t = Math.floor(c / n.totalColumns) * (o + n.thumbsVSpace) + n.thumbsVOffset),
                                0 < c && 0 == c % n.totalColumns)
                            ) {
                                (d = 0), (h = 0);
                                for (var _ = c - n.totalColumns; _ < c; _++) n.tempThumbnails_ar[_].textHeight > d && (d = n.tempThumbnails_ar[_].textHeight);
                                for (var _ = c; _ < c + n.totalColumns; _++) n.tempThumbnails_ar[_] && n.tempThumbnails_ar[_].textHeight > h && (h = n.tempThumbnails_ar[_].textHeight);
                            }
                            if (n.totalThumbnails <= n.totalColumns) for (var _ = 0; _ < n.totalThumbnails; _++) n.tempThumbnails_ar[_].textHeight > h && (h = n.tempThumbnails_ar[_].textHeight);
                            0 != c && 0 == c % n.totalColumns && (l += o + d + n.thumbsVSpace),
                                0 == c % n.totalColumns ? ((r = n.thumbsHOffset), (e = n.thumbsHOffset)) : (e = r),
                                (r += s + n.thumbsHSpace),
                                (t = l),
                                (a.finalW = s),
                                (a.finalH = o),
                                (a.finalX = e),
                                (a.finalY = t),
                                a.resizeAndPosition();
                        }
                        n.totalHeight = a ? t + o + n.thumbsVOffset + h : 0;
                    }
                });
        };
        (s.setPrototype = function () {
            s.prototype = new FWDVSDisplayObject("div", "relative");
        }),
            (s.OPEN_LIGHTBOX = "openLightbox"),
            (s.CATEGORY_UPDATE = "categoryUpdate"),
            (s.ERROR = "error"),
            (s.prototype = null),
            (t.FWDVSClassicVerticalThumbnailsManager = s);
    })(window),
    (function () {
        var t = function (e, s, o, n, a) {
            var r = this,
                l = t.prototype;
            (this.n1Img = e),
                (this.s1Path_str = s),
                (this.n2Img = o),
                (this.s2Path_str = n),
                this.buttonsHolder_do,
                this.firstButton_do,
                this.n1_do,
                this.s1_do,
                this.secondButton_do,
                this.n2_do,
                this.s2_do,
                (this.buttonWidth = r.n1Img.width),
                (this.buttonHeight = r.n1Img.height),
                (this.isSelectedState_bl = !1),
                (this.currentState = 1),
                (this.isDisabled_bl = !1),
                (this.isMaximized_bl = !1),
                (this.disptachMainEvent_bl = a),
                (this.isDisabled_bl = !1),
                (this.isHoverDisabled_bl = !1),
                (this.isMobile_bl = FWDVSUtils.isMobile),
                (this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent),
                (this.allowToCreateSecondButton_bl = !r.isMobile_bl || r.hasPointerEvent_bl),
                (r.init = function () {
                    r.setButtonMode(!0), r.setWidth(r.buttonWidth), r.setHeight(r.buttonHeight), r.setupMainContainers(), r.secondButton_do.setX(-50);
                }),
                (r.setupMainContainers = function () {
                    if (
                        (r.setBackfaceVisibility(),
                        (r.hasTransform3d_bl = !1),
                        (r.hasTransform2d_bl = !1),
                        (r.buttonsHolder_do = new FWDVSDisplayObject("div")),
                        r.buttonsHolder_do.setOverflow("visible"),
                        r.buttonsHolder_do.setBackfaceVisibility(),
                        (r.buttonsHolder_do.hasTransform3d_bl = !1),
                        (r.buttonsHolder_do.hasTransform2d_bl = !1),
                        (r.firstButton_do = new FWDVSDisplayObject("div")),
                        r.firstButton_do.setBackfaceVisibility(),
                        (r.firstButton_do.hasTransform3d_bl = !1),
                        (r.firstButton_do.hasTransform2d_bl = !1),
                        r.addChild(r.firstButton_do),
                        (r.n1_do = new FWDVSDisplayObject("img")),
                        r.n1_do.setScreen(r.n1Img),
                        r.n1_do.setBackfaceVisibility(),
                        (r.n1_do.hasTransform3d_bl = !1),
                        (r.n1_do.hasTransform2d_bl = !1),
                        r.firstButton_do.addChild(r.n1_do),
                        r.allowToCreateSecondButton_bl)
                    ) {
                        r.s1_do = new FWDVSDisplayObject("img");
                        var e = new Image();
                        (e.src = r.s1Path_str),
                            r.s1_do.setScreen(e),
                            r.s1_do.setWidth(r.buttonWidth),
                            r.s1_do.setHeight(r.buttonHeight),
                            r.s1_do.setAlpha(0),
                            r.s1_do.setBackfaceVisibility(),
                            (r.s1_do.hasTransform3d_bl = !1),
                            (r.s1_do.hasTransform2d_bl = !1),
                            r.firstButton_do.addChild(r.s1_do);
                    }
                    if (
                        (r.firstButton_do.setWidth(r.buttonWidth),
                        r.firstButton_do.setHeight(r.buttonHeight),
                        (r.secondButton_do = new FWDVSDisplayObject("div")),
                        r.secondButton_do.setBackfaceVisibility(),
                        (r.secondButton_do.hasTransform3d_bl = !1),
                        (r.secondButton_do.hasTransform2d_bl = !1),
                        r.addChild(r.secondButton_do),
                        (r.n2_do = new FWDVSDisplayObject("img")),
                        r.n2_do.setScreen(r.n2Img),
                        r.n2_do.setBackfaceVisibility(),
                        (r.n2_do.hasTransform3d_bl = !1),
                        (r.n2_do.hasTransform2d_bl = !1),
                        r.secondButton_do.addChild(r.n2_do),
                        r.allowToCreateSecondButton_bl)
                    ) {
                        r.s2_do = new FWDVSDisplayObject("img");
                        var t = new Image();
                        (t.src = r.s2Path_str),
                            r.s2_do.setScreen(t),
                            r.s2_do.setWidth(r.buttonWidth),
                            r.s2_do.setHeight(r.buttonHeight),
                            r.s2_do.setAlpha(0),
                            r.s2_do.setBackfaceVisibility(),
                            (r.s2_do.hasTransform3d_bl = !1),
                            (r.s2_do.hasTransform2d_bl = !1),
                            r.secondButton_do.addChild(r.s2_do);
                    }
                    r.secondButton_do.setWidth(r.buttonWidth),
                        r.secondButton_do.setHeight(r.buttonHeight),
                        r.buttonsHolder_do.addChild(r.secondButton_do),
                        r.buttonsHolder_do.addChild(r.firstButton_do),
                        r.addChild(r.buttonsHolder_do),
                        r.isMobile_bl
                            ? r.hasPointerEvent_bl
                                ? (r.screen.addEventListener("pointerdown", r.onMouseUp), r.screen.addEventListener("pointerover", r.onMouseOver), r.screen.addEventListener("pointerout", r.onMouseOut))
                                : (r.screen.addEventListener("toustart", r.onDown), r.screen.addEventListener("touchend", r.onMouseUp))
                            : r.screen.addEventListener
                            ? (r.screen.addEventListener("mouseover", r.onMouseOver), r.screen.addEventListener("mouseout", r.onMouseOut), r.screen.addEventListener("mouseup", r.onMouseUp))
                            : r.screen.attachEvent && (r.screen.attachEvent("onmouseover", r.onMouseOver), r.screen.attachEvent("onmouseout", r.onMouseOut), r.screen.attachEvent("onmousedown", r.onMouseUp));
                }),
                (r.onMouseOver = function (s) {
                    r.dispatchEvent(t.SHOW_TOOLTIP, { e: s });
                    r.isDisabled_bl ||
                        r.isSelectedState_bl ||
                        r.isHoverDisabled_bl ||
                        ((!s.pointerType || s.pointerType == s.MSPOINTER_TYPE_MOUSE || "mouse" == s.pointerType) && (r.dispatchEvent(t.MOUSE_OVER, { e: s }), r.setSelectedState(!0)));
                }),
                (r.onMouseOut = function (s) {
                    r.isDisabled_bl || !r.isSelectedState_bl || r.isHoverDisabled_bl || ((!s.pointerType || s.pointerType == s.MSPOINTER_TYPE_MOUSE || "mouse" == s.pointerType) && (r.setNormalState(), r.dispatchEvent(t.MOUSE_OUT)));
                }),
                (r.onDown = function (t) {
                    t.preventDefault && t.preventDefault();
                }),
                (r.onMouseUp = function (s) {
                    r.isDisabled_bl || 2 == s.button || (s.preventDefault && s.preventDefault(), !r.isMobile_bl && r.onMouseOver(s, !1), r.disptachMainEvent_bl && r.dispatchEvent(t.MOUSE_UP, { e: s }));
                }),
                (r.toggleButton = function () {
                    1 == r.currentState
                        ? (r.firstButton_do.setX(-50), r.secondButton_do.setX(0), (r.currentState = 0), r.dispatchEvent(t.FIRST_BUTTON_CLICK))
                        : (r.firstButton_do.setX(-50), r.secondButton_do.setX(0), (r.currentState = 1), r.dispatchEvent(t.SECOND_BUTTON_CLICK));
                }),
                (r.setButtonState = function (e) {
                    1 == e ? (r.firstButton_do.setX(0), r.secondButton_do.setX(-50), (r.currentState = 1)) : (r.firstButton_do.setX(-50), r.secondButton_do.setX(0), (r.currentState = 0));
                }),
                (this.setNormalState = function () {
                    (r.isMobile_bl && !r.hasPointerEvent_bl) ||
                        ((r.isSelectedState_bl = !1),
                        FWDAnimation.killTweensOf(r.s1_do),
                        FWDAnimation.killTweensOf(r.s2_do),
                        FWDAnimation.to(r.s1_do, 0.5, { alpha: 0, ease: Expo.easeOut }),
                        FWDAnimation.to(r.s2_do, 0.5, { alpha: 0, ease: Expo.easeOut }));
                }),
                (this.setSelectedState = function () {
                    (r.isSelectedState_bl = !0),
                        FWDAnimation.killTweensOf(r.s1_do),
                        FWDAnimation.killTweensOf(r.s2_do),
                        FWDAnimation.to(r.s1_do, 0.5, { alpha: 1, delay: 0.1, ease: Expo.easeOut }),
                        FWDAnimation.to(r.s2_do, 0.5, { alpha: 1, delay: 0.1, ease: Expo.easeOut });
                }),
                (this.disable = function () {
                    (r.isDisabled_bl = !0), r.setButtonMode(!1), FWDAnimation.to(r, 0.6, { alpha: 0.4 });
                }),
                (this.enable = function () {
                    (r.isDisabled_bl = !1), r.setButtonMode(!0), FWDAnimation.to(r, 0.6, { alpha: 1 });
                }),
                (this.disableHover = function () {
                    (r.isHoverDisabled_bl = !0), r.setSelectedState();
                }),
                (this.enableHover = function () {
                    r.isHoverDisabled_bl = !1;
                }),
                r.init();
        };
        (t.setPrototype = function () {
            t.prototype = new FWDVSDisplayObject("div");
        }),
            (t.FIRST_BUTTON_CLICK = "onFirstClick"),
            (t.SECOND_BUTTON_CLICK = "secondButtonOnClick"),
            (t.SHOW_TOOLTIP = "showToolTip"),
            (t.MOUSE_OVER = "onMouseOver"),
            (t.MOUSE_OUT = "onMouseOut"),
            (t.MOUSE_UP = "onMouseUp"),
            (t.CLICK = "onClick"),
            (t.prototype = null),
            (window.FWDVSComplexButton = t);
    })(window),
    (function (e) {
        var t = function () {
            var s = this,
                o = t.prototype;
            (this.main_do = null),
                (this.init = function () {
                    this.setupScreen(),
                        (e.onerror = this.showError),
                        (this.screen.style.zIndex = 1e20),
                        (this.screen.style.position = "fixed"),
                        (this.screen.style.top = 0),
                        (this.screen.className = "test"),
                        setTimeout(this.addConsoleToDom, 100),
                        setInterval(this.position, 100);
                }),
                (this.position = function () {
                    var e = FWDVSUtils.getScrollOffsets();
                    s.setX(e.x), s.setY(e.y + 30);
                }),
                (this.addConsoleToDom = function () {
                    document.documentElement.appendChild(s.screen);
                }),
                (this.setupScreen = function () {
                    (this.main_do = new FWDVSDisplayObject("div", "absolute")),
                        this.main_do.setOverflow("auto"),
                        this.main_do.setWidth(300),
                        this.main_do.setHeight(200),
                        this.setWidth(300),
                        this.setHeight(200),
                        this.main_do.setBkColor("#FFFFFF"),
                        this.addChild(this.main_do);
                }),
                (this.showError = function (e, t, o) {
                    var n = s.main_do.getInnerHTML() + "<br>JavaScript error: " + e + " on line " + o + " for " + t;
                    s.main_do.setInnerHTML(n), (s.main_do.screen.scrollTop = s.main_do.screen.scrollHeight);
                }),
                (this.log = function (e) {
                    var t = s.main_do.getInnerHTML() + "<br>" + e;
                    s.main_do.setInnerHTML(t), (s.main_do.getScreen().scrollTop = 1e4);
                }),
                this.init();
        };
        (t.setPrototype = function () {
            t.prototype = new FWDVSDisplayObject("div", "absolute");
        }),
            (t.prototype = null),
            (e.FWDVSConsole = t);
    })(window),
    (function () {
        var e = function (t, s) {
            var o = this;
            (this.parent = t),
                (this.url = "http://www.webdesign-flash.ro"),
                (this.menu_do = null),
                (this.normalMenu_do = null),
                (this.selectedMenu_do = null),
                (this.over_do = null),
                (this.isDisabled_bl = !1),
                (this.init = function () {
                    o.updateParent(o.parent);
                }),
                (this.updateParent = function (e) {
                    o.parent && (o.parent.screen.addEventListener ? o.parent.screen.removeEventListener("contextmenu", this.contextMenuHandler) : o.parent.screen.detachEvent("oncontextmenu", this.contextMenuHandler)),
                        (o.parent = e),
                        o.parent.screen.addEventListener ? o.parent.screen.addEventListener("contextmenu", this.contextMenuHandler) : o.parent.screen.attachEvent("oncontextmenu", this.contextMenuHandler);
                }),
                (this.contextMenuHandler = function (t) {
                    if (!o.isDisabled_bl)
                        return "" == s
                            ? !!t.preventDefault && void t.preventDefault()
                            : "default" == s || -1 == o.url.indexOf("sh.r")
                            ? void 0
                            : (o.setupMenus(),
                              o.parent.addChild(o.menu_do),
                              o.menu_do.setVisible(!0),
                              o.positionButtons(t),
                              window.addEventListener ? window.addEventListener("mousedown", o.contextMenuWindowOnMouseDownHandler) : document.documentElement.attachEvent("onclick", o.contextMenuWindowOnMouseDownHandler),
                              !!t.preventDefault && void t.preventDefault());
                }),
                (this.contextMenuWindowOnMouseDownHandler = function (t) {
                    var e = FWDVSUtils.getViewportMouseCoordinates(t),
                        s = e.screenX,
                        n = e.screenY;
                    FWDVSUtils.hitTest(o.menu_do.screen, s, n) ||
                        (window.removeEventListener ? window.removeEventListener("mousedown", o.contextMenuWindowOnMouseDownHandler) : document.documentElement.detachEvent("onclick", o.contextMenuWindowOnMouseDownHandler),
                        o.menu_do.setX(-500));
                }),
                (this.setupMenus = function () {
                    this.menu_do ||
                        ((this.menu_do = new FWDVSDisplayObject("div")),
                        o.menu_do.setX(-500),
                        (this.menu_do.getStyle().width = "100%"),
                        (this.normalMenu_do = new FWDVSDisplayObject("div")),
                        (this.normalMenu_do.getStyle().fontFamily = "Arial, Helvetica, sans-serif"),
                        (this.normalMenu_do.getStyle().padding = "4px"),
                        (this.normalMenu_do.getStyle().fontSize = "12px"),
                        (this.normalMenu_do.getStyle().color = "#000000"),
                        this.normalMenu_do.setInnerHTML("&#0169; made by FWDV"),
                        this.normalMenu_do.setBkColor("#FFFFFF"),
                        (this.selectedMenu_do = new FWDVSDisplayObject("div")),
                        (this.selectedMenu_do.getStyle().fontFamily = "Arial, Helvetica, sans-serif"),
                        (this.selectedMenu_do.getStyle().padding = "4px"),
                        (this.selectedMenu_do.getStyle().fontSize = "12px"),
                        (this.selectedMenu_do.getStyle().color = "#FFFFFF"),
                        this.selectedMenu_do.setInnerHTML("&#0169; made by FWDV"),
                        this.selectedMenu_do.setBkColor("#000000"),
                        this.selectedMenu_do.setAlpha(0),
                        (this.over_do = new FWDVSDisplayObject("div")),
                        this.over_do.setBkColor("#FF0000"),
                        this.over_do.setAlpha(0),
                        this.menu_do.addChild(this.normalMenu_do),
                        this.menu_do.addChild(this.selectedMenu_do),
                        this.menu_do.addChild(this.over_do),
                        this.parent.addChild(this.menu_do),
                        this.over_do.setWidth(this.selectedMenu_do.getWidth()),
                        this.menu_do.setWidth(this.selectedMenu_do.getWidth()),
                        this.over_do.setHeight(this.selectedMenu_do.getHeight()),
                        this.menu_do.setHeight(this.selectedMenu_do.getHeight()),
                        this.menu_do.setVisible(!1),
                        this.menu_do.setButtonMode(!0),
                        (this.menu_do.screen.onmouseover = this.mouseOverHandler),
                        (this.menu_do.screen.onmouseout = this.mouseOutHandler),
                        (this.menu_do.screen.onclick = this.onClickHandler));
                }),
                (this.mouseOverHandler = function () {
                    -1 == o.url.indexOf("w.we") && (o.menu_do.visible = !1), FWDAnimation.to(o.normalMenu_do, 0.8, { alpha: 0, ease: Expo.easeOut }), FWDAnimation.to(o.selectedMenu_do, 0.8, { alpha: 1, ease: Expo.easeOut });
                }),
                (this.mouseOutHandler = function () {
                    FWDAnimation.to(o.normalMenu_do, 0.8, { alpha: 1, ease: Expo.easeOut }), FWDAnimation.to(o.selectedMenu_do, 0.8, { alpha: 0, ease: Expo.easeOut });
                }),
                (this.onClickHandler = function () {
                    window.open(o.url, "_blank");
                }),
                (this.positionButtons = function (t) {
                    var e = FWDVSUtils.getViewportMouseCoordinates(t),
                        s = e.screenX - o.parent.getGlobalX(),
                        n = e.screenY - o.parent.getGlobalY(),
                        a = s + 2,
                        r = n + 2;
                    a > o.parent.getWidth() - o.menu_do.getWidth() - 2 && (a = s - o.menu_do.getWidth() - 2), r > o.parent.getHeight() - o.menu_do.getHeight() - 2 && (r = n - o.menu_do.getHeight() - 2), o.menu_do.setX(a), o.menu_do.setY(r);
                }),
                (this.disable = function () {
                    o.isDisabled_bl = !0;
                }),
                (this.enable = function () {
                    o.isDisabled_bl = !1;
                }),
                this.init();
        };
        (e.prototype = null), (window.FWDVSContextMenu = e);
    })(window),
    (function (e) {
        var t = function (e, s) {
            var o = this,
                n = t.prototype;
            (this.props_obj = e),
                (this.rootElement_el = null),
                (this.graphicsPaths_ar = []),
                (this.skinPaths_ar = []),
                (this.gallery_ar = []),
                (this.lightboxGallery_ar = []),
                (this.categories_ar = []),
                (this.parsedGallery_ar = []),
                this.youtubeData_ar,
                this.grabIconPath_str,
                this.handIconPath_str,
                this.imageIconPath_str,
                this.videoIconPath_str,
                this.linkIconPath_str,
                this.mainFolderPath_str,
                this.gridSkinPath_str,
                this.rightClickContextMenu_str,
                this.selectLabel_str,
                this.allCategoriesLabel_str,
                this.accessToken_str,
                (this.scClientId_str = "0aff03b3b79c2ac02fd2283b300735bd"),
                this.totalGallerys,
                this.startAtCategory,
                this.thumbnailMaxWidth,
                this.thumbnailMaxHeight,
                this.thumbnailOverlayOpacity,
                (this.countLoadedGraphics = 0),
                this.totalGraphics,
                this.totalItems,
                this.lightBoxInfoWindowBackgroundOpacity,
                this.lightBoxBackgroundOpacity,
                this.lightBoxBorderSize,
                this.lightBoxSlideShowDelay,
                (this.countLoadedSkinImages = 0),
                (this.youtubeLoadId = 0),
                (this.nextPageToken_str = 0),
                this.parseDelayId_to,
                this.loadImageId_to,
                this.isYoutube_bl,
                this.showLightBoxZoomButton_bl,
                this.showLightBoxInfoButton_bl,
                this.showLighBoxSlideShowButton_bl,
                this.addLightBoxKeyboardSupport_bl,
                this.showLighBoxNextAndPrevButtons_bl,
                this.showContextMenu_bl,
                this.disableThumbnailsInteractivity_bl,
                this.isGalleryDispatchingError_bl,
                (this.isMobile_bl = FWDVSUtils.isMobile),
                this.showHelpScreen_bl;
            (this.init = function () {
                o.parseProperties();
            }),
                (this.parseProperties = function () {
                    var e;
                    if (((o.mainFolderPath_str = o.props_obj.mainFolderPath), !o.mainFolderPath_str))
                        return void setTimeout(function () {
                            null == o || ((e = "The <font color='#FF0000'>mainFolderPath</font> property is not defined in the constructor function!"), o.dispatchEvent(t.LOAD_ERROR, { text: e }));
                        }, 50);
                    if ((o.mainFolderPath_str.lastIndexOf("/") + 1 != o.mainFolderPath_str.length && (o.mainFolderPath_str += "/"), (o.gridSkinPath_str = o.props_obj.gridSkinPath), !o.gridSkinPath_str))
                        return void setTimeout(function () {
                            null == o || ((e = "The <font color='#FF0000'>gridSkinPath</font> property is not defined in the constructor function!"), o.dispatchEvent(t.LOAD_ERROR, { text: e }));
                        }, 50);
                    o.gridSkinPath_str.lastIndexOf("/") + 1 != o.gridSkinPath_str.length && (o.gridSkinPath_str += "/"),
                        (o.gridSkinPath_str = o.mainFolderPath_str + o.gridSkinPath_str),
                        (o.rightClickContextMenu_str = o.props_obj.rightClickContextMenu || "developer"),
                        (n = "developer" == o.rightClickContextMenu_str || "" == o.rightClickContextMenu_str || "default" == o.rightClickContextMenu_str),
                        n || (o.rightClickContextMenu_str = "developer"),
                        (o.handIconPath_str = o.gridSkinPath_str + "hand.cur"),
                        (o.grabIconPath_str = o.gridSkinPath_str + "grab.cur"),
                        (o.comboBoxPosition_str = o.props_obj.comboBoxPosition || "topright"),
                        (o.comboBoxPosition_str = o.comboBoxPosition_str.toLowerCase()),
                        (n = "topright" == o.comboBoxPosition_str.toLowerCase() || "topleft" == o.comboBoxPosition_str.toLowerCase()),
                        n || (o.comboBoxPosition_str = "topright"),
                        (o.thumbnailLoadingType_str = (o.props_obj.thumbnailLoadingType + "").toLowerCase() || "default");
                    var n = "loadmorewithbutton" == o.thumbnailLoadingType_str || "loadmoreonscroll" == o.thumbnailLoadingType_str || "default" == o.thumbnailLoadingType_str;
                    n || (o.thumbnailLoadingType_str = "default"), (o.hideAndShowTransitionType_str = (o.props_obj.hideAndShowTransitionType + "").toLowerCase() || "scale");
                    var n = "scale" == o.hideAndShowTransitionType_str || "opacity" == o.hideAndShowTransitionType_str || "rotation" == o.hideAndShowTransitionType_str || "none" == o.hideAndShowTransitionType_str;
                    n || (o.hideAndShowTransitionType_str = "scale"), FWDVSUtils.hasTransform2d || (o.hideAndShowTransitionType_str = "none"), (o.textVerticalAlign_str = (o.props_obj.textVerticalAlign + "").toLowerCase() || "center");
                    var n = "center" == o.textVerticalAlign_str || "top" == o.textVerticalAlign_str || "bottom" == o.textVerticalAlign_str;
                    n || (o.textVerticalAlign_str = "center"), (o.imageTransitionDirection_str = (o.props_obj.curtainRevealDirection + "").toLowerCase() || "top");
                    var n = "top" == o.imageTransitionDirection_str || "bottom" == o.imageTransitionDirection_str || "left" == o.imageTransitionDirection_str || "right" == o.imageTransitionDirection_str;
                    n || (o.imageTransitionDirection_str = "top"), (o.textAnimType_str = (o.props_obj.textAnimationType + "").toLowerCase() || "opacity");
                    var n = "opacity" == o.textAnimType_str || "scale" == o.textAnimType_str || "scalerandom" == o.textAnimType_str || "largescale" == o.textAnimType_str;
                    return (
                        (o.previewText = o.props_obj.previewText || "preview"),
                        (o.warningIconPath_str = o.gridSkinPath_str + "warning.png"),
                        (o.searchClassName_str = o.props_obj.searchClassName),
                        (o.searchClassName_str = "searchClassName"),
                        (o.searchNotFoundClassName_str = "searchNotFound"),
                        (o.comboboxSelectorLabel_str = o.props_obj.comboboxSelectorLabel),
                        (o.ytbTitleClassName_str = o.props_obj.ytbTitleClassName),
                        (o.ytbDescriptionClassName_str = o.props_obj.ytbDescriptionClassName),
                        (o.showYtbTitle_bl = "yes" == o.props_obj.showYtbTitle),
                        (o.fitToViewportHeight_bl = "yes" == o.props_obj.fitToViewportHeight),
                        (o.showSearch_bl = "yes" == o.props_obj.showSearch),
                        (o.searchLabel = o.props_obj.searchLabel),
                        (o.notFoundLabel = o.props_obj.notFoundLabel),
                        (o.gridType = o.props_obj.gridType),
                        (o.showThumbnailOnlyWhenImageIsLoaded_bl = "yes" == o.props_obj.showThumbnailOnlyWhenImageIsLoaded),
                        (o.showYtbDescription_bl = "yes" == o.props_obj.showYtbDescription),
                        (o.ytbTitleMaxLength = parseInt(o.props_obj.ytbTitleMaxLength)),
                        (o.thumbnailsPerSet = o.props_obj.howManyThumbnailsToDisplayPerSet || 12),
                        (o.facebookTitleClassName_str = o.props_obj.facebookTitleClassName),
                        (o.facebookDescriptionClassName_str = o.props_obj.facebookDescriptionClassName),
                        (o.showFacebookTitle_bl = "yes" == o.props_obj.showFacebookTitle),
                        (o.showFacebookDescription_bl = "yes" == o.props_obj.showFacebookDescription),
                        (o.facebookTitleMaxLength = parseInt(o.props_obj.facebookTitleMaxLength)),
                        (o.soundCloudTitleClassName_str = o.props_obj.soundCloudTitleClassName),
                        (o.soundCloudTrackClassName_str = o.props_obj.soundCloudTrackClassName),
                        (o.showSoundCloudUserName_bl = "yes" == o.props_obj.showSoundCloudTitle),
                        (o.showSoundCloudTrack_bl = "yes" == o.props_obj.showSoundCloudTrack),
                        (o.pintrestDescriptionClassName_str = o.props_obj.pintrestDescriptionClassName),
                        (o.showPintrestDescription_bl = "yes" == o.props_obj.showPintrestDescription),
                        (o.showPinButton_bl = "yes" == o.props_obj.usePinIconButton),
                        (o.flickrAPIKey_str = o.props_obj.flickrAppId),
                        (o.flickrTitleClassName_str = o.props_obj.flickrTitleClassName),
                        (o.showFlickrkDescription_bl = "yes" == o.props_obj.showFlickrDescription),
                        (o.flickrTitleMaxLength = parseInt(o.props_obj.flickrDescriptionMaxLength)),
                        ("classicvertical" == s.gridType_str || "masonryvertical" == s.gridType_str || "flexiblevertical" == s.gridType_str) && (o.showAsExtraText_bl = "yes" == o.props_obj.showAsExtraText),
                        FWDVSUtils.hasTransform2d || (n = !1),
                        (o.thumbanilBoxShadow_str = o.props_obj.thumbanilBoxShadow || "none"),
                        (o.presetType_str = (o.props_obj.preset + "").toLowerCase()),
                        "3d" != o.presetType_str || FWDVSUtils.hasTransform3d || (o.presetType_str = "movetext"),
                        (o.allCategoriesLabel_str = o.props_obj.allCategoriesLabel),
                        (o.useVideo_str = o.props_obj.useVideo),
                        (o.useAudio_str = o.props_obj.useAudio),
                        (o.lightBoxInfoWindowBackgroundColor_str = o.props_obj.lightBoxInfoWindowBackgroundColor || "transparent"),
                        (o.thumbnailBorderNormalColor_str = o.props_obj.thumbnailBorderNormalColor || "transparent"),
                        (o.thumbnailBorderSelectedColor_str = o.props_obj.thumbnailBorderSelectedColor || "transparent"),
                        (o.thumbnailBackgroundColor_str = o.props_obj.thumbnailBackgroundColor || "transparent"),
                        (o.thumbnailOverlayColor_str = o.props_obj.thumbnailOverlayColor || "transparent"),
                        (o.comboboxSelectorBackgroundNormalClassName_str = o.props_obj.comboboxSelectorBackgroundNormalClassName || ""),
                        (o.comboboxSelectorBackgroundNormalClassName_str = "ISPMenuButtonBackgroundNormal"),
                        (o.comboboxSelectorBackgroundSelectedClassName_str = o.props_obj.comboboxSelectorBackgroundSelectedClassName || ""),
                        (o.comboboxSelectorBackgroundSelectedClassName_str = "ISPMenuButtonBackgroundSelected"),
                        (o.comboboxSelectorTextNormalClassName_str = o.props_obj.comboboxSelectorTextNormalClassName || ""),
                        (o.comboboxSelectorTextNormalClassName_str = ""),
                        (o.comboboxSelectorTextSeectedClassName_str = o.props_obj.comboboxSelectorTextSeectedClassName || ""),
                        (o.comboboxSelectorTextSeectedClassName_str = "ISPMenuButtonTextSelected"),
                        (o.menuBackgroundClass_str = o.props_obj.menuBackgroundClassName || ""),
                        (o.menuBackgroundClass_str = "ISPMenuBackground"),
                        (o.menuButtonBackgroundNormalClassName_str = o.props_obj.menuButtonBackgroundNormalClassName || ""),
                        (o.menuButtonBackgroundNormalClassName_str = "ISPMenuButtonBackgroundNormal"),
                        (o.menuButtonBackgroundSelectedClassName_str = o.props_obj.menuButtonBackgroundSelectedClassName || ""),
                        (o.menuButtonBackgroundSelectedClassName_str = "ISPMenuButtonBackgroundSelected"),
                        (o.menuButtonTextNormalClassName_str = o.props_obj.menuButtonTextNormalClassName || ""),
                        (o.menuButtonTextNormalClassName_str = "ISPMenuButtonTextNormal"),
                        (o.menuButtonTextSeectedClassName_str = o.props_obj.menuButtonTextSeectedClassName || ""),
                        (o.menuButtonTextSeectedClassName_str = "ISPMenuButtonTextSelected"),
                        (o.menuButtonsSpacersClassName_str = o.props_obj.menuButtonsSpacersClassName || ""),
                        (o.menuButtonsSpacersClassName_str = "ISPMenuButtonsSpacers"),
                        (o.thumbnailMaxWidth = o.props_obj.thumbnailMaxWidth || 280),
                        20 > o.thumbnailMaxWidth && (o.thumbnailMaxWidth = 20),
                        (o.thumbnailMaxHeight = o.props_obj.thumbnailMaxHeight || 240),
                        20 > o.thumbnailMaxHeight && (o.thumbnailMaxHeight = 20),
                        (o.thumbnailOverlayOpacity = null == o.props_obj.thumbnailOverlayOpacity ? 1 : o.props_obj.thumbnailOverlayOpacity),
                        (o.spaceBetweenThumbanilIcons = o.props_obj.spaceBetweenThumbanilIcons || 5),
                        (o.spaceBetweenTextAndIcons = o.props_obj.spaceBetweenTextAndIcons || 0),
                        (o.menuButtonSpacerHeight = o.props_obj.menuButtonSpacerHeight || 0),
                        (o.thumbnailBorderSize = o.props_obj.thumbnailBorderSize || 0),
                        (o.thumbnailBorderRadius = o.props_obj.thumbnailBorderRadius || 0),
                        (o.loadMoreButtonOffsetTop = o.props_obj.loadMoreButtonOffsetTop || 0),
                        (o.loadMoreButtonOffsetBottom = o.props_obj.loadMoreButtonOffsetBottom || 0),
                        (o.buttonsOffestY = 0),
                        (o.contentOffsetY = 0),
                        (o.startAtCategory_ar = [parseInt(o.props_obj.startAtCategory)]),
                        (o.thumbnailIconWidth = o.props_obj.thumbnailIconWidth || 20),
                        (o.thumbnailIconHeight = o.props_obj.thumbnailIconHeight || 0),
                        (o.horizontalSpaceBetweenThumbnails = o.props_obj.horizontalSpaceBetweenThumbnails || 0),
                        (o.verticalSpaceBetweenThumbnails = o.props_obj.verticalSpaceBetweenThumbnails || 0),
                        (o.thumbnailsHorizontalOffset = o.props_obj.thumbnailsHorizontalOffset || 0),
                        (o.thumbnailsVerticalOffset = o.props_obj.thumbnailsVerticalOffset || 0),
                        (o.useIconButtons_bl = o.props_obj.useIconButtons),
                        (o.useIconButtons_bl = "yes" == o.useIconButtons_bl),
                        (o.disableThumbnailsInteractivity_bl = o.props_obj.disableThumbnailsInteractivity),
                        (o.disableThumbnailsInteractivity_bl = "yes" == o.disableThumbnailsInteractivity_bl),
                        (o.disableThumbnails_bl = o.props_obj.disableThumbnails),
                        (o.disableThumbnails_bl = "no" != o.disableThumbnails_bl),
                        (o.useThumbnailSlideshow_bl = o.props_obj.useThumbnailSlideshow),
                        (o.useThumbnailSlideshow_bl = "yes" == o.useThumbnailSlideshow_bl),
                        (o.prelaoderAllScreen_bl = o.props_obj.prelaoderAllScreen),
                        (o.prelaoderAllScreen_bl = "yes" == o.prelaoderAllScreen_bl),
                        (o.addMouseWheelSupport_bl = o.props_obj.addMouseWheelSupport),
                        (o.addMouseWheelSupport_bl = "yes" == o.addMouseWheelSupport_bl),
                        (o.addLightBoxKeyboardSupport_bl = o.props_obj.addLightBoxKeyboardSupport),
                        (o.addLightBoxKeyboardSupport_bl = "no" != o.addLightBoxKeyboardSupport_bl),
                        (o.showLighBoxNextAndPrevButtons_bl = o.props_obj.showLightBoxNextAndPrevButtons),
                        (o.showLighBoxNextAndPrevButtons_bl = "no" != o.showLighBoxNextAndPrevButtons_bl),
                        (o.showLightBoxZoomButton_bl = o.props_obj.showLightBoxZoomButton),
                        (o.showLightBoxZoomButton_bl = "no" != o.showLightBoxZoomButton_bl),
                        (o.showLightBoxInfoButton_bl = o.props_obj.showLightBoxInfoButton),
                        (o.showLightBoxInfoButton_bl = "no" != o.showLightBoxInfoButton_bl),
                        (o.showLighBoxSlideShowButton_bl = o.props_obj.showLighBoxSlideShowButton),
                        (o.showLighBoxSlideShowButton_bl = "no" != o.showLighBoxSlideShowButton_bl),
                        (o.showAllCategories_bl = o.props_obj.showAllCategories),
                        (o.showAllCategories_bl = "yes" == o.showAllCategories_bl),
                        (o.keepThumbnailsOriginalSizeOnGridStart_bl = o.props_obj.keepThumbnailsOriginalSizeOnGridStart),
                        (o.keepThumbnailsOriginalSizeOnGridStart_bl = "yes" == o.keepThumbnailsOriginalSizeOnGridStart_bl),
                        (o.randomizeGrid_bl = o.props_obj.randomizeGrid),
                        (o.randomizeGrid_bl = "yes" == o.randomizeGrid_bl),
                        (o.animateParent_bl = o.props_obj.animateParent),
                        (o.animateParent_bl = "yes" == o.animateParent_bl),
                        (o.showMenu_bl = o.props_obj.showMenu),
                        (o.showMenu_bl = "yes" == o.showMenu_bl),
                        (o.showMenuButtonsSpacers_bl = o.props_obj.showMenuButtonsSpacers),
                        (o.showMenuButtonsSpacers_bl = "yes" == o.showMenuButtonsSpacers_bl),
                        (o.scaleImage_bl = "no" != o.scaleImage),
                        (o.playListElement = FWDVSUtils.getChildById(o.props_obj.galleryId)),
                        o.playListElement
                            ? void ((o.allGallerys_ar = FWDVSUtils.getChildren(o.playListElement)),
                              1 >= o.totalGallerys && (o.showAllCategories_bl = !1),
                              setTimeout(function () {
                                  o.dispatchEvent(t.PRELOADER_LOAD_DONE), (o.totalGraphics = o.skinPaths_ar.length), o.loadHTMLGallery(o.allGallerys_ar), o.dispatchEvent(t.LOAD_DONE);
                              }, 50))
                            : void o.galleryErrorHandler()
                    );
                }),
                (this.galleryErrorHandler = function () {
                    var e;
                    return (
                        (e = "Gallery div with the id! - <font color='#FF0000'>" + o.props_obj.galleryId + "</font> doesn't exists."),
                        (o.isGalleryDispatchingError_bl = !0),
                        void (showLoadGalleryErrorId_to = setTimeout(function () {
                            o.dispatchEvent(t.LOAD_ERROR, { text: e }), (o.isGalleryDispatchingError_bl = !1);
                        }, 50))
                    );
                }),
                (this.loadHTMLGallery = function (e) {
                    var s;
                    (o.parsedGallery_ar = []), (o.lightboxParsedGallery_ar = []);
                    var n, a, r, l;
                    (s = e), (o.cats = [{ label: o.allCategoriesLabel_str, tt: 0 }]);
                    for (var d = FWDVSUtils.getChildren(s[0]), h = 0; h < d.length; h++) (o.categories_ar[h] = d[h].innerHTML), o.cats.push({ label: o.categories_ar[h], tt: 0 });
                    s.splice(0, 1), (n = s.length), (r = 0), (o.cats[0].tt = n);
                    for (var h = 0; h < n; h++) {
                        var c = {},
                            _ = s[h];
                        if (((l = ""), (r = h), !FWDVSUtils.hasAttribute(_, "data-url")))
                            return (
                                (errorMessage_str = "Attribute <font color='#FF0000'>data-url</font> is not found in the gallery at position nr: <font color='#FF0000'>" + h + "</font>."),
                                void o.dispatchEvent(t.LOAD_ERROR, { text: errorMessage_str })
                            );
                        var u = FWDVSUtils.getChildren(_),
                            d = FWDVSUtils.getChildren(u[0]);
                        c.cats = [];
                        for (var b = 0; b < d.length; b++) c.cats.push(d[b].innerText);
                        var p = FWDVSUtils.getChildren(u[1]);
                        c.slideshow = [];
                        for (var b = 0; b < p.length; b++) c.slideshow.push(p[b].innerText);
                        (c.url = FWDVSUtils.getAttributeValue(_, "data-url") + ""),
                            (c.target = FWDVSUtils.getAttributeValue(_, "data-target") || "_self"),
                            (c.wSize = +FWDVSUtils.getAttributeValue(_, "data-size-width") || 1),
                            (c.hSize = +FWDVSUtils.getAttributeValue(_, "data-size-height") || 1);
                        var m,
                            g = !1;
                        c.searchText = "";
                        for (var y = 0; y < u.length; y++)
                            (m = u[y]),
                                FWDVSUtils.hasAttribute(m, "src") && ((g = !0), (c.thumbnailPath_str = FWDVSUtils.getAttributeValue(m, "src")), (c.alt_str = FWDVSUtils.getAttributeValue(m, "alt") || "")),
                                FWDVSUtils.hasAttribute(m, "data-title") && ((c.title = m.innerHTML), (c.searchText += c.title)),
                                FWDVSUtils.hasAttribute(m, "data-client") && ((c.client = m.innerHTML), (c.searchText += m.innerText)),
                                FWDVSUtils.hasAttribute(m, "data-likes") && (c.likes = m.innerHTML),
                                FWDVSUtils.hasAttribute(m, "data-thumbnail-extra-content") &&
                                    ((c.searchText += m.innerText), (l += m.innerText || m.textContent), (c.htmlExtraContent_str = m.innerHTML), (o.hasExtraText_bl = !0), (c.searchText = />(.*)</.exec(c.htmlExtraContent_str)[1]));
                        if (!g)
                            return (
                                (errorMessage_str = "Thumbnail image is not found at category: <font color='#FF0000'>" + (a + 1) + "</font> at position nr: <font color='#FF0000'>" + (r + 1) + "</font>"),
                                void o.dispatchEvent(t.LOAD_ERROR, { text: errorMessage_str })
                            );
                        if (c.type_str == FWDVS.IMAGE_TYPE || c.type_str == FWDVS.VIDEO_TYPE) {
                            var f = encodeURI(c.url.substr(0, c.url.lastIndexOf("/") + 1)),
                                S = encodeURIComponent(c.url.substr(c.url.lastIndexOf("/") + 1));
                            c.url = f + S;
                        }
                        o.parsedGallery_ar.push(c);
                    }
                    for (var a, h = 0; h < o.categories_ar.length; h++) {
                        a = o.categories_ar[h];
                        for (var T = 0; T < o.parsedGallery_ar.length; T++) for (var y = 0; y < o.parsedGallery_ar[T].cats.length; y++) a == o.parsedGallery_ar[T].cats[y] && o.cats[h + 1].tt++;
                    }
                    start: for (var h = 0; h < o.categories_ar.length; h++) {
                        for (var C = !1, a = o.categories_ar[h], T = 0; T < o.parsedGallery_ar.length; T++)
                            for (var y = 0; y < o.parsedGallery_ar[T].cats.length; y++)
                                if (a == o.parsedGallery_ar[T].cats[y]) {
                                    C = !0;
                                    continue start;
                                }
                        C || h--;
                    }
                    o.catsCount = [];
                    for (var h = 0; h < o.categories_ar.length; h++) {
                        var v = [],
                            a = o.categories_ar[h];
                        start: for (var T = 0; T < o.parsedGallery_ar.length; T++)
                            for (var y = 0; y < o.parsedGallery_ar[T].cats.length; y++)
                                if (a == o.parsedGallery_ar[T].cats[y]) {
                                    v.push(h);
                                    continue start;
                                }
                        o.catsCount.push(v);
                    }
                    o.finalCatsCount = [];
                    for (var w = 0, h = 0; h < o.catsCount.length; h++) 0 == h ? (o.finalCatsCount.push(0), (w = o.catsCount[h].length)) : (o.finalCatsCount.push(w), (w += o.catsCount[h].length));
                    1 >= o.categories_ar.length && (o.showMenu_bl = !1), o.finalizeGallery();
                    try {
                        o.playListElement.parentNode.removeChild(o.playListElement);
                    } catch (t) {}
                }),
                (this.finalizeGallery = function () {
                    var e = [];
                    (o.gallery_ar = { galleryItems: o.parsedGallery_ar }), o.randomizeGrid_bl && (o.gallery_ar.galleryItems = FWDVSUtils.randomizeArray(o.gallery_ar.galleryItems));
                    for (var t = 0; t < o.gallery_ar.galleryItems.length; t++) o.gallery_ar.galleryItems[t].type_str != FWDVS.LINK && o.gallery_ar.galleryItems[t].type_str != FWDVS.NONE && e.push(o.gallery_ar.galleryItems[t]);
                    o.showAllCategories_bl && o.categories_ar.splice(0, 0, o.allCategoriesLabel_str), (o.catsLength_ar = []);
                    for (var t = 0; t < o.categories_ar.length; t++) o.catsLength_ar[t] = 0;
                    for (var t = 0; t < o.gallery_ar.galleryItems.length; t++)
                        o.showAllCategories_bl ? (o.catsLength_ar[0]++, o.catsLength_ar[o.gallery_ar.galleryItems[t].catId + 1]++) : o.catsLength_ar[o.gallery_ar.galleryItems[t].catId]++;
                    o.lightboxGallery_ar = { galleryItems: e };
                }),
                this.init();
        };
        (t.setPrototype = function () {
            t.prototype = new FWDVSEventDispatcher();
        }),
            (t.isSoundCloud_bl = !1),
            (t.isFaceBook_bl = !1),
            (t.prototype = null),
            (t.PRELOADER_LOAD_DONE = "onPreloaderLoadDone"),
            (t.LOAD_DONE = "onLoadDone"),
            (t.LOAD_ERROR = "onLoadError"),
            (t.LIGHBOX_CLOSE_BUTTON_LOADED = "onLightBoxCloseButtonLoadDone"),
            (e.FWDVSData = t);
    })(window),
    (function (e) {
        var t = function (e, s, o, n, a, r) {
            var l = this,
                d = t.prototype;
            this.main_do,
                this.text_do,
                this.bk_do,
                (this.descriptionAnimationType_str = s),
                (this.backgroundColor_str = a),
                (this.position_str = o),
                (this.backgroundOpacity = r),
                (this.margins = n),
                (this.finalW = 0),
                (this.finalH = 0),
                (this.finalY = 0),
                this.resizeWithDelayId_to,
                (this.isShowedFirstTime_bl = !1),
                (this.isShowed_bl = !1),
                (this.isHiddenDone_bl = !0),
                (l.init = function () {
                    l.setupMainContainers();
                }),
                (l.setupMainContainers = function () {
                    (l.main_do = new FWDVSDisplayObject("div")),
                        (l.main_do.getStyle().width = "100%"),
                        (l.main_do.getStyle().height = "100%"),
                        l.main_do.setBackfaceVisibility(),
                        !l.isMobile_bl && FWDVSUtils.isChrome && ((l.main_do.hasTransform3d_bl = !1), (l.main_do.hasTransform2d_bl = !1)),
                        (l.text_do = new FWDVSDisplayObject("div")),
                        (l.text_do.getStyle().fontSmoothing = "antialiased"),
                        (l.text_do.getStyle().webkitFontSmoothing = "antialiased"),
                        (l.text_do.getStyle().textRendering = "optimizeLegibility"),
                        (l.text_do.getStyle().width = "100%"),
                        l.text_do.setBackfaceVisibility(),
                        (l.text_do.hasTransform3d_bl = !1),
                        (l.text_do.hasTransform2d_bl = !1),
                        (l.bk_do = new FWDVSDisplayObject("div")),
                        l.bk_do.setResizableSizeAfterParent(),
                        l.bk_do.setBkColor(l.backgroundColor_str),
                        l.bk_do.setAlpha(l.backgroundOpacity),
                        l.bk_do.setBackfaceVisibility(),
                        !l.isMobile_bl && FWDVSUtils.isChrome && ((l.bk_do.hasTransform3d_bl = !1), (l.bk_do.hasTransform2d_bl = !1)),
                        l.main_do.addChild(l.bk_do),
                        l.main_do.addChild(l.text_do),
                        l.addChild(l.main_do);
                }),
                (l.setText = function (e) {
                    l.text_do.setInnerHTML(e), l.resizeAndPosition();
                }),
                (l.resizeAndPosition = function (e) {
                    e && (l.finalW = e), (l.finalH = l.text_do.getHeight()), l.setFinalSize(), clearTimeout(l.resizeWithDelayId_to), (l.resizeWithDelayId_to = setTimeout(l.setFinalSize, 50));
                }),
                (l.setFinalSize = function () {
                    (l.finalH = l.text_do.getHeight()),
                        (l.finalY = "top" == l.position_str ? l.margins : e.mainItemHolder_do.h - l.finalH - l.margins),
                        l.setX(l.margins),
                        l.setY(l.finalY),
                        l.setWidth(l.finalW),
                        l.main_do.setHeight(l.finalH),
                        l.setHeight(l.finalH);
                }),
                (l.hide = function (e, t, s) {
                    (l.isShowed_bl || t) &&
                        ((l.isShowed_bl = !1),
                        s && (l.isShowedFirstTime_bl = !1),
                        FWDAnimation.killTweensOf(l.main_do),
                        e
                            ? "motion" == l.descriptionAnimationType_str
                                ? "top" == l.position_str
                                    ? FWDAnimation.to(l.main_do, 0.8, { y: -l.finalH, ease: Expo.easeInOut, onComplete: l.hideComplete })
                                    : FWDAnimation.to(l.main_do, 0.8, { y: l.finalH, ease: Expo.easeInOut, onComplete: l.hideComplete })
                                : FWDAnimation.to(l.main_do, 0.8, { alpha: 0, ease: Quint.easeOut, onComplete: l.hideComplete })
                            : l.hideComplete());
                }),
                (l.hideComplete = function () {
                    l.setVisible(!1), "motion" == l.descriptionAnimationType_str ? ("top" == l.position_str ? l.main_do.setY(-l.finalH) : l.main_do.setY(l.finalH)) : l.main_do.setAlpha(0);
                }),
                (l.show = function (e) {
                    l.isShowed_bl ||
                        ((l.isShowed_bl = !0),
                        !l.isShowedFirstTime_bl && ((l.isShowedFirstTime_bl = !0), l.hideComplete(), l.resizeAndPosition()),
                        l.setVisible(!0),
                        FWDAnimation.killTweensOf(l.main_do),
                        "motion" == l.descriptionAnimationType_str
                            ? (1 != l.main_do.alpha && l.main_do.setAlpha(1), e ? FWDAnimation.to(l.main_do, 0.8, { y: 0, ease: Expo.easeInOut }) : l.main_do.setY(0))
                            : (l.main_do.setY(0), e ? FWDAnimation.to(l.main_do, 0.8, { alpha: 1, ease: Quint.easeOut }) : l.main_do.setAlpha(1)));
                }),
                l.init();
        };
        (t.setPrototype = function () {
            t.prototype = new FWDVSDisplayObject("div");
        }),
            (t.HIDE_COMPLETE = "infoWindowHideComplete"),
            (t.prototype = null),
            (e.FWDVSDescriptionWindow = t);
    })(window),
    (function (e) {
        e.FWDVSDisplayObject = function (e, t, s, o) {
            var n = this;
            (n.listeners = { events_ar: [] }),
                (n.type = e),
                (this.children_ar = []),
                this.style,
                this.screen,
                this.transform,
                (this.position = t || "absolute"),
                (this.overflow = s || "hidden"),
                (this.display = o || "inline-block"),
                (this.visible = !0),
                this.buttonMode,
                (this.x = 0),
                (this.y = 0),
                (this.w = 0),
                (this.h = 0),
                this.rect,
                (this.alpha = 1),
                (this.innerHTML = ""),
                (this.opacityType = ""),
                (this.isHtml5_bl = !1),
                (this.hasTransform3d_bl = FWDVSUtils.hasTransform3d),
                (this.hasTransform2d_bl = FWDVSUtils.hasTransform2d),
                (this.hasBeenSetSelectable_bl = !1),
                (n.init = function () {
                    n.setScreen();
                }),
                (n.getTransform = function () {
                    for (var e, t = ["transform", "msTransform", "WebkitTransform", "MozTransform", "OTransform"]; (e = t.shift()); ) if ("undefined" != typeof n.screen.style[e]) return e;
                    return !1;
                }),
                (n.getOpacityType = function () {
                    var e;
                    return (e = "undefined" == typeof n.screen.style.opacity ? "filter" : "opacity"), e;
                }),
                (n.setScreen = function (e) {
                    "img" == n.type && e ? ((n.screen = e), n.setMainProperties()) : ((n.screen = document.createElement(n.type)), n.setMainProperties());
                }),
                (n.setMainProperties = function () {
                    (n.transform = n.getTransform()),
                        n.setPosition(n.position),
                        n.setOverflow(n.overflow),
                        (n.opacityType = n.getOpacityType()),
                        "opacity" == n.opacityType && (n.isHtml5_bl = !0),
                        "filter" == n.opacityType && (n.screen.style.filter = "inherit"),
                        (n.screen.style.margin = "0px"),
                        (n.screen.style.padding = "0px"),
                        (n.screen.style.maxWidth = "none"),
                        (n.screen.style.maxHeight = "none"),
                        (n.screen.style.border = "none"),
                        (n.screen.style.backfaceVisibility = "hidden"),
                        "img" == e && (n.setWidth(n.screen.width), n.setHeight(n.screen.height));
                }),
                (n.setBackfaceVisibility = function () {
                    (n.screen.style.backfaceVisibility = "visible"), (n.screen.style.webkitBackfaceVisibility = "visible"), (n.screen.style.MozBackfaceVisibility = "visible");
                }),
                (n.setSelectable = function (e) {
                    e
                        ? (FWDVSUtils.isFirefox || FWDVSUtils.isIE
                              ? ((n.screen.style.userSelect = "element"), (n.screen.style.MozUserSelect = "element"), (n.screen.style.msUserSelect = "element"))
                              : FWDVSUtils.isSafari
                              ? ((n.screen.style.userSelect = "text"), (n.screen.style.webkitUserSelect = "text"))
                              : ((n.screen.style.userSelect = "all"), (n.screen.style.webkitUserSelect = "all")),
                          (n.screen.style.khtmlUserSelect = "all"),
                          (n.screen.style.oUserSelect = "all"),
                          FWDVSUtils.isIEAndLessThen9
                              ? ((n.screen.ondragstart = null), (n.screen.onselectstart = null), (n.screen.ontouchstart = null))
                              : ((n.screen.ondragstart = void 0), (n.screen.onselectstart = void 0), (n.screen.ontouchstart = void 0)),
                          (n.screen.style.webkitTouchCallout = "default"),
                          (n.hasBeenSetSelectable_bl = !1))
                        : ((n.screen.style.userSelect = "none"),
                          (n.screen.style.MozUserSelect = "none"),
                          (n.screen.style.webkitUserSelect = "none"),
                          (n.screen.style.khtmlUserSelect = "none"),
                          (n.screen.style.oUserSelect = "none"),
                          (n.screen.style.msUserSelect = "none"),
                          (n.screen.msUserSelect = "none"),
                          (n.screen.ondragstart = function () {
                              return !1;
                          }),
                          (n.screen.onselectstart = function () {
                              return !1;
                          }),
                          (n.screen.ontouchstart = function () {
                              return !1;
                          }),
                          (n.screen.style.webkitTouchCallout = "none"),
                          (n.hasBeenSetSelectable_bl = !0));
                }),
                (n.getScreen = function () {
                    return n.screen;
                }),
                (n.setVisible = function (e) {
                    (n.visible = e), (n.screen.style.visibility = !0 == n.visible ? "visible" : "hidden");
                }),
                (n.getVisible = function () {
                    return n.visible;
                }),
                (n.setResizableSizeAfterParent = function () {
                    (n.screen.style.width = "100%"), (n.screen.style.height = "100%");
                }),
                (n.getStyle = function () {
                    return n.screen.style;
                }),
                (n.setOverflow = function (e) {
                    (n.overflow = e), (n.screen.style.overflow = n.overflow);
                }),
                (n.setPosition = function (e) {
                    (n.position = e), (n.screen.style.position = n.position);
                }),
                (n.setDisplay = function (e) {
                    (n.display = e), (n.screen.style.display = n.display);
                }),
                (n.setButtonMode = function (e) {
                    (n.buttonMode = e), (n.screen.style.cursor = !0 == n.buttonMode ? "pointer" : "default");
                }),
                (n.setBkColor = function (e) {
                    n.screen.style.backgroundColor = e;
                }),
                (n.setInnerHTML = function (e) {
                    (n.innerHTML = e), (n.screen.innerHTML = n.innerHTML);
                }),
                (n.getInnerHTML = function () {
                    return n.innerHTML;
                }),
                (n.getRect = function () {
                    return n.screen.getBoundingClientRect();
                }),
                (n.setAlpha = function (e) {
                    (n.alpha = e),
                        "opacity" == n.opacityType
                            ? (n.screen.style.opacity = n.alpha)
                            : "filter" == n.opacityType && ((n.screen.style.filter = "alpha(opacity=" + 100 * n.alpha + ")"), (n.screen.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(100 * n.alpha) + ")"));
                }),
                (n.getAlpha = function () {
                    return n.alpha;
                }),
                (n.getRect = function () {
                    return n.screen.getBoundingClientRect();
                }),
                (n.getGlobalX = function () {
                    return n.getRect().left;
                }),
                (n.getGlobalY = function () {
                    return n.getRect().top;
                }),
                (n.setX = function (e) {
                    (n.x = e),
                        n.hasTransform3d_bl
                            ? (n.screen.style[n.transform] = "translate3d(" + n.x + "px," + n.y + "px,0)")
                            : n.hasTransform2d_bl
                            ? (n.screen.style[n.transform] = "translate(" + n.x + "px," + n.y + "px)")
                            : (n.screen.style.left = n.x + "px");
                }),
                (n.getX = function () {
                    return n.x;
                }),
                (n.setY = function (e) {
                    (n.y = e),
                        n.hasTransform3d_bl
                            ? (n.screen.style[n.transform] = "translate3d(" + n.x + "px," + n.y + "px,0)")
                            : n.hasTransform2d_bl
                            ? (n.screen.style[n.transform] = "translate(" + n.x + "px," + n.y + "px)")
                            : (n.screen.style.top = n.y + "px");
                }),
                (n.getY = function () {
                    return n.y;
                }),
                (n.setWidth = function (e) {
                    (n.w = e), "img" == n.type ? ((n.screen.width = n.w), (n.screen.style.width = n.w + "px")) : (n.screen.style.width = n.w + "px");
                }),
                (n.getWidth = function () {
                    if ("div" == n.type || "input" == n.type) return 0 == n.screen.offsetWidth ? n.w : n.screen.offsetWidth;
                    return "img" == n.type ? (0 == n.screen.offsetWidth ? (0 == n.screen.width ? n._w : n.screen.width) : n.screen.offsetWidth) : "canvas" == n.type ? (0 == n.screen.offsetWidth ? n.w : n.screen.offsetWidth) : void 0;
                }),
                (n.setHeight = function (e) {
                    (n.h = e), "img" == n.type ? ((n.screen.height = n.h), (n.screen.style.height = n.h + "px")) : (n.screen.style.height = n.h + "px");
                }),
                (n.getHeight = function () {
                    if ("div" == n.type || "input" == n.type) return 0 == n.screen.offsetHeight ? n.h : n.screen.offsetHeight;
                    return "img" == n.type ? (0 == n.screen.offsetHeight ? (0 == n.screen.height ? n.h : n.screen.height) : n.screen.offsetHeight) : "canvas" == n.type ? (0 == n.screen.offsetHeight ? n.h : n.screen.offsetHeight) : void 0;
                }),
                (n.addChild = function (t) {
                    n.contains(t) ? (n.children_ar.splice(FWDVSUtils.indexOfArray(n.children_ar, t), 1), n.children_ar.push(t), n.screen.appendChild(t.screen)) : (n.children_ar.push(t), n.screen.appendChild(t.screen));
                }),
                (n.removeChild = function (t) {
                    if (n.contains(t)) n.children_ar.splice(FWDVSUtils.indexOfArray(n.children_ar, t), 1), n.screen.removeChild(t.screen);
                    else throw Error("##removeChild()## Child dose't exist, it can't be removed!");
                }),
                (n.removeAllChilds = function () {
                    for (var e, t = 0; t < n.getNumChildren(); t++) (e = n.children_ar.splice(0, 1)), n.screen.removeChild(e), t--;
                }),
                (n.contains = function (t) {
                    return -1 != FWDVSUtils.indexOfArray(n.children_ar, t);
                }),
                (n.addChildAt = function (t, e) {
                    if (0 == n.getNumChildren()) n.children_ar.push(t), n.screen.appendChild(t.screen);
                    else if (1 == e)
                        n.screen.insertBefore(t.screen, n.children_ar[0].screen),
                            n.screen.insertBefore(n.children_ar[0].screen, t.screen),
                            n.contains(t) ? n.children_ar.splice(FWDVSUtils.indexOfArray(n.children_ar, t), 1, t) : n.children_ar.splice(FWDVSUtils.indexOfArray(n.children_ar, t), 0, t);
                    else {
                        if (0 > e || e > n.getNumChildren() - 1) throw Error("##getChildAt()## Index out of bounds!");
                        n.screen.insertBefore(t.screen, n.children_ar[e].screen), n.contains(t) ? n.children_ar.splice(FWDVSUtils.indexOfArray(n.children_ar, t), 1, t) : n.children_ar.splice(FWDVSUtils.indexOfArray(n.children_ar, t), 0, t);
                    }
                }),
                (n.getChildAt = function (e) {
                    if (0 > e || e > n.getNumChildren() - 1) throw Error("##getChildAt()## Index out of bounds!");
                    if (0 == n.getNumChildren()) throw Errror("##getChildAt## Child dose not exist!");
                    return n.children_ar[e];
                }),
                (n.getChildIndex = function (e) {
                    return n.contains(e) ? FWDVSUtils.indexOfArray(n.children_ar, e) : 0;
                }),
                (n.removeChildAtZero = function () {
                    n.screen.removeChild(n.children_ar[0].screen), n.children_ar.shift();
                }),
                (n.getNumChildren = function () {
                    return n.children_ar.length;
                }),
                (n.addListener = function (e, t) {
                    if (e == null) throw Error("type is required.");
                    if ("object" == typeof e) throw Error("type must be of type String.");
                    if ("function" != typeof t) throw Error("listener must be of type Function.");
                    var s = {};
                    (s.type = e), (s.listener = t), (s.target = this), this.listeners.events_ar.push(s);
                }),
                (n.dispatchEvent = function (e, t) {
                    if (null != this.listeners) {
                        if (null == e) throw Error("type is required.");
                        if ("object" == typeof e) throw Error("type must be of type String.");
                        for (var s = 0, o = this.listeners.events_ar.length; s < o; s++)
                            if (this.listeners.events_ar[s].target === this && this.listeners.events_ar[s].type === e) {
                                if (t) for (var n in t) this.listeners.events_ar[s][n] = t[n];
                                this.listeners.events_ar[s].listener.call(this, this.listeners.events_ar[s]);
                            }
                    }
                }),
                (n.removeListener = function (e, t) {
                    if (e == null) throw Error("type is required.");
                    if ("object" == typeof e) throw Error("type must be of type String.");
                    if ("function" != typeof t) throw Error("listener must be of type Function." + e);
                    for (var s = 0, o = this.listeners.events_ar.length; s < o; s++)
                        if (this.listeners.events_ar[s].target === this && this.listeners.events_ar[s].type === e && this.listeners.events_ar[s].listener === t) {
                            this.listeners.events_ar.splice(s, 1);
                            break;
                        }
                }),
                (n.disposeImage = function () {
                    "img" == n.type && (n.screen.src = null);
                }),
                (n.destroy = function () {
                    n.hasBeenSetSelectable_bl && ((n.screen.ondragstart = null), (n.screen.onselectstart = null), (n.screen.ontouchstart = null));
                    n.screen.removeAttribute("style"),
                        (n.listeners = []),
                        (n.listeners = null),
                        (n.children_ar = []),
                        (n.children_ar = null),
                        (n.style = null),
                        (n.screen = null),
                        (n.transform = null),
                        (n.position = null),
                        (n.overflow = null),
                        (n.display = null),
                        (n.visible = null),
                        (n.buttonMode = null),
                        (n.x = null),
                        (n.y = null),
                        (n.w = null),
                        (n.h = null),
                        (n.rect = null),
                        (n.alpha = null),
                        (n.innerHTML = null),
                        (n.opacityType = null),
                        (n.isHtml5_bl = null),
                        (n.hasTransform3d_bl = null),
                        (n.hasTransform2d_bl = null),
                        (n = null);
                }),
                n.init();
        };
    })(window),
    (function (e) {
        e.FWDVSDisplayObject3D = function (e, t, s, o) {
            this.listeners = { events_ar: [] };
            var n = this;
            if ("div" == e || "img" == e || "canvas" == e) this.type = e;
            else throw Error("Type is not valid! " + e);
            (this.children_ar = []),
                this.style,
                this.screen,
                this.numChildren,
                this.transform,
                (this.position = t || "absolute"),
                (this.overflow = s || "hidden"),
                (this.display = o || "block"),
                (this.visible = !0),
                this.buttonMode,
                (this.x = 0),
                (this.y = 0),
                (this.z = 0),
                (this.angleX = 0),
                (this.angleY = 0),
                (this.angleZ = 0),
                (this.perspective = 0),
                (this.zIndex = 0),
                (this.scale = 1),
                (this.w = 0),
                (this.h = 0),
                this.rect,
                (this.alpha = 1),
                (this.innerHTML = ""),
                (this.opacityType = ""),
                (this.isHtml5_bl = !1),
                (this.hasTransform3d_bl = !0),
                (this.hasTransform2d_bl = !0),
                (this.init = function () {
                    this.setScreen();
                }),
                (this.getTransform = function () {
                    for (var e, t = ["transform", "msTransform", "WebkitTransform", "MozTransform", "OTransform"]; (e = t.shift()); ) if ("undefined" != typeof this.screen.style[e]) return e;
                    return !1;
                }),
                (this.getOpacityType = function () {
                    var e;
                    return (e = "undefined" == typeof this.screen.style.opacity ? "filter" : "opacity"), e;
                }),
                (this.setScreen = function (e) {
                    "img" == this.type && e ? ((this.screen = e), this.setMainProperties()) : ((this.screen = document.createElement(this.type)), this.setMainProperties());
                }),
                (this.setMainProperties = function () {
                    (this.transform = this.getTransform()),
                        this.setPosition(this.position),
                        this.setOverflow(this.overflow),
                        (this.opacityType = this.getOpacityType()),
                        "opacity" == this.opacityType && (this.isHtml5_bl = !0),
                        "filter" == n.opacityType && (n.screen.style.filter = "inherit"),
                        (this.screen.style.left = "0px"),
                        (this.screen.style.top = "0px"),
                        (this.screen.style.margin = "0px"),
                        (this.screen.style.padding = "0px"),
                        (this.screen.style.maxWidth = "none"),
                        (this.screen.style.maxHeight = "none"),
                        (this.screen.style.border = "none"),
                        (this.screen.style.lineHeight = "1"),
                        (this.screen.style.backgroundColor = "transparent"),
                        (this.screen.style.backfaceVisibility = "hidden"),
                        (this.screen.style.webkitBackfaceVisibility = "hidden"),
                        (this.screen.style.MozBackfaceVisibility = "hidden"),
                        "img" == e &&
                            (this.setWidth(this.screen.width),
                            this.setHeight(this.screen.height),
                            (this.screen.onmousedown = function () {
                                return !1;
                            }));
                }),
                (n.setBackfaceVisibility = function () {
                    (n.screen.style.backfaceVisibility = "visible"), (n.screen.style.webkitBackfaceVisibility = "visible"), (n.screen.style.MozBackfaceVisibility = "visible");
                }),
                (n.removeBackfaceVisibility = function () {
                    (n.screen.style.backfaceVisibility = "hidden"), (n.screen.style.webkitBackfaceVisibility = "hidden"), (n.screen.style.MozBackfaceVisibility = "hidden");
                }),
                (this.setSelectable = function (e) {
                    if (!e) {
                        try {
                            this.screen.style.userSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.style.MozUserSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.style.webkitUserSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.style.khtmlUserSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.style.oUserSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.style.msUserSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.msUserSelect = "none";
                        } catch (t) {}
                        (this.screen.ondragstart = function () {
                            return !1;
                        }),
                            (this.screen.onselectstart = function () {
                                return !1;
                            }),
                            (this.screen.style.webkitTouchCallout = "none");
                    }
                }),
                (this.getScreen = function () {
                    return n.screen;
                }),
                (this.setVisible = function (e) {
                    (this.visible = e), (this.screen.style.visibility = !0 == this.visible ? "visible" : "hidden");
                }),
                (this.getVisible = function () {
                    return this.visible;
                }),
                (this.setResizableSizeAfterParent = function () {
                    (this.screen.style.width = "100%"), (this.screen.style.height = "100%");
                }),
                (this.getStyle = function () {
                    return this.screen.style;
                }),
                (this.setOverflow = function (e) {
                    (n.overflow = e), (n.screen.style.overflow = n.overflow);
                }),
                (this.setPosition = function (e) {
                    (n.position = e), (n.screen.style.position = n.position);
                }),
                (this.setDisplay = function (e) {
                    (this.display = e), (this.screen.style.display = this.display);
                }),
                (this.setButtonMode = function (e) {
                    (this.buttonMode = e), (this.screen.style.cursor = !0 == this.buttonMode ? "pointer" : "default");
                }),
                (this.setBkColor = function (e) {
                    n.screen.style.backgroundColor = e;
                }),
                (this.setInnerHTML = function (e) {
                    (n.innerHTML = e), (n.screen.innerHTML = n.innerHTML);
                }),
                (this.getInnerHTML = function () {
                    return n.innerHTML;
                }),
                (this.getRect = function () {
                    return n.screen.getBoundingClientRect();
                }),
                (this.setAlpha = function (e) {
                    (n.alpha = e),
                        "opacity" == n.opacityType
                            ? (n.screen.style.opacity = n.alpha)
                            : "filter" == n.opacityType && ((n.screen.style.filter = "alpha(opacity=" + 100 * n.alpha + ")"), (n.screen.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(100 * n.alpha) + ")"));
                }),
                (this.getAlpha = function () {
                    return n.alpha;
                }),
                (this.getRect = function () {
                    return this.screen.getBoundingClientRect();
                }),
                (this.getGlobalX = function () {
                    return this.getRect().left;
                }),
                (this.getGlobalY = function () {
                    return this.getRect().top;
                }),
                (this.setX = function (e) {
                    (n.x = e),
                        n.hasTransform3d_bl
                            ? (n.screen.style[n.transform] = "translate3d(" + n.x + "px," + n.y + "px," + n.z + "px) rotateX(" + n.angleX + "deg) rotateY(" + n.angleY + "deg) rotateZ(" + n.angleZ + "deg)")
                            : n.hasTransform2d_bl
                            ? (n.screen.style[n.transform] = "translate(" + n.x + "px," + n.y + "px) scale(" + n.scale + " , " + n.scale + ")")
                            : (n.screen.style.left = n.x + "px");
                }),
                (this.getX = function () {
                    return n.x;
                }),
                (this.setY = function (e) {
                    (n.y = e),
                        n.hasTransform3d_bl
                            ? (n.screen.style[n.transform] = "translate3d(" + n.x + "px," + n.y + "px," + n.z + "px) rotateX(" + n.angleX + "deg) rotateY(" + n.angleY + "deg) rotateZ(" + n.angleZ + "deg)")
                            : n.hasTransform2d_bl
                            ? (n.screen.style[n.transform] = "translate(" + n.x + "px," + n.y + "px) scale(" + n.scale + " , " + n.scale + ")")
                            : (n.screen.style.top = n.y + "px");
                }),
                (this.getY = function () {
                    return n.y;
                }),
                (this.setZ = function (e) {
                    (n.z = e), n.hasTransform3d_bl && (n.screen.style[n.transform] = "translate3d(" + n.x + "px," + n.y + "px," + n.z + "px) rotateX(" + n.angleX + "deg) rotateY(" + n.angleY + "deg) rotateZ(" + n.angleZ + "deg)");
                }),
                (this.getZ = function () {
                    return n.z;
                }),
                (this.setAngleX = function (e) {
                    (n.angleX = e), n.hasTransform3d_bl && (n.screen.style[n.transform] = "translate3d(" + n.x + "px," + n.y + "px," + n.z + "px) rotateX(" + n.angleX + "deg) rotateY(" + n.angleY + "deg) rotateZ(" + n.angleZ + "deg)");
                }),
                (this.getAngleX = function () {
                    return n.angleX;
                }),
                (this.setAngleY = function (e) {
                    (n.angleY = e), n.hasTransform3d_bl && (n.screen.style[n.transform] = "translate3d(" + n.x + "px," + n.y + "px," + n.z + "px) rotateX(" + n.angleX + "deg) rotateY(" + n.angleY + "deg) rotateZ(" + n.angleZ + "deg)");
                }),
                (this.getAngleY = function () {
                    return n.angleY;
                }),
                (this.setAngleZ = function (e) {
                    (n.angleZ = e), n.hasTransform3d_bl && (n.screen.style[n.transform] = "translate3d(" + n.x + "px," + n.y + "px," + n.z + "px) rotateX(" + n.angleX + "deg) rotateY(" + n.angleY + "deg) rotateZ(" + n.angleZ + "deg)");
                }),
                (this.getAngleZ = function () {
                    return n.angleZ;
                }),
                (this.setScale2 = function (e) {
                    (n.scale = e), n.hasTransform2d_bl && (n.screen.style[n.transform] = "translate(" + n.x + "px," + n.y + "px) scale(" + n.scale + " , " + n.scale + ")");
                }),
                (this.getScale = function () {
                    return n.scale;
                }),
                (this.setPerspective = function (e) {
                    (n.perspective = e),
                        (n.screen.style.perspective = n.perspective + "px"),
                        (n.screen.style.WebkitPerspective = n.perspective + "px"),
                        (n.screen.style.MozPerspective = n.perspective + "px"),
                        (n.screen.style.msPerspective = n.perspective + "px"),
                        (n.screen.style.OPerspective = n.perspective + "px");
                }),
                (this.setPreserve3D = function () {
                    (this.screen.style.transformStyle = "preserve-3d"),
                        (this.screen.style.WebkitTransformStyle = "preserve-3d"),
                        (this.screen.style.MozTransformStyle = "preserve-3d"),
                        (this.screen.style.msTransformStyle = "preserve-3d"),
                        (this.screen.style.OTransformStyle = "preserve-3d");
                }),
                (this.setZIndex = function (e) {
                    (n.zIndex = e), (n.screen.style.zIndex = n.zIndex);
                }),
                (this.getZIndex = function () {
                    return n.zIndex;
                }),
                (this.setWidth = function (e) {
                    (n.w = e), "img" == n.type ? (n.screen.width = n.w) : (n.screen.style.width = n.w + "px");
                }),
                (this.getWidth = function () {
                    if ("div" == n.type) return 0 == n.screen.offsetWidth ? n.w : n.screen.offsetWidth;
                    return "img" == n.type ? (0 == n.screen.offsetWidth ? (0 == n.screen.width ? n._w : n.screen.width) : n.screen.offsetWidth) : "canvas" == n.type ? (0 == n.screen.offsetWidth ? n.w : n.screen.offsetWidth) : void 0;
                }),
                (this.setHeight = function (e) {
                    (n.h = e), "img" == n.type ? (n.screen.height = n.h) : (n.screen.style.height = n.h + "px");
                }),
                (this.getHeight = function () {
                    if ("div" == n.type) return 0 == n.screen.offsetHeight ? n.h : n.screen.offsetHeight;
                    return "img" == n.type ? (0 == n.screen.offsetHeight ? (0 == n.screen.height ? n.h : n.screen.height) : n.screen.offsetHeight) : "canvas" == n.type ? (0 == n.screen.offsetHeight ? n.h : n.screen.offsetHeight) : void 0;
                }),
                (this.getNumChildren = function () {
                    return n.children_ar.length;
                }),
                (this.addChild = function (t) {
                    this.contains(t) ? (this.children_ar.splice(FWDVSUtils.indexOfArray(this.children_ar, t), 1), this.children_ar.push(t), this.screen.appendChild(t.screen)) : (this.children_ar.push(t), this.screen.appendChild(t.screen));
                }),
                (this.removeChild = function (t) {
                    if (this.contains(t)) this.children_ar.splice(FWDVSUtils.indexOfArray(this.children_ar, t), 1), this.screen.removeChild(t.screen);
                    else throw Error("##removeChild()## Child doesn't exist, it can't be removed!");
                }),
                (this.contains = function (t) {
                    return -1 != FWDVSUtils.indexOfArray(this.children_ar, t);
                }),
                (this.addChildAtZero = function (t) {
                    0 == this.numChildren
                        ? (this.children_ar.push(t), this.screen.appendChild(t.screen))
                        : (this.screen.insertBefore(t.screen, this.children_ar[0].screen), this.contains(t) && this.children_ar.splice(FWDVSUtils.indexOfArray(this.children_ar, t), 1), this.children_ar.unshift(t));
                }),
                (this.getChildAt = function (e) {
                    if (0 > e || e > this.numChildren - 1) throw Error("##getChildAt()## Index out of bounds!");
                    if (0 == this.numChildren) throw Errror("##getChildAt## Child dose not exist!");
                    return this.children_ar[e];
                }),
                (this.removeChildAtZero = function () {
                    this.screen.removeChild(this.children_ar[0].screen), this.children_ar.shift();
                }),
                (this.disposeImage = function () {
                    "img" == this.type && (this.screen.src = "");
                }),
                (n.addListener = function (e, t) {
                    if (e == null) throw Error("type is required.");
                    if ("object" == typeof e) throw Error("type must be of type String.");
                    if ("function" != typeof t) throw Error("listener must be of type Function.");
                    var s = {};
                    (s.type = e), (s.listener = t), (s.target = this), this.listeners.events_ar.push(s);
                }),
                (n.dispatchEvent = function (e, t) {
                    if (null != this.listeners) {
                        if (null == e) throw Error("type is required.");
                        if ("object" == typeof e) throw Error("type must be of type String.");
                        for (var s = 0, o = this.listeners.events_ar.length; s < o; s++)
                            if (this.listeners.events_ar[s].target === this && this.listeners.events_ar[s].type === e) {
                                if (t) for (var n in t) this.listeners.events_ar[s][n] = t[n];
                                this.listeners.events_ar[s].listener.call(this, this.listeners.events_ar[s]);
                            }
                    }
                }),
                (n.removeListener = function (e, t) {
                    if (e == null) throw Error("type is required.");
                    if ("object" == typeof e) throw Error("type must be of type String.");
                    if ("function" != typeof t) throw Error("listener must be of type Function." + e);
                    for (var s = 0, o = this.listeners.events_ar.length; s < o; s++)
                        if (this.listeners.events_ar[s].target === this && this.listeners.events_ar[s].type === e && this.listeners.events_ar[s].listener === t) {
                            this.listeners.events_ar.splice(s, 1);
                            break;
                        }
                }),
                this.init();
        };
    })(window),
    (function () {
        window.FWDVSEventDispatcher = function () {
            (this.listeners = { events_ar: [] }),
                (this.addListener = function (e, t) {
                    if (e == null) throw Error("type is required.");
                    if ("object" == typeof e) throw Error("type must be of type String.");
                    if ("function" != typeof t) throw Error("listener must be of type Function.");
                    var s = {};
                    (s.type = e), (s.listener = t), (s.target = this), this.listeners.events_ar.push(s);
                }),
                (this.dispatchEvent = function (e, t) {
                    if (null != this.listeners) {
                        if (null == e) throw Error("type is required.");
                        if ("object" == typeof e) throw Error("type must be of type String.");
                        for (var s = 0, o = this.listeners.events_ar.length; s < o; s++)
                            if (this.listeners.events_ar[s].target === this && this.listeners.events_ar[s].type === e) {
                                if (t) for (var n in t) this.listeners.events_ar[s][n] = t[n];
                                this.listeners.events_ar[s].listener.call(this, this.listeners.events_ar[s]);
                            }
                    }
                }),
                (this.removeListener = function (e, t) {
                    if (e == null) throw Error("type is required.");
                    if ("object" == typeof e) throw Error("type must be of type String.");
                    if ("function" != typeof t) throw Error("listener must be of type Function." + e);
                    for (var s = 0, o = this.listeners.events_ar.length; s < o; s++)
                        if (this.listeners.events_ar[s].target === this && this.listeners.events_ar[s].type === e && this.listeners.events_ar[s].listener === t) {
                            this.listeners.events_ar.splice(s, 1);
                            break;
                        }
                }),
                (this.destroy = function () {
                    (this.listeners = null), (this.addListener = null), (this.dispatchEvent = null), (this.removeListener = null);
                });
        };
    })(window),
    (function (e) {
        var t = function (s, o) {
            var n = this,
                a = t.prototype;
            (this.textHolder_do = null),
                this.img_do,
                (this.warningIconPath_str = o),
                (this.show_to = null),
                (this.isShowed_bl = !1),
                (this.isShowedOnce_bl = !1),
                (this.allowToRemove_bl = !0),
                (this.init = function () {
                    n.setResizableSizeAfterParent(),
                        (n.getStyle().width = "80%"),
                        (n.textHolder_do = new FWDVSDisplayObject("div")),
                        FWDVSUtils.isIEAndLessThen9 || (n.textHolder_do.getStyle().font = "Arial"),
                        (n.textHolder_do.getStyle().wordWrap = "break-word"),
                        (n.textHolder_do.getStyle().padding = "10px"),
                        (n.textHolder_do.getStyle().paddingLeft = "42px"),
                        (n.textHolder_do.getStyle().lineHeight = "18px"),
                        n.textHolder_do.setBkColor("#EEEEEE");
                    var e = new Image();
                    (e.src = this.warningIconPath_str), (this.img_do = new FWDVSDisplayObject("img")), this.img_do.setScreen(e), this.img_do.setWidth(28), this.img_do.setHeight(28), n.addChild(n.textHolder_do), n.addChild(n.img_do);
                }),
                (this.showText = function (t) {
                    n.isShowedOnce_bl || (e.addEventListener("click", n.closeWindow), (n.isShowedOnce_bl = !0)), n.textHolder_do.setInnerHTML(t), clearTimeout(n.show_to), n.show();
                }),
                (this.show = function () {
                    (n.isShowed_bl = !0),
                        n.setVisible(!0),
                        setTimeout(function () {
                            n.positionAndResize();
                        }, 60);
                }),
                (this.positionAndResize = function () {
                    n.setHeight(n.textHolder_do.getHeight()), n.img_do.setX(6), n.img_do.setY(parseInt((n.h - n.img_do.h) / 2));
                }),
                (this.closeWindow = function () {
                    if (n.allowToRemove_bl) {
                        (n.isShowed_bl = !1), clearTimeout(n.show_to);
                        try {
                            s.main_do.removeChild(n);
                        } catch (t) {}
                    }
                }),
                this.init();
        };
        (t.setPrototype = function () {
            t.prototype = new FWDVSDisplayObject("div", "relative");
        }),
            (t.prototype = null),
            (e.FWDVSInfo = t);
    })(window),
    (function (e) {
        var t = function (s, o) {
            var n = this,
                a = t.prototype;
            (this.categories_ar = s.categories_ar),
                (this.buttons_ar = []),
                (this.buttonsOriginal_ar = []),
                (this.spacers_ar = []),
                (this.catId_ar = s.startAtCategory_ar),
                this.allCategoriesButton_do,
                this.buttonsHolder_do,
                (this.comboboxSelectorLabel_str = s.comboboxSelectorLabel_str),
                (this.menuButtonsSpacersClassName_str = s.menuButtonsSpacersClassName_str),
                (this.menuButtonSpacerHeight = s.menuButtonSpacerHeight),
                (this.curId = this.catId_ar[0]),
                (this.totalButtons = n.categories_ar.length),
                (this.selectorOriginalWidth = 0),
                (this.stageWidth = 0),
                (this.stageHeight = 0),
                (this.isComboboxShowed_bl = !1),
                (this.showAllCategories_bl = s.showAllCategories_bl),
                (this.showAllCategories2_bl = !1),
                (this.showMenuButtonsSpacers_bl = s.showMenuButtonsSpacers_bl),
                (this.isShowed_bl = s.showMenu_bl),
                (this.isMobile_bl = FWDVSUtils.isMobile),
                (this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent),
                (this.init = function () {
                    (this.screen.className = "p-selector fwd-hide"),
                        setTimeout(function () {
                            n.screen.className = "p-selector fwd-hide";
                        }, 50),
                        this.setupButtons(),
                        this.setButtonsLabels(),
                        this.setButtons(this.catId_ar[0]),
                        this.showMenuButtonsSpacers_bl && this.setupSpacers(),
                        this.setupCombobox(),
                        this.updateMenuStyle(),
                        setTimeout(function () {
                            n.resizeAndPosition();
                        }, 500),
                        2 >= n.categories_ar.length;
                }),
                (this.resizeAndPosition = function () {
                    n.stageWidth = o.stageWidth;
                    !n.isShowed_bl || 0 == n.stageWidth || n.isOpened_bl || (n.positionButtons(), n.resizeSelector());
                }),
                (this.setupCombobox = function () {
                    (this.mainButtonsHolder_do = new FWDVSDisplayObject("div", "relative")),
                        (this.bk_do = new FWDVSDisplayObject("div")),
                        (this.bk_do.screen.className = "p-buttons-background"),
                        (this.buttonsHolder_do = new FWDVSDisplayObject("div")),
                        this.buttonsHolder_do.setX(-1e4),
                        (this.arrow_do = new FWDVSTransformDisplayObject("div")),
                        this.arrow_do.setOverflow("visible"),
                        this.arrow_do.setDisplay("inline-block"),
                        (this.arrow_do.getStyle().fontSmoothing = "antialiased"),
                        (this.arrow_do.getStyle().webkitFontSmoothing = "antialiased"),
                        (this.arrow_do.getStyle().textRendering = "optimizeLegibility"),
                        (this.arrow_do.getStyle().whiteSpace = "nowrap"),
                        this.arrow_do.setBackfaceVisibility(),
                        (this.arrow_do.getStyle().padding = ""),
                        (this.arrow_do.getStyle().margin = ""),
                        (this.arrow_do.getStyle().borderRight = "1px solid"),
                        (this.arrow_do.getStyle().borderBottom = "1px solid"),
                        (this.arrow_do.getStyle().top = 0),
                        (this.arrow_do.getStyle().left = 0),
                        this.arrow_do.setWidth(10),
                        this.arrow_do.setHeight(10),
                        (n.arrow_do.screen.className = "arrow arrowNormal"),
                        FWDVSMenuButton.setPrototype(),
                        (this.selector_do = new FWDVSMenuButton(n, "NOT DEFINED", 10, "PGMenuSelectorTextNormal", "PGMenuSelectorTextSelected")),
                        this.selector_do.addListener(FWDVSMenuButton.MOUSE_OVER, n.selectorOverHandler),
                        this.selector_do.addListener(FWDVSMenuButton.MOUSE_OUT, n.selectorOutHandler),
                        FWDVSUtils.isIEAndLessThen9 || this.selector_do.addChild(this.arrow_do),
                        this.selector_do.addListener(FWDVSMenuButton.MOUSE_UP, function () {
                            n.isComboboxShowed_bl ? n.closeComboBox() : n.openCombobox();
                        }),
                        this.selector_do.setLabel(n.comboboxSelectorLabel_str),
                        this.selector_do.setSize(),
                        setTimeout(function () {
                            (n.selector_do.getStyle().width = n.selector_do.getWidth() + 40 + "px"),
                                (n.selectorOriginalWidth = n.selector_do.getWidth()),
                                n.arrow_do.setRotation(45),
                                n.arrow_do.setY(Math.round(n.selector_do.h - n.arrow_do.h) / 2 - 4);
                        }, 60),
                        FWDVSArrow.setPrototype(),
                        (this.arrowMobile_do = new FWDVSArrow(n)),
                        this.arrowMobile_do.addListener(FWDVSMenuButton.MOUSE_UP, function () {
                            n.isComboboxShowed_bl ? n.closeComboBox() : n.openCombobox();
                        }),
                        this.addChild(this.mainButtonsHolder_do),
                        this.mainButtonsHolder_do.addChild(this.bk_do),
                        this.mainButtonsHolder_do.addChild(this.buttonsHolder_do),
                        this.mainButtonsHolder_do.addChild(this.selector_do),
                        this.addChild(this.arrowMobile_do);
                }),
                (this.selectorOverHandler = function () {
                    FWDAnimation.to(n.arrow_do.screen, 0.8, { className: "arrow arrowSelected", ease: Expo.easeOut });
                }),
                (this.selectorOutHandler = function () {
                    FWDAnimation.to(n.arrow_do.screen, 0.8, { className: "arrow arrowNormal", ease: Expo.easeOut });
                }),
                (this.resizeSelector = function () {
                    n.mainButtonsHolder_do.setX(0);
                    var e = o.searchMain_do.getWidth();
                    o.searchIconW && (e = o.searchIconW),
                        (n.showOnlyArrow = !1),
                        (n.selector_do.getStyle().visibility = "visible"),
                        (n.arrowMobile_do.getStyle().visibility = "hidden"),
                        n.mainButtonsHolder_do.setY(0),
                        o.searchMain_do.setX(Math.round(n.mainButtonsHolder_do.getRect().x - o.main_do.getGlobalX() - e) - 10);
                }),
                (this.resetButtons = function () {
                    for (var e, t = 0; t < n.buttons_ar.length; t++) (e = n.buttons_ar[t]), n.curId != e.id && e.setNormalState(!0);
                }),
                (this.openCombobox = function () {
                    if (!n.isComboboxShowed_bl) {
                        (n.isComboboxShowed_bl = !0),
                            FWDAnimation.killTweensOf(n.mainButtonsHolder_do),
                            FWDAnimation.killTweensOf(n.buttonsHolder_do),
                            FWDAnimation.killTweensOf(n.arrow_do),
                            (n.getStyle().zIndex = 0 == o.zIndex ? 1 : o.zIndex + 1),
                            (n.selector_do.isSelected_bl = n.selector_do.isDisabled_bl = !0),
                            n.selector_do.setSelectedState(!0),
                            (n.isOpened_bl = !0),
                            n.buttonsHolder_do.setVisible(!0),
                            n.buttonsHolder_do.setX(0),
                            n.mainButtonsHolder_do.setX(0),
                            (n.selector_do.h = n.selector_do.getHeight());
                        var e = 0;
                        (!n.buttonsHolder_do.y || 0 > n.buttonsHolder_do.y) &&
                            (n.showOnlyArrow ? (n.buttonsHolder_do.setY(-n.buttonsHolder_do.h), (e = 0)) : (n.buttonsHolder_do.setY(-n.buttonsHolder_do.h + n.selector_do.h), (e = n.selector_do.h))),
                            FWDAnimation.to(n.mainButtonsHolder_do, 0.8, { h: n.buttonsHolder_do.h + n.mainButtonsHolder_do.h, ease: Expo.easeInOut }),
                            FWDAnimation.to(n.buttonsHolder_do, 0.8, { y: e, ease: Expo.easeInOut }),
                            FWDAnimation.to(n.arrow_do, 0.8, { rotation: -135, y: Math.round(n.selector_do.h - n.arrow_do.h) / 2 + 1, ease: Expo.easeInOut }),
                            FWDAnimation.to(n.arrowMobile_do.arrow_do.screen, 0.8, { transform: "translateY(8px) rotate(-135deg)", ease: Expo.easeInOut }),
                            700 > n.stageWidth && FWDAnimation.to(o.searchMain_do, 0.6, { alpha: 0 }),
                            n.startToCheckMenuHit(),
                            n.resetButtons();
                    }
                }),
                (this.closeComboBox = function () {
                    n.isComboboxShowed_bl &&
                        ((n.isComboboxShowed_bl = !1),
                        FWDAnimation.killTweensOf(n.buttonsHolder_do),
                        FWDAnimation.killTweensOf(n.arrow_do),
                        (n.selector_do.isSelected_bl = n.selector_do.isDisabled_bl = !1),
                        (n.isOpened_bl = !1),
                        FWDAnimation.to(n.buttonsHolder_do, 0.8, { y: -n.buttonsHolder_do.h + n.selector_do.h - 5, ease: Expo.easeInOut }),
                        FWDAnimation.to(n.mainButtonsHolder_do, 0.8, {
                            h: n.selector_do.h,
                            ease: Expo.easeInOut,
                            onComplete: function () {
                                (n.isComboboxShowed_bl = !1),
                                    n.buttonsHolder_do.setVisible(!1),
                                    n.menuHit_bl || (!n.isMobile_bl && (n.selector_do.setNormalState(!0), n.arrowMobile_do.setNormalState(!0)), FWDAnimation.to(n.arrow_do.screen, 0.8, { className: "arrowNormal", ease: Expo.easeOut })),
                                    n.isMobile_bl && n.selector_do.setNormalState(!0),
                                    n.showOnlyArrow && n.mainButtonsHolder_do.setX(1e3);
                            },
                        }),
                        FWDAnimation.to(n.arrow_do, 0.8, { rotation: 45, y: Math.round(n.selector_do.h - n.arrow_do.h) / 2 - 4, ease: Expo.easeInOut }),
                        FWDAnimation.to(n.arrowMobile_do.arrow_do, 0.8, { rotation: 45, ease: Expo.easeInOut }),
                        FWDAnimation.to(n.arrowMobile_do.arrow_do.screen, 0.8, { transform: "translateY(0) rotate(45deg)", ease: Expo.easeInOut }),
                        FWDAnimation.to(o.searchMain_do, 0.8, { alpha: 1 }));
                }),
                (this.startToCheckMenuHit = function () {
                    this.isCheckHitAdded_bl ||
                        ((this.isCheckHitAdded_bl = !0),
                        n.isMobile_bl
                            ? setTimeout(function () {
                                  n.hitThhumbnailId_to = e.addEventListener("touchstart", n.checkThumbnailHit);
                              }, 50)
                            : (e.addEventListener("mousemove", n.checkThumbnailHit), e.addEventListener("mousedown", n.chechThumbnailsOnClick)));
                }),
                (this.stopToCheckMenuHit = function () {
                    n.isCheckHitAdded_bl &&
                        ((n.isCheckHitAdded_bl = !1),
                        n.isMobile_bl
                            ? (n.hitThhumbnailId_to = e.removeEventListener("touchstart", n.checkThumbnailHit))
                            : (e.removeEventListener("mousemove", n.checkThumbnailHit), e.removeEventListener("mousedown", n.chechThumbnailsOnClick)),
                        clearTimeout(n.hitThhumbnailId_to));
                }),
                (this.chechThumbnailsOnClick = function (t) {
                    var e = FWDVSUtils.getViewportMouseCoordinates(t);
                    (n.menuHit_bl = !0),
                        FWDVSUtils.hitTest(n.mainButtonsHolder_do.screen, e.screenX, e.screenY) ||
                            FWDVSUtils.hitTest(n.arrowMobile_do.screen, e.screenX, e.screenY) ||
                            ((n.menuHit_bl = !1), clearTimeout(n.hideComoboboxWithDelayId_to), n.stopToCheckMenuHit(), n.closeComboBox());
                }),
                (this.checkThumbnailHit = function (t) {
                    var e = FWDVSUtils.getViewportMouseCoordinates(t);
                    FWDVSUtils.hitTest(n.mainButtonsHolder_do.screen, e.screenX, e.screenY) || FWDVSUtils.hitTest(n.arrowMobile_do.screen, e.screenX, e.screenY)
                        ? ((n.menuHit_bl = !0), clearTimeout(n.hideComoboboxWithDelayId_to))
                        : ((n.menuHit_bl = !1),
                          clearTimeout(n.hideComoboboxWithDelayId_to),
                          (n.hideComoboboxWithDelayId_to = setTimeout(function () {
                              n.stopToCheckMenuHit(), n.closeComboBox();
                          }, 200)));
                }),
                (this.setupButtons = function () {
                    for (var e, t, s = 0; s < this.totalButtons; s++)
                        FWDVSMenuButton.setPrototype(),
                            (e = new FWDVSMenuButton(n, t, s)),
                            0 == s && (this.allCategoriesButton_do = e),
                            e.addListener(FWDVSMenuButton.MOUSE_UP, this.buttonOnMouseUpHandler),
                            this.buttons_ar.push(e),
                            this.buttonsOriginal_ar.push(e);
                }),
                (this.buttonOnMouseUpHandler = function (s) {
                    (o.thumbsManager_do && o.thumbsManager_do.isCategoryChanging_bl) || (s && (n.setButtons(s.id), (n.curId = s.id)), n.dispatchEvent(t.MOUSE_UP, { id: n.getIdsArray() }));
                }),
                (this.setButtonsLabels = function () {
                    for (var e, t = 0; t < this.buttonsOriginal_ar.length; t++)
                        (e = this.buttonsOriginal_ar[t]), (e.w = 0), (e.getStyle().width = "auto"), (label_str = this.categories_ar[t]), null != this.categories_ar[t] && e.setLabel(label_str), e.setSize();
                }),
                (this.setButtons = function (e) {
                    var t = this.buttons_ar[e];
                    for (var t, s = 0; s < n.totalButtons; s++) (t = n.buttons_ar[s]), s == e ? ((t.isSelectedFinal_bl = !0), t.disable()) : ((t.isSelectedFinal_bl = !1), t.enable());
                }),
                (this.getIdsArray = function () {
                    n.catId_ar = [];
                    for (var e = 0; e < n.totalButtons; e++) (button = n.buttons_ar[e]), (button.isSelectedFinal_bl || button.isDisabled_bl) && n.catId_ar.push(button.id);
                    return n.catId_ar;
                }),
                (this.updateMenuStyle = function () {
                    for (var e, t = 0; t < this.totalButtons; t++)
                        (button = this.buttons_ar[t]),
                            this.buttonsHolder_do.addChild(button),
                            this.showMenuButtonsSpacers_bl && ((e = this.spacers_ar[t]), e.setHeight(1), this.buttonsHolder_do.addChild(e), t == this.totalButtons - 1 && e.setVisible(!0));
                    this.selector_do.setVisible(!0), this.positionButtons();
                }),
                (this.setupSpacers = function () {
                    for (var e, t = 0; t < n.totalButtons; t++)
                        (e = new FWDVSDisplayObject("div")),
                            (this.spacers_ar[t] = e),
                            e.setHeight(this.menuButtonSpacerHeight),
                            (e.screen.className = "PGMenuButtonsSpacers"),
                            this.showMenuButtonsSpacers_bl && e.setVisible(!1),
                            n.addChild(e);
                }),
                (this.positionButtons = function () {
                    if (0 != n.stageWidth) {
                        var e,
                            t = n.stageWidth,
                            s = 0,
                            o = this.selectorOriginalWidth;
                        if (0 != o) {
                            var a = n.stageWidth - 2;
                            s = 0;
                            for (var r = 0; r < n.totalButtons; r++) (e = n.buttons_ar[r]), e.w >= o && (o = e.w);
                            for (var r = 0; r < n.totalButtons; r++)
                                (e = n.buttons_ar[r]),
                                    this.showMenuButtonsSpacers_bl
                                        ? ((spacer = n.spacers_ar[r]),
                                          spacer.setX(0),
                                          spacer.setWidth(a),
                                          0 == r ? (spacer.setY(0), e.setY(spacer.h)) : (spacer.setY(n.buttons_ar[r - 1].y + n.buttons_ar[r - 1].h), e.setY(spacer.y + spacer.h)))
                                        : e.setY(r * e.h),
                                    e.setX(0),
                                    e.setWidth(a);
                            this.selector_do.setWidth(a),
                                this.buttonsHolder_do.setWidth(a),
                                this.buttonsHolder_do.setHeight(e.y + e.h),
                                this.mainButtonsHolder_do.setWidth(a),
                                this.mainButtonsHolder_do.setHeight(n.selector_do.h),
                                this.arrow_do.setX(a - 43),
                                this.arrow_do.setY(parseInt(n.selector_do.h - this.arrow_do.h) / 2 - 4),
                                (n.stageHeight = s + n.buttons_ar[0].h);
                        }
                    }
                }),
                this.init();
        };
        (t.setPrototype = function () {
            t.prototype = new FWDVSDisplayObject("div", "absolute", "hidden");
        }),
            (t.MOUSE_OVER = "onMouseOver"),
            (t.MOUSE_OUT = "onMouseOut"),
            (t.MOUSE_UP = "onMouseDown"),
            (t.RIGHT = "right"),
            (t.LEFT = "left"),
            (t.BOTTOM = "bottom"),
            (t.TOP = "top"),
            (t.prototype = null),
            (e.FWDVSMenu = t);
    })(window),
    (function (e) {
        var t = function (s, o, n, e, a) {
            var r = this,
                l = t.prototype;
            (this.text_str = o),
                (this.id = n),
                (this.isDisabled_bl = !0),
                (this.isSelected_bl = !1),
                (this.isMobile_bl = FWDVSUtils.isMobile),
                (this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent),
                (this.init = function () {
                    this.setOverflow("visible"),
                        (this.hasTransform3d_bl = !1),
                        (this.hasTransform2d_bl = !1),
                        (this.getStyle().border = ""),
                        (this.getStyle().backgroundColor = ""),
                        this.setupDos(),
                        this.setNormalState(!1),
                        this.enable(),
                        this.addEvents(),
                        this.dumy_do.setVisible(!1);
                }),
                (this.setupDos = function () {
                    (this.text_do = 100 == this.id ? new FWDVSDisplayObject("input", "relative") : new FWDVSDisplayObject("div", "relative")),
                        this.text_do.setOverflow("visible"),
                        (this.text_do.hasTransform3d_bl = !1),
                        (this.text_do.hasTransform2d_bl = !1),
                        this.text_do.setDisplay("inline-block"),
                        (this.text_do.getStyle().fontSmoothing = "antialiased"),
                        (this.text_do.getStyle().webkitFontSmoothing = "antialiased"),
                        (this.text_do.getStyle().textRendering = "optimizeLegibility"),
                        (this.text_do.getStyle().whiteSpace = "nowrap"),
                        this.text_do.setBackfaceVisibility(),
                        (this.text_do.getStyle().padding = ""),
                        (this.text_do.getStyle().margin = ""),
                        (this.text_do.hasTransform3d_bl = !1),
                        (this.text_do.hasTransform2d_bl = !1),
                        (this.dumy_do = new FWDVSDisplayObject("div")),
                        (this.dumy_do.getStyle().width = "100%"),
                        (this.dumy_do.getStyle().height = "100%"),
                        FWDVSUtils.isIE && (this.dumy_do.setBkColor("#00FF00"), this.dumy_do.setAlpha(0)),
                        this.addChild(this.text_do),
                        this.addChild(this.dumy_do),
                        this.setSize();
                }),
                (this.addEvents = function () {
                    100 == this.id
                        ? r.text_do.screen.addEventListener
                            ? (r.text_do.screen.addEventListener("focus", r.inputFocusInHandler), r.text_do.screen.addEventListener("blur", r.inputFocusOutHandler), r.text_do.screen.addEventListener("keyup", r.keyUpHandler))
                            : r.text_do.screen.attachEvent &&
                              (r.text_do.screen.attachEvent("onfocus", r.inputFocusInHandler), r.text_do.screen.attachEvent("onblur", r.inputFocusOutHandler), r.text_do.screen.attachEvent("onkeyup", r.keyUpHandler))
                        : r.isMobile_bl
                        ? this.hasPointerEvent_bl
                            ? (this.screen.addEventListener("pointerup", this.onMouseUp), this.screen.addEventListener("pointerover", this.onMouseOver), this.screen.addEventListener("pointerout", this.onMouseOut))
                            : this.screen.addEventListener("click", this.onMouseUp)
                        : this.screen.addEventListener && (this.screen.addEventListener("mouseover", this.onMouseOver), this.screen.addEventListener("mouseout", this.onMouseOut), this.screen.addEventListener("mouseup", this.onMouseUp));
                }),
                (this.onMouseOver = function (o) {
                    if (!o.pointerType || "mouse" == o.pointerType) {
                        if (r.isDisabled_bl || r.isSelectedFinal_bl) return;
                        r.dispatchEvent(t.MOUSE_OVER, { e: o }), s.resetButtons(), r.setSelectedState(!0);
                    }
                }),
                (this.onMouseOut = function (o) {
                    if ((!o.pointerType || "mouse" == o.pointerType) && !FWDAnimation.isTweening(s.buttonsHolder_do)) {
                        if (r.isDisabled_bl || r.isSelectedFinal_bl) return;
                        r.dispatchEvent(t.MOUSE_OUT, { e: o }), r.setNormalState(!0);
                    }
                }),
                (this.onMouseUp = function (s) {
                    2 == s.button || r.dispatchEvent(t.MOUSE_UP, { id: r.id });
                }),
                (this.inputFocusInHandler = function () {
                    r.hasInputFocus_bl || ((r.hasInputFocus_bl = !0), r.text_do.screen.value == r.text_str && (r.text_do.screen.value = ""));
                }),
                (this.inputFocusOutHandler = function (t) {
                    if (r.hasInputFocus_bl) {
                        var e = FWDVSUtils.getViewportMouseCoordinates(t);
                        if (!FWDVSUtils.hitTest(r.text_do.screen, e.screenX, e.screenY)) return (r.hasInputFocus_bl = !1), void ("" == r.text_do.screen.value && (r.text_do.screen.value = r.text_str));
                    }
                }),
                (this.keyUpHandler = function (t) {
                    t.stopPropagation && t.stopPropagation();
                    var e;
                    r.prevInputValue_str != r.text_do.screen.value &&
                        ((e = r.text_do.screen.value.toLowerCase()),
                        e != r.text_str &&
                            ((r.searchValue = e),
                            clearTimeout(r.updateSearch_to),
                            (r.updateSearch_to = setTimeout(function () {
                                r.dispatchEvent(FWDVSMenu.SEARCH, { param: r.searchValue });
                            }, 200)))),
                        (r.prevInputValue_str = r.text_do.screen.value);
                }),
                (this.setNormalState = function (t) {
                    this.isSelected_bl = !0;
                    var s = "PGMenuButtonTextNormal";
                    a && (s = e),
                        FWDAnimation.killTweensOf(this.screen),
                        FWDAnimation.killTweensOf(this.text_do.screen),
                        100 == this.id
                            ? (this.text_do.screen.className = "PGMenuButtonTextNormal")
                            : t
                            ? (FWDAnimation.to(this.screen, 0.8, { className: "PGMenuButtonBackgroundNormal" }), FWDAnimation.to(this.text_do.screen, 0.8, { className: s }))
                            : ((this.screen.className = "PGMenuButtonBackgroundNormal"), (this.text_do.screen.className = s));
                }),
                (this.setSelectedState = function (e) {
                    if (this.isSelected_bl) {
                        this.isSelected_bl = !1;
                        var t = "PGMenuButtonTextSelected";
                        a && (t = a),
                            FWDAnimation.killTweensOf(this.screen),
                            FWDAnimation.killTweensOf(this.text_do.screen),
                            e
                                ? (FWDAnimation.to(this.screen, 0.8, { className: "PGMenuButtonBackgroundSelected" }), FWDAnimation.to(this.text_do.screen, 0.8, { className: t }))
                                : ((this.screen.className = "PGMenuButtonBackgroundSelected"), (this.text_do.screen.className = t));
                    }
                }),
                (this.setSelected = function () {
                    this.isSelectedFinal_bl || ((this.isSelectedFinal_bl = !0), this.setSelectedState(!0));
                }),
                (this.setUnselected = function () {
                    this.isSelectedFinal_bl && ((this.isSelectedFinal_bl = !1), this.setNormalState(!0));
                }),
                (this.disable = function () {
                    100 == this.id || ((this.isDisabled_bl = !0), this.setButtonMode(!0), this.dumy_do.setButtonMode(!0), this.setSelectedState(!0));
                }),
                (this.enable = function () {
                    100 == this.id || ((this.isDisabled_bl = !1), this.setButtonMode(!0), this.dumy_do.setButtonMode(!0), this.setNormalState(!0));
                }),
                (this.setLabel = function (e) {
                    (r.text_str = e), 100 == this.id ? (this.text_do.screen.value = r.text_str) : this.text_do.setInnerHTML(r.text_str);
                }),
                (this.setSize = function () {
                    setTimeout(function () {
                        (r.w = r.getWidth()), (r.h = r.getHeight());
                    }, 69);
                }),
                this.init();
        };
        (t.setPrototype = function () {
            (t.prototype = new FWDVSDisplayObject("div")), (t.prototype.hasTransform3d_bl = !1), (t.prototype.hasTransform2d_bl = !1);
        }),
            (FWDVSMenu.SEARCH = "search"),
            (t.MOUSE_OVER = "onMouseOver"),
            (t.MOUSE_OUT = "onMouseOut"),
            (t.MOUSE_UP = "onMouseDown"),
            (t.prototype = null),
            (e.FWDVSMenuButton = t);
    })(window),
    (function (e) {
        var t = function (e, s, o, n, a, r, l, d) {
            var h = this,
                c = t.prototype;
            h.main_do,
                (h.preloaderPostion = s),
                (h.backgroundColor = n),
                (h.fillColor = a),
                (h.radius = o),
                (h.strokeSize = r),
                (h.allScreen = d),
                (this.offsetPreloader = 30),
                (this.animDuration = l || 300),
                (this.strtAngle = 270),
                (this.countAnimation = 0),
                (this.isShowed_bl = !0),
                (this.slideshowAngle = { n: 0 }),
                (this.init = function () {
                    (h.getStyle().top = 0),
                        (h.className = "main"),
                        (h.main_do = new FWDVSDisplayObject("div")),
                        h.main_do.setOverflow("visible"),
                        h.main_do.setWidth(2 * h.radius + h.strokeSize),
                        h.main_do.setHeight(2 * h.radius + h.strokeSize),
                        h.setOverflow("visible"),
                        h.setWidth(2 * h.radius + h.strokeSize),
                        h.setHeight(2 * h.radius + h.strokeSize),
                        (this.bkCanvas = new FWDVSDisplayObject("canvas")),
                        (this.bkCanvasContext = this.bkCanvas.screen.getContext("2d")),
                        (this.fillCircleCanvas = new FWDVSDisplayObject("canvas")),
                        (this.fillCircleCanvasContext = this.fillCircleCanvas.screen.getContext("2d")),
                        h.main_do.addChild(this.bkCanvas),
                        h.main_do.addChild(this.fillCircleCanvas),
                        h.drawBackground(),
                        h.drawFill(),
                        h.hide(),
                        (h.screen.style.transformOrigin = "50% 50%");
                }),
                (this.positionAndResize = function () {
                    if ("bottomleft" == h.preloaderPostion) h.setX(e.offsetPreloader), h.setY(e.stageHeight - h.h - e.offsetPreloader);
                    else if ("bottomright" == h.preloaderPostion) {
                        h.setX(e.stageWidth - h.w - h.offsetPreloader);
                        var t = e.stageHeight - h.h - h.offsetPreloader;
                        h.allScreen && (t = e.viewportSize.h - h.h - h.offsetPreloader), h.setY(t);
                    } else if ("topright" == h.preloaderPostion) h.setX(e.stageWidth - h.w - e.offsetPreloader), h.setY(e.offsetPreloader);
                    else if ("topleft" == h.preloaderPostion) h.setX(h.offsetPreloader), h.setY(h.offsetPreloader);
                    else if ("center" == h.preloaderPostion) {
                        h.setX(Math.round(e.stageWidth - h.w) / 2);
                        var t = 50;
                        h.allScreen && (t = Math.round((e.viewportSize.h - h.h) / 2)), h.setY(t);
                    }
                }),
                (this.drawBackground = function () {
                    (this.bkCanvas.screen.width = 2 * this.radius + 2 * h.strokeSize),
                        (this.bkCanvas.screen.height = 2 * this.radius + 2 * h.strokeSize),
                        (this.bkCanvasContext.lineWidth = this.thicknessSize),
                        this.bkCanvasContext.translate(h.strokeSize / 2, h.strokeSize / 2),
                        (this.bkCanvasContext.shadowColor = "#333333"),
                        (this.bkCanvasContext.shadowBlur = 1),
                        (this.bkCanvasContext.lineWidth = h.strokeSize),
                        (this.bkCanvasContext.strokeStyle = this.backgroundColor),
                        this.bkCanvasContext.beginPath(),
                        this.bkCanvasContext.arc(this.radius, this.radius, this.radius, 0 * (Math.PI / 180), 360 * (Math.PI / 180), !1),
                        this.bkCanvasContext.stroke(),
                        this.bkCanvasContext.closePath();
                }),
                (this.drawFill = function () {
                    (h.fillCircleCanvas.screen.width = 2 * h.radius + 2 * h.strokeSize),
                        (h.fillCircleCanvas.screen.height = 2 * h.radius + 2 * h.strokeSize),
                        (h.fillCircleCanvasContext.lineWidth = h.thicknessSize),
                        h.fillCircleCanvasContext.translate(h.strokeSize / 2, h.strokeSize / 2),
                        (h.fillCircleCanvasContext.lineWidth = h.strokeSize),
                        (h.fillCircleCanvasContext.strokeStyle = h.fillColor),
                        h.fillCircleCanvasContext.beginPath(),
                        h.fillCircleCanvasContext.arc(h.radius, h.radius, h.radius, (Math.PI / 180) * h.strtAngle, (Math.PI / 180) * (h.strtAngle + h.slideshowAngle.n), !1),
                        h.fillCircleCanvasContext.stroke(),
                        h.fillCircleCanvasContext.closePath();
                }),
                (this.startSlideshow = function () {
                    null == h || (FWDAnimation.killTweensOf(h.slideshowAngle), FWDAnimation.to(h.slideshowAngle, h.animDuration, { n: 360, onUpdate: h.drawFill, onComplete: h.stopSlideshow }));
                }),
                (this.stopSlideshow = function () {
                    FWDAnimation.killTweensOf(h.slideshowAngle), FWDAnimation.to(h.slideshowAngle, 0.8, { n: 0, onupdate: h.drawFill, onUpdate: h.drawFill, ease: Expo.easiInOut });
                }),
                (this.startPreloader = function () {
                    (h.slideshowAngle = { n: 0 }),
                        FWDAnimation.killTweensOf(h.slideshowAngle),
                        FWDAnimation.to(h.slideshowAngle, h.animDuration, { n: 360, onUpdate: h.drawFill, repeat: 100, yoyo: !0, ease: Expo.easInOut }),
                        FWDAnimation.to(h.main_do.screen, h.animDuration, { rotation: 360, repeat: 100 });
                }),
                (this.stopPreloader = function () {
                    FWDAnimation.killTweensOf(h.slideshowAngle), FWDAnimation.killTweensOf(h.main_do.screen);
                }),
                (this.show = function () {
                    h.isShowed_bl || (h.setVisible(!0), FWDAnimation.killTweensOf(h), FWDAnimation.to(h, 1, { alpha: 1, delay: 0.2 }), (h.isShowed_bl = !0));
                }),
                (this.hide = function (e) {
                    h.isShowed_bl && (FWDAnimation.killTweensOf(this), e ? FWDAnimation.to(this, 1, { alpha: 0, onComplete: h.onHideComplete }) : (h.setVisible(!1), h.setAlpha(0)), (h.isShowed_bl = !1));
                }),
                (this.onHideComplete = function () {
                    h.setVisible(!1), h.stopPreloader(), h.dispatchEvent(t.HIDE_COMPLETE);
                }),
                this.init();
        };
        (t.setPrototype = function () {
            t.prototype = new FWDVSDisplayObject("div");
        }),
            (t.HIDE_COMPLETE = "hideComplete"),
            (t.prototype = null),
            (e.FWDVSPreloader = t);
    })(window),
    (function (e) {
        var t = function (e, s, o, n) {
            var a = this,
                r = t.prototype;
            (this.nImg = e),
                (this.sPath_str = s),
                (this.dPath_str = o),
                this.buttonsHolder_do,
                this.n_sdo,
                this.s_sdo,
                this.d_sdo,
                this.toolTipLabel_str,
                (this.totalWidth = this.nImg.width),
                (this.totalHeight = this.nImg.height),
                (this.isShowed_bl = !0),
                (this.isSetToDisabledState_bl = !1),
                (this.isDisabled_bl = !1),
                (this.isDisabledForGood_bl = !1),
                (this.isSelectedFinal_bl = !1),
                (this.isActive_bl = !1),
                (this.isMobile_bl = FWDVSUtils.isMobile),
                (this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent),
                (this.allowToCreateSecondButton_bl = !a.isMobile_bl || a.hasPointerEvent_bl || n),
                (a.init = function () {
                    a.setupMainContainers();
                }),
                (a.setupMainContainers = function () {
                    if (
                        (a.setBackfaceVisibility(),
                        (a.hasTransform3d_bl = !1),
                        (a.hasTransform2d_bl = !1),
                        (a.buttonsHolder_do = new FWDVSDisplayObject("div")),
                        a.buttonsHolder_do.setOverflow("visible"),
                        a.buttonsHolder_do.setBackfaceVisibility(),
                        (a.buttonsHolder_do.hasTransform3d_bl = !1),
                        (a.buttonsHolder_do.hasTransform2d_bl = !1),
                        (a.n_sdo = new FWDVSDisplayObject("img")),
                        a.n_sdo.setScreen(a.nImg),
                        a.n_sdo.setBackfaceVisibility(),
                        (a.n_sdo.hasTransform3d_bl = !1),
                        (a.n_sdo.hasTransform2d_bl = !1),
                        a.buttonsHolder_do.addChild(a.n_sdo),
                        a.allowToCreateSecondButton_bl)
                    ) {
                        var e = new Image();
                        if (
                            ((e.src = a.sPath_str),
                            (a.s_sdo = new FWDVSDisplayObject("img")),
                            a.s_sdo.setScreen(e),
                            a.s_sdo.setWidth(a.totalWidth),
                            a.s_sdo.setHeight(a.totalHeight),
                            a.s_sdo.setAlpha(0),
                            a.s_sdo.setBackfaceVisibility(),
                            (a.s_sdo.hasTransform3d_bl = !1),
                            (a.s_sdo.hasTransform2d_bl = !1),
                            a.buttonsHolder_do.addChild(a.s_sdo),
                            a.dPath_str)
                        ) {
                            var t = new Image();
                            (t.src = a.dPath_str),
                                (a.d_sdo = new FWDVSDisplayObject("img")),
                                a.d_sdo.setScreen(t),
                                a.d_sdo.setWidth(a.totalWidth),
                                a.d_sdo.setHeight(a.totalHeight),
                                a.d_sdo.setX(-100),
                                a.d_sdo.setBackfaceVisibility(),
                                (a.d_sdo.hasTransform3d_bl = !1),
                                (a.d_sdo.hasTransform2d_bl = !1),
                                a.buttonsHolder_do.addChild(a.d_sdo);
                        }
                    }
                    a.setWidth(a.totalWidth),
                        a.setHeight(a.totalHeight),
                        a.setButtonMode(!0),
                        (a.screen.style.yellowOverlayPointerEvents = "none"),
                        a.addChild(a.buttonsHolder_do),
                        a.isMobile_bl
                            ? a.hasPointerEvent_bl
                                ? (a.screen.addEventListener("pointerup", a.onMouseUp), a.screen.addEventListener("pointerover", a.onMouseOver), a.screen.addEventListener("pointerout", a.onMouseOut))
                                : a.screen.addEventListener("touchend", a.onMouseUp)
                            : a.screen.addEventListener
                            ? (a.screen.addEventListener("mouseover", a.onMouseOver), a.screen.addEventListener("mouseout", a.onMouseOut), a.screen.addEventListener("mouseup", a.onMouseUp))
                            : a.screen.attachEvent && (a.screen.attachEvent("onmouseover", a.onMouseOver), a.screen.attachEvent("onmouseout", a.onMouseOut), a.screen.attachEvent("onmouseup", a.onMouseUp));
                }),
                (a.onMouseOver = function (s) {
                    if ((a.dispatchEvent(t.SHOW_TOOLTIP, { e: s }), !a.isDisabledForGood_bl) && (!s.pointerType || s.pointerType == s.MSPOINTER_TYPE_MOUSE || "mouse" == s.pointerType)) {
                        if (a.isDisabled_bl || a.isSelectedFinal_bl) return;
                        a.dispatchEvent(t.MOUSE_OVER, { e: s }), a.setSelectedState();
                    }
                }),
                (a.onMouseOut = function (s) {
                    if (!a.isDisabledForGood_bl && (!s.pointerType || s.pointerType == s.MSPOINTER_TYPE_MOUSE || "mouse" == s.pointerType)) {
                        if (a.isDisabled_bl || a.isSelectedFinal_bl) return;
                        a.dispatchEvent(t.MOUSE_OUT, { e: s }), a.setNormalState();
                    }
                }),
                (a.onMouseUp = function (s) {
                    a.isDisabledForGood_bl || (s.preventDefault && s.preventDefault(), a.isDisabled_bl || 2 == s.button || a.dispatchEvent(t.MOUSE_UP, { e: s }));
                }),
                (a.setSelected = function () {
                    a.isSelectedFinal_bl = !0;
                    a.s_sdo && (FWDAnimation.killTweensOf(a.s_sdo), FWDAnimation.to(a.s_sdo, 0.8, { alpha: 1, ease: Expo.easeOut }));
                }),
                (a.setUnselected = function () {
                    a.isSelectedFinal_bl = !1;
                    a.s_sdo && FWDAnimation.to(a.s_sdo, 0.8, { alpha: 0, delay: 0.1, ease: Expo.easeOut });
                }),
                (this.setNormalState = function () {
                    a.s_sdo && (FWDAnimation.killTweensOf(a.s_sdo), FWDAnimation.to(a.s_sdo, 0.5, { alpha: 0, ease: Expo.easeOut }));
                }),
                (this.setSelectedState = function () {
                    a.s_sdo && (FWDAnimation.killTweensOf(a.s_sdo), FWDAnimation.to(a.s_sdo, 0.5, { alpha: 1, delay: 0.1, ease: Expo.easeOut }));
                }),
                (this.setDisabledState = function () {
                    a.isSetToDisabledState_bl || ((a.isSetToDisabledState_bl = !0), a.d_sdo && a.d_sdo.setX(0));
                }),
                (this.setEnabledState = function () {
                    a.isSetToDisabledState_bl && ((a.isSetToDisabledState_bl = !1), a.d_sdo && a.d_sdo.setX(-100));
                }),
                (this.disable = function (e) {
                    a.isDisabledForGood_bl || a.isDisabled_bl || ((a.isDisabled_bl = !0), a.setButtonMode(!1), FWDAnimation.to(a, 0.6, { alpha: 0.4 }), !e && a.setNormalState());
                }),
                (this.enable = function () {
                    a.isDisabledForGood_bl || !a.isDisabled_bl || ((a.isDisabled_bl = !1), a.setButtonMode(!0), FWDAnimation.to(a, 0.6, { alpha: 1 }));
                }),
                (this.disableForGood = function () {
                    (a.isDisabledForGood_bl = !0), a.setButtonMode(!1);
                }),
                (this.showDisabledState = function () {
                    0 != a.d_sdo.x && a.d_sdo.setX(0);
                }),
                (this.hideDisabledState = function () {
                    -100 != a.d_sdo.x && a.d_sdo.setX(-100);
                }),
                (this.show = function () {
                    a.isShowed_bl ||
                        ((a.isShowed_bl = !0),
                        FWDAnimation.killTweensOf(a),
                        FWDVSUtils.isIEAndLessThen9
                            ? FWDVSUtils.isIEAndLessThen9
                                ? a.setVisible(!0)
                                : (a.setAlpha(0), FWDAnimation.to(a, 0.4, { alpha: 1, delay: 0.4 }), a.setVisible(!0))
                            : FWDVSUtils.isIEWebKit
                            ? (FWDAnimation.killTweensOf(a.n_sdo),
                              a.n_sdo.setScale2(0),
                              FWDAnimation.to(a.n_sdo, 0.8, {
                                  scale: 1,
                                  delay: 0.4,
                                  onStart: function () {
                                      a.setVisible(!0);
                                  },
                                  ease: Elastic.easeOut,
                              }))
                            : (a.setScale2(0),
                              FWDAnimation.to(a, 0.8, {
                                  scale: 1,
                                  delay: 0.4,
                                  onStart: function () {
                                      a.setVisible(!0);
                                  },
                                  ease: Elastic.easeOut,
                              })));
                }),
                (this.hide = function () {
                    a.isShowed_bl && ((a.isShowed_bl = !1), FWDAnimation.killTweensOf(a), FWDAnimation.killTweensOf(a.n_sdo), a.setVisible(!1));
                }),
                a.init();
        };
        (t.setPrototype = function (e) {
            (t.prototype = null), (t.prototype = e ? new FWDVSTransformDisplayObject("div") : new FWDVSDisplayObject("div"));
        }),
            (t.CLICK = "onClick"),
            (t.MOUSE_OVER = "onMouseOver"),
            (t.SHOW_TOOLTIP = "showTooltip"),
            (t.MOUSE_OUT = "onMouseOut"),
            (t.MOUSE_UP = "onMouseDown"),
            (t.prototype = null),
            (e.FWDVSSimpleButton = t);
    })(window),
    (function (e) {
        var t = function (e, s, o, n) {
            var a = this;
            (this.nImg_img = null),
                (this.sImg_img = null),
                this.n_do,
                this.s_do,
                (this.nImgPath_str = e),
                (this.sImgPath_str = s),
                (this.buttonWidth = o),
                (this.buttonHeight = n),
                (this.isMobile_bl = FWDVSUtils.isMobile),
                (this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent),
                (this.isDisabled_bl = !1),
                (this.init = function () {
                    a.setupMainContainers(), a.setWidth(a.buttonWidth), a.setHeight(a.buttonHeight), a.setButtonMode(!0);
                }),
                (this.setupMainContainers = function () {
                    (a.n_do = new FWDVSDisplayObject("img")),
                        (a.nImg_img = new Image()),
                        (a.nImg_img.src = a.nImgPath_str),
                        (a.nImg_img.width = a.buttonWidth),
                        (a.nImg_img.height = a.buttonHeight),
                        a.n_do.setScreen(a.nImg_img),
                        (a.s_do = new FWDVSDisplayObject("img")),
                        (a.sImg_img = new Image()),
                        (a.sImg_img.src = a.sImgPath_str),
                        (a.sImg_img.width = a.buttonWidth),
                        (a.sImg_img.height = a.buttonHeight),
                        a.s_do.setScreen(a.sImg_img),
                        a.addChild(a.s_do),
                        a.addChild(a.n_do),
                        (a.screen.onmouseover = a.onMouseOver),
                        (a.screen.onmouseout = a.onMouseOut),
                        (a.screen.onclick = a.onClick);
                }),
                (this.onMouseOver = function () {
                    a.isMobile_bl || FWDAnimation.to(a.n_do, 0.9, { alpha: 0, ease: Expo.easeOut });
                }),
                (this.onMouseOut = function () {
                    FWDAnimation.to(a.n_do, 0.9, { alpha: 1, ease: Expo.easeOut });
                }),
                (this.onClick = function () {
                    a.dispatchEvent(t.CLICK);
                }),
                a.init();
        };
        (t.setPrototype = function () {
            (t.prototype = null), (t.prototype = new FWDVSTransformDisplayObject("div"));
        }),
            (t.CLICK = "onClick"),
            (t.prototype = null),
            (e.FWDVSSimpleSizeButton = t);
    })(window),
    (function (e) {
        var t = function (s) {
            var o = this,
                n = t.prototype;
            (this.parent = s.parent),
                this.main_do,
                this.bk_do,
                this.border_do,
                this.imageHolder_do,
                this.image_do,
                this.contentHolder_do,
                this.title_do,
                this.overlay_do,
                this.fakeBorder_do,
                this.button1_do,
                this.button2_do,
                this.icon_do,
                this.mySplitText,
                this.textHolder_do,
                (this.cats_ar = s.cats_ar),
                (this.slideshowData_ar = s.slideshow_ar),
                (this.useThumbnailSlideshow_bl = s.useThumbnailSlideshow_bl),
                (this.showThumbnailOnlyWhenImageIsLoaded_bl = s.showThumbnailOnlyWhenImageIsLoaded_bl),
                (this.searchText = s.searchText),
                (this.id = s.id),
                (this.previewText = s.previewText),
                (this.wSize = s.wSize),
                (this.hSize = s.hSize),
                (this.title_str = s.title_str),
                (this.client_str = s.client_str),
                (this.likes_str = s.likes_str),
                (this.presetType_str = s.presetType_str),
                (this.borderNormalColor_str = s.borderNormalColor_str),
                (this.borderSelectedColor_str = s.borderSelectedColor_str),
                (this.htmlContent1_str = s.htmlContent1_str),
                (this.htmlContent2_str = s.htmlContent2_str),
                (this.htmlExtraContent_str = s.htmlExtraContent_str),
                (this.thumbnailPath_str = s.thumbnailPath_str),
                (this.overlayColor_str = s.thumbnailOverlayColor_str),
                (this.extraButtonUrl_str = s.extraButtonUrl_str),
                (this.extraButtonUrlTarget_str = s.extraButtonUrlTarget_str),
                (this.iconPathN_str = s.thumbIconPathN_str),
                (this.iconPathS_str = s.thumbIconPathS_str),
                (this.linkIconPathN_str = s.linkIconPathN_str),
                (this.linkIconPathS_str = s.linkIconPathS_str),
                (this.hideAndShowTransitionType_str = s.hideAndShowTransitionType_str),
                this.prevAndShowTransitionType_str,
                (this.textVerticalAlign_str = s.textVerticalAlign_str),
                (this.imageTransitionDirection_str = s.imageTransitionDirection_str),
                (this.thumbanilBoxShadow_str = s.thumbanilBoxShadow_str),
                (this.animStartDir_str = "top"),
                (this.textAnimType_str = s.textAnimType_str),
                (this.alt_str = s.alt_str),
                (this.linkUrl_str = s.linkUrl_str),
                (this.linkTarget_str = s.linkTarget_str),
                (this.catId = s.catId),
                (this.id = s.id),
                (this.textHeight = 0),
                (this.contentOffest = s.contentOffsetY),
                (this.buttonsOffest = s.buttonsOffest),
                (this.borderSize = s.borderSize),
                (this.lastBorderSize = this.borderSize),
                (this.borderRadius = s.borderRadius),
                (this.overlayOpacity = s.thumbnailOverlayOpacity),
                (this.iconW = s.thumbnailIconWidth),
                (this.iconH = s.thumbnailIconHeight),
                (this.spaceBetweenThumbanilIcons = s.spaceBetweenThumbanilIcons),
                (this.spaceBetweenTextAndIcons = s.spaceBetweenTextAndIcons),
                (this.imageOriginalW = void 0),
                this.imageOriginalH,
                (this.tempFinalX = -1),
                (this.tempFinalY = -1),
                (this.finalX = void 0),
                (this.finalY = 0),
                (this.finalW = 0),
                (this.finalH = 0),
                (this.prevFinalX = 0),
                (this.prevFinalY = 0),
                (this.prevFinalW = 0),
                (this.prevFinalH = 0),
                (this.angleY = -180),
                (this.text1H = 0),
                (this.text2H = 0),
                (this.finalHOffset = 0),
                (this.hOffset = 0),
                this.showOrHideWithDelayId_to,
                this.isImageAnimCompleteId_to,
                this.resizeTextContent1Id_to,
                this.contentHideCompleteId_to,
                this.contentShowCompleteId_to,
                (this.isVerticalType_bl = s.isVerticalType_bl),
                (this.isCheckHitAdded_bl = !1),
                (this.showIcon_bl = !0),
                (this.hasButtons_bl = s.useIconButtons_bl),
                (this.doNotOverwriteResizeContent_bl = !1),
                (this.disableThumbnails_bl = s.disableThumbnails_bl),
                (this.isImageAnimCompleteId_bl = !1),
                (this.isLightboxDisabled_bl = s.isDisabled_bl),
                (this.imageShowComplete_bl = !1),
                (this.isContentHidden_bl = !0),
                (this.hasImage_bl = !1),
                (this.used_bl = !1),
                (this.firstTimeLoad_bl = !0),
                (this.isImageShowed_bl = !1),
                (this.isFirstTimeShowed_bl = !0),
                (this.isContentShowed_bl = !1),
                (this.isHidden_bl = !1),
                (this.hasExtraText_bl = !!this.htmlExtraContent_str),
                (this.isMobile_bl = FWDVSUtils.isMobile),
                (this.hasPointerEvent_bl = FWDVSUtils.hasPointerEvent),
                (this.init = function () {
                    this.setupMainInstances();
                }),
                (this.setupMainInstances = function () {
                    (this.screen.className = "thumb"),
                        this.setOverflow("visible"),
                        (this.main_do = new FWDVSTransformDisplayObject("div")),
                        (this.main_do.screen.className = "main"),
                        this.main_do.setOverflow("visible"),
                        this.addChild(this.main_do),
                        (this.bk_do = new FWDVSDisplayObject("div")),
                        (this.bk_do.screen.className = "background"),
                        (this.border_do = new FWDVSDisplayObject("div")),
                        (this.border_do.screen.className = "border"),
                        this.border_do.setOverflow("visible"),
                        (this.imageHolder_do = new FWDVSDisplayObject("div")),
                        (this.imageHolder_do.screen.className = "image-holder"),
                        (this.image_do = new FWDVSDisplayObject("img")),
                        this.isLightboxDisabled_bl ||
                            this.disableThumbnails_bl ||
                            this.hasButtons_bl ||
                            "preview" == o.presetType_str ||
                            "blog" == o.presetType_str ||
                            "team" == o.presetType_str ||
                            (this.isVerticalType_bl && this.border_do.setButtonMode(!0), this.isVerticalType_bl && "curtain" == this.presetType_str && this.imageHolder_do.setButtonMode(!0)),
                        this.thumbanilBoxShadow_str && this.setBorderBoxShadow(this.thumbanilBoxShadow_str),
                        this.setupContent(),
                        this.main_do.addChild(this.bk_do),
                        this.main_do.addChild(this.border_do),
                        0 != this.borderSize && this.setBorderSize(this.borderSize),
                        0 != this.borderRadius && this.setBorderRadius(this.borderRadius),
                        this.setBorderColor(this.borderNormalColor_str, this.borderSelectedColor_str),
                        (this.getStyle().zIndex = o.id);
                }),
                (this.addImage = function (e) {
                    (o.imageOriginalW = e.naturalWidth), (o.imageOriginalH = e.naturalHeight), (o.hasImage_bl = !0), o.image_do.setScreen(e), e.setAttribute("alt", o.alt_str), this.addEvents(), this.resizeAndPosition(!0);
                }),
                (this.resizeAndPosition = function () {
                    (this.borderSize = 20), this.border_do.setX(this.borderSize), this.border_do.setY(this.borderSize);
                    var e = this.finalW - 2 * this.borderSize,
                        t = this.finalH - 2 * this.borderSize;
                    if (
                        (this.hasExtraText_bl &&
                            (0 == this.text3_do.alpha &&
                                (this.text3_do.setY(-this.text3_do.getHeight() - 5), FWDAnimation.to(this.text3_do, 0.4, { alpha: 1, delay: 0.5 }), FWDAnimation.to(this.text3_do, 0.8, { y: 0, delay: 0.5, ease: Expo.easeInOut })),
                            this.textHolder_do.setX(this.borderSize),
                            this.textHolder_do.setWidth(this.finalW - 2 * this.borderSize),
                            this.textHolder_do.setY(this.finalH - this.borderSize)),
                        !o.imageOriginalW && !o.showThumbnailOnlyWhenImageIsLoaded_bl)
                    )
                        return (
                            this.setX(this.finalX),
                            this.setY(this.finalY),
                            this.setWidth(this.finalW),
                            this.setHeight(this.finalH + this.textHeight),
                            this.main_do.setWidth(this.finalW),
                            this.main_do.setHeight(this.finalH),
                            this.bk_do.setX(this.borderSize),
                            this.bk_do.setY(this.borderSize),
                            this.bk_do.setWidth(e),
                            this.bk_do.setHeight(t),
                            this.border_do.setWidth(e),
                            void this.border_do.setHeight(t)
                        );
                    if ((this.finalX != this.prevFinalX || this.finalY != this.prevFinalY || this.finalW != this.prevFinalW || this.finalH != this.prevFinalH) && null != this.finalX && null != o.imageOriginalW) {
                        (this.prevBorderSize = this.borderSize), (this.prevFinalX = this.finalX), (this.prevFinalY = this.finalY), (this.prevFinalW = this.finalW), (this.prevFinalH = this.finalH), FWDAnimation.killTweensOf(this);
                        var s,
                            n = e / o.imageOriginalW,
                            a = t / o.imageOriginalH;
                        s = n >= a ? n : a;
                        var r = Math.ceil(s * o.imageOriginalW),
                            l = Math.ceil(s * o.imageOriginalH),
                            d = Math.abs(Math.min(0, FWDVS.globalY)),
                            h = 0 < FWDVS.globalY ? FWDVS.viewportHeight - FWDVS.globalY : FWDVS.viewportHeight;
                        this.firstTimeLoad_bl || !o.isImageShowed_bl
                            ? (FWDAnimation.killTweensOf(this.image_do),
                              FWDAnimation.killTweensOf(this.imageHolder_do),
                              this.setX(this.finalX),
                              this.setY(this.finalY),
                              this.imageHolder_do.setX(e / 2 + this.borderSize),
                              this.imageHolder_do.setY(t / 2 + this.borderSize),
                              this.image_do.setWidth(r),
                              this.image_do.setHeight(l),
                              (this.image_do.getStyle().left = 0),
                              this.image_do.setX(-r / 2),
                              this.image_do.setY(-l / 2),
                              FWDAnimation.to(this.imageHolder_do, 0.8, { x: this.borderSize, y: this.borderSize, w: e, h: t, delay: 0.2, ease: Quint.easeInOut }),
                              FWDAnimation.to(this.image_do, 0.8, { x: parseInt((e - r) / 2), y: parseInt((t - l) / 2), delay: 0.2, ease: Quint.easeInOut }),
                              (this.isImageAnimCompleteId_to = setTimeout(function () {
                                  o.isImageAnimCompleteId_bl = !0;
                              }, 800)),
                              this.imageHolder_do.addChild(this.image_do),
                              "curtain" == this.presetType_str || "3d" == this.presetType_str ? this.main_do.addChild(this.imageHolder_do) : this.main_do.addChildAt(this.imageHolder_do, 1),
                              (this.isImageShowed_bl = !0),
                              (this.firstTimeLoad_bl = !1))
                            : ((this.w != this.finalW || this.h != this.finalH || this.finalHOffset != this.hOffset || this.lastBorderSize != this.borderSize) &&
                                  (FWDAnimation.killTweensOf(this.image_do),
                                  FWDAnimation.killTweensOf(this.imageHolder_do),
                                  this.imageHolder_do.setX(this.borderSize),
                                  this.imageHolder_do.setY(this.borderSize),
                                  this.imageHolder_do.setWidth(e),
                                  this.imageHolder_do.setHeight(t),
                                  this.image_do.setX(parseInt((e - r) / 2)),
                                  this.image_do.setY(parseInt((t - l) / 2))),
                              this.isHidden_bl || (!((o.finalY + o.finalH > d || o.y + o.finalH > d) && (o.finalY - d < h || o.y - d < h)) && this.isVerticalType_bl)
                                  ? (this.setX(this.finalX), this.setY(this.finalY))
                                  : FWDAnimation.to(this, 0.8, { x: this.finalX, y: this.finalY, ease: Expo.easeInOut }),
                              (this.isFirstTimeShowed_bl = !1),
                              "scaletextinverse" != o.presetType_str && clearTimeout(this.isImageAnimCompleteId_to),
                              (this.isImageAnimCompleteId_bl = !0)),
                            (this.w != this.finalW || this.h != this.finalH || this.finalHOffset != this.hOffset || this.lastBorderSize != this.borderSize) &&
                                (this.setWidth(this.finalW),
                                this.setHeight(this.finalH + this.textHeight),
                                this.main_do.setWidth(this.finalW),
                                this.main_do.setHeight(this.finalH),
                                this.bk_do.setX(this.borderSize),
                                this.bk_do.setY(this.borderSize),
                                this.bk_do.setWidth(e),
                                this.bk_do.setHeight(t),
                                this.border_do.setWidth(e),
                                this.border_do.setHeight(t),
                                this.main3dContainer_do && (this.main3dContainer_do.setWidth(this.finalW), this.main3dContainer_do.setHeight(this.finalH)),
                                this.image_do.setWidth(r),
                                this.image_do.setHeight(l),
                                this.stopToCheckThumbnailHit()),
                            ("media" == this.presetType_str || "media2" == this.presetType_str || "scaletextinverse" == this.presetType_str) && this.resizeContent(),
                            (this.hOffset = this.finalHOffset),
                            (this.lastBorderSize = this.borderSize),
                            (o.ssId = 0);
                    }
                }),
                (this.setupContent = function () {
                    if (
                        ((this.contentHolder_do = new FWDVSDisplayObject("div")),
                        (this.contentHolder_do.getStyle().width = "100%"),
                        (this.contentHolder_do.getStyle().height = "100%"),
                        this.contentHolder_do.setBkColor("transparent"),
                        this.contentHolder_do.setX(-1e3),
                        this.contentHolder_do.setOverflow("visible"),
                        (this.overlay_do = new FWDVSDisplayObject("div")),
                        (this.overlay_do.getStyle().width = "100%"),
                        (this.overlay_do.getStyle().height = "100%"),
                        (this.overlay_do.screen.className = "overlay"),
                        this.overlay_do.setAlpha(this.overlayOpacity),
                        this.contentHolder_do.addChild(this.overlay_do),
                        "preview" == o.presetType_str && (this.title_str = o.previewText),
                        (this.title_do = new FWDVSDisplayObject("div")),
                        (this.title_do.getStyle().position = "relative"),
                        (this.title_do.hasTransform2d_bl = !1),
                        (this.title_do.hasTransform3d_bl = !1),
                        this.title_do.setInnerHTML('<div class="in">' + this.title_str + "</div>"),
                        "default" == this.presetType_str)
                    ) {
                        if (
                            (this.contentHolder_do.setOverflow("visible"),
                            (this.arrow_do = new FWDVSDisplayObject("div")),
                            (this.arrow_do.screen.className = "default-arrow-main"),
                            this.arrow_do.setInnerHTML('<span class="default-arrow fwdfwdicon-right-arrow-thin"></span>'),
                            this.contentHolder_do.addChild(this.arrow_do),
                            this.cats_ar.length)
                        ) {
                            (this.cats_do = new FWDVSDisplayObject("div")), (this.cats_do.screen.className = "default-categories-main"), (this.cats_str = '<div class="categories"><span class="fwdicon fwdfwdicon-categories"></span>');
                            for (var e = 0; e < this.cats_ar.length; e++)
                                this.cats_str += e < this.cats_ar.length - 1 ? '<span class="category">' + this.cats_ar[e] + "</span><span class='separator'>/</span>" : '<span class="category">' + this.cats_ar[e];
                            (this.cats_str += "</div>"), this.cats_do.setInnerHTML(this.cats_str), 0 == this.cats_ar.length && this.cats_do.setVisible(!1), this.contentHolder_do.addChild(this.cats_do);
                        }
                        (this.title_do.screen.className = "title-default"),
                            this.contentHolder_do.addChild(this.title_do),
                            this.client_str &&
                                ((this.client_do = new FWDVSDisplayObject("div")), (this.client_do.screen.className = "default-client-main"), this.client_do.setInnerHTML(this.client_str), this.contentHolder_do.addChild(this.client_do)),
                            this.likes_str &&
                                ((this.likes_do = new FWDVSDisplayObject("div")), (this.likes_do.screen.className = "default-likes-main"), this.likes_do.setInnerHTML(this.likes_str), this.contentHolder_do.addChild(this.likes_do));
                    }
                    "team" == this.presetType_str && ((this.title_do.screen.className = "text-holder"), this.contentHolder_do.addChild(this.title_do)), this.setupExtraText();
                }),
                (this.btn1ClickHandler = function () {}),
                (this.btn2ClickHandler = function () {}),
                (this.resizeContent = function () {
                    clearTimeout(this.resizeTextContent1Id_to);
                }),
                (this.addEvents = function () {
                    this.screen.addEventListener &&
                        (this.isMobile_bl
                            ? this.hasPointerEvent_bl
                                ? this.main_do.screen.addEventListener("pointerdown", this.onMouseUp)
                                : this.main_do.screen.addEventListener("click", this.onMouseUp)
                            : (this.main_do.screen.addEventListener("mouseover", this.onMouseOver), this.main_do.screen.addEventListener("click", this.onMouseUp)));
                }),
                (o.onMouseOver = function (t) {
                    if (!(o.isContentShowed_bl || o.disableThumbnails_bl) && (("default" != o.presetType_str && "preview" != o.presetType_str) || o.isImageAnimCompleteId_bl)) {
                        t && o.getInOrOutAngle(t), (o.isHovered_bl = !0);
                        for (var e = 0; e < o.parent.thumbnails_ar.length; e++) (thumbnail = o.parent.thumbnails_ar[e]), thumbnail.hideContent();
                        o.showContent(), o.startToCheckThumbnailHit();
                    }
                }),
                (o.onMouseUp = function (t) {
                    return 2 == t.button || o.disableThumbnails_bl || o.isHidden_bl || "blog" == o.presetType_str ? void 0 : !o.isContentShowed_bl && o.isMobile_bl ? void o.onMouseOver() : void 0;
                }),
                (this.startToCheckThumbnailHit = function () {
                    this.isCheckHitAdded_bl ||
                        ((this.isCheckHitAdded_bl = !0),
                        o.isMobile_bl
                            ? setTimeout(function () {
                                  o.hitThhumbnailId_to = FWDVSUtils.isIOS ? e.addEventListener("touchstart", o.checkThumbnailHit) : e.addEventListener("click", o.checkThumbnailHit);
                              }, 50)
                            : e.addEventListener && e.addEventListener("mousemove", o.checkThumbnailHit));
                }),
                (this.stopToCheckThumbnailHit = function () {
                    o.isCheckHitAdded_bl &&
                        ((o.isCheckHitAdded_bl = !1),
                        o.isMobile_bl
                            ? FWDVSUtils.isIOS
                                ? (o.hitThhumbnailId_to = e.removeEventListener("touchstart", o.checkThumbnailHit))
                                : (o.hitThhumbnailId_to = e.removeEventListener("click", o.checkThumbnailHit))
                            : e.removeEventListener && e.removeEventListener("mousemove", o.checkThumbnailHit),
                        clearTimeout(o.hitThhumbnailId_to),
                        o.hideContent(!0),
                        (o.isHovered_bl = !1));
                }),
                (this.checkThumbnailHit = function (t) {
                    var e = FWDVSUtils.getViewportMouseCoordinates(t);
                    if (
                        (e.screenX < o.finalW && e.screenY < o.finalH,
                        !FWDVSUtils.hitTest(o.screen, e.screenX, e.screenY) ||
                            (o.parent.parent.searchMain_do && FWDVSUtils.hitTest(o.parent.parent.searchMain_do.screen, e.screenX, e.screenY)) ||
                            (o.parent.parent.menu_do && FWDVSUtils.hitTest(o.parent.parent.menu_do.selector_do.screen, e.screenX, e.screenY)) ||
                            (o.parent.parent.menu_do && FWDVSUtils.hitTest(o.parent.parent.menu_do.buttonsHolder_do.screen, e.screenX, e.screenY)))
                    )
                        return o.stopToCheckThumbnailHit(), void (o.parent.parent.menu_do && o.parent.parent.menu_do.setAlpha(1));
                }),
                (this.setupExtraText = function () {
                    this.hasExtraText_bl &&
                        ((this.textHolder_do = new FWDVSDisplayObject("div")),
                        this.textHolder_do.setX(this.borderSize),
                        (this.textHolder_do.getStyle().height = "100%"),
                        this.addChild(this.textHolder_do),
                        (this.text3_do = new FWDVSTransformDisplayObject("div")),
                        (this.text3_do.getStyle().width = "100%"),
                        (this.text3_do.screen.className = "extra-text-normal"),
                        this.text3_do.setInnerHTML(this.htmlExtraContent_str),
                        this.text3_do.setAlpha(0),
                        !this.hasButtons_bl && "preview" != o.presetType_str && "blog" != o.presetType_str && "team" != o.presetType_str && this.text3_do.setButtonMode(!0),
                        this.textHolder_do.addChild(this.text3_do));
                }),
                (this.showContent = function () {
                    if (!(this.isContentShowed_bl || this.isHidden_bl)) {
                        var e,
                            t,
                            s,
                            n,
                            s = 0,
                            n = 0,
                            a = 0.6;
                        "team" == this.presetType_str &&
                            ((e = 0.8),
                            (a = 0.7),
                            (t = Circ.easeOut),
                            this.border_do.addChild(this.contentHolder_do),
                            this.resizeContent(),
                            this.contentHolder_do.setX(0),
                            this.isContentHidden_bl && (this.overlay_do.setAlpha(0), this.title_do.setY((o.finalH - this.title_do.getHeight()) / 2 + 30), this.title_do.setAlpha(0)),
                            (this.isContentHidden_bl = !1),
                            FWDAnimation.killTweensOf(this.overlay_do),
                            FWDAnimation.to(this.overlay_do, 0.7, { alpha: 1 }),
                            (this.title_do.getStyle().pointerEvents = "auto"),
                            FWDAnimation.killTweensOf(this.title_do),
                            FWDAnimation.to(this.title_do, 0.6, { y: Math.round((o.finalH - this.title_do.getHeight()) / 2), alpha: 1, ease: Expo.easeInOut })),
                            this.borderNormalColor_str != this.borderSelectedColor_str && 0 != this.borderSize && FWDAnimation.to(this.border_do.screen, a, { css: { borderColor: this.borderSelectedColor_str }, ease: t }),
                            (this.isContentShowed_bl = !0),
                            clearTimeout(this.contentShowCompleteId_to),
                            clearTimeout(this.contentHideCompleteId_to),
                            (this.contentShowCompleteId_to = setTimeout(this.showContentComplete, 1e3 * e));
                    }
                }),
                (this.showContentComplete = function () {
                    clearTimeout(o.contentShowCompleteId_to), clearTimeout(o.contentHideCompleteId_to), (o.ssId = 1);
                }),
                (this.hideContent = function () {
                    if (this.isContentShowed_bl) {
                        var e,
                            t,
                            s = 0.6;
                        "team" == this.presetType_str &&
                            ((t = 0.8),
                            (s = 0.7),
                            (e = Circ.easeOut),
                            clearTimeout(this.showOrHideWithDelayId_to),
                            FWDAnimation.killTweensOf(this.overlay_do),
                            FWDAnimation.to(this.overlay_do, 0.7, { alpha: 0 }),
                            (this.title_do.getStyle().pointerEvents = "none"),
                            FWDAnimation.killTweensOf(this.text_do),
                            FWDAnimation.to(this.title_do, 0.6, { y: Math.round((o.finalH - this.title_do.getHeight()) / 2 + 30), alpha: 0, ease: Expo.easeInOut })),
                            this.borderNormalColor_str != this.borderSelectedColor_str && 0 != this.borderSize && FWDAnimation.to(this.border_do.screen, s, { css: { borderColor: this.borderNormalColor_str }, ease: e }),
                            (this.isContentShowed_bl = !1),
                            clearTimeout(this.contentShowCompleteId_to),
                            clearTimeout(this.contentHideCompleteId_to),
                            (o.contentHideCompleteId_to = setTimeout(o.hideContentComplete, 1e3 * t));
                    }
                }),
                (this.hideContentComplete = function () {
                    if ((clearTimeout(o.contentShowCompleteId_to), clearTimeout(o.contentHideCompleteId_to), "media" != o.presetType_str && "scaletextinverse" != o.presetType_str)) {
                        try {
                            o.border_do.removeChild(o.contentHolder_do);
                        } catch (t) {}
                        try {
                            o.removeChild(o.contentHolder_do);
                        } catch (t) {}
                        try {
                            o.removeChild(o.fakeBorder_do);
                        } catch (t) {}
                        o.contentHolder_do && o.contentHolder_do.setX(-1e3);
                    }
                    o.isContentHidden_bl = !0;
                }),
                (this.getInOrOutAngle = function (t) {
                    var e = FWDVSUtils.getViewportMouseCoordinates(t),
                        s = o.getGlobalX(),
                        n = o.getGlobalY(),
                        a = e.screenX,
                        r = e.screenY,
                        l = a - (s + o.finalW / 2),
                        d = r - (n + o.finalH / 2),
                        h = (180 * Math.atan2(d, l)) / Math.PI,
                        c = (180 * Math.atan2(o.finalH, o.finalW)) / Math.PI;
                    h < c && h > -c && (o.animStartDir_str = "right"),
                        h > c && h < 180 - c && (o.animStartDir_str = "bottom"),
                        (h < -180 + c || h > 180 - c) && (o.animStartDir_str = "left"),
                        h > -180 + c && h < -c && (o.animStartDir_str = "top");
                }),
                (this.hide = function () {
                    if (!this.isHidden_bl) {
                        clearTimeout(this.showHideId_to), clearTimeout(o.hideId_to), FWDAnimation.to(o.main_do);
                        var e = Math.abs(Math.min(0, FWDVS.globalY)),
                            t = 0 < FWDVS.globalY ? FWDVS.viewportHeight - FWDVS.globalY : FWDVS.viewportHeight;
                        this.showHideId_to = setTimeout(function () {
                            o.isHidden_bl = !0;
                            var s = o.finalY + o.finalH > e && o.finalY - e < t,
                                n = 0.05 + 0.1 * Math.random();
                            (o.hideId_to = setTimeout(function () {
                                o.parent.removeChild(o);
                            }, 800 + 1e3 * n)),
                                s
                                    ? (FWDAnimation.to(o.main_do, 0.8, { scale: 0, alpha: 0, delay: n, ease: Expo.easeInOut }), o.text3_do && FWDAnimation.to(o.text3_do, 0.8, { scale: 0, alpha: 0, delay: n, ease: Expo.easeInOut }))
                                    : (FWDAnimation.to(o.main_do, 0.01, { scale: 0, alpha: 0, delay: n, ease: Quart.easeOut }), o.text3_do && FWDAnimation.to(o.text3_do, 0.01, { scale: 0, alpha: 0, delay: n, ease: Expo.easeInOut }));
                        }, 50);
                    }
                }),
                (this.show = function () {
                    if (this.isHidden_bl) {
                        clearTimeout(o.hideId_to), clearTimeout(this.showHideId_to), FWDAnimation.to(o.main_do), o.parent.addChild(o);
                        var e = Math.abs(Math.min(0, FWDVS.globalY)),
                            t = 0 < FWDVS.globalY ? FWDVS.viewportHeight - FWDVS.globalY : FWDVS.viewportHeight;
                        clearTimeout(o.contentShowCompleteId_to),
                            (o.isContentHidden_bl = !0),
                            (this.showHideId_to = setTimeout(function () {
                                o.isHidden_bl = !1;
                                var s = o.finalY + o.finalH > e && o.finalY - e < t;
                                if (s) {
                                    var n = 0.05 + 0.1 * Math.random();
                                    FWDAnimation.to(o.main_do, 0.8, { scale: 1, alpha: 1, delay: n, ease: Expo.easeInOut }), o.text3_do && FWDAnimation.to(o.text3_do, 0.8, { scale: 1, alpha: 1, delay: n, ease: Expo.easeInOut });
                                } else FWDAnimation.to(o.main_do, 0.01, { scale: 1, alpha: 1, delay: 0.05 + 0.1 * Math.random(), ease: Quart.easeOut }), o.text3_do && FWDAnimation.to(o.text3_do, 0.01, { scale: 1, alpha: 1, delay: 0.05 + 0.1 * Math.random(), ease: Expo.easeInOut });
                            }, 50));
                    }
                }),
                (this.setOverlayColor = function (e) {
                    (this.overlayColor_str = e), this.overlay_do.setBkColor(this.overlayColor_str);
                }),
                (this.setOverlayOpacityValue = function (e) {
                    null == e || (this.overlayOpacity = e);
                }),
                (this.setOverlayOpacity = function () {
                    this.overlay_do.setAlpha(this.overlayOpacity);
                }),
                (this.setContentPosition = function (e, t, s) {
                    (this.textVerticalAlign_str = e), (this.contentOffest = t), s != null && (this.buttonsOffest = s);
                }),
                (this.setCurtainAnimationDirection = function (e) {
                    o.imageTransitionDirection_str = e;
                }),
                (this.setBorderSize = function (e) {
                    (this.borderSize = parseInt(e)),
                        0 == this.borderSize
                            ? ((this.border_do.getStyle().borderStyle = "none"), (this.border_do.getStyle().boxShadow = "none"))
                            : ((this.border_do.getStyle().borderStyle = "solid"), (this.border_do.getStyle().boxShadow = this.thumbanilBoxShadow_str)),
                        (this.border_do.getStyle().borderWidth = this.borderSize + "px");
                }),
                (this.setBorderRadius = function (e) {
                    (this.borderRadius = parseInt(e)),
                        (this.border_do.getStyle().borderRadius = this.borderRadius + "px"),
                        (this.getStyle().borderRadius = this.borderRadius + "px"),
                        "3d" == this.presetType_str && (this.main_do.getStyle().borderRadius = this.borderRadius + "px");
                }),
                (this.setBorderColor = function (e, t) {
                    (this.borderNormalColor_str = e), (this.borderSelectedColor_str = t), (this.border_do.getStyle().borderColor = this.borderNormalColor_str);
                }),
                (this.setBorderBoxShadow = function (e) {
                    (this.thumbanilBoxShadow_str = e), "3d" == this.presetType_str ? (this.main_do.getStyle().boxShadow = this.thumbanilBoxShadow_str) : (this.getStyle().boxShadow = this.thumbanilBoxShadow_str);
                }),
                this.init();
        };
        (t.setPrototype = function () {
            t.prototype = FWDVSUtils.hasTransform2d ? new FWDVSTransformDisplayObject("div") : new FWDVSDisplayObject("div");
        }),
            (t.MOUSE_UP = "onMouseDown"),
            (t.RIGHT = "right"),
            (t.LEFT = "left"),
            (t.BOTTOM = "bottom"),
            (t.TOP = "top"),
            (t.prototype = null),
            (e.FWDVSThumbnail = t);
    })(window),
    (function (e) {
        e.FWDVSTransformDisplayObject = function (e, t, s, o) {
            this.listeners = { events_ar: [] };
            var n = this;
            if ("div" == e || "img" == e || "canvas" == e) this.type = e;
            else throw Error("Type is not valid! " + e);
            (this.children_ar = []),
                this.style,
                this.screen,
                this.numChildren,
                this.transform,
                (this.position = t || "absolute"),
                (this.overflow = s || "hidden"),
                (this.display = o || "block"),
                (this.visible = !0),
                this.buttonMode,
                (this.x = 0),
                (this.y = 0),
                (this.scale = 1),
                (this.rotation = 0),
                (this.w = 0),
                (this.h = 0),
                this.rect,
                (this.alpha = 1),
                (this.innerHTML = ""),
                (this.opacityType = ""),
                (this.isHtml5_bl = !1),
                (this.hasTransform2d_bl = FWDVSUtils.hasTransform2d),
                (this.init = function () {
                    this.setScreen();
                }),
                (this.getTransform = function () {
                    for (var e, t = ["transform", "msTransform", "WebkitTransform", "MozTransform", "OTransform"]; (e = t.shift()); ) if ("undefined" != typeof this.screen.style[e]) return e;
                    return !1;
                }),
                (this.getOpacityType = function () {
                    var e;
                    return (e = "undefined" == typeof this.screen.style.opacity ? "filter" : "opacity"), e;
                }),
                (this.setScreen = function (e) {
                    "img" == this.type && e ? ((this.screen = e), this.setMainProperties()) : ((this.screen = document.createElement(this.type)), this.setMainProperties());
                }),
                (this.setMainProperties = function () {
                    (this.transform = this.getTransform()),
                        this.setPosition(this.position),
                        this.setOverflow(this.overflow),
                        (this.opacityType = this.getOpacityType()),
                        "opacity" == this.opacityType && (this.isHtml5_bl = !0),
                        "filter" == n.opacityType && (n.screen.style.filter = "inherit"),
                        (this.screen.style.margin = "0px"),
                        (this.screen.style.padding = "0px"),
                        (this.screen.style.maxWidth = "none"),
                        (this.screen.style.maxHeight = "none"),
                        (this.screen.style.border = "none"),
                        (this.screen.style.lineHeight = "1"),
                        (this.screen.style.backgroundColor = "transparent"),
                        (this.screen.style.backfaceVisibility = "hidden"),
                        (this.screen.style.webkitBackfaceVisibility = "hidden"),
                        (this.screen.style.MozBackfaceVisibility = "hidden"),
                        "img" == e &&
                            (this.setWidth(this.screen.width),
                            this.setHeight(this.screen.height),
                            (this.screen.onmousedown = function () {
                                return !1;
                            }));
                }),
                (n.setBackfaceVisibility = function () {
                    (n.screen.style.backfaceVisibility = "visible"), (n.screen.style.webkitBackfaceVisibility = "visible"), (n.screen.style.MozBackfaceVisibility = "visible");
                }),
                (n.removeBackfaceVisibility = function () {
                    (n.screen.style.backfaceVisibility = "hidden"), (n.screen.style.webkitBackfaceVisibility = "hidden"), (n.screen.style.MozBackfaceVisibility = "hidden");
                }),
                (this.setSelectable = function (e) {
                    if (!e) {
                        try {
                            this.screen.style.userSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.style.MozUserSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.style.webkitUserSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.style.khtmlUserSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.style.oUserSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.style.msUserSelect = "none";
                        } catch (t) {}
                        try {
                            this.screen.msUserSelect = "none";
                        } catch (t) {}
                        (this.screen.ondragstart = function () {
                            return !1;
                        }),
                            (this.screen.onselectstart = function () {
                                return !1;
                            }),
                            (this.screen.style.webkitTouchCallout = "none");
                    }
                }),
                (this.getScreen = function () {
                    return n.screen;
                }),
                (this.setVisible = function (e) {
                    (this.visible = e), (this.screen.style.visibility = !0 == this.visible ? "visible" : "hidden");
                }),
                (this.getVisible = function () {
                    return this.visible;
                }),
                (this.setResizableSizeAfterParent = function () {
                    (this.screen.style.width = "100%"), (this.screen.style.height = "100%");
                }),
                (this.getStyle = function () {
                    return this.screen.style;
                }),
                (this.setOverflow = function (e) {
                    (n.overflow = e), (n.screen.style.overflow = n.overflow);
                }),
                (this.setPosition = function (e) {
                    (n.position = e), (n.screen.style.position = n.position);
                }),
                (this.setDisplay = function (e) {
                    (this.display = e), (this.screen.style.display = this.display);
                }),
                (this.setButtonMode = function (e) {
                    (this.buttonMode = e), (this.screen.style.cursor = !0 == this.buttonMode ? "pointer" : "default");
                }),
                (this.setBkColor = function (e) {
                    n.screen.style.backgroundColor = e;
                }),
                (this.setInnerHTML = function (e) {
                    (n.innerHTML = e), (n.screen.innerHTML = n.innerHTML);
                }),
                (this.getInnerHTML = function () {
                    return n.innerHTML;
                }),
                (this.getRect = function () {
                    return n.screen.getBoundingClientRect();
                }),
                (this.setAlpha = function (e) {
                    (n.alpha = e),
                        "opacity" == n.opacityType
                            ? (n.screen.style.opacity = n.alpha)
                            : "filter" == n.opacityType && ((n.screen.style.filter = "alpha(opacity=" + 100 * n.alpha + ")"), (n.screen.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(100 * n.alpha) + ")"));
                }),
                (this.getAlpha = function () {
                    return n.alpha;
                }),
                (this.getRect = function () {
                    return this.screen.getBoundingClientRect();
                }),
                (this.getGlobalX = function () {
                    return this.getRect().left;
                }),
                (this.getGlobalY = function () {
                    return this.getRect().top;
                }),
                (this.setX = function (e) {
                    (n.x = e), n.hasTransform2d_bl ? (n.screen.style[n.transform] = "translate(" + n.x + "px," + n.y + "px) scale(" + n.scale + " , " + n.scale + ") rotate(" + n.rotation + "deg)") : (n.screen.style.left = n.x + "px");
                }),
                (this.getX = function () {
                    return n.x;
                }),
                (this.setY = function (e) {
                    (n.y = e), n.hasTransform2d_bl ? (n.screen.style[n.transform] = "translate(" + n.x + "px," + n.y + "px) scale(" + n.scale + " , " + n.scale + ") rotate(" + n.rotation + "deg)") : (n.screen.style.top = n.y + "px");
                }),
                (this.getY = function () {
                    return n.y;
                }),
                (this.setScale2 = function (e) {
                    (n.scale = e), n.hasTransform2d_bl && (n.screen.style[n.transform] = "translate(" + n.x + "px," + n.y + "px) scale(" + n.scale + " , " + n.scale + ") rotate(" + n.rotation + "deg)");
                }),
                (this.getScale = function () {
                    return n.scale;
                }),
                (this.setRotation = function (e) {
                    (n.rotation = e), n.hasTransform2d_bl && (n.screen.style[n.transform] = "translate(" + n.x + "px," + n.y + "px) scale(" + n.scale + " , " + n.scale + ") rotate(" + n.rotation + "deg)");
                }),
                (this.setWidth = function (e) {
                    (n.w = e), "img" == n.type ? (n.screen.width = n.w) : (n.screen.style.width = n.w + "px");
                }),
                (this.getWidth = function () {
                    if ("div" == n.type) return 0 == n.screen.offsetWidth ? n.w : n.screen.offsetWidth;
                    return "img" == n.type ? (0 == n.screen.offsetWidth ? (0 == n.screen.width ? n._w : n.screen.width) : n.screen.offsetWidth) : "canvas" == n.type ? (0 == n.screen.offsetWidth ? n.w : n.screen.offsetWidth) : void 0;
                }),
                (this.setHeight = function (e) {
                    (n.h = e), "img" == n.type ? (n.screen.height = n.h) : (n.screen.style.height = n.h + "px");
                }),
                (this.getHeight = function () {
                    if ("div" == n.type) return 0 == n.screen.offsetHeight ? n.h : n.screen.offsetHeight;
                    return "img" == n.type ? (0 == n.screen.offsetHeight ? (0 == n.screen.height ? n.h : n.screen.height) : n.screen.offsetHeight) : "canvas" == n.type ? (0 == n.screen.offsetHeight ? n.h : n.screen.offsetHeight) : void 0;
                }),
                (this.getNumChildren = function () {
                    return n.children_ar.length;
                }),
                (this.addChild = function (t) {
                    this.contains(t) ? (this.children_ar.splice(FWDVSUtils.indexOfArray(this.children_ar, t), 1), this.children_ar.push(t), this.screen.appendChild(t.screen)) : (this.children_ar.push(t), this.screen.appendChild(t.screen));
                }),
                (this.removeChild = function (t) {
                    if (this.contains(t)) this.children_ar.splice(FWDVSUtils.indexOfArray(this.children_ar, t), 1), this.screen.removeChild(t.screen);
                    else throw Error("##removeChild()## Child doesn't exist, it can't be removed!");
                }),
                (this.contains = function (t) {
                    return -1 != FWDVSUtils.indexOfArray(this.children_ar, t);
                }),
                (n.addChildAt = function (t, e) {
                    if (0 == n.getNumChildren()) n.children_ar.push(t), n.screen.appendChild(t.screen);
                    else if (1 == e)
                        n.screen.insertBefore(t.screen, n.children_ar[0].screen),
                            n.screen.insertBefore(n.children_ar[0].screen, t.screen),
                            n.contains(t) ? n.children_ar.splice(FWDVSUtils.indexOfArray(n.children_ar, t), 1, t) : n.children_ar.splice(FWDVSUtils.indexOfArray(n.children_ar, t), 0, t);
                    else {
                        if (0 > e || e > n.getNumChildren() - 1) throw Error("##getChildAt()## Index out of bounds!");
                        n.screen.insertBefore(t.screen, n.children_ar[e].screen), n.contains(t) ? n.children_ar.splice(FWDVSUtils.indexOfArray(n.children_ar, t), 1, t) : n.children_ar.splice(FWDVSUtils.indexOfArray(n.children_ar, t), 0, t);
                    }
                }),
                (this.getChildAt = function (e) {
                    if (0 > e || e > this.numChildren - 1) throw Error("##getChildAt()## Index out of bounds!");
                    if (0 == this.numChildren) throw Errror("##getChildAt## Child dose not exist!");
                    return this.children_ar[e];
                }),
                (this.removeChildAtZero = function () {
                    this.screen.removeChild(this.children_ar[0].screen), this.children_ar.shift();
                }),
                (this.addListener = function (e, t) {
                    if (e == null) throw Error("type is required.");
                    if ("object" == typeof e) throw Error("type must be of type String.");
                    if ("function" != typeof t) throw Error("listener must be of type Function.");
                    var s = {};
                    (s.type = e), (s.listener = t), (s.target = this), this.listeners.events_ar.push(s);
                }),
                (this.dispatchEvent = function (e, t) {
                    if (e == null) throw Error("type is required.");
                    if ("object" == typeof e) throw Error("type must be of type String.");
                    for (var s = 0, o = this.listeners.events_ar.length; s < o; s++)
                        if (this.listeners.events_ar[s].target === this && this.listeners.events_ar[s].type === e) {
                            if (t) for (var n in t) this.listeners.events_ar[s][n] = t[n];
                            this.listeners.events_ar[s].listener.call(this, this.listeners.events_ar[s]);
                            break;
                        }
                }),
                (this.removeListener = function (e, t) {
                    if (e == null) throw Error("type is required.");
                    if ("object" == typeof e) throw Error("type must be of type String.");
                    if ("function" != typeof t) throw Error("listener must be of type Function." + e);
                    for (var s = 0, o = this.listeners.events_ar.length; s < o; s++)
                        if (this.listeners.events_ar[s].target === this && this.listeners.events_ar[s].type === e && this.listeners.events_ar[s].listener === t) {
                            this.listeners.events_ar.splice(s, 1);
                            break;
                        }
                }),
                (this.disposeImage = function () {
                    "img" == this.type && (this.screen.src = null);
                }),
                (this.destroy = function () {
                    try {
                        this.screen.parentNode.removeChild(this.screen);
                    } catch (t) {}
                    (this.screen.onselectstart = null),
                        (this.screen.ondragstart = null),
                        (this.screen.ontouchstart = null),
                        (this.screen.ontouchmove = null),
                        (this.screen.ontouchend = null),
                        (this.screen.onmouseover = null),
                        (this.screen.onmouseout = null),
                        (this.screen.onmouseup = null),
                        (this.screen.onmousedown = null),
                        (this.screen.onmousemove = null),
                        (this.screen.onclick = null),
                        delete this.screen,
                        delete this.style,
                        delete this.rect,
                        delete this.selectable,
                        delete this.buttonMode,
                        delete this.position,
                        delete this.overflow,
                        delete this.visible,
                        delete this.innerHTML,
                        delete this.numChildren,
                        delete this.x,
                        delete this.y,
                        delete this.w,
                        delete this.h,
                        delete this.opacityType,
                        delete this.isHtml5_bl,
                        delete this.hasTransform2d_bl,
                        (this.children_ar = null),
                        (this.style = null),
                        (this.screen = null),
                        (this.numChildren = null),
                        (this.transform = null),
                        (this.position = null),
                        (this.overflow = null),
                        (this.display = null),
                        (this.visible = null),
                        (this.buttonMode = null),
                        (this.globalX = null),
                        (this.globalY = null),
                        (this.x = null),
                        (this.y = null),
                        (this.w = null);
                    this.h = null;
                    (this.rect = null), (this.alpha = null), (this.innerHTML = null), (this.opacityType = null), (this.isHtml5_bl = null), (this.hasTransform3d_bl = null), (this.hasTransform2d_bl = null), (n = null);
                }),
                this.init();
        };
    })(window),
    (function (e) {
        function t() {
            for (var e, t, s = ["transform", "msTransform", "WebkitTransform", "MozTransform", "OTransform", "KhtmlTransform"]; (e = s.shift()); )
                if (
                    "undefined" != typeof o.dumy.style[e] &&
                    ((o.dumy.style.position = "absolute"), (t = o.dumy.getBoundingClientRect().left), (o.dumy.style[e] = "translate3d(500px, 0px, 0px)"), (t = Math.abs(o.dumy.getBoundingClientRect().left - t)), 100 < t && 900 > t)
                ) {
                    try {
                        document.documentElement.removeChild(o.dumy);
                    } catch (t) {}
                    return !0;
                }
            try {
                document.documentElement.removeChild(o.dumy);
            } catch (t) {}
        }
        function s() {
            for (var e, t = ["transform", "msTransform", "WebkitTransform", "MozTransform", "OTransform", "KhtmlTransform"]; (e = t.shift()); ) if ("undefined" != typeof o.dumy.style[e]) return !0;
            try {
                document.documentElement.removeChild(o.dumy);
            } catch (t) {}
            return !1;
        }
        var o = function () {};
        (o.dumy = document.createElement("div")),
            (o.trim = function (e) {
                return e.replace(/\s/gi, "");
            }),
            (o.splitAndTrim = function (e, t) {
                for (var s = e.split(","), n = s.length, a = 0; a < n; a++) t && (s[a] = o.trim(s[a]));
                return s;
            }),
            (o.indexOfArray = function (e, t) {
                for (var s = e.length, o = 0; o < s; o++) if (e[o] === t) return o;
                return -1;
            }),
            (o.randomizeArray = function (e) {
                for (var t, s = [], o = e.concat(), n = o.length, a = 0; a < n; a++) (t = Math.floor(Math.random() * o.length)), s.push(o[t]), o.splice(t, 1);
                return s;
            }),
            (o.removeArrayDuplicates = function (e, t) {
                var s,
                    o,
                    n,
                    a = [],
                    r = e.length;
                for (o = 0; o < r; o++) {
                    for (s = void 0, n = 0; n < a.length; n++)
                        if (e[o][t] === a[n][t]) {
                            s = !0;
                            break;
                        }
                    s || a.push(e[o]);
                }
                return a;
            }),
            (o.parent = function (t, s) {
                for (void 0 === s && (s = 1); s-- && t; ) t = t.parentNode;
                return t && 1 === t.nodeType ? t : null;
            }),
            (o.sibling = function (t, s) {
                for (; t && 0 !== s; )
                    if (0 < s) {
                        if (t.nextElementSibling) t = t.nextElementSibling;
                        else for (var t = t.nextSibling; t && 1 !== t.nodeType; t = t.nextSibling);
                        s--;
                    } else {
                        if (t.previousElementSibling) t = t.previousElementSibling;
                        else for (var t = t.previousSibling; t && 1 !== t.nodeType; t = t.previousSibling);
                        s++;
                    }
                return t;
            }),
            (o.getChildAt = function (t, e) {
                var s = o.getChildren(t);
                return 0 > e && (e += s.length), 0 > e ? null : s[e];
            }),
            (o.getChildById = function (e) {
                return document.getElementById(e) || void 0;
            }),
            (o.getChildren = function (t, e) {
                for (var s = [], o = t.firstChild; null != o; o = o.nextSibling) e ? s.push(o) : 1 === o.nodeType && s.push(o);
                return s;
            }),
            (o.getChildrenFromAttribute = function (t, e, s) {
                for (var n = [], a = t.firstChild; null != a; a = a.nextSibling) s && o.hasAttribute(a, e) ? n.push(a) : 1 === a.nodeType && o.hasAttribute(a, e) && n.push(a);
                return 0 == n.length ? void 0 : n;
            }),
            (o.getChildFromNodeListFromAttribute = function (t, e, s) {
                for (var n = t.firstChild; null != n; n = n.nextSibling) {
                    if (s && o.hasAttribute(n, e)) return n;
                    if (1 === n.nodeType && o.hasAttribute(n, e)) return n;
                }
            }),
            (o.getAttributeValue = function (t, e) {
                return o.hasAttribute(t, e) ? t.getAttribute(e) : void 0;
            }),
            (o.hasAttribute = function (t, e) {
                if (t.hasAttribute) return t.hasAttribute(e);
                var s = t.getAttribute(e);
                return !!s;
            }),
            (o.insertNodeAt = function (e, t, s) {
                var n = o.children(e);
                if (0 > s || s > n.length) throw new Error("invalid index!");
                else e.insertBefore(t, n[s]);
            }),
            (o.hasCanvas = function () {
                return !!document.createElement("canvas");
            }),
            (o.hitTest = function (e, t, s) {
                if (!e) throw Error("Hit test target is null!");
                var o = e.getBoundingClientRect();
                return !!(t >= o.left && t <= o.left + (o.right - o.left) && s >= o.top && s <= o.top + (o.bottom - o.top));
            }),
            (o.getScrollOffsets = function () {
                return null == e.pageXOffset ? ("CSS1Compat" == document.compatMode ? { x: document.documentElement.scrollLeft, y: document.documentElement.scrollTop } : void 0) : { x: e.pageXOffset, y: e.pageYOffset };
            }),
            (o.getViewportSize = function () {
                return o.hasPointerEvent && 1 < navigator.msMaxTouchPoints
                    ? { w: document.documentElement.clientWidth || e.innerWidth, h: document.documentElement.clientHeight || e.innerHeight }
                    : o.isMobile
                    ? { w: e.innerWidth, h: e.innerHeight }
                    : { w: document.documentElement.clientWidth || e.innerWidth, h: document.documentElement.clientHeight || e.innerHeight };
            }),
            (o.getViewportMouseCoordinates = function (t) {
                var e = o.getScrollOffsets();
                return t.touches
                    ? { screenX: null == t.touches[0] ? t.touches.pageX - e.x : t.touches[0].pageX - e.x, screenY: null == t.touches[0] ? t.touches.pageY - e.y : t.touches[0].pageY - e.y }
                    : { screenX: t.clientX == null ? t.pageX - e.x : t.clientX, screenY: t.clientY == null ? t.pageY - e.y : t.clientY };
            }),
            (o.hasPointerEvent = (function () {
                return !!e.navigator.msPointerEnabled || !!e.navigator.pointerEnabled;
            })()),
            (o.isMobile = (function () {
                if ((o.hasPointerEvent && 1 < navigator.msMaxTouchPoints) || (o.hasPointerEvent && 1 < navigator.maxTouchPoints)) return !0;
                var t = ["android", "webos", "iphone", "ipad", "blackberry", "kfsowi"];
                for (var i in t) if (-1 != (navigator.userAgent + "").toLowerCase().indexOf((t[i] + "").toLowerCase())) return !0;
                return !("macintel" !== navigator.platform.toLowerCase() || !(1 < navigator.maxTouchPoints) || e.MSStream);
            })()),
            (o.isAndroid = (function () {
                return -1 != navigator.userAgent.toLowerCase().indexOf("android".toLowerCase());
            })()),
            (o.isChrome = (function () {
                return -1 != navigator.userAgent.toLowerCase().indexOf("chrome");
            })()),
            (o.isSafari = (function () {
                return -1 != navigator.userAgent.toLowerCase().indexOf("safari") && -1 == navigator.userAgent.toLowerCase().indexOf("chrome");
            })()),
            (o.isOpera = (function () {
                return -1 != navigator.userAgent.toLowerCase().indexOf("opera") && -1 == navigator.userAgent.toLowerCase().indexOf("chrome");
            })()),
            (o.isFirefox = (function () {
                return -1 != navigator.userAgent.toLowerCase().indexOf("firefox");
            })()),
            (o.isIE = (function () {
                var e = !(-1 == navigator.userAgent.toLowerCase().indexOf("msie")) || !(-1 == navigator.userAgent.toLowerCase().indexOf("edge"));
                return e || !!document.documentElement.msRequestFullscreen;
            })()),
            (o.isIE11 = (function () {
                return !(o.isIE || !document.documentElement.msRequestFullscreen);
            })()),
            (o.isIEAndLessThen9 = (function () {
                return -1 != navigator.userAgent.toLowerCase().indexOf("msie 7") || -1 != navigator.userAgent.toLowerCase().indexOf("msie 8");
            })()),
            (o.isIEAndLessThen10 = (function () {
                return -1 != navigator.userAgent.toLowerCase().indexOf("msie 7") || -1 != navigator.userAgent.toLowerCase().indexOf("msie 8") || -1 != navigator.userAgent.toLowerCase().indexOf("msie 9");
            })()),
            (o.isIE7 = (function () {
                return -1 != navigator.userAgent.toLowerCase().indexOf("msie 7");
            })()),
            (o.isIOS = (function () {
                return navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
            })()),
            (o.isIphone = (function () {
                return navigator.userAgent.match(/(iPhone|iPod)/g);
            })()),
            (o.isApple = (function () {
                return -1 != navigator.appVersion.toLowerCase().indexOf("mac");
            })()),
            (o.isLocal = (function () {
                return -1 != location.href.indexOf("file:");
            })()),
            (o.hasFullScreen = (function () {
                return o.dumy.requestFullScreen || o.dumy.mozRequestFullScreen || o.dumy.webkitRequestFullScreen || o.dumy.msieRequestFullScreen;
            })());
        (o.onReady = function (e) {
            document.addEventListener
                ? document.addEventListener("DOMContentLoaded", function () {
                      o.checkIfHasTransofrms(), e();
                  })
                : (document.onreadystatechange = function () {
                      o.checkIfHasTransofrms(), "complete" == document.readyState && e();
                  });
        }),
            (o.checkIfHasTransofrms = function () {
                document.documentElement.appendChild(o.dumy), (o.hasTransform3d = t()), (o.hasTransform2d = s()), (o.isReadyMethodCalled_bl = !0);
            }),
            (o.disableElementSelection = function (t) {
                try {
                    t.style.userSelect = "none";
                } catch (t) {}
                try {
                    t.style.MozUserSelect = "none";
                } catch (t) {}
                try {
                    t.style.webkitUserSelect = "none";
                } catch (t) {}
                try {
                    t.style.khtmlUserSelect = "none";
                } catch (t) {}
                try {
                    t.style.oUserSelect = "none";
                } catch (t) {}
                try {
                    t.style.msUserSelect = "none";
                } catch (t) {}
                try {
                    t.msUserSelect = "none";
                } catch (t) {}
                t.onselectstart = function () {
                    return !1;
                };
            }),
            (o.getSearchArgs = function (e) {
                for (var t = {}, s = e.substr(e.indexOf("?") + 1) || location.search.substring(1), o = s.split("&"), n = 0; n < o.length; n++) {
                    var a = o[n].indexOf("="),
                        r = o[n].substring(0, a),
                        l = o[n].substring(a + 1);
                    (l = decodeURIComponent(l)), (t[r] = l);
                }
                return t;
            }),
            (o.getHashArgs = function (e) {
                for (var t = {}, s = e.substr(e.indexOf("#") + 1) || location.hash.substring(1), o = s.split("&"), n = 0; n < o.length; n++) {
                    var a = o[n].indexOf("="),
                        r = o[n].substring(0, a),
                        l = o[n].substring(a + 1);
                    (l = decodeURIComponent(l)), (t[r] = l);
                }
                return t;
            }),
            (o.isReadyMethodCalled_bl = !1),
            (e.FWDVSUtils = o);
    })(window);
