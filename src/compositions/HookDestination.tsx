import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video, Audio } from "@remotion/media";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

const { fontFamily: montserrat } = loadMontserrat("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

// Condensé bold uppercase pour le titre monumental (proche charte VoD).
const { fontFamily: oswald } = loadOswald("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

const CORAL = "#F28B9A";

export type HookDestinationProps = {
  format?: "9_16" | "4_5";
  clipUrl: string;
  tcIn: number;
  tcOut: number;
  kicker?: string;
  titre?: string;
  titre2?: string;
  musiqueUrl?: string;
  fps?: number;
};

export const HookDestination: React.FC<HookDestinationProps> = ({
  clipUrl,
  tcIn,
  kicker,
  titre,
  titre2,
  musiqueUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  // Échelle typographique relative à la largeur (1080 -> facteur 1).
  const s = width / 1080;

  // Ken Burns doux (léger zoom-in continu).
  const scale = interpolate(frame, [0, durationInFrames], [1.04, 1.12], {
    extrapolateRight: "clamp",
  });

  // Apparition de l'habillage.
  const kickerOpacity = interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [0.5 * fps, 1.1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0.5 * fps, 1.1 * fps], [40 * s, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [0.9 * fps, 1.6 * fps], [0, 160 * s], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Piste vidéo plein cadre */}
      {clipUrl && (
        <AbsoluteFill style={{ transform: `scale(${scale})` }}>
          <Video
            src={clipUrl}
            trimBefore={Math.round(tcIn * fps)}
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
            muted
          />
        </AbsoluteFill>
      )}

      {/* Musique optionnelle (fade-in) */}
      {musiqueUrl && (
        <Audio
          src={musiqueUrl}
          volume={(f) => interpolate(f, [0, 1.5 * fps], [0, 0.7], { extrapolateRight: "clamp" })}
          loop
        />
      )}

      {/* Dégradé bas pour la lisibilité du texte */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 32%, rgba(0,0,0,0) 55%)",
        }}
      />
      {/* Léger voile haut */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%)",
        }}
      />

      {/* Habillage texte, ancré en bas */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: `${70 * s}px ${64 * s}px ${96 * s}px`,
          gap: 18 * s,
        }}
      >
        {kicker && (
          <div
            style={{
              opacity: kickerOpacity,
              display: "inline-flex",
              alignItems: "center",
              gap: 12 * s,
              padding: `${10 * s}px ${20 * s}px`,
              borderRadius: 999,
              backgroundColor: "rgba(242,139,154,0.18)",
              border: `${1.5 * s}px solid ${CORAL}`,
              backdropFilter: "blur(6px)",
            }}
          >
            <span
              style={{
                fontFamily: montserrat,
                fontSize: 26 * s,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              {kicker}
            </span>
          </div>
        )}

        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          {titre && (
            <div
              style={{
                fontFamily: oswald,
                fontSize: 118 * s,
                lineHeight: 0.98,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#fff",
                letterSpacing: "0.005em",
                textShadow: "0 4px 30px rgba(0,0,0,0.55)",
              }}
            >
              {titre}
            </div>
          )}
          {titre2 && (
            <div
              style={{
                fontFamily: oswald,
                fontSize: 118 * s,
                lineHeight: 0.98,
                fontWeight: 700,
                textTransform: "uppercase",
                color: CORAL,
                letterSpacing: "0.005em",
                textShadow: "0 4px 30px rgba(0,0,0,0.55)",
              }}
            >
              {titre2}
            </div>
          )}
        </div>

        {/* Filet corail */}
        <div
          style={{
            width: lineWidth,
            height: 4 * s,
            borderRadius: 4,
            background: CORAL,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
