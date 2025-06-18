import { Component, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-safe-html',
  imports: [],
  template: `<div [innerHTML]="$safeContent()"></div>`,
})
export class SafeHTML {

  sanitizer = inject(DomSanitizer);
  $safeContent = signal<SafeHtml>('')

  $content = input.required<string>();

  e = effect(() => {
    this.$safeContent.set(this.sanitizer.bypassSecurityTrustHtml(this.$content()))
  })
}
