import { Component, EventEmitter, input, model, output, Output, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Document } from "../../documents.interface"
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-document-list',
  imports: [MatTableModule, MatIcon, MatIconButton, DatePipe],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css'
})
export class DocumentList {
  displayedColumns = input.required<string[]>();
  dataSource = input.required<Array<Document & { position: number }>>();


  dateSort = input<'descending' | 'ascending' | 'default'>('ascending')

  @Output() viewEmit = new EventEmitter<string>();

  @Output() deleteEmit = new EventEmitter<string>();

  @Output() dateSortEmit = new EventEmitter<void>();

  
}