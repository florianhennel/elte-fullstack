import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NzProgressComponent } from 'ng-zorro-antd/progress';
import { interval, Subject, take, takeUntil } from 'rxjs';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { HomeComponent } from '../_components/home/home.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
    imports: [
        NzProgressComponent,
        NzCardComponent,
        HomeComponent,
    ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit, OnDestroy {
  progress = 100;
  private destroy$ = new Subject<void>();

  constructor(private location: Location) { }

  ngOnInit(): void {
    interval(50).pipe(
      take(100),
      takeUntil(this.destroy$),
    ).subscribe({
      next: n => this.progress = 99 - n,
      complete: () => {
        if (this.progress < 1) {
          this.back();
        }
      },
    });
  }

  back(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
