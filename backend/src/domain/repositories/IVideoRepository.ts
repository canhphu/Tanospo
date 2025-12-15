export interface VideoFilter {
  intensity?: 'low' | 'medium' | 'high';
  durationMinutes?: number;
  tags?: string[];
}

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  durationSeconds: number;
  intensity: string;
  tags: string[];
}

export interface IVideoRepository {
  findRecommended(filter: VideoFilter): Promise<Video[]>;
}

