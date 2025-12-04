"use client";

import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SceneNavigation({ active, zoom }) {
  const { camera } = useThree();
  const [index, setIndex] = useState(0);
  const isAnimating = useRef(false);

  const stops = [
    { pos: new THREE.Vector3(50, 1, 3.5), look: new THREE.Vector3(50, 0.2, 0) }, // Landing
    {
      pos: new THREE.Vector3(-50, 1, 3.5),
      look: new THREE.Vector3(-50, 0.2, 0),
    },
    {
      pos: new THREE.Vector3(-50, 1, -96.5),
      look: new THREE.Vector3(-50, 0.2, -100),
    },
    {
      pos: new THREE.Vector3(50, 1, -96.5),
      look: new THREE.Vector3(50, 0.2, -100),
    },
    {
      pos: new THREE.Vector3(0, 1, -46.5),
      look: new THREE.Vector3(0, 0.2, -50),
    },
  ];

  useEffect(() => {
    if (!active) return;

    const handleScroll = (e) => {
      if (zoom > 1) {
        const panSpeed = 0.005;

        camera.position.y += e.deltaY * panSpeed;

        camera.position.y = THREE.MathUtils.clamp(camera.position.y, -1, 2);

        return;
      }

      if (isAnimating.current) return;

      const direction = e.deltaY > 0 ? 1 : -1;

      const nextIndex = index + direction;

      if (nextIndex >= 0 && nextIndex < stops.length) {
        isAnimating.current = true;
        setIndex(nextIndex);
      } else {
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [active, index, stops.length, zoom, camera]);

  useEffect(() => {
    if (!active) return;
    const target = stops[index];

    gsap.to(camera.position, {
      x: target.pos.x,
      y: target.pos.y,
      z: target.pos.z,
      duration: 2,
      ease: "power2.inOut",
    });

    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook).add(camera.position);
    const lookObj = { x: currentLook.x, y: currentLook.y, z: currentLook.z };

    gsap.to(lookObj, {
      x: target.look.x,
      y: target.look.y,
      z: target.look.z,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(lookObj.x, lookObj.y, lookObj.z);
      },
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  }, [active, index, camera]);
  return null;
}
