import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        opacity: fadeIn,
      }}
    >
      <p
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 28,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#ff8c8e",
          fontWeight: 500,
          margin: 0,
        }}
      >
        Voyage On Demand
      </p>

      <div
        style={{
          width: 120,
          height: 2,
          background:
            "linear-gradient(to right, transparent, #ff8c8e, transparent)",
        }}
      />

      <p
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 18,
          color: "rgba(255,255,255,0.5)",
          margin: 0,
        }}
      >
        voyageondemand.com
      </p>
    </AbsoluteFill>
  );
};
