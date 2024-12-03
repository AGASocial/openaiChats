import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatManagerService } from '../../services/chat-manager.service';
import { OpenAIParameters, DEFAULT_OPENAI_PARAMETERS } from '../../models/chat.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-openai-parameters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 bg-gray-50 border-b border-gray-200">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-gray-700">OpenAI Parameters</h3>
        <button
          (click)="resetToDefault()"
          class="text-xs text-blue-500 hover:text-blue-600"
        >
          Reset to Default
        </button>
      </div>
      
      <div class="space-y-4">
        <!-- Max Tokens -->
        <div>
          <label class="flex items-center justify-between">
            <span class="text-sm text-gray-700">Max Tokens: {{ parameters.maxTokens }}</span>
          </label>
          <input
            type="range"
            [(ngModel)]="parameters.maxTokens"
            (ngModelChange)="updateParameters()"
            min="1"
            max="4096"
            step="1"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <!-- Temperature -->
        <div>
          <label class="flex items-center justify-between">
            <span class="text-sm text-gray-700">Temperature: {{ parameters.temperature.toFixed(2) }}</span>
          </label>
          <input
            type="range"
            [(ngModel)]="parameters.temperature"
            (ngModelChange)="updateParameters()"
            min="0"
            max="2"
            step="0.01"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <!-- Top P -->
        <div>
          <label class="flex items-center justify-between">
            <span class="text-sm text-gray-700">Top P: {{ parameters.topP.toFixed(2) }}</span>
          </label>
          <input
            type="range"
            [(ngModel)]="parameters.topP"
            (ngModelChange)="updateParameters()"
            min="0"
            max="1"
            step="0.01"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div class="mt-2 text-xs text-gray-500">
        <p><strong>Max Tokens:</strong> Maximum length of the response</p>
        <p><strong>Temperature:</strong> Controls randomness (0 = deterministic, 2 = very random)</p>
        <p><strong>Top P:</strong> Controls diversity via nucleus sampling</p>
      </div>
    </div>
  `
})
export class OpenAIParametersComponent implements OnInit, OnDestroy {
  parameters: OpenAIParameters = { ...DEFAULT_OPENAI_PARAMETERS };
  private chatListSubscription?: Subscription;

  constructor(private chatManager: ChatManagerService) {}

  ngOnInit() {
    this.chatListSubscription = this.chatManager.getChatList().subscribe(() => {
      const activeChat = this.chatManager.getActiveChat();
      if (activeChat) {
        this.parameters = { ...activeChat.openAIParameters };
      } else {
        this.parameters = { ...DEFAULT_OPENAI_PARAMETERS };
      }
    });
  }

  ngOnDestroy() {
    this.chatListSubscription?.unsubscribe();
  }

  updateParameters() {
    const activeChat = this.chatManager.getActiveChat();
    if (activeChat) {
      this.chatManager.updateOpenAIParameters(activeChat.id, { ...this.parameters });
    }
  }

  resetToDefault() {
    this.parameters = { ...DEFAULT_OPENAI_PARAMETERS };
    this.updateParameters();
  }
}