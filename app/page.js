"use client";

import { useState } from "react";

const asesores = [
  "Tello, Marianela",
  "Contreras, Gilary",
  "Malqui, Xiomara",
  "Luna, Oriana",
  "Gomez, Carla",
  "Acosta, Pamela",
  "Bahamonde, Camila",
  "Vasquez, Agustin",
  "Bustos, Jesica",
  "Cabrera, Antonella",
  "Bustamante, Ailin",
  "Simonetta, Valentina",
  "Olmedo, Thomas",
  "Aguilera, Trinidad",
  "Viniegra, Agustín",
  "Ojeda, Luana",
  "Reartes, Maia",
  "Cordoba, Tania",
  "Peralta, Belen",
  "Mercado, Chiara",
  "Diaz, Milagros",
  "Rojek, Luna",
  "Bustos, Nicolas"
];

const crearUsuario = (nombre) =>
  nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(", ", "")
    .replace(/ /g, "");

const usuarios = {
  admin: {
    password: "admin123",
    nombre: "Administradora",
    rol: "admin"
  }
};

asesores.forEach((nombre) => {
  usuarios[crearUsuario(nombre)] = {
    password: "123456",
    nombre,
    rol: "asesor"
  };
});

export default function Home() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [sesion, setSesion] = useState(null);
  const [error, setError] = useState("");

  const iniciarSesion = (e) => {
    e.preventDefault();

    const user = usuarios[usuario.toLowerCase().trim()];

    if (!user || user.password !== password) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }

    setError("");
    setSesion({
      usuario,
      ...user
    });
  };

  const cerrarSesion = () => {
    setSesion(null);
    setUsuario("");
    setPassword("");
  };

  if (!sesion) {
    return (
      <main style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.logoCircle}>Q</div>

          <h1 style={styles.title}>Portal de Calidad</h1>

          <p style={styles.subtitle}>
            Seguimiento y evolución de calidad
          </p>

          <form onSubmit={iniciarSesion}>
            <label style={styles.label}>Usuario</label>

            <input
              style={styles.input}
              type="text"
              placeholder="Ingresá tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />

            <label style={styles.label}>Contraseña</label>

            <input
              style={styles.input}
              type="password"
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p style={styles.error}>{error}</p>}

            <button style={styles.button} type="submit">
              INGRESAR
            </button>
          </form>

          <p style={styles.help}>
            ¿Necesitás ayuda? Contactá al equipo de Calidad.
          </p>
        </div>
      </main>
    );
  }

  if (sesion.rol === "admin") {
    return (
      <main style={styles.dashboard}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>Portal de Calidad</h1>
            <p style={styles.headerSubtitle}>
              Panel de Administración
            </p>
          </div>

          <button style={styles.logout} onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </header>

        <section style={styles.content}>
          <h2 style={styles.sectionTitle}>
            Bienvenida, Administradora
          </h2>

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
              <span style={styles.cardNumber}>0</span>
              <span style={styles.cardText}>
                Reportes cargados
              </span>
            </div>

            <div style={styles.card}>
              <span style={styles.cardNumber}>0</span>
              <span style={styles.cardText}>
                Auditorías
              </span>
            </div>
          </div>

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>
              Asesores
            </h2>

            <div style={styles.advisorGrid}>
              {asesores.map((nombre) => (
                <div key={nombre} style={styles.advisor}>
                  <div style={styles.avatar}>
                    {nombre.charAt(0)}
                  </div>

                  <div>
                    <strong>{nombre}</strong>

                    <p style={styles.username}>
                      Usuario: {crearUsuario(nombre)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

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

        <button style={styles.logout} onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <section style={styles.content}>
        <h2 style={styles.sectionTitle}>
          Hola, {sesion.nombre.split(", ")[1] || sesion.nombre}
        </h2>

        <p style={styles.welcome}>
          Este es tu espacio personal de seguimiento de calidad.
        </p>

        <div style={styles.cards}>
          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>★</span>
            <h3>Mi nota</h3>
            <strong>—</strong>
            <p>Sin datos cargados</p>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>↗</span>
            <h3>Evolución</h3>
            <strong>—</strong>
            <p>Próximamente</p>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>✓</span>
            <h3>Objetivos</h3>
            <strong>—</strong>
            <p>Próximamente</p>
          </div>
        </div>

        <div style={styles.twoColumns}>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>
              ¿Qué tengo que trabajar?
            </h2>

            <div style={styles.empty}>
              <div style={styles.emptyIcon}>!</div>
              <p>
                Todavía no hay desvíos cargados.
              </p>
            </div>
          </div>

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>
              Últimas auditorías
            </h2>

            <div style={styles.empty}>
              <div style={styles.emptyIcon}>✓</div>
              <p>
                Todavía no hay auditorías cargadas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

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
    boxShadow: "0 20px 60px rgba(0,0,0,0.10)"
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
    border: "1px solid #d5ddd8",
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
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
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
    border: "1px solid #657f70",
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
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
  },

  metricCard: {
    background: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
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

  metricCardStrong: {
    fontSize: "30px"
  },

  panel: {
    background: "white",
    borderRadius: "18px",
    padding: "28px",
    marginTop: "25px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
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
    border: "1px solid #edf0ee",
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
  }
};
