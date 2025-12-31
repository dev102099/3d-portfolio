"use client";

import MobileGuard from "@/components/AlertMobile";
import React from "react";
import dynamic from "next/dynamic";

const RealNightOcean = dynamic(() => import("../components/Main"), {
  ssr: false,
});

function page() {
  return (
    <>
      <div className="h-screen w-screen">
        <MobileGuard>
          <RealNightOcean />
        </MobileGuard>
      </div>
    </>
  );
}

export default page;
