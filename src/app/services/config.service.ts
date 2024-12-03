import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig, DEFAULT_CONFIG } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly CONFIG_KEY = 'app_config';
  private config = new BehaviorSubject<AppConfig>(DEFAULT_CONFIG);

  constructor() {
    this.loadConfig();
  }

  getConfig(): Observable<AppConfig> {
    return this.config.asObservable();
  }

  getCurrentConfig(): AppConfig {
    return this.config.value;
  }

  updateConfig(newConfig: Partial<AppConfig>): void {
    const updatedConfig = {
      ...this.config.value,
      ...newConfig
    };
    this.config.next(updatedConfig);
    this.saveConfig(updatedConfig);
  }

  private loadConfig(): void {
    const stored = localStorage.getItem(this.CONFIG_KEY);
    if (stored) {
      try {
        const config = JSON.parse(stored);
        this.config.next(config);
      } catch (error) {
        console.error('Error loading config:', error);
        this.config.next(DEFAULT_CONFIG);
      }
    }
  }

  private saveConfig(config: AppConfig): void {
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
  }
}