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

  const [pestana, setPestana] = useState("calidad");

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
    tipificaciones: "",
    objetivo_tipificaciones: "",
    estado_tipificaciones: "",
    tipificacion_desvio: "",
    tipificacion_objetivo: "",
    tipificacion_resultado: "",
    tipificacion_compromiso: "",
    tipificacion_observaciones: "",
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
    setPestana("calidad");
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
      tipificaciones: "",
      objetivo_tipificaciones: "",
      estado_tipificaciones: "",
      tipificacion_desvio: "",
      tipificacion_objetivo: "",
      tipificacion_resultado: "",
      tipificacion_compromiso: "",
      tipificacion_observaciones: "",
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

    const items = form.items_calidad
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const acciones = form.acciones_calidad
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const tipificaciones = form.tipificaciones
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

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
      items_calidad: items,
      acciones_calidad: acciones,
      auditoria: form.auditoria || null,
      audio_url: form.audio_url || null,
      observaciones: form.observaciones || null,
      sph: form.sph || null,
      objetivo_sph: form.objetivo_sph || null,
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
    }, 4000);
  }

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
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
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.pageTitle}>
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
              <div style={styles.heroEyebrow}>
                ADMINISTRACIÓN
              </div>

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
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Asesor</label>

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
                      <option key={asesor[1]} value={asesor[1]}>
                        {asesor[0]} — {asesor[1]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={styles.label}>
                    Semana / período
                  </label>

                  <input
                    name="semana"
                    value={form.semana}
                    onChange={cambiarFormulario}
                    placeholder="Ej: Semana 3 - Agosto"
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Nota de calidad
                  </label>

                  <input
                    name="nota"
                    value={form.nota}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 50"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Objetivo de calidad
                  </label>

                  <input
                    name="objetivo_calidad"
                    value={form.objetivo_calidad}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 70"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Estado del objetivo
                  </label>

                  <input
                    name="estado_objetivo"
                    value={form.estado_objetivo}
                    onChange={cambiarFormulario}
                    placeholder="Ej: Debajo del objetivo"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Producto</label>

                  <input
                    name="producto"
                    value={form.producto}
                    onChange={cambiarFormulario}
                    placeholder="Ej: AP"
                    style={styles.input}
                  />
                </div>
              </div>

              <label style={styles.label}>
                Desvío principal
              </label>

              <textarea
                name="desvio"
                value={form.desvio}
                onChange={cambiarFormulario}
                placeholder="Describí el principal desvío..."
                style={styles.textarea}
              />

              <label style={styles.label}>
                Recomendación
              </label>

              <textarea
                name="recomendacion"
                value={form.recomendacion}
                onChange={cambiarFormulario}
                placeholder="Qué debería trabajar el asesor..."
                style={styles.textarea}
              />

              <label style={styles.label}>
                Objetivo de trabajo
              </label>

              <textarea
                name="objetivo"
                value={form.objetivo}
                onChange={cambiarFormulario}
                placeholder="Objetivo para la próxima evaluación..."
                style={styles.textarea}
              />

              <label style={styles.label}>
                Items trabajados en Calidad
              </label>

              <textarea
                name="items_calidad"
                value={form.items_calidad}
                onChange={cambiarFormulario}
                placeholder={
                  "Un item por línea.\nEj: Validación de datos\nPresentación HS\nCláusula de aceptación"
                }
                style={styles.textarea}
              />

              <label style={styles.label}>
                Acciones realizadas en Calidad
              </label>

              <textarea
                name="acciones_calidad"
                value={form.acciones_calidad}
                onChange={cambiarFormulario}
                placeholder={
                  "Una acción por línea.\nEj: Feedback individual\nEspacio de coaching"
                }
                style={styles.textarea}
              />

              <section style={styles.tipificacionAdmin}>
                <h2 style={styles.sectionTitle}>
                  Tipificaciones
                </h2>

                <p style={styles.sectionDescription}>
                  Cargá una tipificación por línea.
                </p>

                <label style={styles.label}>
                  Tipificaciones realizadas
                </label>

                <textarea
                  name="tipificaciones"
                  value={form.tipificaciones}
                  onChange={cambiarFormulario}
                  placeholder={
                    "Ej:\nNo conforme con sumas aseguradas\nNo interesado - Producto\nProblemas económicos"
                  }
                  style={styles.textarea}
                />

                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>
                      Objetivo tipificaciones
                    </label>

                    <input
                      name="objetivo_tipificaciones"
                      value={form.objetivo_tipificaciones}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Estado tipificaciones
                    </label>

                    <input
                      name="estado_tipificaciones"
                      value={form.estado_tipificaciones}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Desvío</label>

                    <input
                      name="tipificacion_desvio"
                      value={form.tipificacion_desvio}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Objetivo</label>

                    <input
                      name="tipificacion_objetivo"
                      value={form.tipificacion_objetivo}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Resultado</label>

                    <input
                      name="tipificacion_resultado"
                      value={form.tipificacion_resultado}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>Compromiso</label>

                    <input
                      name="tipificacion_compromiso"
                      value={form.tipificacion_compromiso}
                      onChange={cambiarFormulario}
                      style={styles.input}
                    />
                  </div>
                </div>

                <label style={styles.label}>
                  Observaciones de tipificación
                </label>

                <textarea
                  name="tipificacion_observaciones"
                  value={form.tipificacion_observaciones}
                  onChange={cambiarFormulario}
                  style={styles.textarea}
                />
              </section>

              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>
                    Referencia de auditoría
                  </label>

                  <input
                    name="auditoria"
                    value={form.auditoria}
                    onChange={cambiarFormulario}
                    placeholder="Ej: Llamada 15482"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    URL del audio
                  </label>

                  <input
                    name="audio_url"
                    value={form.audio_url}
                    onChange={cambiarFormulario}
                    placeholder="Pegá la URL del audio"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>SPH</label>

                  <input
                    name="sph"
                    value={form.sph}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 0.15"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Objetivo SPH
                  </label>

                  <input
                    name="objetivo_sph"
                    value={form.objetivo_sph}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 0.5"
                    style={styles.input}
                  />
                </div>
              </div>

              <label style={styles.label}>
                Observaciones
              </label>

              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={cambiarFormulario}
                placeholder="Observaciones adicionales..."
                style={styles.textarea}
              />

              <button
                type="submit"
                disabled={guardando}
                style={{
                  ...styles.primaryButton,
                  marginTop: "20px",
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
                <div style={styles.sectionEyebrow}>
                  HISTORIAL
                </div>

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
                            {asesor ? asesor[0] : reporte.usuario}
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
        ? Math.max(objetivo - nota, 0)
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
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.advisorGreeting}>
                Hola, {nombreAsesor(asesorActual?.[0])}
              </h1>

              <div style={styles.weekText}>
                {reporteActual?.semana || "Sin semana cargada"}
              </div>
            </div>

            <div style={styles.headerRight}>
              <div
                style={estadoBadge(
                  reporteActual?.estado_objetivo
                )}
              >
                {reporteActual?.estado_objetivo ||
                  "SIN ESTADO"}
              </div>

              <button
                onClick={cerrarSesion}
                style={styles.secondaryButton}
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          <nav style={styles.tabs}>
            <Tab
              active={pestana === "calidad"}
              onClick={() => setPestana("calidad")}
              number="01"
              title="Calidad"
            />

            <Tab
              active={pestana === "productividad"}
              onClick={() => setPestana("productividad")}
              number="02"
              title="Productividad"
            />

            <Tab
              active={pestana === "tipificaciones"}
              onClick={() => setPestana("tipificaciones")}
              number="03"
              title="Tipificaciones"
            />

            <Tab
              active={pestana === "auditorias"}
              onClick={() => setPestana("auditorias")}
              number="04"
              title="Auditorías"
            />

            <Tab
              active={pestana === "actividades"}
              onClick={() => setPestana("actividades")}
              number="05"
              title="Actividades"
            />

            <Tab
              active={pestana === "historico"}
              onClick={() => setPestana("historico")}
              number="06"
              title="Histórico"
            />

            <Tab
              active={pestana === "feedback"}
              onClick={() => setPestana("feedback")}
              number="07"
              title="Feedback"
            />
          </nav>

          {!reporteActual ? (
            <section style={styles.card}>
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>○</div>

                <h2>Todavía no hay reportes</h2>

                <p style={styles.muted}>
                  Cuando Calidad cargue tu primer reporte
                  semanal, vas a poder verlo desde acá.
                </p>
              </div>
            </section>
          ) : (
            <>
              {pestana === "calidad" && (
                <section style={styles.tabContent}>
                  <SectionHeading
                    number="01"
                    title="CALIDAD"
                    subtitle="Resultado de tu última evaluación"
                  />

                  <div style={styles.scorePanel}>
                    <div>
                      <div style={styles.scoreLabel}>
                        NOTA
                      </div>

                      <div style={styles.bigScore}>
                        {reporteActual?.nota || "-"}
                        <span>/ 100</span>
                      </div>
                    </div>

                    <div style={styles.scoreDetails}>
                      <SmallMetric
                        title="OBJETIVO"
                        value={
                          reporteActual?.objetivo_calidad ||
                          "-"
                        }
                      />

                      <SmallMetric
                        title="ESTADO"
                        value={
                          reporteActual?.estado_objetivo ||
                          "-"
                        }
                      />

                      <SmallMetric
                        title="PRODUCTO"
                        value={
                          reporteActual?.producto || "-"
                        }
                      />
                    </div>
                  </div>

                  <div style={styles.progressCard}>
                    <div style={styles.progressTop}>
                      <span>
                        Progreso hacia el objetivo
                      </span>

                      <strong>
                        {progreso}%
                      </strong>
                    </div>

                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${progreso}%`,
                        }}
                      />
                    </div>

                    <div style={styles.progressBottom}>
                      <span>
                        Cuánto falta para alcanzar el objetivo
                      </span>

                      <strong>
                        {diferencia !== null
                          ? `${diferencia} puntos`
                          : "-"}
                      </strong>
                    </div>
                  </div>

                  <div style={styles.twoColumns}>
                    <InfoCard
                      title="DESVÍO PRINCIPAL"
                      value={
                        reporteActual?.desvio ||
                        "No hay desvíos cargados."
                      }
                      variant="attention"
                    />

                    <InfoCard
                      title="COMPARATIVO SEMANAL"
                      value={
                        reporteAnterior
                          ? `Semana anterior: ${
                              reporteAnterior.nota || "-"
                            } · Semana actual: ${
                              reporteActual.nota || "-"
                            }`
                          : "Todavía no hay una semana anterior para comparar."
                      }
                    />
                  </div>

                  <div style={styles.twoColumns}>
                    <ListCard
                      title="ITEMS TRABAJADOS"
                      items={reporteActual?.items_calidad}
                      empty="No se registraron items."
                    />

                    <ListCard
                      title="ACCIONES REALIZADAS"
                      items={reporteActual?.acciones_calidad}
                      empty="No se registraron acciones."
                    />
                  </div>

                  <div style={styles.twoColumns}>
                    <InfoCard
                      title="AUDITORÍA"
                      value={
                        reporteActual?.auditoria ||
                        "No hay información de auditoría."
                      }
                    />

                    <InfoCard
                      title="OBSERVACIONES"
                      value={
                        reporteActual?.observaciones ||
                        "No hay observaciones cargadas."
                      }
                    />
                  </div>
                </section>
              )}

              {pestana === "productividad" && (
                <section style={styles.tabContent}>
                  <SectionHeading
                    number="02"
                    title="PRODUCTIVIDAD"
                    subtitle="Seguimiento de productividad"
                  />

                  <div style={styles.metricGrid}>
                    <LargeMetric
                      title="SPH"
                      value={reporteActual?.sph || "-"}
                      extra={`Objetivo SPH: ${
                        reporteActual?.objetivo_sph || "-"
                      }`}
                    />

                    <LargeMetric
                      title="VENTAS"
                      value={reporteActual?.ventas || "-"}
                      extra={`Objetivo ventas: ${
                        reporteActual?.objetivo_ventas || "-"
                      }`}
                    />

                    <LargeMetric
                      title="OBJETIVO DE CAMPAÑA"
                      value={
                        reporteActual?.objetivo_campania || "-"
                      }
                      extra={
                        reporteActual?.estado_campania ||
                        "Sin estado"
                      }
                    />

                    <LargeMetric
                      title="ESTADO"
                      value={
                        reporteActual?.estado_campania ||
                        "En proceso"
                      }
                    />
                  </div>

                  <InfoCard
                    title="COMPARATIVO SEMANAL"
                    value={
                      reporteAnterior
                        ? "Comparativo disponible en el histórico."
                        : "Todavía no hay una semana anterior para comparar."
                    }
                  />

                  <div style={styles.twoColumns}>
                    <ListCard
                      title="ITEMS TRABAJADOS"
                      items={reporteActual?.items_productividad}
                      empty="No se registraron items de productividad."
                    />

                    <ListCard
                      title="ACCIONES REALIZADAS"
                      items={
                        reporteActual?.acciones_productividad
                      }
                      empty="No se registraron acciones."
                    />
                  </div>

                  <InfoCard
                    title="OBSERVACIONES"
                    value={
                      reporteActual?.observaciones_productividad ||
                      "No hay observaciones cargadas."
                    }
                  />
                </section>
              )}

              {pestana === "tipificaciones" && (
                <section style={styles.tabContent}>
                  <SectionHeading
                    number="03"
                    title="TIPIFICACIONES"
                    subtitle="Seguimiento de tipificaciones"
                  />

                  <div style={styles.statusLarge}>
                    {reporteActual?.estado_tipificaciones ||
                      "SIN ESTADO"}
                  </div>

                  <div style={styles.metricGrid}>
                    <LargeMetric
                      title="DESVÍO"
                      value={
                        reporteActual?.tipificacion_desvio ||
                        "-"
                      }
                    />

                    <LargeMetric
                      title="OBJETIVO"
                      value={
                        reporteActual?.tipificacion_objetivo ||
                        "-"
                      }
                    />

                    <LargeMetric
                      title="RESULTADO"
                      value={
                        reporteActual?.tipificacion_resultado ||
                        "-"
                      }
                    />
                  </div>

                  <ListCard
                    title="TIPIFICACIONES"
                    items={reporteActual?.tipificaciones}
                    empty="No se registraron tipificaciones."
                  />

                  <div style={styles.twoColumns}>
                    <InfoCard
                      title="COMPROMISO"
                      value={
                        reporteActual?.tipificacion_compromiso ||
                        "Sin compromiso cargado."
                      }
                    />

                    <InfoCard
                      title="OBSERVACIONES"
                      value={
                        reporteActual?.tipificacion_observaciones ||
                        "Sin observaciones cargadas."
                      }
                    />
                  </div>
                </section>
              )}

              {pestana === "auditorias" && (
                <section style={styles.tabContent}>
                  <SectionHeading
                    number="04"
                    title="AUDITORÍAS DE NO VENTAS"
                    subtitle="Seguimiento de oportunidades auditadas"
                  />

                  <div style={styles.metricGrid}>
                    <LargeMetric
                      title="CANTIDAD"
                      value={
                        reporteActual?.cantidad_no_ventas ||
                        "-"
                      }
                    />

                    <LargeMetric
                      title="COACHING"
                      value={
                        reporteActual?.coaching ||
                        "-"
                      }
                    />

                    <LargeMetric
                      title="REGISTRO EN SISTEMA"
                      value={
                        reporteActual?.registro_sistema ||
                        "-"
                      }
                    />

                    <LargeMetric
                      title="COMPROMISO"
                      value={
                        reporteActual?.compromiso_no_ventas ||
                        "-"
                      }
                    />
                  </div>

                  <div style={styles.twoColumns}>
                    <InfoCard
                      title="PRINCIPALES O.M."
                      value={
                        reporteActual?.principales_om ||
                        "No hay información cargada."
                      }
                    />

                    <InfoCard
                      title="FORTALEZAS"
                      value={
                        reporteActual?.fortalezas ||
                        "No hay fortalezas cargadas."
                      }
                    />
                  </div>

                  <InfoCard
                    title="OBSERVACIONES"
                    value={
                      reporteActual?.observaciones_no_ventas ||
                      "No hay observaciones cargadas."
                    }
                  />
                </section>
              )}

              {pestana === "actividades" && (
                <section style={styles.tabContent}>
                  <SectionHeading
                    number="05"
                    title="ACTIVIDADES"
                    subtitle="Espacio para futuras actividades"
                  />

                  <div style={styles.comingSoon}>
                    <div style={styles.plusIcon}>+</div>

                    <h2>Próximamente</h2>

                    <p>
                      Esta sección quedará disponible para
                      registrar y consultar actividades.
                    </p>
                  </div>
                </section>
              )}

              {pestana === "historico" && (
                <section style={styles.tabContent}>
                  <SectionHeading
                    number="06"
                    title="HISTÓRICO"
                    subtitle="Evolución de tus reportes"
                  />

                  {reportes.length <= 1 ? (
                    <div style={styles.emptyState}>
                      <div style={styles.emptyIcon}>○</div>

                      <h2>
                        Todavía no hay histórico disponible
                      </h2>

                      <p style={styles.muted}>
                        Cuando tengas más de un reporte,
                        vas a poder comparar tu evolución
                        semana a semana.
                      </p>
                    </div>
                  ) : (
                    <div style={styles.historyList}>
                      {reportes.map((reporte, index) => (
                        <div
                          key={reporte.id}
                          style={styles.historyRow}
                        >
                          <div style={styles.historyWeek}>
                            <span>
                              {index === 0
                                ? "ACTUAL"
                                : "ANTERIOR"}
                            </span>

                            <strong>
                              {reporte.semana || "-"}
                            </strong>
                          </div>

                          <div style={styles.historyScore}>
                            <span>NOTA</span>

                            <strong>
                              {reporte.nota || "-"}
                            </strong>
                          </div>

                          <div style={styles.historyProduct}>
                            <span>PRODUCTO</span>

                            <strong>
                              {reporte.producto || "-"}
                            </strong>
                          </div>

                          <div>
                            <div
                              style={estadoBadge(
                                reporte.estado_objetivo
                              )}
                            >
                              {reporte.estado_objetivo ||
                                "SIN ESTADO"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {pestana === "feedback" && (
                <section style={styles.tabContent}>
                  <SectionHeading
                    number="07"
                    title="FEEDBACK DEL ASESOR"
                    subtitle="Tu opinión también forma parte del seguimiento"
                  />

                  <div style={styles.feedbackCard}>
                    <h2>
                      ¿Querés dejar algún comentario?
                    </h2>

                    <p style={styles.muted}>
                      Podés escribir una consulta, comentario
                      sobre tu reporte o algo que quieras
                      trabajar con Calidad.
                    </p>

                    <textarea
                      value={feedback}
                      onChange={(e) =>
                        setFeedback(e.target.value)
                      }
                      placeholder="Escribí tu comentario..."
                      style={styles.feedbackTextarea}
                    />

                    <button
                      onClick={enviarFeedback}
                      disabled={!feedback.trim()}
                      style={{
                        ...styles.primaryButton,
                        width: "auto",
                        minWidth: "180px",
                        opacity: feedback.trim() ? 1 : 0.5,
                      }}
                    >
                      ENVIAR FEEDBACK
                    </button>

                    {feedbackEnviado && (
                      <div style={styles.success}>
                        ✓ FEEDBACK ENVIADO CORRECTAMENTE
                      </div>
                    )}
                  </div>
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

function Tab({ active, onClick, number, title }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.tab,
        ...(active ? styles.tabActive : {}),
      }}
    >
      <span style={styles.tabNumber}>{number}</span>
      <span>{title}</span>
    </button>
  );
}

function SectionHeading({ number, title, subtitle }) {
  return (
    <div style={styles.sectionHeading}>
      <div style={styles.sectionNumber}>{number}</div>

      <div>
        <div style={styles.sectionEyebrow}>
          PORTAL DE CALIDAD
        </div>

        <h2 style={styles.sectionTitle}>
          {title}
        </h2>

        <p style={styles.sectionSubtitle}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function SmallMetric({ title, value }) {
  return (
    <div style={styles.smallMetric}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LargeMetric({ title, value, extra }) {
  return (
    <div style={styles.largeMetric}>
      <div style={styles.largeMetricTitle}>
        {title}
      </div>

      <div style={styles.largeMetricValue}>
        {value}
      </div>

      {extra && (
        <div style={styles.largeMetricExtra}>
          {extra}
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, value, variant }) {
  return (
    <div
      style={{
        ...styles.infoCard,
        ...(variant === "attention"
          ? styles.attentionCard
          : {}),
      }}
    >
      <div style={styles.infoCardTitle}>{title}</div>

      <div style={styles.infoCardValue}>
        {value}
      </div>
    </div>
  );
}

function ListCard({ title, items, empty }) {
  return (
    <div style={styles.infoCard}>
      <div style={styles.infoCardTitle}>{title}</div>

      <ArrayList items={items} empty={empty} />
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
          {item}
        </li>
      ))}
    </ul>
  );
}

function numero(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  const numeroConvertido = Number(
    String(valor).replace("%", "").replace(",", ".").trim()
  );

  return Number.isNaN(numeroConvertido)
    ? null
    : numeroConvertido;
}

function nombreAsesor(nombreCompleto) {
  if (!nombreCompleto) return "asesor/a";

  const partes = nombreCompleto.split(",");

  if (partes.length > 1) {
    return partes[1].trim();
  }

  return nombreCompleto;
}

function estadoBadge(estado) {
  const texto = String(estado || "").toLowerCase();

  if (
    texto.includes("debajo") ||
    texto.includes("desvío") ||
    texto.includes("desvio")
  ) {
    return styles.badgeRed;
  }

  if (
    texto.includes("objetivo") ||
    texto.includes("cumple")
  ) {
    return styles.badgeGreen;
  }

  return styles.badgeOrange;
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #edf5f6 0%, #f7fafb 50%, #e8f1f3 100%)",
    color: "#18333b",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px 70px",
    boxSizing: "border-box",
  },

  centerBox: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  loadingCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(24, 51, 59, 0.12)",
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
    boxShadow: "0 25px 70px rgba(24, 51, 59, 0.14)",
    border: "1px solid #dce9eb",
    boxSizing: "border-box",
  },

  logo: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #0e5965 0%, #17414a 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "22px",
  },

  loginEyebrow: {
    color: "#0e5965",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "8px",
  },

  loginTitle: {
    fontSize: "32px",
    margin: 0,
    color: "#18333b",
  },

  muted: {
    color: "#71828a",
    lineHeight: 1.6,
  },

  error: {
    background: "#fff1f1",
    color: "#b42318",
    border: "1px solid #f5c2c0",
    padding: "12px",
    borderRadius: "11px",
    margin: "18px 0",
    fontSize: "14px",
  },

  label: {
    display: "block",
    fontWeight: "700",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#304c54",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #cbdadd",
    background: "#ffffff",
    color: "#18333b",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "105px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #cbdadd",
    background: "#ffffff",
    color: "#18333b",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
  },

  primaryButton: {
    border: "none",
    borderRadius: "11px",
    padding: "14px 22px",
    background:
      "linear-gradient(135deg, #0e5965 0%, #17414a 100%)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "22px",
    letterSpacing: "0.3px",
  },

  secondaryButton: {
    border: "1px solid #cbdadd",
    borderRadius: "11px",
    padding: "12px 18px",
    background: "#ffffff",
    color: "#31515a",
    fontWeight: "700",
    cursor: "pointer",
  },

  portalBadge: {
    display: "inline-block",
    background: "#0e5965",
    color: "#ffffff",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  adminHeader: {
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
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  pageTitle: {
    margin: "9px 0 0",
    fontSize: "30px",
    color: "#18333b",
  },

  advisorGreeting: {
    margin: "12px 0 4px",
    fontSize: "34px",
    letterSpacing: "-0.6px",
    color: "#18333b",
  },

  weekText: {
    color: "#637980",
    fontSize: "15px",
    fontWeight: "600",
  },

  adminHero: {
    background:
      "linear-gradient(135deg, #0e5965 0%, #173f48 100%)",
    color: "#ffffff",
    borderRadius: "25px",
    padding: "34px",
    marginBottom: "22px",
    boxShadow: "0 18px 45px rgba(14, 89, 101, 0.2)",
  },

  heroEyebrow: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.4px",
    opacity: 0.75,
    marginBottom: "7px",
  },

  adminHeroTitle: {
    margin: 0,
    fontSize: "30px",
  },

  adminHeroText: {
    margin: "9px 0 0",
    opacity: 0.82,
  },

  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    marginBottom: "22px",
    border: "1px solid #dce7e9",
    boxShadow: "0 12px 35px rgba(24, 51, 59, 0.07)",
  },

  tabs: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(135px, 1fr))",
    gap: "9px",
    padding: "9px",
    background: "#ffffff",
    border: "1px solid #d8e5e7",
    borderRadius: "18px",
    marginBottom: "24px",
    boxShadow: "0 8px 25px rgba(24, 51, 59, 0.06)",
  },

  tab: {
    border: "none",
    borderRadius: "12px",
    background: "transparent",
    color: "#61777e",
    padding: "13px 10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minHeight: "48px",
    transition: "all 0.2s ease",
  },

  tabActive: {
    background: "#0e5965",
    color: "#ffffff",
    boxShadow: "0 5px 15px rgba(14, 89, 101, 0.2)",
  },

  tabNumber: {
    fontSize: "10px",
    opacity: 0.65,
  },

  tabContent: {
    animation: "none",
  },

  sectionHeading: {
    display: "flex",
    alignItems: "center",
    gap: "17px",
    marginBottom: "25px",
  },

  sectionNumber: {
    width: "48px",
    height: "48px",
    borderRadius: "15px",
    background: "#dceff1",
    color: "#0e5965",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "13px",
    flexShrink: 0,
  },

  sectionEyebrow: {
    color: "#0e5965",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.4px",
    marginBottom: "4px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "26px",
    letterSpacing: "-0.3px",
    color: "#18333b",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#71828a",
    fontSize: "14px",
  },

  scorePanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    padding: "30px",
    borderRadius: "21px",
    background:
      "linear-gradient(135deg, #0e5965 0%, #1c4d56 100%)",
    color: "#ffffff",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  scoreLabel: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    opacity: 0.75,
  },

  bigScore: {
    fontSize: "54px",
    fontWeight: "900",
    lineHeight: 1,
    marginTop: "8px",
  },

  bigScoreSpan: {
    fontSize: "18px",
  },

  scoreDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(130px, 1fr))",
    gap: "10px",
  },

  smallMetric: {
    minWidth: "120px",
    padding: "15px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.1)",
  },

  smallMetricSpan: {
    fontSize: "10px",
  },

  smallMetricStrong: {
    display: "block",
  },

  progressCard: {
    background: "#ffffff",
    border: "1px solid #dce7e9",
    borderRadius: "18px",
    padding: "21px",
    marginBottom: "18px",
  },

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "10px",
    color: "#506870",
    fontSize: "13px",
    fontWeight: "700",
  },

  progressTrack: {
    height: "11px",
    background: "#e2edef",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #0e5965 0%, #41a5a8 100%)",
    borderRadius: "999px",
  },

  progressBottom: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginTop: "12px",
    color: "#74868c",
    fontSize: "12px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "17px",
    marginBottom: "17px",
  },

  infoCard: {
    background: "#ffffff",
    border: "1px solid #dce7e9",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 7px 22px rgba(24, 51, 59, 0.045)",
  },

  attentionCard: {
    background: "#fffaf0",
    border: "1px solid #f0d89d",
  },

  infoCardTitle: {
    color: "#0e5965",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1px",
    marginBottom: "12px",
  },

  infoCardValue: {
    color: "#29454d",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  metricGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "15px",
    marginBottom: "18px",
  },

  largeMetric: {
    background: "#f5f9fa",
    border: "1px solid #dce7e9",
    borderRadius: "17px",
    padding: "20px",
  },

  largeMetricTitle: {
    color: "#71828a",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.8px",
    marginBottom: "9px",
  },

  largeMetricValue: {
    color: "#0e5965",
    fontSize: "27px",
    fontWeight: "900",
  },

  largeMetricExtra: {
    color: "#71828a",
    fontSize: "12px",
    marginTop: "7px",
  },

  statusLarge: {
    display: "inline-block",
    padding: "10px 17px",
    borderRadius: "999px",
    background: "#fff4d6",
    color: "#855d00",
    border: "1px solid #efd38b",
    fontWeight: "800",
    fontSize: "12px",
    marginBottom: "18px",
  },

  list: {
    margin: 0,
    paddingLeft: "20px",
  },

  listItem: {
    marginBottom: "9px",
    lineHeight: 1.5,
    color: "#304c54",
  },

  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },

  emptyIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#e5f1f2",
    color: "#0e5965",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
    fontSize: "28px",
  },

  comingSoon: {
    textAlign: "center",
    padding: "75px 20px",
    border: "2px dashed #cbdde0",
    borderRadius: "22px",
    background: "#f8fbfb",
  },

  plusIcon: {
    width: "62px",
    height: "62px",
    borderRadius: "50%",
    background: "#dceff1",
    color: "#0e5965",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    margin: "0 auto 17px",
    fontWeight: "300",
  },

  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  historyRow: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr 1.5fr",
    alignItems: "center",
    gap: "15px",
    padding: "18px",
    borderRadius: "16px",
    background: "#f6fafb",
    border: "1px solid #dce7e9",
  },

  historyWeek: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  historyScore: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  historyProduct: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  feedbackCard: {
    maxWidth: "800px",
    background: "#ffffff",
    border: "1px solid #dce7e9",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(24, 51, 59, 0.06)",
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "190px",
    boxSizing: "border-box",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #cbdadd",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "15px",
    resize: "vertical",
    color: "#18333b",
    outline: "none",
    marginTop: "12px",
  },

  badgeRed: {
    display: "inline-block",
    background: "#fff0ef",
    color: "#b42318",
    border: "1px solid #f3c4c0",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
  },

  badgeGreen: {
    display: "inline-block",
    background: "#eaf8f1",
    color: "#087443",
    border: "1px solid #b7e4cd",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
  },

  badgeOrange: {
    display: "inline-block",
    background: "#fff5df",
    color: "#875d00",
    border: "1px solid #efd59a",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
  },

  tipificacionAdmin: {
    background: "#f5f9fa",
    border: "1px solid #dce7e9",
    borderRadius: "17px",
    padding: "22px",
    marginTop: "25px",
    marginBottom: "10px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#18333b",
  },

  sectionDescription: {
    color: "#71828a",
    marginTop: "7px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "5px 18px",
  },

  success: {
    background: "#eaf8f1",
    color: "#087443",
    border: "1px solid #b7e4cd",
    padding: "13px",
    borderRadius: "11px",
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
    background: "#edf5f6",
    borderBottom: "1px solid #d5e2e4",
    fontSize: "12px",
    color: "#31515a",
  },

  td: {
    padding: "13px",
    borderBottom: "1px solid #e7edef",
    fontSize: "14px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  primaryButtonFull: {
    width: "100%",
  },
};
