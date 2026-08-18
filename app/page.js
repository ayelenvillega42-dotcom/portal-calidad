"use client";

import { useEffect, useState } from "react";

const API_URL =
  "https://portal-calidad-api.ayelenvillega42.workers.dev";

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin123";
const ASESOR_PASSWORD = "123456";

export default function Home() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [sesion, setSesion] = useState(null);
  const [error, setError] = useState("");
  const [asesores, setAsesores] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoReportes, setCargandoReportes] = useState(false);

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
    setCargandoReportes(true);

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
    } finally {
      setCargandoReportes(false);
    }
  }

  function iniciarSesion(e) {
    e.preventDefault();
    setError("");

    const usuarioIngresado = usuario.toLowerCase().trim();

    // =========================
    // LOGIN ADMINISTRADOR
    // =========================

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

    // =========================
    // LOGIN ASESOR
    // =========================

    const asesor = asesores.find(
      (item) =>
        item.usuario_login.toLowerCase() === usuarioIngresado
    );

    if (!asesor || password !== ASESOR_PASSWORD) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }

    const nuevaSesion = {
      rol: "asesor",
      nombre: asesor.nombre,
      usuario: asesor.usuario_login,
      numero_usuario: asesor.numero_usuario,
      id: asesor.id
    };

    setSesion(nuevaSesion);
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

          <div style={styles.logoCircle}>
            Q
          </div>

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
            Desde acá vas a poder administrar los reportes
            de calidad del equipo.
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

          <div style={styles.panel}>

            <h2 style={styles.panelTitle}>
              Asesores
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

      {/* HEADER */}

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

      {/* CONTENIDO */}

      <section style={styles.content}>

        <h2 style={styles.sectionTitle}>
          Hola, {nombreMostrar}
        </h2>

        <p style={styles.welcome}>
          Este es tu espacio personal de seguimiento
          de calidad.
        </p>

        {/* DATOS DEL ASESOR */}

        <div style={styles.infoBar}>

          <div style={styles.infoItem}>
            <strong>
              N° de usuario
            </strong>

            <span>
              {sesion.numero_usuario}
            </span>
          </div>

          <div style={styles.infoItem}>
            <strong>
              Usuario
            </strong>

            <span>
              {sesion.usuario}
            </span>
          </div>

          {ultimoReporte && (
            <div style={styles.infoItem}>
              <strong>
                Último reporte
              </strong>

              <span>
                {ultimoReporte.semana}
              </span>
            </div>
          )}

        </div>

        {cargandoReportes ? (

          <div style={styles.loadingBox}>
            <div style={styles.loadingCircle}>
              ...
            </div>

            <p>
              Cargando tu reporte de calidad...
            </p>
          </div>

        ) : ultimoReporte ? (

          <>
            {/* =========================
                RESUMEN
            ========================= */}

            <div style={styles.cards}>

              <div style={styles.metricCard}>

                <span style={styles.metricIcon}>
                  ★
                </span>

                <h3>
                  Mi nota
                </h3>

                <strong style={styles.score}>
                  {ultimoReporte.nota}
                </strong>

                <p>
                  Resultado de calidad
                </p>

              </div>

              <div style={styles.metricCard}>

                <span style={styles.metricIcon}>
                  ↗
                </span>

                <h3>
                  Evolución
                </h3>

                <strong style={styles.evolution}>
                  {ultimoReporte.evolucion || "—"}
                </strong>

                <p>
                  Comparación semanal
                </p>

              </div>

              <div style={styles.metricCard}>

                <span style={styles.metricIcon}>
                  ✓
                </span>

                <h3>
                  Semana
                </h3>

                <strong style={styles.week}>
                  {ultimoReporte.semana}
                </strong>

                <p>
                  Último reporte cargado
                </p>

              </div>

            </div>

            {/* =========================
                OBJETIVOS
            ========================= */}

            <div style={styles.panel}>

              <div style={styles.panelHeader}>
                <div>
                  <span style={styles.panelEyebrow}>
                    PLAN DE ACCIÓN
                  </span>

                  <h2 style={styles.panelTitle}>
                    Objetivos
                  </h2>
                </div>

                <div style={styles.targetIcon}>
                  🎯
                </div>
              </div>

              <div style={styles.objectiveBox}>
                <p>
                  {ultimoReporte.objetivos ||
                    "No hay objetivos cargados."}
                </p>
              </div>

            </div>

            {/* =========================
                DESVÍO Y RECOMENDACIÓN
            ========================= */}

            <div style={styles.twoColumns}>

              <div style={styles.panel}>

                <span style={styles.panelEyebrow}>
                  ATENCIÓN
                </span>

                <h2 style={styles.panelTitle}>
                  ¿Qué tengo que trabajar?
                </h2>

                <div style={styles.deviationBox}>

                  <div style={styles.deviationIcon}>
                    !
                  </div>

                  <div>
                    <strong>
                      {ultimoReporte.desvio_principal ||
                        "Sin desvíos principales"}
                    </strong>

                    <p>
                      Este es el principal punto
                      a trabajar en el período.
                    </p>
                  </div>

                </div>

              </div>

              <div style={styles.panel}>

                <span style={styles.panelEyebrow}>
                  RECOMENDACIÓN
                </span>

                <h2 style={styles.panelTitle}>
                  ¿Cómo mejorarlo?
                </h2>

                <div style={styles.recommendationBox}>

                  <div style={styles.recommendationIcon}>
                    ✓
                  </div>

                  <p>
                    {ultimoReporte.recomendaciones ||
                      "No hay recomendaciones cargadas."}
                  </p>

                </div>

              </div>

            </div>

            {/* =========================
                ÚLTIMA AUDITORÍA
            ========================= */}

            <div style={styles.panel}>

              <div style={styles.panelHeader}>

                <div>
                  <span style={styles.panelEyebrow}>
                    CALIDAD
                  </span>

                  <h2 style={styles.panelTitle}>
                    Última auditoría
                  </h2>
                </div>

                <div style={styles.auditIcon}>
                  ✓
                </div>

              </div>

              <div style={styles.auditGrid}>

                <div>
                  <span style={styles.detailLabel}>
                    Auditoría
                  </span>

                  <p style={styles.detailText}>
                    {ultimoReporte.auditoria ||
                      "Sin detalle"}
                  </p>
                </div>

                <div>
                  <span style={styles.detailLabel}>
                    Producto
                  </span>

                  <p style={styles.productBadge}>
                    {ultimoReporte.producto ||
                      "—"}
                  </p>
                </div>

                <div>
                  <span style={styles.detailLabel}>
                    Observaciones
                  </span>

                  <p style={styles.detailText}>
                    {ultimoReporte.observaciones ||
                      "Sin observaciones"}
                  </p>
                </div>

              </div>

            </div>

            {/* =========================
                HISTORIAL
            ========================= */}

            <div style={styles.panel}>

              <div style={styles.panelHeader}>

                <div>
                  <span style={styles.panelEyebrow}>
                    SEGUIMIENTO
                  </span>

                  <h2 style={styles.panelTitle}>
                    Historial de reportes
                  </h2>
                </div>

              </div>

              {reportes.map((reporte) => (

                <div
                  key={reporte.id}
                  style={styles.historyItem}
                >

                  <div style={styles.historyWeek}>
                    {reporte.semana}
                  </div>

                  <div style={styles.historyScore}>
                    {reporte.nota ?? "—"}
                  </div>

                  <div style={styles.historyInfo}>
                    <strong>
                      {reporte.desvio_principal ||
                        "Sin desvío principal"}
                    </strong>

                    <span>
                      {reporte.producto ||
                        "Sin producto"}
                    </span>
                  </div>

                </div>

              ))}

            </div>

          </>

        ) : (

          <div style={styles.noReport}>

            <div style={styles.noReportIcon}>
              ✓
            </div>

            <h2>
              Todavía no hay reportes cargados
            </h2>

            <p>
              Cuando el equipo de Calidad cargue
              tu reporte semanal, vas a poder verlo
              acá.
            </p>

          </div>

        )}

      </section>

    </main>
  );
}

// ==========================================
// ESTILOS
// ==========================================

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
    padding: "18px 20px",
    display: "flex",
    gap: "45px",
    flexWrap: "wrap",
    marginTop: "25px"
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
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
    borderRadius: "18px",
    padding: "28px",
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

  score: {
    display: "block",
    fontSize: "48px",
    color: "#657f70",
    marginTop: "10px"
  },

  evolution: {
    display: "block",
    fontSize: "18px",
    color: "#657f70",
    marginTop: "18px",
    minHeight: "48px"
  },

  week: {
    display: "block",
    fontSize: "20px",
    color: "#657f70",
    marginTop: "18px",
    minHeight: "48px"
  },

  panel: {
    background: "white",
    borderRadius: "18px",
    padding: "28px",
    marginTop: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)"
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px"
  },

  panelEyebrow: {
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
    color: "#8b9992"
  },

  panelTitle: {
    color: "#30463b",
    marginTop: "6px",
    marginBottom: "18px"
  },

  targetIcon: {
    fontSize: "28px"
  },

  auditIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "#e9f0ec",
    color: "#657f70",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },

  objectiveBox: {
    background: "#eef4f1",
    borderRadius: "12px",
    padding: "18px",
    color: "#40534a",
    lineHeight: "1.6"
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
  },

  deviationBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    background: "#fff6f0",
    borderRadius: "12px",
    padding: "18px"
  },

  deviationIcon: {
    minWidth: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#f2d6c5",
    color: "#9b5c3c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "20px"
  },

  recommendationBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    background: "#eef4f1",
    borderRadius: "12px",
    padding: "18px"
  },

  recommendationIcon: {
    minWidth: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#dce8e2",
    color: "#657f70",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },

  auditGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "25px"
  },

  detailLabel: {
    display: "block",
    fontSize: "12px",
    color: "#89948f",
    marginBottom: "8px"
  },

  detailText: {
    color: "#40534a",
    lineHeight: "1.5",
    marginTop: 0
  },

  productBadge: {
    display: "inline-block",
    background: "#e9f0ec",
    color: "#40534a",
    padding: "8px 18px",
    borderRadius: "20px",
    fontWeight: "bold"
  },

  historyItem: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "16px 0",
    borderBottom:
      "1px solid #edf0ee"
  },

  historyWeek: {
    minWidth: "150px",
    color: "#657f70",
    fontWeight: "bold"
  },

  historyScore: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#30463b",
    minWidth: "50px"
  },

  historyInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    color: "#40534a"
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

  emptyText: {
    color: "#89948f"
  },

  loadingBox: {
    background: "white",
    borderRadius: "18px",
    padding: "50px",
    marginTop: "30px",
    textAlign: "center",
    color: "#89948f",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)"
  },

  loadingCircle: {
    fontSize: "30px",
    color: "#657f70",
    fontWeight: "bold"
  },

  noReport: {
    background: "white",
    borderRadius: "18px",
    padding: "60px 30px",
    marginTop: "30px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)"
  },

  noReportIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#e9f0ec",
    color: "#657f70",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "25px",
    fontWeight: "bold"
  }
};
