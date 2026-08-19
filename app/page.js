"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL =
  "https://portal-calidad-api.ayelenvillega42.workers.dev";

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin123";

const EMPTY_REPORT = {
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

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [mensajeComentario, setMensajeComentario] = useState("");

  const [reporteForm, setReporteForm] = useState(EMPTY_REPORT);
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
      const respuestas = await Promise.all([
        fetch(`${API_URL}/reportes?asesor_id=${asesorId}`),
        fetch(`${API_URL}/productividad?asesor_id=${asesorId}`),
        fetch(`${API_URL}/tipificaciones?asesor_id=${asesorId}`),
        fetch(`${API_URL}/gestion-calidad?asesor_id=${asesorId}`),
        fetch(`${API_URL}/auditorias-no-venta?asesor_id=${asesorId}`),
        fetch(`${API_URL}/comentarios?asesor_id=${asesorId}`),
      ]);

      const datos = await Promise.all(
        respuestas.map(async (response) => {
          if (!response.ok) return [];
          const data = await response.json();
          return Array.isArray(data) ? data : [];
        })
      );

      setReportes(ordenarReportes(datos[0]));
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

  function ordenarReportes(lista) {
    return [...lista].sort((a, b) => {
      const da = a.created_at || a.fecha_carga || "";
      const db = b.created_at || b.fecha_carga || "";

      if (da && db) {
        return new Date(db) - new Date(da);
      }

      return Number(b.id || 0) - Number(a.id || 0);
    });
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

    cargarDatosAsesor(asesor.id);
  }

  function cerrarSesion() {
    setSesion(null);
    setUsuario("");
    setPassword("");
    setError("");

    setReportes([]);
    setProductividad([]);
    setTipificaciones([]);
    setGestionCalidad([]);
    setAuditoriasNoVenta([]);
    setComentarios([]);

    setReporteForm(EMPTY_REPORT);
    setMensajeReporte("");
    setMensajeComentario("");
  }

  async function guardarReporte() {
    if (!reporteForm.asesor_id || !reporteForm.semana) {
      setMensajeReporte("Seleccioná un asesor y una semana.");
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

      setMensajeReporte("Reporte cargado correctamente.");
      setReporteForm(EMPTY_REPORT);
    } catch (error) {
      console.error(error);
      setMensajeReporte("Ocurrió un error al cargar el reporte.");
    } finally {
      setGuardandoReporte(false);
    }
  }

  async function enviarComentario() {
    if (!nuevoComentario.trim()) return;

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
        "Tu comentario fue enviado correctamente."
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
        setUsuario={setUsuario}
        setPassword={setPassword}
        error={error}
        iniciarSesion={iniciarSesion}
        cargando={cargando}
      />
    );
  }

  if (sesion.rol === "admin") {
    return (
      <AdminPanel
        asesores={asesores}
        cerrarSesion={cerrarSesion}
        reporteForm={reporteForm}
        setReporteForm={setReporteForm}
        guardarReporte={guardarReporte}
        guardandoReporte={guardandoReporte}
        mensajeReporte={mensajeReporte}
      />
    );
  }

  return (
    <AdvisorDashboard
      sesion={sesion}
      reportes={reportes}
      productividad={productividad}
      tipificaciones={tipificaciones}
      gestionCalidad={gestionCalidad}
      auditoriasNoVenta={auditoriasNoVenta}
      comentarios={comentarios}
      nuevoComentario={nuevoComentario}
      setNuevoComentario={setNuevoComentario}
      enviarComentario={enviarComentario}
      enviandoComentario={enviandoComentario}
      mensajeComentario={mensajeComentario}
      cerrarSesion={cerrarSesion}
      imprimirInforme={imprimirInforme}
    />
  );
}

/* =========================================================
   LOGIN
========================================================= */

function Login({
  usuario,
  password,
  setUsuario,
  setPassword,
  error,
  iniciarSesion,
  cargando,
}) {
  return (
    <main className="login-page">
      <div className="login-decoration decoration-one" />
      <div className="login-decoration decoration-two" />

      <div className="login-card">
        <div className="brand-mark">Q</div>

        <div className="login-eyebrow">
          CALIDAD · SEGUIMIENTO · EVOLUCIÓN
        </div>

        <h1>Portal de Calidad</h1>

        <p className="login-description">
          Tu espacio personal para consultar resultados,
          evolución y oportunidades de mejora.
        </p>

        <form onSubmit={iniciarSesion}>
          <label>Usuario</label>

          <div className="input-wrapper">
            <span>◉</span>
            <input
              type="text"
              placeholder="Ingresá tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <label>Contraseña</label>

          <div className="input-wrapper">
            <span>●</span>
            <input
              type="password"
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button className="login-button" type="submit">
            {cargando ? "CARGANDO..." : "INGRESAR A MI PORTAL"}
            <span>→</span>
          </button>
        </form>

        <div className="login-footer">
          ¿Necesitás ayuda? Contactá al equipo de Calidad.
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   ADMIN
========================================================= */

function AdminPanel({
  asesores,
  cerrarSesion,
  reporteForm,
  setReporteForm,
  guardarReporte,
  guardandoReporte,
  mensajeReporte,
}) {
  return (
    <main className="app">
      <header className="topbar no-print">
        <div className="brand">
          <div className="brand-small">Q</div>
          <div>
            <strong>Portal de Calidad</strong>
            <span>Panel de administración</span>
          </div>
        </div>

        <button className="logout-button" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <section className="admin-content">
        <div className="admin-hero">
          <div>
            <span className="eyebrow">PANEL DE CONTROL</span>
            <h1>Administración de Calidad</h1>
            <p>
              Desde acá podés cargar y actualizar la información
              semanal de cada integrante del equipo.
            </p>
          </div>

          <div className="admin-hero-icon">✦</div>
        </div>

        <div className="admin-stat-grid">
          <AdminStat
            number={asesores.length}
            title="Asesores registrados"
            subtitle="Equipo activo"
          />

          <AdminStat
            number="∞"
            title="Reportes"
            subtitle="Seguimiento semanal"
          />

          <AdminStat
            number="✓"
            title="Conectado"
            subtitle="Base de datos"
          />
        </div>

        <section className="admin-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CARGA SEMANAL</span>
              <h2>Nuevo reporte de calidad</h2>
            </div>
            <div className="heading-icon">＋</div>
          </div>

          <p className="section-description">
            Completá la información del asesor para que quede
            disponible automáticamente en su portal.
          </p>

          <div className="admin-form">
            <FormField label="Asesor">
              <select
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
                  <option key={asesor.id} value={asesor.id}>
                    {asesor.nombre} — {asesor.numero_usuario}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Semana">
              <input
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
                type="text"
                placeholder="Ej: +8 puntos respecto de la semana anterior"
                value={reporteForm.evolucion}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    evolucion: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Desvío principal">
              <input
                type="text"
                placeholder="Ej: Validación de datos"
                value={reporteForm.desvio_principal}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    desvio_principal: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Producto">
              <input
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

            <FormField label="Auditoría">
              <input
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

            <FormField label="Objetivos" full>
              <textarea
                placeholder="¿Qué debe trabajar el asesor?"
                value={reporteForm.objetivos}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    objetivos: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Recomendaciones" full>
              <textarea
                placeholder="¿Cómo puede mejorar?"
                value={reporteForm.recomendaciones}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    recomendaciones: e.target.value,
                  })
                }
              />
            </FormField>

            <FormField label="Observaciones" full>
              <textarea
                placeholder="Observaciones adicionales"
                value={reporteForm.observaciones}
                onChange={(e) =>
                  setReporteForm({
                    ...reporteForm,
                    observaciones: e.target.value,
                  })
                }
              />
            </FormField>
          </div>

          <div className="form-actions">
            <button
              className="primary-button"
              onClick={guardarReporte}
              disabled={guardandoReporte}
            >
              {guardandoReporte
                ? "GUARDANDO..."
                : "GUARDAR REPORTE"}
              <span>→</span>
            </button>

            {mensajeReporte && (
              <span
                className={
                  mensajeReporte.includes("correctamente")
                    ? "success-text"
                    : "error-text"
                }
              >
                {mensajeReporte}
              </span>
            )}
          </div>
        </section>

        <section className="admin-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EQUIPO</span>
              <h2>Asesores registrados</h2>
            </div>
          </div>

          <div className="advisor-admin-grid">
            {asesores.map((asesor) => (
              <div className="advisor-admin-card" key={asesor.id}>
                <div className="advisor-avatar">
                  {String(asesor.nombre || "?").charAt(0)}
                </div>

                <div>
                  <strong>{asesor.nombre}</strong>
                  <span>
                    Usuario: {asesor.usuario_login}
                  </span>
                  <small>
                    N° {asesor.numero_usuario}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function AdminStat({ number, title, subtitle }) {
  return (
    <div className="admin-stat">
      <strong>{number}</strong>
      <span>{title}</span>
      <small>{subtitle}</small>
    </div>
  );
}

function FormField({ label, children, full = false }) {
  return (
    <div className={full ? "form-field full" : "form-field"}>
      <label>{label}</label>
      {children}
    </div>
  );
}

/* =========================================================
   DASHBOARD ASESOR
========================================================= */

function AdvisorDashboard({
  sesion,
  reportes,
  productividad,
  tipificaciones,
  gestionCalidad,
  auditoriasNoVenta,
  comentarios,
  nuevoComentario,
  setNuevoComentario,
  enviarComentario,
  enviandoComentario,
  mensajeComentario,
  cerrarSesion,
  imprimirInforme,
}) {
  const ultimoReporte =
    reportes.length > 0 ? reportes[0] : null;

  const ultimaProductividad =
    productividad.length > 0 ? productividad[0] : null;

  const ultimaGestion =
    gestionCalidad.length > 0 ? gestionCalidad[0] : null;

  const ultimaNoVenta =
    auditoriasNoVenta.length > 0
      ? auditoriasNoVenta[0]
      : null;

  const nombreMostrar =
    sesion.nombre?.split(", ")[1] || sesion.nombre;

  const nota = Number(ultimoReporte?.nota);

  const evolucionNumerica = obtenerEvolucionNumerica(
    ultimoReporte?.evolucion
  );

  const historialGrafico = useMemo(() => {
    return [...reportes]
      .reverse()
      .slice(-6)
      .map((reporte) => ({
        semana: reporte.semana,
        nota: Number(reporte.nota),
      }))
      .filter((item) => !Number.isNaN(item.nota));
  }, [reportes]);

  return (
    <main className="app">
      <header className="topbar no-print">
        <div className="brand">
          <div className="brand-small">Q</div>

          <div>
            <strong>Portal de Calidad</strong>
            <span>Mi espacio de seguimiento</span>
          </div>
        </div>

        <div className="top-actions">
          <button
            className="print-button"
            onClick={imprimirInforme}
          >
            Imprimir informe
          </button>

          <button
            className="logout-button"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <nav className="section-nav no-print">
        <a href="#resumen">⌂ Resumen</a>
        <a href="#productividad">↗ Productividad</a>
        <a href="#calidad">✓ Calidad</a>
        <a href="#plan">◎ Plan de acción</a>
        <a href="#tipificaciones">▤ Tipificaciones</a>
        <a href="#noventa">! No venta</a>
        <a href="#devolucion">◌ Devolución</a>
        <a href="#historial">◷ Historial</a>
      </nav>

      <section className="dashboard-content">
        <div className="print-header">
          <h1>Informe semanal de desempeño</h1>
          <p>{sesion.nombre}</p>
          <p>{ultimoReporte?.semana || "Seguimiento semanal"}</p>
        </div>

        <section id="resumen" className="welcome-section">
          <div>
            <span className="eyebrow">
              SEGUIMIENTO SEMANAL
            </span>

            <h1>
              Hola, {nombreMostrar}
            </h1>

            <p>
              Acá podés consultar tus resultados, ver tu
              evolución y saber exactamente en qué enfocarte.
            </p>
          </div>

          <div className="welcome-badge">
            <span>ASESOR</span>
            <strong>{sesion.numero_usuario}</strong>
          </div>
        </section>

        <div className="identity-bar">
          <div>
            <span>N° USUARIO</span>
            <strong>{sesion.numero_usuario}</strong>
          </div>

          <div>
            <span>USUARIO</span>
            <strong>{sesion.usuario}</strong>
          </div>

          <div>
            <span>ÚLTIMO REPORTE</span>
            <strong>
              {ultimoReporte?.semana || "—"}
            </strong>
          </div>
        </div>

        {/* METRICAS PRINCIPALES */}

        <div className="main-metrics">
          <MetricCard
            icon="★"
            label="MI NOTA"
            value={
              ultimoReporte?.nota !== undefined &&
              ultimoReporte?.nota !== null
                ? `${ultimoReporte.nota}%`
                : "—"
            }
            description="Resultado de calidad"
            highlight
          />

          <MetricCard
            icon="↗"
            label="EVOLUCIÓN"
            value={
              ultimoReporte?.evolucion || "Sin evolución"
            }
            description="Comparación semanal"
            positive={
              evolucionNumerica !== null &&
              evolucionNumerica >= 0
            }
          />

          <MetricCard
            icon="◷"
            label="SEMANA ACTUAL"
            value={ultimoReporte?.semana || "—"}
            description="Último reporte cargado"
          />

          <MetricCard
            icon="✓"
            label="ESTADO"
            value={obtenerEstadoNota(nota)}
            description="Seguimiento de calidad"
          />
        </div>

        {/* EVOLUCION */}

        <section className="panel" id="evolucion">
          <SectionHeader
            eyebrow="EVOLUCIÓN"
            title="¿Cómo vienen mis resultados?"
            description="Una mirada rápida a tus últimas semanas."
          />

          {historialGrafico.length === 0 ? (
            <EmptyState text="Todavía no hay suficientes datos para mostrar la evolución." />
          ) : (
            <div className="chart-area">
              <div className="chart-values">
                {historialGrafico.map((item, index) => (
                  <div className="chart-column" key={index}>
                    <div className="chart-number">
                      {item.nota}%
                    </div>

                    <div className="chart-bar-wrapper">
                      <div
                        className="chart-bar"
                        style={{
                          height: `${Math.max(
                            8,
                            Math.min(item.nota, 100)
                          )}%`,
                        }}
                      />
                    </div>

                    <span>
                      {acortarSemana(item.semana)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* PRODUCTIVIDAD */}

        <section className="panel" id="productividad">
          <SectionHeader
            eyebrow="PRODUCTIVIDAD"
            title="Mi desempeño semanal"
            description="Tus principales indicadores de productividad."
          />

          {!ultimaProductividad ? (
            <EmptyState text="Todavía no hay datos de productividad cargados." />
          ) : (
            <>
              <div className="indicator-grid">
                <MetricBox
                  titulo="SPH"
                  resultado={ultimaProductividad.sph}
                  objetivo={ultimaProductividad.sph_objetivo}
                  estado={ultimaProductividad.estado_sph}
                />

                <MetricBox
                  titulo="VENTAS"
                  resultado={ultimaProductividad.ventas}
                  objetivo={ultimaProductividad.ventas_objetivo}
                  estado={ultimaProductividad.estado_ventas}
                />

                <MetricBox
                  titulo="OBJETIVO DE CAMPAÑA"
                  resultado={
                    ultimaProductividad
                      .objetivo_campana_descripcion ||
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
                <div className="management-note">
                  <span>GESTIÓN DE LA SEMANA</span>
                  <p>
                    {ultimaProductividad.gestion_semana}
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* PLAN */}

        <section className="panel" id="plan">
          <SectionHeader
            eyebrow="PLAN DE ACCIÓN"
            title="Esta semana enfocamos en..."
            description="Tu objetivo principal de mejora."
          />

          {!ultimoReporte ? (
            <EmptyState text="Todavía no hay un plan de acción cargado." />
          ) : (
            <div className="action-plan">
              <div className="action-icon">🎯</div>

              <div>
                <span>OBJETIVO</span>

                <h3>
                  {ultimoReporte.objetivos ||
                    "Sin objetivos cargados"}
                </h3>

                <p>
                  Trabajando este punto de forma constante
                  vas a poder mejorar tu resultado.
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="two-panels">
          <section className="panel compact" id="calidad">
            <SectionHeader
              eyebrow="ATENCIÓN"
              title="¿Qué tengo que trabajar?"
            />

            <div className="focus-card">
              <div className="focus-icon">!</div>

              <span>DESVÍO PRINCIPAL</span>

              <h3>
                {ultimoReporte?.desvio_principal ||
                  "Sin desvíos cargados"}
              </h3>

              <p>
                Este es el principal punto de atención
                identificado en el período.
              </p>
            </div>
          </section>

          <section className="panel compact">
            <SectionHeader
              eyebrow="RECOMENDACIÓN"
              title="¿Cómo mejorarlo?"
            />

            <div className="recommendation-card">
              <div className="recommendation-icon">
                ✓
              </div>

              <p>
                {ultimoReporte?.recomendaciones ||
                  "Sin recomendaciones cargadas"}
              </p>
            </div>
          </section>
        </div>

        {/* AUDITORIA */}

        <section className="panel">
          <SectionHeader
            eyebrow="CALIDAD"
            title="Última auditoría"
            description="Información de la última evaluación."
          />

          <div className="audit-grid">
            <InfoItem
              titulo="Auditoría"
              valor={ultimoReporte?.auditoria}
            />

            <InfoItem
              titulo="Producto"
              valor={ultimoReporte?.producto}
            />

            <InfoItem
              titulo="Observaciones"
              valor={ultimoReporte?.observaciones}
            />
          </div>
        </section>

        {/* TIPIFICACIONES */}

        <section className="panel" id="tipificaciones">
          <SectionHeader
            eyebrow="TIPIFICACIONES"
            title="Seguimiento de tipificaciones"
            description="Tus principales oportunidades de mejora."
          />

          {tipificaciones.length === 0 ? (
            <EmptyState text="No hay tipificaciones cargadas." />
          ) : (
            <div className="tipificaciones">
              {tipificaciones.map((item) => (
                <div className="tipificacion" key={item.id}>
                  <div>
                    <span>TIPIFICACIÓN</span>
                    <strong>
                      {item.tipificacion ||
                        "Sin tipificación"}
                    </strong>
                    <small>
                      Semana: {item.semana}
                    </small>
                  </div>

                  <div className="tip-number">
                    <span>% DESVÍO</span>
                    <strong>
                      {item.porcentaje_desvio ?? "—"}
                      {item.porcentaje_desvio !== null
                        ? "%"
                        : ""}
                    </strong>
                  </div>

                  <div className="tip-number">
                    <span>OBJETIVO</span>
                    <strong>
                      {item.objetivo ?? "—"}
                    </strong>
                  </div>

                  <div>
                    <span>COMPROMISO ESPERADO</span>
                    <p>
                      {item.compromiso_esperado || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* GESTION */}

        <section className="panel">
          <SectionHeader
            eyebrow="GESTIÓN DE CALIDAD"
            title="Seguimiento de la gestión"
            description="Acciones realizadas durante el período."
          />

          {!ultimaGestion ? (
            <EmptyState text="No hay información de gestión cargada." />
          ) : (
            <div className="info-grid">
              <InfoItem
                titulo="Auditorías realizadas"
                valor={ultimaGestion.cantidad_auditorias}
              />

              <InfoItem
                titulo="Oportunidades de mejora"
                valor={ultimaGestion.oportunidades_mejora}
              />

              <InfoItem
                titulo="Coaching brindado"
                valor={ultimaGestion.coaching_brindado}
              />

              <InfoItem
                titulo="Registro en sistema"
                valor={ultimaGestion.registro_sistema}
              />

              <InfoItem
                titulo="Compromiso esperado"
                valor={ultimaGestion.compromiso_esperado}
              />

              <InfoItem
                titulo="Fortalezas destacadas"
                valor={ultimaGestion.fortalezas_destacadas}
              />
            </div>
          )}
        </section>

        {/* NO VENTA */}

        <section className="panel" id="noventa">
          <SectionHeader
            eyebrow="AUDITORÍAS DE NO VENTA"
            title="Oportunidades detectadas"
            description="Información para seguir mejorando la gestión."
          />

          {!ultimaNoVenta ? (
            <EmptyState text="No hay auditorías de no venta cargadas." />
          ) : (
            <div className="info-grid">
              <InfoItem
                titulo="Cantidad de auditorías"
                valor={ultimaNoVenta.cantidad_auditorias}
              />

              <InfoItem
                titulo="Oportunidades detectadas"
                valor={ultimaNoVenta.oportunidades_detectadas}
              />

              <InfoItem
                titulo="Desvío principal"
                valor={ultimaNoVenta.desvio_principal}
              />

              <InfoItem
                titulo="Recomendaciones"
                valor={ultimaNoVenta.recomendaciones}
              />

              <InfoItem
                titulo="Compromiso esperado"
                valor={ultimaNoVenta.compromiso_esperado}
              />

              <InfoItem
                titulo="Observaciones"
                valor={ultimaNoVenta.observaciones}
              />
            </div>
          )}
        </section>

        {/* DEVOLUCION */}

        <section className="panel feedback-panel" id="devolucion">
          <SectionHeader
            eyebrow="DEVOLUCIÓN"
            title="Comunicación con Calidad"
            description="Tu devolución también forma parte del seguimiento."
          />

          <div className="quality-message">
            <div className="quality-message-icon">
              Q
            </div>

            <div>
              <span>DEVOLUCIÓN DE CALIDAD</span>

              {comentarios.filter(
                (item) => item.tipo === "calidad"
              ).length === 0 ? (
                <p className="muted">
                  Todavía no hay una devolución cargada.
                </p>
              ) : (
                comentarios
                  .filter(
                    (item) => item.tipo === "calidad"
                  )
                  .map((item) => (
                    <div
                      className="quality-comment"
                      key={item.id}
                    >
                      <strong>Calidad</strong>
                      <p>{item.comentario}</p>
                      <small>{item.fecha_carga}</small>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="request-quality">
            <div>
              <span>¿QUERÉS HABLAR CON CALIDAD?</span>
              <h3>
                Dejá tu consulta, compromiso o comentario.
              </h3>
              <p>
                Tu mensaje quedará registrado para que
                podamos darle seguimiento.
              </p>
            </div>

            <div className="comment-form">
              <textarea
                className="no-print"
                placeholder="Escribí acá tu comentario..."
                value={nuevoComentario}
                onChange={(e) =>
                  setNuevoComentario(e.target.value)
                }
              />

              <button
                className="primary-button no-print"
                onClick={enviarComentario}
                disabled={enviandoComentario}
              >
                {enviandoComentario
                  ? "ENVIANDO..."
                  : "ENVIAR A CALIDAD"}
                <span>→</span>
              </button>

              {mensajeComentario && (
                <p className="success-text">
                  {mensajeComentario}
                </p>
              )}
            </div>
          </div>

          {comentarios.filter(
            (item) => item.tipo === "asesor"
          ).length > 0 && (
            <div className="previous-comments">
              <span className="eyebrow">
                MIS COMENTARIOS
              </span>

              {comentarios
                .filter(
                  (item) => item.tipo === "asesor"
                )
                .map((item) => (
                  <div
                    className="previous-comment"
                    key={item.id}
                  >
                    <strong>Mi comentario</strong>
                    <p>{item.comentario}</p>
                    <small>{item.fecha_carga}</small>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* HISTORIAL */}

        <section className="panel" id="historial">
          <SectionHeader
            eyebrow="SEGUIMIENTO"
            title="Historial de reportes"
            description="Consultá tu evolución semana a semana."
          />

          {reportes.length === 0 ? (
            <EmptyState text="Todavía no hay reportes cargados." />
          ) : (
            <div className="history-list">
              {reportes.map((reporte, index) => (
                <div
                  className={
                    index === 0
                      ? "history-row current"
                      : "history-row"
                  }
                  key={reporte.id}
                >
                  <div className="history-week">
                    {index === 0 && (
                      <span className="current-badge">
                        REPORTE ACTUAL
                      </span>
                    )}

                    <strong>{reporte.semana}</strong>

                    <small>
                      {reporte.desvio_principal ||
                        "Sin desvío principal"}
                    </small>
                  </div>

                  <div className="history-product">
                    <span>PRODUCTO</span>
                    <strong>
                      {reporte.producto || "—"}
                    </strong>
                  </div>

                  <div className="history-score">
                    <span>NOTA</span>
                    <strong>
                      {reporte.nota ?? "—"}
                      {reporte.nota !== null &&
                      reporte.nota !== undefined
                        ? "%"
                        : ""}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="portal-footer">
          <div className="brand-small">Q</div>
          <div>
            <strong>Portal de Calidad</strong>
            <span>
              Seguimiento · Mejora · Evolución
            </span>
          </div>
        </footer>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #f5f7f6;
          font-family:
            Arial, Helvetica, sans-serif;
          color: #30463b;
        }

        button,
        input,
        textarea,
        select {
          font-family:
            Arial, Helvetica, sans-serif;
        }

        button {
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .app {
          min-height: 100vh;
          background:
            linear-gradient(
              180deg,
              #f5f8f6 0%,
              #f7f8f7 100%
            );
        }

        /* LOGIN */

        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at top left,
              #e5efe9 0,
              transparent 40%
            ),
            linear-gradient(
              135deg,
              #eef4f1,
              #dfe9e3
            );
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #e2ebe5;
          border-radius: 28px;
          padding: 46px;
          box-shadow:
            0 30px 80px rgba(40, 65, 54, 0.14);
          position: relative;
          z-index: 2;
        }

        .brand-mark {
          width: 68px;
          height: 68px;
          border-radius: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #5e796a;
          color: white;
          font-size: 29px;
          font-weight: 800;
          margin-bottom: 24px;
          box-shadow:
            0 12px 25px rgba(94, 121, 106, 0.25);
        }

        .login-eyebrow,
        .eyebrow {
          color: #658073;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .login-card h1 {
          margin: 9px 0 10px;
          font-size: 32px;
          color: #30463b;
        }

        .login-description {
          color: #7c8983;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .login-card label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #40534a;
          margin: 18px 0 8px;
        }

        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #d9e3dd;
          border-radius: 12px;
          padding: 0 14px;
          background: white;
        }

        .input-wrapper span {
          color: #7d9487;
          font-size: 13px;
        }

        .input-wrapper input {
          width: 100%;
          border: 0;
          outline: 0;
          padding: 14px 4px;
          font-size: 14px;
          color: #30463b;
        }

        .login-button {
          width: 100%;
          margin-top: 25px;
          border: 0;
          border-radius: 12px;
          background: #5e796a;
          color: white;
          padding: 15px 18px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: 0.2s;
        }

        .login-button:hover,
        .primary-button:hover {
          transform: translateY(-1px);
          box-shadow:
            0 10px 25px rgba(94, 121, 106, 0.2);
        }

        .login-footer {
          text-align: center;
          color: #9aa49f;
          font-size: 12px;
          margin-top: 24px;
        }

        .login-error {
          background: #fff1ef;
          color: #a65c50;
          padding: 11px 13px;
          border-radius: 10px;
          font-size: 13px;
          margin-top: 14px;
        }

        .login-decoration {
          position: absolute;
          border-radius: 50%;
          background: rgba(94, 121, 106, 0.08);
        }

        .decoration-one {
          width: 500px;
          height: 500px;
          top: -250px;
          left: -200px;
        }

        .decoration-two {
          width: 450px;
          height: 450px;
          bottom: -250px;
          right: -180px;
        }

        /* TOPBAR */

        .topbar {
          min-height: 76px;
          background: white;
          border-bottom: 1px solid #e9eeeb;
          padding: 16px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-small {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #5e796a;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 800;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand strong {
          font-size: 15px;
          color: #30463b;
        }

        .brand span {
          color: #909c96;
          font-size: 11px;
          margin-top: 3px;
        }

        .top-actions {
          display: flex;
          gap: 9px;
          align-items: center;
        }

        .print-button,
        .logout-button {
          border-radius: 9px;
          padding: 10px 15px;
          font-size: 12px;
          font-weight: 700;
        }

        .print-button {
          border: 0;
          color: white;
          background: #5e796a;
        }

        .logout-button {
          border: 1px solid #d7e1db;
          color: #5e796a;
          background: white;
        }

        .section-nav {
          background: white;
          border-bottom: 1px solid #e9eeeb;
          padding: 10px 6%;
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .section-nav::-webkit-scrollbar {
          display: none;
        }

        .section-nav a {
          text-decoration: none;
          white-space: nowrap;
          color: #73817a;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .section-nav a:hover {
          background: #edf3ef;
          color: #5e796a;
        }

        /* CONTENT */

        .dashboard-content,
        .admin-content {
          max-width: 1200px;
          margin: auto;
          padding: 40px 24px 60px;
        }

        .welcome-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
          padding: 10px 0 25px;
        }

        .welcome-section h1 {
          margin: 8px 0;
          font-size: 36px;
          color: #30463b;
        }

        .welcome-section p {
          color: #7c8983;
          margin: 0;
          line-height: 1.6;
          max-width: 650px;
        }

        .welcome-badge {
          background: white;
          border: 1px solid #e2eae5;
          border-radius: 18px;
          padding: 18px 22px;
          min-width: 130px;
          text-align: center;
        }

        .welcome-badge span {
          display: block;
          font-size: 10px;
          letter-spacing: 1px;
          color: #8c9993;
        }

        .welcome-badge strong {
          display: block;
          font-size: 26px;
          margin-top: 5px;
          color: #5e796a;
        }

        .identity-bar {
          background: #e7efea;
          border-radius: 15px;
          padding: 16px 20px;
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .identity-bar span,
        .identity-bar strong {
          display: block;
        }

        .identity-bar span {
          color: #7e8e85;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }

        .identity-bar strong {
          color: #40534a;
          font-size: 14px;
        }

        /* METRICS */

        .main-metrics {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }

        .metric-card {
          background: white;
          border: 1px solid #e6ece8;
          border-radius: 18px;
          padding: 22px;
          min-height: 160px;
          box-shadow:
            0 6px 20px rgba(48, 70, 59, 0.035);
        }

        .metric-card.highlight {
          background:
            linear-gradient(
              145deg,
              #5e796a,
              #769082
            );
          color: white;
        }

        .metric-card.highlight .metric-label,
        .metric-card.highlight .metric-description,
        .metric-card.highlight .metric-icon {
          color: rgba(255, 255, 255, 0.8);
        }

        .metric-icon {
          color: #6b8577;
          font-size: 20px;
        }

        .metric-label {
          color: #8b9791;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.2px;
          display: block;
          margin-top: 10px;
        }

        .metric-value {
          display: block;
          color: #30463b;
          font-size: 24px;
          font-weight: 800;
          margin-top: 7px;
          line-height: 1.25;
        }

        .highlight .metric-value {
          color: white;
          font-size: 35px;
        }

        .metric-description {
          color: #98a29d;
          font-size: 11px;
          margin-top: 7px;
        }

        /* PANELS */

        .panel {
          background: white;
          border: 1px solid #e5ebe7;
          border-radius: 20px;
          padding: 28px;
          margin-top: 20px;
          box-shadow:
            0 7px 25px rgba(48, 70, 59, 0.035);
          scroll-margin-top: 110px;
        }

        .panel.compact {
          margin-top: 0;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: flex-start;
        }

        .section-heading h2 {
          margin: 6px 0 5px;
          font-size: 21px;
          color: #30463b;
        }

        .section-description {
          color: #8a9690;
          font-size: 13px;
          line-height: 1.6;
          margin: 0;
        }

        .heading-icon {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: #edf3ef;
          color: #5e796a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        /* CHART */

        .chart-area {
          margin-top: 25px;
          height: 280px;
          padding: 10px 10px 0;
          border-bottom: 1px solid #e5ebe7;
        }

        .chart-values {
          height: 100%;
          display: flex;
          justify-content: space-around;
          gap: 20px;
          align-items: flex-end;
        }

        .chart-column {
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          min-width: 45px;
        }

        .chart-number {
          color: #5e796a;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .chart-bar-wrapper {
          height: 210px;
          width: min(55px, 100%);
          display: flex;
          align-items: flex-end;
          background: #f1f5f2;
          border-radius: 10px 10px 0 0;
          overflow: hidden;
        }

        .chart-bar {
          width: 100%;
          min-height: 10px;
          background: linear-gradient(
            180deg,
            #769486,
            #5e796a
          );
          border-radius: 10px 10px 0 0;
          transition: height 0.4s ease;
        }

        .chart-column > span {
          color: #8b9690;
          font-size: 10px;
          margin-top: 8px;
          text-align: center;
        }

        /* INDICATORS */

        .indicator-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 15px;
          margin-top: 20px;
        }

        .metric-box {
          background: #f8faf9;
          border: 1px solid #e4ebe7;
          border-radius: 15px;
          padding: 20px;
        }

        .metric-box-title {
          color: #6d8679;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .metric-result {
          display: block;
          color: #30463b;
          font-size: 29px;
          font-weight: 800;
          margin: 10px 0;
        }

        .metric-target {
          color: #8d9993;
          font-size: 12px;
        }

        .status {
          display: inline-block;
          padding: 7px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
          margin-top: 12px;
        }

        .management-note {
          margin-top: 15px;
          padding: 18px;
          background: #edf3ef;
          border-radius: 14px;
        }

        .management-note span {
          color: #6c8276;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .management-note p {
          color: #52665b;
          margin: 7px 0 0;
          line-height: 1.6;
          font-size: 13px;
        }

        /* PLAN */

        .action-plan {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          margin-top: 20px;
          background: #edf4ef;
          border-radius: 16px;
          padding: 22px;
        }

        .action-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          flex-shrink: 0;
        }

        .action-plan span,
        .focus-card > span,
        .quality-message span,
        .request-quality span {
          font-size: 10px;
          letter-spacing: 1px;
          font-weight: 800;
          color: #70847a;
        }

        .action-plan h3 {
          margin: 7px 0;
          color: #30463b;
          font-size: 17px;
          line-height: 1.5;
        }

        .action-plan p {
          color: #78877f;
          font-size: 12px;
          margin: 0;
        }

        .two-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        .focus-card,
        .recommendation-card {
          margin-top: 20px;
          background: #f8faf9;
          border: 1px solid #e7ece9;
          border-radius: 15px;
          padding: 25px;
          text-align: center;
          min-height: 190px;
        }

        .focus-icon,
        .recommendation-icon {
          width: 43px;
          height: 43px;
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e8efeb;
          color: #5e796a;
          font-size: 19px;
          font-weight: 800;
        }

        .focus-card h3 {
          color: #30463b;
          margin: 9px 0;
          font-size: 17px;
        }

        .focus-card p,
        .recommendation-card p {
          color: #818d87;
          font-size: 13px;
          line-height: 1.6;
        }

        .recommendation-card {
          text-align: left;
        }

        /* INFO */

        .audit-grid,
        .info-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 12px;
          margin-top: 20px;
        }

        .info-grid {
          grid-template-columns:
            repeat(3, 1fr);
        }

        .info-item {
          background: #f8faf9;
          border: 1px solid #e8edea;
          border-radius: 13px;
          padding: 17px;
        }

        .info-item small,
        .tipificacion span,
        .tip-number span,
        .history-product span,
        .history-score span {
          display: block;
          color: #8b9691;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.8px;
          margin-bottom: 7px;
        }

        .info-item strong {
          display: block;
          color: #40534a;
          font-size: 13px;
          line-height: 1.5;
        }

        /* TIPIFICACIONES */

        .tipificaciones {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }

        .tipificacion {
          display: grid;
          grid-template-columns:
            1.5fr
            0.7fr
            0.7fr
            1.5fr;
          gap: 18px;
          align-items: center;
          padding: 18px;
          border: 1px solid #e5ebe8;
          background: #fafcfb;
          border-radius: 13px;
        }

        .tipificacion strong {
          display: block;
          color: #40534a;
          font-size: 13px;
        }

        .tipificacion small {
          display: block;
          color: #a0aaa5;
          margin-top: 6px;
          font-size: 10px;
        }

        .tipificacion p {
          margin: 0;
          color: #6e7c74;
          font-size: 12px;
          line-height: 1.5;
        }

        .tip-number strong {
          font-size: 19px;
          color: #5e796a;
        }

        /* DEVOLUCION */

        .quality-message {
          margin-top: 20px;
          display: flex;
          gap: 15px;
          background: #edf4ef;
          border-radius: 15px;
          padding: 20px;
        }

        .quality-message-icon {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 13px;
          background: #5e796a;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 800;
        }

        .muted {
          color: #89958f;
          font-size: 13px;
        }

        .quality-comment {
          background: white;
          border-radius: 10px;
          padding: 13px;
          margin-top: 8px;
        }

        .quality-comment p {
          margin: 7px 0;
          color: #506259;
          line-height: 1.5;
          font-size: 13px;
        }

        .quality-comment small,
        .previous-comment small {
          color: #9ba49f;
          font-size: 10px;
        }

        .request-quality {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 25px;
          margin-top: 18px;
          padding: 22px;
          border: 1px solid #e4ebe7;
          border-radius: 15px;
        }

        .request-quality h3 {
          margin: 7px 0;
          color: #30463b;
          font-size: 17px;
        }

        .request-quality p {
          color: #84908a;
          font-size: 12px;
          line-height: 1.5;
        }

        .comment-form textarea {
          width: 100%;
          min-height: 120px;
          resize: vertical;
          border: 1px solid #dce4df;
          border-radius: 11px;
          padding: 13px;
          outline: none;
          font-size: 13px;
        }

        .primary-button {
          border: 0;
          border-radius: 10px;
          padding: 13px 17px;
          background: #5e796a;
          color: white;
          font-weight: 800;
          font-size: 11px;
          margin-top: 10px;
          display: flex;
          gap: 15px;
          align-items: center;
          justify-content: space-between;
        }

        .success-text {
          color: #4b8061;
          font-size: 12px;
          font-weight: 700;
          margin-left: 10px;
        }

        .error-text {
          color: #a95d51;
          font-size: 12px;
          font-weight: 700;
          margin-left: 10px;
        }

        .previous-comments {
          margin-top: 25px;
        }

        .previous-comment {
          border: 1px solid #e5ebe7;
          border-radius: 12px;
          padding: 15px;
          margin-top: 10px;
        }

        .previous-comment strong {
          color: #40534a;
          font-size: 12px;
        }

        .previous-comment p {
          color: #68766e;
          font-size: 13px;
          line-height: 1.5;
          margin: 7px 0;
        }

        /* HISTORY */

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-top: 20px;
        }

        .history-row {
          display: grid;
          grid-template-columns:
            1fr
            150px
            100px;
          gap: 20px;
          align-items: center;
          padding: 17px;
          border: 1px solid #e7ece9;
          border-radius: 13px;
          background: #fafcfb;
        }

        .history-row.current {
          border-color: #b9ccbf;
          background: #f0f6f2;
        }

        .history-week strong {
          display: block;
          color: #40534a;
          font-size: 14px;
        }

        .history-week small {
          display: block;
          color: #929d97;
          font-size: 10px;
          margin-top: 5px;
        }

        .current-badge {
          display: inline-block;
          background: #dbe9df;
          color: #5b7667;
          padding: 4px 7px;
          border-radius: 20px;
          font-size: 8px;
          font-weight: 800;
          margin-bottom: 7px;
        }

        .history-product strong {
          color: #65766d;
          font-size: 12px;
        }

        .history-score strong {
          font-size: 22px;
          color: #5e796a;
        }

        .empty-state {
          padding: 30px;
          text-align: center;
          color: #909b96;
          font-size: 13px;
        }

        /* ADMIN */

        .admin-hero {
          background:
            linear-gradient(
              135deg,
              #304b3d,
              #5e796a
            );
          color: white;
          border-radius: 22px;
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .admin-hero .eyebrow {
          color: #c4d6cb;
        }

        .admin-hero h1 {
          margin: 8px 0;
          font-size: 29px;
        }

        .admin-hero p {
          color: #d3ded8;
          line-height: 1.5;
          margin: 0;
          max-width: 600px;
        }

        .admin-hero-icon {
          width: 70px;
          height: 70px;
          border-radius: 20px;
          background: rgba(255,255,255,0.12);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30px;
        }

        .admin-stat-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 15px;
          margin: 20px 0;
        }

        .admin-stat {
          background: white;
          border: 1px solid #e4ebe7;
          border-radius: 17px;
          padding: 21px;
        }

        .admin-stat strong {
          display: block;
          font-size: 28px;
          color: #5e796a;
        }

        .admin-stat span {
          display: block;
          color: #40534a;
          font-weight: 800;
          font-size: 13px;
          margin-top: 5px;
        }

        .admin-stat small {
          color: #9aa49f;
          font-size: 10px;
          margin-top: 5px;
          display: block;
        }

        .admin-panel {
          background: white;
          border: 1px solid #e4ebe7;
          border-radius: 20px;
          padding: 28px;
          margin-top: 20px;
        }

        .admin-form {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 16px;
          margin-top: 24px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-field.full {
          grid-column: 1 / -1;
        }

        .form-field label {
          color: #40534a;
          font-size: 11px;
          font-weight: 800;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          border: 1px solid #dce4df;
          border-radius: 10px;
          padding: 13px;
          outline: none;
          color: #40534a;
          background: white;
          font-size: 13px;
        }

        .form-field textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .advisor-admin-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .advisor-admin-card {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 14px;
          border: 1px solid #e7ece9;
          border-radius: 12px;
        }

        .advisor-avatar {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e3ece6;
          color: #557061;
          font-weight: 800;
        }

        .advisor-admin-card strong,
        .advisor-admin-card span,
        .advisor-admin-card small {
          display: block;
        }

        .advisor-admin-card strong {
          color: #40534a;
          font-size: 12px;
        }

        .advisor-admin-card span {
          color: #929d97;
          font-size: 10px;
          margin-top: 4px;
        }

        .advisor-admin-card small {
          color: #a2aaa6;
          font-size: 9px;
          margin-top: 3px;
        }

        .portal-footer {
          margin-top: 40px;
          padding: 25px 0;
          border-top: 1px solid #e2e9e5;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .portal-footer span,
        .portal-footer strong {
          display: block;
        }

        .portal-footer strong {
          color: #40534a;
          font-size: 12px;
        }

        .portal-footer span {
          color: #9ba49f;
          font-size: 10px;
          margin-top: 3px;
        }

        .print-header {
          display: none;
        }

        @media (max-width: 950px) {
          .main-metrics {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .indicator-grid,
          .audit-grid,
          .info-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .advisor-admin-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .topbar {
            padding: 13px 16px;
          }

          .top-actions {
            width: 100%;
          }

          .print-button,
          .logout-button {
            flex: 1;
          }

          .section-nav {
            padding: 9px 15px;
          }

          .dashboard-content,
          .admin-content {
            padding: 25px 15px 45px;
          }

          .welcome-section {
            flex-direction: column;
            align-items: flex-start;
          }

          .welcome-section h1 {
            font-size: 29px;
          }

          .welcome-badge {
            width: 100%;
          }

          .identity-bar {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .main-metrics,
          .indicator-grid,
          .audit-grid,
          .info-grid,
          .two-panels,
          .admin-stat-grid,
          .admin-form,
          .advisor-admin-grid {
            grid-template-columns: 1fr;
          }

          .panel,
          .admin-panel {
            padding: 20px;
          }

          .tipificacion {
            grid-template-columns: 1fr 1fr;
          }

          .history-row {
            grid-template-columns: 1fr 80px;
          }

          .history-product {
            display: none;
          }

          .request-quality {
            grid-template-columns: 1fr;
          }

          .login-card {
            padding: 30px 24px;
          }

          .admin-hero {
            padding: 25px;
          }

          .admin-hero-icon {
            display: none;
          }
        }

        @media print {
          body {
            background: white !important;
          }

          .no-print,
          .topbar,
          .section-nav {
            display: none !important;
          }

          .dashboard-content {
            max-width: none !important;
            padding: 15px !important;
          }

          .print-header {
            display: block !important;
            padding: 20px;
            background: #eef4f1;
            border-radius: 12px;
            margin-bottom: 20px;
          }

          .panel {
            box-shadow: none !important;
            break-inside: avoid;
            border: 1px solid #ddd !important;
          }

          .chart-bar {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   COMPONENTES
========================================================= */

function MetricCard({
  icon,
  label,
  value,
  description,
  highlight = false,
}) {
  return (
    <div
      className={
        highlight
          ? "metric-card highlight"
          : "metric-card"
      }
    >
      <div className="metric-icon">{icon}</div>

      <span className="metric-label">{label}</span>

      <strong className="metric-value">
        {value}
      </strong>

      <div className="metric-description">
        {description}
      </div>
    </div>
  );
}

function MetricBox({
  titulo,
  resultado,
  objetivo,
  estado,
}) {
  const textoEstado = String(estado || "");

  const alcanzado =
    textoEstado.toLowerCase().includes("alcanz") ||
    textoEstado.toLowerCase().includes("cumpl");

  return (
    <div className="metric-box">
      <span className="metric-box-title">
        {titulo}
      </span>

      <strong className="metric-result">
        {resultado ?? "—"}
      </strong>

      <div className="metric-target">
        Objetivo:{" "}
        <strong>{objetivo ?? "—"}</strong>
      </div>

      <div
        className="status"
        style={{
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

function InfoItem({ titulo, valor }) {
  return (
    <div className="info-item">
      <small>{titulo}</small>
      <strong>{valor || "—"}</strong>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>

        {description && (
          <p className="section-description">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      {text}
    </div>
  );
}

/* =========================================================
   FUNCIONES AUXILIARES
========================================================= */

function obtenerEvolucionNumerica(texto) {
  if (!texto) return null;

  const match = String(texto).match(
    /([+-]?\d+(?:[.,]\d+)?)/
  );

  if (!match) return null;

  return Number(match[1].replace(",", "."));
}

function obtenerEstadoNota(nota) {
  if (!Number.isFinite(nota)) {
    return "Sin dato";
  }

  if (nota >= 90) return "Excelente";
  if (nota >= 80) return "Muy buen nivel";
  if (nota >= 70) return "En seguimiento";
  if (nota >= 60) return "A trabajar";

  return "Prioridad de mejora";
}

function acortarSemana(semana) {
  if (!semana) return "—";

  const texto = String(semana);

  if (texto.length <= 13) return texto;

  return texto
    .replace("Semana", "S.")
    .replace(" - ", " ");
}
