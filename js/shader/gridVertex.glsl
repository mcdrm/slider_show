/**
 * Linear Slider PACKAGED v:1.0
 * Grid vertex.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */


uniform float uRGBDistortionProgress; // Scroll distortion intensity
uniform float uCurveOffset; // Controls the curve interpolation
uniform float uRadius; // Bend radius
uniform float uCentralAngle; // Central angle of the segment
uniform vec2 uvScale; // UV scaling
uniform float uIntroTransition; // Intro transition
uniform float uHover; // Hover effect
uniform float uReflectionSplit; // Reflection split
uniform float uCurveDistortionStrengthX;
uniform float uCurveDistortionStrengthY;
uniform float uOpacity; // Opacity

varying vec2 vUv; // Pass UVs to fragment shader

#include utils.glsl;




void main() {

    // Pass UVs to fragment shader
    vUv = uv;

    vec3 newPos = position;


    // Add scroll distortion along the X-axis
    float newDistortion = uCurveDistortionStrengthX;
    float scrollCurve = sin(PI * vUv.y) * newDistortion; // Sinusoidal curve based on vUv.y

    if (uReflectionSplit >= 0.5) {

        // Apply skew effect directly
        newPos.x += vUv.y * newDistortion; // Skew based on vUv.y
        newPos.x += scrollCurve * 2.; // Add scroll distortion
    } else {

        // Apply skew effect directly for the other case
        newPos.x += vUv.y * newDistortion; // Skew based on vUv.y
        newPos.x += scrollCurve * 2.; // Add scroll distortion
    }

    // Update position with distortion
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}