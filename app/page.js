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

    // LOGIN ADMINISTRADOR
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

    // LOGIN ASESOR
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
                0
              </span>

              <span style={styles.cardText}>
                Reportes cargados
              </span>
            </div>

            <div style={styles.card}>
              <span style={styles.cardNumber}>
                0
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
            <strong>
              N° de usuario
            </strong>

            <span>
              {sesion.numero_usuario}
            </span>
          </div>

          <div>
            <strong>
              Usuario
            </strong>

            <span>
              {sesion.usuario}
            </span>
          </div>
        </div>

        <div style={styles.cards}>
          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>
              ★
            </span>

            <h3>
              Mi nota
            </h3>

            <strong style={styles.bigNumber}>
              —
            </strong>

            <p>
              Esperando reporte
            </p>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>
              ↗
            </span>

            <h3>
              Evolución
            </h3>

            <strong style={styles.bigNumber}>
              —
            </strong>

            <p>
              Se mostrará semanalmente
            </p>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>
              ✓
            </span>

            <h3>
              Objetivos
            </h3>

            <strong style={styles.bigNumber}>
              —
            </strong>

            <p>
              Se cargarán con el feedback
            </p>
          </div>
        </div>

        <div style={styles.twoColumns}>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>
              ¿Qué tengo que trabajar?
            </h2>

            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                !
              </div>

              <p>
                Todavía no hay desvíos cargados.
              </p>

              <small>
                Acá aparecerán tus principales
                oportunidades de mejora.
              </small>
            </div>
          </div>

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>
              Últimas auditorías
            </h2>

            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                ✓
              </div>

              <p>
                Todavía no hay auditorías cargadas.
              </p>

              <small>
                Acá vas a poder consultar tus llamadas
                auditadas.
              </small>
            </div>
          </div>
        </div>

        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>
            Mis productos
          </h2>

          <div style={styles.productGrid}>
            <div style={styles.product}>
              AP
            </div>

            <div style={styles.product}>
              SL
            </div>

            <div style={styles.product}>
              BM
            </div>

            <div style={styles.product}>
              CP
            </div>
          </div>

          <p style={styles.productText}>
            Los reportes indicarán qué producto
            corresponde a cada llamada auditada.
          </p>
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
    padding: "16px 20px",
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    marginTop: "25px"
  },

  infoBarDiv: {
    display: "flex",
    flexDirection: "column"
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
    fontSize: "32px",
    color: "#657f70",
    marginTop: "10px"
  },

  panel: {
    background: "white",
    borderRadius: "18px",
    padding: "28px",
    marginTop: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)"
  },

  panelTitle: {
    color: "#30463b",
    marginTop: 0
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
