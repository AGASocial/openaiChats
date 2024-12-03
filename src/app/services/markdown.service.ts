import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor(private sanitizer: DomSanitizer) {
    // Configure marked options
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert \n to <br>
    });
  }

  parse(content: string): SafeHtml {
    const html = marked.parse(content);
    if (typeof html === 'string') {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
    return this.sanitizer.bypassSecurityTrustHtml('Error parsing markdown');
  }
}