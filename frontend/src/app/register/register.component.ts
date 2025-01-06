import { Component, OnInit } from '@angular/core';
import { NzCardComponent } from "ng-zorro-antd/card";
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { AuthService } from '../_services/auth.service';
import { BackComponent } from '../_components/back/back.component';
import { HomeComponent } from '../_components/home/home.component';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
      ReactiveFormsModule,
      NzCardComponent,
      NzButtonModule,
      NzCheckboxModule,
      NzFormModule,
      NzInputModule,
      RouterLink,
      NgIf,
      NzTypographyComponent,
      NzIconDirective,
      BackComponent,
      HomeComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
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
      password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: this.fb.control('', [Validators.required, Validators.minLength(8)]),
    }, { validators: this.passwordValidator() });
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
      this.register(credentials);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;

      if (password && confirmPassword && password !== confirmPassword) {
        return { mismatch: true };
      }
      return null;
    };
  }

  get passwordError(): boolean {
    return this.validateForm.hasError('mismatch');
  }

  get unauthorizedError(): boolean {
    return this.validateForm.hasError('unauthorized');
  }

  register(credentials: { username: string; password: string }): void {
    this.authService.register(credentials).subscribe({
      next: () => {
        this.router.navigate(['/login'], { queryParams: { redirect: this.redirectUrl } }).then(() => {
          alert('Sikeres regisztráció!');
        });
      },
      error: (err) => {
        console.error(err);
        this.validateForm.setErrors({ unauthorized: true });
      },
    });
  }
}
