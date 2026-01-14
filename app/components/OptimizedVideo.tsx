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
    const [hasStartedLoading, setHasStartedLoading] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
                if (entry.isIntersecting) {
                    setHasStartedLoading(true);
                }
            },
            {
                rootMargin: "100px", // Preload when 100px near (reduced for performance)
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

    const getOptimizedCloudinaryUrl = (url: string) => {
        if (url.includes("cloudinary.com") && url.includes("/upload/")) {
            // Force mp4 and h264 for lowest CPU usage
            if (url.includes("/upload/f_mp4,vc_h264")) {
                return url;
            }
            // Replace any existing transformations or just the /upload/ part
            const regex = /\/upload\/(?:[^\/]+\/)?/;
            return url.replace(regex, "/upload/f_mp4,vc_h264,q_auto,w_1080/");
        }
        return url;
    };

    const getCloudinaryPoster = (url: string) => {
        if (url.includes("cloudinary.com") && url.includes("/upload/")) {
            const regex = /\/upload\/(?:[^\/]+\/)?/;
            // Generate a poster from the first frame (so_0)
            return url.replace(regex, "/upload/so_0,f_auto,q_auto,pg_1,w_1080/").replace(/\.[^/.]+$/, ".jpg");
        }
        return poster;
    };

    return (
        <video
            ref={videoRef}
            className={className}
            poster={getCloudinaryPoster(src)}
            muted={muted}
            loop={loop}
            playsInline={playsInline}
            preload={hasStartedLoading ? "metadata" : "none"}
            style={{ pointerEvents: "none" }}
        >
            {hasStartedLoading && <source src={getOptimizedCloudinaryUrl(src)} type="video/mp4" />}
        </video>
    );
};

export default React.memo(OptimizedVideo);
