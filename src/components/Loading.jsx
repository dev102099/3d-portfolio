import gsap from "gsap";
import React, { useEffect, useRef } from "react";

function Loading({ progress }) {
  const boxRef = useRef();
  useEffect(() => {
    gsap.to(boxRef.current, {
      duration: 3,
      rotate: 360,
      ease: "power1.out",
      repeat: -1,
    });
  }, []);

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center gap-4 border border-dashed border-gray-50">
      <div
        ref={boxRef}
        className="h-10 w-10 rounded-lg bg-gradient-to-b from-[#F0F2F0] to-[#000C40]  "
      ></div>
      <span className="font-semibold text-2xl">
        Loading {Number.parseInt(progress)}%
      </span>
    </div>
  );
}

export default Loading;
