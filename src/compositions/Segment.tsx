import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily: montserrat } = loadFont("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

export type SegmentProps = {
  videoUrl: string;
  tcIn: number;
  tcOut: number;
  overlayText?: string;
  textPosition?: {
    x: string;
    y: string;
    align?: "left" | "center" | "right";
  };
};

export const Segment: React.FC<SegmentProps> = ({
  videoUrl,
  tcIn,
  overlayText,
  textPosition,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade in du texte
  const textOpacity = interpolate(frame, [0.3 * fps, 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out du texte avant la fin
  const textFadeOut = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames - 0.3 * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const finalTextOpacity = Math.min(textOpacity, textFadeOut);

  const textY = interpolate(frame, [0.3 * fps, 1 * fps], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const posX = textPosition?.x || "5%";
  const posY = textPosition?.y || "80%";
  const align = textPosition?.align || "left";

  return (
    <AbsoluteFill>
      <Video
        src={videoUrl}
        trimBefore={Math.round(tcIn * fps)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {overlayText && (
        <div
          style={{
            position: "absolute",
            left: posX,
            top: posY,
            textAlign: align,
            opacity: finalTextOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <p
            style={{
              fontFamily: montserrat,
              fontSize: 48,
              fontWeight: 600,
              color: "white",
              textShadow:
                "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)",
              margin: 0,
              padding: "8px 20px",
              backgroundColor: "rgba(0,0,0,0.25)",
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
