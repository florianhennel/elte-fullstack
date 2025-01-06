import { Component } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'comp-new-game',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzIconDirective,
    RouterLink,
  ],
  templateUrl: './new-game.component.html',
  styleUrl: './new-game.component.scss'
})
export class NewGameComponent {

}
