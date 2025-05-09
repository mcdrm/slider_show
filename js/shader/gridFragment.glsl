/**
 * Linear Slider PACKAGED v:1.0
 * Grid postproc fragment.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */


// Uniforms
uniform float uTime;
uniform float uIntensity;
uniform float uProgress;
uniform vec2 uQuadSize;
uniform bool uAddRGBDistortion;
uniform sampler2D tDiffuse;
uniform sampler2D uDisplacement;

varying vec2 vUv;

#include utils.glsl;

void main() {

    // Sample the displacement texture to get the offset
    vec4 offset = texture2D(uDisplacement, vUv);
    
    vec4 color = vec4(0.0);

    // Apply different offsets for each color channel to create the RGB shift effect
    if(uAddRGBDistortion){
        vec4 colorR = texture2D(tDiffuse, mirrored(vUv - 0.02 * offset.rg));    
        vec4 colorG = texture2D(tDiffuse, mirrored(vUv - 0.015 * offset.rg));   
        vec4 colorB = texture2D(tDiffuse, mirrored(vUv - 0.01 * offset.rg));

        // Use the average alpha from the RGB samples (or pick one, e.g. colorR.a)
        float alpha = (colorR.a + colorG.a + colorB.a) / 3.0;

        color = vec4(colorR.r, colorG.g, colorB.b, alpha);
    } else {
        vec4 texColor = texture2D(tDiffuse, mirrored(vUv - 0.02 * offset.rg));
        color = vec4(texColor.rgb, texColor.a);
    }

    // Output the final color
    gl_FragColor = color;
}
