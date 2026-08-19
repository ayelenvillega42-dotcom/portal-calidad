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

  const [reportes, setReportes] = useState([]);
  const [productividad, setProductividad] = useState([]);
  const [tipificaciones, setTipificaciones] = useState([]);
  const [gestionCalidad, setGestionCalidad] = useState([]);
  const [auditoriasNoVenta, setAuditoriasNoVenta] = useState([]);
  const [comentarios, setComentarios] = useState([]);

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [mensajeComentario, setMensajeComentario] = useState("");

  const [reporteForm, setReporteForm] = useState({
    asesor_id: "",
    semana: "",
    nota: "",
    evolucion: "",
    objetivos: "",
    desvio_principal: "",
    recomendaciones: "",
    auditoria: "",
    producto: "",
    observaciones: ""
  });

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
      setAsesores(data);
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
        fetch(`${API_URL}/comentarios?asesor_id=${asesorId}`)
      ]);

      const datos = await Promise.all(
        resultados.map(async (response) => {
          if (!response.ok) return [];
          return response.json();
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

    setReporteForm({
      asesor_id: "",
      semana: "",
      nota: "",
      evolucion: "",
      objetivos: "",
      desvio_principal: "",
      recomendaciones: "",
      auditoria: "",
      producto: "",
      observaciones: ""
    });

    setMensajeReporte("");
  }

  async function guardarReporte() {
    if (
      !reporteForm.asesor_id ||
      !reporteForm.semana
    ) {
      setMensajeReporte(
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    setGuardandoReporte(true);
    setMensajeReporte("");

    try {
      const response = await fetch(
        `${API_URL}/reportes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
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
            desvio_principal:
              reporteForm.desvio_principal,
            recomendaciones:
              reporteForm.recomendaciones,
            auditoria: reporteForm.auditoria,
            producto: reporteForm.producto,
            observaciones:
              reporteForm.observaciones
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo guardar el reporte."
        );
      }

      setMensajeReporte(
        "Reporte cargado correctamente."
      );

      setReporteForm({
        asesor_id: "",
        semana: "",
        nota: "",
        evolucion: "",
        objetivos: "",
        desvio_principal: "",
        recomendaciones: "",
        auditoria: "",
        producto: "",
        observaciones: ""
      });
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          asesor_id: sesion.id,
          semana: ultimoReporte.semana,
          tipo: "asesor",
          comentario: nuevoComentario.trim(),
          estado: "pendiente"
        })
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

  // =========================================================
  // LOGIN
  // =========================================================

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
            Bienvenido a tu espacio personal de
            seguimiento de calidad.
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
                : "INGRESAR A MI PORTAL"}
            </button>

          </form>

          <p style={styles.help}>
            ¿Necesitás ayuda? Contactá al equipo
            de Calidad.
          </p>

        </div>
      </main>
    );
  }

  // =========================================================
  // ADMINISTRADOR
  // =========================================================

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
            className="no-print"
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
            Desde acá vas a poder administrar la
            información semanal del equipo.
          </p>

          {/* RESUMEN ADMIN */}

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
                {reporteForm.semana
                  ? "NUEVO"
                  : "—"}
              </span>

              <span style={styles.cardText}>
                Carga semanal
              </span>
            </div>

            <div style={styles.card}>
              <span style={styles.cardNumber}>
                ✓
              </span>

              <span style={styles.cardText}>
                Base de datos conectada
              </span>
            </div>

          </div>

          {/* CARGA DE REPORTE */}

          <div style={styles.panel}>

            <div style={styles.sectionBadge}>
              CARGA SEMANAL
            </div>

            <h2 style={styles.panelTitle}>
              Cargar reporte de calidad
            </h2>

            <p style={styles.paragraph}>
              Seleccioná el asesor y completá la
              información correspondiente a la semana.
            </p>

            <div style={styles.adminForm}>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Asesor
                </label>

                <select
                  style={styles.input}
                  value={reporteForm.asesor_id}
                  onChange={(e) =>
                    setReporteForm({
                      ...reporteForm,
                      asesor_id: e.target.value
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
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Semana
                </label>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="Ej: Semana 3 - Agosto"
                  value={reporteForm.semana}
                  onChange={(e) =>
                    setReporteForm({
                      ...reporteForm,
                      semana: e.target.value
                    })
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Nota de calidad
                </label>

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
                      nota: e.target.value
                    })
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Evolución
                </label>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="Ej: Mejora respecto de la semana anterior"
                  value={reporteForm.evolucion}
                  onChange={(e) =>
                    setReporteForm({
                      ...reporteForm,
                      evolucion: e.target.value
                    })
                  }
                />
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.formLabel}>
                  Objetivos
                </label>

                <textarea
                  style={styles.textarea}
                  placeholder="¿Qué debe mejorar?"
                  value={reporteForm.objetivos}
                  onChange={(e) =>
                    setReporteForm({
                      ...reporteForm,
                      objetivos: e.target.value
                    })
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Desvío principal
                </label>

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
                        e.target.value
                    })
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Recomendaciones
                </label>

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
                        e.target.value
                    })
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Auditoría
                </label>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="Ej: Llamada auditada"
                  value={reporteForm.auditoria}
                  onChange={(e) =>
                    setReporteForm({
                      ...reporteForm,
                      auditoria: e.target.value
                    })
                  }
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Producto
                </label>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="Ej: AP / BM"
                  value={reporteForm.producto}
                  onChange={(e) =>
                    setReporteForm({
                      ...reporteForm,
                      producto: e.target.value
                    })
                  }
                />
              </div>

              <div style={styles.formGroupFull}>
                <label style={styles.formLabel}>
                  Observaciones
                </label>

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
                        e.target.value
                    })
                  }
                />
              </div>

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
              <p
                style={{
                  ...styles.successMessage,
                  marginTop: "15px"
                }}
              >
                {mensajeReporte}
              </p>
            )}

          </div>

          {/* EQUIPO */}

          <div style={styles.panel}>

            <div style={styles.sectionBadge}>
              EQUIPO
            </div>

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

          </div>

        </section>

      </main>
    );
  }

  // =========================================================
  // DATOS DEL ASESOR
  // =========================================================

  const nombreMostrar =
    sesion.nombre.split(", ")[1] ||
    sesion.nombre;

  const ultimoReporte =
    reportes.length > 0
      ? reportes[0]
      : null;

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

  // =========================================================
  // PANEL DEL ASESOR
  // =========================================================

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

      <section style={styles.content}>

        <div style={styles.printHeader}>

          <h1>
            Informe semanal de desempeño
          </h1>

          <p>
            {sesion.nombre}
          </p>

          {ultimoReporte && (
            <p>
              {ultimoReporte.semana}
            </p>
          )}

        </div>

        <h2 style={styles.sectionTitle}>
          Hola, {nombreMostrar}
        </h2>

        <p style={styles.welcome}>
          Este es tu espacio personal de seguimiento
          de calidad y desempeño.
        </p>

        {/* INFORMACIÓN */}

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

          <div>
            <strong>
              Semana
            </strong>

            <span>
              {ultimoReporte?.semana ||
                ultimaProductividad?.semana ||
                "—"}
            </span>
          </div>

        </div>

        {/* RESUMEN */}

        <div style={styles.cards}>

          <div style={styles.metricCard}>

            <span style={styles.metricIcon}>
              ★
            </span>

            <h3>
              Mi nota
            </h3>

            <strong style={styles.bigNumber}>
              {ultimoReporte?.nota ?? "—"}
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

            <strong style={styles.evolutionText}>
              {ultimoReporte?.evolucion || "—"}
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

            <strong style={styles.weekText}>
              {ultimoReporte?.semana || "—"}
            </strong>

            <p>
              Último reporte cargado
            </p>

          </div>

        </div>

        {/* PRODUCTIVIDAD */}

        <div style={styles.panel}>

          <div style={styles.sectionBadge}>
            PRODUCTIVIDAD
          </div>

          <h2 style={styles.panelTitle}>
            Mi desempeño semanal
          </h2>

          {!ultimaProductividad ? (

            <div style={styles.empty}>
              Todavía no hay datos de productividad
              cargados.
            </div>

          ) : (

            <div style={styles.productivityGrid}>

              <MetricBox
                titulo="SPH"
                resultado={
                  ultimaProductividad.sph
                }
                objetivo={
                  ultimaProductividad.sph_objetivo
                }
                estado={
                  ultimaProductividad.estado_sph
                }
              />

              <MetricBox
                titulo="VENTAS"
                resultado={
                  ultimaProductividad.ventas
                }
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
                  ultimaProductividad
                    .objetivo_campana_descripcion ||
                  ultimaProductividad.objetivo_campana
                }
                objetivo={
                  ultimaProductividad.objetivo_campana
                }
                estado={
                  ultimaProductividad
                    .estado_objetivo_campana
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

        </div>

        {/* PLAN DE ACCIÓN */}

        {ultimoReporte && (
          <>
            <div style={styles.panel}>

              <div style={styles.sectionBadge}>
                PLAN DE ACCIÓN
              </div>

              <h2 style={styles.panelTitle}>
                Objetivos de calidad
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
                    Principal punto de atención
                    del período.
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
                    Auditoría
                  </strong>

                  <p>
                    {ultimoReporte.auditoria ||
                      "Sin auditoría cargada"}
                  </p>
                </div>

                <div>
                  <strong>
                    Producto
                  </strong>

                  <p>
                    {ultimoReporte.producto || "—"}
                  </p>
                </div>

                <div>
                  <strong>
                    Observaciones
                  </strong>

                  <p>
                    {ultimoReporte.observaciones ||
                      "Sin observaciones"}
                  </p>
                </div>

              </div>

            </div>
          </>
        )}

        {/* TIPIFICACIONES */}

        <div style={styles.panel}>

          <div style={styles.sectionBadge}>
            TIPIFICACIONES
          </div>

          <h2 style={styles.panelTitle}>
            Seguimiento de tipificaciones
          </h2>

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

                    <strong>
                      {item.tipificacion ||
                        "Sin tipificación"}
                    </strong>

                    <p>
                      Semana: {item.semana}
                    </p>

                  </div>

                  <div style={styles.dataValue}>

                    <small>
                      % DESVÍO
                    </small>

                    <strong>
                      {item.porcentaje_desvio ??
                        "—"}

                      {item.porcentaje_desvio !== null
                        ? "%"
                        : ""}
                    </strong>

                  </div>

                  <div style={styles.dataValue}>

                    <small>
                      OBJETIVO
                    </small>

                    <strong>
                      {item.objetivo ?? "—"}
                    </strong>

                  </div>

                  <div>

                    <small>
                      COMPROMISO ESPERADO
                    </small>

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

        {/* GESTIÓN DE CALIDAD */}

        <div style={styles.panel}>

          <div style={styles.sectionBadge}>
            GESTIÓN DE CALIDAD
          </div>

          <h2 style={styles.panelTitle}>
            Seguimiento de la gestión
          </h2>

          {!ultimaGestion ? (

            <div style={styles.empty}>
              No hay información de gestión cargada.
            </div>

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

        {/* NO VENTA */}

        <div style={styles.panel}>

          <div style={styles.sectionBadge}>
            AUDITORÍAS DE NO VENTA
          </div>

          <h2 style={styles.panelTitle}>
            Oportunidades detectadas
          </h2>

          {!ultimaNoVenta ? (

            <div style={styles.empty}>
              No hay auditorías de no venta
              cargadas.
            </div>

          ) : (

            <div style={styles.auditNoVenta}>

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

        {/* DEVOLUCIONES */}

        <div style={styles.panel}>

          <div style={styles.sectionBadge}>
            DEVOLUCIÓN
          </div>

          <h2 style={styles.panelTitle}>
            Comunicación con Calidad
          </h2>

          <div style={styles.commentArea}>

            <h3>
              Devolución de Calidad
            </h3>

            {comentarios.filter(
              (item) => item.tipo === "calidad"
            ).length === 0 ? (

              <p style={styles.muted}>
                Todavía no hay una devolución
                cargada.
              </p>

            ) : (

              comentarios
                .filter(
                  (item) =>
                    item.tipo === "calidad"
                )
                .map((item) => (

                  <div
                    key={item.id}
                    style={styles.commentQuality}
                  >

                    <strong>
                      Calidad
                    </strong>

                    <p>
                      {item.comentario}
                    </p>

                    <small>
                      {item.fecha_carga}
                    </small>

                  </div>

                ))

            )}

          </div>

          <div style={styles.commentArea}>

            <h3>
              Mi comentario
            </h3>

            <textarea
              className="no-print"
              style={styles.textarea}
              placeholder="Podés dejar acá tus comentarios, dudas, compromisos o consultas sobre la devolución..."
              value={nuevoComentario}
              onChange={(e) =>
                setNuevoComentario(
                  e.target.value
                )
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

              <h3>
                Mis comentarios anteriores
              </h3>

              {comentarios
                .filter(
                  (item) =>
                    item.tipo === "asesor"
                )
                .map((item) => (

                  <div
                    key={item.id}
                    style={styles.commentAdvisor}
                  >

                    <strong>
                      Mi comentario
                    </strong>

                    <p>
                      {item.comentario}
                    </p>

                    <small>
                      {item.fecha_carga}
                    </small>

                  </div>

                ))}

            </div>

          )}

        </div>

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
              Todavía no hay reportes cargados.
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

      </section>

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
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

          .printHeader {
            display: block !important;
          }

          main {
            background: white !important;
          }

          section {
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

        @media (max-width: 700px) {

          .content {
            padding: 25px 15px !important;
          }

          .header {
            padding: 18px !important;
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

// =========================================================
// COMPONENTES
// =========================================================

function MetricBox({
  titulo,
  resultado,
  objetivo,
  estado
}) {
  const alcanzado =
    estado &&
    (
      estado.toLowerCase().includes("alcanz") ||
      estado.toLowerCase().includes("cumpl")
    );

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
            : "#a05b4b"
        }}
      >
        {estado || "Sin estado"}
      </div>

    </div>
  );
}

function InfoItem({
  titulo,
  valor
}) {
  return (
    <div style={styles.infoItem}>

      <small>
        {titulo}
      </small>

      <strong>
        {valor || "—"}
      </strong>

    </div>
  );
}

// =========================================================
// ESTILOS
// =========================================================

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
    marginBottom: "35px",
    lineHeight: "1.5"
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
    outline: "none",
    background: "#ffffff"
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
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
    marginTop: "20px",
    padding: "13px 22px",
    border: "none",
    borderRadius: "10px",
    background: "#657f70",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },

  printButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "9px",
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
    gap: "20px",
    flexWrap: "wrap",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)"
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap"
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

  printHeader: {
    background: "#eef4f1",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px"
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

  panelTitle: {
    color: "#30463b",
    marginTop: "10px"
  },

  sectionBadge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#657f70",
    marginBottom: "5px"
  },

  paragraph: {
    color: "#65736c",
    lineHeight: "1.6"
  },

  adminForm: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
    marginTop: "25px"
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },

  formGroupFull: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    gridColumn: "1 / -1"
  },

  formLabel: {
    color: "#40534a",
    fontWeight: "bold",
    fontSize: "13px"
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
    fontWeight: "bold",
    flexShrink: 0
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

  productivityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    marginTop: "20px"
  },

  metricBox: {
    border:
      "1px solid #e5ebe7",
    borderRadius: "15px",
    padding: "22px",
    background: "#fafcfb"
  },

  metricBoxTitle: {
    display: "block",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#657f70",
    letterSpacing: "1px"
  },

  metricResult: {
    display: "block",
    fontSize: "32px",
    color: "#30463b",
    margin: "10px 0"
  },

  metricTarget: {
    color: "#89948f",
    fontSize: "14px"
  },

  status: {
    display: "inline-block",
    marginTop: "15px",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold"
  },

  managementBox: {
    background: "#f2f6f3",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "20px",
    color: "#40534a"
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
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

  empty: {
    textAlign: "center",
    padding: "25px",
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

  auditNoVenta: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px"
  },

  qualityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px"
  },

  infoItem: {
    padding: "18px",
    background: "#f7f9f8",
    borderRadius: "12px"
  },

  dataList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
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
    background: "#fafcfb"
  },

  dataValue: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },

  commentArea: {
    background: "#f7f9f8",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "18px"
  },

  commentQuality: {
    background: "#eaf2ed",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "10px"
  },

  commentAdvisor: {
    background: "#ffffff",
    border:
      "1px solid #dce8e2",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "10px"
  },

  muted: {
    color: "#89948f"
  },

  successMessage: {
    color: "#3d7452",
    fontWeight: "bold",
    fontSize: "14px"
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
  }

};
