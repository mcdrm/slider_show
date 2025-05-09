uniform float uTransitionScale;
uniform float uTime;
uniform float uIntroTransition;
uniform float uReflectionSplit;
uniform float uCurveDistortionStrength;
uniform float uDefaultCurveDistortionStrength;
uniform float uOpacity;
uniform float uNoiseFrequency;
uniform float uNoiseAmplitude;
uniform float uNoiseSpeed;
uniform float uBendStrength;
uniform float uPosition;        // still your Z-bend strength
uniform float uPositionSpeed;   // NEW: how much to tip on Y (radians)
uniform bool  uBendVertices;

varying vec2 vUv;
#include utils.glsl

void main(){

    // UV
    vUv = (uv - vec2(0.5)) * (0.99 * uTransitionScale) + vec2(0.5);


    // Base
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vec3 newPos   = position;

    if(uBendVertices){

		float arcLimit        = 2.5 * 0.7;
		float arcFadeDistance = 2.5 * 0.7;
		float arcDepth        = 1.8 * uBendStrength * 0.7;
		
        // Original per-vertex Z-bend
        float distance   = abs(worldPos.x);
        float t          = clamp(worldPos.x / arcLimit, -1.0, 1.0);
        float curve      = (1.0 - t*t) * arcDepth;
        float arcFalloff = 1.0 - smoothstep(
                               arcLimit - arcFadeDistance,
                               arcLimit,
                               distance
                           );
        newPos.z += curve * arcFalloff;
    } else {
		float arcLimit        = 2.5 * 0.65;
		float arcFadeDistance = 2.5 * 0.65 ;
		float arcDepth        = 1.8 * uBendStrength * 0.65;


		// Mesh-center in world X
		vec4 originWorld = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
		float ox   = originWorld.x;
		float t0   = clamp(ox / arcLimit, -1.0, 1.0);
		float f0   = 1.0 - smoothstep(
						arcLimit - arcFadeDistance,
						arcLimit,
						abs(ox)
					);


		//  Rigid Z-offset along the curve
		float disp0 = (1.0 - t0*t0) * arcDepth * f0;
		vec3 rigidPos = position;
		rigidPos.z += disp0;


		//  Uniform Y-tip: zero at center (t0=0), max at edges (|t0|=1)
		float angle = abs(t0) * uPositionSpeed *0.6* f0;
		float s     = sin(angle), c = cos(angle);


		//  Apply that single Y-rotation to the whole mesh
		newPos.x = rigidPos.x * c - rigidPos.z * s;
		newPos.y = rigidPos.y;
		newPos.z = rigidPos.x * s + rigidPos.z * c;
	}


    // Wobble
    newPos.x += sin(uTime) * 0.02;
    vUv.x   -= sin(uTime) * 0.02;


    // Noise
    if(uNoiseFrequency > 0.0 && uNoiseAmplitude > 0.0){
        vec3 noisePos = vec3(
            newPos.x * uNoiseFrequency + uTime * uNoiseSpeed,
            newPos.y,
            newPos.z
        );
        newPos.z += snoise(noisePos) * uNoiseAmplitude;
    }


	// Curve distortion
	float newDistortion = uCurveDistortionStrength;
	float scrollCurve =  sin(PI * uv.y) * (newDistortion + uDefaultCurveDistortionStrength);
    newPos.x += uv.y * newDistortion;
	newPos.x += scrollCurve;


    // Final
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
