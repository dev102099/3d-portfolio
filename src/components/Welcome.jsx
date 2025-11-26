import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import React, { useRef } from "react";
import * as THREE from "three";

function Welcome({ scroll, setScroll }) {
  const p0 = new THREE.Vector3(0, 100, 500);
  const l0 = new THREE.Vector3(0, -400, 0);
  const goRef = useRef();

  const mouseIn = () => {
    gsap.to(goRef.current, {
      duration: 1,
      ease: "power1.in",
      backgroundImage: "linear-gradient(to right, #4b6cb7 , #182848 )",
      webkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    });
  };
  const mouseOut = () => {
    gsap.to(goRef.current, {
      duration: 1,
      ease: "power1.out",

      color: "white",
    });
  };

  useFrame((state) => {
    if (!scroll) {
      state.camera.position.lerp(p0, 0.05);
      const currentLook = new THREE.Vector3();
      state.camera.getWorldDirection(currentLook).add(state.camera.position);
      currentLook.lerp(l0, 0.05);
      state.camera.lookAt(currentLook);
    }
  });

  return (
    <group position={[0, 80, 480]} rotation={[-Math.PI / 4, 0, 0]}>
      <Html transform>
        <div className="p-10 flex flex-col gap-6   min-w-200 rounded-3xl border border-dashed border-y-amber-300 bg-white/20 backdrop-blur-3xl">
          <div className="bg-gradient-to-b self-center from-[#4b6cb7] to-[#182848] bg-clip-text text-transparent">
            <span className="font-semibold  text-5xl">
              Welcome to my Porfolio!
            </span>
          </div>

          <span className="text-xl font-semibold">
            This is a 3D interactive portfolio not your typical porfolios.
            Thought of presenting something new and unique so tried 3d web
            Rendering Via react three fiber and other libraries to make this.
            Please explore the portfolio and if you like the work do reach out.
          </span>
          <div
            onMouseOver={mouseIn}
            onMouseOut={mouseOut}
            className="bg-white self-center mt-5 bg-clip-text text-transparent"
          >
            <span
              ref={goRef}
              onClick={() => {
                setScroll(true);
              }}
              className="font-bold text-4xl border  border-gray-400 p-3 rounded-2xl  cursor-pointer"
            >
              Lets Go!
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default Welcome;
