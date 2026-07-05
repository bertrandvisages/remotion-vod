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

export type TrailerClip = {
  videoUrl: string;
  tcIn: number;
  duration: number; // secondes à l'écran
  focalX?: number; // 0-1 centre horizontal du crop vertical (recadrage intelligent)
  focalY?: number; // 0-1
  keyword?: string; // mot-clé d'habillage
  title?: string; // reveal titre (dernier plan)
  tagline?: string;
};

export type DestinationTrailerProps = {
  clips: TrailerClip[];
  musicUrl?: string;
  musicStart?: number; // offset (s) dans la piste
  fps?: number;
};

const Keyword: React.FC<{ text: string; durF: number; s: number }> = ({ text, durF, s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inOp = interpolate(frame, [0.15 * fps, 0.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOp = interpolate(frame, [durF - 0.45 * fps, durF - 0.15 * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inOp, outOp);
  const spacing = interpolate(frame, [0.15 * fps, 0.6 * fps], [0.42, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [0.3 * fps, 0.75 * fps], [0, 120 * s], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 320 * s, opacity: op }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 * s }}>
        <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 96 * s, lineHeight: 1, textTransform: "uppercase", color: "#fff", letterSpacing: `${spacing}em`, textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>
          {text}
        </div>
        <div style={{ width: lineW, height: 4 * s, borderRadius: 4, background: CORAL }} />
      </div>
    </AbsoluteFill>
  );
};

const TitleReveal: React.FC<{ text: string; tagline?: string; s: number }> = ({ text, tagline, s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(frame, [0.1 * fps, 0.6 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0.1 * fps, 0.9 * fps], [0.86, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [0.55 * fps, 1.1 * fps], [0, 280 * s], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp = interpolate(frame, [0.9 * fps, 1.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 * s, transform: `scale(${scale})` }}>
        <div style={{ fontFamily: oswald, fontWeight: 700, fontSize: 168 * s, lineHeight: 0.95, textTransform: "uppercase", color: "#fff", letterSpacing: "0.02em", textShadow: "0 6px 40px rgba(0,0,0,0.7)" }}>
          {text}
        </div>
        <div style={{ width: lineW, height: 5 * s, borderRadius: 4, background: CORAL }} />
        {tagline && (
          <div style={{ fontFamily: montserrat, fontWeight: 500, fontSize: 34 * s, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", opacity: tagOp }}>
            {tagline}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const Clip: React.FC<TrailerClip & { s: number }> = ({ videoUrl, tcIn, focalX = 0.5, focalY = 0.5, keyword, title, tagline, s }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  // Ken burns doux (dynamise le montage)
  const scale = interpolate(frame, [0, durationInFrames], [1.05, 1.13]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Video
          src={videoUrl}
          trimBefore={Math.round(tcIn * fps)}
          objectFit="cover"
          muted
          style={{ width: "100%", height: "100%", objectPosition: `${focalX * 100}% ${focalY * 100}%` }}
        />
      </AbsoluteFill>
      {/* léger vignettage bas pour la lisibilité des mots-clés */}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 38%)" }} />
      {keyword && <Keyword text={keyword} durF={durationInFrames} s={s} />}
      {title && <TitleReveal text={title} tagline={tagline} s={s} />}
    </AbsoluteFill>
  );
};

export const DestinationTrailer: React.FC<DestinationTrailerProps> = ({ clips, musicUrl, musicStart = 0 }) => {
  const { fps, width, durationInFrames } = useVideoConfig();
  const s = width / 1080;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {musicUrl && (
        <Audio
          src={musicUrl}
          trimBefore={Math.round(musicStart * fps)}
          volume={(f) =>
            Math.min(
              interpolate(f, [0, 0.6 * fps], [0, 1], { extrapolateRight: "clamp" }),
              interpolate(f, [durationInFrames - 1 * fps, durationInFrames], [1, 0], { extrapolateLeft: "clamp" }),
            )
          }
        />
      )}

      <Series>
        {clips.map((c, i) => (
          <Series.Sequence key={i} durationInFrames={Math.max(1, Math.round(c.duration * fps))}>
            <Clip {...c} s={s} />
          </Series.Sequence>
        ))}
      </Series>

      {/* Cold open : ouverture au noir */}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(useCurrentFrame(), [0, 0.6 * fps], [1, 0], { extrapolateRight: "clamp" }), pointerEvents: "none" }} />
      {/* Fermeture au noir */}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(useCurrentFrame(), [durationInFrames - 0.5 * fps, durationInFrames], [0, 1], { extrapolateLeft: "clamp" }), pointerEvents: "none" }} />

      {/* Signature VoD bas (logo) */}
      <div style={{ position: "absolute", bottom: 96 * s, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: interpolate(useCurrentFrame(), [durationInFrames - 3 * fps, durationInFrames - 2.2 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <Img src={staticFile("vod-logo.png")} style={{ width: 400 * s, height: "auto", filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.55))" }} />
      </div>
    </AbsoluteFill>
  );
};
