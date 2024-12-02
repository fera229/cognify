import type Mux from '@mux/mux-node';

export interface MuxSubtitle {
  name: string;
  language_code:
    | 'en'
    | 'es'
    | 'it'
    | 'pt'
    | 'de'
    | 'fr'
    | 'pl'
    | 'ru'
    | 'nl'
    | 'ca'
    | 'tr'
    | 'sv'
    | 'uk'
    | 'no'
    | 'fi'
    | 'sk'
    | 'el'
    | 'cs'
    | 'hr'
    | 'da'
    | 'ro'
    | 'bg';
  status: 'preparing' | 'ready' | 'error';
  url?: string;
}

export interface MuxPlaybackId {
  id: string;
  policy: 'public' | 'signed';
}

export interface MuxTrack {
  type: 'video' | 'audio';
  id: string;
  duration?: number;
  max_width?: number;
  max_height?: number;
  max_frame_rate?: number;
  max_channels?: number;
}

export interface MuxAssetResponse {
  id: string;
  status: 'preparing' | 'ready' | 'error';
  playback_ids?: MuxPlaybackId[];
  duration?: number;
  subtitles?: MuxSubtitle[];
  tracks?: MuxTrack[];
  errors?: {
    type: string;
    message: string;
  }[];
  created_at?: string;
}

export interface MuxAssetData {
  data: MuxAssetResponse;
}

export interface MuxError {
  error: {
    message: string;
    type: string;
    status_code?: number;
  };
}

export interface MuxVideoUploadResponse {
  muxData: {
    id: number;
    asset_id: string;
    playback_id: string;
    lesson_id: number;
  };
  asset: {
    id: string;
    playbackId: string;
    duration: number;
  };
  transcription: {
    segmentsCount: number;
  };
}

export interface MuxAssetCreateOptions {
  input: Array<{
    url: string;
    generated_subtitles?: Array<{
      language_code: MuxSubtitle['language_code'];
      name: string;
    }>;
  }>;
  playback_policy: ['public'];
  test: boolean;
}
