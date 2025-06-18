import { Component, inject } from '@angular/core';
import { FormBuilder, AbstractControl, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth-service';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { toastService } from '../../core/toast-service';

@Component({
  selector: 'app-register',
  imports: [MatCard, MatFormField, MatLabel, MatInput, ReactiveFormsModule, MatButton, MatIcon, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(toastService);
  router = inject(Router);

  confirmPasswordValidator = (controls: AbstractControl) => {
    return controls.get('password')?.value === controls.get('confirmPassword')?.value ? null : { passwordMisMatch: true };
  }


  registrartinForm = this.fb.group({
    email: ['', { validators: [Validators.required, Validators.email]}],
    fullname: ['', { validators: [Validators.required]}],
    password: ['', { validators: [Validators.required, Validators.minLength(6)] }],
    confirmPassword: ['', { validatores: [Validators.required] }]
  }, { validators: this.confirmPasswordValidator })


  getFormControl = (type: 'email' | 'fullname' | 'password' | 'confirmPassword'): FormControl => {
    return this.registrartinForm.controls[type];
  }

  submitRegister() {
    if (!this.registrartinForm.valid) return;

    this.authService.register({
      email: this.registrartinForm.value.email || '',
      fullname: this.registrartinForm.value.fullname || '',
      password: this.registrartinForm.value.password || ''
    }).subscribe(res => {
      this.router.navigate(['login']);
      this.toastService.show("Registration successful!")
    }, err => {
      this.toastService.show(err.message)
    })

  }
}
