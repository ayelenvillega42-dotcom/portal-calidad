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

const formularioInicial = {
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
  comparativo_productividad: "",
  items_productividad: "",
  acciones_productividad: "",
  observaciones_productividad: "",

  comparativo_semanal: "",
  cuanto_falta: "",

  tipificaciones: "",
  objetivo_tipificaciones: "",
  estado_tipificaciones: "",
  tipificacion_desvio: "",
  tipificacion_objetivo: "",
  tipificacion_resultado: "",
  tipificacion_compromiso: "",
  tipificacion_observaciones: "",

  auditorias_no_ventas: "",
  principales_om: "",
  coaching: "",
  registro_sistema: "",
  compromiso_no_ventas: "",
  fortalezas: "",
  observaciones_no_ventas: "",
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
  const [seleccionados, setSeleccionados] = useState([]);

  const [form, setForm] = useState(formularioInicial);

  const [mensajeAdmin, setMensajeAdmin] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [enviandoFeedback, setEnviandoFeedback] = useState(false);
  const [mensajeFeedback, setMensajeFeedback] = useState("");

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
    setSeleccionados([]);
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
    setForm({ ...formularioInicial });
  }

  function convertirLista(texto) {
    return String(texto || "")
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

    const items = convertirLista(form.items_calidad);
    const acciones = convertirLista(form.acciones_calidad);
    const tipificaciones = convertirLista(form.tipificaciones);

    /*
      Importante:
      Estos son los campos que ya utilizaba tu tabla actual.
      Los campos nuevos de Productividad y Auditorías de No Ventas
      se muestran en la interfaz cuando existan en Supabase.
    */

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

  function obtenerNombreAsesor(usuario) {
    const asesor = asesores.find(
      (item) => item[1] === String(usuario)
    );

    return asesor ? asesor[0] : usuario;
  }

  function alternarSeleccion(id) {
    setSeleccionados((actuales) =>
      actuales.includes(id)
        ? actuales.filter((item) => item !== id)
        : [...actuales, id]
    );
  }

  function seleccionarTodos() {
    if (seleccionados.length === adminReportes.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(adminReportes.map((reporte) => reporte.id));
    }
  }

  function imprimirReportes(reportesParaImprimir) {
    if (!reportesParaImprimir?.length) {
      setMensajeAdmin(
        "Seleccioná al menos un reporte para imprimir."
      );
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Portal de Calidad - Reportes</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #172033;
            margin: 0;
            background: white;
          }

          .reporte {
            page-break-after: always;
          }

          .reporte:last-child {
            page-break-after: auto;
          }

          .encabezado {
            border-bottom: 2px solid #172b4d;
            padding-bottom: 16px;
            margin-bottom: 22px;
          }

          .portal {
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
            color: #172b4d;
          }

          h1 {
            margin: 7px 0;
            font-size: 26px;
          }

          h2 {
            margin: 0 0 12px;
            font-size: 18px;
            color: #172b4d;
          }

          h3 {
            margin: 18px 0 8px;
            font-size: 14px;
          }

          .semana {
            color: #697586;
          }

          .nota {
            margin: 18px 0;
            padding: 18px;
            border-radius: 12px;
            background: #f4f7fb;
            font-size: 24px;
            font-weight: bold;
          }

          .seccion {
            margin-bottom: 20px;
            border: 1px solid #e1e6ed;
            border-radius: 12px;
            padding: 18px;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .dato {
            background: #f7f9fc;
            padding: 11px;
            border-radius: 8px;
          }

          .dato strong {
            display: block;
            font-size: 11px;
            color: #697586;
            margin-bottom: 5px;
          }

          .texto {
            white-space: pre-wrap;
            line-height: 1.5;
          }

          ul {
            margin-top: 8px;
          }
        </style>
      </head>

      <body>
        ${reportesParaImprimir.map((reporte) => {
          const nombre = obtenerNombreAsesor(reporte.usuario);

          return `
            <div class="reporte">
              <div class="encabezado">
                <div class="portal">PORTAL DE CALIDAD</div>
                <h1>${escaparHtml(nombre)}</h1>
                <div class="semana">
                  ${escaparHtml(reporte.semana || "")}
                </div>
              </div>

              <div class="seccion">
                <h2>CALIDAD</h2>

                <div class="nota">
                  Nota: ${escaparHtml(reporte.nota || "-")}
                </div>

                <div class="grid">
                  <div class="dato">
                    <strong>OBJETIVO</strong>
                    ${escaparHtml(
                      reporte.objetivo_calidad ||
                        reporte.objetivo ||
                        "-"
                    )}
                  </div>

                  <div class="dato">
                    <strong>ESTADO</strong>
                    ${escaparHtml(
                      reporte.estado_objetivo || "-"
                    )}
                  </div>

                  <div class="dato">
                    <strong>PRODUCTO</strong>
                    ${escaparHtml(
                      reporte.producto || "-"
                    )}
                  </div>

                  <div class="dato">
                    <strong>AUDITORÍA</strong>
                    ${escaparHtml(
                      reporte.auditoria || "-"
                    )}
                  </div>
                </div>

                <h3>Desvío principal</h3>
                <div class="texto">
                  ${escaparHtml(reporte.desvio || "-")}
                </div>

                <h3>Recomendación</h3>
                <div class="texto">
                  ${escaparHtml(
                    reporte.recomendacion || "-"
                  )}
                </div>

                <h3>Objetivo de trabajo</h3>
                <div class="texto">
                  ${escaparHtml(
                    reporte.objetivo || "-"
                  )}
                </div>

                <h3>Items trabajados</h3>
                <div class="texto">
                  ${escaparHtml(
                    listaParaTexto(reporte.items_calidad)
                  )}
                </div>

                <h3>Acciones realizadas</h3>
                <div class="texto">
                  ${escaparHtml(
                    listaParaTexto(reporte.acciones_calidad)
                  )}
                </div>

                <h3>Observaciones</h3>
                <div class="texto">
                  ${escaparHtml(
                    reporte.observaciones || "-"
                  )}
                </div>
              </div>

              <div class="seccion">
                <h2>PRODUCTIVIDAD</h2>

                <div class="grid">
                  <div class="dato">
                    <strong>SPH</strong>
                    ${escaparHtml(reporte.sph || "-")}
                  </div>

                  <div class="dato">
                    <strong>OBJETIVO SPH</strong>
                    ${escaparHtml(
                      reporte.objetivo_sph || "-"
                    )}
                  </div>

                  <div class="dato">
                    <strong>VENTAS</strong>
                    ${escaparHtml(
                      reporte.ventas || "-"
                    )}
                  </div>

                  <div class="dato">
                    <strong>OBJETIVO VENTAS</strong>
                    ${escaparHtml(
                      reporte.objetivo_ventas || "-"
                    )}
                  </div>
                </div>
              </div>

              <div class="seccion">
                <h2>TIPIFICACIONES</h2>

                <div class="grid">
                  <div class="dato">
                    <strong>ESTADO</strong>
                    ${escaparHtml(
                      reporte.estado_tipificaciones || "-"
                    )}
                  </div>

                  <div class="dato">
                    <strong>DESVÍO</strong>
                    ${escaparHtml(
                      reporte.tipificacion_desvio || "-"
                    )}
                  </div>

                  <div class="dato">
                    <strong>OBJETIVO</strong>
                    ${escaparHtml(
                      reporte.tipificacion_objetivo || "-"
                    )}
                  </div>

                  <div class="dato">
                    <strong>RESULTADO</strong>
                    ${escaparHtml(
                      reporte.tipificacion_resultado || "-"
                    )}
                  </div>
                </div>

                <h3>Tipificaciones realizadas</h3>
                <div class="texto">
                  ${escaparHtml(
                    listaParaTexto(reporte.tipificaciones)
                  )}
                </div>

                <h3>Compromiso</h3>
                <div class="texto">
                  ${escaparHtml(
                    reporte.tipificacion_compromiso || "-"
                  )}
                </div>

                <h3>Observaciones</h3>
                <div class="texto">
                  ${escaparHtml(
                    reporte.tipificacion_observaciones || "-"
                  )}
                </div>
              </div>
            </div>
          `;
        }).join("")}
      </body>
      </html>
    `;

    const ventana = window.open(
      "",
      "_blank",
      "width=1000,height=800"
    );

    if (!ventana) {
      setMensajeAdmin(
        "El navegador bloqueó la ventana de impresión. Permití ventanas emergentes para este sitio."
      );
      return;
    }

    ventana.document.open();
    ventana.document.write(html);
    ventana.document.close();

    setTimeout(() => {
      ventana.focus();
      ventana.print();
    }, 500);
  }

  function imprimirUno(reporte) {
    imprimirReportes([reporte]);
  }

  function imprimirSeleccionados() {
    const reportesSeleccionados = adminReportes.filter(
      (reporte) => seleccionados.includes(reporte.id)
    );

    imprimirReportes(reportesSeleccionados);
  }

  function imprimirTodos() {
    imprimirReportes(adminReportes);
  }

  async function enviarFeedback() {
    if (!feedback.trim()) {
      setMensajeFeedback(
        "Escribí tu comentario antes de enviarlo."
      );
      return;
    }

    /*
      Por ahora el feedback queda preparado en el portal.
      Cuando agreguemos la tabla "feedback" en Supabase,
      lo conectamos directamente sin modificar esta pantalla.
    */

    setEnviandoFeedback(true);
    setMensajeFeedback("");

    try {
      const clave = `feedback_${asesorActual?.[1] || "asesor"}`;

      const existentes = JSON.parse(
        localStorage.getItem(clave) || "[]"
      );

      existentes.unshift({
        texto: feedback.trim(),
        fecha: new Date().toISOString(),
        semana: reporteActualSeguro(reportes)?.semana || "",
      });

      localStorage.setItem(
        clave,
        JSON.stringify(existentes)
      );

      setFeedback("");
      setMensajeFeedback(
        "✓ Feedback enviado correctamente."
      );
    } catch (error) {
      console.error(error);
      setMensajeFeedback(
        "No se pudo registrar el feedback."
      );
    }

    setEnviandoFeedback(false);
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
                <Campo
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

                <Campo
                  label="Semana / período"
                  name="semana"
                  value={form.semana}
                  onChange={cambiarFormulario}
                  placeholder="Ej: Semana 3 - Agosto"
                  required
                />

                <Campo
                  label="Nota de calidad"
                  name="nota"
                  value={form.nota}
                  onChange={cambiarFormulario}
                  placeholder="Ej: 82%"
                />

                <Campo
                  label="Objetivo de calidad"
                  name="objetivo_calidad"
                  value={form.objetivo_calidad}
                  onChange={cambiarFormulario}
                  placeholder="Ej: 90%"
                />

                <Campo
                  label="Estado del objetivo"
                  name="estado_objetivo"
                  value={form.estado_objetivo}
                  onChange={cambiarFormulario}
                  placeholder="Ej: En seguimiento"
                />

                <Campo
                  label="Producto"
                  name="producto"
                  value={form.producto}
                  onChange={cambiarFormulario}
                  placeholder="Ej: AP"
                />

                <Campo
                  label="SPH"
                  name="sph"
                  value={form.sph}
                  onChange={cambiarFormulario}
                  placeholder="Ej: 1.8"
                />

                <Campo
                  label="Objetivo SPH"
                  name="objetivo_sph"
                  value={form.objetivo_sph}
                  onChange={cambiarFormulario}
                  placeholder="Ej: 2.0"
                />
              </div>

              <CampoTexto
                label="Desvío principal"
                name="desvio"
                value={form.desvio}
                onChange={cambiarFormulario}
                placeholder="Describí el principal desvío..."
              />

              <CampoTexto
                label="Recomendación"
                name="recomendacion"
                value={form.recomendacion}
                onChange={cambiarFormulario}
                placeholder="Qué debería trabajar el asesor..."
              />

              <CampoTexto
                label="Objetivo de trabajo"
                name="objetivo"
                value={form.objetivo}
                onChange={cambiarFormulario}
                placeholder="Objetivo para la próxima evaluación..."
              />

              <CampoTexto
                label="Items trabajados en Calidad"
                name="items_calidad"
                value={form.items_calidad}
                onChange={cambiarFormulario}
                placeholder={
                  "Escribí un item por línea.\nEj: Validación de datos\nPresentación HS\nCláusula de aceptación"
                }
              />

              <CampoTexto
                label="Acciones realizadas en Calidad"
                name="acciones_calidad"
                value={form.acciones_calidad}
                onChange={cambiarFormulario}
                placeholder={
                  "Escribí una acción por línea.\nEj: Escucha personalizada\nFeedback individual\nMesa de trabajo"
                }
              />

              <div style={styles.adminSection}>
                <h2 style={styles.sectionTitle}>
                  Productividad
                </h2>

                <div style={styles.formGrid}>
                  <Campo
                    label="Ventas"
                    name="ventas"
                    value={form.ventas}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 12"
                  />

                  <Campo
                    label="Objetivo ventas"
                    name="objetivo_ventas"
                    value={form.objetivo_ventas}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 15"
                  />

                  <Campo
                    label="Objetivo de campaña"
                    name="objetivo_campania"
                    value={form.objetivo_campania}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 20"
                  />

                  <Campo
                    label="Estado campaña"
                    name="estado_campania"
                    value={form.estado_campania}
                    onChange={cambiarFormulario}
                    placeholder="Ej: En seguimiento"
                  />

                  <Campo
                    label="Comparativo semanal"
                    name="comparativo_productividad"
                    value={form.comparativo_productividad}
                    onChange={cambiarFormulario}
                    placeholder="Ej: +8%"
                  />
                </div>

                <CampoTexto
                  label="Items trabajados en Productividad"
                  name="items_productividad"
                  value={form.items_productividad}
                  onChange={cambiarFormulario}
                  placeholder="Un item por línea..."
                />

                <CampoTexto
                  label="Acciones realizadas en Productividad"
                  name="acciones_productividad"
                  value={form.acciones_productividad}
                  onChange={cambiarFormulario}
                  placeholder="Una acción por línea..."
                />

                <CampoTexto
                  label="Observaciones de Productividad"
                  name="observaciones_productividad"
                  value={form.observaciones_productividad}
                  onChange={cambiarFormulario}
                  placeholder="Observaciones..."
                />
              </div>

              <div style={styles.adminSection}>
                <h2 style={styles.sectionTitle}>
                  Seguimiento semanal
                </h2>

                <CampoTexto
                  label="Comparativo semanal de Calidad"
                  name="comparativo_semanal"
                  value={form.comparativo_semanal}
                  onChange={cambiarFormulario}
                  placeholder="Ej: Semana anterior 78% → Semana actual 82%"
                />

                <Campo
                  label="Cuánto falta para alcanzar el objetivo"
                  name="cuanto_falta"
                  value={form.cuanto_falta}
                  onChange={cambiarFormulario}
                  placeholder="Ej: 8 puntos"
                />
              </div>

              <div style={styles.adminSection}>
                <h2 style={styles.sectionTitle}>
                  Tipificaciones
                </h2>

                <CampoTexto
                  label="Tipificaciones realizadas"
                  name="tipificaciones"
                  value={form.tipificaciones}
                  onChange={cambiarFormulario}
                  placeholder={
                    "Una tipificación por línea.\nEj: No conforme con sumas aseguradas"
                  }
                />

                <div style={styles.formGrid}>
                  <Campo
                    label="Objetivo tipificaciones"
                    name="objetivo_tipificaciones"
                    value={form.objetivo_tipificaciones}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 4"
                  />

                  <Campo
                    label="Estado tipificaciones"
                    name="estado_tipificaciones"
                    value={form.estado_tipificaciones}
                    onChange={cambiarFormulario}
                    placeholder="Ej: En seguimiento"
                  />

                  <Campo
                    label="Desvío"
                    name="tipificacion_desvio"
                    value={form.tipificacion_desvio}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 1"
                  />

                  <Campo
                    label="Objetivo"
                    name="tipificacion_objetivo"
                    value={form.tipificacion_objetivo}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 14"
                  />

                  <Campo
                    label="Resultado"
                    name="tipificacion_resultado"
                    value={form.tipificacion_resultado}
                    onChange={cambiarFormulario}
                    placeholder="Ej: 14"
                  />

                  <Campo
                    label="Compromiso"
                    name="tipificacion_compromiso"
                    value={form.tipificacion_compromiso}
                    onChange={cambiarFormulario}
                    placeholder="Ej: SEGUIMIENTO"
                  />
                </div>

                <CampoTexto
                  label="Observaciones de tipificación"
                  name="tipificacion_observaciones"
                  value={form.tipificacion_observaciones}
                  onChange={cambiarFormulario}
                  placeholder="Observaciones..."
                />
              </div>

              <div style={styles.adminSection}>
                <h2 style={styles.sectionTitle}>
                  Auditoría
                </h2>

                <div style={styles.formGrid}>
                  <Campo
                    label="Referencia de auditoría"
                    name="auditoria"
                    value={form.auditoria}
                    onChange={cambiarFormulario}
                    placeholder="Ej: Llamada 15482"
                  />

                  <Campo
                    label="URL del audio"
                    name="audio_url"
                    value={form.audio_url}
                    onChange={cambiarFormulario}
                    placeholder="Pegá la URL del audio"
                  />
                </div>

                <CampoTexto
                  label="Observaciones"
                  name="observaciones"
                  value={form.observaciones}
                  onChange={cambiarFormulario}
                  placeholder="Observaciones adicionales..."
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
            <div style={styles.sectionHeader}>
              <div>
                <p style={styles.sectionEyebrow}>
                  ADMINISTRACIÓN
                </p>

                <h2 style={{ margin: 0 }}>
                  Reportes cargados
                </h2>
              </div>

              <div style={styles.printActions}>
                <button
                  onClick={seleccionarTodos}
                  style={styles.secondaryButton}
                >
                  {seleccionados.length ===
                  adminReportes.length
                    ? "Quitar selección"
                    : "Seleccionar todos"}
                </button>

                <button
                  onClick={imprimirSeleccionados}
                  style={styles.printButton}
                >
                  🖨 Imprimir seleccionados
                </button>

                <button
                  onClick={imprimirTodos}
                  style={styles.primarySmallButton}
                >
                  🖨 Imprimir todos
                </button>
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
                        <input
                          type="checkbox"
                          checked={
                            adminReportes.length > 0 &&
                            seleccionados.length ===
                              adminReportes.length
                          }
                          onChange={seleccionarTodos}
                        />
                      </th>

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
                        Acción
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {adminReportes.map((reporte) => (
                      <tr key={reporte.id}>
                        <td style={styles.td}>
                          <input
                            type="checkbox"
                            checked={seleccionados.includes(
                              reporte.id
                            )}
                            onChange={() =>
                              alternarSeleccion(
                                reporte.id
                              )
                            }
                          />
                        </td>

                        <td style={styles.td}>
                          {obtenerNombreAsesor(
                            reporte.usuario
                          )}
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
                          <button
                            onClick={() =>
                              imprimirUno(reporte)
                            }
                            style={styles.printButton}
                          >
                            🖨 Imprimir
                          </button>
                        </td>
                      </tr>
                    ))}
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
    const reporteActual = reporteActualSeguro(reportes);

    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.asesorHeader}>
            <div>
              <div style={styles.portalBadge}>
                PORTAL DE CALIDAD
              </div>

              <h1 style={styles.asesorGreeting}>
                Hola,{" "}
                {nombreSinApellidoFinal(
                  asesorActual?.[0]
                )}
              </h1>

              <p style={styles.asesorSemana}>
                {reporteActual?.semana ||
                  "Semana actual"}
              </p>
            </div>

            <div style={styles.headerRight}>
              <div style={styles.generalStatus}>
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

          <div style={styles.headerLine} />

          {cargandoReportes ? (
            <section style={styles.card}>
              <h2>Cargando información...</h2>
            </section>
          ) : reportes.length === 0 ? (
            <section style={styles.emptyAdvisor}>
              <div style={styles.emptyIcon}>✓</div>

              <h2>
                Todavía no hay un reporte cargado
              </h2>

              <p style={styles.muted}>
                Cuando Calidad cargue tu reporte
                semanal, vas a poder verlo desde
                este portal.
              </p>
            </section>
          ) : (
            <>
              <section style={styles.mainSection}>
                <SectionTitle
                  number="01"
                  title="CALIDAD"
                />

                <div style={styles.qualityTop}>
                  <div style={styles.scoreLarge}>
                    {mostrarNota100(
                      reporteActual?.nota
                    )}
                  </div>

                  <div style={styles.qualityMainInfo}>
                    <div style={styles.qualityInfoGrid}>
                      <DataCard
                        label="OBJETIVO"
                        value={
                          reporteActual?.objetivo_calidad ||
                          reporteActual?.objetivo ||
                          "-"
                        }
                      />

                      <DataCard
                        label="ESTADO"
                        value={
                          reporteActual?.estado_objetivo ||
                          "EN SEGUIMIENTO"
                        }
                      />

                      <DataCard
                        label="PRODUCTO"
                        value={
                          reporteActual?.producto || "-"
                        }
                      />

                      <DataCard
                        label="CUÁNTO FALTA"
                        value={
                          reporteActual?.cuanto_falta ||
                          calcularFaltante(
                            reporteActual?.nota,
                            reporteActual?.objetivo_calidad
                          )
                        }
                      />
                    </div>

                    <ProgressBar
                      nota={reporteActual?.nota}
                      objetivo={
                        reporteActual?.objetivo_calidad
                      }
                    />
                  </div>
                </div>

                <div style={styles.contentGrid}>
                  <InfoBlock
                    title="DESVÍO PRINCIPAL"
                    value={
                      reporteActual?.desvio ||
                      "No hay desvíos cargados."
                    }
                    type="warning"
                  />

                  <InfoBlock
                    title="COMPARATIVO SEMANAL"
                    value={
                      reporteActual?.comparativo_semanal ||
                      calcularComparativo(reportes)
                    }
                  />
                </div>

                <div style={styles.contentGrid}>
                  <ListBlock
                    title="ITEMS TRABAJADOS"
                    items={reporteActual?.items_calidad}
                  />

                  <ListBlock
                    title="ACCIONES REALIZADAS"
                    items={reporteActual?.acciones_calidad}
                  />
                </div>

                <div style={styles.contentGrid}>
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
                </div>
              </section>

              <section style={styles.mainSection}>
                <SectionTitle
                  number="02"
                  title="PRODUCTIVIDAD"
                />

                <div style={styles.productivityGrid}>
                  <Metric
                    title="SPH"
                    value={
                      reporteActual?.sph || "-"
                    }
                    extra={`Objetivo SPH: ${
                      reporteActual?.objetivo_sph ||
                      "-"
                    }`}
                  />

                  <Metric
                    title="VENTAS"
                    value={
                      reporteActual?.ventas || "-"
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
                </div>

                <div style={styles.contentGrid}>
                  <InfoBlock
                    title="ESTADO"
                    value={
                      reporteActual?.estado_campania ||
                      "-"
                    }
                  />

                  <InfoBlock
                    title="COMPARATIVO SEMANAL"
                    value={
                      reporteActual?.comparativo_productividad ||
                      "-"
                    }
                  />
                </div>

                <div style={styles.contentGrid}>
                  <ListBlock
                    title="ITEMS TRABAJADOS"
                    items={
                      reporteActual?.items_productividad
                    }
                  />

                  <ListBlock
                    title="ACCIONES REALIZADAS"
                    items={
                      reporteActual?.acciones_productividad
                    }
                  />
                </div>

                <InfoBlock
                  title="OBSERVACIONES"
                  value={
                    reporteActual?.observaciones_productividad ||
                    "No hay observaciones cargadas."
                  }
                />
              </section>

              <section style={styles.mainSection}>
                <SectionTitle
                  number="03"
                  title="TIPIFICACIONES"
                />

                <div style={styles.tipificacionHeader}>
                  <div>
                    <div style={styles.tipificacionIndicator}>
                      <span />
                      {reporteActual?.estado_tipificaciones ||
                        "EN SEGUIMIENTO"}
                    </div>
                  </div>

                  <div style={styles.tipificacionMetrics}>
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
                        reporteActual?.objetivo_tipificaciones ||
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
                </div>

                <ListBlock
                  title="TIPIFICACIONES"
                  items={
                    reporteActual?.tipificaciones
                  }
                />

                <div style={styles.contentGrid}>
                  <InfoBlock
                    title="COMPROMISO"
                    value={
                      reporteActual?.tipificacion_compromiso ||
                      "Sin compromiso cargado."
                    }
                  />

                  <InfoBlock
                    title="OBSERVACIONES"
                    value={
                      reporteActual?.tipificacion_observaciones ||
                      "Sin observaciones cargadas."
                    }
                  />
                </div>
              </section>

              <section style={styles.mainSection}>
                <SectionTitle
                  number="04"
                  title="AUDITORÍAS DE NO VENTAS"
                />

                <div style={styles.contentGrid}>
                  <DataCard
                    label="CANTIDAD"
                    value={
                      reporteActual?.auditorias_no_ventas ||
                      "-"
                    }
                  />

                  <InfoBlock
                    title="PRINCIPALES O.M."
                    value={
                      reporteActual?.principales_om ||
                      "-"
                    }
                  />
                </div>

                <div style={styles.contentGrid}>
                  <InfoBlock
                    title="COACHING"
                    value={
                      reporteActual?.coaching ||
                      "-"
                    }
                  />

                  <InfoBlock
                    title="REGISTRO EN SISTEMA"
                    value={
                      reporteActual?.registro_sistema ||
                      "-"
                    }
                  />
                </div>

                <div style={styles.contentGrid}>
                  <InfoBlock
                    title="COMPROMISO"
                    value={
                      reporteActual?.compromiso_no_ventas ||
                      "-"
                    }
                  />

                  <InfoBlock
                    title="FORTALEZAS"
                    value={
                      reporteActual?.fortalezas ||
                      "-"
                    }
                  />
                </div>

                <InfoBlock
                  title="OBSERVACIONES"
                  value={
                    reporteActual?.observaciones_no_ventas ||
                    "No hay observaciones cargadas."
                  }
                />
              </section>

              <section style={styles.feedbackSection}>
                <SectionTitle
                  number="05"
                  title="FEEDBACK DEL ASESOR"
                />

                <p style={styles.feedbackDescription}>
                  ¿Querés dejar algún comentario sobre
                  tu reporte, una consulta o algo que
                  quieras trabajar con Calidad?
                </p>

                <textarea
                  value={feedback}
                  onChange={(e) =>
                    setFeedback(e.target.value)
                  }
                  placeholder="Escribí tu feedback acá..."
                  style={styles.feedbackTextarea}
                />

                <button
                  onClick={enviarFeedback}
                  disabled={enviandoFeedback}
                  style={{
                    ...styles.primaryButton,
                    maxWidth: "220px",
                    opacity: enviandoFeedback
                      ? 0.6
                      : 1,
                  }}
                >
                  {enviandoFeedback
                    ? "ENVIANDO..."
                    : "ENVIAR FEEDBACK"}
                </button>

                {mensajeFeedback && (
                  <div
                    style={{
                      ...styles.success,
                      marginTop: "15px",
                    }}
                  >
                    {mensajeFeedback}
                  </div>
                )}
              </section>

              {reportes.length > 1 && (
                <section style={styles.historySection}>
                  <SectionTitle
                    number="06"
                    title="HISTORIAL"
                  />

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

function Campo({
  label,
  name,
  value,
  onChange,
  placeholder,
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

function CampoTexto({
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

function SectionTitle({ number, title }) {
  return (
    <div style={styles.sectionTitleWrap}>
      <span style={styles.sectionNumber}>
        {number}
      </span>

      <h2 style={styles.sectionMainTitle}>
        {title}
      </h2>
    </div>
  );
}

function DataCard({ label, value }) {
  return (
    <div style={styles.dataCard}>
      <div style={styles.dataLabel}>
        {label}
      </div>

      <div style={styles.dataValue}>
        {value || "-"}
      </div>
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

function InfoBlock({
  title,
  value,
  type = "normal",
}) {
  return (
    <div
      style={{
        ...styles.infoBlock,
        ...(type === "warning"
          ? styles.warningBlock
          : {}),
      }}
    >
      <div style={styles.infoBlockTitle}>
        {title}
      </div>

      <div style={styles.infoBlockValue}>
        {value || "-"}
      </div>
    </div>
  );
}

function ListBlock({ title, items }) {
  const lista = normalizarLista(items);

  return (
    <div style={styles.infoBlock}>
      <div style={styles.infoBlockTitle}>
        {title}
      </div>

      {lista.length === 0 ? (
        <div style={styles.emptyText}>
          No hay información cargada.
        </div>
      ) : (
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
      )}
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
        {value || "-"}
      </div>

      {extra && (
        <div style={styles.metricExtra}>
          {extra}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ nota, objetivo }) {
  const notaNumero = convertirNumero(nota);
  const objetivoNumero = convertirNumero(objetivo);

  const porcentaje =
    objetivoNumero > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (notaNumero / objetivoNumero) * 100
          )
        )
      : Math.min(100, Math.max(0, notaNumero));

  return (
    <div style={styles.progressWrapper}>
      <div style={styles.progressLabels}>
        <span>Progreso hacia el objetivo</span>
        <strong>
          {Math.round(porcentaje)}%
        </strong>
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
  );
}

function normalizarLista(items) {
  if (Array.isArray(items)) {
    return items.filter(Boolean);
  }

  if (typeof items === "string") {
    try {
      const convertido = JSON.parse(items);

      if (Array.isArray(convertido)) {
        return convertido.filter(Boolean);
      }
    } catch {
      // Continúa con texto normal.
    }

    return items
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function convertirNumero(valor) {
  if (valor === null || valor === undefined) {
    return 0;
  }

  const texto = String(valor)
    .replace("%", "")
    .replace(",", ".")
    .trim();

  const numero = parseFloat(texto);

  return Number.isNaN(numero)
    ? 0
    : numero;
}

function mostrarNota100(nota) {
  if (!nota) {
    return "-";
  }

  const texto = String(nota).trim();

  if (texto.includes("/")) {
    return texto;
  }

  if (texto.includes("%")) {
    return texto.replace("%", "") + " / 100";
  }

  return texto + " / 100";
}

function calcularFaltante(nota, objetivo) {
  const notaNumero = convertirNumero(nota);
  const objetivoNumero = convertirNumero(objetivo);

  if (!objetivoNumero) {
    return "-";
  }

  const faltante = objetivoNumero - notaNumero;

  if (faltante <= 0) {
    return "Objetivo alcanzado";
  }

  return `${faltante.toFixed(
    faltante % 1 === 0 ? 0 : 1
  )} puntos`;
}

function calcularComparativo(reportes) {
  if (!reportes || reportes.length < 2) {
    return "Todavía no hay una semana anterior para comparar.";
  }

  const actual = convertirNumero(
    reportes[0]?.nota
  );

  const anterior = convertirNumero(
    reportes[1]?.nota
  );

  const diferencia = actual - anterior;

  if (diferencia > 0) {
    return `Mejora de ${formatearNumero(
      diferencia
    )} puntos respecto de la semana anterior.`;
  }

  if (diferencia < 0) {
    return `Variación de ${formatearNumero(
      diferencia
    )} puntos respecto de la semana anterior.`;
  }

  return "Mismo resultado que la semana anterior.";
}

function formatearNumero(numero) {
  return Number.isInteger(numero)
    ? numero
    : numero.toFixed(1);
}

function reporteActualSeguro(reportes) {
  return reportes?.[0] || null;
}

function nombreSinApellidoFinal(nombreCompleto) {
  if (!nombreCompleto) {
    return "asesor/a";
  }

  const partes = nombreCompleto.split(",");

  if (partes.length > 1) {
    return partes[1].trim();
  }

  return nombreCompleto;
}

function escaparHtml(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function listaParaTexto(items) {
  const lista = normalizarLista(items);

  return lista.length
    ? lista.map((item) => `• ${item}`).join("\n")
    : "-";
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

  asesorHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "25px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },

  asesorGreeting: {
    margin: "12px 0 4px",
    fontSize: "34px",
    lineHeight: 1.1,
    color: "#172033",
  },

  asesorSemana: {
    margin: 0,
    color: "#697586",
    fontSize: "15px",
    fontWeight: "600",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  generalStatus: {
    background: "#fff8e7",
    color: "#8a5b00",
    border: "1px solid #f4d98c",
    padding: "10px 15px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
  },

  headerLine: {
    height: "1px",
    background:
      "linear-gradient(90deg, #172b4d 0%, #dfe5ec 55%, transparent 100%)",
    marginBottom: "30px",
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

  mainSection: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "22px",
    border: "1px solid #e5eaf0",
    boxShadow:
      "0 10px 35px rgba(20, 40, 80, 0.06)",
  },

  historySection: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "22px",
    border: "1px solid #e5eaf0",
  },

  feedbackSection: {
    background:
      "linear-gradient(135deg, #172b4d 0%, #294d7a 100%)",
    color: "#ffffff",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "22px",
    boxShadow:
      "0 15px 40px rgba(23, 43, 77, 0.18)",
  },

  emptyAdvisor: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "60px 30px",
    textAlign: "center",
    border: "1px solid #e5eaf0",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#ecfdf3",
    color: "#027a48",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "25px",
  },

  sectionTitleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "25px",
  },

  sectionNumber: {
    width: "35px",
    height: "35px",
    borderRadius: "10px",
    background: "#172b4d",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
  },

  sectionMainTitle: {
    margin: 0,
    fontSize: "22px",
    letterSpacing: "0.3px",
  },

  qualityTop: {
    display: "grid",
    gridTemplateColumns:
      "minmax(160px, 230px) 1fr",
    gap: "30px",
    alignItems: "center",
    marginBottom: "25px",
  },

  scoreLarge: {
    minHeight: "170px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, #172b4d 0%, #294d7a 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "900",
    textAlign: "center",
    padding: "20px",
  },

  qualityMainInfo: {
    minWidth: 0,
  },

  qualityInfoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(145px, 1fr))",
    gap: "12px",
  },

  dataCard: {
    background: "#f7f9fc",
    border: "1px solid #e3e8ef",
    borderRadius: "14px",
    padding: "16px",
  },

  dataLabel: {
    fontSize: "10px",
    color: "#697586",
    fontWeight: "800",
    letterSpacing: "0.7px",
    marginBottom: "8px",
  },

  dataValue: {
    fontSize: "17px",
    fontWeight: "800",
    color: "#172b4d",
  },

  progressWrapper: {
    marginTop: "20px",
  },

  progressLabels: {
    display: "flex",
    justifyContent: "space-between",
    color: "#697586",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  progressTrack: {
    height: "11px",
    background: "#e8edf3",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#172b4d",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },

  infoBlock: {
    background: "#f7f9fc",
    border: "1px solid #e3e8ef",
    borderRadius: "15px",
    padding: "19px",
    minHeight: "90px",
  },

  warningBlock: {
    background: "#fff8e7",
    border: "1px solid #f4d98c",
  },

  infoBlockTitle: {
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.7px",
    color: "#697586",
    marginBottom: "9px",
  },

  infoBlockValue: {
    fontSize: "14px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  emptyText: {
    color: "#697586",
    fontSize: "14px",
  },

  productivityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },

  metric: {
    background: "#f7f9fc",
    border: "1px solid #e3e8ef",
    borderRadius: "15px",
    padding: "20px",
  },

  metricTitle: {
    color: "#697586",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    marginBottom: "9px",
  },

  metricValue: {
    fontSize: "27px",
    fontWeight: "900",
    color: "#172b4d",
  },

  metricExtra: {
    marginTop: "7px",
    fontSize: "12px",
    color: "#697586",
  },

  tipificacionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    padding: "18px",
    background: "#f7f9fc",
    borderRadius: "15px",
    marginBottom: "15px",
  },

  tipificacionIndicator: {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "13px",
    fontWeight: "800",
    color: "#344054",
  },

  tipificacionMetrics: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  miniMetric: {
    minWidth: "95px",
    padding: "9px 12px",
    background: "#ffffff",
    border: "1px solid #e1e6ed",
    borderRadius: "10px",
  },

  miniLabel: {
    fontSize: "9px",
    color: "#697586",
    fontWeight: "800",
  },

  miniValue: {
    marginTop: "4px",
    fontSize: "15px",
    fontWeight: "800",
  },

  list: {
    margin: "7px 0 0",
    paddingLeft: "20px",
  },

  listItem: {
    marginBottom: "8px",
    lineHeight: 1.5,
    fontSize: "14px",
  },

  feedbackDescription: {
    color: "rgba(255,255,255,0.82)",
    lineHeight: 1.6,
    marginTop: "-10px",
  },

  feedbackTextarea: {
    width: "100%",
    minHeight: "120px",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.95)",
    color: "#172033",
    fontSize: "15px",
    resize: "vertical",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    lineHeight: 1.5,
    marginTop: "10px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "5px 18px",
  },

  adminSection: {
    background: "#f8fafc",
    border: "1px solid #e1e7ef",
    borderRadius: "16px",
    padding: "22px",
    marginTop: "25px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "20px",
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

  primarySmallButton: {
    border: "none",
    borderRadius: "11px",
    padding: "11px 15px",
    background: "#172b4d",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  printButton: {
    border: "1px solid #d5dce6",
    borderRadius: "11px",
    padding: "11px 15px",
    background: "#ffffff",
    color: "#344054",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
    whiteSpace: "nowrap",
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

  printActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
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

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
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
};
