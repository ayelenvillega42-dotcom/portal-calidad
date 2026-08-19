"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL =
  "https://portal-calidad-api.ayelenvillega42.workers.dev";

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin123";
const ASESOR_PASSWORD = "123456";

const MENU = [
  ["resumen", "⌂", "Resumen"],
  ["productividad", "↗", "Productividad"],
  ["calidad", "✓", "Calidad"],
  ["plan", "◎", "Plan de acción"],
  ["tipificaciones", "▤", "Tipificaciones"],
  ["noventa", "!", "No venta"],
  ["devolucion", "◌", "Devolución"],
  ["historial", "◷", "Historial"],
];

const emptyReporte = {
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

  const [seccion, setSeccion] = useState("resumen");

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [mensajeComentario, setMensajeComentario] = useState("");

  const [reporteForm, setReporteForm] = useState(emptyReporte);
  const [guardandoReporte, setGuardandoReporte] = useState(false);
  const [mensajeReporte, setMensajeReporte] = useState("");

  const [asesorAdmin, setAsesorAdmin] = useState("");
  const [reportesAdmin, setReportesAdmin] = useState([]);
  const [cargandoAdmin, setCargandoAdmin] = useState(false);

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
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }

  async function cargarDatosAsesor(asesorId) {
    try {
      const endpoints = [
        `/reportes?asesor_id=${asesorId}`,
        `/productividad?asesor_id=${asesorId}`,
        `/tipificaciones?asesor_id=${asesorId}`,
        `/gestion-calidad?asesor_id=${asesorId}`,
        `/auditorias-no-venta?asesor_id=${asesorId}`,
        `/comentarios?asesor_id=${asesorId}`,
      ];

      const respuestas = await Promise.all(
        endpoints.map((endpoint) => fetch(`${API_URL}${endpoint}`))
      );

      const datos = await Promise.all(
        respuestas.map(async (response) => {
          if (!response.ok) return [];
          try {
            const json = await response.json();
            return Array.isArray(json) ? json : [];
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
    } catch (e) {
      console.error(e);
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
      setSeccion("admin");
      return;
    }

    const asesor = asesores.find(
      (item) =>
        String(item.usuario_login || "").toLowerCase() ===
        usuarioIngresado
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

    setSeccion("resumen");
    cargarDatosAsesor(asesor.id);
  }

  function cerrarSesion() {
    setSesion(null);
    setUsuario("");
    setPassword("");
    setError("");
    setSeccion("resumen");

    setReportes([]);
    setProductividad([]);
    setTipificaciones([]);
    setGestionCalidad([]);
    setAuditoriasNoVenta([]);
    setComentarios([]);

    setReporteForm(emptyReporte);
    setAsesorAdmin("");
    setReportesAdmin([]);
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
        throw new Error(data.error || "No se pudo guardar.");
      }

      setMensajeReporte("✓ Reporte cargado correctamente.");
      setReporteForm(emptyReporte);
    } catch (e) {
      console.error(e);
      setMensajeReporte("No se pudo cargar el reporte.");
    } finally {
      setGuardandoReporte(false);
    }
  }

  async function consultarAsesorAdmin(id) {
    setAsesorAdmin(id);
    setReportesAdmin([]);

    if (!id) return;

    setCargandoAdmin(true);

    try {
      const response = await fetch(
        `${API_URL}/reportes?asesor_id=${id}`
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      setReportesAdmin(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setCargandoAdmin(false);
    }
  }

  async function enviarComentario() {
    if (!nuevoComentario.trim()) return;

    if (!sesion?.id) return;

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
        throw new Error(data.error || "Error");
      }

      setNuevoComentario("");
      setMensajeComentario("✓ Comentario enviado correctamente.");

      await cargarDatosAsesor(sesion.id);
    } catch (e) {
      console.error(e);
      setMensajeComentario("No se pudo enviar el comentario.");
    } finally {
      setEnviandoComentario(false);
    }
  }

  function imprimirInforme() {
    window.print();
  }

  const ultimoReporte = useMemo(
    () => (reportes.length ? reportes[0] : null),
    [reportes]
  );

  const ultimaProductividad = useMemo(
    () => (productividad.length ? productividad[0] : null),
    [productividad]
  );

  const ultimaGestion = useMemo(
    () => (gestionCalidad.length ? gestionCalidad[0] : null),
    [gestionCalidad]
  );

  const ultimaNoVenta = useMemo(
    () => (auditoriasNoVenta.length ? auditoriasNoVenta[0] : null),
    [auditoriasNoVenta]
  );

  const nombreMostrar = sesion?.nombre
    ? sesion.nombre.includes(", ")
      ? sesion.nombre.split(", ")[1]
      : sesion.nombre
    : "";

  if (!sesion) {
    return (
      <main style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.logoCircle}>Q</div>

          <div style={styles.loginBadge}>CALIDAD</div>

          <h1 style={styles.title}>Portal de Calidad</h1>

          <p style={styles.subtitle}>
            Tu espacio personal de seguimiento,
            evolución y mejora.
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

            {error && <div style={styles.error}>{error}</div>}

            <button
              style={styles.button}
              type="submit"
              disabled={cargando}
            >
              {cargando ? "CARGANDO..." : "INGRESAR A MI PORTAL"}
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
            <div style={styles.headerKicker}>GESTIÓN</div>
            <h1 style={styles.headerTitle}>Portal de Calidad</h1>
            <p style={styles.headerSubtitle}>
              Panel de administración
            </p>
          </div>

          <button
            className="no-print"
            style={styles.logout}
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </header>

        <section style={styles.content}>
          <div style={styles.hero}>
            <div>
              <span style={styles.heroEyebrow}>
                PANEL ADMINISTRATIVO
              </span>
              <h2 style={styles.heroTitle}>
                Hola, Administradora
              </h2>
              <p style={styles.heroText}>
                Desde acá podés cargar y consultar la información
                semanal de todo el equipo.
              </p>
            </div>

            <div style={styles.heroCircle}>Q</div>
          </div>

          <div style={styles.cards}>
            <StatCard
              numero={asesores.length}
              titulo="Asesores registrados"
              texto="Equipo activo"
            />

            <StatCard
              numero={reporteForm.semana ? "LISTO" : "—"}
              titulo="Carga semanal"
              texto="Estado del formulario"
            />

            <StatCard
              numero="✓"
              titulo="API conectada"
              texto="Base de datos"
            />
          </div>

          <div style={styles.panel}>
            <Badge texto="CARGA SEMANAL" />

            <h2 style={styles.panelTitle}>
              Cargar reporte de calidad
            </h2>

            <p style={styles.paragraph}>
              Completá la información del asesor y guardá su
              reporte semanal.
            </p>

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
                    <option key={asesor.id} value={asesor.id}>
                      {asesor.nombre} — {asesor.numero_usuario}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Semana">
                <input
                  style={styles.input}
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

              <FormField label="Desvío principal">
                <input
                  style={styles.input}
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
                  style={styles.input}
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

              <FormFieldFull label="Objetivos">
                <textarea
                  style={styles.textarea}
                  placeholder="¿Qué debe trabajar el asesor?"
                  value={reporteForm.objetivos}
                  onChange={(e) =>
                    setReporteForm({
                      ...reporteForm,
                      objetivos: e.target.value,
                    })
                  }
                />
              </FormFieldFull>

              <FormFieldFull label="Recomendaciones">
                <textarea
                  style={styles.textarea}
                  placeholder="¿Cómo puede mejorarlo?"
                  value={reporteForm.recomendaciones}
                  onChange={(e) =>
                    setReporteForm({
                      ...reporteForm,
                      recomendaciones: e.target.value,
                    })
                  }
                />
              </FormFieldFull>

              <FormField label="Auditoría">
                <input
                  style={styles.input}
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

              <FormFieldFull label="Observaciones">
                <textarea
                  style={styles.textarea}
                  placeholder="Observaciones adicionales"
                  value={reporteForm.observaciones}
                  onChange={(e) =>
                    setReporteForm({
                      ...reporteForm,
                      observaciones: e.target.value,
                    })
                  }
                />
              </FormFieldFull>
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
              <div style={styles.successMessage}>
                {mensajeReporte}
              </div>
            )}
          </div>

          <div style={styles.panel}>
            <Badge texto="CONSULTA INDIVIDUAL" />

            <h2 style={styles.panelTitle}>
              Consultar un asesor
            </h2>

            <p style={styles.paragraph}>
              Elegí un asesor para revisar sus reportes
              cargados.
            </p>

            <select
              style={styles.input}
              value={asesorAdmin}
              onChange={(e) =>
                consultarAsesorAdmin(e.target.value)
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

            {cargandoAdmin && (
              <div style={styles.empty}>
                Cargando reportes...
              </div>
            )}

            {!cargandoAdmin &&
              asesorAdmin &&
              reportesAdmin.length === 0 && (
                <div style={styles.empty}>
                  Este asesor todavía no tiene reportes cargados.
                </div>
              )}

            {reportesAdmin.length > 0 && (
              <div style={styles.history}>
                {reportesAdmin.map((reporte) => (
                  <div
                    key={reporte.id}
                    style={styles.historyItem}
                  >
                    <div>
                      <strong>{reporte.semana}</strong>
                      <p>
                        {reporte.desvio_principal ||
                          "Sin desvío principal"}
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

          <div style={styles.panel}>
            <Badge texto="EQUIPO" />

            <h2 style={styles.panelTitle}>
              Asesores registrados
            </h2>

            <div style={styles.advisorGrid}>
              {asesores.map((asesor) => (
                <div
                  key={asesor.id}
                  style={styles.advisor}
                >
                  <div style={styles.avatar}>
                    {String(asesor.nombre || "?").charAt(0)}
                  </div>

                  <div>
                    <strong>{asesor.nombre}</strong>
                    <p style={styles.username}>
                      Usuario: {asesor.usuario_login}
                    </p>
                    <p style={styles.userNumber}>
                      N° usuario: {asesor.numero_usuario}
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
          <div style={styles.headerKicker}>MI PORTAL</div>
          <h1 style={styles.headerTitle}>Portal de Calidad</h1>
          <p style={styles.headerSubtitle}>
            Seguimiento semanal
          </p>
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

      <div className="no-print" style={styles.mobileMenu}>
        {MENU.map(([id, icon, label]) => (
          <button
            key={id}
            onClick={() => {
              setSeccion(id);
              document
                .getElementById(id)
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }}
            style={{
              ...styles.menuButton,
              ...(seccion === id
                ? styles.menuButtonActive
                : {}),
            }}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <section style={styles.content}>
        <div className="printHeader" style={styles.printHeader}>
          <h1>Informe semanal de desempeño</h1>
          <p>{sesion.nombre}</p>
          <p>{ultimoReporte?.semana || "Sin semana"}</p>
        </div>

        <section id="resumen">
          <div style={styles.hero}>
            <div>
              <span style={styles.heroEyebrow}>
                SEGUIMIENTO PERSONAL
              </span>

              <h2 style={styles.heroTitle}>
                Hola, {nombreMostrar}
              </h2>

              <p style={styles.heroText}>
                Este es tu espacio para conocer tus resultados,
                detectar oportunidades y trabajar en tu evolución.
              </p>
            </div>

            <div style={styles.heroScore}>
              <small>NOTA ACTUAL</small>
              <strong>{ultimoReporte?.nota ?? "—"}</strong>
              <span>
                {ultimoReporte?.semana || "Sin reporte"}
              </span>
            </div>
          </div>

          <div style={styles.infoBar}>
            <InfoHeader
              titulo="N° USUARIO"
              valor={sesion.numero_usuario}
            />
            <InfoHeader
              titulo="USUARIO"
              valor={sesion.usuario}
            />
            <InfoHeader
              titulo="SEMANA"
              valor={
                ultimoReporte?.semana ||
                ultimaProductividad?.semana ||
                "—"
              }
            />
          </div>

          <div style={styles.cards}>
            <MetricCard
              icon="★"
              titulo="Mi nota"
              valor={ultimoReporte?.nota ?? "—"}
              texto="Resultado de calidad"
            />

            <MetricCard
              icon="↗"
              titulo="Evolución"
              valor={ultimoReporte?.evolucion || "—"}
              texto="Comparación semanal"
              largo
            />

            <MetricCard
              icon="✓"
              titulo="Estado"
              valor={
                ultimoReporte
                  ? "Reporte disponible"
                  : "Sin reporte"
              }
              texto={
                ultimoReporte
                  ? "Información actualizada"
                  : "Esperando carga semanal"
              }
              largo
            />
          </div>
        </section>

        <section id="productividad">
          <Panel
            badge="PRODUCTIVIDAD"
            title="Mi desempeño semanal"
          >
            {!ultimaProductividad ? (
              <div style={styles.empty}>
                Todavía no hay datos de productividad cargados.
              </div>
            ) : (
              <div style={styles.productivityGrid}>
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
                    ultimaProductividad.objetivo_campana_descripcion ||
                    ultimaProductividad.objetivo_campana
                  }
                  objetivo={ultimaProductividad.objetivo_campana}
                  estado={
                    ultimaProductividad.estado_objetivo_campana
                  }
                />
              </div>
            )}

            {ultimaProductividad?.gestion_semana && (
              <div style={styles.managementBox}>
                <strong>
                  ¿Qué se realizó durante la semana?
                </strong>
                <p>
                  {ultimaProductividad.gestion_semana}
                </p>
              </div>
            )}
          </Panel>
        </section>

        <section id="calidad">
          <Panel
            badge="CALIDAD"
            title="Última auditoría"
          >
            {!ultimoReporte ? (
              <div style={styles.empty}>
                Todavía no hay una auditoría cargada.
              </div>
            ) : (
              <div style={styles.auditBox}>
                <InfoItem
                  titulo="Auditoría"
                  valor={
                    ultimoReporte.auditoria ||
                    "Sin auditoría cargada"
                  }
                />

                <InfoItem
                  titulo="Producto"
                  valor={ultimoReporte.producto}
                />

                <InfoItem
                  titulo="Observaciones"
                  valor={
                    ultimoReporte.observaciones ||
                    "Sin observaciones"
                  }
                />
              </div>
            )}
          </Panel>

          <Panel
            badge="GESTIÓN DE CALIDAD"
            title="Seguimiento de la gestión"
          >
            {!ultimaGestion ? (
              <div style={styles.empty}>
                No hay información de gestión cargada.
              </div>
            ) : (
              <div style={styles.qualityGrid}>
                <InfoItem
                  titulo="Cantidad de auditorías"
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
                  titulo="Fortalezas"
                  valor={ultimaGestion.fortalezas_destacadas}
                />
              </div>
            )}
          </Panel>
        </section>

        <section id="plan">
          <Panel
            badge="PLAN DE ACCIÓN"
            title="Qué tengo que trabajar"
          >
            {!ultimoReporte ? (
              <div style={styles.empty}>
                Todavía no hay un plan de acción cargado.
              </div>
            ) : (
              <>
                <div style={styles.actionGrid}>
                  <ActionCard
                    icon="!"
                    titulo="Principal atención"
                    valor={
                      ultimoReporte.desvio_principal ||
                      "Sin desvíos cargados"
                    }
                    texto="Punto principal a trabajar durante el período."
                  />

                  <ActionCard
                    icon="✓"
                    titulo="Cómo mejorarlo"
                    valor={
                      ultimoReporte.recomendaciones ||
                      "Sin recomendaciones cargadas"
                    }
                    texto="Recomendación de Calidad."
                  />
                </div>

                <div style={styles.objectiveBox}>
                  <span style={styles.targetIcon}>◎</span>
                  <div>
                    <small style={styles.actionLabel}>
                      OBJETIVO
                    </small>
                    <strong>
                      {ultimoReporte.objetivos ||
                        "Sin objetivos cargados"}
                    </strong>
                  </div>
                </div>
              </>
            )}
          </Panel>
        </section>

        <section id="tipificaciones">
          <Panel
            badge="TIPIFICACIONES"
            title="Seguimiento de tipificaciones"
          >
            {tipificaciones.length === 0 ? (
              <div style={styles.empty}>
                No hay tipificaciones cargadas.
              </div>
            ) : (
              <div style={styles.dataList}>
                {tipificaciones.map((item) => (
                  <div
                    key={item.id}
                    style={styles.dataCard}
                  >
                    <div>
                      <small>TIPIFICACIÓN</small>
                      <strong>
                        {item.tipificacion ||
                          "Sin tipificación"}
                      </strong>
                      <p>Semana: {item.semana}</p>
                    </div>

                    <div style={styles.dataValue}>
                      <small>% DESVÍO</small>
                      <strong>
                        {item.porcentaje_desvio ?? "—"}
                        {item.porcentaje_desvio !== null &&
                        item.porcentaje_desvio !== undefined
                          ? "%"
                          : ""}
                      </strong>
                    </div>

                    <div style={styles.dataValue}>
                      <small>OBJETIVO</small>
                      <strong>
                        {item.objetivo ?? "—"}
                      </strong>
                    </div>

                    <div>
                      <small>COMPROMISO</small>
                      <p>
                        {item.compromiso_esperado || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </section>

        <section id="noventa">
          <Panel
            badge="AUDITORÍAS DE NO VENTA"
            title="Oportunidades detectadas"
          >
            {!ultimaNoVenta ? (
              <div style={styles.empty}>
                No hay auditorías de no venta cargadas.
              </div>
            ) : (
              <div style={styles.qualityGrid}>
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
          </Panel>
        </section>

        <section id="devolucion">
          <Panel
            badge="DEVOLUCIÓN"
            title="Comunicación con Calidad"
          >
            <div style={styles.commentArea}>
              <h3 style={styles.commentTitle}>
                Devolución de Calidad
              </h3>

              {comentarios.filter(
                (item) => item.tipo === "calidad"
              ).length === 0 ? (
                <p style={styles.muted}>
                  Todavía no hay una devolución cargada.
                </p>
              ) : (
                comentarios
                  .filter((item) => item.tipo === "calidad")
                  .map((item) => (
                    <div
                      key={item.id}
                      style={styles.commentQuality}
                    >
                      <strong>Calidad</strong>
                      <p>{item.comentario}</p>
                      <small>{item.fecha_carga}</small>
                    </div>
                  ))
              )}
            </div>

            <div style={styles.commentArea}>
              <h3 style={styles.commentTitle}>
                Mi comentario
              </h3>

              <textarea
                className="no-print"
                style={styles.textarea}
                placeholder="Dejá acá tus dudas, compromisos o consultas..."
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

            {comentarios.filter(
              (item) => item.tipo === "asesor"
            ).length > 0 && (
              <div style={styles.commentArea}>
                <h3 style={styles.commentTitle}>
                  Mis comentarios anteriores
                </h3>

                {comentarios
                  .filter((item) => item.tipo === "asesor")
                  .map((item) => (
                    <div
                      key={item.id}
                      style={styles.commentAdvisor}
                    >
                      <strong>Mi comentario</strong>
                      <p>{item.comentario}</p>
                      <small>{item.fecha_carga}</small>
                    </div>
                  ))}
              </div>
            )}
          </Panel>
        </section>

        <section id="historial">
          <Panel
            badge="SEGUIMIENTO"
            title="Historial de reportes"
          >
            <p style={styles.paragraph}>
              Consultá la evolución de tus resultados semana
              a semana.
            </p>

            {reportes.length === 0 ? (
              <div style={styles.empty}>
                Todavía no hay reportes cargados.
              </div>
            ) : (
              <div style={styles.history}>
                {reportes.map((reporte, index) => (
                  <div
                    key={reporte.id}
                    style={{
                      ...styles.historyItem,
                      ...(index === 0
                        ? styles.historyCurrent
                        : {}),
                    }}
                  >
                    <div>
                      {index === 0 && (
                        <span style={styles.currentBadge}>
                          REPORTE ACTUAL
                        </span>
                      )}

                      <strong>{reporte.semana}</strong>

                      <p>
                        {reporte.desvio_principal ||
                          "Sin desvío principal"}
                      </p>
                    </div>

                    <div style={styles.historyNote}>
                      <small>NOTA</small>
                      <strong>
                        {reporte.nota ?? "—"}
                      </strong>
                    </div>

                    <span>
                      {reporte.producto || "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </section>
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
          background: #f4f7f5;
          color: #30463b;
        }

        button,
        input,
        textarea,
        select {
          font-family: Arial, sans-serif;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        section[id] {
          scroll-margin-top: 100px;
        }

        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          header {
            display: none !important;
          }

          main {
            background: white !important;
          }

          section {
            padding: 10px !important;
          }

          .panel {
            break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }

          .printHeader {
            display: block !important;
          }
        }

        @media screen {
          .printHeader {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .content {
            padding: 25px 15px !important;
          }

          .header {
            padding: 18px !important;
          }

          .hero {
            flex-direction: column !important;
          }

          .heroScore {
            width: 100% !important;
          }

          .dataCard {
            grid-template-columns: 1fr !important;
          }

          .historyItem {
            grid-template-columns: 1fr !important;
          }

          .mobileMenu {
            overflow-x: auto !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </main>
  );
}

function Badge({ texto }) {
  return <div style={styles.sectionBadge}>{texto}</div>;
}

function Panel({ badge, title, children }) {
  return (
    <div style={styles.panel}>
      <Badge texto={badge} />
      <h2 style={styles.panelTitle}>{title}</h2>
      {children}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={styles.formGroup}>
      <label style={styles.formLabel}>{label}</label>
      {children}
    </div>
  );
}

function FormFieldFull({ label, children }) {
  return (
    <div style={styles.formGroupFull}>
      <label style={styles.formLabel}>{label}</label>
      {children}
    </div>
  );
}

function StatCard({ numero, titulo, texto }) {
  return (
    <div style={styles.card}>
      <strong style={styles.cardNumber}>{numero}</strong>
      <strong style={styles.cardTitle}>{titulo}</strong>
      <span style={styles.cardText}>{texto}</span>
    </div>
  );
}

function MetricCard({
  icon,
  titulo,
  valor,
  texto,
  largo,
}) {
  return (
    <div style={styles.metricCard}>
      <span style={styles.metricIcon}>{icon}</span>
      <h3 style={styles.metricTitle}>{titulo}</h3>
      <strong
        style={{
          ...styles.bigNumber,
          ...(largo ? styles.longNumber : {}),
        }}
      >
        {valor}
      </strong>
      <p style={styles.metricDescription}>{texto}</p>
    </div>
  );
}

function InfoHeader({ titulo, valor }) {
  return (
    <div style={styles.infoHeader}>
      <small>{titulo}</small>
      <strong>{valor || "—"}</strong>
    </div>
  );
}

function ActionCard({ icon, titulo, valor, texto }) {
  return (
    <div style={styles.actionCard}>
      <div style={styles.actionIcon}>{icon}</div>
      <small style={styles.actionLabel}>{titulo}</small>
      <strong>{valor}</strong>
      <p>{texto}</p>
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
    (String(estado).toLowerCase().includes("alcanz") ||
      String(estado).toLowerCase().includes("cumpl"));

  return (
    <div style={styles.metricBox}>
      <span style={styles.metricBoxTitle}>{titulo}</span>

      <strong style={styles.metricResult}>
        {resultado ?? "—"}
      </strong>

      <div style={styles.metricTarget}>
        Objetivo: <strong>{objetivo ?? "—"}</strong>
      </div>

      <div
        style={{
          ...styles.status,
          background: alcanzado ? "#e3f1e8" : "#f7ece8",
          color: alcanzado ? "#3d7452" : "#a05b4b",
        }}
      >
        {estado || "Sin estado"}
      </div>
    </div>
  );
}

function InfoItem({ titulo, valor }) {
  return (
    <div style={styles.infoItem}>
      <small>{titulo}</small>
      <strong>{valor || "—"}</strong>
    </div>
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#edf4f0 0%,#dce8e2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Arial,sans-serif",
  },

  loginCard: {
    width: "100%",
    maxWidth: "430px",
    background: "#fff",
    borderRadius: "26px",
    padding: "45px",
    boxShadow: "0 25px 70px rgba(48,70,59,.13)",
  },

  logoCircle: {
    width: "68px",
    height: "68px",
    borderRadius: "50%",
    background: "#657f70",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "bold",
    margin: "0 auto 14px",
  },

  loginBadge: {
    textAlign: "center",
    color: "#657f70",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "2px",
  },

  title: {
    textAlign: "center",
    margin: "8px 0",
    color: "#30463b",
    fontSize: "30px",
  },

  subtitle: {
    textAlign: "center",
    color: "#7b8982",
    lineHeight: "1.6",
    marginBottom: "30px",
  },

  label: {
    display: "block",
    margin: "18px 0 8px",
    color: "#40534a",
    fontWeight: "bold",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "14px",
    border: "1px solid #d5ddd8",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "15px",
    border: "1px solid #d5ddd8",
    borderRadius: "10px",
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
    borderRadius: "10px",
    background: "#657f70",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  primaryButton: {
    marginTop: "20px",
    padding: "13px 22px",
    border: "none",
    borderRadius: "10px",
    background: "#657f70",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "#b44b4b",
    background: "#fff2f0",
    borderRadius: "8px",
    padding: "10px",
    marginTop: "12px",
    fontSize: "13px",
  },

  help: {
    textAlign: "center",
    color: "#89948f",
    fontSize: "12px",
    marginTop: "25px",
  },

  dashboard: {
    minHeight: "100vh",
    background: "#f4f7f5",
    fontFamily: "Arial,sans-serif",
  },

  header: {
    background: "#fff",
    padding: "20px 6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    boxShadow: "0 2px 12px rgba(0,0,0,.05)",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },

  headerKicker: {
    fontSize: "10px",
    letterSpacing: "2px",
    fontWeight: "bold",
    color: "#657f70",
    marginBottom: "4px",
  },

  headerTitle: {
    margin: 0,
    color: "#30463b",
    fontSize: "24px",
  },

  headerSubtitle: {
    margin: "5px 0 0",
    color: "#89948f",
    fontSize: "13px",
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  logout: {
    border: "1px solid #657f70",
    background: "#fff",
    color: "#657f70",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  printButton: {
    border: "none",
    background: "#657f70",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  mobileMenu: {
    position: "sticky",
    top: "77px",
    zIndex: 15,
    background: "#30463b",
    display: "flex",
    justifyContent: "center",
    gap: "4px",
    padding: "7px",
  },

  menuButton: {
    border: "none",
    background: "transparent",
    color: "#dfe9e3",
    padding: "9px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  menuButtonActive: {
    background: "#657f70",
    color: "#fff",
  },

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "35px 25px 60px",
  },

  hero: {
    background:
      "linear-gradient(135deg,#30463b 0%,#657f70 100%)",
    borderRadius: "22px",
    padding: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    color: "#fff",
  },

  heroEyebrow: {
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "2px",
    opacity: ".75",
  },

  heroTitle: {
    fontSize: "30px",
    margin: "10px 0",
  },

  heroText: {
    margin: 0,
    maxWidth: "620px",
    lineHeight: "1.6",
    opacity: ".86",
  },

  heroCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    flexShrink: 0,
  },

  heroScore: {
    background: "rgba(255,255,255,.12)",
    borderRadius: "18px",
    padding: "20px 25px",
    minWidth: "155px",
    textAlign: "center",
  },

  infoBar: {
    background: "#e9f0ec",
    borderRadius: "14px",
    padding: "17px 20px",
    display: "flex",
    gap: "45px",
    flexWrap: "wrap",
    marginTop: "18px",
  },

  infoHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "18px",
    margin: "22px 0",
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "0 5px 20px rgba(0,0,0,.045)",
  },

  cardNumber: {
    display: "block",
    fontSize: "32px",
    color: "#657f70",
    marginBottom: "8px",
  },

  cardTitle: {
    display: "block",
    color: "#30463b",
    marginBottom: "5px",
  },

  cardText: {
    color: "#89948f",
    fontSize: "13px",
  },

  metricCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 5px 20px rgba(0,0,0,.045)",
  },

  metricIcon: {
    fontSize: "22px",
    color: "#657f70",
  },

  metricTitle: {
    color: "#30463b",
    margin: "10px 0 0",
  },

  bigNumber: {
    display: "block",
    fontSize: "40px",
    color: "#657f70",
    marginTop: "10px",
  },

  longNumber: {
    fontSize: "18px",
    lineHeight: "1.45",
  },

  metricDescription: {
    color: "#89948f",
    fontSize: "13px",
  },

  panel: {
    background: "#fff",
    borderRadius: "18px",
    padding: "28px",
    marginTop: "22px",
    boxShadow: "0 5px 20px rgba(0,0,0,.045)",
  },

  panelTitle: {
    color: "#30463b",
    margin: "8px 0 15px",
  },

  sectionBadge: {
    display: "inline-block",
    color: "#657f70",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
  },

  paragraph: {
    color: "#65736c",
    lineHeight: "1.6",
  },

  adminForm: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "18px",
    marginTop: "22px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  formGroupFull: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    gridColumn: "1 / -1",
  },

  formLabel: {
    color: "#40534a",
    fontWeight: "bold",
    fontSize: "13px",
  },

  advisorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",
    gap: "12px",
  },

  advisor: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    border: "1px solid #edf0ee",
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

  productivityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: "18px",
  },

  metricBox: {
    border: "1px solid #e5ebe7",
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
    fontSize: "30px",
    color: "#30463b",
    margin: "10px 0",
  },

  metricTarget: {
    color: "#89948f",
    fontSize: "13px",
  },

  status: {
    display: "inline-block",
    marginTop: "14px",
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

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "18px",
    marginBottom: "18px",
  },

  actionCard: {
    background: "#f7f9f8",
    borderRadius: "15px",
    padding: "22px",
  },

  actionIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#e1ebe5",
    color: "#657f70",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "15px",
  },

  actionLabel: {
    display: "block",
    color: "#657f70",
    fontWeight: "bold",
    letterSpacing: "1px",
    fontSize: "10px",
    marginBottom: "8px",
  },

  actionCard: {
    background: "#f7f9f8",
    borderRadius: "15px",
    padding: "22px",
  },

  objectiveBox: {
    background: "#eef4f0",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "#40534a",
  },

  targetIcon: {
    fontSize: "30px",
  },

  empty: {
    textAlign: "center",
    padding: "30px",
    color: "#89948f",
    background: "#fafcfb",
    borderRadius: "12px",
  },

  auditBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "15px",
  },

  qualityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "15px",
  },

  infoItem: {
    padding: "18px",
    background: "#f7f9f8",
    borderRadius: "12px",
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
    border: "1px solid #e7ece9",
    borderRadius: "13px",
    background: "#fafcfb",
  },

  dataValue: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  commentArea: {
    background: "#f7f9f8",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "15px",
  },

  commentTitle: {
    marginTop: 0,
    color: "#30463b",
  },

  commentQuality: {
    background: "#eaf2ed",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "10px",
  },

  commentAdvisor: {
    background: "#fff",
    border: "1px solid #dce8e2",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "10px",
  },

  muted: {
    color: "#89948f",
  },

  successMessage: {
    color: "#3d7452",
    fontWeight: "bold",
    fontSize: "13px",
    marginTop: "15px",
  },

  history: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  historyItem: {
    display: "grid",
    gridTemplateColumns: "1fr auto 80px",
    alignItems: "center",
    gap: "15px",
    padding: "16px",
    border: "1px solid #edf0ee",
    borderRadius: "12px",
  },

  historyCurrent: {
    background: "#f2f7f4",
    border: "1px solid #dce8e2",
  },

  currentBadge: {
    display: "block",
    color: "#657f70",
    fontSize: "9px",
    fontWeight: "bold",
    letterSpacing: "1px",
    marginBottom: "5px",
  },

  historyNote: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: "3px",
  },

  historyScore: {
    fontSize: "24px",
    color: "#657f70",
  },
};
