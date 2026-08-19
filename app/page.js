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
  const [datos, setDatos] = useState({
    reportes: [],
    productividad: [],
    tipificaciones: [],
    gestion: [],
    noVenta: [],
    comentarios: []
  });
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

  async function cargarDatosAsesor(asesorId) {
    try {
      const [
        reportes,
        productividad,
        tipificaciones,
        gestion,
        noVenta
      ] = await Promise.all([
        fetch(`${API_URL}/reportes?asesor_id=${asesorId}`).then(r => r.json()),
        fetch(`${API_URL}/productividad?asesor_id=${asesorId}`).then(r => r.json()),
        fetch(`${API_URL}/tipificaciones?asesor_id=${asesorId}`).then(r => r.json()),
        fetch(`${API_URL}/gestion-calidad?asesor_id=${asesorId}`).then(r => r.json()),
        fetch(`${API_URL}/auditorias-no-venta?asesor_id=${asesorId}`).then(r => r.json())
      ]);

      setDatos({
        reportes: Array.isArray(reportes) ? reportes : [],
        productividad: Array.isArray(productividad) ? productividad : [],
        tipificaciones: Array.isArray(tipificaciones) ? tipificaciones : [],
        gestion: Array.isArray(gestion) ? gestion : [],
        noVenta: Array.isArray(noVenta) ? noVenta : [],
        comentarios: []
      });

    } catch (error) {
      console.error(error);

      setDatos({
        reportes: [],
        productividad: [],
        tipificaciones: [],
        gestion: [],
        noVenta: [],
        comentarios: []
      });
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
      item =>
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

    cargarDatosAsesor(asesor.id);
  }

  function cerrarSesion() {
    setSesion(null);
    setUsuario("");
    setPassword("");
    setError("");

    setDatos({
      reportes: [],
      productividad: [],
      tipificaciones: [],
      gestion: [],
      noVenta: [],
      comentarios: []
    });
  }

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
              onChange={e => setUsuario(e.target.value)}
            />

            <label style={styles.label}>
              Contraseña
            </label>

            <input
              style={styles.input}
              type="password"
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
            Desde acá vamos a administrar los reportes semanales
            de Calidad y Productividad.
          </p>

          <div style={styles.cards}>
            <Metric
              numero={asesores.length}
              texto="Asesores registrados"
            />

            <Metric
              numero="—"
              texto="Reportes cargados"
            />

            <Metric
              numero="—"
              texto="Auditorías"
            />
          </div>

          <div style={styles.panel}>
            <div style={styles.sectionBadge}>
              PRÓXIMAMENTE
            </div>

            <h2 style={styles.panelTitle}>
              Carga semanal
            </h2>

            <p style={styles.welcome}>
              Acá vamos a incorporar el cargador del archivo
              semanal para actualizar automáticamente a todo
              el equipo.
            </p>

            <div style={styles.futureBox}>
              <strong>
                Carga masiva de reportes
              </strong>

              <p>
                Calidad + Productividad + Tipificaciones +
                Gestión + No Ventas.
              </p>
            </div>
          </div>

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>
              Asesores registrados
            </h2>

            <div style={styles.advisorGrid}>
              {asesores.map(asesor => (
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
                      {asesor.usuario_login}
                    </p>

                    <p style={styles.userNumber}>
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
  }

  const nombreMostrar =
    sesion.nombre.split(", ")[1] || sesion.nombre;

  const reporte =
    datos.reportes.length > 0
      ? datos.reportes[0]
      : null;

  const productividad =
    datos.productividad.length > 0
      ? datos.productividad[0]
      : null;

  const tipificacion =
    datos.tipificaciones.length > 0
      ? datos.tipificaciones[0]
      : null;

  const gestion =
    datos.gestion.length > 0
      ? datos.gestion[0]
      : null;

  const noVenta =
    datos.noVenta.length > 0
      ? datos.noVenta[0]
      : null;

  return (
    <main style={styles.dashboard}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>
            Portal de Calidad
          </h1>

          <p style={styles.headerSubtitle}>
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
        <div style={styles.topRow}>
          <div>
            <h2 style={styles.sectionTitle}>
              Hola, {nombreMostrar}
            </h2>

            <p style={styles.welcome}>
              Acá vas a encontrar tu evolución semanal
              de Calidad y Productividad.
            </p>
          </div>

          <button
            style={styles.printButton}
            onClick={() => window.print()}
          >
            🖨 IMPRIMIR INFORME
          </button>
        </div>

        <div style={styles.infoBar}>
          <div>
            <strong>N° de usuario</strong>
            <span>{sesion.numero_usuario}</span>
          </div>

          <div>
            <strong>Usuario</strong>
            <span>{sesion.usuario}</span>
          </div>

          <div>
            <strong>Semana</strong>
            <span>
              {reporte?.semana ||
                productividad?.semana ||
                "Sin reporte"}
            </span>
          </div>
        </div>

        <SectionTitle
          badge="CALIDAD"
          title="Mi resultado de calidad"
        />

        <div style={styles.cards}>
          <Metric
            numero={reporte?.nota ?? "—"}
            texto="Nota de calidad"
          />

          <Metric
            numero={reporte?.evolucion ?? "—"}
            texto="Evolución semanal"
          />

          <Metric
            numero={reporte?.producto ?? "—"}
            texto="Producto"
          />
        </div>

        <div style={styles.twoColumns}>
          <Panel
            badge="PLAN DE ACCIÓN"
            title="Objetivos"
          >
            <div style={styles.highlightBox}>
              {reporte?.objetivos ||
                "Todavía no hay objetivos cargados."}
            </div>
          </Panel>

          <Panel
            badge="ATENCIÓN"
            title="Principal punto de atención"
          >
            <div style={styles.highlightBox}>
              {reporte?.desvio_principal ||
                "Sin desvíos cargados."}
            </div>
          </Panel>
        </div>

        <Panel
          badge="RECOMENDACIÓN"
          title="¿Cómo mejorarlo?"
        >
          <div style={styles.textBox}>
            {reporte?.recomendaciones ||
              "Sin recomendaciones cargadas."}
          </div>
        </Panel>

        <SectionTitle
          badge="PRODUCTIVIDAD"
          title="Mi evolución semanal"
        />

        <div style={styles.productivityGrid}>
          <ProductivityCard
            title="SPH"
            resultado={productividad?.sph}
            objetivo={productividad?.sph_objetivo}
            estado={productividad?.estado_sph}
          />

          <ProductivityCard
            title="VENTAS"
            resultado={productividad?.ventas}
            objetivo={productividad?.ventas_objetivo}
            estado={productividad?.estado_ventas}
          />

          <ProductivityCard
            title="OBJETIVO DE CAMPAÑA"
            resultado={productividad?.objetivo_campana_descripcion}
            objetivo={productividad?.objetivo_campana}
            estado={productividad?.estado_objetivo_campana}
          />
        </div>

        <Panel
          badge="GESTIÓN SEMANAL"
          title="¿Qué se realizó durante la semana?"
        >
          <div style={styles.textBox}>
            {productividad?.gestion_semana ||
              "Sin gestión registrada."}
          </div>
        </Panel>

        <SectionTitle
          badge="TIPIFICACIONES"
          title="Seguimiento de desvíos"
        />

        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <strong>Tipificación</strong>
            <strong>% Desvío</strong>
            <strong>Objetivo</strong>
            <strong>Compromiso esperado</strong>
          </div>

          {tipificacion ? (
            <div style={styles.tableRow}>
              <span>
                {tipificacion.tipificacion || "—"}
              </span>

              <span>
                {tipificacion.porcentaje_desvio != null
                  ? `${tipificacion.porcentaje_desvio}%`
                  : "—"}
              </span>

              <span>
                {tipificacion.objetivo ?? "—"}
              </span>

              <span>
                {tipificacion.compromiso_esperado || "—"}
              </span>
            </div>
          ) : (
            <div style={styles.empty}>
              No hay tipificaciones cargadas.
            </div>
          )}
        </div>

        <SectionTitle
          badge="GESTIÓN DE CALIDAD"
          title="Seguimiento realizado"
        />

        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <strong>Indicador</strong>
            <strong>Resultado</strong>
          </div>

          <InfoRow
            label="Cantidad de auditorías realizadas"
            value={gestion?.cantidad_auditorias ?? "—"}
          />

          <InfoRow
            label="Oportunidades de mejora"
            value={gestion?.oportunidades_mejora || "—"}
          />

          <InfoRow
            label="Coaching brindado"
            value={gestion?.coaching_brindado || "—"}
          />

          <InfoRow
            label="Registro en sistema"
            value={gestion?.registro_sistema || "—"}
          />

          <InfoRow
            label="Compromiso esperado"
            value={gestion?.compromiso_esperado || "—"}
          />

          <InfoRow
            label="Fortalezas destacadas"
            value={gestion?.fortalezas_destacadas || "—"}
          />
        </div>

        <SectionTitle
          badge="NO VENTA"
          title="Auditoría de no ventas"
        />

        <Panel
          badge="AUDITORÍA"
          title="Resultado"
        >
          <div style={styles.auditGrid}>
            <div>
              <strong>Auditorías</strong>
              <p>
                {noVenta?.cantidad_auditorias ?? "—"}
              </p>
            </div>

            <div>
              <strong>Oportunidades detectadas</strong>
              <p>
                {noVenta?.oportunidades_detectadas || "—"}
              </p>
            </div>

            <div>
              <strong>Desvío principal</strong>
              <p>
                {noVenta?.desvio_principal || "—"}
              </p>
            </div>

            <div>
              <strong>Compromiso esperado</strong>
              <p>
                {noVenta?.compromiso_esperado || "—"}
              </p>
            </div>
          </div>

          <div style={styles.textBox}>
            <strong>Recomendaciones</strong>
            <p>
              {noVenta?.recomendaciones || "—"}
            </p>
          </div>
        </Panel>

        <SectionTitle
          badge="CALIDAD"
          title="Última auditoría"
        />

        <Panel
          badge="AUDITORÍA"
          title="Detalle"
        >
          <div style={styles.auditGrid}>
            <div>
              <strong>Auditoría</strong>
              <p>{reporte?.auditoria || "—"}</p>
            </div>

            <div>
              <strong>Producto</strong>
              <p>{reporte?.producto || "—"}</p>
            </div>

            <div>
              <strong>Observaciones</strong>
              <p>{reporte?.observaciones || "—"}</p>
            </div>
          </div>
        </Panel>

        <SectionTitle
          badge="SEGUIMIENTO"
          title="Historial de reportes"
        />

        <div style={styles.history}>
          {datos.reportes.length === 0 ? (
            <div style={styles.empty}>
              Todavía no hay reportes cargados.
            </div>
          ) : (
            datos.reportes.map(item => (
              <div
                key={item.id}
                style={styles.historyItem}
              >
                <div>
                  <strong>{item.semana}</strong>
                  <p>
                    {item.desvio_principal ||
                      "Sin desvío"}
                  </p>
                </div>

                <strong style={styles.score}>
                  {item.nota ?? "—"}
                </strong>

                <span>
                  {item.producto || "—"}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={styles.printFooter}>
          Portal de Calidad · Informe individual
        </div>
      </section>
    </main>
  );
}

function Metric({ numero, texto }) {
  return (
    <div style={styles.metricCard}>
      <strong style={styles.bigNumber}>
        {numero}
      </strong>

      <p style={styles.metricLabel}>
        {texto}
      </p>
    </div>
  );
}

function SectionTitle({ badge, title }) {
  return (
    <div style={styles.sectionHeading}>
      <span>{badge}</span>
      <h2>{title}</h2>
    </div>
  );
}

function Panel({ badge, title, children }) {
  return (
    <div style={styles.panel}>
      <div style={styles.sectionBadge}>
        {badge}
      </div>

      <h2 style={styles.panelTitle}>
        {title}
      </h2>

      {children}
    </div>
  );
}

function ProductivityCard({
  title,
  resultado,
  objetivo,
  estado
}) {
  return (
    <div style={styles.productivityCard}>
      <span style={styles.productivityTitle}>
        {title}
      </span>

      <strong style={styles.productivityResult}>
        {resultado ?? "—"}
      </strong>

      <p>
        Objetivo:{" "}
        <strong>{objetivo ?? "—"}</strong>
      </p>

      <div style={styles.status}>
        {estado || "Sin estado"}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={styles.infoRow}>
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#eef4f1,#dce8e2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Arial,sans-serif"
  },

  loginCard: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "24px",
    padding: "45px",
    boxShadow: "0 20px 60px rgba(0,0,0,.10)"
  },

  logoCircle: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background: "#657f70",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 auto 20px"
  },

  title: {
    textAlign: "center",
    color: "#30463b"
  },

  subtitle: {
    textAlign: "center",
    color: "#7b8982",
    marginBottom: "35px"
  },

  label: {
    display: "block",
    marginTop: "18px",
    marginBottom: "8px",
    color: "#40534a",
    fontWeight: "bold"
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border: "1px solid #d5ddd8",
    borderRadius: "10px",
    fontSize: "15px"
  },

  button: {
    width: "100%",
    marginTop: "25px",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    background: "#657f70",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  },

  error: {
    color: "#b44b4b"
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
    fontFamily: "Arial,sans-serif"
  },

  header: {
    background: "#fff",
    padding: "22px 6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,.05)"
  },

  headerTitle: {
    margin: 0,
    color: "#30463b"
  },

  headerSubtitle: {
    color: "#89948f"
  },

  logout: {
    border: "1px solid #657f70",
    background: "#fff",
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

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap"
  },

  sectionTitle: {
    color: "#30463b"
  },

  welcome: {
    color: "#7b8982",
    lineHeight: "1.6"
  },

  printButton: {
    background: "#657f70",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "13px 20px",
    fontWeight: "bold",
    cursor: "pointer"
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

  infoBar: {
    background: "#e9f0ec",
    borderRadius: "14px",
    padding: "18px 20px",
    display: "flex",
    gap: "45px",
    flexWrap: "wrap",
    marginTop: "25px"
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    margin: "25px 0"
  },

  metricCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 5px 20px rgba(0,0,0,.05)"
  },

  bigNumber: {
    display: "block",
    fontSize: "34px",
    color: "#657f70",
    marginBottom: "8px"
  },

  metricLabel: {
    color: "#7b8982"
  },

  sectionHeading: {
    marginTop: "40px",
    marginBottom: "10px"
  },

  sectionHeading span: {
    color: "#657f70",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1px"
  },

  sectionHeading h2: {
    color: "#30463b"
  },

  panel: {
    background: "#fff",
    borderRadius: "18px",
    padding: "28px",
    marginTop: "20px",
    boxShadow: "0 5px 20px rgba(0,0,0,.05)"
  },

  sectionBadge: {
    color: "#657f70",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1px"
  },

  panelTitle: {
    color: "#30463b"
  },

  highlightBox: {
    background: "#f2f6f3",
    borderRadius: "14px",
    padding: "20px",
    color: "#40534a",
    lineHeight: "1.6"
  },

  textBox: {
    background: "#f7f9f8",
    borderRadius: "14px",
    padding: "20px",
    color: "#40534a",
    lineHeight: "1.6"
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px"
  },

  productivityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px"
  },

  productivityCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 5px 20px rgba(0,0,0,.05)"
  },

  productivityTitle: {
    color: "#657f70",
    fontWeight: "bold",
    fontSize: "12px",
    letterSpacing: "1px"
  },

  productivityResult: {
    display: "block",
    color: "#30463b",
    fontSize: "34px",
    margin: "15px 0"
  },

  status: {
    background: "#eef4f1",
    color: "#40534a",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold"
  },

  table: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,.05)",
    marginTop: "20px"
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "1.5fr 1fr 1fr 2fr",
    gap: "15px",
    padding: "16px",
    background: "#e9f0ec",
    color: "#40534a"
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns:
      "1.5fr 1fr 1fr 2fr",
    gap: "15px",
    padding: "18px",
    color: "#40534a"
  },

  infoRow: {
    display: "grid",
    gridTemplateColumns:
      "1fr 2fr",
    gap: "20px",
    padding: "16px",
    borderBottom: "1px solid #edf0ee",
    color: "#40534a"
  },

  auditGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    background: "#f7f9f8",
    borderRadius: "14px",
    padding: "20px"
  },

  history: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px"
  },

  historyItem: {
    display: "grid",
    gridTemplateColumns:
      "1fr auto 70px",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    background: "#fff",
    border: "1px solid #edf0ee",
    borderRadius: "12px"
  },

  score: {
    fontSize: "22px",
    color: "#657f70"
  },

  empty: {
    padding: "25px",
    textAlign: "center",
    color: "#89948f"
  },

  advisorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",
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
    margin: "5px 0",
    color: "#929c97",
    fontSize: "12px"
  },

  userNumber: {
    margin: 0,
    color: "#a0aaa5",
    fontSize: "11px"
  },

  futureBox: {
    background: "#eef4f1",
    borderRadius: "14px",
    padding: "20px",
    color: "#40534a"
  },

  printFooter: {
    textAlign: "center",
    color: "#a0aaa5",
    fontSize: "12px",
    marginTop: "40px",
    paddingBottom: "30px"
  }
};
