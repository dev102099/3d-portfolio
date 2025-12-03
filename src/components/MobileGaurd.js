import { useState, useEffect } from "react";

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Define the check function (768px is standard tablet/mobile cutoff)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // I suggest 1024px for complex 3D apps
    };

    // 2. Run initially
    checkMobile();

    // 3. Listen for resize events (in case they rotate phone or resize window)
    window.addEventListener("resize", checkMobile);

    // 4. Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
