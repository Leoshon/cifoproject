export interface Events {
  id?: string;
  categoria: string;
  descripcion: string;
  precio?: number;
  pais: string;
  image: string;
  comments?: Comments[];
}
export interface Comments {
  id?: string;
  user: string;
  comment: string;
  date: Date;
}
