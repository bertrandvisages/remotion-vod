import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

const { fontFamily: playfair } = loadPlayfair("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const { fontFamily: montserrat } = loadMontserrat("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

export type IntroProps = {
  titre: string;
  sousTitre?: string;
  duree: number;
};

export const Intro: React.FC<IntroProps> = ({ titre, sousTitre }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [0, 0.8 * fps], [40, 0], {
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(
    frame,
    [0.5 * fps, 1.2 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const separatorWidth = interpolate(
    frame,
    [0.8 * fps, 1.5 * fps],
    [0, 200],
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
          fontFamily: playfair,
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
            fontFamily: montserrat,
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

      <div
        style={{
          width: separatorWidth,
          height: 3,
          background:
            "linear-gradient(to right, transparent, #ff8c8e, transparent)",
          opacity: subtitleOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
