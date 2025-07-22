import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../service/user.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  router = inject(Router);
  fb = inject(FormBuilder);
  userService = inject(UserService);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  loading = false;
  error: string | null = null;

  onLogin() {
    this.error = null;
    if (this.loginForm.valid) {
      this.loading = true;
      this.userService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res && res.token) {
            localStorage.setItem('token', res.token);
          }
          this.router.navigateByUrl('dashboard');
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Wrong Login or Password';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/registration');
  }

  get f() { return this.loginForm.controls; }
}
