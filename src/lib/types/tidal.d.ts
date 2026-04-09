interface TidalArtist {
  id: number;
  name: string;
  handle: string | null;
  type: "MAIN" | "FEATURED";
  picture: string | null;
}

interface TidalAlbum {
  id: number;
  title: string;
  cover: string;
  vibrantColor: string;
  videoCover: string | null;
}

interface TidalTrack {
  id: number;
  title: string;
  duration: number;
  replayGain: number;
  peak: number;
  allowStreaming: boolean;
  streamReady: boolean;
  payToStream: boolean;
  adSupportedStreamReady: boolean;
  djReady: boolean;
  stemReady: boolean;
  streamStartDate: string;
  premiumStreamingOnly: boolean;
  trackNumber: number;
  volumeNumber: number;
  version: string | null;
  popularity: number;
  copyright: string;
  bpm: number;
  key: string;
  keyScale: "MAJOR" | "MINOR";
  url: string;
  isrc: string;
  editable: boolean;
  explicit: boolean;
  audioQuality: "HI_RES_LOSSLESS" | "LOSSLESS" | "HIGH" | "LOW";
  audioModes: ("STEREO" | "DOLBY_ATMOS")[];
  mediaMetadata: {
    tags: ("LOSSLESS" | "HIRES_LOSSLESS" | "DOLBY_ATMOS")[];
  };
  upload: boolean;
  accessType: string | null;
  spotlighted: boolean;
  artist: TidalArtist;
  artists: TidalArtist[];
  album: TidalAlbum;
  mixes: Record<string, string>;
}

interface TidalSearchResponse {
  version: string;
  data: {
    limit: number;
    offset: number;
    totalNumberOfItems: number;
    items: TidalTrack[];
  };
}

type TidalAlbumWithArtists = TidalAlbum & { artists: TidalArtist[] };

interface TidalAlbumItem {
  type: "track";
  item: TidalTrack;
}

interface TidalAlbumResponse {
  version: string;
  data: {
    id: number;
    title: string;
    numberOfTracks: number;
    releaseDate: string;
    cover: string;
    artist: TidalArtist;
    artists: TidalArtist[];
    items: TidalAlbumItem[];
  };
}

interface TidalTrackResponse {
  version: string;
  data: {
    trackId: number;
    manifestMimeType: string;
    manifest: string;
    bitDepth: number;
    sampleRate: number;
  };
}
