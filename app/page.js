"use client";

import { useEffect, useState } from "react";

const API_URL =
  "https://portal-calidad-api.ayelenvillega42.workers.dev";

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin123";

const reporteInicial = {
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

const productividadInicial = {
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
  gestion_semana: "",
};

const gestionInicial = {
  asesor_id: "",
  semana: "",
  cantidad_auditorias: "",
  oportunidades_mejora: "",
  coaching_brindado: "",
  registro_sistema: "",
  compromiso_esperado: "",
  fortalezas_destacadas: "",
};

const tipificacionInicial = {
  asesor_id: "",
  semana: "",
  tipificacion: "",
  porcentaje_desvio: "",
  objetivo: "",
  compromiso_esperado: "",
};

const noVentaInicial = {
  asesor_id: "",
  semana: "",
  cantidad_auditorias: "",
  oportunidades_detectadas: "",
  desvio_principal: "",
  recomendaciones: "",
  compromiso_esperado: "",
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

  const [reporteForm, setReporteForm] =
    useState(reporteInicial);

  const [productividadForm, setProductividadForm] =
    useState(productividadInicial);

  const [gestionForm, setGestionForm] =
    useState(gestionInicial);

  const [tipificacionForm, setTipificacionForm] =
    useState(tipificacionInicial);

  const [noVentaForm, setNoVentaForm] =
    useState(noVentaInicial);

  const [guardando, setGuardando] = useState(false);
  const [mensajeAdmin, setMensajeAdmin] = useState("");

  const [adminTab, setAdminTab] = useState("reporte");
  const [asesorSeleccionado, setAsesorSeleccionado] =
    useState("");

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
    if (!asesorId) return;

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
          return response.json();
        })
      );

      setReportes(datos[0] || []);
      setProductividad(datos[1] || []);
      setTipificaciones(datos[2] || []);
      setGestionCalidad(datos[3] || []);
      setAuditoriasNoVenta(datos[4] || []);
      setComentarios(datos[5] || []);
    } catch (error) {
      console.error(error);
    }
  }

  function iniciarSesion(e) {
    e.preventDefault();
    setError("");

    const usuarioIngresado =
      usuario.toLowerCase().trim();

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
        item.usuario_login.toLowerCase() ===
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

    setAsesorSeleccionado("");
    setMensajeAdmin("");
  }

  function seleccionarAsesor(id) {
    setAsesorSeleccionado(id);

    setReporteForm({
      ...reporteInicial,
      asesor_id: id,
    });

    setProductividadForm({
      ...productividadInicial,
      asesor_id: id,
    });

    setGestionForm({
      ...gestionInicial,
      asesor_id: id,
    });

    setTipificacionForm({
      ...tipificacionInicial,
      asesor_id: id,
    });

    setNoVentaForm({
      ...noVentaInicial,
      asesor_id: id,
    });

    setMensajeAdmin("");

    if (id) {
      cargarDatosAsesor(id);
    }
  }

  async function guardarReporte() {
    if (
      !reporteForm.asesor_id ||
      !reporteForm.semana
    ) {
      setMensajeAdmin(
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    setGuardando(true);
    setMensajeAdmin("");

    try {
      const response = await fetch(
        `${API_URL}/reportes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesor_id: Number(
              reporteForm.asesor_id
            ),
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
              reporteForm.observaciones,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo guardar el reporte."
        );
      }

      setMensajeAdmin(
        "Reporte semanal cargado correctamente."
      );

      await cargarDatosAsesor(
        reporteForm.asesor_id
      );
    } catch (error) {
      console.error(error);

      setMensajeAdmin(
        error.message ||
          "No se pudo guardar el reporte."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function guardarProductividad() {
    if (
      !productividadForm.asesor_id ||
      !productividadForm.semana
    ) {
      setMensajeAdmin(
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    setGuardando(true);
    setMensajeAdmin("");

    try {
      const response = await fetch(
        `${API_URL}/productividad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesor_id: Number(
              productividadForm.asesor_id
            ),
            semana: productividadForm.semana,
            sph: productividadForm.sph,
            sph_objetivo:
              productividadForm.sph_objetivo,
            ventas: productividadForm.ventas,
            ventas_objetivo:
              productividadForm.ventas_objetivo,
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
              productividadForm.gestion_semana,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo guardar la productividad."
        );
      }

      setMensajeAdmin(
        "Productividad cargada correctamente."
      );

      await cargarDatosAsesor(
        productividadForm.asesor_id
      );
    } catch (error) {
      console.error(error);

      setMensajeAdmin(
        error.message ||
          "No se pudo guardar la productividad."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function guardarGestion() {
    if (
      !gestionForm.asesor_id ||
      !gestionForm.semana
    ) {
      setMensajeAdmin(
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    setGuardando(true);
    setMensajeAdmin("");

    try {
      const response = await fetch(
        `${API_URL}/gestion-calidad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesor_id: Number(
              gestionForm.asesor_id
            ),
            semana: gestionForm.semana,
            cantidad_auditorias:
              gestionForm.cantidad_auditorias,
            oportunidades_mejora:
              gestionForm.oportunidades_mejora,
            coaching_brindado:
              gestionForm.coaching_brindado,
            registro_sistema:
              gestionForm.registro_sistema,
            compromiso_esperado:
              gestionForm.compromiso_esperado,
            fortalezas_destacadas:
              gestionForm.fortalezas_destacadas,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo guardar la gestión."
        );
      }

      setMensajeAdmin(
        "Gestión de calidad cargada correctamente."
      );

      await cargarDatosAsesor(
        gestionForm.asesor_id
      );
    } catch (error) {
      console.error(error);

      setMensajeAdmin(
        error.message ||
          "No se pudo guardar la gestión."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function guardarTipificacion() {
    if (
      !tipificacionForm.asesor_id ||
      !tipificacionForm.semana
    ) {
      setMensajeAdmin(
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    setGuardando(true);
    setMensajeAdmin("");

    try {
      const response = await fetch(
        `${API_URL}/tipificaciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesor_id: Number(
              tipificacionForm.asesor_id
            ),
            semana: tipificacionForm.semana,
            tipificacion:
              tipificacionForm.tipificacion,
            porcentaje_desvio:
              tipificacionForm.porcentaje_desvio ===
              ""
                ? null
                : Number(
                    tipificacionForm.porcentaje_desvio
                  ),
            objetivo:
              tipificacionForm.objetivo,
            compromiso_esperado:
              tipificacionForm.compromiso_esperado,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo guardar la tipificación."
        );
      }

      setMensajeAdmin(
        "Tipificación cargada correctamente."
      );

      await cargarDatosAsesor(
        tipificacionForm.asesor_id
      );
    } catch (error) {
      console.error(error);

      setMensajeAdmin(
        error.message ||
          "No se pudo guardar la tipificación."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function guardarNoVenta() {
    if (
      !noVentaForm.asesor_id ||
      !noVentaForm.semana
    ) {
      setMensajeAdmin(
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    setGuardando(true);
    setMensajeAdmin("");

    try {
      const response = await fetch(
        `${API_URL}/auditorias-no-venta`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesor_id: Number(
              noVentaForm.asesor_id
            ),
            semana: noVentaForm.semana,
            cantidad_auditorias:
              noVentaForm.cantidad_auditorias,
            oportunidades_detectadas:
              noVentaForm.oportunidades_detectadas,
            desvio_principal:
              noVentaForm.desvio_principal,
            recomendaciones:
              noVentaForm.recomendaciones,
            compromiso_esperado:
              noVentaForm.compromiso_esperado,
            observaciones:
              noVentaForm.observaciones,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo guardar la auditoría."
        );
      }

      setMensajeAdmin(
        "Auditoría de no venta cargada correctamente."
      );

      await cargarDatosAsesor(
        noVentaForm.asesor_id
      );
    } catch (error) {
      console.error(error);

      setMensajeAdmin(
        error.message ||
          "No se pudo guardar la auditoría."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function responderComentario(
    comentario
  ) {
    const respuesta = window.prompt(
      "Escribí la devolución de Calidad:"
    );

    if (!respuesta || !respuesta.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/comentarios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesor_id: comentario.asesor_id,
            semana: comentario.semana,
            tipo: "calidad",
            comentario: respuesta.trim(),
            estado: "respondido",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo enviar la devolución."
        );
      }

      await cargarDatosAsesor(
        comentario.asesor_id
      );
    } catch (error) {
      console.error(error);
      alert(
        "No se pudo enviar la devolución."
      );
    }
  }

  async function enviarComentario() {
    if (!nuevoComentario.trim()) return;

    const ultimoReporte =
      reportes.length > 0
        ? reportes[0]
        : null;

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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesor_id: sesion.id,
            semana: ultimoReporte.semana,
            tipo: "asesor",
            comentario:
              nuevoComentario.trim(),
            estado: "pendiente",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo guardar el comentario."
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

  if (sesion.rol === "admin") {
    const comentariosPendientes =
      comentarios.filter(
        (item) =>
          item.tipo === "asesor" &&
          item.estado === "pendiente"
      );

    const asesorElegido =
      asesores.find(
        (a) =>
          String(a.id) ===
          String(asesorSeleccionado)
      );

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
            Panel de Calidad
          </h2>

          <p style={styles.welcome}>
            Desde acá podés administrar el
            seguimiento semanal de todo el equipo.
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
                {reportes.length}
              </span>

              <span style={styles.cardText}>
                Reportes del asesor seleccionado
              </span>
            </div>

            <div style={styles.card}>
              <span style={styles.cardNumber}>
                {comentariosPendientes.length}
              </span>

              <span style={styles.cardText}>
                Comentarios pendientes
              </span>
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.sectionBadge}>
              EQUIPO
            </div>

            <h2 style={styles.panelTitle}>
              Seleccionar asesor
            </h2>

            <select
              style={styles.input}
              value={asesorSeleccionado}
              onChange={(e) =>
                seleccionarAsesor(e.target.value)
              }
            >
              <option value="">
                Seleccioná un asesor
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

            {asesorElegido && (
              <div style={styles.selectedAdvisor}>
                <div style={styles.avatarLarge}>
                  {asesorElegido.nombre.charAt(0)}
                </div>

                <div>
                  <strong>
                    {asesorElegido.nombre}
                  </strong>

                  <p>
                    Usuario:{" "}
                    {asesorElegido.usuario_login}
                  </p>

                  <p>
                    N° usuario:{" "}
                    {asesorElegido.numero_usuario}
                  </p>
                </div>
              </div>
            )}
          </div>

          {asesorSeleccionado && (
            <>
              <div style={styles.adminTabs}>
                <button
                  style={
                    adminTab === "reporte"
                      ? styles.activeTab
                      : styles.tab
                  }
                  onClick={() =>
                    setAdminTab("reporte")
                  }
                >
                  REPORTE
                </button>

                <button
                  style={
                    adminTab === "productividad"
                      ? styles.activeTab
                      : styles.tab
                  }
                  onClick={() =>
                    setAdminTab("productividad")
                  }
                >
                  PRODUCTIVIDAD
                </button>

                <button
                  style={
                    adminTab === "gestion"
                      ? styles.activeTab
                      : styles.tab
                  }
                  onClick={() =>
                    setAdminTab("gestion")
                  }
                >
                  CALIDAD
                </button>

                <button
                  style={
                    adminTab === "tipificaciones"
                      ? styles.activeTab
                      : styles.tab
                  }
                  onClick={() =>
                    setAdminTab(
                      "tipificaciones"
                    )
                  }
                >
                  TIPIFICACIONES
                </button>

                <button
                  style={
                    adminTab === "noventa"
                      ? styles.activeTab
                      : styles.tab
                  }
                  onClick={() =>
                    setAdminTab("noventa")
                  }
                >
                  NO VENTA
                </button>

                <button
                  style={
                    adminTab === "comentarios"
                      ? styles.activeTab
                      : styles.tab
                  }
                  onClick={() =>
                    setAdminTab("comentarios")
                  }
                >
                  DEVOLUCIONES
                </button>
              </div>

              {adminTab === "reporte" && (
                <div style={styles.panel}>
                  <div style={styles.sectionBadge}>
                    CARGA SEMANAL
                  </div>

                  <h2 style={styles.panelTitle}>
                    Reporte de calidad
                  </h2>

                  <div style={styles.adminForm}>
                    <FormInput
                      label="Semana"
                      placeholder="Ej: Semana 4 - Agosto"
                      value={reporteForm.semana}
                      onChange={(value) =>
                        setReporteForm({
                          ...reporteForm,
                          semana: value,
                        })
                      }
                    />

                    <FormInput
                      label="Nota de calidad"
                      type="number"
                      placeholder="Ej: 91"
                      value={reporteForm.nota}
                      onChange={(value) =>
                        setReporteForm({
                          ...reporteForm,
                          nota: value,
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
                          evolucion: value,
                        })
                      }
                    />

                    <FormInput
                      label="Desvío principal"
                      placeholder="Ej: Validación de datos"
                      value={
                        reporteForm.desvio_principal
                      }
                      onChange={(value) =>
                        setReporteForm({
                          ...reporteForm,
                          desvio_principal:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Objetivo de la semana"
                      placeholder="Qué debe lograr durante la semana..."
                      value={
                        reporteForm.objetivos
                      }
                      onChange={(value) =>
                        setReporteForm({
                          ...reporteForm,
                          objetivos: value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Recomendación"
                      placeholder="Cómo puede mejorar..."
                      value={
                        reporteForm.recomendaciones
                      }
                      onChange={(value) =>
                        setReporteForm({
                          ...reporteForm,
                          recomendaciones:
                            value,
                        })
                      }
                    />

                    <FormInput
                      label="Auditoría"
                      placeholder="Ej: Llamada auditada"
                      value={
                        reporteForm.auditoria
                      }
                      onChange={(value) =>
                        setReporteForm({
                          ...reporteForm,
                          auditoria: value,
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
                          producto: value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Observaciones"
                      placeholder="Observaciones adicionales..."
                      value={
                        reporteForm.observaciones
                      }
                      onChange={(value) =>
                        setReporteForm({
                          ...reporteForm,
                          observaciones:
                            value,
                        })
                      }
                    />
                  </div>

                  <button
                    style={styles.primaryButton}
                    onClick={guardarReporte}
                    disabled={guardando}
                  >
                    {guardando
                      ? "GUARDANDO..."
                      : "GUARDAR REPORTE"}
                  </button>

                  {mensajeAdmin && (
                    <p
                      style={
                        styles.successMessage
                      }
                    >
                      {mensajeAdmin}
                    </p>
                  )}
                </div>
              )}

              {adminTab === "productividad" && (
                <div style={styles.panel}>
                  <div style={styles.sectionBadge}>
                    PRODUCTIVIDAD
                  </div>

                  <h2 style={styles.panelTitle}>
                    Desempeño semanal
                  </h2>

                  <div style={styles.adminForm}>
                    <FormInput
                      label="Semana"
                      placeholder="Semana 4 - Agosto"
                      value={
                        productividadForm.semana
                      }
                      onChange={(value) =>
                        setProductividadForm({
                          ...productividadForm,
                          semana: value,
                        })
                      }
                    />

                    <FormInput
                      label="SPH"
                      placeholder="Ej: 0.53"
                      value={
                        productividadForm.sph
                      }
                      onChange={(value) =>
                        setProductividadForm({
                          ...productividadForm,
                          sph: value,
                        })
                      }
                    />

                    <FormInput
                      label="Objetivo SPH"
                      placeholder="Ej: 0.60"
                      value={
                        productividadForm.sph_objetivo
                      }
                      onChange={(value) =>
                        setProductividadForm({
                          ...productividadForm,
                          sph_objetivo:
                            value,
                        })
                      }
                    />

                    <FormInput
                      label="Ventas"
                      placeholder="Ej: 12"
                      value={
                        productividadForm.ventas
                      }
                      onChange={(value) =>
                        setProductividadForm({
                          ...productividadForm,
                          ventas: value,
                        })
                      }
                    />

                    <FormInput
                      label="Objetivo de ventas"
                      placeholder="Ej: 15"
                      value={
                        productividadForm.ventas_objetivo
                      }
                      onChange={(value) =>
                        setProductividadForm({
                          ...productividadForm,
                          ventas_objetivo:
                            value,
                        })
                      }
                    />

                    <FormInput
                      label="Objetivo de campaña"
                      placeholder="Ej: Cumplimiento"
                      value={
                        productividadForm.objetivo_campana
                      }
                      onChange={(value) =>
                        setProductividadForm({
                          ...productividadForm,
                          objetivo_campana:
                            value,
                        })
                      }
                    />

                    <FormInput
                      label="Estado SPH"
                      placeholder="Ej: Cumplido / En proceso"
                      value={
                        productividadForm.estado_sph
                      }
                      onChange={(value) =>
                        setProductividadForm({
                          ...productividadForm,
                          estado_sph: value,
                        })
                      }
                    />

                    <FormInput
                      label="Estado ventas"
                      placeholder="Ej: Cumplido"
                      value={
                        productividadForm.estado_ventas
                      }
                      onChange={(value) =>
                        setProductividadForm({
                          ...productividadForm,
                          estado_ventas:
                            value,
                        })
                      }
                    />

                    <FormInput
                      label="Estado objetivo campaña"
                      placeholder="Ej: Cumplido"
                      value={
                        productividadForm.estado_objetivo_campana
                      }
                      onChange={(value) =>
                        setProductividadForm({
                          ...productividadForm,
                          estado_objetivo_campana:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Descripción del objetivo"
                      placeholder="Detalle del objetivo..."
                      value={
                        productividadForm.objetivo_campana_descripcion
                      }
                      onChange={(value) =>
                        setProductividadForm({
                          ...productividadForm,
                          objetivo_campana_descripcion:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Gestión realizada durante la semana"
                      placeholder="Coaching, escuchas, calibraciones, talleres..."
                      value={
                        productividadForm.gestion_semana
                      }
                      onChange={(value) =>
                        setProductividadForm({
                          ...productividadForm,
                          gestion_semana:
                            value,
                        })
                      }
                    />
                  </div>

                  <button
                    style={styles.primaryButton}
                    onClick={
                      guardarProductividad
                    }
                    disabled={guardando}
                  >
                    {guardando
                      ? "GUARDANDO..."
                      : "GUARDAR PRODUCTIVIDAD"}
                  </button>

                  {mensajeAdmin && (
                    <p
                      style={
                        styles.successMessage
                      }
                    >
                      {mensajeAdmin}
                    </p>
                  )}
                </div>
              )}

              {adminTab === "gestion" && (
                <div style={styles.panel}>
                  <div style={styles.sectionBadge}>
                    GESTIÓN DE CALIDAD
                  </div>

                  <h2 style={styles.panelTitle}>
                    Seguimiento de calidad
                  </h2>

                  <div style={styles.adminForm}>
                    <FormInput
                      label="Semana"
                      placeholder="Semana 4 - Agosto"
                      value={gestionForm.semana}
                      onChange={(value) =>
                        setGestionForm({
                          ...gestionForm,
                          semana: value,
                        })
                      }
                    />

                    <FormInput
                      label="Cantidad de auditorías"
                      type="number"
                      value={
                        gestionForm.cantidad_auditorias
                      }
                      onChange={(value) =>
                        setGestionForm({
                          ...gestionForm,
                          cantidad_auditorias:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Oportunidades de mejora"
                      value={
                        gestionForm.oportunidades_mejora
                      }
                      onChange={(value) =>
                        setGestionForm({
                          ...gestionForm,
                          oportunidades_mejora:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Coaching brindado"
                      value={
                        gestionForm.coaching_brindado
                      }
                      onChange={(value) =>
                        setGestionForm({
                          ...gestionForm,
                          coaching_brindado:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Registro en sistema"
                      value={
                        gestionForm.registro_sistema
                      }
                      onChange={(value) =>
                        setGestionForm({
                          ...gestionForm,
                          registro_sistema:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Compromiso esperado"
                      value={
                        gestionForm.compromiso_esperado
                      }
                      onChange={(value) =>
                        setGestionForm({
                          ...gestionForm,
                          compromiso_esperado:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Fortalezas destacadas"
                      value={
                        gestionForm.fortalezas_destacadas
                      }
                      onChange={(value) =>
                        setGestionForm({
                          ...gestionForm,
                          fortalezas_destacadas:
                            value,
                        })
                      }
                    />
                  </div>

                  <button
                    style={styles.primaryButton}
                    onClick={guardarGestion}
                    disabled={guardando}
                  >
                    {guardando
                      ? "GUARDANDO..."
                      : "GUARDAR GESTIÓN"}
                  </button>

                  {mensajeAdmin && (
                    <p
                      style={
                        styles.successMessage
                      }
                    >
                      {mensajeAdmin}
                    </p>
                  )}
                </div>
              )}

              {adminTab ===
                "tipificaciones" && (
                <div style={styles.panel}>
                  <div style={styles.sectionBadge}>
                    TIPIFICACIONES
                  </div>

                  <h2 style={styles.panelTitle}>
                    Cargar tipificación
                  </h2>

                  <div style={styles.adminForm}>
                    <FormInput
                      label="Semana"
                      value={
                        tipificacionForm.semana
                      }
                      onChange={(value) =>
                        setTipificacionForm({
                          ...tipificacionForm,
                          semana: value,
                        })
                      }
                    />

                    <FormInput
                      label="Tipificación"
                      placeholder="Ej: Validación de datos"
                      value={
                        tipificacionForm.tipificacion
                      }
                      onChange={(value) =>
                        setTipificacionForm({
                          ...tipificacionForm,
                          tipificacion:
                            value,
                        })
                      }
                    />

                    <FormInput
                      label="% Desvío"
                      type="number"
                      value={
                        tipificacionForm.porcentaje_desvio
                      }
                      onChange={(value) =>
                        setTipificacionForm({
                          ...tipificacionForm,
                          porcentaje_desvio:
                            value,
                        })
                      }
                    />

                    <FormInput
                      label="Objetivo"
                      placeholder="Ej: 0.18"
                      value={
                        tipificacionForm.objetivo
                      }
                      onChange={(value) =>
                        setTipificacionForm({
                          ...tipificacionForm,
                          objetivo: value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Compromiso esperado"
                      value={
                        tipificacionForm.compromiso_esperado
                      }
                      onChange={(value) =>
                        setTipificacionForm({
                          ...tipificacionForm,
                          compromiso_esperado:
                            value,
                        })
                      }
                    />
                  </div>

                  <button
                    style={styles.primaryButton}
                    onClick={
                      guardarTipificacion
                    }
                    disabled={guardando}
                  >
                    {guardando
                      ? "GUARDANDO..."
                      : "GUARDAR TIPIFICACIÓN"}
                  </button>

                  {mensajeAdmin && (
                    <p
                      style={
                        styles.successMessage
                      }
                    >
                      {mensajeAdmin}
                    </p>
                  )}
                </div>
              )}

              {adminTab === "noventa" && (
                <div style={styles.panel}>
                  <div style={styles.sectionBadge}>
                    AUDITORÍAS DE NO VENTA
                  </div>

                  <h2 style={styles.panelTitle}>
                    Cargar oportunidad de no venta
                  </h2>

                  <div style={styles.adminForm}>
                    <FormInput
                      label="Semana"
                      value={
                        noVentaForm.semana
                      }
                      onChange={(value) =>
                        setNoVentaForm({
                          ...noVentaForm,
                          semana: value,
                        })
                      }
                    />

                    <FormInput
                      label="Cantidad de auditorías"
                      type="number"
                      value={
                        noVentaForm.cantidad_auditorias
                      }
                      onChange={(value) =>
                        setNoVentaForm({
                          ...noVentaForm,
                          cantidad_auditorias:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Oportunidades detectadas"
                      value={
                        noVentaForm.oportunidades_detectadas
                      }
                      onChange={(value) =>
                        setNoVentaForm({
                          ...noVentaForm,
                          oportunidades_detectadas:
                            value,
                        })
                      }
                    />

                    <FormInput
                      label="Desvío principal"
                      value={
                        noVentaForm.desvio_principal
                      }
                      onChange={(value) =>
                        setNoVentaForm({
                          ...noVentaForm,
                          desvio_principal:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Recomendaciones"
                      value={
                        noVentaForm.recomendaciones
                      }
                      onChange={(value) =>
                        setNoVentaForm({
                          ...noVentaForm,
                          recomendaciones:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Compromiso esperado"
                      value={
                        noVentaForm.compromiso_esperado
                      }
                      onChange={(value) =>
                        setNoVentaForm({
                          ...noVentaForm,
                          compromiso_esperado:
                            value,
                        })
                      }
                    />

                    <FormTextarea
                      label="Observaciones"
                      value={
                        noVentaForm.observaciones
                      }
                      onChange={(value) =>
                        setNoVentaForm({
                          ...noVentaForm,
                          observaciones:
                            value,
                        })
                      }
                    />
                  </div>

                  <button
                    style={styles.primaryButton}
                    onClick={guardarNoVenta}
                    disabled={guardando}
                  >
                    {guardando
                      ? "GUARDANDO..."
                      : "GUARDAR NO VENTA"}
                  </button>

                  {mensajeAdmin && (
                    <p
                      style={
                        styles.successMessage
                      }
                    >
                      {mensajeAdmin}
                    </p>
                  )}
                </div>
              )}

              {adminTab ===
                "comentarios" && (
                <div style={styles.panel}>
                  <div style={styles.sectionBadge}>
                    DEVOLUCIONES
                  </div>

                  <h2 style={styles.panelTitle}>
                    Comunicación con el asesor
                  </h2>

                  {comentarios.filter(
                    (item) =>
                      item.tipo === "asesor"
                  ).length === 0 ? (
                    <div style={styles.empty}>
                      Este asesor todavía no dejó
                      comentarios.
                    </div>
                  ) : (
                    comentarios
                      .filter(
                        (item) =>
                          item.tipo === "asesor"
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          style={
                            styles.adminComment
                          }
                        >
                          <div>
                            <strong>
                              Comentario del asesor
                            </strong>

                            <p>
                              {item.comentario}
                            </p>

                            <small>
                              Semana:{" "}
                              {item.semana}
                            </small>
                          </div>

                          <button
                            style={
                              styles.primaryButton
                            }
                            onClick={() =>
                              responderComentario(
                                item
                              )
                            }
                          >
                            RESPONDER
                          </button>
                        </div>
                      ))
                  )}
                </div>
              )}

              <div style={styles.panel}>
                <div style={styles.sectionBadge}>
                  HISTORIAL
                </div>

                <h2 style={styles.panelTitle}>
                  Reportes cargados
                </h2>

                {reportes.length === 0 ? (
                  <div style={styles.empty}>
                    Todavía no hay reportes para
                    este asesor.
                  </div>
                ) : (
                  <div style={styles.history}>
                    {reportes.map(
                      (reporte) => (
                        <div
                          key={reporte.id}
                          style={
                            styles.historyItem
                          }
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
                            style={
                              styles.historyScore
                            }
                          >
                            {reporte.nota ??
                              "—"}
                          </strong>

                          <span>
                            {reporte.producto ||
                              "—"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {!asesorSeleccionado && (
            <div style={styles.emptyBig}>
              <div style={styles.emptyBigIcon}>
                Q
              </div>

              <h2>
                Seleccioná un asesor
              </h2>

              <p>
                Elegí un integrante del equipo
                para comenzar a cargar o consultar
                su información semanal.
              </p>
            </div>
          )}
        </section>
      </main>
    );
  }

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
            style={styles.printButton}
            onClick={imprimirInforme}
          >
            Imprimir informe
          </button>

          <button
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

          <p>{sesion.nombre}</p>

          {ultimoReporte && (
            <p>{ultimoReporte.semana}</p>
          )}
        </div>

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

        <div style={styles.infoBar}>
          <div>
            <strong>N° USUARIO</strong>
            <span>
              {sesion.numero_usuario}
            </span>
          </div>

          <div>
            <strong>USUARIO</strong>
            <span>{sesion.usuario}</span>
          </div>

          <div>
            <strong>SEMANA</strong>
            <span>
              {ultimoReporte?.semana ||
                "—"}
            </span>
          </div>
        </div>

        <div style={styles.cards}>
          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>
              ★
            </span>

            <h3>Mi nota</h3>

            <strong style={styles.bigNumber}>
              {ultimoReporte?.nota ?? "—"}
            </strong>

            <p>Resultado de calidad</p>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>
              ↗
            </span>

            <h3>Evolución</h3>

            <strong
              style={styles.evolutionText}
            >
              {ultimoReporte?.evolucion ||
                "—"}
            </strong>

            <p>Comparación semanal</p>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>
              ✓
            </span>

            <h3>Estado</h3>

            <strong style={styles.weekText}>
              {ultimoReporte
                ? "Reporte disponible"
                : "Sin reporte"}
            </strong>

            <p>Información actualizada</p>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.sectionBadge}>
            PRODUCTIVIDAD
          </div>

          <h2 style={styles.panelTitle}>
            Mi desempeño semanal
          </h2>

          {!ultimaProductividad ? (
            <div style={styles.empty}>
              Todavía no hay datos de
              productividad cargados.
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
                  ultimaProductividad
                    .objetivo_campana
                }
                objetivo={
                  ultimaProductividad.objetivo_campana
                }
                estado={
                  ultimaProductividad.estado_objetivo_campana
                }
              />
            </div>
          )}

          {ultimaProductividad?.gestion_semana && (
            <div style={styles.managementBox}>
              <strong>
                Gestión realizada durante la
                semana
              </strong>

              <p>
                {
                  ultimaProductividad.gestion_semana
                }
              </p>
            </div>
          )}
        </div>

        {ultimoReporte && (
          <>
            <div style={styles.twoColumns}>
              <div style={styles.panel}>
                <div style={styles.sectionBadge}>
                  PLAN DE ACCIÓN
                </div>

                <h2 style={styles.panelTitle}>
                  Qué tengo que trabajar
                </h2>

                <div style={styles.focusBox}>
                  <div
                    style={styles.emptyIcon}
                  >
                    !
                  </div>

                  <strong>
                    {
                      ultimoReporte.desvio_principal
                    }
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

                <div style={styles.focusBox}>
                  <div
                    style={styles.emptyIcon}
                  >
                    ✓
                  </div>

                  <p>
                    {
                      ultimoReporte.recomendaciones
                    }
                  </p>
                </div>
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
                <span
                  style={styles.targetIcon}
                >
                  🎯
                </span>

                <strong>
                  {ultimoReporte.objetivos ||
                    "Sin objetivo cargado"}
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
                      "Sin auditoría"}
                  </p>
                </div>

                <div>
                  <strong>
                    Producto
                  </strong>

                  <p>
                    {ultimoReporte.producto ||
                      "—"}
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
              {tipificaciones.map(
                (item) => (
                  <div
                    key={item.id}
                    style={styles.dataCard}
                  >
                    <div>
                      <strong>
                        {item.tipificacion}
                      </strong>

                      <p>
                        Semana:{" "}
                        {item.semana}
                      </p>
                    </div>

                    <div
                      style={
                        styles.dataValue
                      }
                    >
                      <small>
                        % DESVÍO
                      </small>

                      <strong>
                        {item.porcentaje_desvio ??
                          "—"}
                        {item.porcentaje_desvio !==
                        null
                          ? "%"
                          : ""}
                      </strong>
                    </div>

                    <div
                      style={
                        styles.dataValue
                      }
                    >
                      <small>
                        OBJETIVO
                      </small>

                      <strong>
                        {item.objetivo ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <small>
                        COMPROMISO ESPERADO
                      </small>

                      <p>
                        {
                          item.compromiso_esperado
                        }
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div style={styles.panel}>
          <div style={styles.sectionBadge}>
            GESTIÓN DE CALIDAD
          </div>

          <h2 style={styles.panelTitle}>
            Seguimiento de la gestión
          </h2>

          {!ultimaGestion ? (
            <div style={styles.empty}>
              No hay información de gestión
              cargada.
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
              (item) =>
                item.tipo === "calidad"
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
                    style={
                      styles.commentQuality
                    }
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
            <h3>Mi comentario</h3>

            <textarea
              style={styles.textarea}
              placeholder="Podés dejar acá tus comentarios, dudas o compromisos..."
              value={nuevoComentario}
              onChange={(e) =>
                setNuevoComentario(
                  e.target.value
                )
              }
            />

            <button
              style={styles.primaryButton}
              onClick={enviarComentario}
              disabled={enviandoComentario}
            >
              {enviandoComentario
                ? "ENVIANDO..."
                : "ENVIAR COMENTARIO"}
            </button>

            {mensajeComentario && (
              <p
                style={
                  styles.successMessage
                }
              >
                {mensajeComentario}
              </p>
            )}
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.sectionBadge}>
            SEGUIMIENTO
          </div>

          <h2 style={styles.panelTitle}>
            Historial de reportes
          </h2>

          <p style={styles.paragraph}>
            Consultá la evolución de tus
            resultados semana a semana.
          </p>

          {reportes.length === 0 ? (
            <div style={styles.empty}>
              Todavía no hay reportes cargados.
            </div>
          ) : (
            <div style={styles.history}>
              {reportes.map(
                (reporte) => (
                  <div
                    key={reporte.id}
                    style={
                      styles.historyItem
                    }
                  >
                    <div>
                      <strong>
                        {reporte.semana}
                      </strong>

                      <p>
                        {
                          reporte.desvio_principal
                        }
                      </p>
                    </div>

                    <strong
                      style={
                        styles.historyScore
                      }
                    >
                      {reporte.nota ??
                        "—"}
                    </strong>

                    <span>
                      {reporte.producto ||
                        "—"}
                    </span>
                  </div>
                )
              )}
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

        button {
          transition: 0.2s ease;
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media print {
          body {
            background: white !important;
          }

          header,
          button,
          textarea {
            display: none !important;
          }

          .panel {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            break-inside: avoid;
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

          .adminTabs {
            flex-direction: column !important;
          }
        }
      `}</style>
    </main>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
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
        value={value || ""}
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
}) {
  return (
    <div style={styles.formGroupFull}>
      <label style={styles.formLabel}>
        {label}
      </label>

      <textarea
        style={styles.textarea}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}

function MetricBox({
  titulo,
  resultado,
  objetivo,
  estado,
}) {
  const textoEstado = String(
    estado || ""
  ).toLowerCase();

  const alcanzado =
    textoEstado.includes("alcanz") ||
    textoEstado.includes("cumpl") ||
    textoEstado.includes("logrado");

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

function InfoItem({ titulo, valor }) {
  return (
    <div style={styles.infoItem}>
      <small>{titulo}</small>

      <strong>
        {valor || "—"}
      </strong>
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
    fontFamily: "Arial,sans-serif",
  },

  loginCard: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    borderRadius: "24px",
    padding: "45px",
    boxShadow:
      "0 20px 60px rgba(0,0,0,.10)",
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
    color: "#30463b",
    fontSize: "28px",
    margin: 0,
  },

  subtitle: {
    textAlign: "center",
    color: "#7b8982",
    lineHeight: 1.5,
    marginBottom: "35px",
  },

  label: {
    display: "block",
    marginTop: "18px",
    marginBottom: "8px",
    color: "#40534a",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    padding: "14px",
    border:
      "1px solid #d5ddd8",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    background: "white",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "15px",
    border:
      "1px solid #d5ddd8",
    borderRadius: "10px",
    fontSize: "14px",
    resize: "vertical",
    lineHeight: 1.5,
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

  primaryButton: {
    marginTop: "20px",
    padding: "13px 22px",
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
    fontFamily: "Arial,sans-serif",
  },

  header: {
    background: "white",
    padding: "22px 6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    boxShadow:
      "0 2px 10px rgba(0,0,0,.05)",
  },

  headerTitle: {
    margin: 0,
    color: "#30463b",
  },

  headerSubtitle: {
    margin: "5px 0 0",
    color: "#89948f",
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  logout: {
    border:
      "1px solid #657f70",
    background: "white",
    color: "#657f70",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  printButton: {
    border: "none",
    background: "#657f70",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "45px 25px",
  },

  sectionTitle: {
    color: "#30463b",
    marginBottom: "8px",
  },

  welcome: {
    color: "#7b8982",
    lineHeight: 1.6,
  },

  infoBar: {
    background: "#e9f0ec",
    borderRadius: "14px",
    padding: "16px 20px",
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    marginTop: "25px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    margin: "30px 0",
  },

  card: {
    background: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,.05)",
  },

  cardNumber: {
    display: "block",
    fontSize: "34px",
    fontWeight: "bold",
    color: "#657f70",
  },

  cardText: {
    color: "#7b8982",
  },

  metricCard: {
    background: "white",
    borderRadius: "16px",
    padding: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,.05)",
  },

  metricIcon: {
    fontSize: "24px",
    color: "#657f70",
  },

  bigNumber: {
    display: "block",
    fontSize: "42px",
    color: "#657f70",
    marginTop: "10px",
  },

  evolutionText: {
    display: "block",
    color: "#657f70",
    marginTop: "10px",
    fontSize: "18px",
    lineHeight: 1.4,
  },

  weekText: {
    display: "block",
    color: "#657f70",
    marginTop: "10px",
    fontSize: "18px",
  },

  panel: {
    background: "white",
    borderRadius: "18px",
    padding: "28px",
    marginTop: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,.05)",
  },

  panelTitle: {
    color: "#30463b",
    marginTop: "10px",
  },

  sectionBadge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#657f70",
  },

  adminForm: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "18px",
    marginTop: "25px",
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
    gridColumn: "1/-1",
  },

  formLabel: {
    color: "#40534a",
    fontWeight: "bold",
    fontSize: "13px",
  },

  selectedAdvisor: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginTop: "20px",
    padding: "18px",
    borderRadius: "14px",
    background: "#f2f6f3",
  },

  selectedAdvisor p: {
    margin: "4px 0",
    color: "#89948f",
  },

  avatarLarge: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#dce8e2",
    color: "#40534a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "22px",
  },

  adminTabs: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "30px",
    padding: "8px",
    background: "#e9f0ec",
    borderRadius: "14px",
  },

  tab: {
    border: "none",
    background: "transparent",
    color: "#657f70",
    padding: "12px 16px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px",
  },

  activeTab: {
    border: "none",
    background: "#657f70",
    color: "white",
    padding: "12px 16px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px",
  },

  emptyBig: {
    background: "white",
    borderRadius: "18px",
    padding: "70px 30px",
    textAlign: "center",
    marginTop: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,.05)",
  },

  emptyBigIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#e9f0ec",
    color: "#657f70",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontSize: "28px",
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    padding: "25px",
    color: "#89948f",
  },

  successMessage: {
    color: "#3d7452",
    fontWeight: "bold",
    fontSize: "14px",
    marginTop: "15px",
  },

  productivityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: "18px",
    marginTop: "20px",
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
    fontSize: "12px",
    fontWeight: "bold",
    color: "#657f70",
    letterSpacing: "1px",
  },

  metricResult: {
    display: "block",
    fontSize: "32px",
    color: "#30463b",
    margin: "10px 0",
  },

  metricTarget: {
    color: "#89948f",
    fontSize: "14px",
  },

  status: {
    display: "inline-block",
    marginTop: "15px",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  managementBox: {
    background: "#f2f6f3",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "20px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px",
  },

  objectiveBox: {
    background: "#f2f6f3",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  targetIcon: {
    fontSize: "28px",
  },

  focusBox: {
    textAlign: "center",
    padding: "20px",
    color: "#40534a",
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
    fontSize: "20px",
  },

  auditBox: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    background: "#f7f9f8",
    borderRadius: "14px",
    padding: "20px",
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

  commentArea: {
    background: "#f7f9f8",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "18px",
  },

  commentQuality: {
    background: "#eaf2ed",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "10px",
  },

  adminComment: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "18px",
    background: "#f7f9f8",
    borderRadius: "13px",
    marginTop: "12px",
  },

  muted: {
    color: "#89948f",
  },

  history: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
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
    borderRadius: "12px",
  },

  historyScore: {
    fontSize: "22px",
    color: "#657f70",
  },

  printHeader: {
    background: "#eef4f1",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px",
  },
};
