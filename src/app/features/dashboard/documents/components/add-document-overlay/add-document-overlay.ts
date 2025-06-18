import { Component, ElementRef, inject, model, ViewChild, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
  title: string;
}

@Component({
  selector: 'app-add-document-overlay',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogContent, MatDialogActions, ReactiveFormsModule, FormsModule, MatIcon],
  templateUrl: './add-document-overlay.html',
  styleUrl: './add-document-overlay.css'
})
export class AddDocumentOverlay {
  readonly dialogRef = inject(MatDialogRef<AddDocumentOverlay>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  selectedFile: File | null = null;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>

  closeOverlay(selectedFile: File | null): void {
    
    this.dialogRef.close(selectedFile);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];

    const isPdf = file.type === 'application/pdf';
    const isUnder5MB = file.size <= 5 * 1024 * 1024;

    if (!isPdf) {
      alert('Only PDF files are allowed.');
      this.selectedFile = null;
      input.value = '';
      return;
    }

    if (!isUnder5MB) {
      alert('File must be less than or equal to 5MB.');
      this.selectedFile = null;
      input.value = '';
      return;
    }

    this.selectedFile = file;
  }
  }

  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

}
