"use client";

import useIsMobile from "./MobileGaurd";

export default function MobileGuard({ children }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <div className="mb-6 rounded-full bg-orange-500/10 p-6 ring-1 ring-orange-500/50">
          {/* Desktop Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-12 w-12 text-orange-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">
          Desktop Experience Required
        </h1>
        <p className="max-w-md text-zinc-400">
          This portfolio features high-fidelity 3D graphics and complex
          interactions designed for larger screens.
          <br />
          <br />
          Please visit on a <strong>Laptop</strong> or <strong>Desktop</strong>{" "}
          for the intended experience.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
