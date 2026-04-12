import React from "react";
import { Composition } from "remotion";
import { FilmDestination } from "./compositions/FilmDestination";
import { FilmProps } from "./types";

const defaultProps: FilmProps = {
  titre: "Destination",
  paysCode: "fr",
  fps: 30,
  segments: [],
  intro: { titre: "Destination", sousTitre: "Découvrir", duree: 4 },
  outro: { duree: 3 },
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FilmDestination"
      component={FilmDestination}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={defaultProps}
    />
  );
};
