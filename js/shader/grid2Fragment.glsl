/**
 * Linear Slider PACKAGED v:1.0
 * Grid postproc fragment.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */


uniform sampler2D uTexture;
uniform float uDistortionX; // Distortion intensity X
uniform float uDistortionY; // Distortion intensity Y (NEW)
uniform vec2 uvScale;
uniform vec2 uTextureSize;
uniform vec2 uQuadSize;
uniform vec2 uResolution;
uniform float uVisibility;
uniform float uOpacity;
uniform float uIntroOpacity;
uniform float uTime; // Time for animation
uniform sampler2D uDistortionXTexture; 
uniform float uLiquidDisotrionStrength;
uniform vec2 uDistortionXTextureSize;
uniform float uHover;
uniform vec2 uMouse;

varying vec2 vUv;

#include utils.glsl;

void main() {


    // Scale UVs based on the relationship between quad size and texture size for uTexture
    vec2 uvForTexture = getUV(vUv, uTextureSize, uQuadSize);


    // Use original vUv for uDistortionXTexture
    vec2 uvForDistortion = vUv + uDistortionX * 0.3; // Adjust intensity with uDistortionX


    // Sample the distortion texture
    vec4 distortionTexture = texture2D(uDistortionXTexture, uvForDistortion);


    // Extract X and Y distortion from the texture
    float distortionX = (distortionTexture.r * (10.0 * uLiquidDisotrionStrength) - (5.0 * uLiquidDisotrionStrength));
    float distortionY = (distortionTexture.r * (10.0 * uLiquidDisotrionStrength) - (5.0 * uLiquidDisotrionStrength)); // Y Distortion


    // Apply both distortions
    vec2 distortedUV = uvForTexture + vec2(distortionX, distortionY) * vec2(uDistortionX, uDistortionY) * 0.1;


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
