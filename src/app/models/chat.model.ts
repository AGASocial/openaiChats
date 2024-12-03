import { Message } from './message.model';

export interface OpenAIParameters {
  model: string;
  maxTokens: number;
  temperature: number;
  topP: number;
}

export const AVAILABLE_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model, best at complex tasks' },
  { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', description: 'Latest GPT-4 model with improved performance' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Good balance of capability and speed' },
  { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K', description: 'Same as GPT-3.5 but with 16K token context' }
];

export const DEFAULT_OPENAI_PARAMETERS: OpenAIParameters = {
  model: 'gpt-3.5-turbo',
  maxTokens: 2048,
  temperature: 0.7,
  topP: 1
};

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  systemMessage: string;
  createdAt: Date;
  updatedAt: Date;
  openAIParameters: OpenAIParameters;
}

export interface ChatList {
  chats: { [id: string]: Chat };
  activeId: string | null;
}

export const DEFAULT_CHAT_NAME = 'New Chat';