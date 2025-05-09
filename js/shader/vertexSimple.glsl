/**
 * Linear Slider PACKAGED v:1.0
 * Simple vertex.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

varying vec2 vUv;
float PI = 3.141592653589793238;

void main() {
  vUv = uv;
 
  vec3 newPosition = vec3(position);
 
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
}