import { Component, OnInit } from '@angular/core';
import { Card } from '../../_interfaces/card';
import { CardService } from '../../_services/card.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, throwError } from 'rxjs';
import { HeaderComponent } from '../../_components/header/header.component';
import { NgIf } from '@angular/common';
import { NzCardComponent } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [
    HeaderComponent,
    NgIf,
    NzCardComponent,
  ],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss'
})
export class CardDetailsComponent implements OnInit {
  id: string | null = null;
  card: Card | null = null;

  constructor(private cardService: CardService, private route: ActivatedRoute) { }

  ngOnInit():void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.id = params.get('id');
        if (this.id) {
          return this.cardService.getCard(this.id);
        }
        return throwError(() => 'Not Found');
      }),
    ).subscribe((card: Card) => this.card = card);
  }
}
