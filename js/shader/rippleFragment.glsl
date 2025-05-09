/**
 * Linear Slider PACKAGED v:1.0
 * Ripple fragment.
 * @author Tibi - FWDesign [https://webdesign-flash.ro/]
 * Copyright © Since 2006 All Rights Reserved.
 */

uniform sampler2D uTexture;
varying vec2 vUv;

void main()	{

	vec4 displacement = texture2D(uTexture, vUv);
	gl_FragColor = displacement;
}