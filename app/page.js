"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL =
  "https://portal-calidad-api.ayelenvillega42.workers.dev";

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin123";

const initialReporte = {
  asesor_id: "",
  semana: "",
  nota: "",
  evolucion: "",
  objetivos: "",
  desvio_principal: "",
  recomendaciones: "",
  auditoria: "",
  producto: "",
  observaciones: "",
};

const NAV_ITEMS = [
  { id: "resumen", label: "Resumen", icon: "⌂" },
  { id: "productividad", label: "Productividad", icon: "↗" },
  { id: "calidad", label: "Calidad", icon: "✓" },
  { id: "plan", label: "Plan de acción", icon: "◎" },
  { id: "tipificaciones", label: "Tipificaciones", icon: "▤" },
  { id: "no-venta", label: "No venta", icon: "!" },
  { id: "devolucion", label: "Devolución", icon: "◌" },
  { id: "historial", label: "Historial", icon: "◷" },
];

export default function Home() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [sesion, setSesion] = useState(null);
  const [error, setError] = useState("");
  const [asesores, setAsesores] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [reportes, setReportes] = useState([]);
  const [productividad, setProductividad] = useState([]);
  const [tipificaciones, setTipificaciones] = useState([]);
  const [gestionCalidad, setGestionCalidad] = useState([]);
  const [auditoriasNoVenta, setAuditoriasNoVenta] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  const [seccionActiva, setSeccionActiva] = useState("resumen");

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [mensajeComentario, setMensajeComentario] = useState("");

  const [reporteForm, setReporteForm] = useState(initialReporte);
  const [guardandoReporte, setGuardandoReporte] = useState(false);
  const [mensajeReporte, setMensajeReporte] = useState("");

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
      setAsesores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  }

  async function cargarDatosAsesor(asesorId) {
    try {
      const resultados = await Promise.all([
        fetch(`${API_URL}/reportes?asesor_id=${asesorId}`),
        fetch(`${API_URL}/productividad?asesor_id=${asesorId}`),
        fetch(`${API_URL}/tipificaciones?asesor_id=${asesorId}`),
        fetch(`${API_URL}/gestion-calidad?asesor_id=${asesorId}`),
        fetch(`${API_URL}/auditorias-no-venta?asesor_id=${asesorId}`),
        fetch(`${API_URL}/comentarios?asesor_id=${asesorId}`),
      ]);

      const datos = await Promise.all(
        resultados.map(async (response) => {
          if (!response.ok) return [];

          try {
            const data = await response.json();
            return Array.isArray(data) ? data : [];
          } catch {
            return [];
          }
        })
      );

      setReportes(datos[0]);
      setProductividad(datos[1]);
      setTipificaciones(datos[2]);
      setGestionCalidad(datos[3]);
      setAuditoriasNoVenta(datos[4]);
      setComentarios(datos[5]);
    } catch (error) {
      console.error(error);

      setReportes([]);
      setProductividad([]);
      setTipificaciones([]);
      setGestionCalidad([]);
      setAuditoriasNoVenta([]);
      setComentarios([]);
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
        String(item.usuario_login || "").toLowerCase() ===
        usuarioIngresado
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
      id: asesor.id,
    });

    setSeccionActiva("resumen");
    cargarDatosAsesor(asesor.id);
  }

  function cerrarSesion() {
    setSesion(null);
    setUsuario("");
    setPassword("");
    setError("");
    setSeccionActiva("resumen");

    setReportes([]);
    setProductividad([]);
    setTipificaciones([]);
    setGestionCalidad([]);
    setAuditoriasNoVenta([]);
    setComentarios([]);

    setReporteForm(initialReporte);
    setMensajeReporte("");
    setMensajeComentario("");
  }

  async function guardarReporte() {
    if (!reporteForm.asesor_id || !reporteForm.semana) {
      setMensajeReporte(
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    setGuardandoReporte(true);
    setMensajeReporte("");

    try {
      const response = await fetch(`${API_URL}/reportes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asesor_id: Number(reporteForm.asesor_id),
          semana: reporteForm.semana,
          nota:
            reporteForm.nota === ""
              ? null
              : Number(reporteForm.nota),
          evolucion: reporteForm.evolucion,
          objetivos: reporteForm.objetivos,
          desvio_principal: reporteForm.desvio_principal,
          recomendaciones: reporteForm.recomendaciones,
          auditoria: reporteForm.auditoria,
          producto: reporteForm.producto,
          observaciones: reporteForm.observaciones,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo guardar el reporte."
        );
      }

      setMensajeReporte(
        "Reporte cargado correctamente."
      );

      setReporteForm(initialReporte);
    } catch (error) {
      console.error(error);

      setMensajeReporte(
        "Ocurrió un error al cargar el reporte."
      );
    } finally {
      setGuardandoReporte(false);
    }
  }

  async function enviarComentario() {
    if (!nuevoComentario.trim()) {
      return;
    }

    const ultimoReporte =
      reportes.length > 0 ? reportes[0] : null;

    if (!ultimoReporte) {
      setMensajeComentario(
        "Todavía no hay un reporte semanal disponible."
      );
      return;
    }

    setEnviandoComentario(true);
    setMensajeComentario("");

    try {
      const response = await fetch(`${API_URL}/comentarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asesor_id: sesion.id,
          semana: ultimoReporte.semana,
          tipo: "asesor",
          comentario: nuevoComentario.trim(),
          estado: "pendiente",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo guardar el comentario"
        );
      }

      setNuevoComentario("");
      setMensajeComentario(
        "Comentario enviado correctamente."
      );

      await cargarDatosAsesor(sesion.id);
    } catch (error) {
      console.error(error);

      setMensajeComentario(
        "No se pudo enviar el comentario."
      );
    } finally {
      setEnviandoComentario(false);
    }
  }

  function imprimirInforme() {
    window.print();
  }

  if (!sesion) {
    return (
      <Login
        usuario={usuario}
        password={password}
        error={error}
        cargando={cargando}
        setUsuario={setUsuario}
        setPassword={setPassword}
        iniciarSesion={iniciarSesion}
      />
    );
  }

  if (sesion.rol === "admin") {
    return (
      <AdminPanel
        asesores={asesores}
        reporteForm={reporteForm}
        setReporteForm={setReporteForm}
        guardarReporte={guardarReporte}
        guardandoReporte={guardandoReporte}
        mensajeReporte={mensajeReporte}
        cerrarSesion={cerrarSesion}
      />
    );
  }

  const ultimoReporte =
    reportes.length > 0 ? reportes[0] : null;

  const anteriorReporte =
    reportes.length > 1 ? reportes[1] : null;

  const ultimaProductividad =
    productividad.length > 0
      ? productividad[0]
      : null;

  const ultimaGestion =
    gestionCalidad.length > 0
      ? gestionCalidad[0]
      : null;

  const ultimaNoVenta =
    auditoriasNoVenta.length > 0
      ? auditoriasNoVenta[0]
      : null;

  const nombreMostrar =
    sesion.nombre.split(", ")[1] ||
    sesion.nombre;

  const notaActual =
    ultimoReporte?.nota !== null &&
    ultimoReporte?.nota !== undefined
      ? Number(ultimoReporte.nota)
      : null;

  const notaAnterior =
    anteriorReporte?.nota !== null &&
    anteriorReporte?.nota !== undefined
      ? Number(anteriorReporte.nota)
      : null;

  const variacionNota =
    notaActual !== null &&
    notaAnterior !== null
      ? notaActual - notaAnterior
      : null;

  return (
    <main style={styles.dashboard}>
      <header style={styles.header}>
        <div>
          <div style={styles.brandRow}>
            <div style={styles.smallLogo}>Q</div>

            <div>
              <h1 style={styles.headerTitle}>
                Portal de Calidad
              </h1>

              <p style={styles.headerSubtitle}>
                Mi espacio de seguimiento
              </p>
            </div>
          </div>
        </div>

        <div style={styles.headerButtons}>
          <button
            className="no-print"
            style={styles.printButton}
            onClick={imprimirInforme}
          >
            Imprimir informe
          </button>

          <button
            className="no-print"
            style={styles.logout}
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div style={styles.layout}>
        <aside
          className="sidebar"
          style={styles.sidebar}
        >
          <div style={styles.profileBox}>
            <div style={styles.profileAvatar}>
              {nombreMostrar.charAt(0)}
            </div>

            <strong>{nombreMostrar}</strong>

            <span>
              Usuario {sesion.numero_usuario}
            </span>
          </div>

          <nav style={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={
                  seccionActiva === item.id
                    ? "navActive"
                    : ""
                }
                style={{
                  ...styles.navButton,
                  ...(seccionActiva === item.id
                    ? styles.navButtonActive
                    : {}),
                }}
                onClick={() =>
                  setSeccionActiva(item.id)
                }
              >
                <span style={styles.navIcon}>
                  {item.icon}
                </span>

                {item.label}
              </button>
            ))}
          </nav>

          <div style={styles.sidebarFooter}>
            <span>Portal de Calidad</span>
            <small>Seguimiento semanal</small>
          </div>
        </aside>

        <section style={styles.mainContent}>
          <div style={styles.printHeader}>
            <h1>Informe semanal de desempeño</h1>
            <p>{sesion.nombre}</p>

            {ultimoReporte && (
              <p>{ultimoReporte.semana}</p>
            )}
          </div>

          {seccionActiva === "resumen" && (
            <Resumen
              nombreMostrar={nombreMostrar}
              sesion={sesion}
              ultimoReporte={ultimoReporte}
              anteriorReporte={anteriorReporte}
              notaActual={notaActual}
              notaAnterior={notaAnterior}
              variacionNota={variacionNota}
              ultimaProductividad={ultimaProductividad}
              setSeccionActiva={setSeccionActiva}
            />
          )}

          {seccionActiva === "productividad" && (
            <Productividad
              ultimaProductividad={ultimaProductividad}
            />
          )}

          {seccionActiva === "calidad" && (
            <Calidad
              ultimoReporte={ultimoReporte}
              ultimaGestion={ultimaGestion}
            />
          )}

          {seccionActiva === "plan" && (
            <PlanAccion
              ultimoReporte={ultimoReporte}
            />
          )}

          {seccionActiva === "tipificaciones" && (
            <Tipificaciones
              tipificaciones={tipificaciones}
            />
          )}

          {seccionActiva === "no-venta" && (
            <NoVenta
              ultimaNoVenta={ultimaNoVenta}
            />
          )}

          {seccionActiva === "devolucion" && (
            <Devolucion
              comentarios={comentarios}
              nuevoComentario={nuevoComentario}
              setNuevoComentario={setNuevoComentario}
              enviarComentario={enviarComentario}
              enviandoComentario={enviandoComentario}
              mensajeComentario={mensajeComentario}
            />
          )}

          {seccionActiva === "historial" && (
            <Historial reportes={reportes} />
          )}
        </section>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #f4f7f5;
        }

        button,
        input,
        textarea,
        select {
          font-family: Arial, sans-serif;
        }

        button {
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease,
            background 0.15s ease;
        }

        button:not(:disabled):hover {
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .navActive {
          box-shadow: inset 3px 0 0 #657f70;
        }

        @media print {
          body {
            background: white !important;
          }

          .no-print,
          .sidebar {
            display: none !important;
          }

          header {
            display: none !important;
          }

          .printHeader {
            display: block !important;
          }

          main {
            background: white !important;
          }

          .layout {
            display: block !important;
          }

          .mainContent {
            padding: 20px !important;
          }

          .panel {
            break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
        }

        @media screen {
          .printHeader {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            position: relative !important;
            width: 100% !important;
            height: auto !important;
          }

          .nav {
            display: grid !important;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .sidebarFooter {
            display: none !important;
          }

          .layout {
            display: block !important;
          }
        }

        @media (max-width: 600px) {
          .nav {
            grid-template-columns: 1fr !important;
          }

          .mainContent {
            padding: 20px 14px !important;
          }

          .header {
            padding: 18px !important;
          }

          .headerButtons {
            width: 100%;
          }

          .headerButtons button {
            flex: 1;
          }

          .dataCard {
            grid-template-columns: 1fr !important;
          }

          .historyItem {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function Login({
  usuario,
  password,
  error,
  cargando,
  setUsuario,
  setPassword,
  iniciarSesion,
}) {
  return (
    <main style={styles.loginPage}>
      <div style={styles.loginCard}>
        <div style={styles.logoCircle}>Q</div>

        <div style={styles.loginBadge}>
          CALIDAD
        </div>

        <h1 style={styles.title}>
          Portal de Calidad
        </h1>

        <p style={styles.subtitle}>
          Tu espacio personal para consultar
          desempeño, calidad y objetivos.
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
            <div style={styles.loginError}>
              {error}
            </div>
          )}

          <button
            style={styles.button}
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? "CARGANDO..."
              : "INGRESAR A MI PORTAL"}
          </button>
        </form>

        <div style={styles.loginHelp}>
          <strong>¿Necesitás ayuda?</strong>
          <span>
            Contactá al equipo de Calidad.
          </span>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   RESUMEN
========================================================= */

function Resumen({
  nombreMostrar,
  sesion,
  ultimoReporte,
  anteriorReporte,
  notaActual,
  notaAnterior,
  variacionNota,
  ultimaProductividad,
  setSeccionActiva,
}) {
  const estado = obtenerEstadoNota(notaActual);

  return (
    <>
      <div style={styles.pageIntro}>
        <div>
          <span style={styles.eyebrow}>
            RESUMEN SEMANAL
          </span>

          <h2 style={styles.pageTitle}>
            Hola, {nombreMostrar}
          </h2>

          <p style={styles.pageDescription}>
            Acá podés consultar tu desempeño,
            evolución y principales puntos de
            trabajo.
          </p>
        </div>

        <div style={styles.weekPill}>
          {ultimoReporte?.semana || "Sin reporte"}
        </div>
      </div>

      <div style={styles.infoBar}>
        <InfoMini
          titulo="N° DE USUARIO"
          valor={sesion.numero_usuario}
        />

        <InfoMini
          titulo="USUARIO"
          valor={sesion.usuario}
        />

        <InfoMini
          titulo="ÚLTIMO REPORTE"
          valor={ultimoReporte?.semana || "—"}
        />
      </div>

      <div style={styles.scoreGrid}>
        <div
          style={{
            ...styles.scoreCard,
            background: estado.fondo,
          }}
        >
          <div style={styles.scoreTop}>
            <span style={styles.scoreLabel}>
              MI NOTA
            </span>

            <span
              style={{
                ...styles.statusPill,
                background: estado.colorFondo,
                color: estado.color,
              }}
            >
              {estado.texto}
            </span>
          </div>

          <strong
            style={{
              ...styles.scoreNumber,
              color: estado.color,
            }}
          >
            {notaActual !== null
              ? notaActual
              : "—"}
          </strong>

          <span style={styles.scoreDescription}>
            Resultado de calidad
          </span>

          {variacionNota !== null ? (
            <div
              style={{
                ...styles.variation,
                color:
                  variacionNota > 0
                    ? "#3d7452"
                    : variacionNota < 0
                    ? "#a05b4b"
                    : "#65736c",
              }}
            >
              {variacionNota > 0
                ? "↗"
                : variacionNota < 0
                ? "↘"
                : "→"}{" "}
              {Math.abs(variacionNota)} puntos
              respecto de la semana anterior
            </div>
          ) : (
            <div style={styles.variationMuted}>
              Comparación disponible al cargar
              más de un reporte.
            </div>
          )}
        </div>

        <div style={styles.simpleMetricCard}>
          <span style={styles.cardIcon}>
            ↗
          </span>

          <span style={styles.simpleMetricLabel}>
            EVOLUCIÓN
          </span>

          <strong style={styles.simpleMetricValue}>
            {ultimoReporte?.evolucion || "—"}
          </strong>

          <span style={styles.simpleMetricHint}>
            Comparación semanal
          </span>
        </div>

        <div style={styles.simpleMetricCard}>
          <span style={styles.cardIcon}>
            ✓
          </span>

          <span style={styles.simpleMetricLabel}>
            PRODUCTIVIDAD
          </span>

          <strong style={styles.simpleMetricValue}>
            {ultimaProductividad?.ventas ??
              "—"}
          </strong>

          <span style={styles.simpleMetricHint}>
            Ventas registradas
          </span>
        </div>
      </div>

      <div style={styles.panel}>
        <SectionHeader
          badge="PRIORIDADES"
          title="¿En qué tengo que enfocarme?"
          description="Tus principales puntos de atención para esta semana."
        />

        <div style={styles.priorityGrid}>
          <PriorityCard
            icon="!"
            title="Punto de atención"
            value={
              ultimoReporte?.desvio_principal ||
              "Sin desvíos cargados"
            }
            type="attention"
          />

          <PriorityCard
            icon="✓"
            title="Objetivo"
            value={
              ultimoReporte?.objetivos ||
              "Sin objetivos cargados"
            }
            type="positive"
          />

          <PriorityCard
            icon="→"
            title="Recomendación"
            value={
              ultimoReporte?.recomendaciones ||
              "Sin recomendaciones cargadas"
            }
            type="neutral"
          />
        </div>
      </div>

      <div style={styles.quickGrid}>
        <QuickAccess
          icon="↗"
          title="Productividad"
          description="Consultá tus resultados."
          onClick={() =>
            setSeccionActiva("productividad")
          }
        />

        <QuickAccess
          icon="◎"
          title="Plan de acción"
          description="Revisá tus objetivos."
          onClick={() =>
            setSeccionActiva("plan")
          }
        />

        <QuickAccess
          icon="◌"
          title="Devolución"
          description="Dejá tu comentario a Calidad."
          onClick={() =>
            setSeccionActiva("devolucion")
          }
        />
      </div>

      {anteriorReporte && (
        <div style={styles.panel}>
          <SectionHeader
            badge="EVOLUCIÓN"
            title="Comparación con la semana anterior"
          />

          <div style={styles.comparison}>
            <ComparisonItem
              titulo="Semana anterior"
              valor={notaAnterior ?? "—"}
            />

            <div style={styles.comparisonArrow}>
              {variacionNota > 0
                ? "→"
                : variacionNota < 0
                ? "→"
                : "→"}
            </div>

            <ComparisonItem
              titulo="Semana actual"
              valor={notaActual ?? "—"}
              destacado
            />

            <div
              style={{
                ...styles.comparisonResult,
                color:
                  variacionNota > 0
                    ? "#3d7452"
                    : variacionNota < 0
                    ? "#a05b4b"
                    : "#65736c",
              }}
            >
              {variacionNota > 0
                ? `+${variacionNota}`
                : variacionNota}
              <small>puntos</small>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   PRODUCTIVIDAD
========================================================= */

function Productividad({
  ultimaProductividad,
}) {
  return (
    <>
      <PageTitle
        badge="PRODUCTIVIDAD"
        title="Mi desempeño semanal"
        description="Resultados de productividad y cumplimiento de objetivos."
      />

      <div style={styles.panel}>
        {!ultimaProductividad ? (
          <Empty text="Todavía no hay datos de productividad cargados." />
        ) : (
          <>
            <div style={styles.productivityGrid}>
              <MetricBox
                titulo="SPH"
                resultado={ultimaProductividad.sph}
                objetivo={
                  ultimaProductividad.sph_objetivo
                }
                estado={
                  ultimaProductividad.estado_sph
                }
              />

              <MetricBox
                titulo="VENTAS"
                resultado={ultimaProductividad.ventas}
                objetivo={
                  ultimaProductividad.ventas_objetivo
                }
                estado={
                  ultimaProductividad.estado_ventas
                }
              />

              <MetricBox
                titulo="OBJETIVO DE CAMPAÑA"
                resultado={
                  ultimaProductividad.objetivo_campana_descripcion ||
                  ultimaProductividad.objetivo_campana
                }
                objetivo={
                  ultimaProductividad.objetivo_campana
                }
                estado={
                  ultimaProductividad.estado_objetivo_campana
                }
              />
            </div>

            {ultimaProductividad.gestion_semana && (
              <div style={styles.managementBox}>
                <span style={styles.boxLabel}>
                  GESTIÓN DE LA SEMANA
                </span>

                <p>
                  {ultimaProductividad.gestion_semana}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

/* =========================================================
   CALIDAD
========================================================= */

function Calidad({
  ultimoReporte,
  ultimaGestion,
}) {
  return (
    <>
      <PageTitle
        badge="CALIDAD"
        title="Mi seguimiento de calidad"
        description="Auditorías, observaciones y gestión realizada."
      />

      <div style={styles.panel}>
        <SectionHeader
          badge="ÚLTIMA AUDITORÍA"
          title="Resultado de la auditoría"
        />

        {!ultimoReporte ? (
          <Empty text="Todavía no hay auditorías cargadas." />
        ) : (
          <div style={styles.auditBox}>
            <InfoItem
              titulo="Auditoría"
              valor={
                ultimoReporte.auditoria
              }
            />

            <InfoItem
              titulo="Producto"
              valor={
                ultimoReporte.producto
              }
            />

            <InfoItem
              titulo="Observaciones"
              valor={
                ultimoReporte.observaciones
              }
            />
          </div>
        )}
      </div>

      <div style={styles.panel}>
        <SectionHeader
          badge="GESTIÓN DE CALIDAD"
          title="Seguimiento de la gestión"
        />

        {!ultimaGestion ? (
          <Empty text="No hay información de gestión cargada." />
        ) : (
          <div style={styles.qualityGrid}>
            <InfoItem
              titulo="Cantidad de auditorías realizadas"
              valor={
                ultimaGestion.cantidad_auditorias
              }
            />

            <InfoItem
              titulo="Oportunidades de mejora"
              valor={
                ultimaGestion.oportunidades_mejora
              }
            />

            <InfoItem
              titulo="Coaching brindado"
              valor={
                ultimaGestion.coaching_brindado
              }
            />

            <InfoItem
              titulo="Registro en sistema"
              valor={
                ultimaGestion.registro_sistema
              }
            />

            <InfoItem
              titulo="Compromiso esperado"
              valor={
                ultimaGestion.compromiso_esperado
              }
            />

            <InfoItem
              titulo="Fortalezas destacadas"
              valor={
                ultimaGestion.fortalezas_destacadas
              }
            />
          </div>
        )}
      </div>
    </>
  );
}

/* =========================================================
   PLAN DE ACCIÓN
========================================================= */

function PlanAccion({
  ultimoReporte,
}) {
  return (
    <>
      <PageTitle
        badge="PLAN DE ACCIÓN"
        title="Mi plan de mejora"
        description="Los objetivos y acciones definidos para seguir creciendo."
      />

      {!ultimoReporte ? (
        <div style={styles.panel}>
          <Empty text="Todavía no hay un plan de acción cargado." />
        </div>
      ) : (
        <>
          <div style={styles.goalHero}>
            <div style={styles.goalIcon}>◎</div>

            <div>
              <span style={styles.goalLabel}>
                OBJETIVO DE LA SEMANA
              </span>

              <h2>
                {ultimoReporte.objetivos ||
                  "Sin objetivos cargados"}
              </h2>
            </div>
          </div>

          <div style={styles.twoColumns}>
            <div style={styles.panel}>
              <SectionHeader
                badge="ATENCIÓN"
                title="¿Qué tengo que trabajar?"
              />

              <div style={styles.focusContent}>
                <div
                  style={{
                    ...styles.focusIcon,
                    background: "#f7ece8",
                    color: "#a05b4b",
                  }}
                >
                  !
                </div>

                <h3>
                  {ultimoReporte.desvio_principal ||
                    "Sin desvíos cargados"}
                </h3>

                <p>
                  Este es el principal punto de
                  atención del período.
                </p>
              </div>
            </div>

            <div style={styles.panel}>
              <SectionHeader
                badge="RECOMENDACIÓN"
                title="¿Cómo puedo mejorarlo?"
              />

              <div style={styles.focusContent}>
                <div
                  style={{
                    ...styles.focusIcon,
                    background: "#e3f1e8",
                    color: "#3d7452",
                  }}
                >
                  ✓
                </div>

                <p style={styles.recommendation}>
                  {ultimoReporte.recomendaciones ||
                    "Sin recomendaciones cargadas"}
                </p>
              </div>
            </div>
          </div>

          <div style={styles.panel}>
            <SectionHeader
              badge="SEGUIMIENTO"
              title="Compromiso"
              description="Usá esta información como guía para tu próxima semana."
            />

            <div style={styles.commitmentBox}>
              <span>Mi foco:</span>

              <strong>
                {ultimoReporte.desvio_principal ||
                  "Continuar fortaleciendo la calidad."}
              </strong>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* =========================================================
   TIPIFICACIONES
========================================================= */

function Tipificaciones({
  tipificaciones,
}) {
  return (
    <>
      <PageTitle
        badge="TIPIFICACIONES"
        title="Seguimiento de tipificaciones"
        description="Visualizá tus principales desvíos y compromisos."
      />

      <div style={styles.panel}>
        {tipificaciones.length === 0 ? (
          <Empty text="No hay tipificaciones cargadas." />
        ) : (
          <div style={styles.dataList}>
            {tipificaciones.map((item) => (
              <div
                key={item.id}
                style={styles.dataCard}
              >
                <div>
                  <span style={styles.dataSmall}>
                    TIPIFICACIÓN
                  </span>

                  <strong>
                    {item.tipificacion ||
                      "Sin tipificación"}
                  </strong>

                  <p>
                    Semana: {item.semana}
                  </p>
                </div>

                <div style={styles.dataValue}>
                  <span style={styles.dataSmall}>
                    % DESVÍO
                  </span>

                  <strong>
                    {item.porcentaje_desvio ??
                      "—"}
                    {item.porcentaje_desvio !==
                      null &&
                    item.porcentaje_desvio !==
                      undefined
                      ? "%"
                      : ""}
                  </strong>
                </div>

                <div style={styles.dataValue}>
                  <span style={styles.dataSmall}>
                    OBJETIVO
                  </span>

                  <strong>
                    {item.objetivo ?? "—"}
                  </strong>
                </div>

                <div>
                  <span style={styles.dataSmall}>
                    COMPROMISO
                  </span>

                  <p>
                    {item.compromiso_esperado ||
                      "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* =========================================================
   NO VENTA
========================================================= */

function NoVenta({
  ultimaNoVenta,
}) {
  return (
    <>
      <PageTitle
        badge="AUDITORÍAS DE NO VENTA"
        title="Oportunidades detectadas"
        description="Análisis de oportunidades presentes en gestiones no concretadas."
      />

      <div style={styles.panel}>
        {!ultimaNoVenta ? (
          <Empty text="No hay auditorías de no venta cargadas." />
        ) : (
          <div style={styles.qualityGrid}>
            <InfoItem
              titulo="Cantidad de auditorías"
              valor={
                ultimaNoVenta.cantidad_auditorias
              }
            />

            <InfoItem
              titulo="Oportunidades detectadas"
              valor={
                ultimaNoVenta.oportunidades_detectadas
              }
            />

            <InfoItem
              titulo="Desvío principal"
              valor={
                ultimaNoVenta.desvio_principal
              }
            />

            <InfoItem
              titulo="Recomendaciones"
              valor={
                ultimaNoVenta.recomendaciones
              }
            />

            <InfoItem
              titulo="Compromiso esperado"
              valor={
                ultimaNoVenta.compromiso_esperado
              }
            />

            <InfoItem
              titulo="Observaciones"
              valor={
                ultimaNoVenta.observaciones
              }
            />
          </div>
        )}
      </div>
    </>
  );
}

/* =========================================================
   DEVOLUCIÓN
========================================================= */

function Devolucion({
  comentarios,
  nuevoComentario,
  setNuevoComentario,
  enviarComentario,
  enviandoComentario,
  mensajeComentario,
}) {
  const comentariosCalidad = comentarios.filter(
    (item) => item.tipo === "calidad"
  );

  const comentariosAsesor = comentarios.filter(
    (item) => item.tipo === "asesor"
  );

  return (
    <>
      <PageTitle
        badge="DEVOLUCIÓN"
        title="Comunicación con Calidad"
        description="Consultá la devolución recibida y dejá tus comentarios."
      />

      <div style={styles.panel}>
        <SectionHeader
          badge="DEVOLUCIÓN DE CALIDAD"
          title="Mensaje de Calidad"
        />

        {comentariosCalidad.length === 0 ? (
          <Empty text="Todavía no hay una devolución cargada." />
        ) : (
          comentariosCalidad.map((item) => (
            <div
              key={item.id}
              style={styles.commentQuality}
            >
              <div style={styles.commentHeader}>
                <strong>Calidad</strong>

                <small>
                  {item.fecha_carga}
                </small>
              </div>

              <p>{item.comentario}</p>
            </div>
          ))
        )}
      </div>

      <div style={styles.panel}>
        <SectionHeader
          badge="MI DEVOLUCIÓN"
          title="Quiero dejar un comentario"
          description="Podés dejar dudas, compromisos o comentarios sobre la devolución."
        />

        <textarea
          className="no-print"
          style={styles.textarea}
          placeholder="Escribí acá tu comentario..."
          value={nuevoComentario}
          onChange={(e) =>
            setNuevoComentario(e.target.value)
          }
        />

        <button
          className="no-print"
          style={styles.primaryButton}
          onClick={enviarComentario}
          disabled={enviandoComentario}
        >
          {enviandoComentario
            ? "ENVIANDO..."
            : "ENVIAR COMENTARIO"}
        </button>

        {mensajeComentario && (
          <p style={styles.successMessage}>
            {mensajeComentario}
          </p>
        )}
      </div>

      {comentariosAsesor.length > 0 && (
        <div style={styles.panel}>
          <SectionHeader
            badge="HISTORIAL"
            title="Mis comentarios anteriores"
          />

          {comentariosAsesor.map((item) => (
            <div
              key={item.id}
              style={styles.commentAdvisor}
            >
              <div style={styles.commentHeader}>
                <strong>Mi comentario</strong>

                <small>
                  {item.fecha_carga}
                </small>
              </div>

              <p>{item.comentario}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* =========================================================
   HISTORIAL
========================================================= */

function Historial({
  reportes,
}) {
  return (
    <>
      <PageTitle
        badge="SEGUIMIENTO"
        title="Historial de reportes"
        description="Consultá la evolución de tus resultados semana a semana."
      />

      <div style={styles.panel}>
        {reportes.length === 0 ? (
          <Empty text="Todavía no hay reportes cargados." />
        ) : (
          <div style={styles.history}>
            {reportes.map((reporte, index) => (
              <div
                key={reporte.id}
                style={{
                  ...styles.historyItem,
                  background:
                    index === 0
                      ? "#f2f6f3"
                      : "#ffffff",
                }}
              >
                <div>
                  <span style={styles.dataSmall}>
                    {index === 0
                      ? "REPORTE ACTUAL"
                      : "REPORTE ANTERIOR"}
                  </span>

                  <strong>
                    {reporte.semana}
                  </strong>

                  <p>
                    {reporte.desvio_principal ||
                      "Sin desvío principal"}
                  </p>
                </div>

                <strong
                  style={styles.historyScore}
                >
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
    </>
  );
}

/* =========================================================
   ADMIN
========================================================= */

function AdminPanel({
  asesores,
  reporteForm,
  setReporteForm,
  guardarReporte,
  guardandoReporte,
  mensajeReporte,
  cerrarSesion,
}) {
  return (
    <main style={styles.dashboard}>
      <header style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.smallLogo}>Q</div>

          <div>
            <h1 style={styles.headerTitle}>
              Portal de Calidad
            </h1>

            <p style={styles.headerSubtitle}>
              Panel de Administración
            </p>
          </div>
        </div>

        <button
          className="no-print"
          style={styles.logout}
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </header>

      <section style={styles.adminContent}>
        <div style={styles.pageIntro}>
          <div>
            <span style={styles.eyebrow}>
              ADMINISTRACIÓN
            </span>

            <h2 style={styles.pageTitle}>
              Panel de Calidad
            </h2>

            <p style={styles.pageDescription}>
              Desde acá podés administrar la
              información semanal del equipo.
            </p>
          </div>

          <div style={styles.adminStatus}>
            <span style={styles.onlineDot}></span>
            Base conectada
          </div>
        </div>

        <div style={styles.adminCards}>
          <AdminStat
            numero={asesores.length}
            texto="Asesores registrados"
          />

          <AdminStat
            numero="✓"
            texto="Sistema conectado"
          />

          <AdminStat
            numero="1"
            texto="Carga semanal"
          />
        </div>

        <div style={styles.panel}>
          <SectionHeader
            badge="CARGA SEMANAL"
            title="Cargar reporte de calidad"
            description="Seleccioná un asesor y completá la información correspondiente."
          />

          <div style={styles.adminForm}>
            <FormField label="Asesor">
              <select
                style={styles.input}
                value={reporteForm.asesor_id}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    asesor_id: e.target.value,
                  })
                }
              >
                <option value="">
                  Seleccionar asesor
                </option>

                {asesores.map((asesor) => (
                  <option
                    key={asesor.id}
                    value={asesor.id}
                  >
                    {asesor.nombre} —{" "}
                    {asesor.numero_usuario}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Semana">
              <input
                style={styles.input}
                type="text"
                placeholder="Ej: Semana 3 - Agosto"
                value={reporteForm.semana}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    semana: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Nota de calidad">
              <input
                style={styles.input}
                type="number"
                min="0"
                max="100"
                placeholder="Ej: 85"
                value={reporteForm.nota}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    nota: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Evolución">
              <input
                style={styles.input}
                type="text"
                placeholder="Ej: Mejora respecto de la semana anterior"
                value={reporteForm.evolucion}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    evolucion: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField
              label="Objetivos"
              full
            >
              <textarea
                style={styles.textarea}
                placeholder="¿Qué debe mejorar?"
                value={reporteForm.objetivos}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    objetivos: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Desvío principal">
              <input
                style={styles.input}
                type="text"
                placeholder="Ej: Validación de datos"
                value={
                  reporteForm.desvio_principal
                }
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    desvio_principal:
                      e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Recomendaciones">
              <textarea
                style={styles.textarea}
                placeholder="¿Cómo puede mejorarlo?"
                value={
                  reporteForm.recomendaciones
                }
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    recomendaciones:
                      e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Auditoría">
              <input
                style={styles.input}
                type="text"
                placeholder="Ej: Llamada auditada"
                value={reporteForm.auditoria}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    auditoria: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Producto">
              <input
                style={styles.input}
                type="text"
                placeholder="Ej: AP / BM"
                value={reporteForm.producto}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    producto: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField
              label="Observaciones"
              full
            >
              <textarea
                style={styles.textarea}
                placeholder="Observaciones adicionales"
                value={
                  reporteForm.observaciones
                }
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    observaciones:
                      e.target.value,
                  })
                }
              />
            </FormField>
          </div>

          <button
            className="no-print"
            style={styles.primaryButton}
            onClick={guardarReporte}
            disabled={guardandoReporte}
          >
            {guardandoReporte
              ? "GUARDANDO..."
              : "GUARDAR REPORTE"}
          </button>

          {mensajeReporte && (
            <p style={styles.successMessage}>
              {mensajeReporte}
            </p>
          )}
        </div>

        <div style={styles.panel}>
          <SectionHeader
            badge="EQUIPO"
            title="Asesores registrados"
            description="Equipo actualmente disponible en el portal."
          />

          <div style={styles.advisorGrid}>
            {asesores.map((asesor) => (
              <div
                key={asesor.id}
                style={styles.advisor}
              >
                <div style={styles.avatar}>
                  {String(
                    asesor.nombre || "A"
                  ).charAt(0)}
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
        </div>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f4f7f5;
        }

        button,
        input,
        textarea,
        select {
          font-family: Arial, sans-serif;
        }

        button {
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
        }

        button:not(:disabled):hover {
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.6;
        }

        @media print {
          .no-print {
            display: none !important;
          }
        }

        @media (max-width: 700px) {
          .adminContent {
            padding: 25px 15px !important;
          }

          .adminForm {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   COMPONENTES PEQUEÑOS
========================================================= */

function PageTitle({
  badge,
  title,
  description,
}) {
  return (
    <div style={styles.pageIntro}>
      <div>
        <span style={styles.eyebrow}>
          {badge}
        </span>

        <h2 style={styles.pageTitle}>
          {title}
        </h2>

        {description && (
          <p style={styles.pageDescription}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  badge,
  title,
  description,
}) {
  return (
    <div style={styles.sectionHeader}>
      <span style={styles.sectionBadge}>
        {badge}
      </span>

      <h2 style={styles.panelTitle}>
        {title}
      </h2>

      {description && (
        <p style={styles.paragraph}>
          {description}
        </p>
      )}
    </div>
  );
}

function InfoMini({
  titulo,
  valor,
}) {
  return (
    <div style={styles.infoMini}>
      <span>{titulo}</span>
      <strong>{valor || "—"}</strong>
    </div>
  );
}

function PriorityCard({
  icon,
  title,
  value,
  type,
}) {
  const config = {
    attention: {
      background: "#fff8f5",
      iconBackground: "#f7ece8",
      iconColor: "#a05b4b",
    },
    positive: {
      background: "#f5faf7",
      iconBackground: "#e3f1e8",
      iconColor: "#3d7452",
    },
    neutral: {
      background: "#f7f9f8",
      iconBackground: "#e9f0ec",
      iconColor: "#657f70",
    },
  };

  const current = config[type];

  return (
    <div
      style={{
        ...styles.priorityCard,
        background: current.background,
      }}
    >
      <div
        style={{
          ...styles.priorityIcon,
          background: current.iconBackground,
          color: current.iconColor,
        }}
      >
        {icon}
      </div>

      <div>
        <span style={styles.priorityTitle}>
          {title}
        </span>

        <strong style={styles.priorityValue}>
          {value}
        </strong>
      </div>
    </div>
  );
}

function QuickAccess({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      className="no-print"
      style={styles.quickCard}
      onClick={onClick}
    >
      <span style={styles.quickIcon}>
        {icon}
      </span>

      <span style={styles.quickTitle}>
        {title}
      </span>

      <span style={styles.quickDescription}>
        {description}
      </span>

      <span style={styles.quickArrow}>
        →
      </span>
    </button>
  );
}

function ComparisonItem({
  titulo,
  valor,
  destacado,
}) {
  return (
    <div
      style={{
        ...styles.comparisonItem,
        ...(destacado
          ? styles.comparisonItemActive
          : {}),
      }}
    >
      <span>{titulo}</span>

      <strong>{valor}</strong>
    </div>
  );
}

function MetricBox({
  titulo,
  resultado,
  objetivo,
  estado,
}) {
  const alcanzado =
    estado &&
    (estado
      .toLowerCase()
      .includes("alcanz") ||
      estado
        .toLowerCase()
        .includes("cumpl"));

  return (
    <div style={styles.metricBox}>
      <span style={styles.metricBoxTitle}>
        {titulo}
      </span>

      <strong style={styles.metricResult}>
        {resultado ?? "—"}
      </strong>

      <div style={styles.metricTarget}>
        Objetivo:{" "}
        <strong>
          {objetivo ?? "—"}
        </strong>
      </div>

      <div
        style={{
          ...styles.status,
          background: alcanzado
            ? "#e3f1e8"
            : "#f7ece8",
          color: alcanzado
            ? "#3d7452"
            : "#a05b4b",
        }}
      >
        {estado || "Sin estado"}
      </div>
    </div>
  );
}

function InfoItem({
  titulo,
  valor,
}) {
  return (
    <div style={styles.infoItem}>
      <small>{titulo}</small>

      <strong>
        {valor || "—"}
      </strong>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={styles.empty}>
      <div style={styles.emptyCircle}>
        —
      </div>

      <p>{text}</p>
    </div>
  );
}

function FormField({
  label,
  children,
  full,
}) {
  return (
    <div
      style={{
        ...styles.formGroup,
        ...(full
          ? styles.formGroupFull
          : {}),
      }}
    >
      <label style={styles.formLabel}>
        {label}
      </label>

      {children}
    </div>
  );
}

function AdminStat({
  numero,
  texto,
}) {
  return (
    <div style={styles.adminStat}>
      <strong>{numero}</strong>
      <span>{texto}</span>
    </div>
  );
}

/* =========================================================
   FUNCIONES
========================================================= */

function obtenerEstadoNota(nota) {
  if (nota === null || nota === undefined) {
    return {
      texto: "SIN DATOS",
      color: "#65736c",
      colorFondo: "#e9f0ec",
      fondo: "#f7f9f8",
    };
  }

  if (nota >= 80) {
    return {
      texto: "MUY BUEN RESULTADO",
      color: "#3d7452",
      colorFondo: "#dfeee5",
      fondo: "#f3f9f5",
    };
  }

  if (nota >= 60) {
    return {
      texto: "EN SEGUIMIENTO",
      color: "#8a7141",
      colorFondo: "#f4ecd9",
      fondo: "#fcfaf4",
    };
  }

  return {
    texto: "PRIORIDAD DE MEJORA",
    color: "#a05b4b",
    colorFondo: "#f7e8e3",
    fondo: "#fff8f5",
  };
}

/* =========================================================
   ESTILOS
========================================================= */

const styles = {
  loginPage: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eef4f1 0%, #dce8e2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },

  loginCard: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "45px",
    boxShadow:
      "0 25px 70px rgba(48,70,59,0.13)",
  },

  logoCircle: {
    width: "68px",
    height: "68px",
    borderRadius: "20px",
    background: "#657f70",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "29px",
    fontWeight: "bold",
    margin: "0 auto 15px",
    boxShadow:
      "0 10px 25px rgba(101,127,112,0.25)",
  },

  loginBadge: {
    textAlign: "center",
    color: "#657f70",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "2px",
    marginBottom: "8px",
  },

  title: {
    textAlign: "center",
    margin: 0,
    color: "#30463b",
    fontSize: "29px",
  },

  subtitle: {
    textAlign: "center",
    color: "#7b8982",
    marginBottom: "35px",
    lineHeight: "1.6",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#40534a",
    fontWeight: "bold",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    padding: "14px",
    border:
      "1px solid #d5ddd8",
    borderRadius: "11px",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "15px",
    border:
      "1px solid #d5ddd8",
    borderRadius: "11px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    lineHeight: "1.5",
  },

  button: {
    width: "100%",
    marginTop: "25px",
    padding: "15px",
    border: "none",
    borderRadius: "11px",
    background: "#657f70",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  loginError: {
    background: "#fff3f0",
    color: "#a05b4b",
    borderRadius: "10px",
    padding: "12px",
    marginTop: "15px",
    fontSize: "13px",
  },

  loginHelp: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    textAlign: "center",
    color: "#89948f",
    fontSize: "12px",
    marginTop: "25px",
  },

  dashboard: {
    minHeight: "100vh",
    background: "#f4f7f5",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    background: "#ffffff",
    padding: "18px 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    boxShadow:
      "0 2px 12px rgba(0,0,0,0.04)",
    position: "relative",
    zIndex: 5,
  },

  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  smallLogo: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#657f70",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "19px",
  },

  headerTitle: {
    margin: 0,
    color: "#30463b",
    fontSize: "21px",
  },

  headerSubtitle: {
    margin: "4px 0 0",
    color: "#89948f",
    fontSize: "12px",
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  printButton: {
    padding: "10px 17px",
    border: "none",
    borderRadius: "9px",
    background: "#657f70",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "12px",
  },

  logout: {
    border:
      "1px solid #657f70",
    background: "white",
    color: "#657f70",
    padding: "9px 16px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px",
  },

  layout: {
    display: "flex",
    minHeight: "calc(100vh - 80px)",
  },

  sidebar: {
    width: "245px",
    flexShrink: 0,
    background: "#ffffff",
    borderRight:
      "1px solid #e8eeea",
    padding: "25px 15px",
    position: "sticky",
    top: 0,
    height: "calc(100vh - 80px)",
    display: "flex",
    flexDirection: "column",
  },

  profileBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "5px",
    paddingBottom: "22px",
    borderBottom:
      "1px solid #edf0ee",
    marginBottom: "18px",
    color: "#30463b",
  },

  profileAvatar: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    background: "#dce8e2",
    color: "#40534a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    fontWeight: "bold",
    marginBottom: "7px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  navButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "12px 13px",
    border: "none",
    background: "transparent",
    color: "#65736c",
    borderRadius: "9px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "13px",
  },

  navButtonActive: {
    background: "#edf4ef",
    color: "#30463b",
    fontWeight: "bold",
  },

  navIcon: {
    width: "23px",
    textAlign: "center",
    fontSize: "16px",
    color: "#657f70",
  },

  sidebarFooter: {
    marginTop: "auto",
    padding: "15px 10px 0",
    borderTop:
      "1px solid #edf0ee",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    color: "#657f70",
    fontSize: "11px",
  },

  mainContent: {
    flex: 1,
    maxWidth: "1180px",
    width: "100%",
    margin: "0 auto",
    padding: "38px 32px 60px",
  },

  adminContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 25px 60px",
  },

  printHeader: {
    background: "#eef4f1",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px",
  },

  pageIntro: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "25px",
  },

  eyebrow: {
    display: "block",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "1.8px",
    color: "#657f70",
    marginBottom: "8px",
  },

  pageTitle: {
    margin: 0,
    color: "#30463b",
    fontSize: "29px",
  },

  pageDescription: {
    margin: "8px 0 0",
    color: "#7b8982",
    lineHeight: "1.5",
    fontSize: "14px",
  },

  weekPill: {
    padding: "10px 15px",
    borderRadius: "30px",
    background: "#e9f0ec",
    color: "#40534a",
    fontWeight: "bold",
    fontSize: "12px",
  },

  infoBar: {
    background: "#e9f0ec",
    borderRadius: "14px",
    padding: "14px 18px",
    display: "flex",
    gap: "45px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },

  infoMini: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  scoreGrid: {
    display: "grid",
    gridTemplateColumns:
      "1.25fr 1fr 1fr",
    gap: "18px",
    marginBottom: "22px",
  },

  scoreCard: {
    borderRadius: "18px",
    padding: "25px",
    minHeight: "210px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
  },

  scoreTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  scoreLabel: {
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1.2px",
    color: "#65736c",
  },

  statusPill: {
    borderRadius: "30px",
    padding: "7px 10px",
    fontSize: "9px",
    fontWeight: "bold",
  },

  scoreNumber: {
    display: "block",
    fontSize: "62px",
    marginTop: "17px",
    lineHeight: 1,
  },

  scoreDescription: {
    display: "block",
    color: "#89948f",
    marginTop: "8px",
    fontSize: "12px",
  },

  variation: {
    marginTop: "18px",
    fontWeight: "bold",
    fontSize: "12px",
  },

  variationMuted: {
    marginTop: "18px",
    color: "#89948f",
    fontSize: "11px",
  },

  simpleMetricCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
    minHeight: "210px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
  },

  cardIcon: {
    fontSize: "23px",
    color: "#657f70",
    marginBottom: "17px",
  },

  simpleMetricLabel: {
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "1.3px",
    color: "#89948f",
  },

  simpleMetricValue: {
    display: "block",
    fontSize: "21px",
    color: "#30463b",
    lineHeight: "1.35",
    marginTop: "12px",
  },

  simpleMetricHint: {
    color: "#a0aaa5",
    fontSize: "11px",
    marginTop: "auto",
  },

  panel: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "27px",
    marginTop: "22px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
  },

  sectionHeader: {
    marginBottom: "20px",
  },

  sectionBadge: {
    display: "inline-block",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "1.4px",
    color: "#657f70",
    marginBottom: "5px",
  },

  panelTitle: {
    color: "#30463b",
    margin: "5px 0 0",
    fontSize: "20px",
  },

  paragraph: {
    color: "#65736c",
    lineHeight: "1.6",
    fontSize: "13px",
    marginBottom: 0,
  },

  priorityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "14px",
  },

  priorityCard: {
    display: "flex",
    gap: "13px",
    alignItems: "flex-start",
    padding: "18px",
    borderRadius: "14px",
  },

  priorityIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  priorityTitle: {
    display: "block",
    fontSize: "10px",
    color: "#89948f",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: "7px",
  },

  priorityValue: {
    display: "block",
    color: "#40534a",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "22px",
  },

  quickCard: {
    border: "1px solid #e6ece8",
    background: "#ffffff",
    borderRadius: "15px",
    padding: "18px",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },

  quickIcon: {
    color: "#657f70",
    fontSize: "20px",
    marginBottom: "10px",
  },

  quickTitle: {
    color: "#30463b",
    fontWeight: "bold",
    fontSize: "14px",
  },

  quickDescription: {
    color: "#89948f",
    fontSize: "11px",
    marginTop: "5px",
  },

  quickArrow: {
    position: "absolute",
    right: "17px",
    top: "17px",
    color: "#657f70",
  },

  comparison: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },

  comparisonItem: {
    background: "#f7f9f8",
    borderRadius: "14px",
    padding: "18px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: "160px",
  },

  comparisonItemActive: {
    background: "#eaf2ed",
  },

  comparisonArrow: {
    fontSize: "25px",
    color: "#657f70",
  },

  comparisonResult: {
    fontSize: "24px",
    fontWeight: "bold",
  },

  productivityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "17px",
  },

  metricBox: {
    border:
      "1px solid #e5ebe7",
    borderRadius: "15px",
    padding: "22px",
    background: "#fafcfb",
  },

  metricBoxTitle: {
    display: "block",
    fontSize: "11px",
    fontWeight: "bold",
    color: "#657f70",
    letterSpacing: "1px",
  },

  metricResult: {
    display: "block",
    fontSize: "31px",
    color: "#30463b",
    margin: "10px 0",
  },

  metricTarget: {
    color: "#89948f",
    fontSize: "13px",
  },

  status: {
    display: "inline-block",
    marginTop: "15px",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "bold",
  },

  managementBox: {
    background: "#f2f6f3",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "20px",
    color: "#40534a",
  },

  boxLabel: {
    display: "block",
    color: "#657f70",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "1px",
    marginBottom: "8px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  goalHero: {
    background:
      "linear-gradient(135deg, #eaf2ed, #f5f9f6)",
    borderRadius: "18px",
    padding: "28px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "22px",
  },

  goalIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    background: "#657f70",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    flexShrink: 0,
  },

  goalLabel: {
    display: "block",
    color: "#657f70",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "1.3px",
  },

  focusContent: {
    textAlign: "center",
    padding: "10px",
  },

  focusIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    margin: "0 auto 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "bold",
  },

  recommendation: {
    color: "#40534a",
    lineHeight: "1.6",
  },

  commitmentBox: {
    background: "#f7f9f8",
    borderRadius: "13px",
    padding: "18px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    color: "#40534a",
  },

  auditBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  qualityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "15px",
  },

  infoItem: {
    padding: "18px",
    background: "#f7f9f8",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  dataList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  dataCard: {
    display: "grid",
    gridTemplateColumns:
      "1.5fr .7fr .7fr 1.5fr",
    gap: "20px",
    alignItems: "center",
    padding: "18px",
    border:
      "1px solid #e7ece9",
    borderRadius: "13px",
    background: "#fafcfb",
  },

  dataValue: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  dataSmall: {
    display: "block",
    fontSize: "9px",
    color: "#89948f",
    fontWeight: "bold",
    letterSpacing: "1px",
    marginBottom: "6px",
  },

  commentQuality: {
    background: "#eaf2ed",
    borderRadius: "13px",
    padding: "17px",
    marginTop: "10px",
  },

  commentAdvisor: {
    background: "#ffffff",
    border:
      "1px solid #dce8e2",
    borderRadius: "13px",
    padding: "17px",
    marginTop: "10px",
  },

  commentHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    alignItems: "center",
    color: "#40534a",
  },

  primaryButton: {
    marginTop: "18px",
    padding: "13px 22px",
    border: "none",
    borderRadius: "10px",
    background: "#657f70",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  successMessage: {
    color: "#3d7452",
    fontWeight: "bold",
    fontSize: "13px",
  },

  empty: {
    textAlign: "center",
    padding: "35px 20px",
    color: "#89948f",
  },

  emptyCircle: {
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
  },

  history: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  historyItem: {
    display: "grid",
    gridTemplateColumns:
      "1fr auto 80px",
    alignItems: "center",
    gap: "15px",
    padding: "17px",
    border:
      "1px solid #edf0ee",
    borderRadius: "12px",
  },

  historyScore: {
    fontSize: "25px",
    color: "#657f70",
  },

  adminStatus: {
    background: "#eaf2ed",
    color: "#3d7452",
    padding: "9px 13px",
    borderRadius: "30px",
    fontSize: "11px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  onlineDot: {
    width: "7px",
    height: "7px",
    background: "#3d7452",
    borderRadius: "50%",
    display: "inline-block",
  },

  adminCards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "17px",
    marginBottom: "22px",
  },

  adminStat: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "22px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  adminForm: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  formGroupFull: {
    gridColumn: "1 / -1",
  },

  formLabel: {
    color: "#40534a",
    fontWeight: "bold",
    fontSize: "12px",
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
    padding: "14px",
    border:
      "1px solid #edf0ee",
    borderRadius: "12px",
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
    fontWeight: "bold",
    flexShrink: 0,
  },

  username: {
    margin: "5px 0 0",
    color: "#929c97",
    fontSize: "12px",
  },

  userNumber: {
    margin: "3px 0 0",
    color: "#a0aaa5",
    fontSize: "11px",
  },
};
