import React from "react";
import { Composition } from "remotion";
import { FilmDestination } from "./compositions/FilmDestination";
import { HookDestination, HookDestinationProps } from "./compositions/HookDestination";
import { RoomTour, RoomTourProps } from "./compositions/RoomTour";
import { FilmProps } from "./types";

const defaultProps: FilmProps = {
  titre: "Destination",
  paysCode: "fr",
  fps: 30,
  segments: [],
  intro: { titre: "Destination", sousTitre: "Découvrir", duree: 4 },
  outro: { duree: 3 },
};

const FORMAT_DIMS: Record<string, { w: number; h: number }> = {
  "9_16": { w: 1080, h: 1920 },
  "4_5": { w: 1080, h: 1350 },
};

const hookDefaults: HookDestinationProps = {
  format: "9_16",
  clipUrl: "",
  tcIn: 0,
  tcOut: 4,
  kicker: "Islande",
  titre: "Terres",
  titre2: "de feu",
  fps: 30,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FilmDestination"
        component={FilmDestination}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />

      {/* Vidéos courtes organiques Insta / FB. Dimensions + durée calculées
          depuis les props (format + tcIn/tcOut) via calculateMetadata. */}
      <Composition
        id="HookDestination"
        component={HookDestination}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={hookDefaults}
        calculateMetadata={({ props }) => {
          const fps = props.fps || 30;
          const dims = FORMAT_DIMS[props.format || "9_16"] || FORMAT_DIMS["9_16"];
          const dur = Math.max(0.5, (props.tcOut ?? 4) - (props.tcIn ?? 0));
          return {
            width: dims.w,
            height: dims.h,
            fps,
            durationInFrames: Math.round(dur * fps),
          };
        }}
      />

      {/* Room tour influenceuse : multi-plans verticaux + sous-titres. */}
      <Composition
        id="RoomTour"
        component={RoomTour}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ kicker: "FOUR SEASONS · MAUI", shots: [] as RoomTourProps["shots"], fps: 30 }}
        calculateMetadata={({ props }) => {
          const fps = props.fps || 30;
          const total = (props.shots || []).reduce((a, sh) => a + Math.max(1, Math.round((sh.durationSeconds || 3) * fps)), 0);
          return { width: 1080, height: 1920, fps, durationInFrames: Math.max(1, total) };
        }}
      />
    </>
  );
};
