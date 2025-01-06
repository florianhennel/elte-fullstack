import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../_components/header/header.component';
import { NgIf } from '@angular/common';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { ActivatedRoute } from '@angular/router';
import { switchMap, throwError } from 'rxjs';
import { Level } from '../../_interfaces/level';
import { LevelService } from '../../_services/level.service';
import { BackComponent } from '../../_components/back/back.component';
import { HomeComponent } from '../../_components/home/home.component';
import { NewGameComponent } from '../../_components/new-game/new-game.component';

@Component({
  selector: 'app-level-details',
  standalone: true,
    imports: [
        HeaderComponent,
        NgIf,
        NzCardComponent,
        BackComponent,
        HomeComponent,
        NewGameComponent,
    ],
  templateUrl: './level-details.component.html',
  styleUrl: './level-details.component.scss'
})
export class LevelDetailsComponent implements OnInit {
  id: string | null = null;
  level: Level | null = null;

  constructor(private levelService: LevelService, private route: ActivatedRoute) { }

  ngOnInit():void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.id = params.get('id');
        if (this.id) {
          return this.levelService.getLevel(this.id);
        }
        return throwError(() => 'Not Found');
      }),
    ).subscribe((level: Level) => this.level = level);
  }
}
