"use client";

import React, { useRef, useState, useEffect } from "react";

interface OptimizedVideoProps {
    src: string;
    className?: string;
    poster?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    playsInline?: boolean;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
    src,
    className,
    poster,
    autoPlay = true,
    loop = true,
    muted = true,
    playsInline = true,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            {
                rootMargin: "200px", // Preload when 200px near
                threshold: 0.01,
            }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;

        if (isInView) {
            videoRef.current.play().catch((err) => {
                // Handle autoplay policy issues
                console.warn("Video play failed:", err);
            });
        } else {
            videoRef.current.pause();
        }
    }, [isInView]);

    return (
        <video
            ref={videoRef}
            className={className}
            poster={poster}
            muted={muted}
            loop={loop}
            playsInline={playsInline}
            preload="metadata"
            style={{ pointerEvents: "none" }}
        >
            {isInView && <source src={src} type="video/mp4" />}
        </video>
    );
};

export default React.memo(OptimizedVideo);
