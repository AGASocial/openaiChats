import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'chat_history';

  saveMessages(messages: Message[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
  }

  loadMessages(): Message[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const messages = JSON.parse(stored);
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  exportChat(): string {
    const messages = this.loadMessages();
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      messages
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
      
      this.saveMessages(messages);
      return true;
    } catch (error) {
      console.error('Error importing chat:', error);
      return false;
    }
  }

  clearChat(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}