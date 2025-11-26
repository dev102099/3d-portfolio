"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function LoaderOverlay() {
  const { active, progress } = useProgress();
  const [Null, setNull] = useState(false);

  if (!active) {
    setTimeout(() => {
      setNull(true);
    }, 2000);
  }
  if (Null) {
    return null;
  }

  return <Loading progress={progress} />;
}
