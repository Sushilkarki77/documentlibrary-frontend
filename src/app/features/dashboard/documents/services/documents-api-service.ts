import { HttpClient, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResponseItem } from '../../../../core/interfaces';
import { Document } from '../documents.interface'
import { environment } from '../../../../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class DocumentsApiService {
  private baseUrl = `${environment.api_url}/documents`;
  private http = inject(HttpClient);

  getDocuments(): Observable<ResponseItem<Document[]>> {
    return this.http.get<ResponseItem<Document[]>>(`${this.baseUrl}`);
  }

  saveDocument(documentName: string): Observable<ResponseItem<Pick<Document, 'createdAt' | 'owner' | 'title' | 'filename' | '_id'> & { uploadUrl: string }>> {
    return this.http.post<ResponseItem<Pick<Document, 'createdAt' | 'owner' | 'title' | 'filename' | '_id'> & { uploadUrl: string }>>(
      `${this.baseUrl}/save-document`,
      { documentName }
    );
  }

  getDownloadUrl(documentId: string): Observable<ResponseItem<{ downloadURL: string }>> {
    return this.http.get<ResponseItem<{ downloadURL: string }>>(
      `${this.baseUrl}/download-url/${documentId}`
    );
  }

  deleteDocument(documentId: string): Observable<ResponseItem<{ message: string }>> {
    return this.http.delete<ResponseItem<{ message: string }>>(
      `${this.baseUrl}/${documentId}`
    );
  }

  vectorizeDocument(documentId: string): Observable<ResponseItem<boolean>> {
    return this.http.post<ResponseItem<boolean>>(`${this.baseUrl}/vectorize/${documentId}`, { documentId });
  }

  uploadFiletos3(presignedUrl: string, file: File): Observable<HttpEvent<null>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/pdf'
    });

    return this.http.put<null>(presignedUrl, file, {
      headers,
      reportProgress: true,
      observe: 'events'
    });
  }

}
