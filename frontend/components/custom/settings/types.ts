export type Theme = 'light' | 'dark' | 'system';
export type ModelId = string;

export interface Settings {
  theme: Theme;
  selectedModel: ModelId;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  topP: number;
}

export interface Model {
  id: string;
  name: string;
  status: 'stable' | 'beta';
  maxTokens: number;
}

export interface ModelGroup {
  label: string;
  models: Model[];
}