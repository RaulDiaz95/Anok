
import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Sitio del Cliente</h1>
      <p className="text-gray-600">React + Vite + Tailwind desplegado en Cloudflare Pages.</p>
      <div className="space-x-3">
        <Link to="/contact" className="btn">Contacto</Link>
        <a href="/health-check" className="btn" rel="noreferrer">Health (proxy)</a>
      </div>
    </div>
  );
}
