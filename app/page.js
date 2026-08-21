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

const estadoOptions = [
  "ARRIBA DEL OBJETIVO",
  "EN OBJETIVO",
  "DEBAJO DEL OBJETIVO",
  "EN PROCESO",
];

const auditoriaOptions = [
  "No hay información de auditoría",
  "Auditoría realizada",
  "Auditoría pendiente",
  "Auditoría de venta",
];

const registroOptions = [
  "CORRECTA",
  "INCORRECTA",
  "PENDIENTE",
  "NO APLICA",
];

const compromisoOptions = [
  "SEGUIMIENTO",
  "APLICA DEVOLUCIÓN",
  "SIN COMPROMISO",
  "NO APLICA",
];

const formInicial = {
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

  auditoria_cantidad: "",
  auditoria_om: "",
  auditoria_coaching: "",
  auditoria_registro: "",
  auditoria_compromiso: "",
  auditoria_fortalezas: "",
  auditoria_observaciones: "",

  audio_url: "",
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

  const [form, setForm] = useState(formInicial);
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
    setForm(formInicial);
    setAudioFile(null);
  }

  function convertirLista(texto) {
    return texto
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function subirAudio() {
    if (!audioFile) return null;

    const extension =
      audioFile.name.split(".").pop() || "mp3";

    const nombreSeguro =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${extension}`;

    const ruta = `reportes/${form.usuario}/${nombreSeguro}`;

    const { error } = await supabase.storage
      .from("audios")
      .upload(ruta, audioFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: audioFile.type || "audio/mpeg",
      });

    if (error) {
      console.error(error);
      throw new Error(
        "No se pudo subir el audio. Revisá que exista el bucket 'audios' en Supabase."
      );
    }

    const { data } = supabase.storage
      .from("audios")
      .getPublicUrl(ruta);

    return data?.publicUrl || null;
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

    try {
      let audioUrl = form.audio_url || null;

      if (audioFile) {
        audioUrl = await subirAudio();
      }

      const nuevoReporte = {
        usuario: form.usuario,
        semana: form.semana,
        nota: form.nota || null,
        objetivo_calidad:
          form.objetivo_calidad || null,
        estado_objetivo:
          form.estado_objetivo || null,
        producto: form.producto || null,
        desvio: form.desvio || null,
        recomendacion:
          form.recomendacion || null,
        objetivo: form.objetivo || null,
        items_calidad:
          convertirLista(form.items_calidad),
        acciones_calidad:
          convertirLista(form.acciones_calidad),
        auditoria:
          form.auditoria || null,
        audio_url: audioUrl,
        observaciones:
          form.observaciones || null,

        sph: form.sph || null,
        objetivo_sph:
          form.objetivo_sph || null,
        ventas: form.ventas || null,
        objetivo_ventas:
          form.objetivo_ventas || null,
        objetivo_campania:
          form.objetivo_campania || null,
        estado_campania:
          form.estado_campania || null,
        comparativo_productividad:
          form.comparativo_productividad || null,
        items_productividad:
          convertirLista(form.items_productividad),
        acciones_productividad:
          convertirLista(form.acciones_productividad),
        observaciones_productividad:
          form.observaciones_productividad || null,

        tipificaciones:
          convertirLista(form.tipificaciones),
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

        auditoria_cantidad:
          form.auditoria_cantidad || null,
        auditoria_om:
          convertirLista(form.auditoria_om),
        auditoria_coaching:
          form.auditoria_coaching || null,
        auditoria_registro:
          form.auditoria_registro || null,
        auditoria_compromiso:
          form.auditoria_compromiso || null,
        auditoria_fortalezas:
          convertirLista(form.auditoria_fortalezas),
        auditoria_observaciones:
          form.auditoria_observaciones || null,
      };

      const { error } = await supabase
        .from("reportes")
        .insert([nuevoReporte]);

      if (error) {
        console.error(error);
        throw new Error(
          error.message ||
            "No se pudo guardar el reporte."
        );
      }

      setMensajeAdmin(
        "✓ REPORTE GUARDADO CORRECTAMENTE"
      );

      limpiarFormulario();
      await cargarReportesAdmin();
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

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
          <div style={styles.loadingCard}>
            <div style={styles.loadingLogo}>✓</div>
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

  if (modo === "admin") {
    return (
      <AdminPanel
        form={form}
        cambiarFormulario={cambiarFormulario}
        guardarReporte={guardarReporte}
        limpiarFormulario={limpiarFormulario}
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        mensajeAdmin={mensajeAdmin}
        guardando={guardando}
        adminReportes={adminReportes}
        cargandoAdmin={cargandoAdmin}
        cerrarSesion={cerrarSesion}
      />
    );
  }

  if (modo === "asesor") {
    return (
      <AsesorPanel
        asesorActual={asesorActual}
        reportes={reportes}
        cargandoReportes={cargandoReportes}
        cerrarSesion={cerrarSesion}
      />
    );
  }

  return null;
}

function AdminPanel({
  form,
  cambiarFormulario,
  guardarReporte,
  audioFile,
  setAudioFile,
  mensajeAdmin,
  guardando,
  adminReportes,
  cargandoAdmin,
  cerrarSesion,
}) {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
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
              Toda la información cargada acá se
              mostrará en el portal del asesor.
            </p>
          </div>
        </section>

        <form onSubmit={guardarReporte}>
          <section style={styles.adminCard}>
            <SectionNumber number="01" title="CALIDAD" />

            <div style={styles.formGrid}>
              <Field
                label="Asesor"
                name="usuario"
                value={form.usuario}
                onChange={cambiarFormulario}
                type="select"
                options={asesores.map(
                  (asesor) => ({
                    value: asesor[1],
                    label: `${asesor[0]} — ${asesor[1]}`,
                  })
                )}
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
                label="Estado"
                name="estado_objetivo"
                value={form.estado_objetivo}
                onChange={cambiarFormulario}
                type="select"
                options={estadoOptions.map(
                  (item) => ({
                    value: item,
                    label: item,
                  })
                )}
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
              placeholder="Ej: Validación de datos"
            />

            <TextField
              label="Recomendación"
              name="recomendacion"
              value={form.recomendacion}
              onChange={cambiarFormulario}
              placeholder="Qué debería trabajar el asesor..."
            />

            <TextField
              label="Objetivo de trabajo"
              name="objetivo"
              value={form.objetivo}
              onChange={cambiarFormulario}
              placeholder="Objetivo para la próxima evaluación..."
            />

            <TextField
              label="Items trabajados"
              name="items_calidad"
              value={form.items_calidad}
              onChange={cambiarFormulario}
              placeholder={
                "Un item por línea.\nValidación de datos\nCláusula de aceptación\nInformación"
              }
            />

            <TextField
              label="Acciones realizadas"
              name="acciones_calidad"
              value={form.acciones_calidad}
              onChange={cambiarFormulario}
              placeholder={
                "Una acción por línea.\nFeedback individual\nEspacio de coaching"
              }
            />

            <div style={styles.subSection}>
              <h3 style={styles.subTitle}>
                Auditoría
              </h3>

              <p style={styles.muted}>
                Seleccioná la información que querés
                mostrar en la sección Calidad.
              </p>

              <Field
                label="Estado de auditoría"
                name="auditoria"
                value={form.auditoria}
                onChange={cambiarFormulario}
                type="select"
                options={auditoriaOptions.map(
                  (item) => ({
                    value: item,
                    label: item,
                  })
                )}
              />
            </div>

            <TextField
              label="Observaciones"
              name="observaciones"
              value={form.observaciones}
              onChange={cambiarFormulario}
              placeholder="Observaciones de calidad..."
            />
          </section>

          <section style={styles.adminCard}>
            <SectionNumber
              number="02"
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
                type="select"
                options={estadoOptions.map(
                  (item) => ({
                    value: item,
                    label: item,
                  })
                )}
              />
            </div>

            <TextField
              label="Comparativo semanal"
              name="comparativo_productividad"
              value={form.comparativo_productividad}
              onChange={cambiarFormulario}
              placeholder="Ej: Subió 5 ventas respecto de la semana anterior."
            />

            <TextField
              label="Items trabajados"
              name="items_productividad"
              value={form.items_productividad}
              onChange={cambiarFormulario}
              placeholder={
                "Un item por línea.\nCierre con seguridad comercial\nOfrecimiento\nRebate comercial"
              }
            />

            <TextField
              label="Acciones realizadas"
              name="acciones_productividad"
              value={form.acciones_productividad}
              onChange={cambiarFormulario}
              placeholder={
                "Una acción por línea.\nSimulación de llamada\nAcompañamiento en línea"
              }
            />

            <TextField
              label="Observaciones"
              name="observaciones_productividad"
              value={form.observaciones_productividad}
              onChange={cambiarFormulario}
              placeholder="Observaciones de productividad..."
            />
          </section>

          <section style={styles.adminCard}>
            <SectionNumber
              number="03"
              title="TIPIFICACIONES"
            />

            <TextField
              label="Tipificaciones realizadas"
              name="tipificaciones"
              value={form.tipificaciones}
              onChange={cambiarFormulario}
              placeholder={
                "Una tipificación por línea.\nNo conforme con sumas aseguradas\nNo interesado - Producto"
              }
            />

            <div style={styles.formGrid}>
              <Field
                label="Objetivo tipificaciones"
                name="objetivo_tipificaciones"
                value={form.objetivo_tipificaciones}
                onChange={cambiarFormulario}
                placeholder="Ej: 14"
              />

              <Field
                label="Estado"
                name="estado_tipificaciones"
                value={form.estado_tipificaciones}
                onChange={cambiarFormulario}
                type="select"
                options={estadoOptions.map(
                  (item) => ({
                    value: item,
                    label: item,
                  })
                )}
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
                placeholder="Ej: 12"
              />

              <Field
                label="Compromiso"
                name="tipificacion_compromiso"
                value={form.tipificacion_compromiso}
                onChange={cambiarFormulario}
                type="select"
                options={compromisoOptions.map(
                  (item) => ({
                    value: item,
                    label: item,
                  })
                )}
              />
            </div>

            <TextField
              label="Observaciones"
              name="tipificacion_observaciones"
              value={form.tipificacion_observaciones}
              onChange={cambiarFormulario}
              placeholder="Observaciones de tipificación..."
            />
          </section>

          <section style={styles.adminCard}>
            <SectionNumber
              number="04"
              title="AUDITORÍAS DE NO VENTAS"
            />

            <div style={styles.formGrid}>
              <Field
                label="Cantidad"
                name="auditoria_cantidad"
                value={form.auditoria_cantidad}
                onChange={cambiarFormulario}
                placeholder="Ej: 5"
              />

              <Field
                label="Registro en sistema"
                name="auditoria_registro"
                value={form.auditoria_registro}
                onChange={cambiarFormulario}
                type="select"
                options={registroOptions.map(
                  (item) => ({
                    value: item,
                    label: item,
                  })
                )}
              />

              <Field
                label="Compromiso"
                name="auditoria_compromiso"
                value={form.auditoria_compromiso}
                onChange={cambiarFormulario}
                type="select"
                options={compromisoOptions.map(
                  (item) => ({
                    value: item,
                    label: item,
                  })
                )}
              />
            </div>

            <TextField
              label="Principales O.M."
              name="auditoria_om"
              value={form.auditoria_om}
              onChange={cambiarFormulario}
              placeholder={
                "Una por línea.\nGeneración de interés\nCambio apertura\nEscucha activa\nVenta consultiva"
              }
            />

            <TextField
              label="Coaching"
              name="auditoria_coaching"
              value={form.auditoria_coaching}
              onChange={cambiarFormulario}
              placeholder="Detalle del coaching realizado..."
            />

            <TextField
              label="Fortalezas"
              name="auditoria_fortalezas"
              value={form.auditoria_fortalezas}
              onChange={cambiarFormulario}
              placeholder={
                "Una fortaleza por línea.\nAdaptabilidad\nBuena detección de necesidad\nClaridad en explicación"
              }
            />

            <TextField
              label="Observaciones"
              name="auditoria_observaciones"
              value={form.auditoria_observaciones}
              onChange={cambiarFormulario}
              placeholder="Observaciones de la auditoría..."
            />
          </section>

          <section style={styles.adminCard}>
            <SectionNumber
              number="05"
              title="ACTIVIDADES"
            />

            <div style={styles.emptyAdmin}>
              <strong>
                Próximamente
              </strong>

              <p style={styles.muted}>
                Esta sección queda preparada para
                incorporar actividades más adelante.
              </p>
            </div>
          </section>

          <section style={styles.adminCard}>
            <SectionNumber
              number="06"
              title="AUDITORÍA / AUDIO"
            />

            <div style={styles.audioUpload}>
              <div>
                <h3 style={styles.subTitle}>
                  Subir llamada auditada
                </h3>

                <p style={styles.muted}>
                  Seleccioná directamente el archivo
                  de audio desde tu computadora.
                </p>
              </div>

              <input
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
          </section>

          <button
            type="submit"
            disabled={guardando}
            style={{
              ...styles.saveButton,
              opacity: guardando ? 0.6 : 1,
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
                marginTop: "16px",
                marginBottom: "22px",
              }}
            >
              {mensajeAdmin}
            </div>
          )}
        </form>

        <section style={styles.adminCard}>
          <div style={styles.historyHeader}>
            <div>
              <div style={styles.smallEyebrow}>
                HISTORIAL
              </div>

              <h2 style={styles.cardTitle}>
                Reportes cargados
              </h2>
            </div>

            <div style={styles.historyCount}>
              {adminReportes.length} reportes
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

function AsesorPanel({
  asesorActual,
  reportes,
  cargandoReportes,
  cerrarSesion,
}) {
  const [pestana, setPestana] = useState("calidad");
  const [feedback, setFeedback] = useState("");
  const [enviandoFeedback, setEnviandoFeedback] =
    useState(false);
  const [mensajeFeedback, setMensajeFeedback] =
    useState("");

  const reporteActual = reportes[0];

  async function enviarFeedback() {
    if (!feedback.trim()) return;

    setEnviandoFeedback(true);
    setMensajeFeedback("");

    const { error } = await supabase
      .from("feedback")
      .insert([
        {
          usuario: asesorActual?.[1],
          semana: reporteActual?.semana || "",
          mensaje: feedback.trim(),
        },
      ]);

    if (error) {
      console.error(error);
      setMensajeFeedback(
        "No se pudo enviar el feedback."
      );
    } else {
      setFeedback("");
      setMensajeFeedback(
        "✓ Feedback enviado correctamente."
      );
    }

    setEnviandoFeedback(false);
  }

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

            <p style={styles.advisorWeek}>
              {reporteActual?.semana ||
                "Semana actual"}
            </p>
          </div>

          <div style={styles.advisorHeaderRight}>
            <div
              style={styles.generalStatus(
                reporteActual?.estado_objetivo
              )}
            >
              {reporteActual?.estado_objetivo ||
                "EN SEGUIMIENTO"}
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

        {cargandoReportes ? (
          <section style={styles.card}>
            <h2>Cargando información...</h2>
          </section>
        ) : !reporteActual ? (
          <section style={styles.card}>
            <h2>
              Todavía no hay reportes
            </h2>

            <p style={styles.muted}>
              Cuando Calidad cargue tu primer
              reporte semanal, vas a poder verlo
              desde acá.
            </p>
          </section>
        ) : (
          <>
            {pestana === "calidad" && (
              <CalidadTab
                reporte={reporteActual}
              />
            )}

            {pestana === "productividad" && (
              <ProductividadTab
                reporte={reporteActual}
              />
            )}

            {pestana === "tipificaciones" && (
              <TipificacionesTab
                reporte={reporteActual}
              />
            )}

            {pestana === "auditorias" && (
              <AuditoriasTab
                reporte={reporteActual}
              />
            )}

            {pestana === "actividades" && (
              <ActividadesTab />
            )}

            {pestana === "historico" && (
              <HistoricoTab
                reportes={reportes}
              />
            )}
          </>
        )}

        <section style={styles.feedbackCard}>
          <div style={styles.feedbackNumber}>
            07
          </div>

          <div>
            <div style={styles.smallEyebrow}>
              ÚLTIMA SECCIÓN
            </div>

            <h2 style={styles.feedbackTitle}>
              FEEDBACK DEL ASESOR
            </h2>

            <p style={styles.feedbackText}>
              ¿Querés dejar algún comentario sobre
              tu reporte, una consulta o algo que
              quieras trabajar con Calidad?
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
              disabled={
                enviandoFeedback ||
                !feedback.trim()
              }
              style={{
                ...styles.feedbackButton,
                opacity:
                  enviandoFeedback ||
                  !feedback.trim()
                    ? 0.6
                    : 1,
              }}
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
          </div>
        </section>
      </div>
    </main>
  );
}

function CalidadTab({ reporte }) {
  const nota = numero(reporte.nota);
  const objetivo = numero(
    reporte.objetivo_calidad
  );

  const porcentaje =
    objetivo > 0
      ? Math.min(
          100,
          Math.round((nota / objetivo) * 100)
        )
      : 0;

  const falta =
    objetivo > nota ? objetivo - nota : 0;

  return (
    <section style={styles.tabCard}>
      <SectionNumber number="01" title="CALIDAD" />

      <div style={styles.scoreGrid}>
        <div style={styles.bigScore}>
          <div style={styles.scoreLabel}>
            NOTA
          </div>

          <div style={styles.scoreNumber}>
            {reporte.nota || "-"}
          </div>

          <div style={styles.scoreOutOf}>
            / 100
          </div>
        </div>

        <Metric
          title="OBJETIVO"
          value={reporte.objetivo_calidad || "-"}
        />

        <Metric
          title="ESTADO"
          value={
            reporte.estado_objetivo || "-"
          }
        />

        <Metric
          title="PRODUCTO"
          value={reporte.producto || "-"}
        />
      </div>

      <div style={styles.progressCard}>
        <div style={styles.progressTop}>
          <strong>
            Progreso hacia el objetivo
          </strong>

          <strong>{porcentaje}%</strong>
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${porcentaje}%`,
            }}
          />
        </div>
      </div>

      <div style={styles.twoColumn}>
        <InfoBlock
          title="CUÁNTO FALTA PARA ALCANZAR EL OBJETIVO"
          value={
            falta > 0
              ? `${falta} puntos`
              : "Objetivo alcanzado"
          }
        />

        <InfoBlock
          title="DESVÍO PRINCIPAL"
          value={
            reporte.desvio ||
            "No hay desvíos cargados."
          }
        />
      </div>

      <InfoBlock
        title="COMPARATIVO SEMANAL"
        value={
          reporte.comparativo_calidad ||
          "Todavía no hay una semana anterior para comparar."
        }
      />

      <ListBlock
        title="ITEMS TRABAJADOS"
        items={reporte.items_calidad}
      />

      <ListBlock
        title="ACCIONES REALIZADAS"
        items={reporte.acciones_calidad}
      />

      <InfoBlock
        title="AUDITORÍA"
        value={
          reporte.auditoria ||
          "No hay información de auditoría."
        }
      />

      <InfoBlock
        title="OBSERVACIONES"
        value={
          reporte.observaciones ||
          "No hay observaciones cargadas."
        }
      />
    </section>
  );
}

function ProductividadTab({ reporte }) {
  return (
    <section style={styles.tabCard}>
      <SectionNumber
        number="02"
        title="PRODUCTIVIDAD"
      />

      <div style={styles.scoreGrid}>
        <Metric
          title="SPH"
          value={reporte.sph || "-"}
          extra={`Objetivo SPH: ${
            reporte.objetivo_sph || "-"
          }`}
        />

        <Metric
          title="VENTAS"
          value={reporte.ventas || "-"}
          extra={`Objetivo ventas: ${
            reporte.objetivo_ventas || "-"
          }`}
        />

        <Metric
          title="OBJETIVO DE CAMPAÑA"
          value={
            reporte.objetivo_campania || "-"
          }
        />

        <Metric
          title="ESTADO"
          value={
            reporte.estado_campania || "-"
          }
        />
      </div>

      <InfoBlock
        title="COMPARATIVO SEMANAL"
        value={
          reporte.comparativo_productividad ||
          "Todavía no hay una semana anterior para comparar."
        }
      />

      <ListBlock
        title="ITEMS TRABAJADOS"
        items={reporte.items_productividad}
      />

      <ListBlock
        title="ACCIONES REALIZADAS"
        items={reporte.acciones_productividad}
      />

      <InfoBlock
        title="OBSERVACIONES"
        value={
          reporte.observaciones_productividad ||
          "No hay observaciones cargadas."
        }
      />
    </section>
  );
}

function TipificacionesTab({ reporte }) {
  return (
    <section style={styles.tabCard}>
      <SectionNumber
        number="03"
        title="TIPIFICACIONES"
      />

      <div style={styles.statusLarge}>
        {reporte.estado_tipificaciones ||
          "Sin estado"}
      </div>

      <div style={styles.scoreGrid}>
        <Metric
          title="DESVÍO"
          value={
            reporte.tipificacion_desvio || "-"
          }
        />

        <Metric
          title="OBJETIVO"
          value={
            reporte.tipificacion_objetivo || "-"
          }
        />

        <Metric
          title="RESULTADO"
          value={
            reporte.tipificacion_resultado || "-"
          }
        />

        <Metric
          title="COMPROMISO"
          value={
            reporte.tipificacion_compromiso ||
            "-"
          }
        />
      </div>

      <ListBlock
        title="TIPIFICACIONES"
        items={reporte.tipificaciones}
      />

      <InfoBlock
        title="OBSERVACIONES"
        value={
          reporte.tipificacion_observaciones ||
          "Sin observaciones cargadas."
        }
      />
    </section>
  );
}

function AuditoriasTab({ reporte }) {
  return (
    <section style={styles.tabCard}>
      <SectionNumber
        number="04"
        title="AUDITORÍAS DE NO VENTAS"
      />

      <div style={styles.scoreGrid}>
        <Metric
          title="CANTIDAD"
          value={
            reporte.auditoria_cantidad || "-"
          }
        />

        <Metric
          title="COACHING"
          value={
            reporte.auditoria_coaching || "-"
          }
        />

        <Metric
          title="REGISTRO EN SISTEMA"
          value={
            reporte.auditoria_registro || "-"
          }
        />

        <Metric
          title="COMPROMISO"
          value={
            reporte.auditoria_compromiso || "-"
          }
        />
      </div>

      <ListBlock
        title="PRINCIPALES O.M."
        items={reporte.auditoria_om}
      />

      <ListBlock
        title="FORTALEZAS"
        items={reporte.auditoria_fortalezas}
      />

      <InfoBlock
        title="OBSERVACIONES"
        value={
          reporte.auditoria_observaciones ||
          "No hay observaciones cargadas."
        }
      />

      {reporte.audio_url && (
        <div style={styles.audioViewer}>
          <h3 style={styles.subTitle}>
            Llamada auditada
          </h3>

          <audio
            controls
            src={reporte.audio_url}
            style={{ width: "100%" }}
          />
        </div>
      )}
    </section>
  );
}

function ActividadesTab() {
  return (
    <section style={styles.tabCard}>
      <SectionNumber
        number="05"
        title="ACTIVIDADES"
      />

      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>+</div>

        <h2>Próximamente</h2>

        <p style={styles.muted}>
          Esta sección quedará disponible para
          registrar y consultar actividades.
        </p>
      </div>
    </section>
  );
}

function HistoricoTab({ reportes }) {
  return (
    <section style={styles.tabCard}>
      <SectionNumber
        number="06"
        title="HISTÓRICO"
      />

      {reportes.length <= 1 ? (
        <div style={styles.emptyStateSmall}>
          <h3>
            Todavía no hay semanas anteriores.
          </h3>

          <p style={styles.muted}>
            Cuando se carguen nuevos reportes,
            vas a poder ver tu evolución semanal
            desde acá.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
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
                  Objetivo
                </th>

                <th style={styles.th}>
                  Estado
                </th>

                <th style={styles.th}>
                  Producto
                </th>
              </tr>
            </thead>

            <tbody>
              {reportes.map((reporte) => (
                <tr key={reporte.id}>
                  <td style={styles.td}>
                    {reporte.semana || "-"}
                  </td>

                  <td style={styles.td}>
                    {reporte.nota || "-"}
                  </td>

                  <td style={styles.td}>
                    {reporte.objetivo_calidad ||
                      "-"}
                  </td>

                  <td style={styles.td}>
                    {reporte.estado_objetivo ||
                      "-"}
                  </td>

                  <td style={styles.td}>
                    {reporte.producto || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
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
        ...styles.tabButton,
        ...(active
          ? styles.tabButtonActive
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

      <span>{title}</span>
    </button>
  );
}

function SectionNumber({ number, title }) {
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

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  options = [],
  placeholder,
  required,
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
            Seleccioná una opción
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

function TextField({
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

function Metric({ title, value, extra }) {
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

function InfoBlock({ title, value }) {
  return (
    <div style={styles.infoSection}>
      <div style={styles.blockTitle}>
        {title}
      </div>

      <div style={styles.infoBox}>
        {value}
      </div>
    </div>
  );
}

function ListBlock({ title, items }) {
  const lista = normalizarLista(items);

  return (
    <div style={styles.infoSection}>
      <div style={styles.blockTitle}>
        {title}
      </div>

      {lista.length === 0 ? (
        <div style={styles.infoBox}>
          No hay información cargada.
        </div>
      ) : (
        <div style={styles.listGrid}>
          {lista.map((item, index) => (
            <div
              key={index}
              style={styles.listCard}
            >
              <span style={styles.listDot}>
                ✓
              </span>

              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function normalizarLista(items) {
  if (Array.isArray(items)) {
    return items.filter(Boolean);
  }

  if (typeof items !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(items);

    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean);
    }
  } catch {}

  return items
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function numero(valor) {
  if (valor === null || valor === undefined) {
    return 0;
  }

  const texto = String(valor)
    .replace("%", "")
    .replace(",", ".")
    .trim();

  const resultado = Number(texto);

  return Number.isFinite(resultado)
    ? resultado
    : 0;
}

function nombreCorto(nombreCompleto) {
  if (!nombreCompleto) return "asesor/a";

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
      "linear-gradient(145deg, #edf7f8 0%, #f5f9fa 48%, #eef4f6 100%)",
    color: "#16343b",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
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
    boxShadow:
      "0 20px 60px rgba(16, 62, 70, 0.12)",
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
      "0 24px 70px rgba(16, 62, 70, 0.13)",
    border: "1px solid #dcecef",
    boxSizing: "border-box",
  },

  logo: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #0b5963, #16808a)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "29px",
    fontWeight: "900",
    marginBottom: "22px",
  },

  loginEyebrow: {
    color: "#16808a",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "1.4px",
  },

  loginTitle: {
    fontSize: "32px",
    margin: "8px 0",
    color: "#16343b",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  advisorHeader: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "25px 28px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    border: "1px solid #dcecef",
    boxShadow:
      "0 10px 35px rgba(16, 62, 70, 0.07)",
  },

  advisorHeaderRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  advisorTitle: {
    margin: "10px 0 4px",
    fontSize: "34px",
    color: "#16343b",
  },

  advisorWeek: {
    margin: 0,
    color: "#5b747a",
    fontWeight: "700",
  },

  pageTitle: {
    margin: "9px 0 3px",
    color: "#16343b",
  },

  portalBadge: {
    display: "inline-block",
    background: "#0b5963",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  generalStatus: (estado) => ({
    background:
      estado === "ARRIBA DEL OBJETIVO"
        ? "#e6f7ef"
        : estado === "EN OBJETIVO"
        ? "#e7f5f6"
        : "#fff4dc",
    color:
      estado === "ARRIBA DEL OBJETIVO"
        ? "#087443"
        : estado === "EN OBJETIVO"
        ? "#0b6872"
        : "#966500",
    padding: "10px 15px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: ".5px",
  }),

  adminHero: {
    background:
      "linear-gradient(135deg, #0b5963 0%, #126f79 55%, #19848d 100%)",
    color: "#ffffff",
    borderRadius: "25px",
    padding: "32px",
    marginBottom: "22px",
    boxShadow:
      "0 18px 45px rgba(11, 89, 99, 0.2)",
  },

  heroEyebrow: {
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    opacity: 0.8,
  },

  adminHeroTitle: {
    fontSize: "30px",
    margin: "8px 0",
  },

  adminHeroText: {
    margin: 0,
    opacity: 0.85,
  },

  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    marginBottom: "22px",
    border: "1px solid #dcecef",
    boxShadow:
      "0 10px 35px rgba(16, 62, 70, 0.07)",
  },

  adminCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "22px",
    border: "1px solid #dcecef",
    boxShadow:
      "0 10px 35px rgba(16, 62, 70, 0.07)",
  },

  tabCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    marginBottom: "22px",
    border: "1px solid #dcecef",
    boxShadow:
      "0 12px 40px rgba(16, 62, 70, 0.08)",
  },

  sectionHeading: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "28px",
  },

  sectionNumber: {
    width: "39px",
    height: "39px",
    borderRadius: "13px",
    background: "#dff2f3",
    color: "#0b5963",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "900",
  },

  sectionTitle: {
    margin: 0,
    color: "#16343b",
    fontSize: "24px",
    letterSpacing: "-.4px",
  },

  tabs: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "9px",
    background: "#ffffff",
    padding: "9px",
    borderRadius: "20px",
    border: "1px solid #dcecef",
    marginBottom: "22px",
    boxShadow:
      "0 8px 25px rgba(16, 62, 70, 0.05)",
  },

  tabButton: {
    border: "none",
    background: "transparent",
    borderRadius: "14px",
    padding: "13px 10px",
    cursor: "pointer",
    color: "#547077",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "11px",
    letterSpacing: ".3px",
  },

  tabButtonActive: {
    background: "#0b5963",
    color: "#ffffff",
    boxShadow:
      "0 7px 20px rgba(11, 89, 99, 0.2)",
  },

  tabNumber: {
    fontSize: "10px",
    fontWeight: "900",
  },

  tabNumberActive: {
    color: "#bde8ea",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "5px 18px",
  },

  label: {
    display: "block",
    fontWeight: "800",
    marginBottom: "8px",
    marginTop: "17px",
    color: "#35545b",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #cddfe2",
    background: "#ffffff",
    color: "#16343b",
    fontSize: "14px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "110px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #cddfe2",
    background: "#ffffff",
    color: "#16343b",
    fontSize: "14px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "14px 18px",
    background: "#0b5963",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "22px",
  },

  saveButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "17px",
    background:
      "linear-gradient(135deg, #0b5963, #16808a)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow:
      "0 10px 28px rgba(11, 89, 99, 0.18)",
  },

  secondaryButton: {
    border: "1px solid #cddfe2",
    borderRadius: "12px",
    padding: "11px 17px",
    background: "#ffffff",
    color: "#35545b",
    fontWeight: "800",
    cursor: "pointer",
  },

  error: {
    background: "#fff0f0",
    color: "#b42318",
    border: "1px solid #f2c3c0",
    padding: "12px",
    borderRadius: "11px",
    margin: "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#e9f8f0",
    color: "#087443",
    border: "1px solid #b7e8ca",
    padding: "14px",
    borderRadius: "12px",
    fontWeight: "800",
  },

  muted: {
    color: "#647b81",
    lineHeight: 1.6,
  },

  subSection: {
    background: "#f3f9fa",
    border: "1px solid #d8eaec",
    borderRadius: "17px",
    padding: "22px",
    marginTop: "22px",
  },

  subTitle: {
    margin: "0 0 7px",
    color: "#16343b",
  },

  audioUpload: {
    background: "#f3f9fa",
    border: "1px dashed #9fc8cc",
    borderRadius: "17px",
    padding: "24px",
  },

  fileInput: {
    width: "100%",
    marginTop: "12px",
    padding: "12px",
    background: "#ffffff",
    borderRadius: "10px",
    border: "1px solid #cddfe2",
  },

  fileSelected: {
    marginTop: "12px",
    background: "#e9f8f0",
    color: "#087443",
    padding: "11px 13px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "13px",
  },

  scoreGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },

  bigScore: {
    background:
      "linear-gradient(145deg, #0b5963, #16808a)",
    color: "#ffffff",
    borderRadius: "18px",
    padding: "21px",
    minHeight: "130px",
  },

  scoreLabel: {
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1px",
    opacity: 0.8,
  },

  scoreNumber: {
    fontSize: "43px",
    fontWeight: "900",
    marginTop: "10px",
    display: "inline-block",
  },

  scoreOutOf: {
    display: "inline-block",
    marginLeft: "7px",
    opacity: 0.75,
    fontWeight: "700",
  },

  metric: {
    background: "#f4f9fa",
    border: "1px solid #dcecef",
    borderRadius: "17px",
    padding: "20px",
    minHeight: "88px",
  },

  metricTitle: {
    color: "#6a8186",
    fontSize: "11px",
    fontWeight: "900",
    marginBottom: "10px",
    letterSpacing: ".5px",
  },

  metricValue: {
    fontSize: "23px",
    fontWeight: "900",
    color: "#0b5963",
    wordBreak: "break-word",
  },

  metricExtra: {
    marginTop: "7px",
    fontSize: "12px",
    color: "#647b81",
  },

  progressCard: {
    background: "#edf7f8",
    border: "1px solid #d5eaec",
    borderRadius: "17px",
    padding: "18px",
    marginBottom: "20px",
  },

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    color: "#35545b",
    fontSize: "13px",
    marginBottom: "11px",
  },

  progressTrack: {
    width: "100%",
    height: "10px",
    background: "#d4e4e6",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #0b5963, #24a0a8)",
    borderRadius: "999px",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "15px",
  },

  infoSection: {
    marginTop: "22px",
  },

  blockTitle: {
    color: "#0b5963",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: ".8px",
    marginBottom: "9px",
  },

  infoBox: {
    background: "#f7fafb",
    border: "1px solid #dcecef",
    borderRadius: "14px",
    padding: "17px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    color: "#29474e",
  },

  listGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "10px",
  },

  listCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    background: "#f7fafb",
    border: "1px solid #dcecef",
    borderRadius: "13px",
    padding: "14px",
    lineHeight: 1.45,
    color: "#29474e",
  },

  listDot: {
    flexShrink: 0,
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    background: "#dff2f3",
    color: "#0b5963",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "900",
  },

  statusLarge: {
    display: "inline-block",
    background: "#fff4dc",
    color: "#966500",
    border: "1px solid #f0d58f",
    padding: "10px 15px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "900",
    marginBottom: "20px",
  },

  audioViewer: {
    background: "#f3f9fa",
    border: "1px solid #d8eaec",
    borderRadius: "17px",
    padding: "20px",
    marginTop: "22px",
  },

  emptyState: {
    textAlign: "center",
    padding: "65px 20px",
    background: "#f7fafb",
    borderRadius: "18px",
    border: "1px dashed #bfd9dc",
  },

  emptyStateSmall: {
    textAlign: "center",
    padding: "40px 20px",
    background: "#f7fafb",
    borderRadius: "18px",
    border: "1px dashed #bfd9dc",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background: "#dff2f3",
    color: "#0b5963",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "28px",
    fontWeight: "400",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "650px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#edf7f8",
    color: "#35545b",
    borderBottom: "1px solid #d7e7e9",
    fontSize: "12px",
    fontWeight: "900",
  },

  td: {
    padding: "13px",
    borderBottom: "1px solid #edf2f3",
    fontSize: "13px",
    color: "#38555b",
  },

  historyHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "20px",
  },

  smallEyebrow: {
    color: "#16808a",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.1px",
    marginBottom: "5px",
  },

  cardTitle: {
    margin: 0,
    color: "#16343b",
  },

  historyCount: {
    background: "#dff2f3",
    color: "#0b5963",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
  },

  emptyAdmin: {
    background: "#f7fafb",
    borderRadius: "15px",
    padding: "25px",
    border: "1px dashed #bfd9dc",
  },

  feedbackCard: {
    background:
      "linear-gradient(145deg, #0b5963, #126f79)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    display: "grid",
    gridTemplateColumns: "58px 1fr",
    gap: "20px",
    boxShadow:
      "0 18px 45px rgba(11, 89, 99, 0.18)",
  },

  feedbackNumber: {
    width: "44px",
    height: "44px",
    borderRadius: "13px",
    background: "rgba(255,255,255,.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "12px",
  },

  feedbackTitle: {
    margin: "0 0 10px",
    fontSize: "25px",
  },

  feedbackText: {
    opacity: 0.86,
    lineHeight: 1.6,
    marginTop: 0,
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "120px",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "13px",
    border: "none",
    background: "#ffffff",
    color: "#16343b",
    fontSize: "14px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    outline: "none",
  },

  feedbackButton: {
    marginTop: "12px",
    border: "none",
    borderRadius: "12px",
    padding: "13px 20px",
    background: "#ffffff",
    color: "#0b5963",
    fontWeight: "900",
    cursor: "pointer",
  },

  feedbackSuccess: {
    marginTop: "12px",
    background: "rgba(255,255,255,.13)",
    borderRadius: "10px",
    padding: "11px",
    fontSize: "13px",
    fontWeight: "700",
  },
};
