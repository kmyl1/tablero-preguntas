# Tablero de preguntas en vivo

Práctica de bases de datos **NoSQL orientadas a documentos** con **Cloud Firestore** y **GitHub Pages**.

- `index.html` · página del público: publicar preguntas y votar (se abre desde el QR).
- `tablero.html` · página para proyectar: QR, preguntas en vivo ordenadas por votos y moderación.
- `firebase-config.js` · **el único archivo que se edita**: configuración del proyecto de Firebase.
- `comun.js` · conexión a Firebase e inicio de sesión anónimo.
- `estilos.css` · diseño.
- `firestore.rules` · reglas de seguridad (se pegan en la consola de Firebase, no se ejecutan desde GitHub).

## Estructura de datos

```
preguntas / {id automático}
{
  "texto": "¿Qué diferencia hay entre SQL y NoSQL?",
  "autor": "Ana",
  "uid": "Xy12…",                 // quién la publicó
  "votos": 3,
  "votantes": ["Xy12…", "Ab34…", "Cd56…"],
  "respondida": false,
  "fecha": "2026-10-06T15:20:11Z"
}

moderadores / {uid}               // se crean a mano en la consola
{ "nombre": "Equipo 3" }
```

Las instrucciones completas están en la guía de la práctica.
