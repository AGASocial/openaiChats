import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatControlsComponent } from './components/chat-controls/chat-controls.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ApiKeyConfigComponent } from './components/api-key-config/api-key-config.component';
import { TokenCounterComponent } from './components/token-counter/token-counter.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    ChatInputComponent,
    ChatControlsComponent,
    ChatListComponent,
    ApiKeyConfigComponent,
    TokenCounterComponent,
    SettingsModalComponent
  ],
  template: `
    <div class="h-full bg-white">
      <div class="relative z-50 lg:hidden" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-900/80" aria-hidden="true"></div>
        <div class="fixed inset-0 flex">
          <div class="relative mr-16 flex w-full max-w-xs flex-1">
            <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" class="-m-2.5 p-2.5">
                <span class="sr-only">Close sidebar</span>
                <svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <app-chat-list />
          </div>
        </div>
      </div>

      <!-- Static sidebar for desktop -->
      <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <app-chat-list />
      </div>

      <div class="lg:pl-72 h-screen">
        <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden">
            <span class="sr-only">Open sidebar</span>
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true"></div>

          <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div class="flex items-center gap-x-4 lg:gap-x-6">
              <app-chat-controls />
              <div class="h-6 w-px bg-gray-200" aria-hidden="true"></div>
              <app-settings-modal />
            </div>
          </div>
        </div>

        <main class="flex flex-col h-[calc(100vh-4rem)]">
          <!-- API Key Configuration -->
          <app-api-key-config />

          <!-- Token Counter -->
          <app-token-counter />

          <!-- Chat Messages -->
          <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            @for (message of messages$ | async; track message.id) {
              <app-chat-message [message]="message" class="animate-fade-in" />
            }
          </div>

          <!-- Input -->
          <app-chat-input 
            [isLoading]="isLoading$ | async"
            (send)="sendMessage($event)" 
          />
        </main>
      </div>
    </div>
  `
})
export class AppComponent {
  messages$ = this.chatService.getMessages();
  isLoading$ = this.chatService.getLoadingState();

  constructor(private chatService: ChatService) {}

  sendMessage(content: string) {
    this.chatService.sendMessage(content);
  }
}