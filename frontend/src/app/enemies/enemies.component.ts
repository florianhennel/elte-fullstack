import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../_components/header/header.component';
import { NgForOf } from '@angular/common';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { Enemy } from '../_interfaces/enemy';
import { EnemyService } from '../_services/enemy.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HomeComponent } from '../_components/home/home.component';
import { NewGameComponent } from '../_components/new-game/new-game.component';

@Component({
  selector: 'app-enemies',
  standalone: true,
    imports: [
        HeaderComponent,
        NgForOf,
        NzOptionComponent,
        NzSelectComponent,
        FormsModule,
        RouterLink,
        HomeComponent,
        NewGameComponent,
    ],
  templateUrl: './enemies.component.html',
  styleUrl: './enemies.component.scss'
})
export class EnemiesComponent implements OnInit {
  filter: string = 'default';
  enemies: Enemy[] = [];
  categories: string[] = [];

  constructor(private enemyService: EnemyService) { }

  ngOnInit():void {
    this.getCategories();
    this.getEnemies();
  }

  getEnemies(): void {
    if (this.filter === 'default') {
      this.getEnemiesAll();
    } else {
      this.getEnemiesFiltered();
    }
  }

  getEnemiesAll(): void {
    this.enemyService.getEnemies().subscribe((value) => this.enemies = value);
  }

  getEnemiesFiltered(): void {
    this.enemyService.getEnemiesFiltered(this.filter).subscribe((value) => this.enemies = value);
  }

  getCategories(): void {
    this.enemyService.getCategories()
      .subscribe((value) => this.categories = value);
  }
}
