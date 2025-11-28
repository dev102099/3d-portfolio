import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import React, { useRef, useState } from "react";
import * as THREE from "three";

function Welcome({ scroll, setScroll, setInstructions }) {
  const p0 = new THREE.Vector3(0, 100, 500);
  const l0 = new THREE.Vector3(0, -400, 0);
  const p1 = new THREE.Vector3(50, 1, 0);
  const l1 = new THREE.Vector3(50, 1, 0);

  const goRef = useRef();
  const textRef = useRef();
  const [move, setMove] = useState(false);

  const mouseIn = () => {
    gsap.to(goRef.current, {
      duration: 0.5,
      width: "100%",
      ease: "power1.in",
    });
    gsap.to(textRef.current, {
      duration: 0.5,
      color: "white",
      ease: "power1.in",
    });
  };
  const mouseOut = () => {
    gsap.to(goRef.current, {
      duration: 0.5,
      width: "20%",
      ease: "power1.in",
    });
    gsap.to(textRef.current, {
      duration: 0.5,
      color: "#002B76",
      ease: "power1.in",
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
    if (move) {
      state.camera.position.lerp(p1, 0.05);
      const currentLook = new THREE.Vector3();
      state.camera.getWorldDirection(currentLook).add(state.camera.position);
      currentLook.lerp(l1, 0.05);
      state.camera.lookAt(currentLook);
    }
  });

  return (
    <group position={[0, 80, 480]} rotation={[-Math.PI / 4, 0, 0]}>
      <Html transform>
        <div className="flex flex-col gap-6  w-[150vh] h-130 rounded-4xl  bg-white ">
          <div className="h-[40%] rounded-t-2xl w-full flex items-center justify-center bg-[#002B76]">
            <span className="font-semibold font-mystic text-white text-5xl">
              Welcome to my Porfolio!
            </span>
          </div>

          <span className="text-2xl p-3 font-mystic  text-[#002B76] font-semibold">
            This is a 3D interactive portfolio not your typical portfolios.
            Thought of presenting something new and unique so tried 3d web
            Rendering Via react three fiber and other libraries to make this,
            and all the models too are made by me in blender. Please explore the
            portfolio and even the stone models are interactive so keep that in
            mind and if you like the work do reach out.
          </span>
          <div
            onMouseEnter={mouseIn}
            onMouseLeave={mouseOut}
            onClick={() => {
              setMove(true);
              setTimeout(() => {
                setInstructions(true);
              }, 500);
            }}
            className="  relative border cursor-pointer border-dashed border-gray-400 self-center mt-5 w-60 h-20"
          >
            <div
              ref={goRef}
              className="w-[20%] h-full rounded-r-full bg-[#002B76]"
            ></div>
            <span
              ref={textRef}
              className="font-bold text-4xl  text-[#002B76] absolute  bottom-4.5 left-14  cursor-pointer"
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
