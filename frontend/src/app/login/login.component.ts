import { Component, OnInit } from '@angular/core';
import { NzCardComponent } from "ng-zorro-antd/card";
import { NzFormModule } from 'ng-zorro-antd/form';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { NgIf } from '@angular/common';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { BackComponent } from '../_components/back/back.component';
import { HomeComponent } from '../_components/home/home.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
      ReactiveFormsModule,
      NzCardComponent,
      NzButtonModule,
      NzCheckboxModule,
      NzFormModule,
      NzInputModule,
      RouterLink,
      NzIconDirective,
      NgIf,
      NzTypographyComponent,
      BackComponent,
      HomeComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  validateForm;
  passwordVisible = false;
  redirectUrl: string = '/home';

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {
    this.validateForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      let redirect: string | undefined = params['redirect'];
      if (redirect) {
        this.redirectUrl = redirect;
      }
    });
    if (this.userService.isLoggedIn) {
      this.router.navigate(['/profile']);
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const credentials = {
        username: this.validateForm.value.email ?? '',
        password: this.validateForm.value.password ?? '',
      };
      this.login(credentials);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  get unauthorizedError(): boolean {
    return this.validateForm.hasError('unauthorized');
  }

  login(credentials: { username: string; password: string }): void {
    this.authService.login(credentials).subscribe({
      next: () => {
        if (this.userService.isLoggedIn) {
          this.router.navigate([this.redirectUrl]);
        }
      },
      error: (err) => {
        console.error(err);
        this.validateForm.setErrors({ unauthorized: true });
      },
    });
  }
}
