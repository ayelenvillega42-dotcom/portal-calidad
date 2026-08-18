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

      if (!response.ok) {
        throw new Error("No se pudieron cargar los asesores");
      }

      const data = await response.json();
      setAsesores(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  }

  async function cargarReportes(asesorId) {
    try {
      const response = await fetch(
        `${API_URL}/reportes?asesor_id=${asesorId}`
      );

      if (!response.ok) {
        throw new Error("No se pudieron cargar los reportes");
      }

      const data = await response.json();
      setReportes(data);
    } catch (error) {
      console.error(error);
      setReportes([]);
    }
  }

  function iniciarSesion(e) {
    e.preventDefault();
    setError("");

    const usuarioIngresado = usuario.toLowerCase().trim();

    if (
      usuarioIngresado === ADMIN_USER &&
      password === ADMIN_PASSWORD
    ) {
      setSesion({
        rol: "admin",
        nombre: "Administradora",
        usuario: ADMIN_USER
      });

      return;
    }

    const asesor = asesores.find(
      (item) =>
        item.usuario_login.toLowerCase() === usuarioIngresado
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
  }

  function cerrarSesion() {
    setSesion(null);
    setUsuario("");
    setPassword("");
    setError("");
    setReportes([]);
  }

  // =========================
  // LOGIN
  // =========================

  if (!sesion) {
    return (
      <main style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.logoCircle}>Q</div>

          <h1 style={styles.title}>
            Portal de Calidad
          </h1>

          <p style={styles.subtitle}>
            Seguimiento y evolución de calidad
          </p>

          <form onSubmit={iniciarSesion}>
            <label style={styles.label}>
              Usuario
            </label>

            <input
              style={styles.input}
              type="text"
              placeholder="Ingresá tu usuario"
              value={usuario}
              onChange={(e) =>
                setUsuario(e.target.value)
              }
            />

            <label style={styles.label}>
              Contraseña
            </label>

            <input
              style={styles.input}
              type="password"
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            {error && (
              <p style={styles.error}>
                {error}
              </p>
            )}

            <button
              style={styles.button}
              type="submit"
              disabled={cargando}
            >
              {cargando
                ? "CARGANDO..."
                : "INGRESAR"}
            </button>
          </form>

          <p style={styles.help}>
            ¿Necesitás ayuda? Contactá al equipo de Calidad.
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // ADMINISTRADOR
  // =========================

  if (sesion.rol === "admin") {
    return (
      <main style={styles.dashboard}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>
              Portal de Calidad
            </h1>

            <p style={styles.headerSubtitle}>
              Panel de Administración
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
          <h2 style={styles.sectionTitle}>
            Bienvenida, Administradora
          </h2>

          <p style={styles.welcome}>
            Desde acá vas a poder administrar los
            reportes de calidad del equipo.
          </p>

          <div style={styles.cards}>
            <div style={styles.card}>
              <span style={styles.cardNumber}>
                {asesores.length}
              </span>

              <span style={styles.cardText}>
                Asesores registrados
              </span>
            </div>

            <div style={styles.card}>
              <span style={styles.cardNumber}>
                —
              </span>

              <span style={styles.cardText}>
                Reportes cargados
              </span>
            </div>

            <div style={styles.card}>
              <span style={styles.cardNumber}>
                —
              </span>

              <span style={styles.cardText}>
                Auditorías
              </span>
            </div>
          </div>

          {/* CARGADOR SEMANAL */}

          <div style={styles.uploadPanel}>
            <div style={styles.uploadIcon}>
              +
            </div>

            <h2 style={styles.panelTitle}>
              Cargar reporte semanal
            </h2>

            <p style={styles.uploadDescription}>
              En esta sección vamos a poder cargar
              todos los reportes de la semana de una
              sola vez.
            </p>

            <label style={styles.label}>
              Semana del reporte
            </label>

            <input
              style={styles.input}
              type="text"
              placeholder="Ejemplo: Semana 4 - Agosto"
              id="semanaReporte"
            />

            <label style={styles.label}>
              Datos del reporte
            </label>

            <textarea
              style={styles.textarea}
              placeholder={`Pegá acá el contenido generado a partir del análisis semanal.

Ejemplo:

CARLA GOMEZ
Nota: 88
Evolución: +3 puntos
Desvío principal: Validación de datos
Objetivo: Mejorar validación de datos
Recomendación: Validar DNI y correo electrónico de forma completa.
Producto: AP`}
            />

            <button
              style={styles.primaryButton}
              onClick={() =>
                alert(
                  "La carga automática de reportes será activada en el próximo paso."
                )
              }
            >
              PREVISUALIZAR REPORTES
            </button>
          </div>

          {/* ASESORES */}

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>
              Asesores registrados
            </h2>

            {cargando ? (
              <p style={styles.emptyText}>
                Cargando asesores...
              </p>
            ) : (
              <div style={styles.advisorGrid}>
                {asesores.map((asesor) => (
                  <div
                    key={asesor.id}
                    style={styles.advisor}
                  >
                    <div style={styles.avatar}>
                      {asesor.nombre.charAt(0)}
                    </div>

                    <div>
                      <strong>
                        {asesor.nombre}
                      </strong>

                      <p style={styles.username}>
                        Usuario:{" "}
                        {asesor.usuario_login}
                      </p>

                      <p style={styles.userNumber}>
                        N° usuario:{" "}
                        {asesor.numero_usuario}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  // =========================
  // PANEL DEL ASESOR
  // =========================

  const nombreMostrar =
    sesion.nombre.split(", ")[1] ||
    sesion.nombre;

  const ultimoReporte =
    reportes.length > 0
      ? reportes[0]
      : null;

  return (
    <main style={styles.dashboard}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>
            Portal de Calidad
          </h1>

          <p style={styles.headerSubtitle}>
            Mi espacio de calidad
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
        <h2 style={styles.sectionTitle}>
          Hola, {nombreMostrar}
        </h2>

        <p style={styles.welcome}>
          Este es tu espacio personal de seguimiento
          de calidad.
        </p>

        <div style={styles.infoBar}>
          <div>
            <strong>N° de usuario</strong>
            <span>{sesion.numero_usuario}</span>
          </div>

          <div>
            <strong>Usuario</strong>
            <span>{sesion.usuario}</span>
          </div>

          {ultimoReporte && (
            <div>
              <strong>Último reporte</strong>
              <span>{ultimoReporte.semana}</span>
            </div>
          )}
        </div>

        <div style={styles.cards}>
          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>
              ★
            </span>

            <h3>Mi nota</h3>

            <strong style={styles.bigNumber}>
              {ultimoReporte?.nota ?? "—"}
            </strong>

            <p>
              {ultimoReporte
                ? "Resultado de calidad"
                : "Esperando reporte"}
            </p>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>
              ↗
            </span>

            <h3>Evolución</h3>

            <strong
              style={styles.evolutionText}
            >
              {ultimoReporte?.evolucion ?? "—"}
            </strong>

            <p>
              Comparación semanal
            </p>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>
              ✓
            </span>

            <h3>Semana</h3>

            <strong
              style={styles.weekText}
            >
              {ultimoReporte?.semana ?? "—"}
            </strong>

            <p>
              Último reporte cargado
            </p>
          </div>
        </div>

        {ultimoReporte && (
          <>
            <div style={styles.panel}>
              <div style={styles.sectionBadge}>
                PLAN DE ACCIÓN
              </div>

              <h2 style={styles.panelTitle}>
                Objetivos
              </h2>

              <div style={styles.objectiveBox}>
                <span style={styles.targetIcon}>
                  🎯
                </span>

                <strong>
                  {ultimoReporte.objetivos ||
                    "Sin objetivos cargados"}
                </strong>
              </div>
            </div>

            <div style={styles.twoColumns}>
              <div style={styles.panel}>
                <div style={styles.sectionBadge}>
                  ATENCIÓN
                </div>

                <h2 style={styles.panelTitle}>
                  ¿Qué tengo que trabajar?
                </h2>

                <div style={styles.focusBox}>
                  <div style={styles.emptyIcon}>
                    !
                  </div>

                  <strong>
                    {ultimoReporte.desvio_principal ||
                      "Sin desvíos cargados"}
                  </strong>

                  <p>
                    Este es el principal punto a
                    trabajar en el período.
                  </p>
                </div>
              </div>

              <div style={styles.panel}>
                <div style={styles.sectionBadge}>
                  RECOMENDACIÓN
                </div>

                <h2 style={styles.panelTitle}>
                  ¿Cómo mejorarlo?
                </h2>

                <div style={styles.focusBox}>
                  <div style={styles.emptyIcon}>
                    ✓
                  </div>

                  <p>
                    {ultimoReporte.recomendaciones ||
                      "Sin recomendaciones cargadas"}
                  </p>
                </div>
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.sectionBadge}>
                CALIDAD
              </div>

              <h2 style={styles.panelTitle}>
                Última auditoría
              </h2>

              <div style={styles.auditBox}>
                <div>
                  <strong>
                    ✓ Auditoría
                  </strong>

                  <p>
                    {ultimoReporte.auditoria ||
                      "Sin auditoría cargada"}
                  </p>
                </div>

                <div>
                  <strong>Producto</strong>

                  <p>
                    {ultimoReporte.producto ||
                      "—"}
                  </p>
                </div>

                <div>
                  <strong>Observaciones</strong>

                  <p>
                    {ultimoReporte.observaciones ||
                      "Sin observaciones"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* HISTORIAL */}

        <div style={styles.panel}>
          <div style={styles.sectionBadge}>
            SEGUIMIENTO
          </div>

          <h2 style={styles.panelTitle}>
            Historial de reportes
          </h2>

          {reportes.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                ✓
              </div>

              <p>
                Todavía no hay reportes cargados.
              </p>
            </div>
          ) : (
            <div style={styles.history}>
              {reportes.map((reporte) => (
                <div
                  key={reporte.id}
                  style={styles.historyItem}
                >
                  <div>
                    <strong>
                      {reporte.semana}
                    </strong>

                    <p>
                      {reporte.desvio_principal ||
                        "Sin desvío"}
                    </p>
                  </div>

                  <strong style={styles.historyScore}>
                    {reporte.nota ?? "—"}
                  </strong>

                  <span>
                    {reporte.producto || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// =========================
// ESTILOS
// =========================

const styles = {
  loginPage: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eef4f1 0%, #dce8e2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px"
  },

  loginCard: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "45px",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.10)"
  },

  logoCircle: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background: "#657f70",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 auto 20px"
  },

  title: {
    textAlign: "center",
    margin: "0",
    color: "#30463b",
    fontSize: "28px"
  },

  subtitle: {
    textAlign: "center",
    color: "#7b8982",
    marginBottom: "35px"
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#40534a",
    fontWeight: "bold"
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border:
      "1px solid #d5ddd8",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none"
  },

  textarea: {
    width: "100%",
    minHeight: "280px",
    boxSizing: "border-box",
    padding: "15px",
    border:
      "1px solid #d5ddd8",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.5"
  },

  button: {
    width: "100%",
    marginTop: "25px",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    background: "#657f70",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },

  primaryButton: {
    marginTop: "25px",
    padding: "15px 25px",
    border: "none",
    borderRadius: "10px",
    background: "#657f70",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },

  error: {
    color: "#b44b4b",
    fontSize: "14px",
    marginTop: "12px"
  },

  help: {
    textAlign: "center",
    color: "#89948f",
    fontSize: "13px",
    marginTop: "25px"
  },

  dashboard: {
    minHeight: "100vh",
    background: "#f4f7f5",
    fontFamily: "Arial, sans-serif"
  },

  header: {
    background: "#ffffff",
    padding: "22px 6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)"
  },

  headerTitle: {
    margin: 0,
    color: "#30463b"
  },

  headerSubtitle: {
    margin: "5px 0 0",
    color: "#89948f"
  },

  logout: {
    border:
      "1px solid #657f70",
    background: "white",
    color: "#657f70",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "45px 25px"
  },

  sectionTitle: {
    color: "#30463b",
    marginBottom: "8px"
  },

  welcome: {
    color: "#7b8982"
  },

  infoBar: {
    background: "#e9f0ec",
    borderRadius: "14px",
    padding: "16px 20px",
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    marginTop: "25px"
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    margin: "30px 0"
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)"
  },

  metricCard: {
    background: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)"
  },

  cardNumber: {
    display: "block",
    fontSize: "34px",
    fontWeight: "bold",
    color: "#657f70"
  },

  cardText: {
    color: "#7b8982"
  },

  metricIcon: {
    fontSize: "24px",
    color: "#657f70"
  },

  bigNumber: {
    display: "block",
    fontSize: "42px",
    color: "#657f70",
    marginTop: "10px"
  },

  evolutionText: {
    display: "block",
    color: "#657f70",
    marginTop: "10px",
    fontSize: "18px",
    lineHeight: "1.4"
  },

  weekText: {
    display: "block",
    color: "#657f70",
    marginTop: "10px",
    fontSize: "18px"
  },

  panel: {
    background: "white",
    borderRadius: "18px",
    padding: "28px",
    marginTop: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)"
  },

  uploadPanel: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #edf4f0 100%)",
    borderRadius: "18px",
    padding: "32px",
    marginTop: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)",
    border:
      "1px solid #dce8e2"
  },

  uploadIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#657f70",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold"
  },

  uploadDescription: {
    color: "#7b8982",
    lineHeight: "1.6"
  },

  panelTitle: {
    color: "#30463b",
    marginTop: "10px"
  },

  advisorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "12px"
  },

  advisor: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    border:
      "1px solid #edf0ee",
    borderRadius: "12px"
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#dce8e2",
    color: "#40534a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },

  username: {
    margin: "5px 0 0",
    color: "#929c97",
    fontSize: "12px"
  },

  userNumber: {
    margin: "3px 0 0",
    color: "#a0aaa5",
    fontSize: "11px"
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
  },

  sectionBadge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#657f70",
    marginBottom: "5px"
  },

  objectiveBox: {
    background: "#f2f6f3",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "#40534a"
  },

  targetIcon: {
    fontSize: "28px"
  },

  focusBox: {
    textAlign: "center",
    padding: "20px",
    color: "#40534a"
  },

  empty: {
    textAlign: "center",
    padding: "25px",
    color: "#89948f"
  },

  emptyIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#edf2ef",
    color: "#657f70",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 10px",
    fontWeight: "bold",
    fontSize: "20px"
  },

  emptyText: {
    color: "#89948f"
  },

  auditBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    background: "#f7f9f8",
    borderRadius: "14px",
    padding: "20px"
  },

  history: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  historyItem: {
    display: "grid",
    gridTemplateColumns:
      "1fr auto 70px",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    border:
      "1px solid #edf0ee",
    borderRadius: "12px"
  },

  historyScore: {
    fontSize: "22px",
    color: "#657f70"
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "15px"
  },

  product: {
    padding: "20px",
    background: "#eef4f1",
    borderRadius: "12px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#40534a",
    fontSize: "20px"
  },

  productText: {
    color: "#89948f",
    fontSize: "13px",
    marginBottom: 0
  }
};
