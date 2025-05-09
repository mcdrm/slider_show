uniform sampler2D tDiffuse;
uniform sampler2D uRippleTexture;
varying vec2 vUv;

const float PI = 3.141592653589793238;

void main() {
    vec4 rippleColor = texture2D(uRippleTexture, vUv);

    float theta = rippleColor.r * PI * 2.0;
    vec2 dir = vec2(cos(theta), sin(theta));
    float edgeFade = smoothstep(0.99, 0.9, vUv.x);

    vec2 distortedUV = vUv + dir * rippleColor.r * 0.0175 * edgeFade;
    distortedUV = clamp(distortedUV, 0.001, 0.999);

    vec4 color = texture2D(tDiffuse, distortedUV);

    // Un-premultiply alpha
    if (color.a > 0.0) {
        color.rgb /= color.a;
    }

    gl_FragColor = color;
}