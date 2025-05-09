/**
 * Linear Slider PACKAGED v:1.0
 * Ripple distortion fragment.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

uniform sampler2D tDiffuse;
uniform float uDistortion; // Distortion intensity

uniform vec2 uQuadSize;
uniform float uVisibility;
uniform float uOpacity;
uniform float uDistortionSize;

uniform float uTime; // Time for animation
uniform sampler2D uDistortionTexture; 
uniform vec2 uDistortionTextureSize;
uniform float uLiquidDisotrionStrength;


varying vec2 vUv;

#include utils.glsl;


void main() {
    

    // Get the original UV coordinates
    vec2 uv = vUv;


    // Scale UVs based on the relationship between quad size and texture size
    vec2 repeatedUV = uv * (uQuadSize / uDistortionTextureSize);


    // Wrap UVs to make them repeat
    repeatedUV = fract(repeatedUV - 0.0001);


    // Add time-based movement for dynamic distortion
    // Move the left side to the left and the right side to the right
    vec2 timeShiftedUV = repeatedUV;
    float direction = uv.x < 0.5 ? -1.0 : 1.0; // Left moves left, right moves right
    timeShiftedUV.x += direction * -uTime *0.1; // Adjust speed and direction


    // Sample the distortion texture with the time-shifted UVs
    vec4 distortionTexture = texture2D(uDistortionTexture, timeShiftedUV);


    // Existing distortion on the x-axis
    float distortionX = distortionTexture.r * uLiquidDisotrionStrength;


    // Calculate the distance from the center (horizontal only)
    float distortionSize = remap(uDistortionSize, 0.0, 1.0, 0.3, 0.0);
    float edgeFalloff = smoothstep(distortionSize, 0.9, abs(uv.x - 0.5)); // Adjust falloff range as needed


    // Apply distortion based on position:
    vec2 distortedUV = uv + vec2(distortionX * uDistortion * 0.9 * edgeFalloff * direction, 0.0);


    // Sample the base texture with distorted UV coordinates
    vec4 finalColor = texture2D(tDiffuse, mirrored(distortedUV));


    // Output the final color
    gl_FragColor = finalColor;  
}