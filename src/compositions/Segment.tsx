import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SegmentData } from "../types";

export const Segment: React.FC<SegmentData> = ({
  videoUrl,
  tcIn,
  tcOut,
  overlayText,
  textPosition,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationFrames = (tcOut - tcIn) * fps;

  // Fade in du texte
  const textOpacity = interpolate(frame, [fps * 0.3, fps * 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out du texte avant la fin
  const textFadeOut = interpolate(
    frame,
    [durationFrames - fps * 1, durationFrames - fps * 0.3],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const finalTextOpacity = Math.min(textOpacity, textFadeOut);

  const posX = textPosition?.x || "5%";
  const posY = textPosition?.y || "85%";
  const align = textPosition?.align || "left";

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={videoUrl}
        startFrom={Math.round(tcIn * fps)}
        style={{ width: "100%", height: "100%" }}
      />

      {overlayText && (
        <div
          style={{
            position: "absolute",
            left: posX,
            top: posY,
            textAlign: align,
            opacity: finalTextOpacity,
          }}
        >
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 48,
              fontWeight: 600,
              color: "white",
              textShadow:
                "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)",
              margin: 0,
              padding: "8px 16px",
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: 8,
              backdropFilter: "blur(4px)",
            }}
          >
            {overlayText}
          </p>
        </div>
      )}
    </AbsoluteFill>
  );
};
