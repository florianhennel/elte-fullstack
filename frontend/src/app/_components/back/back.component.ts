import { Component } from '@angular/core';
import { Location } from "@angular/common";
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzIconDirective } from "ng-zorro-antd/icon";

@Component({
  selector: 'comp-back',
  standalone: true,
    imports: [
        NzButtonComponent,
        NzIconDirective
    ],
  templateUrl: './back.component.html',
  styleUrl: './back.component.scss'
})
export class BackComponent {
  constructor(private location: Location) { }

  back(): void {
    this.location.back();
  }
}
