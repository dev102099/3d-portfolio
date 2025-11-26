"use client";

import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

const p0 = new THREE.Vector3(50, 1, 4);
const l0 = new THREE.Vector3(50, 0, 0);

const p1 = new THREE.Vector3(-50, 1, 4);
const l1 = new THREE.Vector3(-50, 0, 0);

const p2 = new THREE.Vector3(-50, 1, -96);
const l2 = new THREE.Vector3(-50, 0, -100);

const p3 = new THREE.Vector3(50, 1, -96);
const l3 = new THREE.Vector3(50, 0, -100);

const p4 = new THREE.Vector3(0, 1, -46);
const l4 = new THREE.Vector3(0, 0, -50);

export default function SceneNavigation({ active }) {
  const scroll = useScroll();

  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const offset = scroll.offset;

    if (offset < 0.25) {
      const t = offset / 0.25;
      targetPos.current.lerpVectors(p0, p1, t);
      targetLook.current.lerpVectors(l0, l1, t);
    } else if (offset < 0.5) {
      const t = (offset - 0.25) / 0.25;
      targetPos.current.lerpVectors(p1, p2, t);
      targetLook.current.lerpVectors(l1, l2, t);
    } else if (offset < 0.75) {
      const t = (offset - 0.5) / 0.25;
      targetPos.current.lerpVectors(p2, p3, t);
      targetLook.current.lerpVectors(l2, l3, t);
    } else {
      const t = (offset - 0.75) / 0.25;
      targetPos.current.lerpVectors(p3, p4, t);
      targetLook.current.lerpVectors(l3, l4, t);
    }

    state.camera.position.lerp(targetPos.current, 0.05);

    const currentLook = new THREE.Vector3();
    state.camera.getWorldDirection(currentLook).add(state.camera.position);
    currentLook.lerp(targetLook.current, 0.05);
    state.camera.lookAt(currentLook);
  });

  return null;
}
