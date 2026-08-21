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
    comparativo_calidad: "",
    comparativo_productividad: "",
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
      ventas: "",
      objetivo_ventas: "",
      objetivo_campania: "",
      estado_campania: "",
      comparativo_calidad: "",
      comparativo_productividad: "",
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
      coaching: "",
      registro_sistema: "",
      compromiso_no_ventas: "",
      fortalezas: "",
      observaciones_no_ventas: "",
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

    const convertirLista = (texto) =>
      texto
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
      comparativo_calidad: form.comparativo_calidad || null,
      comparativo_productividad:
        form.comparativo_productividad || null,
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
      principales_om:
        form.principales_om || null,
      coaching: form.coaching || null,
      registro_sistema:
        form.registro_sistema || null,
      compromiso_no_ventas:
        form.compromiso_no_ventas || null,
      fortalezas: form.fortalezas || null,
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

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
          <div style={styles.card}>
            <div style={styles.logo}>✓</div>
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
              <div style={styles.sectionTitleBlock}>
                <span style={styles.numberBadge}>
                  01
                </span>

                <div>
                  <h2 style={styles.sectionTitle}>
                    CALIDAD
                  </h2>

                  <p style={styles.sectionDescription}>
                    Información principal de la evaluación.
                  </p>
                </div>
              </div>

              <div style={styles.formGrid}>
                <Field
                  label="Asesor"
                  name="usuario"
                  value={form.usuario}
                  onChange={cambiarFormulario}
                  type="select"
                  options={asesores.map((asesor) => ({
                    value: asesor[1],
                    label: `${asesor[0]} — ${asesor[1]}`,
                  }))}
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

              <Field
                label="Desvío principal"
                name="desvio"
                value={form.desvio}
                onChange={cambiarFormulario}
                textarea
                placeholder="Describí el principal desvío..."
              />

              <Field
                label="Comparativo semanal"
                name="comparativo_calidad"
                value={form.comparativo_calidad}
                onChange={cambiarFormulario}
                textarea
                placeholder="Ej: Semana anterior: 55 / 100. Variación: -5 puntos."
              />

              <Field
                label="Objetivo de trabajo"
                name="objetivo"
                value={form.objetivo}
                onChange={cambiarFormulario}
                textarea
                placeholder="Objetivo para la próxima evaluación..."
              />

              <Field
                label="Items trabajados"
                name="items_calidad"
                value={form.items_calidad}
                onChange={cambiarFormulario}
                textarea
                placeholder={
                  "Un item por línea.\nValidación de datos\nCláusula de aceptación\nInformación"
                }
              />

              <Field
                label="Acciones realizadas"
                name="acciones_calidad"
                value={form.acciones_calidad}
                onChange={cambiarFormulario}
                textarea
                placeholder={
                  "Una acción por línea.\nFeedback individual\nEspacio de coaching\nEscucha personalizada"
                }
              />

              <Field
                label="Referencia de auditoría"
                name="auditoria"
                value={form.auditoria}
                onChange={cambiarFormulario}
                placeholder="Ej: Llamada 15482"
              />

              <Field
                label="Observaciones"
                name="observaciones"
                value={form.observaciones}
                onChange={cambiarFormulario}
                textarea
                placeholder="Observaciones de Calidad..."
              />

              <div style={styles.divider} />

              <div style={styles.sectionTitleBlock}>
                <span style={styles.numberBadge}>
                  02
                </span>

                <div>
                  <h2 style={styles.sectionTitle}>
                    PRODUCTIVIDAD
                  </h2>

                  <p style={styles.sectionDescription}>
                    Seguimiento de productividad y campaña.
                  </p>
                </div>
              </div>

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
                textarea
                placeholder="Comparativo de productividad..."
              />

              <div style={styles.divider} />

              <div style={styles.sectionTitleBlock}>
                <span style={styles.numberBadge}>
                  03
                </span>

                <div>
                  <h2 style={styles.sectionTitle}>
                    TIPIFICACIONES
                  </h2>

                  <p style={styles.sectionDescription}>
                    Seguimiento de tipificaciones.
                  </p>
                </div>
              </div>

              <Field
                label="Tipificaciones"
                name="tipificaciones"
                value={form.tipificaciones}
                onChange={cambiarFormulario}
                textarea
                placeholder={
                  "Una tipificación por línea.\nNo conforme con sumas aseguradas\nNo interesado - Producto\nProblemas económicos"
                }
              />

              <div style={styles.formGrid}>
                <Field
                  label="Estado"
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
                textarea
                placeholder="Observaciones..."
              />

              <div style={styles.divider} />

              <div style={styles.sectionTitleBlock}>
                <span style={styles.numberBadge}>
                  04
                </span>

                <div>
                  <h2 style={styles.sectionTitle}>
                    AUDITORÍAS DE NO VENTAS
                  </h2>

                  <p style={styles.sectionDescription}>
                    Seguimiento de oportunidades de mejora.
                  </p>
                </div>
              </div>

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
                  name="registro_sistema"
                  value={form.registro_sistema}
                  onChange={cambiarFormulario}
                  placeholder="Ej: CORRECTA"
                />

                <Field
                  label="Compromiso"
                  name="compromiso_no_ventas"
                  value={form.compromiso_no_ventas}
                  onChange={cambiarFormulario}
                  placeholder="Ej: APLICA DEVOLUCIÓN"
                />
              </div>

              <Field
                label="Principales O.M."
                name="principales_om"
                value={form.principales_om}
                onChange={cambiarFormulario}
                textarea
                placeholder="Una oportunidad de mejora por línea..."
              />

              <Field
                label="Coaching"
                name="coaching"
                value={form.coaching}
                onChange={cambiarFormulario}
                textarea
                placeholder="Detalle del coaching..."
              />

              <Field
                label="Fortalezas"
                name="fortalezas"
                value={form.fortalezas}
                onChange={cambiarFormulario}
                textarea
                placeholder="Una fortaleza por línea..."
              />

              <Field
                label="Observaciones"
                name="observaciones_no_ventas"
                value={form.observaciones_no_ventas}
                onChange={cambiarFormulario}
                textarea
                placeholder="Observaciones..."
              />

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
                <div
                  style={{
                    ...(mensajeAdmin.includes("✓")
                      ? styles.success
                      : styles.error),
                    marginTop: "15px",
                  }}
                >
                  {mensajeAdmin}
                </div>
              )}
            </form>
          </section>

          <section style={styles.card}>
            <div style={styles.sectionTitleBlock}>
              <span style={styles.numberBadge}>
                05
              </span>

              <div>
                <h2 style={styles.sectionTitle}>
                  REPORTES CARGADOS
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

  if (modo === "asesor") {
    const reporteActual = reportes[0];

    const nota = Number(
      String(reporteActual?.nota || "")
        .replace("%", "")
        .replace(",", ".")
    );

    const objetivo = Number(
      String(reporteActual?.objetivo_calidad || "")
        .replace("%", "")
        .replace(",", ".")
    );

    const porcentajeProgreso =
      objetivo > 0 && !Number.isNaN(nota)
        ? Math.min(100, Math.round((nota / objetivo) * 100))
        : 0;

    const faltan =
      objetivo > 0 && !Number.isNaN(nota)
        ? Math.max(0, objetivo - nota)
        : null;

    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.advisorHeader}>
            <div>
              <div style={styles.portalWordmark}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.advisorGreeting}>
                Hola,{" "}
                <strong>
                  {asesorActual?.[0]?.split(",")[1]?.trim() ||
                    asesorActual?.[0]}
                </strong>
              </h1>

              <p style={styles.weekText}>
                {reporteActual?.semana ||
                  "Semana pendiente"}
              </p>
            </div>

            <div style={styles.headerRight}>
              {reporteActual?.estado_objetivo && (
                <div
                  style={getStatusStyle(
                    reporteActual.estado_objetivo
                  )}
                >
                  {reporteActual.estado_objetivo.toUpperCase()}
                </div>
              )}

              <button
                onClick={cerrarSesion}
                style={styles.secondaryButton}
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          <div style={styles.headerLine} />

          {cargandoReportes ? (
            <section style={styles.card}>
              <h2>Cargando información...</h2>
            </section>
          ) : reportes.length === 0 ? (
            <section style={styles.emptyCard}>
              <div style={styles.emptyIcon}>✓</div>

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
              {/* CALIDAD */}
              <section style={styles.mainSection}>
                <SectionNumber number="01" />

                <div style={styles.sectionHeading}>
                  <h2>CALIDAD</h2>
                  <span>
                    Resultado de tu evaluación
                  </span>
                </div>

                <div style={styles.qualityTop}>
                  <div style={styles.scoreCard}>
                    <span>NOTA</span>

                    <strong>
                      {reporteActual?.nota || "-"}
                    </strong>

                    <small>/ 100</small>
                  </div>

                  <div style={styles.qualityMetrics}>
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

                    <MiniMetric
                      title="CUÁNTO FALTA"
                      value={
                        faltan !== null
                          ? `${faltan} puntos`
                          : "-"
                      }
                    />
                  </div>
                </div>

                <div style={styles.progressCard}>
                  <div style={styles.progressHeader}>
                    <span>
                      Progreso hacia el objetivo
                    </span>

                    <strong>
                      {porcentajeProgreso}%
                    </strong>
                  </div>

                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${porcentajeProgreso}%`,
                      }}
                    />
                  </div>
                </div>

                <div style={styles.highlightBox}>
                  <span>
                    DESVÍO PRINCIPAL
                  </span>

                  <strong>
                    {reporteActual?.desvio ||
                      "No hay desvíos cargados."}
                  </strong>
                </div>

                <div style={styles.twoColumns}>
                  <InfoBlock title="COMPARATIVO SEMANAL">
                    {reporteActual?.comparativo_calidad ||
                      "Todavía no hay una semana anterior para comparar."}
                  </InfoBlock>

                  <InfoBlock title="OBSERVACIONES">
                    {reporteActual?.observaciones ||
                      "No hay observaciones cargadas."}
                  </InfoBlock>
                </div>

                <ListBlock
                  title="ITEMS TRABAJADOS"
                  items={reporteActual?.items_calidad}
                  empty="No se registraron items trabajados."
                />

                <ListBlock
                  title="ACCIONES REALIZADAS"
                  items={reporteActual?.acciones_calidad}
                  empty="No se registraron acciones realizadas."
                />

                <InfoBlock title="AUDITORÍA">
                  {reporteActual?.auditoria ||
                    "No hay información de auditoría."}
                </InfoBlock>
              </section>

              {/* PRODUCTIVIDAD */}
              <section style={styles.mainSection}>
                <SectionNumber number="02" />

                <div style={styles.sectionHeading}>
                  <h2>PRODUCTIVIDAD</h2>
                  <span>
                    Seguimiento de productividad
                  </span>
                </div>

                <div style={styles.productivityGrid}>
                  <ProductivityCard
                    title="SPH"
                    value={reporteActual?.sph || "-"}
                    extra={`Objetivo SPH: ${
                      reporteActual?.objetivo_sph || "-"
                    }`}
                  />

                  <ProductivityCard
                    title="VENTAS"
                    value={reporteActual?.ventas || "-"}
                    extra={`Objetivo ventas: ${
                      reporteActual?.objetivo_ventas || "-"
                    }`}
                  />

                  <ProductivityCard
                    title="OBJETIVO DE CAMPAÑA"
                    value={
                      reporteActual?.objetivo_campania ||
                      "-"
                    }
                    extra={
                      reporteActual?.estado_campania ||
                      "Sin estado"
                    }
                  />
                </div>

                <InfoBlock title="ESTADO">
                  {reporteActual?.estado_campania ||
                    "Sin estado cargado."}
                </InfoBlock>

                <InfoBlock title="COMPARATIVO SEMANAL">
                  {reporteActual?.comparativo_productividad ||
                    "-"}
                </InfoBlock>

                <ListBlock
                  title="ITEMS TRABAJADOS"
                  items={
                    reporteActual?.items_productividad
                  }
                  empty="No se registraron items trabajados."
                />

                <ListBlock
                  title="ACCIONES REALIZADAS"
                  items={
                    reporteActual?.acciones_productividad
                  }
                  empty="No se registraron acciones realizadas."
                />

                <InfoBlock title="OBSERVACIONES">
                  {reporteActual?.observaciones_productividad ||
                    "No hay observaciones cargadas."}
                </InfoBlock>
              </section>

              {/* TIPIFICACIONES */}
              <section style={styles.mainSection}>
                <SectionNumber number="03" />

                <div style={styles.sectionHeading}>
                  <h2>TIPIFICACIONES</h2>
                  <span>
                    Seguimiento de tipificaciones
                  </span>
                </div>

                <div style={styles.tipificacionStatus}>
                  {reporteActual?.estado_tipificaciones ||
                    "Sin estado"}
                </div>

                <div style={styles.tipificacionMetrics}>
                  <MiniMetric
                    title="DESVÍO"
                    value={
                      reporteActual?.tipificacion_desvio ||
                      "-"
                    }
                  />

                  <MiniMetric
                    title="OBJETIVO"
                    value={
                      reporteActual?.tipificacion_objetivo ||
                      "-"
                    }
                  />

                  <MiniMetric
                    title="RESULTADO"
                    value={
                      reporteActual?.tipificacion_resultado ||
                      "-"
                    }
                  />
                </div>

                <ListBlock
                  title="TIPIFICACIONES"
                  items={reporteActual?.tipificaciones}
                  empty="No se registraron tipificaciones."
                />

                <div style={styles.twoColumns}>
                  <InfoBlock title="COMPROMISO">
                    {reporteActual?.tipificacion_compromiso ||
                      "Sin compromiso cargado."}
                  </InfoBlock>

                  <InfoBlock title="OBSERVACIONES">
                    {reporteActual?.tipificacion_observaciones ||
                      "Sin observaciones cargadas."}
                  </InfoBlock>
                </div>
              </section>

              {/* AUDITORIAS DE NO VENTAS */}
              <section style={styles.mainSection}>
                <SectionNumber number="04" />

                <div style={styles.sectionHeading}>
                  <h2>
                    AUDITORÍAS DE NO VENTAS
                  </h2>

                  <span>
                    Oportunidades de mejora
                  </span>
                </div>

                <div style={styles.noVentasGrid}>
                  <MiniMetric
                    title="CANTIDAD"
                    value={
                      reporteActual?.auditoria_no_ventas_cantidad ||
                      "-"
                    }
                  />

                  <MiniMetric
                    title="REGISTRO EN SISTEMA"
                    value={
                      reporteActual?.registro_sistema ||
                      "-"
                    }
                  />

                  <MiniMetric
                    title="COMPROMISO"
                    value={
                      reporteActual?.compromiso_no_ventas ||
                      "-"
                    }
                  />
                </div>

                <InfoBlock title="PRINCIPALES O.M.">
                  {reporteActual?.principales_om ||
                    "No hay oportunidades de mejora cargadas."}
                </InfoBlock>

                <InfoBlock title="COACHING">
                  {reporteActual?.coaching || "-"}
                </InfoBlock>

                <InfoBlock title="FORTALEZAS">
                  {reporteActual?.fortalezas || "-"}
                </InfoBlock>

                <InfoBlock title="OBSERVACIONES">
                  {reporteActual?.observaciones_no_ventas ||
                    "No hay observaciones cargadas."}
                </InfoBlock>
              </section>

              {/* FEEDBACK */}
              <FeedbackSection
                usuario={asesorActual?.[1]}
                semana={reporteActual?.semana}
              />

              {reportes.length > 1 && (
                <section style={styles.historySection}>
                  <div style={styles.sectionHeading}>
                    <h2>HISTORIAL</h2>
                    <span>
                      Evolución de tus reportes
                    </span>
                  </div>

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

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  textarea,
  type = "text",
  options = [],
  required = false,
}) {
  return (
    <div>
      <label style={styles.label}>
        {label}
      </label>

      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={styles.textarea}
          required={required}
        />
      ) : type === "select" ? (
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

function SectionNumber({ number }) {
  return (
    <div style={styles.sectionNumber}>
      {number}
    </div>
  );
}

function MiniMetric({ title, value }) {
  return (
    <div style={styles.miniMetric}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProductivityCard({
  title,
  value,
  extra,
}) {
  return (
    <div style={styles.productivityCard}>
      <span>{title}</span>

      <strong>{value}</strong>

      <small>{extra}</small>
    </div>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div style={styles.infoBlock}>
      <span>{title}</span>

      <div style={styles.infoContent}>
        {children}
      </div>
    </div>
  );
}

function ListBlock({ title, items, empty }) {
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

  return (
    <div style={styles.listBlock}>
      <span>{title}</span>

      {lista.length === 0 ? (
        <p style={styles.emptyText}>
          {empty}
        </p>
      ) : (
        <div style={styles.pills}>
          {lista.map((item, index) => (
            <div
              key={index}
              style={styles.pill}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackSection({ usuario, semana }) {
  const [feedback, setFeedback] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function enviarFeedback(e) {
    e.preventDefault();

    if (!feedback.trim()) {
      setMensaje("Escribí un comentario antes de enviar.");
      return;
    }

    setEnviando(true);
    setMensaje("");

    const { error } = await supabase
      .from("feedback_asesores")
      .insert([
        {
          usuario,
          semana,
          feedback: feedback.trim(),
        },
      ]);

    if (error) {
      console.error(error);

      setMensaje(
        "No se pudo enviar el feedback. Revisá la configuración de Supabase."
      );
    } else {
      setFeedback("");
      setMensaje("✓ FEEDBACK ENVIADO CORRECTAMENTE");
    }

    setEnviando(false);
  }

  return (
    <section style={styles.feedbackSection}>
      <div style={styles.sectionNumber}>
        05
      </div>

      <div style={styles.sectionHeading}>
        <h2>FEEDBACK DEL ASESOR</h2>

        <span>
          Tu opinión también forma parte del seguimiento.
        </span>
      </div>

      <p style={styles.feedbackQuestion}>
        ¿Querés dejar algún comentario sobre tu reporte,
        una consulta o algo que quieras trabajar con Calidad?
      </p>

      <form onSubmit={enviarFeedback}>
        <textarea
          value={feedback}
          onChange={(e) =>
            setFeedback(e.target.value)
          }
          placeholder="Escribí acá tu comentario..."
          style={styles.feedbackTextarea}
        />

        <button
          type="submit"
          disabled={enviando}
          style={{
            ...styles.feedbackButton,
            opacity: enviando ? 0.6 : 1,
          }}
        >
          {enviando
            ? "ENVIANDO..."
            : "ENVIAR FEEDBACK"}
        </button>
      </form>

      {mensaje && (
        <div
          style={{
            ...styles.feedbackMessage,
            color: mensaje.includes("✓")
              ? "#087443"
              : "#b42318",
          }}
        >
          {mensaje}
        </div>
      )}
    </section>
  );
}

function getStatusStyle(estado) {
  const texto = String(estado).toLowerCase();

  if (
    texto.includes("debajo") ||
    texto.includes("bajo")
  ) {
    return styles.statusRed;
  }

  if (
    texto.includes("proceso") ||
    texto.includes("seguimiento")
  ) {
    return styles.statusOrange;
  }

  if (
    texto.includes("cumple") ||
    texto.includes("objetivo")
  ) {
    return styles.statusGreen;
  }

  return styles.statusOrange;
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(145deg, #f7f3ff 0%, #f3f7ff 48%, #eefcf8 100%)",
    color: "#20253d",
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
    borderRadius: "28px",
    boxShadow:
      "0 25px 70px rgba(75, 56, 120, 0.15)",
    border: "1px solid #ebe6f6",
  },

  logo: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #7657d9, #9b6ee8)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "20px",
    boxShadow:
      "0 10px 25px rgba(118, 87, 217, 0.25)",
  },

  loginEyebrow: {
    color: "#7657d9",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "8px",
  },

  loginTitle: {
    fontSize: "30px",
    margin: "0 0 8px",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "32px 20px 70px",
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
    alignItems: "flex-start",
    justifyContent: "space-between",
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

  portalBadge: {
    display: "inline-block",
    background:
      "linear-gradient(135deg, #7657d9, #9b6ee8)",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "0.6px",
  },

  portalWordmark: {
    color: "#7657d9",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "1.7px",
  },

  pageTitle: {
    margin: "9px 0 0",
    fontSize: "30px",
  },

  advisorGreeting: {
    margin: "10px 0 4px",
    fontSize: "34px",
    letterSpacing: "-0.8px",
  },

  weekText: {
    margin: 0,
    color: "#697586",
    fontSize: "16px",
    fontWeight: "600",
  },

  headerLine: {
    height: "3px",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, #7657d9 0%, #e26ba7 50%, #44b99b 100%)",
    marginBottom: "30px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "22px",
    border: "1px solid #e8e4f2",
    boxShadow:
      "0 12px 40px rgba(62, 48, 100, 0.07)",
  },

  adminHero: {
    background:
      "linear-gradient(135deg, #7657d9 0%, #a05de0 55%, #e26ba7 100%)",
    color: "#ffffff",
    borderRadius: "25px",
    padding: "35px",
    marginBottom: "22px",
    boxShadow:
      "0 18px 45px rgba(118, 87, 217, 0.22)",
  },

  heroSmall: {
    margin: "0 0 8px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    opacity: 0.82,
  },

  heroTitle: {
    margin: "0 0 10px",
    fontSize: "30px",
  },

  heroText: {
    margin: 0,
    opacity: 0.9,
  },

  mainSection: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "32px",
    marginBottom: "24px",
    border: "1px solid #e8e4f2",
    boxShadow:
      "0 14px 45px rgba(62, 48, 100, 0.07)",
  },

  feedbackSection: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #f8f4ff 100%)",
    borderRadius: "26px",
    padding: "32px",
    marginBottom: "24px",
    border: "1px solid #ddd4f3",
    boxShadow:
      "0 14px 45px rgba(62, 48, 100, 0.08)",
  },

  historySection: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    border: "1px solid #e8e4f2",
  },

  emptyCard: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "50px 30px",
    textAlign: "center",
    border: "1px solid #e8e4f2",
    boxShadow:
      "0 14px 45px rgba(62, 48, 100, 0.07)",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eee9ff",
    color: "#7657d9",
    fontWeight: "900",
    fontSize: "24px",
  },

  sectionNumber: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    borderRadius: "13px",
    background: "#eee9ff",
    color: "#7657d9",
    fontSize: "14px",
    fontWeight: "900",
    marginBottom: "13px",
  },

  sectionHeading: {
    marginBottom: "25px",
  },

  sectionHeading h2: {
    margin: "0 0 5px",
    fontSize: "25px",
    letterSpacing: "-0.3px",
  },

  sectionHeading span: {
    color: "#697586",
    fontSize: "14px",
  },

  sectionTitleBlock: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "22px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "#697586",
    fontSize: "13px",
  },

  numberBadge: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    background: "#eee9ff",
    color: "#7657d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "12px",
    flexShrink: 0,
  },

  qualityTop: {
    display: "grid",
    gridTemplateColumns:
      "minmax(190px, 0.7fr) minmax(0, 2fr)",
    gap: "18px",
  },

  scoreCard: {
    minHeight: "190px",
    borderRadius: "22px",
    background:
      "linear-gradient(145deg, #7657d9, #9b6ee8)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "0 15px 35px rgba(118, 87, 217, 0.22)",
  },

  scoreCard span: {
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    opacity: 0.8,
  },

  scoreCard strong: {
    fontSize: "56px",
    lineHeight: 1,
    marginTop: "10px",
  },

  scoreCard small: {
    marginTop: "8px",
    opacity: 0.8,
    fontWeight: "700",
  },

  qualityMetrics: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "13px",
  },

  miniMetric: {
    background: "#f8f6ff",
    border: "1px solid #e8e1fa",
    borderRadius: "16px",
    padding: "18px",
    minHeight: "78px",
    boxSizing: "border-box",
  },

  miniMetric span: {
    display: "block",
    color: "#766f88",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.7px",
    marginBottom: "8px",
  },

  miniMetric strong: {
    display: "block",
    color: "#30274b",
    fontSize: "20px",
    fontWeight: "850",
  },

  progressCard: {
    background: "#faf9ff",
    border: "1px solid #e9e4f5",
    borderRadius: "16px",
    padding: "18px",
    marginTop: "17px",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "10px",
    color: "#655e76",
    fontSize: "13px",
    fontWeight: "700",
  },

  progressTrack: {
    width: "100%",
    height: "10px",
    background: "#e7e2f4",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, #7657d9, #e26ba7)",
    transition: "width 0.4s ease",
  },

  highlightBox: {
    marginTop: "18px",
    padding: "21px",
    borderRadius: "17px",
    background:
      "linear-gradient(135deg, #fff4f7, #fff9ed)",
    border: "1px solid #f5d9e2",
  },

  highlightBox span: {
    display: "block",
    color: "#9b5a73",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.9px",
    marginBottom: "8px",
  },

  highlightBox strong: {
    display: "block",
    color: "#4a3140",
    fontSize: "16px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
    marginTop: "17px",
  },

  infoBlock: {
    background: "#fafbfc",
    border: "1px solid #e5e8ee",
    borderRadius: "16px",
    padding: "19px",
    marginTop: "17px",
  },

  infoBlock span: {
    display: "block",
    color: "#697586",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.8px",
    marginBottom: "10px",
  },

  infoContent: {
    color: "#343a4d",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    fontSize: "14px",
  },

  listBlock: {
    marginTop: "19px",
  },

  listBlock span: {
    display: "block",
    color: "#697586",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.8px",
    marginBottom: "11px",
  },

  pills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "9px",
  },

  pill: {
    background: "#f1edff",
    border: "1px solid #ddd4fa",
    color: "#5e47a5",
    padding: "9px 13px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "650",
  },

  emptyText: {
    color: "#8a93a3",
    margin: 0,
    fontSize: "14px",
  },

  productivityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },

  productivityCard: {
    borderRadius: "20px",
    padding: "23px",
    background:
      "linear-gradient(145deg, #ecfbf7, #f4fffc)",
    border: "1px solid #ccefe4",
  },

  productivityCard span: {
    display: "block",
    color: "#4b756a",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.8px",
    marginBottom: "10px",
  },

  productivityCard strong: {
    display: "block",
    color: "#174e43",
    fontSize: "34px",
    marginBottom: "8px",
  },

  productivityCard small: {
    color: "#5d746f",
    fontSize: "12px",
  },

  tipificacionStatus: {
    display: "inline-block",
    padding: "9px 15px",
    borderRadius: "999px",
    background: "#fff3df",
    border: "1px solid #f5d8a6",
    color: "#93621a",
    fontSize: "12px",
    fontWeight: "900",
    marginBottom: "17px",
  },

  tipificacionMetrics: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "13px",
  },

  noVentasGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "13px",
  },

  feedbackQuestion: {
    color: "#51596b",
    lineHeight: 1.6,
    marginBottom: "17px",
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "145px",
    boxSizing: "border-box",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid #dcd5ed",
    background: "#ffffff",
    color: "#20253d",
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
      "linear-gradient(135deg, #7657d9, #9b6ee8)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "13px",
    boxShadow:
      "0 8px 20px rgba(118, 87, 217, 0.2)",
  },

  feedbackMessage: {
    marginTop: "13px",
    padding: "12px 15px",
    borderRadius: "11px",
    background: "#ffffff",
    border: "1px solid #e4e0ee",
    fontSize: "13px",
    fontWeight: "800",
  },

  muted: {
    color: "#697586",
    lineHeight: 1.6,
  },

  label: {
    display: "block",
    fontWeight: "750",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#42495a",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #d9dce5",
    background: "#ffffff",
    color: "#20253d",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "105px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #d9dce5",
    background: "#ffffff",
    color: "#20253d",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
    outline: "none",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "5px 18px",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "15px 18px",
    background:
      "linear-gradient(135deg, #7657d9, #9b6ee8)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #d9d4e7",
    borderRadius: "12px",
    padding: "12px 18px",
    background: "#ffffff",
    color: "#4a4560",
    fontWeight: "750",
    cursor: "pointer",
  },

  error: {
    background: "#fff1f4",
    color: "#b42345",
    border: "1px solid #f3c4d0",
    padding: "12px",
    borderRadius: "11px",
    margin: "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#ecfbf5",
    color: "#087443",
    border: "1px solid #b8ead8",
    padding: "13px",
    borderRadius: "11px",
    fontWeight: "800",
  },

  divider: {
    height: "1px",
    background:
      "linear-gradient(90deg, transparent, #ded9eb, transparent)",
    margin: "32px 0",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#f6f3fb",
    borderBottom: "1px solid #e3deed",
    fontSize: "13px",
    color: "#504a62",
  },

  td: {
    padding: "13px",
    borderBottom: "1px solid #edf0f3",
    fontSize: "14px",
  },

  statusRed: {
    background: "#fff0f3",
    color: "#b42345",
    border: "1px solid #f2c4d0",
    padding: "9px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.4px",
  },

  statusOrange: {
    background: "#fff4df",
    color: "#93621a",
    border: "1px solid #f2d5a0",
    padding: "9px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.4px",
  },

  statusGreen: {
    background: "#eafaf4",
    color: "#087443",
    border: "1px solid #b9ead8",
    padding: "9px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.4px",
  },
};
