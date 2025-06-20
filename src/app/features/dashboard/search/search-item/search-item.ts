import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatChip, MatChipListbox } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { ResultItem } from '../services/search.interface';
import { MatButton } from '@angular/material/button';
import { SlicePipe } from '@angular/common';


@Component({
  selector: 'app-search-item',
  imports: [MatCard, MatCardHeader,  MatButton, MatCardContent, MatChip, MatIcon, MatCardActions,SlicePipe],
  templateUrl: './search-item.html',
  styleUrl: './search-item.css'
})
export class SearchItem {
  $data = input.required<ResultItem>();
  @Output() viewDocument = new EventEmitter<string>()
}
