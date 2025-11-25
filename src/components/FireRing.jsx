"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";

const noiseFunctions = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
`;

const fireVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;

  ${noiseFunctions}

  void main() {
    vUv = uv;

    vec3 pos = position;

    // FLICKER EFFECT
    // We displace the vertices based on noise to make the fire shape unstable.
    // We multiply by uv.y so the bottom of the ring stays fixed to the ground.
    float noiseVal = snoise(vec2(pos.x * 0.5 + uTime, pos.z * 0.5 + uTime));
    
    pos.x += noiseVal * 0.2 * uv.y; 
    pos.z += noiseVal * 0.2 * uv.y;

    vElevation = uv.y; // Pass height to fragment to fade out top

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fireFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  
  varying vec2 vUv;
  varying float vElevation;

  ${noiseFunctions}

  void main() {
    // 1. RISING NOISE
    // Create two layers of noise moving upwards at different speeds
    float noise1 = snoise(vec2(vUv.x * 5.0, vUv.y * 2.0 - uTime * 1.5));
    float noise2 = snoise(vec2(vUv.x * 10.0, vUv.y * 4.0 - uTime * 2.5));
    
    // Combine them for organic look
    float combinedNoise = noise1 * 0.5 + noise2 * 0.5;

    // 2. SHAPE THE FLAME
    // The flame should be solid at the bottom (y=0) and broken at the top (y=1)
    float strength = (1.0 - vUv.y) * 1.5; // Base strength fades as it goes up
    strength += combinedNoise * 0.5;      // Add the noise "licks"

    // Cutoff to create sharp flame edges (Transparency)
    float alpha = smoothstep(0.3, 0.6, strength);
    
    // Don't let alpha exceed 1
    alpha = clamp(alpha, 0.0, 1.0);

    // 3. COLOR GRADIENT (HDR)
    // Mix between Red (Bottom) and Yellow/White (Tips)
    // We use high numbers (5.0, 2.0) to trigger BLOOM
    vec3 baseColor = vec3(4.0, 0.5, 0.1); // Deep Red/Orange
    vec3 tipColor = vec3(5.0, 3.0, 1.0);  // Hot Yellow/White

    // Mix based on height and noise
    vec3 finalColor = mix(baseColor, tipColor, strength * vUv.y);

    // 4. FINAL OUTPUT
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const FireRing = ({ position = [0, 0, 0], scale = 1 }) => {
  const meshRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* The Fire Mesh */}
      <mesh ref={meshRef} position={[0, 1, 0]}>
        <cylinderGeometry args={[4, 4, 2, 40, 20, true]} />
        <shaderMaterial
          vertexShader={fireVertexShader}
          fragmentShader={fireFragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight
        position={[0, 1, 0]}
        color="#ff6600"
        intensity={5}
        distance={10}
        decay={2}
      />
    </group>
  );
};

export default FireRing;
