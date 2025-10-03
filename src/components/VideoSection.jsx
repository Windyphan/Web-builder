import React from 'react';

const VideoSection = () => {
    return (
        <section className="relative h-screen overflow-hidden bg-black">
            <iframe
                src="https://player.vimeo.com/video/1124235622?background=1&autoplay=1&loop=1&muted=1"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100vw',
                    height: '56.25vw', // 16:9 aspect ratio
                    minWidth: '100%',
                    minHeight: '100%',
                    transform: 'translate(-50%, -50%)',
                }}
                title="background video"
            ></iframe>
        </section>
    );
};

export default VideoSection;
