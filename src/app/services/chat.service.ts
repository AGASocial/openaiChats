import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Message, ChatMessage, DEFAULT_SYSTEM_MESSAGE } from '../models/message.model';
import { OpenAIService } from './openai.service';
import { ChatManagerService } from './chat-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private isLoading = new BehaviorSubject<boolean>(false);

  constructor(
    private openaiService: OpenAIService,
    private chatManager: ChatManagerService
  ) {}

  getMessages(): Observable<Message[]> {
    return this.chatManager.getChatList().pipe(
      map(chatList => {
        const activeChat = chatList.activeId ? chatList.chats[chatList.activeId] : null;
        return activeChat?.messages || [];
      })
    );
  }

  getLoadingState(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  getSystemMessage(): string {
    const activeChat = this.chatManager.getActiveChat();
    return activeChat?.systemMessage || DEFAULT_SYSTEM_MESSAGE;
  }

  updateSystemMessage(content: string): void {
    const activeChat = this.chatManager.getActiveChat();
    if (!activeChat) return;

    const systemMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'system',
      timestamp: new Date()
    };

    const messages = activeChat.messages.filter(msg => msg.role !== 'system');
    const updatedMessages = [systemMessage, ...messages];
    
    this.chatManager.updateChatMessages(activeChat.id, updatedMessages);
  }

  private convertToOpenAIMessages(messages: Message[]): ChatMessage[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  async sendMessage(content: string) {
    const activeChat = this.chatManager.getActiveChat();
    if (!activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...activeChat.messages, userMessage];
    this.chatManager.updateChatMessages(activeChat.id, updatedMessages);
    
    this.isLoading.next(true);

    try {
      const chatHistory = this.convertToOpenAIMessages(updatedMessages);
      const response = await this.openaiService.generateResponse(
        chatHistory,
        activeChat.openAIParameters
      );
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        model: activeChat.openAIParameters.model,
        tokenUsage: response.tokenUsage
      };

      const finalMessages = [...updatedMessages, aiMessage];
      this.chatManager.updateChatMessages(activeChat.id, finalMessages);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request.',
        role: 'assistant',
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, errorMessage];
      this.chatManager.updateChatMessages(activeChat.id, finalMessages);
    } finally {
      this.isLoading.next(false);
    }
  }

  clearChat(): void {
    const activeChat = this.chatManager.getActiveChat();
    if (!activeChat) return;

    const systemMessage: Message = {
      id: Date.now().toString(),
      content: DEFAULT_SYSTEM_MESSAGE,
      role: 'system',
      timestamp: new Date()
    };

    this.chatManager.updateChatMessages(activeChat.id, [systemMessage]);
  }

  exportChat(): string {
    const activeChat = this.chatManager.getActiveChat();
    if (!activeChat) return '{}';

    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      messages: activeChat.messages
    };
    return JSON.stringify(exportData, null, 2);
  }

  importChat(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (!data.messages || !Array.isArray(data.messages)) {
        throw new Error('Invalid chat data format');
      }
      
      const messages = data.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));

      const activeChat = this.chatManager.getActiveChat();
      if (!activeChat) return false;

      this.chatManager.updateChatMessages(activeChat.id, messages);
      return true;
    } catch (error) {
      console.error('Error importing chat:', error);
      return false;
    }
  }
}