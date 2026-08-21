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

const opcionesCalidadItems = [
  "Validación de datos",
  "Cláusula de aceptación",
  "Información",
  "Preexistencia",
  "Precio",
  "Suscripción",
  "Información de otras compañías",
  "Presentación HS",
  "Negociación",
];

const opcionesCalidadAcciones = [
  "Feedback individual",
  "Espacio de coaching",
  "Escucha personalizada",
  "Mesa de trabajo",
  "Calibración",
  "Transcripción de venta mediante Word con desvíos marcados",
  "Seguimiento semanal",
];

const opcionesAuditoriaCalidad = [
  "Llamada auditada",
  "Escucha personalizada",
  "Devolución de auditoría",
  "Feedback de auditoría",
  "Revisión de desvíos",
];

const opcionesProductividadItems = [
  "Cierre con seguridad comercial",
  "Ofrecimiento",
  "Rebate comercial",
  "Rebate asertivo",
  "Generación de interés",
  "Venta consultiva",
  "Venta conversacional",
  "Escucha activa",
  "Detección de necesidad",
];

const opcionesProductividadAcciones = [
  "Simulación de llamada",
  "Acompañamiento en línea",
  "Devolución personalizada",
  "Seguimiento diario",
  "Role Play",
  "Feedback individual",
  "Escucha personalizada",
  "Coaching",
];

const opcionesTipificaciones = [
  "No conforme con sumas aseguradas",
  "No interesado - Producto",
  "No interesado - No informa motivo",
  "Problemas económicos",
  "No interesado - Precio",
  "No interesado - Beneficios",
  "No interesado - Ya posee cobertura",
  "No interesado - Otro motivo",
];

const opcionesAuditoriaNoVenta = [
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

const opcionesFortalezas = [
  "Adaptabilidad",
  "Buena detección de necesidad",
  "Claridad en explicación",
  "Buen manejo de silencios",
  "Correcta contención",
  "Escucha activa",
  "Venta consultiva",
  "Buena argumentación",
  "Seguridad comercial",
];

const opcionesSiNo = [
  "CORRECTA",
  "INCORRECTA",
  "NO APLICA",
];

const opcionesCompromiso = [
  "SEGUIMIENTO",
  "APLICA DEVOLUCIÓN",
  "TRABAJAR EN PRÓXIMA ESCUCHA",
  "SIN COMPROMISO",
];

const estadoOpciones = [
  "EN OBJETIVO",
  "DEBAJO DEL OBJETIVO",
  "EN PROCESO",
];

function convertirLista(texto) {
  if (!texto) return [];

  return texto
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function listaAString(valor) {
  if (Array.isArray(valor)) {
    return valor.join("\n");
  }

  if (typeof valor === "string") {
    try {
      const parsed = JSON.parse(valor);

      if (Array.isArray(parsed)) {
        return parsed.join("\n");
      }
    } catch {}

    return valor;
  }

  return "";
}

function MultiSelect({
  label,
  options,
  value,
  onChange,
}) {
  const seleccionados = Array.isArray(value) ? value : [];

  function alternar(opcion) {
    if (seleccionados.includes(opcion)) {
      onChange(
        seleccionados.filter((item) => item !== opcion)
      );
    } else {
      onChange([...seleccionados, opcion]);
    }
  }

  return (
    <div style={styles.multiSelectWrapper}>
      <label style={styles.label}>{label}</label>

      <div style={styles.multiSelect}>
        {options.map((opcion) => {
          const seleccionado =
            seleccionados.includes(opcion);

          return (
            <label
              key={opcion}
              style={{
                ...styles.checkOption,
                ...(seleccionado
                  ? styles.checkOptionSelected
                  : {}),
              }}
            >
              <input
                type="checkbox"
                checked={seleccionado}
                onChange={() => alternar(opcion)}
              />

              <span>{opcion}</span>
            </label>
          );
        })}
      </div>

      {seleccionados.length > 0 && (
        <div style={styles.selectedCount}>
          {seleccionados.length} opción
          {seleccionados.length !== 1 ? "es" : ""} seleccionada
          {seleccionados.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

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
  const [cargandoReportes, setCargandoReportes] =
    useState(false);

  const [adminReportes, setAdminReportes] = useState([]);
  const [cargandoAdmin, setCargandoAdmin] =
    useState(false);

  const [pestana, setPestana] = useState("calidad");

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

    items_calidad: [],
    acciones_calidad: [],

    auditoria: [],
    observaciones: "",

    sph: "",
    objetivo_sph: "",
    ventas: "",
    objetivo_ventas: "",
    objetivo_campania: "",
    estado_campania: "",
    comparativo_productividad: "",
    items_productividad: [],
    acciones_productividad: "",
    observaciones_productividad: "",

    tipificaciones: [],
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

    feedback: "",
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

        if (
          correo === ADMIN_EMAIL.toLowerCase()
        ) {
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
    } = supabase.auth.onAuthStateChange(
      (_event, nuevaSesion) => {
        setSession(nuevaSesion);
      }
    );

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
      setLoginError(
        "Ingresá tu email y contraseña."
      );
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
      setLoginError(
        "El email o la contraseña no son correctos."
      );
      setEntrando(false);
      return;
    }

    const usuarioEmail =
      data.user?.email?.toLowerCase();

    if (
      usuarioEmail === ADMIN_EMAIL.toLowerCase()
    ) {
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

  function cambiarLista(nombre, valor) {
    setForm((anterior) => ({
      ...anterior,
      [nombre]: valor,
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

      items_calidad: [],
      acciones_calidad: [],

      auditoria: [],
      observaciones: "",

      sph: "",
      objetivo_sph: "",
      ventas: "",
      objetivo_ventas: "",
      objetivo_campania: "",
      estado_campania: "",
      comparativo_productividad: "",
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

      auditoria_cantidad: "",
      auditoria_om: [],
      auditoria_coaching: "",
      auditoria_registro: "",
      auditoria_compromiso: "",
      auditoria_fortalezas: [],
      auditoria_observaciones: "",

      feedback: "",
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
        form.items_calidad,
      acciones_calidad:
        form.acciones_calidad,

      auditoria:
        form.auditoria,
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
        form.comparativo_productividad ||
        null,

      items_productividad:
        form.items_productividad,

      acciones_productividad:
        form.acciones_productividad,

      observaciones_productividad:
        form.observaciones_productividad ||
        null,

      tipificaciones:
        form.tipificaciones,

      objetivo_tipificaciones:
        form.objetivo_tipificaciones ||
        null,

      estado_tipificaciones:
        form.estado_tipificaciones ||
        null,

      tipificacion_desvio:
        form.tipificacion_desvio ||
        null,

      tipificacion_objetivo:
        form.tipificacion_objetivo ||
        null,

      tipificacion_resultado:
        form.tipificacion_resultado ||
        null,

      tipificacion_compromiso:
        form.tipificacion_compromiso ||
        null,

      tipificacion_observaciones:
        form.tipificacion_observaciones ||
        null,

      auditoria_cantidad:
        form.auditoria_cantidad || null,

      auditoria_om:
        form.auditoria_om,

      auditoria_coaching:
        form.auditoria_coaching ||
        null,

      auditoria_registro:
        form.auditoria_registro ||
        null,

      auditoria_compromiso:
        form.auditoria_compromiso ||
        null,

      auditoria_fortalezas:
        form.auditoria_fortalezas,

      auditoria_observaciones:
        form.auditoria_observaciones ||
        null,
    };

    const { error } = await supabase
      .from("reportes")
      .insert([nuevoReporte]);

    if (error) {
      console.error(error);

      setMensajeAdmin(
        "No se pudo guardar el reporte. Revisá que las columnas nuevas existan en Supabase."
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
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div>
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.adminTitle}>
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
                Seleccioná las opciones correspondientes
                y el reporte quedará disponible para el
                asesor.
              </p>
            </div>
          </section>

          <section style={styles.card}>
            <form onSubmit={guardarReporte}>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>
                    Asesor
                  </label>

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
                    value={
                      form.objetivo_calidad
                    }
                    onChange={cambiarFormulario}
                    placeholder="Ej: 70"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    Estado
                  </label>

                  <select
                    name="estado_objetivo"
                    value={
                      form.estado_objetivo
                    }
                    onChange={cambiarFormulario}
                    style={styles.input}
                  >
                    <option value="">
                      Seleccioná estado
                    </option>

                    {estadoOpciones.map(
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
                </div>

                <div>
                  <label style={styles.label}>
                    Producto
                  </label>

                  <input
                    name="producto"
                    value={form.producto}
                    onChange={cambiarFormulario}
                    placeholder="Ej: AP"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.adminSection}>
                <div style={styles.adminSectionHeader}>
                  <span style={styles.sectionNumber}>
                    01
                  </span>

                  <div>
                    <h2 style={styles.adminSectionTitle}>
                      CALIDAD
                    </h2>

                    <p style={styles.sectionDescription}>
                      Información que verá el asesor
                      dentro de su tarjeta de Calidad.
                    </p>
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
                  value={
                    form.recomendacion
                  }
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

                <MultiSelect
                  label="Items trabajados"
                  options={
                    opcionesCalidadItems
                  }
                  value={
                    form.items_calidad
                  }
                  onChange={(valor) =>
                    cambiarLista(
                      "items_calidad",
                      valor
                    )
                  }
                />

                <MultiSelect
                  label="Acciones realizadas"
                  options={
                    opcionesCalidadAcciones
                  }
                  value={
                    form.acciones_calidad
                  }
                  onChange={(valor) =>
                    cambiarLista(
                      "acciones_calidad",
                      valor
                    )
                  }
                />

                <MultiSelect
                  label="Auditoría"
                  options={
                    opcionesAuditoriaCalidad
                  }
                  value={form.auditoria}
                  onChange={(valor) =>
                    cambiarLista(
                      "auditoria",
                      valor
                    )
                  }
                />

                <label style={styles.label}>
                  Observaciones
                </label>

                <textarea
                  name="observaciones"
                  value={
                    form.observaciones
                  }
                  onChange={cambiarFormulario}
                  placeholder="Observaciones de calidad..."
                  style={styles.textarea}
                />
              </div>

              <div style={styles.adminSection}>
                <div style={styles.adminSectionHeader}>
                  <span style={styles.sectionNumber}>
                    02
                  </span>

                  <div>
                    <h2 style={styles.adminSectionTitle}>
                      PRODUCTIVIDAD
                    </h2>

                    <p style={styles.sectionDescription}>
                      Indicadores y acciones de
                      productividad.
                    </p>
                  </div>
                </div>

                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>
                      SPH
                    </label>

                    <input
                      name="sph"
                      value={form.sph}
                      onChange={
                        cambiarFormulario
                      }
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
                      value={
                        form.objetivo_sph
                      }
                      onChange={
                        cambiarFormulario
                      }
                      placeholder="Ej: 0.5"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Ventas
                    </label>

                    <input
                      name="ventas"
                      value={form.ventas}
                      onChange={
                        cambiarFormulario
                      }
                      placeholder="Ej: 12"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Objetivo ventas
                    </label>

                    <input
                      name="objetivo_ventas"
                      value={
                        form.objetivo_ventas
                      }
                      onChange={
                        cambiarFormulario
                      }
                      placeholder="Ej: 40"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Objetivo de campaña
                    </label>

                    <input
                      name="objetivo_campania"
                      value={
                        form.objetivo_campania
                      }
                      onChange={
                        cambiarFormulario
                      }
                      placeholder="Ej: 50"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Estado
                    </label>

                    <select
                      name="estado_campania"
                      value={
                        form.estado_campania
                      }
                      onChange={
                        cambiarFormulario
                      }
                      style={styles.input}
                    >
                      <option value="">
                        Seleccioná estado
                      </option>

                      {estadoOpciones.map(
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
                  </div>
                </div>

                <label style={styles.label}>
                  Comparativo semanal
                </label>

                <textarea
                  name="comparativo_productividad"
                  value={
                    form.comparativo_productividad
                  }
                  onChange={
                    cambiarFormulario
                  }
                  placeholder="Ej: S2 0.10 → S3 0.15 (+0.05)"
                  style={styles.textareaSmall}
                />

                <MultiSelect
                  label="Items trabajados"
                  options={
                    opcionesProductividadItems
                  }
                  value={
                    form.items_productividad
                  }
                  onChange={(valor) =>
                    cambiarLista(
                      "items_productividad",
                      valor
                    )
                  }
                />

                <MultiSelect
                  label="Acciones realizadas"
                  options={
                    opcionesProductividadAcciones
                  }
                  value={
                    form.acciones_productividad
                  }
                  onChange={(valor) =>
                    cambiarLista(
                      "acciones_productividad",
                      valor
                    )
                  }
                />

                <label style={styles.label}>
                  Observaciones
                </label>

                <textarea
                  name="observaciones_productividad"
                  value={
                    form.observaciones_productividad
                  }
                  onChange={
                    cambiarFormulario
                  }
                  placeholder="Observaciones de productividad..."
                  style={styles.textarea}
                />
              </div>

              <div style={styles.adminSection}>
                <div style={styles.adminSectionHeader}>
                  <span style={styles.sectionNumber}>
                    03
                  </span>

                  <div>
                    <h2 style={styles.adminSectionTitle}>
                      TIPIFICACIONES
                    </h2>

                    <p style={styles.sectionDescription}>
                      Seleccioná todas las tipificaciones
                      correspondientes.
                    </p>
                  </div>
                </div>

                <MultiSelect
                  label="Tipificaciones"
                  options={
                    opcionesTipificaciones
                  }
                  value={
                    form.tipificaciones
                  }
                  onChange={(valor) =>
                    cambiarLista(
                      "tipificaciones",
                      valor
                    )
                  }
                />

                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>
                      Objetivo tipificaciones
                    </label>

                    <input
                      name="objetivo_tipificaciones"
                      value={
                        form.objetivo_tipificaciones
                      }
                      onChange={
                        cambiarFormulario
                      }
                      placeholder="Ej: 14"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Estado
                    </label>

                    <select
                      name="estado_tipificaciones"
                      value={
                        form.estado_tipificaciones
                      }
                      onChange={
                        cambiarFormulario
                      }
                      style={styles.input}
                    >
                      <option value="">
                        Seleccioná estado
                      </option>

                      {estadoOpciones.map(
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
                  </div>

                  <div>
                    <label style={styles.label}>
                      Desvío
                    </label>

                    <input
                      name="tipificacion_desvio"
                      value={
                        form.tipificacion_desvio
                      }
                      onChange={
                        cambiarFormulario
                      }
                      placeholder="Ej: 1"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Objetivo
                    </label>

                    <input
                      name="tipificacion_objetivo"
                      value={
                        form.tipificacion_objetivo
                      }
                      onChange={
                        cambiarFormulario
                      }
                      placeholder="Ej: 14"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Resultado
                    </label>

                    <input
                      name="tipificacion_resultado"
                      value={
                        form.tipificacion_resultado
                      }
                      onChange={
                        cambiarFormulario
                      }
                      placeholder="Ej: 14"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Compromiso
                    </label>

                    <select
                      name="tipificacion_compromiso"
                      value={
                        form.tipificacion_compromiso
                      }
                      onChange={
                        cambiarFormulario
                      }
                      style={styles.input}
                    >
                      <option value="">
                        Seleccioná compromiso
                      </option>

                      {opcionesCompromiso.map(
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
                  </div>
                </div>

                <label style={styles.label}>
                  Observaciones
                </label>

                <textarea
                  name="tipificacion_observaciones"
                  value={
                    form.tipificacion_observaciones
                  }
                  onChange={
                    cambiarFormulario
                  }
                  placeholder="Observaciones..."
                  style={styles.textarea}
                />
              </div>

              <div style={styles.adminSection}>
                <div style={styles.adminSectionHeader}>
                  <span style={styles.sectionNumber}>
                    04
                  </span>

                  <div>
                    <h2 style={styles.adminSectionTitle}>
                      AUDITORÍAS DE NO VENTAS
                    </h2>

                    <p style={styles.sectionDescription}>
                      Información de las auditorías
                      realizadas sobre no ventas.
                    </p>
                  </div>
                </div>

                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.label}>
                      Cantidad
                    </label>

                    <input
                      name="auditoria_cantidad"
                      value={
                        form.auditoria_cantidad
                      }
                      onChange={
                        cambiarFormulario
                      }
                      placeholder="Ej: 5"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Coaching
                    </label>

                    <input
                      name="auditoria_coaching"
                      value={
                        form.auditoria_coaching
                      }
                      onChange={
                        cambiarFormulario
                      }
                      placeholder="Ej: 2"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Registro en sistema
                    </label>

                    <select
                      name="auditoria_registro"
                      value={
                        form.auditoria_registro
                      }
                      onChange={
                        cambiarFormulario
                      }
                      style={styles.input}
                    >
                      <option value="">
                        Seleccioná una opción
                      </option>

                      {opcionesSiNo.map(
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
                  </div>

                  <div>
                    <label style={styles.label}>
                      Compromiso
                    </label>

                    <select
                      name="auditoria_compromiso"
                      value={
                        form.auditoria_compromiso
                      }
                      onChange={
                        cambiarFormulario
                      }
                      style={styles.input}
                    >
                      <option value="">
                        Seleccioná compromiso
                      </option>

                      {opcionesCompromiso.map(
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
                  </div>
                </div>

                <MultiSelect
                  label="Principales O.M."
                  options={
                    opcionesAuditoriaNoVenta
                  }
                  value={
                    form.auditoria_om
                  }
                  onChange={(valor) =>
                    cambiarLista(
                      "auditoria_om",
                      valor
                    )
                  }
                />

                <MultiSelect
                  label="Fortalezas"
                  options={
                    opcionesFortalezas
                  }
                  value={
                    form.auditoria_fortalezas
                  }
                  onChange={(valor) =>
                    cambiarLista(
                      "auditoria_fortalezas",
                      valor
                    )
                  }
                />

                <label style={styles.label}>
                  Observaciones
                </label>

                <textarea
                  name="auditoria_observaciones"
                  value={
                    form.auditoria_observaciones
                  }
                  onChange={
                    cambiarFormulario
                  }
                  placeholder="Observaciones de auditoría..."
                  style={styles.textarea}
                />
              </div>

              <div style={styles.saveArea}>
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
                  <div
                    style={{
                      ...styles.success,
                      marginTop: "15px",
                    }}
                  >
                    {mensajeAdmin}
                  </div>
                )}
              </div>
            </form>
          </section>

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
                          <tr
                            key={reporte.id}
                          >
                            <td
                              style={styles.td}
                            >
                              {asesor
                                ? asesor[0]
                                : reporte.usuario}
                            </td>

                            <td
                              style={styles.td}
                            >
                              {reporte.semana ||
                                "-"}
                            </td>

                            <td
                              style={styles.td}
                            >
                              {reporte.nota ||
                                "-"}
                            </td>

                            <td
                              style={styles.td}
                            >
                              {reporte.producto ||
                                "-"}
                            </td>

                            <td
                              style={styles.td}
                            >
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

  if (modo === "asesor") {
    const reporteActual = reportes[0];

    const nota = Number(
      reporteActual?.nota
    );
    const objetivo = Number(
      reporteActual?.objetivo_calidad
    );

    const progreso =
      nota && objetivo
        ? Math.min(
            100,
            Math.round(
              (nota / objetivo) * 100
            )
          )
        : 0;

    const falta =
      nota && objetivo
        ? Math.max(0, objetivo - nota)
        : 0;

    const semanasAnteriores =
      reportes.length > 1
        ? reportes.slice(1, 2)
        : [];

    const anterior =
      semanasAnteriores[0];

    const renderComparativo = (
      actual,
      previo
    ) => {
      if (!previo) {
        return "Todavía no hay una semana anterior para comparar.";
      }

      if (
        actual === undefined ||
        actual === null ||
        previo === undefined ||
        previo === null
      ) {
        return "No hay datos suficientes para comparar.";
      }

      return `Semana anterior: ${previo} → Semana actual: ${actual}`;
    };

    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.advisorHeader}>
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
                  "Sin reporte cargado"}
              </p>
            </div>

            <div style={styles.headerRight}>
              <div
                style={{
                  ...styles.generalStatus,
                  ...(reporteActual?.estado_objetivo ===
                  "EN OBJETIVO"
                    ? styles.statusGood
                    : styles.statusAttention),
                }}
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
            <>
              <nav style={styles.tabs}>
                {[
                  ["calidad", "CALIDAD"],
                  [
                    "productividad",
                    "PRODUCTIVIDAD",
                  ],
                  [
                    "tipificaciones",
                    "TIPIFICACIONES",
                  ],
                  [
                    "auditorias",
                    "AUDITORÍAS",
                  ],
                  [
                    "actividades",
                    "ACTIVIDADES",
                  ],
                  ["historico", "HISTÓRICO"],
                  ["feedback", "FEEDBACK"],
                ].map(
                  ([id, nombre], index) => (
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
                        style={
                          styles.tabNumber
                        }
                      >
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      {nombre}
                    </button>
                  )
                )}
              </nav>

              {pestana === "calidad" && (
                <section style={styles.advisorCard}>
                  <SectionTitle
                    number="01"
                    title="CALIDAD"
                  />

                  <div style={styles.scoreLayout}>
                    <div>
                      <div style={styles.scoreLabel}>
                        NOTA
                      </div>

                      <div style={styles.bigScore}>
                        {reporteActual?.nota ||
                          "-"}
                        <span>
                          / 100
                        </span>
                      </div>
                    </div>

                    <div
                      style={
                        styles.scoreMetrics
                      }
                    >
                      <Metric
                        title="OBJETIVO"
                        value={
                          reporteActual?.objetivo_calidad ||
                          "-"
                        }
                      />

                      <Metric
                        title="ESTADO"
                        value={
                          reporteActual?.estado_objetivo ||
                          "-"
                        }
                      />

                      <Metric
                        title="PRODUCTO"
                        value={
                          reporteActual?.producto ||
                          "-"
                        }
                      />

                      <Metric
                        title="CUÁNTO FALTA"
                        value={
                          falta
                            ? `${falta} puntos`
                            : "Objetivo alcanzado"
                        }
                      />
                    </div>
                  </div>

                  <div style={styles.progressArea}>
                    <div
                      style={
                        styles.progressHeader
                      }
                    >
                      <span>
                        Progreso hacia el objetivo
                      </span>

                      <strong>
                        {progreso}%
                      </strong>
                    </div>

                    <div
                      style={styles.progressTrack}
                    >
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${progreso}%`,
                        }}
                      />
                    </div>
                  </div>

                  <InfoBlock
                    title="DESVÍO PRINCIPAL"
                    content={
                      reporteActual?.desvio ||
                      "No hay desvíos cargados."
                    }
                    type="attention"
                  />

                  <InfoBlock
                    title="COMPARATIVO SEMANAL"
                    content={renderComparativo(
                      reporteActual?.nota,
                      anterior?.nota
                    )}
                  />

                  <ListBlock
                    title="ITEMS TRABAJADOS"
                    items={
                      reporteActual?.items_calidad
                    }
                    empty="No se registraron items de calidad."
                  />

                  <ListBlock
                    title="ACCIONES REALIZADAS"
                    items={
                      reporteActual?.acciones_calidad
                    }
                    empty="No se registraron acciones de calidad."
                  />

                  <InfoBlock
                    title="AUDITORÍA"
                    content={listaAString(
                      reporteActual?.auditoria
                    ) || "No hay información de auditoría."}
                  />

                  <InfoBlock
                    title="OBSERVACIONES"
                    content={
                      reporteActual?.observaciones ||
                      "No hay observaciones cargadas."
                    }
                  />
                </section>
              )}

              {pestana ===
                "productividad" && (
                <section style={styles.advisorCard}>
                  <SectionTitle
                    number="02"
                    title="PRODUCTIVIDAD"
                  />

                  <div style={styles.scoreMetrics}>
                    <Metric
                      title="SPH"
                      value={
                        reporteActual?.sph ||
                        "-"
                      }
                      extra={`Objetivo SPH: ${
                        reporteActual?.objetivo_sph ||
                        "-"
                      }`}
                    />

                    <Metric
                      title="VENTAS"
                      value={
                        reporteActual?.ventas ||
                        "-"
                      }
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

                  <InfoBlock
                    title="COMPARATIVO SEMANAL"
                    content={
                      reporteActual?.comparativo_productividad ||
                      renderComparativo(
                        reporteActual?.sph,
                        anterior?.sph
                      )
                    }
                  />

                  <ListBlock
                    title="ITEMS TRABAJADOS"
                    items={
                      reporteActual?.items_productividad
                    }
                    empty="No se registraron items."
                  />

                  <ListBlock
                    title="ACCIONES REALIZADAS"
                    items={
                      reporteActual?.acciones_productividad
                    }
                    empty="No se registraron acciones."
                  />

                  <InfoBlock
                    title="OBSERVACIONES"
                    content={
                      reporteActual?.observaciones_productividad ||
                      "No hay observaciones cargadas."
                    }
                  />
                </section>
              )}

              {pestana ===
                "tipificaciones" && (
                <section style={styles.advisorCard}>
                  <SectionTitle
                    number="03"
                    title="TIPIFICACIONES"
                  />

                  <div style={styles.statusLarge}>
                    {reporteActual?.estado_tipificaciones ||
                      "Sin estado"}
                  </div>

                  <div style={styles.scoreMetrics}>
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
                        reporteActual?.objetivo_tipificaciones ||
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

                    <Metric
                      title="COMPROMISO"
                      value={
                        reporteActual?.tipificacion_compromiso ||
                        "-"
                      }
                    />
                  </div>

                  <ListBlock
                    title="TIPIFICACIONES"
                    items={
                      reporteActual?.tipificaciones
                    }
                    empty="No se registraron tipificaciones."
                  />

                  <InfoBlock
                    title="OBSERVACIONES"
                    content={
                      reporteActual?.tipificacion_observaciones ||
                      "Sin observaciones cargadas."
                    }
                  />
                </section>
              )}

              {pestana ===
                "auditorias" && (
                <section style={styles.advisorCard}>
                  <SectionTitle
                    number="04"
                    title="AUDITORÍAS DE NO VENTAS"
                  />

                  <div style={styles.scoreMetrics}>
                    <Metric
                      title="CANTIDAD"
                      value={
                        reporteActual?.auditoria_cantidad ||
                        "-"
                      }
                    />

                    <Metric
                      title="COACHING"
                      value={
                        reporteActual?.auditoria_coaching ||
                        "-"
                      }
                    />

                    <Metric
                      title="REGISTRO EN SISTEMA"
                      value={
                        reporteActual?.auditoria_registro ||
                        "-"
                      }
                    />

                    <Metric
                      title="COMPROMISO"
                      value={
                        reporteActual?.auditoria_compromiso ||
                        "-"
                      }
                    />
                  </div>

                  <ListBlock
                    title="PRINCIPALES O.M."
                    items={
                      reporteActual?.auditoria_om
                    }
                    empty="No se registraron O.M."
                  />

                  <ListBlock
                    title="FORTALEZAS"
                    items={
                      reporteActual?.auditoria_fortalezas
                    }
                    empty="No se registraron fortalezas."
                  />

                  <InfoBlock
                    title="OBSERVACIONES"
                    content={
                      reporteActual?.auditoria_observaciones ||
                      "No hay observaciones cargadas."
                    }
                  />
                </section>
              )}

              {pestana ===
                "actividades" && (
                <section style={styles.advisorCard}>
                  <SectionTitle
                    number="05"
                    title="ACTIVIDADES"
                  />

                  <div
                    style={styles.comingSoon}
                  >
                    <div style={styles.plus}>
                      +
                    </div>

                    <h2>
                      Próximamente
                    </h2>

                    <p>
                      Esta sección quedará
                      disponible para registrar
                      y consultar actividades.
                    </p>
                  </div>
                </section>
              )}

              {pestana ===
                "historico" && (
                <section style={styles.advisorCard}>
                  <SectionTitle
                    number="06"
                    title="HISTÓRICO"
                  />

                  {reportes.length <= 1 ? (
                    <div
                      style={styles.emptyHistory}
                    >
                      <h3>
                        Todavía no hay historial
                      </h3>

                      <p>
                        Cuando tengas más de un
                        reporte semanal, vas a
                        poder consultar tu
                        evolución acá.
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        overflowX: "auto",
                      }}
                    >
                      <table
                        style={styles.table}
                      >
                        <thead>
                          <tr>
                            <th
                              style={styles.th}
                            >
                              Semana
                            </th>

                            <th
                              style={styles.th}
                            >
                              Nota
                            </th>

                            <th
                              style={styles.th}
                            >
                              Objetivo
                            </th>

                            <th
                              style={styles.th}
                            >
                              Estado
                            </th>

                            <th
                              style={styles.th}
                            >
                              Producto
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {reportes.map(
                            (reporte) => (
                              <tr
                                key={
                                  reporte.id
                                }
                              >
                                <td
                                  style={
                                    styles.td
                                  }
                                >
                                  {reporte.semana ||
                                    "-"}
                                </td>

                                <td
                                  style={
                                    styles.td
                                  }
                                >
                                  {reporte.nota ||
                                    "-"}
                                </td>

                                <td
                                  style={
                                    styles.td
                                  }
                                >
                                  {reporte.objetivo_calidad ||
                                    "-"}
                                </td>

                                <td
                                  style={
                                    styles.td
                                  }
                                >
                                  {reporte.estado_objetivo ||
                                    "-"}
                                </td>

                                <td
                                  style={
                                    styles.td
                                  }
                                >
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
              )}

              {pestana ===
                "feedback" && (
                <section style={styles.advisorCard}>
                  <SectionTitle
                    number="07"
                    title="FEEDBACK DEL ASESOR"
                  />

                  <p
                    style={
                      styles.feedbackQuestion
                    }
                  >
                    ¿Querés dejar algún comentario
                    sobre tu reporte, una consulta
                    o algo que quieras trabajar con
                    Calidad?
                  </p>

                  <textarea
                    placeholder="Escribí tu comentario..."
                    style={styles.feedbackTextarea}
                  />

                  <button
                    style={
                      styles.feedbackButton
                    }
                  >
                    ENVIAR FEEDBACK
                  </button>
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

function SectionTitle({ number, title }) {
  return (
    <div style={styles.sectionTitleBlock}>
      <div style={styles.sectionNumber}>
        {number}
      </div>

      <h2>{title}</h2>
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

function InfoBlock({
  title,
  content,
  type,
}) {
  return (
    <div
      style={{
        ...styles.infoSection,
        ...(type === "attention"
          ? styles.attentionSection
          : {}),
      }}
    >
      <div style={styles.blockTitle}>
        {title}
      </div>

      <div style={styles.blockContent}>
        {content}
      </div>
    </div>
  );
}

function ListBlock({
  title,
  items,
  empty,
}) {
  let lista = [];

  if (Array.isArray(items)) {
    lista = items;
  } else if (typeof items === "string") {
    try {
      const convertido = JSON.parse(
        items
      );

      if (Array.isArray(convertido)) {
        lista = convertido;
      } else {
        lista = convertirLista(items);
      }
    } catch {
      lista = convertirLista(items);
    }
  }

  return (
    <div style={styles.infoSection}>
      <div style={styles.blockTitle}>
        {title}
      </div>

      {lista.length === 0 ? (
        <div style={styles.emptyText}>
          {empty}
        </div>
      ) : (
        <div style={styles.advisorList}>
          {lista.map((item, index) => (
            <div
              key={index}
              style={styles.advisorListItem}
            >
              <span
                style={styles.listDot}
              />
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eef5f6 0%, #f7faf9 45%, #eaf2f3 100%)",
    color: "#173b43",
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
      "0 25px 70px rgba(18, 61, 68, 0.14)",
    border:
      "1px solid #dce9ea",
  },

  logo: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #0d5963, #167783)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "900",
    marginBottom: "20px",
    boxShadow:
      "0 12px 25px rgba(13, 89, 99, 0.25)",
  },

  loginEyebrow: {
    color: "#0d6873",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    marginBottom: "8px",
  },

  loginTitle: {
    margin: 0,
    fontSize: "32px",
    color: "#173b43",
  },

  container: {
    width: "100%",
    maxWidth: "1200px",
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    paddingBottom: "26px",
    marginBottom: "24px",
    borderBottom:
      "2px solid #cbdfe1",
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
    background: "#0d5963",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.7px",
  },

  adminTitle: {
    margin: "9px 0 0",
    color: "#173b43",
    fontSize: "30px",
  },

  advisorTitle: {
    margin: "12px 0 5px",
    color: "#173b43",
    fontSize: "34px",
    letterSpacing: "-0.5px",
  },

  advisorWeek: {
    margin: 0,
    color: "#527078",
    fontSize: "15px",
    fontWeight: "700",
  },

  generalStatus: {
    padding: "10px 16px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.4px",
  },

  statusGood: {
    background: "#e7f7ef",
    color: "#137a4b",
    border:
      "1px solid #a8dfc5",
  },

  statusAttention: {
    background: "#fff4dc",
    color: "#9a6500",
    border:
      "1px solid #efd28d",
  },

  adminHero: {
    background:
      "linear-gradient(135deg, #0b4f59 0%, #167783 100%)",
    color: "#ffffff",
    borderRadius: "26px",
    padding: "34px",
    marginBottom: "22px",
    boxShadow:
      "0 18px 45px rgba(13, 89, 99, 0.22)",
  },

  heroSmall: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    opacity: 0.75,
  },

  heroTitle: {
    margin: "0 0 9px",
    fontSize: "29px",
  },

  heroText: {
    margin: 0,
    opacity: 0.86,
    lineHeight: 1.5,
  },

  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    marginBottom: "22px",
    border:
      "1px solid #dce8e9",
    boxShadow:
      "0 12px 38px rgba(18, 61, 68, 0.07)",
  },

  advisorCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "34px",
    border:
      "1px solid #dce8e9",
    boxShadow:
      "0 15px 45px rgba(18, 61, 68, 0.08)",
  },

  adminSection: {
    background: "#f7fbfb",
    border:
      "1px solid #d8e8e9",
    borderRadius: "20px",
    padding: "25px",
    marginTop: "25px",
  },

  adminSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "8px",
  },

  adminSectionTitle: {
    margin: 0,
    color: "#174b54",
    fontSize: "21px",
  },

  sectionNumber: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    background: "#dceff0",
    color: "#0d6873",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "13px",
    flexShrink: 0,
  },

  sectionDescription: {
    color: "#668087",
    margin: "5px 0 0",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  label: {
    display: "block",
    fontWeight: "800",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#34565e",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border:
      "1px solid #cbdcdf",
    background: "#ffffff",
    color: "#173b43",
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
      "1px solid #cbdcdf",
    background: "#ffffff",
    color: "#173b43",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
  },

  textareaSmall: {
    width: "100%",
    minHeight: "75px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border:
      "1px solid #cbdcdf",
    background: "#ffffff",
    color: "#173b43",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(235px, 1fr))",
    gap: "6px 18px",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "15px 18px",
    background:
      "linear-gradient(135deg, #0d5963, #167783)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "22px",
    boxShadow:
      "0 8px 20px rgba(13, 89, 99, 0.18)",
  },

  secondaryButton: {
    border:
      "1px solid #cbdcdf",
    borderRadius: "11px",
    padding: "11px 17px",
    background: "#ffffff",
    color: "#34565e",
    fontWeight: "800",
    cursor: "pointer",
  },

  error: {
    background: "#fff1f0",
    color: "#b42318",
    border:
      "1px solid #f5c2c0",
    padding: "12px",
    borderRadius: "10px",
    margin: "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#e9f8f0",
    color: "#087443",
    border:
      "1px solid #a9dec4",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "800",
  },

  multiSelectWrapper: {
    marginTop: "4px",
  },

  multiSelect: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "9px",
    padding: "13px",
    background: "#ffffff",
    border:
      "1px solid #cbdcdf",
    borderRadius: "13px",
  },

  checkOption: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "10px 11px",
    borderRadius: "9px",
    border:
      "1px solid #e3edef",
    background: "#fbfdfd",
    cursor: "pointer",
    color: "#36575e",
    fontSize: "13px",
    fontWeight: "600",
    lineHeight: 1.3,
  },

  checkOptionSelected: {
    background: "#e8f5f6",
    border:
      "1px solid #8fc9ce",
    color: "#0d5963",
    fontWeight: "800",
  },

  selectedCount: {
    color: "#0d6873",
    fontSize: "12px",
    fontWeight: "800",
    marginTop: "7px",
  },

  saveArea: {
    marginTop: "26px",
  },

  historyHeader: {
    marginBottom: "18px",
  },

  sectionEyebrow: {
    margin: "0 0 6px",
    color: "#0d6873",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1.4px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "650px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#edf6f7",
    color: "#31545c",
    borderBottom:
      "1px solid #d7e6e8",
    fontSize: "12px",
  },

  td: {
    padding: "13px",
    borderBottom:
      "1px solid #edf2f3",
    fontSize: "14px",
    color: "#36565d",
  },

  tabs: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    padding: "7px",
    marginBottom: "20px",
    background: "#ffffff",
    border:
      "1px solid #d7e5e7",
    borderRadius: "17px",
    boxShadow:
      "0 8px 25px rgba(18, 61, 68, 0.05)",
  },

  tab: {
    border: "none",
    background: "transparent",
    color: "#58747a",
    padding: "11px 14px",
    borderRadius: "11px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "12px",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  tabActive: {
    background: "#0d5963",
    color: "#ffffff",
    boxShadow:
      "0 6px 16px rgba(13, 89, 99, 0.18)",
  },

  tabNumber: {
    fontSize: "10px",
    opacity: 0.75,
  },

  sectionTitleBlock: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    paddingBottom: "22px",
    marginBottom: "25px",
    borderBottom:
      "1px solid #e2edef",
  },

  sectionTitleBlock h2: {
    margin: 0,
    fontSize: "25px",
    color: "#174b54",
    letterSpacing: "-0.3px",
  },

  scoreLayout: {
    display: "grid",
    gridTemplateColumns:
      "minmax(220px, 0.8fr) minmax(400px, 2fr)",
    gap: "24px",
    alignItems: "stretch",
  },

  scoreLabel: {
    color: "#678087",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  bigScore: {
    marginTop: "5px",
    fontSize: "54px",
    fontWeight: "900",
    color: "#0d5963",
    lineHeight: 1,
  },

  bigScoreSpan: {
    fontSize: "18px",
    color: "#789097",
    fontWeight: "700",
  },

  scoreMetrics: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "13px",
  },

  metric: {
    background: "#f4f9f9",
    border:
      "1px solid #dbe9ea",
    borderRadius: "15px",
    padding: "17px",
  },

  metricTitle: {
    color: "#678087",
    fontSize: "11px",
    fontWeight: "900",
    marginBottom: "8px",
    letterSpacing: "0.4px",
  },

  metricValue: {
    fontSize: "22px",
    fontWeight: "900",
    color: "#174b54",
    lineHeight: 1.2,
  },

  metricExtra: {
    marginTop: "7px",
    fontSize: "12px",
    color: "#678087",
    lineHeight: 1.4,
  },

  progressArea: {
    marginTop: "25px",
    padding: "18px",
    background: "#f4f9f9",
    borderRadius: "15px",
    border:
      "1px solid #dbe9ea",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    color: "#526f76",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "9px",
  },

  progressTrack: {
    width: "100%",
    height: "10px",
    background: "#dce9ea",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #0d5963, #2a96a0)",
    borderRadius: "999px",
    transition:
      "width 0.3s ease",
  },

  infoSection: {
    marginTop: "22px",
    paddingTop: "22px",
    borderTop:
      "1px solid #e5edef",
  },

  attentionSection: {
    padding: "18px",
    background: "#fff8e9",
    border:
      "1px solid #efdba6",
    borderRadius: "15px",
  },

  blockTitle: {
    color: "#56737a",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1px",
    marginBottom: "10px",
  },

  blockContent: {
    color: "#294e56",
    fontSize: "15px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  advisorList: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "9px",
  },

  advisorListItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "9px",
    padding: "11px 13px",
    background: "#f5fafa",
    border:
      "1px solid #dce9ea",
    borderRadius: "11px",
    color: "#31565e",
    fontSize: "14px",
    lineHeight: 1.4,
  },

  listDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#17818c",
    marginTop: "6px",
    flexShrink: 0,
  },

  emptyText: {
    color: "#7b9095",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  statusLarge: {
    display: "inline-block",
    padding: "9px 15px",
    borderRadius: "999px",
    background: "#fff4dc",
    border:
      "1px solid #efd28d",
    color: "#936100",
    fontWeight: "900",
    fontSize: "12px",
    marginBottom: "20px",
  },

  comingSoon: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    border:
      "1px dashed #b8ced1",
    borderRadius: "18px",
    background: "#f7fbfb",
    color: "#54727a",
  },

  plus: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "#e3f1f2",
    color: "#0d6873",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "300",
    marginBottom: "13px",
  },

  emptyHistory: {
    padding: "55px 20px",
    textAlign: "center",
    background: "#f7fbfb",
    borderRadius: "17px",
    color: "#627d83",
  },

  feedbackQuestion: {
    color: "#45646b",
    fontSize: "16px",
    lineHeight: 1.6,
    marginBottom: "18px",
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "160px",
    boxSizing: "border-box",
    padding: "16px",
    borderRadius: "14px",
    border:
      "1px solid #cbdcdf",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    fontSize: "15px",
    color: "#173b43",
    outline: "none",
  },

  feedbackButton: {
    marginTop: "14px",
    border: "none",
    borderRadius: "12px",
    padding: "14px 22px",
    background:
      "linear-gradient(135deg, #0d5963, #167783)",
    color: "#ffffff",
    fontWeight: "900",
    cursor: "pointer",
  },

  muted: {
    color: "#6b8389",
    lineHeight: 1.6,
  },
};
