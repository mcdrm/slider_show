/**
 * Linear Slider PACKAGED v:1.0
 * Wave fragment.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

uniform sampler2D tDiffuse;
uniform float uOpacity;
uniform vec2 resolution;
uniform float uTime;
uniform float uDistortion;
uniform float uRGBOffsetStrength;
uniform float uWaveFrequency;
uniform float uWaveAmplitude;

varying vec2 vUv;

#include utils.glsl

void main() {
    // Base UV coordinates
    vec2 p = vUv;

    // Apply mirrored wrapping to the UVs
    vec2 newUV = mirrored(p);

    // Sine wave parameters for distortion
    float waveAmplitude = 0.1 * uWaveAmplitude;
    float waveFrequency = 50.0 * uWaveFrequency;
    float sineWave = sin(newUV.y * waveFrequency + uTime * 2.0) * waveAmplitude;

    // Apply the sine wave distortion to the mirrored UVs
    newUV.x += sineWave * 1.11;

    // RGB shift offsets (horizontal only)
    vec2 rgbOffset = vec2(0.0, 0.01 * uRGBOffsetStrength);

    // Sample each channel with offsets
    float r = texture2D(tDiffuse, newUV).r;
    float g = texture2D(tDiffuse, mirrored(newUV + rgbOffset)).g;
    float b = texture2D(tDiffuse, mirrored(newUV - rgbOffset)).b;

    // Preserve original alpha and apply uOpacity
    float a = texture2D(tDiffuse, newUV).a * uOpacity;

    // Combine final color with preserved opacity
    gl_FragColor = vec4(r, g, b, a);
}
