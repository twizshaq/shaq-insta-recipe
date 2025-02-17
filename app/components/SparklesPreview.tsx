"use client";
import React, { lazy, Suspense } from "react";

const SparklesCore = lazy(() => import("./ui/sparkles").then((module) => ({ default: module.SparklesCore })));

export function SparklesPreview() {
  return (
    <div className="bottom-[0px] h-fit w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-[40rem] h-70 relative">

        {/* Core component */}
        <Suspense fallback={<div>Loading...</div>}>
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={300}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </Suspense>

        {/* Radial Gradient to prevent sharp edges */}
        {/* <div className="absolute inset-0 w-full h-full bg-[--background] [mask-image:radial-gradient(450px_350px_at_center,transparent_20%,white)]"></div> */}
      </div>
    </div>
  );
}