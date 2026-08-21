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

  const [feedback, setFeedback] = useState("");
  const [enviandoFeedback, setEnviandoFeedback] = useState(false);
  const [mensajeFeedback, setMensajeFeedback] = useState("");

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
    productividad_comparativo: "",
    productividad_items: "",
    productividad_acciones: "",
    productividad_observaciones: "",
    tipificaciones: "",
    objetivo_tipificaciones: "",
    estado_tipificaciones: "",
    tipificacion_desvio: "",
    tipificacion_objetivo: "",
    tipificacion_resultado: "",
    tipificacion_compromiso: "",
    tipificacion_observaciones: "",
    auditoria_no_ventas_cantidad: "",
    auditoria_principales_om: "",
    auditoria_coaching: "",
    auditoria_registro_sistema: "",
    auditoria_compromiso: "",
    auditoria_fortalezas: "",
    auditoria_no_ventas_observaciones: "",
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
    Object.keys(form).forEach(() => {});
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
      productividad_comparativo: "",
      productividad_items: "",
      productividad_acciones: "",
      productividad_observaciones: "",
      tipificaciones: "",
      objetivo_tipificaciones: "",
      estado_tipificaciones: "",
      tipificacion_desvio: "",
      tipificacion_objetivo: "",
      tipificacion_resultado: "",
      tipificacion_compromiso: "",
      tipificacion_observaciones: "",
      auditoria_no_ventas_cantidad: "",
      auditoria_principales_om: "",
      auditoria_coaching: "",
      auditoria_registro_sistema: "",
      auditoria_compromiso: "",
      auditoria_fortalezas: "",
      auditoria_no_ventas_observaciones: "",
    });
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
      productividad_comparativo:
        form.productividad_comparativo || null,
      productividad_items: convertirLista(
        form.productividad_items
      ),
      productividad_acciones: convertirLista(
        form.productividad_acciones
      ),
      productividad_observaciones:
        form.productividad_observaciones || null,
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
      auditoria_principales_om:
        form.auditoria_principales_om || null,
      auditoria_coaching:
        form.auditoria_coaching || null,
      auditoria_registro_sistema:
        form.auditoria_registro_sistema || null,
      auditoria_compromiso:
        form.auditoria_compromiso || null,
      auditoria_fortalezas:
        form.auditoria_fortalezas || null,
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

  async function enviarFeedback(e) {
    e.preventDefault();

    if (!feedback.trim() || !asesorActual) return;

    setEnviandoFeedback(true);
    setMensajeFeedback("");

    const reporte = reportes[0];

    const { error } = await supabase.from("feedback").insert([
      {
        usuario: asesorActual[1],
        semana: reporte?.semana || null,
        mensaje: feedback.trim(),
      },
    ]);

    if (error) {
      console.error(error);
      setMensajeFeedback(
        "No se pudo enviar el feedback. Intentá nuevamente."
      );
    } else {
      setFeedback("");
      setMensajeFeedback(
        "✓ Feedback enviado correctamente a Calidad."
      );
    }

    setEnviandoFeedback(false);
  }

  if (cargando) {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
          <div style={styles.loadingCard}>
            <div style={styles.loadingIcon}>✓</div>
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

            <h1 style={styles.loginTitle}>Bienvenido/a</h1>

            <p style={styles.muted}>
              Ingresá con tu email y contraseña
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
              <p style={styles.heroEyebrow}>ADMINISTRACIÓN</p>
              <h2 style={styles.heroTitle}>
                Cargar nuevo reporte
              </h2>
              <p style={styles.heroText}>
                El reporte quedará disponible automáticamente
                para el asesor seleccionado.
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
                  placeholder="Ej: 90"
                />

                <Field
                  label="Estado del objetivo"
                  name="estado_objetivo"
                  value={form.estado_objetivo}
                  onChange={cambiarFormulario}
                  placeholder="Ej: En proceso"
                />

                <Field
                  label="Producto"
                  name="producto"
                  value={form.producto}
                  onChange={cambiarFormulario}
                  placeholder="Ej: AP"
                />
              </div>

              <AdminSection title="CALIDAD" color="#20639B">
                <Textarea
                  label="Desvío principal"
                  name="desvio"
                  value={form.desvio}
                  onChange={cambiarFormulario}
                />

                <Textarea
                  label="Recomendación"
                  name="recomendacion"
                  value={form.recomendacion}
                  onChange={cambiarFormulario}
                />

                <Textarea
                  label="Objetivo de trabajo"
                  name="objetivo"
                  value={form.objetivo}
                  onChange={cambiarFormulario}
                />

                <Textarea
                  label="Items trabajados en Calidad"
                  name="items_calidad"
                  value={form.items_calidad}
                  onChange={cambiarFormulario}
                  placeholder="Un item por línea"
                />

                <Textarea
                  label="Acciones realizadas en Calidad"
                  name="acciones_calidad"
                  value={form.acciones_calidad}
                  onChange={cambiarFormulario}
                  placeholder="Una acción por línea"
                />

                <div style={styles.formGrid}>
                  <Field
                    label="Referencia de auditoría"
                    name="auditoria"
                    value={form.auditoria}
                    onChange={cambiarFormulario}
                    placeholder="Ej: Llamada 15482"
                  />

                  <Field
                    label="URL del audio"
                    name="audio_url"
                    value={form.audio_url}
                    onChange={cambiarFormulario}
                    placeholder="Pegá la URL"
                  />
                </div>

                <Textarea
                  label="Observaciones"
                  name="observaciones"
                  value={form.observaciones}
                  onChange={cambiarFormulario}
                />
              </AdminSection>

              <AdminSection title="PRODUCTIVIDAD" color="#3CAEA3">
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

                <Textarea
                  label="Comparativo semanal"
                  name="productividad_comparativo"
                  value={form.productividad_comparativo}
                  onChange={cambiarFormulario}
                />

                <Textarea
                  label="Items trabajados"
                  name="productividad_items"
                  value={form.productividad_items}
                  onChange={cambiarFormulario}
                  placeholder="Un item por línea"
                />

                <Textarea
                  label="Acciones realizadas"
                  name="productividad_acciones"
                  value={form.productividad_acciones}
                  onChange={cambiarFormulario}
                  placeholder="Una acción por línea"
                />

                <Textarea
                  label="Observaciones"
                  name="productividad_observaciones"
                  value={form.productividad_observaciones}
                  onChange={cambiarFormulario}
                />
              </AdminSection>

              <AdminSection title="TIPIFICACIONES" color="#6C63A8">
                <Textarea
                  label="Tipificaciones"
                  name="tipificaciones"
                  value={form.tipificaciones}
                  onChange={cambiarFormulario}
                  placeholder="Una tipificación por línea"
                />

                <div style={styles.formGrid}>
                  <Field
                    label="Estado"
                    name="estado_tipificaciones"
                    value={form.estado_tipificaciones}
                    onChange={cambiarFormulario}
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
                </div>

                <Textarea
                  label="Observaciones"
                  name="tipificacion_observaciones"
                  value={form.tipificacion_observaciones}
                  onChange={cambiarFormulario}
                />
              </AdminSection>

              <AdminSection
                title="AUDITORÍAS DE NO VENTAS"
                color="#E59A3A"
              >
                <div style={styles.formGrid}>
                  <Field
                    label="Cantidad"
                    name="auditoria_no_ventas_cantidad"
                    value={form.auditoria_no_ventas_cantidad}
                    onChange={cambiarFormulario}
                  />

                  <Field
                    label="Registro en sistema"
                    name="auditoria_registro_sistema"
                    value={form.auditoria_registro_sistema}
                    onChange={cambiarFormulario}
                  />

                  <Field
                    label="Compromiso"
                    name="auditoria_compromiso"
                    value={form.auditoria_compromiso}
                    onChange={cambiarFormulario}
                  />
                </div>

                <Textarea
                  label="Principales O.M."
                  name="auditoria_principales_om"
                  value={form.auditoria_principales_om}
                  onChange={cambiarFormulario}
                />

                <Textarea
                  label="Coaching"
                  name="auditoria_coaching"
                  value={form.auditoria_coaching}
                  onChange={cambiarFormulario}
                />

                <Textarea
                  label="Fortalezas"
                  name="auditoria_fortalezas"
                  value={form.auditoria_fortalezas}
                  onChange={cambiarFormulario}
                />

                <Textarea
                  label="Observaciones"
                  name="auditoria_no_ventas_observaciones"
                  value={form.auditoria_no_ventas_observaciones}
                  onChange={cambiarFormulario}
                />
              </AdminSection>

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
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.cardEyebrow}>HISTORIAL</p>
                <h2 style={{ margin: 0 }}>
                  Reportes cargados
                </h2>
              </div>
            </div>

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

    const nota = Number(
      String(reporteActual?.nota || "").replace("%", "")
    );

    const objetivo = Number(
      String(
        reporteActual?.objetivo_calidad ||
          reporteActual?.objetivo ||
          0
      ).replace("%", "")
    );

    const porcentajeProgreso =
      objetivo > 0
        ? Math.min(Math.round((nota / objetivo) * 100), 100)
        : 0;

    const falta =
      objetivo > nota ? objetivo - nota : 0;

    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.advisorHeader}>
            <div>
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.advisorGreeting}>
                Hola, {asesorActual?.[0]?.split(",")[1]?.trim() || ""}
              </h1>

              <p style={styles.weekText}>
                {reporteActual?.semana || "Semana"}
              </p>
            </div>

            <div style={styles.headerRight}>
              <div style={styles.headerStatus}>
                <span style={styles.statusDot}></span>
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
              {/* 01 CALIDAD */}
              <section style={styles.sectionCard}>
                <SectionNumber number="01" color="#20639B" />

                <SectionTitle
                  title="CALIDAD"
                  subtitle="Tu evolución y principales oportunidades de mejora"
                />

                <div style={styles.qualityHero}>
                  <div>
                    <div style={styles.scoreLabel}>
                      NOTA DE CALIDAD
                    </div>

                    <div style={styles.bigScore}>
                      {reporteActual?.nota || "-"}
                      <span>/ 100</span>
                    </div>
                  </div>

                  <div style={styles.qualityStatus}>
                    <div style={styles.smallLabel}>
                      ESTADO
                    </div>

                    <strong>
                      {reporteActual?.estado_objetivo ||
                        "EN SEGUIMIENTO"}
                    </strong>
                  </div>
                </div>

                <div style={styles.metricsGrid}>
                  <Metric
                    title="OBJETIVO"
                    value={
                      reporteActual?.objetivo_calidad ||
                      reporteActual?.objetivo ||
                      "-"
                    }
                    color="#20639B"
                  />

                  <Metric
                    title="PRODUCTO"
                    value={reporteActual?.producto || "-"}
                    color="#3CAEA3"
                  />

                  <Metric
                    title="CUÁNTO FALTA"
                    value={
                      falta > 0
                        ? `${falta} puntos`
                        : "Objetivo alcanzado"
                    }
                    color="#E59A3A"
                  />
                </div>

                <div style={styles.progressCard}>
                  <div style={styles.progressHeader}>
                    <strong>
                      Progreso hacia el objetivo
                    </strong>

                    <span>{porcentajeProgreso}%</span>
                  </div>

                  <div style={styles.progressTrack}>
                    <div
                      style={{
                        ...styles.progressBar,
                        width: `${porcentajeProgreso}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <InfoBlock
                  title="DESVÍO PRINCIPAL"
                  value={
                    reporteActual?.desvio ||
                    "No hay desvíos cargados."
                  }
                  color="#E59A3A"
                />

                <InfoBlock
                  title="COMPARATIVO SEMANAL"
                  value={
                    reporteActual?.calidad_comparativo ||
                    "Todavía no hay una semana anterior para comparar."
                  }
                  color="#6C63A8"
                />

                <ListBlock
                  title="ITEMS TRABAJADOS"
                  items={reporteActual?.items_calidad}
                  empty="No se registraron items de calidad."
                />

                <ListBlock
                  title="ACCIONES REALIZADAS"
                  items={reporteActual?.acciones_calidad}
                  empty="No se registraron acciones de calidad."
                />

                <InfoBlock
                  title="AUDITORÍA"
                  value={
                    reporteActual?.auditoria ||
                    "No hay información de auditoría."
                  }
                  color="#20639B"
                />

                <InfoBlock
                  title="OBSERVACIONES"
                  value={
                    reporteActual?.observaciones ||
                    "No hay observaciones cargadas."
                  }
                  color="#3CAEA3"
                />
              </section>

              {/* 02 PRODUCTIVIDAD */}
              <section style={styles.sectionCard}>
                <SectionNumber number="02" color="#3CAEA3" />

                <SectionTitle
                  title="PRODUCTIVIDAD"
                  subtitle="Seguimiento de tus indicadores productivos"
                />

                <div style={styles.metricsGrid}>
                  <Metric
                    title="SPH"
                    value={reporteActual?.sph || "-"}
                    extra={`Objetivo SPH: ${
                      reporteActual?.objetivo_sph || "-"
                    }`}
                    color="#3CAEA3"
                  />

                  <Metric
                    title="VENTAS"
                    value={reporteActual?.ventas || "-"}
                    extra={`Objetivo ventas: ${
                      reporteActual?.objetivo_ventas || "-"
                    }`}
                    color="#20639B"
                  />

                  <Metric
                    title="OBJETIVO DE CAMPAÑA"
                    value={
                      reporteActual?.objetivo_campania || "-"
                    }
                    extra={
                      reporteActual?.estado_campania || ""
                    }
                    color="#6C63A8"
                  />
                </div>

                <div style={styles.statusLarge}>
                  <span>ESTADO</span>
                  <strong>
                    {reporteActual?.estado_campania ||
                      "En proceso"}
                  </strong>
                </div>

                <InfoBlock
                  title="COMPARATIVO SEMANAL"
                  value={
                    reporteActual?.productividad_comparativo ||
                    "-"
                  }
                  color="#3CAEA3"
                />

                <ListBlock
                  title="ITEMS TRABAJADOS"
                  items={reporteActual?.productividad_items}
                  empty="No se registraron items trabajados."
                />

                <ListBlock
                  title="ACCIONES REALIZADAS"
                  items={reporteActual?.productividad_acciones}
                  empty="No se registraron acciones realizadas."
                />

                <InfoBlock
                  title="OBSERVACIONES"
                  value={
                    reporteActual?.productividad_observaciones ||
                    "No hay observaciones cargadas."
                  }
                  color="#3CAEA3"
                />
              </section>

              {/* 03 TIPIFICACIONES */}
              <section style={styles.sectionCard}>
                <SectionNumber number="03" color="#6C63A8" />

                <SectionTitle
                  title="TIPIFICACIONES"
                  subtitle="Seguimiento de resultados y compromiso"
                />

                <div style={styles.tipificacionStatus}>
                  <span style={styles.statusDotPurple}></span>

                  <strong>
                    {reporteActual?.estado_tipificaciones ||
                      "En proceso"}
                  </strong>
                </div>

                <div style={styles.metricsGrid}>
                  <Metric
                    title="DESVÍO"
                    value={
                      reporteActual?.tipificacion_desvio || "-"
                    }
                    color="#E59A3A"
                  />

                  <Metric
                    title="OBJETIVO"
                    value={
                      reporteActual?.tipificacion_objetivo ||
                      "-"
                    }
                    color="#6C63A8"
                  />

                  <Metric
                    title="RESULTADO"
                    value={
                      reporteActual?.tipificacion_resultado ||
                      "-"
                    }
                    color="#3CAEA3"
                  />
                </div>

                <ListBlock
                  title="TIPIFICACIONES"
                  items={reporteActual?.tipificaciones}
                  empty="No se registraron tipificaciones."
                />

                <div style={styles.twoColumns}>
                  <InfoBlock
                    title="COMPROMISO"
                    value={
                      reporteActual?.tipificacion_compromiso ||
                      "Sin compromiso cargado."
                    }
                    color="#6C63A8"
                  />

                  <InfoBlock
                    title="OBSERVACIONES"
                    value={
                      reporteActual?.tipificacion_observaciones ||
                      "Sin observaciones cargadas."
                    }
                    color="#6C63A8"
                  />
                </div>
              </section>

              {/* 04 AUDITORÍAS DE NO VENTAS */}
              <section style={styles.sectionCard}>
                <SectionNumber number="04" color="#E59A3A" />

                <SectionTitle
                  title="AUDITORÍAS DE NO VENTAS"
                  subtitle="Oportunidades detectadas en tus llamadas"
                />

                <div style={styles.auditQuantity}>
                  <div>
                    <span>CANTIDAD</span>
                    <strong>
                      {reporteActual
                        ?.auditoria_no_ventas_cantidad || "-"}
                    </strong>
                  </div>
                </div>

                <InfoBlock
                  title="PRINCIPALES O.M."
                  value={
                    reporteActual?.auditoria_principales_om ||
                    "-"
                  }
                  color="#E59A3A"
                />

                <div style={styles.twoColumns}>
                  <InfoBlock
                    title="COACHING"
                    value={
                      reporteActual?.auditoria_coaching || "-"
                    }
                    color="#E59A3A"
                  />

                  <InfoBlock
                    title="REGISTRO EN SISTEMA"
                    value={
                      reporteActual
                        ?.auditoria_registro_sistema || "-"
                    }
                    color="#E59A3A"
                  />
                </div>

                <div style={styles.twoColumns}>
                  <InfoBlock
                    title="COMPROMISO"
                    value={
                      reporteActual?.auditoria_compromiso || "-"
                    }
                    color="#E59A3A"
                  />

                  <InfoBlock
                    title="FORTALEZAS"
                    value={
                      reporteActual?.auditoria_fortalezas || "-"
                    }
                    color="#3CAEA3"
                  />
                </div>

                <InfoBlock
                  title="OBSERVACIONES"
                  value={
                    reporteActual
                      ?.auditoria_no_ventas_observaciones ||
                    "-"
                  }
                  color="#E59A3A"
                />
              </section>

              {/* 05 FEEDBACK */}
              <section style={styles.feedbackCard}>
                <SectionNumber number="05" color="#20639B" />

                <SectionTitle
                  title="FEEDBACK DEL ASESOR"
                  subtitle="Tu opinión también forma parte del seguimiento"
                />

                <p style={styles.feedbackText}>
                  ¿Querés dejar algún comentario sobre tu reporte,
                  una consulta o algo que quieras trabajar con
                  Calidad?
                </p>

                <form onSubmit={enviarFeedback}>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Escribí acá tu comentario..."
                    style={styles.feedbackTextarea}
                  />

                  <button
                    type="submit"
                    disabled={
                      enviandoFeedback || !feedback.trim()
                    }
                    style={{
                      ...styles.feedbackButton,
                      opacity:
                        enviandoFeedback || !feedback.trim()
                          ? 0.6
                          : 1,
                    }}
                  >
                    {enviandoFeedback
                      ? "ENVIANDO..."
                      : "ENVIAR FEEDBACK"}
                  </button>
                </form>

                {mensajeFeedback && (
                  <div style={styles.feedbackSuccess}>
                    {mensajeFeedback}
                  </div>
                )}
              </section>

              {reportes.length > 1 && (
                <section style={styles.historyCard}>
                  <p style={styles.cardEyebrow}>EVOLUCIÓN</p>

                  <h2>Historial de reportes</h2>

                  <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Semana</th>
                          <th style={styles.th}>Nota</th>
                          <th style={styles.th}>Producto</th>
                          <th style={styles.th}>Estado</th>
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
  select,
  options,
  required,
}) {
  return (
    <div>
      <label style={styles.label}>{label}</label>

      {select ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={styles.input}
          required={required}
        >
          <option value="">Seleccioná un asesor</option>

          {options?.map((option) => (
            <option key={option.value} value={option.value}>
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

function Textarea({
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

function AdminSection({ title, color, children }) {
  return (
    <section
      style={{
        ...styles.adminSection,
        borderTop: `4px solid ${color}`,
      }}
    >
      <h2 style={styles.adminSectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function SectionNumber({ number, color }) {
  return (
    <div
      style={{
        ...styles.sectionNumber,
        background: color,
      }}
    >
      {number}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div style={styles.sectionTitleBlock}>
      <h2>{title}</h2>

      <p>{subtitle}</p>
    </div>
  );
}

function Metric({ title, value, extra, color }) {
  return (
    <div
      style={{
        ...styles.metric,
        borderTop: `4px solid ${color || "#20639B"}`,
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

function InfoBlock({ title, value, color }) {
  return (
    <div style={styles.infoBlock}>
      <div
        style={{
          ...styles.infoAccent,
          background: color || "#20639B",
        }}
      ></div>

      <div style={styles.infoContent}>
        <div style={styles.infoTitle}>{title}</div>

        <div style={styles.infoValue}>{value}</div>
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
      <div style={styles.infoTitle}>{title}</div>

      {lista.length === 0 ? (
        <p style={styles.muted}>{empty}</p>
      ) : (
        <div style={styles.listGrid}>
          {lista.map((item, index) => (
            <div key={index} style={styles.listPill}>
              <span>✓</span>
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
      "linear-gradient(135deg, #F4F7FB 0%, #EAF2F7 50%, #F5F7FC 100%)",
    color: "#17324D",
    fontFamily: "Arial, Helvetica, sans-serif",
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
  },

  loadingCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(23,63,95,.12)",
  },

  loadingIcon: {
    width: "55px",
    height: "55px",
    margin: "0 auto 15px",
    borderRadius: "16px",
    background: "#20639B",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    fontWeight: "800",
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
    background: "#fff",
    padding: "42px",
    borderRadius: "28px",
    boxShadow: "0 25px 70px rgba(23,63,95,.15)",
    border: "1px solid #DCE8EF",
    boxSizing: "border-box",
  },

  loginLogo: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #173F5F, #20639B)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "20px",
  },

  loginEyebrow: {
    color: "#3CAEA3",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.2px",
  },

  loginTitle: {
    fontSize: "32px",
    margin: "8px 0",
    color: "#173F5F",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  advisorHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "25px",
    padding: "10px 0 30px",
    marginBottom: "5px",
    flexWrap: "wrap",
    borderBottom: "1px solid #D9E5EC",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  portalBadge: {
    display: "inline-block",
    background: "#173F5F",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: ".7px",
  },

  pageTitle: {
    margin: "10px 0 0",
    color: "#173F5F",
  },

  advisorGreeting: {
    margin: "12px 0 3px",
    fontSize: "34px",
    color: "#173F5F",
  },

  weekText: {
    margin: 0,
    color: "#60758A",
    fontSize: "16px",
    fontWeight: "600",
  },

  headerStatus: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 15px",
    borderRadius: "999px",
    background: "#E7F7F5",
    color: "#18766E",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: ".3px",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#3CAEA3",
  },

  statusDotPurple: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#6C63A8",
    display: "inline-block",
  },

  card: {
    background: "#fff",
    borderRadius: "22px",
    padding: "28px",
    marginBottom: "22px",
    border: "1px solid #DCE7EE",
    boxShadow: "0 12px 35px rgba(23,63,95,.07)",
  },

  adminHero: {
    background:
      "linear-gradient(135deg, #173F5F 0%, #20639B 65%, #3CAEA3 100%)",
    color: "#fff",
    borderRadius: "26px",
    padding: "34px",
    marginBottom: "22px",
    boxShadow: "0 18px 45px rgba(23,63,95,.18)",
  },

  heroEyebrow: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    opacity: ".8",
  },

  heroTitle: {
    margin: "0 0 8px",
    fontSize: "30px",
  },

  heroText: {
    margin: 0,
    opacity: ".88",
  },

  sectionCard: {
    background: "#fff",
    borderRadius: "26px",
    padding: "32px",
    marginBottom: "24px",
    border: "1px solid #DCE7EE",
    boxShadow: "0 15px 45px rgba(23,63,95,.08)",
  },

  feedbackCard: {
    background:
      "linear-gradient(135deg, #FFFFFF 0%, #EDF8FA 100%)",
    borderRadius: "26px",
    padding: "32px",
    marginBottom: "24px",
    border: "1px solid #CDE6E7",
    boxShadow: "0 15px 45px rgba(23,63,95,.08)",
  },

  historyCard: {
    background: "#fff",
    borderRadius: "22px",
    padding: "28px",
    border: "1px solid #DCE7EE",
    boxShadow: "0 12px 35px rgba(23,63,95,.06)",
  },

  sectionNumber: {
    width: "42px",
    height: "42px",
    borderRadius: "13px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "900",
    marginBottom: "14px",
  },

  sectionTitleBlock: {
    marginBottom: "24px",
  },

  sectionTitleBlock h2: {
    margin: 0,
  },

  sectionTitleBlock p: {
    margin: "7px 0 0",
    color: "#718397",
    fontSize: "14px",
  },

  qualityHero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "28px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #173F5F 0%, #20639B 100%)",
    color: "#fff",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  scoreLabel: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    opacity: ".75",
  },

  bigScore: {
    fontSize: "52px",
    fontWeight: "900",
    lineHeight: 1,
    marginTop: "9px",
  },

  bigScoreSpan: {
    fontSize: "18px",
  },

  qualityStatus: {
    padding: "17px 20px",
    borderRadius: "15px",
    background: "rgba(255,255,255,.12)",
    border: "1px solid rgba(255,255,255,.18)",
    minWidth: "190px",
  },

  smallLabel: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: ".9px",
    opacity: ".7",
    marginBottom: "7px",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "15px",
    marginBottom: "18px",
  },

  metric: {
    background: "#F8FAFC",
    border: "1px solid #E0E8EE",
    borderRadius: "17px",
    padding: "18px",
    minHeight: "95px",
  },

  metricTitle: {
    color: "#718397",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: ".6px",
    marginBottom: "8px",
  },

  metricValue: {
    fontSize: "26px",
    fontWeight: "900",
    color: "#173F5F",
  },

  metricExtra: {
    marginTop: "6px",
    fontSize: "12px",
    color: "#718397",
  },

  progressCard: {
    background: "#F4F8FA",
    border: "1px solid #DFE9EE",
    borderRadius: "17px",
    padding: "18px",
    marginBottom: "18px",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "10px",
    color: "#31526A",
    fontSize: "13px",
  },

  progressTrack: {
    height: "11px",
    background: "#DDE7EC",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background:
      "linear-gradient(90deg, #20639B, #3CAEA3)",
    borderRadius: "999px",
    transition: "width .4s ease",
  },

  infoBlock: {
    display: "flex",
    background: "#FAFCFD",
    border: "1px solid #E1E9EE",
    borderRadius: "17px",
    marginTop: "15px",
    overflow: "hidden",
  },

  infoAccent: {
    width: "5px",
    flexShrink: 0,
  },

  infoContent: {
    padding: "17px 18px",
    width: "100%",
  },

  infoTitle: {
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: ".7px",
    color: "#718397",
    marginBottom: "8px",
  },

  infoValue: {
    color: "#29465B",
    lineHeight: 1.55,
    whiteSpace: "pre-wrap",
  },

  listBlock: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "17px",
    background: "#F8FAFC",
    border: "1px solid #E1E9EE",
  },

  listGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "9px",
  },

  listPill: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 13px",
    borderRadius: "11px",
    background: "#fff",
    border: "1px solid #DCE7EE",
    color: "#345269",
    fontSize: "13px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
  },

  tipificacionStatus: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 14px",
    borderRadius: "999px",
    background: "#F0EEFA",
    color: "#625A99",
    fontSize: "12px",
    marginBottom: "18px",
  },

  statusLarge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#E7F7F5",
    border: "1px solid #C7E8E4",
    padding: "15px 18px",
    borderRadius: "15px",
    color: "#18766E",
    marginBottom: "18px",
  },

  auditQuantity: {
    padding: "20px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #FFF8EA, #FFFDF7)",
    border: "1px solid #F3DDAE",
    marginBottom: "18px",
  },

  auditQuantity span: {
    display: "block",
    fontSize: "11px",
    fontWeight: "800",
    color: "#9A6B1D",
    letterSpacing: ".7px",
    marginBottom: "5px",
  },

  auditQuantity strong: {
    fontSize: "30px",
    color: "#8B641F",
  },

  feedbackText: {
    color: "#526B7E",
    lineHeight: 1.6,
    marginBottom: "18px",
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "130px",
    boxSizing: "border-box",
    padding: "16px",
    borderRadius: "15px",
    border: "1px solid #C9DDE3",
    background: "#fff",
    color: "#17324D",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "Arial, Helvetica, sans-serif",
    outline: "none",
  },

  feedbackButton: {
    border: "none",
    borderRadius: "12px",
    padding: "14px 22px",
    background:
      "linear-gradient(135deg, #20639B, #3CAEA3)",
    color: "#fff",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "13px",
  },

  feedbackSuccess: {
    marginTop: "15px",
    padding: "13px 15px",
    borderRadius: "12px",
    background: "#E7F7F5",
    color: "#18766E",
    border: "1px solid #BFE4DF",
    fontWeight: "700",
  },

  emptyCard: {
    background: "#fff",
    borderRadius: "25px",
    padding: "45px",
    textAlign: "center",
    border: "1px solid #DCE7EE",
    boxShadow: "0 15px 45px rgba(23,63,95,.07)",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    margin: "0 auto 15px",
    borderRadius: "16px",
    background: "#E7F7F5",
    color: "#18766E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  adminSection: {
    background: "#FAFCFD",
    borderRight: "1px solid #E1E8ED",
    borderBottom: "1px solid #E1E8ED",
    borderLeft: "1px solid #E1E8ED",
    borderRadius: "18px",
    padding: "23px",
    marginTop: "25px",
  },

  adminSectionTitle: {
    margin: "0 0 18px",
    color: "#173F5F",
    fontSize: "19px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "5px 18px",
  },

  label: {
    display: "block",
    fontWeight: "800",
    marginBottom: "8px",
    marginTop: "17px",
    color: "#3D586C",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #CBD9E1",
    background: "#fff",
    color: "#17324D",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "105px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #CBD9E1",
    background: "#fff",
    color: "#17324D",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "15px 18px",
    background:
      "linear-gradient(135deg, #173F5F, #20639B)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "22px",
  },

  secondaryButton: {
    border: "1px solid #CBD9E1",
    borderRadius: "12px",
    padding: "11px 17px",
    background: "#fff",
    color: "#315269",
    fontWeight: "800",
    cursor: "pointer",
  },

  error: {
    background: "#FFF1F1",
    color: "#B42318",
    border: "1px solid #F5C2C0",
    padding: "12px",
    borderRadius: "11px",
    margin: "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#E7F7F5",
    color: "#18766E",
    border: "1px solid #BFE4DF",
    padding: "13px",
    borderRadius: "11px",
    fontWeight: "800",
    marginTop: "15px",
  },

  muted: {
    color: "#718397",
    lineHeight: 1.6,
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  cardEyebrow: {
    margin: "0 0 5px",
    color: "#3CAEA3",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#EEF4F7",
    borderBottom: "1px solid #DCE5EA",
    fontSize: "12px",
    color: "#496478",
  },

  td: {
    padding: "13px",
    borderBottom: "1px solid #EDF1F3",
    fontSize: "14px",
    color: "#38546A",
  },
};
