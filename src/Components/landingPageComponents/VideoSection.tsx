import React, { useRef, useState } from 'react';

const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="video-section py-5 py-lg-6">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <div className="section-badge mb-3">Experience</div>
            <h2 className="display-5 fw-bold mb-3">
              Watch Our <span className="text-gradient">Travel Stories</span>
            </h2>
            <p className="text-muted fs-6">
              Discover breathtaking destinations and real experiences from our travelers
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="video-container-modern">
              <video 
                ref={videoRef}
                autoPlay 
                muted 
                loop
                className="w-100 rounded-4"
              >
                <source src="/src/assets/video/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Overlay */}
              <div className="video-overlay-modern"></div>

              {/* Play/Pause Button */}
              <button 
                className="video-control-btn" 
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <i className="ri-pause-line"></i>
                ) : (
                  <i className="ri-play-fill"></i>
                )}
              </button>

              {/* Video Info Card */}
              <div className="video-info-card">
                <div className="d-flex align-items-center">
                  <div className="pulse-dot me-3"></div>
                  <div>
                    <h6 className="mb-0 text-white fw-bold">Live Tours Available</h6>
                    <p className="mb-0 text-white-50 small">Join virtual experiences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;