"use client";

import React, { useState, useEffect } from "react";
import { CldVideoPlayer } from "next-cloudinary";

interface OptimizedVideoProps {
    src: string;
    className?: string;
    poster?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    playsInline?: boolean;
    width?: number;
    height?: number;
    id?: string;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
    src,
    className,
    poster,
    autoPlay = true,
    loop = true,
    muted = true,
    playsInline = true,
    width = 1080,
    height = 607,
    id,
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getPublicId = (url: string) => {
        if (!url.includes("cloudinary.com")) return url;
        const parts = url.split("/upload/");
        if (parts.length < 2) return url;
        // Extract public ID by removing version (vXXXX/) and extension
        return parts[1].replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
    };

    const publicId = getPublicId(src);

    if (!mounted) return <div className={className} style={{ width, height, backgroundColor: '#000' }} />;

    // Extract the cloud name from the URL if it's there, otherwise it will use the env default
    const cloudName = src.includes("cloudinary.com") ? src.split("res.cloudinary.com/")[1]?.split("/")[0] : undefined;

    return (
        <CldVideoPlayer
            id={id || `video-${publicId}`}
            width={width}
            height={height}
            src={publicId}
            sourceTypes={['mp4']}
            autoplay={autoPlay}
            loop={loop}
            muted={muted}
            playsinline={playsInline}
            controls={!autoPlay}
            className={className}
            config={{
                cloud: {
                    cloudName: cloudName || "dxoxdiuwr"
                }
            }}
            transformation={{
                width: width,
                height: height,
                crop: 'fill',
                gravity: 'center'
            }}
        />
    );
};

export default React.memo(OptimizedVideo);
