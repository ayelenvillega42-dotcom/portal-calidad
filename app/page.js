"use client";

import { useEffect, useState } from "react";
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
  ["Simonetta, Valentina", "8191", "simonetta.valentina@portalcalidad.com"],
  ["Tello, Marianela", "8042", "tello.marianela@portalcalidad.com"],
  ["Vasquez, Agustin", "8136", "vasquez.agustin@portalcalidad.com"],
  ["Viniegra, Agustín", "8199", "viniegra.agustin@portalcalidad.com"],
];

const tabs = [
  { id: "calidad", number: "01", title: "CALIDAD" },
  { id: "productividad", number: "02", title: "PRODUCTIVIDAD" },
  { id: "tipificaciones", number: "03", title: "TIPIFICACIONES" },
  { id: "auditorias", number: "04", title: "AUDITORÍAS DE NO VENTAS" },
  { id: "actividades", number: "05", title: "ACTIVIDADES" },
  { id: "feedback", number: "06", title: "FEEDBACK" },
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

  const [tabActiva, setTabActiva] = useState("calidad");

  const [feedback, setFeedback] = useState("");
  const [feedbackEnviado, setFeedbackEnviado] = useState(false);

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
    cantidad_no_ventas: "",
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

    const { data, error } = await supabase.auth.signInWithPassword({
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
        ([, , correo]) => correo.toLowerCase() === usuarioEmail
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
      setTabActiva("calidad");

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
    setTabActiva("calidad");
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
      cantidad_no_ventas: "",
      principales_om: "",
      coaching: "",
      registro_sistema: "",
      compromiso_no_ventas: "",
      fortalezas: "",
      observaciones_no_ventas: "",
    });
  }

  function convertirLista(texto) {
    return texto
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function guardarReporte(e) {
    e.preventDefault();

    if (!form.usuario || !form.semana) {
      setMensajeAdmin("Seleccioná un asesor e ingresá la semana.");
      return;
    }

    setGuardando(true);
    setMensajeAdmin("");

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
      items_calidad: convertirLista(form.items_calidad),
      acciones_calidad: convertirLista(form.acciones_calidad),
      auditoria: form.auditoria || null,
      audio_url: form.audio_url || null,
      observaciones: form.observaciones || null,

      sph: form.sph || null,
      objetivo_sph: form.objetivo_sph || null,
      ventas: form.ventas || null,
      objetivo_ventas: form.objetivo_ventas || null,
      objetivo_campania: form.objetivo_campania || null,
      estado_campania: form.estado_campania || null,
      items_productividad: convertirLista(form.items_productividad),
      acciones_productividad: convertirLista(
        form.acciones_productividad
      ),
      observaciones_productividad:
        form.observaciones_productividad || null,

      tipificaciones: convertirLista(form.tipificaciones),
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

      cantidad_no_ventas:
        form.cantidad_no_ventas || null,
      principales_om:
        form.principales_om || null,
      coaching:
        form.coaching || null,
      registro_sistema:
        form.registro_sistema || null,
      compromiso_no_ventas:
        form.compromiso_no_ventas || null,
      fortalezas:
        form.fortalezas || null,
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

  function enviarFeedback() {
    if (!feedback.trim()) return;

    setFeedbackEnviado(true);

    setTimeout(() => {
      setFeedbackEnviado(false);
      setFeedback("");
    }, 4000);
  }

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
          <div style={styles.card}>
            <div style={styles.logoSmall}>✓</div>
            <h2>Portal de Calidad</h2>
            <p style={styles.muted}>Verificando acceso...</p>
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
              Ingresá con tu email y contraseña
            </p>

            {loginError && (
              <div style={styles.error}>{loginError}</div>
            )}

            <form onSubmit={iniciarSesion}>
              <label style={styles.label}>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresá tu email"
                style={styles.input}
                autoComplete="email"
              />

              <label style={styles.label}>Contraseña</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá tu contraseña"
                style={styles.input}
                autoComplete="current-password"
              />

              <button
                type="submit"
                disabled={entrando}
                style={{
                  ...styles.primaryButton,
                  opacity: entrando ? 0.6 : 1,
                }}
              >
                {entrando ? "INGRESANDO..." : "INGRESAR"}
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
              <p style={styles.heroEyebrow}>
                ADMINISTRACIÓN
              </p>

              <h2 style={styles.adminHeroTitle}>
                Cargar nuevo reporte
              </h2>

              <p style={styles.adminHeroText}>
                El reporte quedará disponible automáticamente
                para el asesor seleccionado.
              </p>
            </div>
          </section>

          <section style={styles.card}>
            <form onSubmit={guardarReporte}>
              <h2 style={styles.formTitle}>
                Datos generales
              </h2>

              <div style={styles.formGrid}>
                <Field label="Asesor">
                  <select
                    name="usuario"
                    value={form.usuario}
                    onChange={cambiarFormulario}
                    style={styles.input}
                    required
                  >
                    <option value="">
                      Seleccioná un asesor
                    </option>

                    {asesores.map((asesor) => (
                      <option
                        key={asesor[1]}
                        value={asesor[1]}
                      >
                        {asesor[0]} — {asesor[1]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Semana / período">
                  <input
                    name="semana"
                    value={form.semana}
                    onChange={cambiarFormulario}
                    placeholder="Ej: Semana 3 - Agosto"
                    style={styles.input}
                    required
                  />
                </Field>

                <Field label="Nota de calidad">
                  <input
                    name="nota"
                    value={form.nota}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 50"
                    style={styles.input}
                  />
                </Field>

                <Field label="Objetivo de calidad">
                  <input
                    name="objetivo_calidad"
                    value={form.objetivo_calidad}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 70"
                    style={styles.input}
                  />
                </Field>

                <Field label="Estado">
                  <input
                    name="estado_objetivo"
                    value={form.estado_objetivo}
                    onChange={cambiarFormulario}
                    placeholder="Ej: DEBAJO DEL OBJETIVO"
                    style={styles.input}
                  />
                </Field>

                <Field label="Producto">
                  <input
                    name="producto"
                    value={form.producto}
                    onChange={cambiarFormulario}
                    placeholder="Ej: AP"
                    style={styles.input}
                  />
                </Field>
              </div>

              <AdminSection title="CALIDAD">
                <TextAreaField
                  label="Desvío principal"
                  name="desvio"
                  value={form.desvio}
                  onChange={cambiarFormulario}
                />

                <TextAreaField
                  label="Recomendación"
                  name="recomendacion"
                  value={form.recomendacion}
                  onChange={cambiarFormulario}
                />

                <TextAreaField
                  label="Objetivo de trabajo"
                  name="objetivo"
                  value={form.objetivo}
                  onChange={cambiarFormulario}
                />

                <TextAreaField
                  label="Items trabajados"
                  name="items_calidad"
                  value={form.items_calidad}
                  onChange={cambiarFormulario}
                  placeholder="Un item por línea"
                />

                <TextAreaField
                  label="Acciones realizadas"
                  name="acciones_calidad"
                  value={form.acciones_calidad}
                  onChange={cambiarFormulario}
                  placeholder="Una acción por línea"
                />

                <TextAreaField
                  label="Auditoría"
                  name="auditoria"
                  value={form.auditoria}
                  onChange={cambiarFormulario}
                />

                <TextAreaField
                  label="Observaciones"
                  name="observaciones"
                  value={form.observaciones}
                  onChange={cambiarFormulario}
                />
              </AdminSection>

              <AdminSection title="PRODUCTIVIDAD">
                <div style={styles.formGrid}>
                  <Field label="SPH">
                    <input
                      name="sph"
                      value={form.sph}
                      onChange={cambiarFormulario}
                      placeholder="Ej: 0.15"
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Objetivo SPH">
                    <input
                      name="objetivo_sph"
                      value={form.objetivo_sph}
                      onChange={cambiarFormulario}
                      placeholder="Ej: 0.5"
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Ventas">
                    <input
                      name="ventas"
                      value={form.ventas}
                      onChange={cambiarFormulario}
                      placeholder="Ej: 12"
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Objetivo ventas">
                    <input
                      name="objetivo_ventas"
                      value={form.objetivo_ventas}
                      onChange={cambiarFormulario}
                      placeholder="Ej: 40"
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Objetivo de campaña">
                    <input
                      name="objetivo_campania"
                      value={form.objetivo_campania}
                      onChange={cambiarFormulario}
                      placeholder="Ej: 50"
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Estado campaña">
                    <input
                      name="estado_campania"
                      value={form.estado_campania}
                      onChange={cambiarFormulario}
                      placeholder="Ej: En proceso"
                      style={styles.input}
                    />
                  </Field>
                </div>

                <TextAreaField
                  label="Items trabajados"
                  name="items_productividad"
                  value={form.items_productividad}
                  onChange={cambiarFormulario}
                  placeholder="Un item por línea"
                />

                <TextAreaField
                  label="Acciones realizadas"
                  name="acciones_productividad"
                  value={form.acciones_productividad}
                  onChange={cambiarFormulario}
                  placeholder="Una acción por línea"
                />

                <TextAreaField
                  label="Observaciones"
                  name="observaciones_productividad"
                  value={form.observaciones_productividad}
                  onChange={cambiarFormulario}
                />
              </AdminSection>

              <AdminSection title="TIPIFICACIONES">
                <TextAreaField
                  label="Tipificaciones"
                  name="tipificaciones"
                  value={form.tipificaciones}
                  onChange={cambiarFormulario}
                  placeholder="Una tipificación por línea"
                />

                <div style={styles.formGrid}>
                  <Field label="Objetivo tipificaciones">
                    <input
                      name="objetivo_tipificaciones"
                      value={form.objetivo_tipificaciones}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Estado">
                    <input
                      name="estado_tipificaciones"
                      value={form.estado_tipificaciones}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Desvío">
                    <input
                      name="tipificacion_desvio"
                      value={form.tipificacion_desvio}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Objetivo">
                    <input
                      name="tipificacion_objetivo"
                      value={form.tipificacion_objetivo}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Resultado">
                    <input
                      name="tipificacion_resultado"
                      value={form.tipificacion_resultado}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Compromiso">
                    <input
                      name="tipificacion_compromiso"
                      value={form.tipificacion_compromiso}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </Field>
                </div>

                <TextAreaField
                  label="Observaciones"
                  name="tipificacion_observaciones"
                  value={form.tipificacion_observaciones}
                  onChange={cambiarFormulario}
                />
              </AdminSection>

              <AdminSection title="AUDITORÍAS DE NO VENTAS">
                <div style={styles.formGrid}>
                  <Field label="Cantidad">
                    <input
                      name="cantidad_no_ventas"
                      value={form.cantidad_no_ventas}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Registro en sistema">
                    <input
                      name="registro_sistema"
                      value={form.registro_sistema}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Compromiso">
                    <input
                      name="compromiso_no_ventas"
                      value={form.compromiso_no_ventas}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </Field>
                </div>

                <TextAreaField
                  label="Principales O.M."
                  name="principales_om"
                  value={form.principales_om}
                  onChange={cambiarFormulario}
                />

                <TextAreaField
                  label="Coaching"
                  name="coaching"
                  value={form.coaching}
                  onChange={cambiarFormulario}
                />

                <TextAreaField
                  label="Fortalezas"
                  name="fortalezas"
                  value={form.fortalezas}
                  onChange={cambiarFormulario}
                />

                <TextAreaField
                  label="Observaciones"
                  name="observaciones_no_ventas"
                  value={form.observaciones_no_ventas}
                  onChange={cambiarFormulario}
                />
              </AdminSection>

              <button
                type="submit"
                disabled={guardando}
                style={{
                  ...styles.primaryButton,
                  marginTop: "25px",
                  opacity: guardando ? 0.6 : 1,
                }}
              >
                {guardando
                  ? "GUARDANDO..."
                  : "GUARDAR REPORTE"}
              </button>

              {mensajeAdmin && (
                <div style={styles.success}>
                  {mensajeAdmin}
                </div>
              )}
            </form>
          </section>

          <section style={styles.card}>
            <div style={styles.sectionHeader}>
              <div>
                <div style={styles.eyebrow}>
                  HISTORIAL
                </div>
                <h2 style={{ margin: 0 }}>
                  Reportes cargados
                </h2>
              </div>

              <button
                onClick={() => window.print()}
                style={styles.printButton}
              >
                IMPRIMIR
              </button>
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
                        (item) => item[1] === reporte.usuario
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
    const reporteActual = reportes[0];

    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.advisorHeader}>
            <div>
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.advisorTitle}>
                Hola, {nombreCorto(asesorActual?.[0])}
              </h1>

              <div style={styles.advisorMeta}>
                <span>
                  {reporteActual?.semana || "Sin semana cargada"}
                </span>

                <span style={styles.metaDot}>•</span>

                <span
                  style={styles.headerStatus}
                >
                  {reporteActual?.estado_objetivo ||
                    "EN SEGUIMIENTO"}
                </span>
              </div>
            </div>

            <button
              onClick={cerrarSesion}
              style={styles.secondaryButton}
            >
              Cerrar sesión
            </button>
          </header>

          {cargandoReportes ? (
            <section style={styles.card}>
              <h2>Cargando información...</h2>
            </section>
          ) : reportes.length === 0 ? (
            <section style={styles.emptyCard}>
              <div style={styles.emptyIcon}>✓</div>
              <h2>Todavía no hay reportes</h2>
              <p style={styles.muted}>
                Cuando Calidad cargue tu primer reporte
                semanal, vas a poder verlo desde acá.
              </p>
            </section>
          ) : (
            <>
              <nav style={styles.tabs}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActiva(tab.id)}
                    style={{
                      ...styles.tab,
                      ...(tabActiva === tab.id
                        ? styles.tabActive
                        : {}),
                    }}
                  >
                    <span style={styles.tabNumber}>
                      {tab.number}
                    </span>

                    <span>{tab.title}</span>
                  </button>
                ))}
              </nav>

              {tabActiva === "calidad" && (
                <Calidad
                  reporte={reporteActual}
                  reportes={reportes}
                />
              )}

              {tabActiva === "productividad" && (
                <Productividad
                  reporte={reporteActual}
                  reportes={reportes}
                />
              )}

              {tabActiva === "tipificaciones" && (
                <Tipificaciones reporte={reporteActual} />
              )}

              {tabActiva === "auditorias" && (
                <Auditorias reporte={reporteActual} />
              )}

              {tabActiva === "actividades" && (
                <Actividades />
              )}

              {tabActiva === "feedback" && (
                <Feedback
                  feedback={feedback}
                  setFeedback={setFeedback}
                  enviado={feedbackEnviado}
                  enviar={enviarFeedback}
                />
              )}
            </>
          )}
        </div>
      </main>
    );
  }

  return null;
}

function Calidad({ reporte, reportes }) {
  const nota = numero(reporte?.nota);
  const objetivo = numero(reporte?.objetivo_calidad);

  const falta =
    nota !== null && objetivo !== null
      ? Math.max(objetivo - nota, 0)
      : null;

  const progreso =
    nota !== null && objetivo > 0
      ? Math.min(Math.round((nota / objetivo) * 100), 100)
      : 0;

  const anterior = reportes?.[1];
  const notaAnterior = anterior?.nota;

  return (
    <section>
      <SectionHeader
        number="01"
        title="CALIDAD"
        subtitle="Resultado de tu evaluación semanal"
      />

      <div style={styles.scoreHero}>
        <div>
          <div style={styles.scoreLabel}>
            NOTA DE CALIDAD
          </div>

          <div style={styles.bigScore}>
            {reporte?.nota || "-"}
            <span>/ 100</span>
          </div>

          <div style={styles.scoreStatus}>
            {reporte?.estado_objetivo ||
              "SIN ESTADO"}
          </div>
        </div>

        <div style={styles.progressCircle}>
          <div style={styles.progressCircleNumber}>
            {progreso}%
          </div>

          <div style={styles.progressCircleText}>
            progreso
          </div>
        </div>
      </div>

      <div style={styles.metricGrid}>
        <Metric
          title="OBJETIVO"
          value={reporte?.objetivo_calidad || "-"}
        />

        <Metric
          title="CUÁNTO FALTA"
          value={
            falta !== null
              ? `${falta} puntos`
              : "-"
          }
          accent="orange"
        />

        <Metric
          title="PRODUCTO"
          value={reporte?.producto || "-"}
        />

        <Metric
          title="ESTADO"
          value={
            reporte?.estado_objetivo || "-"
          }
        />
      </div>

      <div style={styles.progressBox}>
        <div style={styles.progressTop}>
          <strong>
            Progreso hacia el objetivo
          </strong>

          <span>{progreso}%</span>
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progreso}%`,
            }}
          />
        </div>
      </div>

      <div style={styles.twoColumns}>
        <InfoCard
          eyebrow="DESVÍO PRINCIPAL"
          title=""
          className="warning"
        >
          {reporte?.desvio ||
            "No hay desvíos cargados."}
        </InfoCard>

        <InfoCard
          eyebrow="COMPARATIVO SEMANAL"
          title=""
        >
          {notaAnterior ? (
            <>
              Semana anterior:{" "}
              <strong>{notaAnterior}</strong>
              <br />
              Semana actual:{" "}
              <strong>{reporte?.nota || "-"}</strong>
            </>
          ) : (
            "Todavía no hay una semana anterior para comparar."
          )}
        </InfoCard>
      </div>

      <div style={styles.card}>
        <SectionMiniTitle title="ITEMS TRABAJADOS" />

        <ArrayList
          items={reporte?.items_calidad}
          empty="No se registraron items."
        />
      </div>

      <div style={styles.card}>
        <SectionMiniTitle title="ACCIONES REALIZADAS" />

        <ArrayList
          items={reporte?.acciones_calidad}
          empty="No se registraron acciones."
        />
      </div>

      <div style={styles.card}>
        <SectionMiniTitle title="AUDITORÍA" />

        {reporte?.auditoria ? (
          <>
            <div style={styles.infoBox}>
              {reporte.auditoria}
            </div>

            {reporte?.audio_url && (
              <div style={styles.audioBox}>
                <audio
                  controls
                  src={reporte.audio_url}
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </>
        ) : (
          <p style={styles.muted}>
            No hay información de auditoría.
          </p>
        )}
      </div>

      <div style={styles.card}>
        <SectionMiniTitle title="OBSERVACIONES" />

        <div style={styles.observationBox}>
          {reporte?.observaciones ||
            "No hay observaciones cargadas."}
        </div>
      </div>
    </section>
  );
}

function Productividad({ reporte, reportes }) {
  const anterior = reportes?.[1];

  return (
    <section>
      <SectionHeader
        number="02"
        title="PRODUCTIVIDAD"
        subtitle="Seguimiento de productividad y campaña"
      />

      <div style={styles.metricGrid}>
        <Metric
          title="SPH"
          value={reporte?.sph || "-"}
          extra={`Objetivo SPH: ${
            reporte?.objetivo_sph || "-"
          }`}
        />

        <Metric
          title="VENTAS"
          value={reporte?.ventas || "-"}
          extra={`Objetivo ventas: ${
            reporte?.objetivo_ventas || "-"
          }`}
        />

        <Metric
          title="OBJETIVO DE CAMPAÑA"
          value={reporte?.objetivo_campania || "-"}
          extra={
            reporte?.estado_campania || ""
          }
        />

        <Metric
          title="ESTADO"
          value={
            reporte?.estado_campania || "-"
          }
        />
      </div>

      <div style={styles.card}>
        <SectionMiniTitle title="COMPARATIVO SEMANAL" />

        {anterior ? (
          <div style={styles.comparisonGrid}>
            <Comparison
              label="SPH"
              previous={anterior.sph}
              current={reporte?.sph}
            />

            <Comparison
              label="VENTAS"
              previous={anterior.ventas}
              current={reporte?.ventas}
            />
          </div>
        ) : (
          <p style={styles.muted}>
            Todavía no hay una semana anterior para comparar.
          </p>
        )}
      </div>

      <div style={styles.card}>
        <SectionMiniTitle title="ITEMS TRABAJADOS" />

        <ArrayList
          items={reporte?.items_productividad}
          empty="No se registraron items."
        />
      </div>

      <div style={styles.card}>
        <SectionMiniTitle title="ACCIONES REALIZADAS" />

        <ArrayList
          items={reporte?.acciones_productividad}
          empty="No se registraron acciones."
        />
      </div>

      <div style={styles.card}>
        <SectionMiniTitle title="OBSERVACIONES" />

        <div style={styles.observationBox}>
          {reporte?.observaciones_productividad ||
            "No hay observaciones cargadas."}
        </div>
      </div>
    </section>
  );
}

function Tipificaciones({ reporte }) {
  return (
    <section>
      <SectionHeader
        number="03"
        title="TIPIFICACIONES"
        subtitle="Seguimiento de tipificaciones"
      />

      <div style={styles.statusHero}>
        <div>
          <div style={styles.statusHeroLabel}>
            ESTADO ACTUAL
          </div>

          <div style={styles.statusHeroTitle}>
            {reporte?.estado_tipificaciones ||
              "Sin estado"}
          </div>
        </div>

        <div style={styles.statusDot}>
          ●
        </div>
      </div>

      <div style={styles.metricGrid}>
        <Metric
          title="DESVÍO"
          value={
            reporte?.tipificacion_desvio || "-"
          }
          accent="orange"
        />

        <Metric
          title="OBJETIVO"
          value={
            reporte?.tipificacion_objetivo || "-"
          }
        />

        <Metric
          title="RESULTADO"
          value={
            reporte?.tipificacion_resultado || "-"
          }
        />

        <Metric
          title="OBJETIVO GENERAL"
          value={
            reporte?.objetivo_tipificaciones || "-"
          }
        />
      </div>

      <div style={styles.card}>
        <SectionMiniTitle title="TIPIFICACIONES" />

        <ArrayList
          items={reporte?.tipificaciones}
          empty="No se registraron tipificaciones."
        />
      </div>

      <div style={styles.twoColumns}>
        <InfoCard eyebrow="COMPROMISO">
          {reporte?.tipificacion_compromiso ||
            "Sin compromiso cargado."}
        </InfoCard>

        <InfoCard eyebrow="OBSERVACIONES">
          {reporte?.tipificacion_observaciones ||
            "Sin observaciones cargadas."}
        </InfoCard>
      </div>
    </section>
  );
}

function Auditorias({ reporte }) {
  return (
    <section>
      <SectionHeader
        number="04"
        title="AUDITORÍAS DE NO VENTAS"
        subtitle="Análisis y seguimiento de oportunidades"
      />

      <div style={styles.metricGrid}>
        <Metric
          title="CANTIDAD"
          value={
            reporte?.cantidad_no_ventas || "-"
          }
        />

        <Metric
          title="REGISTRO EN SISTEMA"
          value={
            reporte?.registro_sistema || "-"
          }
        />

        <Metric
          title="COMPROMISO"
          value={
            reporte?.compromiso_no_ventas || "-"
          }
        />
      </div>

      <div style={styles.card}>
        <SectionMiniTitle title="PRINCIPALES O.M." />

        <div style={styles.infoBox}>
          {reporte?.principales_om ||
            "No hay información cargada."}
        </div>
      </div>

      <div style={styles.twoColumns}>
        <InfoCard eyebrow="COACHING">
          {reporte?.coaching || "-"}
        </InfoCard>

        <InfoCard eyebrow="FORTALEZAS">
          {reporte?.fortalezas || "-"}
        </InfoCard>
      </div>

      <div style={styles.card}>
        <SectionMiniTitle title="OBSERVACIONES" />

        <div style={styles.observationBox}>
          {reporte?.observaciones_no_ventas ||
            "No hay observaciones cargadas."}
        </div>
      </div>
    </section>
  );
}

function Actividades() {
  return (
    <section>
      <SectionHeader
        number="05"
        title="ACTIVIDADES"
        subtitle="Espacio reservado para futuras actividades"
      />

      <div style={styles.emptyActivities}>
        <div style={styles.emptyActivitiesIcon}>
          +
        </div>

        <h2>
          Próximamente
        </h2>

        <p style={styles.muted}>
          Esta sección todavía no tiene actividades
          cargadas.
        </p>
      </div>
    </section>
  );
}

function Feedback({
  feedback,
  setFeedback,
  enviado,
  enviar,
}) {
  return (
    <section>
      <SectionHeader
        number="06"
        title="FEEDBACK DEL ASESOR"
        subtitle="Tu opinión también forma parte del seguimiento"
      />

      <div style={styles.feedbackCard}>
        <div style={styles.feedbackIcon}>
          💬
        </div>

        <h2 style={styles.feedbackTitle}>
          ¿Querés dejar algún comentario?
        </h2>

        <p style={styles.muted}>
          Podés escribir una consulta, comentario
          sobre tu reporte o algo que quieras trabajar
          con Calidad.
        </p>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Escribí tu comentario acá..."
          style={styles.feedbackTextarea}
        />

        <button
          onClick={enviar}
          disabled={!feedback.trim()}
          style={{
            ...styles.primaryButton,
            maxWidth: "220px",
            opacity: !feedback.trim() ? 0.5 : 1,
          }}
        >
          ENVIAR FEEDBACK
        </button>

        {enviado && (
          <div style={styles.feedbackSuccess}>
            ✓ Feedback enviado correctamente.
          </div>
        )}
      </div>
    </section>
  );
}

function SectionHeader({
  number,
  title,
  subtitle,
}) {
  return (
    <div style={styles.sectionHeaderLarge}>
      <div style={styles.sectionNumber}>
        {number}
      </div>

      <div>
        <div style={styles.sectionEyebrow}>
          PORTAL DE CALIDAD
        </div>

        <h2 style={styles.sectionMainTitle}>
          {title}
        </h2>

        <p style={styles.sectionSubtitle}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function SectionMiniTitle({ title }) {
  return (
    <div style={styles.miniTitle}>
      <span />
      {title}
    </div>
  );
}

function InfoCard({
  eyebrow,
  children,
}) {
  return (
    <div style={styles.card}>
      <div style={styles.miniTitle}>
        <span />
        {eyebrow}
      </div>

      <div style={styles.infoBox}>
        {children}
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
  extra,
  accent,
}) {
  return (
    <div
      style={{
        ...styles.metric,
        ...(accent === "orange"
          ? styles.metricOrange
          : {}),
      }}
    >
      <div style={styles.metricTitle}>
        {title}
      </div>

      <div style={styles.metricValue}>
        {value}
      </div>

      {extra && (
        <div style={styles.metricExtra}>
          {extra}
        </div>
      )}
    </div>
  );
}

function Comparison({
  label,
  previous,
  current,
}) {
  return (
    <div style={styles.comparison}>
      <div style={styles.comparisonLabel}>
        {label}
      </div>

      <div>
        Anterior:{" "}
        <strong>{previous || "-"}</strong>
      </div>

      <div>
        Actual:{" "}
        <strong>{current || "-"}</strong>
      </div>
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
        <li key={index} style={styles.listItem}>
          <span style={styles.listBullet}>✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={styles.label}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label style={styles.label}>
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.textarea}
      />
    </div>
  );
}

function AdminSection({ title, children }) {
  return (
    <section style={styles.adminSection}>
      <div style={styles.adminSectionHeader}>
        <span style={styles.adminSectionNumber}>
          #
        </span>

        <h2 style={styles.adminSectionTitle}>
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function nombreCorto(nombreCompleto) {
  if (!nombreCompleto) return "";

  const partes = nombreCompleto.split(",");

  if (partes.length > 1) {
    return partes[1].trim();
  }

  return nombreCompleto;
}

function numero(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const numeroConvertido = parseFloat(
    String(valor).replace(",", ".").replace("%", "")
  );

  return Number.isNaN(numeroConvertido)
    ? null
    : numeroConvertido;
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(145deg, #edf4f4 0%, #f7f9fa 48%, #eaf1f2 100%)",
    color: "#18323a",
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
    borderRadius: "26px",
    boxShadow:
      "0 25px 70px rgba(18, 62, 68, 0.13)",
    border: "1px solid #dce8e9",
  },

  logo: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #0e5661, #1c7480)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "29px",
    fontWeight: "800",
    marginBottom: "20px",
    boxShadow:
      "0 10px 25px rgba(14, 86, 97, 0.25)",
  },

  logoSmall: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#0e5661",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  loginEyebrow: {
    color: "#0e5661",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.4px",
    marginBottom: "8px",
  },

  loginTitle: {
    margin: 0,
    fontSize: "31px",
    color: "#17343b",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "30px 20px 70px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  advisorHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "25px",
    marginBottom: "26px",
    paddingBottom: "24px",
    borderBottom: "2px solid #d3e1e3",
    flexWrap: "wrap",
  },

  portalBadge: {
    display: "inline-block",
    background: "#0e5661",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    boxShadow:
      "0 5px 15px rgba(14, 86, 97, 0.18)",
  },

  headerTitle: {
    margin: "10px 0 0",
    color: "#17343b",
  },

  advisorTitle: {
    margin: "11px 0 8px",
    color: "#17343b",
    fontSize: "34px",
    letterSpacing: "-0.7px",
  },

  advisorMeta: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#60767b",
    fontSize: "14px",
    fontWeight: "700",
  },

  metaDot: {
    color: "#8ca5aa",
  },

  headerStatus: {
    color: "#b06b00",
    background: "#fff5df",
    border: "1px solid #f2d494",
    padding: "6px 11px",
    borderRadius: "999px",
    fontSize: "11px",
    letterSpacing: "0.4px",
  },

  adminHero: {
    background:
      "linear-gradient(135deg, #0d505b 0%, #176b75 55%, #21808a 100%)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "34px",
    marginBottom: "22px",
    boxShadow:
      "0 18px 45px rgba(13, 80, 91, 0.22)",
  },

  heroEyebrow: {
    margin: "0 0 7px",
    fontSize: "11px",
    letterSpacing: "1.4px",
    fontWeight: "800",
    opacity: 0.75,
  },

  adminHeroTitle: {
    margin: 0,
    fontSize: "29px",
  },

  adminHeroText: {
    margin: "9px 0 0",
    opacity: 0.84,
  },

  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "27px",
    marginBottom: "20px",
    border: "1px solid #dce7e9",
    boxShadow:
      "0 10px 35px rgba(22, 62, 68, 0.065)",
  },

  emptyCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "55px 30px",
    textAlign: "center",
    border: "1px solid #dce7e9",
    boxShadow:
      "0 15px 40px rgba(22, 62, 68, 0.07)",
  },

  emptyIcon: {
    width: "62px",
    height: "62px",
    borderRadius: "50%",
    background: "#e8f3f4",
    color: "#0e5661",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
    fontSize: "25px",
    fontWeight: "800",
  },

  muted: {
    color: "#6b7f84",
    lineHeight: 1.6,
  },

  tabs: {
    display: "grid",
    gridTemplateColumns:
      "repeat(6, minmax(0, 1fr))",
    gap: "8px",
    background: "#ffffff",
    padding: "8px",
    borderRadius: "18px",
    border: "1px solid #dce7e9",
    boxShadow:
      "0 8px 25px rgba(22, 62, 68, 0.06)",
    marginBottom: "25px",
  },

  tab: {
    border: "none",
    background: "transparent",
    color: "#5d7378",
    borderRadius: "12px",
    padding: "13px 8px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "11px",
    letterSpacing: "0.3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    minHeight: "50px",
  },

  tabActive: {
    background: "#0e5661",
    color: "#ffffff",
    boxShadow:
      "0 6px 18px rgba(14, 86, 97, 0.22)",
  },

  tabNumber: {
    fontSize: "10px",
    opacity: 0.7,
  },

  sectionHeaderLarge: {
    display: "flex",
    alignItems: "center",
    gap: "17px",
    marginBottom: "22px",
  },

  sectionNumber: {
    width: "50px",
    height: "50px",
    flexShrink: 0,
    borderRadius: "15px",
    background: "#dceff0",
    color: "#0e5661",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: "900",
  },

  sectionEyebrow: {
    color: "#769095",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.3px",
    marginBottom: "4px",
  },

  sectionMainTitle: {
    margin: 0,
    fontSize: "27px",
    color: "#17343b",
    letterSpacing: "-0.3px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#708489",
    fontSize: "14px",
  },

  scoreHero: {
    background:
      "linear-gradient(135deg, #0c4f5a 0%, #126772 58%, #21818a 100%)",
    borderRadius: "24px",
    padding: "32px",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    marginBottom: "17px",
    boxShadow:
      "0 18px 45px rgba(14, 86, 97, 0.22)",
  },

  scoreLabel: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    opacity: 0.75,
  },

  bigScore: {
    fontSize: "47px",
    fontWeight: "900",
    marginTop: "4px",
    letterSpacing: "-1.5px",
  },

  scoreStatus: {
    display: "inline-block",
    marginTop: "9px",
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.22)",
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
  },

  progressCircle: {
    width: "112px",
    height: "112px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#ffffff",
    color: "#0e5661",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.13)",
  },

  progressCircleNumber: {
    fontSize: "25px",
    fontWeight: "900",
  },

  progressCircleText: {
    fontSize: "10px",
    color: "#71878b",
    marginTop: "2px",
  },

  metricGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "14px",
    marginBottom: "18px",
  },

  metric: {
    background: "#ffffff",
    border: "1px solid #dce7e9",
    borderRadius: "16px",
    padding: "19px",
    minHeight: "95px",
    boxSizing: "border-box",
  },

  metricOrange: {
    background: "#fffaf0",
    borderColor: "#f1d69a",
  },

  metricTitle: {
    color: "#718489",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "0.8px",
    marginBottom: "9px",
  },

  metricValue: {
    fontSize: "24px",
    fontWeight: "900",
    color: "#0e5661",
    lineHeight: 1.15,
  },

  metricExtra: {
    marginTop: "7px",
    fontSize: "12px",
    color: "#6c7f83",
  },

  progressBox: {
    background: "#ffffff",
    border: "1px solid #dce7e9",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "18px",
  },

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "13px",
    color: "#45636a",
  },

  progressTrack: {
    height: "10px",
    background: "#e2ecee",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #0e5661, #36a0a6)",
    borderRadius: "999px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },

  miniTitle: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    color: "#527078",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.9px",
    marginBottom: "14px",
  },

  miniTitleSpan: {},

  infoBox: {
    background: "#f4f8f8",
    border: "1px solid #dbe7e8",
    borderRadius: "13px",
    padding: "17px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    color: "#304d54",
  },

  observationBox: {
    background: "#fff9ee",
    border: "1px solid #f0d9a7",
    borderRadius: "13px",
    padding: "18px",
    lineHeight: 1.65,
    color: "#5e4a25",
    whiteSpace: "pre-wrap",
  },

  audioBox: {
    background: "#f2f7f8",
    borderRadius: "13px",
    padding: "16px",
    marginTop: "14px",
  },

  list: {
    margin: 0,
    padding: 0,
    listStyle: "none",
  },

  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "11px 0",
    borderBottom: "1px solid #edf2f3",
    lineHeight: 1.5,
  },

  listBullet: {
    color: "#16808a",
    fontWeight: "900",
    flexShrink: 0,
  },

  statusHero: {
    background: "#e8f3f4",
    border: "1px solid #cde3e5",
    borderRadius: "20px",
    padding: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
  },

  statusHeroLabel: {
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1px",
    color: "#648086",
  },

  statusHeroTitle: {
    fontSize: "24px",
    fontWeight: "900",
    color: "#0e5661",
    marginTop: "5px",
  },

  statusDot: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#d8952d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow:
      "0 5px 15px rgba(20,60,65,0.08)",
  },

  comparisonGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },

  comparison: {
    background: "#f5f8f8",
    border: "1px solid #dce7e9",
    borderRadius: "13px",
    padding: "16px",
    lineHeight: 1.8,
    color: "#50676d",
  },

  comparisonLabel: {
    color: "#0e5661",
    fontWeight: "900",
    marginBottom: "3px",
  },

  emptyActivities: {
    background: "#ffffff",
    border: "1px dashed #b9ced1",
    borderRadius: "24px",
    minHeight: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "30px",
  },

  emptyActivitiesIcon: {
    width: "66px",
    height: "66px",
    borderRadius: "18px",
    background: "#e7f2f3",
    color: "#0e5661",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "300",
    marginBottom: "18px",
  },

  feedbackCard: {
    background: "#ffffff",
    borderRadius: "24px",
    border: "1px solid #dce7e9",
    padding: "38px",
    boxShadow:
      "0 12px 35px rgba(22, 62, 68, 0.07)",
  },

  feedbackIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "15px",
    background: "#e8f3f4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    marginBottom: "17px",
  },

  feedbackTitle: {
    margin: 0,
    color: "#17343b",
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "180px",
    boxSizing: "border-box",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #cddcdf",
    background: "#fbfdfd",
    color: "#18323a",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    lineHeight: 1.6,
    marginTop: "18px",
    outline: "none",
  },

  feedbackSuccess: {
    marginTop: "15px",
    background: "#e9f7f0",
    color: "#16724b",
    border: "1px solid #b8e3cf",
    borderRadius: "11px",
    padding: "12px 15px",
    fontWeight: "800",
  },

  formTitle: {
    marginTop: 0,
    color: "#17343b",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "5px 18px",
  },

  label: {
    display: "block",
    fontWeight: "800",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#405c63",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #cddcdf",
    background: "#ffffff",
    color: "#18323a",
    fontSize: "14px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #cddcdf",
    background: "#ffffff",
    color: "#18323a",
    fontSize: "14px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
  },

  adminSection: {
    background: "#f5f9f9",
    border: "1px solid #dce8e9",
    borderRadius: "18px",
    padding: "22px",
    marginTop: "25px",
  },

  adminSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },

  adminSectionNumber: {
    width: "28px",
    height: "28px",
    borderRadius: "9px",
    background: "#0e5661",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "900",
  },

  adminSectionTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#173f46",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "15px 18px",
    background:
      "linear-gradient(135deg, #0e5661, #19727c)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    letterSpacing: "0.4px",
    boxShadow:
      "0 8px 20px rgba(14, 86, 97, 0.2)",
  },

  secondaryButton: {
    border: "1px solid #cbdadd",
    borderRadius: "11px",
    padding: "11px 17px",
    background: "#ffffff",
    color: "#34545b",
    fontWeight: "800",
    cursor: "pointer",
  },

  printButton: {
    border: "1px solid #b9d1d4",
    borderRadius: "10px",
    padding: "10px 15px",
    background: "#eaf4f5",
    color: "#0e5661",
    fontWeight: "900",
    cursor: "pointer",
    fontSize: "11px",
  },

  error: {
    background: "#fff1ef",
    color: "#b42318",
    border: "1px solid #f3c3bd",
    padding: "12px",
    borderRadius: "10px",
    margin: "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#e9f7f0",
    color: "#16724b",
    border: "1px solid #b8e3cf",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "800",
    marginTop: "15px",
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
    borderBottom: "1px solid #d6e4e6",
    fontSize: "12px",
    color: "#46646b",
  },

  td: {
    padding: "13px",
    borderBottom: "1px solid #e9eff0",
    fontSize: "13px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },

  eyebrow: {
    color: "#6b8388",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.1px",
    marginBottom: "5px",
  },
};
