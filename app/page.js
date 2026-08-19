"use client";

import { useEffect, useState } from "react";

const API_URL =
  "https://portal-calidad-api.ayelenvillega42.workers.dev";

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin123";
const ASESOR_PASSWORD = "123456";

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

const emptyProductividad = {
  asesor_id: "",
  semana: "",
  sph: "",
  sph_objetivo: "",
  estado_sph: "",
  ventas: "",
  ventas_objetivo: "",
  estado_ventas: "",
  objetivo_campana: "",
  objetivo_campana_descripcion: "",
  estado_objetivo_campana: "",
  gestion_semana: "",
};

const emptyTipificacion = {
  asesor_id: "",
  semana: "",
  tipificacion: "",
  porcentaje_desvio: "",
  objetivo: "",
  compromiso_esperado: "",
};

const emptyGestion = {
  asesor_id: "",
  semana: "",
  cantidad_auditorias: "",
  oportunidades_mejora: "",
  coaching_brindado: "",
  registro_sistema: "",
  compromiso_esperado: "",
  fortalezas_destacadas: "",
};

const emptyNoVenta = {
  asesor_id: "",
  semana: "",
  cantidad_auditorias: "",
  oportunidades_detectadas: "",
  desvio_principal: "",
  recomendaciones: "",
  compromiso_esperado: "",
  observaciones: "",
};

const emptyDevolucion = {
  asesor_id: "",
  semana: "",
  comentario: "",
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

  const [reporteForm, setReporteForm] = useState(emptyReporte);
  const [productividadForm, setProductividadForm] =
    useState(emptyProductividad);
  const [tipificacionForm, setTipificacionForm] =
    useState(emptyTipificacion);
  const [gestionForm, setGestionForm] = useState(emptyGestion);
  const [noVentaForm, setNoVentaForm] = useState(emptyNoVenta);
  const [devolucionForm, setDevolucionForm] =
    useState(emptyDevolucion);

  const [guardando, setGuardando] = useState("");
  const [mensajeAdmin, setMensajeAdmin] = useState("");
  const [adminTab, setAdminTab] = useState("reporte");

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
        String(item.usuario_login).toLowerCase() ===
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
    setReporteForm(emptyReporte);
    setProductividadForm(emptyProductividad);
    setTipificacionForm(emptyTipificacion);
    setGestionForm(emptyGestion);
    setNoVentaForm(emptyNoVenta);
    setDevolucionForm(emptyDevolucion);
    setMensajeAdmin("");
  }

  function seleccionarAsesor(id) {
    setReporteForm((prev) => ({
      ...prev,
      asesor_id: id,
    }));

    setProductividadForm((prev) => ({
      ...prev,
      asesor_id: id,
    }));

    setTipificacionForm((prev) => ({
      ...prev,
      asesor_id: id,
    }));

    setGestionForm((prev) => ({
      ...prev,
      asesor_id: id,
    }));

    setNoVentaForm((prev) => ({
      ...prev,
      asesor_id: id,
    }));

    setDevolucionForm((prev) => ({
      ...prev,
      asesor_id: id,
    }));
  }

  async function postData(endpoint, body, mensaje) {
    setGuardando(endpoint);
    setMensajeAdmin("");

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `No se pudo guardar ${endpoint}`
        );
      }

      setMensajeAdmin(mensaje);
      return true;
    } catch (error) {
      console.error(error);
      setMensajeAdmin(
        error.message || "Ocurrió un error al guardar."
      );
      return false;
    } finally {
      setGuardando("");
    }
  }

  async function guardarReporte() {
    if (!reporteForm.asesor_id || !reporteForm.semana) {
      setMensajeAdmin(
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    const ok = await postData(
      "reportes",
      {
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
      },
      "Reporte de calidad guardado correctamente."
    );

    if (ok) {
      setReporteForm(emptyReporte);
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

    const ok = await postData(
      "productividad",
      {
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
        estado_sph: productividadForm.estado_sph,
        ventas:
          productividadForm.ventas === ""
            ? null
            : Number(productividadForm.ventas),
        ventas_objetivo:
          productividadForm.ventas_objetivo === ""
            ? null
            : Number(productividadForm.ventas_objetivo),
        estado_ventas: productividadForm.estado_ventas,
        objetivo_campana:
          productividadForm.objetivo_campana,
        objetivo_campana_descripcion:
          productividadForm.objetivo_campana_descripcion,
        estado_objetivo_campana:
          productividadForm.estado_objetivo_campana,
        gestion_semana:
          productividadForm.gestion_semana,
      },
      "Productividad guardada correctamente."
    );

    if (ok) {
      setProductividadForm(emptyProductividad);
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

    const ok = await postData(
      "tipificaciones",
      {
        asesor_id: Number(tipificacionForm.asesor_id),
        semana: tipificacionForm.semana,
        tipificacion: tipificacionForm.tipificacion,
        porcentaje_desvio:
          tipificacionForm.porcentaje_desvio === ""
            ? null
            : Number(
                tipificacionForm.porcentaje_desvio
              ),
        objetivo:
          tipificacionForm.objetivo === ""
            ? null
            : Number(tipificacionForm.objetivo),
        compromiso_esperado:
          tipificacionForm.compromiso_esperado,
      },
      "Tipificación guardada correctamente."
    );

    if (ok) {
      setTipificacionForm(emptyTipificacion);
    }
  }

  async function guardarGestion() {
    if (!gestionForm.asesor_id || !gestionForm.semana) {
      setMensajeAdmin(
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    const ok = await postData(
      "gestion-calidad",
      {
        asesor_id: Number(gestionForm.asesor_id),
        semana: gestionForm.semana,
        cantidad_auditorias:
          gestionForm.cantidad_auditorias === ""
            ? null
            : Number(gestionForm.cantidad_auditorias),
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
      },
      "Gestión de Calidad guardada correctamente."
    );

    if (ok) {
      setGestionForm(emptyGestion);
    }
  }

  async function guardarNoVenta() {
    if (!noVentaForm.asesor_id || !noVentaForm.semana) {
      setMensajeAdmin(
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    const ok = await postData(
      "auditorias-no-venta",
      {
        asesor_id: Number(noVentaForm.asesor_id),
        semana: noVentaForm.semana,
        cantidad_auditorias:
          noVentaForm.cantidad_auditorias === ""
            ? null
            : Number(noVentaForm.cantidad_auditorias),
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
      },
      "Auditoría de no venta guardada correctamente."
    );

    if (ok) {
      setNoVentaForm(emptyNoVenta);
    }
  }

  async function guardarDevolucion() {
    if (
      !devolucionForm.asesor_id ||
      !devolucionForm.semana ||
      !devolucionForm.comentario.trim()
    ) {
      setMensajeAdmin(
        "Completá asesor, semana y devolución."
      );
      return;
    }

    const ok = await postData(
      "comentarios",
      {
        asesor_id: Number(devolucionForm.asesor_id),
        semana: devolucionForm.semana,
        tipo: "calidad",
        comentario:
          devolucionForm.comentario.trim(),
        estado: "enviado",
      },
      "Devolución enviada correctamente."
    );

    if (ok) {
      setDevolucionForm(emptyDevolucion);
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesor_id: sesion.id,
            semana: ultimoReporte.semana,
            tipo: "asesor",
            comentario: nuevoComentario.trim(),
            estado: "pendiente",
          }),
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

  if (!sesion) {
    return (
      <main style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.logoCircle}>Q</div>

          <h1 style={styles.title}>
            Portal de Calidad
          </h1>

          <p style={styles.subtitle}>
            Tu espacio personal de seguimiento,
            evolución y oportunidades de mejora.
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
              <p style={styles.error}>{error}</p>
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
            Desde acá podés cargar y actualizar toda
            la información semanal de cada asesor.
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
                ✓
              </span>

              <span style={styles.cardText}>
                Base de datos conectada
              </span>
            </div>

            <div style={styles.card}>
              <span style={styles.cardNumber}>
                6
              </span>

              <span style={styles.cardText}>
                Módulos de carga
              </span>
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.sectionBadge}>
              ASESOR
            </div>

            <h2 style={styles.panelTitle}>
              Seleccioná el asesor
            </h2>

            <select
              style={styles.input}
              value={reporteForm.asesor_id}
              onChange={(e) =>
                seleccionarAsesor(e.target.value)
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

          <div style={styles.adminTabs}>
            <button
              style={
                adminTab === "reporte"
                  ? styles.activeTab
                  : styles.tab
              }
              onClick={() => setAdminTab("reporte")}
            >
              Reporte
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
              Productividad
            </button>

            <button
              style={
                adminTab === "tipificaciones"
                  ? styles.activeTab
                  : styles.tab
              }
              onClick={() =>
                setAdminTab("tipificaciones")
              }
            >
              Tipificaciones
            </button>

            <button
              style={
                adminTab === "gestion"
                  ? styles.activeTab
                  : styles.tab
              }
              onClick={() => setAdminTab("gestion")}
            >
              Gestión Calidad
            </button>

            <button
              style={
                adminTab === "noventa"
                  ? styles.activeTab
                  : styles.tab
              }
              onClick={() => setAdminTab("noventa")}
            >
              No Venta
            </button>

            <button
              style={
                adminTab === "devolucion"
                  ? styles.activeTab
                  : styles.tab
              }
              onClick={() =>
                setAdminTab("devolucion")
              }
            >
              Devolución
            </button>
          </div>

          {mensajeAdmin && (
            <div style={styles.adminMessage}>
              {mensajeAdmin}
            </div>
          )}

          {adminTab === "reporte" && (
            <AdminReporte
              form={reporteForm}
              setForm={setReporteForm}
              guardar={guardarReporte}
              guardando={guardando === "reportes"}
            />
          )}

          {adminTab === "productividad" && (
            <AdminProductividad
              form={productividadForm}
              setForm={setProductividadForm}
              guardar={guardarProductividad}
              guardando={
                guardando === "productividad"
              }
            />
          )}

          {adminTab === "tipificaciones" && (
            <AdminTipificaciones
              form={tipificacionForm}
              setForm={setTipificacionForm}
              guardar={guardarTipificacion}
              guardando={
                guardando === "tipificaciones"
              }
            />
          )}

          {adminTab === "gestion" && (
            <AdminGestion
              form={gestionForm}
              setForm={setGestionForm}
              guardar={guardarGestion}
              guardando={
                guardando === "gestion-calidad"
              }
            />
          )}

          {adminTab === "noventa" && (
            <AdminNoVenta
              form={noVentaForm}
              setForm={setNoVentaForm}
              guardar={guardarNoVenta}
              guardando={
                guardando ===
                "auditorias-no-venta"
              }
            />
          )}

          {adminTab === "devolucion" && (
            <AdminDevolucion
              form={devolucionForm}
              setForm={setDevolucionForm}
              guardar={guardarDevolucion}
              guardando={
                guardando === "comentarios"
              }
            />
          )}

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

        <GlobalStyles />
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

          <p>{sesion.nombre}</p>

          {ultimoReporte && (
            <p>{ultimoReporte.semana}</p>
          )}
        </div>

        <div style={styles.hero}>
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
            <small>NOTA ACTUAL</small>

            <strong>
              {ultimoReporte?.nota ?? "—"}
            </strong>

            <span>
              {ultimoReporte?.semana || "Sin reporte"}
            </span>
          </div>
        </div>

        <div style={styles.infoBar}>
          <div>
            <strong>N° USUARIO</strong>
            <span>{sesion.numero_usuario}</span>
          </div>

          <div>
            <strong>USUARIO</strong>
            <span>{sesion.usuario}</span>
          </div>

          <div>
            <strong>SEMANA</strong>
            <span>
              {ultimoReporte?.semana || "—"}
            </span>
          </div>
        </div>

        <div style={styles.cards}>
          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>★</span>

            <h3>Mi nota</h3>

            <strong style={styles.bigNumber}>
              {ultimoReporte?.nota ?? "—"}
            </strong>

            <p>Resultado de calidad</p>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>↗</span>

            <h3>Evolución</h3>

            <strong style={styles.evolutionText}>
              {ultimoReporte?.evolucion || "—"}
            </strong>

            <p>Comparación semanal</p>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>✓</span>

            <h3>Estado</h3>

            <strong style={styles.weekText}>
              Reporte disponible
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
                  Principal atención del período.
                </p>
              </div>

              <div style={styles.recommendation}>
                <strong>
                  Cómo mejorarlo
                </strong>

                <p>
                  {ultimoReporte.recomendaciones ||
                    "Sin recomendaciones cargadas"}
                </p>
              </div>

              <div style={styles.objectiveBox}>
                <span style={styles.targetIcon}>
                  ◎
                </span>

                <div>
                  <small>OBJETIVO</small>

                  <strong>
                    {ultimoReporte.objetivos ||
                      "Sin objetivos cargados"}
                  </strong>
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
                  <strong>Auditoría</strong>

                  <p>
                    {ultimoReporte.auditoria ||
                      "Sin auditoría cargada"}
                  </p>
                </div>

                <div>
                  <strong>Producto</strong>

                  <p>
                    {ultimoReporte.producto || "—"}
                  </p>
                </div>

                <div>
                  <strong>Observaciones</strong>

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
                    <small>% DESVÍO</small>

                    <strong>
                      {item.porcentaje_desvio ??
                        "—"}
                      {item.porcentaje_desvio !==
                      null
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

        <div style={styles.panel}>
          <div style={styles.sectionBadge}>
            DEVOLUCIÓN
          </div>

          <h2 style={styles.panelTitle}>
            Comunicación con Calidad
          </h2>

          <div style={styles.commentArea}>
            <h3>Devolución de Calidad</h3>

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
                    <strong>Calidad</strong>

                    <p>{item.comentario}</p>

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
              className="no-print"
              style={styles.textarea}
              placeholder="Podés dejar acá tus comentarios, dudas, compromisos o consultas..."
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

                    <p>{item.comentario}</p>

                    <small>
                      {item.fecha_carga}
                    </small>
                  </div>
                ))}
            </div>
          )}
        </div>

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
              {reportes.map((reporte) => (
                <div
                  key={reporte.id}
                  style={styles.historyItem}
                >
                  <div>
                    <small>
                      REPORTE ACTUAL
                    </small>

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

      <GlobalStyles />
    </main>
  );
}

function AdminReporte({
  form,
  setForm,
  guardar,
  guardando,
}) {
  return (
    <AdminPanel
      badge="CARGA SEMANAL"
      title="Reporte de calidad"
      descripcion="Cargá el informe principal del asesor."
    >
      <FormGrid>
        <Field
          label="Semana"
          value={form.semana}
          placeholder="Ej: Semana 3 - Agosto"
          onChange={(value) =>
            setForm({ ...form, semana: value })
          }
        />

        <Field
          label="Nota de calidad"
          type="number"
          value={form.nota}
          placeholder="Ej: 85"
          onChange={(value) =>
            setForm({ ...form, nota: value })
          }
        />

        <Field
          label="Evolución"
          value={form.evolucion}
          placeholder="Ej: Mejora respecto de la semana anterior"
          onChange={(value) =>
            setForm({
              ...form,
              evolucion: value,
            })
          }
        />

        <Field
          label="Desvío principal"
          value={form.desvio_principal}
          placeholder="Ej: Validación de datos"
          onChange={(value) =>
            setForm({
              ...form,
              desvio_principal: value,
            })
          }
        />

        <TextField
          label="Objetivos"
          value={form.objetivos}
          placeholder="Qué debe trabajar el asesor"
          onChange={(value) =>
            setForm({
              ...form,
              objetivos: value,
            })
          }
        />

        <TextField
          label="Recomendaciones"
          value={form.recomendaciones}
          placeholder="Cómo puede mejorarlo"
          onChange={(value) =>
            setForm({
              ...form,
              recomendaciones: value,
            })
          }
        />

        <Field
          label="Auditoría"
          value={form.auditoria}
          placeholder="Ej: Llamada auditada"
          onChange={(value) =>
            setForm({
              ...form,
              auditoria: value,
            })
          }
        />

        <Field
          label="Producto"
          value={form.producto}
          placeholder="AP / BM"
          onChange={(value) =>
            setForm({
              ...form,
              producto: value,
            })
          }
        />

        <TextField
          label="Observaciones"
          value={form.observaciones}
          placeholder="Observaciones adicionales"
          onChange={(value) =>
            setForm({
              ...form,
              observaciones: value,
            })
          }
        />
      </FormGrid>

      <SaveButton
        onClick={guardar}
        loading={guardando}
        text="GUARDAR REPORTE"
      />
    </AdminPanel>
  );
}

function AdminProductividad({
  form,
  setForm,
  guardar,
  guardando,
}) {
  return (
    <AdminPanel
      badge="PRODUCTIVIDAD"
      title="Carga de productividad"
      descripcion="Registrá los resultados semanales del asesor."
    >
      <FormGrid>
        <Field
          label="Semana"
          value={form.semana}
          placeholder="Semana 3 - Agosto"
          onChange={(value) =>
            setForm({ ...form, semana: value })
          }
        />

        <Field
          label="SPH"
          type="number"
          value={form.sph}
          onChange={(value) =>
            setForm({ ...form, sph: value })
          }
        />

        <Field
          label="Objetivo SPH"
          type="number"
          value={form.sph_objetivo}
          onChange={(value) =>
            setForm({
              ...form,
              sph_objetivo: value,
            })
          }
        />

        <Field
          label="Estado SPH"
          value={form.estado_sph}
          placeholder="Cumplido / No cumplido"
          onChange={(value) =>
            setForm({
              ...form,
              estado_sph: value,
            })
          }
        />

        <Field
          label="Ventas"
          type="number"
          value={form.ventas}
          onChange={(value) =>
            setForm({ ...form, ventas: value })
          }
        />

        <Field
          label="Objetivo ventas"
          type="number"
          value={form.ventas_objetivo}
          onChange={(value) =>
            setForm({
              ...form,
              ventas_objetivo: value,
            })
          }
        />

        <Field
          label="Estado ventas"
          value={form.estado_ventas}
          placeholder="Cumplido / No cumplido"
          onChange={(value) =>
            setForm({
              ...form,
              estado_ventas: value,
            })
          }
        />

        <Field
          label="Objetivo campaña"
          value={form.objetivo_campana}
          placeholder="Ej: 10 ventas"
          onChange={(value) =>
            setForm({
              ...form,
              objetivo_campana: value,
            })
          }
        />

        <TextField
          label="Descripción objetivo campaña"
          value={
            form.objetivo_campana_descripcion
          }
          placeholder="Descripción"
          onChange={(value) =>
            setForm({
              ...form,
              objetivo_campana_descripcion:
                value,
            })
          }
        />

        <Field
          label="Estado objetivo campaña"
          value={
            form.estado_objetivo_campana
          }
          placeholder="Cumplido / En proceso"
          onChange={(value) =>
            setForm({
              ...form,
              estado_objetivo_campana: value,
            })
          }
        />

        <TextField
          label="Gestión realizada durante la semana"
          value={form.gestion_semana}
          placeholder="Coaching, escuchas, feedback, etc."
          onChange={(value) =>
            setForm({
              ...form,
              gestion_semana: value,
            })
          }
        />
      </FormGrid>

      <SaveButton
        onClick={guardar}
        loading={guardando}
        text="GUARDAR PRODUCTIVIDAD"
      />
    </AdminPanel>
  );
}

function AdminTipificaciones({
  form,
  setForm,
  guardar,
  guardando,
}) {
  return (
    <AdminPanel
      badge="TIPIFICACIONES"
      title="Seguimiento de desvíos"
      descripcion="Cargá cada tipificación y su compromiso."
    >
      <FormGrid>
        <Field
          label="Semana"
          value={form.semana}
          onChange={(value) =>
            setForm({ ...form, semana: value })
          }
        />

        <Field
          label="Tipificación"
          value={form.tipificacion}
          placeholder="Ej: Validación de datos"
          onChange={(value) =>
            setForm({
              ...form,
              tipificacion: value,
            })
          }
        />

        <Field
          label="% Desvío"
          type="number"
          value={form.porcentaje_desvio}
          onChange={(value) =>
            setForm({
              ...form,
              porcentaje_desvio: value,
            })
          }
        />

        <Field
          label="Objetivo"
          type="number"
          value={form.objetivo}
          onChange={(value) =>
            setForm({
              ...form,
              objetivo: value,
            })
          }
        />

        <TextField
          label="Compromiso esperado"
          value={form.compromiso_esperado}
          placeholder="Qué compromiso debe asumir"
          onChange={(value) =>
            setForm({
              ...form,
              compromiso_esperado: value,
            })
          }
        />
      </FormGrid>

      <SaveButton
        onClick={guardar}
        loading={guardando}
        text="GUARDAR TIPIFICACIÓN"
      />
    </AdminPanel>
  );
}

function AdminGestion({
  form,
  setForm,
  guardar,
  guardando,
}) {
  return (
    <AdminPanel
      badge="GESTIÓN DE CALIDAD"
      title="Gestión semanal"
      descripcion="Registrá las acciones realizadas desde Calidad."
    >
      <FormGrid>
        <Field
          label="Semana"
          value={form.semana}
          onChange={(value) =>
            setForm({ ...form, semana: value })
          }
        />

        <Field
          label="Cantidad de auditorías"
          type="number"
          value={form.cantidad_auditorias}
          onChange={(value) =>
            setForm({
              ...form,
              cantidad_auditorias: value,
            })
          }
        />

        <TextField
          label="Oportunidades de mejora"
          value={form.oportunidades_mejora}
          onChange={(value) =>
            setForm({
              ...form,
              oportunidades_mejora: value,
            })
          }
        />

        <TextField
          label="Coaching brindado"
          value={form.coaching_brindado}
          onChange={(value) =>
            setForm({
              ...form,
              coaching_brindado: value,
            })
          }
        />

        <TextField
          label="Registro en sistema"
          value={form.registro_sistema}
          onChange={(value) =>
            setForm({
              ...form,
              registro_sistema: value,
            })
          }
        />

        <TextField
          label="Compromiso esperado"
          value={form.compromiso_esperado}
          onChange={(value) =>
            setForm({
              ...form,
              compromiso_esperado: value,
            })
          }
        />

        <TextField
          label="Fortalezas destacadas"
          value={form.fortalezas_destacadas}
          onChange={(value) =>
            setForm({
              ...form,
              fortalezas_destacadas: value,
            })
          }
        />
      </FormGrid>

      <SaveButton
        onClick={guardar}
        loading={guardando}
        text="GUARDAR GESTIÓN"
      />
    </AdminPanel>
  );
}

function AdminNoVenta({
  form,
  setForm,
  guardar,
  guardando,
}) {
  return (
    <AdminPanel
      badge="NO VENTA"
      title="Auditorías de no venta"
      descripcion="Registrá oportunidades detectadas en llamadas sin venta."
    >
      <FormGrid>
        <Field
          label="Semana"
          value={form.semana}
          onChange={(value) =>
            setForm({ ...form, semana: value })
          }
        />

        <Field
          label="Cantidad de auditorías"
          type="number"
          value={form.cantidad_auditorias}
          onChange={(value) =>
            setForm({
              ...form,
              cantidad_auditorias: value,
            })
          }
        />

        <TextField
          label="Oportunidades detectadas"
          value={form.oportunidades_detectadas}
          onChange={(value) =>
            setForm({
              ...form,
              oportunidades_detectadas: value,
            })
          }
        />

        <Field
          label="Desvío principal"
          value={form.desvio_principal}
          onChange={(value) =>
            setForm({
              ...form,
              desvio_principal: value,
            })
          }
        />

        <TextField
          label="Recomendaciones"
          value={form.recomendaciones}
          onChange={(value) =>
            setForm({
              ...form,
              recomendaciones: value,
            })
          }
        />

        <TextField
          label="Compromiso esperado"
          value={form.compromiso_esperado}
          onChange={(value) =>
            setForm({
              ...form,
              compromiso_esperado: value,
            })
          }
        />

        <TextField
          label="Observaciones"
          value={form.observaciones}
          onChange={(value) =>
            setForm({
              ...form,
              observaciones: value,
            })
          }
        />
      </FormGrid>

      <SaveButton
        onClick={guardar}
        loading={guardando}
        text="GUARDAR NO VENTA"
      />
    </AdminPanel>
  );
}

function AdminDevolucion({
  form,
  setForm,
  guardar,
  guardando,
}) {
  return (
    <AdminPanel
      badge="DEVOLUCIÓN"
      title="Devolución de Calidad"
      descripcion="Esta devolución aparecerá directamente en el portal del asesor."
    >
      <FormGrid>
        <Field
          label="Semana"
          value={form.semana}
          placeholder="Semana 3 - Agosto"
          onChange={(value) =>
            setForm({ ...form, semana: value })
          }
        />

        <TextField
          label="Devolución"
          value={form.comentario}
          placeholder="Escribí la devolución para el asesor..."
          onChange={(value) =>
            setForm({
              ...form,
              comentario: value,
            })
          }
        />
      </FormGrid>

      <SaveButton
        onClick={guardar}
        loading={guardando}
        text="ENVIAR DEVOLUCIÓN"
      />
    </AdminPanel>
  );
}

function AdminPanel({
  badge,
  title,
  descripcion,
  children,
}) {
  return (
    <div style={styles.panel}>
      <div style={styles.sectionBadge}>
        {badge}
      </div>

      <h2 style={styles.panelTitle}>{title}</h2>

      <p style={styles.paragraph}>
        {descripcion}
      </p>

      {children}
    </div>
  );
}

function FormGrid({ children }) {
  return (
    <div style={styles.adminForm}>
      {children}
    </div>
  );
}

function Field({
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
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}

function TextField({
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
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}

function SaveButton({
  onClick,
  loading,
  text,
}) {
  return (
    <button
      className="no-print"
      style={styles.primaryButton}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "GUARDANDO..." : text}
    </button>
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

function GlobalStyles() {
  return (
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
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#eef4f1 0%,#dce8e2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial,sans-serif",
    padding: "20px",
  },

  loginCard: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
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
    margin: 0,
    color: "#30463b",
    fontSize: "28px",
  },

  subtitle: {
    textAlign: "center",
    color: "#7b8982",
    marginBottom: "35px",
    lineHeight: "1.5",
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
    padding: "14px",
    border: "1px solid #d5ddd8",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    background: "#fff",
  },

  textarea: {
    width: "100%",
    minHeight: "110px",
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

  printButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "9px",
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
    background: "#fff",
    padding: "22px 6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    boxShadow:
      "0 2px 10px rgba(0,0,0,.05)",
  },

  headerButtons: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  headerTitle: {
    margin: 0,
    color: "#30463b",
  },

  headerSubtitle: {
    margin: "5px 0 0",
    color: "#89948f",
  },

  logout: {
    border: "1px solid #657f70",
    background: "white",
    color: "#657f70",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "45px 25px",
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "30px",
    flexWrap: "wrap",
  },

  currentScore: {
    background: "#e9f0ec",
    borderRadius: "18px",
    padding: "20px 30px",
    minWidth: "180px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
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

  infoBarItem: {
    display: "flex",
    flexDirection: "column",
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

  metricCard: {
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
    lineHeight: "1.4",
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

  sectionTitle: {
    color: "#30463b",
    marginBottom: "8px",
  },

  sectionBadge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#657f70",
    marginBottom: "5px",
  },

  paragraph: {
    color: "#65736c",
    lineHeight: "1.6",
  },

  welcome: {
    color: "#7b8982",
    lineHeight: "1.6",
  },

  adminTabs: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "25px",
  },

  tab: {
    border: "1px solid #dce8e2",
    background: "white",
    color: "#657f70",
    padding: "11px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  activeTab: {
    border: "1px solid #657f70",
    background: "#657f70",
    color: "white",
    padding: "11px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  adminMessage: {
    background: "#e9f3ed",
    color: "#3d7452",
    borderRadius: "12px",
    padding: "15px",
    marginTop: "20px",
    fontWeight: "bold",
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
    marginTop: "20px",
  },

  metricBox: {
    border: "1px solid #e5ebe7",
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
    color: "#40534a",
  },

  objectiveBox: {
    background: "#f2f6f3",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    color: "#40534a",
    marginTop: "20px",
  },

  recommendation: {
    background: "#f7f9f8",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "18px",
    color: "#40534a",
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

  empty: {
    textAlign: "center",
    padding: "25px",
    color: "#89948f",
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

  auditNoVenta: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
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
    marginTop: "18px",
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
    fontSize: "14px",
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
    border: "1px solid #edf0ee",
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
