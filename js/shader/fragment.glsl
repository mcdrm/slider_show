/**
 * Linear Slider PACKAGED v:1.0
 * Default fragment.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

uniform sampler2D uTexture;
uniform float uDistortion; // Distortion intensity
uniform vec2 uvScale;
uniform vec2 uTextureSize;
uniform vec2 uQuadSize;
uniform vec2 uResolution;
uniform float uVisibility;
uniform float uOpacity;
uniform float uIntroOpacity;
uniform float uTime; // Time for animation
uniform sampler2D uDistortionTexture; 
uniform float uLiquidDisotrionStrength;
uniform vec2 uDistortionTextureSize;
uniform float uHover;
uniform vec2 uMouse;
uniform bool uIsHorizontal;

varying vec2 vUv;

#include utils.glsl;

void main() {

    // Scale UVs based on the relationship between quad size and texture size for uTexture
    vec2 uvForTexture = getUV(vUv, uTextureSize, uQuadSize);

    // Use original vUv for uDistortionTexture
    vec2 uvForDistortion = vUv + uDistortion * 0.3; // Adjust intensity with uDistortion

    // Sample the distortion texture
    vec4 distortionTexture = texture2D(uDistortionTexture, uvForDistortion);

    // 🔄 Updated: distortion on Y-axis instead of X-axis
    float distortionY = (distortionTexture.r * (10.0 * uLiquidDisotrionStrength) - (5.0 * uLiquidDisotrionStrength));
    vec2 distortedUV;
    if (uIsHorizontal) {
        distortedUV = uvForTexture + vec2(distortionY, 0.0) * uDistortion * 0.1;
    }else{
         distortedUV = uvForTexture + vec2(0.0, distortionY) * uDistortion * 0.1;     
    }

    // Sample the base texture with distorted UV coordinates
    vec4 baseColor = texture2D(uTexture, mirrored(distortedUV));

    // Convert the texture to grayscale (using luminance formula)
    float gray = dot(baseColor.rgb, vec3(0.299, 0.587, 0.114));
    vec4 grayColor = vec4(vec3(gray), baseColor.a);

    // Make the transition to black-and-white more aggressive
    float aggressiveVisibility = smoothstep(0.5, 1.0, uVisibility); // Remap uVisibility to enhance the effect

    // Interpolate between full color and grayscale based on modified visibility
    vec4 finalColor = mix(grayColor, baseColor, aggressiveVisibility);

    finalColor.a *= uOpacity * uIntroOpacity; // Separate reflection alpha effect

    // Output the final color
    gl_FragColor = finalColor;
    
}
