"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const ADMIN_EMAIL = "admin@portalcalidad.com";

const TABS = [
  "CALIDAD",
  "PRODUCTIVIDAD",
  "TIPIFICACIONES",
  "AUDITORÍAS",
  "ACTIVIDADES",
  "HISTÓRICO",
  "FEEDBACK",
];

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function asArray(value) {
  if (Array.isArray(value)) return value;

  if (!value) return [];

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function porcentaje(valor, objetivo) {
  const v = Number(valor);
  const o = Number(objetivo);

  if (!o || Number.isNaN(v)) return 0;

  return Math.min(100, Math.max(0, Math.round((v / o) * 100)));
}

function estadoClase(estado) {
  const texto = normalize(estado);

  if (texto.includes("alcanzado")) return "success";
  if (texto.includes("debajo")) return "danger";

  return "warning";
}

function Pill({ children, type }) {
  return <span className={`pill ${type || ""}`}>{children}</span>;
}

function SectionTitle({ number, title, subtitle }) {
  return (
    <div className="sectionTitle">
      <div className="sectionNumber">{number}</div>

      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

function Metric({ label, value, small }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong className={small ? "smallMetric" : ""}>{value ?? "-"}</strong>
    </div>
  );
}

function ListBlock({ title, items }) {
  const list = asArray(items);

  return (
    <div className="listBlock">
      <h4>{title}</h4>

      {list.length ? (
        <div className="tagList">
          {list.map((item, index) => (
            <span className="tag" key={`${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <div className="emptyText">No hay información cargada.</div>
      )}
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Ingresá tu email y contraseña.");
      return;
    }

    if (!supabase) {
      setError("No está configurada la conexión con Supabase.");
      return;
    }

    setLoading(true);

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

    if (loginError || !data?.user) {
      setError("El email o la contraseña no son correctos.");
      setLoading(false);
      return;
    }

    await onLogin(data.user);
    setLoading(false);
  }

  return (
    <main className="loginPage">
      <div className="loginDecor decorOne" />
      <div className="loginDecor decorTwo" />

      <div className="loginCard">
        <div className="brandMark">PC</div>

        <div className="loginBrand">PORTAL DE CALIDAD</div>

        <h1>Ingresá a tu portal</h1>

        <p>
          Consultá tu evolución, objetivos y acciones de calidad.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Ingresá tu email"
              autoComplete="email"
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresá tu contraseña"
              autoComplete="current-password"
            />
          </label>

          {error && <div className="loginError">{error}</div>}

          <button className="primaryButton loginButton" disabled={loading}>
            {loading ? "INGRESANDO..." : "INGRESAR"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Portal({ reporte, user, onLogout }) {
  const [activeTab, setActiveTab] = useState("CALIDAD");

  const nombre = useMemo(() => {
    if (!reporte?.asesor) {
      return user?.email?.split("@")[0] || "Asesor";
    }

    return reporte.asesor;
  }, [reporte, user]);

  if (!reporte) {
    return (
      <main className="portalPage">
        <header className="topHeader">
          <div>
            <div className="brandSmall">PORTAL DE CALIDAD</div>
            <h1>Hola, {nombre}</h1>
            <p>Tu reporte de calidad</p>
          </div>

          <button className="logoutButton" onClick={onLogout}>
            Cerrar sesión
          </button>
        </header>

        <div className="noReport">
          <div className="noReportIcon">01</div>
          <h2>Todavía no hay un reporte cargado.</h2>
          <p>
            Cuando Calidad cargue tu reporte, aparecerá automáticamente acá.
          </p>
        </div>
      </main>
    );
  }

  const calidadProgress = porcentaje(
    Number(reporte.nota),
    Number(reporte.objetivo_calidad || reporte.objetivo || 70)
  );

  const objetivoCalidad =
    reporte.objetivo_calidad || reporte.objetivo || 70;

  const cuantoFalta = Math.max(
    0,
    Number(objetivoCalidad) - Number(reporte.nota || 0)
  );

  return (
    <main className="portalPage">
      <header className="topHeader">
        <div>
          <div className="brandSmall">PORTAL DE CALIDAD</div>

          <h1>Hola, {nombre}</h1>

          <div className="headerInfo">
            <span>{reporte.semana || "Semana"}</span>

            <Pill type={estadoClase(reporte.estado_objetivo)}>
              {reporte.estado_objetivo || "EN SEGUIMIENTO"}
            </Pill>
          </div>
        </div>

        <button className="logoutButton" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="content">
        {activeTab === "CALIDAD" && (
          <section className="tabContent">
            <SectionTitle
              number="01"
              title="CALIDAD"
              subtitle="Resultado y evolución de tu calidad."
            />

            <div className="heroGrid">
              <div className="scoreCard">
                <span>NOTA</span>

                <div className="score">
                  {reporte.nota ?? "-"}
                  <small>/ 100</small>
                </div>

                <div className="objectiveLine">
                  <span>OBJETIVO</span>
                  <strong>{objetivoCalidad}</strong>
                </div>

                <Pill type={estadoClase(reporte.estado_objetivo)}>
                  {reporte.estado_objetivo || "EN SEGUIMIENTO"}
                </Pill>
              </div>

              <div className="progressCard">
                <div className="progressHeader">
                  <span>PROGRESO HACIA EL OBJETIVO</span>
                  <strong>{calidadProgress}%</strong>
                </div>

                <div className="progressTrack">
                  <div
                    className="progressValue"
                    style={{ width: `${calidadProgress}%` }}
                  />
                </div>

                <div className="progressBottom">
                  <span>Producto</span>
                  <strong>{reporte.producto || "-"}</strong>
                </div>

                <div className="progressBottom">
                  <span>Cuánto falta para alcanzar el objetivo</span>
                  <strong>{cuantoFalta} puntos</strong>
                </div>
              </div>
            </div>

            <div className="infoGrid">
              <div className="infoCard highlight">
                <span>DESVÍO PRINCIPAL</span>
                <strong>{reporte.desvio || "Sin información"}</strong>
              </div>

              <div className="infoCard">
                <span>COMPARATIVO SEMANAL</span>
                <strong>
                  {reporte.evolucion ||
                    "Todavía no hay una semana anterior para comparar."}
                </strong>
              </div>
            </div>

            <div className="twoColumns">
              <ListBlock
                title="ITEMS TRABAJADOS"
                items={reporte.items_calidad}
              />

              <ListBlock
                title="ACCIONES REALIZADAS"
                items={reporte.acciones_calidad}
              />
            </div>

            <div className="auditInsideQuality">
              <div className="cardHeader">
                <div>
                  <span className="eyebrow">AUDITORÍA</span>
                  <h3>
                    {reporte.auditoria || "Sin información de auditoría"}
                  </h3>
                </div>

                {reporte.estado_auditoria && (
                  <Pill>{reporte.estado_auditoria}</Pill>
                )}
              </div>

              {reporte.audio_url && (
                <div className="audioBox">
                  <span>AUDIO DE AUDITORÍA</span>
                  <audio controls src={reporte.audio_url} />
                </div>
              )}

              <div className="observation">
                <span>OBSERVACIONES</span>
                <p>
                  {reporte.observaciones ||
                    "No hay observaciones cargadas."}
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "PRODUCTIVIDAD" && (
          <section className="tabContent">
            <SectionTitle
              number="02"
              title="PRODUCTIVIDAD"
              subtitle="Seguimiento de tus indicadores de productividad."
            />

            <div className="metricGrid">
              <Metric label="SPH" value={reporte.sph} />
              <Metric
                label="OBJETIVO SPH"
                value={reporte.objetivo_sph}
              />
              <Metric label="VENTAS" value={reporte.ventas} />
              <Metric
                label="OBJETIVO VENTAS"
                value={reporte.objetivo_ventas}
              />
              <Metric
                label="OBJETIVO DE CAMPAÑA"
                value={reporte.objetivo_campania}
              />
            </div>

            <div className="statusRow">
              <div>
                <span>ESTADO SPH</span>
                <Pill type={estadoClase(reporte.estado_sph)}>
                  {reporte.estado_sph || "En proceso"}
                </Pill>
              </div>

              <div>
                <span>ESTADO VENTAS</span>
                <Pill type={estadoClase(reporte.estado_ventas)}>
                  {reporte.estado_ventas || "En proceso"}
                </Pill>
              </div>

              <div>
                <span>ESTADO CAMPAÑA</span>
                <Pill type={estadoClase(reporte.estado_campania)}>
                  {reporte.estado_campania || "En proceso"}
                </Pill>
              </div>
            </div>

            <div className="singleCard">
              <span className="eyebrow">COMPARATIVO SEMANAL</span>
              <p>
                {reporte.evolucion ||
                  "Todavía no hay una semana anterior para comparar."}
              </p>
            </div>

            <div className="twoColumns">
              <ListBlock
                title="ITEMS TRABAJADOS"
                items={reporte.items_productividad}
              />

              <ListBlock
                title="ACCIONES REALIZADAS"
                items={reporte.acciones_productividad}
              />
            </div>

            <div className="observationCard">
              <span>OBSERVACIONES</span>
              <p>
                {reporte.observaciones_productividad ||
                  "No hay observaciones cargadas."}
              </p>
            </div>
          </section>
        )}

        {activeTab === "TIPIFICACIONES" && (
          <section className="tabContent">
            <SectionTitle
              number="03"
              title="TIPIFICACIONES"
              subtitle="Seguimiento de las tipificaciones realizadas."
            />

            <div className="tipTop">
              <Pill type={estadoClase(reporte.estado_tipificaciones)}>
                {reporte.estado_tipificaciones || "En proceso"}
              </Pill>

              <Metric
                label="DESVÍO"
                value={
                  reporte.tipificacion_desvio ??
                  reporte.desvio_tipificacion ??
                  "-"
                }
              />

              <Metric
                label="OBJETIVO"
                value={
                  reporte.tipificacion_objetivo ??
                  reporte.objetivo_tipificacion ??
                  "-"
                }
              />

              <Metric
                label="RESULTADO"
                value={
                  reporte.tipificacion_resultado ??
                  reporte.resultado_tipificacion ??
                  "-"
                }
              />
            </div>

            <ListBlock
              title="TIPIFICACIONES"
              items={reporte.tipificaciones}
            />

            <div className="singleCard">
              <span className="eyebrow">COMPROMISO</span>
              <strong>
                {reporte.tipificacion_compromiso ||
                  reporte.compromiso_tipificacion ||
                  "-"}
              </strong>
            </div>

            <div className="observationCard">
              <span>OBSERVACIONES</span>
              <p>
                {reporte.tipificacion_observaciones ||
                  reporte.observaciones_tipificacion ||
                  "Sin observaciones cargadas."}
              </p>
            </div>
          </section>
        )}

        {activeTab === "AUDITORÍAS" && (
          <section className="tabContent">
            <SectionTitle
              number="04"
              title="AUDITORÍAS DE NO VENTAS"
              subtitle="Seguimiento de las llamadas no convertidas."
            />

            <div className="metricGrid">
              <Metric
                label="CANTIDAD"
                value={reporte.cantidad_no_ventas}
              />

              <Metric
                label="COACHING"
                value={reporte.coaching_no_ventas}
              />

              <Metric
                label="REGISTRO EN SISTEMA"
                value={reporte.registro_sistema}
              />

              <Metric
                label="COMPROMISO"
                value={reporte.compromiso_no_ventas}
              />
            </div>

            <div className="twoColumns">
              <ListBlock
                title="PRINCIPALES O.M."
                items={
                  reporte.om_detectadas ||
                  reporte.principales_om
                }
              />

              <ListBlock
                title="FORTALEZAS"
                items={reporte.fortalezas}
              />
            </div>

            <div className="observationCard">
              <span>OBSERVACIONES</span>
              <p>
                {reporte.observaciones_no_ventas ||
                  "No hay observaciones cargadas."}
              </p>
            </div>
          </section>
        )}

        {activeTab === "ACTIVIDADES" && (
          <section className="tabContent">
            <SectionTitle
              number="05"
              title="ACTIVIDADES"
              subtitle="Espacio destinado a registrar y consultar actividades."
            />

            <div className="comingSoon">
              <div className="plusCircle">+</div>
              <h3>Próximamente</h3>
              <p>
                Esta sección quedará disponible para registrar y consultar
                actividades.
              </p>
            </div>
          </section>
        )}

        {activeTab === "HISTÓRICO" && (
          <section className="tabContent">
            <SectionTitle
              number="06"
              title="HISTÓRICO"
              subtitle="Evolución de tus reportes."
            />

            <div className="comingSoon">
              <div className="historyIcon">↗</div>
              <h3>Histórico</h3>
              <p>
                Acá podrás consultar la evolución de tus reportes
                semanales.
              </p>
            </div>
          </section>
        )}

        {activeTab === "FEEDBACK" && (
          <section className="tabContent">
            <SectionTitle
              number="07"
              title="FEEDBACK DEL ASESOR"
              subtitle="Tu espacio para comunicarte con Calidad."
            />

            <div className="feedbackCard">
              <h3>¿Querés dejar algún comentario?</h3>

              <p>
                Dejá una consulta, comentario o algo que quieras trabajar
                con Calidad.
              </p>

              <textarea
                placeholder="Escribí tu comentario..."
                rows={7}
              />

              <button className="primaryButton">
                ENVIAR FEEDBACK
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default function Page() {
  const [session, setSession] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  async function cargarReporte(user) {
    if (!supabase || !user) return null;

    const email = normalize(user.email);

    if (email === normalize(ADMIN_EMAIL)) {
      return null;
    }

    const { data, error } = await supabase
      .from("reportes")
      .select("*")
      .eq("usuario", email)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error cargando reporte:", error);
      return null;
    }

    return data;
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(currentSession);

      if (currentSession?.user) {
        const data = await cargarReporte(currentSession.user);

        if (mounted) {
          setReporte(data);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase
      ? supabase.auth.onAuthStateChange(async (_event, newSession) => {
          if (!mounted) return;

          setSession(newSession);

          if (newSession?.user) {
            const data = await cargarReporte(newSession.user);

            if (mounted) {
              setReporte(data);
            }
          } else {
            setReporte(null);
          }
        })
      : { data: { subscription: null } };

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function handleLogin() {
    if (!supabase) return;

    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    setSession(currentSession);

    if (currentSession?.user) {
      const data = await cargarReporte(currentSession.user);
      setReporte(data);
    }
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setSession(null);
    setReporte(null);
  }

  if (loading) {
    return (
      <main className="loadingPage">
        <div className="loader" />
        <p>Cargando Portal de Calidad...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Styles />
      </>
    );
  }

  return (
    <>
      <Portal
        reporte={reporte}
        user={session.user}
        onLogout={handleLogout}
      />
      <Styles />
    </>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      :root {
        --petroleo: #0d4f5c;
        --petroleo-dark: #083b45;
        --petroleo-light: #e8f3f4;
        --aqua: #2a7f89;
        --cream: #f5f7f6;
        --white: #ffffff;
        --text: #17343a;
        --muted: #6f8589;
        --border: #dce8e9;
        --success: #26765c;
        --success-bg: #e6f4ee;
        --warning: #a86f17;
        --warning-bg: #fff4df;
        --danger: #a94747;
        --danger-bg: #fceaea;
        --shadow: 0 18px 50px rgba(13, 79, 92, 0.09);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
        background: var(--cream);
        color: var(--text);
      }

      button,
      input,
      textarea {
        font: inherit;
      }

      button {
        cursor: pointer;
      }

      .loginPage {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px;
        background:
          radial-gradient(
            circle at 15% 20%,
            rgba(42, 127, 137, 0.12),
            transparent 30%
          ),
          linear-gradient(135deg, #f4f8f8, #eaf2f2);
        position: relative;
        overflow: hidden;
      }

      .loginDecor {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
      }

      .decorOne {
        width: 360px;
        height: 360px;
        right: -130px;
        top: -100px;
        background: rgba(13, 79, 92, 0.08);
      }

      .decorTwo {
        width: 250px;
        height: 250px;
        left: -100px;
        bottom: -80px;
        background: rgba(42, 127, 137, 0.08);
      }

      .loginCard {
        width: min(450px, 100%);
        background: var(--white);
        border-radius: 28px;
        padding: 42px;
        box-shadow: var(--shadow);
        border: 1px solid rgba(13, 79, 92, 0.08);
        position: relative;
        z-index: 2;
      }

      .brandMark {
        width: 52px;
        height: 52px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--petroleo);
        color: white;
        font-size: 17px;
        font-weight: 900;
        letter-spacing: -0.5px;
        margin-bottom: 20px;
      }

      .loginBrand,
      .brandSmall {
        color: var(--petroleo);
        font-weight: 900;
        letter-spacing: 1.5px;
        font-size: 12px;
      }

      .loginCard h1 {
        margin: 12px 0 8px;
        font-size: 34px;
        line-height: 1.1;
        color: var(--petroleo-dark);
      }

      .loginCard > p {
        margin: 0 0 30px;
        color: var(--muted);
        line-height: 1.6;
      }

      label {
        display: block;
        margin-bottom: 18px;
        color: var(--petroleo-dark);
        font-weight: 800;
        font-size: 13px;
      }

      input,
      textarea {
        width: 100%;
        margin-top: 8px;
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 14px 15px;
        outline: none;
        background: #fbfdfd;
        color: var(--text);
        transition: 0.2s ease;
      }

      input:focus,
      textarea:focus {
        border-color: var(--aqua);
        box-shadow: 0 0 0 4px rgba(42, 127, 137, 0.1);
      }

      .loginError {
        background: var(--danger-bg);
        color: var(--danger);
        border: 1px solid rgba(169, 71, 71, 0.15);
        border-radius: 10px;
        padding: 12px 14px;
        margin: 5px 0 15px;
        font-size: 13px;
        font-weight: 700;
      }

      .primaryButton {
        border: 0;
        background: var(--petroleo);
        color: white;
        border-radius: 12px;
        padding: 14px 20px;
        font-weight: 900;
        letter-spacing: 0.5px;
        transition: 0.2s ease;
      }

      .primaryButton:hover {
        background: var(--petroleo-dark);
        transform: translateY(-1px);
      }

      .primaryButton:disabled {
        opacity: 0.6;
        cursor: wait;
      }

      .loginButton {
        width: 100%;
        margin-top: 5px;
      }

      .portalPage {
        min-height: 100vh;
        background: var(--cream);
      }

      .topHeader {
        background: white;
        padding: 35px max(25px, calc((100vw - 1180px) / 2));
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 25px;
        border-bottom: 1px solid var(--border);
      }

      .topHeader h1 {
        margin: 8px 0 5px;
        font-size: clamp(28px, 4vw, 42px);
        color: var(--petroleo-dark);
        letter-spacing: -1.2px;
      }

      .topHeader p {
        margin: 0;
        color: var(--muted);
      }

      .headerInfo {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 12px;
        color: var(--muted);
        font-size: 14px;
        font-weight: 700;
      }

      .logoutButton {
        background: white;
        border: 1px solid var(--border);
        color: var(--petroleo);
        border-radius: 10px;
        padding: 11px 15px;
        font-weight: 800;
      }

      .tabs {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: center;
        gap: 5px;
        padding: 8px 15px;
        overflow-x: auto;
      }

      .tab {
        border: 0;
        background: transparent;
        color: var(--muted);
        padding: 13px 15px;
        border-radius: 9px;
        font-weight: 900;
        font-size: 11px;
        letter-spacing: 0.4px;
        white-space: nowrap;
      }

      .tab:hover {
        color: var(--petroleo);
        background: var(--petroleo-light);
      }

      .tab.active {
        color: white;
        background: var(--petroleo);
      }

      .content {
        width: min(1180px, calc(100% - 36px));
        margin: 0 auto;
        padding: 35px 0 70px;
      }

      .tabContent {
        animation: appear 0.2s ease;
      }

      @keyframes appear {
        from {
          opacity: 0;
          transform: translateY(5px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .sectionTitle {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 28px;
      }

      .sectionNumber {
        width: 44px;
        height: 44px;
        border-radius: 13px;
        background: var(--petroleo);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
      }

      .sectionTitle h2 {
        margin: 0;
        color: var(--petroleo-dark);
        font-size: 26px;
      }

      .sectionTitle p {
        margin: 4px 0 0;
        color: var(--muted);
        font-size: 13px;
      }

      .heroGrid {
        display: grid;
        grid-template-columns: 0.8fr 1.2fr;
        gap: 18px;
      }

      .scoreCard,
      .progressCard,
      .infoCard,
      .listBlock,
      .auditInsideQuality,
      .singleCard,
      .observationCard,
      .feedbackCard,
      .comingSoon {
        background: white;
        border: 1px solid var(--border);
        border-radius: 18px;
        box-shadow: 0 8px 30px rgba(13, 79, 92, 0.045);
      }

      .scoreCard {
        padding: 28px;
      }

      .scoreCard > span,
      .infoCard > span,
      .metric > span,
      .progressHeader span,
      .progressBottom span,
      .observation span,
      .observationCard > span,
      .listBlock h4,
      .eyebrow {
        font-size: 10px;
        letter-spacing: 1px;
        font-weight: 900;
        color: var(--muted);
      }

      .score {
        font-size: 62px;
        line-height: 1;
        font-weight: 950;
        color: var(--petroleo);
        margin: 12px 0 20px;
      }

      .score small {
        font-size: 17px;
        color: var(--muted);
        font-weight: 800;
      }

      .objectiveLine {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid var(--border);
        padding-top: 15px;
        margin-bottom: 18px;
      }

      .objectiveLine span {
        font-size: 11px;
        color: var(--muted);
        font-weight: 900;
      }

      .objectiveLine strong {
        color: var(--petroleo-dark);
      }

      .pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        padding: 7px 11px;
        background: var(--warning-bg);
        color: var(--warning);
        font-size: 10px;
        font-weight: 900;
      }

      .pill.success {
        background: var(--success-bg);
        color: var(--success);
      }

      .pill.danger {
        background: var(--danger-bg);
        color: var(--danger);
      }

      .progressCard {
        padding: 28px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .progressHeader {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        align-items: center;
      }

      .progressHeader strong {
        font-size: 22px;
        color: var(--petroleo);
      }

      .progressTrack {
        height: 12px;
        background: #e6eeee;
        border-radius: 999px;
        overflow: hidden;
        margin: 17px 0 25px;
      }

      .progressValue {
        height: 100%;
        background: var(--aqua);
        border-radius: inherit;
      }

      .progressBottom {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        padding: 10px 0;
        border-top: 1px solid var(--border);
      }

      .progressBottom strong {
        color: var(--petroleo-dark);
      }

      .infoGrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        margin-top: 18px;
      }

      .infoCard {
        padding: 22px;
      }

      .infoCard strong {
        display: block;
        margin-top: 9px;
        font-size: 16px;
        color: var(--petroleo-dark);
        line-height: 1.45;
      }

      .infoCard.highlight {
        border-left: 5px solid var(--aqua);
      }

      .twoColumns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        margin-top: 18px;
      }

      .listBlock {
        padding: 22px;
      }

      .listBlock h4 {
        margin: 0 0 15px;
      }

      .tagList {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .tag {
        background: var(--petroleo-light);
        color: var(--petroleo-dark);
        padding: 9px 11px;
        border-radius: 9px;
        font-size: 12px;
        font-weight: 750;
      }

      .emptyText {
        color: var(--muted);
        font-size: 13px;
      }

      .auditInsideQuality {
        margin-top: 18px;
        padding: 24px;
      }

      .cardHeader {
        display: flex;
        justify-content: space-between;
        gap: 15px;
        align-items: center;
      }

      .cardHeader h3 {
        margin: 6px 0 0;
        color: var(--petroleo-dark);
      }

      .audioBox {
        margin-top: 20px;
        padding: 16px;
        background: var(--petroleo-light);
        border-radius: 12px;
      }

      .audioBox span {
        display: block;
        margin-bottom: 10px;
        font-size: 10px;
        font-weight: 900;
        color: var(--petroleo);
      }

      audio {
        width: 100%;
      }

      .observation {
        margin-top: 20px;
        border-top: 1px solid var(--border);
        padding-top: 18px;
      }

      .observation p,
      .observationCard p,
      .singleCard p {
        margin: 8px 0 0;
        color: var(--text);
        line-height: 1.6;
      }

      .metricGrid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 14px;
      }

      .metric {
        background: white;
        border: 1px solid var(--border);
        border-radius: 15px;
        padding: 20px;
      }

      .metric strong {
        display: block;
        margin-top: 10px;
        font-size: 28px;
        color: var(--petroleo);
      }

      .smallMetric {
        font-size: 18px !important;
      }

      .statusRow {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin-top: 18px;
      }

      .statusRow > div {
        background: white;
        border: 1px solid var(--border);
        border-radius: 15px;
        padding: 18px;
      }

      .statusRow span {
        display: block;
        margin-bottom: 10px;
        font-size: 10px;
        font-weight: 900;
        color: var(--muted);
      }

      .singleCard,
      .observationCard {
        padding: 22px;
        margin-top: 18px;
      }

      .singleCard strong {
        display: block;
        margin-top: 8px;
        color: var(--petroleo-dark);
      }

      .tipTop {
        display: grid;
        grid-template-columns: 1fr repeat(3, 1fr);
        gap: 14px;
        align-items: stretch;
      }

      .tipTop > .pill {
        min-height: 90px;
        border-radius: 15px;
      }

      .comingSoon {
        padding: 70px 30px;
        text-align: center;
      }

      .plusCircle,
      .historyIcon {
        width: 60px;
        height: 60px;
        border-radius: 18px;
        margin: 0 auto 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--petroleo-light);
        color: var(--petroleo);
        font-size: 28px;
        font-weight: 900;
      }

      .comingSoon h3 {
        margin: 0 0 8px;
        color: var(--petroleo-dark);
      }

      .comingSoon p {
        margin: 0;
        color: var(--muted);
      }

      .feedbackCard {
        padding: 30px;
        max-width: 850px;
      }

      .feedbackCard h3 {
        margin: 0 0 8px;
        color: var(--petroleo-dark);
        font-size: 23px;
      }

      .feedbackCard p {
        color: var(--muted);
        margin-bottom: 20px;
      }

      .feedbackCard .primaryButton {
        margin-top: 15px;
      }

      .noReport {
        width: min(800px, calc(100% - 36px));
        margin: 55px auto;
        background: white;
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 55px;
        text-align: center;
        box-shadow: var(--shadow);
      }

      .noReportIcon {
        width: 52px;
        height: 52px;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        background: var(--petroleo-light);
        color: var(--petroleo);
        font-weight: 900;
      }

      .noReport h2 {
        color: var(--petroleo-dark);
        margin: 0 0 10px;
      }

      .noReport p {
        color: var(--muted);
        margin: 0;
      }

      .loadingPage {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
        color: var(--muted);
      }

      .loader {
        width: 38px;
        height: 38px;
        border: 4px solid #dce8e9;
        border-top-color: var(--petroleo);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 900px) {
        .heroGrid,
        .infoGrid,
        .twoColumns {
          grid-template-columns: 1fr;
        }

        .metricGrid {
          grid-template-columns: repeat(2, 1fr);
        }

        .tipTop {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 650px) {
        .loginCard {
          padding: 30px 22px;
        }

        .topHeader {
          padding: 25px 18px;
        }

        .topHeader {
          flex-direction: column;
        }

        .content {
          width: min(100% - 24px, 1180px);
          padding-top: 25px;
        }

        .metricGrid,
        .statusRow,
        .tipTop {
          grid-template-columns: 1fr;
        }

        .score {
          font-size: 52px;
        }
      }
    `}</style>
  );
}
