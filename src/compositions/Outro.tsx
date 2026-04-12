import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily: montserrat } = loadFont("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scaleUp = interpolate(frame, [0, 0.6 * fps], [0.95, 1], {
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
        transform: `scale(${scaleUp})`,
      }}
    >
      <p
        style={{
          fontFamily: montserrat,
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
          fontFamily: montserrat,
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
