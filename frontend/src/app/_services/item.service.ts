import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../globals';
import { Item } from '../_interfaces/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    return this.http.get(`${BACKEND_URL}/items`).pipe(
      map(value => (value as Array<any>).map(item => this.objectToItem(item))),
    );
  }

  assignItem(itemId: string): Observable<any> {
    return this.http.post(`${BACKEND_URL}/items`, { itemId });
  }

  objectToItem(obj: any): Item {
    const { _id, name, description, userId, image } = obj;
    return { id: _id, name, description, userId, image } as Item;
  }
}
