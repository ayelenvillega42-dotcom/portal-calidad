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
  ["Simonetta, Valentina", "8191", "simonetta.valentina@portalcalidad.com"],
  ["Tello, Marianela", "8042", "tello.marianela@portalcalidad.com"],
  ["Vasquez, Agustin", "8136", "vasquez.agustin@portalcalidad.com"],
  ["Viniegra, Agustín", "8199", "viniegra.agustin@portalcalidad.com"],
];

const opciones = {
  calidadItems: [
    "Información de otras compañías",
    "Presentación HS",
    "Validación de datos",
    "Cláusula de aceptación",
    "Información",
    "Preexistencia",
    "Negociación",
    "Precio",
    "Suscripción",
  ],

  calidadAcciones: [
    "Escucha personalizada",
    "Feedback individual",
    "Espacio de coaching",
    "Mesa de trabajo",
    "Simulación de llamada",
    "Transcripción de venta mediante Word con desvíos marcados",
    "Seguimiento diario",
  ],

  productividadItems: [
    "Cierre con seguridad comercial",
    "Ofrecimiento",
    "Rebate comercial",
    "Rebate asertivo",
    "Generación de interés",
    "Escucha activa",
    "Venta consultiva",
    "Venta conversacional",
    "Cambio de apertura",
  ],

  productividadAcciones: [
    "Simulación de llamada",
    "Acompañamiento en línea",
    "Devolución personalizada",
    "Seguimiento diario",
    "Espacio de coaching",
    "Escucha personalizada",
    "Mesa de trabajo",
  ],

  tipificaciones: [
    "No conforme con sumas aseguradas",
    "No interesado - Producto",
    "No interesado - No informa motivo",
    "Problemas económicos",
    "No interesado - Precio",
    "No interesado - Beneficios",
    "No interesado - Cobertura",
    "Cliente solicita información",
    "Cliente ya posee cobertura",
    "Otro motivo",
  ],

  om: [
    "Generación de interés",
    "Cambio de apertura",
    "Escucha activa",
    "Venta consultiva",
    "Venta conversacional",
    "Rebate comercial",
    "Rebate asertivo",
    "Manejo de objeciones",
    "Cierre",
    "Presentación del producto",
  ],

  fortalezas: [
    "Adaptabilidad",
    "Buena detección de necesidad",
    "Claridad en explicación",
    "Buen manejo de silencios",
    "Correcta contención",
    "Buena escucha",
    "Seguridad comercial",
    "Buena comunicación",
    "Correcto manejo de objeciones",
  ],

  auditoria: [
    "Correcta",
    "Con desvíos",
    "Requiere coaching",
    "Requiere seguimiento",
    "Sin información",
  ],
};

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

  items_calidad: [],
  acciones_calidad: [],

  auditoria_referencia: "",
  auditoria_estado: "",
  auditoria_observaciones: "",

  observaciones: "",

  sph: "",
  objetivo_sph: "",
  ventas: "",
  objetivo_ventas: "",
  objetivo_campania: "",
  estado_campania: "",

  items_productividad: [],
  acciones_productividad: [],
  observaciones_productividad: "",

  tipificaciones: [],
  objetivo_tipificaciones: "",
  estado_tipificaciones: "",
  tipificacion_desvio: "",
  tipificacion_objetivo: "",
  tipificacion_resultado: "",
  tipificacion_compromiso: "",
  tipificacion_observaciones: "",

  auditoria_no_ventas_cantidad: "",
  auditoria_no_ventas_om: [],
  auditoria_no_ventas_coaching: "",
  auditoria_no_ventas_sistema: "",
  auditoria_no_ventas_compromiso: "",
  auditoria_no_ventas_fortalezas: [],
  auditoria_no_ventas_observaciones: "",

  audio_file: null,
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
  const [mensajeAdmin, setMensajeAdmin] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [pestana, setPestana] = useState("calidad");
  const [feedback, setFeedback] = useState("");
  const [feedbackEnviado, setFeedbackEnviado] = useState(false);

  useEffect(() => {
    async function verificarSesion() {
      const {
        data: { session: sesion },
      } = await supabase.auth.getSession();

      setSession(sesion);

      if (sesion?.user?.email) {
        const correo = sesion.user.email.toLowerCase();

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
    const { name, value, files } = e.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: files ? files[0] : value,
    }));
  }

  function cambiarMulti(nombre, valor) {
    setForm((anterior) => {
      const actual = anterior[nombre] || [];

      if (actual.includes(valor)) {
        return {
          ...anterior,
          [nombre]: actual.filter((item) => item !== valor),
        };
      }

      return {
        ...anterior,
        [nombre]: [...actual, valor],
      };
    });
  }

  function limpiarFormulario() {
    setForm(formInicial);
  }

  async function subirAudio(file) {
    if (!file) return null;

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "mp3";

    const nombreArchivo = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const ruta = `reportes/${nombreArchivo}`;

    const { error } = await supabase.storage
      .from("audios")
      .upload(ruta, file, {
        cacheControl: "3600",
        upsert: false,
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
      let audioUrl = null;

      if (form.audio_file) {
        audioUrl = await subirAudio(form.audio_file);
      }

      const auditoria = {
        referencia: form.auditoria_referencia,
        estado: form.auditoria_estado,
        observaciones: form.auditoria_observaciones,
      };

      const productividad = {
        items: form.items_productividad,
        acciones: form.acciones_productividad,
        observaciones: form.observaciones_productividad,
      };

      const auditoriaNoVentas = {
        cantidad: form.auditoria_no_ventas_cantidad,
        principales_om: form.auditoria_no_ventas_om,
        coaching: form.auditoria_no_ventas_coaching,
        registro_sistema: form.auditoria_no_ventas_sistema,
        compromiso: form.auditoria_no_ventas_compromiso,
        fortalezas: form.auditoria_no_ventas_fortalezas,
        observaciones: form.auditoria_no_ventas_observaciones,
      };

      const observacionesCompletas = JSON.stringify({
        calidad_observaciones: form.observaciones,
        productividad,
        auditoria_no_ventas: auditoriaNoVentas,
      });

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

        items_calidad: form.items_calidad,
        acciones_calidad: form.acciones_calidad,

        auditoria: JSON.stringify(auditoria),

        audio_url: audioUrl,

        observaciones: observacionesCompletas,

        sph: form.sph || null,
        objetivo_sph: form.objetivo_sph || null,

        tipificaciones: form.tipificaciones,
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
              Ingresar
            </h1>

            <p style={styles.muted}>
              Accedé con tu email y contraseña.
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
        cambiarMulti={cambiarMulti}
        guardarReporte={guardarReporte}
        limpiarFormulario={limpiarFormulario}
        guardando={guardando}
        mensajeAdmin={mensajeAdmin}
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
        pestana={pestana}
        setPestana={setPestana}
        feedback={feedback}
        setFeedback={setFeedback}
        feedbackEnviado={feedbackEnviado}
        setFeedbackEnviado={setFeedbackEnviado}
      />
    );
  }

  return null;
}

function AdminPanel({
  form,
  cambiarFormulario,
  cambiarMulti,
  guardarReporte,
  limpiarFormulario,
  guardando,
  mensajeAdmin,
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
              Completá la información y el reporte
              quedará disponible para el asesor.
            </p>
          </div>

          <div style={styles.adminHeroNumber}>
            01
          </div>
        </section>

        <section style={styles.card}>
          <form onSubmit={guardarReporte}>
            <div style={styles.sectionTitleRow}>
              <div>
                <div style={styles.numberTag}>
                  01
                </div>
                <h2 style={styles.sectionTitle}>
                  Datos generales
                </h2>
              </div>
            </div>

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
                <select
                  name="estado_objetivo"
                  value={form.estado_objetivo}
                  onChange={cambiarFormulario}
                  style={styles.input}
                >
                  <option value="">
                    Seleccionar
                  </option>
                  <option value="ALCANZADO">
                    ALCANZADO
                  </option>
                  <option value="EN PROCESO">
                    EN PROCESO
                  </option>
                  <option value="DEBAJO DEL OBJETIVO">
                    DEBAJO DEL OBJETIVO
                  </option>
                </select>
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

            <TextField
              label="Desvío principal"
              name="desvio"
              value={form.desvio}
              onChange={cambiarFormulario}
              placeholder="Describí el principal desvío."
            />

            <TextField
              label="Recomendación"
              name="recomendacion"
              value={form.recomendacion}
              onChange={cambiarFormulario}
              placeholder="Qué debería trabajar el asesor."
            />

            <TextField
              label="Objetivo de trabajo"
              name="objetivo"
              value={form.objetivo}
              onChange={cambiarFormulario}
              placeholder="Objetivo para la próxima evaluación."
            />

            <MultiSelect
              title="Items trabajados"
              subtitle="Seleccioná todos los que correspondan."
              options={opciones.calidadItems}
              selected={form.items_calidad}
              onChange={(item) =>
                cambiarMulti("items_calidad", item)
              }
            />

            <MultiSelect
              title="Acciones realizadas"
              subtitle="Seleccioná todas las acciones realizadas."
              options={opciones.calidadAcciones}
              selected={form.acciones_calidad}
              onChange={(item) =>
                cambiarMulti("acciones_calidad", item)
              }
            />

            <section style={styles.innerSection}>
              <SectionHeading
                number="02"
                title="Auditoría"
                subtitle="La auditoría se mostrará dentro de Calidad."
              />

              <div style={styles.formGrid}>
                <Field label="Referencia de auditoría">
                  <input
                    name="auditoria_referencia"
                    value={form.auditoria_referencia}
                    onChange={cambiarFormulario}
                    placeholder="Ej: Llamada 15482"
                    style={styles.input}
                  />
                </Field>

                <Field label="Estado de auditoría">
                  <select
                    name="auditoria_estado"
                    value={form.auditoria_estado}
                    onChange={cambiarFormulario}
                    style={styles.input}
                  >
                    <option value="">
                      Seleccionar
                    </option>

                    {opciones.auditoria.map(
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

              <TextField
                label="Observaciones de auditoría"
                name="auditoria_observaciones"
                value={form.auditoria_observaciones}
                onChange={cambiarFormulario}
                placeholder="Observaciones de la auditoría."
              />
            </section>

            <section style={styles.innerSection}>
              <SectionHeading
                number="03"
                title="Productividad"
                subtitle="Información que verá el asesor en su tarjeta de Productividad."
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
                  <select
                    name="estado_campania"
                    value={form.estado_campania}
                    onChange={cambiarFormulario}
                    style={styles.input}
                  >
                    <option value="">
                      Seleccionar
                    </option>
                    <option value="ALCANZADO">
                      ALCANZADO
                    </option>
                    <option value="EN PROCESO">
                      EN PROCESO
                    </option>
                    <option value="DEBAJO DEL OBJETIVO">
                      DEBAJO DEL OBJETIVO
                    </option>
                  </select>
                </Field>
              </div>

              <MultiSelect
                title="Items trabajados"
                subtitle="Seleccioná todos los items de productividad."
                options={opciones.productividadItems}
                selected={form.items_productividad}
                onChange={(item) =>
                  cambiarMulti(
                    "items_productividad",
                    item
                  )
                }
              />

              <MultiSelect
                title="Acciones realizadas"
                subtitle="Seleccioná todas las acciones."
                options={opciones.productividadAcciones}
                selected={form.acciones_productividad}
                onChange={(item) =>
                  cambiarMulti(
                    "acciones_productividad",
                    item
                  )
                }
              />

              <TextField
                label="Observaciones de productividad"
                name="observaciones_productividad"
                value={
                  form.observaciones_productividad
                }
                onChange={cambiarFormulario}
                placeholder="Observaciones de productividad."
              />
            </section>

            <section style={styles.innerSection}>
              <SectionHeading
                number="04"
                title="Tipificaciones"
                subtitle="Seleccioná todas las tipificaciones correspondientes."
              />

              <MultiSelect
                title="Tipificaciones realizadas"
                subtitle="Podés seleccionar varias."
                options={opciones.tipificaciones}
                selected={form.tipificaciones}
                onChange={(item) =>
                  cambiarMulti(
                    "tipificaciones",
                    item
                  )
                }
              />

              <div style={styles.formGrid}>
                <Field label="Objetivo tipificaciones">
                  <input
                    name="objetivo_tipificaciones"
                    value={
                      form.objetivo_tipificaciones
                    }
                    onChange={cambiarFormulario}
                    placeholder="Ej: 14"
                    style={styles.input}
                  />
                </Field>

                <Field label="Estado tipificaciones">
                  <select
                    name="estado_tipificaciones"
                    value={
                      form.estado_tipificaciones
                    }
                    onChange={cambiarFormulario}
                    style={styles.input}
                  >
                    <option value="">
                      Seleccionar
                    </option>
                    <option value="ALCANZADO">
                      ALCANZADO
                    </option>
                    <option value="EN PROCESO">
                      EN PROCESO
                    </option>
                    <option value="DEBAJO DEL OBJETIVO">
                      DEBAJO DEL OBJETIVO
                    </option>
                  </select>
                </Field>

                <Field label="Desvío">
                  <input
                    name="tipificacion_desvio"
                    value={
                      form.tipificacion_desvio
                    }
                    onChange={cambiarFormulario}
                    placeholder="Ej: 1"
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
                    placeholder="Ej: 14"
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
                    placeholder="Ej: 14"
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
                    placeholder="Ej: SEGUIMIENTO"
                    style={styles.input}
                  />
                </Field>
              </div>

              <TextField
                label="Observaciones"
                name="tipificacion_observaciones"
                value={
                  form.tipificacion_observaciones
                }
                onChange={cambiarFormulario}
                placeholder="Observaciones de tipificación."
              />
            </section>

            <section style={styles.innerSection}>
              <SectionHeading
                number="05"
                title="Auditorías de no ventas"
                subtitle="Información adicional de las llamadas no convertidas."
              />

              <div style={styles.formGrid}>
                <Field label="Cantidad">
                  <input
                    name="auditoria_no_ventas_cantidad"
                    value={
                      form.auditoria_no_ventas_cantidad
                    }
                    onChange={cambiarFormulario}
                    placeholder="Ej: 5"
                    style={styles.input}
                  />
                </Field>

                <Field label="Coaching">
                  <input
                    name="auditoria_no_ventas_coaching"
                    value={
                      form.auditoria_no_ventas_coaching
                    }
                    onChange={cambiarFormulario}
                    placeholder="Ej: Realizado"
                    style={styles.input}
                  />
                </Field>

                <Field label="Registro en sistema">
                  <select
                    name="auditoria_no_ventas_sistema"
                    value={
                      form.auditoria_no_ventas_sistema
                    }
                    onChange={cambiarFormulario}
                    style={styles.input}
                  >
                    <option value="">
                      Seleccionar
                    </option>
                    <option value="CORRECTA">
                      CORRECTA
                    </option>
                    <option value="INCORRECTA">
                      INCORRECTA
                    </option>
                    <option value="PENDIENTE">
                      PENDIENTE
                    </option>
                  </select>
                </Field>

                <Field label="Compromiso">
                  <input
                    name="auditoria_no_ventas_compromiso"
                    value={
                      form.auditoria_no_ventas_compromiso
                    }
                    onChange={cambiarFormulario}
                    placeholder="Ej: APLICA DEVOLUCIÓN"
                    style={styles.input}
                  />
                </Field>
              </div>

              <MultiSelect
                title="Principales O.M."
                subtitle="Podés seleccionar varias."
                options={opciones.om}
                selected={
                  form.auditoria_no_ventas_om
                }
                onChange={(item) =>
                  cambiarMulti(
                    "auditoria_no_ventas_om",
                    item
                  )
                }
              />

              <MultiSelect
                title="Fortalezas"
                subtitle="Podés seleccionar varias."
                options={opciones.fortalezas}
                selected={
                  form.auditoria_no_ventas_fortalezas
                }
                onChange={(item) =>
                  cambiarMulti(
                    "auditoria_no_ventas_fortalezas",
                    item
                  )
                }
              />

              <TextField
                label="Observaciones"
                name="auditoria_no_ventas_observaciones"
                value={
                  form.auditoria_no_ventas_observaciones
                }
                onChange={cambiarFormulario}
                placeholder="Observaciones."
              />
            </section>

            <section style={styles.innerSection}>
              <SectionHeading
                number="06"
                title="Audio de auditoría"
                subtitle="Subí directamente el archivo de audio."
              />

              <label style={styles.uploadBox}>
                <div style={styles.uploadIcon}>
                  ♪
                </div>

                <div>
                  <strong>
                    {form.audio_file
                      ? form.audio_file.name
                      : "Seleccionar audio"}
                  </strong>

                  <div style={styles.uploadHint}>
                    MP3, WAV, M4A u otro formato compatible
                  </div>
                </div>

                <input
                  type="file"
                  name="audio_file"
                  accept="audio/*"
                  onChange={cambiarFormulario}
                  style={{ display: "none" }}
                />
              </label>
            </section>

            <TextField
              label="Observaciones generales"
              name="observaciones"
              value={form.observaciones}
              onChange={cambiarFormulario}
              placeholder="Observaciones generales del reporte."
            />

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
                  ...(mensajeAdmin.includes("✓")
                    ? styles.success
                    : styles.error),
                  marginTop: "16px",
                }}
              >
                {mensajeAdmin}
              </div>
            )}
          </form>
        </section>

        <section style={styles.card}>
          <div style={styles.sectionTitleRow}>
            <div>
              <div style={styles.numberTag}>
                HISTÓRICO
              </div>
              <h2 style={styles.sectionTitle}>
                Reportes cargados
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                window.print()
              }
              style={styles.printButton}
            >
              Imprimir
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

function AsesorPanel({
  asesorActual,
  reportes,
  cargandoReportes,
  cerrarSesion,
  pestana,
  setPestana,
  feedback,
  setFeedback,
  feedbackEnviado,
  setFeedbackEnviado,
}) {
  const reporteActual = reportes[0];

  const datos = useMemo(() => {
    return extraerDatos(reporteActual);
  }, [reporteActual]);

  const nota = Number(
    String(reporteActual?.nota || "").replace(
      "%",
      ""
    )
  );

  const objetivo = Number(
    String(
      reporteActual?.objetivo_calidad ||
        reporteActual?.objetivo ||
        ""
    ).replace("%", "")
  );

  const falta =
    nota && objetivo && objetivo > nota
      ? objetivo - nota
      : 0;

  const progreso =
    objetivo > 0
      ? Math.min(
          100,
          Math.round((nota / objetivo) * 100)
        )
      : 0;

  async function enviarFeedback() {
    if (!feedback.trim()) return;

    const contenido = {
      asesor: asesorActual?.[1],
      nombre: asesorActual?.[0],
      semana: reporteActual?.semana,
      feedback,
    };

    console.log(
      "Feedback enviado:",
      contenido
    );

    setFeedbackEnviado(true);
    setFeedback("");
  }

  const pestanas = [
    ["calidad", "01", "CALIDAD"],
    ["productividad", "02", "PRODUCTIVIDAD"],
    ["tipificaciones", "03", "TIPIFICACIONES"],
    ["auditorias", "04", "AUDITORÍAS"],
    ["actividades", "05", "ACTIVIDADES"],
    ["historico", "06", "HISTÓRICO"],
  ];

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

            <p style={styles.weekText}>
              {reporteActual?.semana ||
                "Semana"}
            </p>
          </div>

          <div style={styles.headerRight}>
            <div
              style={{
                ...styles.generalStatus,
                background:
                  estadoColor(
                    reporteActual?.estado_objetivo
                  ).background,
                color:
                  estadoColor(
                    reporteActual?.estado_objetivo
                  ).color,
              }}
            >
              {reporteActual?.estado_objetivo ||
                "SIN REPORTE"}
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
          <section style={styles.card}>
            <h2>
              Cargando información...
            </h2>
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
            <nav style={styles.tabs}>
              {pestanas.map(
                ([id, numero, titulo]) => (
                  <button
                    key={id}
                    onClick={() =>
                      setPestana(id)
                    }
                    style={{
                      ...styles.tab,
                      ...(pestana === id
                        ? styles.tabActive
                        : {}),
                    }}
                  >
                    <span
                      style={styles.tabNumber}
                    >
                      {numero}
                    </span>
                    <span>{titulo}</span>
                  </button>
                )
              )}
            </nav>

            {pestana === "calidad" && (
              <CalidadTab
                reporte={reporteActual}
                datos={datos}
                nota={nota}
                objetivo={objetivo}
                falta={falta}
                progreso={progreso}
              />
            )}

            {pestana === "productividad" && (
              <ProductividadTab
                reporte={reporteActual}
                datos={datos}
              />
            )}

            {pestana === "tipificaciones" && (
              <TipificacionesTab
                reporte={reporteActual}
              />
            )}

            {pestana === "auditorias" && (
              <AuditoriasTab
                datos={datos}
              />
            )}

            {pestana === "actividades" && (
              <section style={styles.card}>
                <div style={styles.emptyActivity}>
                  <div style={styles.emptyIcon}>
                    +
                  </div>

                  <div>
                    <div
                      style={
                        styles.sectionEyebrow
                      }
                    >
                      05
                    </div>

                    <h2>
                      ACTIVIDADES
                    </h2>

                    <p
                      style={styles.muted}
                    >
                      Próximamente esta sección
                      estará disponible para
                      registrar y consultar
                      actividades.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {pestana === "historico" && (
              <HistoricoTab
                reportes={reportes}
              />
            )}

            <section
              style={styles.feedbackCard}
            >
              <div style={styles.feedbackIcon}>
                07
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={
                    styles.sectionEyebrow
                  }
                >
                  FEEDBACK
                </div>

                <h2>
                  Feedback del asesor
                </h2>

                <p style={styles.muted}>
                  ¿Querés dejar algún comentario
                  sobre tu reporte, una consulta
                  o algo que quieras trabajar con
                  Calidad?
                </p>

                <textarea
                  value={feedback}
                  onChange={(e) =>
                    setFeedback(
                      e.target.value
                    )
                  }
                  placeholder="Escribí tu comentario acá..."
                  style={styles.feedbackInput}
                />

                <button
                  onClick={enviarFeedback}
                  disabled={!feedback.trim()}
                  style={{
                    ...styles.primaryButton,
                    maxWidth: "240px",
                    opacity:
                      feedback.trim()
                        ? 1
                        : 0.5,
                  }}
                >
                  ENVIAR FEEDBACK
                </button>

                {feedbackEnviado && (
                  <div
                    style={{
                      ...styles.success,
                      marginTop: "14px",
                    }}
                  >
                    ✓ Feedback enviado correctamente.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function CalidadTab({
  reporte,
  datos,
  nota,
  objetivo,
  falta,
  progreso,
}) {
  return (
    <section style={styles.card}>
      <SectionHeader
        number="01"
        title="CALIDAD"
        subtitle="Resultado de la evaluación semanal."
      />

      <div style={styles.qualityTop}>
        <div style={styles.bigScore}>
          <span>{nota || "-"}</span>
          <small>/ 100</small>
        </div>

        <div style={styles.qualityMetrics}>
          <Metric
            title="OBJETIVO"
            value={
              reporte.objetivo_calidad ||
              "-"
            }
          />

          <Metric
            title="ESTADO"
            value={
              reporte.estado_objetivo ||
              "-"
            }
          />

          <Metric
            title="PRODUCTO"
            value={
              reporte.producto || "-"
            }
          />
        </div>
      </div>

      <div style={styles.progressBlock}>
        <div style={styles.progressHeader}>
          <strong>
            Progreso hacia el objetivo
          </strong>

          <span>
            {progreso}%
          </span>
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

      <div style={styles.highlightGrid}>
        <Highlight
          title="CUÁNTO FALTA PARA ALCANZAR EL OBJETIVO"
          value={
            falta > 0
              ? `${falta} puntos`
              : "Objetivo alcanzado"
          }
        />

        <Highlight
          title="DESVÍO PRINCIPAL"
          value={
            reporte.desvio ||
            "No hay desvíos cargados."
          }
        />
      </div>

      <InfoBlock
        title="COMPARATIVO SEMANAL"
        content="Todavía no hay una semana anterior para comparar."
      />

      <TwoColumnLists
        leftTitle="ITEMS TRABAJADOS"
        leftItems={reporte.items_calidad}
        rightTitle="ACCIONES REALIZADAS"
        rightItems={
          reporte.acciones_calidad
        }
      />

      <div style={styles.auditBox}>
        <div style={styles.auditTitle}>
          AUDITORÍA
        </div>

        {datos.auditoria?.referencia ||
        datos.auditoria?.estado ||
        datos.auditoria?.observaciones ? (
          <>
            {datos.auditoria?.referencia && (
              <p>
                <strong>
                  Referencia:
                </strong>{" "}
                {datos.auditoria.referencia}
              </p>
            )}

            {datos.auditoria?.estado && (
              <p>
                <strong>
                  Estado:
                </strong>{" "}
                {datos.auditoria.estado}
              </p>
            )}

            {datos.auditoria
              ?.observaciones && (
              <p
                style={{
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {
                  datos.auditoria
                    .observaciones
                }
              </p>
            )}
          </>
        ) : (
          <p style={styles.muted}>
            No hay información de auditoría.
          </p>
        )}

        {reporte.audio_url && (
          <div style={styles.audioPlayer}>
            <div style={styles.audioLabel}>
              ESCUCHAR LLAMADA AUDITADA
            </div>

            <audio
              controls
              src={reporte.audio_url}
              style={{
                width: "100%",
                marginTop: "10px",
              }}
            />
          </div>
        )}
      </div>

      <InfoBlock
        title="OBSERVACIONES"
        content={
          datos.calidadObservaciones ||
          "No hay observaciones cargadas."
        }
      />
    </section>
  );
}

function ProductividadTab({
  reporte,
  datos,
}) {
  return (
    <section style={styles.card}>
      <SectionHeader
        number="02"
        title="PRODUCTIVIDAD"
        subtitle="Seguimiento de productividad y objetivos."
      />

      <div style={styles.productivityGrid}>
        <Metric
          title="SPH"
          value={
            reporte.sph || "-"
          }
          extra={`Objetivo SPH: ${
            reporte.objetivo_sph ||
            "-"
          }`}
        />

        <Metric
          title="VENTAS"
          value={
            datos.ventas || "-"
          }
          extra={`Objetivo ventas: ${
            datos.objetivoVentas ||
            "-"
          }`}
        />

        <Metric
          title="OBJETIVO DE CAMPAÑA"
          value={
            datos.objetivoCampania ||
            "-"
          }
          extra={
            datos.estadoCampania ||
            ""
          }
        />

        <Metric
          title="ESTADO"
          value={
            datos.estadoCampania ||
            "En proceso"
          }
        />
      </div>

      <InfoBlock
        title="COMPARATIVO SEMANAL"
        content="Todavía no hay una semana anterior para comparar."
      />

      <TwoColumnLists
        leftTitle="ITEMS TRABAJADOS"
        leftItems={
          datos.productividad
            ?.items
        }
        rightTitle="ACCIONES REALIZADAS"
        rightItems={
          datos.productividad
            ?.acciones
        }
      />

      <InfoBlock
        title="OBSERVACIONES"
        content={
          datos.productividad
            ?.observaciones ||
          "No hay observaciones cargadas."
        }
      />
    </section>
  );
}

function TipificacionesTab({
  reporte,
}) {
  return (
    <section style={styles.card}>
      <SectionHeader
        number="03"
        title="TIPIFICACIONES"
        subtitle="Seguimiento de tipificaciones."
      />

      <div style={styles.statusLarge}>
        {reporte.estado_tipificaciones ||
          "Sin estado"}
      </div>

      <div style={styles.tipMetrics}>
        <Metric
          title="DESVÍO"
          value={
            reporte.tipificacion_desvio ||
            "-"
          }
        />

        <Metric
          title="OBJETIVO"
          value={
            reporte.tipificacion_objetivo ||
            "-"
          }
        />

        <Metric
          title="RESULTADO"
          value={
            reporte.tipificacion_resultado ||
            "-"
          }
        />

        <Metric
          title="OBJETIVO GENERAL"
          value={
            reporte.objetivo_tipificaciones ||
            "-"
          }
        />
      </div>

      <ListBlock
        title="TIPIFICACIONES"
        items={reporte.tipificaciones}
      />

      <div style={styles.commitment}>
        <div>
          <div style={styles.miniLabel}>
            COMPROMISO
          </div>

          <strong>
            {reporte.tipificacion_compromiso ||
              "Sin compromiso cargado."}
          </strong>
        </div>

        <div>
          <div style={styles.miniLabel}>
            OBSERVACIONES
          </div>

          <span>
            {reporte.tipificacion_observaciones ||
              "Sin observaciones cargadas."}
          </span>
        </div>
      </div>
    </section>
  );
}

function AuditoriasTab({ datos }) {
  const auditoria =
    datos.auditoriaNoVentas || {};

  return (
    <section style={styles.card}>
      <SectionHeader
        number="04"
        title="AUDITORÍAS DE NO VENTAS"
        subtitle="Seguimiento de oportunidades sin venta."
      />

      <div style={styles.tipMetrics}>
        <Metric
          title="CANTIDAD"
          value={
            auditoria.cantidad || "-"
          }
        />

        <Metric
          title="COACHING"
          value={
            auditoria.coaching || "-"
          }
        />

        <Metric
          title="REGISTRO EN SISTEMA"
          value={
            auditoria.registro_sistema ||
            "-"
          }
        />

        <Metric
          title="COMPROMISO"
          value={
            auditoria.compromiso ||
            "-"
          }
        />
      </div>

      <div style={styles.auditLists}>
        <ListBlock
          title="PRINCIPALES O.M."
          items={
            auditoria.principales_om
          }
        />

        <ListBlock
          title="FORTALEZAS"
          items={
            auditoria.fortalezas
          }
        />
      </div>

      <InfoBlock
        title="OBSERVACIONES"
        content={
          auditoria.observaciones ||
          "No hay observaciones cargadas."
        }
      />
    </section>
  );
}

function HistoricoTab({ reportes }) {
  return (
    <section style={styles.card}>
      <SectionHeader
        number="06"
        title="HISTÓRICO"
        subtitle="Evolución de tus reportes."
      />

      {reportes.length === 0 ? (
        <p style={styles.muted}>
          No hay reportes anteriores.
        </p>
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
              {reportes.map(
                (reporte) => (
                  <tr
                    key={reporte.id}
                  >
                    <td style={styles.td}>
                      {reporte.semana ||
                        "-"}
                    </td>

                    <td style={styles.td}>
                      {reporte.nota ||
                        "-"}
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
                      {reporte.producto ||
                        "-"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function MultiSelect({
  title,
  subtitle,
  options,
  selected,
  onChange,
}) {
  return (
    <div style={styles.multiSection}>
      <div style={styles.multiHeader}>
        <div>
          <h3 style={styles.multiTitle}>
            {title}
          </h3>

          <p style={styles.multiSubtitle}>
            {subtitle}
          </p>
        </div>

        <div style={styles.selectedCount}>
          {selected.length} seleccionadas
        </div>
      </div>

      <div style={styles.optionGrid}>
        {options.map((option) => {
          const activo =
            selected.includes(option);

          return (
            <button
              type="button"
              key={option}
              onClick={() =>
                onChange(option)
              }
              style={{
                ...styles.optionButton,
                ...(activo
                  ? styles.optionButtonActive
                  : {}),
              }}
            >
              <span
                style={{
                  ...styles.optionCheck,
                  ...(activo
                    ? styles.optionCheckActive
                    : {}),
                }}
              >
                {activo ? "✓" : ""}
              </span>

              <span>{option}</span>
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

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <>
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
    </>
  );
}

function SectionHeading({
  number,
  title,
  subtitle,
}) {
  return (
    <div style={styles.innerHeading}>
      <div style={styles.numberTag}>
        {number}
      </div>

      <div>
        <h2 style={styles.innerTitle}>
          {title}
        </h2>

        <p style={styles.muted}>
          {subtitle}
        </p>
      </div>
    </div>
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
          SECCIÓN
        </div>

        <h2 style={styles.sectionMainTitle}>
          {title}
        </h2>

        <p style={styles.muted}>
          {subtitle}
        </p>
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

function Highlight({
  title,
  value,
}) {
  return (
    <div style={styles.highlight}>
      <div style={styles.highlightTitle}>
        {title}
      </div>

      <div style={styles.highlightValue}>
        {value}
      </div>
    </div>
  );
}

function InfoBlock({
  title,
  content,
}) {
  return (
    <div style={styles.infoBlock}>
      <div style={styles.infoTitle}>
        {title}
      </div>

      <div
        style={{
          ...styles.infoContent,
          whiteSpace: "pre-wrap",
        }}
      >
        {content}
      </div>
    </div>
  );
}

function ListBlock({
  title,
  items,
}) {
  const lista = convertirLista(items);

  return (
    <div style={styles.listBlock}>
      <div style={styles.infoTitle}>
        {title}
      </div>

      {lista.length === 0 ? (
        <p style={styles.muted}>
          No hay información cargada.
        </p>
      ) : (
        <div style={styles.chipList}>
          {lista.map(
            (item, index) => (
              <div
                key={`${item}-${index}`}
                style={styles.chip}
              >
                <span>✓</span>
                {item}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function TwoColumnLists({
  leftTitle,
  leftItems,
  rightTitle,
  rightItems,
}) {
  return (
    <div style={styles.twoColumn}>
      <ListBlock
        title={leftTitle}
        items={leftItems}
      />

      <ListBlock
        title={rightTitle}
        items={rightItems}
      />
    </div>
  );
}

function extraerDatos(reporte) {
  let observaciones = {};

  try {
    if (
      reporte?.observaciones &&
      typeof reporte.observaciones ===
        "string"
    ) {
      const parsed = JSON.parse(
        reporte.observaciones
      );

      if (
        parsed &&
        typeof parsed === "object"
      ) {
        observaciones = parsed;
      }
    }
  } catch {
    observaciones = {
      calidad_observaciones:
        reporte?.observaciones || "",
    };
  }

  let auditoria = {};

  try {
    if (reporte?.auditoria) {
      auditoria =
        typeof reporte.auditoria ===
        "string"
          ? JSON.parse(
              reporte.auditoria
            )
          : reporte.auditoria;
    }
  } catch {
    auditoria = {
      referencia:
        reporte?.auditoria || "",
    };
  }

  return {
    calidadObservaciones:
      observaciones.calidad_observaciones ||
      "",
    productividad:
      observaciones.productividad ||
      {},
    auditoriaNoVentas:
      observaciones.auditoria_no_ventas ||
      {},
    auditoria,
    ventas:
      observaciones.productividad?.ventas ||
      reporte?.ventas ||
      "",
    objetivoVentas:
      observaciones.productividad
        ?.objetivo_ventas ||
      reporte?.objetivo_ventas ||
      "",
    objetivoCampania:
      observaciones.productividad
        ?.objetivo_campania ||
      reporte?.objetivo_campania ||
      "",
    estadoCampania:
      observaciones.productividad
        ?.estado_campania ||
      reporte?.estado_campania ||
      "",
  };
}

function convertirLista(items) {
  if (Array.isArray(items)) {
    return items.filter(Boolean);
  }

  if (!items) return [];

  if (typeof items === "string") {
    try {
      const parsed =
        JSON.parse(items);

      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch {}

    return items
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function nombreCorto(nombre) {
  if (!nombre) return "";

  const partes =
    nombre.split(",");

  if (partes.length > 1) {
    return partes[1].trim();
  }

  return nombre;
}

function estadoColor(estado) {
  const texto =
    String(estado || "").toUpperCase();

  if (
    texto.includes("ALCANZADO")
  ) {
    return {
      background: "#e7f7ef",
      color: "#087443",
    };
  }

  if (
    texto.includes("EN PROCESO")
  ) {
    return {
      background: "#fff4d6",
      color: "#9a6700",
    };
  }

  return {
    background: "#fff0ed",
    color: "#c2412d",
  };
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(145deg, #edf6f7 0%, #f7fafb 50%, #e8f0f2 100%)",
    color: "#18343b",
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
    background: "#ffffff",
    borderRadius: "24px",
    padding: "42px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(18, 65, 73, 0.12)",
  },

  loadingIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background: "#0f5962",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontSize: "28px",
    fontWeight: "900",
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
    borderRadius: "28px",
    boxShadow:
      "0 25px 70px rgba(15, 89, 98, 0.15)",
    border:
      "1px solid #dce9eb",
  },

  logo: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #0f5962, #177b83)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "900",
    marginBottom: "22px",
  },

  loginEyebrow: {
    color: "#0f5962",
    fontWeight: "800",
    fontSize: "12px",
    letterSpacing: "1.2px",
  },

  loginTitle: {
    margin: "7px 0",
    fontSize: "34px",
    color: "#18343b",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "30px 20px 70px",
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "25px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  portalBadge: {
    display: "inline-block",
    background: "#0f5962",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.8px",
  },

  pageTitle: {
    margin: "10px 0 0",
    fontSize: "32px",
    color: "#18343b",
  },

  advisorTitle: {
    margin: "12px 0 5px",
    fontSize: "34px",
    color: "#18343b",
  },

  weekText: {
    margin: 0,
    color: "#58757c",
    fontSize: "15px",
    fontWeight: "600",
  },

  generalStatus: {
    padding: "10px 15px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.4px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "22px",
    border:
      "1px solid #dbe8ea",
    boxShadow:
      "0 12px 40px rgba(18, 65, 73, 0.07)",
  },

  adminHero: {
    background:
      "linear-gradient(135deg, #0d5059 0%, #167681 55%, #1d8c8e 100%)",
    color: "#ffffff",
    borderRadius: "26px",
    padding: "32px",
    marginBottom: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow:
      "0 18px 45px rgba(15, 89, 98, 0.18)",
  },

  heroEyebrow: {
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1.4px",
    opacity: 0.8,
  },

  adminHeroTitle: {
    margin: "8px 0",
    fontSize: "29px",
  },

  adminHeroText: {
    margin: 0,
    opacity: 0.88,
  },

  adminHeroNumber: {
    fontSize: "60px",
    fontWeight: "900",
    opacity: 0.18,
  },

  label: {
    display: "block",
    fontWeight: "800",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#31545b",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "12px",
    border:
      "1px solid #cbdcdf",
    background: "#ffffff",
    color: "#18343b",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "105px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "12px",
    border:
      "1px solid #cbdcdf",
    background: "#ffffff",
    color: "#18343b",
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
    padding: "14px 18px",
    background: "#0f5962",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "20px",
  },

  saveButton: {
    width: "100%",
    border: "none",
    borderRadius: "13px",
    padding: "17px",
    background:
      "linear-gradient(135deg, #0f5962, #177b83)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "25px",
  },

  secondaryButton: {
    border:
      "1px solid #cbdcdf",
    borderRadius: "11px",
    padding: "11px 17px",
    background: "#ffffff",
    color: "#31545b",
    fontWeight: "800",
    cursor: "pointer",
  },

  printButton: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 15px",
    background: "#e5f2f3",
    color: "#0f5962",
    fontWeight: "900",
    cursor: "pointer",
  },

  muted: {
    color: "#698187",
    lineHeight: 1.6,
  },

  error: {
    background: "#fff1ef",
    color: "#b93827",
    border:
      "1px solid #f4c5bd",
    padding: "12px",
    borderRadius: "11px",
    margin: "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#e9f8f1",
    color: "#087443",
    border:
      "1px solid #b8e6d0",
    padding: "13px",
    borderRadius: "11px",
    fontWeight: "800",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "5px 18px",
  },

  sectionTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "22px",
  },

  numberTag: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e5f2f3",
    color: "#0f5962",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.7px",
  },

  sectionTitle: {
    margin: "7px 0 0",
    color: "#18343b",
    fontSize: "24px",
  },

  innerSection: {
    background: "#f5fafb",
    border:
      "1px solid #dcebed",
    borderRadius: "19px",
    padding: "23px",
    marginTop: "25px",
  },

  innerHeading: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    marginBottom: "18px",
  },

  innerTitle: {
    margin: "1px 0 4px",
    fontSize: "21px",
    color: "#18343b",
  },

  multiSection: {
    marginTop: "24px",
    padding: "20px",
    background: "#ffffff",
    border:
      "1px solid #d8e7e9",
    borderRadius: "16px",
  },

  multiHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "15px",
  },

  multiTitle: {
    margin: 0,
    color: "#21444b",
    fontSize: "16px",
  },

  multiSubtitle: {
    margin: "4px 0 0",
    color: "#71868b",
    fontSize: "13px",
  },

  selectedCount: {
    background: "#e5f2f3",
    color: "#0f5962",
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
  },

  optionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "9px",
  },

  optionButton: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    textAlign: "left",
    border:
      "1px solid #d5e2e4",
    background: "#ffffff",
    color: "#3a555b",
    borderRadius: "11px",
    padding: "11px 12px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  optionButtonActive: {
    background: "#e6f5f5",
    border:
      "1px solid #62aeb2",
    color: "#0b5962",
    fontWeight: "800",
  },

  optionCheck: {
    width: "20px",
    height: "20px",
    minWidth: "20px",
    borderRadius: "6px",
    border:
      "1px solid #c7d7da",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "900",
  },

  optionCheckActive: {
    background: "#0f5962",
    borderColor: "#0f5962",
    color: "#ffffff",
  },

  uploadBox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
    border:
      "2px dashed #9cc4c8",
    borderRadius: "15px",
    background: "#f4fbfb",
    cursor: "pointer",
  },

  uploadIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#dff0f1",
    color: "#0f5962",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "21px",
  },

  uploadHint: {
    marginTop: "4px",
    color: "#789095",
    fontSize: "12px",
  },

  tabs: {
    display: "grid",
    gridTemplateColumns:
      "repeat(6, 1fr)",
    gap: "8px",
    background: "#ffffff",
    border:
      "1px solid #dbe8ea",
    padding: "8px",
    borderRadius: "17px",
    marginBottom: "22px",
    boxShadow:
      "0 8px 25px rgba(18, 65, 73, 0.05)",
  },

  tab: {
    border: "none",
    background: "transparent",
    color: "#637b81",
    padding: "13px 8px",
    borderRadius: "11px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "900",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },

  tabActive: {
    background: "#0f5962",
    color: "#ffffff",
    boxShadow:
      "0 5px 15px rgba(15, 89, 98, 0.18)",
  },

  tabNumber: {
    fontSize: "10px",
    opacity: 0.75,
  },

  sectionHeaderLarge: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    marginBottom: "25px",
  },

  sectionNumber: {
    width: "44px",
    height: "44px",
    minWidth: "44px",
    borderRadius: "13px",
    background: "#e5f2f3",
    color: "#0f5962",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  sectionEyebrow: {
    color: "#0f5962",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  sectionMainTitle: {
    margin: "4px 0",
    fontSize: "27px",
    color: "#18343b",
  },

  qualityTop: {
    display: "grid",
    gridTemplateColumns:
      "190px 1fr",
    gap: "20px",
    alignItems: "stretch",
  },

  bigScore: {
    minHeight: "180px",
    borderRadius: "20px",
    background:
      "linear-gradient(145deg, #0f5962, #177b83)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    boxShadow:
      "0 12px 30px rgba(15, 89, 98, 0.18)",
  },

  bigScoreSpan: {
    fontSize: "55px",
  },

  bigScore: {
    minHeight: "180px",
    borderRadius: "20px",
    background:
      "linear-gradient(145deg, #0f5962, #177b83)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    boxShadow:
      "0 12px 30px rgba(15, 89, 98, 0.18)",
    fontSize: "48px",
    fontWeight: "900",
  },

  qualityMetrics: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "13px",
  },

  metric: {
    background: "#f5fafb",
    border:
      "1px solid #dce9eb",
    borderRadius: "15px",
    padding: "17px",
  },

  metricTitle: {
    color: "#698187",
    fontSize: "11px",
    fontWeight: "900",
    marginBottom: "9px",
    letterSpacing: "0.5px",
  },

  metricValue: {
    fontSize: "23px",
    fontWeight: "900",
    color: "#0f5962",
  },

  metricExtra: {
    marginTop: "7px",
    fontSize: "12px",
    color: "#71868b",
  },

  progressBlock: {
    marginTop: "20px",
    padding: "18px",
    background: "#f5fafb",
    borderRadius: "15px",
    border:
      "1px solid #dce9eb",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    color: "#31545b",
    fontSize: "13px",
    marginBottom: "10px",
  },

  progressTrack: {
    height: "12px",
    borderRadius: "999px",
    background: "#dce9eb",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, #0f5962, #27a0a0)",
  },

  highlightGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "15px",
    marginTop: "18px",
  },

  highlight: {
    padding: "18px",
    borderRadius: "15px",
    background: "#edf8f7",
    border:
      "1px solid #cce7e6",
  },

  highlightTitle: {
    color: "#5b777c",
    fontSize: "11px",
    fontWeight: "900",
    marginBottom: "8px",
  },

  highlightValue: {
    color: "#0f5962",
    fontSize: "18px",
    fontWeight: "900",
    lineHeight: 1.4,
  },

  infoBlock: {
    marginTop: "18px",
    padding: "19px",
    background: "#f7fafb",
    border:
      "1px solid #e0eaec",
    borderRadius: "15px",
  },

  infoTitle: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#0f5962",
    letterSpacing: "0.8px",
    marginBottom: "10px",
  },

  infoContent: {
    color: "#31545b",
    lineHeight: 1.6,
    fontSize: "14px",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "15px",
    marginTop: "18px",
  },

  listBlock: {
    marginTop: "18px",
    padding: "19px",
    background: "#f7fafb",
    border:
      "1px solid #e0eaec",
    borderRadius: "15px",
  },

  chipList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  chip: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    background: "#e5f2f3",
    color: "#275961",
    borderRadius: "999px",
    padding: "9px 12px",
    fontSize: "12px",
    fontWeight: "700",
  },

  auditBox: {
    marginTop: "18px",
    padding: "20px",
    borderRadius: "16px",
    background: "#fff9ec",
    border:
      "1px solid #f0dfad",
  },

  auditTitle: {
    color: "#8a6700",
    fontWeight: "900",
    fontSize: "11px",
    letterSpacing: "0.8px",
    marginBottom: "10px",
  },

  audioPlayer: {
    marginTop: "18px",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "15px",
  },

  audioLabel: {
    fontSize: "11px",
    fontWeight: "900",
    color: "#0f5962",
  },

  productivityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "13px",
  },

  statusLarge: {
    display: "inline-block",
    background: "#fff4d6",
    color: "#936500",
    padding: "9px 14px",
    borderRadius: "999px",
    fontWeight: "900",
    fontSize: "12px",
    marginBottom: "18px",
  },

  tipMetrics: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "13px",
  },

  commitment: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "15px",
    marginTop: "18px",
    padding: "19px",
    borderRadius: "15px",
    background: "#edf8f7",
    border:
      "1px solid #cce7e6",
  },

  miniLabel: {
    color: "#0f5962",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "0.8px",
    marginBottom: "7px",
  },

  auditLists: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "15px",
  },

  emptyActivity: {
    minHeight: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    textAlign: "left",
  },

  emptyIcon: {
    width: "68px",
    height: "68px",
    borderRadius: "20px",
    background: "#e5f2f3",
    color: "#0f5962",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "300",
  },

  feedbackCard: {
    background:
      "linear-gradient(135deg, #0d5059, #167681)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "28px",
    display: "flex",
    gap: "20px",
    marginTop: "22px",
    boxShadow:
      "0 15px 40px rgba(15, 89, 98, 0.16)",
  },

  feedbackIcon: {
    width: "44px",
    height: "44px",
    minWidth: "44px",
    borderRadius: "13px",
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  feedbackInput: {
    width: "100%",
    minHeight: "120px",
    boxSizing: "border-box",
    border: "none",
    borderRadius: "13px",
    padding: "15px",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    fontSize: "14px",
    color: "#18343b",
    resize: "vertical",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "650px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#eaf4f5",
    color: "#31545b",
    borderBottom:
      "1px solid #d7e5e7",
    fontSize: "12px",
    fontWeight: "900",
  },

  td: {
    padding: "13px",
    borderBottom:
      "1px solid #e8eff0",
    fontSize: "13px",
    color: "#36565c",
  },
};
