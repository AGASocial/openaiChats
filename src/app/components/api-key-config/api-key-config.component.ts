import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-api-key-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="p-4 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-sm font-medium text-gray-700">OpenAI API Key:</span>
          <span class="ml-2 text-sm text-gray-500">
            {{ apiKey ? '✅ Configured' : '❌ Not Configured' }}
          </span>
        </div>
        <button
          (click)="openModal()"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {{ apiKey ? 'Update API Key' : 'Configure API Key' }}
        </button>
      </div>
    </div>

    <app-modal
      [isOpen]="isModalOpen"
      title="Configure OpenAI API Key"
      (close)="closeModal()"
    >
      <div class="space-y-4">
        <div>
          <label for="apiKey" class="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            [(ngModel)]="tempApiKey"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="sk-..."
          />
          <p class="mt-2 text-sm text-gray-500">
            Your API key is stored locally and never sent to our servers.
            Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" class="text-blue-500 hover:text-blue-600">OpenAI's website</a>.
          </p>
        </div>

        <div class="text-sm text-gray-500">
          <p>⚠️ Important:</p>
          <ul class="list-disc pl-5 mt-1">
            <li>Keep your API key secure and never share it</li>
            <li>Your key is stored only in your browser's local storage</li>
            <li>You can remove the key at any time</li>
          </ul>
        </div>
      </div>

      <div footer class="flex justify-end gap-3">
        @if (apiKey) {
          <button
            (click)="clearApiKey()"
            class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
          >
            Remove Key
          </button>
        }
        <button
          (click)="closeModal()"
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 focus:outline-none"
        >
          Cancel
        </button>
        <button
          (click)="saveApiKey()"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          [disabled]="!isValidApiKey(tempApiKey)"
        >
          Save
        </button>
      </div>
    </app-modal>
  `
})
export class ApiKeyConfigComponent implements OnInit {
  apiKey = '';
  tempApiKey = '';
  isModalOpen = false;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.configService.getConfig().subscribe(config => {
      this.apiKey = config.openaiApiKey;
    });
  }

  openModal() {
    this.tempApiKey = this.apiKey;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.tempApiKey = '';
  }

  saveApiKey() {
    if (this.isValidApiKey(this.tempApiKey)) {
      this.configService.updateConfig({ openaiApiKey: this.tempApiKey.trim() });
      this.closeModal();
    }
  }

  clearApiKey() {
    if (confirm('Are you sure you want to remove your API key?')) {
      this.configService.updateConfig({ openaiApiKey: '' });
      this.closeModal();
    }
  }

  isValidApiKey(key: string): boolean {
    return /^sk-[A-Za-z0-9]{48}$/.test(key.trim());
  }
}