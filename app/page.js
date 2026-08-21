"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ADMIN_EMAIL = "ayelenvillega42@gmail.com";
const AUDIO_BUCKET = "audios";

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

const formularioInicial = {
  usuario: "",
  semana: "",

  // CALIDAD
  nota: "",
  objetivo_calidad: "",
  estado_objetivo: "",
  producto: "",
  desvio: "",
  comparativo_calidad: "",
  items_calidad: "",
  acciones_calidad: "",
  auditoria: "",
  observaciones: "",

  // PRODUCTIVIDAD
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

  // TIPIFICACIONES
  tipificaciones: "",
  objetivo_tipificaciones: "",
  estado_tipificaciones: "",
  tipificacion_desvio: "",
  tipificacion_objetivo: "",
  tipificacion_resultado: "",
  tipificacion_compromiso: "",
  tipificacion_observaciones: "",

  // AUDITORÍAS DE NO VENTAS
  auditoria_no_ventas_cantidad: "",
  auditoria_no_ventas_om: "",
  auditoria_no_ventas_coaching: "",
  auditoria_no_ventas_sistema: "",
  auditoria_no_ventas_compromiso: "",
  auditoria_no_ventas_fortalezas: "",
  auditoria_no_ventas_observaciones: "",
};

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

  const [form, setForm] = useState(formularioInicial);
  const [audioFile, setAudioFile] = useState(null);

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
  }

  function cambiarFormulario(e) {
    const { name, value } = e.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function limpiarFormulario() {
    setForm(formularioInicial);
    setAudioFile(null);

    const inputAudio = document.getElementById("audio-file");

    if (inputAudio) {
      inputAudio.value = "";
    }
  }

  function convertirLista(texto) {
    return (texto || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
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

    let audioUrl = null;

    // SUBIR AUDIO
    if (audioFile) {
      const extension =
        audioFile.name.split(".").pop() || "mp3";

      const nombreArchivo =
        `${form.usuario}-${Date.now()}.${extension}`;

      const { error: audioError } = await supabase.storage
        .from(AUDIO_BUCKET)
        .upload(nombreArchivo, audioFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (audioError) {
        console.error(audioError);

        setMensajeAdmin(
          "No se pudo subir el audio. Verificá que exista el bucket 'audios' en Supabase Storage."
        );

        setGuardando(false);
        return;
      }

      const { data: publicData } = supabase.storage
        .from(AUDIO_BUCKET)
        .getPublicUrl(nombreArchivo);

      audioUrl = publicData?.publicUrl || null;
    }

    const nuevoReporte = {
      usuario: form.usuario,
      semana: form.semana,

      // CALIDAD
      nota: form.nota || null,
      objetivo_calidad: form.objetivo_calidad || null,
      estado_objetivo: form.estado_objetivo || null,
      producto: form.producto || null,
      desvio: form.desvio || null,
      comparativo_calidad:
        form.comparativo_calidad || null,
      items_calidad: convertirLista(form.items_calidad),
      acciones_calidad: convertirLista(
        form.acciones_calidad
      ),
      auditoria: form.auditoria || null,
      audio_url: audioUrl,
      observaciones: form.observaciones || null,

      // PRODUCTIVIDAD
      sph: form.sph || null,
      objetivo_sph: form.objetivo_sph || null,
      ventas: form.ventas || null,
      objetivo_ventas: form.objetivo_ventas || null,
      objetivo_campania:
        form.objetivo_campania || null,
      estado_campania:
        form.estado_campania || null,
      comparativo_productividad:
        form.comparativo_productividad || null,
      items_productividad: convertirLista(
        form.items_productividad
      ),
      acciones_productividad: convertirLista(
        form.acciones_productividad
      ),
      observaciones_productividad:
        form.observaciones_productividad || null,

      // TIPIFICACIONES
      tipificaciones: convertirLista(
        form.tipificaciones
      ),
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

      // AUDITORÍAS DE NO VENTAS
      auditoria_no_ventas_cantidad:
        form.auditoria_no_ventas_cantidad || null,
      auditoria_no_ventas_om:
        form.auditoria_no_ventas_om || null,
      auditoria_no_ventas_coaching:
        form.auditoria_no_ventas_coaching || null,
      auditoria_no_ventas_sistema:
        form.auditoria_no_ventas_sistema || null,
      auditoria_no_ventas_compromiso:
        form.auditoria_no_ventas_compromiso || null,
      auditoria_no_ventas_fortalezas:
        form.auditoria_no_ventas_fortalezas || null,
      auditoria_no_ventas_observaciones:
        form.auditoria_no_ventas_observaciones ||
        null,
    };

    const { error } = await supabase
      .from("reportes")
      .insert([nuevoReporte]);

    if (error) {
      console.error(error);

      setMensajeAdmin(
        "No se pudo guardar el reporte. Revisá las columnas de la tabla reportes en Supabase."
      );

      setGuardando(false);
      return;
    }

    setMensajeAdmin(
      "✓ REPORTE GUARDADO CORRECTAMENTE"
    );

    limpiarFormulario();

    await cargarReportesAdmin();

    setGuardando(false);
  }

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
          <div style={styles.card}>
            <h2>Portal de Calidad</h2>
            <p style={styles.muted}>
              Verificando acceso...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // LOGIN
  // =========================

  if (modo === "login") {
    return (
      <main style={styles.page}>
        <div style={styles.loginContainer}>
          <div style={styles.loginCard}>
            <div style={styles.logo}>✓</div>

            <div style={styles.portalBadge}>
              PORTAL DE CALIDAD
            </div>

            <h1 style={styles.loginTitle}>
              Bienvenido/a
            </h1>

            <p style={styles.muted}>
              Ingresá con tu email y contraseña
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
                  opacity: entrando ? 0.6 : 1,
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

  // =========================
  // ADMINISTRADOR
  // =========================

  if (modo === "admin") {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div>
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.mainTitle}>
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
                Toda la información que cargues acá
                aparecerá automáticamente en el
                panel del asesor.
              </p>
            </div>
          </section>

          <form onSubmit={guardarReporte}>
            {/* DATOS GENERALES */}

            <section style={styles.card}>
              <SectionHeading
                number="01"
                title="DATOS GENERALES"
              />

              <div style={styles.formGrid}>
                <Field
                  label="Asesor"
                  name="usuario"
                  value={form.usuario}
                  onChange={cambiarFormulario}
                  type="select"
                  required
                  options={asesores.map(
                    (asesor) => ({
                      value: asesor[1],
                      label: `${asesor[0]} — ${asesor[1]}`,
                    })
                  )}
                />

                <Field
                  label="Semana / período"
                  name="semana"
                  value={form.semana}
                  onChange={cambiarFormulario}
                  placeholder="Ej: Semana 3 - Agosto"
                  required
                />
              </div>
            </section>

            {/* CALIDAD */}

            <section style={styles.card}>
              <SectionHeading
                number="02"
                title="CALIDAD"
              />

              <div style={styles.formGrid}>
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
                  placeholder="Ej: DEBAJO DEL OBJETIVO"
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
                placeholder="Ej: Validación de datos"
                textarea
              />

              <Field
                label="Comparativo semanal"
                name="comparativo_calidad"
                value={form.comparativo_calidad}
                onChange={cambiarFormulario}
                placeholder="Ej: La semana anterior fue 45. Esta semana subió a 50."
                textarea
              />

              <Field
                label="Items trabajados"
                name="items_calidad"
                value={form.items_calidad}
                onChange={cambiarFormulario}
                placeholder={
                  "Un item por línea.\nEj:\nValidación de datos\nCláusula de aceptación\nInformación"
                }
                textarea
              />

              <Field
                label="Acciones realizadas"
                name="acciones_calidad"
                value={form.acciones_calidad}
                onChange={cambiarFormulario}
                placeholder={
                  "Una acción por línea.\nEj:\nFeedback individual\nEspacio de coaching\nTranscripción de venta"
                }
                textarea
              />

              <div style={styles.subCard}>
                <h3 style={styles.subTitle}>
                  Auditoría
                </h3>

                <Field
                  label="Referencia de auditoría"
                  name="auditoria"
                  value={form.auditoria}
                  onChange={cambiarFormulario}
                  placeholder="Ej: Llamada 15482"
                />

                <label style={styles.label}>
                  Audio de la llamada
                </label>

                <input
                  id="audio-file"
                  type="file"
                  accept="audio/*"
                  onChange={(e) =>
                    setAudioFile(
                      e.target.files?.[0] || null
                    )
                  }
                  style={styles.fileInput}
                />

                {audioFile && (
                  <div style={styles.fileSelected}>
                    ✓ {audioFile.name}
                  </div>
                )}
              </div>

              <Field
                label="Observaciones"
                name="observaciones"
                value={form.observaciones}
                onChange={cambiarFormulario}
                placeholder="Observaciones de calidad..."
                textarea
              />
            </section>

            {/* PRODUCTIVIDAD */}

            <section style={styles.card}>
              <SectionHeading
                number="03"
                title="PRODUCTIVIDAD"
              />

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
                  label="Estado"
                  name="estado_campania"
                  value={form.estado_campania}
                  onChange={cambiarFormulario}
                  placeholder="Ej: En proceso"
                />
              </div>

              <Field
                label="Comparativo semanal"
                name="comparativo_productividad"
                value={form.comparativo_productividad}
                onChange={cambiarFormulario}
                placeholder="Comparativo con la semana anterior..."
                textarea
              />

              <Field
                label="Items trabajados"
                name="items_productividad"
                value={form.items_productividad}
                onChange={cambiarFormulario}
                placeholder={
                  "Un item por línea.\nEj:\nCierre con seguridad comercial\nOfrecimiento\nRebate comercial"
                }
                textarea
              />

              <Field
                label="Acciones realizadas"
                name="acciones_productividad"
                value={form.acciones_productividad}
                onChange={cambiarFormulario}
                placeholder={
                  "Una acción por línea.\nEj:\nSimulación de llamada\nAcompañamiento en línea\nDevolución personalizada"
                }
                textarea
              />

              <Field
                label="Observaciones"
                name="observaciones_productividad"
                value={form.observaciones_productividad}
                onChange={cambiarFormulario}
                placeholder="Observaciones de productividad..."
                textarea
              />
            </section>

            {/* TIPIFICACIONES */}

            <section style={styles.card}>
              <SectionHeading
                number="04"
                title="TIPIFICACIONES"
              />

              <Field
                label="Tipificaciones realizadas"
                name="tipificaciones"
                value={form.tipificaciones}
                onChange={cambiarFormulario}
                placeholder={
                  "Una tipificación por línea.\nEj:\nNo conforme con sumas aseguradas\nNo interesado - Producto\nProblemas económicos"
                }
                textarea
              />

              <div style={styles.formGrid}>
                <Field
                  label="Indicador / Estado"
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
                  label="Objetivo de tipificaciones"
                  name="objetivo_tipificaciones"
                  value={form.objetivo_tipificaciones}
                  onChange={cambiarFormulario}
                  placeholder="Ej: 4"
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
                label="Observaciones"
                name="tipificacion_observaciones"
                value={form.tipificacion_observaciones}
                onChange={cambiarFormulario}
                placeholder="Observaciones de tipificaciones..."
                textarea
              />
            </section>

            {/* AUDITORIAS DE NO VENTAS */}

            <section style={styles.card}>
              <SectionHeading
                number="05"
                title="AUDITORÍAS DE NO VENTAS"
              />

              <div style={styles.formGrid}>
                <Field
                  label="Cantidad"
                  name="auditoria_no_ventas_cantidad"
                  value={
                    form.auditoria_no_ventas_cantidad
                  }
                  onChange={cambiarFormulario}
                  placeholder="Ej: 5"
                />

                <Field
                  label="Registro en sistema"
                  name="auditoria_no_ventas_sistema"
                  value={
                    form.auditoria_no_ventas_sistema
                  }
                  onChange={cambiarFormulario}
                  placeholder="Ej: CORRECTA"
                />

                <Field
                  label="Compromiso"
                  name="auditoria_no_ventas_compromiso"
                  value={
                    form.auditoria_no_ventas_compromiso
                  }
                  onChange={cambiarFormulario}
                  placeholder="Ej: APLICA DEVOLUCIÓN"
                />

                <Field
                  label="Coaching"
                  name="auditoria_no_ventas_coaching"
                  value={
                    form.auditoria_no_ventas_coaching
                  }
                  onChange={cambiarFormulario}
                  placeholder="Ej: Realizado"
                />
              </div>

              <Field
                label="Principales O.M."
                name="auditoria_no_ventas_om"
                value={form.auditoria_no_ventas_om}
                onChange={cambiarFormulario}
                placeholder="Generación de interés, Cambio apertura, Escucha activa..."
                textarea
              />

              <Field
                label="Fortalezas"
                name="auditoria_no_ventas_fortalezas"
                value={
                  form.auditoria_no_ventas_fortalezas
                }
                onChange={cambiarFormulario}
                placeholder="Adaptabilidad, Buena detección de necesidad..."
                textarea
              />

              <Field
                label="Observaciones"
                name="auditoria_no_ventas_observaciones"
                value={
                  form.auditoria_no_ventas_observaciones
                }
                onChange={cambiarFormulario}
                placeholder="Observaciones..."
                textarea
              />
            </section>

            {/* ACTIVIDADES */}

            <section style={styles.card}>
              <SectionHeading
                number="06"
                title="ACTIVIDADES"
              />

              <div style={styles.emptyActivity}>
                <div style={styles.plusCircle}>
                  +
                </div>

                <h3>
                  Próximamente
                </h3>

                <p>
                  Esta sección queda preparada para
                  registrar y consultar actividades.
                </p>
              </div>
            </section>

            {/* GUARDAR */}

            <button
              type="submit"
              disabled={guardando}
              style={{
                ...styles.saveButton,
                opacity: guardando ? 0.6 : 1,
              }}
            >
              {guardando
                ? "GUARDANDO REPORTE..."
                : "GUARDAR REPORTE"}
            </button>

            {mensajeAdmin && (
              <div
                style={{
                  ...styles.success,
                  marginTop: "18px",
                  marginBottom: "25px",
                }}
              >
                {mensajeAdmin}
              </div>
            )}
          </form>

          {/* HISTORIAL */}

          <section style={styles.card}>
            <SectionHeading
              number="07"
              title="HISTÓRICO"
            />

            <h2 style={styles.historyTitle}>
              Reportes cargados
            </h2>

            {cargandoAdmin ? (
              <p style={styles.muted}>
                Cargando reportes...
              </p>
            ) : adminReportes.length === 0 ? (
              <p style={styles.muted}>
                Todavía no hay reportes cargados.
              </p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>
                        Asesor
                      </th>
                      <th style={styles.th}>
                        Semana
                      </th>
                      <th style={styles.th}>
                        Nota
                      </th>
                      <th style={styles.th}>
                        Producto
                      </th>
                      <th style={styles.th}>
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {adminReportes.map(
                      (reporte) => {
                        const asesor =
                          asesores.find(
                            (item) =>
                              item[1] ===
                              reporte.usuario
                          );

                        return (
                          <tr key={reporte.id}>
                            <td style={styles.td}>
                              {asesor
                                ? asesor[0]
                                : reporte.usuario}
                            </td>

                            <td style={styles.td}>
                              {reporte.semana ||
                                "-"}
                            </td>

                            <td style={styles.td}>
                              {reporte.nota ||
                                "-"}
                            </td>

                            <td style={styles.td}>
                              {reporte.producto ||
                                "-"}
                            </td>

                            <td style={styles.td}>
                              {reporte.estado_objetivo ||
                                "-"}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  // =========================
  // ASESOR
  // =========================

  if (modo === "asesor") {
    const reporteActual = reportes[0];

    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.headerAdvisor}>
            <div>
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.advisorTitle}>
                Hola,{" "}
                {asesorActual?.[0]
                  ?.split(",")[1]
                  ?.trim() ||
                  asesorActual?.[0]}
              </h1>

              <p style={styles.advisorWeek}>
                {reporteActual?.semana ||
                  "Sin reporte disponible"}
              </p>
            </div>

            <div style={styles.headerRight}>
              <div
                style={{
                  ...styles.generalStatus,
                  ...(estadoEsPositivo(
                    reporteActual?.estado_objetivo
                  )
                    ? styles.statusPositive
                    : styles.statusAttention),
                }}
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

          {cargandoReportes ? (
            <div style={styles.card}>
              <h2>
                Cargando información...
              </h2>
            </div>
          ) : reportes.length === 0 ? (
            <div style={styles.card}>
              <h2>
                Todavía no hay reportes
              </h2>

              <p style={styles.muted}>
                Cuando Calidad cargue tu primer
                reporte semanal, vas a poder verlo
                desde acá.
              </p>
            </div>
          ) : (
            <AdvisorPortal
              reporteActual={reporteActual}
              reportes={reportes}
              asesorActual={asesorActual}
              cerrarSesion={cerrarSesion}
            />
          )}
        </div>
      </main>
    );
  }

  return null;
}

/* =====================================================
   PORTAL DEL ASESOR
===================================================== */

function AdvisorPortal({
  reporteActual,
  reportes,
  cerrarSesion,
}) {
  const [pestana, setPestana] = useState("calidad");
  const [feedback, setFeedback] = useState("");
  const [enviandoFeedback, setEnviandoFeedback] =
    useState(false);
  const [mensajeFeedback, setMensajeFeedback] =
    useState("");

  const objetivo = numero(
    reporteActual?.objetivo_calidad
  );
  const nota = numero(reporteActual?.nota);

  const falta =
    objetivo !== null && nota !== null
      ? Math.max(objetivo - nota, 0)
      : null;

  const progreso =
    objetivo !== null &&
    objetivo > 0 &&
    nota !== null
      ? Math.min(
          Math.round((nota / objetivo) * 100),
          100
        )
      : null;

  async function enviarFeedback() {
    if (!feedback.trim()) return;

    setEnviandoFeedback(true);
    setMensajeFeedback("");

    const { error } = await supabase
      .from("feedback_asesores")
      .insert([
        {
          usuario: reporteActual.usuario,
          reporte_id: reporteActual.id,
          feedback: feedback.trim(),
        },
      ]);

    if (error) {
      console.error(error);

      setMensajeFeedback(
        "No se pudo enviar el feedback."
      );
    } else {
      setMensajeFeedback(
        "✓ Feedback enviado correctamente."
      );
      setFeedback("");
    }

    setEnviandoFeedback(false);
  }

  return (
    <>
      {/* NAVEGACIÓN */}

      <nav style={styles.tabs}>
        <Tab
          active={pestana === "calidad"}
          onClick={() => setPestana("calidad")}
          number="01"
          title="CALIDAD"
        />

        <Tab
          active={pestana === "productividad"}
          onClick={() =>
            setPestana("productividad")
          }
          number="02"
          title="PRODUCTIVIDAD"
        />

        <Tab
          active={pestana === "tipificaciones"}
          onClick={() =>
            setPestana("tipificaciones")
          }
          number="03"
          title="TIPIFICACIONES"
        />

        <Tab
          active={pestana === "auditorias"}
          onClick={() =>
            setPestana("auditorias")
          }
          number="04"
          title="AUDITORÍAS"
        />

        <Tab
          active={pestana === "actividades"}
          onClick={() =>
            setPestana("actividades")
          }
          number="05"
          title="ACTIVIDADES"
        />

        <Tab
          active={pestana === "historico"}
          onClick={() =>
            setPestana("historico")
          }
          number="06"
          title="HISTÓRICO"
        />
      </nav>

      {/* CALIDAD */}

      {pestana === "calidad" && (
        <section>
          <SectionHeading
            number="01"
            title="CALIDAD"
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
              <MiniMetric
                title="OBJETIVO"
                value={
                  reporteActual?.objetivo_calidad ||
                  "-"
                }
              />

              <MiniMetric
                title="ESTADO"
                value={
                  reporteActual?.estado_objetivo ||
                  "-"
                }
              />

              <MiniMetric
                title="PRODUCTO"
                value={
                  reporteActual?.producto ||
                  "-"
                }
              />
            </div>
          </div>

          {progreso !== null && (
            <div style={styles.progressCard}>
              <div style={styles.progressHeader}>
                <strong>
                  Progreso hacia el objetivo
                </strong>

                <strong>
                  {progreso}%
                </strong>
              </div>

              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${progreso}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div style={styles.twoColumn}>
            <InfoCard
              title="CUÁNTO FALTA PARA ALCANZAR EL OBJETIVO"
              value={
                falta !== null
                  ? `${falta} puntos`
                  : "-"
              }
            />

            <InfoCard
              title="DESVÍO PRINCIPAL"
              value={
                reporteActual?.desvio ||
                "No hay desvío cargado."
              }
            />
          </div>

          <ContentCard title="COMPARATIVO SEMANAL">
            <p style={styles.contentText}>
              {reporteActual?.comparativo_calidad ||
                "Todavía no hay una semana anterior para comparar."}
            </p>
          </ContentCard>

          <div style={styles.twoColumn}>
            <ContentCard title="ITEMS TRABAJADOS">
              <ArrayList
                items={reporteActual?.items_calidad}
                empty="No se registraron items."
              />
            </ContentCard>

            <ContentCard title="ACCIONES REALIZADAS">
              <ArrayList
                items={
                  reporteActual?.acciones_calidad
                }
                empty="No se registraron acciones."
              />
            </ContentCard>
          </div>

          <ContentCard title="AUDITORÍA">
            {reporteActual?.auditoria ? (
              <div style={styles.auditReference}>
                <strong>Referencia:</strong>{" "}
                {reporteActual.auditoria}
              </div>
            ) : (
              <p style={styles.muted}>
                No hay información de auditoría.
              </p>
            )}

            {reporteActual?.audio_url && (
              <div style={styles.audioPlayer}>
                <strong>
                  Escuchar llamada auditada
                </strong>

                <audio
                  controls
                  src={reporteActual.audio_url}
                  style={{
                    width: "100%",
                    marginTop: "12px",
                  }}
                />
              </div>
            )}
          </ContentCard>

          <ContentCard title="OBSERVACIONES">
            <p style={styles.contentText}>
              {reporteActual?.observaciones ||
                "No hay observaciones cargadas."}
            </p>
          </ContentCard>
        </section>
      )}

      {/* PRODUCTIVIDAD */}

      {pestana === "productividad" && (
        <section>
          <SectionHeading
            number="02"
            title="PRODUCTIVIDAD"
          />

          <div style={styles.productivityGrid}>
            <Metric
              title="SPH"
              value={reporteActual?.sph || "-"}
              extra={`Objetivo SPH: ${
                reporteActual?.objetivo_sph ||
                "-"
              }`}
            />

            <Metric
              title="VENTAS"
              value={reporteActual?.ventas || "-"}
              extra={`Objetivo ventas: ${
                reporteActual?.objetivo_ventas ||
                "-"
              }`}
            />

            <Metric
              title="OBJETIVO DE CAMPAÑA"
              value={
                reporteActual?.objetivo_campania ||
                "-"
              }
              extra={
                reporteActual?.estado_campania ||
                ""
              }
            />

            <Metric
              title="ESTADO"
              value={
                reporteActual?.estado_campania ||
                "-"
              }
            />
          </div>

          <ContentCard title="COMPARATIVO SEMANAL">
            <p style={styles.contentText}>
              {reporteActual?.comparativo_productividad ||
                "Todavía no hay una semana anterior para comparar."}
            </p>
          </ContentCard>

          <div style={styles.twoColumn}>
            <ContentCard title="ITEMS TRABAJADOS">
              <ArrayList
                items={
                  reporteActual?.items_productividad
                }
                empty="No se registraron items."
              />
            </ContentCard>

            <ContentCard title="ACCIONES REALIZADAS">
              <ArrayList
                items={
                  reporteActual?.acciones_productividad
                }
                empty="No se registraron acciones."
              />
            </ContentCard>
          </div>

          <ContentCard title="OBSERVACIONES">
            <p style={styles.contentText}>
              {reporteActual?.observaciones_productividad ||
                "No hay observaciones cargadas."}
            </p>
          </ContentCard>
        </section>
      )}

      {/* TIPIFICACIONES */}

      {pestana === "tipificaciones" && (
        <section>
          <SectionHeading
            number="03"
            title="TIPIFICACIONES"
          />

          <div style={styles.statusLarge}>
            {reporteActual?.estado_tipificaciones ||
              "Sin estado"}
          </div>

          <div style={styles.productivityGrid}>
            <Metric
              title="DESVÍO"
              value={
                reporteActual?.tipificacion_desvio ||
                "-"
              }
            />

            <Metric
              title="OBJETIVO"
              value={
                reporteActual?.tipificacion_objetivo ||
                "-"
              }
            />

            <Metric
              title="RESULTADO"
              value={
                reporteActual?.tipificacion_resultado ||
                "-"
              }
            />
          </div>

          <ContentCard title="TIPIFICACIONES">
            <ArrayList
              items={reporteActual?.tipificaciones}
              empty="No se registraron tipificaciones."
            />
          </ContentCard>

          <ContentCard title="COMPROMISO">
            <p style={styles.contentText}>
              {reporteActual?.tipificacion_compromiso ||
                "Sin compromiso cargado."}
            </p>
          </ContentCard>

          <ContentCard title="OBSERVACIONES">
            <p style={styles.contentText}>
              {reporteActual?.tipificacion_observaciones ||
                "Sin observaciones cargadas."}
            </p>
          </ContentCard>
        </section>
      )}

      {/* AUDITORIAS DE NO VENTAS */}

      {pestana === "auditorias" && (
        <section>
          <SectionHeading
            number="04"
            title="AUDITORÍAS DE NO VENTAS"
          />

          <div style={styles.productivityGrid}>
            <Metric
              title="CANTIDAD"
              value={
                reporteActual?.auditoria_no_ventas_cantidad ||
                "-"
              }
            />

            <Metric
              title="COACHING"
              value={
                reporteActual?.auditoria_no_ventas_coaching ||
                "-"
              }
            />

            <Metric
              title="REGISTRO EN SISTEMA"
              value={
                reporteActual?.auditoria_no_ventas_sistema ||
                "-"
              }
            />

            <Metric
              title="COMPROMISO"
              value={
                reporteActual?.auditoria_no_ventas_compromiso ||
                "-"
              }
            />
          </div>

          <ContentCard title="PRINCIPALES O.M.">
            <p style={styles.contentText}>
              {reporteActual?.auditoria_no_ventas_om ||
                "-"}
            </p>
          </ContentCard>

          <ContentCard title="FORTALEZAS">
            <p style={styles.contentText}>
              {reporteActual?.auditoria_no_ventas_fortalezas ||
                "-"}
            </p>
          </ContentCard>

          <ContentCard title="OBSERVACIONES">
            <p style={styles.contentText}>
              {reporteActual?.auditoria_no_ventas_observaciones ||
                "No hay observaciones cargadas."}
            </p>
          </ContentCard>
        </section>
      )}

      {/* ACTIVIDADES */}

      {pestana === "actividades" && (
        <section>
          <SectionHeading
            number="05"
            title="ACTIVIDADES"
          />

          <div style={styles.activityEmptyAdvisor}>
            <div style={styles.plusCircleLarge}>
              +
            </div>

            <h2>Próximamente</h2>

            <p>
              Esta sección quedará disponible para
              registrar y consultar actividades.
            </p>
          </div>
        </section>
      )}

      {/* HISTORICO */}

      {pestana === "historico" && (
        <section>
          <SectionHeading
            number="06"
            title="HISTÓRICO"
          />

          <ContentCard title="EVOLUCIÓN SEMANAL">
            {reportes.length <= 1 ? (
              <p style={styles.muted}>
                Todavía no hay suficientes semanas
                para mostrar una evolución.
              </p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>
                        Semana
                      </th>
                      <th style={styles.th}>
                        Nota
                      </th>
                      <th style={styles.th}>
                        Producto
                      </th>
                      <th style={styles.th}>
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportes.map(
                      (reporte) => (
                        <tr key={reporte.id}>
                          <td style={styles.td}>
                            {reporte.semana ||
                              "-"}
                          </td>

                          <td style={styles.td}>
                            {reporte.nota ||
                              "-"}
                          </td>

                          <td style={styles.td}>
                            {reporte.producto ||
                              "-"}
                          </td>

                          <td style={styles.td}>
                            {reporte.estado_objetivo ||
                              "-"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </ContentCard>
        </section>
      )}

      {/* FEEDBACK SIEMPRE AL FINAL */}

      <section style={styles.feedbackSection}>
        <SectionHeading
          number="07"
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
          placeholder="Escribí acá tu comentario..."
          style={styles.feedbackTextarea}
        />

        <button
          onClick={enviarFeedback}
          disabled={
            enviandoFeedback || !feedback.trim()
          }
          style={{
            ...styles.feedbackButton,
            opacity:
              enviandoFeedback ||
              !feedback.trim()
                ? 0.55
                : 1,
          }}
        >
          {enviandoFeedback
            ? "ENVIANDO..."
            : "ENVIAR FEEDBACK"}
        </button>

        {mensajeFeedback && (
          <div style={styles.success}>
            {mensajeFeedback}
          </div>
        )}
      </section>
    </>
  );
}

/* =====================================================
   COMPONENTES
===================================================== */

function SectionHeading({ number, title }) {
  return (
    <div style={styles.sectionHeading}>
      <div style={styles.sectionNumber}>
        {number}
      </div>

      <h2 style={styles.sectionTitle}>
        {title}
      </h2>
    </div>
  );
}

function Tab({
  active,
  onClick,
  number,
  title,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.tab,
        ...(active
          ? styles.tabActive
          : {}),
      }}
    >
      <span
        style={{
          ...styles.tabNumber,
          ...(active
            ? styles.tabNumberActive
            : {}),
        }}
      >
        {number}
      </span>

      {title}
    </button>
  );
}

function MiniMetric({ title, value }) {
  return (
    <div style={styles.miniMetric}>
      <div style={styles.miniTitle}>
        {title}
      </div>

      <div style={styles.miniValue}>
        {value}
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
  extra,
}) {
  return (
    <div style={styles.metric}>
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

function InfoCard({
  title,
  value,
}) {
  return (
    <div style={styles.infoMetric}>
      <div style={styles.infoMetricTitle}>
        {title}
      </div>

      <div style={styles.infoMetricValue}>
        {value}
      </div>
    </div>
  );
}

function ContentCard({
  title,
  children,
}) {
  return (
    <div style={styles.contentCard}>
      <h3 style={styles.contentTitle}>
        {title}
      </h3>

      {children}
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  textarea = false,
  type = "text",
  options = [],
  required = false,
}) {
  return (
    <div>
      <label style={styles.label}>
        {label}
      </label>

      {type === "select" ? (
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
      ) : textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.textarea}
          required={required}
        />
      ) : (
        <input
          type={type}
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

function ArrayList({
  items,
  empty,
}) {
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
          {item}
        </li>
      ))}
    </ul>
  );
}

function numero(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return null;
  }

  const limpio = String(valor)
    .replace("%", "")
    .replace(",", ".")
    .trim();

  const resultado = Number(limpio);

  return Number.isNaN(resultado)
    ? null
    : resultado;
}

function estadoEsPositivo(estado) {
  if (!estado) return false;

  const texto = estado.toLowerCase();

  return (
    texto.includes("cumple") ||
    texto.includes("supera") ||
    texto.includes("alcanzado") ||
    texto.includes("objetivo")
  );
}

/* =====================================================
   ESTILOS
===================================================== */

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eef6f7 0%, #f7fafb 50%, #e9f1f3 100%)",
    color: "#18343d",
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
    padding: "40px",
    borderRadius: "24px",
    boxShadow:
      "0 20px 60px rgba(19, 67, 77, 0.13)",
    border: "1px solid #dbe7e9",
  },

  loginTitle: {
    fontSize: "30px",
    margin:
      "22px 0 8px",
    color: "#123c46",
  },

  logo: {
    width: "58px",
    height: "58px",
    borderRadius: "17px",
    background:
      "linear-gradient(135deg, #0e5666, #17788a)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "18px",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding:
      "30px 20px 70px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  headerAdvisor: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent:
      "space-between",
    gap: "25px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  mainTitle: {
    margin:
      "10px 0 4px",
    color: "#123c46",
    fontSize: "31px",
  },

  advisorTitle: {
    margin:
      "13px 0 4px",
    color: "#123c46",
    fontSize: "32px",
    letterSpacing:
      "-0.5px",
  },

  advisorWeek: {
    margin: 0,
    color: "#66808a",
    fontWeight: "600",
  },

  portalBadge: {
    display: "inline-block",
    background:
      "linear-gradient(135deg, #0e5666, #17788a)",
    color: "#ffffff",
    padding:
      "8px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing:
      "1px",
  },

  adminHero: {
    background:
      "linear-gradient(135deg, #0d4f5d 0%, #176f7d 55%, #2492a0 100%)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    marginBottom: "22px",
    boxShadow:
      "0 15px 45px rgba(14, 86, 102, 0.22)",
  },

  heroSmall: {
    margin:
      "0 0 8px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    opacity: 0.8,
  },

  heroTitle: {
    margin:
      "0 0 10px",
    fontSize: "29px",
  },

  heroText: {
    margin: 0,
    opacity: 0.88,
    lineHeight: 1.6,
  },

  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    marginBottom: "22px",
    border:
      "1px solid #dbe7e9",
    boxShadow:
      "0 10px 35px rgba(18, 60, 70, 0.07)",
  },

  sectionHeading: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "25px",
  },

  sectionNumber: {
    width: "37px",
    height: "37px",
    borderRadius: "12px",
    background: "#d8edf0",
    color: "#0e6170",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "900",
  },

  sectionTitle: {
    margin: 0,
    color: "#123c46",
    fontSize: "23px",
    letterSpacing:
      "-0.3px",
  },

  subCard: {
    background: "#f1f8f9",
    border:
      "1px solid #d4e8eb",
    borderRadius: "17px",
    padding: "21px",
    margin:
      "22px 0 5px",
  },

  subTitle: {
    margin:
      "0 0 3px",
    color: "#145665",
    fontSize: "17px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "5px 20px",
  },

  label: {
    display: "block",
    fontWeight: "800",
    margin:
      "17px 0 8px",
    color: "#35545d",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding:
      "13px 14px",
    borderRadius: "11px",
    border:
      "1px solid #cddde1",
    background: "#ffffff",
    color: "#18343d",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "105px",
    boxSizing: "border-box",
    padding:
      "13px 14px",
    borderRadius: "11px",
    border:
      "1px solid #cddde1",
    background: "#ffffff",
    color: "#18343d",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
  },

  fileInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    borderRadius: "11px",
    border:
      "1px dashed #8db8c0",
    background: "#ffffff",
    color: "#35545d",
    cursor: "pointer",
  },

  fileSelected: {
    marginTop: "10px",
    padding: "10px 12px",
    background: "#e7f7ed",
    border:
      "1px solid #b7e2c7",
    color: "#167044",
    borderRadius: "9px",
    fontSize: "13px",
    fontWeight: "700",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "14px 18px",
    background:
      "linear-gradient(135deg, #0e5666, #17788a)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "22px",
  },

  saveButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "17px 20px",
    background:
      "linear-gradient(135deg, #0c5968, #168394)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow:
      "0 10px 25px rgba(14, 86, 102, 0.2)",
  },

  secondaryButton: {
    border:
      "1px solid #cbdde1",
    borderRadius: "11px",
    padding:
      "12px 18px",
    background: "#ffffff",
    color: "#28515c",
    fontWeight: "800",
    cursor: "pointer",
  },

  error: {
    background: "#fff1f1",
    color: "#b42318",
    border:
      "1px solid #f5c2c0",
    padding: "12px",
    borderRadius: "10px",
    margin:
      "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#eaf8ef",
    color: "#167044",
    border:
      "1px solid #b7e2c7",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "800",
  },

  muted: {
    color: "#6a8088",
    lineHeight: 1.6,
  },

  tabs: {
    display: "flex",
    gap: "9px",
    overflowX: "auto",
    padding:
      "6px 0 18px",
    marginBottom: "10px",
    scrollbarWidth: "thin",
  },

  tab: {
    flex: "0 0 auto",
    border:
      "1px solid #cfe0e3",
    background: "#ffffff",
    color: "#48636b",
    borderRadius: "13px",
    padding:
      "11px 14px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  tabActive: {
    background:
      "linear-gradient(135deg, #0e5666, #17788a)",
    color: "#ffffff",
    border:
      "1px solid #0e5666",
    boxShadow:
      "0 7px 18px rgba(14, 86, 102, 0.2)",
  },

  tabNumber: {
    fontSize: "10px",
    color: "#72919a",
  },

  tabNumberActive: {
    color: "#c8eef2",
  },

  scorePanel: {
    background:
      "linear-gradient(135deg, #0d4f5d, #197889)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    display: "grid",
    gridTemplateColumns:
      "minmax(180px, 0.7fr) 1.5fr",
    gap: "25px",
    alignItems: "center",
    marginBottom: "16px",
    boxShadow:
      "0 15px 40px rgba(14, 86, 102, 0.2)",
  },

  scoreLabel: {
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "1px",
    opacity: 0.8,
  },

  bigScore: {
    fontSize: "56px",
    fontWeight: "900",
    marginTop: "5px",
  },

  bigScoreSpan: {
    fontSize: "20px",
  },

  scoreDetails: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "10px",
  },

  miniMetric: {
    background:
      "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.14)",
    borderRadius: "14px",
    padding: "15px",
  },

  miniTitle: {
    fontSize: "10px",
    fontWeight: "900",
    opacity: 0.72,
    marginBottom: "7px",
  },

  miniValue: {
    fontSize: "15px",
    fontWeight: "900",
  },

  progressCard: {
    background: "#ffffff",
    border:
      "1px solid #dbe7e9",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "18px",
  },

  progressHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: "10px",
    color: "#35545d",
  },

  progressTrack: {
    width: "100%",
    height: "11px",
    borderRadius: "999px",
    background: "#dcebee",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, #0e6877, #31a2ad)",
    transition:
      "width 0.4s ease",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
    marginBottom: "18px",
  },

  infoMetric: {
    background: "#ffffff",
    border:
      "1px solid #dbe7e9",
    borderRadius: "17px",
    padding: "20px",
    boxShadow:
      "0 7px 20px rgba(18, 60, 70, 0.05)",
  },

  infoMetricTitle: {
    color: "#71888f",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: ".7px",
    marginBottom: "9px",
  },

  infoMetricValue: {
    color: "#164b58",
    fontSize: "20px",
    fontWeight: "900",
    lineHeight: 1.35,
  },

  contentCard: {
    background: "#ffffff",
    border:
      "1px solid #dbe7e9",
    borderRadius: "18px",
    padding: "22px",
    marginBottom: "18px",
    boxShadow:
      "0 7px 22px rgba(18, 60, 70, 0.05)",
  },

  contentTitle: {
    margin:
      "0 0 15px",
    color: "#285762",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing:
      ".6px",
  },

  contentText: {
    margin: 0,
    lineHeight: 1.7,
    color: "#425f68",
    whiteSpace: "pre-wrap",
  },

  list: {
    margin: 0,
    paddingLeft: "22px",
  },

  listItem: {
    marginBottom: "9px",
    lineHeight: 1.55,
    color: "#425f68",
  },

  auditReference: {
    background: "#eef7f8",
    border:
      "1px solid #d2e8eb",
    borderRadius: "11px",
    padding: "14px",
    color: "#315a64",
  },

  audioPlayer: {
    background: "#f1f8f9",
    border:
      "1px solid #d5e8eb",
    borderRadius: "14px",
    padding: "18px",
    marginTop: "15px",
    color: "#285762",
  },

  productivityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "15px",
    marginBottom: "18px",
  },

  metric: {
    background: "#ffffff",
    border:
      "1px solid #dbe7e9",
    borderRadius: "17px",
    padding: "19px",
    boxShadow:
      "0 7px 20px rgba(18, 60, 70, 0.05)",
  },

  metricTitle: {
    color: "#71888f",
    fontSize: "11px",
    fontWeight: "900",
    marginBottom: "9px",
    letterSpacing: ".5px",
  },

  metricValue: {
    fontSize: "25px",
    fontWeight: "900",
    color: "#145565",
  },

  metricExtra: {
    marginTop: "7px",
    fontSize: "12px",
    color: "#71888f",
  },

  statusLarge: {
    display: "inline-block",
    background: "#e9f6ed",
    border:
      "1px solid #b9dfc6",
    color: "#207246",
    padding:
      "9px 15px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "900",
    marginBottom: "18px",
  },

  generalStatus: {
    padding:
      "9px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
    border:
      "1px solid transparent",
  },

  statusPositive: {
    background: "#e9f6ed",
    color: "#207246",
    border:
      "1px solid #b9dfc6",
  },

  statusAttention: {
    background: "#fff6df",
    color: "#8b6200",
    border:
      "1px solid #efd99a",
  },

  emptyActivity: {
    minHeight: "250px",
    border:
      "1px dashed #b8d2d7",
    borderRadius: "18px",
    background: "#f4fafb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "25px",
    color: "#617c84",
  },

  activityEmptyAdvisor: {
    minHeight: "330px",
    border:
      "1px dashed #b8d2d7",
    borderRadius: "20px",
    background: "#f4fafb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "30px",
    color: "#617c84",
  },

  plusCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#d8edf0",
    color: "#0e6170",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    fontWeight: "400",
  },

  plusCircleLarge: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background: "#d8edf0",
    color: "#0e6170",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
  },

  historyTitle: {
    margin:
      "0 0 18px",
    color: "#285762",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse:
      "collapse",
    minWidth: "650px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#edf6f7",
    color: "#345963",
    borderBottom:
      "1px solid #d7e6e8",
    fontSize: "12px",
    fontWeight: "900",
  },

  td: {
    padding: "13px",
    borderBottom:
      "1px solid #edf2f3",
    fontSize: "14px",
    color: "#425f68",
  },

  feedbackSection: {
    background:
      "linear-gradient(135deg, #ffffff, #f1f8f9)",
    border:
      "1px solid #cfe3e6",
    borderRadius: "22px",
    padding: "28px",
    marginTop: "25px",
    boxShadow:
      "0 10px 30px rgba(18, 60, 70, 0.06)",
  },

  feedbackIntro: {
    color: "#526e76",
    lineHeight: 1.6,
    margin:
      "-8px 0 18px",
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "130px",
    boxSizing: "border-box",
    padding: "15px",
    borderRadius: "13px",
    border:
      "1px solid #c9dde1",
    background: "#ffffff",
    color: "#18343d",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
  },

  feedbackButton: {
    border: "none",
    borderRadius: "12px",
    padding:
      "14px 22px",
    background:
      "linear-gradient(135deg, #0e5666, #17788a)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "13px",
  },
};
