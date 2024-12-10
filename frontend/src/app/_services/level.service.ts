import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BACKEND_URL } from '../../globals';
import { Level } from '../_interfaces/level';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  constructor(private http: HttpClient) { }

  getLevel(id: string): Observable<Level> {
    return this.http.get(`${BACKEND_URL}/levels/${id}`).pipe(
      map(value => this.objectToLevel(value)),
    );
  }

  getLevels(): Observable<Level[]> {
    return this.http.get(`${BACKEND_URL}/levels`).pipe(
      map(value => (value as Array<any>).map(level => this.objectToLevel(level))),
    );
  }

  objectToLevel(obj: any): Level {
    const { _id, name, description, image } = obj;
    return { id: _id, name, description, image } as Level;
  }
}
