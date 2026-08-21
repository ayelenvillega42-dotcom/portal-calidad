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
    no_ventas_cantidad: "",
    no_ventas_om: "",
    no_ventas_coaching: "",
    no_ventas_sistema: "",
    no_ventas_compromiso: "",
    no_ventas_fortalezas: "",
    no_ventas_observaciones: "",
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
      no_ventas_cantidad: "",
      no_ventas_om: "",
      no_ventas_coaching: "",
      no_ventas_sistema: "",
      no_ventas_compromiso: "",
      no_ventas_fortalezas: "",
      no_ventas_observaciones: "",
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

    const separarLineas = (texto) =>
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
      items_calidad: separarLineas(form.items_calidad),
      acciones_calidad: separarLineas(form.acciones_calidad),
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
      productividad_items: separarLineas(
        form.productividad_items
      ),
      productividad_acciones: separarLineas(
        form.productividad_acciones
      ),
      productividad_observaciones:
        form.productividad_observaciones || null,
      tipificaciones: separarLineas(form.tipificaciones),
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
      no_ventas_cantidad:
        form.no_ventas_cantidad || null,
      no_ventas_om: separarLineas(form.no_ventas_om),
      no_ventas_coaching:
        form.no_ventas_coaching || null,
      no_ventas_sistema:
        form.no_ventas_sistema || null,
      no_ventas_compromiso:
        form.no_ventas_compromiso || null,
      no_ventas_fortalezas: separarLineas(
        form.no_ventas_fortalezas
      ),
      no_ventas_observaciones:
        form.no_ventas_observaciones || null,
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
                <Field
                  label="Asesor"
                  name="usuario"
                  value={form.usuario}
                  onChange={cambiarFormulario}
                  type="select"
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
              />

              <TextField
                label="Objetivo de trabajo"
                name="objetivo"
                value={form.objetivo}
                onChange={cambiarFormulario}
              />

              <TextField
                label="Items trabajados en Calidad"
                name="items_calidad"
                value={form.items_calidad}
                onChange={cambiarFormulario}
                placeholder={"Un item por línea"}
              />

              <TextField
                label="Acciones realizadas"
                name="acciones_calidad"
                value={form.acciones_calidad}
                onChange={cambiarFormulario}
                placeholder={"Una acción por línea"}
              />

              <div style={styles.adminSection}>
                <SectionAdminTitle
                  number="01"
                  title="CALIDAD"
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
                    placeholder="Pegá la URL del audio"
                  />
                </div>

                <TextField
                  label="Observaciones"
                  name="observaciones"
                  value={form.observaciones}
                  onChange={cambiarFormulario}
                />
              </div>

              <div style={styles.adminSection}>
                <SectionAdminTitle
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
                    placeholder="Ej: En proceso"
                  />
                </div>

                <TextField
                  label="Comparativo semanal"
                  name="productividad_comparativo"
                  value={form.productividad_comparativo}
                  onChange={cambiarFormulario}
                />

                <TextField
                  label="Items trabajados"
                  name="productividad_items"
                  value={form.productividad_items}
                  onChange={cambiarFormulario}
                />

                <TextField
                  label="Acciones realizadas"
                  name="productividad_acciones"
                  value={form.productividad_acciones}
                  onChange={cambiarFormulario}
                />

                <TextField
                  label="Observaciones"
                  name="productividad_observaciones"
                  value={form.productividad_observaciones}
                  onChange={cambiarFormulario}
                />
              </div>

              <div style={styles.adminSection}>
                <SectionAdminTitle
                  number="03"
                  title="TIPIFICACIONES"
                />

                <TextField
                  label="Tipificaciones"
                  name="tipificaciones"
                  value={form.tipificaciones}
                  onChange={cambiarFormulario}
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
                    label="Objetivo general"
                    name="objetivo_tipificaciones"
                    value={form.objetivo_tipificaciones}
                    onChange={cambiarFormulario}
                  />

                  <Field
                    label="Compromiso"
                    name="tipificacion_compromiso"
                    value={form.tipificacion_compromiso}
                    onChange={cambiarFormulario}
                  />
                </div>

                <TextField
                  label="Observaciones"
                  name="tipificacion_observaciones"
                  value={form.tipificacion_observaciones}
                  onChange={cambiarFormulario}
                />
              </div>

              <div style={styles.adminSection}>
                <SectionAdminTitle
                  number="04"
                  title="AUDITORÍAS DE NO VENTAS"
                />

                <div style={styles.formGrid}>
                  <Field
                    label="Cantidad"
                    name="no_ventas_cantidad"
                    value={form.no_ventas_cantidad}
                    onChange={cambiarFormulario}
                  />

                  <Field
                    label="Coaching"
                    name="no_ventas_coaching"
                    value={form.no_ventas_coaching}
                    onChange={cambiarFormulario}
                  />

                  <Field
                    label="Registro en sistema"
                    name="no_ventas_sistema"
                    value={form.no_ventas_sistema}
                    onChange={cambiarFormulario}
                  />

                  <Field
                    label="Compromiso"
                    name="no_ventas_compromiso"
                    value={form.no_ventas_compromiso}
                    onChange={cambiarFormulario}
                  />
                </div>

                <TextField
                  label="Principales O.M."
                  name="no_ventas_om"
                  value={form.no_ventas_om}
                  onChange={cambiarFormulario}
                />

                <TextField
                  label="Fortalezas"
                  name="no_ventas_fortalezas"
                  value={form.no_ventas_fortalezas}
                  onChange={cambiarFormulario}
                />

                <TextField
                  label="Observaciones"
                  name="no_ventas_observaciones"
                  value={form.no_ventas_observaciones}
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
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.eyebrow}>
                  HISTORIAL
                </div>
                <h2 style={styles.sectionTitle}>
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
    const reporteAnterior = reportes[1];

    const notaActual =
      parseFloat(
        String(reporteActual?.nota ?? "").replace(
          "%",
          ""
        )
      ) || 0;

    const objetivo =
      parseFloat(
        String(
          reporteActual?.objetivo_calidad ??
            reporteActual?.objetivo ??
            ""
        ).replace("%", "")
      ) || 0;

    const falta = Math.max(objetivo - notaActual, 0);
    const progreso =
      objetivo > 0
        ? Math.min((notaActual / objetivo) * 100, 100)
        : 0;

    const notaAnterior =
      parseFloat(
        String(reporteAnterior?.nota ?? "").replace(
          "%",
          ""
        )
      ) || 0;

    const variacion =
      reporteAnterior && notaAnterior
        ? notaActual - notaAnterior
        : null;

    const estadoGeneral =
      reporteActual?.estado_objetivo ||
      (notaActual >= objetivo
        ? "OBJETIVO ALCANZADO"
        : "DEBAJO DEL OBJETIVO");

    return (
      <main style={styles.page}>
        <div style={styles.advisorContainer}>
          <header style={styles.advisorHeader}>
            <div>
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.advisorName}>
                Hola,{" "}
                {asesorActual?.[0]?.split(", ")[1] ||
                  asesorActual?.[0]}
              </h1>

              <div style={styles.weekText}>
                {reporteActual?.semana ||
                  "Sin reporte disponible"}
              </div>
            </div>

            <div style={styles.headerRight}>
              <StatusPill
                status={estadoGeneral}
              />

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
              <div style={styles.emptyIcon}>✓</div>

              <h2>Todavía no hay reportes</h2>

              <p style={styles.muted}>
                Cuando Calidad cargue tu primer
                reporte semanal, vas a poder verlo
                desde acá.
              </p>
            </section>
          ) : (
            <>
              <section style={styles.sectionCard}>
                <SectionNumber number="01" />
                <h2 style={styles.bigSectionTitle}>
                  CALIDAD
                </h2>

                <div style={styles.qualityTop}>
                  <div style={styles.scoreBlock}>
                    <div style={styles.scoreLabel}>
                      NOTA
                    </div>

                    <div style={styles.bigScore}>
                      {reporteActual?.nota || "-"}
                    </div>

                    <div style={styles.scoreOutOf}>
                      / 100
                    </div>
                  </div>

                  <div style={styles.metricsGrid}>
                    <MiniMetric
                      label="OBJETIVO"
                      value={
                        reporteActual?.objetivo_calidad ||
                        "-"
                      }
                    />

                    <MiniMetric
                      label="ESTADO"
                      value={estadoGeneral}
                    />

                    <MiniMetric
                      label="PRODUCTO"
                      value={
                        reporteActual?.producto || "-"
                      }
                    />

                    <MiniMetric
                      label="CUÁNTO FALTA"
                      value={
                        falta > 0
                          ? `${falta} puntos`
                          : "Objetivo alcanzado"
                      }
                    />
                  </div>
                </div>

                <div style={styles.progressArea}>
                  <div style={styles.progressHeader}>
                    <span>
                      Progreso hacia el objetivo
                    </span>

                    <strong>
                      {Math.round(progreso)}%
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
                </div>

                <div style={styles.highlightGrid}>
                  <div style={styles.desvioBox}>
                    <div style={styles.boxEyebrow}>
                      DESVÍO PRINCIPAL
                    </div>

                    <div style={styles.boxText}>
                      {reporteActual?.desvio ||
                        "No hay desvíos cargados."}
                    </div>
                  </div>

                  <div style={styles.compareBox}>
                    <div style={styles.boxEyebrow}>
                      COMPARATIVO SEMANAL
                    </div>

                    {reporteAnterior ? (
                      <div>
                        <strong>
                          {variacion > 0
                            ? `+${variacion}`
                            : variacion}{" "}
                          puntos
                        </strong>

                        <span style={styles.compareText}>
                          {" "}
                          vs.{" "}
                          {reporteAnterior.semana}
                        </span>
                      </div>
                    ) : (
                      <div style={styles.compareText}>
                        Todavía no hay una semana
                        anterior para comparar.
                      </div>
                    )}
                  </div>
                </div>

                <ContentColumns>
                  <ContentList
                    title="ITEMS TRABAJADOS"
                    items={
                      reporteActual?.items_calidad
                    }
                    empty="No se registraron items."
                  />

                  <ContentList
                    title="ACCIONES REALIZADAS"
                    items={
                      reporteActual?.acciones_calidad
                    }
                    empty="No se registraron acciones."
                  />
                </ContentColumns>

                <div style={styles.auditBox}>
                  <div style={styles.boxEyebrow}>
                    AUDITORÍA
                  </div>

                  <div style={styles.boxText}>
                    {reporteActual?.auditoria ||
                      "No hay información de auditoría."}
                  </div>

                  {reporteActual?.audio_url && (
                    <audio
                      controls
                      src={reporteActual.audio_url}
                      style={{
                        width: "100%",
                        marginTop: "16px",
                      }}
                    />
                  )}
                </div>

                <div style={styles.observationBox}>
                  <div style={styles.boxEyebrow}>
                    OBSERVACIONES
                  </div>

                  <div style={styles.boxText}>
                    {reporteActual?.observaciones ||
                      "No hay observaciones cargadas."}
                  </div>
                </div>
              </section>

              <section style={styles.sectionCard}>
                <SectionNumber number="02" />
                <h2 style={styles.bigSectionTitle}>
                  PRODUCTIVIDAD
                </h2>

                <div style={styles.productivityGrid}>
                  <ProductivityMetric
                    label="SPH"
                    value={
                      reporteActual?.sph || "-"
                    }
                    objective={
                      reporteActual?.objetivo_sph
                    }
                  />

                  <ProductivityMetric
                    label="VENTAS"
                    value={
                      reporteActual?.ventas || "-"
                    }
                    objective={
                      reporteActual?.objetivo_ventas
                    }
                  />

                  <ProductivityMetric
                    label="OBJETIVO DE CAMPAÑA"
                    value={
                      reporteActual?.objetivo_campania ||
                      "-"
                    }
                    objective={
                      reporteActual?.estado_campania
                    }
                  />
                </div>

                <div style={styles.compareFull}>
                  <div style={styles.boxEyebrow}>
                    COMPARATIVO SEMANAL
                  </div>

                  <div style={styles.boxText}>
                    {reporteActual?.productividad_comparativo ||
                      "-"}
                  </div>
                </div>

                <ContentColumns>
                  <ContentList
                    title="ITEMS TRABAJADOS"
                    items={
                      reporteActual?.productividad_items
                    }
                    empty="No se registraron items."
                  />

                  <ContentList
                    title="ACCIONES REALIZADAS"
                    items={
                      reporteActual?.productividad_acciones
                    }
                    empty="No se registraron acciones."
                  />
                </ContentColumns>

                <div style={styles.observationBox}>
                  <div style={styles.boxEyebrow}>
                    OBSERVACIONES
                  </div>

                  <div style={styles.boxText}>
                    {reporteActual?.productividad_observaciones ||
                      "No hay observaciones cargadas."}
                  </div>
                </div>
              </section>

              <section style={styles.sectionCard}>
                <SectionNumber number="03" />
                <div style={styles.sectionTitleRow}>
                  <h2 style={styles.bigSectionTitle}>
                    TIPIFICACIONES
                  </h2>

                  <StatusPill
                    status={
                      reporteActual?.estado_tipificaciones ||
                      "Sin estado"
                    }
                  />
                </div>

                <div style={styles.tipMetrics}>
                  <MiniMetric
                    label="DESVÍO"
                    value={
                      reporteActual?.tipificacion_desvio ||
                      "-"
                    }
                  />

                  <MiniMetric
                    label="OBJETIVO"
                    value={
                      reporteActual?.tipificacion_objetivo ||
                      "-"
                    }
                  />

                  <MiniMetric
                    label="RESULTADO"
                    value={
                      reporteActual?.tipificacion_resultado ||
                      "-"
                    }
                  />
                </div>

                <ContentList
                  title="TIPIFICACIONES"
                  items={reporteActual?.tipificaciones}
                  empty="No se registraron tipificaciones."
                />

                <div style={styles.twoColumns}>
                  <div style={styles.infoPanel}>
                    <div style={styles.boxEyebrow}>
                      COMPROMISO
                    </div>

                    <div style={styles.boxText}>
                      {reporteActual?.tipificacion_compromiso ||
                        "Sin compromiso cargado."}
                    </div>
                  </div>

                  <div style={styles.infoPanel}>
                    <div style={styles.boxEyebrow}>
                      OBSERVACIONES
                    </div>

                    <div style={styles.boxText}>
                      {reporteActual?.tipificacion_observaciones ||
                        "Sin observaciones cargadas."}
                    </div>
                  </div>
                </div>
              </section>

              <section style={styles.sectionCard}>
                <SectionNumber number="04" />

                <h2 style={styles.bigSectionTitle}>
                  AUDITORÍAS DE NO VENTAS
                </h2>

                <div style={styles.noVentasTop}>
                  <div style={styles.quantityBox}>
                    <div style={styles.boxEyebrow}>
                      CANTIDAD
                    </div>

                    <div style={styles.quantityValue}>
                      {reporteActual?.no_ventas_cantidad ||
                        "-"}
                    </div>
                  </div>

                  <div style={styles.infoPanel}>
                    <div style={styles.boxEyebrow}>
                      PRINCIPALES O.M.
                    </div>

                    <ArrayList
                      items={
                        reporteActual?.no_ventas_om
                      }
                      empty="-"
                    />
                  </div>
                </div>

                <div style={styles.twoColumns}>
                  <InfoField
                    title="COACHING"
                    value={
                      reporteActual?.no_ventas_coaching ||
                      "-"
                    }
                  />

                  <InfoField
                    title="REGISTRO EN SISTEMA"
                    value={
                      reporteActual?.no_ventas_sistema ||
                      "-"
                    }
                  />

                  <InfoField
                    title="COMPROMISO"
                    value={
                      reporteActual?.no_ventas_compromiso ||
                      "-"
                    }
                  />

                  <div style={styles.infoPanel}>
                    <div style={styles.boxEyebrow}>
                      FORTALEZAS
                    </div>

                    <ArrayList
                      items={
                        reporteActual?.no_ventas_fortalezas
                      }
                      empty="-"
                    />
                  </div>
                </div>

                <div style={styles.observationBox}>
                  <div style={styles.boxEyebrow}>
                    OBSERVACIONES
                  </div>

                  <div style={styles.boxText}>
                    {reporteActual?.no_ventas_observaciones ||
                      "No hay observaciones cargadas."}
                  </div>
                </div>
              </section>

              <FeedbackSection
                asesor={asesorActual?.[1]}
                reporteId={reporteActual?.id}
              />

              {reportes.length > 1 && (
                <section style={styles.historyCard}>
                  <div style={styles.eyebrow}>
                    EVOLUCIÓN
                  </div>

                  <h2 style={styles.sectionTitle}>
                    Historial de reportes
                  </h2>

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
  type = "text",
  required = false,
  options = [],
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
      ) : (
        <input
          type="text"
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

function SectionAdminTitle({ number, title }) {
  return (
    <div style={styles.adminSectionTitle}>
      <span>{number}</span>
      <h3>{title}</h3>
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

function StatusPill({ status }) {
  const texto = String(status || "").toUpperCase();

  let variant = "neutral";

  if (
    texto.includes("ALCANZ") ||
    texto.includes("CUMPL")
  ) {
    variant = "success";
  } else if (
    texto.includes("DEBAJO") ||
    texto.includes("DESVÍO") ||
    texto.includes("DESVIO")
  ) {
    variant = "danger";
  } else if (
    texto.includes("PROCESO") ||
    texto.includes("SEGUIMIENTO")
  ) {
    variant = "warning";
  }

  return (
    <div
      style={{
        ...styles.statusPill,
        ...styles.statusVariants[variant],
      }}
    >
      {texto || "SIN ESTADO"}
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div style={styles.miniMetric}>
      <div style={styles.miniLabel}>
        {label}
      </div>

      <div style={styles.miniValue}>
        {value}
      </div>
    </div>
  );
}

function ProductivityMetric({
  label,
  value,
  objective,
}) {
  return (
    <div style={styles.productivityMetric}>
      <div style={styles.miniLabel}>
        {label}
      </div>

      <div style={styles.productivityValue}>
        {value}
      </div>

      <div style={styles.productivityObjective}>
        {objective
          ? `Objetivo: ${objective}`
          : "Sin objetivo cargado"}
      </div>
    </div>
  );
}

function ContentColumns({ children }) {
  return (
    <div style={styles.twoColumns}>
      {children}
    </div>
  );
}

function ContentList({ title, items, empty }) {
  return (
    <div style={styles.listPanel}>
      <div style={styles.boxEyebrow}>
        {title}
      </div>

      <ArrayList
        items={items}
        empty={empty}
      />
    </div>
  );
}

function InfoField({ title, value }) {
  return (
    <div style={styles.infoPanel}>
      <div style={styles.boxEyebrow}>
        {title}
      </div>

      <div style={styles.boxText}>
        {value}
      </div>
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

function FeedbackSection({
  asesor,
  reporteId,
}) {
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [confirmacion, setConfirmacion] =
    useState("");

  async function enviarFeedback(e) {
    e.preventDefault();

    if (!mensaje.trim()) return;

    setEnviando(true);
    setConfirmacion("");

    const { error } = await supabase
      .from("feedback")
      .insert([
        {
          usuario: asesor || null,
          reporte_id: reporteId || null,
          mensaje: mensaje.trim(),
        },
      ]);

    if (error) {
      console.error(error);
      setConfirmacion(
        "No se pudo enviar el feedback."
      );
    } else {
      setMensaje("");
      setConfirmacion(
        "✓ Feedback enviado correctamente."
      );
    }

    setEnviando(false);
  }

  return (
    <section style={styles.feedbackCard}>
      <SectionNumber number="05" />

      <div style={styles.eyebrow}>
        COMUNICACIÓN
      </div>

      <h2 style={styles.bigSectionTitle}>
        FEEDBACK DEL ASESOR
      </h2>

      <p style={styles.feedbackIntro}>
        ¿Querés dejar algún comentario sobre tu
        reporte, una consulta o algo que quieras
        trabajar con Calidad?
      </p>

      <form onSubmit={enviarFeedback}>
        <textarea
          value={mensaje}
          onChange={(e) =>
            setMensaje(e.target.value)
          }
          placeholder="Escribí tu comentario acá..."
          style={styles.feedbackTextarea}
        />

        <button
          type="submit"
          disabled={
            enviando || !mensaje.trim()
          }
          style={{
            ...styles.feedbackButton,
            opacity:
              enviando || !mensaje.trim()
                ? 0.55
                : 1,
          }}
        >
          {enviando
            ? "ENVIANDO..."
            : "ENVIAR FEEDBACK"}
        </button>
      </form>

      {confirmacion && (
        <div style={styles.feedbackConfirmation}>
          {confirmacion}
        </div>
      )}
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(145deg, #F5FAFA 0%, #EAF4F5 55%, #F7FBFB 100%)",
    color: "#17343D",
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
    background: "#FFFFFF",
    padding: "42px",
    borderRadius: "24px",
    boxShadow:
      "0 24px 70px rgba(18, 59, 74, 0.14)",
    border: "1px solid #DCEBEC",
  },

  logo: {
    width: "58px",
    height: "58px",
    borderRadius: "17px",
    background:
      "linear-gradient(135deg, #123B4A, #197B83)",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "20px",
  },

  loginEyebrow: {
    color: "#197B83",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.2px",
  },

  loginTitle: {
    margin: "7px 0 0",
    color: "#123B4A",
    fontSize: "32px",
  },

  container: {
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "30px 20px 60px",
  },

  advisorContainer: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "34px 20px 70px",
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
    gap: "25px",
    marginBottom: "30px",
    paddingBottom: "24px",
    borderBottom: "1px solid #CFE2E4",
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
    background: "#123B4A",
    color: "#FFFFFF",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  pageTitle: {
    margin: "8px 0 0",
    color: "#123B4A",
  },

  advisorName: {
    margin: "12px 0 4px",
    color: "#123B4A",
    fontSize: "32px",
    letterSpacing: "-0.5px",
  },

  weekText: {
    color: "#197B83",
    fontWeight: "700",
    fontSize: "15px",
  },

  card: {
    background: "#FFFFFF",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "22px",
    border: "1px solid #DCEBEC",
    boxShadow:
      "0 10px 35px rgba(18, 59, 74, 0.07)",
  },

  heroCard: {
    background:
      "linear-gradient(135deg, #123B4A 0%, #176B78 65%, #208D8C 100%)",
    color: "#FFFFFF",
    borderRadius: "24px",
    padding: "34px",
    marginBottom: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    boxShadow:
      "0 18px 45px rgba(18, 59, 74, 0.18)",
  },

  heroSmall: {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.3px",
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

  label: {
    display: "block",
    fontWeight: "700",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#31515A",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #C9DEE0",
    background: "#FFFFFF",
    color: "#17343D",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: "105px",
    boxSizing: "border-box",
    padding: "13px 14px",
    borderRadius: "11px",
    border: "1px solid #C9DEE0",
    background: "#FFFFFF",
    color: "#17343D",
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
    padding: "15px 18px",
    background:
      "linear-gradient(135deg, #123B4A, #197B83)",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "22px",
  },

  secondaryButton: {
    border: "1px solid #C6DADD",
    borderRadius: "11px",
    padding: "12px 18px",
    background: "#FFFFFF",
    color: "#24515C",
    fontWeight: "700",
    cursor: "pointer",
  },

  error: {
    background: "#FFF1F0",
    color: "#B42318",
    border: "1px solid #F3C5C2",
    padding: "12px",
    borderRadius: "10px",
    margin: "18px 0",
    fontSize: "14px",
  },

  success: {
    background: "#EAF8F4",
    color: "#18745E",
    border: "1px solid #B9E6D7",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "700",
    marginTop: "15px",
  },

  muted: {
    color: "#647A80",
    lineHeight: 1.6,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "5px 18px",
  },

  adminSection: {
    background: "#F2F8F8",
    border: "1px solid #D7E8E9",
    borderRadius: "18px",
    padding: "22px",
    marginTop: "25px",
  },

  adminSectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "5px",
  },

  adminSectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },

  sectionNumber: {
    color: "#208D8C",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "1px",
    marginBottom: "5px",
  },

  adminSectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },

  sectionTitle: {
    margin: 0,
    color: "#123B4A",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#EAF4F5",
    color: "#24515C",
    borderBottom: "1px solid #CFE2E4",
    fontSize: "13px",
  },

  td: {
    padding: "13px",
    borderBottom: "1px solid #E5EFF0",
    fontSize: "14px",
  },

  sectionCard: {
    background: "#FFFFFF",
    border: "1px solid #D8E8E9",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "24px",
    boxShadow:
      "0 12px 40px rgba(18, 59, 74, 0.07)",
  },

  emptyCard: {
    background: "#FFFFFF",
    border: "1px solid #D8E8E9",
    borderRadius: "24px",
    padding: "50px 30px",
    textAlign: "center",
    boxShadow:
      "0 12px 40px rgba(18, 59, 74, 0.07)",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    margin: "0 auto 18px",
    background: "#EAF8F4",
    color: "#208D8C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "900",
  },

  bigSectionTitle: {
    margin: "0 0 25px",
    color: "#123B4A",
    fontSize: "25px",
    letterSpacing: "-0.3px",
  },

  sectionTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
  },

  qualityTop: {
    display: "grid",
    gridTemplateColumns:
      "minmax(190px, 0.75fr) minmax(0, 2fr)",
    gap: "22px",
  },

  scoreBlock: {
    background:
      "linear-gradient(145deg, #123B4A, #176B78)",
    borderRadius: "20px",
    padding: "25px",
    color: "#FFFFFF",
    minHeight: "190px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  scoreLabel: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    opacity: 0.75,
  },

  bigScore: {
    fontSize: "54px",
    lineHeight: 1,
    fontWeight: "900",
    marginTop: "12px",
  },

  scoreOutOf: {
    marginTop: "5px",
    opacity: 0.75,
    fontWeight: "700",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(150px, 1fr))",
    gap: "13px",
  },

  miniMetric: {
    background: "#F3F8F8",
    border: "1px solid #DCEBEC",
    borderRadius: "15px",
    padding: "17px",
  },

  miniLabel: {
    color: "#648087",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.7px",
    marginBottom: "8px",
  },

  miniValue: {
    color: "#123B4A",
    fontSize: "20px",
    fontWeight: "900",
  },

  progressArea: {
    marginTop: "25px",
    padding: "18px",
    background: "#F4F9F9",
    borderRadius: "15px",
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    color: "#45656D",
    fontSize: "13px",
    marginBottom: "9px",
  },

  progressTrack: {
    height: "10px",
    background: "#D8E9EA",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg, #176B78, #2A9D8F)",
    borderRadius: "999px",
    transition: "width 0.4s ease",
  },

  highlightGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "15px",
    marginTop: "18px",
  },

  desvioBox: {
    background: "#FFF7E8",
    border: "1px solid #F0D69A",
    borderRadius: "15px",
    padding: "19px",
  },

  compareBox: {
    background: "#EAF6F7",
    border: "1px solid #C5E1E3",
    borderRadius: "15px",
    padding: "19px",
  },

  boxEyebrow: {
    color: "#668087",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1px",
    marginBottom: "9px",
  },

  boxText: {
    color: "#23464F",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  compareText: {
    color: "#597078",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "15px",
    marginTop: "18px",
  },

  listPanel: {
    background: "#F7FAFA",
    border: "1px solid #DFEBEC",
    borderRadius: "15px",
    padding: "19px",
    marginTop: "18px",
  },

  list: {
    margin: 0,
    paddingLeft: "21px",
  },

  listItem: {
    marginBottom: "9px",
    lineHeight: 1.5,
    color: "#31515A",
  },

  auditBox: {
    background: "#F3F8F8",
    border: "1px solid #D8E8E9",
    borderRadius: "15px",
    padding: "19px",
    marginTop: "18px",
  },

  observationBox: {
    background: "#F7FAFA",
    border: "1px solid #DFEBEC",
    borderRadius: "15px",
    padding: "19px",
    marginTop: "15px",
  },

  productivityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "15px",
  },

  productivityMetric: {
    background:
      "linear-gradient(145deg, #F2F9F9, #E7F4F4)",
    border: "1px solid #D2E7E8",
    borderRadius: "17px",
    padding: "21px",
  },

  productivityValue: {
    fontSize: "30px",
    fontWeight: "900",
    color: "#123B4A",
  },

  productivityObjective: {
    marginTop: "8px",
    color: "#5D747B",
    fontSize: "12px",
  },

  compareFull: {
    background: "#EAF6F7",
    border: "1px solid #C5E1E3",
    borderRadius: "15px",
    padding: "19px",
    marginTop: "18px",
  },

  tipMetrics: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "15px",
  },

  infoPanel: {
    background: "#F7FAFA",
    border: "1px solid #DFEBEC",
    borderRadius: "15px",
    padding: "19px",
  },

  noVentasTop: {
    display: "grid",
    gridTemplateColumns:
      "180px minmax(0, 1fr)",
    gap: "15px",
  },

  quantityBox: {
    background:
      "linear-gradient(145deg, #123B4A, #176B78)",
    color: "#FFFFFF",
    borderRadius: "17px",
    padding: "20px",
  },

  quantityValue: {
    fontSize: "38px",
    fontWeight: "900",
  },

  statusPill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 13px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },

  statusVariants: {
    success: {
      background: "#E7F7F0",
      color: "#18745E",
      border: "1px solid #B8E4D4",
    },

    warning: {
      background: "#FFF5DF",
      color: "#93600B",
      border: "1px solid #F0D49A",
    },

    danger: {
      background: "#FFF0EF",
      color: "#B42318",
      border: "1px solid #F2C2BE",
    },

    neutral: {
      background: "#EAF1F2",
      color: "#42616A",
      border: "1px solid #D1E0E2",
    },
  },

  feedbackCard: {
    background:
      "linear-gradient(145deg, #123B4A, #176B78)",
    color: "#FFFFFF",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "24px",
    boxShadow:
      "0 15px 40px rgba(18, 59, 74, 0.16)",
  },

  feedbackIntro: {
    color: "rgba(255,255,255,0.82)",
    lineHeight: 1.6,
    maxWidth: "720px",
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "130px",
    boxSizing: "border-box",
    padding: "15px",
    borderRadius: "13px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.97)",
    color: "#17343D",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    marginTop: "8px",
  },

  feedbackButton: {
    border: "none",
    borderRadius: "11px",
    padding: "14px 22px",
    background: "#FFFFFF",
    color: "#123B4A",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    marginTop: "12px",
  },

  feedbackConfirmation: {
    marginTop: "14px",
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.13)",
    color: "#FFFFFF",
    fontWeight: "700",
  },

  historyCard: {
    background: "#FFFFFF",
    border: "1px solid #D8E8E9",
    borderRadius: "20px",
    padding: "26px",
    marginBottom: "25px",
  },

  eyebrow: {
    color: "#208D8C",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.1px",
    marginBottom: "6px",
  },

  cardHeader: {
    marginBottom: "20px",
  },

  // Responsive
  "@media (max-width: 800px)": {},
};
