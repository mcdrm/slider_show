/**
 * Shader Infinite Slider PACKAGED v:1.0
 * items selector.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDLSDisplayObject2 from "./FWDLSDisplayObject2";


export default class  FWDLSButtonsManager extends FWDLSDisplayObject2 {

    static SHOW_TOOLTIP = "showTooltip";
    static HIDE_TOOLTIP = "hideTooltip";
    static GO_TO_item = "goToitem";

    constructor(
        prt,
        texturesAR,
        normalColor,
        selectedColor,
        toolTipHeight,
        toolTipRatio,
        showControls,
        enableControlsAudio
    ) {
    
        super();
        this.prt = prt;
        this.texturesAR = texturesAR;
        this.totalButtons  = this.texturesAR.length;
        this.curItem = 0;
        this.buttonWidth = 15;
        this.buttonMinimzedWidth = 19;
        this.normalColor = normalColor;
        this.selectedColor = selectedColor;
        this.toolTipRatio = toolTipRatio;
        this.showControlButtons = showControls;
        this.enableControlsAudio = enableControlsAudio;

        this.prevItem = -1;
        this.animationDuration = 0.8;
        this.buttonDeactivatedOpacity = 0.8;
        this.toolTipHeight = toolTipHeight;
        this.buttonsAR = [];
       
        this.createItemButtons();
       
        this.setMinimisedScales(false);

        this.setupAudio();
        this.prt.mainDO.addChild(this.btnContainerDO);
        
        this.show();
    }


    /**
     * Create item buttons
     */
    createItemButtons() {
        this.bottomGap = 10;
      
        this.btnContainerDO = new FWDLSDisplayObject2("div");
        this.btnContainerDO.screen.id = "item-buttons-container";
        this.btnContainerDO.screen.style.position = "absolute";
        this.btnContainerDO.screen.style.zIndex = 1e3;
        this.btnContainerDO.screen.style.overflow = "visible";
        this.btnContainerDO.style.top = "unset";
       
        this.btnContainerDO.style.left = "50%";
        this.btnContainerDO.style.bottom = this.bottomGap + "px";

        this.fullMargin = 4;
        this.shrinkFactor = 0.4;
       
        this.shrunkWidth = this.buttonWidth * this.shrinkFactor;
        this.extraPadding = this.buttonWidth;
        const heightFactor = 0.8;
        const containerHeight = this.buttonWidth * 4 * heightFactor;
        this.containerHeight = containerHeight;
        this.fullContainerWidth = this.totalButtons * this.buttonWidth + (this.totalButtons - 1) * this.fullMargin + this.extraPadding*2;
        this.shrunkContainerWidth = this.totalButtons * this.shrunkWidth + (this.totalButtons - 1) * this.fullMargin + this.extraPadding;
     
        this.btnContainerDO.width = this.fullContainerWidth;
        this.btnContainerDO.height = containerHeight;
    

       
        this.computeHeight = (scale) => Math.max(this.buttonWidth, this.buttonWidth * scale * (this.buttonWidth / this.buttonWidth) * 0.8);

        for (let i = 0; i < this.totalButtons; i++) {
            const mainBtnDO = new FWDLSDisplayObject2("div");
            mainBtnDO.style.overflow = "visible";
            mainBtnDO.style.pointerEvents = "none";
            mainBtnDO.opacity = this.buttonDeactivatedOpacity;

            const btnDO = new FWDLSDisplayObject2("div");
            const itemNum = i;
            btnDO.screen.id = `item-btn-${itemNum}`;
          
            btnDO.screen.innerText = "";
            btnDO.screen.style.transformOrigin = "50% 50%";
            btnDO.width = this.buttonWidth;
            btnDO.width = this.buttonWidth;
            const diff = Math.abs(itemNum - this.curItem);
            const baseScale = Math.max(1, 3 - diff);
            btnDO.height =  this.computeHeight(baseScale);
            btnDO.id = i + 2;
            btnDO.screen.style.height =  this.computeHeight(baseScale) + "px";
            btnDO.y = (containerHeight -  this.computeHeight(baseScale)) / 2 +1;
            btnDO.style.borderTopLeftRadius = this.buttonWidth / 2 + "px";
            btnDO.style.borderTopRightRadius = this.buttonWidth / 2 + "px";
            btnDO.style.borderBottomLeftRadius = this.buttonWidth / 2 + "px";
            btnDO.style.borderBottomRightRadius = this.buttonWidth / 2 + "px";
            btnDO.screen.style.backgroundColor = diff === 0 ? this.selectedColor : this.normalColor;
            btnDO.style.textAlign = "center";
            btnDO.style.cursor = "pointer";
            btnDO.x = i * (this.buttonWidth + this.fullMargin) + this.buttonWidth / 2 + this.extraPadding / 2;


            // Button hover change color

            btnDO.screen.addEventListener("mouseenter", (e) => {
                FWDAnimation.to(btnDO.screen, this.animationDuration, {
                    backgroundColor: this.selectedColor,
                    ease: Quint.easeOut
                });
                
                this.showTooltip(i);
                this.playHoverSound();
            });


            // Button out change color
            btnDO.screen.addEventListener("mouseleave", () => {
                const current = parseInt(btnDO.screen.id.split("-")[2], 10) === this.curItem;
                FWDAnimation.to(btnDO.screen, this.animationDuration, {
                    backgroundColor: current ? this.selectedColor : this.normalColor,
                    ease: Quint.easeOut
                });
                this.hideTooltip();

            });

            btnDO.screen.addEventListener("click", (e2) => {
              
                if(!this.isMaximized) return;
                const btnId = e2.target.id;
                const targetItem = parseInt(btnId.split("-")[2], 10);
                this.curItem = targetItem;
                this.goToitem(this.curItem);
                
                this.setCurrentState(targetItem);
            });


            this.buttonsAR.push({mainBtnDO, btnDO});
      
            mainBtnDO.addChild(btnDO);
            this.btnContainerDO.addChild(mainBtnDO);
        }


        // Set minimized scales
        this.btnContainerDO.screen.addEventListener("mouseenter", () => {
           
            clearTimeout(this.minimizedScalesTO);
            this.setMaximizedScales(true);
            
        });     

        this.btnContainerDO.screen.addEventListener("mouseleave", () => {
            clearTimeout(this.minimizedScalesTO);
            this.setMinimisedScales(true);
          
        });     
    }
    

    /**
     * Show
     */
    show() {
        if (this.destroyed) return;
    
        const centerIndex = Math.floor(this.buttonsAR.length / 2);
    
        this.buttonsAR.forEach(({ mainBtnDO }) => {
            mainBtnDO.style.pointerEvents = "none";
            mainBtnDO.opacity = 0;
        });

        if(!this.showControlButtons) return;
    
        // Animate outward from center
        for (let i = 0; i < this.buttonsAR.length; i++) {
            const offset = Math.abs(i - centerIndex); // distance from center
            const delay = 500 + offset * 80; // delay grows with distance from center
    
            setTimeout(() => {
                const { mainBtnDO } = this.buttonsAR[i];
                mainBtnDO.style.pointerEvents = "auto";
    
                FWDAnimation.to(mainBtnDO, 0.8, {
                    opacity: 1,
                    ease: Quint.easeOut
                });
            }, delay);
        }
    }
    
       
   
    // Set minimized scales for all buttons
    setMinimisedScales(animate) {
    
        this.isMaximized = false;
        this.isMaximizedDone = false;
        this.setButtomsMaximzedOrOptimized(animate, this.shrunkWidth);
    }

    
    setMaximizedScales(animate) {
      
        this.isMaximized = true;
        this.isMaximizedDone = false;
        this.setButtomsMaximzedOrOptimized(animate, this.buttonWidth);
    }

    setButtomsMaximzedOrOptimized(animate, buttonWidth) {

        const centerIndex = Math.floor(this.buttonsAR.length / 2);
    
        const fullMargin = this.fullMargin;
        const extraPadding = buttonWidth; // 👈 update this dynamically
        const containerHeight = this.containerHeight;

        this.buttonsAR.forEach(({ mainBtnDO, btnDO }, index) => {
            const isSelected = parseInt(btnDO.screen.id.split("-")[2], 10) === this.curItem;
            const diffScale = Math.abs(index - this.curItem);
            const diffDelay = Math.abs(index - centerIndex);

            btnDO.style.pointerEvents = "auto";
            const newScale = isSelected ? 3 : Math.max(1, 3 - diffScale * 0.5);
            const targetHeight = isSelected ? this.computeHeight(3) : Math.max(buttonWidth, this.computeHeight(newScale));

            const bkColor = this.curItem === index ? this.selectedColor : this.normalColor;

            FWDAnimation.killTweensOf(btnDO);
            FWDAnimation.killTweensOf(btnDO.screen);
            if(animate) {
                FWDAnimation.to(btnDO, this.animationDuration, {
                    width: buttonWidth,
                    height: targetHeight,
                 
                    x: index * (buttonWidth + fullMargin) + buttonWidth / 2 + extraPadding / 2,
                    opacity: 1,
                    y: (containerHeight - targetHeight) / 2,
                    ease: Expo.easeOut
                });
                FWDAnimation.to(btnDO.screen, this.animationDuration, {
                    backgroundColor: bkColor,
                    ease: Expo.easeOut,
                    onComplete: () =>{
                        if(this.isMaximized){
                            this.isMaximizedDone = true;
                        }
                    }
                });
            }else{
                btnDO.width = buttonWidth;
                btnDO.height = targetHeight;
                btnDO.x = index * (buttonWidth + fullMargin) + buttonWidth / 2 + extraPadding / 2;
                btnDO.y = (containerHeight - targetHeight) / 2;
                btnDO.opacity = 1;
                btnDO.style.backgroundColor = bkColor;
            }
        });

        const totalWidth = this.totalButtons * buttonWidth + (this.totalButtons - 1) * fullMargin + extraPadding * 2;

        FWDAnimation.killTweensOf(this.btnContainerDO);
        if(animate){
            FWDAnimation.to(this.btnContainerDO, this.animationDuration, {
                x: -totalWidth / 2,
                ease: Expo.easeOut
            });
        }else{
            this.btnContainerDO.x = -totalWidth / 2;
        }
    }


    /**
     * Set curremnt state
     */
   setCurrentState(curItem) {
        if (curItem === this.prevItem) return;
        this.prevItem = this.curItem;
        this.curItem = curItem;

        if(this.isMaximized) {
            this.setButtomsMaximzedOrOptimized(true, this.buttonWidth);
        }else{
            this.setButtomsMaximzedOrOptimized(true, this.shrunkWidth);
        }

       
    }


  
    /**
      * Tooltip
      */
    showTooltip(index) {
          
        // Get the center position of the hovered button.
        const btnDO = this.buttonsAR[index].btnDO;
        const btnRect = btnDO.rect;

       
        const leftPosition = btnRect.left + (btnRect.width / 2);

        let width = this.toolTipHeight * this.toolTipRatio;
        let height = this.toolTipHeight;


        // Create a new tooltip container.
        const tooltipImageDO = new FWDLSDisplayObject2("div");
        tooltipImageDO.screen.id = "tooltip-image-" + Date.now();
        tooltipImageDO.screen.style.position = "absolute";


        // Set the pivot point to bottom center.
        tooltipImageDO.style.transformOrigin = "50% 100%";
        tooltipImageDO.height = height;
        

        // Create new left/right image containers.
        const toolTipImage = new FWDLSDisplayObject2("div");
        tooltipImageDO.addChild(toolTipImage);

        // Explicitly position the children.
        toolTipImage.x = 0;
         
        // Populate based on the button index.
        toolTipImage.visible = true;
        toolTipImage.width = width;
        toolTipImage.height = height;
  
        toolTipImage.screen.appendChild(this.texturesAR[index].canvas);
        tooltipImageDO.width = width;
        tooltipImageDO.newWidth = width;
       

        // Position the tooltip container relative to the button.
        tooltipImageDO.x =  leftPosition - (tooltipImageDO.newWidth / 2) -  this.prt.globalX;    
        tooltipImageDO.y = this.btnContainerDO.rect.y - this.toolTipHeight/2 - 45 - this.prt.globalY;
      
        // Set initial state for animation.
        tooltipImageDO.scale = 0;
        tooltipImageDO.opacity = 0;
        tooltipImageDO.rotation = 0;

        FWDAnimation.killTweensOf(tooltipImageDO);
        FWDAnimation.to(tooltipImageDO, .6, {
            scale: 1,
            opacity: 1,
            ease: Expo.easeInOut,
        });

        // Add the new tooltip container to the main display.
        this.prt.mainDO.addChild(tooltipImageDO);

        // Store active tooltip containers.
        if (!this.activeTooltips) {
            this.activeTooltips = [];
        }
        this.activeTooltips.push(tooltipImageDO);

        // Animate out any older tooltips.
        for (let i = 0; i < this.activeTooltips.length - 1; i++) {
            const oldTooltip = this.activeTooltips[i];
            FWDAnimation.killTweensOf(oldTooltip);
            FWDAnimation.to(oldTooltip, .6, {
                scale: 0,
                opacity: 0,
                ease: Expo.easeInOut,
                onComplete: () => {
                    this.prt.mainDO.removeChild(oldTooltip);
                    const idx = this.activeTooltips.indexOf(oldTooltip);
                    if (idx !== -1) {
                        this.activeTooltips.splice(idx, 1);
                    }
                }
            });
        }
    }

    /**
     * Hides all active tooltip containers by animating them out.
     */
    hideTooltip() {
    
        this.dispatchEvent(FWDLSButtonsManager.HIDE_TOOLTIP);

        if (this.activeTooltips && this.activeTooltips.length) {
            // Animate out all active tooltips.
            this.activeTooltips.forEach((tooltip) => {
                FWDAnimation.killTweensOf(tooltip);
                FWDAnimation.to(tooltip, this.animationDuration, {
                scale: 0,
                opacity: 0,
                delay: 0.2,
                ease: Quint.easeOut,
                onComplete: () => {
                    this.prt.mainDO.removeChild(tooltip);
                }
            });
        });

        // Clear the array.
        this.activeTooltips = [];
        }
    }

    
    // Dummy navigation method.
    goToitem(itemNumber) {
        if(this.prt.sliderManagerDO.isHorizontal){
            this.prt.sliderManagerDO.goToHorizontalItem(this.curItem, true,  1.5);
        }else{
            this.prt.sliderManagerDO.goToVerticaltem(this.curItem, true,  1.5);
        }
     
    }
      

    /**
     * Setup audio
     */
    setupAudio() {

        // Audio for item turning
        let audioHoverSrc = './content/audio/hover2.mp3';
     
        if (this.prt.wpPluginPath) {
            audioHoverSrc = this.prt.wpPluginPath + './content/audio/hover2.mp3';
        }
    
        this.hoverAudio = new Audio(audioHoverSrc);
        this.hoverAudio.volume = 0.4;
    
        // Preload the audio to ensure it's ready to play when needed
        this.hoverAudio.load();
    }

    
    /**
     * Play flip sound effect
     */
    playHoverSound() {
        if(!this.enableControlsAudio) return;
        if (this.hoverAudio) {
            // Attempt to play the audio
            this.hoverAudio.currentTime = 0; // Reset to the beginning of the sound for multiple plays
            this.hoverAudio.play().catch((e) => {});
        }
    }


    /**
     * Destroy function
     */
    destroy() {
        this.destroyed = true;

        if (this.btnContainerDO && this.prt.mainDO.contains(this.btnContainerDO)) {
            this.prt.mainDO.removeChild(this.btnContainerDO);
        }

      
        if (this.hoverAudio) {
            this.hoverAudio.pause();
            this.hoverAudio = null;
        }
    }
    
};