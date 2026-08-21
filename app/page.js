"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "ayelenvillega42@gmail.com";

const asesores = [
  ["Acosta, Pamela", "8134", "acosta.pamela@portalcalidad.com"],
  ["Aguilera, Trinidad", "8196", "aguilera.trinidad@portalcalidad.com"],
  ["Bahamonde, Camila", "8135", "bahamonde.camila@portalcalidad.com"],
  ["Bustamante, Ailin", "8188", "bustamante.ailin@portalcalidad.com"],
  ["Bustos, Jesica", "8141", "bustos.jesica@portalcalidad.com"],
  ["Bustos, Nicolas", "8214", "bustos.nicolas@portalcalidad.com"],
  ["Cabrera, Antonella", "8187", "cabrera.antonella@portalcalidad.com"],
  ["Contreras, Gilary", "8046", "contreras.gilary@portalcalidad.com"],
  ["Cordoba, Tania", "8202", "cordoba.tania@portalcalidad.com"],
  ["Diaz, Milagros", "8212", "diaz.milagros@portalcalidad.com"],
  ["Gomez, Carla", "8126", "gomez.carla@portalcalidad.com"],
  ["Luna, Oriana", "8097", "luna.oriana@portalcalidad.com"],
  ["Malqui, Xiomara", "8092", "malqui.xiomara@portalcalidad.com"],
  ["Mercado, Chiara", "8209", "mercado.chiara@portalcalidad.com"],
  ["Ojeda, Luana", "8200", "ojeda.luana@portalcalidad.com"],
  ["Olmedo, Thomas", "8192", "olmedo.thomas@portalcalidad.com"],
  ["Peralta, Belen", "8207", "peralta.belen@portalcalidad.com"],
  ["Reartes, Maia", "8201", "reartes.maia@portalcalidad.com"],
  ["Rojek, Luna", "8213", "rojek.luna@portalcalidad.com"],
  ["Simonetta, Valentina", "8191, "simonetta.valentina@portalcalidad.com"],
  ["Tello, Marianela", "8042", "tello.marianela@portalcalidad.com"],
  ["Vasquez, Agustin", "8136", "vasquez.agustin@portalcalidad.com"],
  ["Viniegra, Agustín", "8199", "viniegra.agustin@portalcalidad.com"],
];

export default function Page() {
  const [session, setSession] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [modo, setModo] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [entrando, setEntrando] = useState(false);

  const [asesorActual, setAsesorActual] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [cargandoReportes, setCargandoReportes] = useState(false);

  const [adminReportes, setAdminReportes] = useState([]);
  const [cargandoAdmin, setCargandoAdmin] = useState(false);

  const [pestana, setPestana] = useState("inicio");
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

  const [form, setForm] = useState({
    usuario: "",
    semana: "",
    nota: "",
    objetivo_calidad: "",
    estado_objetivo: "",
    producto: "",
    desvio: "",
    recomendacion: "",
    objetivo: "",
    items_calidad: "",
    acciones_calidad: "",
    auditoria: "",
    audio_url: "",
    observaciones: "",
    sph: "",
    objetivo_sph: "",
    ventas: "",
    objetivo_ventas: "",
    objetivo_campania: "",
    estado_campania: "",
    items_productividad: "",
    acciones_productividad: "",
    observaciones_productividad: "",
    tipificaciones: "",
    objetivo_tipificaciones: "",
    estado_tipificaciones: "",
    tipificacion_desvio: "",
    tipificacion_objetivo: "",
    tipificacion_resultado: "",
    tipificacion_compromiso: "",
    tipificacion_observaciones: "",
    auditorias_no_ventas: "",
    principales_om: "",
    coaching: "",
    registro_sistema: "",
    compromiso_no_ventas: "",
    fortalezas: "",
    observaciones_no_ventas: "",
  });

  const [mensajeAdmin, setMensajeAdmin] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function verificarSesion() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session?.user?.email) {
        const correo = session.user.email.toLowerCase();

        if (correo === ADMIN_EMAIL.toLowerCase()) {
          setModo("admin");
          cargarReportesAdmin();
        } else {
          const asesor = asesores.find(
            ([, , emailAsesor]) =>
              emailAsesor.toLowerCase() === correo
          );

          if (asesor) {
            setAsesorActual(asesor);
            setModo("asesor");
            cargarReportes(asesor[1]);
          } else {
            await supabase.auth.signOut();
            setModo("login");
          }
        }
      }

      setCargando(false);
    }

    verificarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      setSession(nuevaSesion);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function cargarReportes(usuario) {
    setCargandoReportes(true);

    const { data, error } = await supabase
      .from("reportes")
      .select("*")
      .eq("usuario", usuario)
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setReportes([]);
    } else {
      setReportes(data || []);
    }

    setCargandoReportes(false);
  }

  async function cargarReportesAdmin() {
    setCargandoAdmin(true);

    const { data, error } = await supabase
      .from("reportes")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setAdminReportes([]);
    } else {
      setAdminReportes(data || []);
    }

    setCargandoAdmin(false);
  }

  async function iniciarSesion(e) {
    e.preventDefault();

    if (!email || !password) {
      setLoginError("Ingresá tu email y contraseña.");
      return;
    }

    setEntrando(true);
    setLoginError("");

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

    if (error) {
      console.error(error);
      setLoginError("El email o la contraseña no son correctos.");
      setEntrando(false);
      return;
    }

    const usuarioEmail = data.user?.email?.toLowerCase();

    if (usuarioEmail === ADMIN_EMAIL.toLowerCase()) {
      setModo("admin");
      await cargarReportesAdmin();
    } else {
      const asesor = asesores.find(
        ([, , correo]) =>
          correo.toLowerCase() === usuarioEmail
      );

      if (!asesor) {
        await supabase.auth.signOut();

        setLoginError(
          "Tu cuenta no está asociada a un asesor registrado."
        );

        setEntrando(false);
        return;
      }

      setAsesorActual(asesor);
      setModo("asesor");

      await cargarReportes(asesor[1]);
    }

    setEntrando(false);
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();

    setSession(null);
    setAsesorActual(null);
    setReportes([]);
    setAdminReportes([]);
    setEmail("");
    setPassword("");
    setModo("login");
    setPestana("inicio");
  }

  function cambiarFormulario(e) {
    const { name, value } = e.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function limpiarFormulario() {
    setForm({
      usuario: "",
      semana: "",
      nota: "",
      objetivo_calidad: "",
      estado_objetivo: "",
      producto: "",
      desvio: "",
      recomendacion: "",
      objetivo: "",
      items_calidad: "",
      acciones_calidad: "",
      auditoria: "",
      audio_url: "",
      observaciones: "",
      sph: "",
      objetivo_sph: "",
      ventas: "",
      objetivo_ventas: "",
      objetivo_campania: "",
      estado_campania: "",
      items_productividad: "",
      acciones_productividad: "",
      observaciones_productividad: "",
      tipificaciones: "",
      objetivo_tipificaciones: "",
      estado_tipificaciones: "",
      tipificacion_desvio: "",
      tipificacion_objetivo: "",
      tipificacion_resultado: "",
      tipificacion_compromiso: "",
      tipificacion_observaciones: "",
      auditorias_no_ventas: "",
      principales_om: "",
      coaching: "",
      registro_sistema: "",
      compromiso_no_ventas: "",
      fortalezas: "",
      observaciones_no_ventas: "",
    });
  }

  async function guardarReporte(e) {
    e.preventDefault();

    if (!form.usuario || !form.semana) {
      setMensajeAdmin(
        "Seleccioná un asesor e ingresá la semana."
      );
      return;
    }

    setGuardando(true);
    setMensajeAdmin("");

    const itemsCalidad = convertirLista(form.items_calidad);
    const accionesCalidad = convertirLista(form.acciones_calidad);
    const itemsProductividad = convertirLista(
      form.items_productividad
    );
    const accionesProductividad = convertirLista(
      form.acciones_productividad
    );
    const tipificaciones = convertirLista(
      form.tipificaciones
    );
    const principalesOM = convertirLista(form.principales_om);
    const fortalezas = convertirLista(form.fortalezas);

    const nuevoReporte = {
      usuario: form.usuario,
      semana: form.semana,
      nota: form.nota || null,
      objetivo_calidad: form.objetivo_calidad || null,
      estado_objetivo: form.estado_objetivo || null,
      producto: form.producto || null,
      desvio: form.desvio || null,
      recomendacion: form.recomendacion || null,
      objetivo: form.objetivo || null,
      items_calidad: itemsCalidad,
      acciones_calidad: accionesCalidad,
      auditoria: form.auditoria || null,
      audio_url: form.audio_url || null,
      observaciones: form.observaciones || null,
      sph: form.sph || null,
      objetivo_sph: form.objetivo_sph || null,
      ventas: form.ventas || null,
      objetivo_ventas: form.objetivo_ventas || null,
      objetivo_campania: form.objetivo_campania || null,
      estado_campania: form.estado_campania || null,
      items_productividad: itemsProductividad,
      acciones_productividad: accionesProductividad,
      observaciones_productividad:
        form.observaciones_productividad || null,
      tipificaciones,
      objetivo_tipificaciones:
        form.objetivo_tipificaciones || null,
      estado_tipificaciones:
        form.estado_tipificaciones || null,
      tipificacion_desvio:
        form.tipificacion_desvio || null,
      tipificacion_objetivo:
        form.tipificacion_objetivo || null,
      tipificacion_resultado:
        form.tipificacion_resultado || null,
      tipificacion_compromiso:
        form.tipificacion_compromiso || null,
      tipificacion_observaciones:
        form.tipificacion_observaciones || null,
      auditorias_no_ventas:
        form.auditorias_no_ventas || null,
      principales_om: principalesOM,
      coaching: form.coaching || null,
      registro_sistema:
        form.registro_sistema || null,
      compromiso_no_ventas:
        form.compromiso_no_ventas || null,
      fortalezas,
      observaciones_no_ventas:
        form.observaciones_no_ventas || null,
    };

    const { error } = await supabase
      .from("reportes")
      .insert([nuevoReporte]);

    if (error) {
      console.error(error);

      setMensajeAdmin(
        "No se pudo guardar el reporte. Revisá la configuración de Supabase."
      );

      setGuardando(false);
      return;
    }

    setMensajeAdmin("✓ REPORTE GUARDADO CORRECTAMENTE");

    limpiarFormulario();

    await cargarReportesAdmin();

    setGuardando(false);
  }

  const reporteActual = reportes[0];

  const reporteAnterior = reportes.length > 1
    ? reportes[1]
    : null;

  const diferenciaCalidad =
    obtenerNumero(reporteActual?.nota) !== null &&
    obtenerNumero(reporteAnterior?.nota) !== null
      ? obtenerNumero(reporteActual.nota) -
        obtenerNumero(reporteAnterior.nota)
      : null;

  const porcentajeObjetivo = calcularProgreso(
    reporteActual?.nota,
    reporteActual?.objetivo_calidad
  );

  const faltanteObjetivo =
    obtenerNumero(reporteActual?.objetivo_calidad) !== null &&
    obtenerNumero(reporteActual?.nota) !== null
      ? Math.max(
          0,
          obtenerNumero(reporteActual.objetivo_calidad) -
            obtenerNumero(reporteActual.nota)
        )
      : null;

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
          <div style={styles.loadingCard}>
            <div style={styles.loadingIcon}>✓</div>
            <h2>Portal de Calidad</h2>
            <p style={styles.muted}>
              Verificando acceso...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (modo === "login") {
    return (
      <main style={styles.page}>
        <div style={styles.loginContainer}>
          <div style={styles.loginCard}>
            <div style={styles.logo}>✓</div>

            <div style={styles.loginEyebrow}>
              PORTAL DE CALIDAD
            </div>

            <h1 style={styles.loginTitle}>
              Bienvenido/a
            </h1>

            <p style={styles.muted}>
              Ingresá con tu email y contraseña.
            </p>

            {loginError && (
              <div style={styles.error}>
                {loginError}
              </div>
            )}

            <form onSubmit={iniciarSesion}>
              <label style={styles.label}>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Ingresá tu email"
                style={styles.input}
                autoComplete="email"
              />

              <label style={styles.label}>
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Ingresá tu contraseña"
                style={styles.input}
                autoComplete="current-password"
              />

              <button
                type="submit"
                disabled={entrando}
                style={{
                  ...styles.primaryButton,
                  opacity: entrando ? 0.65 : 1,
                }}
              >
                {entrando
                  ? "INGRESANDO..."
                  : "INGRESAR"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (modo === "admin") {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div>
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.headerTitle}>
                Panel de Calidad
              </h1>

              <p style={styles.muted}>
                Carga y gestión de reportes
              </p>
            </div>

            <button
              onClick={cerrarSesion}
              style={styles.secondaryButton}
            >
              Cerrar sesión
            </button>
          </header>

          <section style={styles.adminHero}>
            <div>
              <p style={styles.heroSmall}>
                ADMINISTRACIÓN
              </p>

              <h2 style={styles.heroTitle}>
                Cargar nuevo reporte
              </h2>

              <p style={styles.heroText}>
                El reporte quedará disponible
                automáticamente para el asesor
                seleccionado.
              </p>
            </div>
          </section>

          <section style={styles.card}>
            <form onSubmit={guardarReporte}>
              <div style={styles.formGrid}>
                <Field
                  label="Asesor"
                  name="usuario"
                  value={form.usuario}
                  onChange={cambiarFormulario}
                  type="select"
                  options={asesores.map((asesor) => ({
                    value: asesor[1],
                    label: `${asesor[0]} — ${asesor[1]}`,
                  }))}
                  required
                />

                <Field
                  label="Semana / período"
                  name="semana"
                  value={form.semana}
                  onChange={cambiarFormulario}
                  placeholder="Ej: Semana 3 - Agosto"
                  required
                />

                <Field
                  label="Nota de calidad"
                  name="nota"
                  value={form.nota}
                  onChange={cambiarFormulario}
                  placeholder="Ej: 50"
                />

                <Field
                  label="Objetivo de calidad"
                  name="objetivo_calidad"
                  value={form.objetivo_calidad}
                  onChange={cambiarFormulario}
                  placeholder="Ej: 70"
                />

                <Field
                  label="Estado del objetivo"
                  name="estado_objetivo"
                  value={form.estado_objetivo}
                  onChange={cambiarFormulario}
                  placeholder="Ej: Debajo del objetivo"
                />

                <Field
                  label="Producto"
                  name="producto"
                  value={form.producto}
                  onChange={cambiarFormulario}
                  placeholder="Ej: AP"
                />
              </div>

              <Field
                label="Desvío principal"
                name="desvio"
                value={form.desvio}
                onChange={cambiarFormulario}
                type="textarea"
                placeholder="Ej: Validación de datos"
              />

              <Field
                label="Recomendación"
                name="recomendacion"
                value={form.recomendacion}
                onChange={cambiarFormulario}
                type="textarea"
                placeholder="Qué debería trabajar el asesor..."
              />

              <Field
                label="Objetivo de trabajo"
                name="objetivo"
                value={form.objetivo}
                onChange={cambiarFormulario}
                type="textarea"
                placeholder="Objetivo para la próxima evaluación..."
              />

              <Field
                label="Items trabajados en Calidad"
                name="items_calidad"
                value={form.items_calidad}
                onChange={cambiarFormulario}
                type="textarea"
                placeholder={
                  "Un item por línea.\nValidación de datos\nCláusula de aceptación\nInformación"
                }
              />

              <Field
                label="Acciones realizadas en Calidad"
                name="acciones_calidad"
                value={form.acciones_calidad}
                onChange={cambiarFormulario}
                type="textarea"
                placeholder={
                  "Una acción por línea.\nFeedback individual\nEspacio de coaching\nSeguimiento"
                }
              />

              <Field
                label="Auditoría"
                name="auditoria"
                value={form.auditoria}
                onChange={cambiarFormulario}
                placeholder="Referencia de auditoría"
              />

              <Field
                label="URL del audio"
                name="audio_url"
                value={form.audio_url}
                onChange={cambiarFormulario}
                placeholder="Pegá la URL del audio"
              />

              <Field
                label="Observaciones de Calidad"
                name="observaciones"
                value={form.observaciones}
                onChange={cambiarFormulario}
                type="textarea"
                placeholder="Observaciones..."
              />

              <div style={styles.adminSection}>
                <h2 style={styles.adminSectionTitle}>
                  Productividad
                </h2>

                <div style={styles.formGrid}>
                  <Field
                    label="SPH"
                    name="sph"
                    value={form.sph}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 0.15"
                  />

                  <Field
                    label="Objetivo SPH"
                    name="objetivo_sph"
                    value={form.objetivo_sph}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 0.5"
                  />

                  <Field
                    label="Ventas"
                    name="ventas"
                    value={form.ventas}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 12"
                  />

                  <Field
                    label="Objetivo ventas"
                    name="objetivo_ventas"
                    value={form.objetivo_ventas}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 40"
                  />

                  <Field
                    label="Objetivo de campaña"
                    name="objetivo_campania"
                    value={form.objetivo_campania}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 50"
                  />

                  <Field
                    label="Estado de campaña"
                    name="estado_campania"
                    value={form.estado_campania}
                    onChange={cambiarFormulario}
                    placeholder="Ej: En proceso"
                  />
                </div>

                <Field
                  label="Items trabajados en Productividad"
                  name="items_productividad"
                  value={form.items_productividad}
                  onChange={cambiarFormulario}
                  type="textarea"
                  placeholder={
                    "Un item por línea.\nCierre con seguridad comercial\nOfrecimiento\nRebate comercial"
                  }
                />

                <Field
                  label="Acciones realizadas en Productividad"
                  name="acciones_productividad"
                  value={form.acciones_productividad}
                  onChange={cambiarFormulario}
                  type="textarea"
                  placeholder={
                    "Una acción por línea.\nSimulación de llamada\nAcompañamiento en línea\nDevolución personalizada"
                  }
                />

                <Field
                  label="Observaciones de Productividad"
                  name="observaciones_productividad"
                  value={form.observaciones_productividad}
                  onChange={cambiarFormulario}
                  type="textarea"
                  placeholder="Observaciones..."
                />
              </div>

              <div style={styles.adminSection}>
                <h2 style={styles.adminSectionTitle}>
                  Tipificaciones
                </h2>

                <Field
                  label="Tipificaciones"
                  name="tipificaciones"
                  value={form.tipificaciones}
                  onChange={cambiarFormulario}
                  type="textarea"
                  placeholder={
                    "Una tipificación por línea.\nNo conforme con sumas aseguradas\nNo interesado - Producto\nProblemas económicos"
                  }
                />

                <div style={styles.formGrid}>
                  <Field
                    label="Estado"
                    name="estado_tipificaciones"
                    value={form.estado_tipificaciones}
                    onChange={cambiarFormulario}
                    placeholder="Ej: En proceso"
                  />

                  <Field
                    label="Desvío"
                    name="tipificacion_desvio"
                    value={form.tipificacion_desvio}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 1"
                  />

                  <Field
                    label="Objetivo"
                    name="tipificacion_objetivo"
                    value={form.tipificacion_objetivo}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 14"
                  />

                  <Field
                    label="Resultado"
                    name="tipificacion_resultado"
                    value={form.tipificacion_resultado}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 14"
                  />

                  <Field
                    label="Compromiso"
                    name="tipificacion_compromiso"
                    value={form.tipificacion_compromiso}
                    onChange={cambiarFormulario}
                    placeholder="Ej: SEGUIMIENTO"
                  />
                </div>

                <Field
                  label="Observaciones de Tipificaciones"
                  name="tipificacion_observaciones"
                  value={form.tipificacion_observaciones}
                  onChange={cambiarFormulario}
                  type="textarea"
                  placeholder="Observaciones..."
                />
              </div>

              <div style={styles.adminSection}>
                <h2 style={styles.adminSectionTitle}>
                  Auditorías de no ventas
                </h2>

                <div style={styles.formGrid}>
                  <Field
                    label="Cantidad"
                    name="auditorias_no_ventas"
                    value={form.auditorias_no_ventas}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 5"
                  />

                  <Field
                    label="Coaching"
                    name="coaching"
                    value={form.coaching}
                    onChange={cambiarFormulario}
                    placeholder="Ej: Realizado"
                  />

                  <Field
                    label="Registro en sistema"
                    name="registro_sistema"
                    value={form.registro_sistema}
                    onChange={cambiarFormulario}
                    placeholder="Ej: Correcta"
                  />

                  <Field
                    label="Compromiso"
                    name="compromiso_no_ventas"
                    value={form.compromiso_no_ventas}
                    onChange={cambiarFormulario}
                    placeholder="Ej: Aplica devolución"
                  />
                </div>

                <Field
                  label="Principales O.M."
                  name="principales_om"
                  value={form.principales_om}
                  onChange={cambiarFormulario}
                  type="textarea"
                  placeholder={
                    "Una por línea.\nGeneración de interés\nCambio apertura\nEscucha activa"
                  }
                />

                <Field
                  label="Fortalezas"
                  name="fortalezas"
                  value={form.fortalezas}
                  onChange={cambiarFormulario}
                  type="textarea"
                  placeholder={
                    "Una por línea.\nAdaptabilidad\nBuena detección de necesidad\nClaridad en explicación"
                  }
                />

                <Field
                  label="Observaciones"
                  name="observaciones_no_ventas"
                  value={form.observaciones_no_ventas}
                  onChange={cambiarFormulario}
                  type="textarea"
                  placeholder="Observaciones..."
                />
              </div>

              <button
                type="submit"
                disabled={guardando}
                style={{
                  ...styles.primaryButton,
                  marginTop: "20px",
                  opacity: guardando ? 0.65 : 1,
                }}
              >
                {guardando
                  ? "GUARDANDO..."
                  : "GUARDAR REPORTE"}
              </button>

              {mensajeAdmin && (
                <div
                  style={{
                    ...styles.success,
                    marginTop: "15px",
                  }}
                >
                  {mensajeAdmin}
                </div>
              )}
            </form>
          </section>

          <section style={styles.card}>
            <div style={styles.sectionTop}>
              <div>
                <p style={styles.eyebrow}>
                  HISTORIAL ADMINISTRATIVO
                </p>

                <h2 style={{ margin: 0 }}>
                  Reportes cargados
                </h2>
              </div>
            </div>

            {cargandoAdmin ? (
              <p style={styles.muted}>
                Cargando reportes...
              </p>
            ) : adminReportes.length === 0 ? (
              <p style={styles.muted}>
                Todavía no hay reportes cargados.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Asesor</th>
                      <th style={styles.th}>Semana</th>
                      <th style={styles.th}>Nota</th>
                      <th style={styles.th}>Producto</th>
                      <th style={styles.th}>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {adminReportes.map((reporte) => {
                      const asesor = asesores.find(
                        (item) =>
                          item[1] === reporte.usuario
                      );

                      return (
                        <tr key={reporte.id}>
                          <td style={styles.td}>
                            {asesor
                              ? asesor[0]
                              : reporte.usuario}
                          </td>

                          <td style={styles.td}>
                            {reporte.semana || "-"}
                          </td>

                          <td style={styles.td}>
                            {reporte.nota || "-"}
                          </td>

                          <td style={styles.td}>
                            {reporte.producto || "-"}
                          </td>

                          <td style={styles.td}>
                            {reporte.estado_objetivo || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  if (modo === "asesor") {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div>
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.headerTitle}>
                Hola, {obtenerNombre(asesorActual?.[0])}
              </h1>

              <p style={styles.headerPeriod}>
                {reporteActual?.semana || "Sin reporte cargado"}
              </p>
            </div>

            <div style={styles.headerRight}>
              {reporteActual && (
                <StatusBadge
                  estado={
                    reporteActual.estado_objetivo ||
                    "En seguimiento"
                  }
                />
              )}

              <button
                onClick={cerrarSesion}
                style={styles.secondaryButton}
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          {cargandoReportes ? (
            <section style={styles.card}>
              <h2>Cargando información...</h2>
            </section>
          ) : reportes.length === 0 ? (
            <section style={styles.emptyState}>
              <div style={styles.emptyIcon}>✓</div>

              <h2>Todavía no hay reportes</h2>

              <p style={styles.muted}>
                Cuando Calidad cargue tu primer
                reporte semanal, vas a poder verlo
                desde acá.
              </p>
            </section>
          ) : (
            <>
              <nav style={styles.tabs}>
                <TabButton
                  active={pestana === "inicio"}
                  onClick={() => setPestana("inicio")}
                  icon="⌂"
                  label="Inicio"
                />

                <TabButton
                  active={pestana === "calidad"}
                  onClick={() => setPestana("calidad")}
                  icon="01"
                  label="Calidad"
                />

                <TabButton
                  active={pestana === "productividad"}
                  onClick={() =>
                    setPestana("productividad")
                  }
                  icon="02"
                  label="Productividad"
                />

                <TabButton
                  active={pestana === "tipificaciones"}
                  onClick={() =>
                    setPestana("tipificaciones")
                  }
                  icon="03"
                  label="Tipificaciones"
                />

                <TabButton
                  active={pestana === "auditorias"}
                  onClick={() =>
                    setPestana("auditorias")
                  }
                  icon="04"
                  label="Auditorías"
                />

                <TabButton
                  active={pestana === "historico"}
                  onClick={() =>
                    setPestana("historico")
                  }
                  icon="05"
                  label="Histórico"
                />

                <TabButton
                  active={pestana === "actividades"}
                  onClick={() =>
                    setPestana("actividades")
                  }
                  icon="06"
                  label="Actividades"
                />

                <TabButton
                  active={pestana === "feedback"}
                  onClick={() =>
                    setPestana("feedback")
                  }
                  icon="07"
                  label="Feedback"
                />
              </nav>

              {pestana === "inicio" && (
                <Inicio
                  reporte={reporteActual}
                  asesorActual={asesorActual}
                  porcentajeObjetivo={porcentajeObjetivo}
                  faltanteObjetivo={faltanteObjetivo}
                  diferenciaCalidad={diferenciaCalidad}
                  reporteAnterior={reporteAnterior}
                  irA={setPestana}
                />
              )}

              {pestana === "calidad" && (
                <Calidad
                  reporte={reporteActual}
                  porcentajeObjetivo={porcentajeObjetivo}
                  faltanteObjetivo={faltanteObjetivo}
                  diferenciaCalidad={diferenciaCalidad}
                  reporteAnterior={reporteAnterior}
                />
              )}

              {pestana === "productividad" && (
                <Productividad
                  reporte={reporteActual}
                  reporteAnterior={reporteAnterior}
                />
              )}

              {pestana === "tipificaciones" && (
                <Tipificaciones reporte={reporteActual} />
              )}

              {pestana === "auditorias" && (
                <AuditoriasNoVentas
                  reporte={reporteActual}
                />
              )}

              {pestana === "historico" && (
                <Historico
                  reportes={reportes}
                  seleccionarReporte={setReporteSeleccionado}
                  reporteSeleccionado={reporteSeleccionado}
                />
              )}

              {pestana === "actividades" && (
                <Actividades />
              )}

              {pestana === "feedback" && (
                <Feedback />
              )}
            </>
          )}
        </div>
      </main>
    );
  }

  return null;
}

function Inicio({
  reporte,
  porcentajeObjetivo,
  faltanteObjetivo,
  diferenciaCalidad,
  reporteAnterior,
  irA,
}) {
  return (
    <>
      <section style={styles.welcomeCard}>
        <div>
          <p style={styles.heroSmallDark}>
            ÚLTIMO REPORTE
          </p>

          <h2 style={styles.welcomeTitle}>
            {reporte?.semana}
          </h2>

          <p style={styles.welcomeText}>
            Acá vas a encontrar el resumen de tu
            evolución y los principales puntos de
            trabajo.
          </p>
        </div>

        <div style={styles.scoreLarge}>
          {reporte?.nota || "-"}
        </div>
      </section>

      <section style={styles.overviewGrid}>
        <OverviewCard
          number="01"
          title="CALIDAD"
          value={reporte?.nota || "-"}
          subtitle="/ 100"
          accent="petrol"
          onClick={() => irA("calidad")}
        />

        <OverviewCard
          number="02"
          title="PRODUCTIVIDAD"
          value={reporte?.sph || "-"}
          subtitle="SPH"
          accent="blue"
          onClick={() => irA("productividad")}
        />

        <OverviewCard
          number="03"
          title="TIPIFICACIONES"
          value={
            reporte?.estado_tipificaciones ||
            "En seguimiento"
          }
          subtitle=""
          accent="teal"
          onClick={() => irA("tipificaciones")}
        />

        <OverviewCard
          number="04"
          title="AUDITORÍAS"
          value={reporte?.auditorias_no_ventas || "-"}
          subtitle="No ventas"
          accent="gold"
          onClick={() => irA("auditorias")}
        />
      </section>

      <section style={styles.summaryCard}>
        <div style={styles.summaryHeader}>
          <div>
            <p style={styles.eyebrow}>
              EVOLUCIÓN
            </p>

            <h2 style={{ margin: 0 }}>
              Tu seguimiento
            </h2>
          </div>

          <span style={styles.statusPill}>
            {reporte?.estado_objetivo ||
              "En seguimiento"}
          </span>
        </div>

        <div style={styles.progressArea}>
          <div style={styles.progressLabels}>
            <span>
              Progreso hacia el objetivo
            </span>

            <strong>
              {porcentajeObjetivo !== null
                ? `${porcentajeObjetivo}%`
                : "-"}
            </strong>
          </div>

          <ProgressBar
            value={porcentajeObjetivo || 0}
          />
        </div>

        <div style={styles.quickGrid}>
          <MiniMetric
            title="Objetivo"
            value={
              reporte?.objetivo_calidad || "-"
            }
          />

          <MiniMetric
            title="Cuánto falta"
            value={
              faltanteObjetivo !== null
                ? `${faltanteObjetivo} puntos`
                : "-"
            }
          />

          <MiniMetric
            title="Comparativo"
            value={
              diferenciaCalidad === null
                ? "-"
                : diferenciaCalidad > 0
                ? `+${diferenciaCalidad}`
                : diferenciaCalidad
            }
            positive={diferenciaCalidad > 0}
          />

          <MiniMetric
            title="Producto"
            value={reporte?.producto || "-"}
          />
        </div>
      </section>

      {!reporteAnterior && (
        <section style={styles.noticeCard}>
          <div style={styles.noticeIcon}>i</div>

          <div>
            <strong>
              Primer reporte disponible
            </strong>

            <p style={styles.noticeText}>
              Todavía no hay una semana anterior
              para comparar.
            </p>
          </div>
        </section>
      )}
    </>
  );
}

function Calidad({
  reporte,
  porcentajeObjetivo,
  faltanteObjetivo,
  diferenciaCalidad,
  reporteAnterior,
}) {
  return (
    <>
      <SectionHeading
        number="01"
        title="CALIDAD"
        description="Resultado, evolución y principales puntos de trabajo."
      />

      <section style={styles.qualityHero}>
        <div>
          <p style={styles.eyebrowLight}>
            NOTA DE CALIDAD
          </p>

          <div style={styles.qualityScore}>
            {reporte?.nota || "-"}
            <span>/ 100</span>
          </div>

          <div style={styles.qualityState}>
            <StatusBadge
              estado={
                reporte?.estado_objetivo ||
                "En seguimiento"
              }
              light
            />
          </div>
        </div>

        <div style={styles.qualityObjective}>
          <span>OBJETIVO</span>

          <strong>
            {reporte?.objetivo_calidad || "-"}
          </strong>

          <small>
            {faltanteObjetivo !== null
              ? `Faltan ${faltanteObjetivo} puntos`
              : "Sin objetivo cargado"}
          </small>
        </div>
      </section>

      <section style={styles.card}>
        <div style={styles.progressLabels}>
          <span>Progreso hacia el objetivo</span>

          <strong>
            {porcentajeObjetivo !== null
              ? `${porcentajeObjetivo}%`
              : "-"}
          </strong>
        </div>

        <ProgressBar
          value={porcentajeObjetivo || 0}
        />

        <div style={styles.progressFooter}>
          <span>
            Actual: {reporte?.nota || "-"}
          </span>

          <span>
            Objetivo:{" "}
            {reporte?.objetivo_calidad || "-"}
          </span>
        </div>
      </section>

      <section style={styles.twoColumns}>
        <InfoSection
          title="Desvío principal"
          accent="warning"
        >
          {reporte?.desvio ||
            "No hay desvíos cargados."}
        </InfoSection>

        <InfoSection
          title="Cuánto falta para alcanzar el objetivo"
          accent="petrol"
        >
          {faltanteObjetivo !== null
            ? `${faltanteObjetivo} puntos`
            : "No disponible"}
        </InfoSection>
      </section>

      <section style={styles.card}>
        <SectionTitle title="Comparativo semanal" />

        <Comparison
          actual={reporte?.nota}
          anterior={reporteAnterior?.nota}
          actualLabel={reporte?.semana}
          anteriorLabel={reporteAnterior?.semana}
        />
      </section>

      <section style={styles.twoColumns}>
        <ListSection
          title="Items trabajados"
          items={reporte?.items_calidad}
          empty="No se registraron items de calidad."
        />

        <ListSection
          title="Acciones realizadas"
          items={reporte?.acciones_calidad}
          empty="No se registraron acciones de calidad."
        />
      </section>

      <section style={styles.card}>
        <SectionTitle title="Auditoría" />

        {reporte?.auditoria ? (
          <div style={styles.auditReference}>
            <span>REFERENCIA</span>
            <strong>{reporte.auditoria}</strong>
          </div>
        ) : (
          <p style={styles.muted}>
            No hay información de auditoría.
          </p>
        )}

        {reporte?.audio_url && (
          <div style={styles.audioBox}>
            <strong>Escuchar llamada auditada</strong>

            <audio
              controls
              src={reporte.audio_url}
              style={{
                width: "100%",
                marginTop: "12px",
              }}
            />
          </div>
        )}
      </section>

      <section style={styles.twoColumns}>
        <InfoSection
          title="Producto"
          accent="petrol"
        >
          {reporte?.producto || "-"}
        </InfoSection>

        <InfoSection
          title="Observaciones"
          accent="blue"
        >
          {reporte?.observaciones ||
            "No hay observaciones cargadas."}
        </InfoSection>
      </section>
    </>
  );
}

function Productividad({ reporte, reporteAnterior }) {
  const sphActual = obtenerNumero(reporte?.sph);
  const sphAnterior = obtenerNumero(
    reporteAnterior?.sph
  );

  const ventasActual = obtenerNumero(
    reporte?.ventas
  );
  const ventasAnterior = obtenerNumero(
    reporteAnterior?.ventas
  );

  return (
    <>
      <SectionHeading
        number="02"
        title="PRODUCTIVIDAD"
        description="Seguimiento de productividad, objetivos y acciones."
      />

      <section style={styles.productivityHero}>
        <div style={styles.productivityMain}>
          <span>SPH</span>
          <strong>{reporte?.sph || "-"}</strong>
          <small>
            Objetivo SPH:{" "}
            {reporte?.objetivo_sph || "-"}
          </small>
        </div>

        <div style={styles.productivityDivider} />

        <div style={styles.productivityMain}>
          <span>VENTAS</span>
          <strong>{reporte?.ventas || "-"}</strong>
          <small>
            Objetivo ventas:{" "}
            {reporte?.objetivo_ventas || "-"}
          </small>
        </div>
      </section>

      <section style={styles.threeColumns}>
        <MetricCard
          title="SPH"
          value={reporte?.sph || "-"}
          extra={`Objetivo: ${
            reporte?.objetivo_sph || "-"
          }`}
        />

        <MetricCard
          title="Ventas"
          value={reporte?.ventas || "-"}
          extra={`Objetivo: ${
            reporte?.objetivo_ventas || "-"
          }`}
        />

        <MetricCard
          title="Objetivo de campaña"
          value={reporte?.objetivo_campania || "-"}
          extra={
            reporte?.estado_campania ||
            "Sin estado"
          }
        />
      </section>

      <section style={styles.card}>
        <div style={styles.sectionTop}>
          <div>
            <p style={styles.eyebrow}>
              ESTADO
            </p>

            <h2 style={{ margin: 0 }}>
              {reporte?.estado_campania ||
                "En proceso"}
            </h2>
          </div>

          <StatusBadge
            estado={
              reporte?.estado_campania ||
              "En proceso"
            }
          />
        </div>
      </section>

      <section style={styles.card}>
        <SectionTitle title="Comparativo semanal" />

        <div style={styles.comparisonGrid}>
          <ComparisonMetric
            title="SPH"
            actual={sphActual}
            anterior={sphAnterior}
            suffix=""
          />

          <ComparisonMetric
            title="Ventas"
            actual={ventasActual}
            anterior={ventasAnterior}
            suffix=""
          />
        </div>
      </section>

      <section style={styles.twoColumns}>
        <ListSection
          title="Items trabajados"
          items={reporte?.items_productividad}
          empty="No se registraron items."
        />

        <ListSection
          title="Acciones realizadas"
          items={reporte?.acciones_productividad}
          empty="No se registraron acciones."
        />
      </section>

      <InfoSection
        title="Observaciones"
        accent="blue"
      >
        {reporte?.observaciones_productividad ||
          "No hay observaciones cargadas."}
      </InfoSection>
    </>
  );
}

function Tipificaciones({ reporte }) {
  return (
    <>
      <SectionHeading
        number="03"
        title="TIPIFICACIONES"
        description="Seguimiento de tipificaciones y compromiso."
      />

      <section style={styles.tipHero}>
        <div>
          <p style={styles.eyebrowLight}>
            ESTADO
          </p>

          <h2 style={styles.tipHeroTitle}>
            {reporte?.estado_tipificaciones ||
              "En proceso"}
          </h2>
        </div>

        <div style={styles.indicatorCircle}>
          <span>03</span>
        </div>
      </section>

      <section style={styles.fourColumns}>
        <MetricCard
          title="Desvío"
          value={
            reporte?.tipificacion_desvio || "-"
          }
        />

        <MetricCard
          title="Objetivo"
          value={
            reporte?.tipificacion_objetivo || "-"
          }
        />

        <MetricCard
          title="Resultado"
          value={
            reporte?.tipificacion_resultado || "-"
          }
        />

        <MetricCard
          title="Estado"
          value={
            reporte?.estado_tipificaciones ||
            "-"
          }
        />
      </section>

      <section style={styles.card}>
        <SectionTitle title="Tipificaciones" />

        <ArrayList
          items={reporte?.tipificaciones}
          empty="No se registraron tipificaciones."
        />
      </section>

      <section style={styles.twoColumns}>
        <InfoSection
          title="Compromiso"
          accent="teal"
        >
          {reporte?.tipificacion_compromiso ||
            "Sin compromiso cargado."}
        </InfoSection>

        <InfoSection
          title="Observaciones"
          accent="blue"
        >
          {reporte?.tipificacion_observaciones ||
            "Sin observaciones cargadas."}
        </InfoSection>
      </section>
    </>
  );
}

function AuditoriasNoVentas({ reporte }) {
  return (
    <>
      <SectionHeading
        number="04"
        title="AUDITORÍAS DE NO VENTAS"
        description="Análisis de oportunidades y seguimiento."
      />

      <section style={styles.auditHero}>
        <div>
          <p style={styles.eyebrowLight}>
            CANTIDAD
          </p>

          <strong style={styles.auditNumber}>
            {reporte?.auditorias_no_ventas || "-"}
          </strong>

          <span style={styles.auditLabel}>
            auditorías
          </span>
        </div>

        <div style={styles.auditStatus}>
          <span>REGISTRO EN SISTEMA</span>

          <strong>
            {reporte?.registro_sistema || "-"}
          </strong>
        </div>
      </section>

      <section style={styles.card}>
        <SectionTitle title="Principales O.M." />

        <ArrayList
          items={reporte?.principales_om}
          empty="No se registraron oportunidades de mejora."
        />
      </section>

      <section style={styles.threeColumns}>
        <MetricCard
          title="Coaching"
          value={reporte?.coaching || "-"}
        />

        <MetricCard
          title="Registro en sistema"
          value={reporte?.registro_sistema || "-"}
        />

        <MetricCard
          title="Compromiso"
          value={
            reporte?.compromiso_no_ventas || "-"
          }
        />
      </section>

      <section style={styles.card}>
        <SectionTitle title="Fortalezas" />

        <ArrayList
          items={reporte?.fortalezas}
          empty="No se registraron fortalezas."
        />
      </section>

      <InfoSection
        title="Observaciones"
        accent="blue"
      >
        {reporte?.observaciones_no_ventas ||
          "No hay observaciones cargadas."}
      </InfoSection>
    </>
  );
}

function Historico({
  reportes,
  seleccionarReporte,
  reporteSeleccionado,
}) {
  return (
    <>
      <SectionHeading
        number="05"
        title="HISTÓRICO"
        description="Tu evolución semana a semana."
      />

      <section style={styles.card}>
        <div style={styles.historyIntro}>
          <div>
            <p style={styles.eyebrow}>
              EVOLUCIÓN
            </p>

            <h2 style={{ margin: 0 }}>
              Historial de reportes
            </h2>

            <p style={styles.muted}>
              Seleccioná una semana para consultar
              su información.
            </p>
          </div>
        </div>

        {reportes.length === 0 ? (
          <p style={styles.muted}>
            No hay reportes anteriores.
          </p>
        ) : (
          <div style={styles.historyList}>
            {reportes.map((reporte, index) => {
              const seleccionado =
                reporteSeleccionado?.id ===
                reporte.id;

              const anterior =
                reportes[index + 1];

              const actualNota =
                obtenerNumero(reporte.nota);

              const anteriorNota =
                obtenerNumero(anterior?.nota);

              let variacion = null;

              if (
                actualNota !== null &&
                anteriorNota !== null
              ) {
                variacion =
                  actualNota - anteriorNota;
              }

              return (
                <button
                  key={reporte.id}
                  onClick={() =>
                    seleccionarReporte(reporte)
                  }
                  style={{
                    ...styles.historyRow,
                    ...(seleccionado
                      ? styles.historyRowActive
                      : {}),
                  }}
                >
                  <div style={styles.historyWeek}>
                    <span>
                      {reporte.semana || "-"}
                    </span>

                    <small>
                      {reporte.producto || "-"}
                    </small>
                  </div>

                  <div style={styles.historyScore}>
                    <strong>
                      {reporte.nota || "-"}
                    </strong>

                    <small>CALIDAD</small>
                  </div>

                  <div>
                    <span style={styles.historyState}>
                      {reporte.estado_objetivo ||
                        "Sin estado"}
                    </span>
                  </div>

                  <div
                    style={{
                      ...styles.variation,
                      color:
                        variacion === null
                          ? "#667085"
                          : variacion >= 0
                          ? "#087f5b"
                          : "#b54708",
                    }}
                  >
                    {variacion === null
                      ? "-"
                      : variacion > 0
                      ? `+${variacion}`
                      : variacion}
                  </div>

                  <div style={styles.arrow}>
                    →
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {reporteSeleccionado && (
        <section style={styles.card}>
          <div style={styles.sectionTop}>
            <div>
              <p style={styles.eyebrow}>
                REPORTE SELECCIONADO
              </p>

              <h2 style={{ margin: 0 }}>
                {reporteSeleccionado.semana}
              </h2>
            </div>

            <button
              onClick={() =>
                seleccionarReporte(null)
              }
              style={styles.closeButton}
            >
              Cerrar
            </button>
          </div>

          <div style={styles.threeColumns}>
            <MetricCard
              title="Calidad"
              value={
                reporteSeleccionado.nota || "-"
              }
            />

            <MetricCard
              title="Producto"
              value={
                reporteSeleccionado.producto || "-"
              }
            />

            <MetricCard
              title="Estado"
              value={
                reporteSeleccionado.estado_objetivo ||
                "-"
              }
            />
          </div>

          <div style={styles.twoColumns}>
            <InfoSection
              title="Desvío principal"
              accent="warning"
            >
              {reporteSeleccionado.desvio ||
                "Sin desvío cargado."}
            </InfoSection>

            <InfoSection
              title="Objetivo"
              accent="petrol"
            >
              {reporteSeleccionado.objetivo ||
                reporteSeleccionado.objetivo_calidad ||
                "Sin objetivo cargado."}
            </InfoSection>
          </div>
        </section>
      )}
    </>
  );
}

function Actividades() {
  return (
    <>
      <SectionHeading
        number="06"
        title="ACTIVIDADES"
        description="Próximamente vas a encontrar tus actividades de seguimiento acá."
      />

      <section style={styles.activitiesEmpty}>
        <div style={styles.activitiesIcon}>
          +
        </div>

        <h2>
          Actividades
        </h2>

        <p style={styles.muted}>
          Esta sección está preparada para
          incorporar nuevas actividades.
        </p>
      </section>
    </>
  );
}

function Feedback() {
  const [texto, setTexto] = useState("");
  const [enviado, setEnviado] = useState(false);

  function enviarFeedback(e) {
    e.preventDefault();

    if (!texto.trim()) return;

    setEnviado(true);
    setTexto("");
  }

  return (
    <>
      <SectionHeading
        number="07"
        title="FEEDBACK DEL ASESOR"
        description="Tu opinión también forma parte del seguimiento."
      />

      <section style={styles.feedbackCard}>
        <div style={styles.feedbackTop}>
          <div style={styles.feedbackIcon}>
            💬
          </div>

          <div>
            <h2 style={{ margin: 0 }}>
              Queremos escucharte
            </h2>

            <p style={styles.muted}>
              ¿Querés dejar algún comentario sobre
              tu reporte, una consulta o algo que
              quieras trabajar con Calidad?
            </p>
          </div>
        </div>

        {enviado ? (
          <div style={styles.feedbackSuccess}>
            <strong>
              ✓ Feedback enviado
            </strong>

            <p>
              Gracias por compartirlo. Calidad
              podrá tenerlo en cuenta para el
              seguimiento.
            </p>

            <button
              onClick={() => setEnviado(false)}
              style={styles.secondaryButton}
            >
              Dejar otro comentario
            </button>
          </div>
        ) : (
          <form onSubmit={enviarFeedback}>
            <textarea
              value={texto}
              onChange={(e) =>
                setTexto(e.target.value)
              }
              placeholder="Escribí acá tu comentario..."
              style={styles.feedbackTextarea}
            />

            <button
              type="submit"
              style={{
                ...styles.primaryButton,
                maxWidth: "220px",
              }}
              disabled={!texto.trim()}
            >
              ENVIAR FEEDBACK
            </button>
          </form>
        )}
      </section>
    </>
  );
}

function SectionHeading({
  number,
  title,
  description,
}) {
  return (
    <div style={styles.sectionHeading}>
      <div style={styles.sectionNumber}>
        {number}
      </div>

      <div>
        <h2 style={styles.sectionHeadingTitle}>
          {title}
        </h2>

        <p style={styles.sectionHeadingDescription}>
          {description}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div style={styles.sectionTitle}>
      <span />
      <h2>{title}</h2>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.tab,
        ...(active ? styles.tabActive : {}),
      }}
    >
      <span style={styles.tabIcon}>
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}

function OverviewCard({
  number,
  title,
  value,
  subtitle,
  accent,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.overviewCard,
        borderTop:
          accent === "petrol"
            ? "4px solid #0f5960"
            : accent === "blue"
            ? "4px solid #287b91"
            : accent === "teal"
            ? "4px solid #159a91"
            : "4px solid #d99b28",
      }}
    >
      <div style={styles.overviewTop}>
        <span style={styles.overviewNumber}>
          {number}
        </span>

        <span style={styles.overviewArrow}>
          →
        </span>
      </div>

      <div style={styles.overviewTitle}>
        {title}
      </div>

      <div style={styles.overviewValue}>
        {value}
      </div>

      {subtitle && (
        <div style={styles.overviewSubtitle}>
          {subtitle}
        </div>
      )}
    </button>
  );
}

function MetricCard({ title, value, extra }) {
  return (
    <div style={styles.metricCard}>
      <span>{title}</span>

      <strong>{value}</strong>

      {extra && <small>{extra}</small>}
    </div>
  );
}

function MiniMetric({
  title,
  value,
  positive,
}) {
  return (
    <div style={styles.miniMetric}>
      <span>{title}</span>

      <strong
        style={{
          color: positive
            ? "#087f5b"
            : "#173f46",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function InfoSection({
  title,
  children,
  accent,
}) {
  const accentColor =
    accent === "warning"
      ? "#d99b28"
      : accent === "teal"
      ? "#159a91"
      : accent === "blue"
      ? "#287b91"
      : "#0f5960";

  return (
    <section
      style={{
        ...styles.card,
        borderLeft: `4px solid ${accentColor}`,
      }}
    >
      <SectionTitle title={title} />
      <div style={styles.infoText}>
        {children}
      </div>
    </section>
  );
}

function ListSection({
  title,
  items,
  empty,
}) {
  return (
    <section style={styles.card}>
      <SectionTitle title={title} />

      <ArrayList
        items={items}
        empty={empty}
      />
    </section>
  );
}

function Comparison({
  actual,
  anterior,
  actualLabel,
  anteriorLabel,
}) {
  const actualNumber = obtenerNumero(actual);
  const anteriorNumber = obtenerNumero(anterior);

  if (
    actualNumber === null ||
    anteriorNumber === null
  ) {
    return (
      <div style={styles.noComparison}>
        Todavía no hay una semana anterior para
        comparar.
      </div>
    );
  }

  const diferencia =
    actualNumber - anteriorNumber;

  return (
    <div style={styles.comparisonBox}>
      <div>
        <span>
          {anteriorLabel || "Semana anterior"}
        </span>

        <strong>{anterior}</strong>
      </div>

      <div style={styles.comparisonArrow}>
        →
      </div>

      <div>
        <span>
          {actualLabel || "Semana actual"}
        </span>

        <strong>{actual}</strong>
      </div>

      <div
        style={{
          ...styles.comparisonResult,
          color:
            diferencia >= 0
              ? "#087f5b"
              : "#b54708",
        }}
      >
        {diferencia > 0
          ? `+${diferencia}`
          : diferencia}
      </div>
    </div>
  );
}

function ComparisonMetric({
  title,
  actual,
  anterior,
  suffix,
}) {
  if (actual === null || anterior === null) {
    return (
      <div style={styles.comparisonMetric}>
        <span>{title}</span>
        <strong>-</strong>
        <small>
          Sin semana anterior
        </small>
      </div>
    );
  }

  const diferencia = actual - anterior;

  return (
    <div style={styles.comparisonMetric}>
      <span>{title}</span>

      <strong>
        {actual}
        {suffix}
      </strong>

      <small
        style={{
          color:
            diferencia >= 0
              ? "#087f5b"
              : "#b54708",
        }}
      >
        {diferencia > 0
          ? `+${diferencia}`
          : diferencia}
        {" "}vs. semana anterior
      </small>
    </div>
  );
}

function ProgressBar({ value }) {
  const porcentaje = Math.max(
    0,
    Math.min(100, Number(value) || 0)
  );

  return (
    <div style={styles.progressTrack}>
      <div
        style={{
          ...styles.progressFill,
          width: `${porcentaje}%`,
        }}
      />
    </div>
  );
}

function StatusBadge({ estado, light }) {
  return (
    <span
      style={{
        ...styles.statusBadge,
        ...(light
          ? styles.statusBadgeLight
          : {}),
      }}
    >
      {estado}
    </span>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "input",
  options = [],
  required = false,
}) {
  return (
    <div>
      <label style={styles.label}>
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.textarea}
          required={required}
        />
      ) : type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={styles.input}
          required={required}
        >
          <option value="">
            Seleccioná un asesor
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.input}
          required={required}
        />
      )}
    </div>
  );
}

function ArrayList({ items, empty }) {
  let lista = [];

  if (Array.isArray(items)) {
    lista = items;
  } else if (typeof items === "string") {
    try {
      const convertido = JSON.parse(items);

      if (Array.isArray(convertido)) {
        lista = convertido;
      } else {
        lista = items
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    } catch {
      lista = items
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  if (lista.length === 0) {
    return (
      <p style={styles.muted}>
        {empty}
      </p>
    );
  }

  return (
    <ul style={styles.list}>
      {lista.map((item, index) => (
        <li
          key={index}
          style={styles.listItem}
        >
          <span style={styles.listDot} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function convertirLista(valor) {
  return String(valor || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function obtenerNumero(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return null;
  }

  const numero = Number(
    String(valor)
      .replace("%", "")
      .replace(",", ".")
      .trim()
  );

  return Number.isFinite(numero)
    ? numero
    : null;
}

function calcularProgreso(nota, objetivo) {
  const n = obtenerNumero(nota);
  const o = obtenerNumero(objetivo);

  if (n === null || o === null || o === 0) {
    return null;
  }

  return Math.round((n / o) * 100);
}

function obtenerNombre(nombreCompleto) {
  if (!nombreCompleto) return "";

  const partes = nombreCompleto.split(",");

  if (partes.length > 1) {
    return partes[1].trim();
  }

  return nombreCompleto;
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #edf5f5 0%, #f5f8f8 50%, #eaf2f3 100%)",
    color: "#173f46",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  centerBox: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  loadingCard: {
    width: "100%",
    maxWidth: "390px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(15, 89, 96, 0.12)",
    border: "1px solid #dce9eb",
  },

  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  loginCard: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    padding: "42px",
    borderRadius: "25px",
    boxShadow:
      "0 25px 70px rgba(15, 89, 96, 0.14)",
    border: "1px solid #dce9eb",
  },

  logo: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #0f5960, #159a91)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "22px",
    boxShadow:
      "0 10px 25px rgba(15, 89, 96, 0.22)",
  },

  loginEyebrow: {
    color: "#0f5960",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.3px",
    marginBottom: "8px",
  },

  loginTitle: {
    margin: 0,
    fontSize: "32px",
    color: "#173f46",
  },

  container: {
    width: "100%",
    maxWidth: "1220px",
    margin: "0 auto",
    padding: "30px 20px 70px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  headerTitle: {
    margin: "9px 0 0",
    fontSize: "31px",
    color: "#173f46",
    letterSpacing: "-0.5px",
  },

  headerPeriod: {
    margin: "7px 0 0",
    color: "#5e7479",
    fontWeight: "600",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  portalBadge: {
    display: "inline-block",
    background: "#0f5960",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "27px",
    marginBottom: "20px",
    border: "1px solid #dce9eb",
    boxShadow:
      "0 9px 30px rgba(15, 89, 96, 0.06)",
    boxSizing: "border-box",
  },

  adminHero: {
    background:
      "linear-gradient(135deg, #0f5960 0%, #287b91 100%)",
    color: "#ffffff",
    borderRadius: "23px",
    padding: "34px",
    marginBottom: "20px",
    boxShadow:
      "0 15px 40px rgba(15, 89, 96, 0.18)",
  },

  welcomeCard: {
    background:
      "linear-gradient(135deg, #0f5960 0%, #287b91 100%)",
    color: "#ffffff",
    borderRadius: "25px",
    padding: "35px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    boxShadow:
      "0 17px 45px rgba(15, 89, 96, 0.20)",
    boxSizing: "border-box",
  },

  welcomeTitle: {
    margin: "0 0 8px",
    fontSize: "30px",
  },

  welcomeText: {
    margin: 0,
    maxWidth: "600px",
    lineHeight: 1.6,
    opacity: 0.88,
  },

  scoreLarge: {
    width: "116px",
    height: "116px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#ffffff",
    color: "#0f5960",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "29px",
    fontWeight: "900",
    boxShadow:
      "0 12px 30px rgba(0, 0, 0, 0.16)",
  },

  heroSmall: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    opacity: 0.82,
  },

  heroSmallDark: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    opacity: 0.75,
  },

  heroTitle: {
    margin: "0 0 8px",
    fontSize: "29px",
  },

  heroText: {
    margin: 0,
    opacity: 0.88,
    lineHeight: 1.5,
  },

  muted: {
    color: "#657b80",
    lineHeight: 1.6,
  },

  label: {
    display: "block",
    fontWeight: "800",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#34545a",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #cddde0",
    background: "#ffffff",
    color: "#173f46",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "105px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #cddde0",
    background: "#ffffff",
    color: "#173f46",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "11px",
    padding: "14px 18px",
    background:
      "linear-gradient(135deg, #0f5960, #159a91)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "22px",
    letterSpacing: "0.3px",
    boxShadow:
      "0 8px 20px rgba(15, 89, 96, 0.18)",
  },

  secondaryButton: {
    border: "1px solid #c9dadd",
    borderRadius: "11px",
    padding: "11px 17px",
    background: "#ffffff",
    color: "#31545a",
    fontWeight: "800",
    cursor: "pointer",
  },

  error: {
    background: "#fff4f1",
    color: "#b54708",
    border: "1px solid #f3d1c2",
    padding: "12px",
    borderRadius: "10px",
    margin: "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#edf9f5",
    color: "#087f5b",
    border: "1px solid #b9e5d5",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "800",
  },

  tabs: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    padding: "7px",
    background: "#ffffff",
    border: "1px solid #dce9eb",
    borderRadius: "17px",
    marginBottom: "22px",
    boxShadow:
      "0 8px 25px rgba(15, 89, 96, 0.05)",
  },

  tab: {
    flex: "0 0 auto",
    border: "none",
    background: "transparent",
    color: "#587176",
    padding: "11px 14px",
    borderRadius: "11px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    whiteSpace: "nowrap",
  },

  tabActive: {
    background: "#0f5960",
    color: "#ffffff",
    boxShadow:
      "0 6px 15px rgba(15, 89, 96, 0.18)",
  },

  tabIcon: {
    fontSize: "11px",
    fontWeight: "900",
  },

  overviewGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },

  overviewCard: {
    textAlign: "left",
    border: "1px solid #dce9eb",
    borderRadius: "18px",
    background: "#ffffff",
    padding: "21px",
    cursor: "pointer",
    boxShadow:
      "0 8px 25px rgba(15, 89, 96, 0.05)",
    color: "#173f46",
    minHeight: "155px",
  },

  overviewTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  overviewNumber: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#7a9297",
  },

  overviewArrow: {
    color: "#0f5960",
    fontWeight: "900",
    fontSize: "18px",
  },

  overviewTitle: {
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.8px",
    color: "#5d767b",
  },

  overviewValue: {
    marginTop: "9px",
    fontSize: "26px",
    fontWeight: "900",
    color: "#173f46",
  },

  overviewSubtitle: {
    marginTop: "4px",
    fontSize: "12px",
    color: "#72878b",
  },

  summaryCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "20px",
    border: "1px solid #dce9eb",
    boxShadow:
      "0 9px 30px rgba(15, 89, 96, 0.06)",
  },

  summaryHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "26px",
  },

  eyebrow: {
    margin: "0 0 6px",
    color: "#6d858a",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.2px",
  },

  statusPill: {
    background: "#e7f4f2",
    color: "#0f5960",
    border: "1px solid #c6e4e0",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
  },

  progressArea: {
    marginBottom: "25px",
  },

  progressLabels: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    fontSize: "13px",
    color: "#5e7479",
    fontWeight: "700",
    marginBottom: "10px",
  },

  progressTrack: {
    width: "100%",
    height: "12px",
    background: "#e2ecee",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, #0f5960, #159a91)",
    transition: "width 0.3s ease",
  },

  progressFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    fontSize: "11px",
    color: "#7a8f94",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
  },

  miniMetric: {
    background: "#f5f9f9",
    border: "1px solid #e1ecee",
    borderRadius: "13px",
    padding: "15px",
  },

  miniMetric: {
    background: "#f5f9f9",
    border: "1px solid #e1ecee",
    borderRadius: "13px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  noticeCard: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    background: "#fffdf6",
    border: "1px solid #eedda9",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "20px",
  },

  noticeIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#f1d98b",
    color: "#735400",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  noticeText: {
    margin: "5px 0 0",
    color: "#776b48",
  },

  sectionHeading: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  sectionNumber: {
    width: "45px",
    height: "45px",
    borderRadius: "13px",
    background: "#0f5960",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "12px",
    boxShadow:
      "0 7px 18px rgba(15, 89, 96, 0.16)",
  },

  sectionHeadingTitle: {
    margin: 0,
    fontSize: "25px",
    color: "#173f46",
    letterSpacing: "-0.3px",
  },

  sectionHeadingDescription: {
    margin: "4px 0 0",
    color: "#6d858a",
    fontSize: "13px",
  },

  qualityHero: {
    background:
      "linear-gradient(135deg, #173f46 0%, #0f5960 100%)",
    color: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
  },

  eyebrowLight: {
    margin: "0 0 7px",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.1px",
    opacity: 0.75,
  },

  qualityScore: {
    fontSize: "48px",
    fontWeight: "900",
    lineHeight: 1,
  },

  qualityScoreSpan: {
    fontSize: "17px",
    fontWeight: "700",
    opacity: 0.75,
  },

  qualityState: {
    marginTop: "15px",
  },

  qualityObjective: {
    minWidth: "190px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  qualityObjective: {
    minWidth: "190px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  qualityObjectiveSpan: {
    fontSize: "11px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "20px",
  },

  threeColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },

  fourColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },

  metricCard: {
    background: "#ffffff",
    border: "1px solid #dce9eb",
    borderRadius: "17px",
    padding: "19px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    boxShadow:
      "0 7px 22px rgba(15, 89, 96, 0.04)",
  },

  metricCardSpan: {
    color: "#6d858a",
    fontSize: "12px",
    fontWeight: "800",
  },

  metricCardStrong: {
    color: "#173f46",
    fontSize: "25px",
    fontWeight: "900",
  },

  metricCardSmall: {
    color: "#7b8f94",
    fontSize: "11px",
  },

  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginBottom: "20px",
  },

  sectionTitleSpan: {
    width: "7px",
    height: "27px",
    background: "#159a91",
    borderRadius: "5px",
  },

  sectionTitleH2: {
    margin: 0,
    fontSize: "18px",
    color: "#173f46",
  },

  infoText: {
    color: "#38585e",
    lineHeight: 1.65,
    whiteSpace: "pre-wrap",
  },

  warning: {
    background: "#fff9eb",
    border: "1px solid #efdca8",
    borderRadius: "13px",
    padding: "18px",
  },

  comparisonBox: {
    display: "grid",
    gridTemplateColumns:
      "1fr auto 1fr auto",
    alignItems: "center",
    gap: "18px",
    background: "#f5f9f9",
    border: "1px solid #e1ecee",
    borderRadius: "15px",
    padding: "20px",
  },

  comparisonBoxDiv: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  comparisonArrow: {
    color: "#0f5960",
    fontSize: "23px",
    fontWeight: "900",
  },

  comparisonResult: {
    fontSize: "22px",
    fontWeight: "900",
  },

  noComparison: {
    padding: "20px",
    background: "#f6f9f9",
    borderRadius: "13px",
    color: "#71858a",
  },

  list: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    lineHeight: 1.5,
    color: "#38585e",
  },

  listDot: {
    width: "7px",
    height: "7px",
    marginTop: "7px",
    borderRadius: "50%",
    background: "#159a91",
    flexShrink: 0,
  },

  auditReference: {
    background: "#f5f9f9",
    border: "1px solid #e1ecee",
    borderRadius: "13px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  audioBox: {
    background: "#f5f9f9",
    borderRadius: "13px",
    padding: "17px",
    marginTop: "16px",
  },

  productivityHero: {
    background:
      "linear-gradient(135deg, #287b91 0%, #159a91 100%)",
    color: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    gap: "30px",
  },

  productivityMain: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },

  productivityDivider: {
    width: "1px",
    height: "80px",
    background: "rgba(255,255,255,0.28)",
  },

  tipHero: {
    background:
      "linear-gradient(135deg, #0f5960, #159a91)",
    color: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tipHeroTitle: {
    margin: 0,
    fontSize: "29px",
  },

  indicatorCircle: {
    width: "76px",
    height: "76px",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#0f5960",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "14px",
  },

  auditHero: {
    background:
      "linear-gradient(135deg, #173f46, #287b91)",
    color: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
  },

  auditNumber: {
    display: "block",
    fontSize: "48px",
    lineHeight: 1,
  },

  auditLabel: {
    display: "block",
    marginTop: "7px",
    opacity: 0.75,
    fontSize: "12px",
  },

  auditStatus: {
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.17)",
    padding: "18px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  historyIntro: {
    marginBottom: "20px",
  },

  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  historyRow: {
    width: "100%",
    border: "1px solid #dce9eb",
    background: "#f8fbfb",
    borderRadius: "14px",
    padding: "15px",
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1.5fr 0.7fr 30px",
    alignItems: "center",
    gap: "15px",
    textAlign: "left",
    cursor: "pointer",
    color: "#173f46",
  },

  historyRowActive: {
    border: "2px solid #159a91",
    background: "#eef8f7",
  },

  historyWeek: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    fontWeight: "800",
  },

  historyScore: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  historyState: {
    display: "inline-block",
    background: "#e7f4f2",
    color: "#0f5960",
    borderRadius: "999px",
    padding: "6px 9px",
    fontSize: "10px",
    fontWeight: "800",
  },

  variation: {
    fontWeight: "900",
    fontSize: "16px",
  },

  arrow: {
    color: "#0f5960",
    fontWeight: "900",
    fontSize: "18px",
  },

  closeButton: {
    border: "1px solid #cddde0",
    background: "#ffffff",
    color: "#49676c",
    borderRadius: "10px",
    padding: "9px 14px",
    fontWeight: "800",
    cursor: "pointer",
  },

  activitiesEmpty: {
    background: "#ffffff",
    border: "1px solid #dce9eb",
    borderRadius: "22px",
    padding: "70px 30px",
    textAlign: "center",
    boxShadow:
      "0 9px 30px rgba(15, 89, 96, 0.05)",
  },

  activitiesIcon: {
    width: "64px",
    height: "64px",
    margin: "0 auto 18px",
    borderRadius: "20px",
    background: "#e7f4f2",
    color: "#0f5960",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "300",
  },

  feedbackCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "32px",
    border: "1px solid #dce9eb",
    boxShadow:
      "0 10px 35px rgba(15, 89, 96, 0.06)",
  },

  feedbackTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: "17px",
    marginBottom: "25px",
  },

  feedbackIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "15px",
    background: "#e7f4f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "180px",
    boxSizing: "border-box",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #cddde0",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    fontSize: "15px",
    color: "#173f46",
    resize: "vertical",
    outline: "none",
  },

  feedbackSuccess: {
    background: "#edf9f5",
    border: "1px solid #b9e5d5",
    borderRadius: "15px",
    padding: "22px",
    color: "#087f5b",
  },

  emptyState: {
    background: "#ffffff",
    border: "1px solid #dce9eb",
    borderRadius: "22px",
    padding: "65px 30px",
    textAlign: "center",
    boxShadow:
      "0 10px 35px rgba(15, 89, 96, 0.06)",
  },

  emptyIcon: {
    width: "62px",
    height: "62px",
    margin: "0 auto 18px",
    borderRadius: "18px",
    background: "#e7f4f2",
    color: "#0f5960",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    fontWeight: "900",
  },

  adminSection: {
    background: "#f5f9f9",
    border: "1px solid #dce9eb",
    borderRadius: "17px",
    padding: "22px",
    marginTop: "24px",
  },

  adminSectionTitle: {
    margin: 0,
    color: "#0f5960",
    fontSize: "19px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "5px 18px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "650px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#edf5f5",
    color: "#34545a",
    borderBottom: "1px solid #dce9eb",
    fontSize: "12px",
  },

  td: {
    padding: "13px",
    borderBottom: "1px solid #e6eff0",
    fontSize: "13px",
  },

  sectionTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  statusBadge: {
    background: "#fff8e7",
    color: "#8a6100",
    border: "1px solid #ecd99e",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "0.3px",
  },

  statusBadgeLight: {
    background: "rgba(255,255,255,0.14)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.25)",
  },
};
