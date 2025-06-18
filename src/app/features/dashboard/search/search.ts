import { CommonModule } from '@angular/common';
import { Component, effect, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from './services/search.service';
import { filter, switchMap } from 'rxjs';
import { ResultItem, SearchResponse } from './services/search.interface';
import { SearchItem } from './search-item/search-item';
import { SafeHTML } from '../../../common/components/safe-html/safe-html';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DocumentsApiService } from '../documents/services/documents-api-service';
import { MatDialog } from '@angular/material/dialog';
import { DocViewer } from '../../../common/components/doc-viewer/doc-viewer';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search',
  imports: [FormsModule, MatIconButton, MatIcon, CommonModule, SearchItem, SafeHTML, MatProgressBarModule, MatPaginator],
  templateUrl: './search.html',
  styleUrl: './search.css' 
})
export class Search {
  pageSize = 10;

  searchQuery = signal<string>('');
  $searchResponse = signal<SearchResponse | null>(null);
  $searchState = signal<'before-start' | 'started' | 'completed' | 'failed'>('before-start');
  $pageIndex = signal<number>(0);

  route = inject(ActivatedRoute);
  router = inject(Router);
  searchService = inject(SearchService);
  documentAPIService = inject(DocumentsApiService);
  readonly dialog = inject(MatDialog);


  onSearch = () => {
    this.$pageIndex.set(0);
    this.updateQueryParam(this.searchQuery(), this.$pageIndex());
  };

  updateQueryParam(query: string, pageIndex: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { query, pageIndex },
      queryParamsHandling: 'merge'
    });
  }

  constructor() {
    this.subscribeTOQueryParamChange();
  }

  subscribeTOQueryParamChange = () => {
    this.route.queryParams.pipe(
      filter(params => !!params['query']),
      switchMap(params => {
        this.searchQuery.set(params['query']);
        this.$searchState.set('started');
        const pageIndex = Number(params['pageIndex'] ?? 0);
        return this.searchService.searchExecute(params['query'], (pageIndex * this.pageSize), this.pageSize);
      })
    ).subscribe(res => {
      this.$searchState.set('completed');
      this.$searchResponse.set(res.data);
    }, err => {
      this.$searchState.set('failed');
    })
  }


  viewDocument = (_id: string) => {
    this.documentAPIService.getDownloadUrl(_id).subscribe(res => {
      this.openDialogDocViewer(res.data.downloadURL);
    })
  }

  openDialogDocViewer = (url: string) => {
    this.dialog.open(DocViewer, {
      data: url,
      height: '100vh',
      width: '100vw',
      minWidth: '100vw',
      panelClass: 'doc-viewer-wrapper'
    });
  }

  handlePageEvent = (e: PageEvent) => {
   
    this.$pageIndex.set(e.pageIndex);
    this.updateQueryParam(this.searchQuery(), e.pageIndex);
  }

}
