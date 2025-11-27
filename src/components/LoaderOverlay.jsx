"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function LoaderOverlay({ isReady }) {
  const { active, progress } = useProgress();
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (!active && progress === 100 && isReady) {
      const timer = setTimeout(() => {
        setFinished(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [active, progress, isReady]);

  return (
    <div
      className={`absolute inset-0 z-[9999] transition-opacity duration-1000 ease-in-out ${
        finished
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto"
      }`}
    >
      <Loading progress={progress} />
    </div>
  );
}
