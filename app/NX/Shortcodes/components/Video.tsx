'use client';
import React from 'react';
// import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
} from "@mui/material";
import { Icon } from '../../DesignSystem';

type VideoPlayerProps = {
  src: string;
};

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);

  const jumpTo = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = seconds;
    video.play();
    setPlaying(true);
  };

  const togglePlaying = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  // On mount, jump to 20s and play
  React.useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 22;
      // video.play();
      // setPlaying(true);
    }
  }, []);

  // Keep state in sync if user uses native controls
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        controls={false}
        width={'100%'}
        src={src}
      />
      <Box mt={2} display="flex" gap={2}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Icon icon={playing ? "pause" : "play"} />}
          onClick={togglePlaying}
        >
          {playing ? "Pause" : "Play"}
        </Button>
      </Box>
      

      <Box mt={2} display="flex" gap={2}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Icon icon="left" />}
          onClick={() => jumpTo(0)}
        >
          Back to start
        </Button>
        <Button
        fullWidth
          variant="outlined"
          endIcon={<Icon icon="right" />}
          onClick={() => jumpTo(66)}
        >
          Skip to Punchline
        </Button>
      </Box>
    </div>
  );
}

/*
punchline: 1:04

*/