import React from "react";
import { AbsoluteFill } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Intro } from "./Intro";
import { Segment } from "./Segment";
import { Outro } from "./Outro";
import { FilmProps } from "../types";

const TRANSITION_FRAMES = 15;

export const FilmDestination: React.FC<FilmProps> = ({
  segments,
  intro,
  outro,
  musiqueUrl,
  musiqueVolume = 0.25,
  voixOffUrl,
  voixOffVolume = 0.85,
  fps,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a1a" }}>
      {/* Piste musique de fond avec fade in */}
      {musiqueUrl && (
        <Audio
          src={musiqueUrl}
          volume={(f) => {
            // Fade in sur 2 secondes
            if (f < 2 * fps) return (f / (2 * fps)) * musiqueVolume;
            return musiqueVolume;
          }}
          loop
        />
      )}

      {/* Piste voix off */}
      {voixOffUrl && <Audio src={voixOffUrl} volume={voixOffVolume} />}

      {/* Timeline vidéo avec transitions */}
      <TransitionSeries>
        {/* Intro */}
        <TransitionSeries.Sequence
          durationInFrames={Math.round(intro.duree * fps)}
        >
          <Intro
            titre={intro.titre}
            sousTitre={intro.sousTitre}
            duree={intro.duree}
          />
        </TransitionSeries.Sequence>

        {/* Transition intro → premier segment */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Segments avec transitions entre eux */}
        {segments.map((seg, index) => {
          const durationFrames = Math.round((seg.tcOut - seg.tcIn) * fps);
          return (
            <React.Fragment key={index}>
              <TransitionSeries.Sequence durationInFrames={durationFrames}>
                <Segment {...seg} />
              </TransitionSeries.Sequence>

              {/* Transition vers le segment suivant ou l'outro */}
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({
                  durationInFrames: TRANSITION_FRAMES,
                })}
              />
            </React.Fragment>
          );
        })}

        {/* Outro */}
        <TransitionSeries.Sequence
          durationInFrames={Math.round(outro.duree * fps)}
        >
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
