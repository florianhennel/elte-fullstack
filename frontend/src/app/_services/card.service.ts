import { Injectable } from '@angular/core';
import { Card } from '../_interfaces/card';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BACKEND_URL } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor(private http: HttpClient) { }

  getCard(id: string): Observable<Card> {
    return this.http.get(`${BACKEND_URL}/cards/${id}`).pipe(
      map(value => this.objectToCard(value)),
    );
  }

  getCards(): Observable<Card[]> {
    return this.http.get(`${BACKEND_URL}/cards`).pipe(
      map(value => (value as Array<any>).map(card => this.objectToCard(card))),
    );
  }

  getCardsFiltered(category: string): Observable<Card[]> {
    return this.http.get(`${BACKEND_URL}/cards?category=${category}`).pipe(
      map(value => (value as Array<any>).map(card => this.objectToCard(card))),
    );
  }

  getCategories(): Observable<{ category: string, categoryName: string }[]> {
    return this.http.get(`${BACKEND_URL}/cards`).pipe(
      map(value => [...new Map((value as Array<any>).map(card => {
          return [card.category, {category: card.category, categoryName: card.class}]
        })).values()]
      ),
    );
  }

  objectToCard(obj: any): Card {
    const { _id, name, description, cost, rarity, image } = obj;
    const category: string = obj.class;
    return { id: _id, name, category, description, cost, rarity, image } as Card;
  }
}
