import type {LLMProvider, LLMModel} from '../types/llm';

export const providers: LLMProvider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: '/images/llms/anthropic.png',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    logo: '/images/llms/openai.png',
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: '/images/llms/meta.jpg',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    logo: '/images/llms/mistral.png',
  }
]


export const models: LLMModel[] = [
    {
        id: 'claude-2',
        name: 'Claude 2',
        providerId: 'anthropic',
        description: 'Most capable model for complex tasks',
        maxTokens: 100000,
        isDefault: true
      },
      {
        id: 'claude-instant',
        name: 'Claude Instant',
        providerId: 'anthropic',
        description: 'Faster and cheaper model for simpler tasks',
        maxTokens: 100000
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        providerId: 'openai',
        description: 'Most capable OpenAI model',
        maxTokens: 8192
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        providerId: 'openai',
        description: 'Efficient model for most tasks',
        maxTokens: 4096
      },
      {
        id: 'palm-2',
        name: 'PaLM 2',
        providerId: 'google',
        description: 'Google\'s large language model',
        maxTokens: 8192
      },
      {
        id: 'llama-2',
        name: 'LLaMA 2',
        providerId: 'meta',
        description: 'Meta\'s open source LLM',
        maxTokens: 4096
      }
]