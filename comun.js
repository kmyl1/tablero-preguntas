// Código compartido por la página del público (index.html)
// y la del proyector (tablero.html).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ¿Ya se pegó la configuración real en firebase-config.js?
export function configuracionLista() {
  const k = String(firebaseConfig.apiKey || "");
  return k.length > 20 && !k.includes("PEGA_AQUI");
}

// Inicia sesión de forma ANÓNIMA (sin correo ni contraseña).
// Firebase le da a cada navegador un identificador único (uid)
// que se conserva aunque se recargue la página.
export function entrar() {
  return new Promise((resolver, rechazar) => {
    const dejar = onAuthStateChanged(auth, async (usuario) => {
      if (usuario) { dejar(); resolver(usuario); return; }
      try { await signInAnonymously(auth); }
      catch (e) { dejar(); rechazar(e); }
    });
  });
}

// Traduce los errores más comunes a mensajes claros.
export function mensajeDeError(e) {
  const codigo = e && e.code ? e.code : "";
  if (codigo === "permission-denied") return "Permiso denegado por las reglas de seguridad de Firestore.";
  if (codigo === "unavailable") return "Sin conexión con la base de datos. Revisa tu internet.";
  if (codigo === "auth/admin-restricted-operation" || codigo === "auth/operation-not-allowed") {
    return "El inicio de sesión anónimo no está activado. Actívalo en Firebase > Authentication > Método de acceso > Anónimo.";
  }
  if (codigo === "auth/unauthorized-domain") {
    return "Este sitio no está autorizado. Agrega tu dominio en Firebase > Authentication > Configuración > Dominios autorizados.";
  }
  if (codigo === "auth/api-key-not-valid" || codigo === "auth/invalid-api-key" || /api-key-not-valid/.test(codigo)) {
    return "La apiKey de firebase-config.js no es válida. Vuelve a copiarla desde la consola de Firebase.";
  }
  if (codigo === "failed-precondition") {
    return "Esta consulta necesita un índice. " + ((e && e.message) || "");
  }
  return (e && e.message) ? e.message : String(e);
}

export function formatearHora(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") return "ahora";
  return timestamp.toDate().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

// Ordena: más votos primero; si empatan, la más antigua primero.
export function ordenarPreguntas(lista) {
  const ms = (p) => (p.fecha && p.fecha.toMillis) ? p.fecha.toMillis() : Number.MAX_SAFE_INTEGER;
  return lista.slice().sort((a, b) => (b.votos - a.votos) || (ms(a) - ms(b)));
}

// Convierte un documento de Firestore en texto JSON legible.
export function aJson(datos) {
  const visible = {};
  for (const [k, v] of Object.entries(datos)) {
    visible[k] = (v && typeof v.toDate === "function") ? v.toDate().toISOString() : v;
  }
  return JSON.stringify(visible, null, 2);
}

// Muestra un aviso grande si falta la configuración.
export function avisoSinConfiguracion(contenedor) {
  contenedor.innerHTML = "";
  const div = document.createElement("div");
  div.className = "aviso";
  div.innerHTML = "<b>Falta la configuración de Firebase.</b><br>Abre <code>firebase-config.js</code>, pega las 6 líneas de tu proyecto (de <code>apiKey</code> a <code>appId</code>) y vuelve a subir el archivo a GitHub.";
  contenedor.append(div);
}
