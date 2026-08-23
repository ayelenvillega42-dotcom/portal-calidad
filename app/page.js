"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

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

const ADMIN_MAIL = "admin@portalcalidad.com";

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

function parseArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {}

    return value
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
}

function ToggleGroup({ title, options, values, setValues }) {
  const toggle = (item) => {
    setValues((prev) =>
      prev.includes(item)
        ? prev.filter((x) => x !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="fieldGroup">
      <label>{title}</label>
      <div className="multiGrid">
        {options.map((item) => (
          <button
            type="button"
            key={item}
            className={`multiOption ${
              values.includes(item) ? "selected" : ""
            }`}
            onClick={() => toggle(item)}
          >
            <span>{values.includes(item) ? "✓" : ""}</span>
            {item}
          </button>
        ))}
      </div>

      {values.length > 0 && (
        <div className="selectedCount">
          {values.length} seleccionada{values.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

function Login({ onLogin }) {
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");

  const ingresar = (e) => {
    e.preventDefault();
    setError("");

    const normalized = mail.trim().toLowerCase();

    if (normalized === ADMIN_MAIL) {
      onLogin({ admin: true });
      return;
    }

    const asesor = ASESORES.find(
      (item) => item[2].toLowerCase() === normalized
    );

    if (!asesor) {
      setError(
        "No encontramos ese mail. Ingresá el mail institucional asociado a tu portal."
      );
      return;
    }

    onLogin({
      admin: false,
      nombre: asesor[0],
      usuario: asesor[1],
      email: asesor[2],
    });
  };

  return (
    <main className="loginPage">
      <div className="loginCard">
        <div className="brandMark">PC</div>

        <div className="brand">PORTAL DE CALIDAD</div>

        <h1>Ingresá a tu portal</h1>

        <p>
          Consultá tu evolución, objetivos y acciones de calidad.
        </p>

        <form onSubmit={ingresar}>
          <label>Mail institucional</label>

          <input
            type="email"
            placeholder="nombre.apellido@portalcalidad.com"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            autoComplete="email"
          />

          {error && <div className="errorBox">{error}</div>}

          <button className="primaryButton" type="submit">
            INGRESAR
          </button>
        </form>
      </div>
    </main>
  );
}

function MultiText({ value }) {
  return (
    <div className="tagList">
      {parseArray(value).map((item) => (
        <span className="tag" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

function Header({ nombre, admin, logout }) {
  return (
    <header className="topHeader">
      <div>
        <div className="brand">PORTAL DE CALIDAD</div>

        {admin ? (
          <h1>Panel de Calidad</h1>
        ) : (
          <>
            <h1>Hola, {nombre?.split(",")[1]?.trim() || nombre}</h1>
            <div className="weekLabel">Semana 3 - Agosto</div>
          </>
        )}
      </div>

      <div className="headerRight">
        {!admin && <span className="statusPill">EN SEGUIMIENTO</span>}

        <button onClick={logout} className="logout">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

function AdvisorPortal({ user, report, logout }) {
  const [active, setActive] = useState("calidad");

  const menu = [
    ["calidad", "CALIDAD"],
    ["productividad", "PRODUCTIVIDAD"],
    ["tipificaciones", "TIPIFICACIONES"],
    ["auditorias", "AUDITORÍAS"],
    ["actividades", "ACTIVIDADES"],
    ["historico", "HISTÓRICO"],
    ["feedback", "FEEDBACK"],
  ];

  if (!report) {
    return (
      <div className="app">
        <Header nombre={user.nombre} logout={logout} />

        <nav className="tabs">
          {menu.map(([id, label]) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              onClick={() => setActive(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <section className="emptyCard">
          <div className="emptyIcon">01</div>
          <h2>Todavía no hay un reporte cargado.</h2>
          <p>
            Cuando Calidad cargue tu reporte, aparecerá automáticamente acá.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="app">
      <Header nombre={user.nombre} logout={logout} />

      <nav className="tabs">
        {menu.map(([id, label]) => (
          <button
            key={id}
            className={active === id ? "active" : ""}
            onClick={() => setActive(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {active === "calidad" && (
        <section className="reportSection">
          <div className="sectionNumber">01</div>
          <h2>CALIDAD</h2>

          <div className="heroScore">
            <div>
              <span>NOTA</span>
              <strong>{report.nota || "-"}</strong>
              <small>/ 100</small>
            </div>

            <div>
              <span>OBJETIVO</span>
              <strong>{report.objetivo || "-"}</strong>
            </div>

            <div>
              <span>ESTADO</span>
              <strong>{report.estado_objetivo || "-"}</strong>
            </div>

            <div>
              <span>PRODUCTO</span>
              <strong>{report.producto || "-"}</strong>
            </div>
          </div>

          <div className="progressCard">
            <span>Progreso hacia el objetivo</span>
            <strong>
              {report.nota && report.objetivo
                ? `${Math.min(
                    100,
                    Math.round(
                      (Number(report.nota) / Number(report.objetivo)) * 100
                    )
                  )}%`
                : "-"}
            </strong>
          </div>

          <div className="infoGrid">
            <div>
              <label>DESVÍO PRINCIPAL</label>
              <strong>{report.desvio || "-"}</strong>
            </div>

            <div>
              <label>RECOMENDACIÓN</label>
              <strong>{report.recomendacion || "-"}</strong>
            </div>

            <div>
              <label>OBJETIVO DE TRABAJO</label>
              <strong>{report.gestion || "-"}</strong>
            </div>
          </div>

          <div className="contentBlock">
            <h3>COMPARATIVO SEMANAL</h3>
            <p>
              {report.evolucion ||
                "Todavía no hay una semana anterior para comparar."}
            </p>
          </div>

          <div className="contentBlock">
            <h3>ITEMS TRABAJADOS</h3>
            <MultiText value={report.items_calidad} />
          </div>

          <div className="contentBlock">
            <h3>ACCIONES REALIZADAS</h3>
            <MultiText value={report.acciones_calidad} />
          </div>

          <div className="contentBlock">
            <h3>AUDITORÍA</h3>

            <div className="auditBox">
              <div>
                <span>ESTADO</span>
                <strong>{report.auditoria || "Sin información"}</strong>
              </div>

              {report.observaciones && (
                <div>
                  <span>OBSERVACIONES</span>
                  <p>{report.observaciones}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {active === "productividad" && (
        <section className="reportSection">
          <div className="sectionNumber">02</div>
          <h2>PRODUCTIVIDAD</h2>

          <div className="heroScore productivity">
            <div>
              <span>SPH</span>
              <strong>{report.sph || "-"}</strong>
            </div>

            <div>
              <span>OBJETIVO SPH</span>
              <strong>{report.objetivo_sph || "-"}</strong>
            </div>

            <div>
              <span>VENTAS</span>
              <strong>{report.ventas || "-"}</strong>
            </div>

            <div>
              <span>OBJETIVO VENTAS</span>
              <strong>{report.objetivo_ventas || "-"}</strong>
            </div>
          </div>

          <div className="infoGrid">
            <div>
              <label>OBJETIVO DE CAMPAÑA</label>
              <strong>{report.objetivo_campania || "-"}</strong>
            </div>

            <div>
              <label>ESTADO</label>
              <strong>{report.estado_campania || "-"}</strong>
            </div>
          </div>

          <div className="contentBlock">
            <h3>ITEMS TRABAJADOS</h3>
            <MultiText value={report.items_productividad} />
          </div>

          <div className="contentBlock">
            <h3>ACCIONES REALIZADAS</h3>
            <MultiText value={report.acciones_productividad} />
          </div>

          <div className="contentBlock">
            <h3>OBSERVACIONES</h3>
            <p>{report.observaciones || "No hay observaciones cargadas."}</p>
          </div>
        </section>
      )}

      {active === "tipificaciones" && (
        <section className="reportSection">
          <div className="sectionNumber">03</div>
          <h2>TIPIFICACIONES</h2>

          <div className="heroScore">
            <div>
              <span>ESTADO</span>
              <strong>{report.estado_tipificaciones || "-"}</strong>
            </div>

            <div>
              <span>DESVÍO</span>
              <strong>{report.tipificacion_desvio || "-"}</strong>
            </div>

            <div>
              <span>OBJETIVO</span>
              <strong>{report.tipificacion_objetivo || "-"}</strong>
            </div>

            <div>
              <span>RESULTADO</span>
              <strong>{report.tipificacion_resultado || "-"}</strong>
            </div>
          </div>

          <div className="contentBlock">
            <h3>TIPIFICACIONES REALIZADAS</h3>
            <MultiText value={report.tipificaciones} />
          </div>

          <div className="contentBlock">
            <h3>COMPROMISO</h3>
            <p>{report.tipificacion_compromiso || "-"}</p>
          </div>

          <div className="contentBlock">
            <h3>OBSERVACIONES</h3>
            <p>
              {report.tipificacion_observaciones ||
                "Sin observaciones cargadas."}
            </p>
          </div>
        </section>
      )}

      {active === "auditorias" && (
        <section className="reportSection">
          <div className="sectionNumber">04</div>
          <h2>AUDITORÍAS DE NO VENTAS</h2>

          <div className="heroScore">
            <div>
              <span>CANTIDAD</span>
              <strong>{report.cantidad_no_ventas || "-"}</strong>
            </div>

            <div>
              <span>COACHING</span>
              <strong>{report.coaching_no_ventas || "-"}</strong>
            </div>

            <div>
              <span>REGISTRO EN SISTEMA</span>
              <strong>{report.registro_sistema || "-"}</strong>
            </div>

            <div>
              <span>COMPROMISO</span>
              <strong>{report.compromiso_no_ventas || "-"}</strong>
            </div>
          </div>

          <div className="contentBlock">
            <h3>PRINCIPALES O.M.</h3>
            <MultiText value={report.om_detectadas} />
          </div>

          <div className="contentBlock">
            <h3>FORTALEZAS</h3>
            <MultiText value={report.fortalezas} />
          </div>

          <div className="contentBlock">
            <h3>OBSERVACIONES</h3>
            <p>
              {report.observaciones_no_ventas ||
                "No hay observaciones cargadas."}
            </p>
          </div>
        </section>
      )}

      {active === "actividades" && (
        <section className="reportSection">
          <div className="sectionNumber">05</div>
          <h2>ACTIVIDADES</h2>

          <div className="emptyCard inside">
            <div className="plus">+</div>
            <h3>Próximamente</h3>
            <p>
              Esta sección quedará disponible para registrar y consultar
              actividades.
            </p>
          </div>
        </section>
      )}

      {active === "historico" && (
        <section className="reportSection">
          <div className="sectionNumber">06</div>
          <h2>HISTÓRICO</h2>

          <div className="emptyCard inside">
            <h3>Histórico de evolución</h3>
            <p>
              Acá aparecerán los reportes anteriores del asesor.
            </p>
          </div>
        </section>
      )}

      {active === "feedback" && (
        <section className="reportSection">
          <div className="sectionNumber">07</div>
          <h2>FEEDBACK DEL ASESOR</h2>

          <div className="feedbackCard">
            <h3>
              ¿Querés dejar algún comentario sobre tu reporte, una consulta o
              algo que quieras trabajar con Calidad?
            </h3>

            <textarea placeholder="Escribí tu comentario..." />

            <button className="primaryButton">ENVIAR FEEDBACK</button>
          </div>
        </section>
      )}
    </div>
  );
}

function AdminPanel({ logout }) {
  const emptyForm = {
    asesor: "",
    usuario: "",
    semana: "Semana 3 - Agosto",
    nota: "",
    objetivo: "",
    estado_objetivo: "",
    producto: "AP",
    desvio: "",
    recomendacion: "",
    gestion: "",
    evolucion: "",
    observaciones: "",
    items_calidad: [],
    acciones_calidad: [],
    auditoria: "",
    observaciones_auditoria: "",
    sph: "",
    objetivo_sph: "",
    ventas: "",
    objetivo_ventas: "",
    objetivo_campania: "",
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
    observaciones_no_ventas: "",
    audio_url: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [audio, setAudio] = useState(null);
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const cargarHistorial = async () => {
    if (!supabase) return;

    const { data } = await supabase
      .from("reportes")
      .select("*")
      .order("id", { ascending: false });

    if (data) setReports(data);
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const guardarReporte = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage(
        "No está configurada la conexión con Supabase. Revisá las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel."
      );
      return;
    }

    if (!form.asesor) {
      setMessage("Seleccioná un asesor.");
      return;
    }

    const asesor = ASESORES.find((a) => a[0] === form.asesor);

    const payload = {
      ...form,
      usuario: asesor?.[1] || "",
      items_calidad: JSON.stringify(form.items_calidad),
      acciones_calidad: JSON.stringify(form.acciones_calidad),
      items_productividad: JSON.stringify(form.items_productividad),
      acciones_productividad: JSON.stringify(form.acciones_productividad),
      tipificaciones: JSON.stringify(form.tipificaciones),
      om_detectadas: JSON.stringify(form.om_detectadas),
      fortalezas: JSON.stringify(form.fortalezas),
      audio_url: form.audio_url || null,
    };

    delete payload.asesor;

    const { error } = await supabase.from("reportes").insert({
      asesor: form.asesor,
      ...payload,
    });

    if (error) {
      console.error(error);
      setMessage(
        `No se pudo guardar el reporte: ${error.message}`
      );
      return;
    }

    setMessage("✓ REPORTE GUARDADO CORRECTAMENTE");
    setForm(emptyForm);
    setAudio(null);
    cargarHistorial();
  };

  return (
    <div className="adminPage">
      <Header admin logout={logout} />

      <div className="adminIntro">
        <span>ADMINISTRACIÓN</span>
        <h2>Cargar nuevo reporte</h2>
        <p>
          Completá la información y el reporte quedará disponible para el
          asesor.
        </p>
      </div>

      <form className="adminForm" onSubmit={guardarReporte}>
        <section className="adminSection">
          <div className="sectionNumber">01</div>
          <h2>Datos generales</h2>

          <div className="formGrid">
            <div className="fieldGroup">
              <label>Asesor</label>
              <select
                value={form.asesor}
                onChange={(e) => update("asesor", e.target.value)}
              >
                <option value="">Seleccioná un asesor</option>
                {ASESORES.map(([nombre, id]) => (
                  <option key={id} value={nombre}>
                    {nombre} — {id}
                  </option>
                ))}
              </select>
            </div>

            <div className="fieldGroup">
              <label>Semana / período</label>
              <input
                value={form.semana}
                onChange={(e) => update("semana", e.target.value)}
              />
            </div>

            <div className="fieldGroup">
              <label>Nota de calidad</label>
              <input
                type="number"
                value={form.nota}
                onChange={(e) => update("nota", e.target.value)}
              />
            </div>

            <div className="fieldGroup">
              <label>Objetivo de calidad</label>
              <input
                type="number"
                value={form.objetivo}
                onChange={(e) => update("objetivo", e.target.value)}
              />
            </div>

            <div className="fieldGroup">
              <label>Estado del objetivo</label>
              <select
                value={form.estado_objetivo}
                onChange={(e) => update("estado_objetivo", e.target.value)}
              >
                <option value="">Seleccionar</option>
                <option>ALCANZADO</option>
                <option>EN PROCESO</option>
                <option>DEBAJO DEL OBJETIVO</option>
              </select>
            </div>

            <div className="fieldGroup">
              <label>Producto</label>
              <select
                value={form.producto}
                onChange={(e) => update("producto", e.target.value)}
              >
                <option>AP</option>
                <option>BM</option>
              </select>
            </div>

            <div className="fieldGroup full">
              <label>Desvío principal</label>
              <input
                value={form.desvio}
                onChange={(e) => update("desvio", e.target.value)}
              />
            </div>

            <div className="fieldGroup full">
              <label>Recomendación</label>
              <textarea
                value={form.recomendacion}
                onChange={(e) => update("recomendacion", e.target.value)}
              />
            </div>

            <div className="fieldGroup full">
              <label>Objetivo de trabajo</label>
              <textarea
                value={form.gestion}
                onChange={(e) => update("gestion", e.target.value)}
              />
            </div>

            <div className="fieldGroup full">
              <label>Evolución / comparativo semanal</label>
              <textarea
                value={form.evolucion}
                onChange={(e) => update("evolucion", e.target.value)}
              />
            </div>
          </div>

          <ToggleGroup
            title="Items trabajados"
            options={ITEMS_CALIDAD}
            values={form.items_calidad}
            setValues={(fn) =>
              setForm((p) => ({
                ...p,
                items_calidad:
                  typeof fn === "function" ? fn(p.items_calidad) : fn,
              }))
            }
          />

          <ToggleGroup
            title="Acciones realizadas"
            options={ACCIONES_CALIDAD}
            values={form.acciones_calidad}
            setValues={(fn) =>
              setForm((p) => ({
                ...p,
                acciones_calidad:
                  typeof fn === "function" ? fn(p.acciones_calidad) : fn,
              }))
            }
          />
        </section>

        <section className="adminSection">
          <div className="sectionNumber">02</div>
          <h2>Auditoría</h2>

          <div className="formGrid">
            <div className="fieldGroup">
              <label>Estado de auditoría</label>
              <select
                value={form.auditoria}
                onChange={(e) => update("auditoria", e.target.value)}
              >
                <option value="">Seleccionar</option>
                <option>Correcta</option>
                <option>Con desvíos</option>
                <option>Requiere coaching</option>
                <option>Requiere seguimiento</option>
                <option>Sin información</option>
              </select>
            </div>

            <div className="fieldGroup full">
              <label>Observaciones de auditoría</label>
              <textarea
                value={form.observaciones_auditoria}
                onChange={(e) =>
                  update("observaciones_auditoria", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        <section className="adminSection">
          <div className="sectionNumber">03</div>
          <h2>Productividad</h2>

          <div className="formGrid">
            <div className="fieldGroup">
              <label>SPH</label>
              <input
                value={form.sph}
                onChange={(e) => update("sph", e.target.value)}
              />
            </div>

            <div className="fieldGroup">
              <label>Objetivo SPH</label>
              <input
                value={form.objetivo_sph}
                onChange={(e) => update("objetivo_sph", e.target.value)}
              />
            </div>

            <div className="fieldGroup">
              <label>Ventas</label>
              <input
                value={form.ventas}
                onChange={(e) => update("ventas", e.target.value)}
              />
            </div>

            <div className="fieldGroup">
              <label>Objetivo ventas</label>
              <input
                value={form.objetivo_ventas}
                onChange={(e) => update("objetivo_ventas", e.target.value)}
              />
            </div>

            <div className="fieldGroup">
              <label>Objetivo de campaña</label>
              <input
                value={form.objetivo_campania}
                onChange={(e) => update("objetivo_campania", e.target.value)}
              />
            </div>

            <div className="fieldGroup">
              <label>Estado campaña</label>
              <select
                value={form.estado_campania}
                onChange={(e) => update("estado_campania", e.target.value)}
              >
                <option value="">Seleccionar</option>
                <option>ALCANZADO</option>
                <option>EN PROCESO</option>
                <option>DEBAJO DEL OBJETIVO</option>
              </select>
            </div>

            <div className="fieldGroup full">
              <label>Observaciones de productividad</label>
              <textarea
                value={form.observaciones_productividad}
                onChange={(e) =>
                  update("observaciones_productividad", e.target.value)
                }
              />
            </div>
          </div>

          <ToggleGroup
            title="Items trabajados"
            options={ITEMS_PRODUCTIVIDAD}
            values={form.items_productividad}
            setValues={(fn) =>
              setForm((p) => ({
                ...p,
                items_productividad:
                  typeof fn === "function"
                    ? fn(p.items_productividad)
                    : fn,
              }))
            }
          />

          <ToggleGroup
            title="Acciones realizadas"
            options={ACCIONES_PRODUCTIVIDAD}
            values={form.acciones_productividad}
            setValues={(fn) =>
              setForm((p) => ({
                ...p,
                acciones_productividad:
                  typeof fn === "function"
                    ? fn(p.acciones_productividad)
                    : fn,
              }))
            }
          />
        </section>

        <section className="adminSection">
          <div className="sectionNumber">04</div>
          <h2>Tipificaciones</h2>

          <ToggleGroup
            title="Tipificaciones realizadas"
            options={TIPIFICACIONES}
            values={form.tipificaciones}
            setValues={(fn) =>
              setForm((p) => ({
                ...p,
                tipificaciones:
                  typeof fn === "function" ? fn(p.tipificaciones) : fn,
              }))
            }
          />

          <div className="formGrid">
            <div className="fieldGroup">
              <label>Objetivo tipificaciones</label>
              <input
                value={form.objetivo_tipificaciones}
                onChange={(e) =>
                  update("objetivo_tipificaciones", e.target.value)
                }
              />
            </div>

            <div className="fieldGroup">
              <label>Estado tipificaciones</label>
              <select
                value={form.estado_tipificaciones}
                onChange={(e) =>
                  update("estado_tipificaciones", e.target.value)
                }
              >
                <option value="">Seleccionar</option>
                <option>ALCANZADO</option>
                <option>EN PROCESO</option>
                <option>DEBAJO DEL OBJETIVO</option>
              </select>
            </div>

            <div className="fieldGroup">
              <label>Desvío</label>
              <input
                value={form.tipificacion_desvio}
                onChange={(e) =>
                  update("tipificacion_desvio", e.target.value)
                }
              />
            </div>

            <div className="fieldGroup">
              <label>Objetivo</label>
              <input
                value={form.tipificacion_objetivo}
                onChange={(e) =>
                  update("tipificacion_objetivo", e.target.value)
                }
              />
            </div>

            <div className="fieldGroup">
              <label>Resultado</label>
              <input
                value={form.tipificacion_resultado}
                onChange={(e) =>
                  update("tipificacion_resultado", e.target.value)
                }
              />
            </div>

            <div className="fieldGroup">
              <label>Compromiso</label>
              <input
                value={form.tipificacion_compromiso}
                onChange={(e) =>
                  update("tipificacion_compromiso", e.target.value)
                }
              />
            </div>

            <div className="fieldGroup full">
              <label>Observaciones</label>
              <textarea
                value={form.tipificacion_observaciones}
                onChange={(e) =>
                  update("tipificacion_observaciones", e.target.value)
                }
              />
            </div>
          </div>
        </section>

        <section className="adminSection">
          <div className="sectionNumber">05</div>
          <h2>Auditorías de no ventas</h2>

          <div className="formGrid">
            <div className="fieldGroup">
              <label>Cantidad</label>
              <input
                value={form.cantidad_no_ventas}
                onChange={(e) =>
                  update("cantidad_no_ventas", e.target.value)
                }
              />
            </div>

            <div className="fieldGroup">
              <label>Coaching</label>
              <input
                value={form.coaching_no_ventas}
                onChange={(e) =>
                  update("coaching_no_ventas", e.target.value)
                }
              />
            </div>

            <div className="fieldGroup">
              <label>Registro en sistema</label>
              <select
                value={form.registro_sistema}
                onChange={(e) =>
                  update("registro_sistema", e.target.value)
                }
              >
                <option value="">Seleccionar</option>
                <option>CORRECTA</option>
                <option>INCORRECTA</option>
                <option>PENDIENTE</option>
              </select>
            </div>

            <div className="fieldGroup">
              <label>Compromiso</label>
              <input
                value={form.compromiso_no_ventas}
                onChange={(e) =>
                  update("compromiso_no_ventas", e.target.value)
                }
              />
            </div>

            <div className="fieldGroup full">
              <label>Observaciones</label>
              <textarea
                value={form.observaciones_no_ventas}
                onChange={(e) =>
                  update("observaciones_no_ventas", e.target.value)
                }
              />
            </div>
          </div>

          <ToggleGroup
            title="Principales O.M."
            options={OM}
            values={form.om_detectadas}
            setValues={(fn) =>
              setForm((p) => ({
                ...p,
                om_detectadas:
                  typeof fn === "function" ? fn(p.om_detectadas) : fn,
              }))
            }
          />

          <ToggleGroup
            title="Fortalezas"
            options={FORTALEZAS}
            values={form.fortalezas}
            setValues={(fn) =>
              setForm((p) => ({
                ...p,
                fortalezas:
                  typeof fn === "function" ? fn(p.fortalezas) : fn,
              }))
            }
          />
        </section>

        <section className="adminSection">
          <div className="sectionNumber">06</div>
          <h2>Audio de auditoría</h2>

          <div className="audioUpload">
            <label htmlFor="audio">♪ Seleccionar audio</label>

            <input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setAudio(file || null);
              }}
            />

            {audio && (
              <div className="audioName">
                ✓ {audio.name}
              </div>
            )}

            <p>MP3, WAV, M4A u otro formato compatible.</p>

            <small>
              El audio corresponde a la auditoría y queda asociado al reporte.
            </small>
          </div>
        </section>

        {message && (
          <div
            className={
              message.startsWith("✓")
                ? "successBox"
                : "errorBox adminMessage"
            }
          >
            {message}
          </div>
        )}

        <button className="saveButton" type="submit">
          GUARDAR REPORTE
        </button>
      </form>

      <section className="history">
        <div className="adminIntro">
          <span>HISTÓRICO</span>
          <h2>Reportes cargados</h2>
        </div>

        <div className="historyTable">
          <div className="historyHeader">
            <span>Asesor</span>
            <span>Semana</span>
            <span>Nota</span>
            <span>Producto</span>
          </div>

          {reports.map((r) => (
            <div className="historyRow" key={r.id}>
              <span>{r.asesor}</span>
              <span>{r.semana}</span>
              <strong>{r.nota}</strong>
              <span>{r.producto}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  const [user, setUser] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscarReporte = async (usuario) => {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from("reportes")
      .select("*")
      .eq("usuario", usuario)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  };

  const login = async (data) => {
    setLoading(true);

    if (data.admin) {
      setUser(data);
      setLoading(false);
      return;
    }

    const found = await buscarReporte(data.usuario);

    setUser(data);
    setReport(found);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setReport(null);
  };

  if (!user) {
    return (
      <>
        <Login onLogin={login} />

        {loading && (
          <div className="loadingOverlay">
            Cargando portal...
          </div>
        )}

        <style jsx global>{styles}</style>
      </>
    );
  }

  return (
    <>
      {user.admin ? (
        <AdminPanel logout={logout} />
      ) : (
        <AdvisorPortal user={user} report={report} logout={logout} />
      )}

      <style jsx global>{styles}</style>
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
  background: #eef5f5;
  color: #12363b;
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

.loginPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background:
    radial-gradient(circle at top right, rgba(36, 130, 136, .18), transparent 35%),
    linear-gradient(135deg, #edf7f7, #dcecec);
}

.loginCard {
  width: 100%;
  max-width: 470px;
  background: white;
  padding: 42px;
  border-radius: 28px;
  box-shadow: 0 25px 70px rgba(18, 54, 59, .14);
  border: 1px solid #d7e7e7;
}

.brandMark {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f5960;
  color: white;
  font-weight: 900;
  margin-bottom: 20px;
}

.brand {
  color: #0f5960;
  font-weight: 900;
  letter-spacing: 1.5px;
  font-size: 13px;
}

.loginCard h1 {
  font-size: 34px;
  margin: 12px 0 8px;
  color: #12363b;
}

.loginCard p {
  color: #668084;
  line-height: 1.6;
  margin-bottom: 30px;
}

label {
  display: block;
  color: #426267;
  font-weight: 800;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .7px;
  margin-bottom: 8px;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #cddede;
  background: #fbfefe;
  border-radius: 12px;
  padding: 13px 14px;
  color: #173d42;
  outline: none;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #19838a;
  box-shadow: 0 0 0 3px rgba(25,131,138,.10);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.primaryButton,
.saveButton {
  width: 100%;
  border: 0;
  background: #0f5960;
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  font-weight: 900;
  margin-top: 18px;
}

.primaryButton:hover,
.saveButton:hover {
  background: #0b464c;
}

.errorBox {
  margin-top: 14px;
  padding: 13px 15px;
  border-radius: 12px;
  background: #fff1f0;
  color: #a23b35;
  border: 1px solid #f0c5c1;
  font-weight: 700;
}

.successBox {
  margin: 20px 0;
  padding: 15px;
  border-radius: 12px;
  background: #e8f7ef;
  color: #167044;
  border: 1px solid #b8dfca;
  font-weight: 800;
}

.loadingOverlay {
  position: fixed;
  inset: 0;
  background: rgba(10,40,44,.25);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  z-index: 20;
}

.app,
.adminPage {
  min-height: 100vh;
  background: #eef5f5;
}

.topHeader {
  background: white;
  padding: 30px 6vw 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  border-bottom: 1px solid #d9e8e8;
}

.topHeader h1 {
  margin: 7px 0 3px;
  font-size: 30px;
  color: #12363b;
}

.weekLabel {
  color: #6a8387;
  font-weight: 700;
}

.headerRight {
  display: flex;
  align-items: center;
  gap: 14px;
}

.statusPill {
  padding: 9px 13px;
  border-radius: 999px;
  background: #e3f2ef;
  color: #0f6863;
  font-weight: 900;
  font-size: 11px;
}

.logout {
  background: transparent;
  border: 0;
  color: #687d80;
  font-weight: 800;
}

.tabs {
  display: flex;
  gap: 6px;
  padding: 14px 6vw;
  background: white;
  border-bottom: 1px solid #d9e8e8;
  overflow-x: auto;
}

.tabs button {
  border: 0;
  background: transparent;
  color: #6c8083;
  font-weight: 900;
  padding: 11px 15px;
  border-radius: 10px;
  white-space: nowrap;
}

.tabs button.active {
  background: #0f5960;
  color: white;
}

.reportSection {
  max-width: 1120px;
  margin: 30px auto;
  background: white;
  border-radius: 24px;
  padding: 35px;
  box-shadow: 0 12px 40px rgba(18,54,59,.08);
}

.sectionNumber {
  color: #18939a;
  font-size: 12px;
  font-weight: 900;
  margin-bottom: 8px;
}

.reportSection h2,
.adminSection h2 {
  margin: 0 0 25px;
  color: #12363b;
  font-size: 25px;
}

.heroScore {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.heroScore > div {
  padding: 20px;
  border-radius: 16px;
  background: #eef7f7;
  border: 1px solid #d8eaea;
}

.heroScore span,
.infoGrid label,
.auditBox span {
  display: block;
  font-size: 10px;
  font-weight: 900;
  color: #789093;
  letter-spacing: .7px;
  margin-bottom: 8px;
}

.heroScore strong {
  display: block;
  font-size: 25px;
  color: #0f5960;
}

.heroScore small {
  color: #7c9194;
}

.progressCard {
  background: #0f5960;
  color: white;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.progressCard strong {
  font-size: 22px;
}

.infoGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 25px;
}

.infoGrid > div {
  border: 1px solid #e0ebeb;
  border-radius: 15px;
  padding: 18px;
}

.infoGrid strong {
  color: #16474d;
}

.contentBlock {
  padding: 24px 0;
  border-top: 1px solid #e3eeee;
}

.contentBlock h3 {
  margin: 0 0 14px;
  font-size: 12px;
  color: #557276;
  letter-spacing: 1px;
}

.contentBlock p {
  color: #587175;
  line-height: 1.6;
}

.tagList,
.multiGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #e7f3f2;
  color: #14666a;
  padding: 9px 12px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
}

.auditBox {
  background: #f4f9f9;
  border-radius: 16px;
  padding: 18px;
}

.auditBox strong {
  color: #0f5960;
}

.emptyCard {
  max-width: 1120px;
  margin: 30px auto;
  background: white;
  padding: 50px;
  text-align: center;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(18,54,59,.08);
}

.emptyCard.inside {
  margin: 0;
  box-shadow: none;
  background: #f5fafa;
}

.emptyIcon,
.plus {
  font-weight: 900;
  color: #15929a;
}

.adminIntro {
  max-width: 1120px;
  margin: 30px auto 15px;
}

.adminIntro > span {
  color: #15929a;
  font-weight: 900;
  font-size: 11px;
  letter-spacing: 1px;
}

.adminIntro h2 {
  margin: 8px 0 5px;
  color: #12363b;
}

.adminIntro p {
  color: #708589;
}

.adminForm,
.history {
  max-width: 1120px;
  margin: 0 auto;
}

.adminSection {
  background: white;
  padding: 30px;
  margin-bottom: 18px;
  border-radius: 22px;
  box-shadow: 0 8px 30px rgba(18,54,59,.06);
}

.formGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.fieldGroup.full {
  grid-column: 1 / -1;
}

.fieldGroup {
  margin-bottom: 5px;
}

.multiGrid {
  margin-top: 10px;
}

.multiOption {
  border: 1px solid #d6e5e5;
  background: #f8fbfb;
  color: #506b70;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 700;
  text-align: left;
}

.multiOption span {
  margin-right: 5px;
}

.multiOption.selected {
  background: #dff1ef;
  border-color: #78bbb6;
  color: #0e625f;
}

.selectedCount {
  margin-top: 10px;
  color: #15929a;
  font-size: 12px;
  font-weight: 900;
}

.audioUpload {
  border: 2px dashed #b8d4d4;
  background: #f6fbfb;
  padding: 30px;
  text-align: center;
  border-radius: 18px;
}

.audioUpload label {
  display: inline-block;
  background: #0f5960;
  color: white;
  padding: 13px 18px;
  border-radius: 11px;
  cursor: pointer;
}

.audioUpload input {
  display: none;
}

.audioUpload p,
.audioUpload small {
  color: #73898c;
}

.audioName {
  margin-top: 15px;
  color: #14705f;
  font-weight: 900;
}

.saveButton {
  max-width: 1120px;
  display: block;
  margin: 20px auto 40px;
}

.adminMessage {
  max-width: 1120px;
  margin-left: auto;
  margin-right: auto;
}

.history {
  padding-bottom: 60px;
}

.historyTable {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(18,54,59,.06);
}

.historyHeader,
.historyRow {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr;
  gap: 10px;
  padding: 16px 20px;
}

.historyHeader {
  background: #0f5960;
  color: white;
  font-weight: 900;
}

.historyRow {
  border-bottom: 1px solid #e5eeee;
  color: #587175;
}

.historyRow strong {
  color: #0f5960;
}

@media (max-width: 800px) {
  .topHeader {
    flex-direction: column;
  }

  .heroScore,
  .infoGrid,
  .formGrid {
    grid-template-columns: 1fr;
  }

  .fieldGroup.full {
    grid-column: auto;
  }

  .reportSection,
  .adminSection {
    margin-left: 15px;
    margin-right: 15px;
    padding: 22px;
  }

  .adminIntro {
    margin-left: 20px;
    margin-right: 20px;
  }

  .history {
    margin-left: 15px;
    margin-right: 15px;
  }
}
`;
