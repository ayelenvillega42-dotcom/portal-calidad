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
  auditoria: "",
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
  auditoria_no_ventas_cantidad: "",
  principales_om: "",
  auditoria_coaching: "",
  registro_sistema: "",
  auditoria_compromiso: "",
  fortalezas: "",
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

  const [form, setForm] = useState(initialForm);
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
            ([, , correoAsesor]) =>
              correoAsesor.toLowerCase() === correo
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
    setForm(initialForm);
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
      objetivo_calidad: form.objetivo_calidad || null,
      estado_objetivo: form.estado_objetivo || null,
      producto: form.producto || null,
      desvio: form.desvio || null,
      recomendacion: form.recomendacion || null,
      objetivo: form.objetivo || null,

      items_calidad: convertirLista(form.items_calidad),
      acciones_calidad: convertirLista(form.acciones_calidad),

      auditoria: form.auditoria || null,
      observaciones: form.observaciones || null,

      sph: form.sph || null,
      objetivo_sph: form.objetivo_sph || null,
      ventas: form.ventas || null,
      objetivo_ventas: form.objetivo_ventas || null,
      objetivo_campania: form.objetivo_campania || null,
      estado_campania: form.estado_campania || null,

      items_productividad: convertirLista(
        form.items_productividad
      ),
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

      auditoria_no_ventas_cantidad:
        form.auditoria_no_ventas_cantidad || null,
      principales_om: form.principales_om || null,
      auditoria_coaching:
        form.auditoria_coaching || null,
      registro_sistema:
        form.registro_sistema || null,
      auditoria_compromiso:
        form.auditoria_compromiso || null,
      fortalezas: form.fortalezas || null,
      auditoria_no_ventas_observaciones:
        form.auditoria_no_ventas_observaciones || null,
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
      <main style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.logo}>✓</div>

          <p style={styles.loginEyebrow}>
            PORTAL DE CALIDAD
          </p>

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
              onChange={(e) => setEmail(e.target.value)}
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
      </main>
    );
  }

  if (modo === "admin") {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div>
              <span style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </span>

              <h1 style={styles.pageTitle}>
                Panel de Calidad
              </h1>

              <p style={styles.muted}>
                Carga y gestión de reportes.
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
                automáticamente para el asesor seleccionado.
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
                  select
                  required
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
                  required
                />

                <Field
                  label="Nota de calidad"
                  name="nota"
                  value={form.nota}
                  onChange={cambiarFormulario}
                  placeholder="Ej: 82"
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
                  placeholder="Ej: EN OBJETIVO"
                />

                <Field
                  label="Producto"
                  name="producto"
                  value={form.producto}
                  onChange={cambiarFormulario}
                  placeholder="Ej: AP"
                />
              </div>

              <AdminTextarea
                label="Desvío principal"
                name="desvio"
                value={form.desvio}
                onChange={cambiarFormulario}
                placeholder="Ej: Validación de datos"
              />

              <AdminTextarea
                label="Recomendación"
                name="recomendacion"
                value={form.recomendacion}
                onChange={cambiarFormulario}
              />

              <AdminTextarea
                label="Objetivo de trabajo"
                name="objetivo"
                value={form.objetivo}
                onChange={cambiarFormulario}
              />

              <AdminTextarea
                label="Items trabajados en Calidad"
                name="items_calidad"
                value={form.items_calidad}
                onChange={cambiarFormulario}
                placeholder="Un item por línea"
              />

              <AdminTextarea
                label="Acciones realizadas en Calidad"
                name="acciones_calidad"
                value={form.acciones_calidad}
                onChange={cambiarFormulario}
                placeholder="Una acción por línea"
              />

              <div style={styles.adminSection}>
                <SectionHeading title="PRODUCTIVIDAD" />

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
                    placeholder="Ej: 0.50"
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

                <AdminTextarea
                  label="Items trabajados"
                  name="items_productividad"
                  value={form.items_productividad}
                  onChange={cambiarFormulario}
                  placeholder="Un item por línea"
                />

                <AdminTextarea
                  label="Acciones realizadas"
                  name="acciones_productividad"
                  value={form.acciones_productividad}
                  onChange={cambiarFormulario}
                  placeholder="Una acción por línea"
                />

                <AdminTextarea
                  label="Observaciones"
                  name="observaciones_productividad"
                  value={form.observaciones_productividad}
                  onChange={cambiarFormulario}
                />
              </div>

              <div style={styles.adminSection}>
                <SectionHeading title="TIPIFICACIONES" />

                <AdminTextarea
                  label="Tipificaciones"
                  name="tipificaciones"
                  value={form.tipificaciones}
                  onChange={cambiarFormulario}
                  placeholder="Una tipificación por línea"
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
                    label="Compromiso"
                    name="tipificacion_compromiso"
                    value={form.tipificacion_compromiso}
                    onChange={cambiarFormulario}
                  />

                  <Field
                    label="Objetivo general"
                    name="objetivo_tipificaciones"
                    value={form.objetivo_tipificaciones}
                    onChange={cambiarFormulario}
                  />
                </div>

                <AdminTextarea
                  label="Observaciones"
                  name="tipificacion_observaciones"
                  value={form.tipificacion_observaciones}
                  onChange={cambiarFormulario}
                />
              </div>

              <div style={styles.adminSection}>
                <SectionHeading title="AUDITORÍAS DE NO VENTAS" />

                <div style={styles.formGrid}>
                  <Field
                    label="Cantidad"
                    name="auditoria_no_ventas_cantidad"
                    value={form.auditoria_no_ventas_cantidad}
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
                    name="auditoria_compromiso"
                    value={form.auditoria_compromiso}
                    onChange={cambiarFormulario}
                  />

                  <Field
                    label="Coaching"
                    name="auditoria_coaching"
                    value={form.auditoria_coaching}
                    onChange={cambiarFormulario}
                  />
                </div>

                <AdminTextarea
                  label="Principales O.M."
                  name="principales_om"
                  value={form.principales_om}
                  onChange={cambiarFormulario}
                  placeholder="Ej: Generación de interés, escucha activa..."
                />

                <AdminTextarea
                  label="Fortalezas"
                  name="fortalezas"
                  value={form.fortalezas}
                  onChange={cambiarFormulario}
                />

                <AdminTextarea
                  label="Observaciones"
                  name="auditoria_no_ventas_observaciones"
                  value={form.auditoria_no_ventas_observaciones}
                  onChange={cambiarFormulario}
                />
              </div>

              <div style={styles.adminSection}>
                <SectionHeading title="AUDITORÍA" />

                <Field
                  label="Referencia de auditoría"
                  name="auditoria"
                  value={form.auditoria}
                  onChange={cambiarFormulario}
                  placeholder="Ej: Llamada 15482"
                />

                <AdminTextarea
                  label="Observaciones de auditoría"
                  name="observaciones"
                  value={form.observaciones}
                  onChange={cambiarFormulario}
                />
              </div>

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
            <div style={styles.sectionHeader}>
              <div>
                <p style={styles.sectionEyebrow}>
                  HISTÓRICO
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
              <span style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </span>

              <h1 style={styles.advisorTitle}>
                Hola,{" "}
                {asesorActual?.[0]?.split(",")[1]?.trim() ||
                  asesorActual?.[0]}
              </h1>

              <p style={styles.advisorWeek}>
                {reporteActual?.semana || "Sin reporte disponible"}
              </p>
            </div>

            <div style={styles.headerRight}>
              <span
                style={getStatusStyle(
                  reporteActual?.estado_objetivo
                )}
              >
                {reporteActual?.estado_objetivo ||
                  "SIN ESTADO"}
              </span>

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
            <section style={styles.card}>
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>✓</div>

                <h2>Todavía no hay reportes</h2>

                <p style={styles.muted}>
                  Cuando Calidad cargue tu primer reporte,
                  vas a poder verlo desde acá.
                </p>
              </div>
            </section>
          ) : (
            <>
              <AdvisorTabs />

              <section style={styles.tabContent}>
                <div style={styles.sectionNumber}>
                  01
                </div>

                <SectionHeading title="CALIDAD" />

                <div style={styles.qualityTopGrid}>
                  <div style={styles.bigScoreCard}>
                    <span style={styles.metricLabel}>
                      NOTA
                    </span>

                    <div style={styles.bigScore}>
                      {reporteActual?.nota || "-"}
                    </div>

                    <span style={styles.scoreSub}>
                      / 100
                    </span>
                  </div>

                  <Metric
                    title="OBJETIVO"
                    value={
                      reporteActual?.objetivo_calidad || "-"
                    }
                  />

                  <Metric
                    title="ESTADO"
                    value={
                      reporteActual?.estado_objetivo || "-"
                    }
                  />

                  <Metric
                    title="PRODUCTO"
                    value={
                      reporteActual?.producto || "-"
                    }
                  />
                </div>

                <div style={styles.progressCard}>
                  <div style={styles.progressHeader}>
                    <span>Progreso hacia el objetivo</span>
                    <strong>
                      {calcularProgreso(
                        reporteActual?.nota,
                        reporteActual?.objetivo_calidad
                      )}
                      %
                    </strong>
                  </div>

                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressBar,
                        width: `${Math.min(
                          100,
                          calcularProgreso(
                            reporteActual?.nota,
                            reporteActual?.objetivo_calidad
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div style={styles.remainingCard}>
                  <span style={styles.metricLabel}>
                    CUÁNTO FALTA PARA ALCANZAR EL OBJETIVO
                  </span>

                  <strong>
                    {calcularFalta(
                      reporteActual?.nota,
                      reporteActual?.objetivo_calidad
                    )}
                  </strong>
                </div>

                <InfoBlock
                  title="DESVÍO PRINCIPAL"
                  value={
                    reporteActual?.desvio ||
                    "No hay desvíos cargados."
                  }
                  type="warning"
                />

                <ComparisonBlock
                  reportes={reportes}
                  campo="nota"
                  titulo="COMPARATIVO SEMANAL"
                />

                <ListBlock
                  title="ITEMS TRABAJADOS"
                  items={reporteActual?.items_calidad}
                  empty="No se registraron items de calidad."
                />

                <ListBlock
                  title="ACCIONES REALIZADAS"
                  items={reporteActual?.acciones_calidad}
                  empty="No se registraron acciones."
                />

                <InfoBlock
                  title="AUDITORÍA"
                  value={
                    reporteActual?.auditoria ||
                    "No hay información de auditoría."
                  }
                />

                <InfoBlock
                  title="OBSERVACIONES"
                  value={
                    reporteActual?.observaciones ||
                    "No hay observaciones cargadas."
                  }
                />
              </section>

              <section style={styles.tabContent}>
                <div style={styles.sectionNumber}>
                  02
                </div>

                <SectionHeading title="PRODUCTIVIDAD" />

                <div style={styles.qualityTopGrid}>
                  <Metric
                    title="SPH"
                    value={reporteActual?.sph || "-"}
                    extra={`Objetivo SPH: ${
                      reporteActual?.objetivo_sph || "-"
                    }`}
                  />

                  <Metric
                    title="VENTAS"
                    value={reporteActual?.ventas || "-"}
                    extra={`Objetivo ventas: ${
                      reporteActual?.objetivo_ventas || "-"
                    }`}
                  />

                  <Metric
                    title="OBJETIVO DE CAMPAÑA"
                    value={
                      reporteActual?.objetivo_campania || "-"
                    }
                  />

                  <Metric
                    title="ESTADO"
                    value={
                      reporteActual?.estado_campania || "-"
                    }
                  />
                </div>

                <ComparisonBlock
                  reportes={reportes}
                  campo="sph"
                  titulo="COMPARATIVO SEMANAL"
                />

                <ListBlock
                  title="ITEMS TRABAJADOS"
                  items={reporteActual?.items_productividad}
                  empty="No se registraron items."
                />

                <ListBlock
                  title="ACCIONES REALIZADAS"
                  items={reporteActual?.acciones_productividad}
                  empty="No se registraron acciones."
                />

                <InfoBlock
                  title="OBSERVACIONES"
                  value={
                    reporteActual?.observaciones_productividad ||
                    "No hay observaciones cargadas."
                  }
                />
              </section>

              <section style={styles.tabContent}>
                <div style={styles.sectionNumber}>
                  03
                </div>

                <div style={styles.sectionHeader}>
                  <SectionHeading title="TIPIFICACIONES" />

                  <span
                    style={getStatusStyle(
                      reporteActual?.estado_tipificaciones
                    )}
                  >
                    {reporteActual?.estado_tipificaciones ||
                      "SIN ESTADO"}
                  </span>
                </div>

                <div style={styles.qualityTopGrid}>
                  <Metric
                    title="DESVÍO"
                    value={
                      reporteActual?.tipificacion_desvio || "-"
                    }
                  />

                  <Metric
                    title="OBJETIVO"
                    value={
                      reporteActual?.tipificacion_objetivo || "-"
                    }
                  />

                  <Metric
                    title="RESULTADO"
                    value={
                      reporteActual?.tipificacion_resultado || "-"
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
                  items={reporteActual?.tipificaciones}
                  empty="No se registraron tipificaciones."
                />

                <InfoBlock
                  title="OBSERVACIONES"
                  value={
                    reporteActual?.tipificacion_observaciones ||
                    "Sin observaciones cargadas."
                  }
                />
              </section>

              <section style={styles.tabContent}>
                <div style={styles.sectionNumber}>
                  04
                </div>

                <SectionHeading title="AUDITORÍAS DE NO VENTAS" />

                <div style={styles.qualityTopGrid}>
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
                      reporteActual?.auditoria_coaching || "-"
                    }
                  />

                  <Metric
                    title="REGISTRO EN SISTEMA"
                    value={
                      reporteActual?.registro_sistema || "-"
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

                <InfoBlock
                  title="PRINCIPALES O.M."
                  value={
                    reporteActual?.principales_om ||
                    "No hay información cargada."
                  }
                />

                <InfoBlock
                  title="FORTALEZAS"
                  value={
                    reporteActual?.fortalezas ||
                    "No hay fortalezas cargadas."
                  }
                />

                <InfoBlock
                  title="OBSERVACIONES"
                  value={
                    reporteActual?.auditoria_no_ventas_observaciones ||
                    "No hay observaciones cargadas."
                  }
                />
              </section>

              <section style={styles.tabContent}>
                <div style={styles.sectionNumber}>
                  05
                </div>

                <SectionHeading title="ACTIVIDADES" />

                <div style={styles.emptyActivity}>
                  <div style={styles.activityIcon}>
                    +
                  </div>

                  <h3>
                    Próximamente
                  </h3>

                  <p style={styles.muted}>
                    Esta sección quedará disponible para
                    registrar y consultar actividades.
                  </p>
                </div>
              </section>

              {reportes.length > 1 && (
                <section style={styles.tabContent}>
                  <div style={styles.sectionNumber}>
                    HISTÓRICO
                  </div>

                  <SectionHeading title="HISTÓRICO DE REPORTES" />

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
                            Producto
                          </th>
                          <th style={styles.th}>
                            Estado
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
                              {reporte.producto || "-"}
                            </td>

                            <td style={styles.td}>
                              {reporte.estado_objetivo || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              <section style={styles.feedbackSection}>
                <div style={styles.sectionNumber}>
                  06
                </div>

                <SectionHeading title="FEEDBACK DEL ASESOR" />

                <p style={styles.feedbackQuestion}>
                  ¿Querés dejar algún comentario sobre tu
                  reporte, una consulta o algo que quieras
                  trabajar con Calidad?
                </p>

                <textarea
                  placeholder="Escribí acá tu comentario..."
                  style={styles.feedbackInput}
                />

                <button style={styles.feedbackButton}>
                  ENVIAR FEEDBACK
                </button>
              </section>
            </>
          )}
        </div>
      </main>
    );
  }

  return null;
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  select,
  options = [],
}) {
  return (
    <div>
      <label style={styles.label}>
        {label}
      </label>

      {select ? (
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

function AdminTextarea({
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

function SectionHeading({ title }) {
  return (
    <div style={styles.sectionTitleBlock}>
      <h2 style={styles.sectionTitle}>
        {title}
      </h2>

      <div style={styles.sectionLine} />
    </div>
  );
}

function AdvisorTabs() {
  return (
    <div style={styles.tabs}>
      <div style={styles.tabActive}>
        CALIDAD
      </div>

      <div style={styles.tab}>
        PRODUCTIVIDAD
      </div>

      <div style={styles.tab}>
        TIPIFICACIONES
      </div>

      <div style={styles.tab}>
        AUDITORÍAS
      </div>

      <div style={styles.tab}>
        ACTIVIDADES
      </div>

      <div style={styles.tab}>
        HISTÓRICO
      </div>
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

function InfoBlock({ title, value, type }) {
  return (
    <div
      style={
        type === "warning"
          ? styles.warningBlock
          : styles.infoBlock
      }
    >
      <div style={styles.blockTitle}>
        {title}
      </div>

      <div style={styles.blockText}>
        {value}
      </div>
    </div>
  );
}

function ListBlock({ title, items, empty }) {
  const lista = normalizarLista(items);

  return (
    <div style={styles.listBlock}>
      <div style={styles.blockTitle}>
        {title}
      </div>

      {lista.length === 0 ? (
        <p style={styles.muted}>
          {empty}
        </p>
      ) : (
        <ul style={styles.list}>
          {lista.map((item, index) => (
            <li
              key={`${item}-${index}`}
              style={styles.listItem}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ComparisonBlock({
  reportes,
  campo,
  titulo,
}) {
  if (!reportes || reportes.length < 2) {
    return (
      <div style={styles.comparisonCard}>
        <div style={styles.blockTitle}>
          {titulo}
        </div>

        <p style={styles.muted}>
          Todavía no hay una semana anterior para comparar.
        </p>
      </div>
    );
  }

  const actual = Number(
    String(reportes[0]?.[campo] || "").replace(",", ".")
  );

  const anterior = Number(
    String(reportes[1]?.[campo] || "").replace(",", ".")
  );

  if (Number.isNaN(actual) || Number.isNaN(anterior)) {
    return (
      <div style={styles.comparisonCard}>
        <div style={styles.blockTitle}>
          {titulo}
        </div>

        <p style={styles.muted}>
          No hay datos suficientes para realizar el
          comparativo.
        </p>
      </div>
    );
  }

  const variacion = actual - anterior;

  return (
    <div style={styles.comparisonCard}>
      <div style={styles.blockTitle}>
        {titulo}
      </div>

      <div style={styles.comparisonGrid}>
        <div>
          <span style={styles.comparisonLabel}>
            SEMANA ANTERIOR
          </span>

          <strong style={styles.comparisonValue}>
            {reportes[1]?.[campo] || "-"}
          </strong>
        </div>

        <div>
          <span style={styles.comparisonLabel}>
            SEMANA ACTUAL
          </span>

          <strong style={styles.comparisonValue}>
            {reportes[0]?.[campo] || "-"}
          </strong>
        </div>

        <div>
          <span style={styles.comparisonLabel}>
            VARIACIÓN
          </span>

          <strong
            style={{
              ...styles.comparisonValue,
              color:
                variacion > 0
                  ? "#d97706"
                  : variacion < 0
                  ? "#087f6c"
                  : "#475467",
            }}
          >
            {variacion > 0 ? "+" : ""}
            {variacion.toFixed(2)}
          </strong>
        </div>
      </div>
    </div>
  );
}

function normalizarLista(items) {
  if (Array.isArray(items)) {
    return items;
  }

  if (typeof items !== "string" || !items.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(items);

    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Continúa con separación por líneas.
  }

  return items
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function calcularProgreso(nota, objetivo) {
  const n = Number(String(nota || "").replace(",", "."));
  const o = Number(
    String(objetivo || "").replace(",", ".")
  );

  if (!n || !o) {
    return 0;
  }

  return Math.round((n / o) * 100);
}

function calcularFalta(nota, objetivo) {
  const n = Number(String(nota || "").replace(",", "."));
  const o = Number(
    String(objetivo || "").replace(",", ".")
  );

  if (!n || !o) {
    return "-";
  }

  const falta = o - n;

  if (falta <= 0) {
    return "Objetivo alcanzado";
  }

  return `${falta} puntos`;
}

function getStatusStyle(status) {
  const texto = String(status || "").toUpperCase();

  if (
    texto.includes("OBJETIVO") &&
    !texto.includes("DEBAJO")
  ) {
    return styles.statusGood;
  }

  if (
    texto.includes("PROCESO") ||
    texto.includes("SEGUIMIENTO")
  ) {
    return styles.statusProcess;
  }

  if (
    texto.includes("DEBAJO") ||
    texto.includes("PENDIENTE")
  ) {
    return styles.statusWarning;
  }

  return styles.statusNeutral;
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(145deg, #eef7f6 0%, #f5f8f8 50%, #e9f1f2 100%)",
    color: "#16343b",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  loginPage: {
    minHeight: "100vh",
    background:
      "linear-gradient(145deg, #073b42 0%, #0b5960 55%, #dfeeed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
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

  loginCard: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    padding: "42px",
    borderRadius: "24px",
    boxShadow:
      "0 25px 70px rgba(5, 50, 55, 0.25)",
    border: "1px solid rgba(255,255,255,.5)",
  },

  logo: {
    width: "60px",
    height: "60px",
    borderRadius: "17px",
    background:
      "linear-gradient(135deg, #07545c, #0b7b78)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "20px",
  },

  loginEyebrow: {
    color: "#087f7a",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    margin: "0 0 8px",
  },

  loginTitle: {
    fontSize: "32px",
    margin: 0,
    color: "#123c42",
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
    background: "#ffffff",
    borderRadius: "24px",
    padding: "25px 28px",
    marginBottom: "20px",
    border: "1px solid #d8e7e6",
    boxShadow:
      "0 10px 30px rgba(7, 59, 66, 0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
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
    background: "#073b42",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.7px",
  },

  pageTitle: {
    margin: "10px 0 0",
    fontSize: "30px",
    color: "#123c42",
  },

  advisorTitle: {
    margin: "12px 0 3px",
    fontSize: "30px",
    color: "#123c42",
    letterSpacing: "-0.5px",
  },

  advisorWeek: {
    margin: 0,
    color: "#60777b",
    fontWeight: "600",
  },

  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    marginBottom: "22px",
    border: "1px solid #d8e7e6",
    boxShadow:
      "0 10px 35px rgba(7, 59, 66, 0.07)",
  },

  heroCard: {
    background:
      "linear-gradient(135deg, #073b42 0%, #087f7a 100%)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "34px",
    marginBottom: "22px",
    boxShadow:
      "0 18px 45px rgba(7, 59, 66, 0.18)",
  },

  heroSmall: {
    margin: "0 0 8px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.1px",
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
    color: "#60777b",
    lineHeight: 1.6,
  },

  label: {
    display: "block",
    fontWeight: "800",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#31575d",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #cbdedd",
    background: "#ffffff",
    color: "#16343b",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "105px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #cbdedd",
    background: "#ffffff",
    color: "#16343b",
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
    padding: "15px 18px",
    background:
      "linear-gradient(135deg, #07545c, #087f7a)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "22px",
  },

  secondaryButton: {
    border: "1px solid #cbdedd",
    borderRadius: "11px",
    padding: "11px 17px",
    background: "#ffffff",
    color: "#31575d",
    fontWeight: "800",
    cursor: "pointer",
  },

  error: {
    background: "#fff3f1",
    color: "#b42318",
    border: "1px solid #f5c2c0",
    padding: "12px",
    borderRadius: "10px",
    margin: "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#eaf8f3",
    color: "#087f68",
    border: "1px solid #a9e5d3",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "800",
    marginTop: "15px",
  },

  adminSection: {
    background: "#f4f9f8",
    border: "1px solid #d7e8e5",
    borderRadius: "18px",
    padding: "22px",
    marginTop: "26px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "4px 18px",
  },

  tabs: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    padding: "7px",
    background: "#dfeceb",
    borderRadius: "16px",
    marginBottom: "20px",
  },

  tab: {
    padding: "12px 16px",
    borderRadius: "11px",
    color: "#45666b",
    fontWeight: "800",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  tabActive: {
    padding: "12px 16px",
    borderRadius: "11px",
    background: "#ffffff",
    color: "#07545c",
    fontWeight: "800",
    fontSize: "12px",
    whiteSpace: "nowrap",
    boxShadow:
      "0 4px 12px rgba(7, 59, 66, 0.08)",
  },

  tabContent: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "22px",
    border: "1px solid #d8e7e6",
    boxShadow:
      "0 10px 35px rgba(7, 59, 66, 0.06)",
  },

  sectionNumber: {
    color: "#0b8983",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    marginBottom: "4px",
  },

  sectionTitleBlock: {
    marginBottom: "22px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "25px",
    color: "#123c42",
    letterSpacing: "-0.3px",
  },

  sectionLine: {
    height: "3px",
    width: "52px",
    background: "#0b8983",
    borderRadius: "10px",
    marginTop: "9px",
  },

  qualityTopGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "14px",
    marginBottom: "16px",
  },

  bigScoreCard: {
    background:
      "linear-gradient(135deg, #073b42, #087f7a)",
    color: "#ffffff",
    borderRadius: "17px",
    padding: "18px",
    minHeight: "115px",
  },

  metricLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1px",
    color: "#6d8588",
    marginBottom: "8px",
  },

  bigScoreCard: {
    background:
      "linear-gradient(135deg, #073b42, #087f7a)",
    color: "#ffffff",
    borderRadius: "17px",
    padding: "18px",
    minHeight: "115px",
  },

  bigScoreCard: {
    background:
      "linear-gradient(135deg, #073b42, #087f7a)",
    color: "#ffffff",
    borderRadius: "17px",
    padding: "18px",
    minHeight: "115px",
  },

  bigScore: {
    fontSize: "42px",
    fontWeight: "900",
    display: "inline-block",
  },

  scoreSub: {
    fontSize: "16px",
    fontWeight: "700",
    opacity: 0.8,
    marginLeft: "4px",
  },

  metric: {
    background: "#f4f9f8",
    border: "1px solid #d8e7e6",
    borderRadius: "17px",
    padding: "18px",
    minHeight: "78px",
  },

  metricTitle: {
    color: "#6d8588",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.8px",
    marginBottom: "9px",
  },

  metricValue: {
    fontSize: "23px",
    fontWeight: "900",
    color: "#123c42",
  },

  metricExtra: {
    marginTop: "7px",
    fontSize: "12px",
    color: "#60777b",
  },

  progressCard: {
    background: "#f4f9f8",
    border: "1px solid #d8e7e6",
    borderRadius: "17px",
    padding: "18px",
    marginBottom: "14px",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "10px",
    fontSize: "13px",
    color: "#45666b",
    fontWeight: "700",
  },

  progressTrack: {
    width: "100%",
    height: "10px",
    background: "#d5e3e1",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background:
      "linear-gradient(90deg, #07545c, #0b9b8d)",
    borderRadius: "999px",
    transition: "width .3s ease",
  },

  remainingCard: {
    background: "#eaf8f3",
    border: "1px solid #b9e4d7",
    borderRadius: "17px",
    padding: "18px",
    marginBottom: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  warningBlock: {
    background: "#fff8e8",
    border: "1px solid #efd99d",
    borderRadius: "17px",
    padding: "20px",
    marginBottom: "16px",
  },

  infoBlock: {
    background: "#f4f9f8",
    border: "1px solid #d8e7e6",
    borderRadius: "17px",
    padding: "20px",
    marginBottom: "16px",
  },

  blockTitle: {
    color: "#537176",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "1px",
    marginBottom: "9px",
  },

  blockText: {
    color: "#16343b",
    fontSize: "15px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  comparisonCard: {
    background: "#f4f9f8",
    border: "1px solid #d8e7e6",
    borderRadius: "17px",
    padding: "20px",
    marginBottom: "16px",
  },

  comparisonGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
  },

  comparisonLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: "900",
    color: "#71878a",
    marginBottom: "6px",
  },

  comparisonValue: {
    fontSize: "21px",
    color: "#123c42",
  },

  listBlock: {
    background: "#ffffff",
    border: "1px solid #d8e7e6",
    borderRadius: "17px",
    padding: "20px",
    marginBottom: "16px",
  },

  list: {
    margin: 0,
    paddingLeft: "20px",
  },

  listItem: {
    marginBottom: "9px",
    lineHeight: 1.5,
    color: "#28484e",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  sectionEyebrow: {
    margin: "0 0 5px",
    color: "#0b8983",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.2px",
  },

  statusGood: {
    background: "#e7f7ef",
    color: "#087f5b",
    border: "1px solid #b5e4cf",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
  },

  statusProcess: {
    background: "#e7f4f5",
    color: "#07545c",
    border: "1px solid #b7dfe1",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
  },

  statusWarning: {
    background: "#fff3e1",
    color: "#a15c00",
    border: "1px solid #f0d09c",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
  },

  statusNeutral: {
    background: "#edf2f3",
    color: "#52686c",
    border: "1px solid #d3dfe0",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
  },

  emptyState: {
    textAlign: "center",
    padding: "45px 20px",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background: "#e6f4f1",
    color: "#087f7a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "25px",
    fontWeight: "900",
  },

  emptyActivity: {
    border: "2px dashed #c9dddb",
    borderRadius: "18px",
    padding: "50px 20px",
    textAlign: "center",
    background: "#f8fbfa",
  },

  activityIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "#dff1ee",
    color: "#087f7a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "27px",
    fontWeight: "700",
  },

  feedbackSection: {
    background:
      "linear-gradient(145deg, #073b42 0%, #087f7a 100%)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    marginTop: "22px",
    marginBottom: "30px",
    boxShadow:
      "0 15px 40px rgba(7, 59, 66, 0.17)",
  },

  feedbackQuestion: {
    color: "rgba(255,255,255,.85)",
    lineHeight: 1.6,
    marginBottom: "18px",
  },

  feedbackInput: {
    width: "100%",
    minHeight: "125px",
    boxSizing: "border-box",
    padding: "15px",
    borderRadius: "13px",
    border: "1px solid rgba(255,255,255,.25)",
    background: "#ffffff",
    color: "#16343b",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  feedbackButton: {
    marginTop: "13px",
    border: "none",
    borderRadius: "11px",
    padding: "13px 20px",
    background: "#ffffff",
    color: "#07545c",
    fontWeight: "900",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#eaf3f2",
    borderBottom: "1px solid #d4e3e1",
    fontSize: "12px",
    color: "#31575d",
  },

  td: {
    padding: "13px",
    borderBottom: "1px solid #e7eeee",
    fontSize: "14px",
    color: "#28484e",
  },
};
