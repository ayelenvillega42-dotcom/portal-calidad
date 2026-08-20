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
      tipificaciones: tipificaciones,
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

            <h1 style={{ marginBottom: "8px" }}>
              Portal de Calidad
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

              <h1 style={{ margin: "8px 0 0" }}>
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
                    placeholder="Ej: 82%"
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
                    placeholder="Ej: 90%"
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
                    placeholder="Ej: En proceso"
                    style={styles.input}
                  />
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
                  "Escribí un item por línea.\nEj: Validación de datos\nPresentación HS\nCláusula de aceptación"
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
                  "Escribí una acción por línea.\nEj: Escucha personalizada\nFeedback individual\nMesa de trabajo"
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
                    "Ej:\nNo conforme con sumas aseguradas\nNo interesado - Producto\nNo interesado - No informa motivo\nProblemas económicos"
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
                      value={
                        form.objetivo_tipificaciones
                      }
                      onChange={cambiarFormulario}
                      placeholder="Ej: 4"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Estado tipificaciones
                    </label>

                    <input
                      name="estado_tipificaciones"
                      value={
                        form.estado_tipificaciones
                      }
                      onChange={cambiarFormulario}
                      placeholder="Ej: En proceso"
                      style={styles.input}
                    />
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
                      onChange={cambiarFormulario}
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
                      onChange={cambiarFormulario}
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
                      onChange={cambiarFormulario}
                      placeholder="Ej: 14"
                      style={styles.input}
                    />
                  </div>

                  <div>
                    <label style={styles.label}>
                      Compromiso
                    </label>

                    <input
                      name="tipificacion_compromiso"
                      value={
                        form.tipificacion_compromiso
                      }
                      onChange={cambiarFormulario}
                      placeholder="Ej: SEGUIMIENTO"
                      style={styles.input}
                    />
                  </div>
                </div>

                <label style={styles.label}>
                  Observaciones de tipificación
                </label>

                <textarea
                  name="tipificacion_observaciones"
                  value={
                    form.tipificacion_observaciones
                  }
                  onChange={cambiarFormulario}
                  placeholder="Observaciones..."
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
                  <label style={styles.label}>
                    SPH
                  </label>

                  <input
                    name="sph"
                    value={form.sph}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 1.8"
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
                    placeholder="Ej: 2.0"
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
                  marginTop: "15px",
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
            </form>
          </section>

          <section style={styles.card}>
            <h2>Reportes cargados</h2>

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
                        Tipificaciones
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

                          <td style={styles.td}>
                            {Array.isArray(
                              reporte.tipificaciones
                            )
                              ? reporte.tipificaciones.join(
                                  ", "
                                )
                              : reporte.tipificaciones ||
                                "-"}
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
          <header style={styles.header}>
            <div>
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={{ margin: "8px 0 0" }}>
                Mi Panel de Calidad
              </h1>

              <p style={styles.muted}>
                Bienvenido/a,{" "}
                <strong>
                  {asesorActual?.[0]}
                </strong>
              </p>
            </div>

            <button
              onClick={cerrarSesion}
              style={styles.secondaryButton}
            >
              Cerrar sesión
            </button>
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
              <section style={styles.heroCard}>
                <div>
                  <p style={styles.heroSmall}>
                    ÚLTIMO REPORTE
                  </p>

                  <h2 style={styles.heroTitle}>
                    {reporteActual?.semana}
                  </h2>

                  <p style={styles.heroText}>
                    Este es el resultado de tu última
                    evaluación.
                  </p>
                </div>

                <div style={styles.score}>
                  {reporteActual?.nota ?? "-"}
                </div>
              </section>

              <section style={styles.card}>
                <h2>Mi calidad</h2>

                <div style={styles.grid}>
                  <Metric
                    title="Nota de calidad"
                    value={
                      reporteActual?.nota ?? "-"
                    }
                  />

                  <Metric
                    title="Objetivo"
                    value={
                      reporteActual?.objetivo_calidad ??
                      reporteActual?.objetivo ??
                      "-"
                    }
                  />

                  <Metric
                    title="Estado"
                    value={
                      reporteActual?.estado_objetivo ||
                      "-"
                    }
                  />

                  <Metric
                    title="Producto"
                    value={
                      reporteActual?.producto ?? "-"
                    }
                  />
                </div>
              </section>

              <section style={styles.card}>
                <h2>Desvío principal</h2>

                <div style={styles.warning}>
                  <strong>
                    {reporteActual?.desvio ||
                      "No hay desvíos cargados."}
                  </strong>
                </div>
              </section>

              <section style={styles.card}>
                <h2>Recomendación</h2>

                <div style={styles.infoBox}>
                  {reporteActual?.recomendacion ||
                    "No hay recomendaciones cargadas."}
                </div>
              </section>

              <section style={styles.card}>
                <h2>Objetivo de trabajo</h2>

                <div style={styles.infoBox}>
                  {reporteActual?.objetivo ||
                    reporteActual?.objetivo_calidad ||
                    "No hay objetivo cargado."}
                </div>
              </section>

              <section style={styles.card}>
                <h2>Items trabajados en Calidad</h2>

                <ArrayList
                  items={reporteActual?.items_calidad}
                  empty="No se registraron items de calidad."
                />
              </section>

              <section style={styles.card}>
                <h2>Acciones realizadas en Calidad</h2>

                <ArrayList
                  items={reporteActual?.acciones_calidad}
                  empty="No se registraron acciones de calidad."
                />
              </section>

              <section style={styles.card}>
                <div style={styles.sectionHeader}>
                  <div>
                    <p style={styles.sectionEyebrow}>
                      SEGUIMIENTO
                    </p>

                    <h2 style={{ margin: 0 }}>
                      Tipificaciones
                    </h2>
                  </div>

                  <div
                    style={
                      styles.statusBadge
                    }
                  >
                    {reporteActual?.estado_tipificaciones ||
                      "Sin estado"}
                  </div>
                </div>

                <div style={styles.grid}>
                  <Metric
                    title="Objetivo"
                    value={
                      reporteActual?.objetivo_tipificaciones ??
                      "-"
                    }
                  />

                  <Metric
                    title="Desvío"
                    value={
                      reporteActual?.tipificacion_desvio ??
                      "-"
                    }
                  />

                  <Metric
                    title="Objetivo"
                    value={
                      reporteActual?.tipificacion_objetivo ??
                      "-"
                    }
                  />

                  <Metric
                    title="Resultado"
                    value={
                      reporteActual?.tipificacion_resultado ??
                      "-"
                    }
                  />
                </div>

                <div style={styles.tipificacionesBox}>
                  <h3>
                    Tipificaciones realizadas
                  </h3>

                  <ArrayList
                    items={
                      reporteActual?.tipificaciones
                    }
                    empty="No se registraron tipificaciones."
                  />
                </div>

                <div style={styles.tipificacionBottomGrid}>
                  <div style={styles.infoBox}>
                    <strong>
                      Compromiso
                    </strong>

                    <div style={{ marginTop: "7px" }}>
                      {reporteActual?.tipificacion_compromiso ||
                        "Sin compromiso cargado."}
                    </div>
                  </div>

                  <div style={styles.infoBox}>
                    <strong>
                      Observaciones
                    </strong>

                    <div
                      style={{
                        marginTop: "7px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {reporteActual?.tipificacion_observaciones ||
                        "Sin observaciones cargadas."}
                    </div>
                  </div>
                </div>
              </section>

              <section style={styles.card}>
                <h2>Auditoría</h2>

                {reporteActual?.auditoria ? (
                  <div style={styles.infoBox}>
                    <strong>
                      Referencia:
                    </strong>{" "}
                    {reporteActual.auditoria}
                  </div>
                ) : (
                  <p style={styles.muted}>
                    No hay información de auditoría.
                  </p>
                )}

                {reporteActual?.audio_url && (
                  <div style={styles.audioBox}>
                    <h3>
                      Escuchar llamada auditada
                    </h3>

                    <audio
                      controls
                      src={reporteActual.audio_url}
                      style={{
                        width: "100%",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )}

                {reporteActual?.observaciones && (
                  <>
                    <h3>
                      Observaciones
                    </h3>

                    <p>
                      {reporteActual.observaciones}
                    </p>
                  </>
                )}
              </section>

              <section style={styles.card}>
                <h2>Mi productividad</h2>

                <div style={styles.grid}>
                  <Metric
                    title="SPH"
                    value={
                      reporteActual?.sph ?? "-"
                    }
                    extra={`Objetivo: ${
                      reporteActual?.objetivo_sph ??
                      "-"
                    }`}
                  />

                  <Metric
                    title="Ventas"
                    value={
                      reporteActual?.ventas ?? "-"
                    }
                    extra={`Objetivo: ${
                      reporteActual?.objetivo_ventas ??
                      "-"
                    }`}
                  />

                  <Metric
                    title="Campaña"
                    value={
                      reporteActual?.objetivo_campania ??
                      "-"
                    }
                    extra={
                      reporteActual?.estado_campania ||
                      ""
                    }
                  />
                </div>
              </section>

              {reportes.length > 1 && (
                <section style={styles.card}>
                  <h2>
                    Historial de reportes
                  </h2>

                  <div
                    style={{
                      overflowX: "auto",
                    }}
                  >
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
                              {reporte.estado_objetivo ||
                                "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f4f7fb 0%, #eef2f7 100%)",
    color: "#172033",
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
    borderRadius: "22px",
    boxShadow:
      "0 20px 60px rgba(20, 40, 80, 0.12)",
    border: "1px solid #e6ebf2",
  },

  logo: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "#172b4d",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "30px 20px 60px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  portalBadge: {
    display: "inline-block",
    background: "#172b4d",
    color: "#ffffff",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "22px",
    border: "1px solid #e5eaf0",
    boxShadow:
      "0 10px 35px rgba(20, 40, 80, 0.07)",
  },

  heroCard: {
    background:
      "linear-gradient(135deg, #172b4d 0%, #294d7a 100%)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "34px",
    marginBottom: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    boxShadow:
      "0 15px 45px rgba(23, 43, 77, 0.2)",
  },

  heroSmall: {
    margin: "0 0 8px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    opacity: 0.8,
  },

  heroTitle: {
    margin: "0 0 10px",
    fontSize: "30px",
  },

  heroText: {
    margin: 0,
    opacity: 0.85,
  },

  score: {
    minWidth: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#172b4d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    fontWeight: "800",
    boxShadow:
      "0 10px 30px rgba(0, 0, 0, 0.15)",
  },

  muted: {
    color: "#697586",
    lineHeight: 1.6,
  },

  label: {
    display: "block",
    fontWeight: "700",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#344054",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #d6dce5",
    background: "#ffffff",
    color: "#172033",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "105px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #d6dce5",
    background: "#ffffff",
    color: "#172033",
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
    background: "#172b4d",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "22px",
  },

  secondaryButton: {
    border: "1px solid #d5dce6",
    borderRadius: "11px",
    padding: "12px 18px",
    background: "#ffffff",
    color: "#344054",
    fontWeight: "700",
    cursor: "pointer",
  },

  error: {
    background: "#fff1f1",
    color: "#b42318",
    border: "1px solid #f5c2c0",
    padding: "12px",
    borderRadius: "10px",
    margin: "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#ecfdf3",
    color: "#027a48",
    border: "1px solid #abefc6",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "700",
  },

  warning: {
    background: "#fff8e7",
    border: "1px solid #f4d98c",
    borderRadius: "12px",
    padding: "18px",
    lineHeight: 1.6,
  },

  infoBox: {
    background: "#f5f7fa",
    border: "1px solid #e1e6ed",
    borderRadius: "12px",
    padding: "18px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  audioBox: {
    background: "#f5f7fa",
    borderRadius: "12px",
    padding: "18px",
    marginTop: "18px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "15px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "5px 18px",
  },

  metric: {
    background: "#f7f9fc",
    border: "1px solid #e3e8ef",
    borderRadius: "15px",
    padding: "18px",
  },

  metricTitle: {
    color: "#697586",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "9px",
  },

  metricValue: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#172b4d",
  },

  metricExtra: {
    marginTop: "7px",
    fontSize: "12px",
    color: "#697586",
  },

  list: {
    margin: 0,
    paddingLeft: "22px",
  },

  listItem: {
    marginBottom: "10px",
    lineHeight: 1.5,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#f5f7fa",
    borderBottom: "1px solid #dfe4ea",
    fontSize: "13px",
  },

  td: {
    padding: "13px",
    borderBottom: "1px solid #edf0f3",
    fontSize: "14px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },

  sectionEyebrow: {
    margin: "0 0 5px",
    color: "#697586",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  statusBadge: {
    background: "#fff8e7",
    color: "#8a5b00",
    border: "1px solid #f4d98c",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
  },

  tipificacionesBox: {
    background: "#f7f9fc",
    border: "1px solid #e3e8ef",
    borderRadius: "15px",
    padding: "20px",
    marginTop: "20px",
  },

  tipificacionBottomGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },

  tipificacionAdmin: {
    background: "#f8fafc",
    border: "1px solid #e1e7ef",
    borderRadius: "16px",
    padding: "22px",
    marginTop: "25px",
    marginBottom: "10px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
  },

  sectionDescription: {
    color: "#697586",
    marginTop: "7px",
  },
};
