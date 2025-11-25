"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { Water } from "three/addons/objects/Water.js";

export default function OceanSurface() {
  const water = useMemo(() => {
    const waterGeometry = new THREE.PlaneGeometry(15000, 15000);

    const waterNormals = new THREE.TextureLoader().load(
      "/textures/water/wnormal.jpg",
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    );

    const w = new Water(waterGeometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,

      sunDirection: new THREE.Vector3(0, 100, 100),

      alpha: 0.1,

      sunColor: new THREE.Color(0x000000),

      waterColor: new THREE.Color("#010208"),

      distortionScale: 3.7,

      fog: true,
    });

    w.rotation.x = -Math.PI / 2;
    return w;
  }, []);

  useFrame((_, delta) => {
    if (!water) return;
    water.material.uniforms["time"].value += delta;

    water.material.uniforms["sunColor"].value.set("#000000"); // No specular shine
    water.material.uniforms["waterColor"].value.set("#000005");
  });

  return <primitive object={water} position={[0, -2, 0]} />;
}
