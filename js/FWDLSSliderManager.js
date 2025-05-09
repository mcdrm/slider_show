/**
 * Linear Slider PACKAGED v:1.0
 * Slider manager.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDLSDisplayObject from "./FWDLSDisplayObject";
import * as FWDLS_THREE from 'three';

import fragment from "./shader/fragment.glsl";

import sliderVertex from "./shader/sliderVertex.glsl";

import gridFragment from "./shader/gridFragment.glsl";
import vertexSimple from "./shader/vertexSimple.glsl";
import rippleFragment from "./shader/rippleFragment.glsl";
import finalSeneFragment from "./shader/finalSeneFragment.glsl";
import glitchFragment from "./shader/glitchFragment.glsl";
import waveFragment from "./shader/waveFragment.glsl";
import buldgeFragment from "./shader/buldgeFragment.glsl";
import rippleDistortionFragment from "./shader/rippleDistortionFragment.glsl";


import { GUI } from "dat.gui";
import FWDLSUtils from "./FWDLSUtils";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import Stats from 'stats.js';
import { OrbitControls } from "three/examples/jsm/Addons.js";


export default class FWDLSSliderManager extends FWDLSDisplayObject{

    static ERROR = 'error';
    static FIRST_IMAGE_LOADED = 'firstImageLoaded';
    static TEXTURES_LOADED = 'texturesLoaded';
    static ITEM_UPDATE = 'itemUpdate';


    /*
     * Initialize
     */
    constructor(prt){

        super();
        

        // Main
        this.prt = prt;
        this.style.overflow = 'visible';
        this.mainHolderDO = new FWDLSDisplayObject('div');
        this.mainHolderDO.style.overflow = 'visible';
        this.addChild(this.mainHolderDO);
        this.screen.className = 'fwdss-mesh-manager';
    
        this.data = this.prt.data;
        this.width = this.prt.width;
        this.height = this.prt.height;
        this.fontIcon = prt.fontIcon;
        this.screen.className = 'fwdls-manager';
        this.style.overflow = 'visible';
        

        // 3D
        this.texturesAR = this.data.texturesAR;
        this.clock = new FWDLS_THREE.Clock();
        this.oldElapsedTime = 0;
        this.totalItems = this.texturesAR .length;
        this.sliderData = this.data.sliderData;
        this.curId = 0;
        this.lastTime = 0;
        this.isDragging = false;
        this.destination = {x:0, y:0};
        this.cameraZ = 2;
        this.time = 0;
        this.isPlaying = true;
        this.isMobile = FWDLSUtils.isMobile;
        this.minimized = true;
        this.wasMinimized = this.minimized;
        this.isClickedNextItem = 0;
        this.tempOffsetBase = 0;
     

        // Scene
        this.scale = 1;
        this.renderer = new FWDLS_THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
           
            powerPreference: "high-performance"});
        this.pixelRatio =(Math.min(window.devicePixelRatio, 2));
    
        this.renderer.setPixelRatio(this.pixelRatio);
      
        this.renderer.setClearColor(0x000000, 0);
        this.mainHolderDO.screen.appendChild(this.renderer.domElement);
      
        this.camera = new FWDLS_THREE.PerspectiveCamera( 70, this.width/this.height, 0.1, 20 );
        this.camera.position.z = this.cameraZ;
        
        this.scrollSpeedStrength = this.data.scrollSpeedStrength;
        this.curveDistortionStrength = this.data.curveDistortionStrength;
        
        this.currentWave = 0;
        this.showStats = this.data.showStats;
        this.showGUI = this.data.showGUI;
        this.useIntro = this.data.useIntro;

        this.scrollBendStrength = this.data.scrollBendStrength;
        this.afterImage = this.data.afterImage;
        this.afterImageDumping = this.data.afterImageDumping;
        this.useBlackAndWhite = this.data.useBlackAndWhite;
        this.infinite = this.data.infinite; 
        this.opacityStrength = this.data.opacityStrength;
        this.showMaskGradient = this.data.showMaskGradient;
        this.positionX = 0;
     
        this.mouse = {
            x: 0,
            y: 0,
            vX: 0,
            vY: 0,
            prevX: 0,
            prevY: 0,
        };
        this.prevMouse = { x: 0, y: 0 };

        this.rippleMouse = { x: 0, y: 0 };
        this.rippleMousePrev = { x: 0, y: 0 };

        this.showHorizontalAtLestThanWidth = this.data.showHorizontalAtLestThanWidth;
        this.horizontalX = this.data.horizontalX;
        this.horizontalY = this.data.horizontalY;
        this.horizontalZ = this.data.horizontalZ;
        this.horizontalRotationX = this.data.horizontalRotationX;
        this.horizontalRotationY = this.data.horizontalRotationY;
        this.horizontalRotationZ = this.data.horizontalRotationZ;
    
        this.targetSpeed = 0;
        this.targetMouseX = this.mouseX = 0;
        this.targetMouseY = this.mouseY = 0;
        this.speed = 0;
        this.sliderPosition =  this.data.sliderPosition;
        this.minItemScaleX = this.data.minItemScaleX;
        this.maxItemScaleX = this.data.maxItemScaleX;
        this.minItemScaleY = this.data.minItemScaleY;
        this.maxItemScaleY = this.data.maxItemScaleY;
     
        this.verticalX = this.data.verticalX;
        this.defaultOffestX = this.verticalX;
        this.initialWidth = this.prt.maxWidth;
        this.verticalY = this.data.verticalY;
        this.verticalZ = this.data.verticalZ;
        this.verticalRotationX = this.data.verticalRotationX || 0;
        this.verticalRotationY = this.data.verticalRotationY || 0;
        this.verticalRotationZ = this.data.verticalRotationZ || 0;
        this.prevClosestMeshIndex = -1;
        this.basePositionXMaximized = 0;
        this.basePositionXMinimized = 0;

        this.isHorizontal = true;
     
        this.liquidDistortionStrength = this.data.liquidDistortionStrength;
        this.minimizedGap = this.data.gap;
        this.maximizedGap = 0.5;
        this.desiredOffsetBase = undefined;


        
        this.itemWidth = this.data.itemWidth;
        this.itemHeight = this.data.itemHeight;


        // 1) the gap between items when scale = 1
        this.baseGap = this.data.gap;
        this.minGapFactor = 1;
        this.maxGapFactor = 1.05;
        this.baseSpacing = this.itemWidth + this.baseGap;
        this.offsetBase = 0;

       
        // Initialize all...
        this.setupRippleFBO();
        this.addMeshes();
        this.setupGradients();
        this.setupCaption();
        this.setupGrid();
        this.addPostProcessing();
      
        this.addDragEvent();
        this.addMouseMoveEvent();   
        this.setupGUI();
        this.setupStats();

        this.startIntro();
        this.resize();
        this.play();
      
       //this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    }

      
    /**
     * Start intro.
     */
    startIntro() {
      //  this.introRunning = true;
    
        setTimeout(() => {
            if (this.destroyed) return;
    
            if(this.isInfinite){
                this.goToItem(Math.floor(this.totalItems / 2) + 1, false);
                this.goToItem(0, true, 4);
            }
          
            this.captionOpacity = 0;

                FWDAnimation.to(this, 2, {
                    captionOpacity: 1
                });
           
    
        }, 200);
    
        this.style.cursor = 'grab';
    }

    /**
     * Setup gradiennts
     */
    setupGradients(){


        // Convert background color to RGB
        const rgbColor = FWDLSUtils.convertToRGB(this.prt.backgroundColor);

        
        // Create top gradient overlay
        this.topGradient = document.createElement("div");
        this.topGradient.style.position = "absolute";
        this.topGradient.style.top = "0";
        this.topGradient.style.left = "0";
        this.topGradient.style.width = "100%";
        this.topGradient.style.height = "50px";
        this.topGradient.style.background = `linear-gradient(to bottom, rgba(${rgbColor}, 1), rgba(${rgbColor}, 0))`;
        

        // Create bottom gradient overlay
        this.bottomGradient = document.createElement("div");
        this.bottomGradient.style.position = "absolute";
        this.bottomGradient.style.bottom = "0";
        this.bottomGradient.style.left = "0";
        this.bottomGradient.style.width = "100%";
        this.bottomGradient.style.height = "50px";
        this.bottomGradient.style.background = `linear-gradient(to top, rgba(${rgbColor}, 1), rgba(${rgbColor}, 0))`;
        

        if(this.showMaskGradient){
            this.mainHolderDO.screen.appendChild(this.topGradient);
            this.mainHolderDO.screen.appendChild(this.bottomGradient);
        }
    }

    /**
     * Update gradient mask visiblity
     */
    updateMaskGradient(){
        if(this.showMaskGradient){
            this.mainHolderDO.screen.appendChild(this.topGradient);
            this.mainHolderDO.screen.appendChild(this.bottomGradient);
        }else{
            this.mainHolderDO.screen.removeChild(this.topGradient);
            this.mainHolderDO.screen.removeChild(this.bottomGradient);
        }
    }


    /**
     * Setup caption
     */
    setupCaption(){
        this.useCaption = this.data.useCaption;
        this.captionPosition = this.data.captionPosition;
        this.captionDO = new FWDLSDisplayObject('div');
        this.captionDO.style.opacity = 0;
        
        this.captionDO.screen.className = 'fwdls caption vertical';
    
        this.captionDO.screen.userSelect = 'none';
        
  
        this.captionDO.style.top = '0px';
        this.captionDO.style.display = 'inline-block'
        this.captionDO.y = -5000;
        

        this.mainHolderDO.addChild(this.captionDO);

        setTimeout(() => {
        
            this.prt.mainDO.screen.className = 'fwdls horizontal';
            this.captionDO.screen.className = 'fwdls caption horizontal';

            if (this.prt.buttonsManagerDO) {
                this.prt.buttonsManagerDO.btnContainerDO.style.visibility = 'hidden';
            }
         
        },50);
    }
    

    /**
     * Update vertical caption
     */
    updateVerticalCaption() {
        this.textOpacity = FWDLSUtils.remap(this.textOpacity, 0.6, 1, 0, 1);
        this.extraCaptionHeight = 0;
    
        this.currentMesh = this.hitMeshesAR[this.closestMeshIndex];
        let captionHTML = this.sliderData[this.currentMesh.meshId].caption;
        this.currentMesh.url = this.sliderData[this.currentMesh.meshId].url;
        this.currentMesh.target = this.sliderData[this.currentMesh.meshId].target;
    
        if (this.currentMesh.meshId !== this.prevCaptionMeshId) {
            this.curTextId = this.currentMesh.meshId;
            this.captionDO.innerHTML = captionHTML;
            this.prevCaptionY = null;
            this.captionReady = false;
    
            requestAnimationFrame(() => {
                this.captionReady = true;
            });
        }
    
        this.captionDO.style.opacity = this.textOpacity * this.captionOpacity;
    
        if (captionHTML && this.captionReady) {
            const currentMeshPosition = FWDLSUtils.getMeshScreenPosition(
                this.currentMesh,
                this.camera,
                this.renderer
            );
    
            const currentMeshPXSize = FWDLSUtils.getMeshSizeInPX(
                this.itemWidth,
                this.itemHeight,
                this.horizontalZ,
                this.camera,
                this.renderer
            );
    
            const captionRect = this.captionDO.rect;
    
            // Compute base mesh Y in container space
            let meshY = currentMeshPosition.y - this.prt.globalY;
    
            // Remap Y: from full container height to a visual range (-50 to 50)
            let remappedY = FWDLSUtils.remap(meshY, 0, this.height, -50, 50);
    
            // Center the caption vertically
            const posY = remappedY - captionRect.height / 2 + this.height / 2;
    
            if (
                this.prevCaptionY == null ||
                this.prt.isResizing ||
                Math.abs(posY - this.prevCaptionY) > 1
            ) {
                this.prevCaptionY = posY;
            }
    
            this.captionDO.style.transform = `translate(0px, ${Math.floor(this.prevCaptionY)}px)`;
        }
    
        this.prevCaptionMeshId = this.currentMesh.meshId;
    }
    


    /**
     * Update horizontal caption
     */
    updateCaption() {
        return;
        //if(this.introRunning) return;
        // this.textOpacity = FWDLSUtils.remap(this.textOpacity, 0.85, 1, 0, 1);
        // this.extraCaptionHeight = 0;
    
        // this.currentMesh = this.hitMeshesAR[this.closestMeshIndex];
        // let captionHTML = this.sliderData[this.currentMesh.meshId].caption;
        // this.currentMesh.url = this.sliderData[this.currentMesh.meshId].url;
        // this.currentMesh.target = this.sliderData[this.currentMesh.meshId].target;
    
        // if (this.currentMesh.meshId != this.prevCaptionMeshId) {
        //     this.curTextId = this.currentMesh.meshId;
        //     this.captionDO.innerHTML = captionHTML;
        //     this.prevCaptionY = null;
        //     this.captionReady = false;
    
        //     // Allow layout to reflow before measuring
        //     requestAnimationFrame(() => {
        //         this.captionReady = true;
        //     });
        // }
    
        // const currentMeshPosition = FWDLSUtils.getMeshScreenPosition(
        //     this.currentMesh,
        //     this.camera,
        //     this.renderer
        // );
    
        // const currentMeshPXSize = FWDLSUtils.getMeshSizeInPX(
        //     this.itemWidth,
        //     this.itemHeight,
        //     this.horizontalZ,
        //     this.camera,
        //     this.renderer
        // );
      
    
        // this.captionDO.style.opacity = this.textOpacity * this.captionOpacity;
    
        // if (captionHTML ) {

        //     this.overwriteCaptionPostion = false;
        //     const captionRect = this.captionDO.rect;
    
        //     let meshX = currentMeshPosition.x - this.prt.globalX;
        //     let remappedX = FWDLSUtils.remap(meshX, 0, this.width, -50, 50);
        //     let posX = remappedX - captionRect.width / 2 + this.width / 2;

        //     if(!this.curPosY || this.prt.isResizing){
        //         this.curPosY = currentMeshPosition.y - this.prt.globalY;
        //     }
    
    
        //     const newPosY = Math.round(
        //         this.curPosY +
        //         currentMeshPXSize.height / 2
        //     );
    
        //     const yThreshold = 50;
        //     const meshChanged = this.currentMesh.meshId !== this.prevCaptionMeshId;
            
         
        //     // Only update Y if mesh changed, we're resizing, or there's a large shift AND slider is idle
        //     const canUpdateY =
        //         this.prevCaptionY == null ||
        //         this.prt.isResizing ||
        //         meshChanged ||
        //         (this.prt.isSliderIdle && Math.abs(newPosY - this.prevCaptionY) > yThreshold);
            
        //     if (canUpdateY) {
        //         this.prevCaptionY = newPosY;
        //     }
    
        //     this.captionDO.style.transform = `translate(${posX}px, ${this.prevCaptionY}px)`;
    
        //     let extraHeight = captionRect.bottom - this.prt.resizeHeight - this.prt.globalY;         
    
        //     const targetHeight = this.prt.resizeHeight + extraHeight;
    
        //     let newHeight = 0;
    
        //     if (this.prt.isResizing) {
        //         newHeight = targetHeight;                 // ✅ Instant change during resize
        //         this.pixelRemainder = 0;                  // ✅ Clear any lingering smoothing
        //     } else {
        //         const lerpFactor = 0.2;
        //         newHeight = this.prt.mainDO.height +
        //             (targetHeight - this.prt.mainDO.height) * lerpFactor;
                
        //     }
    
        //     const roundedHeight = Math.round(newHeight);
  
    
        //     if (this.isMobile) {
        //         if (Math.abs(newHeight - this.prt.mainDO.height) > 1) {
        //             this.prt.stageContainer.style.height = `${roundedHeight}px`;
        //             this.prt.mainDO.height = newHeight;
        //         }
        //     } else {
        //         this.prt.stageContainer.style.height = `${roundedHeight}px`;
        //         this.prt.mainDO.height = newHeight;
        //     }
        // }
    
        // this.prevCaptionMeshId = this.currentMesh.meshId;
    }
    
    

 
    /**
     * Update geometry if ratio is used
     */
    updateMeshesGeometry(){ 
        if(!this.meshesAR){
            return;
        } 
        
        this.meshesAR.forEach(({ mesh, hitMesh }, index) => {
            hitMesh.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
        });
        
    }


    /**
     * Open url on window click.
     */
     onWindowClickOpenUrl(e){
        if(this.showCameraTool){
            return;
        }
        
        const wc = FWDLSUtils.getViewportMouseCoordinates(e);
        
        if((!FWDLSUtils.hitTest(this.prt.mainDO.screen, wc.x, wc.y))){
            return;
        }

        if(this.prt.buttonsManagerDO && (FWDLSUtils.hitTest(this.prt.buttonsManagerDO.btnContainerDO.screen, wc.x, wc.y))){
            return;
        }

        if(this.guiDomElement && (FWDLSUtils.hitTest(this.guiDomElement, wc.x, wc.y))){
            return;
        }

        if(this.isGUIOpened){
            return;
        }

        let mesh = null;
        if(this.currentHoveredMesh){
            mesh = this.meshesAR[this.currentHoveredMesh.meshId].mesh;
        }
       
        if(this.currentHoveredMesh && this.currentHoveredMesh.url && !this.isDragging && !this.introRunning && this.positionSpeed < 0.01){
          
            if(this.currentHoveredMesh.meshId ==  this.closestMeshIndex
                && mesh.material.uniforms.uVisibility.value >= 0.98
                && !this.minimized
            ){
                window.open(this.currentHoveredMesh.url, this.currentHoveredMesh.target);
            }else{
                this.hoverdId = this.currentHoveredMesh.meshId;
                this.minimized = false;
              
                this.goToItem(this.hoverdId, true, 1.5,  true);
            }
        }
    }


    /**
     * Add mehes to the scene
     */
    addMeshes() {
       
        let dispSrc = './content/disp.png';
        if (this.prt.wpPluginPath) {
            dispSrc = this.prt.wpPluginPath + 'content/disp.png';
        }

        const loader = new FWDLS_THREE.TextureLoader();
        this.displacementTexture = loader.load(dispSrc);
        this.displacementTexture.wrapS = this.displacementTexture.wrapT = FWDLS_THREE.RepeatWrapping;
        this.displacementTexture.magFilter = this.displacementTexture.minFilter = FWDLS_THREE.NearestFilter;
        this.displacementTexture.needsUpdate = true;

        this.raycaster = new FWDLS_THREE.Raycaster();
        this.defaultCurveDistortionStrength = this.data.defaultCurveDistortionStrength;
  
        this.sliderMeshGroup = new FWDLS_THREE.Group();
        this.pivotGroup = new FWDLS_THREE.Group();
        this.pivotGroup.add(this.sliderMeshGroup);
        this.scene.add(this.pivotGroup);

        this.normalSliderMeshGroup = new FWDLS_THREE.Group();
        this.normalSliderMeshGroup.visible = false;
        this.pivotGroup.add(this.normalSliderMeshGroup);

        this.meshesAR = [];
        this.hitMeshesAR = [];

        this.itemWidthRatio = this.data.itemWidthRatio;
        this.itemHeightRatio = this.data.itemHeightRatio;

        if (this.itemWidthRatio) {
            this.itemWidthRatio = parseFloat(this.itemWidthRatio) / 100;
        }
        if (this.itemHeightRatio) {
            this.itemHeightRatio = parseFloat(this.itemHeightRatio) / 100;
        }


        const frustumHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * Math.abs(this.camera.position.z);
        const frustumWidth = frustumHeight * this.camera.aspect;

        const planeSizeInPx = FWDLSUtils.getMeshSizeInPX(this.itemWidth, this.itemHeight, 0, this.camera, this.renderer);

        this.itemWidthInPx = planeSizeInPx.width;
        this.itemHeightInPx = planeSizeInPx.height;

        this.noiseFrequency = this.data.noiseFrequency;
        this.noiseAmplitude = this.data.noiseAmplitude;
        this.noiseSpeed = this.data.noiseSpeed;
        this.bendVertices = this.data.bendVertices;
    
        this.texturesAR.forEach((textureData, index) => {
            const geometry = new FWDLS_THREE.PlaneGeometry(this.itemWidth, this.itemHeight, 50, 50);

            const material = new FWDLS_THREE.ShaderMaterial({
                side: FWDLS_THREE.DoubleSide,
                uniforms: {
                    uBendStrength: { value: 0 },
                    uBendVertices: { value: this.bendVertices },
                    uPosition: { value: 0 },
                    uPositionSpeed: { value: 0 },
                    uDistortion: { value: 0 },
                    uNoiseFrequency: { value: this.noiseFrequency },
                    uNoiseAmplitude: { value: this.noiseAmplitude },
                    uNoiseSpeed: { value: this.noiseSpeed },
                    uTransitionScale: { value: 1},
                    uTime: { value: 0 },
                    uDefaultCurveDistortionStrength: { value: this.defaultCurveDistortionStrength },
                    uMouse: { value: new FWDLS_THREE.Vector2() },
                    uHover: { value: 0 },
                    uOpacity: { value: 0 },
                    uIntroOpacity: { value: 0 },
                    uVisibility: { value: 1 },
                    uIntroTransition: { value: 1 },
                    uTexture: { value: textureData.texture },
                    uResolution: { value: new FWDLS_THREE.Vector2(this.width, this.height) },
                    uQuadSize: { value: new FWDLS_THREE.Vector2(this.itemWidthInPx, this.itemHeightInPx) },
                    uTextureSize: { value: new FWDLS_THREE.Vector2(textureData.width, textureData.height) },
                    uReflectionSplit: { value: 0.5 },
                    uCurveDistortionStrength: { value: 1 },
                },
                vertexShader: sliderVertex,
                fragmentShader: fragment,
                transparent: true,
                depthTest:   false,   // default is true
                depthWrite:  false,   // override default false for transparent
            });

            const mesh = new FWDLS_THREE.Mesh(geometry, material);
            mesh.position.y = index * (this.itemHeight + this.verticalGap);
     
            mesh.isHover = false;
            mesh.meshId = index;


            const normalGeometry = new FWDLS_THREE.PlaneGeometry(this.itemWidth, this.itemHeight, 1, 1);
            const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
            const hitMesh = new FWDLS_THREE.Mesh(
                normalGeometry,
                new FWDLS_THREE.MeshBasicMaterial({ color: `#${randomColor}`, wireframe: true })
            );

            hitMesh.url = this.sliderData[index].url;
            hitMesh.isHover = false;
            hitMesh.target = this.sliderData[index].target;
            hitMesh.meshId = index;

            this.sliderMeshGroup.add(mesh);
          
            this.normalSliderMeshGroup.add(hitMesh);

            this.hitMeshesAR.push(hitMesh);
            this.meshesAR.push({ mesh: mesh, hitMesh: hitMesh });
        });

        setTimeout(() => {
            this.meshesAR.forEach(({ mesh }, index) => {
                const material = mesh.material;
                FWDAnimation.to(material.uniforms.uIntroOpacity, 3, { value: 1});
            });
        }, 10);

        setTimeout(() => {
            if (!this.useIntro) {
                this.introRunning = false;
            }
        }, 2500);


        this.onWindowClickOpenUrl = this.onWindowClickOpenUrl.bind(this);
        window.addEventListener('click', this.onWindowClickOpenUrl);

         // for our manual‐drag override
        this.isManualDragging   = false;
     

        // in constructor:
        this._rawX       = this.positionX || 0;    // true un-scaled offset
        this._rawTargetX = this.positionX || 0;    // where we lerp toward (drag & goToItem)
        this.scaleTarget = 1;                      // lerp targ

    }


   /**
     * On drag move event
     */
    onDragMove(e) {
        if (this.gui && !this.gui.closed) return;
        if (!this.isVerticalScroll) e.preventDefault();

        // get pointer coords
        const wc     = FWDLSUtils.getViewportMouseCoordinates(e);
        const mouseX = wc.x;

        // start dragging
        this.isDragging = true;

        // compute how far pointer moved since last frame
        const delta = mouseX - (this.curDragX || mouseX);

        // on first significant move, enter manual (minimized) mode once
        const movedEnough = Math.abs(delta) > 1;
        if (movedEnough && !this.isManualDragging) {
            FWDAnimation.killTweensOf(this);
            this.isManualDragging = true;
            this.minimized        = true;
            this.desiredPositionX = undefined;
    
            // snapshot old-spacing for ratio drag
            const gap      = this.minimized ? this.minimizedGap : this.maximizedGap;
            const spacing  = (this.itemWidth * this.currentScaleX) + gap;
            this._positionRatio      = this.positionX / spacing;
            this._minimizeOldSpacing = spacing;
        }

        // compute current display spacing so drag feels proportional
        const gapFactor     = this.minimized
            ? this.minimizedGap / this.baseGap
            : this.maximizedGap / this.baseGap;
        const scaleFactor   = this.currentScaleX;
        const displaySpacing = this.baseSpacing * gapFactor * scaleFactor;

        // convert pixel delta → speed increment
        let drag = (delta / displaySpacing) * -0.00002;
        drag     = FWDLS_THREE.MathUtils.clamp(drag, -0.1, 0.1);
        this.curDragX       = mouseX;
        this.positionSpeed += drag;
        this.positionSpeed  = FWDLS_THREE.MathUtils.clamp(this.positionSpeed, -0.2, 0.2);

        // kill any tween so inertia is applied cleanly
        FWDAnimation.killTweensOf(this);
}




  

/**
 * Update position – including smooth goToItem lerp,
 * drag inertia, per-frame gap interp, ratio-drag, mesh positioning, and uniforms.
 */
updatePosition() {
    // common lerp factor
    this.lerpFactor = 0.08;

    // A) Smooth goToItem lerp of offsetBase → desiredOffsetBase
    if (this.desiredOffsetBase !== undefined && !this.isDragging) {
        this.isClickedNextItem += 1;
        this.offsetBase = FWDLS_THREE.MathUtils.lerp(
            // this.offsetBase,
            this.isClickedNextItem > 1 ? this.offsetBase : this.desiredOffsetBase,
            this.desiredOffsetBase,
            this.lerpFactor
        );
        // this.tempOffsetBase = this.offsetBase
        
        if (Math.abs(this.offsetBase - this.desiredOffsetBase) < 0.001) {
            this.offsetBase        = this.desiredOffsetBase;
            this.desiredOffsetBase = undefined;
        }
    }

    if (this.minimized) {
        this.isClickedNextItem = 0;
    }

    // 1) Lerp toward desiredPositionX
    if (this.desiredPositionX !== undefined && !this.isDragging) {
        this.positionX = FWDLS_THREE.MathUtils.lerp(
            this.positionX,
            this.desiredPositionX,
            this.lerpFactor
        );
        if (Math.abs(this.positionX - this.desiredPositionX) < 0.001) {
            this.positionX        = this.desiredPositionX;
            this.desiredPositionX = undefined;
        }
    }

    // 2) Inertia
    if (!FWDAnimation.isTweening(this)) {
        this.positionX     -= this.positionSpeed * 6450 * this.scrollSpeedStrength * this.deltaTime;
        this.positionSpeed *= Math.pow(0.97, this.deltaTime * 120);
    }

    // 3) Scale lerping
    const targetScaleX = this.minimized ? this.minItemScaleX : this.maxItemScaleX;
    const targetScaleY = this.minimized ? this.minItemScaleY : this.maxItemScaleY;

    this.currentScaleX = FWDLS_THREE.MathUtils.lerp(
        this.currentScaleX || 1,
        targetScaleX,
        this.minimized ? this.lerpFactor * 5 : this.lerpFactor
    );
    this.currentScaleY = FWDLS_THREE.MathUtils.lerp(
        this.currentScaleY || 1,
        targetScaleY,
        this.minimized ? this.lerpFactor * 5 : this.lerpFactor
    );

    // B) Per-frame gap interpolation
    const t = (this.currentScaleX - this.minItemScaleX) /
              (this.maxItemScaleX - this.minItemScaleX);
    const gapFactor    = FWDLS_THREE.MathUtils.lerp(this.minGapFactor, this.maxGapFactor, t);
    const scaleFactor  = this.currentScaleX;
    const displaySpacing = this.baseSpacing * gapFactor * scaleFactor;
    this.totalWidth     = displaySpacing * this.texturesAR.length;

    // 4) Ratio-based dragging through minimize (only when user not dragging)
    if (this.isManualDragging && !this.isDragging && this._positionRatio !== undefined) {
        const denom = this._minimizeOldSpacing !== undefined
            ? this._minimizeOldSpacing
            : this.baseSpacing;

        const deltaRatio = (this.positionSpeed * 350 * this.scrollSpeedStrength * this.deltaTime) / denom;
        this._positionRatio -= deltaRatio;

        this.positionX = this._positionRatio * this.baseSpacing;

        if (Math.abs(this.currentScaleX - targetScaleX) < 0.001) {
            this._positionRatio      = undefined;
            this._minimizeOldSpacing = undefined;
        }
    }

    // 5) Update mesh positions + uniforms
    let minDistance = Infinity;
    this.meshesAR.forEach(({ mesh }, i) => {
        const xUnscaled = (i * this.baseSpacing) + this.offsetBase + this.positionX;
        const displayX  = xUnscaled * gapFactor * scaleFactor;

        mesh.position.x = displayX;
        mesh.position.y = 0;
        this.hitMeshesAR[i].position.x = displayX;

        const dist = Math.abs(displayX);
        if (dist < minDistance) {
            minDistance          = dist;
            this.closestMeshIndex = i;
        }

        const mtl = mesh.material;
        mtl.uniforms.uCurveDistortionStrength.value = Math.abs(this.positionSpeed) * this.curveDistortionStrength;
        mtl.uniforms.uDistortion.value               = this.positionSpeed * -4;
        mtl.uniforms.uTime.value                     = this.time;
        mtl.uniforms.uPositionSpeed.value            = this.positionSpeed * 12;
    });

    // 6) Buttons manager
    if (this.prt.buttonsManagerDO && !this.prt.buttonsManagerDO.isMaximizedDone) {
        this.prt.buttonsManagerDO.setCurrentState(this.closestMeshIndex);
    }

    // 7) Update visuals
    this.updateVisuals();

    // 8) Copy slider meshGroup
    if (this.useCaption) this.updateCaption();
    this.normalSliderMeshGroup.position.copy(this.sliderMeshGroup.position);
    this.normalSliderMeshGroup.rotation.copy(this.sliderMeshGroup.rotation);

    // 9) Dispatch ITEM_UPDATE
    if (this.closestMeshIndex !== this.prevClosestMeshIndex && !this.introRunning) {
        this.dispatchEvent(FWDLSSliderManager.ITEM_UPDATE, { id: this.closestMeshIndex });
    }
    this.prevClosestMeshIndex = this.closestMeshIndex;
}

    /**
     * Go to a specific item based on id
     */
    goToItem(id) {
        if (id < 0 || id >= this.meshesAR.length) return;
    
        // stop any drag/inertia
        this.isDragging    = false;
        this.positionSpeed = 0;
        this.positionX     = 0;
    
        // set a smooth target for offsetBase:
        this.desiredOffsetBase = -id * this.baseSpacing;
        this.closestMeshIndex  = id;
    }


    
    updateVisuals(){
          // === 7. After finding closest
        if (this.prt.buttonsManagerDO && !this.prt.buttonsManagerDO.isMaximizedDone) {
            this.prt.buttonsManagerDO.setCurrentState(this.closestMeshIndex);
        }

        // === 8. Update visuals
        this.meshesAR.forEach(({ mesh }, index) => {
            const hitMesh = this.hitMeshesAR[index];

            const distance    = Math.abs(mesh.position.x);
            const gapVis      = this.minimized ? this.minimizedGap : this.maximizedGap;
            const maxDistance = ((this.itemWidth * this.currentScaleX * 6) + gapVis * 2);
            const normDist    = Math.min(distance / maxDistance, 1);

            if (mesh.material.uniforms.uBendStrength.currentValue === undefined) {
                mesh.material.uniforms.uBendStrength.currentValue = 0;
            }
            const newTargetBent = this.minimized ? 1 : 0;
            const targetBendStrength = FWDLS_THREE.MathUtils.clamp(
                Math.abs(this.positionSpeed * 16 * this.scrollBendStrength),
                0,
                newTargetBent
            );
            mesh.material.uniforms.uBendStrength.currentValue = FWDLS_THREE.MathUtils.lerp(
                mesh.material.uniforms.uBendStrength.currentValue,
                targetBendStrength,
                this.lerpFactor
            );
            mesh.material.uniforms.uBendStrength.value = mesh.material.uniforms.uBendStrength.currentValue;

            let visibility = FWDLS_THREE.MathUtils.smoothstep(1 - normDist, 0, 0.6);
            visibility    *= targetBendStrength * 4.5;

            const baseOpacity = FWDLS_THREE.MathUtils.lerp(this.opacityStrength, 1, visibility);
            const isHover     = !!mesh.isHovered;

            if (mesh.material.uniforms.uVisibility.currentValue === undefined) {
                mesh.material.uniforms.uVisibility.currentValue = visibility;
            }
            const visTarget = this.useBlackAndWhite ? (isHover ? 1 : visibility) : 1;
            mesh.material.uniforms.uVisibility.currentValue = FWDLS_THREE.MathUtils.lerp(
                mesh.material.uniforms.uVisibility.currentValue,
                visTarget,
                this.lerpFactor
            );
            mesh.material.uniforms.uVisibility.value = mesh.material.uniforms.uVisibility.currentValue;

            if (mesh.material.uniforms.uOpacity.currentValue === undefined) {
                mesh.material.uniforms.uOpacity.currentValue = baseOpacity;
            }
            const opacityTarget = isHover ? 1 : baseOpacity;
            mesh.material.uniforms.uOpacity.currentValue = FWDLS_THREE.MathUtils.lerp(
                mesh.material.uniforms.uOpacity.currentValue,
                opacityTarget,
                this.lerpFactor
            );
            mesh.material.uniforms.uOpacity.value = mesh.material.uniforms.uOpacity.currentValue;

            let scale = visibility;
            scale     = FWDLSUtils.remap(scale, 0, 1, 1, 1);
            const scaledX = this.currentScaleX;
            const scaledY = scale * this.currentScaleY;
            hitMesh.scale.set(scaledX, scaledY, 1);
            mesh.scale.set(scaledX, scaledY, 1);

            const order = Math.round((1 - normDist) * 1000);
            mesh.renderOrder    = order;
            hitMesh.renderOrder = order;
            this.renderer.sortObjects = true;

            mesh.material.uniforms.uTransitionScale.value = FWDLSUtils.remap(scale, 0.7, 1, 0.8, 1);

            const quadWidth  = this.itemWidth * scaledX;
            const quadHeight = this.itemHeight * scaledY;
            if (mesh.material.uniforms.uQuadSize) {
                mesh.material.uniforms.uQuadSize.value.set(quadWidth, quadHeight);
            }
            if (mesh.material.uniforms.uResolution) {
                mesh.material.uniforms.uResolution.value.set(quadWidth, quadHeight);
            }
        });
    }

     /** 
     * Add drag event
     */
    addDragEvent() {
        
        this.wc = { x: 0, y: 0 };
        this.positionY = 0;
        
        this.positionSpeed = 0;
        this.isDragging = false;
        this.isVerticalScroll = false;
    
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragMove = this.onDragMove.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.checkDragDirection = this.checkDragDirection.bind(this);
    
        if (this.isMobile) {
            this.prt.mainDO.screen.addEventListener('touchstart', this.onDragStart, { passive: false });
            document.addEventListener('touchend', this.onDragEnd);
        } else {
            this.prt.mainDO.screen.addEventListener('pointerdown', this.onDragStart);
            document.addEventListener('pointerup', this.onDragEnd);
        }
    
        document.body.style.userSelect = 'none';
    }
    
    onDragStart(e) {
        if (this.introRunning) return;
    
        let wc = FWDLSUtils.getViewportMouseCoordinates(e);
        this.lastMouseX = wc.x;
        this.lastMouseY = wc.y;
        this.curDragX = wc.x;
        this.curDragY = wc.y;
        this.isVerticalScroll = false;
        this.isDragging = false;
        this.dragStarted = false;
    
        if (!this.isMobile) {
            this.pointerId = e.pointerId;
            e.target.setPointerCapture(this.pointerId);
        }
    
        if (this.isMobile) {
            window.addEventListener('touchmove', this.checkDragDirection, { passive: false, capture: true });
        } else {
            window.addEventListener('pointermove', this.checkDragDirection, { capture: true });
        }
    
        this.style.cursor = 'grabbing';
    }
    
    checkDragDirection(e) {
        if (this.gui && !this.gui.closed) return;
    
        this.captionDO.style.pointerEvents = 'none';
    
        // ✅ If drag type is explicitly vertical, skip direction check
       
        this.isVerticalScroll = false;

        if (this.isMobile) {
            window.removeEventListener('touchmove', this.checkDragDirection, { capture: true });
            window.addEventListener('touchmove', this.onDragMove, { passive: false, capture: true });
        } else {
            window.removeEventListener('pointermove', this.checkDragDirection, { capture: true });
            window.addEventListener('pointermove', this.onDragMove, { capture: true });
        }
        
    
        // 👇 Original direction-based check for horizontal drag
        let wc = FWDLSUtils.getViewportMouseCoordinates(e);
        let mouseX = wc.x;
        let mouseY = wc.y;
    
        let deltaX = Math.abs(mouseX - this.lastMouseX);
        let deltaY = Math.abs(mouseY - this.lastMouseY);
    
        const threshold = 5;
        if (deltaX < threshold && deltaY < threshold) return;

        this.isDragging = true;
    
        if (deltaY > deltaX) {
            // Allow normal scrolling
            this.isVerticalScroll = true;
            this.isDragging = false;
          
    
            if (this.isMobile) {
                window.removeEventListener('touchmove', this.checkDragDirection, { capture: true });
            } else {
                window.removeEventListener('pointermove', this.checkDragDirection, { capture: true });
            }
        } else {
            // Prevent scrolling during horizontal dragging
            this.isVerticalScroll = false;
            this.isDragging = true;
    
            if (this.isMobile) {
                window.removeEventListener('touchmove', this.checkDragDirection, { capture: true });
                window.addEventListener('touchmove', this.onDragMove, { passive: false, capture: true });
            } else {
                window.removeEventListener('pointermove', this.checkDragDirection, { capture: true });
                window.addEventListener('pointermove', this.onDragMove, { capture: true });
            }
        }
    }
    
    onDragEnd(e) {
        setTimeout(() => {
            this.isDragging = false;
        }, 10);

        this.isManualDragging = false;

      
        this.style.cursor = 'grab';
        this.captionDO.style.pointerEvents = 'auto';
    
        if (!this.isMobile) {
            try {
                e.target.releasePointerCapture(this.pointerId);
            } catch (e) {}
        }
    
        if (this.isMobile) {
            window.removeEventListener('touchmove', this.onDragMove, { passive: false, capture: true });
            window.removeEventListener('touchmove', this.checkDragDirection, { passive: false, capture: true });
        } else {
            window.removeEventListener('pointermove', this.onDragMove, { capture: true });
            window.removeEventListener('pointermove', this.checkDragDirection, { capture: true });
        }
    }



    
    /*
     * Resize.
     */
    resize(width, height){    

        // Resize camera
        if(width & height){
            this.width = width;
            this.height = height;
        }

        this.mainHolderDO.width = this.width;
        this.mainHolderDO.height = this.height;

        
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.offsetRatio =  (this.initialWidth/this.width);

        if(this.width <= 1500){
            this.offsetRatio = this.offsetRatio * 0.9;
        }
        
        if(this.width <= 1400){
            this.offsetRatio = this.offsetRatio * 0.9;
        }

        // Grid distortion
        if(this.grid){
            this.regenerateDistiortionGrid();
        }


        // Ripple FBO
        if(this.sceneWebGL){
            this.sceneWebGL.setSize(this.width, this.height);
            this.rippleWebGL.setSize(this.width, this.height);
            this.resizeMesh(this.rippleMesh, this.width, this.height, this.cameraZ);
        }


        // Post processing
        if(this.composer){
            this.buldgePass.uniforms.uResolution.value = new FWDLS_THREE.Vector2(this.width, this.height);

            this.rippleDistortionPass.uniforms.uQuadSize.value = new FWDLS_THREE.Vector2(this.width, this.height);

            this.smaaPass.setSize(this.width * this.pixelRatio, this.height * this.pixelRatio);

            this.composer.setSize(this.width, this.height);
        }

        if (this.composer && this.composer.renderTarget1) {
            this.composer.renderTarget1.setSize(this.width, this.height);
            this.composer.renderTarget2.setSize(this.width, this.height);
        }

        if(this.wavePass) {
            this.wavePass.uniforms.resolution.value.set(this.width, this.height);
        }
        
        if(this.glitchPass) {
            this.glitchPass.uniforms.uResolution.value.set(this.width, this.height);
        }
        
        if(this.gridEffect) {
            this.gridEffect.uniforms.uQuadSize.value.set(this.width, this.height);
        }
        
        if(this.rippleDistortionPass) {
            this.rippleDistortionPass.uniforms.uQuadSize.value.set(this.width, this.height);
        }
        
        if(this.buldgePass) {
            this.buldgePass.uniforms.uResolution.value.set(this.width, this.height);
        }
        
        if(this.smaaPass) {
            this.smaaPass.material.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
        }


        this.updateSliderPosition();

        this.camera.updateProjectionMatrix();

        this.updateMeshesGeometry();

        
        // GUI fix!
        this.setGUIHeight();


    }
    

    /**
     * Update crousel position roation
     */
    updateSliderPosition() {
        if (!this.pivotGroup || !this.sliderMeshGroup) return;
          
        this.pivotGroup.position.set(this.horizontalX, this.horizontalY, this.horizontalZ);
        this.pivotGroup.rotation.set(this.horizontalRotationX, this.horizontalRotationY, this.horizontalRotationZ);

        this.meshesAR.forEach(({ mesh }) => {
            if (mesh.material.uniforms.uIsHorizontal !== undefined) {
                mesh.material.uniforms.uIsHorizontal.value = 1;
            }
        });
    
        // Toggle GUI folders
        if (this.verticalFolder) {
            this.verticalFolder.close();
            this.setFolderEnabled(this.verticalFolder, false);
        }
        if (this.horizontalFolder) {
            this.horizontalFolder.open();
            this.setFolderEnabled(this.horizontalFolder, true);
        }
            
    }


    /**
     * Setup ripple FBO
     */
    setupRippleFBO(){
        
        if(this.sceneMesh) return;


        const renderTargetOptions = {
            format: FWDLS_THREE.RGBAFormat,
            minFilter: FWDLS_THREE.LinearFilter,
            magFilter: FWDLS_THREE.LinearFilter,
            depthBuffer: true,
            stencilBuffer: false,
            
        };

        this.sceneWebGL = new FWDLS_THREE.WebGLRenderTarget(this.width * this.pixelRatio, this.height * this.pixelRatio, renderTargetOptions);
        this.rippleWebGL = new FWDLS_THREE.WebGLRenderTarget(this.width * this.pixelRatio, this.height * this.pixelRatio, renderTargetOptions);


        // Load brush texture
        let brushSrc = './content/brush.png';
        if(this.prt.wpPluginPath){
            brushSrc = this.prt.wpPluginPath + 'content/brush.png';
        }
        const loader = new FWDLS_THREE.TextureLoader();
        this.brushTexture = loader.load(brushSrc);
       

        // Scene FBO
        this.scene = new FWDLS_THREE.Scene();

        this.sceneMaterial = new FWDLS_THREE.ShaderMaterial({
            side: FWDLS_THREE.DoubleSide,
            uniforms: {
                uTexture: { value: null } // Correctly defined uniform
            },
            transparent: true, // Moved outside the previous misplaced brackets
            vertexShader: vertexSimple,
            fragmentShader: rippleFragment
        });

        this.sceneMesh = new FWDLS_THREE.Mesh(
            new FWDLS_THREE.PlaneGeometry(1, 1, 1, 1),
            this.sceneMaterial
        );
     
        this.scene.add(this.sceneMesh);


        // Ripple FBO
        this.rippleScene = new FWDLS_THREE.Scene();

        this.rippleMaterial = new FWDLS_THREE.MeshBasicMaterial({
            map: this.brushTexture,
            transparent: true
        });
       
        this.rippleMesh = new FWDLS_THREE.Mesh(
            new FWDLS_THREE.PlaneGeometry(1, 1, 1, 1),
            new FWDLS_THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true
            })
        );
        this.resizeMesh(this.rippleMesh, this.width, this.height, this.cameraZ);
        this.rippleScene.add(this.rippleMesh);
       

        // Add brush
        this.brushMaterial = new FWDLS_THREE.MeshBasicMaterial({
            map: this.brushTexture,
            transparent: true
        });

        this.max = 100;
        const rippleGeometry = new FWDLS_THREE.PlaneGeometry(0.4, 0.4, 1, 1);
        this.sceneMeshesAR = [];
        for(let i = 0; i < this.max; i++){
            let material =  new FWDLS_THREE.MeshBasicMaterial({
                map: this.brushTexture,
                transparent: true,
                blending: FWDLS_THREE.AdditiveBlending,
                depthTest: false,
                depthWrite: false
            });

            let mesh = new FWDLS_THREE.Mesh(
                rippleGeometry,
                material
            );
            
            mesh.visible = false;
            mesh.scale.set(1, 1, 1);
            mesh.rotation.z = 2 * Math.PI/2 * Math.random();
        
            this.sceneMeshesAR.push(mesh);
            this.rippleScene.add(mesh);
        }
   

        // Add a full-screen quad to the final scene
        this.finalScene = new FWDLS_THREE.Scene();
        this.finalMaterial = new FWDLS_THREE.ShaderMaterial({
            uniforms: {
                uSceneTexture: { value: null }, // Scene texture
                uRippleTexture: { value: null }, // Ripple texture
            },
            vertexShader: vertexSimple,
            fragmentShader: finalSeneFragment,
            transparent: true,
        });
       

        this.finalQuad = new FWDLS_THREE.Mesh(
            new FWDLS_THREE.PlaneGeometry(1, 1, 1, 1),
            this.finalMaterial
        );
      
        this.finalScene.add(this.finalQuad);



        this.resize();
    }
    

   
    
    


    /**
     * Add events
     */
    addMouseMoveEvent(){
       
        // Add mouse move
        this.onMouseMove = this.onMouseMove.bind(this);
        window.addEventListener('pointermove', this.onMouseMove);
     
    }

   
    // Distort on mouse move
    onMouseMove(e) {
        this.wc = FWDLSUtils.getViewportMouseCoordinates(e);
        this.wcX = this.wc.x;
        this.wcY = this.wc.y;
    
        
        // Normalize mouse coordinates to the range [0, 1]
        this.targetMouseX = (this.wc.x - this.rect.left) / this.width;
        this.targetMouseY = 1 - (this.wcY - this.rect.top) / this.height;


        // Grid mouse
        if(this.grid){
    
            this.gridMouse.x = ((this.wcX - this.rect.left) - this.width / 2) / (this.width / 2);
            this.gridMouse.y = ((this.wcY  - this.rect.top) - this.height / 2) / (this.height / 2);

            let normX = (this.wcX - this.rect.left) / this.width;
            let normY = (this.wcY - this.rect.top - this.mainHolderDO.y) / this.height;

            this.gridMouse.normX = normX;
            this.gridMouse.normY = normY;

            if (this.hasScrolled) {

                // Gradually ramp up `vX` and `vY` to prevent initial jump
                this.gridMouse.vX = (normX - this.gridMouse.prevX) * 0.01; // Reduced initial value
                this.gridMouse.vY = (normY - this.gridMouse.prevY) * 0.01;
        

                // Turn off the scroll flag after first update to allow normal movement
                this.hasScrolled = false;
            } else {

                // Normal velocity calculation
                this.gridMouse.vX = normX - this.gridMouse.prevX;
                this.gridMouse.vY = normY - this.gridMouse.prevY;
            }

            this.gridMouse.prevX = normX;
            this.gridMouse.prevY = normY;
        }

        this.rippleMouse = {
            x: (this.targetMouseX * 2 - 1),
            y: (this.targetMouseY * 2 - 1) ,
        };
       

        // Create a vector from the normalized mouse position
        this.fixedZ = 0;
        const mouseNDC = new FWDLS_THREE.Vector3(this.rippleMouse.x, this.rippleMouse.y, 0);
       

        // Unproject the NDC vector to world coordinates
        const worldPosition = mouseNDC.clone().unproject(this.camera);


        // Calculate the direction vector from the camera to the unprojected position
        const direction = worldPosition.sub(this.camera.position).normalize();
       

        // Calculate the distance to the desired Z-plane (or a fixed Z depth)
        const distance = (this.fixedZ - this.camera.position.z) / direction.z;
      

        // Compute the final mouse position in world space
        const finalMousePosition = this.camera.position.clone().add(direction.multiplyScalar(distance));


        // Store the final position for later use
        this.rippleMouse = finalMousePosition;       
    }


    /**
     * Raycast meshes to check for hover state
     */
    raycastMehes() {
        if (!this.raycaster || !this.camera || !this.meshesAR || this.meshesAR.length === 0) return;
    
        this.targetMouse = new FWDLS_THREE.Vector2(
            ((this.wc.x - this.rect.x) / this.width) * 2 - 1,
            -((this.wc.y - this.rect.y) / this.height) * 2 + 1
        );
    
        this.raycaster.setFromCamera(this.targetMouse, this.camera);
    
        const meshesToTest = this.normalSliderMeshGroup.children;
        const intersects = this.raycaster.intersectObjects(meshesToTest, true);
    
        if (intersects.length > 0 && !this.isDragging) {
            const intersectedMesh = intersects[0].object;
    
            // If switching layouts, meshId might be stale or missing
            if (intersectedMesh.meshId === undefined || this.meshesAR[intersectedMesh.meshId] === undefined) return;
    
            if (this.hoveredMesh !== intersectedMesh) {
                // Reset hover on previous
                if (this.hoveredMesh && this.curMesh?.material?.uniforms?.uHover) {
                    // FWDAnimation.to(this.curMesh.material.uniforms.uHover, 0.8, {
                    //     value: 0,
                    //     ease: Expo.easeInOut
                    // });
                    this.curMesh.isHovered = false;
                    
                }
    
                this.hoveredMesh = intersectedMesh;
                this.curMesh = this.meshesAR[this.hoveredMesh.meshId].mesh;
             
                this.currentHoveredMesh = this.hoveredMesh;
                this.curMesh.isHovered = true;
                
    
                if (this.hoveredMesh.url && this.curMesh.material.uniforms.uHover !== undefined) {
                    // FWDAnimation.to(this.curMesh.material.uniforms.uHover, 0.8, {
                    //     value: 0.7,
                    //     ease: Expo.easeInOut
                    // });
                }
            }
    
        } else {
            if (this.hoveredMesh && this.curMesh?.material?.uniforms?.uHover) {
                // FWDAnimation.to(this.curMesh.material.uniforms.uHover, 0.8, {
                //     value: 0,
                //     ease: Expo.easeInOut
                // });
                this.curMesh.isHovered = false;
            }

           
          
    
            this.hoveredMesh = null;
            this.curMesh = null;
            this.currentHoveredMesh = undefined;
        }
    }

    
    /**
     * Get mouse speed
     */
    getSpeed() {

        // Easing factor for interpolation (adjust for smoothness)
        const easingFactor = 0.1;
    

        // Smoothly interpolate the current mouse position towards the target
        this.mouse.x += (this.targetMouseX - this.mouse.x) * easingFactor;
        this.mouse.y += (this.targetMouseY - this.mouse.y) * easingFactor;

        this.remappedMouse = {
            x: (this.mouse.x * 2 - 1) * 4,
            y: (this.mouse.y * 2 - 1) * 4,
        };

        if (this.curMesh) {

            // Get current mouse uniform values
            const currentMouse = this.curMesh.material.uniforms.uMouse.value;
        
            
            // Smoothly interpolate between the current and target mouse positions
            const targetMouse = new FWDLS_THREE.Vector2(this.remappedMouse.x, this.remappedMouse.y);
            const lerpFactor = 0.4; // Adjust for smoother or faster transitions (0.1 is slow, 0.5 is faster)
        

            // Apply smooth interpolation
            currentMouse.lerp(targetMouse, lerpFactor);
        

            // Update both meshes' uniforms with the interpolated mouse position
            this.curMesh.material.uniforms.uMouse.value = currentMouse.clone();
          
        }
    

        // Calculate the instantaneous speed (responsive to fast movements)
        const dx = this.mouse.x - this.prevMouse.x;
        const dy = this.mouse.y - this.prevMouse.y;
        const instantaneousSpeed = Math.sqrt(dx ** 2 + dy ** 2);
    

        // Blend the instantaneous speed with the current speed for smoothness
        this.speed += (instantaneousSpeed - this.speed) * 0.05; // Adjust 0.2 for slower ease-back
       
    }


    /**
     * Track ripple mouse postion
     */
    itemMousePosition(){

        if(this.mouseRippleStrength == 0) return;
        
        if(Math.abs(this.rippleMouse.x - this.rippleMousePrev.x) < 0.001
        & Math.abs(this.rippleMouse.y - this.rippleMousePrev.y) < 0.001){
           // nothing...
        }else{

           if(!this.isDragging){
                this.setNewWave(this.rippleMouse.x, this.rippleMouse.y, this.currentWave);
                this.currentWave = (this.currentWave + 1)%this.max;  
            }
           
        }
        this.rippleMousePrev.x = this.rippleMouse.x;
        this.rippleMousePrev.y = this.rippleMouse.y;
    }



    // Set new  ripple wave
    setNewWave(x, y, index) {
        let mesh = this.sceneMeshesAR[index];
    
        mesh.visible = true;
       
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.scale.set(1, 1, 1);
        mesh.material.opacity = 1;
    }


    // Update ripple movement
    updateWaves() {
        if (this.sceneMeshesAR) {
            this.itemMousePosition();
    
            this.sceneMeshesAR.forEach((mesh) => {
                if (mesh.visible) {
                    mesh.rotation.z += 0.025; // Slightly faster rotation for more dynamics


                    let remappedRippleStrength = 1. + (this.mouseRippleStrength * (1.05 - 1.0));
                  

                    // Smooth scaling using easing
                    mesh.scale.x = mesh.scale.y = mesh.scale.x * (0.99 * remappedRippleStrength) + 0.015; // Expand wave
                    mesh.scale.y = mesh.scale.x;
    

                    // Gradual opacity decay
                    mesh.material.opacity *= 0.92;
    

                    // Hide mesh when nearly invisible
                    if (mesh.material.opacity < 0.0000001) {
                        mesh.visible = false;
                        mesh.scale.set(1, 1, 1);
        
                    }
                }
            });
        }
    }


    /**
     * Add post processing
     */
    addPostProcessing(){

        this.introSettings = {
            distortion: 0,
            opacity: 1,
            debug: false
        }
        
        FWDAnimation.to(this.introSettings, 1.6, {
            distortion: 0,
            ease: Expo.easeInOut
        });
       
        FWDAnimation.to(this.introSettings, 0.8, {
            opacity: 1,
            ease: Quint.easeOut
        });


        // Initialize EffectComposer
        this.sceneRenderTarget = new THREE.WebGLRenderTarget(this.width, this.height, {
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType,
            encoding: THREE.sRGBEncoding,
            depthBuffer: false,
            stencilBuffer: false
          });
          
          this.sceneRenderTarget.texture.name = 'EffectComposer.RenderTarget';
          this.sceneRenderTarget.texture.generateMipmaps = false;

        this.composer = new EffectComposer(this.renderer,  this.sceneRenderTarget);
        this.composer.setPixelRatio(this.pixelRatio);
        this.composer.setSize(this.width, this.height);


        // Render pass for the intro scene (background)
        this.scenePass = new RenderPass(this.scene, this.camera);
        this.scenePass.clear = true; // Clear color and depth before rendering the intro scene
        this.composer.addPass(this.scenePass);


        // Custom intro scene effect pass
        this.rgbShiftStrength = this.data.rgbShiftStrength;
        this.waveFrequency = this.data.waveFrequency;
        this.waveAmplitude = this.data.waveAmplitude;

        this.waveEffect = {
            uniforms: {
                tDiffuse: { value: null },
                uOpacity: { value: 1.0 },
                resolution: { value: new FWDLS_THREE.Vector2(this.width, this.height) },
                uTime: { value: 0 },
                uDistortion: { value: 0 },
                uRGBOffsetStrength: { value: this.rgbShiftStrength },
                uWaveFrequency: { value: this.waveFrequency },
                uWaveAmplitude: { value: this.waveAmplitude },
            },
            vertexShader: vertexSimple,
            fragmentShader: waveFragment,
        };
        this.wavePass = new ShaderPass(this.waveEffect);
        this.wavePass.renderToScreen = true;
        this.composer.addPass(this.wavePass);


        // Buldge pass
        this.buldge = this.data.buldge;
        this.buldgeStrength = this.data.buldgeStrength;
        this.buldgeDirection = this.data.buldgeDirection;
        this.buldgeFixed = this.data.buldgeFixed;

        const buldgeShader = {
            uniforms: {
                tDiffuse: { value: null }, // The input texture
                uTime: { value: 0.0 },
                uuBuldgeRGBStrength: { value: 1 }, // Strength of the buldge effect
                uBulgeStrength: { value: 1 }, // Strength of the buldge effect
                uResolution: { value: new FWDLS_THREE.Vector2(this.width, this.height) }
            },
            vertexShader: vertexSimple,
            fragmentShader: buldgeFragment
        };
        
        this.buldgePass = new ShaderPass(buldgeShader);
        if(this.buldge){
          this.composer.addPass(this.buldgePass);
        }


        // Glitch pass
        this.glitch = this.data.glitch;
        this.glitchPass = new ShaderPass(new FWDLS_THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                uTime: { value: 0 },
                uResolution: { value: new FWDLS_THREE.Vector2(this.width, this.height) },
            },
            vertexShader: vertexSimple,
            fragmentShader: glitchFragment,
            transparent: true
        }));

        if(this.glitch){
            this.composer.addPass(this.glitchPass);
        }


        // Add ripple distortion
        this.rippleDistortion = this.data.rippleDistortion;
        this.rippleDistortionStrength = this.data.rippleDistortionStrength;
        this.rippleDistortionSize = this.data.rippleDistortionSize;
        this.rippleDistortionPass = new ShaderPass(new FWDLS_THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                uDistortionTexture: { value: this.displacementTexture },
                uDistortionTextureSize: { value: new FWDLS_THREE.Vector2(257, 257) },
                uLiquidDisotrionStrength: { value: this.rippleDistortionStrength },
                uDistortionSize: { value: this.rippleDistortionSize},
                uDistortion: { value: 1 },
                uOpacity: { value: 1 },
                uTime: { value: 0 },
                uQuadSize: { value: new FWDLS_THREE.Vector2(this.width, this.height) },
            },
            vertexShader: vertexSimple,
            fragmentShader: rippleDistortionFragment,
            transparent: true
        }));
       
        if(this.rippleDistortion){
           this.composer.addPass(this.rippleDistortionPass);
        }


        // Whater texture pass
        this.gridEffect = new FWDLS_THREE.ShaderMaterial({
            uniforms: {
                'tDiffuse': { value: null },
                'uDisplacement': { value: this.gridDispalcementTexture },
                'uIntensity': { value: 1},
                'uAddRGBDistortion': {value: this.gridAddRGBDistortion},
                'uTime': { value: 0.0 },
                'uProgress': { value: 0.0},
                'uQuadSize': { value: new FWDLS_THREE.Vector2(this.width, this.height)}
            },
            vertexShader: vertexSimple,
            fragmentShader: gridFragment
        });
        this.gridDistortionPass = new ShaderPass(this.gridEffect);

        if(this.grid){
            this.composer.addPass(this.gridDistortionPass);
        }
        
        // Afterimage pass
        this.afterimagePass = new AfterimagePass();
        this.afterimagePass.uniforms['damp'].value = this.afterImageDumping;
        if(this.afterImage){
            this.composer.addPass(this.afterimagePass);
        }


        //  Ripple pass
        this.mouseRippleStrength = this.data.mouseRippleStrength;
        this.rippleStrength = this.data.rippleStrength;
        this.ripplePass = new ShaderPass(new FWDLS_THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                uRippleTexture: { value: this.rippleWebGL.texture } // Ripple texture
            },
            vertexShader: vertexSimple,
            fragmentShader: finalSeneFragment,
            transparent: true
        }));
        this.composer.addPass( this.ripplePass);


        // Anitialiasing
        this.antialias = this.data.antialias;
        this.smaaPass = new ShaderPass(FXAAShader);
        this.smaaPass.material.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
        if(this.antialias){
          this.composer.addPass(this.smaaPass);
        }

      
    }

    
    /**
     * Setup grid for postporcessing
     */
    setupGrid(){
        this.grid = this.data.grid;
        this.gridSize = this.data.gridSize;
        this.gridAddRGBDistortion = this.data.gridAddRGBDistortion;
        this.gridMouseRadiusFactor =  this.data.gridMouseRadiusFactor;
        this.gridMouseStrengthFactor = this.data.gridMouseStrengthFactor;
        this.gridMouseRelaxation = this.data.gridMouseRelaxation;

        this.gridMouse = {
            x: 0,
            y: 0,
            normX: 0,
            normY: 0,
            prevX: 0,
            prevY: 0,
            vX: 0,
            vY: 0,
        };
       
    }


    // Regenerate the distortion grid
    regenerateDistiortionGrid() {
        this.size = this.gridSize;
        

        // Adjust the grid size based on aspect ratio
        const aspect = this.height / this.width;
        const width = this.size;
        const height = Math.floor(this.size * aspect); // Adjust height based on aspect ratio
        
        const size = width * height;
        let data = new Float32Array(4 * size); // 4 channels per pixel
    
        for (let i = 0; i < size; i++) {
            let red = Math.random() * 255 - 125;
            const stride = i * 4;
            
            data[stride] = 0;      // Red channel
            data[stride + 1] = 0;  // Green channel
            data[stride + 2] = 0;  // Blue channel
            data[stride + 3] = 1.0; // Alpha channel (full opacity)
        }
    
        this.gridDispalcementTexture = new FWDLS_THREE.DataTexture(
            data,
            width,
            height,
            FWDLS_THREE.RGBAFormat,
            FWDLS_THREE.FloatType
        );
    
        this.gridDispalcementTexture.magFilter = FWDLS_THREE.NearestFilter;
        this.gridDispalcementTexture.minFilter = FWDLS_THREE.NearestFilter;
    
        this.gridDistortionPass.uniforms.uDisplacement.value = this.gridDispalcementTexture;
        this.gridDispalcementTexture.needsUpdate = true;
    }
    

    // Update data texture with improved Y-axis calculation
    updateDistortionData() {
        let data = this.gridDispalcementTexture.image.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] *= this.gridMouseRelaxation;
            data[i + 1] *= this.gridMouseRelaxation;
        }
    

        // Calculate grid dimensions and aspect
        let aspect = this.height / this.width;
        let gridWidth = this.size;
        let gridHeight = Math.floor(this.size * aspect);
      
    
        // Map normalized gridMouse position to grid coordinates
        let gridgridMouseX = this.gridMouse.normX * (gridWidth - 1);  // Ensures it's within bounds
        let gridgridMouseY = (1 - this.gridMouse.normY) * (gridHeight - 1); // Y-axis inverted
     
        let maxDist = this.size * this.gridMouseRadiusFactor;
        let maxDistSq = maxDist ** 2;

        for (let i = 0; i < gridWidth; i++) {
            for (let j = 0; j < gridHeight; j++) {
                // Calculate the squared distance from the gridMouse position
                let dx = gridgridMouseX - i;
                let dy = gridgridMouseY - j;
                let distance = dx * dx + dy * dy;
              
                if (distance < maxDistSq) {
                    let index = 4 * (i + gridWidth * j);
                    let power = maxDist / Math.sqrt(distance);
                    power = FWDLSUtils.clamp(power, 0, 10);
    
                    data[index] += this.gridMouseStrengthFactor * 8 * this.gridMouse.vX * power;
                    data[index + 1] -= this.gridMouseStrengthFactor * 8 * this.gridMouse.vY * power;
                }
            }
        }
    
        this.gridMouse.vX *= 0.9;
        this.gridMouse.vY *= 0.9;

      
        this.gridDispalcementTexture.needsUpdate = true;
    }


    /**
     * Play pause videos
     */
    pausePlayVideos(stop){
        clearTimeout(this.puaseAllVideosTO);
        if(!this.texturesAR) return;
        
        this.texturesAR.forEach((el, id) => {
            if(el.texture.textureType == 'video'){
                if(stop){
                    let video = el.texture.source.data;
                    video.pause();
                    video.currentTime = 0;
                }else{
                    let video = el.texture.source.data;
                    video.currentTime = 0;
                    video.play().catch(error => {});
                }
            }
        });
    }
    


    /**
      * Render!!!.
      */
    stop() {
        if(!this.isPlaying) return;
        this.isPlaying = false;
        this.pausePlayVideos(true);
        this.resize();
        cancelAnimationFrame(this.RAFid);
    }

    play() {
       
        this.stop();
        this.isPlaying = true;

        this.pausePlayVideos();
        this.render(0);
    }

    render() {
        if (!this.isPlaying) return;
        this.RAFid = requestAnimationFrame(this.render.bind(this));

        this.updateOnRender(); 
    }

    updateOnRender(){
        if (!this.isPlaying) return;


        // Limit FPS
        const fpsInterval = 1000 / 120;
        const fpsRaycasterInterval = 1000 / 20;
        const now = performance.now();
        const fpsDeltaTime = now - this.lastTime;
    
        if (fpsDeltaTime < fpsInterval) {
            return;
        }


        const elapsedTime = this.clock.getElapsedTime();
        this.deltaTime = elapsedTime - this.oldElapsedTime;
        this.oldElapsedTime = elapsedTime;
        this.lastTime = now - (fpsDeltaTime % fpsInterval);
        this.time += this.deltaTime;
        

        // Update mouse speed.
        this.getSpeed();
        

        // Stats.
        if(this.stats){
            this.stats.update();
        }

        if (this.controls) {
            this.controls.update();
        }
        

        // Update rotation and position.
        if(this.sliderMeshGroup){
            this.updatePosition();  
        }
        

        // Update waves.
        this.updateWaves();

        
        // Get ripple texture.
        this.renderer.setRenderTarget(this.rippleWebGL); // Bind the render target
        this.renderer.clear(); // Clear the target
        this.renderer.render(this.rippleScene, this.camera); // Render the ripple scene
        this.renderer.setRenderTarget(null); // Reset to the default render target
      

        
        // Wave pass.
        if(this.wavePass){
            this.wavePass.uniforms.uDistortion.value = this.introSettings.distortion;
            this.wavePass.uniforms.uOpacity.value = this.introSettings.opacity;
            this.wavePass.uniforms.uTime.value = this.time;
            this.wavePass.uniforms.uRGBOffsetStrength.value = (this.positionSpeed * 40) * this.rgbShiftStrength;
        }
        

        // Glitch pass.
        if(this.glitchPass){
            this.glitchPass.uniforms.uTime.value = this.time;
        }


        // Buldge pass.
        if(this.buldgePass){
            this.buldgePass.uniforms.uTime.value = this.time;
          
            if(this.buldgeDirection == 'in'){
                if(this.buldgeFixed){
                    this.buldgePass.uniforms.uBulgeStrength.value = -this.buldgeStrength;
                }else{
                    this.buldgePass.uniforms.uBulgeStrength.value = FWDLS_THREE.MathUtils.clamp(
                        -Math.abs(this.positionSpeed * 8),
                        -this.buldgeStrength,
                        this.buldgeStrength
                    );
                }
            }else if(this.buldgeDirection == 'out'){
                if(this.buldgeFixed){
                    this.buldgePass.uniforms.uBulgeStrength.value = this.buldgeStrength;
                }else{
                    this.buldgePass.uniforms.uBulgeStrength.value = FWDLS_THREE.MathUtils.clamp(
                        Math.abs(this.positionSpeed * 8),
                        -this.buldgeStrength,
                        this.buldgeStrength
                    );
                }
            }else if(this.buldgeDirection == 'both'){
                this.buldgePass.uniforms.uBulgeStrength.value = FWDLS_THREE.MathUtils.clamp(
                    this.positionSpeed * 16,
                    -this.buldgeStrength *16,
                    this.buldgeStrength*16
                );

            }
        }


        // Ripple pass.
        if(this.rippleDistortionPass){
            this.rippleDistortionPass.uniforms.uTime.value = this.time;
        }
     

        // Grid pass.
        if(this.grid){
            this.updateDistortionData();
        }


        // Composer render.
        if(this.composer) {

            // Step 1: Render all your scene and post-processing passes
            this.composer.render();
        }

        
        if (now - this.lastRaycasterTime < fpsRaycasterInterval) {
            return;
        }

        this.raycastMehes();
        this.lastRaycasterTime = now;

    }





    /**
      * Utils.
      */
    resizeMesh(mesh, elementWidth, elementHeight, cameraZ) {
     
    
        // Ensure this.width and this.height exist
        const width = this.width || window.innerWidth;
        const height = this.height || window.innerHeight;
    
        const distance = cameraZ || this.camera.position.z;
        const fovInRadians = (this.camera.fov * Math.PI) / 180; // Convert FOV to radians
        const viewportHeight = 2 * Math.tan(fovInRadians / 2) * distance; // Calculate viewport height in world units
        const viewportWidth = viewportHeight * this.camera.aspect; // Calculate viewport width in world units
    

        // Convert desired pixel dimensions to world units
        const meshWidth = (elementWidth / width) * viewportWidth;
        const meshHeight = (elementHeight / height) * viewportHeight;
    

        // Apply scale to match the desired size
        mesh.scale.set(meshWidth, meshHeight, 1);
    

        // Update mesh properties for reference
        mesh.width = elementWidth;
        mesh.height = elementHeight;
        mesh.viewportWidth = viewportWidth;
        mesh.viewportHeight = viewportHeight;
        
        
        mesh.prevMeshWidth = meshWidth;
        mesh.prevMeshHeight = meshHeight;
    }
    

    positionMesh(mesh, x, y){
    
        const ndcX = ((x + mesh.width / 2) / this.width) * 2 - 1; // Adjust for mesh center
        const ndcY = -(((y + mesh.height / 2) / this.height) * 2 - 1); // Adjust for mesh center and invert Y axis
        

        const worldX = (ndcX * mesh.viewportWidth) / 2;// Convert NDC to world space
        const worldY = (ndcY * mesh.viewportHeight) / 2;
        mesh.position.set(worldX, worldY, 0);// Position the mesh in world space
    
        mesh.prevX = x;
        mesh.prevY = y;
        
    }


    /**
     * Setup stats.
     */
    setupStats(){
        if(!this.showStats){
            return;
        }
    
        this.stats = new Stats();
        this.stats.showPanel(0);

        this.mainHolderDO.screen.appendChild(this.stats.dom);

    }

    
    /**
     * Disable setting horizontal/vertical folders
     */
    setFolderEnabled(folder, enabled) {
        if (!folder) return;
        Object.values(folder.__controllers).forEach(controller => {
            controller.domElement.style.pointerEvents = enabled ? 'auto' : 'none';
            controller.domElement.style.opacity = enabled ? 1 : 0.3;
        });
    }
    

    /**
     * Setup GUI!!!.
     */
    setupGUI(){

        if(!this.showGUI){
            return;
        }


        GUI.TEXT_OPEN = 'Open Live Settings';
        GUI.TEXT_CLOSED = 'Close';

        this.onCheckClickGUI = this.onCheckClickGUI.bind(this);
        window.addEventListener('pointerdown', this.onCheckClickGUI);
        
        this.gui = new GUI({ closeOnTop: false });
        this.gui.width = 104;
        this.guiDomElement = this.gui.domElement;
        this.prt.mainDO.screen.appendChild(this.gui.domElement);
        
        this.guiDomElement.style.position = 'absolute';
        this.guiDomElement.style.top = '0';
        this.guiDomElement.style.right = '0';
        this.gui.closed = true;
       

        FWDLSUtils.addClass(this.guiDomElement, 'closed');

        this.onOpenGUI = this.onOpenGUI.bind(this);
        this.onCloseGUI = this.onCloseGUI.bind(this);

        this.guiDomElement.addEventListener('pointerup',this.onOpenGUI);
        this.closeGuiButton = this.guiDomElement.querySelector('.dg.main.a .close-button');


        // Camera folder
        this.guiCameraFolder = this.gui.addFolder('Camera');
        this.guiCameraFolder.open();

    

        // slider folder
        this.guiSliderFolder = this.gui.addFolder('Slider');
        this.guiSliderFolder.open();

        this.guiSliderFolder
        .add(this, 'showMaskGradient')
        .name('Show mask gradient').onChange(() =>{
            this.updateMaskGradient();
        });

  
        this.guiSliderFolder
        .add(this, 'useBlackAndWhite')
        .name('Black and white');

          this.guiSliderFolder
        .add(this, 'bendVertices')
        .name('Bend vertices').onChange(() => {
            this.meshesAR.forEach((data) => {
                data.mesh.material.uniforms.uBendVertices.value = this.bendVertices;
            });
        });

        

        this.guiSliderFolder.add(this, 'opacityStrength', 0.4, 1, 0.01).name('Opacity strength');

        this.guiSliderFolder.add(this, 'minItemScaleX', 0.09, 1, 0.01).name('Min scale X').onChange(() => {
            this.minimized = true;
            this.positionSpeed = 0;
            this.positionX = 0;
         
        });

        this.guiSliderFolder.add(this, 'maxItemScaleX', 1, 1.5, 0.01).name('Max scale X').onChange(() => {
            this.minimized = false;
            this.positionX = 0;
            this.goToItem(0);
        });

        this.guiSliderFolder.add(this, 'minItemScaleY', 0.09, 1, 0.01).name('Min scale Y').onChange(() => {
            this.minimized = true;
            this.positionSpeed = 0;
            this.positionX = 0;
         
        });

        this.guiSliderFolder.add(this, 'maxItemScaleY', 1, 1.5, 0.01).name('Max scale Y').onChange(() => {
            this.minimized = false;
            this.positionX = 0;
            this.goToItem(0);
        });


        this.guiSliderFolder.add(this, 'scrollBendStrength', 1, 2, 0.01).name('Scroll bend strength');

        this.guiSliderFolder.add(this, 'scrollSpeedStrength', 0, 1, 0.01).name('Scroll speed strength');

        this.guiSliderFolder.add(this, 'defaultCurveDistortionStrength', -1, 1, 0.01).name('Default curve distortion strength').onChange((value) => {
            this.meshesAR.forEach((data) => {
                data.mesh.material.uniforms.uDefaultCurveDistortionStrength.value = value;
            });
        });

        this.guiSliderFolder.add(this, 'curveDistortionStrength', 0, 3, 0.01).name('Curve distortion strength');


        this.guiSliderFolder.add(this, 'noiseAmplitude', 0, 1, 0.01)
        .name('Noise Amplitude')
        .onChange((value) => {
            this.meshesAR.forEach(data => {
                if (data.mesh.material.uniforms?.uNoiseAmplitude) {
                    data.mesh.material.uniforms.uNoiseAmplitude.value = value;
                }
            });
        });
    
        this.guiSliderFolder.add(this, 'noiseFrequency', 0, 1, 0.01)
            .name('Noise Frequency')
            .onChange((value) => {
                this.meshesAR.forEach(data => {
                    if (data.mesh.material.uniforms?.uNoiseFrequency) {
                        data.mesh.material.uniforms.uNoiseFrequency.value = value;
                    }
                });
            });
        
        this.guiSliderFolder.add(this, 'noiseSpeed', 0, 1, 0.01)
            .name('Noise Speed')
            .onChange((value) => {
                this.meshesAR.forEach(data => {
                    if (data.mesh.material.uniforms?.uNoiseSpeed) {
                        data.mesh.material.uniforms.uNoiseSpeed.value = value;
                    }
                });
            });

  


        // --- Vertical Controls ---
     
        this.verticalFolder = this.gui.addFolder('Vertical Settings');
       // this.verticalFolder.add(this, 'verticalGap', -1, 1, 0.01).name('Veetical gap');
        this.verticalFolder.add(this, 'verticalX', -2, 2, 0.01).name('Vertical x').onChange(() => this.updateSliderPosition());
        this.verticalFolder.add(this, 'verticalY', -2, 2, 0.01).name('Vertical y').onChange(() => this.updateSliderPosition());
        this.verticalFolder.add(this, 'verticalZ', -1, 1, 0.01).name('Vertical z').onChange(() => this.updateSliderPosition());
        this.verticalFolder.add(this, 'verticalRotationX', -1, 1, 0.01).name('Rotation x').onChange(() => this.updateSliderPosition());
        this.verticalFolder.add(this, 'verticalRotationY', -1, 1, 0.01).name('Rotation y').onChange(() => this.updateSliderPosition());
        this.verticalFolder.add(this, 'verticalRotationZ', -1, 1, 0.01).name('Rotation z').onChange(() => this.updateSliderPosition());


        // --- Horizontal Controls ---
        this.horizontalFolder = this.gui.addFolder('Horizontal Settings');

        // this.horizontalFolder.add(this, 'gap', -1, 1, 0.01)
        //     .name('Horizontal gap')
        //     .onChange(() => {
        //         this.prt.isResizing = true;
        //         this.updateSliderPosition();
        //     });

        this.horizontalFolder.add(this, 'horizontalX', -2, 2, 0.01)
            .name('Horizontal x')
            .onChange(() => {
                this.prt.isResizing = true;
                this.updateSliderPosition();
            });

        this.horizontalFolder.add(this, 'horizontalY', -2, 2, 0.01)
            .name('Horizontal y')
            .onChange(() => {
                this.prt.isResizing = true;
                this.updateSliderPosition();
            });

        this.horizontalFolder.add(this, 'horizontalZ', -1, 1, 0.01)
            .name('Horizontal z')
            .onChange(() => {
                this.prt.isResizing = true;
                this.updateSliderPosition();
            });

        this.horizontalFolder.add(this, 'horizontalRotationX', -1, 1, 0.01)
            .name('Rotation x')
            .onChange(() => {
                this.prt.isResizing = true;
                this.updateSliderPosition();
            });

        this.horizontalFolder.add(this, 'horizontalRotationY', -1, 1, 0.01)
            .name('Rotation y')
            .onChange(() => {
                this.prt.isResizing = true;
                this.updateSliderPosition();
            });

        this.horizontalFolder.add(this, 'horizontalRotationZ', -1, 1, 0.01)
            .name('Rotation z')
            .onChange(() => {
                this.prt.isResizing = true;
                this.updateSliderPosition();
            });


        
       
        // Wave post processing
        this.wavePostProcessingFolder = this.gui.addFolder('Post processing');
        this.wavePostProcessingFolder.open();

        this.wavePostProcessingFolder.add(this, 'antialias').name('Antialias').onChange((value) => {
            if (value) {
                this.composer.addPass(this.smaaPass);
            } else {
                this.composer.removePass(this.smaaPass);
            }
        });

        this.wavePostProcessingFolder.add(this, 'mouseRippleStrength', 0, 2, 0.01).name('Mouse ripple strength');
         
        this.wavePostProcessingFolder.add(this, 'rgbShiftStrength', 0, 2, 0.01).name('RGB shift strength');

        this.wavePostProcessingFolder.add(this, 'waveFrequency', 0, 1, 0.01).name('Wave frequency').onChange((value) =>{
            this.wavePass.uniforms.uWaveFrequency.value = value;
        });

        this.wavePostProcessingFolder.add(this, 'waveAmplitude', 0, 1, 0.01).name('Wave amplitude').onChange((value) =>{
            this.wavePass.uniforms.uWaveAmplitude.value = value;
        });

        this.wavePostProcessingFolder
            .add(this, 'glitch') 
            .name('Glitch')
            .onChange((value) => {
                if (value) {
                    this.composer.addPass(this.glitchPass); // Enable

                    if(this.antialias){
                        this.composer.addPass(this.smaaPass); // Disable antialiasing
                    }
                } else {
                    this.composer.removePass(this.glitchPass); // Disable
                }
        });
  
        
        // Buldge settings
        this.wavePostProcessingFolder
            .add(this, 'buldge')
            .name('Buldge')
            .onChange((value) => {
                if (value) {
                    this.composer.addPass(this.buldgePass);

                    this.composer.removePass( this.ripplePass);
                    this.composer.addPass( this.ripplePass);

                    if(this.antialias){
                        this.composer.addPass(this.smaaPass); // Disable antialiasing
                    }

                    buldgeFixedController.domElement.style.pointerEvents = 'auto';
                    buldgeFixedController.domElement.style.opacity = '1';

                    buldgeDirectionController.domElement.style.pointerEvents = 'auto';
                    buldgeDirectionController.domElement.style.opacity = '1';

                    buldgeStrengthController.domElement.style.pointerEvents = 'auto';
                    buldgeStrengthController.domElement.style.opacity = '1';
                } else {
                    this.composer.removePass(this.buldgePass);

                    buldgeFixedController.domElement.style.pointerEvents = 'none';
                    buldgeFixedController.domElement.style.opacity = '0.3';

                    buldgeDirectionController.domElement.style.pointerEvents = 'none';
                    buldgeDirectionController.domElement.style.opacity = '0.3';

                    buldgeStrengthController.domElement.style.pointerEvents = 'none';
                    buldgeStrengthController.domElement.style.opacity = '0.3';
                }
        });

        const buldgeFixedController = this.wavePostProcessingFolder
        .add(this, 'buldgeFixed')
        .name('Budlge fixed')

        const buldgeSettings = [
            'in',
            'out',
            'both'
        ];

        const buldgeDirectionController = this.wavePostProcessingFolder
            .add(this, 'buldgeDirection', buldgeSettings) 
            .name('Buldge Direction')
            .onChange((value) => {
                this.buldgeDirection = value;
            });

        const buldgeStrengthController = this.wavePostProcessingFolder.add(this, 'buldgeStrength', 0, 3, 0.01).name('Buldge strength').onChange(() =>{});

        // Initialize state (disable if buldge is initially false)
        if (!this.buldge) {

            buldgeFixedController.domElement.style.pointerEvents = 'none';
            buldgeFixedController.domElement.style.opacity = '0.3';

            buldgeDirectionController.domElement.style.pointerEvents = 'none';
            buldgeDirectionController.domElement.style.opacity = '0.3';

            buldgeStrengthController.domElement.style.pointerEvents = 'none';
            buldgeStrengthController.domElement.style.opacity = '0.3';
        }


        // After image
        this.wavePostProcessingFolder
            .add(this, 'afterImage')
            .name('After image')
            .onChange((value) => {
                if (value) {
                    this.composer.addPass(this.afterimagePass); // Enable
                    
                    this.composer.removePass( this.ripplePass);
                    this.composer.addPass( this.ripplePass);

                    if(this.antialias){
                        this.composer.addPass(this.smaaPass); // Disable antialiasing
                    }

                    afterImageDumpingController.domElement.style.pointerEvents = 'auto';
                    afterImageDumpingController.domElement.style.opacity = '1';
                   
                } else {
                    this.composer.removePass(this.afterimagePass); // Disable
                    afterImageDumpingController.domElement.style.pointerEvents = 'none';
                    afterImageDumpingController.domElement.style.opacity = '0.3';
                }
        });

        const afterImageDumpingController = this.wavePostProcessingFolder.add(this, 'afterImageDumping', 0, 1, 0.01).name('After image dumping').onChange(() =>{
            this.afterimagePass.uniforms['damp'].value = this.afterImageDumping;
        });

        // Initialize state (disable if afterImage is initially false)
        if (!this.afterImage) {
            afterImageDumpingController.domElement.style.pointerEvents = 'none';
            afterImageDumpingController.domElement.style.opacity = '0.3';
        }else{
            afterImageDumpingController.domElement.style.pointerEvents = 'auto';
            afterImageDumpingController.domElement.style.opacity = '1';

        }


        // Ripple distortion
        this.wavePostProcessingFolder
            .add(this, 'rippleDistortion')
            .name('Ripple distortion')
            .onChange((value) => {
                if (value) {
                    this.composer.addPass(this.rippleDistortionPass);
                   
                    this.composer.removePass( this.ripplePass);
                    this.composer.addPass( this.ripplePass);

                    if(this.antialias){
                        this.composer.addPass(this.smaaPass); // Disable antialiasing
                    }

                    rippleDistortionStrengthController.domElement.style.pointerEvents = 'auto';
                    rippleDistortionStrengthController.domElement.style.opacity = '1';

                    rippleDistortionSizeController.domElement.style.pointerEvents = 'auto';
                    rippleDistortionSizeController.domElement.style.opacity = '1';
                    
                } else {
                    this.composer.removePass(this.rippleDistortionPass);

                    rippleDistortionStrengthController.domElement.style.pointerEvents = 'none';
                    rippleDistortionStrengthController.domElement.style.opacity = '0.3';

                    rippleDistortionSizeController.domElement.style.pointerEvents = 'none';
                    rippleDistortionSizeController.domElement.style.opacity = '0.3';
                }
            });

        const rippleDistortionStrengthController = this.wavePostProcessingFolder.add(this, 'rippleDistortionStrength', 0, 1, 0.01).name('Ripple distortion strength').onChange((value) =>{
            this.rippleDistortionPass.uniforms.uLiquidDisotrionStrength.value = value;
        });

        const rippleDistortionSizeController = this.wavePostProcessingFolder.add(this, 'rippleDistortionSize', 0, 1, 0.01).name('Ripple distortion size').onChange((value) =>{
            this.rippleDistortionPass.uniforms.uDistortionSize.value = value;
        });
        

        if (!this.rippleDistortion) {
            rippleDistortionStrengthController.domElement.style.pointerEvents = 'none';
            rippleDistortionStrengthController.domElement.style.opacity = '0.3';

            rippleDistortionSizeController.domElement.style.pointerEvents = 'none';
            rippleDistortionSizeController.domElement.style.opacity = '0.3';
        }


        // Grid distortion controls
        this.wavePostProcessingFolder
            .add(this, 'grid')
            .name('Grid distortion')
            .onChange((value) => {
            if (value) {
                this.regenerateDistiortionGrid();
                this.composer.addPass(this.gridDistortionPass);

                this.composer.removePass( this.ripplePass);
                this.composer.addPass( this.ripplePass);

                if(this.antialias){
                    this.composer.addPass(this.smaaPass); // Disable antialiasing
                }

                gridSizeController.domElement.style.pointerEvents = 'auto';
                gridSizeController.domElement.style.opacity = '1';

                gridMouseRadiusFactorController.domElement.style.pointerEvents = 'auto';
                gridMouseRadiusFactorController.domElement.style.opacity = '1';

                gridMouseStrengthFactorController.domElement.style.pointerEvents = 'auto';
                gridMouseStrengthFactorController.domElement.style.opacity = '1';

                gridMouseRelaxationController.domElement.style.pointerEvents = 'auto';
                gridMouseRelaxationController.domElement.style.opacity = '1';

                gridAddRGBDistortionController.domElement.style.pointerEvents = 'auto';
                gridAddRGBDistortionController.domElement.style.opacity = '1';

            } else {
                this.composer.removePass(this.gridDistortionPass); // Disable grid distortion

                gridSizeController.domElement.style.pointerEvents = 'none';
                gridSizeController.domElement.style.opacity = '0.3';

                gridMouseRadiusFactorController.domElement.style.pointerEvents = 'none';
                gridMouseRadiusFactorController.domElement.style.opacity = '0.3';

                gridMouseStrengthFactorController.domElement.style.pointerEvents = 'none';
                gridMouseStrengthFactorController.domElement.style.opacity = '0.3';

                gridMouseRelaxationController.domElement.style.pointerEvents = 'none';
                gridMouseRelaxationController.domElement.style.opacity = '0.3';

                gridAddRGBDistortionController.domElement.style.pointerEvents = 'none';
                gridAddRGBDistortionController.domElement.style.opacity = '0.3';
            }
        });

        const gridSizeController = this.wavePostProcessingFolder
            .add(this, 'gridSize', 1, 500, 1)
            .name('Grid size').onChange(() => {
                this.regenerateDistiortionGrid();
            });
           

        const gridMouseRadiusFactorController = this.wavePostProcessingFolder
            .add(this, 'gridMouseRadiusFactor', 0, 1, 0.01)
            .name('Grid mouse radius factor');

        const gridMouseStrengthFactorController = this.wavePostProcessingFolder
            .add(this, 'gridMouseStrengthFactor', 0, 2, 0.01)
            .name('Grid mouse strength factor');

        const gridMouseRelaxationController = this.wavePostProcessingFolder
            .add(this, 'gridMouseRelaxation', 0, 1, 0.01)
            .name('Grid mouse relaxation')
           

        const gridAddRGBDistortionController = this.wavePostProcessingFolder
            .add(this, 'gridAddRGBDistortion')
            .name('Grid RGB distortion').onChange(() => {
                this.gridEffect.uniforms.uAddRGBDistortion.value = this.gridAddRGBDistortion;
            });
           

        if (!this.grid) {
            gridSizeController.domElement.style.pointerEvents = 'none';
            gridSizeController.domElement.style.opacity = '0.3';

            gridMouseRadiusFactorController.domElement.style.pointerEvents = 'none';
            gridMouseRadiusFactorController.domElement.style.opacity = '0.3';

            gridMouseStrengthFactorController.domElement.style.pointerEvents = 'none';
            gridMouseStrengthFactorController.domElement.style.opacity = '0.3';

            gridMouseRelaxationController.domElement.style.pointerEvents = 'none';
            gridMouseRelaxationController.domElement.style.opacity = '0.3';

            gridAddRGBDistortionController.domElement.style.pointerEvents = 'none';
            gridAddRGBDistortionController.domElement.style.opacity = '0.3';
        }

    }

    onCheckClickGUI(e){
      
        const wc = FWDLSUtils.getViewportMouseCoordinates(e);
        let closeButtonY = this.guiDomElement.querySelector('.close-button.close-bottom').getBoundingClientRect().y;
     
        if(!this.gui.closed){
            if((!FWDLSUtils.hitTest(this.guiDomElement, wc.x, wc.y)
            || closeButtonY < wc.y)){
                this.gui.close();
                this.onCloseGUI();
            }
        }

        this.setGUIHeight();

        setTimeout(() =>{
            if(this.destroyed) return;
            this.setGUIHeight();
        }, 80);

        setTimeout(() =>{
            if(this.destroyed) return;
            this.setGUIHeight();
        }, 150);
        
    }

    onOpenGUI = function(){
        this.gui.width = 400;
        this.isGUIOpened = true;
        FWDLSUtils.removeClass(this.guiDomElement, 'closed');
        FWDLSUtils.addClass(this.guiDomElement, 'opened');
       
        this.guiDomElement.removeEventListener('pointerup', this.onOpenGUI);
        this.closeGuiButton.addEventListener('pointerup', this.onCloseGUI);

        this.setGUIHeight();
    }

    onCloseGUI = function(){
        FWDLSUtils.removeClass(this.guiDomElement, 'opened');
        FWDLSUtils.addClass(this.guiDomElement, 'closed');

        this.gui.width = 104;
        this.closeGuiButton.removeEventListener('pointerup', this.onCloseGUI);
        setTimeout(function(){
            if(this.destroyed) return;
            this.guiDomElement.addEventListener('pointerup',this.onOpenGUI);
            this.setGUIHeight();
        }.bind(this), 50);

        setTimeout(function(){
            if(this.destroyed) return;
            this.isGUIOpened = false;
        }.bind(this), 300);
    }

    setGUIHeight(){
        if(!this.gui) return;
        const child = FWDLSUtils.getChildren(this.guiDomElement)[1];
        const child2 = FWDLSUtils.getChildren(this.guiDomElement)[2];

        if(this.gui.closed){
            this.guiDomElement.style.height = child2.offsetHeight + 'px';
        }else{
            let sH = this.prt.height;
            let height = child.offsetHeight + child2.offsetHeight;
          
           
            if(height >= sH){
                this.guiDomElement.style.height = '100%';
                this.guiDomElement.style.overflowY = 'auto';
            }else{
                this.guiDomElement.style.height = height + 'px';
                this.guiDomElement.style.overflowY = 'hidden';
            }
        }
    }

    /**
     * Destroy.
     */
    destroy(){
        if(this.destroyed) return;
        this.destroyed = true;
        
        this.stop();

        window.removeEventListener('click', this.onCheckClickGUI);

        if(this.gui){
            window.removeEventListener('pointerdown', this.onCheckClickGUI);
            this.guiDomElement.removeEventListener('pointerup',this.onOpenGUI);
            this.closeGuiButton.removeEventListener('pointerup', this.onCloseGUI);
            this.guiDomElement.removeEventListener('pointerup',this.onOpenGUI);
        }


        this.prt.mainDO.screen.removeEventListener('touchstart', this.onDragStart, { passive: false });
        document.removeEventListener('touchend', this.onDragEnd);
        window.removeEventListener('pointermove', this.checkDragDirection, { capture: true });
        window.removeEventListener('touchmove', this.onDragMove, { passive: false, capture: true });
        window.removeEventListener('pointermove', this.onDragMove, { capture: true });
        window.removeEventListener('pointermove', this.onMouseMove);

        if(this.meshesAR){
            this.meshesAR.forEach((data) => {
                data.mesh.geometry.dispose();
                data.mesh.material.dispose();
             
            });
        }
    }

}