```javascript
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

  useEffect(() => {
    async function verificarSesion() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session?.user?.email) {
        if (
          session.user.email.toLowerCase() ===
          ADMIN_EMAIL.toLowerCase()
        ) {
          setModo("admin");
        } else {
          const asesor = asesores.find(
            ([, , correo]) =>
              correo.toLowerCase() ===
              session.user.email.toLowerCase()
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
      (_event, session) => {
        setSession(session);
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
      usuarioEmail ===
      ADMIN_EMAIL.toLowerCase()
    ) {
      setModo("admin");
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
    setEmail("");
    setPassword("");
    setModo("login");
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
              <label>Email</label>

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

              <label>Contraseña</label>

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

  if (modo === "asesor") {
    const reporteActual = reportes[0];

    return (
      <main style={styles.page}>
        <div style={styles.container}>

          <header style={styles.header}>
            <div>
              <div style={styles.portalBadge}>
                🏆 PORTAL DE CALIDAD
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
                📋 Todavía no hay reportes
              </h2>

              <p style={styles.muted}>
                Cuando Calidad cargue tu primer
                reporte semanal, vas a poder
                verlo desde acá.
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
                    Este es el resultado de tu
                    última evaluación.
                  </p>
                </div>

                <div style={styles.score}>
                  {reporteActual?.nota ?? "-"}
                </div>
              </section>

              <section style={styles.card}>
                <h2>📊 Mi calidad</h2>

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
                <h2>⚠️ Desvío principal</h2>

                <div style={styles.warning}>
                  <strong>
                    {reporteActual?.desvio ||
                      "No hay desvíos cargados."}
                  </strong>
                </div>
              </section>

              <section style={styles.card}>
                <h2>🛠️ Recomendación</h2>

                <div style={styles.infoBox}>
                  {reporteActual?.recomendacion ||
                    "No hay recomendaciones cargadas."}
                </div>
              </section>

              <section style={styles.card}>
                <h2>🎯 Objetivo de trabajo</h2>

                <div style={styles.infoBox}>
                  {reporteActual?.objetivo ||
                    reporteActual?.objetivo_calidad ||
                    "No hay objetivo cargado."}
                </div>
              </section>

              <section style={styles.card}>
                <h2>
                  📚 Items trabajados en Calidad
                </h2>

                <ArrayList
                  items={reporteActual?.items_calidad}
                  empty="No se registraron items de calidad."
                />
              </section>

              <section style={styles.card}>
                <h2>
                  🔧 Acciones realizadas en Calidad
                </h2>

                <ArrayList
                  items={reporteActual?.acciones_calidad}
                  empty="No se registraron acciones de calidad."
                />
              </section>

              <section style={styles.card}>
                <h2>🎧 Auditoría</h2>

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
                      🎧 Escuchar llamada auditada
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
                <h2>
                  📈 Mi productividad
                </h2>

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
                    title="Estado SPH"
                    value={
                      reporteActual?.estado_sph ||
                      "-"
                    }
                  />

                  <Metric
                    title="Estado ventas"
                    value={
                      reporteActual?.estado_ventas ||
                      "-"
                    }
                  />
                </div>

                {reporteActual?.objetivo_campania && (
                  <div style={styles.subSection}>
                    <h3>
                      🎯 Objetivo de campaña
                    </h3>

                    <p>
                      {reporteActual.objetivo_campania}
                    </p>

                    {reporteActual.descripcion_campania && (
                      <p style={styles.muted}>
                        {
                          reporteActual.descripcion_campania
                        }
                      </p>
                    )}

                    <strong>
                      Estado:{" "}
                      {reporteActual.estado_campania ||
                        "-"}
                    </strong>
                  </div>
                )}
              </section>

              <section style={styles.card}>
                <h2>
                  📚 Items trabajados en Productividad
                </h2>

                <ArrayList
                  items={
                    reporteActual?.items_productividad
                  }
                  empty="No se registraron items de productividad."
                />
              </section>

              <section style={styles.card}>
                <h2>
                  🚀 Acciones realizadas en Productividad
                </h2>

                <ArrayList
                  items={
                    reporteActual?.acciones_productividad
                  }
                  empty="No se registraron acciones de productividad."
                />
              </section>

              {reporteActual?.gestion && (
                <section style={styles.card}>
                  <h2>
                    📝 Gestión realizada durante la semana
                  </h2>

                  <div style={styles.infoBox}>
                    {reporteActual.gestion}
                  </div>
                </section>
              )}

              <section style={styles.card}>
                <h2>
                  📈 Desvíos de tipificaciones
                </h2>

                <div style={styles.grid}>
                  <Metric
                    title="Objetivo"
                    value={
                      reporteActual?.objetivo_tipificaciones ??
                      "-"
                    }
                  />

                  <Metric
                    title="Estado"
                    value={
                      reporteActual?.estado_tipificaciones ||
                      "-"
                    }
                  />
                </div>

                <h3>
                  Tipificaciones trabajadas
                </h3>

                <ArrayList
                  items={
                    reporteActual?.tipificaciones
                  }
                  empty="No se registraron tipificaciones."
                />

                {reporteActual?.tipificacion && (
                  <div style={styles.tipificacionBox}>
                    <h3>
                      Tipificación analizada
                    </h3>

                    <p>
                      <strong>
                        Tipificación:
                      </strong>{" "}
                      {reporteActual.tipificacion}
                    </p>

                    {reporteActual.tipificacion_desvio && (
                      <p>
                        <strong>
                          Desvío:
                        </strong>{" "}
                        {reporteActual.tipificacion_desvio}
                      </p>
                    )}

                    {reporteActual.tipificacion_objetivo && (
                      <p>
                        <strong>
                          Objetivo:
                        </strong>{" "}
                        {reporteActual.tipificacion_objetivo}
                      </p>
                    )}

                    {reporteActual.tipificacion_resultado && (
                      <p>
                        <strong>
                          Resultado:
                        </strong>{" "}
                        {reporteActual.tipificacion_resultado}
                      </p>
                    )}

                    {reporteActual.tipificacion_compromiso && (
                      <p>
                        <strong>
                          Compromiso:
                        </strong>{" "}
                        {reporteActual.tipificacion_compromiso}
                      </p>
                    )}

                    {reporteActual.tipificacion_observaciones && (
                      <p>
                        <strong>
                          Observaciones:
                        </strong>{" "}
                        {
                          reporteActual.tipificacion_observaciones
                        }
                      </p>
                    )}
                  </div>
                )}
              </section>

              <section style={styles.card}>
                <h2>
                  📉 Auditorías de no ventas
                </h2>

                <div style={styles.grid}>
                  <Metric
                    title="Auditorías realizadas"
                    value={
                      reporteActual?.cantidad_no_ventas ??
                      "-"
                    }
                  />

                  <Metric
                    title="Registro en sistema"
                    value={
                      reporteActual?.registro_sistema ||
                      "-"
                    }
                  />

                  <Metric
                    title="Compromiso"
                    value={
                      reporteActual?.compromiso_no_ventas ||
                      "-"
                    }
                  />
                </div>

                <h3>
                  Principales O.M. detectadas
                </h3>

                <ArrayList
                  items={
                    reporteActual?.principales_om ||
                    reporteActual?.om_detectadas
                  }
                  empty="No se registraron O.M. detectadas."
                />

                <h3>
                  Coaching brindado
                </h3>

                <ArrayList
                  items={
                    reporteActual?.coaching_no_ventas
                  }
                  empty="No se registró coaching."
                />

                <h3>
                  Fortalezas destacadas
                </h3>

                <ArrayList
                  items={
                    reporteActual?.fortalezas
                  }
                  empty="No se registraron fortalezas."
                />

                {reporteActual?.observaciones_no_ventas && (
                  <>
                    <h3>
                      Observaciones
                    </h3>

                    <div style={styles.infoBox}>
                      {
                        reporteActual.observaciones_no_ventas
                      }
                    </div>
                  </>
                )}
              </section>

              <section style={styles.card}>
                <h2>
                  📚 Historial semanal
                </h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {reportes.map((reporte) => (
                    <div
                      key={reporte.id}
                      style={styles.history}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: "15px",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong>
                          {reporte.semana}
                        </strong>

                        <strong>
                          Nota:{" "}
                          {reporte.nota ?? "-"}
                        </strong>
                      </div>

                      {reporte.desvio && (
                        <p
                          style={{
                            marginBottom: 0,
                            color: "#68707b",
                          }}
                        >
                          Desvío:{" "}
                          {reporte.desvio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    );
  }

  if (modo === "admin") {
    return (
      <main style={styles.page}>
        <div style={styles.centerBox}>
          <div style={styles.card}>
            <h2>
              Panel de Administración
            </h2>

            <p style={styles.muted}>
              Ingresá desde la sección de administración.
            </p>

            <button
              onClick={() =>
                (window.location.href = "/admin")
              }
              style={styles.primaryButton}
            >
              IR AL PANEL DE ADMINISTRACIÓN
            </button>

            <button
              onClick={cerrarSesion}
              style={{
                ...styles.secondaryButton,
                width: "100%",
                marginTop: "10px",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </main>
    );
  }

  return null;
}

function ArrayList({ items, empty }) {
  let lista = items;

  if (typeof lista === "string") {
    try {
      lista = JSON.parse(lista);
    } catch {
      lista = [lista];
    }
  }

  if (!Array.isArray(lista)) {
    lista = [];
  }

  if (lista.length === 0) {
    return (
      <p style={styles.muted}>
        {empty}
      </p>
    );
  }

  return (
    <div style={styles.tagContainer}>
      {lista.map((item, index) => (
        <div
          key={`${item}-${index}`}
          style={styles.tag}
        >
          <span style={styles.tagCheck}>
            ✓
          </span>

          <span>
            {String(item)}
          </span>
        </div>
      ))}
    </div>
  );
}

function Metric({ title, value, extra }) {
  return (
    <div style={styles.metric}>
      <small style={styles.metricTitle}>
        {title}
      </small>

      <strong
        style={{
          display: "block",
          fontSize: "24px",
          marginTop: "8px",
          color: "#312e81",
        }}
      >
        {value}
      </strong>

      {extra && (
        <small
          style={{
            display: "block",
            marginTop: "6px",
            color: "#68707b",
          }}
        >
          {extra}
        </small>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#eef2ff 0%,#f8fafc 50%,#ede9fe 100%)",
    padding: "30px 16px 70px",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    color: "#20242a",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1100px",
    margin: "auto",
  },

  centerBox: {
    maxWidth: "500px",
    margin: "100px auto",
  },

  loginContainer: {
    maxWidth: "430px",
    margin: "100px auto",
  },

  loginCard: {
    background: "white",
    borderRadius: "22px",
    padding: "35px",
    boxShadow:
      "0 15px 40px rgba(15,23,42,.10)",
  },

  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,.07)",
    border:
      "1px solid #e5e7eb",
  },

  heroCard: {
    background:
      "linear-gradient(135deg,#111827,#312e81,#4f46e5)",
    color: "white",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "20px",
    boxShadow:
      "0 15px 40px rgba(49,46,129,.20)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  heroSmall: {
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "1px",
    opacity: 0.75,
    margin: 0,
  },

  heroTitle: {
    margin: "8px 0",
    fontSize: "28px",
  },

  heroText: {
    margin: 0,
    opacity: 0.8,
  },

  header: {
    background: "white",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,.07)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  portalBadge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4338ca",
    fontSize: "12px",
    fontWeight: "bold",
  },

  logo: {
    width: "65px",
    height: "65px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg,#4f46e5,#7c3aed)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border:
      "1px solid #d9dce3",
    marginTop: "6px",
    marginBottom: "16px",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  primaryButton: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#4f46e5,#7c3aed)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "11px 18px",
    border:
      "1px solid #d1d5db",
    borderRadius: "10px",
    background: "white",
    color: "#20242a",
    cursor: "pointer",
  },

  muted: {
    color: "#68707b",
    lineHeight: 1.6,
  },

  error: {
    background: "#fff1f1",
    border:
      "1px solid #f0b5b5",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "18px",
    color: "#991b1b",
  },

  warning: {
    padding: "18px",
    borderRadius: "14px",
    background: "#fff7ed",
    border:
      "1px solid #fed7aa",
    color: "#9a3412",
  },

  infoBox: {
    padding: "17px",
    borderRadius: "14px",
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  metric: {
    padding: "20px",
    background:
      "linear-gradient(135deg,#f8fafc,#eef2ff)",
    borderRadius: "15px",
    border:
      "1px solid #e5e7eb",
  },

  metricTitle: {
    color: "#64748b",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  score: {
    width: "90px",
    height: "90px",
    borderRadius: "24px",
    background:
      "rgba(255,255,255,.15)",
    border:
      "1px solid rgba(255,255,255,.25)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
  },

  history: {
    padding: "18px",
    border:
      "1px solid #e5e7eb",
    borderRadius: "14px",
    background: "#fafafa",
  },

  subSection: {
    marginTop: "25px",
    paddingTop: "20px",
    borderTop:
      "1px solid #e5e7eb",
  },

  audioBox: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "15px",
    background: "#f8fafc",
    border:
      "1px dashed #cbd5e1",
  },

  tipificacionBox: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "15px",
    background: "#f8fafc",
    border:
      "1px solid #e2e8f0",
  },

  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "12px",
  },

  tag: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 13px",
    borderRadius: "999px",
    background: "#eef2ff",
    border:
      "1px solid #c7d2fe",
    color: "#3730a3",
    fontSize: "13px",
    fontWeight: "bold",
  },

  tagCheck: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#4f46e5",
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
  },
};
```
