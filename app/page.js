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
    comparativo_productividad: "",
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
    compromiso_no_venta: "",
    fortalezas: "",
    observaciones_no_venta: "",

    feedback_asesor: "",
  });

  const [mensajeAdmin, setMensajeAdmin] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [enviandoFeedback, setEnviandoFeedback] = useState(false);
  const [mensajeFeedback, setMensajeFeedback] = useState("");

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
          await cargarReportesAdmin();
        } else {
          const asesor = asesores.find(
            ([, , emailAsesor]) =>
              emailAsesor.toLowerCase() === correo
          );

          if (asesor) {
            setAsesorActual(asesor);
            setModo("asesor");
            await cargarReportes(asesor[1]);
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
      comparativo_productividad: "",
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
      compromiso_no_venta: "",
      fortalezas: "",
      observaciones_no_venta: "",
      feedback_asesor: "",
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
      comparativo_productividad:
        form.comparativo_productividad || null,
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

      auditorias_no_ventas:
        form.auditorias_no_ventas || null,
      principales_om:
        form.principales_om || null,
      coaching:
        form.coaching || null,
      registro_sistema:
        form.registro_sistema || null,
      compromiso_no_venta:
        form.compromiso_no_venta || null,
      fortalezas:
        form.fortalezas || null,
      observaciones_no_venta:
        form.observaciones_no_venta || null,
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

  async function enviarFeedback() {
    if (!feedback.trim() || !reporteActual?.id) {
      setMensajeFeedback("Escribí un comentario antes de enviar.");
      return;
    }

    setEnviandoFeedback(true);
    setMensajeFeedback("");

    const { error } = await supabase
      .from("reportes")
      .update({
        feedback_asesor: feedback.trim(),
      })
      .eq("id", reporteActual.id);

    if (error) {
      console.error(error);
      setMensajeFeedback(
        "No se pudo enviar el feedback. Intentá nuevamente."
      );
    } else {
      setMensajeFeedback("✓ Feedback enviado correctamente.");
      setFeedback("");
      await cargarReportes(asesorActual[1]);
    }

    setEnviandoFeedback(false);
  }

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.center}>
          <div style={styles.loadingCard}>
            <div style={styles.loadingLogo}>✓</div>
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
            <div style={styles.loginLogo}>✓</div>

            <div style={styles.loginEyebrow}>
              PORTAL DE CALIDAD
            </div>

            <h1 style={styles.loginTitle}>
              Ingresá a tu portal
            </h1>

            <p style={styles.muted}>
              Accedé a tu evolución, objetivos y seguimiento.
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
          <header style={styles.adminHeader}>
            <div>
              <div style={styles.brand}>PORTAL DE CALIDAD</div>
              <h1 style={styles.adminTitle}>Panel de Calidad</h1>
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
              <div style={styles.heroEyebrow}>ADMINISTRACIÓN</div>
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
              <div style={styles.sectionHeader}>
                <div>
                  <div style={styles.number}>01</div>
                  <h2 style={styles.sectionTitle}>CALIDAD</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <Field
                  label="Asesor"
                  name="usuario"
                  value={form.usuario}
                  onChange={cambiarFormulario}
                  type="select"
                  options={asesores.map((a) => ({
                    value: a[1],
                    label: `${a[0]} — ${a[1]}`,
                  }))}
                />

                <Field
                  label="Semana / período"
                  name="semana"
                  value={form.semana}
                  onChange={cambiarFormulario}
                  placeholder="Ej: Semana 3 - Agosto"
                />

                <Field
                  label="Nota de calidad"
                  name="nota"
                  value={form.nota}
                  onChange={cambiarFormulario}
                  placeholder="Ej: 50"
                />

                <Field
                  label="Objetivo"
                  name="objetivo_calidad"
                  value={form.objetivo_calidad}
                  onChange={cambiarFormulario}
                  placeholder="Ej: 70"
                />

                <Field
                  label="Estado"
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

              <TextField
                label="Desvío principal"
                name="desvio"
                value={form.desvio}
                onChange={cambiarFormulario}
              />

              <TextField
                label="Comparativo semanal"
                name="comparativo_calidad"
                value={form.comparativo_calidad}
                onChange={cambiarFormulario}
              />

              <TextField
                label="Items trabajados"
                name="items_calidad"
                value={form.items_calidad}
                onChange={cambiarFormulario}
                placeholder="Un item por línea"
              />

              <TextField
                label="Acciones realizadas"
                name="acciones_calidad"
                value={form.acciones_calidad}
                onChange={cambiarFormulario}
                placeholder="Una acción por línea"
              />

              <TextField
                label="Auditoría"
                name="auditoria"
                value={form.auditoria}
                onChange={cambiarFormulario}
              />

              <TextField
                label="Observaciones"
                name="observaciones"
                value={form.observaciones}
                onChange={cambiarFormulario}
              />

              <div style={styles.divider} />

              <div style={styles.sectionHeader}>
                <div>
                  <div style={styles.number}>02</div>
                  <h2 style={styles.sectionTitle}>
                    PRODUCTIVIDAD
                  </h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <Field
                  label="SPH"
                  name="sph"
                  value={form.sph}
                  onChange={cambiarFormulario}
                />

                <Field
                  label="Objetivo SPH"
                  name="objetivo_sph"
                  value={form.objetivo_sph}
                  onChange={cambiarFormulario}
                />

                <Field
                  label="Ventas"
                  name="ventas"
                  value={form.ventas}
                  onChange={cambiarFormulario}
                />

                <Field
                  label="Objetivo ventas"
                  name="objetivo_ventas"
                  value={form.objetivo_ventas}
                  onChange={cambiarFormulario}
                />

                <Field
                  label="Objetivo de campaña"
                  name="objetivo_campania"
                  value={form.objetivo_campania}
                  onChange={cambiarFormulario}
                />

                <Field
                  label="Estado"
                  name="estado_campania"
                  value={form.estado_campania}
                  onChange={cambiarFormulario}
                />
              </div>

              <TextField
                label="Comparativo semanal"
                name="comparativo_productividad"
                value={form.comparativo_productividad}
                onChange={cambiarFormulario}
              />

              <TextField
                label="Items trabajados"
                name="items_productividad"
                value={form.items_productividad}
                onChange={cambiarFormulario}
              />

              <TextField
                label="Acciones realizadas"
                name="acciones_productividad"
                value={form.acciones_productividad}
                onChange={cambiarFormulario}
              />

              <TextField
                label="Observaciones"
                name="observaciones_productividad"
                value={form.observaciones_productividad}
                onChange={cambiarFormulario}
              />

              <div style={styles.divider} />

              <div style={styles.sectionHeader}>
                <div>
                  <div style={styles.number}>03</div>
                  <h2 style={styles.sectionTitle}>
                    TIPIFICACIONES
                  </h2>
                </div>
              </div>

              <TextField
                label="Tipificaciones"
                name="tipificaciones"
                value={form.tipificaciones}
                onChange={cambiarFormulario}
                placeholder="Una tipificación por línea"
              />

              <div style={styles.formGrid}>
                <Field
                  label="Desvío"
                  name="tipificacion_desvio"
                  value={form.tipificacion_desvio}
                  onChange={cambiarFormulario}
                />

                <Field
                  label="Objetivo"
                  name="tipificacion_objetivo"
                  value={form.tipificacion_objetivo}
                  onChange={cambiarFormulario}
                />

                <Field
                  label="Resultado"
                  name="tipificacion_resultado"
                  value={form.tipificacion_resultado}
                  onChange={cambiarFormulario}
                />

                <Field
                  label="Estado"
                  name="estado_tipificaciones"
                  value={form.estado_tipificaciones}
                  onChange={cambiarFormulario}
                />

                <Field
                  label="Compromiso"
                  name="tipificacion_compromiso"
                  value={form.tipificacion_compromiso}
                  onChange={cambiarFormulario}
                />
              </div>

              <TextField
                label="Observaciones"
                name="tipificacion_observaciones"
                value={form.tipificacion_observaciones}
                onChange={cambiarFormulario}
              />

              <div style={styles.divider} />

              <div style={styles.sectionHeader}>
                <div>
                  <div style={styles.number}>04</div>
                  <h2 style={styles.sectionTitle}>
                    AUDITORÍAS DE NO VENTAS
                  </h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <Field
                  label="Cantidad"
                  name="auditorias_no_ventas"
                  value={form.auditorias_no_ventas}
                  onChange={cambiarFormulario}
                />

                <Field
                  label="Registro en sistema"
                  name="registro_sistema"
                  value={form.registro_sistema}
                  onChange={cambiarFormulario}
                />

                <Field
                  label="Compromiso"
                  name="compromiso_no_venta"
                  value={form.compromiso_no_venta}
                  onChange={cambiarFormulario}
                />
              </div>

              <TextField
                label="Principales O.M."
                name="principales_om"
                value={form.principales_om}
                onChange={cambiarFormulario}
              />

              <TextField
                label="Coaching"
                name="coaching"
                value={form.coaching}
                onChange={cambiarFormulario}
              />

              <TextField
                label="Fortalezas"
                name="fortalezas"
                value={form.fortalezas}
                onChange={cambiarFormulario}
              />

              <TextField
                label="Observaciones"
                name="observaciones_no_venta"
                value={form.observaciones_no_venta}
                onChange={cambiarFormulario}
              />

              <button
                type="submit"
                disabled={guardando}
                style={{
                  ...styles.primaryButton,
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
            <h2 style={styles.sectionTitle}>
              Reportes cargados
            </h2>

            {cargandoAdmin ? (
              <p style={styles.muted}>Cargando reportes...</p>
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
    const reporteAnterior = reportes[1];

    const nota = numero(reporteActual?.nota);
    const objetivo = numero(reporteActual?.objetivo_calidad);

    const diferencia =
      nota !== null && objetivo !== null
        ? objetivo - nota
        : null;

    const progreso =
      nota !== null && objetivo > 0
        ? Math.min(Math.round((nota / objetivo) * 100), 100)
        : 0;

    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.advisorHeader}>
            <div>
              <div style={styles.brand}>PORTAL DE CALIDAD</div>

              <h1 style={styles.advisorGreeting}>
                Hola,{" "}
                {nombreCorto(asesorActual?.[0])}
              </h1>

              <div style={styles.weekText}>
                {reporteActual?.semana || "Sin semana cargada"}
              </div>
            </div>

            <div style={styles.headerRight}>
              <StatusBadge
                estado={
                  reporteActual?.estado_objetivo ||
                  "EN SEGUIMIENTO"
                }
              />

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
            <section style={styles.emptyCard}>
              <div style={styles.emptyIcon}>01</div>
              <h2>Todavía no hay reportes</h2>
              <p style={styles.muted}>
                Cuando Calidad cargue tu primer reporte semanal,
                vas a poder verlo desde acá.
              </p>
            </section>
          ) : (
            <>
              <section style={styles.qualityHero}>
                <div>
                  <div style={styles.heroEyebrow}>
                    ÚLTIMO REPORTE
                  </div>

                  <h2 style={styles.qualityHeroTitle}>
                    Tu evolución de calidad
                  </h2>

                  <p style={styles.qualityHeroText}>
                    Revisá tu resultado, tus objetivos y los
                    puntos sobre los que vamos a trabajar.
                  </p>
                </div>

                <div style={styles.scoreCircle}>
                  {nota !== null ? `${nota}/100` : "-"}
                </div>
              </section>

              <section style={styles.card}>
                <SectionNumber number="01" title="CALIDAD" />

                <div style={styles.metricGrid}>
                  <Metric
                    title="NOTA"
                    value={
                      reporteActual?.nota
                        ? `${reporteActual.nota} / 100`
                        : "-"
                    }
                    accent="pink"
                  />

                  <Metric
                    title="OBJETIVO"
                    value={reporteActual?.objetivo_calidad || "-"}
                    accent="purple"
                  />

                  <Metric
                    title="ESTADO"
                    value={
                      reporteActual?.estado_objetivo ||
                      "Sin estado"
                    }
                    accent="orange"
                  />

                  <Metric
                    title="PRODUCTO"
                    value={reporteActual?.producto || "-"}
                    accent="blue"
                  />
                </div>

                <div style={styles.progressBox}>
                  <div style={styles.progressHeader}>
                    <strong>Progreso hacia el objetivo</strong>
                    <strong>{progreso}%</strong>
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

                <div style={styles.twoColumn}>
                  <div style={styles.highlightCard}>
                    <span style={styles.smallLabel}>
                      CUÁNTO FALTA
                    </span>

                    <strong style={styles.bigHighlight}>
                      {diferencia !== null && diferencia > 0
                        ? `${diferencia} puntos`
                        : "Objetivo alcanzado"}
                    </strong>
                  </div>

                  <div style={styles.highlightCard}>
                    <span style={styles.smallLabel}>
                      DESVÍO PRINCIPAL
                    </span>

                    <strong style={styles.highlightText}>
                      {reporteActual?.desvio ||
                        "No hay desvíos cargados."}
                    </strong>
                  </div>
                </div>

                <div style={styles.subSection}>
                  <h3 style={styles.subTitle}>
                    COMPARATIVO SEMANAL
                  </h3>

                  {reporteAnterior ? (
                    <div style={styles.comparison}>
                      <div>
                        <span>Semana anterior</span>
                        <strong>
                          {reporteAnterior.nota || "-"}
                        </strong>
                      </div>

                      <div style={styles.comparisonArrow}>
                        →
                      </div>

                      <div>
                        <span>Semana actual</span>
                        <strong>
                          {reporteActual.nota || "-"}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.softBox}>
                      Todavía no hay una semana anterior
                      para comparar.
                    </div>
                  )}
                </div>

                <ListBlock
                  title="ITEMS TRABAJADOS"
                  items={reporteActual.items_calidad}
                  empty="No se registraron items de calidad."
                />

                <ListBlock
                  title="ACCIONES REALIZADAS"
                  items={reporteActual.acciones_calidad}
                  empty="No se registraron acciones de calidad."
                />

                <div style={styles.subSection}>
                  <h3 style={styles.subTitle}>AUDITORÍA</h3>

                  {reporteActual.auditoria ? (
                    <div style={styles.softBox}>
                      {reporteActual.auditoria}
                    </div>
                  ) : (
                    <div style={styles.softBox}>
                      No hay información de auditoría.
                    </div>
                  )}
                </div>

                {reporteActual.observaciones && (
                  <div style={styles.observationBox}>
                    <span style={styles.smallLabel}>
                      OBSERVACIONES
                    </span>

                    <p>
                      {reporteActual.observaciones}
                    </p>
                  </div>
                )}
              </section>

              <section style={styles.card}>
                <SectionNumber
                  number="02"
                  title="PRODUCTIVIDAD"
                />

                <div style={styles.metricGrid}>
                  <Metric
                    title="SPH"
                    value={reporteActual.sph || "-"}
                    extra={`Objetivo SPH: ${
                      reporteActual.objetivo_sph || "-"
                    }`}
                    accent="purple"
                  />

                  <Metric
                    title="VENTAS"
                    value={reporteActual.ventas || "-"}
                    extra={`Objetivo ventas: ${
                      reporteActual.objetivo_ventas || "-"
                    }`}
                    accent="pink"
                  />

                  <Metric
                    title="OBJETIVO DE CAMPAÑA"
                    value={
                      reporteActual.objetivo_campania || "-"
                    }
                    extra={
                      reporteActual.estado_campania ||
                      "Sin estado"
                    }
                    accent="blue"
                  />

                  <Metric
                    title="ESTADO"
                    value={
                      reporteActual.estado_campania || "-"
                    }
                    accent="orange"
                  />
                </div>

                <div style={styles.subSection}>
                  <h3 style={styles.subTitle}>
                    COMPARATIVO SEMANAL
                  </h3>

                  <div style={styles.softBox}>
                    {reporteActual.comparativo_productividad ||
                      "-"}
                  </div>
                </div>

                <ListBlock
                  title="ITEMS TRABAJADOS"
                  items={reporteActual.items_productividad}
                  empty="No se registraron items."
                />

                <ListBlock
                  title="ACCIONES REALIZADAS"
                  items={reporteActual.acciones_productividad}
                  empty="No se registraron acciones."
                />

                <div style={styles.observationBox}>
                  <span style={styles.smallLabel}>
                    OBSERVACIONES
                  </span>

                  <p>
                    {reporteActual.observaciones_productividad ||
                      "No hay observaciones cargadas."}
                  </p>
                </div>
              </section>

              <section style={styles.card}>
                <SectionNumber
                  number="03"
                  title="TIPIFICACIONES"
                />

                <div style={styles.tipHeader}>
                  <StatusBadge
                    estado={
                      reporteActual.estado_tipificaciones ||
                      "En proceso"
                    }
                  />
                </div>

                <div style={styles.metricGrid}>
                  <Metric
                    title="DESVÍO"
                    value={
                      reporteActual.tipificacion_desvio || "-"
                    }
                    accent="pink"
                  />

                  <Metric
                    title="OBJETIVO"
                    value={
                      reporteActual.tipificacion_objetivo || "-"
                    }
                    accent="purple"
                  />

                  <Metric
                    title="RESULTADO"
                    value={
                      reporteActual.tipificacion_resultado || "-"
                    }
                    accent="blue"
                  />
                </div>

                <ListBlock
                  title="TIPIFICACIONES"
                  items={reporteActual.tipificaciones}
                  empty="No se registraron tipificaciones."
                />

                <div style={styles.twoColumn}>
                  <div style={styles.infoPanel}>
                    <span style={styles.smallLabel}>
                      COMPROMISO
                    </span>

                    <strong>
                      {reporteActual.tipificacion_compromiso ||
                        "Sin compromiso cargado."}
                    </strong>
                  </div>

                  <div style={styles.infoPanel}>
                    <span style={styles.smallLabel}>
                      OBSERVACIONES
                    </span>

                    <p>
                      {reporteActual.tipificacion_observaciones ||
                        "Sin observaciones cargadas."}
                    </p>
                  </div>
                </div>
              </section>

              <section style={styles.card}>
                <SectionNumber
                  number="04"
                  title="AUDITORÍAS DE NO VENTAS"
                />

                <div style={styles.metricGrid}>
                  <Metric
                    title="CANTIDAD"
                    value={
                      reporteActual.auditorias_no_ventas || "-"
                    }
                    accent="orange"
                  />

                  <Metric
                    title="REGISTRO EN SISTEMA"
                    value={
                      reporteActual.registro_sistema || "-"
                    }
                    accent="blue"
                  />

                  <Metric
                    title="COMPROMISO"
                    value={
                      reporteActual.compromiso_no_venta || "-"
                    }
                    accent="purple"
                  />
                </div>

                <InfoSection
                  title="PRINCIPALES O.M."
                  value={reporteActual.principales_om}
                />

                <InfoSection
                  title="COACHING"
                  value={reporteActual.coaching}
                />

                <InfoSection
                  title="FORTALEZAS"
                  value={reporteActual.fortalezas}
                />

                <InfoSection
                  title="OBSERVACIONES"
                  value={reporteActual.observaciones_no_venta}
                />
              </section>

              <section style={styles.feedbackCard}>
                <SectionNumber
                  number="05"
                  title="FEEDBACK DEL ASESOR"
                />

                <p style={styles.feedbackIntro}>
                  ¿Querés dejar algún comentario sobre tu
                  reporte, una consulta o algo que quieras
                  trabajar con Calidad?
                </p>

                <textarea
                  value={feedback}
                  onChange={(e) =>
                    setFeedback(e.target.value)
                  }
                  placeholder="Escribí tu comentario acá..."
                  style={styles.feedbackTextarea}
                />

                <button
                  onClick={enviarFeedback}
                  disabled={enviandoFeedback}
                  style={styles.feedbackButton}
                >
                  {enviandoFeedback
                    ? "ENVIANDO..."
                    : "ENVIAR FEEDBACK"}
                </button>

                {mensajeFeedback && (
                  <div style={styles.feedbackSuccess}>
                    {mensajeFeedback}
                  </div>
                )}
              </section>

              {reporteActual.audio_url && (
                <section style={styles.card}>
                  <h3 style={styles.subTitle}>
                    LLAMADA AUDITADA
                  </h3>

                  <audio
                    controls
                    src={reporteActual.audio_url}
                    style={{
                      width: "100%",
                      marginTop: "10px",
                    }}
                  />
                </section>
              )}
            </>
          )}
        </div>
      </main>
    );
  }

  return null;
}

function numero(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const limpio = String(valor)
    .replace("%", "")
    .replace(",", ".")
    .trim();

  const numeroConvertido = Number(limpio);

  return Number.isNaN(numeroConvertido)
    ? null
    : numeroConvertido;
}

function nombreCorto(nombreCompleto) {
  if (!nombreCompleto) return "";

  const partes = nombreCompleto.split(",");

  return partes[0].trim();
}

function StatusBadge({ estado }) {
  const texto = String(estado || "").toUpperCase();

  let tipo = "orange";

  if (
    texto.includes("ALCANZ") ||
    texto.includes("CUMPLE") ||
    texto.includes("OK")
  ) {
    tipo = "green";
  }

  if (
    texto.includes("DEBAJO") ||
    texto.includes("NO CUMPLE")
  ) {
    tipo = "pink";
  }

  return (
    <span
      style={{
        ...styles.statusBadge,
        ...styles[`status${capitalize(tipo)}`],
      }}
    >
      {estado}
    </span>
  );
}

function capitalize(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function SectionNumber({ number, title }) {
  return (
    <div style={styles.sectionHeader}>
      <div style={styles.sectionTitleGroup}>
        <div style={styles.number}>{number}</div>
        <h2 style={styles.sectionTitle}>{title}</h2>
      </div>
    </div>
  );
}

function Metric({ title, value, extra, accent = "blue" }) {
  return (
    <div
      style={{
        ...styles.metric,
        borderTop: `4px solid ${styles.accentColors[accent]}`,
      }}
    >
      <div style={styles.metricTitle}>{title}</div>

      <div style={styles.metricValue}>{value}</div>

      {extra && (
        <div style={styles.metricExtra}>{extra}</div>
      )}
    </div>
  );
}

function ListBlock({ title, items, empty }) {
  const lista = normalizarLista(items);

  return (
    <div style={styles.subSection}>
      <h3 style={styles.subTitle}>{title}</h3>

      {lista.length === 0 ? (
        <div style={styles.softBox}>{empty}</div>
      ) : (
        <div style={styles.listGrid}>
          {lista.map((item, index) => (
            <div key={index} style={styles.listItem}>
              <span style={styles.check}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoSection({ title, value }) {
  return (
    <div style={styles.subSection}>
      <h3 style={styles.subTitle}>{title}</h3>

      <div style={styles.softBox}>
        {value || "-"}
      </div>
    </div>
  );
}

function normalizarLista(items) {
  if (Array.isArray(items)) {
    return items;
  }

  if (typeof items === "string") {
    try {
      const convertido = JSON.parse(items);

      if (Array.isArray(convertido)) {
        return convertido;
      }
    } catch {}

    return items
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "input",
  options = [],
}) {
  return (
    <div>
      <label style={styles.label}>{label}</label>

      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={styles.input}
          required={name === "usuario"}
        >
          <option value="">Seleccioná...</option>

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
        />
      )}
    </div>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label style={styles.label}>{label}</label>

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

const styles = {
  accentColors: {
    pink: "#e95d8f",
    purple: "#8b6fd8",
    blue: "#4d9de0",
    orange: "#f2a65a",
    green: "#48a868",
  },

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #fff7fb 0%, #f4f1ff 48%, #eef8ff 100%)",
    color: "#25243a",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "25px",
  },

  loadingCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "40px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(75, 56, 120, 0.12)",
  },

  loadingLogo: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #e95d8f, #8b6fd8)",
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "800",
  },

  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "25px",
  },

  loginCard: {
    width: "100%",
    maxWidth: "450px",
    background: "#ffffff",
    padding: "42px",
    borderRadius: "28px",
    boxShadow:
      "0 25px 70px rgba(92, 64, 130, 0.16)",
    border: "1px solid #eee6f5",
  },

  loginLogo: {
    width: "62px",
    height: "62px",
    borderRadius: "19px",
    background:
      "linear-gradient(135deg, #e95d8f, #8b6fd8)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "29px",
    fontWeight: "800",
    marginBottom: "20px",
  },

  loginEyebrow: {
    color: "#8b6fd8",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.4px",
    marginBottom: "8px",
  },

  loginTitle: {
    margin: 0,
    fontSize: "30px",
    color: "#25243a",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "30px 20px 70px",
    boxSizing: "border-box",
  },

  brand: {
    display: "inline-block",
    color: "#8b6fd8",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "1.4px",
  },

  advisorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    marginBottom: "28px",
    paddingBottom: "22px",
    borderBottom: "1px solid #e8e1f0",
    flexWrap: "wrap",
  },

  advisorGreeting: {
    margin: "7px 0 3px",
    fontSize: "34px",
    letterSpacing: "-0.8px",
    color: "#25243a",
  },

  weekText: {
    color: "#76718a",
    fontSize: "15px",
    fontWeight: "600",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  adminHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  adminTitle: {
    margin: "7px 0 0",
    fontSize: "32px",
    color: "#25243a",
  },

  adminHero: {
    background:
      "linear-gradient(135deg, #8b6fd8 0%, #e95d8f 100%)",
    color: "#ffffff",
    borderRadius: "25px",
    padding: "34px",
    marginBottom: "22px",
    boxShadow:
      "0 18px 45px rgba(139, 111, 216, 0.25)",
  },

  heroEyebrow: {
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    opacity: 0.8,
  },

  adminHeroTitle: {
    margin: "8px 0",
    fontSize: "30px",
  },

  adminHeroText: {
    margin: 0,
    opacity: 0.9,
  },

  qualityHero: {
    background:
      "linear-gradient(135deg, #5e4aa8 0%, #8b6fd8 52%, #e95d8f 100%)",
    color: "#ffffff",
    borderRadius: "28px",
    padding: "36px",
    marginBottom: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    boxShadow:
      "0 20px 55px rgba(105, 77, 160, 0.24)",
  },

  qualityHeroTitle: {
    margin: "8px 0",
    fontSize: "30px",
  },

  qualityHeroText: {
    margin: 0,
    maxWidth: "600px",
    opacity: 0.9,
    lineHeight: 1.5,
  },

  scoreCircle: {
    width: "125px",
    height: "125px",
    minWidth: "125px",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#5e4aa8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "900",
    boxShadow:
      "0 12px 35px rgba(0, 0, 0, 0.16)",
  },

  card: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "22px",
    border: "1px solid #eee8f4",
    boxShadow:
      "0 10px 35px rgba(80, 58, 110, 0.08)",
  },

  emptyCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "45px",
    textAlign: "center",
    boxShadow:
      "0 10px 35px rgba(80, 58, 110, 0.08)",
  },

  emptyIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "#f2edff",
    color: "#8b6fd8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontWeight: "900",
  },

  sectionHeader: {
    marginBottom: "25px",
  },

  sectionTitleGroup: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  number: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #f7d9e6, #e7def9)",
    color: "#7059aa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "900",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#302b43",
    letterSpacing: "-0.3px",
  },

  metricGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "15px",
  },

  metric: {
    background: "#fbfaff",
    border: "1px solid #ebe6f2",
    borderRadius: "16px",
    padding: "19px",
  },

  metricTitle: {
    color: "#817b91",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.7px",
    marginBottom: "9px",
  },

  metricValue: {
    fontSize: "23px",
    fontWeight: "900",
    color: "#302b43",
  },

  metricExtra: {
    marginTop: "7px",
    color: "#817b91",
    fontSize: "12px",
  },

  progressBox: {
    marginTop: "20px",
    padding: "20px",
    background: "#faf8ff",
    borderRadius: "16px",
    border: "1px solid #eee8f7",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    color: "#4c4560",
    fontSize: "13px",
  },

  progressTrack: {
    height: "12px",
    borderRadius: "999px",
    background: "#eee9f5",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, #8b6fd8, #e95d8f)",
    transition: "width 0.4s ease",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },

  highlightCard: {
    padding: "20px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg, #fff5f9, #f8f3ff)",
    border: "1px solid #eee3f2",
  },

  smallLabel: {
    display: "block",
    color: "#8b8496",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1px",
    marginBottom: "9px",
  },

  bigHighlight: {
    display: "block",
    color: "#5e4aa8",
    fontSize: "20px",
  },

  highlightText: {
    color: "#403950",
    fontSize: "16px",
    lineHeight: 1.5,
  },

  subSection: {
    marginTop: "28px",
  },

  subTitle: {
    fontSize: "12px",
    letterSpacing: "1px",
    color: "#7d778a",
    margin: "0 0 12px",
    fontWeight: "900",
  },

  comparison: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
    padding: "20px",
    borderRadius: "16px",
    background: "#faf9fc",
    border: "1px solid #eee9f2",
  },

  comparison: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    gap: "20px",
    padding: "20px",
    borderRadius: "16px",
    background: "#faf9fc",
    border: "1px solid #eee9f2",
    textAlign: "center",
  },

  comparisonArrow: {
    fontSize: "25px",
    color: "#8b6fd8",
    fontWeight: "900",
  },

  softBox: {
    background: "#faf9fc",
    border: "1px solid #eee9f2",
    borderRadius: "14px",
    padding: "17px",
    color: "#5f596d",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  listGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "10px",
  },

  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "13px 15px",
    background: "#faf9fc",
    border: "1px solid #eee9f2",
    borderRadius: "13px",
    color: "#4c4659",
    lineHeight: 1.45,
  },

  check: {
    color: "#e95d8f",
    fontWeight: "900",
  },

  observationBox: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "16px",
    background: "#fff7fb",
    border: "1px solid #f3dce7",
    color: "#514857",
    lineHeight: 1.6,
  },

  infoPanel: {
    padding: "20px",
    background: "#faf9fc",
    border: "1px solid #eee9f2",
    borderRadius: "16px",
    lineHeight: 1.6,
  },

  tipHeader: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "18px",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.3px",
    border: "1px solid transparent",
  },

  statusOrange: {
    background: "#fff2df",
    color: "#a45d16",
    borderColor: "#f4d2a6",
  },

  statusPink: {
    background: "#ffe8f0",
    color: "#b52e60",
    borderColor: "#f2bfd2",
  },

  statusGreen: {
    background: "#e8f8ef",
    color: "#217a45",
    borderColor: "#bce6cc",
  },

  statusPurple: {
    background: "#eee9ff",
    color: "#6650a3",
    borderColor: "#d7cff5",
  },

  statusBlue: {
    background: "#e7f4ff",
    color: "#2c6eaa",
    borderColor: "#c8e3f8",
  },

  feedbackCard: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #fff6fa 100%)",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "22px",
    border: "1px solid #f0dce6",
    boxShadow:
      "0 12px 35px rgba(180, 82, 125, 0.08)",
  },

  feedbackIntro: {
    color: "#625a6b",
    lineHeight: 1.6,
    marginBottom: "18px",
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "130px",
    boxSizing: "border-box",
    padding: "15px",
    borderRadius: "14px",
    border: "1px solid #dfd7e3",
    background: "#ffffff",
    color: "#302b43",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    outline: "none",
  },

  feedbackButton: {
    border: "none",
    borderRadius: "12px",
    padding: "14px 22px",
    background:
      "linear-gradient(135deg, #e95d8f, #8b6fd8)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "14px",
  },

  feedbackSuccess: {
    marginTop: "14px",
    padding: "13px",
    borderRadius: "12px",
    background: "#eaf8ef",
    color: "#237746",
    fontWeight: "700",
  },

  muted: {
    color: "#817b91",
    lineHeight: 1.6,
  },

  label: {
    display: "block",
    fontWeight: "800",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#4b4558",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #ddd7e5",
    background: "#ffffff",
    color: "#302b43",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #ddd7e5",
    background: "#ffffff",
    color: "#302b43",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "5px 18px",
  },

  divider: {
    height: "1px",
    background: "#eee9f2",
    margin: "35px 0",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "15px 18px",
    background:
      "linear-gradient(135deg, #8b6fd8, #e95d8f)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "25px",
  },

  feedbackButton: {
    border: "none",
    borderRadius: "12px",
    padding: "14px 22px",
    background:
      "linear-gradient(135deg, #e95d8f, #8b6fd8)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "14px",
  },

  secondaryButton: {
    border: "1px solid #ddd7e5",
    borderRadius: "11px",
    padding: "11px 17px",
    background: "#ffffff",
    color: "#514b60",
    fontWeight: "800",
    cursor: "pointer",
  },

  success: {
    background: "#eaf8ef",
    color: "#237746",
    border: "1px solid #bce5ca",
    padding: "13px",
    borderRadius: "11px",
    fontWeight: "800",
    marginTop: "15px",
  },

  error: {
    background: "#fff0f4",
    color: "#b52e60",
    border: "1px solid #f1c5d5",
    padding: "12px",
    borderRadius: "11px",
    margin: "18px 0",
    fontSize: "14px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#faf8fc",
    borderBottom: "1px solid #e5dfeb",
    fontSize: "12px",
    color: "#625b6d",
  },

  td: {
    padding: "13px",
    borderBottom: "1px solid #eeeaf1",
    fontSize: "14px",
    color: "#4d4757",
  },

  audioBox: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "15px",
    background: "#faf9fc",
  },
};
