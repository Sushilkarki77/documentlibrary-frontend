import { Component, computed, effect, inject, signal } from '@angular/core';
import { DocumentList } from '../document-list/document-list';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Document } from "../../documents.interface"
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddDocumentOverlay } from '../add-document-overlay/add-document-overlay';
import { DocumentsApiService } from '../../services/documents-api-service';
import { switchMap } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { toastService } from '../../../../../core/toast-service';
import { DocViewer } from "../../../../../common/components/doc-viewer/doc-viewer";
import { MatFormField } from '@angular/material/form-field';
import { MatProgressBar } from '@angular/material/progress-bar';


type SortOrder = 'ascending' | 'descending' | 'default';

interface SortState {
  dateSort: SortOrder;
}


function getPagedDocuments<T>(docs: T[], pageIndex: number, pageSize: number): (T & { position: number })[] {
  const start = pageIndex * pageSize;
  return docs.slice(start, start + pageSize).map((item, i) => ({
    ...item,
    position: i + 1 + pageIndex * pageSize
  }));
}

const sortDocuments = <T extends Record<string, any>>(docs: T[], sortState: SortState): T[] => {
  const sorted = [...docs];



  if (sortState.dateSort !== 'default') {
    sorted.sort((a, b) => {
      const aDate = new Date(a['createdAt']).getTime();
      const bDate = new Date(b['createdAt']).getTime();
      return sortState.dateSort === 'ascending' ? aDate - bDate : bDate - aDate;
    });
  }

  return sorted;
};


@Component({
  selector: 'app-documents',
  imports: [DocumentList, MatCardModule, MatIcon, MatButton, MatPaginatorModule, MatProgressBar],
  templateUrl: './documents.html',
  styleUrl: './documents.css'
})
export class Documents {
  pageSize = 10;
  columnNames = ['position', 'title', 'AddedDate', 'actions'];

  $documents = signal<Document[]>([]);
  $pageIndex = signal<number>(0);
  $searchQuery = signal('');
  $componentState = signal<'initial' | 'loading' | 'completed' | 'error'>('initial')

  $sortState = signal<{ dateSort: SortOrder, titleSort: SortOrder }>({ dateSort: 'descending', titleSort: 'default' });

  $filteredDocs = computed(() => {
    const query = this.$searchQuery().toLowerCase();
    return this.$documents().filter(doc =>
      doc.title.toLowerCase().includes(query)
    );
  });

  $paginatedDocs = computed(() => {
    const sorted = sortDocuments(this.$filteredDocs(), this.$sortState());
    return getPagedDocuments(sorted, this.$pageIndex(), this.pageSize);
  });

  $totalNumberOfDoc = computed(() => this.$filteredDocs().length);


  documentAPIService = inject(DocumentsApiService);
  toastService = inject(toastService);
  readonly dialog = inject(MatDialog);


  constructor() {
    effect(() => {
      this.$componentState.set('loading')
      this.documentAPIService.getDocuments().subscribe(res => {
        this.$documents.set(res.data);
        this.$componentState.set('completed');
      }, err => {
        this.$componentState.set('error')
      })
    });
  }


  openAddDialog = () => {
    const dialogRef = this.dialog.open(AddDocumentOverlay, {
      data: { title: "Add Document" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.handleUpload(result);
    });
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


  handleUpload = (file: File): void => {
    let documentId: string;

    this.documentAPIService.saveDocument(file.name).pipe(
      switchMap(res => {
        const { createdAt, owner, title, _id, filename, uploadUrl } = res.data;

        this.$documents.update(doc => [
          { createdAt, owner, title, _id, filename },
          ...doc
        ]);

        documentId = _id;

        return this.documentAPIService.uploadFiletos3(uploadUrl, file);
      })
    ).subscribe({
      next: (event: HttpEvent<null>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = Math.round((event.loaded / (event.total || 1)) * 100);
        }

        if (event.type === HttpEventType.Response) {
          this.toastService.show("Upload successful!");

          this.documentAPIService.vectorizeDocument(documentId).subscribe({
            error: () => this.toastService.show("Vectorization failed!")
          });
        }
      },
      error: () => {
        this.toastService.show("Upload Failed!");
      }
    });
  };



  deleteDocument = (_id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    this.documentAPIService.deleteDocument(_id).subscribe({
      next: () => {
        this.$documents.update(doc => doc.filter(x => x._id !== _id));
        this.toastService.show("Delete successful!");
      },
      error: err => {
        this.toastService.show(err.message);
      }
    });
  }


  handlePageEvent = (e: PageEvent) => this.$pageIndex.set(e.pageIndex);

  viewDocument = (_id: string) => {
    this.documentAPIService.getDownloadUrl(_id).subscribe(res => {
      this.openDialogDocViewer(res.data.downloadURL);
    })
  }


  handleDateSort = () => {

    const current = this.$sortState();
    const nextSort = (current.dateSort === 'default' || current.dateSort === 'descending')
      ? 'ascending'
      : 'descending';

    this.$sortState.set({
      ...current,
      dateSort: nextSort
    });
  }

}
