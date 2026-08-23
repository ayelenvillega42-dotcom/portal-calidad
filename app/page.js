"use client";

import { useEffect, useMemo, useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ASESORES = [
  ["Acosta, Pamela", "8134"],
  ["Aguilera, Trinidad", "8196"],
  ["Bahamonde, Camila", "8135"],
  ["Bustamante, Ailin", "8188"],
  ["Bustos, Jesica", "8141"],
  ["Bustos, Nicolas", "8214"],
  ["Cabrera, Antonella", "8187"],
  ["Contreras, Gilary", "8046"],
  ["Cordoba, Tania", "8202"],
  ["Diaz, Milagros", "8212"],
  ["Gomez, Carla", "8126"],
  ["Luna, Oriana", "8097"],
  ["Malqui, Xiomara", "8092"],
  ["Mercado, Chiara", "8209"],
  ["Ojeda, Luana", "8200"],
  ["Olmedo, Thomas", "8192"],
  ["Peralta, Belen", "8207"],
  ["Reartes, Maia", "8201"],
  ["Rojek, Luna", "8213"],
  ["Simonetta, Valentina", "8191"],
  ["Tello, Marianela", "8042"],
  ["Vasquez, Agustin", "8136"],
  ["Viniegra, Agustín", "8199"],
];

const CLAVES = {
  "8134": "8134",
  "8196": "8196",
  "8135": "8135",
  "8188": "8188",
  "8141": "8141",
  "8214": "8214",
  "8187": "8187",
  "8046": "8046",
  "8202": "8202",
  "8212": "8212",
  "8126": "8126",
  "8097": "8097",
  "8092": "8092",
  "8209": "8209",
  "8200": "8200",
  "8192": "8192",
  "8207": "8207",
  "8201": "8201",
  "8213": "8213",
  "8191": "8191",
  "8042": "8042",
  "8136": "8136",
  "8199": "8199",
};

const TABS = [
  ["calidad", "01", "CALIDAD"],
  ["productividad", "02", "PRODUCTIVIDAD"],
  ["tipificaciones", "03", "TIPIFICACIONES"],
  ["auditorias", "04", "AUDITORÍAS"],
  ["actividades", "05", "ACTIVIDADES"],
  ["historico", "06", "HISTÓRICO"],
  ["feedback", "07", "FEEDBACK"],
];

const ITEMS_CALIDAD = [
  "Información de otras compañías",
  "Presentación HS",
  "Validación de datos",
  "Cláusula de aceptación",
  "Información",
  "Preexistencia",
  "Negociación",
  "Precio",
  "Suscripción",
];

const ITEMS_PRODUCTIVIDAD = [
  "Cierre con seguridad comercial",
  "Ofrecimiento",
  "Rebate comercial",
  "Rebate asertivo",
  "Generación de interés",
  "Escucha activa",
  "Venta consultiva",
  "Venta conversacional",
  "Cambio de apertura",
];

const TIPIFICACIONES = [
  "No conforme con sumas aseguradas",
  "No interesado - Producto",
  "No interesado - No informa motivo",
  "Problemas económicos",
  "No interesado - Precio",
  "No interesado - Beneficios",
  "No interesado - Cobertura",
  "Cliente solicita información",
  "Cliente ya posee cobertura",
  "Otro motivo",
];

const OM = [
  "Generación de interés",
  "Cambio de apertura",
  "Escucha activa",
  "Venta consultiva",
  "Venta conversacional",
  "Rebate comercial",
  "Rebate asertivo",
  "Manejo de objeciones",
  "Cierre",
  "Presentación del producto",
];

const FORTALEZAS = [
  "Adaptabilidad",
  "Buena detección de necesidad",
  "Claridad en explicación",
  "Buen manejo de silencios",
  "Correcta contención",
  "Seguridad comercial",
  "Buena comunicación",
  "Correcto manejo de objeciones",
];

const ACCIONES_CALIDAD = [
  "Escucha personalizada",
  "Feedback individual",
  "Espacio de coaching",
  "Mesa de trabajo",
  "Simulación de llamada",
  "Transcripción de venta mediante Word con desvíos marcados",
  "Seguimiento diario",
];

const ACCIONES_PRODUCTIVIDAD = [
  "Simulación de llamada",
  "Acompañamiento en línea",
  "Devolución personalizada",
  "Seguimiento diario",
  "Espacio de coaching",
  "Escucha personalizada",
  "Mesa de trabajo",
];

function parseArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(value)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }
}

function displayName(fullName) {
  return String(fullName || "")
    .replace(",", "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value).replace(".", ",");
}

function progress(note, objective) {
  const n = Number(note);
  const o = Number(objective);

  if (!Number.isFinite(n) || !Number.isFinite(o) || o <= 0) return 0;

  return Math.min(100, Math.max(0, Math.round((n / o) * 100)));
}

function getStateClass(state) {
  const value = String(state || "").toUpperCase();

  if (value.includes("ALCANZ")) return "success";
  if (value.includes("DEBAJO")) return "danger";
  return "warning";
}

export default function Page() {
  const [screen, setScreen] = useState("login");
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("calidad");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("portal_asesor");

    if (saved) {
      const advisor = ASESORES.find((item) => item[1] === saved);

      if (advisor) {
        setSelectedAdvisor(advisor[1]);
        setScreen("portal");
      }
    }
  }, []);

  useEffect(() => {
    if (screen === "portal" && selectedAdvisor) {
      loadReports(selectedAdvisor);
    }
  }, [screen, selectedAdvisor]);

  async function loadReports(usuario) {
    setLoading(true);

    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        setReport(null);
        setHistory([]);
        return;
      }

      const url =
        `${SUPABASE_URL}/rest/v1/reportes` +
        `?usuario=eq.${encodeURIComponent(usuario)}` +
        `&order=id.desc`;

      const response = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo consultar Supabase");
      }

      const data = await response.json();

      setHistory(data || []);
      setReport(data && data.length ? data[0] : null);
    } catch (error) {
      console.error(error);
      setReport(null);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  function login() {
    setLoginError("");

    if (!selectedAdvisor) {
      setLoginError("Seleccioná tu usuario.");
      return;
    }

    if (!password.trim()) {
      setLoginError("Ingresá tu clave.");
      return;
    }

    if (CLAVES[selectedAdvisor] !== password.trim()) {
      setLoginError("La clave ingresada no es correcta.");
      return;
    }

    localStorage.setItem("portal_asesor", selectedAdvisor);
    setScreen("portal");
  }

  function logout() {
    localStorage.removeItem("portal_asesor");
    setSelectedAdvisor("");
    setPassword("");
    setReport(null);
    setHistory([]);
    setActiveTab("calidad");
    setScreen("login");
  }

  const advisor = useMemo(
    () => ASESORES.find((item) => item[1] === selectedAdvisor),
    [selectedAdvisor]
  );

  const advisorName = advisor ? displayName(advisor[0]) : "";

  async function sendFeedback() {
    if (!feedback.trim()) return;

    setFeedbackSent(false);

    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        setFeedbackSent(true);
        return;
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          usuario: selectedAdvisor,
          asesor: advisor?.[0] || "",
          feedback: feedback.trim(),
          creado_en: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar");
      }

      setFeedback("");
      setFeedbackSent(true);
    } catch (error) {
      console.error(error);
      setFeedbackSent(true);
    }
  }

  if (screen === "login") {
    return (
      <main style={styles.loginPage}>
        <div style={styles.loginCard}>
          <div style={styles.logoMark}>PC</div>

          <div style={styles.loginEyebrow}>PORTAL DE CALIDAD</div>

          <h1 style={styles.loginTitle}>Ingresá a tu portal</h1>

          <p style={styles.loginText}>
            Consultá tu evolución, objetivos y acciones de calidad.
          </p>

          <label style={styles.label}>Asesor</label>

          <select
            value={selectedAdvisor}
            onChange={(e) => setSelectedAdvisor(e.target.value)}
            style={styles.input}
          >
            <option value="">Seleccioná tu nombre</option>

            {ASESORES.map(([name, id]) => (
              <option key={id} value={id}>
                {displayName(name)}
              </option>
            ))}
          </select>

          <label style={styles.label}>Clave</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
            placeholder="Ingresá tu clave"
            style={styles.input}
          />

          {loginError && <div style={styles.loginError}>{loginError}</div>}

          <button onClick={login} style={styles.primaryButton}>
            INGRESAR
          </button>

          <div style={styles.loginFooter}>
            Calidad · Seguimiento · Evolución
          </div>
        </div>
      </main>
    );
  }

  const note = report?.nota;
  const objective = report?.objetivo_calidad || report?.objetivo || 70;
  const qualityProgress = progress(note, objective);
  const state = report?.estado_objetivo || "EN SEGUIMIENTO";

  return (
    <main style={styles.page}>
      <div style={styles.topGlow} />

      <header style={styles.header}>
        <div>
          <div style={styles.brand}>PORTAL DE CALIDAD</div>

          <h1 style={styles.greeting}>
            Hola, <strong>{advisorName}</strong>
          </h1>

          <div style={styles.week}>
            {report?.semana || "Semana actual"}
          </div>
        </div>

        <div style={styles.headerRight}>
          <div
            style={{
              ...styles.statusPill,
              ...statusStyles(state),
            }}
          >
            {state}
          </div>

          <button onClick={logout} style={styles.logoutButton}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <nav style={styles.tabs}>
        {TABS.map(([key, number, title]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              ...styles.tab,
              ...(activeTab === key ? styles.tabActive : {}),
            }}
          >
            <span style={styles.tabNumber}>{number}</span>
            <span>{title}</span>
          </button>
        ))}
      </nav>

      <div style={styles.divider} />

      {loading ? (
        <section style={styles.loadingBox}>Cargando tu reporte...</section>
      ) : !report ? (
        <section style={styles.emptyBox}>
          <div style={styles.emptyIcon}>01</div>
          <h2>Todavía no hay un reporte cargado.</h2>
          <p>
            Cuando Calidad cargue tu reporte, aparecerá automáticamente acá.
          </p>
        </section>
      ) : (
        <div style={styles.content}>
          {activeTab === "calidad" && (
            <section>
              <SectionHeader number="01" title="CALIDAD" />

              <div style={styles.heroGrid}>
                <div style={styles.noteCard}>
                  <span style={styles.miniLabel}>NOTA</span>

                  <div style={styles.noteValue}>
                    {formatNumber(report.nota)}
                    <small>/ 100</small>
                  </div>

                  <div style={styles.objectiveLine}>
                    OBJETIVO <strong>{formatNumber(objective)}</strong>
                  </div>
                </div>

                <div style={styles.infoCard}>
                  <InfoRow
                    label="ESTADO"
                    value={state}
                    badge
                    state={state}
                  />

                  <InfoRow
                    label="PRODUCTO"
                    value={report.producto || "AP"}
                  />

                  <InfoRow
                    label="CUÁNTO FALTA PARA ALCANZAR EL OBJETIVO"
                    value={
                      Number.isFinite(Number(report.nota)) &&
                      Number.isFinite(Number(objective))
                        ? `${Math.max(
                            0,
                            Number(objective) - Number(report.nota)
                          )} puntos`
                        : "-"
                    }
                  />
                </div>
              </div>

              <div style={styles.progressCard}>
                <div style={styles.progressTop}>
                  <span>Progreso hacia el objetivo</span>
                  <strong>{qualityProgress}%</strong>
                </div>

                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${qualityProgress}%`,
                    }}
                  />
                </div>
              </div>

              <div style={styles.twoColumns}>
                <InfoBlock
                  title="DESVÍO PRINCIPAL"
                  text={report.desvio || "No hay información cargada."}
                />

                <InfoBlock
                  title="COMPARATIVO SEMANAL"
                  text={
                    report.evolucion ||
                    "Todavía no hay una semana anterior para comparar."
                  }
                />
              </div>

              <MultiValueBlock
                title="ITEMS TRABAJADOS"
                items={parseArray(report.items_calidad)}
              />

              <MultiValueBlock
                title="ACCIONES REALIZADAS"
                items={parseArray(report.acciones_calidad)}
              />

              <div style={styles.card}>
                <div style={styles.cardTitle}>AUDITORÍA</div>

                <div style={styles.auditGrid}>
                  <InfoRow
                    label="ESTADO DE AUDITORÍA"
                    value={report.auditoria || "Sin información"}
                    badge
                  />

                  <InfoRow
                    label="REFERENCIA"
                    value={
                      report.referencia_auditoria || "Sin información de auditoría."
                    }
                  />
                </div>

                {report.observaciones && (
                  <div style={styles.observation}>
                    <span>OBSERVACIONES</span>
                    <p>{report.observaciones}</p>
                  </div>
                )}

                {report.audio_url && (
                  <div style={styles.audioBox}>
                    <div style={styles.audioTitle}>AUDIO DE AUDITORÍA</div>
                    <audio controls src={report.audio_url} />
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === "productividad" && (
            <section>
              <SectionHeader number="02" title="PRODUCTIVIDAD" />

              <div style={styles.metricsGrid}>
                <Metric
                  label="SPH"
                  value={formatNumber(report.sph)}
                  extra={`Objetivo SPH: ${formatNumber(report.objetivo_sph)}`}
                />

                <Metric
                  label="VENTAS"
                  value={formatNumber(report.ventas)}
                  extra={`Objetivo ventas: ${formatNumber(
                    report.objetivo_ventas
                  )}`}
                />

                <Metric
                  label="OBJETIVO DE CAMPAÑA"
                  value={formatNumber(report.objetivo_campania)}
                  extra={report.descripcion_campania || "En proceso"}
                />
              </div>

              <div style={styles.card}>
                <InfoRow
                  label="ESTADO"
                  value={report.estado_campania || "En proceso"}
                  badge
                  state={report.estado_campania}
                />
              </div>

              <div style={styles.twoColumns}>
                <InfoBlock
                  title="COMPARATIVO SEMANAL"
                  text={
                    report.evolucion ||
                    "Todavía no hay una semana anterior para comparar."
                  }
                />

                <InfoBlock
                  title="OBSERVACIONES"
                  text={
                    report.observaciones_productividad ||
                    "No hay observaciones cargadas."
                  }
                />
              </div>

              <MultiValueBlock
                title="ITEMS TRABAJADOS"
                items={parseArray(report.items_productividad)}
              />

              <MultiValueBlock
                title="ACCIONES REALIZADAS"
                items={parseArray(report.acciones_productividad)}
              />
            </section>
          )}

          {activeTab === "tipificaciones" && (
            <section>
              <SectionHeader number="03" title="TIPIFICACIONES" />

              <div style={styles.tipHero}>
                <div>
                  <span style={styles.miniLabel}>ESTADO</span>
                  <h2>
                    {report.estado_tipificaciones || "En proceso"}
                  </h2>
                </div>

                <div>
                  <span style={styles.miniLabel}>DESVÍO</span>
                  <strong>{formatNumber(report.tipificacion_desvio)}</strong>
                </div>

                <div>
                  <span style={styles.miniLabel}>OBJETIVO</span>
                  <strong>{formatNumber(report.tipificacion_objetivo)}</strong>
                </div>

                <div>
                  <span style={styles.miniLabel}>RESULTADO</span>
                  <strong>{formatNumber(report.tipificacion_resultado)}</strong>
                </div>
              </div>

              <MultiValueBlock
                title="TIPIFICACIONES"
                items={parseArray(report.tipificaciones)}
              />

              <InfoBlock
                title="COMPROMISO"
                text={report.tipificacion_compromiso || "SEGUIMIENTO"}
              />

              <InfoBlock
                title="OBSERVACIONES"
                text={
                  report.tipificacion_observaciones ||
                  "Sin observaciones cargadas."
                }
              />
            </section>
          )}

          {activeTab === "auditorias" && (
            <section>
              <SectionHeader number="04" title="AUDITORÍAS DE NO VENTAS" />

              <div style={styles.metricsGrid}>
                <Metric
                  label="CANTIDAD"
                  value={formatNumber(report.cantidad_no_ventas)}
                />

                <Metric
                  label="COACHING"
                  value={report.coaching_no_ventas || "-"}
                />

                <Metric
                  label="REGISTRO EN SISTEMA"
                  value={report.registro_sistema || "-"}
                />
              </div>

              <InfoBlock
                title="COMPROMISO"
                text={report.compromiso_no_ventas || "-"}
              />

              <MultiValueBlock
                title="PRINCIPALES O.M."
                items={parseArray(report.om_detectadas)}
              />

              <MultiValueBlock
                title="FORTALEZAS"
                items={parseArray(report.fortalezas)}
              />

              <InfoBlock
                title="OBSERVACIONES"
                text={
                  report.observaciones_no_ventas ||
                  "No hay observaciones cargadas."
                }
              />
            </section>
          )}

          {activeTab === "actividades" && (
            <section>
              <SectionHeader number="05" title="ACTIVIDADES" />

              <div style={styles.comingSoon}>
                <div style={styles.plus}>+</div>
                <h2>Próximamente</h2>
                <p>
                  Esta sección quedará disponible para registrar y consultar
                  actividades.
                </p>
              </div>
            </section>
          )}

          {activeTab === "historico" && (
            <section>
              <SectionHeader number="06" title="HISTÓRICO" />

              {history.length === 0 ? (
                <div style={styles.emptyBox}>
                  <h2>No hay reportes históricos.</h2>
                  <p>Cuando se carguen nuevos reportes aparecerán acá.</p>
                </div>
              ) : (
                <div style={styles.historyGrid}>
                  {history.map((item) => (
                    <div key={item.id} style={styles.historyCard}>
                      <div style={styles.historyWeek}>
                        {item.semana || "Sin período"}
                      </div>

                      <div style={styles.historyScore}>
                        {formatNumber(item.nota)}
                        <small>/100</small>
                      </div>

                      <div style={styles.historyProduct}>
                        {item.producto || "AP"}
                      </div>

                      <div
                        style={{
                          ...styles.statusPill,
                          ...statusStyles(item.estado_objetivo),
                        }}
                      >
                        {item.estado_objetivo || "EN SEGUIMIENTO"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "feedback" && (
            <section>
              <SectionHeader number="07" title="FEEDBACK DEL ASESOR" />

              <div style={styles.feedbackCard}>
                <h2>Tu opinión también forma parte del seguimiento.</h2>

                <p>
                  ¿Querés dejar algún comentario sobre tu reporte, una consulta
                  o algo que quieras trabajar con Calidad?
                </p>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Escribí acá tu comentario..."
                  style={styles.textarea}
                />

                <button
                  onClick={sendFeedback}
                  style={styles.primaryButton}
                  disabled={!feedback.trim()}
                >
                  ENVIAR FEEDBACK
                </button>

                {feedbackSent && (
                  <div style={styles.feedbackSuccess}>
                    Feedback enviado correctamente.
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}

function SectionHeader({ number, title }) {
  return (
    <div style={styles.sectionHeader}>
      <div style={styles.sectionNumber}>{number}</div>

      <div>
        <div style={styles.sectionEyebrow}>SEGUIMIENTO SEMANAL</div>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function InfoRow({ label, value, badge, state }) {
  return (
    <div style={styles.infoRow}>
      <span>{label}</span>

      {badge ? (
        <strong
          style={{
            ...styles.inlineBadge,
            ...statusStyles(state || value),
          }}
        >
          {value || "-"}
        </strong>
      ) : (
        <strong>{value || "-"}</strong>
      )}
    </div>
  );
}

function InfoBlock({ title, text }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{title}</div>
      <p style={styles.cardText}>{text || "-"}</p>
    </div>
  );
}

function MultiValueBlock({ title, items }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{title}</div>

      {items && items.length ? (
        <div style={styles.chips}>
          {items.map((item, index) => (
            <span key={`${item}-${index}`} style={styles.chip}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p style={styles.cardText}>No hay información cargada.</p>
      )}
    </div>
  );
}

function Metric({ label, value, extra }) {
  return (
    <div style={styles.metricCard}>
      <span style={styles.miniLabel}>{label}</span>
      <strong>{value}</strong>

      {extra && <small>{extra}</small>}
    </div>
  );
}

function statusStyles(value) {
  const state = String(value || "").toUpperCase();

  if (state.includes("ALCANZ")) {
    return {
      background: "#e5f4ef",
      color: "#087f68",
      borderColor: "#b9e2d6",
    };
  }

  if (state.includes("DEBAJO")) {
    return {
      background: "#fcebea",
      color: "#a53d3d",
      borderColor: "#efc3c0",
    };
  }

  return {
    background: "#fff3dc",
    color: "#9a6a18",
    borderColor: "#efd8a4",
  };
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7f7",
    color: "#17383b",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  topGlow: {
    position: "absolute",
    top: "-180px",
    right: "-160px",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "rgba(28, 105, 109, 0.08)",
    pointerEvents: "none",
  },

  header: {
    position: "relative",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "42px 28px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "30px",
  },

  brand: {
    color: "#0b6b70",
    fontSize: "13px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "10px",
  },

  greeting: {
    margin: 0,
    fontSize: "38px",
    lineHeight: 1.1,
    letterSpacing: "-1.2px",
    color: "#15383b",
  },

  week: {
    marginTop: "10px",
    color: "#6b7f80",
    fontSize: "15px",
    fontWeight: "600",
  },

  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "12px",
  },

  statusPill: {
    border: "1px solid",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "0.6px",
    whiteSpace: "nowrap",
  },

  logoutButton: {
    border: "none",
    background: "transparent",
    color: "#6b7f80",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  tabs: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "0 28px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  tab: {
    border: "1px solid #d5e2e2",
    background: "#ffffff",
    color: "#607778",
    borderRadius: "12px",
    padding: "11px 14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "0.3px",
  },

  tabActive: {
    background: "#0b6b70",
    borderColor: "#0b6b70",
    color: "#ffffff",
    boxShadow: "0 8px 20px rgba(11, 107, 112, 0.18)",
  },

  tabNumber: {
    opacity: 0.7,
    fontSize: "10px",
  },

  divider: {
    maxWidth: "1180px",
    margin: "24px auto 0",
    borderTop: "1px solid #d9e5e5",
  },

  content: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "36px 28px 70px",
    position: "relative",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    marginBottom: "28px",
  },

  sectionNumber: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "#0b6b70",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "13px",
    boxShadow: "0 8px 20px rgba(11, 107, 112, 0.18)",
  },

  sectionEyebrow: {
    color: "#6b7f80",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.4px",
    marginBottom: "4px",
  },

  sectionHeaderH2: {},

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: "18px",
    marginBottom: "18px",
  },

  noteCard: {
    background: "#0b6b70",
    color: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    minHeight: "190px",
    boxShadow: "0 14px 35px rgba(11, 107, 112, 0.18)",
  },

  miniLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.5px",
    color: "#719092",
    marginBottom: "9px",
  },

  noteCardMini: {},

  noteValue: {
    fontSize: "58px",
    lineHeight: 1,
    fontWeight: "900",
    letterSpacing: "-3px",
    margin: "14px 0 20px",
  },

  noteValueSmall: {},

  objectiveLine: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.6px",
    opacity: 0.8,
  },

  infoCard: {
    background: "#ffffff",
    border: "1px solid #dce7e7",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 8px 25px rgba(22, 56, 59, 0.05)",
  },

  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "14px 0",
    borderBottom: "1px solid #edf2f2",
  },

  inlineBadge: {
    border: "1px solid",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "10px",
    fontWeight: "900",
  },

  progressCard: {
    background: "#ffffff",
    border: "1px solid #dce7e7",
    borderRadius: "18px",
    padding: "20px 22px",
    marginBottom: "18px",
  },

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    fontWeight: "800",
    color: "#557071",
    marginBottom: "12px",
  },

  progressTrack: {
    height: "9px",
    background: "#e6eeee",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#0b6b70",
    borderRadius: "999px",
    transition: "width 0.4s ease",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "18px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #dce7e7",
    borderRadius: "18px",
    padding: "22px",
    marginBottom: "18px",
    boxShadow: "0 7px 22px rgba(22, 56, 59, 0.04)",
  },

  cardTitle: {
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.4px",
    color: "#0b6b70",
    marginBottom: "12px",
  },

  cardText: {
    margin: 0,
    color: "#536b6c",
    fontSize: "14px",
    lineHeight: 1.65,
  },

  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "9px",
  },

  chip: {
    background: "#edf6f5",
    color: "#225e61",
    border: "1px solid #d5e9e7",
    padding: "9px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "700",
  },

  auditGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 25px",
  },

  observation: {
    marginTop: "18px",
    paddingTop: "18px",
    borderTop: "1px solid #edf2f2",
  },

  observationSpan: {},

  observation: {
    marginTop: "18px",
    paddingTop: "18px",
    borderTop: "1px solid #edf2f2",
  },

  observation: {
    marginTop: "18px",
    paddingTop: "18px",
    borderTop: "1px solid #edf2f2",
  },

  audioBox: {
    marginTop: "18px",
    paddingTop: "18px",
    borderTop: "1px solid #edf2f2",
  },

  audioTitle: {
    color: "#0b6b70",
    fontSize: "10px",
    fontWeight: "900",
    letterSpacing: "1.4px",
    marginBottom: "10px",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
    marginBottom: "18px",
  },

  metricCard: {
    background: "#ffffff",
    border: "1px solid #dce7e7",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 7px 22px rgba(22, 56, 59, 0.04)",
  },

  metricCardStrong: {},

  metricCardValue: {},

  metricCardExtra: {},

  metricCard: {
    background: "#ffffff",
    border: "1px solid #dce7e7",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 7px 22px rgba(22, 56, 59, 0.04)",
    display: "flex",
    flexDirection: "column",
  },

  tipHero: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
    gap: "14px",
    marginBottom: "18px",
  },

  tipHero: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
    gap: "14px",
    marginBottom: "18px",
  },

  comingSoon: {
    background: "#ffffff",
    border: "1px solid #dce7e7",
    borderRadius: "22px",
    padding: "70px 30px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(22, 56, 59, 0.04)",
  },

  plus: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "#edf6f5",
    color: "#0b6b70",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
    fontSize: "30px",
    fontWeight: "400",
  },

  comingSoonH2: {},

  historyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },

  historyCard: {
    background: "#ffffff",
    border: "1px solid #dce7e7",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 7px 22px rgba(22, 56, 59, 0.04)",
  },

  historyWeek: {
    color: "#6b7f80",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "12px",
  },

  historyScore: {
    fontSize: "42px",
    fontWeight: "900",
    color: "#0b6b70",
    letterSpacing: "-2px",
  },

  historyScoreSmall: {},

  historyProduct: {
    fontSize: "12px",
    fontWeight: "800",
    margin: "8px 0 15px",
  },

  feedbackCard: {
    background: "#ffffff",
    border: "1px solid #dce7e7",
    borderRadius: "22px",
    padding: "30px",
    boxShadow: "0 8px 25px rgba(22, 56, 59, 0.04)",
  },

  textarea: {
    width: "100%",
    minHeight: "170px",
    resize: "vertical",
    border: "1px solid #cfdddd",
    borderRadius: "14px",
    padding: "15px",
    margin: "20px 0",
    fontFamily: "inherit",
    fontSize: "14px",
    color: "#17383b",
    outline: "none",
    boxSizing: "border-box",
  },

  primaryButton: {
    border: "none",
    background: "#0b6b70",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "13px 20px",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.7px",
    cursor: "pointer",
  },

  feedbackSuccess: {
    marginTop: "15px",
    background: "#e5f4ef",
    color: "#087f68",
    border: "1px solid #b9e2d6",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "12px",
    fontWeight: "800",
  },

  emptyBox: {
    maxWidth: "1180px",
    margin: "50px auto",
    padding: "55px 28px",
    background: "#ffffff",
    border: "1px solid #dce7e7",
    borderRadius: "22px",
    textAlign: "center",
    color: "#5c7273",
  },

  emptyIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#edf6f5",
    color: "#0b6b70",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontWeight: "900",
  },

  loadingBox: {
    maxWidth: "1180px",
    margin: "50px auto",
    padding: "50px",
    textAlign: "center",
    color: "#5c7273",
  },

  loginPage: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eaf3f2 0%, #f7faf9 48%, #dceceb 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "25px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  loginCard: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    border: "1px solid #d8e5e4",
    borderRadius: "28px",
    padding: "42px",
    boxShadow: "0 25px 70px rgba(23, 56, 59, 0.13)",
    boxSizing: "border-box",
  },

  logoMark: {
    width: "54px",
    height: "54px",
    borderRadius: "16px",
    background: "#0b6b70",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "900",
    marginBottom: "25px",
    boxShadow: "0 10px 25px rgba(11, 107, 112, 0.2)",
  },

  loginEyebrow: {
    color: "#0b6b70",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "2px",
    marginBottom: "9px",
  },

  loginTitle: {
    margin: 0,
    color: "#17383b",
    fontSize: "32px",
    letterSpacing: "-1px",
  },

  loginText: {
    color: "#6b7f80",
    fontSize: "14px",
    lineHeight: 1.6,
    margin: "10px 0 28px",
  },

  label: {
    display: "block",
    color: "#3e5b5d",
    fontSize: "12px",
    fontWeight: "800",
    marginBottom: "7px",
    marginTop: "16px",
  },

  input: {
    width: "100%",
    height: "48px",
    border: "1px solid #cfdddd",
    borderRadius: "12px",
    background: "#fbfdfd",
    color: "#17383b",
    padding: "0 13px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  loginError: {
    marginTop: "12px",
    background: "#fcebea",
    border: "1px solid #efc3c0",
    color: "#a53d3d",
    borderRadius: "10px",
    padding: "11px 13px",
    fontSize: "12px",
    fontWeight: "700",
  },

  loginCardPrimary: {},

  loginFooter: {
    textAlign: "center",
    marginTop: "22px",
    color: "#9aabab",
    fontSize: "11px",
  },
};
