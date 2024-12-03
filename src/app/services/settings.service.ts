import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatSettings, DEFAULT_SYSTEM_MESSAGE } from '../models/chat-settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly SETTINGS_KEY = 'chat_settings';
  private settings = new BehaviorSubject<ChatSettings>({
    systemMessage: DEFAULT_SYSTEM_MESSAGE
  });

  constructor() {
    this.loadSettings();
  }

  getSettings(): Observable<ChatSettings> {
    return this.settings.asObservable();
  }

  getCurrentSettings(): ChatSettings {
    return this.settings.value;
  }

  updateSystemMessage(message: string): void {
    const newSettings = {
      ...this.settings.value,
      systemMessage: message
    };
    this.settings.next(newSettings);
    this.saveSettings(newSettings);
  }

  private loadSettings(): void {
    const stored = localStorage.getItem(this.SETTINGS_KEY);
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        this.settings.next(settings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }

  private saveSettings(settings: ChatSettings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }
}