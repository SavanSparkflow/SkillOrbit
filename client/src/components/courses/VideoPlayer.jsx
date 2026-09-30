import React, { useRef, useState, useEffect, useCallback } from 'react';
import getMediaUrl from '../../utils/mediaUrl';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  FastForward,
  Settings,
  AlertCircle,
  SkipForward,
  X,
} from 'lucide-react';

const VideoPlayer = ({
  src,
  poster,
  title,
  nextLesson = null,
  onPlayNext,
  onEnded,
  onProgressUpdate,
  autoPlay = false,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Retrieve saved speed
  const initialSpeed = Number(localStorage.getItem('skillorbit_playback_speed')) || 1;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(initialSpeed);
  const [showControls, setShowControls] = useState(true);
  const [autoPlayCountdown, setAutoPlayCountdown] = useState(null); // null or seconds remaining (5..0)
  const [shortcutsHint, setShortcutsHint] = useState(false);
  let controlsTimeout = null;

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setAutoPlayCountdown(null);
  }, [src]);

  // Handle Autoplay countdown timer
  useEffect(() => {
    let timer = null;
    if (autoPlayCountdown !== null && autoPlayCountdown > 0) {
      timer = setTimeout(() => {
        setAutoPlayCountdown((prev) => prev - 1);
      }, 1000);
    } else if (autoPlayCountdown === 0) {
      if (onPlayNext) onPlayNext();
      setAutoPlayCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [autoPlayCountdown, onPlayNext]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setAutoPlayCountdown(null);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  const seekRelative = useCallback((deltaSec) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + deltaSec)
    );
  }, []);

  const adjustVolume = useCallback((delta) => {
    if (!videoRef.current) return;
    const newVol = Math.max(0, Math.min(1, videoRef.current.volume + delta));
    videoRef.current.volume = newVol;
    setVolume(newVol);
    setIsMuted(newVol === 0);
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if typing in an input/textarea
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowleft':
        case 'j':
          e.preventDefault();
          seekRelative(-5);
          break;
        case 'arrowright':
        case 'l':
          e.preventDefault();
          seekRelative(5);
          break;
        case 'arrowup':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullScreen();
          break;
        case '?':
          setShortcutsHint((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekRelative, adjustVolume, toggleMute, toggleFullScreen]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (onProgressUpdate) {
      onProgressUpdate(videoRef.current.currentTime, videoRef.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    videoRef.current.playbackRate = playbackSpeed;
    if (autoPlay) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 1.75, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    localStorage.setItem('skillorbit_playback_speed', nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '00:00';
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (onEnded) onEnded();
    if (nextLesson && onPlayNext) {
      setAutoPlayCountdown(5);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group select-none border border-slate-800"
    >
      <video
        ref={videoRef}
        src={getMediaUrl(src)}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnded}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        controlsList="nodownload"
        playsInline
        crossOrigin="anonymous"
      />

      {/* Floating Center Play Button if Paused and Not in Autoplay Countdown */}
      {!isPlaying && autoPlayCountdown === null && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer z-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Auto-Play Next Lesson Countdown Overlay */}
      {autoPlayCountdown !== null && nextLesson && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin flex items-center justify-center relative">
            <span className="text-xl font-black text-white">{autoPlayCountdown}</span>
          </div>
          <div className="space-y-1 max-w-md">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Up Next</span>
            <h3 className="text-lg font-bold text-white truncate">{nextLesson.title}</h3>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                setAutoPlayCountdown(null);
                if (onPlayNext) onPlayNext();
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <SkipForward className="w-4 h-4" /> Play Next Now
            </button>
            <button
              onClick={() => setAutoPlayCountdown(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Overlay Modal */}
      {shortcutsHint && (
        <div className="absolute top-4 right-4 bg-slate-900/95 border border-slate-700 backdrop-blur-md p-4 rounded-xl text-white text-xs z-30 space-y-2 shadow-2xl max-w-xs animate-in fade-in">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="font-bold text-indigo-400">⌨️ Keyboard Shortcuts</span>
            <button onClick={() => setShortcutsHint(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">Space</kbd> / <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">K</kbd> : Play/Pause</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">←</kbd> / <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">→</kbd> : ±5s Seek</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">M</kbd> : Mute/Unmute</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">F</kbd> : Fullscreen</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">↑</kbd> / <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">↓</kbd> : Volume</span>
          </div>
        </div>
      )}

      {/* Video Controls Overlay */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-300 z-10 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Scrubber */}
        <div className="relative mb-3 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Play/Pause (Space)"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
            </button>

            <button
              onClick={() => seekRelative(-5)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white"
              title="Rewind 5s (←)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => seekRelative(5)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white"
              title="Forward 5s (→)"
            >
              <FastForward className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Mute/Unmute (M)"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-indigo-400"
              />
            </div>

            <span className="text-slate-300 font-mono text-[11px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Shortcuts help icon */}
            <button
              onClick={() => setShortcutsHint((prev) => !prev)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white text-[11px] font-mono hidden sm:block"
              title="Shortcuts (?)"
            >
              ⌨️
            </button>

            {/* Playback speed with memory */}
            <button
              onClick={changeSpeed}
              className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-slate-700 transition-colors"
              title="Playback Speed"
            >
              {playbackSpeed}x
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullScreen}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Fullscreen (F)"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
