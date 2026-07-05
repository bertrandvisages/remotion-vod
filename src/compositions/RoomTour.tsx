import React from "react";
import {
  AbsoluteFill,
  Series,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video, Audio } from "@remotion/media";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

const { fontFamily: montserrat } = loadMontserrat("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const { fontFamily: oswald } = loadOswald("normal", { weights: ["600", "700"], subsets: ["latin"] });

const CORAL = "#F28B9A";

export type RoomTourShot = {
  videoUrl: string;
  durationSeconds: number;
  subtitle?: string;
  voUrl?: string;
  ownAudio?: boolean;
};

export type RoomTourProps = {
  kicker?: string;
  shots: RoomTourShot[];
  musiqueUrl?: string;
  fps?: number;
};

const Subtitle: React.FC<{ text: string; durF: number; s: number }> = ({ text, durF, s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = Math.min(
    interpolate(frame, [0, 0.25 * fps], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [durF - 0.3 * fps, durF], [1, 0], { extrapolateLeft: "clamp" }),
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 210 * s, display: "flex", justifyContent: "center", padding: `0 ${70 * s}px`, opacity }}>
      <span
        style={{
          fontFamily: montserrat, fontSize: 46 * s, fontWeight: 600, lineHeight: 1.25, color: "#fff", textAlign: "center",
          textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.6)", maxWidth: 900 * s,
        }}
      >
        {text}
      </span>
    </div>
  );
};

const Shot: React.FC<RoomTourShot & { s: number }> = ({ videoUrl, durationSeconds, subtitle, voUrl, ownAudio, s }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  // léger fondu d'entrée sur chaque plan
  const fadeIn = interpolate(frame, [0, 0.3 * fps], [0, 1], { extrapolateRight: "clamp" });
  // Ken Burns doux
  const scale = interpolate(frame, [0, durationInFrames], [1.04, 1.1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeIn }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Video src={videoUrl} muted={!ownAudio} objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      {voUrl && <Audio src={voUrl} volume={0.9} />}
      {/* dégradé bas pour lisibilité sous-titre */}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 26%, rgba(0,0,0,0) 46%)" }} />
      {subtitle && <Subtitle text={subtitle} durF={durationInFrames} s={s} />}
    </AbsoluteFill>
  );
};

export const RoomTour: React.FC<RoomTourProps> = ({ kicker, shots, musiqueUrl }) => {
  const { fps, width } = useVideoConfig();
  const s = width / 1080;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {musiqueUrl && (
        <Audio src={musiqueUrl} volume={(f) => interpolate(f, [0, 1.5 * fps], [0, 0.18], { extrapolateRight: "clamp" })} loop />
      )}

      <Series>
        {shots.map((shot, i) => (
          <Series.Sequence key={i} durationInFrames={Math.max(1, Math.round(shot.durationSeconds * fps))}>
            <Shot {...shot} s={s} />
          </Series.Sequence>
        ))}
      </Series>

      {/* Habillage persistant : pill kicker + filet corail, en haut */}
      {kicker && (
        <div style={{ position: "absolute", top: 90 * s, left: 64 * s, display: "flex", flexDirection: "column", gap: 12 * s }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", padding: `${10 * s}px ${22 * s}px`, borderRadius: 999, backgroundColor: "rgba(242,139,154,0.18)", border: `${1.5 * s}px solid ${CORAL}`, backdropFilter: "blur(6px)" }}>
            <span style={{ fontFamily: montserrat, fontSize: 26 * s, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff" }}>{kicker}</span>
          </div>
          <div style={{ width: 120 * s, height: 4 * s, borderRadius: 4, background: CORAL }} />
        </div>
      )}

      {/* Signature VoD bas-droite */}
      <div style={{ position: "absolute", bottom: 90 * s, right: 64 * s }}>
        <span style={{ fontFamily: oswald, fontSize: 30 * s, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          Voyage <span style={{ color: CORAL }}>On Demand</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
