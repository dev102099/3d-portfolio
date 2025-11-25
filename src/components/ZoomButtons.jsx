import React from "react";

function ZoomButtons({ setZoom, zoom }) {
  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };
  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  return (
    <div className="absolute z-[1000] flex flex-col gap-4">
      <button
        onClick={zoomIn}
        className="p-3 rounded-full bg-white/40 backdrop-blur-3xl "
      >
        <img src="/zoomIn.png" alt="zoomIn" height={30} width={30} />
      </button>
      <button
        onClick={zoomOut}
        className="p-3 rounded-full bg-white/40 backdrop-blur-3xl flex items-center justify-center"
      >
        <img src="/zoomOut.png" alt="zoomOut" height={30} width={30} />
      </button>
    </div>
  );
}

export default ZoomButtons;
