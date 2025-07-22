import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { UserRegisterModel } from '../../model/user.model';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})
export class Registration {
  router = inject(Router);
  fb = inject(FormBuilder);
  userService = inject(UserService);

  registrationForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    surname: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  error: string | null = null;

  create() {
    this.error = null;
    if (this.registrationForm.valid) {
      this.loading = true;
      const data: UserRegisterModel = { ...this.registrationForm.value, role: 'USER' };
      this.userService.register(data).subscribe({
        next: () => {
          this.loading = false;
          this.error = null;
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 409) {
            this.error = 'User already exists!';
          } else if (err.status === 0) {
            this.error = 'No connection to backend!';
          } else if (err.error && typeof err.error === 'string') {
            this.error = err.error;
          } else {
            this.error = 'Registration failed';
          }
        }
      });
    } else {
      this.registrationForm.markAllAsTouched();
      this.error = 'Please fill all fields correctly!';
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  get f() { return this.registrationForm.controls; }
}
