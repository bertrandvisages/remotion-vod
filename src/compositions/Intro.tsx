import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { IntroData } from "../types";

export const Intro: React.FC<IntroData> = ({ titre, sousTitre }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [0, fps * 0.8], [40, 0], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(
    frame,
    [fps * 0.5, fps * 1.2],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 120,
          fontWeight: 400,
          fontStyle: "italic",
          color: "white",
          textShadow: "0 4px 30px rgba(0,0,0,0.5)",
          opacity: fadeIn,
          transform: `translateY(${titleY}px)`,
          margin: 0,
        }}
      >
        {titre}
      </h1>

      {sousTitre && (
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 36,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#ff8c8e",
            fontWeight: 500,
            opacity: subtitleOpacity,
            margin: 0,
          }}
        >
          {sousTitre}
        </p>
      )}

      {/* Séparateur */}
      <div
        style={{
          width: 200,
          height: 3,
          background:
            "linear-gradient(to right, transparent, #ff8c8e, transparent)",
          opacity: subtitleOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
