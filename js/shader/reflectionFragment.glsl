/**
 * Linear Slider PACKAGED v:1.0
 * Reflection fragmet.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

uniform sampler2D uTexture;
uniform float uDistortion; // Distortion intensity
uniform float uTime; // Time for animation
uniform vec2 uvScale;
uniform vec2 uTextureSize;
uniform vec2 uQuadSize;
uniform float uVisibility;       
uniform float uOpacity;  
uniform float uIntroOpacity;
uniform float uBlurStrength;
uniform float uReflectionSize;
uniform sampler2D uDistortionTexture;
uniform float uLiquidDisotrionStrength;
uniform float uHover;
uniform vec2 uMouse;
uniform float uFlipped;

varying vec2 vUv;
varying vec3 vNormal;

#include utils.glsl;

void main() {
    vec2 flippledUV = vUv;
    if (uFlipped > 0.5) {
        flippledUV = vec2(vUv.x, 1.0 - vUv.y);
    }


    // Base UV sampling
    vec2 uvForTexture = mirrored(getUV(flippledUV, uTextureSize, uQuadSize));
    vec2 uvForDistortion = flippledUV + uDistortion * 0.3;


    // Distortion logic
    vec4 distortionTexture = texture2D(uDistortionTexture, uvForDistortion);
   
    float distortionX = (distortionTexture.r * (10.0 * uLiquidDisotrionStrength) - (5.0 * uLiquidDisotrionStrength));
    vec2 distortedUV = uvForTexture + vec2(distortionX, 0.0) * uDistortion * 0.3;


    // Center the UVs around (0.0, 0.0) for distortion to originate from the center
    vec2 centeredUV = distortedUV - vec2(0.5);


    // Zoom out the UVs based on uHover
    centeredUV *= mix(1.0, 0.9, uHover); // Linear interpolation for zoom-out


    // Apply slight UV movement based on mouse position when hovered
    if (uHover > 0.0) {
        vec2 mouseOffset = (uMouse - vec2(0.5)) * 0.05 * uHover; // Scale the offset based on uHover
        centeredUV += mouseOffset;
    }


    // Restore UVs to their original range
    distortedUV = centeredUV + vec2(0.5);


    // Clamp UVs to prevent invalid sampling
    vec2 clampedUV = clamp(mirrored(distortedUV), vec2(0.0), vec2(1.0));


    // Compute base blur mask
    float baseBlurMask = clamp(1.0 - vUv.y, 0.0, 1.0);
    if (uFlipped > 0.5) {
        baseBlurMask = clamp(vUv.y, 0.0, 1.0);
    }


    // Use an ease-in function for blur (soft start, sudden drop-off)
    float easedBlurMask = pow(baseBlurMask, 12.0); // High exponent = slow start, fast fade


    // Apply easing to blur strength
    float dynamicBlurStrength = remap(uBlurStrength, 0., 1., 0., 0.2) * easedBlurMask;


    // Blur parameters
    float blurRadius = 0.5 * dynamicBlurStrength;
    int blurSteps = max(1, int(floor(40.0 * clamp(dynamicBlurStrength, 0.0, 1.0))));
    vec4 blurredColor = vec4(0.0);


    // Apply linear blur along the Y-axis with clamped UVs
    for (int i = -blurSteps; i <= blurSteps; i++) {
        float offset = float(i) * blurRadius / float(blurSteps);
        blurredColor += texture2D(uTexture, clampedUV + vec2(0.0, offset));
    }
    blurredColor /= float(blurSteps * 2 + 1); // Normalize the blur effect


    // Compute base reflection mask
    float baseMask = clamp(1.0 - vUv.y, 0.0, 1.0);
    if (uFlipped > 0.5) {
        baseMask = clamp(vUv.y, 0.0, 1.0);
    }


    // Use an ease-in function for a soft start and sharp drop-off
    float easedMask = pow(baseMask, 12.0); // Higher exponent = slower start, sudden fade at the end


    // Interpolate between fully invisible (0) and the full mask effect
    float reflectionMask = mix(0.0, easedMask, uReflectionSize);


    // Apply reflection mask only to alpha
    float finalAlpha = reflectionMask * uOpacity * uIntroOpacity;


    // Fix: Ensure transparent areas have neutral RGB (matching background)
    vec3 baseColor = blurredColor.rgb;
    if (finalAlpha < 0.01) {
        baseColor = vec3(1.0); // White background; set to vec3(0.0) for black or customize
    }


    // Convert the texture to grayscale (using luminance formula)
    float gray = dot(baseColor.rgb, vec3(0.299, 0.587, 0.114));
    vec4 grayColor = vec4(vec3(gray), finalAlpha);


    // Make the transition to black-and-white more aggressive
    float aggressiveVisibility = smoothstep(0.5, 1.0, uVisibility); // Remap uVisibility to enhance the effect


    // Interpolate between full color and grayscale based on modified visibility
    vec4 outputColor = mix(grayColor, vec4(baseColor, finalAlpha), aggressiveVisibility);


    // Output final color
    gl_FragColor = outputColor;

}