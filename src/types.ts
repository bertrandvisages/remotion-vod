export type SegmentData = {
  videoUrl: string;
  tcIn: number; // seconds
  tcOut: number; // seconds
  overlayText?: string;
  textPosition?: {
    x: string;
    y: string;
    align?: "left" | "center" | "right";
  };
};

export type IntroData = {
  titre: string;
  sousTitre?: string;
  duree: number; // seconds
};

export type OutroData = {
  duree: number; // seconds
};

export type FilmProps = {
  titre: string;
  paysCode: string;
  segments: SegmentData[];
  intro: IntroData;
  outro: OutroData;
  musiqueUrl?: string;
  musiqueVolume?: number;
  voixOffUrl?: string;
  voixOffVolume?: number;
  fps: number;
};
