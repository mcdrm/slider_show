/**
 * Linear Slider PACKAGED v:1.0
 * Linear Slider.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDLSButtonsManager from "./FWDLSButtonsManager";
import FWDLSDisplayObject from "./FWDLSDisplayObject";
import FWDLSEventDispather from "./FWDLSEventDispather";
import FWDLSUtils from "./FWDLSUtils";
import FWDLSData from "./FWDLSData";
import FWDLSSliderManager from "./FWDLSSliderManager";
import FWDLSErrorWindow from "./FWDLSErrorWindow";
import FWDLSPreloader from "./FWDLSPreloader";


export default class FWDLS extends FWDLSEventDispather{

    static RESPONSIVE = "responsive";
	static AFTER_PARENT = "afterparent";
    static ERROR = 'error';
    static ITEM_UPDATE = 'itemUpdate';


    /*
     * Initialize
     */
    constructor(settings){
      
        super();
        this.settings = settings;
        
        
        // Set instance name.
        this.instance = settings.instance;
        window[this.instance] = this;
        window['FWDLS'] = FWDLS;

        if(!FWDLS.mainAR){
            FWDLS.mainAR = []
        }
        FWDLS.mainAR.push(this);
       
     
        // Set display type.
        this.displayType = settings.displayType || FWDLS.RESPONSIVE;

      
		if(this.displayType.toLowerCase() != FWDLS.RESPONSIVE 
        && this.displayType.toLowerCase() != FWDLS.AFTER_PARENT){
                this.displayType = FWDLS.RESPONSIVE;
        }
      
        // Set parent.
        if(settings.parentId === undefined){
            alert("Linear Slider container parentId property is not found in the settings! ");
            return;
        }

        this.stageContainer = FWDLSUtils.getChildById(settings.parentId);   
        if(!this.stageContainer){
            alert("Linear Slider container holder div is not found, please make sure that the container holder div exsists and the id is correct! " + settings.parentId);
            return;
        }
        this.stageContainer.style.position = 'relative';


        // Set various properties.
        this.wpPluginPath = this.settings.wpPluginPath;
        this.fontIcon = this.settings.fontIcon || 'fwdlsicon';
        this.backgroundColor = settings.backgroundColor || '#1a1a1a';
        this.maxWidth = settings.maxWidth || 1000;
        this.maxHeight = settings.maxHeight || 700; 
        this.autoScale = settings.autoScale == "yes" ? true : false;
        this.paralax = settings.paralax == "yes" ? true : false;
        this.initializeWhenVisible = settings.initializeWhenVisible == "yes" ? true : false;
        this.fixedPreloder = settings.fixedPreloder == "no" ? false : true;
        this.showPreloader = settings.showPreloader == "yes" ? true : false;
        this.preloaderColor = settings.preloaderColor || '#FFFFFF';
        this.type = settings.type || 'slider';
        this.stopScrollingForPx = settings.stopScrollingForPx;
        if(this.stopScrollingForPx === undefined) this.stopScrollingForPx = 0;
        this.showHorizontalAtLestThanWidth = settings.showHorizontalAtLestThanWidth || 1100;
		

        // Setup main stuff.
        this.setupMainDO();
      
        this.setupErrorWindow();
        this.startResize();

        this.setupPreloader();
      
        if(!this.initializeWhenVisible){
          this.setupData();
        }else{
            this.onScroll();
        }
     
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
        document.addEventListener('visibilitychange', this.onVisibilityChange);
    }


    /**
     * Tab visibility change.
     */
     onVisibilityChange(){
        if(this.sliderManagerDO){
            if (document.hidden) {
                this.sliderManagerDO.stop();                
            } else {
                this.sliderManagerDO.play();
            }
        }
    }

    /**
     * Setup buttons manager
     */
    setupButtonsManager(){
       
        this.buttonsManagerDO = new FWDLSButtonsManager(
            this,
            this.data.texturesAR,
            this.data.controlButtonsNormalColor,
            this.data.controlButtonsSelectedColor,
            this.data.controlsImageHeight,
            (this.data.itemWidth +0.2)/this.data.itemHeight,
            this.data.showControlButtons,
            this.data.enableControlsAudio,
        );
        
    
    }


    /**
     * Setup main display object.
     */
    setupMainDO() {
        this.mainDO = new FWDLSDisplayObject();
        this.mainDO.screen.className = 'fwdls';
        this.mainDO.style.background = this.backgroundColor;
        this.stageContainer.appendChild(this.mainDO.screen);
    }
    

    /**
     * Paralax RAF.
     */
    startRAF() {
        const step = () => {
        
            let pos = this.mainDO.rect.top / 2;
            if (pos > 0) {
                pos = 0;
            }
            pos *= -1;
    
            if (this.mainDO.rect.top >= -this.height && this.mainDO.rect.top < this.ws.h) {
                this.sliderManagerDO.mainHolderDO.y = pos;
                this.myReq = requestAnimationFrame(step);
            }
        };
    
        cancelAnimationFrame(this.myReq);
        this.myReq = requestAnimationFrame(step);
    }

    stopRAF() {
        cancelAnimationFrame(this.myReq);
    }
    

    /*
     * Resize and scroll.
     */
    startResize(){
        window.addEventListener("resize", this.onResize.bind(this));
        this.onResize();

        this.onScroll = this.onScroll.bind(this);
        window.addEventListener('scroll', this.onScroll);
    }

    onScroll(){
        this.globalX = this.mainDO.rect.x;
        this.globalY = this.mainDO.rect.y;
      
        if(FWDLSUtils.elementIsVisibleInViewport(this.mainDO.screen, true)){
          
            if(this.initializeWhenVisible && !this.data){
                this.setupData();
            }
            if(this.sliderManagerDO){
                if(!this.sliderManagerDO.isPlaying){
                    this.sliderManagerDO.play();
                    this.resize();
                    this.sliderManagerDO.renderer.antialias = false;
                }
                this.sliderManagerDO.hasScrolled = true;
            }
        }else{
            if(this.sliderManagerDO){
                if(this.sliderManagerDO.isPlaying){
                    this.sliderManagerDO.renderer.antialias = true;
                    this.sliderManagerDO.stop();
                    this.stopRAF();
                }
            }
        }
     
    }


    onResize(e){
        this.resize(e);
        setTimeout(() => {
            this.resize(e);
        }, 100);
    }

    resize(){
	    this.wsw = FWDLSUtils.getViewportSize().w;
		this.wsh = FWDLSUtils.getViewportSize().h;
		this.pageXOffset = FWDLSUtils.getScrollOffsets().x;
		this.pageYOffset = FWDLSUtils.getScrollOffsets().y;
        this.globalX = this.mainDO.rect.x;
        this.globalY = this.mainDO.rect.y;

        this.isHorizontal = this.showHorizontalAtLestThanWidth >= this.wsw ? true : false;
      
        if(this.displayType == FWDLS.RESPONSIVE ){
           
            this.stageContainer.style.width = "100%";
            if(this.stageContainer.offsetWidth > this.maxWidth){
                this.stageContainer.style.width = this.maxWidth + "px";
            }
            this.width = this.stageContainer.offsetWidth;

            if(this.autoScale){
                const progress = this.width / this.maxWidth; // 0 to 1
                const easedProgress = Math.pow(progress, 0.4); // Slowdown effect
                
                // Ensure it precisely reaches maxHeight at progress = 1
                this.height = Math.round(this.maxHeight * (easedProgress / Math.pow(1, 0.5)));
                
                if (this.height < 300) this.height = 300;
            }else{
                this.height = this.maxHeight;
            }

            this.mainDO.x = 0;
            this.mainDO.y = 0;
            this.stageContainer.style.height = this.height  + "px";

            this.scale = Math.min(this.width/this.height, 1);
        }else if(this.displayType == FWDLS.AFTER_PARENT){
            this.width = this.stageContainer.offsetWidth;
			this.height = this.stageContainer.offsetHeight;
        }

        this.resizeWidth = this.width;
        this.resizeHeight = this.height;

        this.mainDO.width = this.width;
		this.mainDO.height = this.height

        this.totalHeightWithOffset = this.height + this.stopScrollingForPx;

        this.isResizing = true;
        clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(() => {
            this.isResizing = false;
        }, 50);


        if(this.sliderManagerDO) this.sliderManagerDO.resize(this.width, this.height);
    }


    /**
     * Setup data.
     */
    setupData(){
        this.data = new FWDLSData(this.settings);

        this.onDataError = this.onDataError.bind(this);
        this.data.addEventListener(FWDLSData.ERROR, this.onDataError);

        this.onDataReady = this.onDataReady.bind(this);
        this.data.addEventListener(FWDLSData.READY, this.onDataReady);
    }

    onDataError(e){
        this.errorWindowDO.showText(e.text);
        this.dispatchEvent(FWDLS.ERROR, {text:e.text});
    }

    onDataReady(e){
        this.setupManager();
        this.setupButtonsManager();
        this.resize();

        setTimeout(() => {
            this.preloaderDO.stopRender();
        }, 1500);

        this.apiReady = true;
    }


    /**
     * Setup error window.
     */
    setupErrorWindow(){
        this.errorWindowDO = new FWDLSErrorWindow(this);
    }


    /**
     * Setup prealoder
     */
    setupPreloader(){
        if(!this.showPreloader) return;
        this.preloaderDO = new FWDLSPreloader(this.mainDO.screen, this.preloaderColor, this.fixedPreloder);
        this.preloaderDO.render();
    }
    

    /**
     * Setup imamge manager.
     */
    setupManager(){
            
        this.sliderManagerDO = new FWDLSSliderManager(this);

        this.mainDO.addChild(this.sliderManagerDO);


        this.onItemUpdate = this.onItemUpdate.bind(this);
        this.sliderManagerDO.addEventListener(FWDLSSliderManager.ITEM_UPDATE, this.onItemUpdate.bind(this));
    }

    onItemUpdate(e){
        this.dispatchEvent(FWDLS.ITEM_UPDATE, {itemId:e.id});
    }


    /**
     * API
     */
    goToItem(id, animate = true, duration = 1.5, preferShortestDirection = false){
        if(!this.apiReady) return;

        if(this.isHorizontal){
            this.sliderManagerDO.goToHorizontalItem(id, animate, duration, preferShortestDirection);
        }else{
            this.sliderManagerDO.goToVerticaltem(id, animate, duration,  preferShortestDirection);
        }
    }


    /**
     * Destroy.
     */
    destroy(){
        if(this.destroyed) return;

        if(this.preloaderDO){
            this.preloaderDO.destroy();
        }

        if(this.data){
            this.data.destroy();
        }
        
        if(this.sliderManagerDO){
            this.sliderManagerDO.destroy();
        }

        if(this.errorWindowDO){
            this.errorWindowDO.destroy();
        }

        window.removeEventListener("resize", this.onResize);
        window.removeEventListener('scroll', this.onScroll);
        document.removeEventListener('visibilitychange', this.onVisibilityChange);

        clearTimeout(this.resizeTO);
        cancelAnimationFrame(this.myReq);

        this.stageContainer.parentElement.removeChild(this.stageContainer);

        FWDLS.mainAR.splice(FWDLS.mainAR.indexOf(this), 1);
        window[this.instance] = null;
        
    }

}