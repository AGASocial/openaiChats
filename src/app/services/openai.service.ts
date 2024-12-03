import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { ChatMessage } from '../models/message.model';
import { ConfigService } from './config.service';
import { OpenAIParameters } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private openai!: OpenAI;

  constructor(private configService: ConfigService) {
    const config = this.configService.getCurrentConfig();
    this.initializeOpenAI(config.openaiApiKey);

    this.configService.getConfig().subscribe(newConfig => {
      this.initializeOpenAI(newConfig.openaiApiKey);
    });
  }

  private initializeOpenAI(apiKey: string): void {
    this.openai = new OpenAI({
      apiKey: apiKey || 'dummy-key',
      dangerouslyAllowBrowser: true
    });
  }

  async generateResponse(messages: ChatMessage[], parameters: OpenAIParameters): Promise<{ 
    content: string; 
    tokenUsage: { 
      promptTokens: number; 
      completionTokens: number; 
      totalTokens: number; 
    } 
  }> {
    const config = this.configService.getCurrentConfig();
    if (!config.openaiApiKey) {
      return {
        content: 'Please configure your OpenAI API key in the settings to use the chat.',
        tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      };
    }

    try {
      const completion = await this.openai.chat.completions.create({
        messages,
        model: parameters.model,
        max_tokens: parameters.maxTokens,
        temperature: parameters.temperature,
        top_p: parameters.topP
      });

      return {
        content: completion.choices[0].message.content || 'No response generated',
        tokenUsage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return {
        content: 'Sorry, there was an error processing your request. Please check your API key and try again.',
        tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      };
    }
  }
}