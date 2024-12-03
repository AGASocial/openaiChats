import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatManagerService } from '../../services/chat-manager.service';
import { AVAILABLE_MODELS } from '../../models/chat.model';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="border-t border-gray-200 p-4">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <select
            [(ngModel)]="selectedModel"
            (ngModelChange)="updateModel($event)"
            class="text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
          >
            @for (model of availableModels; track model.id) {
              <option [value]="model.id">{{ model.name }}</option>
            }
          </select>
          <input
            type="text"
            [(ngModel)]="messageContent"
            (keyup.enter)="sendMessage()"
            placeholder="Type a message..."
            [disabled]="isLoading ?? false"
            class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            (click)="sendMessage()"
            [disabled]="isLoading ?? false"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            @if (isLoading ?? false) {
              <span>Thinking...</span>
            } @else {
              <span>Send</span>
            }
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChatInputComponent {
  @Input() isLoading: boolean | null = false;
  @Output() send = new EventEmitter<string>();
  
  messageContent = '';
  selectedModel = '';
  availableModels = AVAILABLE_MODELS;

  constructor(private chatManager: ChatManagerService) {
    const activeChat = this.chatManager.getActiveChat();
    if (activeChat) {
      this.selectedModel = activeChat.openAIParameters.model;
    }

    this.chatManager.getChatList().subscribe(() => {
      const activeChat = this.chatManager.getActiveChat();
      if (activeChat) {
        this.selectedModel = activeChat.openAIParameters.model;
      }
    });
  }

  updateModel(modelId: string) {
    const activeChat = this.chatManager.getActiveChat();
    if (activeChat) {
      this.chatManager.updateOpenAIParameters(activeChat.id, {
        ...activeChat.openAIParameters,
        model: modelId
      });
    }
  }

  sendMessage() {
    if (this.messageContent.trim() && !(this.isLoading ?? false)) {
      this.send.emit(this.messageContent);
      this.messageContent = '';
    }
  }
}