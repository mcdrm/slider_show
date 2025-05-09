/**
 * Front js file, handles most of the js functionality.
 *
 * @package FWDLSC
 * @since FWDLSC 1.0
 */


jQuery(document).ready(function($){
   
    'use strict';
   
    let showFirstItemOnce = true;
    var last_scroll = 0;
    var scrollObj;
    var ww, wh, mW = 0;
    var rev_ar;
    var bullets_ar;
    var revId = 0;
    let wow;
    let scrollSpeed;
    let rlShow;

  
    // Initialize.
    init();
    function init(){
        
        ww = $(window).width();
        wow = $(window).outerWidth();

        
        $(window).on('resize', resizeHandler);        
        $(window).on('scroll',function(){
            var scroll = $(window).scrollTop();
            if(Math.abs(scroll - last_scroll) > $(window).height() * 0.1 || scroll == 0){
                last_scroll = scroll;
               
                revealStuff();
            }

            if(page == 'api' || page == 'api-wp'){
                sideBarScroll();
            }
        });

        if(page == "main"){
            setupSliders();
        }else if(page == 'api' || page == 'api-wp'){  
            hljs.initHighlightingOnLoad();
        }
        
        // if(page == "main" ){
        //     setupLenis();
        // }

        resizeHandler();

        setTimeout(()=>{
            init2();
        }, 500);
       
    }

    function init2(){
        hideOrShowScondaryMenu();

        if(page == "main"){

           if(wow > 1500){
                setTimeout(()=>{
                    $('.header .in').addClass('reveal');
                }, 1000);
            }
      
            // Setup grid.
            setupGrid();

            // Demos.
            if(location.href.match(/#demos/g)){
                var scroll = $(window).scrollTop();
                var ofst = 0;
              
                setTimeout(function(){
                    scrollToEl('#demo_grid');
                }, 1000);
            }
       
            // Scroll to features.
            if(location.href.match(/#features/g)){
                var w = $(window).width();
                var ofst = -100;
            
                setTimeout(function(){
                    scrollToEl('.m2-ft', ofst);
                }, 1000);
            }

        }else if(page == "single"){
            $('.info').addClass('reveal');
            $('.carousel').addClass('reveal');
        }else if(page == 'api' || page =='api-wp'){
           
            initScrollToAnchor();
            hljs.initHighlightingOnLoad();
            setTimeout(()=>{
                $('.menu-main.api').addClass('reveal-top');
            }, 400);
          
            $('.demos-header, .header.api').addClass('reveal');
        
            setupRL();
            if(page =='api-wp'){
                setupImages();
            }
            initSidebar();
    		sideBarScroll();
    		setTimeout(function(){
    			sideBarScroll();
                resizeHandler();
    		}, 100);
        }

        showHorizontalMenu();
        setupRevs();
        resizeHandler();

        $('.info-single').addClass('reveal');
    
        revealStuff();
    }

    
    function setupLenis(){
      
        // Initialize Lenis
        const lenis = new Lenis();

        // Listen for the scroll event and log the event data
        lenis.on('scroll', (e) => {});

        // Use requestAnimationFrame to continuously update the scroll
        function raf(time) {
        lenis.raf(time);
            scrollSpeed = lenis.velocity;
           
            // Call the raf function again to continue the loop
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }


    // Resize handler.
    function resizeHandler(){
        ww = $(window).width();
        wh = $(window).height();
        wow = $(window).outerWidth();
        
        hideOrShowScondaryMenu();
        resizeFeaturesImg();

        // Position main.
        mW = $('body > .main').width();
        var left = Math.floor((ww - mW)/2);
        $('body > .main').css({'left':left + 'px'});

    }

    // Menu horizontal.
    var fluid;
    var horizontalMenuShowed = true;
    var hMenuHidden = false;
    var hMenuShowed = false;
    var horizontalMenuShowed = true
    var scrollTop,
        lastScrollTop,
        navbarHeight = 0;
    var menuOffestY = 10;


    function showHorizontalMenu(){    
        if(page == 'api')  return;

        if(hMenuShowed){
            return
        }

         $(window).on('scroll',function(){
            var scroll = $(window).scrollTop();
            setMenuPosition();
        });

        fluid = $('.menu-stable');
        hMenuHidden = true;
        hMenuShowed = true;
        horizontalMenuShowed = true;
       
        scrollTop = $(window).scrollTop();
        setTimeout(function(){
          
            navbarHeight = fluid.height();
            scrollTop = $(window).scrollTop();
            
            FWDAnimation.killTweensOf(fluid[0]);
            FWDAnimation.to(fluid[0], 0.01, {'top':(-navbarHeight - menuOffestY) + 'px', ease:Expo.easeInOut});

            horizontalMenuShowed = true;
            $('.menu-main').css({'top':0})
            lastScrollTop = scrollTop;
            closeSecondaryMenu();
        }, 50);

        setTimeout(function(){
            navbarHeight = fluid.height();
            scrollTop = $(window).scrollTop();
            hMenuHidden = false; 
            if(scrollTop < navbarHeight){
                FWDAnimation.to(fluid[0], .8, {'top':'0', ease:Expo.easeInOut});   
            }
        }, 100);
        
        
        FWDAnimation.killTweensOf(fluid[0]);
    }

    function setMenuPosition(){
        if(page == 'api')  return;
        scrollTop = $(window).scrollTop();
        
        if(hMenuHidden){
            return;
        } 

        navbarHeight = fluid.height();

        if(scrollTop > lastScrollTop && scrollTop > navbarHeight * 2){            
            // Hide.
            if(!horizontalMenuShowed){
                FWDAnimation.killTweensOf(fluid[0]);
                FWDAnimation.to(fluid[0], .8, {'top': (-navbarHeight - menuOffestY) + 'px', ease:Expo.easeInOut});
                horizontalMenuShowed = true;
                hideOrShowScondaryMenu();
                closeSecondaryMenu();
            }
        }else{
            // Show.
            if(horizontalMenuShowed){
                FWDAnimation.killTweensOf(fluid[0]);
                FWDAnimation.to(fluid[0], .8, {'top':'0', ease:Expo.easeInOut});
                horizontalMenuShowed = false;
            }
        }
        setTimeout(function(){
            lastScrollTop = scrollTop;
        }, 50);
    }

    var vMenuShowed = false;
    $('.vertical-menu-toggle').on('click', function(){
        if(!vMenuShowed){
            vMenuShowed = true;
            $('.vertical-menu-toggle').addClass('vertical-menu--showed');
            $('.secondary-navigation').addClass('secondary-menu-show');
            $(window).on('click', closeSecondaryMenu);
        }else{
            vMenuShowed = false;
            $('.vertical-menu-toggle').removeClass('vertical-menu--showed');
            $('.secondary-navigation').removeClass('secondary-menu-show');
        }
    });

    function closeSecondaryMenu(e){
        if(e){
            var vmc = FWDVSUtils.getViewportMouseCoordinates(e);    
            if(!FWDVSUtils.hitTest($('.vertical-menu-toggle')[0], vmc.screenX, vmc.screenY)
            && !FWDVSUtils.hitTest($('.vertical-menu-toggle')[0], vmc.screenX, vmc.screenY)){
                vMenuShowed = false;
                $('.vertical-menu-toggle').removeClass('vertical-menu--showed');
                $('.secondary-navigation').removeClass('secondary-menu-show');
            }
        }else{
            vMenuShowed = false;
            $('.vertical-menu-toggle').removeClass('vertical-menu--showed');
            $('.secondary-navigation').removeClass('secondary-menu-show');
        }
    }

    function hideOrShowScondaryMenu(){
        var sW = $(window).width();
        
        if(sW <= 1050){
            $('.vertical-menu-toggle').addClass('vertical-menu-show');
            $('.primary-navigation').addClass('primary-menu-hide');
            $('.secondary-navigation').addClass('activate-secondary-menu');
            
        }else{
            $('.vertical-menu-toggle').removeClass('vertical-menu-show');
            $('.vertical-menu-toggle').removeClass('vertical-menu--showed');
            $('.primary-navigation').removeClass('primary-menu-hide');
            $('.secondary-navigation').removeClass('activate-secondary-menu');
            $('.secondary-navigation').removeClass('secondary-menu-show');
            vMenuShowed = false;
        }
    }


    // Reveal stuff.
    function revealStuff(){

        if(isVisible($('.header .in')) && wow < 1500){
            $('.header .in').addClass('reveal');
        }

        if(isVisible($('.header-grid'), -100, true)){
            $('.header-grid').addClass('reveal');
        }

        if(isVisible($('.api-main'))){
            $('.api-main').addClass('reveal-top');
        }

        if(isVisible($('.api-main'))){
            $('.api-main').addClass('reveal-top');
        }

        if(isVisible($('.info1'))){
            $('.info1').addClass('reveal');
        }


        if(isVisible($('#short_info'), -100, true)){
            $('#short_info').addClass('reveal');
            
            // ✅ Open the first item once DOM is ready
            if(showFirstItemOnce){
                const firstItem = document.querySelector('#short_info .item');
                if (firstItem) {
                    openItem(firstItem);
                }
                showFirstItemOnce = false; // Prevent opening again on scroll
            }
        }

        if(isVisible($('#demo_grid'), -100, true)){
            $('#demo_grid').addClass('reveal');
        }

        
        if(isVisible($('.m2-ft'), -100, true)){
            $('.m2-ft').addClass('reveal');
        }

        if(isVisible($('.m2-ft .info'), -100, true)){
            $('.m2-ft .info').addClass('reveal');
        }

        if(isVisible($('.m2-ft .m-main-holder'), -100, true)){
            $('.m2-ft .m-main-holder').addClass('reveal');
        }

        if(isVisible($('.reviews'), -100, true)){
            $('.reviews').addClass('reveal');
        }

        if(isVisible($('.buy'), -100, true)){
            $('.buy').addClass('reveal');
            $('.contact').addClass('reveal');
        }

        if(isVisible($('.footer-bar'), 200, true)){
            $('.footer-bar').addClass('reveal');
        }
        
    }

    function isVisible(element, offset){
        if(!element || element.length == 0) return false;
        if(element.hasClass('reveal') || !element.length){
           return;
        }
        
        if(!offset){
            offset = 0;
        }  

        let scroll_pos = $(window).scrollTop();
        let window_height = $(window).height();
        let el_top = $(element).offset().top;
        let el_height = $(element).height();
        let el_bottom = el_top + el_height;
        let result = ((el_top - offset < scroll_pos + window_height));
        return result;
    }


    /* Setup playyers. */
    function setupSliders(){
        
        new FWDLS({
                
            // Main settings.  
            instance: 'fwdsc0',
            parentId: 'myDiv',
            displayType: 'afterparent',
            sliderDataId: 'sliderData',
            initializeWhenVisible: 'no',
            maxWidth: 1920,
            maxHeight: 1000,
            stopScrollingForPx: 0,
            autoScale: 'yes',
            antialias: 'yes',
            stats: 'no',
            gui: 'no',
            showPreloader: 'yes',
            preloaderColor: '#FFFFFF',
            backgroundColor: '#FFFFFF',
            infinite: 'yes',
            itemWidth: 1.8,
            itemHeight: 1.4,
            showMaskGradient: 'no',
            useCaption: 'yes',
            useBlackAndWhite: 'yes',
            opacityStrength: 0.8,
            rgbShiftStrength: 0,
            snap: 'yes',
            scrollSpeedStrength: 0.3,
            scrollScaleStrength: 0.8,//0.69
            defaultCurveDistortionStrength: 0.04,
            curveDistortionStrength: 2,
            liquidDistortionStrength: 0,
            mouseRippleStrength: 0.6,

            // Camera postion
            verticalGap: 0.05,
            verticalX: -0.23,
            verticalY: 0,
            verticalZ: 0.06,
            verticalRotationX: -0.15,
            verticalRotationY: -0.3,
            verticalRotationZ: -0.13,
            gap: 0.01,
            showHorizontalAtLestThanWidth: 1100,
            horizontalX: 0,
            horizontalY: 0.39,
            horizontalZ: 0,
            horizontalRotationX: 0,
            horizontalRotationY: 0.11,
            horizontalRotationZ: -0.03,

            // Noise
            noiseAmplitude: 0,
            noiseFrequency: 0,
            noiseSpeed: 0.6,

            // Controller 
            enableControlsAudio: 'yes',
            showControlButtons: 'yes',
            controlButtonsNormalColor: '#333333',
            controlButtonsSelectedColor: '#CD5C5C',
            controlsImageHeight: 80,

            // Post processing.
            uwaveFrequency: 0.1,
            waveAmplitude: 0.02,
            glitch: 'no',
            buldge: 'no',
            buldgeDirection: 'in',
            buldgeFixed: 'yes',
            buldgeStrength: 1.3,
            rippleDistortion: 'no',
            rippleDistortionStrength: 0.2,
            rippleDistortionSize: 0.5,
            grid: 'no',
            gridAddRGBDistortion: 'yes',
            gridSize: 400,
            gridMouseRadiusFactor: 0.2,
            gridMouseStrengthFactor: 0.48,
            gridMouseRelaxation: 0.9,
            afterImage: 'no',
            afterImageDumping: 0.75,

        });

    }


  
    
    
    function resizeFeaturesImg(){

        if(!$('#m_ft_1').length) return;
        var sw = $(window).outerWidth();
       
        if(sw <= 420){
            var dW = 350;
            var dH = 420;
            var scale = (sw - 40) / dW;
            var h = Math.round(dH * scale);

        }
    }


    // Showt Info
    function getFullHeight(el) {
        const clone = el.cloneNode(true);
        clone.style.cssText = `
            position: absolute;
            visibility: hidden;
            height: auto;
            opacity: 1;
            pointer-events: none;
            width: ${el.offsetWidth}px;
        `;
        document.body.appendChild(clone);
        const height = clone.offsetHeight;
        document.body.removeChild(clone);
        return height;
    }

    // Function to close all items
    function closeAllItems() {
        document.querySelectorAll('#short_info .item').forEach(item => {
            const p = item.querySelector('p');
            const path = item.querySelector('svg path'); // ✅ select correct arrow

            FWDAnimation.killTweensOf(p);
            FWDAnimation.to(p, 0.6, {
                height: 0,
                opacity: 0,
                ease: Expo.easeInOut
            });

            item.classList.remove('expanded');

            // ✅ Reset arrow color
            FWDAnimation.killTweensOf(path);
            FWDAnimation.to(path, 0.4, {
                fill: "#444444",
                ease: Expo.easeOut
            });
        });
    }

    // Function to open one item
    function openItem(item) {
        const p = item.querySelector('p');
        const path = item.querySelector('svg path'); // ✅ select correct arrow
        const fullHeight = getFullHeight(p);

        FWDAnimation.killTweensOf(p);
        FWDAnimation.to(p, 0.6, {
            height: fullHeight,
            opacity: 1,
            ease: Expo.easeInOut
        });

        item.classList.add('expanded');

        // ✅ Highlight arrow
        FWDAnimation.killTweensOf(path);
        FWDAnimation.to(path, 0.4, {
            fill: "#EB1919",
            ease: Expo.easeOut
        });
    }

    // Accordion click logic (h2 and arrow svg clickable)
    document.querySelectorAll('#short_info .item').forEach(item => {
        const toggleTriggers = [
            item
          
        ];
    
        toggleTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('expanded');
    
                if (isOpen) {
                    // Close only this one
                    closeAllItems();
                } else {
                    closeAllItems();
                    openItem(item);
                }
            });
        });
    });
    // Arrow hover effect
    document.querySelectorAll('#short_info .item').forEach(item => {
        const path = item.querySelector('svg path');

        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('expanded')) {
                FWDAnimation.killTweensOf(path);
                FWDAnimation.to(path, 0.4, {
                    fill: "#EB1919",
                    ease: Expo.easeOut
                });
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('expanded')) {
                FWDAnimation.killTweensOf(path);
                FWDAnimation.to(path, 0.4, {
                    fill: "#444444",
                    ease: Expo.easeOut
                });
            }
        });
    });
    closeAllItems();
    


    // Reviews.
    function setupRevs(){
        if(!$('.reviews').length) return;
        rev_ar = [];
        bullets_ar = [];

        $('.rev').each(function(index, element){
           rev_ar.push($(element));
        });

        $('.bullets .bullet').each(function(index, element){
            bullets_ar.push(element);
            $(element).on('click', function(e){
                var reg_exp = /[0-9]/;
                revId = parseInt($(this).attr("id").match(reg_exp));
                bulletsClick();
            });
        });

        bulletsClick();
    }

    function bulletsClick(){
       
        var bullet;
        for(var i=0; i<bullets_ar.length; i++){
            bullet = bullets_ar[i];
            if(i == revId){
                $(bullet).addClass('bullet-active');
            }else{
                $(bullet).removeClass('bullet-active');
            }
        }   
        positionRevs(true);
    }

    function positionRevs(anim){
        if(!$('.reviews').length) return;
        var el;
        var bullet;
        for(var i=0; i<rev_ar.length; i++){
            el = rev_ar[i];
            if(revId == i){
                $(el).css({'display':'block'});
            }else{
                $(el).css({'display':'none'});
            }
        }
      
        var curRev = rev_ar[revId];

        curRev.css({'opacity': 0});
        FWDAnimation.to(curRev[0], .8, {css:{opacity:1}, ease: Expo.easeOut});
    }


    // Setup demo page grid vs.
    function setupGrid(){
        if(window['myISP']) return;
        

        FWDVSUtils.checkIfHasTransofrms();

        new FWDVS({
            //main settings 
            gridType:"classic",
            rightClickContextMenu:"default",
            instanceName:"myISP",
            parentId:"myGDiv",
            mainFolderPath:"content",
            gridSkinPath:"grid_skin_classic",
            galleryId:"myPlaylist",
            allCategoriesLabel:"All",
            notFoundLabel:"Nothing found",
            showAllCategories:"yes",
            randomizeSlider:"no",
            animateParent:"no",
            initializeOnlyWhenVisible:"no",
            prelaoderAllScreen:"no",
            searchLabel:"Search",
            startAtCategory:0,
            slideshowRadius:10,
            slideshowBackgroundColor:"#ffeb06",
            slideshowFillColor:"#000000",
            slideshowStrokeSize:3,
            // menu settings
            showMenu:"yes",
            showMenuButtonsSpacers:"no",
            comboboxSelectorLabel:"Select categories",
            menuButtonSpacerHeight:20,
            //thumbnail settings
            howManyThumbnailsToDisplayPerSet:41,
            useThumbnailSlideshow:"yes",
            hideAndShowTransitionType:"scale",
            thumbanilBoxShadow:"none",
            disableThumbnails:"no",
            thumbnailBorderNormalColor:"",
            thumbnailBorderSelectedColor:"",
            thumbnailsHorizontalOffset:0,
            thumbnailsVerticalOffset:0,
            thumbnailMaxWidth:610,
            thumbnailMaxHeight:417,
            horizontalSpaceBetweenThumbnails:20,
            verticalSpaceBetweenThumbnails:20,
            thumbnailBorderSize:0,
            thumbnailBorderRadius:0,
            //preset settings
            preset:"team",
            previewText:"Read more",
            thumbnailOverlayOpacity:.5
        });
    }

    // Demos.
    var featuresMenuClicked;
    $('#demos_menu, #demos_menu_2, #demos_menu_3').on('click', function(e){
       scrollToEl('#demo_grid');
    });

    // Footer.
    $('#top').on('click', function(e){
        scrollToTop();
    });

    $('#features_menu, #features_footer').on('click', function(e){
        featuresMenuClicked = true;
        var ofst = -100;
        
        setTimeout(function(){
             scrollToEl('.m2-ft', ofst);
        }, 200);
       
    });

    function scrollToEl(cls, ofst){
       
        var startY =  $(cls).offset().top;
        var pos = startY;
        if(!ofst) ofst = 0;
        if(ofst) pos += ofst;
       
        scrollObj = {scrollPos:$(window).scrollTop()}
        
        $(scrollObj).animate({ // call animate on the object
            scrollPos: pos
        }, {
            duration: 800,
            easing: 'easeInOutExpo',
            step: function(now) { // called for each animation step (now refers to the value changed)
                window.scrollTo(0,now);
            }
        });
    }

    function scrollToTop(){
        var startY =  0;
        var pos = startY;
       
        scrollObj = {scrollPos:$(window).scrollTop()}
        
        $(scrollObj).animate({ // call animate on the object
            scrollPos: pos
        }, {
            duration: 800,
            easing: 'easeInOutExpo',
            step: function(now) { // called for each animation step (now refers to the value changed)
                window.scrollTo(0,now);
            }
        });
    }


    // Paralax.
    var pState = 'off';
    $('#paralax').on('click', function(e){
        if(!window['myISP0']) return;
        if(pState == 'off'){
            pState = 'on';
            $(this).addClass('on');
            $('#paralax_p').html('Parallax is <strong>on</strong>');
            myISP0.paralax_bl = true;

            if(window['myISP0']){
                myISP0.paralax_bl = true;
                myISP0.checkParalaxOnScroll();
            }
        }else{
            pState = 'off';
            $(this).removeClass('on');
            $('#paralax_p').html('Parallax is <strong>off</strong>');
            myISP0.paralax_bl = false;

            if(window['myISP0']){
                myISP0.paralax_bl = false;
                myISP0.checkParalaxOnScroll();
            }
        }
    });

    var pState2 = 'off';
    if(window['FWDSAP'] && FWDVSUtils.isMobile){
        $(".paralax.zoom").css({"display":"none"});
        $("#paralax").css({"margin-right":"0"});
        
    }
    $('#zoom').on('click', function(e){
        if(!window['myISP0']) return;
        if(pState2 == 'off'){
            pState2 = 'on';
            $(this).addClass('on');
            $('#zoom_p').html('Zoom is <strong>on</strong>');
            myISP0.zoom_bl = true;
            myISP0.thumbsManager_do.addZoomSupport(true);
            myISP0.thumbsManager_do.lookSBtnClick();
            myISP0.thumbsManager_do.look_do.setButtonState(1);
            myISP0.thumbsManager_do.addSetLookDoVertically();
            
            if(window['myISP0']){
                myISP0.zoom_bl = true;
            }
        }else{
            pState2 = 'off';
            $(this).removeClass('on');
            $('#zoom_p').html('Zoom is <strong>off</strong>');
            myISP0.zoom_bl = false;
            myISP0.thumbsManager_do.removeZoomSupport(true);
            myISP0.thumbsManager_do.removeSetLookDoVertically();
        
            if(window['myISP0']){
                myISP0.zoom_bl = false;
               
            }
        }
    });

    setTimeout(function(){
        if(!window['FWDVSUtils'] || !window['myISP0']) return;
        if(FWDVSUtils.isMobile){
            myISP0.thumbsManager_do.disableGridScrollOnMobile_bl = false;
        }
        myISP0.addListener(FWDSAP.GO_NORMALSCREEN, goNormalScreen);
    }, 1000);


   // Help sidebar.
   var sBar = $('aside');
   var sBarHolder = $('main');
   var scrObj2 = {'offsetTop':0}
   var curSideClick;
   var asideShowed = false;
   
   var mainA;
   var sideA;

   $('.help-menu-toggle').on('click', function(e){
        if(!asideShowed){
            asideShowed = true;
            $('aside').addClass('showed');
            $(window).on('click', closeAside);
        }else{
            asideShowed = false;
            $('aside').removeClass('showed');
        }
   });

   function closeAside(e){
       var vmc = FWDRLUtils.getViewportMouseCoordinates(e);    

       if(!FWDRLUtils.hitTest($('aside')[0], vmc.screenX, vmc.screenY)
       && !FWDRLUtils.hitTest($('.help-menu-toggle')[0], vmc.screenX, vmc.screenY)){
          asideShowed = false;
          $('aside').removeClass('showed');
       }
   }
  
   function initSidebar(){
       sideA = $('.api-main aside')[0].querySelectorAll('[href]');
       mainA = $('.api-main main')[0].querySelectorAll('[id]:not(.img)');
     
       for(var i=0; i<mainA.length; i++){
           var el = mainA[i];
       }

       for(var i=0; i<sideA.length; i++){
           var el = sideA[i];
           
           el.addEventListener('click', function(e){
               
               for(var i=0; i<sideA.length; i++){
                   var el = sideA[i];
                   el.className = '';
               }
               curSideClick = e.target;
               setTimeout(function(){
                   curSideClick.className = 'active';
               }, 250)
               
           })
       }
   }


   function sideBarScroll(){
       if(!mainA) return;

       var wH = window.innerHeight;
       var scroll_pos = $(window).scrollTop();
       var top = sBarHolder.offset().top;
       if(scroll_pos > top - 20){
           sBar.css({'position': 'fixed', 'top':20})
       }else{
           sBar.css({'position': 'absolute', 'top':0})
       }

       for(var i=0; i<mainA.length; i++){
           var el = mainA[i];
           var nextEl = mainA[i + 1];
           var next2El = mainA[i + 2];
           var curEl = mainA[0];

           if(el.getBoundingClientRect().y < 100){
               curEl = el;
           }

           for(var j=0; j<mainA.length; j++){
               var el2 =  mainA[j];
               if(el2.getBoundingClientRect().y < 100){
                   curEl = el2;
               }
           }
       }

       for(var i=0; i<sideA.length; i++){
           var el = sideA[i];
           el.className = '';
           
           if(curEl.id == el.href.match(/#(.*)/g)[0].substr(1)){
               curEl = el;
               curEl.className = 'active';
           }
       }
   }


     // Scroll smooth.
     var scrObj = {scrStart:0, scrEnd:0}
     function initScrollToAnchor(){
         var anchors = document.querySelectorAll('a[href^="#"]');
         for(var i=0; i<anchors.length; i++) {
             anchors[i].addEventListener( 'click', anchor, false );   
         }
 
         window.addEventListener('wheel', stopScrollToAnchorAnim, false);
         window.addEventListener('touchstart', stopScrollToAnchorAnim, false);
 
         function anchor( event ) {
         
             event.preventDefault(); 
             event.stopPropagation();
 
             scrObj.scrEnd = window.pageYOffset;
 
             var id = this.getAttribute( 'href' ),
                 el = document.getElementById(id.replace('#', ''));
                 scrObj.scrStart = el ? Math.round( el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 20) : null;
 
             if(el){
                scrObj.scrStart = Math.min(scrObj.scrStart, document.body.scrollHeight - window.innerHeight);
                window.scrollTo(0, scrObj.scrStart);
             }
         }
     }
 
     function stopScrollToAnchorAnim(){
         FWDAnimation.killTweensOf(scrObj);
         //FWDAnimation.killTweensOf(scrObj2);
     }


    // Setup RL.
    function setupRL(){
    	new FWDRL({	
			instanceName:"rl0",
			mainFolderPath:"content-rl",
			volume: .9,
            rightClickContextMenu: "disabled",
            shareButtons:[],
		});

        rl0.addListener(FWDRL.START_TO_UPDATE_ITEM, function(e){
            rl0.show360DegreeVideoVrButton = false;
            // if(rl0.guId == 'single_items_sliderk' && rl0.mId == 13
            // || rl0.guId == 'video_sliderk_sliderk' && rl0.mId == 13){
            //     rl0.show360DegreeVideoVrButton = true;
            // }
        })
        
        rl0.addListener(FWDRL.EVP_STOP, function(e){
        //    if(e.guId == 'tutorials'){
        //        rl0.hide();
        //    }
        })

		rl0.addListener(FWDRL.SHOW_START, function(e){
			rlShow = true;
			
            rl0.showThumbnails = false,
            rl0.showSlideShowButton = false,
            rl0.showCounter = false,
            rl0.useDrag = false,
            rl0.showNextAndPrevBtns = false
				
		});	

		rl0.addListener(FWDRL.HIDE_START, function(){
			rlShow = false;
		});		
    }


    // Show images.
    function setupImages(){
  

        new FWDSI({ 
            //main settings
            instanceName:"presets_img_",
            displayType:"responsive",
            parentId:"presets_img",
            imageSource:"assets/docs/presets.png",
            initializeOnlyWhenVisible:"yes",
            maskType:"square",
            showPreloader:'no',
            maxWidth:1613,
            maxHeight:960
        });
        $('#presets_img').on('click', function(){
            rl0.show('slider', 0, 'docsProps')
        });

      
        new FWDSI({ 
            //main settings
            instanceName:"slider_img_",
            displayType:"responsive",
            parentId:"slider_img",
            imageSource:"assets/docs/gallery.png",
            initializeOnlyWhenVisible:"yes",
            maskType:"square",
            showPreloader:'no',
            maxWidth:1613,
            maxHeight:960
        });
        $('#slider_img').on('click', function(){
            rl0.show('slider', 1, 'docsProps')
        });

        new FWDSI({ 
            //main settings
            instanceName:"slider2_img_",
            displayType:"responsive",
            parentId:"slider2_img",
            imageSource:"assets/docs/gallery2.png",
            initializeOnlyWhenVisible:"yes",
            maskType:"square",
            showPreloader:'no',
            maxWidth:1613,
            maxHeight:960
        });
        $('#slider2_img').on('click', function(){
            rl0.show('slider', 2, 'docsProps')
        });

        new FWDSI({ 
            //main settings
            instanceName:"slider3_img_",
            displayType:"responsive",
            parentId:"slider3_img",
            imageSource:"assets/docs/gallery3.png",
            initializeOnlyWhenVisible:"yes",
            maskType:"square",
            showPreloader:'no',
            maxWidth:1613,
            maxHeight:960
        });
        $('#slider3_img').on('click', function(){
            rl0.show('slider', 3, 'docsProps')
        });

        new FWDSI({ 
            //main settings
            instanceName:"shortcode_img_",
            displayType:"responsive",
            parentId:"shortcode_img",
            imageSource:"assets/docs/shortcode.png",
            initializeOnlyWhenVisible:"yes",
            maskType:"square",
            showPreloader:'no',
            maxWidth:1613,
            maxHeight:960
        });
        $('#shortcode_img').on('click', function(){
            rl0.show('slider', 5, 'docsProps')
        });

    }

    

    // Uitls.
    function elementIsVisibleInViewport(el, partiallyVisible){
		const { top, left, bottom, right } = el.getBoundingClientRect();
		const { innerHeight, innerWidth } = window;
		return partiallyVisible
		  ? ((top >= 0 && top <= innerHeight + 80) ||
			  (bottom >= 0 && bottom <= innerHeight)) &&
			  ((left >= 0 && left <= innerWidth) || (right >= 0 && right <= innerWidth))
		  : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
	};

    function getChildren(el, allNodesTypes){
		let kids = [];
		for(let c = el.firstChild; c != null; c = c.nextSibling){
			if(allNodesTypes){
				kids.push(c);
			}else if(c.nodeType === 1){
				kids.push(c);
			}
		}
		return kids;
	};

   
});

/*! highlight.js */
!function(e){var n="object"==typeof window&&window||"object"==typeof self&&self;"undefined"!=typeof exports?e(exports):n&&(n.hljs=e({}),"function"==typeof define&&define.amd&&define([],function(){return n.hljs}))}(function(e){function n(e){return e.replace(/[&<>]/gm,function(e){return I[e]})}function t(e){return e.nodeName.toLowerCase()}function r(e,n){var t=e&&e.exec(n);return t&&0===t.index}function i(e){return k.test(e)}function a(e){var n,t,r,a,o=e.className+" ";if(o+=e.parentNode?e.parentNode.className:"",t=B.exec(o))return R(t[1])?t[1]:"no-highlight";for(o=o.split(/\s+/),n=0,r=o.length;r>n;n++)if(a=o[n],i(a)||R(a))return a}function o(e,n){var t,r={};for(t in e)r[t]=e[t];if(n)for(t in n)r[t]=n[t];return r}function u(e){var n=[];return function r(e,i){for(var a=e.firstChild;a;a=a.nextSibling)3===a.nodeType?i+=a.nodeValue.length:1===a.nodeType&&(n.push({event:"start",offset:i,node:a}),i=r(a,i),t(a).match(/br|hr|img|input/)||n.push({event:"stop",offset:i,node:a}));return i}(e,0),n}function c(e,r,i){function a(){return e.length&&r.length?e[0].offset!==r[0].offset?e[0].offset<r[0].offset?e:r:"start"===r[0].event?e:r:e.length?e:r}function o(e){function r(e){return" "+e.nodeName+'="'+n(e.value)+'"'}l+="<"+t(e)+w.map.call(e.attributes,r).join("")+">"}function u(e){l+="</"+t(e)+">"}function c(e){("start"===e.event?o:u)(e.node)}for(var s=0,l="",f=[];e.length||r.length;){var g=a();if(l+=n(i.substring(s,g[0].offset)),s=g[0].offset,g===e){f.reverse().forEach(u);do c(g.splice(0,1)[0]),g=a();while(g===e&&g.length&&g[0].offset===s);f.reverse().forEach(o)}else"start"===g[0].event?f.push(g[0].node):f.pop(),c(g.splice(0,1)[0])}return l+n(i.substr(s))}function s(e){function n(e){return e&&e.source||e}function t(t,r){return new RegExp(n(t),"m"+(e.cI?"i":"")+(r?"g":""))}function r(i,a){if(!i.compiled){if(i.compiled=!0,i.k=i.k||i.bK,i.k){var u={},c=function(n,t){e.cI&&(t=t.toLowerCase()),t.split(" ").forEach(function(e){var t=e.split("|");u[t[0]]=[n,t[1]?Number(t[1]):1]})};"string"==typeof i.k?c("keyword",i.k):E(i.k).forEach(function(e){c(e,i.k[e])}),i.k=u}i.lR=t(i.l||/\w+/,!0),a&&(i.bK&&(i.b="\\b("+i.bK.split(" ").join("|")+")\\b"),i.b||(i.b=/\B|\b/),i.bR=t(i.b),i.e||i.eW||(i.e=/\B|\b/),i.e&&(i.eR=t(i.e)),i.tE=n(i.e)||"",i.eW&&a.tE&&(i.tE+=(i.e?"|":"")+a.tE)),i.i&&(i.iR=t(i.i)),null==i.r&&(i.r=1),i.c||(i.c=[]);var s=[];i.c.forEach(function(e){e.v?e.v.forEach(function(n){s.push(o(e,n))}):s.push("self"===e?i:e)}),i.c=s,i.c.forEach(function(e){r(e,i)}),i.starts&&r(i.starts,a);var l=i.c.map(function(e){return e.bK?"\\.?("+e.b+")\\.?":e.b}).concat([i.tE,i.i]).map(n).filter(Boolean);i.t=l.length?t(l.join("|"),!0):{exec:function(){return null}}}}r(e)}function l(e,t,i,a){function o(e,n){var t,i;for(t=0,i=n.c.length;i>t;t++)if(r(n.c[t].bR,e))return n.c[t]}function u(e,n){if(r(e.eR,n)){for(;e.endsParent&&e.parent;)e=e.parent;return e}return e.eW?u(e.parent,n):void 0}function c(e,n){return!i&&r(n.iR,e)}function g(e,n){var t=N.cI?n[0].toLowerCase():n[0];return e.k.hasOwnProperty(t)&&e.k[t]}function h(e,n,t,r){var i=r?"":y.classPrefix,a='<span class="'+i,o=t?"":C;return a+=e+'">',a+n+o}function p(){var e,t,r,i;if(!E.k)return n(B);for(i="",t=0,E.lR.lastIndex=0,r=E.lR.exec(B);r;)i+=n(B.substring(t,r.index)),e=g(E,r),e?(M+=e[1],i+=h(e[0],n(r[0]))):i+=n(r[0]),t=E.lR.lastIndex,r=E.lR.exec(B);return i+n(B.substr(t))}function d(){var e="string"==typeof E.sL;if(e&&!x[E.sL])return n(B);var t=e?l(E.sL,B,!0,L[E.sL]):f(B,E.sL.length?E.sL:void 0);return E.r>0&&(M+=t.r),e&&(L[E.sL]=t.top),h(t.language,t.value,!1,!0)}function b(){k+=null!=E.sL?d():p(),B=""}function v(e){k+=e.cN?h(e.cN,"",!0):"",E=Object.create(e,{parent:{value:E}})}function m(e,n){if(B+=e,null==n)return b(),0;var t=o(n,E);if(t)return t.skip?B+=n:(t.eB&&(B+=n),b(),t.rB||t.eB||(B=n)),v(t,n),t.rB?0:n.length;var r=u(E,n);if(r){var i=E;i.skip?B+=n:(i.rE||i.eE||(B+=n),b(),i.eE&&(B=n));do E.cN&&(k+=C),E.skip||(M+=E.r),E=E.parent;while(E!==r.parent);return r.starts&&v(r.starts,""),i.rE?0:n.length}if(c(n,E))throw new Error('Illegal lexeme "'+n+'" for mode "'+(E.cN||"<unnamed>")+'"');return B+=n,n.length||1}var N=R(e);if(!N)throw new Error('Unknown language: "'+e+'"');s(N);var w,E=a||N,L={},k="";for(w=E;w!==N;w=w.parent)w.cN&&(k=h(w.cN,"",!0)+k);var B="",M=0;try{for(var I,j,O=0;;){if(E.t.lastIndex=O,I=E.t.exec(t),!I)break;j=m(t.substring(O,I.index),I[0]),O=I.index+j}for(m(t.substr(O)),w=E;w.parent;w=w.parent)w.cN&&(k+=C);return{r:M,value:k,language:e,top:E}}catch(T){if(T.message&&-1!==T.message.indexOf("Illegal"))return{r:0,value:n(t)};throw T}}function f(e,t){t=t||y.languages||E(x);var r={r:0,value:n(e)},i=r;return t.filter(R).forEach(function(n){var t=l(n,e,!1);t.language=n,t.r>i.r&&(i=t),t.r>r.r&&(i=r,r=t)}),i.language&&(r.second_best=i),r}function g(e){return y.tabReplace||y.useBR?e.replace(M,function(e,n){return y.useBR&&"\n"===e?"<br>":y.tabReplace?n.replace(/\t/g,y.tabReplace):void 0}):e}function h(e,n,t){var r=n?L[n]:t,i=[e.trim()];return e.match(/\bhljs\b/)||i.push("hljs"),-1===e.indexOf(r)&&i.push(r),i.join(" ").trim()}function p(e){var n,t,r,o,s,p=a(e);i(p)||(y.useBR?(n=document.createElementNS("http://www.w3.org/1999/xhtml","div"),n.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n")):n=e,s=n.textContent,r=p?l(p,s,!0):f(s),t=u(n),t.length&&(o=document.createElementNS("http://www.w3.org/1999/xhtml","div"),o.innerHTML=r.value,r.value=c(t,u(o),s)),r.value=g(r.value),e.innerHTML=r.value,e.className=h(e.className,p,r.language),e.result={language:r.language,re:r.r},r.second_best&&(e.second_best={language:r.second_best.language,re:r.second_best.r}))}function d(e){y=o(y,e)}function b(){if(!b.called){b.called=!0;var e=document.querySelectorAll("pre code");w.forEach.call(e,p)}}function v(){addEventListener("DOMContentLoaded",b,!1),addEventListener("load",b,!1)}function m(n,t){var r=x[n]=t(e);r.aliases&&r.aliases.forEach(function(e){L[e]=n})}function N(){return E(x)}function R(e){return e=(e||"").toLowerCase(),x[e]||x[L[e]]}var w=[],E=Object.keys,x={},L={},k=/^(no-?highlight|plain|text)$/i,B=/\blang(?:uage)?-([\w-]+)\b/i,M=/((^(<[^>]+>|\t|)+|(?:\n)))/gm,C="</span>",y={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0},I={"&":"&amp;","<":"&lt;",">":"&gt;"};return e.highlight=l,e.highlightAuto=f,e.fixMarkup=g,e.highlightBlock=p,e.configure=d,e.initHighlighting=b,e.initHighlightingOnLoad=v,e.registerLanguage=m,e.listLanguages=N,e.getLanguage=R,e.inherit=o,e.IR="[a-zA-Z]\\w*",e.UIR="[a-zA-Z_]\\w*",e.NR="\\b\\d+(\\.\\d+)?",e.CNR="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BNR="\\b(0b[01]+)",e.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BE={b:"\\\\[\\s\\S]",r:0},e.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[e.BE]},e.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[e.BE]},e.PWM={b:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|like)\b/},e.C=function(n,t,r){var i=e.inherit({cN:"comment",b:n,e:t,c:[]},r||{});return i.c.push(e.PWM),i.c.push({cN:"doctag",b:"(?:TODO|FIXME|NOTE|BUG|XXX):",r:0}),i},e.CLCM=e.C("//","$"),e.CBCM=e.C("/\\*","\\*/"),e.HCM=e.C("#","$"),e.NM={cN:"number",b:e.NR,r:0},e.CNM={cN:"number",b:e.CNR,r:0},e.BNM={cN:"number",b:e.BNR,r:0},e.CSSNM={cN:"number",b:e.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0},e.RM={cN:"regexp",b:/\//,e:/\/[gimuy]*/,i:/\n/,c:[e.BE,{b:/\[/,e:/\]/,r:0,c:[e.BE]}]},e.TM={cN:"title",b:e.IR,r:0},e.UTM={cN:"title",b:e.UIR,r:0},e.METHOD_GUARD={b:"\\.\\s*"+e.UIR,r:0},e});hljs.registerLanguage("xml",function(s){var e="[A-Za-z0-9\\._:-]+",t={eW:!0,i:/</,r:0,c:[{cN:"attr",b:e,r:0},{b:/=\s*/,r:0,c:[{cN:"string",endsParent:!0,v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s"'=<>`]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist"],cI:!0,c:[{cN:"meta",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},s.C("<!--","-->",{r:10}),{b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{b:/<\?(php)?/,e:/\?>/,sL:"php",c:[{b:"/\\*",e:"\\*/",skip:!0}]},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{name:"style"},c:[t],starts:{e:"</style>",rE:!0,sL:["css","xml"]}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{name:"script"},c:[t],starts:{e:"</script>",rE:!0,sL:["actionscript","javascript","handlebars","xml"]}},{cN:"meta",v:[{b:/<\?xml/,e:/\?>/,r:10},{b:/<\?\w+/,e:/\?>/}]},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"name",b:/[^\/><\s]+/,r:0},t]}]}});hljs.registerLanguage("javascript",function(e){var r="[A-Za-z$_][0-9A-Za-z$_]*",t={keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await static import from as",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},a={cN:"number",v:[{b:"\\b(0[bB][01]+)"},{b:"\\b(0[oO][0-7]+)"},{b:e.CNR}],r:0},n={cN:"subst",b:"\\$\\{",e:"\\}",k:t,c:[]},c={cN:"string",b:"`",e:"`",c:[e.BE,n]};n.c=[e.ASM,e.QSM,c,a,e.RM];var s=n.c.concat([e.CBCM,e.CLCM]);return{aliases:["js","jsx"],k:t,c:[{cN:"meta",r:10,b:/^\s*['"]use (strict|asm)['"]/},{cN:"meta",b:/^#!/,e:/$/},e.ASM,e.QSM,c,e.CLCM,e.CBCM,a,{b:/[{,]\s*/,r:0,c:[{b:r+"\\s*:",rB:!0,r:0,c:[{cN:"attr",b:r,r:0}]}]},{b:"("+e.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[e.CLCM,e.CBCM,e.RM,{cN:"function",b:"(\\(.*?\\)|"+r+")\\s*=>",rB:!0,e:"\\s*=>",c:[{cN:"params",v:[{b:r},{b:/\(\s*\)/},{b:/\(/,e:/\)/,eB:!0,eE:!0,k:t,c:s}]}]},{b:/</,e:/(\/\w+|\w+\/)>/,sL:"xml",c:[{b:/<\w+\s*\/>/,skip:!0},{b:/<\w+/,e:/(\/\w+|\w+\/)>/,skip:!0,c:[{b:/<\w+\s*\/>/,skip:!0},"self"]}]}],r:0},{cN:"function",bK:"function",e:/\{/,eE:!0,c:[e.inherit(e.TM,{b:r}),{cN:"params",b:/\(/,e:/\)/,eB:!0,eE:!0,c:s}],i:/\[|%/},{b:/\$[(.]/},e.METHOD_GUARD,{cN:"class",bK:"class",e:/[{;=]/,eE:!0,i:/[:"\[\]]/,c:[{bK:"extends"},e.UTM]},{bK:"constructor",e:/\{/,eE:!0}],i:/#(?!!)/}});