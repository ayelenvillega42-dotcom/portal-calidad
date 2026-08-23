"use client";

import { useEffect, useMemo, useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

const ACCIONES_CALIDAD = [
  "Escucha personalizada",
  "Feedback individual",
  "Espacio de coaching",
  "Mesa de trabajo",
  "Simulación de llamada",
  "Transcripción de venta mediante Word con desvíos marcados",
  "Seguimiento diario",
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

const ACCIONES_PRODUCTIVIDAD = [
  "Simulación de llamada",
  "Acompañamiento en línea",
  "Devolución personalizada",
  "Seguimiento diario",
  "Espacio de coaching",
  "Escucha personalizada",
  "Mesa de trabajo",
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

const PRINCIPALES_OM = [
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
  "Buena escucha",
  "Seguridad comercial",
  "Buena comunicación",
  "Correcto manejo de objeciones",
];

const ESTADOS = ["ALCANZADO", "EN PROCESO", "DEBAJO DEL OBJETIVO"];

const ESTADOS_AUDITORIA = [
  "Correcta",
  "Con desvíos",
  "Requiere coaching",
  "Requiere seguimiento",
  "Sin información",
];

const REGISTROS = ["CORRECTA", "INCORRECTA", "PENDIENTE"];

function parseArray(value) {
  if (Array.isArray(value)) return value;

  if (!value) return [];

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

function csvArray(value) {
  return parseArray(value).join(", ");
}

function calculateProgress(note, objective) {
  const n = Number(note);
  const o = Number(objective);

  if (!o || Number.isNaN(n)) return 0;

  return Math.min(100, Math.round((n / o) * 100));
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

async function supabaseRequest(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Faltan las variables de Supabase.");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.message
        ? data.message
        : typeof data === "object" && data?.hint
        ? data.hint
        : text || "Error de Supabase.";

    throw new Error(message);
  }

  return data;
}

async function uploadAudio(file, asesor, semana) {
  if (!file) return "";

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Supabase no está configurado.");
  }

  const safeAdvisor = asesor
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, "_")
    .replace(/_+/g, "_");

  const safeWeek = semana
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g, "_")
    .replace(/_+/g, "_");

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "audio";

  const fileName = `${Date.now()}_${safeAdvisor}_${safeWeek}.${extension}`;

  const uploadResponse = await fetch(
    `${SUPABASE_URL}/storage/v1/object/audios/${fileName}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: SUPABASE_KEY,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
      body: file,
    }
  );

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();

    throw new Error(
      `No se pudo subir el audio. ${errorText || "Verificá el bucket audios en Supabase."}`
    );
  }

  return `${SUPABASE_URL}/storage/v1/object/public/audios/${fileName}`;
}

function MultiSelect({
  title,
  subtitle,
  options,
  value,
  onChange,
}) {
  const toggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="multiBox">
      <div className="multiHeader">
        <div>
          <div className="fieldLabel">{title}</div>
          {subtitle && <div className="fieldHint">{subtitle}</div>}
        </div>

        <span className="selectedCount">
          {value.length} seleccionada{value.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="optionsGrid">
        {options.map((option) => {
          const selected = value.includes(option);

          return (
            <button
              type="button"
              key={option}
              onClick={() => toggle(option)}
              className={cn(
                "optionButton",
                selected && "optionSelected"
              )}
            >
              <span className={cn("check", selected && "checkSelected")}>
                {selected ? "✓" : ""}
              </span>

              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="sectionHeader">
      <div className="sectionNumber">{number}</div>

      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <label className="field">
      <span className="fieldLabel">{label}</span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Seleccionar",
}) {
  return (
    <label className="field">
      <span className="fieldLabel">{label}</span>

      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="field full">
      <span className="fieldLabel">{label}</span>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

const initialForm = {
  asesor: "",
  usuario: "",
  semana: "Semana 3 - Agosto",

  nota: "",
  evolucion: "",
  objetivo: "",
  desvio: "",
  recomendacion: "",
  objetivo_calidad: "",
  estado_objetivo: "",
  producto: "AP",
  observaciones: "",

  items_calidad: [],
  acciones_calidad: [],

  auditoria: "",
  estado_auditoria: "",
  observaciones_auditoria: "",

  sph: "",
  objetivo_sph: "",
  ventas: "",
  objetivo_ventas: "",
  objetivo_campania: "",
  descripcion_campania: "",
  estado_sph: "",
  estado_ventas: "",
  estado_campania: "",

  items_productividad: [],
  acciones_productividad: [],
  observaciones_productividad: "",

  objetivo_tipificaciones: "",
  tipificaciones: [],
  estado_tipificaciones: "",
  tipificacion_desvio: "",
  tipificacion_objetivo: "",
  tipificacion_resultado: "",
  tipificacion_compromiso: "",
  tipificacion_observaciones: "",

  cantidad_no_ventas: "",
  om_detectadas: [],
  coaching_no_ventas: "",
  registro_sistema: "",
  compromiso_no_ventas: "",
  fortalezas: [],
  observaciones_no_ventas: [],

  audio_url: "",
};

export default function Page() {
  const [mode, setMode] = useState("login");
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [activeTab, setActiveTab] = useState("calidad");

  const [form, setForm] = useState(initialForm);

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [audioFile, setAudioFile] = useState(null);

  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const [loginName, setLoginName] = useState("");

  useEffect(() => {
    const savedMode = localStorage.getItem("portal_mode");
    const savedAdvisor = localStorage.getItem("portal_advisor");

    if (savedMode === "admin") {
      setMode("admin");
    }

    if (savedMode === "advisor" && savedAdvisor) {
      try {
        setSelectedAdvisor(JSON.parse(savedAdvisor));
        setMode("advisor");
      } catch {}
    }
  }, []);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const loadReports = async () => {
    setLoadingReports(true);

    try {
      const data = await supabaseRequest(
        "reportes?select=*&order=id.desc"
      );

      setReports(data || []);
    } catch (err) {
      console.error(err);
      setError(
        "No se pudo cargar el histórico. Revisá la conexión con Supabase."
      );
    } finally {
      setLoadingReports(false);
    }
  };

  const loginAdvisor = () => {
    const advisor = ASESORES.find(
      ([name]) => name.toLowerCase() === loginName.toLowerCase()
    );

    if (!advisor) {
      setError("Seleccioná un asesor válido.");
      return;
    }

    const data = {
      name: advisor[0],
      user: advisor[1],
    };

    localStorage.setItem("portal_mode", "advisor");
    localStorage.setItem("portal_advisor", JSON.stringify(data));

    setSelectedAdvisor(data);
    setMode("advisor");
    setError("");
  };

  const loginAdmin = () => {
    localStorage.setItem("portal_mode", "admin");
    localStorage.removeItem("portal_advisor");

    setMode("admin");
    setError("");

    loadReports();
  };

  const logout = () => {
    localStorage.removeItem("portal_mode");
    localStorage.removeItem("portal_advisor");

    setMode("login");
    setSelectedAdvisor(null);
    setReports([]);
    setFeedback("");
    setFeedbackSent(false);
  };

  const resetForm = () => {
    setForm(initialForm);
    setAudioFile(null);
    setMessage("");
    setError("");
  };

  const saveReport = async () => {
    setError("");
    setMessage("");

    if (!form.asesor) {
      setError("Seleccioná un asesor.");
      return;
    }

    if (!form.semana) {
      setError("Ingresá la semana o período.");
      return;
    }

    if (!form.nota) {
      setError("Ingresá la nota de calidad.");
      return;
    }

    setSaving(true);

    try {
      let audioUrl = form.audio_url || "";

      if (audioFile) {
        audioUrl = await uploadAudio(
          audioFile,
          form.asesor,
          form.semana
        );
      }

      const payload = {
        asesor: form.asesor,
        usuario: form.usuario,
        semana: form.semana,

        nota: Number(form.nota),
        evolucion: form.evolucion || null,
        objetivo: Number(form.objetivo || 0),

        desvio: form.desvio || null,
        recomendacion: form.recomendacion || null,

        auditoria: form.auditoria || null,
        producto: form.producto || null,

        observaciones: form.observaciones || null,

        sph: form.sph || null,
        objetivo_sph: form.objetivo_sph || null,
        ventas: form.ventas || null,
        objetivo_ventas: form.objetivo_ventas || null,
        objetivo_campania: form.objetivo_campania || null,
        descripcion_campania:
          form.descripcion_campania || null,

        estado_sph: form.estado_sph || null,
        estado_ventas: form.estado_ventas || null,
        estado_campania: form.estado_campania || null,

        gestion: csvArray(form.acciones_productividad),

        objetivo_calidad: Number(
          form.objetivo_calidad || form.objetivo || 0
        ),

        estado_objetivo: form.estado_objetivo || null,

        items_calidad:
          form.items_calidad.length > 0
            ? form.items_calidad
            : [],

        acciones_calidad:
          form.acciones_calidad.length > 0
            ? form.acciones_calidad
            : [],

        audio_url: audioUrl || null,

        items_productividad:
          form.items_productividad.length > 0
            ? form.items_productividad
            : [],

        acciones_productividad:
          form.acciones_productividad.length > 0
            ? form.acciones_productividad
            : [],

        objetivo_tipificaciones:
          form.objetivo_tipificaciones || null,

        tipificaciones:
          form.tipificaciones.length > 0
            ? form.tipificaciones
            : [],

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

        cantidad_no_ventas:
          form.cantidad_no_ventas || null,

        om_detectadas:
          form.om_detectadas.length > 0
            ? form.om_detectadas
            : [],

        coaching_no_ventas:
          form.coaching_no_ventas || null,

        registro_sistema:
          form.registro_sistema || null,

        compromiso_no_ventas:
          form.compromiso_no_ventas || null,

        fortalezas:
          form.fortalezas.length > 0
            ? form.fortalezas
            : [],

        observaciones_no_ventas:
          form.observaciones_no_ventas.length > 0
            ? form.observaciones_no_ventas
            : [],

        items_trabajados:
          form.items_calidad.length > 0
            ? form.items_calidad
            : [],

        acciones_realizadas:
          form.acciones_calidad.length > 0
            ? form.acciones_calidad
            : [],

        tipificacion:
          form.tipificaciones[0] || null,

        desvio_tipificacion:
          form.tipificacion_desvio || null,

        objetivo_tipificacion:
          form.tipificacion_objetivo || null,

        resultado_tipificacion:
          form.tipificacion_resultado || null,

        compromiso_tipificacion:
          form.tipificacion_compromiso || null,

        observaciones_tipificacion:
          form.tipificacion_observaciones || null,

        principales_om:
          form.om_detectadas.length > 0
            ? form.om_detectadas
            : [],
      };

      await supabaseRequest("reportes", {
        method: "POST",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      setMessage("✓ REPORTE GUARDADO CORRECTAMENTE");

      resetForm();

      await loadReports();
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "No se pudo guardar el reporte. Revisá la configuración de Supabase."
      );
    } finally {
      setSaving(false);
    }
  };

  const advisorReport = useMemo(() => {
    if (!selectedAdvisor) return null;

    return reports.find(
      (report) =>
        report.usuario === selectedAdvisor.user ||
        report.asesor === selectedAdvisor.name
    );
  }, [reports, selectedAdvisor]);

  const printReport = (report) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    const items = parseArray(report.items_calidad);
    const actions = parseArray(report.acciones_calidad);

    printWindow.document.write(`
      <html>
        <head>
          <title>Reporte de Calidad - ${report.asesor}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #173f4a;
            }

            h1 {
              margin-bottom: 4px;
            }

            h2 {
              margin-top: 28px;
              border-bottom: 2px solid #0f6473;
              padding-bottom: 8px;
            }

            .box {
              padding: 18px;
              border: 1px solid #d8e4e7;
              border-radius: 12px;
              margin-bottom: 15px;
            }

            .label {
              color: #678087;
              font-size: 12px;
              text-transform: uppercase;
              font-weight: bold;
            }

            .value {
              font-size: 18px;
              margin-top: 4px;
            }

            li {
              margin-bottom: 6px;
            }
          </style>
        </head>

        <body>
          <h1>PORTAL DE CALIDAD</h1>
          <p>${report.asesor || ""}</p>
          <p>${report.semana || ""}</p>

          <h2>CALIDAD</h2>

          <div class="box">
            <div class="label">Nota</div>
            <div class="value">${report.nota || "-"} / 100</div>
          </div>

          <div class="box">
            <div class="label">Objetivo</div>
            <div class="value">${report.objetivo || "-"}</div>
          </div>

          <div class="box">
            <div class="label">Estado</div>
            <div class="value">${report.estado_objetivo || "-"}</div>
          </div>

          <div class="box">
            <div class="label">Producto</div>
            <div class="value">${report.producto || "-"}</div>
          </div>

          <div class="box">
            <div class="label">Desvío principal</div>
            <div class="value">${report.desvio || "-"}</div>
          </div>

          <div class="box">
            <div class="label">Recomendación</div>
            <div class="value">${report.recomendacion || "-"}</div>
          </div>

          <h2>Items trabajados</h2>
          <ul>
            ${items.map((x) => `<li>${x}</li>`).join("")}
          </ul>

          <h2>Acciones realizadas</h2>
          <ul>
            ${actions.map((x) => `<li>${x}</li>`).join("")}
          </ul>

          <h2>Auditoría</h2>
          <div class="box">
            ${report.auditoria || "Sin información"}
          </div>

          <h2>Observaciones</h2>
          <div class="box">
            ${report.observaciones || "Sin observaciones"}
          </div>

          <h2>PRODUCTIVIDAD</h2>

          <div class="box">
            <div class="label">SPH</div>
            <div class="value">${report.sph || "-"}</div>
          </div>

          <div class="box">
            <div class="label">Ventas</div>
            <div class="value">${report.ventas || "-"}</div>
          </div>

          <div class="box">
            <div class="label">Objetivo de campaña</div>
            <div class="value">${report.objetivo_campania || "-"}</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (mode === "login") {
    return (
      <>
        <style>{styles}</style>

        <main className="loginPage">
          <div className="loginCard">
            <div className="brandSmall">PORTAL DE CALIDAD</div>

            <h1>Ingresar</h1>

            <p>
              Accedé para consultar o administrar los reportes
              de calidad.
            </p>

            <div className="loginOptions">
              <div className="loginBlock">
                <label className="field">
                  <span className="fieldLabel">
                    Asesor
                  </span>

                  <select
                    value={loginName}
                    onChange={(e) =>
                      setLoginName(e.target.value)
                    }
                  >
                    <option value="">
                      Seleccioná tu nombre
                    </option>

                    {ASESORES.map(([name, user]) => (
                      <option key={user} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  className="primaryButton"
                  onClick={loginAdvisor}
                >
                  INGRESAR COMO ASESOR
                </button>
              </div>

              <div className="divider">
                <span>o</span>
              </div>

              <button
                className="adminButton"
                onClick={loginAdmin}
              >
                INGRESAR COMO ADMINISTRACIÓN
              </button>
            </div>

            {error && <div className="errorBox">{error}</div>}
          </div>
        </main>
      </>
    );
  }

  if (mode === "admin") {
    return (
      <>
        <style>{styles}</style>

        <main className="page">
          <header className="topHeader">
            <div>
              <div className="brand">
                PORTAL DE CALIDAD
              </div>

              <h1>Panel de Calidad</h1>

              <p>
                Carga y gestión de reportes
              </p>
            </div>

            <button
              className="logoutButton"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </header>

          <div className="adminBadge">
            ADMINISTRACIÓN
          </div>

          <section className="adminCard">
            <div className="intro">
              <span className="eyebrow">01</span>

              <h2>Cargar nuevo reporte</h2>

              <p>
                Completá la información y el reporte
                quedará disponible para el asesor.
              </p>
            </div>

            <SectionHeader
              number="01"
              title="Datos generales"
            />

            <div className="formGrid">
              <label className="field full">
                <span className="fieldLabel">
                  Asesor
                </span>

                <select
                  value={form.asesor}
                  onChange={(e) => {
                    const selected = ASESORES.find(
                      ([name]) =>
                        name === e.target.value
                    );

                    update(
                      "asesor",
                      selected?.[0] || ""
                    );

                    update(
                      "usuario",
                      selected?.[1] || ""
                    );
                  }}
                >
                  <option value="">
                    Seleccioná un asesor
                  </option>

                  {ASESORES.map(([name, user]) => (
                    <option key={user} value={name}>
                      {name} — {user}
                    </option>
                  ))}
                </select>
              </label>

              <InputField
                label="Semana / período"
                value={form.semana}
                onChange={(v) => update("semana", v)}
              />

              <InputField
                label="Nota de calidad"
                type="number"
                value={form.nota}
                onChange={(v) => update("nota", v)}
              />

              <InputField
                label="Objetivo de calidad"
                type="number"
                value={form.objetivo}
                onChange={(v) =>
                  update("objetivo", v)
                }
              />

              <SelectField
                label="Estado del objetivo"
                value={form.estado_objetivo}
                onChange={(v) =>
                  update("estado_objetivo", v)
                }
                options={ESTADOS}
              />

              <InputField
                label="Producto"
                value={form.producto}
                onChange={(v) =>
                  update("producto", v)
                }
              />

              <InputField
                label="Desvío principal"
                value={form.desvio}
                onChange={(v) =>
                  update("desvio", v)
                }
              />

              <InputField
                label="Recomendación"
                value={form.recomendacion}
                onChange={(v) =>
                  update("recomendacion", v)
                }
              />

              <InputField
                label="Objetivo de trabajo"
                value={form.objetivo_calidad}
                onChange={(v) =>
                  update("objetivo_calidad", v)
                }
              />
            </div>

            <MultiSelect
              title="Items trabajados"
              subtitle="Seleccioná todos los que correspondan."
              options={ITEMS_CALIDAD}
              value={form.items_calidad}
              onChange={(v) =>
                update("items_calidad", v)
              }
            />

            <MultiSelect
              title="Acciones realizadas"
              subtitle="Seleccioná todas las acciones realizadas."
              options={ACCIONES_CALIDAD}
              value={form.acciones_calidad}
              onChange={(v) =>
                update("acciones_calidad", v)
              }
            />

            <div className="innerSection">
              <div className="miniTitle">
                Auditoría
              </div>

              <p className="fieldHint">
                La auditoría se mostrará dentro de
                Calidad.
              </p>

              <div className="formGrid">
                <InputField
                  label="Referencia de auditoría"
                  value={form.auditoria}
                  onChange={(v) =>
                    update("auditoria", v)
                  }
                />

                <SelectField
                  label="Estado de auditoría"
                  value={form.estado_auditoria}
                  onChange={(v) =>
                    update("estado_auditoria", v)
                  }
                  options={ESTADOS_AUDITORIA}
                />

                <TextAreaField
                  label="Observaciones de auditoría"
                  value={
                    form.observaciones_auditoria
                  }
                  onChange={(v) =>
                    update(
                      "observaciones_auditoria",
                      v
                    )
                  }
                />

                <div className="field full">
                  <span className="fieldLabel">
                    Audio de auditoría
                  </span>

                  <label className="audioUpload">
                    <span className="audioIcon">
                      ♪
                    </span>

                    <span>
                      <strong>
                        {audioFile
                          ? audioFile.name
                          : "Seleccionar audio"}
                      </strong>

                      <small>
                        MP3, WAV, M4A u otro formato
                        compatible
                      </small>
                    </span>

                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) =>
                        setAudioFile(
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <SectionHeader
              number="03"
              title="Productividad"
              subtitle="Información que verá el asesor en su tarjeta de Productividad."
            />

            <div className="formGrid">
              <InputField
                label="SPH"
                value={form.sph}
                onChange={(v) =>
                  update("sph", v)
                }
              />

              <InputField
                label="Objetivo SPH"
                value={form.objetivo_sph}
                onChange={(v) =>
                  update("objetivo_sph", v)
                }
              />

              <InputField
                label="Ventas"
                value={form.ventas}
                onChange={(v) =>
                  update("ventas", v)
                }
              />

              <InputField
                label="Objetivo ventas"
                value={form.objetivo_ventas}
                onChange={(v) =>
                  update("objetivo_ventas", v)
                }
              />

              <InputField
                label="Objetivo de campaña"
                value={form.objetivo_campania}
                onChange={(v) =>
                  update(
                    "objetivo_campania",
                    v
                  )
                }
              />

              <SelectField
                label="Estado SPH"
                value={form.estado_sph}
                onChange={(v) =>
                  update("estado_sph", v)
                }
                options={ESTADOS}
              />

              <SelectField
                label="Estado ventas"
                value={form.estado_ventas}
                onChange={(v) =>
                  update("estado_ventas", v)
                }
                options={ESTADOS}
              />

              <SelectField
                label="Estado campaña"
                value={form.estado_campania}
                onChange={(v) =>
                  update("estado_campania", v)
                }
                options={ESTADOS}
              />
            </div>

            <MultiSelect
              title="Items trabajados"
              subtitle="Seleccioná todos los items de productividad."
              options={ITEMS_PRODUCTIVIDAD}
              value={form.items_productividad}
              onChange={(v) =>
                update("items_productividad", v)
              }
            />

            <MultiSelect
              title="Acciones realizadas"
              subtitle="Seleccioná todas las acciones."
              options={ACCIONES_PRODUCTIVIDAD}
              value={form.acciones_productividad}
              onChange={(v) =>
                update(
                  "acciones_productividad",
                  v
                )
              }
            />

            <TextAreaField
              label="Observaciones de productividad"
              value={
                form.observaciones_productividad
              }
              onChange={(v) =>
                update(
                  "observaciones_productividad",
                  v
                )
              }
            />

            <SectionHeader
              number="04"
              title="Tipificaciones"
              subtitle="Seleccioná todas las tipificaciones correspondientes."
            />

            <MultiSelect
              title="Tipificaciones realizadas"
              subtitle="Podés seleccionar varias."
              options={TIPIFICACIONES}
              value={form.tipificaciones}
              onChange={(v) =>
                update("tipificaciones", v)
              }
            />

            <div className="formGrid">
              <InputField
                label="Objetivo tipificaciones"
                value={
                  form.objetivo_tipificaciones
                }
                onChange={(v) =>
                  update(
                    "objetivo_tipificaciones",
                    v
                  )
                }
              />

              <SelectField
                label="Estado tipificaciones"
                value={
                  form.estado_tipificaciones
                }
                onChange={(v) =>
                  update(
                    "estado_tipificaciones",
                    v
                  )
                }
                options={ESTADOS}
              />

              <InputField
                label="Desvío"
                value={form.tipificacion_desvio}
                onChange={(v) =>
                  update(
                    "tipificacion_desvio",
                    v
                  )
                }
              />

              <InputField
                label="Objetivo"
                value={
                  form.tipificacion_objetivo
                }
                onChange={(v) =>
                  update(
                    "tipificacion_objetivo",
                    v
                  )
                }
              />

              <InputField
                label="Resultado"
                value={
                  form.tipificacion_resultado
                }
                onChange={(v) =>
                  update(
                    "tipificacion_resultado",
                    v
                  )
                }
              />

              <InputField
                label="Compromiso"
                value={
                  form.tipificacion_compromiso
                }
                onChange={(v) =>
                  update(
                    "tipificacion_compromiso",
                    v
                  )
                }
              />

              <TextAreaField
                label="Observaciones"
                value={
                  form.tipificacion_observaciones
                }
                onChange={(v) =>
                  update(
                    "tipificacion_observaciones",
                    v
                  )
                }
              />
            </div>

            <SectionHeader
              number="05"
              title="Auditorías de no ventas"
              subtitle="Información adicional de las llamadas no convertidas."
            />

            <div className="formGrid">
              <InputField
                label="Cantidad"
                value={form.cantidad_no_ventas}
                onChange={(v) =>
                  update(
                    "cantidad_no_ventas",
                    v
                  )
                }
              />

              <InputField
                label="Coaching"
                value={
                  form.coaching_no_ventas
                }
                onChange={(v) =>
                  update(
                    "coaching_no_ventas",
                    v
                  )
                }
              />

              <SelectField
                label="Registro en sistema"
                value={form.registro_sistema}
                onChange={(v) =>
                  update(
                    "registro_sistema",
                    v
                  )
                }
                options={REGISTROS}
              />

              <InputField
                label="Compromiso"
                value={
                  form.compromiso_no_ventas
                }
                onChange={(v) =>
                  update(
                    "compromiso_no_ventas",
                    v
                  )
                }
              />
            </div>

            <MultiSelect
              title="Principales O.M."
              subtitle="Podés seleccionar varias."
              options={PRINCIPALES_OM}
              value={form.om_detectadas}
              onChange={(v) =>
                update("om_detectadas", v)
              }
            />

            <MultiSelect
              title="Fortalezas"
              subtitle="Podés seleccionar varias."
              options={FORTALEZAS}
              value={form.fortalezas}
              onChange={(v) =>
                update("fortalezas", v)
              }
            />

            <TextAreaField
              label="Observaciones"
              value={
                form.observaciones_no_ventas.join(
                  "\n"
                )
              }
              onChange={(v) =>
                update(
                  "observaciones_no_ventas",
                  v
                    .split("\n")
                    .map((x) => x.trim())
                    .filter(Boolean)
                )
              }
            />

            <TextAreaField
              label="Observaciones generales"
              value={form.observaciones}
              onChange={(v) =>
                update("observaciones", v)
              }
            />

            <div className="saveArea">
              {error && (
                <div className="errorBox">
                  {error}
                </div>
              )}

              {message && (
                <div className="successBox">
                  {message}
                </div>
              )}

              <button
                className="saveButton"
                onClick={saveReport}
                disabled={saving}
              >
                {saving
                  ? "GUARDANDO..."
                  : "GUARDAR REPORTE"}
              </button>
            </div>
          </section>

          <section className="historySection">
            <div className="historyHeader">
              <div>
                <span className="eyebrow">
                  HISTÓRICO
                </span>

                <h2>Reportes cargados</h2>
              </div>

              <button
                className="secondaryButton"
                onClick={loadReports}
              >
                {loadingReports
                  ? "Cargando..."
                  : "Actualizar"}
              </button>
            </div>

            <div className="reportTable">
              <div className="tableHeader">
                <span>Asesor</span>
                <span>Semana</span>
                <span>Nota</span>
                <span>Producto</span>
                <span></span>
              </div>

              {reports.length === 0 ? (
                <div className="emptyTable">
                  No hay reportes cargados.
                </div>
              ) : (
                reports.map((report) => (
                  <div
                    className="tableRow"
                    key={report.id}
                  >
                    <span>{report.asesor}</span>
                    <span>{report.semana}</span>
                    <strong>{report.nota}</strong>
                    <span>{report.producto}</span>

                    <button
                      className="printButton"
                      onClick={() =>
                        printReport(report)
                      }
                    >
                      Imprimir
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </>
    );
  }

  if (mode === "advisor") {
    return (
      <>
        <style>{styles}</style>

        <main className="advisorPage">
          <header className="advisorHeader">
            <div>
              <div className="brand">
                PORTAL DE CALIDAD
              </div>

              <h1>
                Hola,{" "}
                {selectedAdvisor?.name?.split(",")[1]?.trim() ||
                  selectedAdvisor?.name}
              </h1>

              <p>
                {advisorReport?.semana ||
                  "Semana 3 - Agosto"}
              </p>
            </div>

            <div className="headerRight">
              <span
                className={cn(
                  "statusPill",
                  advisorReport?.estado_objetivo ===
                    "ALCANZADO" &&
                    "statusGood"
                )}
              >
                {advisorReport?.estado_objetivo ||
                  "EN SEGUIMIENTO"}
              </span>

              <button
                className="logoutButton"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          <div className="advisorTabs">
            {[
              ["calidad", "CALIDAD"],
              ["productividad", "PRODUCTIVIDAD"],
              ["tipificaciones", "TIPIFICACIONES"],
              ["noVentas", "AUDITORÍAS"],
              ["actividades", "ACTIVIDADES"],
              ["historico", "HISTÓRICO"],
              ["feedback", "FEEDBACK"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={cn(
                  activeTab === key &&
                    "advisorTabActive"
                )}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {!advisorReport ? (
            <div className="noReport">
              <div className="noReportIcon">01</div>

              <h2>
                Todavía no hay un reporte cargado.
              </h2>

              <p>
                Cuando Calidad cargue tu reporte,
                aparecerá automáticamente acá.
              </p>
            </div>
          ) : (
            <AdvisorContent
              report={advisorReport}
              activeTab={activeTab}
              feedback={feedback}
              setFeedback={setFeedback}
              feedbackSent={feedbackSent}
              setFeedbackSent={setFeedbackSent}
            />
          )}
        </main>
      </>
    );
  }

  return null;
}

function AdvisorContent({
  report,
  activeTab,
  feedback,
  setFeedback,
  feedbackSent,
  setFeedbackSent,
}) {
  const progress = calculateProgress(
    report.nota,
    report.objetivo
  );

  const items = parseArray(
    report.items_calidad
  );

  const actions = parseArray(
    report.acciones_calidad
  );

  const productItems = parseArray(
    report.items_productividad
  );

  const productActions = parseArray(
    report.acciones_productividad
  );

  const tipificaciones = parseArray(
    report.tipificaciones
  );

  const oms = parseArray(
    report.om_detectadas
  );

  const fortalezas = parseArray(
    report.fortalezas
  );

  if (activeTab === "calidad") {
    return (
      <section className="advisorSection">
        <div className="advisorSectionTitle">
          <span>01</span>
          <h2>CALIDAD</h2>
        </div>

        <div className="qualityHero">
          <div>
            <span>NOTA</span>

            <strong>{report.nota}</strong>

            <small>/ 100</small>
          </div>

          <div>
            <span>OBJETIVO</span>
            <strong>{report.objetivo}</strong>
          </div>

          <div>
            <span>ESTADO</span>
            <strong>
              {report.estado_objetivo ||
                "EN SEGUIMIENTO"}
            </strong>
          </div>

          <div>
            <span>PRODUCTO</span>
            <strong>{report.producto}</strong>
          </div>
        </div>

        <div className="progressCard">
          <div className="progressTop">
            <span>
              Progreso hacia el objetivo
            </span>

            <strong>{progress}%</strong>
          </div>

          <div className="progressTrack">
            <div
              className="progressFill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="infoGrid">
          <InfoCard
            title="CUÁNTO FALTA PARA ALCANZAR EL OBJETIVO"
            value={`${Math.max(
              0,
              Number(report.objetivo || 0) -
                Number(report.nota || 0)
            )} puntos`}
          />

          <InfoCard
            title="DESVÍO PRINCIPAL"
            value={report.desvio || "-"}
          />

          <InfoCard
            title="COMPARATIVO SEMANAL"
            value={
              report.evolucion ||
              "Todavía no hay una semana anterior para comparar."
            }
          />
        </div>

        <ListCard
          title="ITEMS TRABAJADOS"
          items={items}
        />

        <ListCard
          title="ACCIONES REALIZADAS"
          items={actions}
        />

        <div className="advisorCard">
          <h3>AUDITORÍA</h3>

          <p>
            {report.auditoria ||
              "No hay información de auditoría."}
          </p>

          {report.audio_url && (
            <audio
              className="audioPlayer"
              controls
              src={report.audio_url}
            />
          )}
        </div>

        <div className="advisorCard">
          <h3>OBSERVACIONES</h3>

          <p>
            {report.observaciones ||
              "No hay observaciones cargadas."}
          </p>
        </div>
      </section>
    );
  }

  if (activeTab === "productividad") {
    return (
      <section className="advisorSection">
        <div className="advisorSectionTitle">
          <span>02</span>
          <h2>PRODUCTIVIDAD</h2>
        </div>

        <div className="qualityHero">
          <div>
            <span>SPH</span>
            <strong>{report.sph || "-"}</strong>
            <small>
              Objetivo {report.objetivo_sph || "-"}
            </small>
          </div>

          <div>
            <span>VENTAS</span>
            <strong>{report.ventas || "-"}</strong>
            <small>
              Objetivo {report.objetivo_ventas || "-"}
            </small>
          </div>

          <div>
            <span>OBJETIVO DE CAMPAÑA</span>
            <strong>
              {report.objetivo_campania || "-"}
            </strong>
          </div>

          <div>
            <span>ESTADO</span>
            <strong>
              {report.estado_campania ||
                "En proceso"}
            </strong>
          </div>
        </div>

        <InfoCard
          title="COMPARATIVO SEMANAL"
          value={
            report.evolucion ||
            "Todavía no hay una semana anterior para comparar."
          }
        />

        <ListCard
          title="ITEMS TRABAJADOS"
          items={productItems}
        />

        <ListCard
          title="ACCIONES REALIZADAS"
          items={productActions}
        />

        <div className="advisorCard">
          <h3>OBSERVACIONES</h3>

          <p>
            {report.observaciones_productividad ||
              "No hay observaciones cargadas."}
          </p>
        </div>
      </section>
    );
  }

  if (activeTab === "tipificaciones") {
    return (
      <section className="advisorSection">
        <div className="advisorSectionTitle">
          <span>03</span>
          <h2>TIPIFICACIONES</h2>
        </div>

        <div className="stateBanner">
          {report.estado_tipificaciones ||
            "En proceso"}
        </div>

        <div className="statsGrid">
          <InfoCard
            title="DESVÍO"
            value={
              report.tipificacion_desvio || "-"
            }
          />

          <InfoCard
            title="OBJETIVO"
            value={
              report.tipificacion_objetivo || "-"
            }
          />

          <InfoCard
            title="RESULTADO"
            value={
              report.tipificacion_resultado || "-"
            }
          />

          <InfoCard
            title="COMPROMISO"
            value={
              report.tipificacion_compromiso ||
              "SEGUIMIENTO"
            }
          />
        </div>

        <ListCard
          title="TIPIFICACIONES"
          items={tipificaciones}
        />

        <div className="advisorCard">
          <h3>OBSERVACIONES</h3>

          <p>
            {report.tipificacion_observaciones ||
              "Sin observaciones cargadas."}
          </p>
        </div>
      </section>
    );
  }

  if (activeTab === "noVentas") {
    return (
      <section className="advisorSection">
        <div className="advisorSectionTitle">
          <span>04</span>
          <h2>AUDITORÍAS DE NO VENTAS</h2>
        </div>

        <div className="statsGrid">
          <InfoCard
            title="CANTIDAD"
            value={
              report.cantidad_no_ventas || "-"
            }
          />

          <InfoCard
            title="COACHING"
            value={
              report.coaching_no_ventas || "-"
            }
          />

          <InfoCard
            title="REGISTRO EN SISTEMA"
            value={
              report.registro_sistema || "-"
            }
          />

          <InfoCard
            title="COMPROMISO"
            value={
              report.compromiso_no_ventas || "-"
            }
          />
        </div>

        <ListCard
          title="PRINCIPALES O.M."
          items={oms}
        />

        <ListCard
          title="FORTALEZAS"
          items={fortalezas}
        />

        <div className="advisorCard">
          <h3>OBSERVACIONES</h3>

          <p>
            {report.observaciones_no_ventas ||
              "No hay observaciones cargadas."}
          </p>
        </div>
      </section>
    );
  }

  if (activeTab === "actividades") {
    return (
      <section className="advisorSection">
        <div className="advisorSectionTitle">
          <span>05</span>
          <h2>ACTIVIDADES</h2>
        </div>

        <div className="emptyActivities">
          <span>+</span>

          <h3>Próximamente</h3>

          <p>
            Esta sección quedará disponible para
            registrar y consultar actividades.
          </p>
        </div>
      </section>
    );
  }

  if (activeTab === "historico") {
    return (
      <section className="advisorSection">
        <div className="advisorSectionTitle">
          <span>06</span>
          <h2>HISTÓRICO</h2>
        </div>

        <div className="advisorCard">
          <h3>EVOLUCIÓN</h3>

          <p>
            El histórico de reportes quedará
            disponible a medida que se carguen nuevas
            semanas.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="advisorSection">
      <div className="advisorSectionTitle">
        <span>07</span>
        <h2>FEEDBACK DEL ASESOR</h2>
      </div>

      <div className="feedbackCard">
        <h3>
          ¿Querés dejar algún comentario sobre tu
          reporte?
        </h3>

        <p>
          Dejanos una consulta o algo que quieras
          trabajar con Calidad.
        </p>

        <textarea
          value={feedback}
          onChange={(e) =>
            setFeedback(e.target.value)
          }
          placeholder="Escribí tu comentario acá..."
        />

        <button
          className="saveButton"
          onClick={() => {
            setFeedbackSent(true);
          }}
        >
          ENVIAR FEEDBACK
        </button>

        {feedbackSent && (
          <div className="successBox">
            ✓ FEEDBACK ENVIADO CORRECTAMENTE
          </div>
        )}
      </div>
    </section>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="infoCard">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ListCard({ title, items }) {
  return (
    <div className="advisorCard">
      <h3>{title}</h3>

      {items.length === 0 ? (
        <p>No hay información cargada.</p>
      ) : (
        <div className="tagList">
          {items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = `
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

  background: #f4f8f9;
  color: #173f4a;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.page,
.advisorPage {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at top right,
      rgba(20, 105, 119, .08),
      transparent 32%
    ),
    #f4f8f9;
}

/* =========================
   LOGIN
========================= */

.loginPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background:
    radial-gradient(
      circle at top right,
      rgba(18, 102, 116, .18),
      transparent 35%
    ),
    #f2f7f8;
}

.loginCard {
  width: min(500px, 100%);
  background: white;
  border: 1px solid #dce8eb;
  border-radius: 26px;
  padding: 42px;
  box-shadow: 0 24px 70px rgba(23, 63, 74, .10);
}

.brandSmall,
.brand {
  color: #0c6876;
  font-weight: 900;
  letter-spacing: .12em;
  font-size: 13px;
}

.loginCard h1 {
  font-size: 38px;
  margin: 12px 0 8px;
}

.loginCard p {
  color: #6a8188;
  line-height: 1.6;
}

.loginOptions {
  margin-top: 30px;
}

.loginBlock {
  display: grid;
  gap: 14px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #94a6aa;
  margin: 25px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #dce8eb;
}

.divider span {
  font-size: 12px;
}

/* =========================
   HEADERS
========================= */

.topHeader,
.advisorHeader {
  padding: 30px clamp(22px, 5vw, 70px);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 30px;
  background: white;
  border-bottom: 1px solid #dce8eb;
}

.topHeader h1,
.advisorHeader h1 {
  margin: 8px 0 3px;
  font-size: clamp(30px, 4vw, 48px);
  letter-spacing: -.04em;
}

.topHeader p,
.advisorHeader p {
  margin: 0;
  color: #71858b;
}

.logoutButton {
  border: 1px solid #d5e3e6;
  background: white;
  color: #365962;
  border-radius: 12px;
  padding: 11px 16px;
  font-weight: 700;
}

.logoutButton:hover {
  background: #edf5f6;
}

.adminBadge {
  margin: 28px auto 0;
  width: min(1250px, calc(100% - 44px));
  color: #0b6573;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .12em;
}

/* =========================
   ADMIN
========================= */

.adminCard {
  width: min(1250px, calc(100% - 44px));
  margin: 16px auto 40px;
  background: white;
  border: 1px solid #dce8eb;
  border-radius: 24px;
  padding: clamp(24px, 4vw, 46px);
  box-shadow: 0 18px 50px rgba(23, 63, 74, .06);
}

.intro {
  margin-bottom: 35px;
}

.eyebrow,
.sectionNumber {
  color: #0d7180;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .12em;
}

.intro h2 {
  font-size: 30px;
  margin: 8px 0;
}

.intro p,
.sectionHeader p {
  color: #71858b;
}

.sectionHeader {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  padding-top: 28px;
  margin-top: 30px;
  border-top: 1px solid #e3edef;
}

.sectionHeader h2 {
  margin: 0;
  font-size: 23px;
}

.sectionHeader p {
  margin: 5px 0 0;
  font-size: 14px;
}

.formGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 22px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field.full {
  grid-column: 1 / -1;
}

.fieldLabel {
  color: #45636b;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.fieldHint {
  color: #82959a;
  font-size: 12px;
  margin-top: 3px;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #cfdee1;
  background: #fbfdfe;
  color: #173f4a;
  border-radius: 12px;
  padding: 13px 14px;
  outline: none;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #0d7180;
  box-shadow: 0 0 0 3px rgba(13, 113, 128, .10);
}

textarea {
  min-height: 105px;
  resize: vertical;
}

.multiBox {
  margin-top: 24px;
  padding: 20px;
  border: 1px solid #dce8eb;
  border-radius: 16px;
  background: #f8fbfc;
}

.multiHeader {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
}

.selectedCount {
  background: #dceff1;
  color: #0b6573;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 900;
  white-space: nowrap;
}

.optionsGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin-top: 16px;
}

.optionButton {
  border: 1px solid #d6e3e6;
  background: white;
  color: #385861;
  border-radius: 11px;
  padding: 10px 12px;
  text-align: left;
  display: flex;
  gap: 9px;
  align-items: center;
  transition: .15s;
}

.optionButton:hover {
  border-color: #75aab2;
}

.optionSelected {
  background: #e9f5f6;
  border-color: #4d9ca7;
  color: #0b6573;
  font-weight: 700;
}

.check {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  border-radius: 6px;
  border: 1px solid #bfd2d6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
}

.checkSelected {
  background: #0d7180;
  color: white;
  border-color: #0d7180;
}

.innerSection {
  margin-top: 25px;
  padding: 23px;
  background: #f5fafb;
  border: 1px solid #dce8eb;
  border-radius: 17px;
}

.miniTitle {
  font-size: 18px;
  font-weight: 900;
}

.audioUpload {
  min-height: 82px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px dashed #9bbbc0;
  border-radius: 14px;
  background: white;
  position: relative;
  cursor: pointer;
}

.audioUpload:hover {
  background: #f0f8f9;
}

.audioUpload input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.audioIcon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d7180;
  color: white;
  font-size: 23px;
}

.audioUpload strong {
  display: block;
}

.audioUpload small {
  display: block;
  margin-top: 4px;
  color: #819398;
}

.saveArea {
  margin-top: 34px;
  border-top: 1px solid #e0eaec;
  padding-top: 25px;
}

.saveButton,
.primaryButton {
  width: 100%;
  border: 0;
  border-radius: 13px;
  padding: 15px 20px;
  background: #0d7180;
  color: white;
  font-weight: 900;
  letter-spacing: .04em;
  transition: .15s;
}

.saveButton:hover,
.primaryButton:hover {
  background: #095d6a;
  transform: translateY(-1px);
}

.saveButton:disabled {
  opacity: .6;
  cursor: wait;
}

.adminButton {
  width: 100%;
  padding: 14px;
  border: 1px solid #bdd2d6;
  background: white;
  color: #0b6573;
  border-radius: 13px;
  font-weight: 900;
}

.secondaryButton {
  border: 1px solid #cbdde0;
  background: white;
  color: #0b6573;
  padding: 10px 15px;
  border-radius: 11px;
  font-weight: 800;
}

.successBox,
.errorBox {
  padding: 13px 16px;
  border-radius: 12px;
  margin-bottom: 14px;
  font-size: 14px;
  font-weight: 700;
}

.successBox {
  background: #e8f6ef;
  border: 1px solid #b8dfc9;
  color: #24734c;
}

.errorBox {
  background: #fff0ef;
  border: 1px solid #f0c4bf;
  color: #a44139;
}

/* =========================
   HISTORIC
========================= */

.historySection {
  width: min(1250px, calc(100% - 44px));
  margin: 0 auto 60px;
}

.historyHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.historyHeader h2 {
  margin: 7px 0 0;
  font-size: 27px;
}

.reportTable {
  background: white;
  border: 1px solid #dce8eb;
  border-radius: 18px;
  overflow: hidden;
}

.tableHeader,
.tableRow {
  display: grid;
  grid-template-columns: 2fr 1.5fr .7fr .7fr 110px;
  gap: 15px;
  align-items: center;
  padding: 15px 18px;
}

.tableHeader {
  background: #edf5f6;
  color: #527078;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.tableRow {
  border-top: 1px solid #edf2f3;
}

.tableRow strong {
  font-size: 19px;
}

.printButton {
  border: 1px solid #c5d9dd;
  background: white;
  color: #0b6573;
  border-radius: 9px;
  padding: 8px;
  font-weight: 800;
}

.emptyTable {
  padding: 35px;
  text-align: center;
  color: #84979b;
}

/* =========================
   ADVISOR
========================= */

.headerRight {
  display: flex;
  align-items: center;
  gap: 15px;
}

.statusPill {
  padding: 10px 14px;
  background: #fff5d9;
  color: #92701a;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
}

.statusGood {
  background: #e8f6ef;
  color: #26744d;
}

.advisorTabs {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255,255,255,.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #dce8eb;
  padding: 0 clamp(15px, 5vw, 70px);
  display: flex;
  gap: 5px;
  overflow-x: auto;
}

.advisorTabs button {
  flex: 0 0 auto;
  padding: 17px 16px;
  border: 0;
  background: transparent;
  color: #71858b;
  font-weight: 900;
  font-size: 11px;
  letter-spacing: .04em;
  border-bottom: 3px solid transparent;
}

.advisorTabs button:hover {
  color: #0d7180;
}

.advisorTabActive {
  color: #0d7180 !important;
  border-bottom-color: #0d7180 !important;
}

.advisorSection {
  width: min(1150px, calc(100% - 44px));
  margin: 40px auto 70px;
}

.advisorSectionTitle {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 25px;
}

.advisorSectionTitle span {
  color: #0d7180;
  font-weight: 900;
}

.advisorSectionTitle h2 {
  margin: 0;
  font-size: 30px;
  letter-spacing: -.03em;
}

.qualityHero {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  overflow: hidden;
  background: #dce8eb;
  border: 1px solid #dce8eb;
  border-radius: 20px;
}

.qualityHero > div {
  background: white;
  padding: 27px;
}

.qualityHero span,
.infoCard span {
  display: block;
  color: #779097;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.qualityHero strong {
  display: block;
  margin-top: 8px;
  font-size: 29px;
  color: #0b6573;
}

.qualityHero small {
  display: block;
  margin-top: 5px;
  color: #7d9196;
}

.progressCard {
  background: white;
  border: 1px solid #dce8eb;
  border-radius: 17px;
  padding: 21px;
  margin-top: 17px;
}

.progressTop {
  display: flex;
  justify-content: space-between;
  color: #59747c;
  font-size: 13px;
  font-weight: 800;
}

.progressTop strong {
  color: #0d7180;
}

.progressTrack {
  height: 10px;
  background: #e3edef;
  border-radius: 99px;
  overflow: hidden;
  margin-top: 11px;
}

.progressFill {
  height: 100%;
  background: #0d7180;
  border-radius: 99px;
}

.infoGrid,
.statsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 17px;
}

.statsGrid {
  grid-template-columns: repeat(4, 1fr);
}

.infoCard {
  background: white;
  border: 1px solid #dce8eb;
  border-radius: 16px;
  padding: 21px;
}

.infoCard strong {
  display: block;
  margin-top: 9px;
  font-size: 19px;
  color: #173f4a;
}

.advisorCard {
  background: white;
  border: 1px solid #dce8eb;
  border-radius: 17px;
  padding: 23px;
  margin-top: 17px;
}

.advisorCard h3 {
  margin: 0 0 13px;
  font-size: 13px;
  color: #0d7180;
  letter-spacing: .07em;
}

.advisorCard p {
  color: #536f77;
  line-height: 1.7;
  margin: 0;
}

.tagList {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.tagList span {
  background: #edf6f7;
  color: #256572;
  border: 1px solid #d5e8eb;
  border-radius: 999px;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 700;
}

.stateBanner {
  display: inline-block;
  padding: 12px 18px;
  background: #fff5d9;
  color: #92701a;
  border-radius: 12px;
  font-weight: 900;
  margin-bottom: 17px;
}

.audioPlayer {
  width: 100%;
  margin-top: 18px;
}

.emptyActivities,
.noReport {
  background: white;
  border: 1px solid #dce8eb;
  border-radius: 22px;
  padding: 55px 30px;
  text-align: center;
}

.emptyActivities span,
.noReportIcon {
  display: inline-flex;
  width: 55px;
  height: 55px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background: #e8f4f5;
  color: #0d7180;
  font-size: 25px;
  font-weight: 900;
}

.emptyActivities h3,
.noReport h2 {
  margin: 17px 0 7px;
}

.emptyActivities p,
.noReport p {
  color: #7a8e93;
}

.feedbackCard {
  background: white;
  border: 1px solid #dce8eb;
  border-radius: 20px;
  padding: 30px;
}

.feedbackCard h3 {
  margin: 0 0 7px;
}

.feedbackCard p {
  color: #71858b;
  margin-bottom: 20px;
}

.feedbackCard textarea {
  min-height: 170px;
  margin-bottom: 15px;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 850px) {
  .formGrid,
  .optionsGrid,
  .qualityHero,
  .infoGrid,
  .statsGrid {
    grid-template-columns: 1fr;
  }

  .field.full {
    grid-column: auto;
  }

  .topHeader,
  .advisorHeader {
    flex-direction: column;
  }

  .headerRight {
    width: 100%;
    justify-content: space-between;
  }

  .tableHeader {
    display: none;
  }

  .tableRow {
    grid-template-columns: 1fr 1fr;
  }

  .tableRow .printButton {
    grid-column: 1 / -1;
  }
}

@media (max-width: 550px) {
  .adminCard,
  .historySection,
  .advisorSection {
    width: min(100% - 24px, 1250px);
  }

  .adminCard {
    padding: 20px;
  }

  .loginCard {
    padding: 28px 22px;
  }

  .headerRight {
    align-items: flex-start;
    flex-direction: column;
  }

  .logoutButton {
    width: 100%;
  }
}
`;
