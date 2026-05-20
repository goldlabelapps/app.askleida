'use client';
import React from 'react';
import {
  Box,
  Button,
} from "@mui/material";
import { Icon } from '../../DesignSystem';

export type VideoProps = {
  src: string;
};

export default function Video({ src }: VideoProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
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

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) {
      video.requestFullscreen?.();
      if (video.paused || video.ended) {
        video.play();
        setPlaying(true);
      }
    } else {
      document.exitFullscreen?.();
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 22;
      // video.play();
      // setPlaying(true);
    }
  }, []);

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
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box sx={{ position: 'relative', width: '100%', display: 'inline-block' }}>
        <video
          ref={videoRef}
          controls={false}
          width={'100%'}
          src={src}
          style={{ display: 'block', width: '100%' }}
        />
        <Button
          variant="contained"
          onClick={toggleFullscreen}
          sx={{
            position: 'absolute',
            right: 16,
            bottom: 88, // 16px above play button (56 + 16)
            minWidth: 56,
            minHeight: 56,
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: '#fff',
            zIndex: 3,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            border: '2px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(2px)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' },
          }}
        >
          <Icon icon={isFullscreen ? 'fullscreen' : 'fullscreen'} />
        </Button>
        <Button
          variant="contained"
          onClick={togglePlaying}
          sx={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            minWidth: 56,
            minHeight: 56,
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: '#fff',
            zIndex: 3,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            border: '2px solid rgba(255,255,255,0.25)',
            backdropFilter: 'blur(2px)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' },
          }}
        >
          <Icon icon={playing ? "pause" : "play"} />
        </Button>
      </Box>
      <Box mt={6} display="flex" gap={2} justifyContent="center">
        <Button
          startIcon={<Icon icon="left" />}
          onClick={() => jumpTo(0)}
          sx={{ minWidth: 140 }}
        >
          Restart
        </Button>
        <Button
          startIcon={<Icon icon="up" />}
          onClick={() => jumpTo(22)}
          sx={{ minWidth: 140 }}
        >
          Be Sensible
        </Button>
        <Button
          endIcon={<Icon icon="right" />} 
          onClick={() => jumpTo(66)}
          sx={{ minWidth: 140 }}
        >
          Call To Action
        </Button>
      </Box>
    </Box>
  );
}
