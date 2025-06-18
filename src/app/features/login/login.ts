import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth-service';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { toastService } from '../../core/toast-service';

@Component({
  selector: 'app-login',
  imports: [MatFormField, MatLabel, MatInput, MatCard, ReactiveFormsModule, MatButton, MatIconModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  toastService = inject(toastService);

  loginGroup = this.fb.group({
    email: ['', { validators: [Validators.required, Validators.email] }],
    password: ['', { validators: [Validators.required, Validators.minLength(6)] }]
  })


  getFormControl = (type: 'email' | 'password'): FormControl => {
    return this.loginGroup.controls[type];
  }

  handleFormSubmit = () => {
    this.authService.login({ email: this.loginGroup.value.email || '', password: this.loginGroup.value.password || '' }).subscribe(res => {
      const accessToken = res.data.accessToken;
       const refreshToken = res.data.refreshToken;
      const decodedToken = JSON.parse(atob(accessToken.split('.')[1]))

      this.authService.accessTokenValue = accessToken;
      this.authService.refreshTokenValue = refreshToken;
      this.authService.userValue = decodedToken;

      this.router.navigate(['dashboard']);

      this.toastService.show("Login successful!")
    }, err => {
      this.toastService.show(err.error.message || err?.message)
    });
  }
}
