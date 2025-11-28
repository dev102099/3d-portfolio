"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SceneNavigation({ active }) {
  const { camera } = useThree();
  const [index, setIndex] = useState(0); // 0: Landing, 1: Skills, 2: Projects, 3: Work
  const isAnimating = useRef(false); // Locks input while moving

  // --- DEFINE YOUR STOPS ---
  // Store them in an array for easy indexing
  const stops = [
    // Index 0: Landing
    {
      pos: new THREE.Vector3(50, 1, 4),
      look: new THREE.Vector3(50, 0, 0),
    },
    // Index 1: Work (Assuming this is next based on your previous code)
    {
      pos: new THREE.Vector3(-50, 1, 4),
      look: new THREE.Vector3(-50, 0, 0),
    },
    // Index 2: Projects
    {
      pos: new THREE.Vector3(-50, 1, -96),
      look: new THREE.Vector3(-50, 0, -100),
    },
    // Index 3: Skills
    {
      pos: new THREE.Vector3(50, 1, -96),
      look: new THREE.Vector3(50, 0, -100),
    },
    {
      pos: new THREE.Vector3(0, 1, -46),
      look: new THREE.Vector3(0, 0, -50),
    },
  ];

  useEffect(() => {
    if (!active) return;

    const handleScroll = (e) => {
      // 1. If currently moving, ignore input (The "Lock")
      console.log(e.target.value);
      if (isAnimating.current) return;

      // 2. Determine Direction
      // e.deltaY > 0 means scrolling DOWN
      // e.deltaY < 0 means scrolling UP
      const direction = e.deltaY > 0 ? 1 : -1;

      // 3. Update Index safely
      setIndex((prev) => {
        const next = prev + direction;
        // Clamp between 0 and last index
        if (next < 0) return 0;
        if (next >= stops.length) return stops.length - 1;
        return next;
      });
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [active, stops.length]);

  // --- ANIMATION LOGIC ---
  useEffect(() => {
    // Determine target based on new index
    const target = stops[index];

    isAnimating.current = true; // Lock inputs

    // Animate Position
    gsap.to(camera.position, {
      x: target.pos.x,
      y: target.pos.y,
      z: target.pos.z,
      duration: 2, // How long the flight takes (Seconds)
      ease: "power2.inOut", // Smooth start and stop
    });

    // Animate Rotation (via OrbitControls target or manual lookAt)
    // Since we aren't using OrbitControls, we animate a dummy object
    // and make the camera look at it every frame
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook).add(camera.position);

    // We create a temporary object to animate the "LookAt" point
    const lookObj = { x: currentLook.x, y: currentLook.y, z: currentLook.z };

    gsap.to(lookObj, {
      x: target.look.x,
      y: target.look.y,
      z: target.look.z,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        // Every frame of animation, update camera rotation
        camera.lookAt(lookObj.x, lookObj.y, lookObj.z);
      },
      onComplete: () => {
        // Unlock inputs when finished
        isAnimating.current = false;
      },
    });
  }, [index, camera]);

  return null;
}
