```jsx
"use client";

import { useEffect, useState } from "react";

const API_URL =
  "https://portal-calidad-api.ayelenvillega42.workers.dev";

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "admin123";

const estadoOpciones = [
  "Cumplido",
  "Alcanzado",
  "En proceso",
  "No alcanzado"
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
  observaciones: ""
};

const emptyProductividad = {
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

const emptyTipificacion = {
  asesor_id: "",
  semana: "",
  tipificacion: "",
  porcentaje_desvio: "",
  objetivo: "",
  compromiso_esperado: ""
};

const emptyGestion = {
  asesor_id: "",
  semana: "",
  cantidad_auditorias: "",
  oportunidades_mejora: "",
  coaching_brindado: "",
  registro_sistema: "",
  compromiso_esperado: "",
  fortalezas_destacadas: ""
};

const emptyNoVenta = {
  asesor_id: "",
  semana: "",
  cantidad_auditorias: "",
  oportunidades_detectadas: "",
  desvio_principal: "",
  recomendaciones: "",
  compromiso_esperado: "",
  observaciones: ""
};

const emptyDevolucion = {
  asesor_id: "",
  semana: "",
  comentario: ""
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
  const [mensajes, setMensajes] = useState({});

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

    setReporteForm(emptyReporte);
    setProductividadForm(emptyProductividad);
    setTipificacionForm(emptyTipificacion);
    setGestionForm(emptyGestion);
    setNoVentaForm(emptyNoVenta);
    setDevolucionForm(emptyDevolucion);

    setMensajes({});
  }

  function mostrarMensaje(tipo, texto) {
    setMensajes((prev) => ({
      ...prev,
      [tipo]: texto
    }));

    setTimeout(() => {
      setMensajes((prev) => ({
        ...prev,
        [tipo]: ""
      }));
    }, 4000);
  }

  async function enviarFormulario(
    endpoint,
    body,
    tipo,
    limpiar
  ) {
    setGuardando(tipo);

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo guardar la información."
        );
      }

      mostrarMensaje(
        tipo,
        "Información cargada correctamente."
      );

      limpiar();
    } catch (error) {
      console.error(error);

      mostrarMensaje(
        tipo,
        error.message ||
          "Ocurrió un error al guardar la información."
      );
    } finally {
      setGuardando("");
    }
  }

  function guardarReporte() {
    if (!reporteForm.asesor_id || !reporteForm.semana) {
      mostrarMensaje(
        "reporte",
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    enviarFormulario(
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
        observaciones: reporteForm.observaciones
      },
      "reporte",
      () => setReporteForm(emptyReporte)
    );
  }

  function guardarProductividad() {
    if (
      !productividadForm.asesor_id ||
      !productividadForm.semana
    ) {
      mostrarMensaje(
        "productividad",
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    enviarFormulario(
      "productividad",
      {
        asesor_id: Number(productividadForm.asesor_id),
        semana: productividadForm.semana,
        sph: productividadForm.sph,
        sph_objetivo: productividadForm.sph_objetivo,
        ventas: productividadForm.ventas,
        ventas_objetivo: productividadForm.ventas_objetivo,
        objetivo_campana: productividadForm.objetivo_campana,
        objetivo_campana_descripcion:
          productividadForm.objetivo_campana_descripcion,
        estado_sph: productividadForm.estado_sph,
        estado_ventas: productividadForm.estado_ventas,
        estado_objetivo_campana:
          productividadForm.estado_objetivo_campana,
        gestion_semana: productividadForm.gestion_semana
      },
      "productividad",
      () => setProductividadForm(emptyProductividad)
    );
  }

  function guardarTipificacion() {
    if (
      !tipificacionForm.asesor_id ||
      !tipificacionForm.semana
    ) {
      mostrarMensaje(
        "tipificacion",
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    enviarFormulario(
      "tipificaciones",
      {
        asesor_id: Number(tipificacionForm.asesor_id),
        semana: tipificacionForm.semana,
        tipificacion: tipificacionForm.tipificacion,
        porcentaje_desvio:
          tipificacionForm.porcentaje_desvio === ""
            ? null
            : Number(tipificacionForm.porcentaje_desvio),
        objetivo: tipificacionForm.objetivo,
        compromiso_esperado:
          tipificacionForm.compromiso_esperado
      },
      "tipificacion",
      () => setTipificacionForm(emptyTipificacion)
    );
  }

  function guardarGestion() {
    if (!gestionForm.asesor_id || !gestionForm.semana) {
      mostrarMensaje(
        "gestion",
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    enviarFormulario(
      "gestion-calidad",
      {
        asesor_id: Number(gestionForm.asesor_id),
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
          gestionForm.fortalezas_destacadas
      },
      "gestion",
      () => setGestionForm(emptyGestion)
    );
  }

  function guardarNoVenta() {
    if (!noVentaForm.asesor_id || !noVentaForm.semana) {
      mostrarMensaje(
        "noVenta",
        "Seleccioná un asesor y una semana."
      );
      return;
    }

    enviarFormulario(
      "auditorias-no-venta",
      {
        asesor_id: Number(noVentaForm.asesor_id),
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
          noVentaForm.observaciones
      },
      "noVenta",
      () => setNoVentaForm(emptyNoVenta)
    );
  }

  function guardarDevolucion() {
    if (
      !devolucionForm.asesor_id ||
      !devolucionForm.semana ||
      !devolucionForm.comentario.trim()
    ) {
      mostrarMensaje(
        "devolucion",
        "Completá asesor, semana y devolución."
      );
      return;
    }

    enviarFormulario(
      "comentarios",
      {
        asesor_id: Number(devolucionForm.asesor_id),
        semana: devolucionForm.semana,
        tipo: "calidad",
        comentario: devolucionForm.comentario.trim(),
        estado: "pendiente"
      },
      "devolucion",
      () => setDevolucionForm(emptyDevolucion)
    );
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

  if (!sesion) {
    return (
      <main style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.logoCircle}>Q</div>

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
            Bienvenida, Administradora
          </h2>

          <p style={styles.welcome}>
            Desde acá vas a poder administrar toda
            la información semanal del equipo.
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
                +
              </span>

              <span style={styles.cardText}>
                Carga semanal
              </span>
            </div>
          </div>

          <AdminReporte
            asesores={asesores}
            form={reporteForm}
            setForm={setReporteForm}
            guardar={guardarReporte}
            guardando={guardando === "reporte"}
            mensaje={mensajes.reporte}
          />

          <AdminProductividad
            asesores={asesores}
            form={productividadForm}
            setForm={setProductividadForm}
            guardar={guardarProductividad}
            guardando={guardando === "productividad"}
            mensaje={mensajes.productividad}
          />

          <AdminTipificaciones
            asesores={asesores}
            form={tipificacionForm}
            setForm={setTipificacionForm}
            guardar={guardarTipificacion}
            guardando={guardando === "tipificacion"}
            mensaje={mensajes.tipificacion}
          />

          <AdminGestion
            asesores={asesores}
            form={gestionForm}
            setForm={setGestionForm}
            guardar={guardarGestion}
            guardando={guardando === "gestion"}
            mensaje={mensajes.gestion}
          />

          <AdminNoVenta
            asesores={asesores}
            form={noVentaForm}
            setForm={setNoVentaForm}
            guardar={guardarNoVenta}
            guardando={guardando === "noVenta"}
            mensaje={mensajes.noVenta}
          />

          <AdminDevolucion
            asesores={asesores}
            form={devolucionForm}
            setForm={setDevolucionForm}
            guardar={guardarDevolucion}
            guardando={guardando === "devolucion"}
            mensaje={mensajes.devolucion}
          />

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

        <div style={styles.portalMenu}>
          <span>⌂ Resumen</span>
          <span>↗ Productividad</span>
          <span>✓ Calidad</span>
          <span>◎ Plan de acción</span>
          <span>▤ Tipificaciones</span>
          <span>! No venta</span>
          <span>◌ Devolución</span>
          <span>◷ Historial</span>
        </div>

        <div style={styles.hero}>
          <span style={styles.heroBadge}>
            SEGUIMIENTO PERSONAL
          </span>

          <h2 style={styles.sectionTitle}>
            Hola, {nombreMostrar}
          </h2>

          <p style={styles.welcome}>
            Este es tu espacio para conocer tus
            resultados, detectar oportunidades y
            trabajar en tu evolución.
          </p>
        </div>

        <div style={styles.mainScore}>
          <div>
            <small>NOTA ACTUAL</small>

            <strong>
              {ultimoReporte?.nota ?? "—"}
            </strong>
          </div>

          <div>
            <small>SEMANA</small>

            <span>
              {ultimoReporte?.semana || "—"}
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
              {ultimoReporte?.semana ||
                ultimaProductividad?.semana ||
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

            <strong style={styles.evolutionText}>
              {ultimoReporte?.evolucion || "—"}
            </strong>

            <p>Comparación semanal</p>
          </div>

          <div style={styles.metricCard}>
            <span style={styles.metricIcon}>
              ✓
            </span>

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

              <div style={styles.actionGrid}>
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

                <div style={styles.focusBox}>
                  <div style={styles.emptyIcon}>
                    ✓
                  </div>

                  <strong>
                    Cómo mejorarlo
                  </strong>

                  <p>
                    {ultimoReporte.recomendaciones ||
                      "Sin recomendaciones cargadas"}
                  </p>
                </div>
              </div>

              <div style={styles.objectiveBox}>
                <div>
                  <small>OBJETIVO</small>

                  <strong>
                    {ultimoReporte.objetivos ||
                      "Sin objetivo cargado"}
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

          header,
          button,
          textarea {
            display: none !important;
          }

          .printHeader {
            display: block !important;
          }

          .panel {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            break-inside: avoid;
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

          .dataCard,
          .historyItem {
            grid-template-columns: 1fr !important;
          }

          .portalMenu {
            overflow-x: auto;
            white-space: nowrap;
          }
        }
      `}</style>
    </main>
  );
}

function AdminHeader({
  titulo,
  descripcion
}) {
  return (
    <>
      <div style={styles.sectionBadge}>
        {titulo}
      </div>

      <h2 style={styles.panelTitle}>
        {descripcion}
      </h2>
    </>
  );
}

function SelectorAsesor({
  asesores,
  value,
  onChange
}) {
  return (
    <select
      style={styles.input}
      value={value}
      onChange={onChange}
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
  );
}

function AdminReporte({
  asesores,
  form,
  setForm,
  guardar,
  guardando,
  mensaje
}) {
  return (
    <div style={styles.panel}>
      <AdminHeader
        titulo="CALIDAD"
        descripcion="Cargar reporte de calidad"
      />

      <p style={styles.paragraph}>
        Cargá la nota, evolución, objetivos,
        desvíos y devolución correspondiente
        al asesor.
      </p>

      <div style={styles.adminForm}>
        <FormField
          label="Asesor"
          full
        >
          <SelectorAsesor
            asesores={asesores}
            value={form.asesor_id}
            onChange={(e) =>
              setForm({
                ...form,
                asesor_id: e.target.value
              })
            }
          />
        </FormField>

        <FormInput
          label="Semana"
          value={form.semana}
          placeholder="Ej: Semana 3 - Agosto"
          onChange={(e) =>
            setForm({
              ...form,
              semana: e.target.value
            })
          }
        />

        <FormInput
          label="Nota de calidad"
          type="number"
          value={form.nota}
          placeholder="Ej: 85"
          onChange={(e) =>
            setForm({
              ...form,
              nota: e.target.value
            })
          }
        />

        <FormInput
          label="Evolución"
          value={form.evolucion}
          placeholder="Ej: Mejora respecto de la semana anterior"
          onChange={(e) =>
            setForm({
              ...form,
              evolucion: e.target.value
            })
          }
        />

        <FormInput
          label="Desvío principal"
          value={form.desvio_principal}
          placeholder="Ej: Validación de datos"
          onChange={(e) =>
            setForm({
              ...form,
              desvio_principal: e.target.value
            })
          }
        />

        <FormInput
          label="Producto"
          value={form.producto}
          placeholder="Ej: AP / BM"
          onChange={(e) =>
            setForm({
              ...form,
              producto: e.target.value
            })
          }
        />

        <FormTextarea
          label="Objetivos"
          value={form.objetivos}
          onChange={(e) =>
            setForm({
              ...form,
              objetivos: e.target.value
            })
          }
        />

        <FormTextarea
          label="Recomendaciones"
          value={form.recomendaciones}
          onChange={(e) =>
            setForm({
              ...form,
              recomendaciones: e.target.value
            })
          }
        />

        <FormTextarea
          label="Auditoría"
          value={form.auditoria}
          onChange={(e) =>
            setForm({
              ...form,
              auditoria: e.target.value
            })
          }
        />

        <FormTextarea
          label="Observaciones"
          value={form.observaciones}
          onChange={(e) =>
            setForm({
              ...form,
              observaciones: e.target.value
            })
          }
        />
      </div>

      <button
        style={styles.primaryButton}
        onClick={guardar}
        disabled={guardando}
      >
        {guardando
          ? "GUARDANDO..."
          : "GUARDAR REPORTE"}
      </button>

      {mensaje && (
        <p style={styles.successMessage}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

function AdminProductividad({
  asesores,
  form,
  setForm,
  guardar,
  guardando,
  mensaje
}) {
  return (
    <div style={styles.panel}>
      <AdminHeader
        titulo="PRODUCTIVIDAD"
        descripcion="Cargar productividad semanal"
      />

      <p style={styles.paragraph}>
        Completá los indicadores de
        productividad para que aparezcan
        automáticamente en el portal del
        asesor.
      </p>

      <div style={styles.adminForm}>
        <FormField label="Asesor" full>
          <SelectorAsesor
            asesores={asesores}
            value={form.asesor_id}
            onChange={(e) =>
              setForm({
                ...form,
                asesor_id: e.target.value
              })
            }
          />
        </FormField>

        <FormInput
          label="Semana"
          value={form.semana}
          onChange={(e) =>
            setForm({
              ...form,
              semana: e.target.value
            })
          }
        />

        <FormInput
          label="SPH"
          value={form.sph}
          onChange={(e) =>
            setForm({
              ...form,
              sph: e.target.value
            })
          }
        />

        <FormInput
          label="Objetivo SPH"
          value={form.sph_objetivo}
          onChange={(e) =>
            setForm({
              ...form,
              sph_objetivo: e.target.value
            })
          }
        />

        <FormInput
          label="Ventas"
          value={form.ventas}
          onChange={(e) =>
            setForm({
              ...form,
              ventas: e.target.value
            })
          }
        />

        <FormInput
          label="Objetivo de ventas"
          value={form.ventas_objetivo}
          onChange={(e) =>
            setForm({
              ...form,
              ventas_objetivo: e.target.value
            })
          }
        />

        <FormInput
          label="Objetivo de campaña"
          value={form.objetivo_campana}
          onChange={(e) =>
            setForm({
              ...form,
              objetivo_campana: e.target.value
            })
          }
        />

        <FormInput
          label="Descripción objetivo de campaña"
          value={
            form.objetivo_campana_descripcion
          }
          onChange={(e) =>
            setForm({
              ...form,
              objetivo_campana_descripcion:
                e.target.value
            })
          }
        />

        <SelectEstado
          label="Estado SPH"
          value={form.estado_sph}
          onChange={(e) =>
            setForm({
              ...form,
              estado_sph: e.target.value
            })
          }
        />

        <SelectEstado
          label="Estado ventas"
          value={form.estado_ventas}
          onChange={(e) =>
            setForm({
              ...form,
              estado_ventas: e.target.value
            })
          }
        />

        <SelectEstado
          label="Estado objetivo de campaña"
          value={
            form.estado_objetivo_campana
          }
          onChange={(e) =>
            setForm({
              ...form,
              estado_objetivo_campana:
                e.target.value
            })
          }
        />

        <FormTextarea
          label="¿Qué se realizó durante la semana?"
          value={form.gestion_semana}
          onChange={(e) =>
            setForm({
              ...form,
              gestion_semana: e.target.value
            })
          }
        />
      </div>

      <button
        style={styles.primaryButton}
        onClick={guardar}
        disabled={guardando}
      >
        {guardando
          ? "GUARDANDO..."
          : "GUARDAR PRODUCTIVIDAD"}
      </button>

      {mensaje && (
        <p style={styles.successMessage}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

function AdminTipificaciones({
  asesores,
  form,
  setForm,
  guardar,
  guardando,
  mensaje
}) {
  return (
    <div style={styles.panel}>
      <AdminHeader
        titulo="TIPIFICACIONES"
        descripcion="Cargar seguimiento de tipificaciones"
      />

      <div style={styles.adminForm}>
        <FormField label="Asesor" full>
          <SelectorAsesor
            asesores={asesores}
            value={form.asesor_id}
            onChange={(e) =>
              setForm({
                ...form,
                asesor_id: e.target.value
              })
            }
          />
        </FormField>

        <FormInput
          label="Semana"
          value={form.semana}
          onChange={(e) =>
            setForm({
              ...form,
              semana: e.target.value
            })
          }
        />

        <FormInput
          label="Tipificación"
          value={form.tipificacion}
          placeholder="Ej: Validación de datos"
          onChange={(e) =>
            setForm({
              ...form,
              tipificacion: e.target.value
            })
          }
        />

        <FormInput
          label="% Desvío"
          type="number"
          value={form.porcentaje_desvio}
          onChange={(e) =>
            setForm({
              ...form,
              porcentaje_desvio: e.target.value
            })
          }
        />

        <FormInput
          label="Objetivo"
          value={form.objetivo}
          placeholder="Ej: 10%"
          onChange={(e) =>
            setForm({
              ...form,
              objetivo: e.target.value
            })
          }
        />

        <FormTextarea
          label="Compromiso esperado"
          value={form.compromiso_esperado}
          onChange={(e) =>
            setForm({
              ...form,
              compromiso_esperado:
                e.target.value
            })
          }
        />
      </div>

      <button
        style={styles.primaryButton}
        onClick={guardar}
        disabled={guardando}
      >
        {guardando
          ? "GUARDANDO..."
          : "GUARDAR TIPIFICACIÓN"}
      </button>

      {mensaje && (
        <p style={styles.successMessage}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

function AdminGestion({
  asesores,
  form,
  setForm,
  guardar,
  guardando,
  mensaje
}) {
  return (
    <div style={styles.panel}>
      <AdminHeader
        titulo="GESTIÓN DE CALIDAD"
        descripcion="Cargar gestión semanal"
      />

      <div style={styles.adminForm}>
        <FormField label="Asesor" full>
          <SelectorAsesor
            asesores={asesores}
            value={form.asesor_id}
            onChange={(e) =>
              setForm({
                ...form,
                asesor_id: e.target.value
              })
            }
          />
        </FormField>

        <FormInput
          label="Semana"
          value={form.semana}
          onChange={(e) =>
            setForm({
              ...form,
              semana: e.target.value
            })
          }
        />

        <FormInput
          label="Cantidad de auditorías"
          value={form.cantidad_auditorias}
          onChange={(e) =>
            setForm({
              ...form,
              cantidad_auditorias:
                e.target.value
            })
          }
        />

        <FormTextarea
          label="Oportunidades de mejora"
          value={form.oportunidades_mejora}
          onChange={(e) =>
            setForm({
              ...form,
              oportunidades_mejora:
                e.target.value
            })
          }
        />

        <FormTextarea
          label="Coaching brindado"
          value={form.coaching_brindado}
          onChange={(e) =>
            setForm({
              ...form,
              coaching_brindado:
                e.target.value
            })
          }
        />

        <FormTextarea
          label="Registro en sistema"
          value={form.registro_sistema}
          onChange={(e) =>
            setForm({
              ...form,
              registro_sistema:
                e.target.value
            })
          }
        />

        <FormTextarea
          label="Compromiso esperado"
          value={form.compromiso_esperado}
          onChange={(e) =>
            setForm({
              ...form,
              compromiso_esperado:
                e.target.value
            })
          }
        />

        <FormTextarea
          label="Fortalezas destacadas"
          value={form.fortalezas_destacadas}
          onChange={(e) =>
            setForm({
              ...form,
              fortalezas_destacadas:
                e.target.value
            })
          }
        />
      </div>

      <button
        style={styles.primaryButton}
        onClick={guardar}
        disabled={guardando}
      >
        {guardando
          ? "GUARDANDO..."
          : "GUARDAR GESTIÓN"}
      </button>

      {mensaje && (
        <p style={styles.successMessage}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

function AdminNoVenta({
  asesores,
  form,
  setForm,
  guardar,
  guardando,
  mensaje
}) {
  return (
    <div style={styles.panel}>
      <AdminHeader
        titulo="AUDITORÍAS DE NO VENTA"
        descripcion="Cargar oportunidades detectadas"
      />

      <div style={styles.adminForm}>
        <FormField label="Asesor" full>
          <SelectorAsesor
            asesores={asesores}
            value={form.asesor_id}
            onChange={(e) =>
              setForm({
                ...form,
                asesor_id: e.target.value
              })
            }
          />
        </FormField>

        <FormInput
          label="Semana"
          value={form.semana}
          onChange={(e) =>
            setForm({
              ...form,
              semana: e.target.value
            })
          }
        />

        <FormInput
          label="Cantidad de auditorías"
          value={form.cantidad_auditorias}
          onChange={(e) =>
            setForm({
              ...form,
              cantidad_auditorias:
                e.target.value
            })
          }
        />

        <FormTextarea
          label="Oportunidades detectadas"
          value={
            form.oportunidades_detectadas
          }
          onChange={(e) =>
            setForm({
              ...form,
              oportunidades_detectadas:
                e.target.value
            })
          }
        />

        <FormTextarea
          label="Desvío principal"
          value={form.desvio_principal}
          onChange={(e) =>
            setForm({
              ...form,
              desvio_principal:
                e.target.value
            })
          }
        />

        <FormTextarea
          label="Recomendaciones"
          value={form.recomendaciones}
          onChange={(e) =>
            setForm({
              ...form,
              recomendaciones:
                e.target.value
            })
          }
        />

        <FormTextarea
          label="Compromiso esperado"
          value={form.compromiso_esperado}
          onChange={(e) =>
            setForm({
              ...form,
              compromiso_esperado:
                e.target.value
            })
          }
        />

        <FormTextarea
          label="Observaciones"
          value={form.observaciones}
          onChange={(e) =>
            setForm({
              ...form,
              observaciones:
                e.target.value
            })
          }
        />
      </div>

      <button
        style={styles.primaryButton}
        onClick={guardar}
        disabled={guardando}
      >
        {guardando
          ? "GUARDANDO..."
          : "GUARDAR NO VENTA"}
      </button>

      {mensaje && (
        <p style={styles.successMessage}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

function AdminDevolucion({
  asesores,
  form,
  setForm,
  guardar,
  guardando,
  mensaje
}) {
  return (
    <div style={styles.panel}>
      <AdminHeader
        titulo="DEVOLUCIÓN"
        descripcion="Enviar devolución de Calidad"
      />

      <p style={styles.paragraph}>
        Esta devolución aparecerá directamente
        en el portal personal del asesor.
      </p>

      <div style={styles.adminForm}>
        <FormField label="Asesor" full>
          <SelectorAsesor
            asesores={asesores}
            value={form.asesor_id}
            onChange={(e) =>
              setForm({
                ...form,
                asesor_id: e.target.value
              })
            }
          />
        </FormField>

        <FormInput
          label="Semana"
          value={form.semana}
          onChange={(e) =>
            setForm({
              ...form,
              semana: e.target.value
            })
          }
        />

        <FormTextarea
          label="Devolución de Calidad"
          value={form.comentario}
          onChange={(e) =>
            setForm({
              ...form,
              comentario: e.target.value
            })
          }
        />
      </div>

      <button
        style={styles.primaryButton}
        onClick={guardar}
        disabled={guardando}
      >
        {guardando
          ? "ENVIANDO..."
          : "ENVIAR DEVOLUCIÓN"}
      </button>

      {mensaje && (
        <p style={styles.successMessage}>
          {mensaje}
        </p>
      )}
    </div>
  );
}

function FormField({
  label,
  children,
  full
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

      {children}
    </div>
  );
}

function FormInput({
  label,
  type = "text",
  value,
  placeholder,
  onChange
}) {
  return (
    <FormField label={label}>
      <input
        style={styles.input}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </FormField>
  );
}

function FormTextarea({
  label,
  value,
  onChange
}) {
  return (
    <FormField label={label} full>
      <textarea
        style={styles.textarea}
        value={value}
        onChange={onChange}
      />
    </FormField>
  );
}

function SelectEstado({
  label,
  value,
  onChange
}) {
  return (
    <FormField label={label}>
      <select
        style={styles.input}
        value={value}
        onChange={onChange}
      >
        <option value="">
          Seleccionar estado
        </option>

        {estadoOpciones.map((estado) => (
          <option
            key={estado}
            value={estado}
          >
            {estado}
          </option>
        ))}
      </select>
    </FormField>
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
      estado
        .toLowerCase()
        .includes("alcanz") ||
      estado
        .toLowerCase()
        .includes("cumpl")
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
      "linear-gradient(135deg,#eef4f1 0%,#dce8e2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial,sans-serif",
    padding: "20px"
  },

  loginCard: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "24px",
    padding: "45px",
    boxShadow:
      "0 20px 60px rgba(0,0,0,.10)"
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
    margin: 0,
    color: "#30463b",
    fontSize: "28px"
  },

  subtitle: {
    textAlign: "center",
    color: "#7b8982",
    marginBottom: "35px",
    lineHeight: 1.5
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
    padding: "14px",
    border: "1px solid #d5ddd8",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    background: "#fff"
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
    lineHeight: 1.5
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

  primaryButton: {
    marginTop: "20px",
    padding: "13px 22px",
    border: "none",
    borderRadius: "10px",
    background: "#657f70",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  },

  printButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "9px",
    background: "#657f70",
    color: "#fff",
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
    fontFamily: "Arial,sans-serif"
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
      "0 2px 10px rgba(0,0,0,.05)"
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

  portalMenu: {
    display: "flex",
    gap: "20px",
    background: "#fff",
    borderRadius: "14px",
    padding: "14px 18px",
    marginBottom: "25px",
    color: "#657f70",
    fontSize: "13px",
    fontWeight: "bold",
    overflowX: "auto"
  },

  hero: {
    marginBottom: "20px"
  },

  heroBadge: {
    color: "#657f70",
    fontSize: "11px",
    fontWeight: "bold",
    letterSpacing: "1px"
  },

  mainScore: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#30463b",
    color: "#fff",
    borderRadius: "18px",
    padding: "25px 30px",
    marginTop: "25px",
    gap: "20px",
    flexWrap: "wrap"
  },

  infoBar: {
    background: "#e9f0ec",
    borderRadius: "14px",
    padding: "16px 20px",
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    marginTop: "18px"
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    margin: "25px 0"
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,.05)"
  },

  metricCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,.05)"
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
    lineHeight: 1.4
  },

  weekText: {
    display: "block",
    color: "#657f70",
    marginTop: "10px",
    fontSize: "18px"
  },

  panel: {
    background: "#fff",
    borderRadius: "18px",
    padding: "28px",
    marginTop: "25px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,.05)"
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
    lineHeight: 1.6
  },

  adminForm: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
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
    gridColumn: "1/-1"
  },

  formLabel: {
    color: "#40534a",
    fontWeight: "bold",
    fontSize: "13px"
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
      "repeat(auto-fit,minmax(240px,1fr))",
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

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px"
  },

  objectiveBox: {
    background: "#f2f6f3",
    borderRadius: "14px",
    padding: "20px",
    marginTop: "20px",
    color: "#40534a"
  },

  focusBox: {
    textAlign: "center",
    padding: "20px",
    color: "#40534a",
    border: "1px solid #edf0ee",
    borderRadius: "14px"
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
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px"
  },

  qualityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
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
    background: "#fff",
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

  historyScore: {
    fontSize: "22px",
    color: "#657f70"
  }
};
```
