import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../_components/header/header.component';
import { NgIf } from '@angular/common';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { ActivatedRoute } from '@angular/router';
import { switchMap, throwError } from 'rxjs';
import { EnemyService } from '../../_services/enemy.service';
import { Enemy } from '../../_interfaces/enemy';
import { BackComponent } from '../../_components/back/back.component';
import { HomeComponent } from '../../_components/home/home.component';
import { NewGameComponent } from '../../_components/new-game/new-game.component';

@Component({
  selector: 'app-enemy-details',
  standalone: true,
    imports: [
        HeaderComponent,
        NgIf,
        NzCardComponent,
        BackComponent,
        HomeComponent,
        NewGameComponent,
    ],
  templateUrl: './enemy-details.component.html',
  styleUrl: './enemy-details.component.scss'
})
export class EnemyDetailsComponent implements OnInit {
  id: string | null = null;
  enemy: Enemy | null = null;

  constructor(private enemyService: EnemyService, private route: ActivatedRoute) { }

  ngOnInit():void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.id = params.get('id');
        if (this.id) {
          return this.enemyService.getEnemy(this.id);
        }
        return throwError(() => 'Not Found');
      }),
    ).subscribe((enemy: Enemy) => this.enemy = enemy);
  }
}
