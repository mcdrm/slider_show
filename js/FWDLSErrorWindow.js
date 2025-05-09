/**
 * Linear Slider PACKAGED v:1.0
 * Error window.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

import FWDLSDisplayObject from "./FWDLSDisplayObject";

export default class FWDLSErrorWindow extends FWDLSDisplayObject{


    /*
     * Initialize
     */
    constructor(prt){

        super();
        this.isShowedOnce = false;
        this.prt = prt;

        this.screen.className = 'fwdls-error-window';
        this.style.position = 'relative';
        this.style.display = 'inline-block';
       
        this.textDO =  new FWDLSDisplayObject();
        this.textDO.style.position = 'relative';
        this.textDO.style.display = 'inline-block';
        this.textDO.style.wordWrap = "break-word";
        this.textDO.screen.className = 'fwdls-error-window-text';
    }


    /**
     * Show text.
     */
    showText(text){
        if(!this.isShowedOnce){
            window.removeEventListener('click', this.close);
            this.close = this.close.bind(this);
            window.addEventListener('click', this.close);
        }

        this.textDO.innerHTML = '<span class="fwdls-error"></span><span class="fwdls-error-text">' + text + '</span>';
        this.addChild(this.textDO);
        this.prt.mainDO.addChild(this);
    }

    close(){
        window.removeEventListener('click', this.close);
        this.removeChild(this.textDO);
    }

    
    /**
     * Destroy
     */
    destroy(){
        if(this.destroyed) return;
        this.destroyed = true;
        
        window.removeEventListener('click', this.close);
    }
}