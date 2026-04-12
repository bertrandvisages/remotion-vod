import React from "react";
import { AbsoluteFill, Audio, Series } from "remotion";
import { Intro } from "./Intro";
import { Segment } from "./Segment";
import { Outro } from "./Outro";
import { FilmProps } from "../types";

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
      {/* Piste musique de fond */}
      {musiqueUrl && (
        <Audio src={musiqueUrl} volume={musiqueVolume} loop />
      )}

      {/* Piste voix off */}
      {voixOffUrl && <Audio src={voixOffUrl} volume={voixOffVolume} />}

      {/* Timeline vidéo */}
      <Series>
        {/* Intro */}
        <Series.Sequence durationInFrames={Math.round(intro.duree * fps)}>
          <Intro
            titre={intro.titre}
            sousTitre={intro.sousTitre}
            duree={intro.duree}
          />
        </Series.Sequence>

        {/* Segments */}
        {segments.map((seg, index) => {
          const durationFrames = Math.round((seg.tcOut - seg.tcIn) * fps);
          return (
            <Series.Sequence
              key={index}
              durationInFrames={durationFrames}
            >
              <Segment {...seg} />
            </Series.Sequence>
          );
        })}

        {/* Outro */}
        <Series.Sequence durationInFrames={Math.round(outro.duree * fps)}>
          <Outro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
