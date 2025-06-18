import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class toastService {

  private snackBar = inject(MatSnackBar);

  show(message: string, action = 'Close', duration = 3000, panelClass = ['custom-snackbar']) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass,
    });
  }
}
