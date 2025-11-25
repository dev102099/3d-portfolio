"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

// --- VERTEX SHADER ---
const particleVertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uSpeed;
  uniform vec3 uRange; // The size of the box they float in

  attribute float aRandom;
  attribute float aSpeedOffset; // Some particles move faster than others

  varying float vAlpha; // Pass transparency to fragment
  varying float vRandom;

  void main() {
    vRandom = aRandom;
    
    // 1. CALCULATE LIFECYCLE (0.0 to 1.0)
    // We add a huge random offset so they don't all reset at once.
    // mod() makes the value loop continuously from 0 to 1.
    float time = uTime * uSpeed * aSpeedOffset;
    float life = mod(time + aRandom * 100.0, 1.0);

    // 2. SET POSITION BASED ON LIFE
    vec3 pos = position;

    // Move Upwards: Map life (0..1) to Y range (-50..50)
    // They will travel from bottom to top, then snap back to bottom
    float heightRange = uRange.y;
    pos.y = (life * heightRange) - (heightRange * 0.5);

    // 3. ADD CHAOTIC WANDERING (X and Z)
    // Use trig functions to make them drift like dust motes
    pos.x += cos(uTime * 0.5 + aRandom * 10.0) * 5.0;
    pos.z += sin(uTime * 0.5 + aRandom * 10.0) * 5.0;

    // 4. CALCULATE FADE (vAlpha)
    // Smoothstep creates a soft fade-in and fade-out
    // Fade in: 0.0 to 0.1
    // Fade out: 0.8 to 1.0
    float fadeIn = smoothstep(0.0, 0.1, life);
    float fadeOut = 1.0 - smoothstep(0.8, 1.0, life);
    vAlpha = fadeIn * fadeOut;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation
    gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z);
  }
`;

// --- FRAGMENT SHADER ---
const particleFragmentShader = `
  uniform float uTime;
  varying float vAlpha;
  varying float vRandom;

  void main() {
    // Circular particle shape
    float d = distance(gl_PointCoord, vec2(0.5));
    if(d > 0.5) discard;

    // Gold HDR Color
    vec3 goldColor = vec3(4.0, 2.5, 0.5); 

    // Blinking Logic (Twinkle)
    // We multiply by vRandom so they twinkle at different rates
    float blink = sin(uTime * 4.0 + vRandom * 20.0) * 0.5 + 0.5;
    blink = pow(blink, 2.0); // Sharpen the blink

    // Combine: Color * Blink Intensity * Lifecycle Fade
    vec3 finalColor = goldColor * blink;

    // Apply the alpha (fade in/out from vertex shader)
    gl_FragColor = vec4(finalColor, vAlpha);
  }
`;

const GoldenParticles = ({ count = 3000 }) => {
  const meshRef = useRef();

  // Generate Data
  const [positions, randoms, speedOffsets] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const speedOffsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Initial Spawn Box (X, Y, Z)
      // X: Spread wide (-100 to 100)
      positions[i * 3] = (Math.random() - 0.5) * 200;
      // Y: We actually ignore the initial Y position because the shader overrides it
      // with the lifecycle loop, but we set it to 0 for safety.
      positions[i * 3 + 1] = 0;
      // Z: Depth (-100 to 50)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150;

      randoms[i] = Math.random();
      // Random speed multiplier (0.5 to 1.5) so they don't move as a sheet
      speedOffsets[i] = 0.5 + Math.random();
    }
    return [positions, randoms, speedOffsets];
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? window.devicePixelRatio : 1,
      },
      uSize: { value: 50.0 }, // Particle Size
      uSpeed: { value: 0.01 }, // Global Speed
      uRange: { value: new THREE.Vector3(300, 200, 300) }, // Box Size (W, H, D)
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points position={[0, 0, -50]} ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeedOffset"
          count={speedOffsets.length}
          array={speedOffsets}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        transparent={true}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default GoldenParticles;
