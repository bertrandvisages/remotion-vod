import React from "react";
import {
  AbsoluteFill,
  Img,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video, Audio } from "@remotion/media";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

const { fontFamily: oswald } = loadOswald("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const { fontFamily: montserrat } = loadMontserrat("normal", { weights: ["500", "600"], subsets: ["latin"] });
const CORAL = "#F28B9A";

export type HotelClip = {
  videoUrl: string;
  tcIn: number;
  duration: number;
  focalX?: number;
  focalY?: number;
  title?: string; // reveal nom (dernier plan)
  tagline?: string;
};

export type Subtitle = { text: string; from: number; to: number }; // secondes

export type HotelTrailerProps = {
  clips: HotelClip[];
  subtitles?: Subtitle[];
  voUrl?: string;
  musicUrl?: string;
  musicStart?: number;
  fps?: number;
};

const TitleReveal: React.FC<{ text: string; tagline?: string; s: number }> = ({ text, tagline, s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(frame, [0.05 * fps, 0.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0.05 * fps, 0.8 * fps], [0.88, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [0.45 * fps, 1 * fps], [0, 300 * s], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp = interpolate(frame, [0.8 * fps, 1.3 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 * s, transform: `scale(${scale})`, padding: `0 ${60 * s}px` }}>
        <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 104 * s, lineHeight: 0.98, textTransform: "uppercase", color: "#fff", letterSpacing: "0.01em", textAlign: "center", textShadow: "0 6px 40px rgba(0,0,0,0.7)" }}>
          {text}
        </div>
        <div style={{ width: lineW, height: 5 * s, borderRadius: 4, background: CORAL }} />
        {tagline && (
          <div style={{ fontFamily: montserrat, fontWeight: 500, fontSize: 32 * s, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", opacity: tagOp, textAlign: "center" }}>
            {tagline}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const Clip: React.FC<HotelClip & { s: number }> = ({ videoUrl, tcIn, focalX = 0.5, focalY = 0.5, title, tagline, s }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], [1.06, 1.14]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Video src={videoUrl} trimBefore={Math.round(tcIn * fps)} objectFit="cover" muted style={{ width: "100%", height: "100%", objectPosition: `${focalX * 100}% ${focalY * 100}%` }} />
      </AbsoluteFill>
      {title && <AbsoluteFill style={{ background: "rgba(0,0,0,0.28)" }} />}
      {title && <TitleReveal text={title} tagline={tagline} s={s} />}
    </AbsoluteFill>
  );
};

const Subtitles: React.FC<{ segments: Subtitle[]; s: number }> = ({ segments, s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const seg = segments.find((x) => t >= x.from && t < x.to);
  if (!seg) return null;
  const local = t - seg.from;
  const op = Math.min(
    interpolate(local, [0, 0.15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(local, [seg.to - seg.from - 0.2, seg.to - seg.from], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 300 * s, display: "flex", justifyContent: "center", padding: `0 ${70 * s}px`, opacity: op }}>
      <span style={{ fontFamily: oswald, fontWeight: 600, fontSize: 52 * s, lineHeight: 1.15, textTransform: "uppercase", letterSpacing: "0.02em", color: "#fff", textAlign: "center", textShadow: "0 3px 20px rgba(0,0,0,0.9)", maxWidth: 900 * s }}>
        {seg.text}
      </span>
    </div>
  );
};

export const HotelTrailer: React.FC<HotelTrailerProps> = ({ clips, subtitles = [], voUrl, musicUrl, musicStart = 0 }) => {
  const { fps, width } = useVideoConfig();
  const s = width / 1080;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {musicUrl && (
        <Audio src={musicUrl} trimBefore={Math.round(musicStart * fps)} volume={(f) => interpolate(f, [0, 0.5 * fps], [0, 0.6], { extrapolateRight: "clamp" })} loop />
      )}
      {voUrl && <Audio src={voUrl} volume={0.95} />}

      <Series>
        {clips.map((c, i) => (
          <Series.Sequence key={i} durationInFrames={Math.max(1, Math.round(c.duration * fps))}>
            <Clip {...c} s={s} />
          </Series.Sequence>
        ))}
      </Series>

      {/* dégradé bas + sous-titres voix off */}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 34%)", pointerEvents: "none" }} />
      <Subtitles segments={subtitles} s={s} />

      {/* Cold open (entrée au noir uniquement) */}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(useCurrentFrame(), [0, 0.5 * fps], [1, 0], { extrapolateRight: "clamp" }), pointerEvents: "none" }} />

      {/* Logo VoD */}
      <div style={{ position: "absolute", bottom: 92 * s, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("vod-logo.png")} style={{ width: 360 * s, height: "auto", filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.6))" }} />
      </div>
    </AbsoluteFill>
  );
};
