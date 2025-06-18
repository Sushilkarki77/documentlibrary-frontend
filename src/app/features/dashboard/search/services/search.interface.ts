export interface SearchResponse {
  resultItems: ResultItem[]
  answer?: string,
  totalCount: number;
}

export interface ResultItem {
  title: string
  originalDocument: OriginalDocument
  owner: Owner
  text: string
  tags: string[]
  previewText: string
  score: number
}

export interface OriginalDocument {
  _id: string
  filename: string
  title: string
}

export interface Owner {
  email: string
  fullname: string
}
