import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-token-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1">
          <span class="font-medium text-gray-700">Total Prompt Tokens:</span>
          <span class="text-gray-600">{{ promptTokens$ | async }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="font-medium text-gray-700">Total Completion Tokens:</span>
          <span class="text-gray-600">{{ completionTokens$ | async }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="font-medium text-gray-700">Total Tokens:</span>
          <span class="text-gray-600">{{ totalTokens$ | async }}</span>
        </div>
      </div>
    </div>
  `
})
export class TokenCounterComponent {
  promptTokens$ = this.chatService.getMessages().pipe(
    map(messages => 
      messages.reduce((sum, msg) => 
        sum + (msg.tokenUsage?.promptTokens || 0), 0
      )
    )
  );

  completionTokens$ = this.chatService.getMessages().pipe(
    map(messages => 
      messages.reduce((sum, msg) => 
        sum + (msg.tokenUsage?.completionTokens || 0), 0
      )
    )
  );

  totalTokens$ = this.chatService.getMessages().pipe(
    map(messages => 
      messages.reduce((sum, msg) => 
        sum + (msg.tokenUsage?.totalTokens || 0), 0
      )
    )
  );

  constructor(private chatService: ChatService) {}
}