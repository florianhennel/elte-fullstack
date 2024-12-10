import { booleanAttribute, Component, Input } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { NgIf, Location } from '@angular/common';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzButtonComponent,
    RouterLink,
    NgIf,
    NzIconDirective,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input({
    alias: 'back',
    required: false,
    transform: booleanAttribute,
  })
  canGoBack: boolean = false;

  constructor(private userService: UserService, private location: Location) { }

  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn;
  }

  back(): void {
    this.location.back();
  }
}
