"use client";

import { useEffect, useState } from "react";

const API_URL =
"https://portal-calidad-api.ayelenvillega42.workers.dev";

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin123";

export default function Home() {
const [usuario, setUsuario] = useState("");
const [password, setPassword] = useState("");
const [sesion, setSesion] = useState(null);
const [error, setError] = useState("");
const [asesores, setAsesores] = useState([]);
const [reportes, setReportes] = useState([]);
const [cargando, setCargando] = useState(true);

useEffect(() => {
cargarAsesores();
}, []);

async function cargarAsesores() {
try {
const response = await fetch(`${API_URL}/asesores`);
if (!response.ok) throw new Error("Error");

```
  const data = await response.json();
  setAsesores(data);
} catch (e) {
  console.error(e);
} finally {
  setCargando(false);
}
```

}

async function cargarReportes(asesorId) {
try {
const response = await fetch(
`${API_URL}/reportes?asesor_id=${asesorId}`
);

```
  if (!response.ok) throw new Error("Error");

  const data = await response.json();
  setReportes(data);
} catch (e) {
  console.error(e);
  setReportes([]);
}
```

}

function iniciarSesion(e) {
e.preventDefault();
setError("");

```
const user = usuario.toLowerCase().trim();

if (user === ADMIN_USER && password === ADMIN_PASSWORD) {
  setSesion({
    rol: "admin",
    nombre: "Administradora"
  });
  return;
}

const asesor = asesores.find(
  (a) => a.usuario_login.toLowerCase() === user
);

if (!asesor || password !== "123456") {
  setError("Usuario o contraseña incorrectos.");
  return;
}

setSesion({
  rol: "asesor",
  nombre: asesor.nombre,
  usuario: asesor.usuario_login,
  numero_usuario: asesor.numero_usuario,
  id: asesor.id
});

cargarReportes(asesor.id);
```

}

function cerrarSesion() {
setSesion(null);
setUsuario("");
setPassword("");
setError("");
setReportes([]);
}

if (!sesion) {
return ( <main style={styles.loginPage}> <div style={styles.loginCard}> <div style={styles.logo}>Q</div>

```
      <h1>Portal de Calidad</h1>

      <p style={styles.subtitle}>
        Seguimiento y evolución de calidad
      </p>

      <form onSubmit={iniciarSesion}>
        <label style={styles.label}>Usuario</label>

        <input
          style={styles.input}
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Ingresá tu usuario"
        />

        <label style={styles.label}>Contraseña</label>

        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresá tu contraseña"
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={styles.button}
          disabled={cargando}
        >
          {cargando ? "CARGANDO..." : "INGRESAR"}
        </button>
      </form>

      <p style={styles.help}>
        ¿Necesitás ayuda? Contactá al equipo de Calidad.
      </p>
    </div>
  </main>
);
```

}

if (sesion.rol === "admin") {
return ( <main style={styles.page}> <header style={styles.header}> <div>
<h1 style={{ margin: 0 }}>
Portal de Calidad </h1> <p style={styles.muted}>
Panel de Administración </p> </div>

```
      <button
        style={styles.logout}
        onClick={cerrarSesion}
      >
        Cerrar sesión
      </button>
    </header>

    <section style={styles.content}>
      <h2>Bienvenida, Administradora</h2>

      <p style={styles.muted}>
        Desde acá vamos a administrar los informes
        semanales del equipo.
      </p>

      <div style={styles.cards}>
        <Metric
          title="Asesores"
          value={asesores.length}
        />

        <Metric
          title="Reportes"
          value="—"
        />

        <Metric
          title="Auditorías"
          value="—"
        />
      </div>

      <div style={styles.panel}>
        <h2>Próximo paso</h2>

        <p style={styles.muted}>
          En la siguiente etapa vamos a incorporar
          el cargador del informe semanal para que
          puedas subir todos los datos de una sola vez.
        </p>

        <div style={styles.future}>
          <strong>El informe incluirá:</strong>

          <ul>
            <li>Calidad</li>
            <li>Productividad</li>
            <li>Tipificaciones</li>
            <li>Gestión de calidad</li>
            <li>Auditorías de No Venta</li>
            <li>Comentarios y devoluciones</li>
            <li>Impresión del informe</li>
          </ul>
        </div>
      </div>

      <div style={styles.panel}>
        <h2>Asesores registrados</h2>

        <div style={styles.grid}>
          {asesores.map((asesor) => (
            <div
              key={asesor.id}
              style={styles.advisor}
            >
              <div style={styles.avatar}>
                {asesor.nombre.charAt(0)}
              </div>

              <div>
                <strong>{asesor.nombre}</strong>

                <p style={styles.small}>
                  Usuario: {asesor.usuario_login}
                </p>

                <p style={styles.small}>
                  N° {asesor.numero_usuario}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);
```

}

const nombre =
sesion.nombre.split(", ")[1] ||
sesion.nombre;

const ultimo =
reportes.length > 0 ? reportes[0] : null;

return ( <main style={styles.page}> <header style={styles.header}> <div>
<h1 style={{ margin: 0 }}>
Portal de Calidad </h1>

```
      <p style={styles.muted}>
        Mi espacio personal de seguimiento
      </p>
    </div>

    <button
      style={styles.logout}
      onClick={cerrarSesion}
    >
      Cerrar sesión
    </button>
  </header>

  <section style={styles.content}>
    <h2>Hola, {nombre}</h2>

    <p style={styles.muted}>
      Este es tu espacio personal de seguimiento
      de calidad.
    </p>

    <div style={styles.info}>
      <div>
        <small>N° DE USUARIO</small>
        <strong>{sesion.numero_usuario}</strong>
      </div>

      <div>
        <small>USUARIO</small>
        <strong>{sesion.usuario}</strong>
      </div>

      <div>
        <small>ÚLTIMO REPORTE</small>
        <strong>
          {ultimo?.semana || "Sin reporte"}
        </strong>
      </div>
    </div>

    <div style={styles.cards}>
      <Metric
        title="Mi nota"
        value={ultimo?.nota ?? "—"}
      />

      <Metric
        title="Evolución"
        value={ultimo?.evolucion ?? "—"}
      />

      <Metric
        title="Semana"
        value={ultimo?.semana ?? "—"}
      />
    </div>

    {ultimo && (
      <>
        <Section
          title="PLAN DE ACCIÓN"
          heading="Objetivos"
        >
          <div style={styles.highlight}>
            🎯 {ultimo.objetivos ||
              "Sin objetivos cargados"}
          </div>
        </Section>

        <div style={styles.two}>
          <Section
            title="ATENCIÓN"
            heading="¿Qué tengo que trabajar?"
          >
            <div style={styles.highlight}>
              ⚠️ {ultimo.desvio_principal ||
                "Sin desvíos cargados"}
            </div>
          </Section>

          <Section
            title="RECOMENDACIÓN"
            heading="¿Cómo mejorarlo?"
          >
            <div style={styles.highlight}>
              ✓ {ultimo.recomendaciones ||
                "Sin recomendaciones cargadas"}
            </div>
          </Section>
        </div>

        <Section
          title="CALIDAD"
          heading="Última auditoría"
        >
          <div style={styles.audit}>
            <div>
              <small>Auditoría</small>
              <p>
                {ultimo.auditoria || "—"}
              </p>
            </div>

            <div>
              <small>Producto</small>
              <p>
                {ultimo.producto || "—"}
              </p>
            </div>

            <div>
              <small>Observaciones</small>
              <p>
                {ultimo.observaciones || "—"}
              </p>
            </div>
          </div>
        </Section>
      </>
    )}

    <Section
      title="SEGUIMIENTO"
      heading="Historial de reportes"
    >
      {reportes.length === 0 ? (
        <p style={styles.muted}>
          Todavía no hay reportes cargados.
        </p>
      ) : (
        <div>
          {reportes.map((r) => (
            <div
              key={r.id}
              style={styles.history}
            >
              <strong>{r.semana}</strong>

              <span>
                Nota: <b>{r.nota ?? "—"}</b>
              </span>

              <span>
                {r.desvio_principal || "Sin desvío"}
              </span>

              <span>
                {r.producto || "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </Section>

    <div style={styles.printArea}>
      <button
        style={styles.printButton}
        onClick={() => window.print()}
      >
        🖨️ IMPRIMIR INFORME
      </button>
    </div>
  </section>
</main>
```

);
}

function Metric({ title, value }) {
return ( <div style={styles.metric}> <small>{title}</small> <strong>{value}</strong> </div>
);
}

function Section({ title, heading, children }) {
return ( <div style={styles.panel}> <div style={styles.badge}>{title}</div> <h2>{heading}</h2>
{children} </div>
);
}

const styles = {
loginPage: {
minHeight: "100vh",
background:
"linear-gradient(135deg,#eef4f1,#dce8e2)",
display: "flex",
justifyContent: "center",
alignItems: "center",
padding: 20,
fontFamily: "Arial"
},

loginCard: {
width: "100%",
maxWidth: 420,
background: "#fff",
borderRadius: 24,
padding: 40,
boxShadow: "0 20px 60px rgba(0,0,0,.1)"
},

logo: {
width: 65,
height: 65,
borderRadius: "50%",
background: "#657f70",
color: "#fff",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 28,
fontWeight: "bold",
margin: "0 auto 20px"
},

subtitle: {
color: "#7b8982",
textAlign: "center",
marginBottom: 30
},

label: {
display: "block",
marginTop: 18,
marginBottom: 8,
fontWeight: "bold",
color: "#40534a"
},

input: {
width: "100%",
boxSizing: "border-box",
padding: 14,
border: "1px solid #d5ddd8",
borderRadius: 10,
fontSize: 15
},

button: {
width: "100%",
marginTop: 25,
padding: 15,
border: 0,
borderRadius: 10,
background: "#657f70",
color: "#fff",
fontWeight: "bold",
cursor: "pointer"
},

error: {
color: "#b44b4b",
fontSize: 14
},

help: {
textAlign: "center",
color: "#89948f",
fontSize: 13,
marginTop: 25
},

page: {
minHeight: "100vh",
background: "#f4f7f5",
fontFamily: "Arial"
},

header: {
background: "#fff",
padding: "22px 6%",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
boxShadow: "0 2px 10px rgba(0,0,0,.05)"
},

logout: {
border: "1px solid #657f70",
background: "#fff",
color: "#657f70",
padding: "10px 18px",
borderRadius: 8,
cursor: "pointer"
},

content: {
maxWidth: 1200,
margin: "0 auto",
padding: "40px 25px"
},

muted: {
color: "#7b8982"
},

info: {
background: "#e9f0ec",
borderRadius: 14,
padding: 20,
display: "flex",
gap: 50,
flexWrap: "wrap",
marginTop: 25
},

infoItem: {},

cards: {
display: "grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(220px,1fr))",
gap: 20,
margin: "25px 0"
},

metric: {
background: "#fff",
borderRadius: 16,
padding: 25,
boxShadow: "0 5px 20px rgba(0,0,0,.05)"
},

metricStrong: {},

panel: {
background: "#fff",
borderRadius: 18,
padding: 28,
marginTop: 25,
boxShadow: "0 5px 20px rgba(0,0,0,.05)"
},

badge: {
color: "#657f70",
fontSize: 11,
fontWeight: "bold",
letterSpacing: 1
},

highlight: {
background: "#f2f6f3",
borderRadius: 14,
padding: 20,
color: "#40534a",
fontWeight: "bold"
},

two: {
display: "grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(300px,1fr))",
gap: 20
},

audit: {
display: "grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(220px,1fr))",
gap: 20,
background: "#f7f9f8",
borderRadius: 14,
padding: 20
},

history: {
display: "grid",
gridTemplateColumns:
"1fr 120px 1fr 70px",
gap: 15,
padding: 15,
border: "1px solid #edf0ee",
borderRadius: 12,
marginBottom: 10
},

grid: {
display: "grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(260px,1fr))",
gap: 12
},

advisor: {
display: "flex",
alignItems: "center",
gap: 12,
padding: 14,
border: "1px solid #edf0ee",
borderRadius: 12
},

avatar: {
width: 42,
height: 42,
borderRadius: "50%",
background: "#dce8e2",
display: "flex",
alignItems: "center",
justifyContent: "center",
fontWeight: "bold",
color: "#40534a"
},

small: {
margin: "4px 0 0",
color: "#929c97",
fontSize: 12
},

future: {
background: "#f2f6f3",
padding: 20,
borderRadius: 14
},

printArea: {
display: "flex",
justifyContent: "center",
marginTop: 30,
paddingBottom: 50
},

printButton: {
background: "#30463b",
color: "#fff",
border: 0,
borderRadius: 10,
padding: "14px 25px",
fontWeight: "bold",
cursor: "pointer"
}
};
