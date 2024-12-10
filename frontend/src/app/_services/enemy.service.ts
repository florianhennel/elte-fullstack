import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BACKEND_URL } from '../../globals';
import { Enemy } from '../_interfaces/enemy';

@Injectable({
  providedIn: 'root'
})
export class EnemyService {
  constructor(private http: HttpClient) { }

  getEnemy(id: string): Observable<Enemy> {
    return this.http.get(`${BACKEND_URL}/enemies/${id}`).pipe(
      map(value => this.objectToEnemy(value)),
    );
  }

  getEnemies(): Observable<Enemy[]> {
    return this.http.get(`${BACKEND_URL}/enemies`).pipe(
      map(value => (value as Array<any>).map(enemy => this.objectToEnemy(enemy))),
    );
  }

  getEnemiesFiltered(category: string): Observable<Enemy[]> {
    return this.http.get(`${BACKEND_URL}/enemies?category=${category}`).pipe(
      map(value => (value as Array<any>).map(enemy => this.objectToEnemy(enemy))),
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get(`${BACKEND_URL}/enemies`).pipe(
      map(value => [...new Set((value as Array<any>).map(enemy => enemy.category))]),
    );
  }

  objectToEnemy(obj: any): Enemy {
    const { _id, name, category, description, health, attack, defense, image } = obj;
    return { id: _id, name, category, description, health, attack, defense, image } as Enemy;
  }
}
