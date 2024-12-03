import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-2 p-2 border-b border-gray-200">
      <button
        (click)="exportChat()"
        class="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Export Chat
      </button>
      <button
        (click)="triggerFileInput()"
        class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Import Chat
      </button>
      <button
        (click)="clearChat()"
        class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Clear Chat
      </button>
      <input
        #fileInput
        type="file"
        accept=".json"
        (change)="handleFileInput($event)"
        class="hidden"
      />
    </div>
  `
})
export class ChatControlsComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private chatService: ChatService) {}

  exportChat(): void {
    const chatData = this.chatService.exportChat();
    const blob = new Blob([chatData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = this.chatService.importChat(content);
      if (!success) {
        alert('Failed to import chat. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    (event.target as HTMLInputElement).value = '';
  }

  clearChat(): void {
    if (confirm('Are you sure you want to clear the chat history? This cannot be undone.')) {
      this.chatService.clearChat();
    }
  }
}