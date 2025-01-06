import { Component } from '@angular/core';
import { HeaderComponent } from '../_components/header/header.component';
import { HomeComponent } from '../_components/home/home.component';
import { NewGameComponent } from '../_components/new-game/new-game.component';

@Component({
  selector: 'app-info',
  standalone: true,
    imports: [
        HeaderComponent,
        HomeComponent,
        NewGameComponent,
    ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {

}
