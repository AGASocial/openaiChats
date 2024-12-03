import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { DEFAULT_SYSTEM_MESSAGE } from '../../models/message.model';
import { ChatManagerService } from '../../services/chat-manager.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-system-message-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 bg-gray-50 border-b border-gray-200">
      <div class="flex items-center justify-between mb-2">
        <label for="systemMessage" class="block text-sm font-medium text-gray-700">
          System Message
        </label>
        <button
          (click)="resetToDefault()"
          class="text-xs text-blue-500 hover:text-blue-600"
        >
          Reset to Default
        </button>
      </div>
      <div class="flex gap-2">
        <textarea
          id="systemMessage"
          [(ngModel)]="systemMessage"
          (blur)="updateSystemMessage()"
          rows="2"
          class="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Enter system message..."
        ></textarea>
      </div>
      <p class="mt-1 text-xs text-gray-500">
        This message sets the behavior and context for the AI assistant.
      </p>
    </div>
  `
})
export class SystemMessageEditorComponent implements OnInit, OnDestroy {
  systemMessage = '';
  private chatListSubscription?: Subscription;

  constructor(
    private chatService: ChatService,
    private chatManager: ChatManagerService
  ) {}

  ngOnInit() {
    this.chatListSubscription = this.chatManager.getChatList().subscribe(() => {
      const activeChat = this.chatManager.getActiveChat();
      if (activeChat) {
        const systemMsg = activeChat.messages.find(msg => msg.role === 'system');
        this.systemMessage = systemMsg?.content || DEFAULT_SYSTEM_MESSAGE;
      } else {
        this.systemMessage = DEFAULT_SYSTEM_MESSAGE;
      }
    });
  }

  ngOnDestroy() {
    this.chatListSubscription?.unsubscribe();
  }

  updateSystemMessage() {
    if (this.systemMessage.trim()) {
      this.chatService.updateSystemMessage(this.systemMessage.trim());
    }
  }

  resetToDefault() {
    this.systemMessage = DEFAULT_SYSTEM_MESSAGE;
    this.chatService.updateSystemMessage(DEFAULT_SYSTEM_MESSAGE);
  }
}