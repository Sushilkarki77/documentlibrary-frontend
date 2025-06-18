import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SearchResponse } from './search.interface';
import { ResponseItem } from '../../../../core/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = `${environment.api_url}/search`;
  private http = inject(HttpClient);


  searchExecute = (query: string, skip: number, limit: number): Observable<ResponseItem<SearchResponse>> => {
    return this.http.get<ResponseItem<SearchResponse>>(`${this.baseUrl}?query=${query}&skip=${skip}&limit=${limit}`)
  }

}
