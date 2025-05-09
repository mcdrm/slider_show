/**
 * Linear Slider PACKAGED v:1.0
 * Data class.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDLSEventDispather from "./FWDLSEventDispather";
import FWDLSUtils from "./FWDLSUtils";
import * as FWDLS_THREE from 'three';

export default class FWDLSData extends FWDLSEventDispather{
    
    static ERROR = 'error';
    static READY = 'ready';


    /*
     * Initialize
     */
    constructor(settings){
        super();

        this.settings = settings;

        this.parseProperties();
        this.parseGalleryData();
    }


    /*
     * Parse properties.
     */
    parseProperties(){
      
        this.preloaderRadius = this.settings.preloaderRadius;
        this.preloaderBackgroundColor = this.settings.preloaderBackgroundColor || '#333';
        this.preloaderFillColor = this.settings.preloaderFillColor || '#FFF';
        this.preloaderStrokeSize = this.settings.preloaderStrokeSize || 3;
        this.burnIntensity = this.settings.burnIntensity || 1;
        this.distortionIntensity = this.settings.distortionIntensity || 1;
        this.distortionMouseMoveSensitivity = this.settings.distortionMouseMoveSensitivity || 1;
        this.liquidWavesIntensity = this.settings.liquidWavesIntensity || 1;
        this.liquidWavesIntensity = Math.round(Number(this.liquidWavesIntensity));

        this.backgroundColor = this.settings.backgroundColor || '#000000';

        this.liquidWavesSpeed = this.settings.liquidWavesSpeed || 3;
        this.liquidWavesSpeed = Math.round(Number(this.liquidWavesSpeed));
        

        this.randomizeImages = this.settings.randomizeImages || "no";
        this.randomizeImages = this.randomizeImages == "yes" ? true : false;

        this.snap = this.settings.snap || "no";
        this.snap = this.snap == "yes" ? true : false;

        this.useBlackAndWhite = this.settings.useBlackAndWhite || "no";
        this.useBlackAndWhite = this.useBlackAndWhite == "yes" ? true : false;

        this.useOpacity = this.settings.useOpacity || "yes";
        this.useOpacity = this.useOpacity == "yes" ? true : false;
        
        this.addMouseMoveDistortion = this.settings.addMouseMoveDistortion || "yes";
        this.addMouseMoveDistortion = this.addMouseMoveDistortion == "yes" ? true : false;  
        
        this.distorted = this.settings.distorted || "no";
        this.distorted = this.distorted == "yes" ? true : false;   

        this.inverseDistortionOnMouseMove = this.settings.inverseDistortionOnMouseMove || "no";
        this.inverseDistortionOnMouseMove = this.inverseDistortionOnMouseMove == "yes" ? true : false;   

        this.aggressiveDistortion = this.settings.aggressiveDistortion || "no";
        this.aggressiveDistortion = this.aggressiveDistortion == "yes" ? true : false;      
        
        this.drag = this.settings.drag || "yes";
        this.drag = this.drag == "yes" ? true : false; 

        this.showStats = this.settings.stats || "yes";
        this.showStats = this.showStats == "yes" ? true : false; 
        
        this.showGUI = this.settings.gui || "yes";
        this.showGUI = this.showGUI == "yes" ? true : false; 

        this.bendVertices = this.settings.bendVertices || "yes";
        this.bendVertices = this.bendVertices == "yes" ? true : false;
        

        this.itemWidth = this.settings.itemWidth || 2.6;
        this.itemHeight = this.settings.itemHeight || 1.65;
        this.minItemScaleX = this.settings.minItemScaleX || 0.1;
        this.maxItemScaleX = this.settings.maxItemScaleX || 1;
        this.minItemScaleY = this.minItemScaleY || 0.66;
        this.maxItemScaleY = this.settings.maxItemScaleY || 1;

        
        this.liquidDistortionStrength = this.settings.liquidDistortionStrength;
        if(this.liquidDistortionStrength == undefined){
            this.liquidDistortionStrength = 0;
        }

        this.curveDistortionStrength = this.settings.curveDistortionStrength;
        if(this.curveDistortionStrength == undefined){
            this.curveDistortionStrength = 0;
        }

        this.defaultCurveDistortionStrength = this.settings.defaultCurveDistortionStrength;
        if(this.defaultCurveDistortionStrength == undefined){
            this.defaultCurveDistortionStrength = 0;
        }
        


        this.scrollBendStrength = this.settings.scrollBendStrength;
        if(this.scrollBendStrength == undefined){
            this.scrollBendStrength = 0;
        }

        this.scrollSpeedStrength = this.settings.scrollSpeedStrength;
        if(this.scrollSpeedStrength == undefined){
            this.scrollSpeedStrength = 1;
        }

        this.glitch = this.settings.glitch || "yes";
        this.glitch = this.glitch == "yes" ? true : false;  

        this.sliderPosition = this.settings.sliderPosition || "right";

        

        this.showCameraTool = this.settings.showCameraTool || "yes";
        this.showCameraTool = this.showCameraTool == "yes" ? true : false;  

        this.gap = this.settings.gap || 0;
        this.showHorizontalAtLestThanWidth = this.settings.showHorizontalAtLestThanWidth || 0;
        this.horizontalX = this.settings.horizontalX || 0;
        this.horizontalY = this.settings.horizontalY || 0;
        this.horizontalZ = this.settings.horizontalZ || 0;
        this.horizontalRotationX = this.settings.horizontalRotationX || 0;
        this.horizontalRotationY = this.settings.horizontalRotationY || 0;
        this.horizontalRotationZ = this.settings.horizontalRotationZ || 0;


        this.infinite = this.settings.infinite || "yes";
        this.infinite = this.infinite == "yes" ? true : false;  

        this.rippleDistortion = this.settings.rippleDistortion || "yes";
        this.rippleDistortion = this.rippleDistortion == "yes" ? true : false;

        this.showControlButtons = this.settings.showControlButtons || "yes";
        this.showControlButtons = this.showControlButtons == "yes" ? true : false;

        this.enableControlsAudio = this.settings.enableControlsAudio || "yes";
        this.enableControlsAudio = this.enableControlsAudio == "yes" ? true : false;
        
        
        this.useIntro =false;
       
        this.showMaskGradient = this.settings.showMaskGradient || "yes";
        this.showMaskGradient = this.showMaskGradient == "yes" ? true : false;

        this.useCaption = this.settings.useCaption || "yes";
        this.useCaption = this.useCaption == "yes" ? true : false;

        this.captionPosition = this.settings.captionPosition || "sticky";

        this.noiseAmplitude = this.settings.noiseAmplitude || 0;
        this.noiseFrequency = this.settings.noiseFrequency || 0;
        this.noiseSpeed = this.settings.noiseSpeed || 0.6;

        this.waveFrequency = this.settings.waveFrequency;
        if(this.waveFrequency == undefined){
            this.waveFrequency = 0.1;
        }

        this.waveAmplitude = this.settings.waveAmplitude;
        if(this.waveAmplitude == undefined){
            this.waveAmplitude = 0.5;
        }

        this.reflectionSize = this.settings.reflectionSize;
        if(this.reflectionSize == undefined){
            this.reflectionSize = 0.6;
        }

        this.reflectionOpacity = this.settings.reflectionOpacity;
        if(this.reflectionOpacity == undefined){
            this.reflectionOpacity = 0.56;
        }

        this.opacityStrength = this.settings.opacityStrength;
        if(this.opacityStrength == undefined){
            this.opacityStrength = 0.5;
        }

        this.reflectionBlurStrength = this.settings.reflectionBlurStrength;
        if(this.reflectionBlurStrength == undefined){
            this.reflectionBlurStrength = 1;
        }
        
        this.rippleDistortionStrength = this.settings.rippleDistortionStrength;
        if(this.rippleDistortionStrength == undefined){
            this.rippleDistortionStrength = 0;
        }

        this.rippleDistortionSize = this.settings.rippleDistortionSize;
        if(this.rippleDistortionSize == undefined){
            this.rippleDistortionSize = 1;
        }

        this.cameraPositionX = this.settings.cameraPositionX;
        if(this.cameraPositionX == undefined){
            this.cameraPositionX = 0;
        }

        this.cameraPositionY = this.settings.cameraPositionY;
        if(this.cameraPositionY == undefined){
            this.cameraPositionY = 0;
        }

        this.cameraRotationX = this.settings.cameraRotationX;
        if(this.cameraRotationX == undefined){
            this.cameraRotationX = 0;
        }

        this.cameraRotationY = this.settings.cameraRotationY;
        if(this.cameraRotationY == undefined){
            this.cameraRotationY = 0;
        }

        this.arcRadiusOffset = this.settings.arcRadiusOffset || 1;
        this.radius = this.settings.radius || 5;
        this.gap = this.settings.gap || 0;
        this.gap = this.settings.gap || 5; 
        this.useOpacityValue = this.settings.useOpacityValue || 1;

        this.controlButtonsNormalColor = this.settings.controlButtonsNormalColor || '#888888';
        this.controlButtonsSelectedColor = this.settings.controlButtonsSelectedColor || '#7fdc23';
        this.controlsImageHeight = this.settings.controlsImageHeight || 80;

        // Postporcessing.
        this.buldge = this.settings.buldge || "yes";
        this.buldge = this.buldge == "yes" ? true : false;  

        this.antialias = this.settings.antialias || "yes";
        this.antialias = this.antialias == "yes" ? true : false;  

        this.buldgeFixed = this.settings.buldgeFixed || "yes";
        this.buldgeFixed = this.buldgeFixed == "yes" ? true : false;  
        

        this.buldgeDirection = this.settings.buldgeDirection || "in";
        this.buldgeStrength = this.settings.buldgeStrength;
        if(this.buldgeStrength == undefined){
            this.buldgeStrength = 0.3;
        }

        this.mouseRippleStrength = this.settings.mouseRippleStrength;
        if(this.mouseRippleStrength == undefined){
            this.mouseRippleStrength = 1;
        }

        this.grid = this.settings.grid || "yes";
        this.grid = this.grid == "yes" ? true : false;

        this.limitOpacity = this.settings.limitOpacity || "yes";
        this.limitOpacity = this.limitOpacity == "yes" ? true : false;
        

        this.gridAddRGBDistortion = this.settings.gridAddRGBDistortion || "yes";
        this.gridAddRGBDistortion = this.gridAddRGBDistortion == "yes" ? true : false;

        this.gridSize  = this.settings.gridSize;
        if(this.gridSize === undefined){
            this.gridSize = 3;
        }
        if(this.gridSize > 400){
            this.gridSize = 400;
        }

        this.gridMouseRadiusFactor = this.settings.gridMouseRadiusFactor;
        if(this.gridMouseRadiusFactor === undefined){
            this.gridMouseRadiusFactor = 0.25;
        }
        if(this.gridMouseRadiusFactor > 2){
            this.gridMouseRadiusFactor = 2;
        }

        this.gridMouseStrengthFactor = this.settings.gridMouseStrengthFactor;
        if(this.gridMouseStrengthFactor === undefined){
            this.gridMouseStrengthFactor = 1;
        }
        if(this.gridMouseStrengthFactor > 2){
            this.gridMouseStrengthFactor = 2;
        }

        this.gridMouseRelaxation = this.settings.gridMouseRelaxation;
        if(this.gridMouseRelaxation === undefined){
            this.gridMouseRelaxation = 0.9;
        }
        if(this.gridMouseRelaxation > 1){
            this.gridMouseRelaxation = 1;
        }

        this.afterImage = this.settings.afterImage || "no";
        this.afterImage = this.afterImage == "yes" ? true : false;

        this.afterImageDumping = this.settings.afterImageDumping;
        if(this.afterImageDumping === undefined){
            this.afterImageDumping = 0.75;
        }

        this.verticalGap = this.settings.verticalGap || 0;
        this.verticalX = this.settings.verticalX || 0;
        this.verticalY = this.settings.verticalY || 0;
        this.verticalZ = this.settings.verticalZ || 0;
        this.verticalRotationX = this.settings.verticalRotationX || 0; 
        this.verticalRotationY = this.settings.verticalRotationY || 0;
        this.verticalRotationZ = this.settings.verticalRotationZ || 0;

        this.rgbShiftStrength = this.settings.rgbShiftStrength;
        if(this.rgbShiftStrength === undefined){
            this.rgbShiftStrength = 0;
        }

        this.navigationButtonsBackgroundNormalColor = this.settings.navigationButtonsBackgroundNormalColor || '#FF0000';
        this.navigationButtonsBackgroundSelectedColor = this.settings.navigationButtonsBackgroundSelectedColor || '#00FF00';
        this.navigationButtonsIconNormalColor = this.settings.navigationButtonsIconNormalColor || '#0000FF';
        this.navigationButtonsIconSelectedColor = this.settings.navigationButtonsIconSelectedColor || '#FFFFFF';

    }


    /**
     * Parse gallerdy data.
     */
    parseGalleryData(){
        this.sliderData = [];
        this.hasVideo = false;
		var galleryElement = FWDLSUtils.getChildById(this.settings.sliderDataId);

        if(!galleryElement){
            var error = "Data div with the id <font color='#FF0000'>" + this.settings.sliderDataId + "</font> is not found, please make sure that the container div exsists and the id is correct!";
            setTimeout(function(){
                this.dispatchEvent(FWDLSData.ERROR, {text:error});
            }.bind(this), 1);
            return;
        }

        var curData = FWDLSUtils.getChildren(galleryElement);

        if(curData.length <= 1){
            var error = "At least two items are required in the slider data!";
            setTimeout(function(){
                this.dispatchEvent(FWDLSData.ERROR, {text:error});
            }.bind(this), 1);
            return;
        }

        if (curData.length > 49) {
            curData.splice(0, curData.length - 49);
        }

        var totalImages = curData.length;

        if(totalImages == 0){
            var error = "At least one image is required in the slider data!";
            setTimeout(function(){
                this.dispatchEvent(FWDLSData.ERROR, {text:error});
            }.bind(this), 1);
            return;
        }
        
        for(var i=0; i<totalImages; i++){
            var obj = {};
            var child = curData[i];
            var test;

            if(!FWDLSUtils.hasAttribute(child, 'data-src')){
                var error = "Attribute <font color='#FF0000'>data-source</font> is not found in the slider data at position nr: <font color='#FF0000'>" + (i + 1) + "</font>.";
                setTimeout(function(){
                    this.dispatchEvent(FWDLSData.ERROR, {text:error});
                }.bind(this), 1);
                return;
            }

            obj.src = String(FWDLSUtils.getAttributeValue(child, "data-src"));
            FWDLSUtils.setMediaType(obj.src, obj);
            
            if(obj.type == 'video'){
                this.hasVideo = true;
            }

            if(!FWDLSUtils.hasAttribute(child, 'data-width')){
                var error = "Attribute <font color='#FF0000'>data-width</font> is not found in the slider data at position nr: <font color='#FF0000'>" + (i + 1) + "</font>.";
                setTimeout(function(){
                    this.dispatchEvent(FWDLSData.ERROR, {text:error});
                }.bind(this), 1);
                return;
            }

            if(!FWDLSUtils.hasAttribute(child, 'data-height')){
                var error = "Attribute <font color='#FF0000'>data-height</font> is not found in the slider data at position nr: <font color='#FF0000'>" + (i + 1) + "</font>.";
                setTimeout(function(){
                    this.dispatchEvent(FWDLSData.ERROR, {text:error});
                }.bind(this), 1);
                return;
            }

            obj.width = Number(FWDLSUtils.getAttributeValue(child, "data-width"));
            obj.height = Number(FWDLSUtils.getAttributeValue(child, "data-height"));

            obj.url = FWDLSUtils.getAttributeValue(child, "data-url")
            obj.target = FWDLSUtils.getAttributeValue(child, "data-target");

            const children = FWDLSUtils.getChildren(child);
            let caption = ' ';
            children.forEach((element) =>{
                if(FWDLSUtils.hasAttribute(element, "data-caption")){
                    caption = element.innerHTML;
                }
            });
            obj.caption = caption;

            this.sliderData.push(obj);
        }
       
        if(this.randomizeImages){
            this.sliderData = FWDLSUtils.randomizeArray(this.sliderData)
        }

        this.totalItems = this.sliderData.length;
        
        this.loadTextures();
        this.checkIfAllTexturesAreLoaded();
    }
    

    /**
     * Load textures.
     */
    loadTextures(){
        this.texturesAR = [];

        this.startTextureID = 0;
        let textureID = this.startTextureID;

        let nextTextureId = textureID + 1;
        if(nextTextureId > this.totalItems - 1){
            nextTextureId = this.totalItems - 1;
        }

        let prevTextureId = textureID - 1;
        if(prevTextureId < 0){
            prevTextureId = this.totalItems - 1;
        }

        if (!this.videoCache) {
            this.videoCache = {};
        }
    
        this.sliderData.forEach((el) =>  {
            let texture;
            if (el.type === 'image') {
                texture = new FWDLS_THREE.Texture();
                texture.needsUpdate = true;
                texture.textureType = 'image';
            } else {
                // Reuse video if already created for this source
                let video = this.videoCache[el.src];
                if (!video) {
                    video = document.createElement('video');
                    video.src = el.src;
                    video.preload = "auto";
                    video.muted = true;
                    video.playsInline = true;
                    video.crossOrigin = 'anonymous';
                    video.loop = true; // Prefer native looping
                    video.play(); // Start playback
                    this.videoCache[el.src] = video;
                }

                // Create the texture and link the video
                texture = new FWDLS_THREE.VideoTexture(video);
                texture.textureType = 'video';
                texture.video = video;
               

                // **Add the update logic here:**
                if(video.requestVideoFrameCallback){
                    const updateTexture = () => {
                        texture.needsUpdate = true;
                        video.requestVideoFrameCallback(updateTexture);
                    };
                    video.requestVideoFrameCallback(updateTexture);
                }else{
                    // Fallback: update roughly at 30fps
                    setInterval(() => {
                        texture.needsUpdate = true;
                    }, 33);
                }

            }

            this.texturesAR.push({
                texture: texture,
                canvas: undefined,
                src: el.src,
                type: el.type,
                hasTexture: false,
                width: el.width,
                height: el.height
            })
        });

    

        // Load first texture
        let centerLoader = new FWDLS_THREE.ImageLoader();
        let nextLoader = new FWDLS_THREE.ImageLoader();
        let prevLoader = new FWDLS_THREE.ImageLoader();

        function loadCenterTexture(){

            if(this.texturesAR[textureID].type == 'video'){
               
                this.texturesAR[textureID].hasTexture = true;
                loadLeftAndRightTextures.bind(this)();
                return;
            }
       

            centerLoader.load(
                this.texturesAR[textureID].src,
                
                // On load
                loadLeftAndRightTextures.bind(this),
                
                // On progress
                undefined,

                // On error
                onLoadError.bind(this)
            )
        }

        loadCenterTexture.bind(this)();

        function onLoadError(){
            let error = 'Texture not found -  <font color="#FF0000">' + this.texturesAR[textureID].src + '</font>';
            console.log(error)
            this.dispatchEvent(FWDLSData.ERROR, {text:error});
        }

        function onNextError(){
            let error = 'Texture not found -  <font color="#FF0000">' + this.texturesAR[nextTextureId].src + '</font>';
            console.log(error)
            this.dispatchEvent(FWDLSData.ERROR, {text:error});
        }

        function onPrevError(){
            let error = 'Texture not found -  <font color="#FF0000">' + this.texturesAR[prevTextureId].src + '</font>';
            console.log(error)
            this.dispatchEvent(FWDLSData.ERROR, {text:error});
        }

        function loadLeftAndRightTextures(image){
            this.texturesAR[textureID].hasTexture = true;
            if(this.texturesAR[textureID].type == 'image'){
                this.texturesAR[textureID].hasTexture = true;
                this.texturesAR[textureID].width = image.naturalWidth;
                this.texturesAR[textureID].height = image.naturalHeight;
                this.texturesAR[textureID].texture.image= image;
            }
        
          loadNextTexture.bind(this)();
          loadPrevTexture.bind(this)();
        }

        
        // Load next textures.
        function loadNextTexture(){
         
            if(this.texturesAR[nextTextureId].hasTexture) return;
          
            if(this.texturesAR[nextTextureId].type == 'video'){
             
                this.texturesAR[nextTextureId].hasTexture = true;
               
                nextTextureId ++;
        
                if(nextTextureId > this.totalItems - 1){
                    nextTextureId = 0;
                }

                loadNextTexture.bind(this)();
                return;
            }
            
            nextLoader.load(
                this.texturesAR[nextTextureId].src,
                
                // On load
                onLoaderNextLoad.bind(this),
                
                // On progress
                undefined,

                // On error
                onNextError.bind(this)
            )
        }
        
        function onLoaderNextLoad(image){
         
            this.texturesAR[nextTextureId].hasTexture = true;
            this.texturesAR[nextTextureId].width = image.naturalWidth;
            this.texturesAR[nextTextureId].height = image.naturalHeight;
            this.texturesAR[nextTextureId].texture.image = image;
        
            nextTextureId ++;
            
            if(nextTextureId > this.totalItems - 1){
                nextTextureId = 0;
            }

            loadNextTexture.bind(this)();
        }

        // Load prev textures
        function loadPrevTexture(){
         
            if(this.texturesAR[prevTextureId].hasTexture) return
          
            if(this.texturesAR[prevTextureId].type == 'video'){
             
                this.texturesAR[prevTextureId].hasTexture = true;
               
                prevTextureId --;
                if(prevTextureId < 0){
                    prevTextureId = this.totalItems - 1;
                }

               
                loadPrevTexture.bind(this)();
                return;
            }
            
            prevLoader.load(
                this.texturesAR[prevTextureId].src,
                
                // On load
                onLoaderPrevLoad.bind(this),
                
                // On progress
                undefined,

                // On error
                onPrevError.bind(this)
            )
        }
        
        function onLoaderPrevLoad(image){
            if(this.texturesAR[prevTextureId].hasTexture) return
            this.texturesAR[prevTextureId].hasTexture = true;
            this.texturesAR[prevTextureId].width = image.naturalWidth;
            this.texturesAR[prevTextureId].height = image.naturalHeight;
            this.texturesAR[prevTextureId].texture.image= image;
         
            prevTextureId --;
            
            if(prevTextureId < 0){
                prevTextureId = this.totalItems - 1;
            }
        
            loadPrevTexture.bind(this)();
        }
    }


    /**
     * Check if all textures are loaded.
     */
    checkIfAllTexturesAreLoaded(){
           
        this.checkLoadedTexturesI = setInterval(() => {
            let texturesLoaded = true;
            this.texturesAR.forEach((element, index) => {
                if(!this.texturesAR[index].hasTexture){
                    texturesLoaded = false;
                }
            });
            

            // All textures are loaded
            if(texturesLoaded){
               
                this.texturesAR.forEach((element, index) => {
                 
                    const texture = this.texturesAR[index].texture;

                    const imageBitmap = texture.image;

                    // Calculate scaled dimensions.
                    const scaledWidth = this.controlsImageHeight * ((this.itemWidth +0.2)/this.itemHeight);
                    const scaledHeight = this.controlsImageHeight;
               
                    // Create a canvas with the new dimensions.
                    const canvas = document.createElement('canvas');
                    canvas.width = scaledWidth;
                    canvas.height = scaledHeight;
                    
                    // Get the 2D drawing context and draw the image.
                    const ctx = canvas.getContext('2d');
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(imageBitmap, 0, 0, scaledWidth, scaledHeight);
                    
                    // Save the canvas in the textures array.
                    this.texturesAR[index].canvas = canvas;
                  
           
                });


                this.dispatchEvent(FWDLSData.READY);
                clearInterval(this.checkLoadedTexturesI);
            }
        }, 10);
    }


    /**
     * Destroy.
     */
    destroy(){
        if(this.destroyed) return;
        clearInterval(this.checkLoadedTexturesI);

    }
}