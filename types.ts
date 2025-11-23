export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  answer: string;
  sources: { uri: string; title: string }[];
  relatedTopics: string[];
}

export enum SpaceTheme {
  DeepSpace = 'DeepSpace',
  Mars = 'Mars',
  EarthOrbit = 'EarthOrbit',
  BlackHole = 'BlackHole',
  Nebula = 'Nebula',
}

export interface Topic {
  id: string;
  label: string;
  trend: 'up' | 'down' | 'neutral';
}
