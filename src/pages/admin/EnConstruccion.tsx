interface EnConstruccionProps {
  nombre: string;
}

export default function EnConstruccion({ nombre }: EnConstruccionProps) {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{nombre}</h1>
      <p style={{ color: "#a09cb5" }}>Sección en construcción.</p>
    </div>
  );
}