"use client";

import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material";
import { useRef, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { EXRLoader } from "three-stdlib"; // <--- The special loader

const parallaxVertexShader = `
  // 1. Declare our OWN varying variable
  varying vec2 vCustomUv;

  void main() {
    // 2. Pass the standard 'uv' attribute into our custom variable
    vCustomUv = uv;
  }
`;

// --- FRAGMENT SHADER ---
const parallaxFragmentShader = `
  // 1. Catch the custom variable from Vertex shader
  varying vec2 vCustomUv;

  uniform sampler2D uHeightMap;
  uniform sampler2D uMap;       
  uniform sampler2D uNormalMap; 
  uniform float uHeightScale;

  // --- PARALLAX FUNCTION ---
  vec2 parallaxMap(vec3 viewDir, float scale) {
      float numLayers = 15.0; 
      float layerHeight = 1.0 / numLayers;
      float currentLayerHeight = 0.0;
      vec2 dtex = viewDir.xy / viewDir.z * (scale / numLayers);
      
      // USE CUSTOM UV
      vec2 currentTextureCoords = vCustomUv;
      
      float heightFromTexture = texture2D(uHeightMap, currentTextureCoords).r;

      for (int i = 0; i < 30; i += 1) {
          if (heightFromTexture <= currentLayerHeight) {
             break;
          }
          currentLayerHeight += layerHeight;
          currentTextureCoords -= dtex;
          heightFromTexture = texture2D(uHeightMap, currentTextureCoords).r;
      }
      return currentTextureCoords;
  }

  // --- MANUAL NORMAL MAPPING FUNCTION ---
  vec3 localPerturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {
    vec3 q0 = dFdx( eye_pos.xyz );
    vec3 q1 = dFdy( eye_pos.xyz );
    
    // USE CUSTOM UV
    vec2 st0 = dFdx( vCustomUv.st );
    vec2 st1 = dFdy( vCustomUv.st );
    
    vec3 N = surf_norm; 
    vec3 q1perp = cross( q1, N );
    vec3 q0perp = cross( N, q0 );
    vec3 T = q1perp * st0.x + q0perp * st1.x;
    vec3 B = q1perp * st0.y + q0perp * st1.y;
    float det = max( dot( T, T ), dot( B, B ) );
    float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );
    return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );
  }

  void main() {
      vec3 viewDir = normalize(vViewPosition);
      vec2 parallaxUV = parallaxMap(viewDir, uHeightScale);

      if (parallaxUV.x > 1.0 || parallaxUV.y > 1.0 || parallaxUV.x < 0.0 || parallaxUV.y < 0.0) {
          discard;
      }

      // Apply Color
      csm_DiffuseColor = texture2D(uMap, parallaxUV);

      // Apply Normal Map
      vec3 nMap = texture2D(uNormalMap, parallaxUV).xyz * 2.0 - 1.0;
      
      // Rename variable to avoid collision
      float myFaceDir = gl_FrontFacing ? 1.0 : -1.0;
      
      // Call manual function
      csm_FragNormal = localPerturbNormal2Arb(-vViewPosition, normalize(vNormal), nMap, myFaceDir);
  }
`;

export default function StoneParallax() {
  const materialRef = useRef();

  const { nodes } = useGLTF("/textures/model/landing/landing.glb");
  console.log(nodes);
  const [normalMap, colorMap, heightMap] = useLoader(EXRLoader, [
    "/textures/model/landing/final_normal_landing.exr",
    "/textures/model/landing/final_color_landing.exr",
    "/textures/model/landing/height_l.exr",
  ]);

  useMemo(() => {
    const textures = [normalMap, colorMap, heightMap];

    textures.forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

      tex.flipY = true;

      tex.needsUpdate = true;
    });

    colorMap.colorSpace = THREE.SRGBColorSpace;
  }, [normalMap, colorMap, heightMap]);
  return (
    <group
      position={[5, 0, 0]}
      rotation={[Math.PI / 2, -1.57, 0]}
      dispose={null}
    >
      <mesh geometry={nodes.low_landing?.geometry}>
        <CustomShaderMaterial
          ref={materialRef}
          baseMaterial={THREE.MeshStandardMaterial}
          vertexShader={parallaxVertexShader}
          fragmentShader={parallaxFragmentShader}
          map={colorMap}
          normalMap={normalMap}
          uniforms={{
            uHeightMap: { value: heightMap },
            uHeightScale: { value: 0.03 },
            uMap: { value: colorMap },
            uNormalMap: { value: normalMap },
          }}
          normalScale={[1, 1]}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}
