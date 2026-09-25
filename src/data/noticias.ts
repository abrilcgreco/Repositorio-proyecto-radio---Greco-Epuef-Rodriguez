export interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  textoCompleto: string;
  imagen?: string;
  instagramUrl?: string;
}

export const noticias: Noticia[] = [
  {
    id: 1,
    titulo: "Estudiantina",
    resumen: "Les dejamos 📸 de lo que fueron estas primeras jornada de la estudiantina 2026.",
    textoCompleto: `El martes comenzamos con la decoración de las aulas, donde cada curso puso su creatividad y sus colores para preparar la escuela para esta semana. Además, los estudiantes de 7° y los preceptores organizaron distintas modalidades de juegos para que todos pudieran participar y disfrutar de la jornada.

El miércoles llegó el momento del desfile "Me equivoqué de lugar", donde participaron todos aquellos estudiantes y docentes que se animaron a disfrazarse y sorprender con sus ideas y ocurrencias.`,
    imagen: "/Noticias/imagen1.jpeg",
    instagramUrl: "https://www.instagram.com/p/DdqwmPkEcjG/",
  },
  {
    id: 2,
    titulo: "Salida",
    resumen: "Salida a la laguna Cacique Chiquichano",
    textoCompleto: `El día jueves 17 de septiembre los estudiantes de 1°1° y 1°4° realizaron una salida a la laguna Cacique Chiquichano. Donde pudieron compartir y realizar actividades desde educación física, en el marco de la educación ambiental integral y la conservación del medio ambiente. Todo un lujo!!!

Gracias a los estudiante por asistir y a los profesores que acompañaron`,
    imagen: "/Noticias/imagen2.jpeg",
    instagramUrl: "https://www.instagram.com/p/DdpmCoRiZQu/",
  },
  {
    id: 3,
    titulo: "Día del Maestro",
    resumen: "📚 Celebrando a quienes dejan huella",
    textoCompleto: `En el marco del Día del Maestro, nuestra ESETP N.º 724 realizó un acto especial para reconocer y celebrar a nuestros docentes, destacando esas cualidades y gestos que hacen la diferencia en la vida cotidiana de la escuela.

Durante la jornada se llevó adelante la entrega de premios impresos en 3D, realizados especialmente para la ocasión, en diferentes ternas. Los reconocimientos fueron definidos a través de la votación de los distintos cursos, haciendo que cada premio tuviera un valor aún más especial: fueron los propios estudiantes quienes eligieron a sus docentes.

👏 Queremos agradecer especialmente al equipo de Preceptores y de POT, que estuvo a cargo de la organización y realización de este acto.

¡Feliz Día del Maestro! ❤️`,
    imagen: "/Noticias/imagen3.jpeg",
    instagramUrl: "https://www.instagram.com/p/DdJUowNEVoR/",
  },
  {
    id: 4,
    titulo: "Feria Provincial",
    resumen: "🔬✨ Orgullo 724 en la Feria Provincial de Educación, Ciencia, Arte y Tecnología",
    textoCompleto: `Nuestra ESETP N.º 724 "Dr. Arturo Umberto Illia" dijo presente en la Instancia Provincial de la Feria de Educación, Ciencia, Arte y Tecnología, compartiendo el trabajo, la creatividad y el compromiso de nuestros estudiantes y docentes.

En esta oportunidad, nuestra institución estuvo representada por dos proyectos:

🌱⚡ ENERGICARRERAS, una propuesta que integra todos los talleres de los tres años del Ciclo Básico Técnico, articulando saberes y experiencias con una mirada puesta en nuestra orientación en Energías Renovables. El proyecto está a cargo de las docentes Natacha Gader y Joana Pérez.

♻️👗 REPILCHE, proyecto desarrollado por estudiantes de 7.º año, que propone una mirada innovadora sobre la moda circular y el aprovechamiento de materiales, transformando ideas en soluciones desde la tecnología, la creatividad y la sustentabilidad.

Esta participación nos permitió mostrar el enorme trabajo que se realiza en nuestra institución, donde la ciencia, el arte y la tecnología se encuentran con la educación técnica para generar nuevos aprendizajes y proyectos.

👏 Queremos felicitar especialmente a las estudiantes Chorolque y Fiore, quienes, junto al trabajo y acompañamiento de sus docentes, lograron que ENERGICARRERAS obtuviera el pase a la próxima instancia: la Feria Nacional de Educación en Ciencias, Tecnología, Artes y Matemática. 🇦🇷

¡Felicitaciones a todos los estudiantes, docentes y familias que forman parte de estos proyectos y hacen posible que el Orgullo 724 siga creciendo y llegando cada vez más lejos! 🚀`,
    imagen: "/Noticias/imagen4.jpeg",
    instagramUrl: "https://www.instagram.com/p/DcmjvB5iewA/",
  },
];