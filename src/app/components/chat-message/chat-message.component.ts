import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../models/message.model';
import { MarkdownService } from '../../services/markdown.service';
import { AVAILABLE_MODELS } from '../../models/chat.model';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="flex w-full space-x-4"
      [class.justify-end]="message.role === 'user'"
    >
      @if (message.role !== 'user') {
        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
          {{ message.role === 'assistant' ? 'AI' : 'S' }}
        </div>
      }
      
      <div 
        class="max-w-[80%] rounded-2xl p-4 shadow-sm relative group"
        [ngClass]="{
          'bg-gradient-to-r from-blue-500 to-blue-600 text-white': message.role === 'user',
          'bg-white border border-gray-100': message.role === 'assistant',
          'bg-yellow-50 border border-yellow-200': message.role === 'system'
        }"
      >
        @if (message.role === 'system') {
          <div class="text-xs font-medium text-yellow-800 mb-1">System Message</div>
        }
        <div 
          class="text-sm markdown-content"
          [ngClass]="{'prose prose-sm max-w-none': message.role === 'assistant'}"
          [innerHTML]="getFormattedContent()"
        ></div>

        @if (message.role === 'assistant') {
          <button
            (click)="copyToClipboard()"
            class="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            [class.text-green-500]="copied"
            [attr.aria-label]="copied ? 'Copied!' : 'Copy to clipboard'"
          >
            @if (copied) {
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            } @else {
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            }
          </button>
        }

        @if (message.tokenUsage) {
          <div class="mt-3 pt-2 border-t" [class.border-white]="message.role === 'user'" [class.border-gray-100]="message.role !== 'user'">
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs" [class.text-white]="message.role === 'user'" [class.text-gray-500]="message.role !== 'user'">
              @if (message.model) {
                <div class="flex items-center gap-1">
                  <span class="font-medium">Model:</span>
                  <span>{{ getModelName(message.model) }}</span>
                </div>
              }
              <div class="flex items-center gap-1">
                <span class="font-medium">Prompt:</span>
                <span>{{ message.tokenUsage.promptTokens }} tokens</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="font-medium">Completion:</span>
                <span>{{ message.tokenUsage.completionTokens }} tokens</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="font-medium">Total:</span>
                <span>{{ message.tokenUsage.totalTokens }} tokens</span>
              </div>
            </div>
          </div>
        }
        <div class="mt-2 text-xs" [class.opacity-70]="message.role === 'user'">
          {{ message.timestamp | date:'shortTime' }}
        </div>
      </div>

      @if (message.role === 'user') {
        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-medium">
          U
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .markdown-content {
      line-height: 1.6;
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ChatMessageComponent {
  @Input() message!: Message;
  copied = false;
  private copyTimeout: any;

  constructor(private markdownService: MarkdownService) {}

  getFormattedContent() {
    if (this.message.role === 'assistant') {
      return this.markdownService.parse(this.message.content);
    }
    return this.message.content;
  }

  getModelName(modelId: string): string {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    return model ? model.name : modelId;
  }

  copyToClipboard() {
    // Get the raw content without HTML formatting
    const content = this.message.content;
    
    navigator.clipboard.writeText(content).then(() => {
      this.copied = true;
      
      // Clear any existing timeout
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
      }
      
      // Reset the copied state after 2 seconds
      this.copyTimeout = setTimeout(() => {
        this.copied = false;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text:', err);
    });
  }

  ngOnDestroy() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
  }
}