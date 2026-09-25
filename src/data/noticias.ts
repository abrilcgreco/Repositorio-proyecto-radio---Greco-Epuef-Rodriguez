export interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  imagen?: string;
}

export const noticias: Noticia[] = [
  { id: 1, titulo: "Título de la noticia", resumen: "..." },
  { id: 2, titulo: "Título de la noticia", resumen: "..." },
  { id: 3, titulo: "Título de la noticia", resumen: "..." },
  { id: 4, titulo: "Título de la noticia", resumen: "..." },
];