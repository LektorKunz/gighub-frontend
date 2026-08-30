import { Component, inject, input, output, signal } from '@angular/core';

import { EventService } from '../../services/event.service';

// Gang 08: billedupload til events via multipart/form-data (POST /api/events/{id}/image).
@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  private readonly eventService = inject(EventService);

  readonly eventId = input.required<number>();
  readonly currentImageUrl = input<string | null>(null);

  readonly uploaded = output<string>();

  readonly uploading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly previewUrl = signal<string | null>(null);

  onFileSelected(fileInput: HTMLInputElement): void {
    const file = fileInput.files?.[0];
    if (!file) {
      return;
    }

    this.errorMessage.set(null);
    this.previewUrl.set(URL.createObjectURL(file));
    this.uploading.set(true);

    this.eventService.uploadImage(this.eventId(), file).subscribe({
      next: (updatedEvent) => {
        this.uploading.set(false);
        if (updatedEvent.imageUrl) {
          this.uploaded.emit(updatedEvent.imageUrl);
        }
      },
      error: () => {
        this.uploading.set(false);
        this.errorMessage.set('Billedet kunne ikke uploades. Prøv igen.');
      },
    });

    // Ryd input-feltet, så samme fil kan vælges igen senere hvis nødvendigt.
    fileInput.value = '';
  }
}
