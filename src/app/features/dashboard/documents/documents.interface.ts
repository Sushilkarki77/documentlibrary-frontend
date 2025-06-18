export interface DocumentOwner {
  _id: string;
  email: string;
  fullname: string;
}

export interface Document {
  _id: string;
  filename: string;
  title: string;
  owner: DocumentOwner;
  createdAt: string,
  updatedAt?: string
}
