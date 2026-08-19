"use client";

import { useEffect, useState } from "react";

const API_URL =
  "https://portal-calidad-api.ayelenvillega42.workers.dev";

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin123";

const FORM_INICIAL = {
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
};

const PRODUCTIVIDAD_INICIAL = {
  asesor_id: "",
  semana: "",
  sph: "",
  sph_objetivo: "",
  ventas: "",
  ventas_objetivo: "",
  objetivo_campana: "",
  objetivo_campana_descripcion: "",
  estado_sph: "",
  estado_ventas: "",
  estado_objetivo_campana: "",
  gestion_semana: ""
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

  const [reporteForm, setReporteForm] = useState(FORM_INICIAL);
  const [guardandoReporte, setGuardandoReporte] = useState(false);
  const [mensajeReporte, setMensajeReporte] = useState("");

  const [productividadForm, setProductividadForm] = useState(
    PRODUCTIVIDAD_INICIAL
  );
  const [guardandoProductividad, setGuardandoProductividad] =
    useState(false);
  const [mensajeProductividad, setMensajeProductividad] = useState("");

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

      setReportes(Array.isArray(datos[0]) ? datos[0] : []);
      setProductividad(Array.isArray(datos[1]) ? datos[1] : []);
      setTipificaciones(Array.isArray(datos[2]) ? datos[2] : []);
      setGestionCalidad(Array.isArray(datos[3]) ? datos[3] : []);
      setAuditoriasNoVenta(Array.isArray(datos[4]) ? datos[4] : []);
      setComentarios(Array.isArray(datos[5]) ? datos[5] : []);
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
        item.usuario_login &&
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

    setReporteForm(FORM_INICIAL);
    setProductividadForm(PRODUCTIVIDAD_INICIAL);

    setMensajeReporte("");
    setMensajeProductividad("");
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
          desvio_principal: reporteForm.desvio_principal,
          recomendaciones: reporteForm.recomendaciones,
          auditoria: reporteForm.auditoria,
          producto: reporteForm.producto,
          observaciones: reporteForm.observaciones
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo guardar el reporte."
        );
      }

      setMensajeReporte("Reporte cargado correctamente.");
      setReporteForm(FORM_INICIAL);
    } catch (error) {
      console.error(error);
      setMensajeReporte(
        "Ocurrió un error al cargar el reporte."
      );
    } finally {
      setGuardandoReporte(false);
    }
  }

  async function guardarProductividad() {
    if (
      !productividadForm.asesor_id ||
      !productividadForm.semana
    ) {
      setMensajeProductividad(
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    setGuardandoProductividad(true);
    setMensajeProductividad("");

    try {
      const response = await fetch(
        `${API_URL}/productividad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            asesor_id: Number(productividadForm.asesor_id),
            semana: productividadForm.semana,

            sph:
              productividadForm.sph === ""
                ? null
                : Number(productividadForm.sph),

            sph_objetivo:
              productividadForm.sph_objetivo === ""
                ? null
                : Number(productividadForm.sph_objetivo),

            ventas:
              productividadForm.ventas === ""
                ? null
                : Number(productividadForm.ventas),

            ventas_objetivo:
              productividadForm.ventas_objetivo === ""
                ? null
                : Number(productividadForm.ventas_objetivo),

            objetivo_campana:
              productividadForm.objetivo_campana,

            objetivo_campana_descripcion:
              productividadForm.objetivo_campana_descripcion,

            estado_sph:
              productividadForm.estado_sph,

            estado_ventas:
              productividadForm.estado_ventas,

            estado_objetivo_campana:
              productividadForm.estado_objetivo_campana,

            gestion_semana:
              productividadForm.gestion_semana
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo guardar la productividad."
        );
      }

      setMensajeProductividad(
        "Productividad cargada correctamente."
      );

      setProductividadForm(PRODUCTIVIDAD_INICIAL);
    } catch (error) {
      console.error(error);

      setMensajeProductividad(
        "Ocurrió un error al cargar la productividad."
      );
    } finally {
      setGuardandoProductividad(false);
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
      const response = await fetch(
        `${API_URL}/comentarios`,
        {
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
        }
      );

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

  /* =====================================================
     LOGIN
  ===================================================== */

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

  /* =====================================================
     ADMINISTRADOR
  ===================================================== */

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

          {/* RESUMEN */}

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
                ✓
              </span>

              <span style={styles.cardText}>
                Base de datos conectada
              </span>
            </div>

            <div style={styles.card}>
              <span style={styles.cardNumber}>
                +
              </span>

              <span style={styles.cardText}>
                Cargar información semanal
              </span>
            </div>

          </div>

          {/* =================================================
              REPORTE DE CALIDAD
          ================================================= */}

          <div style={styles.panel}>

            <div style={styles.sectionBadge}>
              CALIDAD
            </div>

            <h2 style={styles.panelTitle}>
              Cargar reporte de calidad
            </h2>

            <p style={styles.paragraph}>
              Cargá la nota, evolución, objetivos,
              desvíos y devolución correspondiente
              al asesor.
            </p>

            <div style={styles.adminForm}>

              <FormSelect
                label="Asesor"
                value={reporteForm.asesor_id}
                onChange={(value) =>
                  setReporteForm({
                    ...reporteForm,
                    asesor_id: value
                  })
                }
                asesores={asesores}
              />

              <FormInput
                label="Semana"
                placeholder="Ej: Semana 4 - Agosto"
                value={reporteForm.semana}
                onChange={(value) =>
                  setReporteForm({
                    ...reporteForm,
                    semana: value
                  })
                }
              />

              <FormInput
                label="Nota de calidad"
                type="number"
                placeholder="Ej: 85"
                value={reporteForm.nota}
                onChange={(value) =>
                  setReporteForm({
                    ...reporteForm,
                    nota: value
                  })
                }
              />

              <FormInput
                label="Evolución"
                placeholder="Ej: Mejora respecto de la semana anterior"
                value={reporteForm.evolucion}
                onChange={(value) =>
                  setReporteForm({
                    ...reporteForm,
                    evolucion: value
                  })
                }
              />

              <FormTextarea
                label="Objetivos"
                placeholder="¿Qué debe mejorar?"
                value={reporteForm.objetivos}
                onChange={(value) =>
                  setReporteForm({
                    ...reporteForm,
                    objetivos: value
                  })
                }
                full
              />

              <FormInput
                label="Desvío principal"
                placeholder="Ej: Validación de datos"
                value={reporteForm.desvio_principal}
                onChange={(value) =>
                  setReporteForm({
                    ...reporteForm,
                    desvio_principal: value
                  })
                }
              />

              <FormTextarea
                label="Recomendaciones"
                placeholder="¿Cómo puede mejorarlo?"
                value={reporteForm.recomendaciones}
                onChange={(value) =>
                  setReporteForm({
                    ...reporteForm,
                    recomendaciones: value
                  })
                }
              />

              <FormInput
                label="Auditoría"
                placeholder="Ej: Llamada auditada"
                value={reporteForm.auditoria}
                onChange={(value) =>
                  setReporteForm({
                    ...reporteForm,
                    auditoria: value
                  })
                }
              />

              <FormInput
                label="Producto"
                placeholder="Ej: AP / BM"
                value={reporteForm.producto}
                onChange={(value) =>
                  setReporteForm({
                    ...reporteForm,
                    producto: value
                  })
                }
              />

              <FormTextarea
                label="Observaciones"
                placeholder="Observaciones adicionales"
                value={reporteForm.observaciones}
                onChange={(value) =>
                  setReporteForm({
                    ...reporteForm,
                    observaciones: value
                  })
                }
                full
              />

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

          {/* =================================================
              PRODUCTIVIDAD
          ================================================= */}

          <div style={styles.panel}>

            <div style={styles.sectionBadge}>
              PRODUCTIVIDAD
            </div>

            <h2 style={styles.panelTitle}>
              Cargar productividad semanal
            </h2>

            <p style={styles.paragraph}>
              Completá los indicadores de productividad
              para que aparezcan automáticamente en el
              portal del asesor.
            </p>

            <div style={styles.adminForm}>

              <FormSelect
                label="Asesor"
                value={productividadForm.asesor_id}
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    asesor_id: value
                  })
                }
                asesores={asesores}
              />

              <FormInput
                label="Semana"
                placeholder="Ej: Semana 4 - Agosto"
                value={productividadForm.semana}
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    semana: value
                  })
                }
              />

              <FormInput
                label="SPH"
                type="number"
                placeholder="Ej: 0.85"
                value={productividadForm.sph}
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    sph: value
                  })
                }
              />

              <FormInput
                label="Objetivo SPH"
                type="number"
                placeholder="Ej: 1.00"
                value={productividadForm.sph_objetivo}
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    sph_objetivo: value
                  })
                }
              />

              <FormInput
                label="Ventas"
                type="number"
                placeholder="Ej: 12"
                value={productividadForm.ventas}
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    ventas: value
                  })
                }
              />

              <FormInput
                label="Objetivo de ventas"
                type="number"
                placeholder="Ej: 15"
                value={productividadForm.ventas_objetivo}
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    ventas_objetivo: value
                  })
                }
              />

              <FormInput
                label="Objetivo de campaña"
                placeholder="Ej: 20 ventas"
                value={productividadForm.objetivo_campana}
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    objetivo_campana: value
                  })
                }
              />

              <FormInput
                label="Descripción objetivo de campaña"
                placeholder="Ej: Alcanzar objetivo semanal"
                value={
                  productividadForm.objetivo_campana_descripcion
                }
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    objetivo_campana_descripcion: value
                  })
                }
              />

              <FormSelectSimple
                label="Estado SPH"
                value={productividadForm.estado_sph}
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    estado_sph: value
                  })
                }
              />

              <FormSelectSimple
                label="Estado ventas"
                value={productividadForm.estado_ventas}
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    estado_ventas: value
                  })
                }
              />

              <FormSelectSimple
                label="Estado objetivo de campaña"
                value={
                  productividadForm.estado_objetivo_campana
                }
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    estado_objetivo_campana: value
                  })
                }
              />

              <FormTextarea
                label="¿Qué se realizó durante la semana?"
                placeholder="Ej: Coaching, escuchas personalizadas, feedback..."
                value={productividadForm.gestion_semana}
                onChange={(value) =>
                  setProductividadForm({
                    ...productividadForm,
                    gestion_semana: value
                  })
                }
                full
              />

            </div>

            <button
              className="no-print"
              style={styles.primaryButton}
              onClick={guardarProductividad}
              disabled={guardandoProductividad}
            >
              {guardandoProductividad
                ? "GUARDANDO..."
                : "GUARDAR PRODUCTIVIDAD"}
            </button>

            {mensajeProductividad && (
              <p style={styles.successMessage}>
                {mensajeProductividad}
              </p>
            )}

          </div>

          {/* =================================================
              EQUIPO
          ================================================= */}

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

  /* =====================================================
     DATOS ASESOR
  ===================================================== */

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

  /* =====================================================
     PANEL ASESOR
  ===================================================== */

  return (
    <main style={styles.dashboard}>

      <header style={styles.header}>

        <div>

          <h1 style={styles.headerTitle}>
            Portal de Calidad
          </h1>

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

      <section style={styles.content}>

        <div className="no-print" style={styles.navigation}>
          <span>⌂ Resumen</span>
          <span>↗ Productividad</span>
          <span>✓ Calidad</span>
          <span>◎ Plan de acción</span>
          <span>▤ Tipificaciones</span>
          <span>! No venta</span>
          <span>◌ Devolución</span>
          <span>◷ Historial</span>
        </div>

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

        <div style={styles.heroSection}>

          <div>
            <div style={styles.sectionBadge}>
              SEGUIMIENTO PERSONAL
            </div>

            <h2 style={styles.sectionTitle}>
              Hola, {nombreMostrar}
            </h2>

            <p style={styles.welcome}>
              Este es tu espacio para conocer tus
              resultados, detectar oportunidades y
              trabajar en tu evolución.
            </p>
          </div>

          <div style={styles.currentScore}>
            <small>
              NOTA ACTUAL
            </small>

            <strong>
              {ultimoReporte?.nota ?? "—"}
            </strong>

            <span>
              {ultimoReporte?.semana || "Sin reporte"}
            </span>
          </div>

        </div>

        {/* INFORMACIÓN */}

        <div style={styles.infoBar}>

          <div>
            <strong>
              N° USUARIO
            </strong>

            <span>
              {sesion.numero_usuario}
            </span>
          </div>

          <div>
            <strong>
              USUARIO
            </strong>

            <span>
              {sesion.usuario}
            </span>
          </div>

          <div>
            <strong>
              SEMANA
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
              Estado
            </h3>

            <strong style={styles.weekText}>
              {ultimoReporte
                ? "Reporte disponible"
                : "Sin reporte"}
            </strong>

            <p>
              Información actualizada
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
                Qué tengo que trabajar
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
                  Punto principal a trabajar
                  durante el período.
                </p>

              </div>

            </div>

            <div style={styles.panel}>

              <div style={styles.sectionBadge}>
                RECOMENDACIÓN
              </div>

              <h2 style={styles.panelTitle}>
                Cómo mejorarlo
              </h2>

              <div style={styles.recommendationBox}>

                <div style={styles.checkIcon}>
                  ✓
                </div>

                <p>
                  {ultimoReporte.recomendaciones ||
                    "Sin recomendaciones cargadas"}
                </p>

              </div>

            </div>

            <div style={styles.panel}>

              <div style={styles.sectionBadge}>
                OBJETIVO
              </div>

              <h2 style={styles.panelTitle}>
                Objetivo de la semana
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
                      {item.porcentaje_desvio ?? "—"}
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

        {/* DEVOLUCIÓN */}

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
                  (item) => item.tipo === "calidad"
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
              placeholder="Podés dejar acá tus comentarios, dudas, compromisos o consultas..."
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

              <h3>
                Mis comentarios anteriores
              </h3>

              {comentarios
                .filter(
                  (item) => item.tipo === "asesor"
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

          <p style={styles.paragraph}>
            Consultá la evolución de tus resultados
            semana a semana.
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
                      ? styles.currentHistory
                      : {})
                  }}
                >

                  <div>

                    {index === 0 && (
                      <span style={styles.currentBadge}>
                        REPORTE ACTUAL
                      </span>
                    )}

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
          background: #f4f7f5;
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

          .navigation {
            overflow-x: auto;
            justify-content: flex-start !important;
          }

        }

      `}</style>

    </main>
  );
}

/* =========================================================
   COMPONENTES
========================================================= */

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text"
}) {
  return (
    <div style={styles.formGroup}>

      <label style={styles.formLabel}>
        {label}
      </label>

      <input
        style={styles.input}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  full = false
}) {
  return (
    <div
      style={
        full
          ? styles.formGroupFull
          : styles.formGroup
      }
    >

      <label style={styles.formLabel}>
        {label}
      </label>

      <textarea
        style={styles.textarea}
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  asesores
}) {
  return (
    <div style={styles.formGroup}>

      <label style={styles.formLabel}>
        {label}
      </label>

      <select
        style={styles.input}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
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
  );
}

function FormSelectSimple({
  label,
  value,
  onChange
}) {
  return (
    <div style={styles.formGroup}>

      <label style={styles.formLabel}>
        {label}
      </label>

      <select
        style={styles.input}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      >

        <option value="">
          Seleccionar estado
        </option>

        <option value="Cumplido">
          Cumplido
        </option>

        <option value="Alcanzado">
          Alcanzado
        </option>

        <option value="En proceso">
          En proceso
        </option>

        <option value="No alcanzado">
          No alcanzado
        </option>

      </select>

    </div>
  );
}

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
    margin: 0,
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
    border: "1px solid #d5ddd8",
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
    border: "1px solid #d5ddd8",
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

  navigation: {
    display: "flex",
    gap: "20px",
    padding: "15px 20px",
    background: "#ffffff",
    borderRadius: "14px",
    color: "#657f70",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "25px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.04)"
  },

  printHeader: {
    background: "#eef4f1",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px"
  },

  heroSection: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    flexWrap: "wrap",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)"
  },

  currentScore: {
    minWidth: "180px",
    textAlign: "center",
    padding: "20px",
    background: "#eef4f1",
    borderRadius: "16px"
  },

  currentScoreSmall: {
    display: "block"
  },

  currentScore: {
    minWidth: "180px",
    textAlign: "center",
    padding: "20px",
    background: "#eef4f1",
    borderRadius: "16px"
  },

  sectionTitle: {
    color: "#30463b",
    marginBottom: "8px"
  },

  welcome: {
    color: "#7b8982",
    lineHeight: "1.6"
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
    border: "1px solid #e5ebe7",
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

  recommendationBox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
    background: "#f2f6f3",
    borderRadius: "14px",
    color: "#40534a"
  },

  checkIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#e3f1e8",
    color: "#3d7452",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    flexShrink: 0
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
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
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
    border: "1px solid #e7ece9",
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
    border: "1px solid #dce8e2",
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
    border: "1px solid #edf0ee",
    borderRadius: "12px"
  },

  currentHistory: {
    background: "#f2f6f3",
    border:
      "1px solid #cddbd3"
  },

  currentBadge: {
    display: "block",
    color: "#657f70",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "1px",
    marginBottom: "5px"
  },

  historyScore: {
    fontSize: "22px",
    color: "#657f70"
  }
};
