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

const OM_OPTIONS = [
  "Generación de interés",
  "Cambio apertura",
  "Escucha activa",
  "Venta consultiva",
  "Venta conversacional",
  "Detección de necesidad",
  "Manejo de objeciones",
  "Rebate comercial",
  "Cierre",
];

const FORTALEZAS_OPTIONS = [
  "Adaptabilidad",
  "Buena detección de necesidad",
  "Claridad en explicación",
  "Buen manejo de silencios",
  "Correcta contención",
  "Buena escucha activa",
  "Seguridad comercial",
  "Buena argumentación",
  "Buen manejo de objeciones",
];

const COACHING_OPTIONS = [
  "Realizado",
  "Pendiente",
  "No aplica",
];

const REGISTRO_OPTIONS = [
  "CORRECTA",
  "INCORRECTA",
  "PENDIENTE",
];

const COMPROMISO_AUDITORIA_OPTIONS = [
  "APLICA DEVOLUCIÓN",
  "SEGUIMIENTO",
  "SIN COMPROMISO",
  "PENDIENTE",
];

const initialForm = {
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
  auditoria_om: [],
  auditoria_coaching: "",
  auditoria_registro: "",
  auditoria_compromiso: "",
  auditoria_fortalezas: [],
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

  const [form, setForm] = useState(initialForm);

  const [mensajeAdmin, setMensajeAdmin] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [audioFile, setAudioFile] = useState(null);
  const [subiendoAudio, setSubiendoAudio] = useState(false);

  const [pestana, setPestana] = useState("calidad");

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

  function alternarOpcion(campo, opcion) {
    setForm((anterior) => {
      const actual = anterior[campo] || [];

      if (actual.includes(opcion)) {
        return {
          ...anterior,
          [campo]: actual.filter((item) => item !== opcion),
        };
      }

      return {
        ...anterior,
        [campo]: [...actual, opcion],
      };
    });
  }

  function limpiarFormulario() {
    setForm({ ...initialForm });
    setAudioFile(null);
    setMensajeAdmin("");
  }

  async function subirAudio() {
    if (!audioFile) return null;

    setSubiendoAudio(true);

    const extension =
      audioFile.name.split(".").pop() || "mp3";

    const nombreArchivo = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const ruta = `reportes/${nombreArchivo}`;

    const { error: uploadError } = await supabase.storage
      .from("audios")
      .upload(ruta, audioFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      setSubiendoAudio(false);

      throw new Error(
        "No se pudo subir el audio. Verificá que exista el bucket 'audios' en Supabase."
      );
    }

    const { data } = supabase.storage
      .from("audios")
      .getPublicUrl(ruta);

    setSubiendoAudio(false);

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

      const itemsCalidad = form.items_calidad
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const accionesCalidad = form.acciones_calidad
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const itemsProductividad = form.items_productividad
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const accionesProductividad =
        form.acciones_productividad
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);

      const tipificaciones = form.tipificaciones
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      /*
        Auditoría se guarda dentro de la columna
        "auditoria" como JSON.

        De esta manera no necesitamos modificar
        todavía la tabla de Supabase.
      */
      const auditoria = JSON.stringify({
        cantidad: form.auditoria_cantidad || "",
        om: form.auditoria_om || [],
        coaching: form.auditoria_coaching || "",
        registro: form.auditoria_registro || "",
        compromiso: form.auditoria_compromiso || "",
        fortalezas: form.auditoria_fortalezas || [],
        observaciones:
          form.auditoria_observaciones || "",
      });

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
        items_calidad: itemsCalidad,
        acciones_calidad: accionesCalidad,
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
          itemsProductividad,
        acciones_productividad:
          accionesProductividad,
        observaciones_productividad:
          form.observaciones_productividad ||
          null,

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
          form.tipificacion_observaciones ||
          null,

        auditoria,

        audio_url: audioUrl,
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

      setMensajeAdmin(
        "✓ REPORTE GUARDADO CORRECTAMENTE"
      );

      limpiarFormulario();

      await cargarReportesAdmin();
    } catch (error) {
      console.error(error);

      setMensajeAdmin(
        error.message ||
          "Ocurrió un error al guardar el reporte."
      );
    }

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

  if (modo === "login") {
    return (
      <main style={styles.page}>
        <div style={styles.loginContainer}>
          <div style={styles.loginCard}>
            <div style={styles.logo}>✓</div>

            <div style={styles.portalLabel}>
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
                style={styles.primaryButton}
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
        alternarOpcion={alternarOpcion}
        guardarReporte={guardarReporte}
        limpiarFormulario={limpiarFormulario}
        asesores={asesores}
        adminReportes={adminReportes}
        cargandoAdmin={cargandoAdmin}
        mensajeAdmin={mensajeAdmin}
        guardando={guardando}
        audioFile={audioFile}
        setAudioFile={setAudioFile}
        subiendoAudio={subiendoAudio}
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
        pestana={pestana}
        setPestana={setPestana}
      />
    );
  }

  return null;
}

function AdminPanel({
  form,
  cambiarFormulario,
  alternarOpcion,
  guardarReporte,
  limpiarFormulario,
  asesores,
  adminReportes,
  cargandoAdmin,
  mensajeAdmin,
  guardando,
  audioFile,
  setAudioFile,
  subiendoAudio,
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

        <section style={styles.heroCard}>
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

        <form onSubmit={guardarReporte}>
          <section style={styles.card}>
            <SectionTitle
              number="01"
              title="DATOS DEL REPORTE"
            />

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

              <Field label="Estado del objetivo">
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
          </section>

          <section style={styles.card}>
            <SectionTitle
              number="02"
              title="CALIDAD"
            />

            <Field label="Desvío principal">
              <textarea
                name="desvio"
                value={form.desvio}
                onChange={cambiarFormulario}
                placeholder="Ej: Validación de datos"
                style={styles.textarea}
              />
            </Field>

            <Field label="Recomendación">
              <textarea
                name="recomendacion"
                value={form.recomendacion}
                onChange={cambiarFormulario}
                placeholder="Qué debería trabajar el asesor..."
                style={styles.textarea}
              />
            </Field>

            <Field label="Objetivo de trabajo">
              <textarea
                name="objetivo"
                value={form.objetivo}
                onChange={cambiarFormulario}
                placeholder="Objetivo para la próxima evaluación..."
                style={styles.textarea}
              />
            </Field>

            <Field label="Items trabajados">
              <textarea
                name="items_calidad"
                value={form.items_calidad}
                onChange={cambiarFormulario}
                placeholder={
                  "Un item por línea.\nEj: Validación de datos\nCláusula de aceptación"
                }
                style={styles.textarea}
              />
            </Field>

            <Field label="Acciones realizadas">
              <textarea
                name="acciones_calidad"
                value={form.acciones_calidad}
                onChange={cambiarFormulario}
                placeholder={
                  "Una acción por línea.\nEj: Feedback individual\nEspacio de coaching"
                }
                style={styles.textarea}
              />
            </Field>

            <Field label="Comparativo semanal">
              <textarea
                name="comparativo_calidad"
                value={form.comparativo_calidad || ""}
                onChange={cambiarFormulario}
                placeholder="Ej: Semana anterior: 45% → Semana actual: 50%"
                style={styles.textarea}
              />
            </Field>

            <Field label="Observaciones">
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={cambiarFormulario}
                placeholder="Observaciones de Calidad..."
                style={styles.textarea}
              />
            </Field>
          </section>

          <section style={styles.card}>
            <SectionTitle
              number="03"
              title="PRODUCTIVIDAD"
            />

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

              <Field label="Estado">
                <input
                  name="estado_campania"
                  value={form.estado_campania}
                  onChange={cambiarFormulario}
                  placeholder="Ej: En proceso"
                  style={styles.input}
                />
              </Field>
            </div>

            <Field label="Comparativo semanal">
              <textarea
                name="comparativo_productividad"
                value={
                  form.comparativo_productividad
                }
                onChange={cambiarFormulario}
                placeholder="Comparativo de productividad..."
                style={styles.textarea}
              />
            </Field>

            <Field label="Items trabajados">
              <textarea
                name="items_productividad"
                value={form.items_productividad}
                onChange={cambiarFormulario}
                placeholder={
                  "Un item por línea.\nEj: Cierre con seguridad comercial\nOfrecimiento"
                }
                style={styles.textarea}
              />
            </Field>

            <Field label="Acciones realizadas">
              <textarea
                name="acciones_productividad"
                value={
                  form.acciones_productividad
                }
                onChange={cambiarFormulario}
                placeholder={
                  "Una acción por línea.\nEj: Simulación de llamada\nAcompañamiento en línea"
                }
                style={styles.textarea}
              />
            </Field>

            <Field label="Observaciones">
              <textarea
                name="observaciones_productividad"
                value={
                  form.observaciones_productividad
                }
                onChange={cambiarFormulario}
                placeholder="Observaciones de productividad..."
                style={styles.textarea}
              />
            </Field>
          </section>

          <section style={styles.card}>
            <SectionTitle
              number="04"
              title="TIPIFICACIONES"
            />

            <Field label="Tipificaciones realizadas">
              <textarea
                name="tipificaciones"
                value={form.tipificaciones}
                onChange={cambiarFormulario}
                placeholder={
                  "Una tipificación por línea."
                }
                style={styles.textarea}
              />
            </Field>

            <div style={styles.formGrid}>
              <Field label="Objetivo tipificaciones">
                <input
                  name="objetivo_tipificaciones"
                  value={
                    form.objetivo_tipificaciones
                  }
                  onChange={cambiarFormulario}
                  style={styles.input}
                />
              </Field>

              <Field label="Estado">
                <input
                  name="estado_tipificaciones"
                  value={
                    form.estado_tipificaciones
                  }
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
                  value={
                    form.tipificacion_objetivo
                  }
                  onChange={cambiarFormulario}
                  style={styles.input}
                />
              </Field>

              <Field label="Resultado">
                <input
                  name="tipificacion_resultado"
                  value={
                    form.tipificacion_resultado
                  }
                  onChange={cambiarFormulario}
                  style={styles.input}
                />
              </Field>

              <Field label="Compromiso">
                <input
                  name="tipificacion_compromiso"
                  value={
                    form.tipificacion_compromiso
                  }
                  onChange={cambiarFormulario}
                  style={styles.input}
                />
              </Field>
            </div>

            <Field label="Observaciones">
              <textarea
                name="tipificacion_observaciones"
                value={
                  form.tipificacion_observaciones
                }
                onChange={cambiarFormulario}
                style={styles.textarea}
              />
            </Field>
          </section>

          <section style={styles.card}>
            <SectionTitle
              number="05"
              title="AUDITORÍAS DE NO VENTAS"
            />

            <div style={styles.formGrid}>
              <Field label="Cantidad">
                <input
                  name="auditoria_cantidad"
                  value={
                    form.auditoria_cantidad
                  }
                  onChange={cambiarFormulario}
                  placeholder="Ej: 5"
                  style={styles.input}
                />
              </Field>

              <Field label="Coaching">
                <select
                  name="auditoria_coaching"
                  value={
                    form.auditoria_coaching
                  }
                  onChange={cambiarFormulario}
                  style={styles.input}
                >
                  <option value="">
                    Seleccioná
                  </option>

                  {COACHING_OPTIONS.map((opcion) => (
                    <option
                      key={opcion}
                      value={opcion}
                    >
                      {opcion}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Registro en sistema">
                <select
                  name="auditoria_registro"
                  value={
                    form.auditoria_registro
                  }
                  onChange={cambiarFormulario}
                  style={styles.input}
                >
                  <option value="">
                    Seleccioná
                  </option>

                  {REGISTRO_OPTIONS.map((opcion) => (
                    <option
                      key={opcion}
                      value={opcion}
                    >
                      {opcion}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Compromiso">
                <select
                  name="auditoria_compromiso"
                  value={
                    form.auditoria_compromiso
                  }
                  onChange={cambiarFormulario}
                  style={styles.input}
                >
                  <option value="">
                    Seleccioná
                  </option>

                  {COMPROMISO_AUDITORIA_OPTIONS.map(
                    (opcion) => (
                      <option
                        key={opcion}
                        value={opcion}
                      >
                        {opcion}
                      </option>
                    )
                  )}
                </select>
              </Field>
            </div>

            <MultiSelect
              title="Principales O.M."
              options={OM_OPTIONS}
              selected={form.auditoria_om}
              onToggle={(opcion) =>
                alternarOpcion(
                  "auditoria_om",
                  opcion
                )
              }
            />

            <MultiSelect
              title="Fortalezas"
              options={FORTALEZAS_OPTIONS}
              selected={form.auditoria_fortalezas}
              onToggle={(opcion) =>
                alternarOpcion(
                  "auditoria_fortalezas",
                  opcion
                )
              }
            />

            <Field label="Observaciones">
              <textarea
                name="auditoria_observaciones"
                value={
                  form.auditoria_observaciones
                }
                onChange={cambiarFormulario}
                placeholder="Observaciones de la auditoría..."
                style={styles.textarea}
              />
            </Field>

            <div style={styles.uploadBox}>
              <div>
                <strong>
                  Audio de la llamada auditada
                </strong>

                <p style={styles.muted}>
                  Seleccioná directamente el archivo
                  de audio.
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
                <div style={styles.fileName}>
                  ✓ {audioFile.name}
                </div>
              )}
            </div>
          </section>

          <button
            type="submit"
            disabled={guardando || subiendoAudio}
            style={{
              ...styles.primaryButton,
              marginBottom: "30px",
              opacity:
                guardando || subiendoAudio
                  ? 0.6
                  : 1,
            }}
          >
            {subiendoAudio
              ? "SUBIENDO AUDIO..."
              : guardando
              ? "GUARDANDO..."
              : "GUARDAR REPORTE"}
          </button>

          {mensajeAdmin && (
            <div
              style={{
                ...styles.success,
                marginBottom: "25px",
              }}
            >
              {mensajeAdmin}
            </div>
          )}
        </form>

        <section style={styles.card}>
          <div style={styles.historyHeader}>
            <div>
              <p style={styles.sectionEyebrow}>
                HISTORIAL
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
  pestana,
  setPestana,
}) {
  const reporteActual = reportes[0];

  const auditoria = leerAuditoria(
    reporteActual?.auditoria
  );

  if (cargandoReportes) {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
          <div style={styles.card}>
            <h2>
              Cargando información...
            </h2>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.asesorHeader}>
          <div>
            <div style={styles.portalText}>
              PORTAL DE CALIDAD
            </div>

            <h1 style={styles.asesorTitle}>
              Hola, {nombreCorto(asesorActual?.[0])}
            </h1>

            <div style={styles.weekText}>
              {reporteActual?.semana ||
                "Sin reporte disponible"}
            </div>
          </div>

          <div style={styles.headerRight}>
            <div
              style={styles.generalStatus}
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

        {!reporteActual ? (
          <section style={styles.card}>
            <h2>
              Todavía no hay reportes
            </h2>

            <p style={styles.muted}>
              Cuando Calidad cargue tu primer
              reporte semanal, vas a poder
              verlo desde acá.
            </p>
          </section>
        ) : (
          <>
            <nav style={styles.tabs}>
              <Tab
                active={pestana === "calidad"}
                onClick={() =>
                  setPestana("calidad")
                }
              >
                CALIDAD
              </Tab>

              <Tab
                active={
                  pestana === "productividad"
                }
                onClick={() =>
                  setPestana("productividad")
                }
              >
                PRODUCTIVIDAD
              </Tab>

              <Tab
                active={
                  pestana === "tipificaciones"
                }
                onClick={() =>
                  setPestana("tipificaciones")
                }
              >
                TIPIFICACIONES
              </Tab>

              <Tab
                active={
                  pestana === "auditorias"
                }
                onClick={() =>
                  setPestana("auditorias")
                }
              >
                AUDITORÍAS
              </Tab>

              <Tab
                active={
                  pestana === "actividades"
                }
                onClick={() =>
                  setPestana("actividades")
                }
              >
                ACTIVIDADES
              </Tab>

              <Tab
                active={
                  pestana === "historico"
                }
                onClick={() =>
                  setPestana("historico")
                }
              >
                HISTÓRICO
              </Tab>
            </nav>

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
                auditoria={auditoria}
              />
            )}

            {pestana === "actividades" && (
              <section style={styles.card}>
                <div style={styles.emptyActivities}>
                  <div style={styles.emptyIcon}>
                    +
                  </div>

                  <h2>
                    Próximamente
                  </h2>

                  <p style={styles.muted}>
                    Esta sección quedará
                    disponible para registrar
                    y consultar actividades.
                  </p>
                </div>
              </section>
            )}

            {pestana === "historico" && (
              <HistoricoTab
                reportes={reportes}
              />
            )}

            <FeedbackSection />
          </>
        )}
      </div>
    </main>
  );
}

function CalidadTab({ reporte }) {
  const nota = numero(reporte.nota);
  const objetivo = numero(
    reporte.objetivo_calidad
  );

  const faltan =
    objetivo !== null && nota !== null
      ? Math.max(objetivo - nota, 0)
      : null;

  const progreso =
    objetivo && objetivo > 0 && nota !== null
      ? Math.min(
          Math.round((nota / objetivo) * 100),
          100
        )
      : 0;

  return (
    <section style={styles.card}>
      <SectionTitle
        number="01"
        title="CALIDAD"
      />

      <div style={styles.bigMetricRow}>
        <div style={styles.bigScore}>
          <span>
            {reporte.nota || "-"}
          </span>

          <small>/ 100</small>
        </div>

        <div style={styles.metricCard}>
          <span>OBJETIVO</span>
          <strong>
            {reporte.objetivo_calidad ||
              "-"}
          </strong>
        </div>

        <div style={styles.metricCard}>
          <span>ESTADO</span>
          <strong>
            {reporte.estado_objetivo ||
              "-"}
          </strong>
        </div>

        <div style={styles.metricCard}>
          <span>PRODUCTO</span>
          <strong>
            {reporte.producto || "-"}
          </strong>
        </div>
      </div>

      <div style={styles.progressCard}>
        <div style={styles.progressHeader}>
          <strong>
            Progreso hacia el objetivo
          </strong>

          <strong>{progreso}%</strong>
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

      <div style={styles.highlightGrid}>
        <div style={styles.highlight}>
          <span>
            CUÁNTO FALTA PARA ALCANZAR EL
            OBJETIVO
          </span>

          <strong>
            {faltan !== null
              ? `${faltan} puntos`
              : "-"}
          </strong>
        </div>

        <div style={styles.highlight}>
          <span>
            DESVÍO PRINCIPAL
          </span>

          <strong>
            {reporte.desvio || "-"}
          </strong>
        </div>
      </div>

      <ContentBlock title="COMPARATIVO SEMANAL">
        <p style={styles.textContent}>
          {reporte.comparativo_calidad ||
            "Todavía no hay una semana anterior para comparar."}
        </p>
      </ContentBlock>

      <ContentBlock title="ITEMS TRABAJADOS">
        <ArrayList
          items={reporte.items_calidad}
          empty="No se registraron items."
        />
      </ContentBlock>

      <ContentBlock title="ACCIONES REALIZADAS">
        <ArrayList
          items={reporte.acciones_calidad}
          empty="No se registraron acciones."
        />
      </ContentBlock>

      <ContentBlock title="AUDITORÍA">
        {reporte.auditoria ? (
          <AuditoriaResumen
            auditoria={leerAuditoria(
              reporte.auditoria
            )}
          />
        ) : (
          <p style={styles.muted}>
            No hay información de auditoría.
          </p>
        )}
      </ContentBlock>

      <ContentBlock title="OBSERVACIONES">
        <p style={styles.textContent}>
          {reporte.observaciones ||
            "No hay observaciones cargadas."}
        </p>
      </ContentBlock>
    </section>
  );
}

function ProductividadTab({ reporte }) {
  return (
    <section style={styles.card}>
      <SectionTitle
        number="02"
        title="PRODUCTIVIDAD"
      />

      <div style={styles.bigMetricRow}>
        <div style={styles.metricCardLarge}>
          <span>SPH</span>

          <strong>
            {reporte.sph || "-"}
          </strong>

          <small>
            Objetivo SPH:{" "}
            {reporte.objetivo_sph ||
              "-"}
          </small>
        </div>

        <div style={styles.metricCardLarge}>
          <span>VENTAS</span>

          <strong>
            {reporte.ventas || "-"}
          </strong>

          <small>
            Objetivo ventas:{" "}
            {reporte.objetivo_ventas ||
              "-"}
          </small>
        </div>

        <div style={styles.metricCardLarge}>
          <span>
            OBJETIVO DE CAMPAÑA
          </span>

          <strong>
            {reporte.objetivo_campania ||
              "-"}
          </strong>

          <small>
            {reporte.estado_campania ||
              "-"}
          </small>
        </div>
      </div>

      <ContentBlock title="ESTADO">
        <StatusBadge
          text={
            reporte.estado_campania ||
            "Sin estado"
          }
        />
      </ContentBlock>

      <ContentBlock title="COMPARATIVO SEMANAL">
        <p style={styles.textContent}>
          {reporte.comparativo_productividad ||
            "Todavía no hay una semana anterior para comparar."}
        </p>
      </ContentBlock>

      <ContentBlock title="ITEMS TRABAJADOS">
        <ArrayList
          items={reporte.items_productividad}
          empty="No se registraron items."
        />
      </ContentBlock>

      <ContentBlock title="ACCIONES REALIZADAS">
        <ArrayList
          items={
            reporte.acciones_productividad
          }
          empty="No se registraron acciones."
        />
      </ContentBlock>

      <ContentBlock title="OBSERVACIONES">
        <p style={styles.textContent}>
          {reporte.observaciones_productividad ||
            "No hay observaciones cargadas."}
        </p>
      </ContentBlock>
    </section>
  );
}

function TipificacionesTab({ reporte }) {
  return (
    <section style={styles.card}>
      <SectionTitle
        number="03"
        title="TIPIFICACIONES"
      />

      <div style={styles.tipStatus}>
        {reporte.estado_tipificaciones ||
          "Sin estado"}
      </div>

      <div style={styles.fourMetrics}>
        <SmallMetric
          title="DESVÍO"
          value={
            reporte.tipificacion_desvio ||
            "-"
          }
        />

        <SmallMetric
          title="OBJETIVO"
          value={
            reporte.tipificacion_objetivo ||
            "-"
          }
        />

        <SmallMetric
          title="RESULTADO"
          value={
            reporte.tipificacion_resultado ||
            "-"
          }
        />

        <SmallMetric
          title="COMPROMISO"
          value={
            reporte.tipificacion_compromiso ||
            "-"
          }
        />
      </div>

      <ContentBlock title="TIPIFICACIONES">
        <ArrayList
          items={reporte.tipificaciones}
          empty="No se registraron tipificaciones."
        />
      </ContentBlock>

      <ContentBlock title="OBSERVACIONES">
        <p style={styles.textContent}>
          {reporte.tipificacion_observaciones ||
            "Sin observaciones cargadas."}
        </p>
      </ContentBlock>
    </section>
  );
}

function AuditoriasTab({
  reporte,
  auditoria,
}) {
  return (
    <section style={styles.card}>
      <SectionTitle
        number="04"
        title="AUDITORÍAS DE NO VENTAS"
      />

      <div style={styles.fourMetrics}>
        <SmallMetric
          title="CANTIDAD"
          value={
            auditoria.cantidad || "-"
          }
        />

        <SmallMetric
          title="COACHING"
          value={
            auditoria.coaching || "-"
          }
        />

        <SmallMetric
          title="REGISTRO EN SISTEMA"
          value={
            auditoria.registro || "-"
          }
        />

        <SmallMetric
          title="COMPROMISO"
          value={
            auditoria.compromiso || "-"
          }
        />
      </div>

      <ContentBlock title="PRINCIPALES O.M.">
        <ArrayList
          items={auditoria.om}
          empty="No hay O.M. cargadas."
        />
      </ContentBlock>

      <ContentBlock title="FORTALEZAS">
        <ArrayList
          items={auditoria.fortalezas}
          empty="No hay fortalezas cargadas."
        />
      </ContentBlock>

      <ContentBlock title="OBSERVACIONES">
        <p style={styles.textContent}>
          {auditoria.observaciones ||
            "No hay observaciones cargadas."}
        </p>
      </ContentBlock>

      {reporte.audio_url && (
        <div style={styles.audioBox}>
          <h3>
            Escuchar llamada auditada
          </h3>

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
  );
}

function HistoricoTab({ reportes }) {
  return (
    <section style={styles.card}>
      <SectionTitle
        number="06"
        title="HISTÓRICO"
      />

      {reportes.length <= 1 ? (
        <div style={styles.emptyHistory}>
          <h3>
            Todavía no hay historial
          </h3>

          <p style={styles.muted}>
            Cuando se carguen nuevas semanas,
            vas a poder ver tu evolución acá.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={styles.historyTable}>
            <thead>
              <tr>
                <th>Semana</th>
                <th>Nota</th>
                <th>Objetivo</th>
                <th>Estado</th>
                <th>Producto</th>
              </tr>
            </thead>

            <tbody>
              {reportes.map((reporte) => (
                <tr key={reporte.id}>
                  <td>
                    {reporte.semana || "-"}
                  </td>

                  <td>
                    {reporte.nota || "-"}
                  </td>

                  <td>
                    {reporte.objetivo_calidad ||
                      "-"}
                  </td>

                  <td>
                    {reporte.estado_objetivo ||
                      "-"}
                  </td>

                  <td>
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

function FeedbackSection() {
  const [feedback, setFeedback] =
    useState("");
  const [enviado, setEnviado] =
    useState(false);

  function enviarFeedback(e) {
    e.preventDefault();

    if (!feedback.trim()) return;

    setEnviado(true);
    setFeedback("");
  }

  return (
    <section style={styles.feedbackCard}>
      <div style={styles.feedbackNumber}>
        07
      </div>

      <div>
        <p style={styles.sectionEyebrow}>
          COMUNICACIÓN
        </p>

        <h2 style={{ marginTop: 0 }}>
          FEEDBACK DEL ASESOR
        </h2>

        <p style={styles.muted}>
          ¿Querés dejar algún comentario
          sobre tu reporte, una consulta o
          algo que quieras trabajar con
          Calidad?
        </p>

        <form onSubmit={enviarFeedback}>
          <textarea
            value={feedback}
            onChange={(e) =>
              setFeedback(e.target.value)
            }
            placeholder="Escribí tu comentario..."
            style={styles.textarea}
          />

          <button
            type="submit"
            style={styles.primaryButtonSmall}
          >
            ENVIAR FEEDBACK
          </button>

          {enviado && (
            <div style={styles.success}>
              ✓ Feedback enviado correctamente.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function AuditoriaResumen({ auditoria }) {
  return (
    <div>
      <div style={styles.fourMetrics}>
        <SmallMetric
          title="CANTIDAD"
          value={
            auditoria.cantidad || "-"
          }
        />

        <SmallMetric
          title="COACHING"
          value={
            auditoria.coaching || "-"
          }
        />

        <SmallMetric
          title="REGISTRO"
          value={
            auditoria.registro || "-"
          }
        />

        <SmallMetric
          title="COMPROMISO"
          value={
            auditoria.compromiso || "-"
          }
        />
      </div>

      <div style={styles.auditMiniGrid}>
        <div>
          <strong>
            Principales O.M.
          </strong>

          <ArrayList
            items={auditoria.om}
            empty="-"
          />
        </div>

        <div>
          <strong>
            Fortalezas
          </strong>

          <ArrayList
            items={auditoria.fortalezas}
            empty="-"
          />
        </div>
      </div>
    </div>
  );
}

function MultiSelect({
  title,
  options,
  selected,
  onToggle,
}) {
  return (
    <div style={styles.multiSelectBox}>
      <div style={styles.multiSelectTitle}>
        {title}
      </div>

      <div style={styles.optionGrid}>
        {options.map((opcion) => {
          const activo =
            selected?.includes(opcion);

          return (
            <button
              type="button"
              key={opcion}
              onClick={() =>
                onToggle(opcion)
              }
              style={{
                ...styles.optionButton,
                ...(activo
                  ? styles.optionButtonActive
                  : {}),
              }}
            >
              <span>
                {activo ? "✓" : "+"}
              </span>

              {opcion}
            </button>
          );
        })}
      </div>
    </div>
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

function SectionTitle({
  number,
  title,
}) {
  return (
    <div style={styles.sectionTitleWrap}>
      <div style={styles.sectionNumber}>
        {number}
      </div>

      <div>
        <p style={styles.sectionEyebrow}>
          SECCIÓN
        </p>

        <h2 style={styles.sectionTitle}>
          {title}
        </h2>
      </div>
    </div>
  );
}

function ContentBlock({
  title,
  children,
}) {
  return (
    <div style={styles.contentBlock}>
      <h3 style={styles.contentTitle}>
        {title}
      </h3>

      {children}
    </div>
  );
}

function SmallMetric({
  title,
  value,
}) {
  return (
    <div style={styles.smallMetric}>
      <span>{title}</span>

      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ text }) {
  return (
    <span style={styles.statusBadge}>
      {text}
    </span>
  );
}

function Tab({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.tab,
        ...(active ? styles.tabActive : {}),
      }}
    >
      {children}
    </button>
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

  if (!lista.length) {
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

function leerAuditoria(valor) {
  const vacio = {
    cantidad: "",
    om: [],
    coaching: "",
    registro: "",
    compromiso: "",
    fortalezas: [],
    observaciones: "",
  };

  if (!valor) return vacio;

  try {
    const resultado = JSON.parse(valor);

    return {
      ...vacio,
      ...resultado,
    };
  } catch {
    return {
      ...vacio,
      observaciones: valor,
    };
  }
}

function numero(valor) {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return null;
  }

  const n = Number(
    String(valor).replace(",", ".")
  );

  return Number.isNaN(n) ? null : n;
}

function nombreCorto(nombreCompleto) {
  if (!nombreCompleto) return "";

  const partes =
    nombreCompleto.split(",");

  if (partes.length > 1) {
    return partes[1].trim();
  }

  return nombreCompleto;
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eef7f7 0%, #f6f9f9 45%, #edf3f5 100%)",
    color: "#16343a",
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
    borderRadius: "24px",
    boxShadow:
      "0 25px 70px rgba(15, 72, 78, 0.13)",
    border:
      "1px solid #dcebed",
  },

  logo: {
    width: "58px",
    height: "58px",
    borderRadius: "17px",
    background: "#0d5961",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "18px",
  },

  portalLabel: {
    color: "#0d5961",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "7px",
  },

  loginTitle: {
    margin: 0,
    fontSize: "30px",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "32px 22px 70px",
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

  pageTitle: {
    margin: "8px 0 0",
    fontSize: "30px",
  },

  portalBadge: {
    display: "inline-block",
    background: "#0d5961",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "22px",
    border:
      "1px solid #dcebed",
    boxShadow:
      "0 12px 40px rgba(15, 72, 78, 0.07)",
    boxSizing: "border-box",
  },

  heroCard: {
    background:
      "linear-gradient(135deg, #0b4f57 0%, #13717a 100%)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "34px",
    marginBottom: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    boxShadow:
      "0 18px 45px rgba(10, 76, 84, 0.2)",
  },

  heroSmall: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    opacity: 0.8,
  },

  heroTitle: {
    margin: "0 0 10px",
    fontSize: "30px",
  },

  heroText: {
    margin: 0,
    opacity: 0.88,
  },

  muted: {
    color: "#6a7d82",
    lineHeight: 1.6,
  },

  label: {
    display: "block",
    fontWeight: "700",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#31565c",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border:
      "1px solid #cddfe2",
    background: "#ffffff",
    color: "#16343a",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "105px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border:
      "1px solid #cddfe2",
    background: "#ffffff",
    color: "#16343a",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "15px 20px",
    background: "#0d5961",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
      "0 8px 20px rgba(13, 89, 97, 0.18)",
  },

  primaryButtonSmall: {
    border: "none",
    borderRadius: "11px",
    padding: "13px 20px",
    background: "#0d5961",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
  },

  secondaryButton: {
    border:
      "1px solid #cbdde0",
    borderRadius: "11px",
    padding: "12px 18px",
    background: "#ffffff",
    color: "#31565c",
    fontWeight: "700",
    cursor: "pointer",
  },

  error: {
    background: "#fff2f2",
    color: "#b42318",
    border:
      "1px solid #f3c5c2",
    padding: "12px",
    borderRadius: "10px",
    margin: "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#edf9f3",
    color: "#087443",
    border:
      "1px solid #b6e5ca",
    padding: "13px",
    borderRadius: "11px",
    fontWeight: "700",
    marginTop: "15px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "5px 18px",
  },

  sectionTitleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },

  sectionNumber: {
    width: "42px",
    height: "42px",
    borderRadius: "13px",
    background: "#dff1f2",
    color: "#0d5961",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "13px",
  },

  sectionEyebrow: {
    margin: "0 0 4px",
    color: "#739096",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.3px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "23px",
    color: "#123f46",
  },

  uploadBox: {
    marginTop: "24px",
    padding: "20px",
    borderRadius: "15px",
    border:
      "1px dashed #a9c9cd",
    background: "#f4fafb",
  },

  fileInput: {
    marginTop: "12px",
    width: "100%",
  },

  fileName: {
    marginTop: "10px",
    color: "#087443",
    fontWeight: "700",
    fontSize: "13px",
  },

  multiSelectBox: {
    marginTop: "22px",
    padding: "20px",
    borderRadius: "16px",
    background: "#f5fafb",
    border:
      "1px solid #d8e9eb",
  },

  multiSelectTitle: {
    fontWeight: "800",
    color: "#234f56",
    marginBottom: "14px",
  },

  optionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "9px",
  },

  optionButton: {
    textAlign: "left",
    border:
      "1px solid #d4e3e5",
    background: "#ffffff",
    color: "#48646a",
    borderRadius: "10px",
    padding: "11px 12px",
    cursor: "pointer",
    fontSize: "13px",
  },

  optionButtonActive: {
    background: "#dff1f2",
    border:
      "1px solid #6daeb4",
    color: "#0d5961",
    fontWeight: "800",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#edf7f8",
    borderBottom:
      "1px solid #d7e6e8",
    fontSize: "13px",
  },

  td: {
    padding: "13px",
    borderBottom:
      "1px solid #edf1f2",
    fontSize: "14px",
  },

  historyHeader: {
    marginBottom: "20px",
  },

  asesorHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  portalText: {
    color: "#0d5961",
    fontWeight: "900",
    letterSpacing: "1.6px",
    fontSize: "12px",
  },

  asesorTitle: {
    margin: "7px 0 3px",
    fontSize: "31px",
    color: "#123f46",
  },

  weekText: {
    color: "#6b8186",
    fontSize: "14px",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  generalStatus: {
    background: "#fff6df",
    color: "#8a5b00",
    border:
      "1px solid #efd38b",
    padding: "9px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
  },

  tabs: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    background: "#ffffff",
    padding: "8px",
    borderRadius: "16px",
    border:
      "1px solid #dcebed",
    marginBottom: "22px",
    boxShadow:
      "0 8px 25px rgba(15,72,78,0.06)",
  },

  tab: {
    border: "none",
    background: "transparent",
    color: "#5d777c",
    borderRadius: "10px",
    padding: "11px 14px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  tabActive: {
    background: "#0d5961",
    color: "#ffffff",
  },

  bigMetricRow: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginBottom: "20px",
  },

  bigScore: {
    minHeight: "145px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #0d5961, #16808a)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  bigScore span: {
    fontSize: "43px",
    fontWeight: "900",
  },

  bigScore small: {
    opacity: 0.8,
  },

  metricCard: {
    minHeight: "110px",
    padding: "18px",
    borderRadius: "16px",
    background: "#f4f9fa",
    border:
      "1px solid #dcebed",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "8px",
  },

  metricCardLarge: {
    minHeight: "125px",
    padding: "20px",
    borderRadius: "17px",
    background: "#f4f9fa",
    border:
      "1px solid #dcebed",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "8px",
  },

  progressCard: {
    padding: "18px",
    borderRadius: "15px",
    background: "#f5fafb",
    marginBottom: "18px",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "13px",
    color: "#31565c",
  },

  progressTrack: {
    height: "10px",
    borderRadius: "99px",
    background: "#dce8ea",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: "99px",
    background:
      "linear-gradient(90deg, #0d5961, #32a1a9)",
  },

  highlightGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "14px",
    marginBottom: "20px",
  },

  highlight: {
    padding: "19px",
    borderRadius: "16px",
    background: "#fff9e9",
    border:
      "1px solid #f1dda5",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  contentBlock: {
    borderTop:
      "1px solid #e6eff0",
    paddingTop: "20px",
    marginTop: "20px",
  },

  contentTitle: {
    margin: "0 0 12px",
    color: "#527076",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  textContent: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.65,
    margin: 0,
  },

  list: {
    margin: 0,
    paddingLeft: "22px",
  },

  listItem: {
    marginBottom: "9px",
    lineHeight: 1.5,
  },

  fourMetrics: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
  },

  smallMetric: {
    padding: "17px",
    background: "#f5fafb",
    border:
      "1px solid #dcebed",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  smallMetric span: {
    color: "#70888d",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "0.8px",
  },

  smallMetric strong: {
    color: "#123f46",
    fontSize: "21px",
  },

  tipStatus: {
    display: "inline-block",
    background: "#fff6df",
    color: "#8a5b00",
    border:
      "1px solid #efd38b",
    borderRadius: "999px",
    padding: "9px 14px",
    fontSize: "12px",
    fontWeight: "900",
    marginBottom: "18px",
  },

  audioBox: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "16px",
    background: "#f3f8f9",
    border:
      "1px solid #dcebed",
  },

  auditMiniGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    marginTop: "20px",
  },

  emptyActivities: {
    minHeight: "260px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#dff1f2",
    color: "#0d5961",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "400",
    marginBottom: "14px",
  },

  emptyHistory: {
    padding: "35px 10px",
    textAlign: "center",
  },

  historyTable: {
    width: "100%",
    borderCollapse: "collapse",
  },

  feedbackCard: {
    background:
      "linear-gradient(135deg, #e5f3f4 0%, #f7fbfb 100%)",
    borderRadius: "22px",
    padding: "30px",
    display: "grid",
    gridTemplateColumns: "50px 1fr",
    gap: "20px",
    border:
      "1px solid #cfe4e6",
    marginBottom: "22px",
  },

  feedbackNumber: {
    width: "42px",
    height: "42px",
    borderRadius: "13px",
    background: "#0d5961",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "13px",
  },
};
