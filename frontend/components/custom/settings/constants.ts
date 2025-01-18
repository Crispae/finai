import { Settings2, Boxes, Sun, Moon, Laptop } from 'lucide-vue-next';
import type { ModelGroup } from './types';

export const TABS = [
  { id: 'general', label: 'General', icon: Settings2 },
  { id: 'models', label: 'Models', icon: Boxes },
] as const;

export const THEMES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Laptop },
] as const;

export const MODEL_GROUPS: ModelGroup[] = [
  {
    label: 'OpenAI Models',
    models: [
      { id: 'gpt-4', name: 'GPT-4', status: 'stable', maxTokens: 8192 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', status: 'stable', maxTokens: 4096 },
    ],
  },
  {
    label: 'Anthropic Models',
    models: [
      { id: 'claude-3-opus', name: 'Claude 3 Opus', status: 'stable', maxTokens: 200000 },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', status: 'stable', maxTokens: 100000 },
    ],
  },
];