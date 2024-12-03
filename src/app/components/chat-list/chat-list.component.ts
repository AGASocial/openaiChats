import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatManagerService } from '../../services/chat-manager.service';
import { Chat } from '../../models/chat.model';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      <div class="flex h-16 shrink-0 items-center">
        <h2 class="text-lg font-semibold">OpenAI Chats</h2>
      </div>
      
      <div class="flex flex-col gap-y-4">
        <button
          (click)="createNewChat()"
          class="flex gap-x-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <svg class="size-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          New Chat
        </button>
      </div>

      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              @for (chat of chatList.chats | keyvalue; track chat.key) {
                <li>
                  <div
                    class="group relative rounded-md p-2 hover:bg-gray-50"
                    [class.bg-gray-50]="chat.key === chatList.activeId"
                    [class.text-indigo-600]="chat.key === chatList.activeId"
                    (click)="setActiveChat(chat.key)"
                  >
                    @if (isEditing === chat.key) {
                      <input
                        #nameInput
                        type="text"
                        [ngModel]="chat.value.name"
                        (ngModelChange)="updateChatName(chat.key, $event)"
                        (blur)="finishEditing()"
                        (keyup.enter)="finishEditing()"
                        class="w-full px-2 py-1 text-sm border rounded"
                        (click)="$event.stopPropagation()"
                      />
                    } @else {
                      <div class="flex items-center justify-between">
                        <span class="flex items-center gap-x-3">
                          <svg class="size-5 shrink-0" [class.text-indigo-600]="chat.key === chatList.activeId" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                          </svg>
                          <span class="truncate text-sm/6 font-semibold">{{ chat.value.name }}</span>
                        </span>
                        <div class="hidden group-hover:flex items-center gap-2">
                          <button
                            (click)="startEditing(chat.key, $event)"
                            class="p-1 text-gray-400 hover:text-indigo-600"
                          >
                            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button
                            (click)="deleteChat(chat.key, $event)"
                            class="p-1 text-gray-400 hover:text-red-600"
                          >
                            <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                </li>
              }
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  `
})
export class ChatListComponent {
  chatList: { chats: { [id: string]: Chat }, activeId: string | null } = { chats: {}, activeId: null };
  isEditing: string | null = null;

  constructor(private chatManager: ChatManagerService) {
    this.chatManager.getChatList().subscribe(list => {
      this.chatList = list;
    });
  }

  createNewChat(): void {
    this.chatManager.createNewChat();
  }

  setActiveChat(id: string): void {
    this.chatManager.setActiveChat(id);
  }

  startEditing(id: string, event: Event): void {
    event.stopPropagation();
    this.isEditing = id;
  }

  finishEditing(): void {
    this.isEditing = null;
  }

  updateChatName(id: string, name: string): void {
    this.chatManager.updateChatName(id, name);
  }

  deleteChat(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      this.chatManager.deleteChat(id);
    }
  }
}