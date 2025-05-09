/**
 * Linear Slider PACKAGED v:1.0
 * Preloader.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */


import FWDLSUtils from "./FWDLSUtils";

export default class FWDLSPreloader {


    constructor(parentElement, color, fixed = false) {
        this.parentElement = parentElement;
      
        this.color = color;
        this.fixed = fixed;
        this.circles = [];
        this.positions = [];
        this.smoothness = 0.3; // Adjust for smooth movement
        this.circleCount = 10;
        this.duration = "1.8s";
        
        if (this.fixed) {
            this.circleCount = 5;
            this.duration = "2.5s";
        }

        // Create a container for the SVGs
        this.svgHolder = document.createElement("div");
        this.svgHolder.style.zIndex = 11111;
        this.svgHolder.style.position = 'absolute'
        this.svgHolder.style.overflow = "visible";
        this.svgHolder.style.opacity = "0";


        // Change intro opacity
        this.settings = {
            opacity: 0,
        }

        FWDAnimation.to(this.settings, 1, {
            delay: 0.1,
            opacity: 1,
            onUpdate: () => {
              this.svgHolder.style.opacity = this.settings.opacity;
            }
        });

        this.parentElement.appendChild(this.svgHolder);

        this.updateCenterPosition = this.updateCenterPosition.bind(this);
        this.updatePosition = this.updatePosition.bind(this);
        window.addEventListener("resize", this.updateCenterPosition);
    }


    /**
     * Update the center position of the preloader based on the parent's dimensions
     */
    updateCenterPosition() {

        // Use parent's offsetWidth/offsetHeight for the center coordinates
        this.centerX = this.parentElement.offsetWidth / 2;
        this.centerY = this.parentElement.offsetHeight / 2;
        this.mouseX = this.centerX;
        this.mouseY = this.centerY;


        // Reposition all circles to the center
        this.circles.forEach(circle => {
          circle.style.transform = `translate(${this.centerX - 22}px, ${this.centerY - 22}px)`;
        });

    }


    /**
     * Create an SVG element with the specified tag and attributes
     */
    createSVGElement(tag, attributes) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (let key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }


    /**
     * Create an SVG animation element with the specified attributes
     */
    createAnimation(attributeName, begin, values, keySplines) {
        return this.createSVGElement("animate", {
            attributeName,
            begin,
            dur: this.duration,
            values,
            calcMode: "spline",
            keyTimes: "0; 1",
            keySplines,
            repeatCount: "indefinite"
        });
    }


    /**
     * Create a circle SVG element with animations for the specified delay
     */
    createCircle(delay) {

        const svg = this.createSVGElement("svg", {
            width: "44",
            height: "44",
            viewBox: "0 0 44 44",
            xmlns: "http://www.w3.org/2000/svg",
            style: "position: absolute; pointer-events: none;"
        });


        // All circles start with 0 opacity and are optimized for GPU acceleration
        svg.style.opacity = "0";
        svg.style.willChange = "transform, opacity";

        const circle = this.createSVGElement("circle", {
            cx: "22",
            cy: "22",
            r: "1",
            stroke: this.color,
            "stroke-width": "2",
            fill: "none"
        });

        circle.appendChild(
            this.createAnimation("r", `${delay}s`, "1; 20", "0.165, 0.84, 0.44, 1")
        );
        circle.appendChild(
            this.createAnimation("stroke-opacity", `${delay}s`, "1; 0", "0.3, 0.61, 0.355, 1")
        );

        svg.appendChild(circle);


        // Append the SVG to the svgHolder container
        this.svgHolder.appendChild(svg);
        return svg;
    }


    /**
     * Render the preloader
     */
    render() {

        // Set the initial center position using parent's dimensions
        this.updateCenterPosition();
        this.circles = [];
        this.positions = [];

        for (let i = 0; i < this.circleCount; i++) {
            const circle = this.createCircle(-i * 0.4);
            this.circles.push(circle);
            this.positions.push({ x: this.centerX, y: this.centerY });


            // Position the circle at the center
            circle.style.transform = `translate(${this.centerX - 22}px, ${this.centerY - 22}px)`;


            // Fade in the circle immediately
            circle.style.transition = "opacity 0.5s ease";
            circle.style.opacity = "1";
        }

        if (!this.fixed) {
            this.parentElement.addEventListener("mousemove", this.updatePosition);
        }


        // Start the animation loop using requestAnimationFrame
        this.animate();
    
    }


    /**
     * Animate the preloader by moving the circles smoothly
     */
    animate() {
        this.smoothMove();
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }


    /**
     * Update the mouse position for the pre
     */
    updatePosition(e) {
        if (!this.fixed) {
            const wc = FWDLSUtils.getViewportMouseCoordinates(e);
            const rect = this.parentElement.getBoundingClientRect();
            this.mouseX = wc.x - rect.left;
            this.mouseY = wc.y - rect.top;
        }
    }

    /**
     * Smoothly move the circles based on the mouse position
     */
    smoothMove() {
        let prevX = this.mouseX;
        let prevY = this.mouseY;
        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            const pos = this.positions[i];
            pos.x += (prevX - pos.x) * (this.smoothness - i * 0.02);
            pos.y += (prevY - pos.y) * (this.smoothness - i * 0.02);
            circle.style.transform = `translate(${pos.x - 22}px, ${pos.y - 22}px)`;
            prevX = pos.x;
            prevY = pos.y;
        }
    }


    /**
     * Stop rendering the preloader and fade out the circles
     */
    stopRender() {

      // Begin fade out on all circles but keep smoothMove running
      let remaining = this.circles.length;
      this.circles.forEach(circle => {
          circle.style.transition = "opacity 1s ease";
          const onTransitionEnd = e => {
              if (e.propertyName === "opacity") {
                remaining--;
                circle.removeEventListener("transitionend", onTransitionEnd);
                if (remaining === 0) {
                    if (!this.fixed) {
                        this.parentElement.removeEventListener("mousemove", this.updatePosition);
                    }
                  cancelAnimationFrame(this.animationFrameId);
                }
              }
          };
          circle.addEventListener("transitionend", onTransitionEnd);
          circle.style.opacity = "0";
        });
    }


    /**
     * Destroy the preloader and remove all event listeners
     */
    destroy() {
        cancelAnimationFrame(this.animationFrameId);
        
        this.circles.forEach(circle => {
            if (circle.parentNode) {
              circle.parentNode.removeChild(circle);
            }
        });

        this.circles = [];
        this.positions = [];

        if (!this.fixed) {
            this.parentElement.removeEventListener("mousemove", this.updatePosition);
        }
        
        window.removeEventListener("resize", this.updateCenterPosition);
    }
}
