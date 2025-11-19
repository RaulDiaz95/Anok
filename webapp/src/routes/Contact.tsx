
import { useState } from "react";

export default function Contact(){
  const [state, setState] = useState<{status:string, message:string}|null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = {
      email: data.get("email"),
      message: data.get("message"),
    };
    try {
      // For now, just call the API health as a demo; replace with /contact when ready
      const res = await fetch(import.meta.env.VITE_API_URL + "/actuator/health");
      const js = await res.json();
      setState({status: "ok", message: JSON.stringify(js)});
    } catch (err:any){
      setState({status: "error", message: err?.message || "Unknown error"});
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Contacto</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="email" type="email" required placeholder="Tu email" className="input" />
        <textarea name="message" required placeholder="Mensaje" className="textarea" />
        <button type="submit" className="btn">Enviar</button>
      </form>
      {state && (
        <div className={state.status === "ok" ? "text-green-600" : "text-red-600"}>
          {state.message}
        </div>
      )}
    </div>
  );
}
