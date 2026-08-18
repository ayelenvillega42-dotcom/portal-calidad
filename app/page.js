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
        usuario: ADMIN_USER,
      });

      return;
    }

    const asesor = asesores.find(
      (item) =>
        item.usuario_login.toLowerCase() === usuarioIngresado
    );

    if (!asesor || password !== ASESOR_PASSWORD) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }

    setSesion({
      rol: "asesor",
      nombre: asesor.nombre,
      usuario: asesor.usuario_login,
      numero_usuario: asesor.numero_usuario,
      id: asesor.id,
    });
  }

  function cerrarSesion() {
    setSesion(null);
    setUsuario("");
    setPassword("");
    setError("");
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
              {cargando ? "CARGANDO..." : "INGRESAR"}
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
          <div style={styles.adminWelcome}>
            <div>
              <span style={styles.eyebrow}>
                ADMINISTRACIÓN
              </span>

              <h2 style={styles.sectionTitle}>
                Bienvenida, Administradora
              </h2>

              <p style={styles.welcome}>
                Desde acá vas a poder gestionar la calidad
                del equipo y sus reportes semanales.
              </p>
            </div>
          </div>

          <div style={styles.cards}>
            <div style={styles.card}>
              <span style={styles.cardIcon}>
                👥
              </span>

              <span style={styles.cardNumber}>
                {asesores.length}
              </span>

              <span style={styles.cardText}>
                Asesores registrados
              </span>
            </div>

            <div style={styles.card}>
              <span style={styles.cardIcon}>
                📊
              </span>

              <span style={styles.cardNumber}>
                0
              </span>

              <span style={styles.cardText}>
                Reportes cargados
              </span>
            </div>

            <div style={styles.card}>
              <span style={styles.cardIcon}>
                🎧
              </span>

              <span style={styles.cardNumber}>
                0
              </span>

              <span style={styles.cardText}>
                Auditorías
              </span>
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>
                  Asesores
                </h2>

                <p style={styles.panelSubtitle}>
                  Equipo registrado en el portal
                </p>
              </div>

              <span style={styles.countBadge}>
                {asesores.length}
              </span>
            </div>

            {cargando ? (
              <div style={styles.loading}>
                Cargando asesores...
              </div>
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

                    <div style={styles.advisorInfo}>
                      <strong style={styles.advisorName}>
                        {asesor.nombre}
                      </strong>

                      <span style={styles.username}>
                        @{asesor.usuario_login}
                      </span>

                      <span style={styles.userNumber}>
                        N° {asesor.numero_usuario}
                      </span>
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
        <div style={styles.hero}>
          <div>
            <span style={styles.eyebrow}>
              MI ESPACIO
            </span>

            <h2 style={styles.sectionTitle}>
              Hola, {nombreMostrar}
            </h2>

            <p style={styles.welcome}>
              Acá vas a encontrar tu evolución,
              tus resultados y los puntos que tenés
              que trabajar.
            </p>
          </div>

          <div style={styles.userCircle}>
            {nombreMostrar.charAt(0)}
          </div>
        </div>

        <div style={styles.infoBar}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>
              N° DE USUARIO
            </span>

            <strong style={styles.infoValue}>
              {sesion.numero_usuario}
            </strong>
          </div>

          <div style={styles.infoDivider}></div>

          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>
              USUARIO
            </span>

            <strong style={styles.infoValue}>
              {sesion.usuario}
            </strong>
          </div>
        </div>

        {/* =========================
            MÉTRICAS
        ========================= */}

        <div style={styles.cards}>
          <div style={styles.metricCard}>
            <div style={styles.metricTop}>
              <span style={styles.metricIcon}>
                ★
              </span>

              <span style={styles.metricTag}>
                SEMANAL
              </span>
            </div>

            <h3 style={styles.metricTitle}>
              Mi nota
            </h3>

            <strong style={styles.bigNumber}>
              —
            </strong>

            <p style={styles.metricDescription}>
              Tu resultado aparecerá acá.
            </p>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricTop}>
              <span style={styles.metricIcon}>
                ↗
              </span>

              <span style={styles.metricTag}>
                EVOLUCIÓN
              </span>
            </div>

            <h3 style={styles.metricTitle}>
              Evolución
            </h3>

            <strong style={styles.bigNumber}>
              —
            </strong>

            <p style={styles.metricDescription}>
              Vas a poder comparar tus semanas.
            </p>
          </div>

          <div style={styles.metricCard}>
            <div style={styles.metricTop}>
              <span style={styles.metricIcon}>
                ✓
              </span>

              <span style={styles.metricTag}>
                OBJETIVOS
              </span>
            </div>

            <h3 style={styles.metricTitle}>
              Objetivos
            </h3>

            <strong style={styles.bigNumber}>
              —
            </strong>

            <p style={styles.metricDescription}>
              Tus objetivos de mejora.
            </p>
          </div>
        </div>

        {/* =========================
            DESVÍOS Y AUDITORÍAS
        ========================= */}

        <div style={styles.twoColumns}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>
                  ¿Qué tengo que trabajar?
                </h2>

                <p style={styles.panelSubtitle}>
                  Tus principales oportunidades de mejora
                </p>
              </div>

              <div style={styles.sectionIcon}>
                !
              </div>
            </div>

            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                ✓
              </div>

              <h3 style={styles.emptyTitle}>
                Todo listo para empezar
              </h3>

              <p style={styles.emptyText}>
                Cuando se cargue tu reporte semanal,
                acá vas a encontrar los desvíos y
                recomendaciones específicas para vos.
              </p>
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>
                  Últimas auditorías
                </h2>

                <p style={styles.panelSubtitle}>
                  Tus llamadas auditadas
                </p>
              </div>

              <div style={styles.sectionIcon}>
                🎧
              </div>
            </div>

            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                🎧
              </div>

              <h3 style={styles.emptyTitle}>
                Aún no hay auditorías
              </h3>

              <p style={styles.emptyText}>
                Cuando se carguen tus escuchas,
                vas a poder consultar cada llamada
                y su devolución.
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            PRODUCTOS
        ========================= */}

        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                Mis productos
              </h2>

              <p style={styles.panelSubtitle}>
                Campañas que vas a poder consultar
              </p>
            </div>
          </div>

          <div style={styles.productGrid}>
            <div style={styles.product}>
              <span style={styles.productCode}>
                AP
              </span>

              <span style={styles.productName}>
                Accidentes Personales
              </span>
            </div>

            <div style={styles.product}>
              <span style={styles.productCode}>
                BM
              </span>

              <span style={styles.productName}>
                Bienes Móviles
              </span>
            </div>

            <div style={styles.product}>
              <span style={styles.productCode}>
                SL
              </span>

              <span style={styles.productName}>
                Seguro de Vida
              </span>
            </div>

            <div style={styles.product}>
              <span style={styles.productCode}>
                CP
              </span>

              <span style={styles.productName}>
                Protección
              </span>
            </div>
          </div>
        </div>

        {/* =========================
            PRÓXIMAMENTE
        ========================= */}

        <div style={styles.nextPanel}>
          <div style={styles.nextIcon}>
            ✦
          </div>

          <div>
            <h3 style={styles.nextTitle}>
              Tu portal de calidad
            </h3>

            <p style={styles.nextText}>
              Próximamente vas a poder ver tus reportes
              semanales, evolución, objetivos, auditorías
              y recomendaciones personalizadas desde un
              solo lugar.
            </p>
          </div>
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
    fontFamily:
      "Arial, Helvetica, sans-serif",
    padding: "20px",
  },

  loginCard: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "45px",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.10)",
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
    margin: "0 auto 20px",
  },

  title: {
    textAlign: "center",
    margin: 0,
    color: "#30463b",
    fontSize: "28px",
  },

  subtitle: {
    textAlign: "center",
    color: "#7b8982",
    marginBottom: "35px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#40534a",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border:
      "1px solid #d5ddd8",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
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
    cursor: "pointer",
  },

  error: {
    color: "#b44b4b",
    fontSize: "14px",
    marginTop: "12px",
  },

  help: {
    textAlign: "center",
    color: "#89948f",
    fontSize: "13px",
    marginTop: "25px",
  },

  dashboard: {
    minHeight: "100vh",
    background: "#f4f7f5",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  header: {
    background: "#ffffff",
    padding: "22px 6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  headerTitle: {
    margin: 0,
    color: "#30463b",
    fontSize: "24px",
  },

  headerSubtitle: {
    margin: "5px 0 0",
    color: "#89948f",
    fontSize: "14px",
  },

  logout: {
    border:
      "1px solid #657f70",
    background: "white",
    color: "#657f70",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "45px 25px 70px",
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  adminWelcome: {
    marginBottom: "10px",
  },

  eyebrow: {
    display: "block",
    color: "#657f70",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
    marginBottom: "8px",
  },

  sectionTitle: {
    color: "#30463b",
    margin: "0 0 8px",
    fontSize: "30px",
  },

  welcome: {
    color: "#7b8982",
    fontSize: "15px",
    lineHeight: 1.6,
    maxWidth: "700px",
  },

  userCircle: {
    width: "62px",
    height: "62px",
    minWidth: "62px",
    borderRadius: "50%",
    background: "#657f70",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },

  infoBar: {
    background: "#e9f0ec",
    borderRadius: "14px",
    padding: "18px 22px",
    display: "flex",
    alignItems: "center",
    gap: "35px",
    flexWrap: "wrap",
    marginTop: "25px",
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  infoLabel: {
    color: "#7b8982",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  infoValue: {
    color: "#30463b",
    fontSize: "15px",
  },

  infoDivider: {
    width: "1px",
    height: "35px",
    background: "#cbd8d1",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    margin: "30px 0",
  },

  card: {
    background: "white",
    borderRadius: "18px",
    padding: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)",
  },

  cardIcon: {
    display: "block",
    fontSize: "22px",
    marginBottom: "12px",
  },

  cardNumber: {
    display: "block",
    fontSize: "34px",
    fontWeight: "bold",
    color: "#657f70",
  },

  cardText: {
    color: "#7b8982",
    fontSize: "14px",
  },

  metricCard: {
    background: "white",
    borderRadius: "18px",
    padding: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)",
  },

  metricTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  metricIcon: {
    fontSize: "24px",
    color: "#657f70",
  },

  metricTag: {
    fontSize: "9px",
    color: "#89948f",
    background: "#eef4f1",
    padding: "5px 8px",
    borderRadius: "6px",
    fontWeight: "bold",
  },

  metricTitle: {
    color: "#30463b",
    marginBottom: "8px",
  },

  bigNumber: {
    display: "block",
    fontSize: "38px",
    color: "#657f70",
    marginTop: "10px",
  },

  metricDescription: {
    color: "#89948f",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  panel: {
    background: "white",
    borderRadius: "18px",
    padding: "28px",
    marginTop: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "20px",
  },

  panelTitle: {
    color: "#30463b",
    margin: 0,
    fontSize: "20px",
  },

  panelSubtitle: {
    color: "#89948f",
    fontSize: "13px",
    margin: "6px 0 0",
  },

  countBadge: {
    background: "#e9f0ec",
    color: "#657f70",
    borderRadius: "20px",
    padding: "7px 12px",
    fontWeight: "bold",
  },

  sectionIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#edf2ef",
    color: "#657f70",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  loading: {
    textAlign: "center",
    padding: "30px",
    color: "#89948f",
  },

  advisorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "12px",
  },

  advisor: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    border:
      "1px solid #edf0ee",
    borderRadius: "12px",
    background: "#fcfdfc",
  },

  advisorInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  avatar: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    borderRadius: "50%",
    background: "#dce8e2",
    color: "#40534a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  advisorName: {
    color: "#30463b",
    fontSize: "14px",
  },

  username: {
    color: "#657f70",
    fontSize: "12px",
  },

  userNumber: {
    color: "#a0aaa5",
    fontSize: "11px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  empty: {
    textAlign: "center",
    padding: "25px 15px",
    color: "#89948f",
  },

  emptyIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#edf2ef",
    color: "#657f70",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    fontWeight: "bold",
    fontSize: "20px",
  },

  emptyTitle: {
    color: "#40534a",
    fontSize: "16px",
    margin: "5px 0 8px",
  },

  emptyText: {
    color: "#89948f",
    fontSize: "13px",
    lineHeight: 1.6,
    maxWidth: "450px",
    margin: "0 auto",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
  },

  product: {
    padding: "22px",
    background: "#eef4f1",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    textAlign: "center",
  },

  productCode: {
    color: "#40534a",
    fontSize: "22px",
    fontWeight: "bold",
  },

  productName: {
    color: "#89948f",
    fontSize: "12px",
  },

  nextPanel: {
    marginTop: "25px",
    padding: "24px",
    background: "#e9f0ec",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  nextIcon: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    borderRadius: "50%",
    background: "#657f70",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  nextTitle: {
    color: "#30463b",
    margin: "0 0 5px",
  },

  nextText: {
    color: "#657f70",
    margin: 0,
    fontSize: "13px",
    lineHeight: 1.6,
  },
};
