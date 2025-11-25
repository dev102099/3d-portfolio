"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ZoomHandler({ targetZoom }) {
  useFrame((state) => {
    state.camera.zoom = THREE.MathUtils.lerp(
      state.camera.zoom,
      targetZoom,
      0.1
    );

    state.camera.updateProjectionMatrix();
  });

  return null;
}
