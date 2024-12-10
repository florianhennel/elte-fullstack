import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../_components/header/header.component';
import { NgForOf } from '@angular/common';
import { Level } from '../_interfaces/level';
import { LevelService } from '../_services/level.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf,
    RouterLink,
  ],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.scss'
})
export class LevelsComponent implements OnInit {
  levels: Level[] = [];

  constructor(private levelService: LevelService) { }

  ngOnInit():void {
    this.getEnemies();
  }

  getEnemies(): void {
    this.levelService.getLevels().subscribe((value) => this.levels = value);
  }
}
