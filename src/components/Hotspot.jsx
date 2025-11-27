"use client";

import { useRef, useState } from "react";
import { Html, useCursor } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ProjectHotspot({
  position,
  args,
  url,
  name,
  htmlPos,
  img,
  contact,
  resume,
}) {
  const [hovered, setHovered] = useState(false);
  const popRef = useRef();

  useCursor(hovered);

  const handleClick = () => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  useGSAP(() => {
    if (hovered) {
      gsap.to(popRef.current, {
        duration: 0.6,
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "back.in",
        overwrite: "auto",
      });
    } else {
      gsap.to(popRef.current, {
        duration: 1,
        opacity: 0,
        scale: 0.5,
        y: 10,
        ease: "back.out",
        overwrite: "auto",
      });
    }
  }, [hovered]);

  return (
    <group position={position}>
      <mesh
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        visible={true}
      >
        <boxGeometry args={args} />
        <meshBasicMaterial color="red" wireframe />{" "}
      </mesh>

      {/* 3. THE "CLICK TO VISIT" DIALOGUE */}

      <Html position={htmlPos}>
        <div
          ref={popRef}
          className="rounded-xl cursor-pointer opacity-0 flex flex-col p-3 w-80 flex-wrap h-fit gap-3 bg-white-200/20 backdrop-blur-xl border border-dashed border-gray-500"
        >
          <div className="bg-clip-text flex flex-col text-transparent bg-gradient-to-r from-[#FFC11F] via-[#FE650D] to-[#DA1F05]">
            <div className="flex gap-3 items-center">
              {img ? <img src={img} height={30} width={30} alt="logo" /> : null}
              <span>{name}</span>
            </div>

            {contact || resume ? null : (
              <>
                <span className="text-sm text-[15px]">
                  Please read the tabloit for more info.
                </span>
              </>
            )}
          </div>

          <span className="text-[10px] hover:underline animate-pulse ">
            {resume
              ? "Click to access my resume."
              : contact
              ? "Click to connect."
              : "Click Here to visit live demo"}
          </span>
        </div>
      </Html>
    </group>
  );
}
