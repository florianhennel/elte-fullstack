import { Component } from '@angular/core';
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzIconDirective } from "ng-zorro-antd/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'comp-home',
  standalone: true,
    imports: [
        NzButtonComponent,
        NzIconDirective,
        RouterLink,
        RouterLinkActive
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
