import { Component, OnInit } from '@angular/core';
import { NgForOf } from "@angular/common";
import { NzCardComponent } from "ng-zorro-antd/card";
import { HeaderComponent } from '../_components/header/header.component';
import { Card } from '../_interfaces/card';
import { CardService } from '../_services/card.service';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    NgForOf,
    NzCardComponent,
    HeaderComponent,
    NzSelectComponent,
    NzOptionComponent,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent implements OnInit {
  filter: string = 'default';
  cards: Card[] = [];
  categories: { category: string, categoryName: string }[] = [];

  constructor(private cardService: CardService) { }

  ngOnInit():void {
    this.getCategories();
    this.getCards();
  }

  getCards(): void {
    if (this.filter === 'default') {
      this.getCardsAll();
    } else {
      this.getCardsFiltered();
    }
  }

  getCardsAll(): void {
    this.cardService.getCards().subscribe((value) => this.cards = value);
  }

  getCardsFiltered(): void {
    this.cardService.getCardsFiltered(this.filter).subscribe((value) => this.cards = value);
  }

  getCategories(): void {
    this.cardService.getCategories()
      .subscribe((value) => this.categories = value);
  }
}
