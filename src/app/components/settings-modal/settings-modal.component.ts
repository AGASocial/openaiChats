import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatManagerService } from '../../services/chat-manager.service';
import { OpenAIParameters, DEFAULT_OPENAI_PARAMETERS, AVAILABLE_MODELS } from '../../models/chat.model';
import { DEFAULT_SYSTEM_MESSAGE } from '../../models/message.model';
import { ModalComponent } from '../modal/modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <button
      (click)="openModal()"
      class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
      Settings
    </button>

    <app-modal
      [isOpen]="isModalOpen"
      title="Chat Settings"
      (close)="closeModal()"
    >
      <div class="space-y-6">
        <!-- System Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            System Message
          </label>
          <textarea
            [(ngModel)]="systemMessage"
            rows="3"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter system message..."
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">
            This message sets the behavior and context for the AI assistant.
          </p>
        </div>

        <!-- OpenAI Parameters -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-700">Model Parameters</h3>

          <!-- Model Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <select
              [(ngModel)]="parameters.model"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              @for (model of availableModels; track model.id) {
                <option [value]="model.id">{{ model.name }} - {{ model.description }}</option>
              }
            </select>
          </div>
          
          <!-- Max Tokens -->
          <div>
            <label class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Max Tokens: {{ parameters.maxTokens }}</span>
            </label>
            <input
              type="range"
              [(ngModel)]="parameters.maxTokens"
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
              min="0"
              max="1"
              step="0.01"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div class="text-xs text-gray-500 space-y-1">
            <p><strong>Model:</strong> Choose the AI model to use for responses</p>
            <p><strong>Max Tokens:</strong> Maximum length of the response</p>
            <p><strong>Temperature:</strong> Controls randomness (0 = deterministic, 2 = very random)</p>
            <p><strong>Top P:</strong> Controls diversity via nucleus sampling</p>
          </div>
        </div>
      </div>

      <div footer class="flex justify-end gap-3">
        <button
          (click)="resetToDefault()"
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 focus:outline-none"
        >
          Reset to Default
        </button>
        <button
          (click)="closeModal()"
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 focus:outline-none"
        >
          Cancel
        </button>
        <button
          (click)="saveSettings()"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
      </div>
    </app-modal>
  `
})
export class SettingsModalComponent implements OnInit, OnDestroy {
  isModalOpen = false;
  systemMessage = DEFAULT_SYSTEM_MESSAGE;
  parameters: OpenAIParameters = { ...DEFAULT_OPENAI_PARAMETERS };
  availableModels = AVAILABLE_MODELS;
  private chatListSubscription?: Subscription;

  constructor(private chatManager: ChatManagerService) {}

  ngOnInit() {
    this.chatListSubscription = this.chatManager.getChatList().subscribe(() => {
      const activeChat = this.chatManager.getActiveChat();
      if (activeChat) {
        this.systemMessage = activeChat.systemMessage;
        this.parameters = { ...activeChat.openAIParameters };
      } else {
        this.resetToDefault();
      }
    });
  }

  ngOnDestroy() {
    this.chatListSubscription?.unsubscribe();
  }

  openModal() {
    const activeChat = this.chatManager.getActiveChat();
    if (activeChat) {
      this.systemMessage = activeChat.systemMessage;
      this.parameters = { ...activeChat.openAIParameters };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveSettings() {
    const activeChat = this.chatManager.getActiveChat();
    if (activeChat) {
      // Update system message
      const systemMessageContent = this.systemMessage.trim() || DEFAULT_SYSTEM_MESSAGE;
      this.chatManager.updateSystemMessage(activeChat.id, systemMessageContent);

      // Update OpenAI parameters
      this.chatManager.updateOpenAIParameters(activeChat.id, { ...this.parameters });
    }
    this.closeModal();
  }

  resetToDefault() {
    this.systemMessage = DEFAULT_SYSTEM_MESSAGE;
    this.parameters = { ...DEFAULT_OPENAI_PARAMETERS };
  }
}