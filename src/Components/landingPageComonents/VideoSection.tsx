import React, { useRef } from "react";
import data from "../../../src/data/destinationsData.json";
import "../../Styles/videoSection.css";
import "../../Styles/responsiveLandingPage.css";

const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const video = (data as any).videoSection;

  const playVideo = () => {
    videoRef.current?.play();
  };

  const pauseVideo = () => {
    videoRef.current?.pause();
  };

  return (
    <div className="video-container">
      <div className="video-wrapper">
        <video
          id="custom-video"
          ref={videoRef}
          autoPlay
          muted
          loop
          src={video.videoSource}
        >
          Your browser does not support the video tag.
        </video>

        {video.overlay && <div className="video-overlay"></div>}

        <div className="video-controls">
          <button className="control-btn play-btn" onClick={playVideo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d={video.controls.playIcon} />
            </svg>
          </button>
          <button className="control-btn pause-btn" onClick={pauseVideo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d={video.controls.pauseIconLeft} />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
