'use client';
import React from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Typography,
import { useEffect, useRef } from "react";

type VideoPlayerProps = {
  src: string;
};

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const jumpTo = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
  };

  // React.useEffect(() => {
  //   jumpTo(12.5);
  // }, []);

  return (
    <div>
      <video
        ref={videoRef}
        controls
        width={800}
        src={src}
      />
      <button onClick={() => jumpTo(30)}>Go to 00:30</button>
    </div>
  );
}
