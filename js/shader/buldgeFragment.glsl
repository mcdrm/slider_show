/**
 * Bleed-Proof Uniform Bulge Shader
 * Author: Tibi - FWDesign
 */

uniform sampler2D tDiffuse;
uniform float uBulgeStrength;

varying vec2 vUv;

// How much margin to leave on all sides (shrink UV region to avoid edges)
const float margin = 0.1;

vec2 distort(vec2 uv, float strength) {
    // Step 1: Remap UVs to a smaller region (crop 5% from edges)
    vec2 safeUV = mix(vec2(margin), vec2(1.0 - margin), uv);

    // Step 2: Distortion logic
    vec2 offset = safeUV - 0.5;
    float r2 = dot(offset, offset);

    float k = -1.0 * strength;
    float kcube = 0.5 * strength;

    float f = 1.0 + r2 * (k + kcube * sqrt(r2));
    vec2 nUv = f * offset + 0.5;

    return nUv;
}

void main() {
    vec2 uv = distort(vUv, uBulgeStrength);
    gl_FragColor = texture2D(tDiffuse, uv);
}
