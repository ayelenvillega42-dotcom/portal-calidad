"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const ASESORES = [
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

const ADMIN_EMAIL = "estecalidadbhseguros@proximo.cc";
const ADMIN_PASSWORD = "admin123";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

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

const OM = [
  "Generación de interés",
  "Cambio apertura",
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

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

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

function statusClass(status) {
  const s = String(status || "").toUpperCase();

  if (s.includes("ALCANZ")) return "statusGreen";
  if (s.includes("DEBAJO")) return "statusRed";
  return "statusYellow";
}

function MultiSelect({ title, options, selected, setSelected }) {
  const toggle = (option) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((x) => x !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="fieldGroup">
      <label>{title}</label>

      <div className="multiGrid">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={`multiOption ${
              selected.includes(option) ? "selected" : ""
            }`}
            onClick={() => toggle(option)}
          >
            <span>{selected.includes(option) ? "✓" : ""}</span>
            {option}
          </button>
        ))}
      </div>

      <div className="selectedCount">
        {selected.length} seleccionada{selected.length === 1 ? "" : "s"}
      </div>
    </div>
  );
}

function SelectField({ label, value, setValue, options }) {
  return (
    <div className="fieldGroup">
      <label>{label}</label>

      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="">Seleccionar</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  label,
  value,
  setValue,
  type = "text",
  placeholder = "",
}) {
  return (
    <div className="fieldGroup">
      <label>{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function TextArea({ label, value, setValue, placeholder = "" }) {
  return (
    <div className="fieldGroup full">
      <label>{label}</label>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export default function Page() {
  const [screen, setScreen] = useState("login");
  const [loginType, setLoginType] = useState("advisor");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [advisor, setAdvisor] = useState(null);
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const [activeTab, setActiveTab] = useState("calidad");
  const [feedback, setFeedback] = useState("");

  const [form, setForm] = useState({
    asesor: "",
    usuario: "",
    semana: "",
    nota: "",
    objetivo: "",
    estadoObjetivo: "",
    producto: "AP",
    desvio: "",
    recomendacion: "",
    objetivoTrabajo: "",
    observaciones: "",

    itemsCalidad: [],
    accionesCalidad: [],

    auditoriaEstado: "",
    auditoriaObservaciones: "",

    sph: "",
    objetivoSph: "",
    ventas: "",
    objetivoVentas: "",
    objetivoCampania: "",
    descripcionCampania: "",
    estadoSph: "",
    estadoVentas: "",
    estadoCampania: "",
    observacionesProductividad: "",
    itemsProductividad: [],
    accionesProductividad: [],

    objetivoTipificaciones: "",
    tipificaciones: [],
    estadoTipificaciones: "",
    tipificacionDesvio: "",
    tipificacionObjetivo: "",
    tipificacionResultado: "",
    tipificacionCompromiso: "",
    tipificacionObservaciones: "",

    cantidadNoVentas: "",
    omDetectadas: [],
    coachingNoVentas: "",
    registroSistema: "",
    compromisoNoVentas: "",
    fortalezas: [],
    observacionesNoVentas: "",

    audioFile: null,
    observacionesGenerales: "",
  });

  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function loadAdvisorReport(foundAdvisor) {
    setLoadingReport(true);
    setReport(null);

    if (!supabase) {
      setLoginError(
        "No está configurada la conexión con Supabase. Revisá las variables de Vercel."
      );
      setLoadingReport(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("reportes")
        .select("*")
        .eq("usuario", foundAdvisor[2])
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        console.error(error);
        setReport(null);
        return;
      }

      if (data && data.length > 0) {
        setReport(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingReport(false);
    }
  }

  async function loginAdvisor() {
    setLoginError("");

    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !password) {
      setLoginError("Ingresá tu mail y tu clave.");
      return;
    }

    if (!supabase) {
      setLoginError(
        "No está configurada la conexión con Supabase. Revisá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel."
      );
      return;
    }

    setLoginLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        console.error(error);
        setLoginError("El mail o la clave son incorrectos.");
        return;
      }

      const userEmail = normalizeEmail(data?.user?.email || cleanEmail);

      const found = ASESORES.find(
        (item) => normalizeEmail(item[2]) === userEmail
      );

      if (!found) {
        await supabase.auth.signOut();
        setLoginError(
          "El usuario ingresó correctamente, pero no está asociado a un asesor del portal."
        );
        return;
      }

      setAdvisor(found);
      setScreen("advisor");
      setActiveTab("calidad");

      await loadAdvisorReport(found);
    } catch (error) {
      console.error(error);
      setLoginError("No se pudo iniciar sesión. Intentá nuevamente.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function loginAdmin() {
    setAdminError("");

    if (
      normalizeEmail(adminEmail) === normalizeEmail(ADMIN_EMAIL) &&
      adminPassword === ADMIN_PASSWORD
    ) {
      setScreen("admin");
      setAdminEmail("");
      setAdminPassword("");
      return;
    }

    setAdminError("El mail o la clave de administrador no son correctos.");
  }

  async function logout() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setScreen("login");
    setAdvisor(null);
    setReport(null);
    setEmail("");
    setPassword("");
    setLoginError("");
    setActiveTab("calidad");
  }

  async function saveReport() {
    setSaveMessage("");

    if (!form.asesor || !form.semana || form.nota === "") {
      setSaveMessage("Completá al menos Asesor, Semana y Nota de calidad.");
      return;
    }

    if (!supabase) {
      setSaveMessage(
        "Supabase no está configurado. Revisá las variables de Vercel."
      );
      return;
    }

    setSaving(true);

    try {
      let audioUrl = "";

      if (form.audioFile) {
        const safeName = form.audioFile.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

        const filePath = `auditorias/${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("audios")
          .upload(filePath, form.audioFile, {
            upsert: true,
            contentType: form.audioFile.type,
          });

        if (uploadError) {
          console.error(uploadError);

          setSaveMessage(
            "El reporte no se pudo guardar porque no se pudo subir el audio."
          );

          return;
        }

        const { data: publicData } = supabase.storage
          .from("audios")
          .getPublicUrl(filePath);

        audioUrl = publicData?.publicUrl || "";
      }

      const selectedAdvisor = ASESORES.find(
        (a) => a[0] === form.asesor
      );

      const payload = {
        asesor: form.asesor,
        usuario: selectedAdvisor?.[2] || form.usuario,
        semana: form.semana,
        nota: Number(form.nota),
        evolucion: "",
        objetivo: Number(form.objetivo || 0),
        desvio: form.desvio,
        recomendacion: form.recomendacion,
        auditoria: form.auditoriaEstado,
        producto: form.producto,
        observaciones: form.observaciones,

        sph: Number(form.sph || 0),
        objetivo_sph: Number(form.objetivoSph || 0),
        ventas: Number(form.ventas || 0),
        objetivo_ventas: Number(form.objetivoVentas || 0),
        objetivo_campania: Number(form.objetivoCampania || 0),
        descripcion_campania: form.descripcionCampania,
        estado_sph: form.estadoSph,
        estado_ventas: form.estadoVentas,
        estado_campania: form.estadoCampania,

        gestion: form.accionesProductividad.join(", "),
        objetivo_calidad: Number(form.objetivo || 0),
        estado_objetivo: form.estadoObjetivo,

        items_calidad: form.itemsCalidad,
        acciones_calidad: form.accionesCalidad,

        audio_url: audioUrl,

        items_productividad: form.itemsProductividad,
        acciones_productividad: form.accionesProductividad,

        objetivo_tipificaciones: Number(
          form.objetivoTipificaciones || 0
        ),
        tipificaciones: form.tipificaciones,
        estado_tipificaciones: form.estadoTipificaciones,
        tipificacion_desvio: form.tipificacionDesvio,
        tipificacion_objetivo: form.tipificacionObjetivo,
        tipificacion_resultado: form.tipificacionResultado,
        tipificacion_compromiso: form.tipificacionCompromiso,
        tipificacion_observaciones: form.tipificacionObservaciones,

        cantidad_no_ventas: Number(form.cantidadNoVentas || 0),
        om_detectadas: form.omDetectadas,
        coaching_no_ventas: form.coachingNoVentas,
        registro_sistema: form.registroSistema,
        compromiso_no_ventas: form.compromisoNoVentas,
        fortalezas: form.fortalezas,
        observaciones_no_ventas: form.observacionesNoVentas,

        items_trabajados: form.itemsCalidad,
        acciones_realizadas: form.accionesCalidad,

        tipificacion: form.tipificaciones[0] || "",
        desvio_tipificacion: form.tipificacionDesvio,
        objetivo_tipificacion: form.tipificacionObjetivo,
        resultado_tipificacion: form.tipificacionResultado,
        compromiso_tipificacion: form.tipificacionCompromiso,
        observaciones_tipificacion: form.tipificacionObservaciones,

        principales_om: form.omDetectadas,
      };

      const { data, error } = await supabase
        .from("reportes")
        .insert([payload])
        .select();

      if (error) {
        console.error(error);

        setSaveMessage(
          `No se pudo guardar el reporte: ${
            error.message || "error de Supabase"
          }`
        );

        return;
      }

      setHistory((prev) => [...(data || []), ...prev]);

      setSaveMessage("✓ REPORTE GUARDADO CORRECTAMENTE");

      setForm({
        asesor: "",
        usuario: "",
        semana: "",
        nota: "",
        objetivo: "",
        estadoObjetivo: "",
        producto: "AP",
        desvio: "",
        recomendacion: "",
        objetivoTrabajo: "",
        observaciones: "",
        itemsCalidad: [],
        accionesCalidad: [],
        auditoriaEstado: "",
        auditoriaObservaciones: "",
        sph: "",
        objetivoSph: "",
        ventas: "",
        objetivoVentas: "",
        objetivoCampania: "",
        descripcionCampania: "",
        estadoSph: "",
        estadoVentas: "",
        estadoCampania: "",
        observacionesProductividad: "",
        itemsProductividad: [],
        accionesProductividad: [],
        objetivoTipificaciones: "",
        tipificaciones: [],
        estadoTipificaciones: "",
        tipificacionDesvio: "",
        tipificacionObjetivo: "",
        tipificacionResultado: "",
        tipificacionCompromiso: "",
        tipificacionObservaciones: "",
        cantidadNoVentas: "",
        omDetectadas: [],
        coachingNoVentas: "",
        registroSistema: "",
        compromisoNoVentas: "",
        fortalezas: [],
        observacionesNoVentas: "",
        audioFile: null,
        observacionesGenerales: "",
      });
    } catch (error) {
      console.error(error);

      setSaveMessage(
        "No se pudo guardar el reporte. Revisá la configuración de Supabase."
      );
    } finally {
      setSaving(false);
    }
  }

  async function loadHistory() {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("reportes")
        .select("id, asesor, semana, nota, producto")
        .order("id", { ascending: false })
        .limit(100);

      if (!error && data) {
        setHistory(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (screen === "admin") {
      loadHistory();
    }
  }, [screen]);

  const displayName = useMemo(() => {
    if (!advisor) return "";
    return advisor[0].split(",")[1]?.trim() || advisor[0];
  }, [advisor]);

  if (screen === "login") {
    return (
      <>
        <style>{styles}</style>

        <main className="loginPage">
          <div className="loginCard">
            <div className="brandMark">PC</div>

            <div className="brand">PORTAL DE CALIDAD</div>

            <h1>Ingresá a tu portal</h1>

            <p className="loginDescription">
              Consultá tu evolución, objetivos y acciones de calidad.
            </p>

            <div className="loginTabs">
              <button
                className={
                  loginType === "advisor"
                    ? "loginTab active"
                    : "loginTab"
                }
                onClick={() => {
                  setLoginType("advisor");
                  setLoginError("");
                }}
              >
                Asesor
              </button>

              <button
                className={
                  loginType === "admin"
                    ? "loginTab active"
                    : "loginTab"
                }
                onClick={() => {
                  setLoginType("admin");
                  setLoginError("");
                }}
              >
                Administración
              </button>
            </div>

            {loginType === "advisor" ? (
              <>
                <div className="fieldGroup">
                  <label>Mail institucional</label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setLoginError("");
                    }}
                    placeholder="nombre.apellido@portalcalidad.com"
                  />
                </div>

                <div className="fieldGroup">
                  <label>Clave</label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError("");
                    }}
                    placeholder="Ingresá tu clave"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") loginAdvisor();
                    }}
                  />
                </div>

                {loginError && (
                  <div className="errorBox">{loginError}</div>
                )}

                <button
                  className="primaryButton"
                  onClick={loginAdvisor}
                  disabled={loginLoading}
                >
                  {loginLoading ? "INGRESANDO..." : "INGRESAR"}
                </button>
              </>
            ) : (
              <>
                <div className="fieldGroup">
                  <label>Mail administrador</label>

                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Mail de administración"
                  />
                </div>

                <div className="fieldGroup">
                  <label>Clave</label>

                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Ingresá la clave"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") loginAdmin();
                    }}
                  />
                </div>

                {adminError && (
                  <div className="errorBox">{adminError}</div>
                )}

                <button
                  className="primaryButton"
                  onClick={loginAdmin}
                >
                  INGRESAR A ADMINISTRACIÓN
                </button>
              </>
            )}
          </div>
        </main>
      </>
    );
  }

  if (screen === "admin") {
    return (
      <>
        <style>{styles}</style>

        <main className="app">
          <header className="topHeader">
            <div>
              <div className="brand small">
                PORTAL DE CALIDAD
              </div>

              <h1>Panel de Calidad</h1>

              <p>Carga y gestión de reportes</p>
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

          <section className="adminIntro">
            <h2>Cargar nuevo reporte</h2>

            <p>
              Completá la información y el reporte quedará
              disponible para el asesor.
            </p>
          </section>

          <section className="adminSection">
            <div className="sectionNumber">01</div>

            <h2>Datos generales</h2>

            <div className="formGrid">
              <div className="fieldGroup">
                <label>Asesor</label>

                <select
                  value={form.asesor}
                  onChange={(e) => {
                    const value = e.target.value;

                    const selected = ASESORES.find(
                      (a) => a[0] === value
                    );

                    setForm((prev) => ({
                      ...prev,
                      asesor: value,
                      usuario: selected?.[2] || "",
                    }));
                  }}
                >
                  <option value="">
                    Seleccioná un asesor
                  </option>

                  {ASESORES.map((a) => (
                    <option key={a[1]} value={a[0]}>
                      {a[0]} — {a[1]}
                    </option>
                  ))}
                </select>
              </div>

              <TextField
                label="Semana / período"
                value={form.semana}
                setValue={(v) =>
                  updateForm("semana", v)
                }
                placeholder="Ej.: Semana 3 - Agosto"
              />

              <TextField
                label="Nota de calidad"
                type="number"
                value={form.nota}
                setValue={(v) =>
                  updateForm("nota", v)
                }
              />

              <TextField
                label="Objetivo de calidad"
                type="number"
                value={form.objetivo}
                setValue={(v) =>
                  updateForm("objetivo", v)
                }
              />

              <SelectField
                label="Estado del objetivo"
                value={form.estadoObjetivo}
                setValue={(v) =>
                  updateForm("estadoObjetivo", v)
                }
                options={[
                  "ALCANZADO",
                  "EN PROCESO",
                  "DEBAJO DEL OBJETIVO",
                ]}
              />

              <TextField
                label="Producto"
                value={form.producto}
                setValue={(v) =>
                  updateForm("producto", v)
                }
              />

              <TextField
                label="Desvío principal"
                value={form.desvio}
                setValue={(v) =>
                  updateForm("desvio", v)
                }
              />

              <TextField
                label="Recomendación"
                value={form.recomendacion}
                setValue={(v) =>
                  updateForm("recomendacion", v)
                }
              />

              <TextField
                label="Objetivo de trabajo"
                value={form.objetivoTrabajo}
                setValue={(v) =>
                  updateForm("objetivoTrabajo", v)
                }
              />

              <TextArea
                label="Observaciones"
                value={form.observaciones}
                setValue={(v) =>
                  updateForm("observaciones", v)
                }
              />
            </div>

            <MultiSelect
              title="Items trabajados"
              options={ITEMS_CALIDAD}
              selected={form.itemsCalidad}
              setSelected={(v) =>
                updateForm("itemsCalidad", v)
              }
            />

            <MultiSelect
              title="Acciones realizadas"
              options={ACCIONES_CALIDAD}
              selected={form.accionesCalidad}
              setSelected={(v) =>
                updateForm("accionesCalidad", v)
              }
            />
          </section>

          <section className="adminSection">
            <div className="sectionNumber">02</div>

            <h2>Auditoría</h2>

            <p className="sectionHint">
              La auditoría se mostrará dentro de Calidad.
            </p>

            <div className="formGrid">
              <SelectField
                label="Estado de auditoría"
                value={form.auditoriaEstado}
                setValue={(v) =>
                  updateForm("auditoriaEstado", v)
                }
                options={[
                  "Correcta",
                  "Con desvíos",
                  "Requiere coaching",
                  "Requiere seguimiento",
                  "Sin información",
                ]}
              />

              <TextArea
                label="Observaciones de auditoría"
                value={form.auditoriaObservaciones}
                setValue={(v) =>
                  updateForm(
                    "auditoriaObservaciones",
                    v
                  )
                }
              />
            </div>
          </section>

          <section className="adminSection">
            <div className="sectionNumber">03</div>

            <h2>Productividad</h2>

            <div className="formGrid">
              <TextField
                label="SPH"
                type="number"
                value={form.sph}
                setValue={(v) =>
                  updateForm("sph", v)
                }
              />

              <TextField
                label="Objetivo SPH"
                type="number"
                value={form.objetivoSph}
                setValue={(v) =>
                  updateForm("objetivoSph", v)
                }
              />

              <TextField
                label="Ventas"
                type="number"
                value={form.ventas}
                setValue={(v) =>
                  updateForm("ventas", v)
                }
              />

              <TextField
                label="Objetivo ventas"
                type="number"
                value={form.objetivoVentas}
                setValue={(v) =>
                  updateForm("objetivoVentas", v)
                }
              />

              <TextField
                label="Objetivo de campaña"
                type="number"
                value={form.objetivoCampania}
                setValue={(v) =>
                  updateForm("objetivoCampania", v)
                }
              />

              <TextField
                label="Descripción de campaña"
                value={form.descripcionCampania}
                setValue={(v) =>
                  updateForm(
                    "descripcionCampania",
                    v
                  )
                }
              />

              <SelectField
                label="Estado SPH"
                value={form.estadoSph}
                setValue={(v) =>
                  updateForm("estadoSph", v)
                }
                options={[
                  "ALCANZADO",
                  "EN PROCESO",
                  "DEBAJO DEL OBJETIVO",
                ]}
              />

              <SelectField
                label="Estado ventas"
                value={form.estadoVentas}
                setValue={(v) =>
                  updateForm("estadoVentas", v)
                }
                options={[
                  "ALCANZADO",
                  "EN PROCESO",
                  "DEBAJO DEL OBJETIVO",
                ]}
              />

              <SelectField
                label="Estado campaña"
                value={form.estadoCampania}
                setValue={(v) =>
                  updateForm("estadoCampania", v)
                }
                options={[
                  "ALCANZADO",
                  "EN PROCESO",
                  "DEBAJO DEL OBJETIVO",
                ]}
              />

              <TextArea
                label="Observaciones de productividad"
                value={form.observacionesProductividad}
                setValue={(v) =>
                  updateForm(
                    "observacionesProductividad",
                    v
                  )
                }
              />
            </div>

            <MultiSelect
              title="Items trabajados"
              options={ITEMS_PRODUCTIVIDAD}
              selected={form.itemsProductividad}
              setSelected={(v) =>
                updateForm(
                  "itemsProductividad",
                  v
                )
              }
            />

            <MultiSelect
              title="Acciones realizadas"
              options={ACCIONES_PRODUCTIVIDAD}
              selected={form.accionesProductividad}
              setSelected={(v) =>
                updateForm(
                  "accionesProductividad",
                  v
                )
              }
            />
          </section>

          <section className="adminSection">
            <div className="sectionNumber">04</div>

            <h2>Tipificaciones</h2>

            <MultiSelect
              title="Tipificaciones realizadas"
              options={TIPIFICACIONES}
              selected={form.tipificaciones}
              setSelected={(v) =>
                updateForm(
                  "tipificaciones",
                  v
                )
              }
            />

            <div className="formGrid">
              <TextField
                label="Objetivo tipificaciones"
                type="number"
                value={form.objetivoTipificaciones}
                setValue={(v) =>
                  updateForm(
                    "objetivoTipificaciones",
                    v
                  )
                }
              />

              <SelectField
                label="Estado tipificaciones"
                value={form.estadoTipificaciones}
                setValue={(v) =>
                  updateForm(
                    "estadoTipificaciones",
                    v
                  )
                }
                options={[
                  "ALCANZADO",
                  "EN PROCESO",
                  "DEBAJO DEL OBJETIVO",
                ]}
              />

              <TextField
                label="Desvío"
                value={form.tipificacionDesvio}
                setValue={(v) =>
                  updateForm(
                    "tipificacionDesvio",
                    v
                  )
                }
              />

              <TextField
                label="Objetivo"
                value={form.tipificacionObjetivo}
                setValue={(v) =>
                  updateForm(
                    "tipificacionObjetivo",
                    v
                  )
                }
              />

              <TextField
                label="Resultado"
                value={form.tipificacionResultado}
                setValue={(v) =>
                  updateForm(
                    "tipificacionResultado",
                    v
                  )
                }
              />

              <TextField
                label="Compromiso"
                value={form.tipificacionCompromiso}
                setValue={(v) =>
                  updateForm(
                    "tipificacionCompromiso",
                    v
                  )
                }
              />

              <TextArea
                label="Observaciones"
                value={form.tipificacionObservaciones}
                setValue={(v) =>
                  updateForm(
                    "tipificacionObservaciones",
                    v
                  )
                }
              />
            </div>
          </section>

          <section className="adminSection">
            <div className="sectionNumber">05</div>

            <h2>Auditorías de no ventas</h2>

            <div className="formGrid">
              <TextField
                label="Cantidad"
                type="number"
                value={form.cantidadNoVentas}
                setValue={(v) =>
                  updateForm(
                    "cantidadNoVentas",
                    v
                  )
                }
              />

              <TextField
                label="Coaching"
                value={form.coachingNoVentas}
                setValue={(v) =>
                  updateForm(
                    "coachingNoVentas",
                    v
                  )
                }
              />

              <SelectField
                label="Registro en sistema"
                value={form.registroSistema}
                setValue={(v) =>
                  updateForm(
                    "registroSistema",
                    v
                  )
                }
                options={[
                  "CORRECTA",
                  "INCORRECTA",
                  "PENDIENTE",
                ]}
              />

              <TextField
                label="Compromiso"
                value={form.compromisoNoVentas}
                setValue={(v) =>
                  updateForm(
                    "compromisoNoVentas",
                    v
                  )
                }
              />
            </div>

            <MultiSelect
              title="Principales O.M."
              options={OM}
              selected={form.omDetectadas}
              setSelected={(v) =>
                updateForm(
                  "omDetectadas",
                  v
                )
              }
            />

            <MultiSelect
              title="Fortalezas"
              options={FORTALEZAS}
              selected={form.fortalezas}
              setSelected={(v) =>
                updateForm(
                  "fortalezas",
                  v
                )
              }
            />

            <TextArea
              label="Observaciones"
              value={form.observacionesNoVentas}
              setValue={(v) =>
                updateForm(
                  "observacionesNoVentas",
                  v
                )
              }
            />
          </section>

          <section className="adminSection">
            <div className="sectionNumber">06</div>

            <h2>Audio de auditoría</h2>

            <div className="audioUpload">
              <input
                id="audioInput"
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  updateForm(
                    "audioFile",
                    e.target.files?.[0] || null
                  )
                }
              />

              <label htmlFor="audioInput">
                <span className="audioIcon">♪</span>

                <strong>
                  {form.audioFile
                    ? form.audioFile.name
                    : "Seleccionar audio"}
                </strong>

                <small>
                  MP3, WAV, M4A u otro formato compatible
                </small>
              </label>
            </div>

            <TextArea
              label="Observaciones generales"
              value={form.observacionesGenerales}
              setValue={(v) =>
                updateForm(
                  "observacionesGenerales",
                  v
                )
              }
            />
          </section>

          {saveMessage && (
            <div
              className={
                saveMessage.startsWith("✓")
                  ? "successBox saveBox"
                  : "errorBox saveBox"
              }
            >
              {saveMessage}
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

          <section className="historySection">
            <div className="sectionHeader">
              <div>
                <div className="sectionNumber">07</div>
                <h2>HISTÓRICO</h2>
              </div>

              <button
                className="secondaryButton"
                onClick={loadHistory}
              >
                ACTUALIZAR
              </button>
            </div>

            <div className="historyTable">
              <div className="historyRow historyHead">
                <span>Asesor</span>
                <span>Semana</span>
                <span>Nota</span>
                <span>Producto</span>
              </div>

              {history.length === 0 ? (
                <div className="emptyHistory">
                  Todavía no hay reportes cargados.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    className="historyRow"
                    key={item.id}
                  >
                    <span>{item.asesor}</span>
                    <span>{item.semana}</span>
                    <strong>{item.nota}</strong>
                    <span>{item.producto}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </>
    );
  }

  const currentReport = report;

  if (!currentReport) {
    return (
      <>
        <style>{styles}</style>

        <main className="advisorApp">
          <header className="advisorHeader">
            <div>
              <div className="brand small">
                PORTAL DE CALIDAD
              </div>

              <h1>Hola, {displayName}</h1>

              <p>
                Consultá tu evolución y tus objetivos
                de calidad.
              </p>
            </div>

            <div className="headerRight">
              <span className="followBadge">
                EN SEGUIMIENTO
              </span>

              <button
                className="logoutButton"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          <nav className="advisorNav">
            {[
              ["calidad", "CALIDAD"],
              ["productividad", "PRODUCTIVIDAD"],
              ["tipificaciones", "TIPIFICACIONES"],
              ["auditorias", "AUDITORÍAS"],
              ["actividades", "ACTIVIDADES"],
              ["historico", "HISTÓRICO"],
              ["feedback", "FEEDBACK"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={
                  activeTab === id ? "active" : ""
                }
                onClick={() => setActiveTab(id)}
              >
                {label}
              </button>
            ))}
          </nav>

          <section className="emptyReport">
            <div className="emptyIcon">PC</div>

            <h2>
              Todavía no hay un reporte cargado.
            </h2>

            <p>
              Cuando Calidad cargue tu reporte,
              aparecerá automáticamente acá.
            </p>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <main className="advisorApp">
        <header className="advisorHeader">
          <div>
            <div className="brand small">
              PORTAL DE CALIDAD
            </div>

            <h1>Hola, {displayName}</h1>

            <p>
              {currentReport.semana ||
                "Semana actual"}
            </p>
          </div>

          <div className="headerRight">
            <span
              className={`followBadge ${statusClass(
                currentReport.estado_objetivo
              )}`}
            >
              {currentReport.estado_objetivo ||
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

        <nav className="advisorNav">
          {[
            ["calidad", "CALIDAD"],
            ["productividad", "PRODUCTIVIDAD"],
            ["tipificaciones", "TIPIFICACIONES"],
            ["auditorias", "AUDITORÍAS"],
            ["actividades", "ACTIVIDADES"],
            ["historico", "HISTÓRICO"],
            ["feedback", "FEEDBACK"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={
                activeTab === id ? "active" : ""
              }
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        {activeTab === "calidad" && (
          <section className="advisorCard">
            <div className="cardNumber">01</div>

            <div className="cardTitle">
              <span>CALIDAD</span>

              <h2>
                {currentReport.nota ?? "-"}
                <small>/ 100</small>
              </h2>
            </div>

            <div className="metricGrid">
              <div>
                <small>OBJETIVO</small>
                <strong>
                  {currentReport.objetivo ?? "-"}
                </strong>
              </div>

              <div>
                <small>ESTADO</small>
                <strong>
                  {currentReport.estado_objetivo ||
                    "EN PROCESO"}
                </strong>
              </div>

              <div>
                <small>PRODUCTO</small>
                <strong>
                  {currentReport.producto || "AP"}
                </strong>
              </div>

              <div>
                <small>DESVÍO PRINCIPAL</small>
                <strong>
                  {currentReport.desvio || "-"}
                </strong>
              </div>
            </div>

            <div className="progressBlock">
              <div className="progressTop">
                <span>
                  Progreso hacia el objetivo
                </span>

                <strong>
                  {currentReport.objetivo
                    ? Math.round(
                        (Number(
                          currentReport.nota || 0
                        ) /
                          Number(
                            currentReport.objetivo
                          )) *
                          100
                      )
                    : 0}
                  %
                </strong>
              </div>

              <div className="progressBar">
                <div
                  style={{
                    width: `${
                      currentReport.objetivo
                        ? Math.min(
                            100,
                            (Number(
                              currentReport.nota ||
                                0
                            ) /
                              Number(
                                currentReport.objetivo
                              )) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="infoGrid">
              <div className="infoBox">
                <small>
                  CUÁNTO FALTA PARA ALCANZAR EL
                  OBJETIVO
                </small>

                <strong>
                  {Math.max(
                    0,
                    Number(
                      currentReport.objetivo || 0
                    ) -
                      Number(
                        currentReport.nota || 0
                      )
                  )}{" "}
                  puntos
                </strong>
              </div>

              <div className="infoBox">
                <small>
                  COMPARATIVO SEMANAL
                </small>

                <strong>
                  Todavía no hay una semana
                  anterior para comparar.
                </strong>
              </div>
            </div>

            <div className="contentBlock">
              <h3>DESVÍO PRINCIPAL</h3>

              <p>
                {currentReport.desvio ||
                  "Sin desvíos cargados."}
              </p>
            </div>

            <div className="contentBlock">
              <h3>ITEMS TRABAJADOS</h3>

              <div className="pillList">
                {parseArray(
                  currentReport.items_calidad
                ).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="contentBlock">
              <h3>ACCIONES REALIZADAS</h3>

              <div className="pillList">
                {parseArray(
                  currentReport.acciones_calidad
                ).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="contentBlock">
              <h3>AUDITORÍA</h3>

              <p>
                {currentReport.auditoria ||
                  "No hay información de auditoría."}
              </p>

              {currentReport.observaciones && (
                <div className="observation">
                  <strong>OBSERVACIONES</strong>

                  <p>
                    {currentReport.observaciones}
                  </p>
                </div>
              )}
            </div>

            {currentReport.audio_url && (
              <div className="audioPlayer">
                <h3>AUDIO DE AUDITORÍA</h3>

                <audio
                  controls
                  src={currentReport.audio_url}
                >
                  Tu navegador no soporta audio.
                </audio>
              </div>
            )}
          </section>
        )}

        {activeTab === "productividad" && (
          <section className="advisorCard">
            <div className="cardNumber">02</div>

            <div className="cardTitle">
              <span>PRODUCTIVIDAD</span>

              <h2>
                {currentReport.sph ?? "-"}
              </h2>
            </div>

            <div className="metricGrid">
              <div>
                <small>OBJETIVO SPH</small>
                <strong>
                  {currentReport.objetivo_sph ??
                    "-"}
                </strong>
              </div>

              <div>
                <small>VENTAS</small>
                <strong>
                  {currentReport.ventas ?? "-"}
                </strong>
              </div>

              <div>
                <small>OBJETIVO VENTAS</small>
                <strong>
                  {currentReport.objetivo_ventas ??
                    "-"}
                </strong>
              </div>

              <div>
                <small>OBJETIVO DE CAMPAÑA</small>
                <strong>
                  {currentReport.objetivo_campania ??
                    "-"}
                </strong>
              </div>

              <div>
                <small>ESTADO SPH</small>
                <strong>
                  {currentReport.estado_sph || "-"}
                </strong>
              </div>

              <div>
                <small>ESTADO VENTAS</small>
                <strong>
                  {currentReport.estado_ventas ||
                    "-"}
                </strong>
              </div>
            </div>

            <div className="contentBlock">
              <h3>ITEMS TRABAJADOS</h3>

              <div className="pillList">
                {parseArray(
                  currentReport.items_productividad
                ).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="contentBlock">
              <h3>ACCIONES REALIZADAS</h3>

              <div className="pillList">
                {parseArray(
                  currentReport.acciones_productividad
                ).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="contentBlock">
              <h3>OBSERVACIONES</h3>

              <p>
                {currentReport
                  .observaciones_productividad ||
                  "No hay observaciones cargadas."}
              </p>
            </div>
          </section>
        )}

        {activeTab === "tipificaciones" && (
          <section className="advisorCard">
            <div className="cardNumber">03</div>

            <div className="cardTitle">
              <span>TIPIFICACIONES</span>

              <h2>
                {currentReport.estado_tipificaciones ||
                  "En proceso"}
              </h2>
            </div>

            <div className="metricGrid">
              <div>
                <small>DESVÍO</small>
                <strong>
                  {currentReport.tipificacion_desvio ||
                    "-"}
                </strong>
              </div>

              <div>
                <small>OBJETIVO</small>
                <strong>
                  {currentReport.tipificacion_objetivo ||
                    currentReport.objetivo_tipificaciones ||
                    "-"}
                </strong>
              </div>

              <div>
                <small>RESULTADO</small>
                <strong>
                  {currentReport.tipificacion_resultado ||
                    "-"}
                </strong>
              </div>

              <div>
                <small>COMPROMISO</small>
                <strong>
                  {currentReport.tipificacion_compromiso ||
                    "-"}
                </strong>
              </div>
            </div>

            <div className="contentBlock">
              <h3>TIPIFICACIONES</h3>

              <div className="pillList">
                {parseArray(
                  currentReport.tipificaciones
                ).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="contentBlock">
              <h3>OBSERVACIONES</h3>

              <p>
                {currentReport
                  .tipificacion_observaciones ||
                  "Sin observaciones cargadas."}
              </p>
            </div>
          </section>
        )}

        {activeTab === "auditorias" && (
          <section className="advisorCard">
            <div className="cardNumber">04</div>

            <div className="cardTitle">
              <span>
                AUDITORÍAS DE NO VENTAS
              </span>

              <h2>
                {currentReport.cantidad_no_ventas ??
                  "-"}
              </h2>
            </div>

            <div className="metricGrid">
              <div>
                <small>CANTIDAD</small>
                <strong>
                  {currentReport.cantidad_no_ventas ??
                    "-"}
                </strong>
              </div>

              <div>
                <small>COACHING</small>
                <strong>
                  {currentReport.coaching_no_ventas ||
                    "-"}
                </strong>
              </div>

              <div>
                <small>
                  REGISTRO EN SISTEMA
                </small>

                <strong>
                  {currentReport.registro_sistema ||
                    "-"}
                </strong>
              </div>

              <div>
                <small>COMPROMISO</small>

                <strong>
                  {currentReport.compromiso_no_ventas ||
                    "-"}
                </strong>
              </div>
            </div>

            <div className="contentBlock">
              <h3>PRINCIPALES O.M.</h3>

              <div className="pillList">
                {parseArray(
                  currentReport.om_detectadas
                ).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="contentBlock">
              <h3>FORTALEZAS</h3>

              <div className="pillList">
                {parseArray(
                  currentReport.fortalezas
                ).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="contentBlock">
              <h3>OBSERVACIONES</h3>

              <p>
                {currentReport
                  .observaciones_no_ventas ||
                  "No hay observaciones cargadas."}
              </p>
            </div>
          </section>
        )}

        {activeTab === "actividades" && (
          <section className="advisorCard">
            <div className="cardNumber">05</div>

            <div className="cardTitle">
              <span>ACTIVIDADES</span>

              <h2>Próximamente</h2>
            </div>

            <div className="emptyReport smallEmpty">
              <div className="emptyIcon">+</div>

              <p>
                Esta sección quedará disponible
                para registrar y consultar
                actividades.
              </p>
            </div>
          </section>
        )}

        {activeTab === "historico" && (
          <section className="advisorCard">
            <div className="cardNumber">06</div>

            <div className="cardTitle">
              <span>HISTÓRICO</span>

              <h2>Evolución</h2>
            </div>

            <div className="historyTable advisorHistory">
              <div className="historyRow historyHead">
                <span>Semana</span>
                <span>Nota</span>
                <span>Producto</span>
                <span>Estado</span>
              </div>

              <div className="historyRow">
                <span>
                  {currentReport.semana || "-"}
                </span>

                <strong>
                  {currentReport.nota ?? "-"}
                </strong>

                <span>
                  {currentReport.producto || "-"}
                </span>

                <span>
                  {currentReport.estado_objetivo ||
                    "-"}
                </span>
              </div>
            </div>
          </section>
        )}

        {activeTab === "feedback" && (
          <section className="advisorCard feedbackCard">
            <div className="cardNumber">07</div>

            <div className="cardTitle">
              <span>FEEDBACK DEL ASESOR</span>

              <h2>Tu opinión importa</h2>
            </div>

            <p>
              ¿Querés dejar algún comentario sobre
              tu reporte, una consulta o algo que
              quieras trabajar con Calidad?
            </p>

            <textarea
              value={feedback}
              onChange={(e) =>
                setFeedback(e.target.value)
              }
              placeholder="Escribí acá tu comentario..."
            />

            <button
              className="primaryButton"
              onClick={() => {
                setFeedback("");
                alert(
                  "Feedback enviado correctamente."
                );
              }}
            >
              ENVIAR FEEDBACK
            </button>
          </section>
        )}
      </main>
    </>
  );
}

const styles = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #F5F8F7;
  color: #17313A;
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

button:disabled {
  opacity: .65;
  cursor: not-allowed;
}

.loginPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background:
    radial-gradient(circle at 10% 10%, rgba(53,167,160,.18), transparent 28%),
    radial-gradient(circle at 90% 90%, rgba(21,94,104,.18), transparent 30%),
    #F5F8F7;
}

.loginCard {
  width: 100%;
  max-width: 470px;
  background: white;
  border: 1px solid #DCE7E8;
  border-radius: 28px;
  padding: 42px;
  box-shadow: 0 25px 70px rgba(18,59,74,.12);
}

.brandMark {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #123B4A;
  color: white;
  font-weight: 900;
  margin-bottom: 20px;
}

.brand {
  color: #155E68;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1.8px;
}

.brand.small {
  margin-bottom: 6px;
}

.loginCard h1 {
  margin: 12px 0 8px;
  font-size: 34px;
  color: #123B4A;
}

.loginDescription {
  color: #6D8087;
  line-height: 1.6;
  margin-bottom: 30px;
}

.loginTabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #EEF4F4;
  padding: 5px;
  border-radius: 12px;
  margin-bottom: 26px;
}

.loginTab {
  border: 0;
  background: transparent;
  padding: 12px;
  border-radius: 9px;
  color: #6D8087;
  font-weight: 800;
}

.loginTab.active {
  background: white;
  color: #155E68;
  box-shadow: 0 3px 12px rgba(18,59,74,.08);
}

.fieldGroup {
  margin-bottom: 18px;
}

.fieldGroup.full {
  grid-column: 1 / -1;
}

.fieldGroup label {
  display: block;
  font-size: 12px;
  font-weight: 900;
  color: #41616A;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: .4px;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #D6E3E4;
  border-radius: 12px;
  padding: 13px 14px;
  background: white;
  color: #17313A;
  outline: none;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #1B7F83;
  box-shadow: 0 0 0 3px rgba(27,127,131,.10);
}

textarea {
  min-height: 105px;
  resize: vertical;
}

.primaryButton,
.saveButton {
  border: 0;
  border-radius: 13px;
  padding: 14px 22px;
  background: #155E68;
  color: white;
  font-weight: 900;
  letter-spacing: .4px;
  width: 100%;
  transition: .2s;
}

.primaryButton:hover,
.saveButton:hover {
  background: #123B4A;
  transform: translateY(-1px);
}

.errorBox {
  background: #FFF0F0;
  border: 1px solid #F0CACA;
  color: #A84646;
  padding: 12px 14px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 700;
}

.successBox {
  background: #EAF7F1;
  border: 1px solid #B9E3D0;
  color: #217052;
  padding: 14px 16px;
  border-radius: 13px;
  margin: 20px 0;
  font-weight: 900;
}

.app,
.advisorApp {
  min-height: 100vh;
  padding-bottom: 70px;
}

.topHeader,
.advisorHeader {
  background: white;
  border-bottom: 1px solid #DCE7E8;
  padding: 30px 6%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
}

.topHeader h1,
.advisorHeader h1 {
  margin: 4px 0;
  color: #123B4A;
  font-size: 31px;
}

.topHeader p,
.advisorHeader p {
  margin: 5px 0 0;
  color: #6D8087;
}

.logoutButton {
  border: 1px solid #D6E3E4;
  background: white;
  color: #155E68;
  padding: 10px 15px;
  border-radius: 10px;
  font-weight: 800;
}

.adminBadge {
  display: inline-block;
  margin: 25px 6% 0;
  background: #DFF2F0;
  color: #155E68;
  padding: 8px 13px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
}

.adminIntro {
  padding: 15px 6% 20px;
}

.adminIntro h2 {
  margin: 0 0 7px;
  color: #123B4A;
}

.adminIntro p {
  color: #6D8087;
}

.adminSection,
.historySection {
  width: 88%;
  max-width: 1200px;
  margin: 18px auto;
  background: white;
  border: 1px solid #DCE7E8;
  border-radius: 22px;
  padding: 30px;
  position: relative;
}

.sectionNumber,
.cardNumber {
  color: #35A7A0;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.adminSection h2,
.historySection h2 {
  margin: 0 0 8px;
  color: #123B4A;
}

.sectionHint {
  color: #6D8087;
  margin-top: 5px;
}

.formGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 18px;
  margin-top: 22px;
}

.multiGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.multiOption {
  border: 1px solid #D8E6E7;
  background: #F7FAFA;
  color: #47636A;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 700;
}

.multiOption.selected {
  background: #DDF2F0;
  border-color: #76C5BE;
  color: #155E68;
}

.multiOption span {
  font-weight: 900;
  margin-right: 5px;
}

.selectedCount {
  color: #1B7F83;
  font-size: 12px;
  font-weight: 900;
  margin-top: 9px;
}

.audioUpload {
  margin: 20px 0;
}

.audioUpload input {
  display: none;
}

.audioUpload label {
  min-height: 125px;
  border: 2px dashed #9CC7C8;
  border-radius: 18px;
  background: #F4FAF9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 7px;
  color: #155E68;
  cursor: pointer;
}

.audioUpload small {
  color: #6D8087;
}

.audioIcon {
  font-size: 28px;
}

.saveButton {
  display: block;
  width: 88%;
  max-width: 1200px;
  margin: 25px auto;
}

.saveBox {
  width: 88%;
  max-width: 1200px;
  margin: 20px auto;
}

.historyTable {
  margin-top: 20px;
  border: 1px solid #DCE7E8;
  border-radius: 14px;
  overflow: hidden;
}

.historyRow {
  display: grid;
  grid-template-columns: 2fr 1.5fr .7fr .8fr;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid #E8EEEE;
  align-items: center;
}

.historyRow:last-child {
  border-bottom: 0;
}

.historyHead {
  background: #F0F6F6;
  color: #41616A;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.emptyHistory {
  padding: 25px;
  color: #6D8087;
  text-align: center;
}

.sectionHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.secondaryButton {
  background: white;
  color: #155E68;
  border: 1px solid #BBD5D6;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 800;
}

.advisorHeader {
  padding: 30px 7%;
}

.headerRight {
  display: flex;
  align-items: center;
  gap: 15px;
}

.followBadge {
  background: #FFF1D8;
  color: #986818;
  padding: 9px 13px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 900;
}

.followBadge.statusGreen {
  background: #E5F6EF;
  color: #25735A;
}

.followBadge.statusRed {
  background: #FFF0F0;
  color: #A84646;
}

.followBadge.statusYellow {
  background: #FFF1D8;
  color: #986818;
}

.advisorNav {
  background: white;
  border-bottom: 1px solid #DCE7E8;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 0 5%;
}

.advisorNav button {
  border: 0;
  background: transparent;
  color: #6D8087;
  padding: 18px 16px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .4px;
  border-bottom: 3px solid transparent;
}

.advisorNav button.active {
  color: #155E68;
  border-bottom-color: #35A7A0;
}

.advisorCard {
  width: 86%;
  max-width: 1050px;
  margin: 38px auto;
  background: white;
  border: 1px solid #DCE7E8;
  border-radius: 25px;
  padding: 35px;
  box-shadow: 0 12px 35px rgba(18,59,74,.06);
}

.cardTitle span {
  color: #1B7F83;
  font-weight: 900;
  letter-spacing: 1.3px;
  font-size: 13px;
}

.cardTitle h2 {
  margin: 10px 0 25px;
  color: #123B4A;
  font-size: 46px;
}

.cardTitle h2 small {
  font-size: 20px;
  color: #8A9BA0;
  margin-left: 5px;
}

.metricGrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 14px;
  margin: 20px 0;
}

.metricGrid > div,
.infoBox {
  background: #F4F8F8;
  border: 1px solid #E0EBEB;
  border-radius: 15px;
  padding: 17px;
}

.metricGrid small,
.infoBox small {
  display: block;
  color: #70848A;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .5px;
  margin-bottom: 7px;
}

.metricGrid strong,
.infoBox strong {
  color: #17313A;
  font-size: 16px;
}

.progressBlock {
  margin: 25px 0;
}

.progressTop {
  display: flex;
  justify-content: space-between;
  color: #6D8087;
  font-size: 13px;
  margin-bottom: 8px;
}

.progressTop strong {
  color: #155E68;
}

.progressBar {
  height: 9px;
  background: #E7EEEE;
  border-radius: 30px;
  overflow: hidden;
}

.progressBar div {
  height: 100%;
  background: linear-gradient(90deg, #155E68, #35A7A0);
  border-radius: 30px;
}

.infoGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin: 25px 0;
}

.contentBlock {
  border-top: 1px solid #E4ECEC;
  padding: 22px 0;
}

.contentBlock h3,
.audioPlayer h3 {
  margin: 0 0 12px;
  color: #41616A;
  font-size: 11px;
  letter-spacing: .7px;
}

.contentBlock p {
  margin: 0;
  color: #4E656B;
  line-height: 1.65;
}

.pillList {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pillList span {
  background: #EEF7F6;
  color: #155E68;
  border: 1px solid #D2EAE8;
  border-radius: 30px;
  padding: 8px 11px;
  font-size: 12px;
  font-weight: 700;
}

.observation {
  margin-top: 18px;
  background: #FFF8EA;
  border-left: 4px solid #D59A28;
  border-radius: 8px;
  padding: 15px;
}

.observation strong {
  color: #986818;
  font-size: 11px;
}

.audioPlayer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #E4ECEC;
}

.audioPlayer audio {
  width: 100%;
}

.emptyReport {
  width: 86%;
  max-width: 1050px;
  margin: 50px auto;
  text-align: center;
  padding: 70px 30px;
  background: white;
  border: 1px solid #DCE7E8;
  border-radius: 25px;
}

.emptyReport h2 {
  color: #123B4A;
}

.emptyReport p {
  color: #6D8087;
  line-height: 1.6;
}

.emptyIcon {
  width: 58px;
  height: 58px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #DFF2F0;
  color: #155E68;
  border-radius: 18px;
  font-weight: 900;
}

.smallEmpty {
  width: 100%;
  margin: 20px 0 0;
  padding: 45px 20px;
  border: 0;
  background: #F7FAFA;
}

.feedbackCard > p {
  color: #60777D;
  line-height: 1.7;
  max-width: 700px;
}

.feedbackCard textarea {
  min-height: 180px;
  margin: 15px 0;
}

.feedbackCard .primaryButton {
  width: auto;
  min-width: 190px;
}

@media (max-width: 800px) {
  .topHeader,
  .advisorHeader {
    flex-direction: column;
    align-items: flex-start;
  }

  .headerRight {
    flex-wrap: wrap;
  }

  .formGrid,
  .metricGrid,
  .infoGrid {
    grid-template-columns: 1fr;
  }

  .adminSection,
  .historySection,
  .advisorCard,
  .emptyReport {
    width: 94%;
    padding: 22px;
  }

  .saveButton,
  .saveBox {
    width: 94%;
  }

  .advisorNav {
    justify-content: flex-start;
    overflow-x: auto;
  }

  .historyRow {
    grid-template-columns: 1fr 1fr;
  }
}
`;
