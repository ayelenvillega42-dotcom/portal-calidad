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
      setLoginError(
        "El email o la contraseña no son correctos."
      );
      setEntrando(false);
      return;
    }

    const usuarioEmail = data.user?.email?.toLowerCase();

    if (usuarioEmail === ADMIN_EMAIL.toLowerCase()) {
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
            <div style={styles.logo}>✓</div>

            <h1 style={{ marginBottom: "8px" }}>
              Portal de Calidad
            </h1>

            <p style={styles.muted}>
              Ingresá con tu usuario y contraseña
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
                onChange={(e) => setEmail(e.target.value)}
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
              <h1 style={{ margin: 0 }}>
                Portal de Calidad
              </h1>

              <p style={styles.muted}>
                Bienvenido/a, {asesorActual?.[0]}
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
              <h2>Cargando información...</h2>
            </div>
          ) : reportes.length === 0 ? (
            <div style={styles.card}>
              <h2>📋 Todavía no hay reportes</h2>

              <p style={styles.muted}>
                Cuando Calidad cargue tu primer reporte
                semanal, vas a poder verlo desde acá.
              </p>
            </div>
          ) : (
            <>
              <section style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p style={styles.muted}>
                      Último reporte
                    </p>

                    <h2 style={{ margin: 0 }}>
                      {reporteActual?.semana}
                    </h2>
                  </div>

                  <div style={styles.score}>
                    {reporteActual?.nota ?? "-"}
                  </div>
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
                    title="Producto"
                    value={
                      reporteActual?.producto ?? "-"
                    }
                  />

                  <Metric
                    title="Auditoría"
                    value={
                      reporteActual?.auditoria || "-"
                    }
                  />
                </div>
              </section>

              <section style={styles.card}>
                <h2>📈 Evolución</h2>

                <p>
                  {reporteActual?.evolucion ||
                    "No hay información cargada."}
                </p>
              </section>

              <section style={styles.card}>
                <h2>🎯 Objetivo de trabajo</h2>

                <p>
                  {reporteActual?.objetivo ||
                    "No hay información cargada."}
                </p>
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

                <p>
                  {reporteActual?.recomendacion ||
                    "No hay recomendaciones cargadas."}
                </p>
              </section>

              <section style={styles.card}>
                <h2>🎧 Auditoría</h2>

                <p>
                  {reporteActual?.auditoria ||
                    "No hay información de auditoría."}
                </p>

                {reporteActual?.observaciones && (
                  <>
                    <h3>Observaciones</h3>
                    <p>
                      {reporteActual.observaciones}
                    </p>
                  </>
                )}
              </section>

              <section style={styles.card}>
                <h2>📈 Mi productividad</h2>

                <div style={styles.grid}>
                  <Metric
                    title="SPH"
                    value={reporteActual?.sph ?? "-"}
                    extra={`Objetivo: ${
                      reporteActual?.objetivo_sph ?? "-"
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
                      reporteActual?.estado_sph || "-"
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
                  <div style={{ marginTop: "25px" }}>
                    <h3>Objetivo de campaña</h3>

                    <p>
                      {reporteActual.objetivo_campania}
                    </p>

                    {reporteActual
                      .descripcion_campania && (
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

                {reporteActual?.gestion && (
                  <div style={{ marginTop: "25px" }}>
                    <h3>
                      ¿Qué se realizó durante la
                      semana?
                    </h3>

                    <p>{reporteActual.gestion}</p>
                  </div>
                )}
              </section>

              <section style={styles.card}>
                <h2>📚 Historial semanal</h2>

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
                          Nota: {reporte.nota ?? "-"}
                        </strong>
                      </div>

                      {reporte.desvio && (
                        <p
                          style={{
                            marginBottom: 0,
                            color: "#68707b",
                          }}
                        >
                          Desvío: {reporte.desvio}
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
    return <AdminPanel cerrarSesion={cerrarSesion} />;
  }

  return null;
}

function Metric({ title, value, extra }) {
  return (
    <div style={styles.metric}>
      <small>{title}</small>

      <strong
        style={{
          display: "block",
          fontSize: "24px",
          marginTop: "8px",
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

function AdminPanel({ cerrarSesion }) {
  const [asesor, setAsesor] = useState("");
  const [semana, setSemana] =
    useState("Semana 3 - Agosto");

  const [nota, setNota] = useState("");
  const [evolucion, setEvolucion] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [desvio, setDesvio] = useState("");
  const [recomendacion, setRecomendacion] =
    useState("");

  const [auditoria, setAuditoria] = useState("");
  const [producto, setProducto] = useState("AP");
  const [observaciones, setObservaciones] =
    useState("");

  const [sph, setSph] = useState("");
  const [objetivoSph, setObjetivoSph] =
    useState("");
  const [ventas, setVentas] = useState("");
  const [objetivoVentas, setObjetivoVentas] =
    useState("");
  const [objetivoCampania, setObjetivoCampania] =
    useState("");
  const [
    descripcionCampania,
    setDescripcionCampania,
  ] = useState("");

  const [estadoSph, setEstadoSph] = useState("");
  const [estadoVentas, setEstadoVentas] =
    useState("");
  const [estadoCampania, setEstadoCampania] =
    useState("");

  const [gestion, setGestion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] =
    useState(false);

  async function guardarReporte() {
    if (!asesor || !nota) {
      setMensaje(
        "Seleccioná un asesor y cargá la nota."
      );
      return;
    }

    setGuardando(true);
    setMensaje("");

    const asesorSeleccionado = asesores.find(
      ([, usuario]) => usuario === asesor
    );

    const datos = {
      asesor:
        asesorSeleccionado?.[0] || asesor,
      usuario: asesor,
      semana,
      nota: Number(nota),
      evolucion,
      objetivo,
      desvio,
      recomendacion,
      auditoria,
      producto,
      observaciones,
      sph: sph ? Number(sph) : null,
      objetivo_sph: objetivoSph
        ? Number(objetivoSph)
        : null,
      ventas: ventas ? Number(ventas) : null,
      objetivo_ventas: objetivoVentas
        ? Number(objetivoVentas)
        : null,
      objetivo_campania: objetivoCampania,
      descripcion_campania:
        descripcionCampania,
      estado_sph: estadoSph,
      estado_ventas: estadoVentas,
      estado_campania: estadoCampania,
      gestion,
    };

    const { error } = await supabase
      .from("reportes")
      .upsert(datos, {
        onConflict: "usuario,semana",
      });

    if (error) {
      console.error(error);

      setMensaje(
        "❌ No se pudo guardar el reporte."
      );

      setGuardando(false);
      return;
    }

    setMensaje(
      "✓ Reporte guardado correctamente."
    );

    setGuardando(false);
  }

  function limpiarFormulario() {
    setAsesor("");
    setSemana("Semana 3 - Agosto");
    setNota("");
    setEvolucion("");
    setObjetivo("");
    setDesvio("");
    setRecomendacion("");
    setAuditoria("");
    setProducto("AP");
    setObservaciones("");
    setSph("");
    setObjetivoSph("");
    setVentas("");
    setObjetivoVentas("");
    setObjetivoCampania("");
    setDescripcionCampania("");
    setEstadoSph("");
    setEstadoVentas("");
    setEstadoCampania("");
    setGestion("");
    setMensaje("");
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={{ margin: 0 }}>
              Portal de Calidad
            </h1>

            <p style={styles.muted}>
              Panel de Administración
            </p>
          </div>

          <button
            onClick={cerrarSesion}
            style={styles.secondaryButton}
          >
            Cerrar sesión
          </button>
        </header>

        <section style={styles.card}>
          <h2>Bienvenida, Administradora</h2>

          <p style={styles.muted}>
            Desde acá vas a poder cargar y actualizar
            la información semanal del equipo.
          </p>

          {mensaje && (
            <div
              style={{
                ...styles.message,
                background: mensaje.includes("❌")
                  ? "#fff1f1"
                  : "#eaf7ef",
              }}
            >
              {mensaje}
            </div>
          )}
        </section>

        <section style={styles.card}>
          <h2>📊 Cargar reporte de calidad</h2>

          <label>Asesor</label>

          <select
            value={asesor}
            onChange={(e) =>
              setAsesor(e.target.value)
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar asesor
            </option>

            {asesores.map(
              ([nombre, usuario]) => (
                <option
                  key={usuario}
                  value={usuario}
                >
                  {nombre} — {usuario}
                </option>
              )
            )}
          </select>

          <label>Semana</label>

          <input
            value={semana}
            onChange={(e) =>
              setSemana(e.target.value)
            }
            style={styles.input}
          />

          <label>Nota de calidad</label>

          <input
            type="number"
            min="0"
            max="100"
            value={nota}
            onChange={(e) =>
              setNota(e.target.value)
            }
            placeholder="Ejemplo: 85"
            style={styles.input}
          />

          <label>Evolución</label>

          <input
            value={evolucion}
            onChange={(e) =>
              setEvolucion(e.target.value)
            }
            style={styles.input}
          />

          <label>Objetivo</label>

          <textarea
            value={objetivo}
            onChange={(e) =>
              setObjetivo(e.target.value)
            }
            style={{
              ...styles.input,
              minHeight: "90px",
            }}
          />

          <label>Desvío principal</label>

          <input
            value={desvio}
            onChange={(e) =>
              setDesvio(e.target.value)
            }
            style={styles.input}
          />

          <label>Recomendación</label>

          <textarea
            value={recomendacion}
            onChange={(e) =>
              setRecomendacion(e.target.value)
            }
            style={{
              ...styles.input,
              minHeight: "90px",
            }}
          />

          <label>Auditoría</label>

          <input
            value={auditoria}
            onChange={(e) =>
              setAuditoria(e.target.value)
            }
            style={styles.input}
          />

          <label>Producto</label>

          <select
            value={producto}
            onChange={(e) =>
              setProducto(e.target.value)
            }
            style={styles.input}
          >
            <option>AP</option>
            <option>BM</option>
          </select>

          <label>Observaciones</label>

          <textarea
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
            style={{
              ...styles.input,
              minHeight: "100px",
            }}
          />

          <hr style={styles.hr} />

          <h2>📈 Productividad semanal</h2>

          <label>SPH</label>

          <input
            value={sph}
            onChange={(e) =>
              setSph(e.target.value)
            }
            style={styles.input}
          />

          <label>Objetivo SPH</label>

          <input
            value={objetivoSph}
            onChange={(e) =>
              setObjetivoSph(e.target.value)
            }
            style={styles.input}
          />

          <label>Ventas</label>

          <input
            value={ventas}
            onChange={(e) =>
              setVentas(e.target.value)
            }
            style={styles.input}
          />

          <label>Objetivo de ventas</label>

          <input
            value={objetivoVentas}
            onChange={(e) =>
              setObjetivoVentas(e.target.value)
            }
            style={styles.input}
          />

          <label>Objetivo de campaña</label>

          <input
            value={objetivoCampania}
            onChange={(e) =>
              setObjetivoCampania(e.target.value)
            }
            style={styles.input}
          />

          <label>
            Descripción objetivo de campaña
          </label>

          <textarea
            value={descripcionCampania}
            onChange={(e) =>
              setDescripcionCampania(e.target.value)
            }
            style={{
              ...styles.input,
              minHeight: "80px",
            }}
          />

          <label>Estado SPH</label>

          <select
            value={estadoSph}
            onChange={(e) =>
              setEstadoSph(e.target.value)
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar estado
            </option>
            <option>Cumplido</option>
            <option>Alcanzado</option>
            <option>En proceso</option>
            <option>No alcanzado</option>
          </select>

          <label>Estado ventas</label>

          <select
            value={estadoVentas}
            onChange={(e) =>
              setEstadoVentas(e.target.value)
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar estado
            </option>
            <option>Cumplido</option>
            <option>Alcanzado</option>
            <option>En proceso</option>
            <option>No alcanzado</option>
          </select>

          <label>
            Estado objetivo de campaña
          </label>

          <select
            value={estadoCampania}
            onChange={(e) =>
              setEstadoCampania(e.target.value)
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar estado
            </option>
            <option>Cumplido</option>
            <option>Alcanzado</option>
            <option>En proceso</option>
            <option>No alcanzado</option>
          </select>

          <label>
            ¿Qué se realizó durante la semana?
          </label>

          <textarea
            value={gestion}
            onChange={(e) =>
              setGestion(e.target.value)
            }
            style={{
              ...styles.input,
              minHeight: "100px",
            }}
          />

          <button
            onClick={guardarReporte}
            disabled={guardando}
            style={styles.primaryButton}
          >
            {guardando
              ? "GUARDANDO..."
              : "GUARDAR REPORTE"}
          </button>

          <button
            onClick={limpiarFormulario}
            style={{
              ...styles.secondaryButton,
              width: "100%",
              marginTop: "10px",
            }}
          >
            LIMPIAR FORMULARIO
          </button>
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
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
    borderRadius: "20px",
    padding: "35px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },

  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
  },

  header: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  logo: {
    width: "65px",
    height: "65px",
    borderRadius: "18px",
    background: "#111827",
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
    border: "1px solid #d9dce3",
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
    background: "#111827",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "11px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    background: "white",
    color: "#20242a",
    cursor: "pointer",
  },

  muted: {
    color: "#68707b",
  },

  error: {
    background: "#fff1f1",
    border: "1px solid #f0b5b5",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "18px",
    color: "#991b1b",
  },

  message: {
    border: "1px solid #b8e1c6",
    padding: "14px",
    borderRadius: "10px",
    marginTop: "15px",
  },

  warning: {
    padding: "18px",
    borderRadius: "12px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
  },

  metric: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  score: {
    width: "80px",
    height: "80px",
    borderRadius: "20px",
    background: "#111827",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "bold",
  },

  history: {
    padding: "18px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    background: "#fafafa",
  },

  hr: {
    border: 0,
    borderTop: "1px solid #eee",
    margin: "30px 0",
  },
};
