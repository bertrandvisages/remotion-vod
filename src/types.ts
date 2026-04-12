export interface SegmentData {
  videoUrl: string;
  tcIn: number; // seconds
  tcOut: number; // seconds
  overlayText?: string;
  textPosition?: {
    x: string;
    y: string;
    align?: "left" | "center" | "right";
  };
}

export interface IntroData {
  titre: string;
  sousTitre?: string;
  duree: number; // seconds
}

export interface OutroData {
  duree: number; // seconds
}

export interface FilmProps {
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
}
