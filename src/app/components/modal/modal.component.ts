import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-black bg-opacity-30 transition-opacity"></div>

          <!-- Modal panel -->
          <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
            <!-- Header -->
            @if (title) {
              <div class="border-b border-gray-200 px-6 py-4">
                <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
              </div>
            }

            <!-- Content -->
            <div class="px-6 py-4">
              <ng-content></ng-content>
            </div>

            <!-- Footer -->
            @if (showFooter) {
              <div class="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                <ng-content select="[footer]"></ng-content>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showFooter = true;
  @Output() close = new EventEmitter<void>();
}