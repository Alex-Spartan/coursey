/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { cn } from "@/lib/utils";
import ReactPlayer from "react-player";
import { ReactPlayerProps } from "react-player/types";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="relative aspect-video">
      {!isLocked ? (
        !isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <Loader2 className="animate-spin text-secondary" />
          </div>
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <ReactPlayer
          src={videoUrl}
          style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
          controls
        />
      )}
    </div>
  );
};

export default VideoPlayer;
