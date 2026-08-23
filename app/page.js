"use client";

import { useEffect, useMemo, useState } from "react";

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
  "Seguridad comercial",
  "Buena comunicación",
  "Correcto manejo de objeciones",
];

function getStoredReports() {
  try {
    return JSON.parse(localStorage.getItem("portal_reportes") || "[]");
  } catch {
    return [];
  }
}

function saveStoredReports(reports) {
  localStorage.setItem("portal_reportes", JSON.stringify(reports));
}

function MultiSelect({ options, value, onChange }) {
  const toggle = (item) => {
    if (value.includes(item)) {
      onChange(value.filter((x) => x !== item));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="multiBox">
      <div className="multiCount">
        {value.length} seleccionada{value.length === 1 ? "" : "s"}
      </div>

      <div className="multiOptions">
        {options.map((item) => (
          <button
            type="button"
            key={item}
            className={`multiOption ${value.includes(item) ? "selected" : ""}`}
            onClick={() => toggle(item)}
          >
            <span>{value.includes(item) ? "✓" : ""}</span>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <section className="adminSection">
      <div className="sectionNumber">{number}</div>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Badge({ children, type = "default" }) {
  return <span className={`badge ${type}`}>{children}</span>;
}

export default function Page() {
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [loginError, setLoginError] = useState("");
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("calidad");
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const [form, setForm] = useState({
    asesor: "",
    usuario: "",
    semana: "",
    nota: "",
    objetivo: "70",
    estado_objetivo: "DEBAJO DEL OBJETIVO",
    producto: "AP",
    desvio: "",
    recomendacion: "",
    objetivo_trabajo: "",
    items_calidad: [],
    acciones_calidad: [],
    auditoria: "",
    estado_auditoria: "Sin información",
    observaciones_auditoria: "",
    audio_url: "",
    audio_name: "",
    audio_data: "",

    sph: "",
    objetivo_sph: "",
    ventas: "",
    objetivo_ventas: "",
    objetivo_campania: "",
    estado_sph: "En proceso",
    estado_ventas: "En proceso",
    estado_campania: "En proceso",
    items_productividad: [],
    acciones_productividad: [],
    observaciones_productividad: "",

    objetivo_tipificaciones: "",
    tipificaciones: [],
    estado_tipificaciones: "En proceso",
    tipificacion_desvio: "",
    tipificacion_objetivo: "",
    tipificacion_resultado: "",
    tipificacion_compromiso: "",
    tipificacion_observaciones: "",

    cantidad_no_ventas: "",
    om_detectadas: [],
    coaching_no_ventas: "",
    registro_sistema: "CORRECTA",
    compromiso_no_ventas: "",
    fortalezas: [],
    observaciones_no_ventas: "",
    observaciones_generales: "",
  });

  useEffect(() => {
    const current = getStoredReports();
    setReports(current);
  }, []);

  const selectedReport = useMemo(() => {
    if (!selectedAdvisor) return null;

    const found = reports
      .slice()
      .reverse()
      .find(
        (r) =>
          r.asesor === selectedAdvisor ||
          r.usuario === ASESORES.find((a) => a[0] === selectedAdvisor)?.[1]
      );

    return found || null;
  }, [reports, selectedAdvisor]);

  const isAdmin = email.trim().toLowerCase() === ADMIN_MAIL;

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === ADMIN_MAIL) {
      setScreen("admin");
      return;
    }

    const advisor = ASESORES.find(([, id]) =>
      cleanEmail.includes(id.toLowerCase())
    );

    if (!advisor) {
      setLoginError(
        "No encontramos ese mail. Ingresá el mail institucional asociado a tu portal."
      );
      return;
    }

    setSelectedAdvisor(advisor[0]);
    setActiveTab("calidad");
    setScreen("advisor");
  };

  const logout = () => {
    setScreen("login");
    setEmail("");
    setSelectedAdvisor("");
    setFeedback("");
    setFeedbackSent(false);
  };

  const startNewReport = () => {
    setForm({
      asesor: "",
      usuario: "",
      semana: "",
      nota: "",
      objetivo: "70",
      estado_objetivo: "DEBAJO DEL OBJETIVO",
      producto: "AP",
      desvio: "",
      recomendacion: "",
      objetivo_trabajo: "",
      items_calidad: [],
      acciones_calidad: [],
      auditoria: "",
      estado_auditoria: "Sin información",
      observaciones_auditoria: "",
      audio_url: "",
      audio_name: "",
      audio_data: "",

      sph: "",
      objetivo_sph: "",
      ventas: "",
      objetivo_ventas: "",
      objetivo_campania: "",
      estado_sph: "En proceso",
      estado_ventas: "En proceso",
      estado_campania: "En proceso",
      items_productividad: [],
      acciones_productividad: [],
      observaciones_productividad: "",

      objetivo_tipificaciones: "",
      tipificaciones: [],
      estado_tipificaciones: "En proceso",
      tipificacion_desvio: "",
      tipificacion_objetivo: "",
      tipificacion_resultado: "",
      tipificacion_compromiso: "",
      tipificacion_observaciones: "",

      cantidad_no_ventas: "",
      om_detectadas: [],
      coaching_no_ventas: "",
      registro_sistema: "CORRECTA",
      compromiso_no_ventas: "",
      fortalezas: [],
      observaciones_no_ventas: "",
      observaciones_generales: "",
    });
  };

  const handleAdvisorChange = (value) => {
    const found = ASESORES.find(([name]) => name === value);

    setForm((prev) => ({
      ...prev,
      asesor: value,
      usuario: found ? found[1] : "",
    }));
  };

  const handleAudio = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        audio_name: file.name,
        audio_data: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const saveReport = (e) => {
    e.preventDefault();

    if (!form.asesor || !form.semana || !form.nota) {
      alert("Completá Asesor, Semana / período y Nota de calidad.");
      return;
    }

    const report = {
      id: Date.now(),
      ...form,
      fecha: new Date().toISOString(),
    };

    const current = getStoredReports();
    const next = [...current, report];

    saveStoredReports(next);
    setReports(next);

    alert("✓ REPORTE GUARDADO CORRECTAMENTE");

    setActiveTab("historico");
  };

  const sendFeedback = () => {
    if (!feedback.trim()) return;

    setFeedbackSent(true);
    setFeedback("");
  };

  const progress = form.nota && form.objetivo
    ? Math.min(100, Math.round((Number(form.nota) / Number(form.objetivo)) * 100))
    : 0;

  if (screen === "login") {
    return (
      <>
        <style>{styles}</style>

        <main className="loginPage">
          <div className="loginCard">
            <div className="brandMark">PC</div>

            <div className="eyebrow">PORTAL DE CALIDAD</div>

            <h1>Ingresá a tu portal</h1>

            <p className="loginText">
              Consultá tu evolución, objetivos y acciones de calidad.
            </p>

            <form onSubmit={handleLogin}>
              <Field label="Mail">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresá tu mail"
                  required
                />
              </Field>

              {loginError && <div className="errorBox">{loginError}</div>}

              <button className="primaryButton" type="submit">
                INGRESAR
              </button>
            </form>

            <div className="loginHint">
              Acceso para asesores y administración
            </div>
          </div>
        </main>
      </>
    );
  }

  if (screen === "admin") {
    return (
      <>
        <style>{styles}</style>

        <main className="appPage">
          <header className="topHeader">
            <div>
              <div className="eyebrow light">PORTAL DE CALIDAD</div>
              <h1>Panel de Calidad</h1>
              <p>Carga y gestión de reportes</p>
            </div>

            <button className="logoutButton" onClick={logout}>
              Cerrar sesión
            </button>
          </header>

          <div className="adminWrap">
            <div className="adminTitle">
              <span>ADMINISTRACIÓN</span>
              <h2>Cargar nuevo reporte</h2>
              <p>
                Completá la información y el reporte quedará disponible para
                el asesor.
              </p>
            </div>

            <form onSubmit={saveReport}>
              <Section number="01" title="Datos generales">
                <div className="formGrid">
                  <Field label="Asesor">
                    <select
                      value={form.asesor}
                      onChange={(e) => handleAdvisorChange(e.target.value)}
                      required
                    >
                      <option value="">Seleccioná un asesor</option>
                      {ASESORES.map(([name, id]) => (
                        <option key={id} value={name}>
                          {name} — {id}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Semana / período">
                    <input
                      value={form.semana}
                      onChange={(e) => update("semana", e.target.value)}
                      placeholder="Ej.: Semana 3 - Agosto"
                      required
                    />
                  </Field>

                  <Field label="Nota de calidad">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.nota}
                      onChange={(e) => update("nota", e.target.value)}
                      placeholder="50"
                      required
                    />
                  </Field>

                  <Field label="Objetivo de calidad">
                    <input
                      type="number"
                      value={form.objetivo}
                      onChange={(e) => update("objetivo", e.target.value)}
                    />
                  </Field>

                  <Field label="Estado del objetivo">
                    <select
                      value={form.estado_objetivo}
                      onChange={(e) =>
                        update("estado_objetivo", e.target.value)
                      }
                    >
                      <option>ALCANZADO</option>
                      <option>EN PROCESO</option>
                      <option>DEBAJO DEL OBJETIVO</option>
                    </select>
                  </Field>

                  <Field label="Producto">
                    <select
                      value={form.producto}
                      onChange={(e) => update("producto", e.target.value)}
                    >
                      <option>AP</option>
                      <option>BM</option>
                    </select>
                  </Field>

                  <Field label="Desvío principal">
                    <input
                      value={form.desvio}
                      onChange={(e) => update("desvio", e.target.value)}
                      placeholder="Ej.: Validación de datos"
                    />
                  </Field>

                  <Field label="Recomendación">
                    <input
                      value={form.recomendacion}
                      onChange={(e) =>
                        update("recomendacion", e.target.value)
                      }
                      placeholder="Recomendación"
                    />
                  </Field>

                  <Field label="Objetivo de trabajo">
                    <input
                      value={form.objetivo_trabajo}
                      onChange={(e) =>
                        update("objetivo_trabajo", e.target.value)
                      }
                      placeholder="Objetivo"
                    />
                  </Field>
                </div>

                <h3>Items trabajados</h3>
                <p className="helper">Seleccioná todos los que correspondan.</p>

                <MultiSelect
                  options={ITEMS_CALIDAD}
                  value={form.items_calidad}
                  onChange={(v) => update("items_calidad", v)}
                />

                <h3>Acciones realizadas</h3>
                <p className="helper">Seleccioná todas las acciones realizadas.</p>

                <MultiSelect
                  options={ACCIONES_CALIDAD}
                  value={form.acciones_calidad}
                  onChange={(v) => update("acciones_calidad", v)}
                />

                <div className="audioInside">
                  <div>
                    <h3>Audio de auditoría</h3>
                    <p className="helper">
                      El audio se cargará dentro de Calidad.
                    </p>
                  </div>

                  <label className="audioButton">
                    <span>♪</span>
                    Seleccionar audio
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudio}
                      hidden
                    />
                  </label>

                  {form.audio_name && (
                    <div className="fileSelected">
                      ✓ {form.audio_name}
                    </div>
                  )}
                </div>

                <div className="formGrid">
                  <Field label="Observaciones de calidad">
                    <textarea
                      value={form.observaciones_generales}
                      onChange={(e) =>
                        update("observaciones_generales", e.target.value)
                      }
                      rows="4"
                    />
                  </Field>
                </div>
              </Section>

              <Section number="02" title="Auditoría">
                <p className="helper">
                  La auditoría se mostrará dentro de Calidad.
                </p>

                <div className="formGrid">
                  <Field label="Referencia de auditoría">
                    <input
                      value={form.auditoria}
                      onChange={(e) => update("auditoria", e.target.value)}
                      placeholder="Referencia o identificación"
                    />
                  </Field>

                  <Field label="Estado de auditoría">
                    <select
                      value={form.estado_auditoria}
                      onChange={(e) =>
                        update("estado_auditoria", e.target.value)
                      }
                    >
                      <option>Correcta</option>
                      <option>Con desvíos</option>
                      <option>Requiere coaching</option>
                      <option>Requiere seguimiento</option>
                      <option>Sin información</option>
                    </select>
                  </Field>
                </div>

                <Field label="Observaciones de auditoría">
                  <textarea
                    value={form.observaciones_auditoria}
                    onChange={(e) =>
                      update("observaciones_auditoria", e.target.value)
                    }
                    rows="4"
                  />
                </Field>
              </Section>

              <Section number="03" title="Productividad">
                <p className="helper">
                  Información que verá el asesor en su tarjeta de Productividad.
                </p>

                <div className="formGrid four">
                  <Field label="SPH">
                    <input
                      value={form.sph}
                      onChange={(e) => update("sph", e.target.value)}
                      placeholder="0.15"
                    />
                  </Field>

                  <Field label="Objetivo SPH">
                    <input
                      value={form.objetivo_sph}
                      onChange={(e) =>
                        update("objetivo_sph", e.target.value)
                      }
                      placeholder="0.50"
                    />
                  </Field>

                  <Field label="Ventas">
                    <input
                      value={form.ventas}
                      onChange={(e) => update("ventas", e.target.value)}
                      placeholder="12"
                    />
                  </Field>

                  <Field label="Objetivo ventas">
                    <input
                      value={form.objetivo_ventas}
                      onChange={(e) =>
                        update("objetivo_ventas", e.target.value)
                      }
                      placeholder="40"
                    />
                  </Field>

                  <Field label="Objetivo de campaña">
                    <input
                      value={form.objetivo_campania}
                      onChange={(e) =>
                        update("objetivo_campania", e.target.value)
                      }
                      placeholder="50"
                    />
                  </Field>

                  <Field label="Estado SPH">
                    <select
                      value={form.estado_sph}
                      onChange={(e) => update("estado_sph", e.target.value)}
                    >
                      <option>ALCANZADO</option>
                      <option>En proceso</option>
                      <option>DEBAJO DEL OBJETIVO</option>
                    </select>
                  </Field>

                  <Field label="Estado ventas">
                    <select
                      value={form.estado_ventas}
                      onChange={(e) =>
                        update("estado_ventas", e.target.value)
                      }
                    >
                      <option>ALCANZADO</option>
                      <option>En proceso</option>
                      <option>DEBAJO DEL OBJETIVO</option>
                    </select>
                  </Field>

                  <Field label="Estado campaña">
                    <select
                      value={form.estado_campania}
                      onChange={(e) =>
                        update("estado_campania", e.target.value)
                      }
                    >
                      <option>ALCANZADO</option>
                      <option>En proceso</option>
                      <option>DEBAJO DEL OBJETIVO</option>
                    </select>
                  </Field>
                </div>

                <h3>Items trabajados</h3>
                <p className="helper">Seleccioná todos los items de productividad.</p>

                <MultiSelect
                  options={ITEMS_PRODUCTIVIDAD}
                  value={form.items_productividad}
                  onChange={(v) => update("items_productividad", v)}
                />

                <h3>Acciones realizadas</h3>
                <p className="helper">Seleccioná todas las acciones.</p>

                <MultiSelect
                  options={ACCIONES_PRODUCTIVIDAD}
                  value={form.acciones_productividad}
                  onChange={(v) => update("acciones_productividad", v)}
                />

                <Field label="Observaciones de productividad">
                  <textarea
                    value={form.observaciones_productividad}
                    onChange={(e) =>
                      update("observaciones_productividad", e.target.value)
                    }
                    rows="4"
                  />
                </Field>
              </Section>

              <Section number="04" title="Tipificaciones">
                <p className="helper">
                  Seleccioná todas las tipificaciones correspondientes.
                </p>

                <h3>Tipificaciones realizadas</h3>

                <MultiSelect
                  options={TIPIFICACIONES}
                  value={form.tipificaciones}
                  onChange={(v) => update("tipificaciones", v)}
                />

                <div className="formGrid">
                  <Field label="Objetivo tipificaciones">
                    <input
                      value={form.objetivo_tipificaciones}
                      onChange={(e) =>
                        update("objetivo_tipificaciones", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Estado tipificaciones">
                    <select
                      value={form.estado_tipificaciones}
                      onChange={(e) =>
                        update("estado_tipificaciones", e.target.value)
                      }
                    >
                      <option>ALCANZADO</option>
                      <option>En proceso</option>
                      <option>DEBAJO DEL OBJETIVO</option>
                    </select>
                  </Field>

                  <Field label="Desvío">
                    <input
                      value={form.tipificacion_desvio}
                      onChange={(e) =>
                        update("tipificacion_desvio", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Objetivo">
                    <input
                      value={form.tipificacion_objetivo}
                      onChange={(e) =>
                        update("tipificacion_objetivo", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Resultado">
                    <input
                      value={form.tipificacion_resultado}
                      onChange={(e) =>
                        update("tipificacion_resultado", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Compromiso">
                    <input
                      value={form.tipificacion_compromiso}
                      onChange={(e) =>
                        update("tipificacion_compromiso", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <Field label="Observaciones">
                  <textarea
                    value={form.tipificacion_observaciones}
                    onChange={(e) =>
                      update("tipificacion_observaciones", e.target.value)
                    }
                    rows="4"
                  />
                </Field>
              </Section>

              <Section number="05" title="Auditorías de no ventas">
                <p className="helper">
                  Información adicional de las llamadas no convertidas.
                </p>

                <div className="formGrid">
                  <Field label="Cantidad">
                    <input
                      value={form.cantidad_no_ventas}
                      onChange={(e) =>
                        update("cantidad_no_ventas", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Coaching">
                    <input
                      value={form.coaching_no_ventas}
                      onChange={(e) =>
                        update("coaching_no_ventas", e.target.value)
                      }
                    />
                  </Field>

                  <Field label="Registro en sistema">
                    <select
                      value={form.registro_sistema}
                      onChange={(e) =>
                        update("registro_sistema", e.target.value)
                      }
                    >
                      <option>CORRECTA</option>
                      <option>INCORRECTA</option>
                      <option>PENDIENTE</option>
                    </select>
                  </Field>

                  <Field label="Compromiso">
                    <input
                      value={form.compromiso_no_ventas}
                      onChange={(e) =>
                        update("compromiso_no_ventas", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <h3>Principales O.M.</h3>
                <MultiSelect
                  options={OM}
                  value={form.om_detectadas}
                  onChange={(v) => update("om_detectadas", v)}
                />

                <h3>Fortalezas</h3>
                <MultiSelect
                  options={FORTALEZAS}
                  value={form.fortalezas}
                  onChange={(v) => update("fortalezas", v)}
                />

                <Field label="Observaciones">
                  <textarea
                    value={form.observaciones_no_ventas}
                    onChange={(e) =>
                      update("observaciones_no_ventas", e.target.value)
                    }
                    rows="4"
                  />
                </Field>
              </Section>

              <div className="saveArea">
                <button className="saveButton" type="submit">
                  GUARDAR REPORTE
                </button>
              </div>
            </form>

            <section className="historyAdmin">
              <div className="historyHeader">
                <div>
                  <span className="eyebrow">HISTÓRICO</span>
                  <h2>Reportes cargados</h2>
                </div>

                <button
                  type="button"
                  className="secondaryButton"
                  onClick={() => window.print()}
                >
                  Imprimir
                </button>
              </div>

              {reports.length === 0 ? (
                <div className="emptyBox">Todavía no hay reportes cargados.</div>
              ) : (
                <div className="tableWrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Asesor</th>
                        <th>Semana</th>
                        <th>Nota</th>
                        <th>Producto</th>
                      </tr>
                    </thead>

                    <tbody>
                      {reports
                        .slice()
                        .reverse()
                        .map((report) => (
                          <tr key={report.id}>
                            <td>{report.asesor}</td>
                            <td>{report.semana}</td>
                            <td>{report.nota}</td>
                            <td>{report.producto}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </main>
      </>
    );
  }

  const report = selectedReport;

  const advisorName = selectedAdvisor
    ? selectedAdvisor.split(",")[1]?.trim() || selectedAdvisor
    : "Asesor";

  const qualityProgress = report?.nota && report?.objetivo
    ? Math.min(
        100,
        Math.round((Number(report.nota) / Number(report.objetivo)) * 100)
      )
    : 0;

  const qualityGap =
    report?.nota && report?.objetivo
      ? Math.max(0, Number(report.objetivo) - Number(report.nota))
      : 0;

  const advisorTabs = [
    ["calidad", "CALIDAD"],
    ["productividad", "PRODUCTIVIDAD"],
    ["tipificaciones", "TIPIFICACIONES"],
    ["auditorias", "AUDITORÍAS"],
    ["actividades", "ACTIVIDADES"],
    ["historico", "HISTÓRICO"],
    ["feedback", "FEEDBACK"],
  ];

  return (
    <>
      <style>{styles}</style>

      <main className="appPage advisorPage">
        <header className="advisorHeader">
          <div>
            <div className="eyebrow">PORTAL DE CALIDAD</div>
            <h1>Hola, {advisorName}</h1>
            <p>{report?.semana || "Semana 3 - Agosto"}</p>
          </div>

          <div className="headerRight">
            <Badge
              type={
                report?.estado_objetivo === "ALCANZADO"
                  ? "success"
                  : report?.estado_objetivo === "DEBAJO DEL OBJETIVO"
                  ? "danger"
                  : "warning"
              }
            >
              {report?.estado_objetivo || "EN SEGUIMIENTO"}
            </Badge>

            <button className="logoutButton dark" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </header>

        <nav className="advisorNav">
          {advisorTabs.map(([key, label]) => (
            <button
              key={key}
              className={activeTab === key ? "active" : ""}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        {!report ? (
          <div className="advisorEmpty">
            <div className="emptyNumber">01</div>
            <h2>Todavía no hay un reporte cargado.</h2>
            <p>
              Cuando Calidad cargue tu reporte, aparecerá automáticamente acá.
            </p>
          </div>
        ) : (
          <div className="advisorContent">
            {activeTab === "calidad" && (
              <section className="advisorCard">
                <div className="cardTop">
                  <div>
                    <span className="cardNumber">01</span>
                    <h2>CALIDAD</h2>
                  </div>
                  <Badge
                    type={
                      report.estado_objetivo === "ALCANZADO"
                        ? "success"
                        : report.estado_objetivo === "DEBAJO DEL OBJETIVO"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {report.estado_objetivo}
                  </Badge>
                </div>

                <div className="qualityHero">
                  <div className="scoreCircle">
                    <strong>{report.nota}</strong>
                    <span>/ 100</span>
                  </div>

                  <div className="heroStats">
                    <div>
                      <span>OBJETIVO</span>
                      <strong>{report.objetivo}</strong>
                    </div>

                    <div>
                      <span>PRODUCTO</span>
                      <strong>{report.producto}</strong>
                    </div>

                    <div>
                      <span>CUÁNTO FALTA</span>
                      <strong>{qualityGap} puntos</strong>
                    </div>
                  </div>
                </div>

                <div className="progressBlock">
                  <div className="progressLabel">
                    <span>Progreso hacia el objetivo</span>
                    <strong>{qualityProgress}%</strong>
                  </div>
                  <div className="progress">
                    <div style={{ width: `${qualityProgress}%` }} />
                  </div>
                </div>

                <div className="infoGrid">
                  <div className="infoBox highlight">
                    <span>DESVÍO PRINCIPAL</span>
                    <strong>{report.desvio || "-"}</strong>
                  </div>

                  <div className="infoBox">
                    <span>COMPARATIVO SEMANAL</span>
                    <strong>
                      {report.evolucion ||
                        "Todavía no hay una semana anterior para comparar."}
                    </strong>
                  </div>
                </div>

                <div className="twoColumns">
                  <div className="contentBlock">
                    <h3>ITEMS TRABAJADOS</h3>
                    <div className="tagList">
                      {(report.items_calidad || []).map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>

                  <div className="contentBlock">
                    <h3>ACCIONES REALIZADAS</h3>
                    <div className="tagList">
                      {(report.acciones_calidad || []).map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="auditInside">
                  <h3>AUDITORÍA</h3>

                  <div className="auditGrid">
                    <div>
                      <span>REFERENCIA</span>
                      <strong>{report.auditoria || "Sin información"}</strong>
                    </div>

                    <div>
                      <span>ESTADO</span>
                      <strong>{report.estado_auditoria || "-"}</strong>
                    </div>
                  </div>

                  {report.audio_data && (
                    <div className="audioPlayer">
                      <span>AUDIO DE AUDITORÍA</span>
                      <audio controls src={report.audio_data} />
                    </div>
                  )}

                  <div className="observation">
                    <span>OBSERVACIONES</span>
                    <p>
                      {report.observaciones_auditoria ||
                        report.observaciones_generales ||
                        "No hay observaciones cargadas."}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "productividad" && (
              <section className="advisorCard">
                <div className="cardTop">
                  <div>
                    <span className="cardNumber">02</span>
                    <h2>PRODUCTIVIDAD</h2>
                  </div>
                  <Badge type="warning">
                    {report.estado_campania || "En proceso"}
                  </Badge>
                </div>

                <div className="metricGrid">
                  <div>
                    <span>SPH</span>
                    <strong>{report.sph || "-"}</strong>
                    <small>Objetivo SPH: {report.objetivo_sph || "-"}</small>
                  </div>

                  <div>
                    <span>VENTAS</span>
                    <strong>{report.ventas || "-"}</strong>
                    <small>
                      Objetivo ventas: {report.objetivo_ventas || "-"}
                    </small>
                  </div>

                  <div>
                    <span>OBJETIVO DE CAMPAÑA</span>
                    <strong>{report.objetivo_campania || "-"}</strong>
                  </div>

                  <div>
                    <span>ESTADO</span>
                    <strong>{report.estado_campania || "En proceso"}</strong>
                  </div>
                </div>

                <div className="twoColumns">
                  <div className="contentBlock">
                    <h3>ITEMS TRABAJADOS</h3>
                    <div className="tagList">
                      {(report.items_productividad || []).map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>

                  <div className="contentBlock">
                    <h3>ACCIONES REALIZADAS</h3>
                    <div className="tagList">
                      {(report.acciones_productividad || []).map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="observation">
                  <span>OBSERVACIONES</span>
                  <p>
                    {report.observaciones_productividad ||
                      "No hay observaciones cargadas."}
                  </p>
                </div>
              </section>
            )}

            {activeTab === "tipificaciones" && (
              <section className="advisorCard">
                <div className="cardTop">
                  <div>
                    <span className="cardNumber">03</span>
                    <h2>TIPIFICACIONES</h2>
                  </div>
                  <Badge type="warning">
                    {report.estado_tipificaciones || "En proceso"}
                  </Badge>
                </div>

                <div className="metricGrid">
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

                  <div>
                    <span>COMPROMISO</span>
                    <strong>{report.tipificacion_compromiso || "-"}</strong>
                  </div>
                </div>

                <div className="contentBlock">
                  <h3>TIPIFICACIONES</h3>
                  <div className="tagList">
                    {(report.tipificaciones || []).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>

                <div className="observation">
                  <span>OBSERVACIONES</span>
                  <p>
                    {report.tipificacion_observaciones ||
                      "Sin observaciones cargadas."}
                  </p>
                </div>
              </section>
            )}

            {activeTab === "auditorias" && (
              <section className="advisorCard">
                <div className="cardTop">
                  <div>
                    <span className="cardNumber">04</span>
                    <h2>AUDITORÍAS DE NO VENTAS</h2>
                  </div>
                </div>

                <div className="metricGrid">
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

                <div className="twoColumns">
                  <div className="contentBlock">
                    <h3>PRINCIPALES O.M.</h3>
                    <div className="tagList">
                      {(report.om_detectadas || []).map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>

                  <div className="contentBlock">
                    <h3>FORTALEZAS</h3>
                    <div className="tagList">
                      {(report.fortalezas || []).map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="observation">
                  <span>OBSERVACIONES</span>
                  <p>
                    {report.observaciones_no_ventas ||
                      "No hay observaciones cargadas."}
                  </p>
                </div>
              </section>
            )}

            {activeTab === "actividades" && (
              <section className="advisorCard emptyFeature">
                <span className="cardNumber">05</span>
                <h2>ACTIVIDADES</h2>
                <div className="comingSoon">
                  <strong>Próximamente</strong>
                  <p>
                    Esta sección quedará disponible para registrar y consultar
                    actividades.
                  </p>
                </div>
              </section>
            )}

            {activeTab === "historico" && (
              <section className="advisorCard">
                <div className="cardTop">
                  <div>
                    <span className="cardNumber">06</span>
                    <h2>HISTÓRICO</h2>
                  </div>

                  <button
                    className="secondaryButton"
                    onClick={() => window.print()}
                  >
                    Imprimir
                  </button>
                </div>

                <div className="historyCards">
                  {reports
                    .filter((r) => r.asesor === selectedAdvisor)
                    .slice()
                    .reverse()
                    .map((r) => (
                      <div className="historyCard" key={r.id}>
                        <div>
                          <span>{r.semana}</span>
                          <strong>{r.nota} / 100</strong>
                        </div>
                        <div>
                          <small>Producto</small>
                          <b>{r.producto}</b>
                        </div>
                        <Badge
                          type={
                            r.estado_objetivo === "ALCANZADO"
                              ? "success"
                              : r.estado_objetivo === "DEBAJO DEL OBJETIVO"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {r.estado_objetivo}
                        </Badge>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {activeTab === "feedback" && (
              <section className="advisorCard feedbackCard">
                <span className="cardNumber">07</span>
                <h2>FEEDBACK DEL ASESOR</h2>

                <p>
                  ¿Querés dejar algún comentario sobre tu reporte, una consulta
                  o algo que quieras trabajar con Calidad?
                </p>

                <textarea
                  value={feedback}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                    setFeedbackSent(false);
                  }}
                  placeholder="Escribí tu comentario..."
                  rows="7"
                />

                <button className="primaryButton" onClick={sendFeedback}>
                  ENVIAR FEEDBACK
                </button>

                {feedbackSent && (
                  <div className="successBox">
                    ✓ Feedback enviado correctamente.
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
}

const styles = `
:root {
  --petroleo: #075b63;
  --petroleo-dark: #063f46;
  --petroleo-light: #e8f4f4;
  --turquesa: #1b8b91;
  --arena: #f5f7f6;
  --blanco: #ffffff;
  --texto: #163337;
  --muted: #718589;
  --linea: #dce8e8;
  --verde: #24785e;
  --verde-bg: #e8f5ef;
  --amarillo: #9a7215;
  --amarillo-bg: #fff7dc;
  --rojo: #a84444;
  --rojo-bg: #faeaea;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--texto);
  background: var(--arena);
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
    radial-gradient(circle at top right, rgba(27,139,145,.14), transparent 32%),
    linear-gradient(135deg, #f4f8f7, #e8f2f2);
}

.loginCard {
  width: min(460px, 100%);
  background: white;
  border: 1px solid var(--linea);
  border-radius: 24px;
  padding: 42px;
  box-shadow: 0 25px 70px rgba(6,63,70,.12);
}

.brandMark {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--petroleo);
  color: white;
  font-size: 19px;
  font-weight: 900;
  margin-bottom: 28px;
}

.eyebrow {
  color: var(--petroleo);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.7px;
}

.eyebrow.light {
  color: #b9dddd;
}

.loginCard h1 {
  font-size: 35px;
  margin: 10px 0;
  letter-spacing: -.8px;
}

.loginText {
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 30px;
}

.field {
  margin-bottom: 20px;
}

.field label {
  display: block;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .7px;
  margin-bottom: 8px;
  color: #47656a;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #cadada;
  border-radius: 10px;
  background: #fff;
  padding: 13px 14px;
  color: var(--texto);
  outline: none;
  transition: .2s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--turquesa);
  box-shadow: 0 0 0 3px rgba(27,139,145,.10);
}

textarea {
  resize: vertical;
}

.primaryButton,
.saveButton {
  width: 100%;
  border: 0;
  border-radius: 11px;
  padding: 15px 20px;
  background: var(--petroleo);
  color: white;
  font-weight: 900;
  letter-spacing: .5px;
  transition: .2s;
}

.primaryButton:hover,
.saveButton:hover {
  background: var(--petroleo-dark);
  transform: translateY(-1px);
}

.loginHint {
  margin-top: 22px;
  text-align: center;
  color: #8a9a9d;
  font-size: 12px;
}

.errorBox {
  background: var(--rojo-bg);
  color: var(--rojo);
  border: 1px solid #eccaca;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 15px;
  font-size: 13px;
}

.successBox {
  background: var(--verde-bg);
  color: var(--verde);
  padding: 13px;
  border-radius: 10px;
  margin-top: 15px;
  font-weight: 700;
}

.appPage {
  min-height: 100vh;
}

.topHeader {
  background: var(--petroleo-dark);
  color: white;
  padding: 38px max(28px, calc((100vw - 1180px) / 2));
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.topHeader h1 {
  margin: 6px 0;
  font-size: 35px;
}

.topHeader p {
  margin: 0;
  color: #b9d1d2;
}

.logoutButton {
  border: 1px solid rgba(255,255,255,.3);
  background: transparent;
  color: white;
  border-radius: 9px;
  padding: 11px 17px;
  font-weight: 800;
}

.logoutButton.dark {
  color: var(--petroleo-dark);
  border-color: var(--linea);
  background: white;
}

.adminWrap {
  width: min(1120px, calc(100% - 40px));
  margin: 35px auto 80px;
}

.adminTitle {
  margin-bottom: 25px;
}

.adminTitle span {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.4px;
  color: var(--petroleo);
}

.adminTitle h2 {
  font-size: 30px;
  margin: 8px 0;
}

.adminTitle p {
  color: var(--muted);
}

.adminSection {
  background: white;
  border: 1px solid var(--linea);
  border-radius: 18px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 7px 25px rgba(7,91,99,.05);
}

.sectionNumber,
.cardNumber {
  color: var(--turquesa);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1px;
}

.adminSection h2 {
  margin: 5px 0 25px;
  font-size: 24px;
}

.formGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 20px;
}

.formGrid.four {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.adminSection h3 {
  margin: 27px 0 7px;
  font-size: 15px;
}

.helper {
  color: var(--muted);
  font-size: 13px;
  margin: 0 0 12px;
}

.multiBox {
  border: 1px solid var(--linea);
  border-radius: 12px;
  padding: 13px;
  background: #fbfdfd;
}

.multiCount {
  color: var(--petroleo);
  font-weight: 900;
  font-size: 13px;
  margin-bottom: 10px;
}

.multiOptions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.multiOption {
  border: 1px solid #cfe0e0;
  background: white;
  color: #496267;
  border-radius: 9px;
  padding: 9px 11px;
  font-size: 12px;
  text-align: left;
}

.multiOption.selected {
  background: var(--petroleo-light);
  border-color: #83bfc1;
  color: var(--petroleo-dark);
  font-weight: 800;
}

.multiOption span {
  margin-right: 5px;
  font-weight: 900;
}

.audioInside {
  border-top: 1px solid var(--linea);
  margin-top: 25px;
  padding-top: 22px;
}

.audioButton {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border-radius: 10px;
  background: var(--petroleo);
  color: white;
  padding: 12px 17px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

.audioButton span {
  font-size: 20px;
}

.fileSelected {
  display: inline-block;
  margin-left: 12px;
  color: var(--verde);
  font-size: 13px;
  font-weight: 800;
}

.saveArea {
  margin: 30px 0;
}

.historyAdmin {
  background: white;
  border: 1px solid var(--linea);
  border-radius: 18px;
  padding: 30px;
}

.historyHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.historyHeader h2 {
  margin: 6px 0 20px;
}

.secondaryButton {
  background: white;
  border: 1px solid #b9cccc;
  color: var(--petroleo-dark);
  border-radius: 9px;
  padding: 10px 15px;
  font-weight: 800;
}

.tableWrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 13px;
  text-align: left;
  border-bottom: 1px solid var(--linea);
  font-size: 13px;
}

th {
  color: var(--muted);
  font-size: 11px;
  letter-spacing: .7px;
}

.emptyBox {
  border: 1px dashed #bdd0d0;
  border-radius: 12px;
  padding: 30px;
  color: var(--muted);
  text-align: center;
}

.advisorHeader {
  background: white;
  border-bottom: 1px solid var(--linea);
  padding: 32px max(28px, calc((100vw - 1120px) / 2));
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
}

.advisorHeader h1 {
  margin: 6px 0;
  font-size: 34px;
  letter-spacing: -.7px;
}

.advisorHeader p {
  margin: 0;
  color: var(--muted);
}

.headerRight {
  display: flex;
  align-items: center;
  gap: 15px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 11px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .5px;
}

.badge.success {
  color: var(--verde);
  background: var(--verde-bg);
}

.badge.warning {
  color: var(--amarillo);
  background: var(--amarillo-bg);
}

.badge.danger {
  color: var(--rojo);
  background: var(--rojo-bg);
}

.badge.default {
  color: var(--petroleo);
  background: var(--petroleo-light);
}

.advisorNav {
  width: min(1120px, calc(100% - 40px));
  margin: 22px auto;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--linea);
}

.advisorNav button {
  border: 0;
  background: transparent;
  padding: 13px 14px;
  color: #708488;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .5px;
  border-bottom: 3px solid transparent;
}

.advisorNav button.active {
  color: var(--petroleo);
  border-bottom-color: var(--turquesa);
}

.advisorContent {
  width: min(1120px, calc(100% - 40px));
  margin: 25px auto 70px;
}

.advisorCard {
  background: white;
  border: 1px solid var(--linea);
  border-radius: 20px;
  padding: 34px;
  box-shadow: 0 8px 30px rgba(7,91,99,.05);
}

.cardTop {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  border-bottom: 1px solid var(--linea);
  padding-bottom: 22px;
  margin-bottom: 28px;
}

.cardTop h2,
.advisorCard > h2 {
  margin: 6px 0 0;
  font-size: 25px;
  letter-spacing: -.3px;
}

.qualityHero {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 5px 0 30px;
}

.scoreCircle {
  width: 150px;
  height: 150px;
  flex: 0 0 150px;
  border-radius: 50%;
  background: var(--petroleo-light);
  border: 9px solid #b5d9da;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.scoreCircle strong {
  font-size: 44px;
  color: var(--petroleo-dark);
}

.scoreCircle span {
  color: var(--muted);
  font-size: 13px;
}

.heroStats {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.heroStats div,
.metricGrid > div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.heroStats span,
.metricGrid span,
.infoBox span,
.observation span,
.auditGrid span,
.audioPlayer > span {
  color: var(--muted);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
}

.heroStats strong {
  font-size: 25px;
}

.progressBlock {
  margin-bottom: 28px;
}

.progressLabel {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--muted);
}

.progressLabel strong {
  color: var(--petroleo);
}

.progress {
  height: 9px;
  background: #e3eeee;
  border-radius: 20px;
  overflow: hidden;
}

.progress div {
  height: 100%;
  background: var(--turquesa);
  border-radius: inherit;
}

.infoGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
}

.infoBox {
  background: #f8fbfb;
  border: 1px solid var(--linea);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.infoBox.highlight {
  background: var(--petroleo-light);
  border-color: #c4e0e0;
}

.infoBox strong {
  font-size: 17px;
}

.twoColumns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 25px;
}

.contentBlock {
  border-top: 1px solid var(--linea);
  padding-top: 22px;
}

.contentBlock h3,
.auditInside h3 {
  font-size: 11px;
  letter-spacing: 1px;
  margin: 0 0 13px;
  color: var(--petroleo);
}

.tagList {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tagList span {
  background: #f0f6f6;
  border: 1px solid #d7e7e7;
  color: #496367;
  border-radius: 9px;
  padding: 9px 10px;
  font-size: 12px;
}

.auditInside {
  margin-top: 30px;
  padding: 25px;
  border-radius: 14px;
  background: #f7faf9;
  border: 1px solid var(--linea);
}

.auditGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.auditGrid div {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.audioPlayer {
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.audioPlayer audio {
  width: 100%;
}

.observation {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid var(--linea);
}

.observation p {
  margin: 9px 0 0;
  line-height: 1.65;
  color: #455f64;
}

.metricGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.metricGrid > div {
  background: #f7faf9;
  border: 1px solid var(--linea);
  padding: 18px;
  border-radius: 12px;
}

.metricGrid strong {
  font-size: 24px;
  color: var(--petroleo-dark);
}

.metricGrid small {
  color: var(--muted);
  line-height: 1.4;
}

.emptyFeature {
  text-align: left;
}

.comingSoon {
  margin-top: 30px;
  border: 1px dashed #b9cdcd;
  border-radius: 14px;
  padding: 35px;
  background: #f8fbfb;
}

.comingSoon strong {
  display: block;
  color: var(--petroleo);
  margin-bottom: 8px;
}

.comingSoon p {
  color: var(--muted);
  margin: 0;
}

.historyCards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.historyCard {
  border: 1px solid var(--linea);
  border-radius: 13px;
  padding: 17px;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 20px;
}

.historyCard span,
.historyCard small {
  color: var(--muted);
  display: block;
  font-size: 11px;
}

.historyCard strong {
  display: block;
  font-size: 22px;
  margin-top: 5px;
}

.historyCard b {
  display: block;
  margin-top: 5px;
}

.feedbackCard {
  max-width: 850px;
}

.feedbackCard > p {
  color: var(--muted);
  line-height: 1.7;
  margin: 18px 0 22px;
}

.advisorEmpty {
  width: min(1120px, calc(100% - 40px));
  margin: 60px auto;
  background: white;
  border: 1px solid var(--linea);
  border-radius: 20px;
  padding: 50px;
}

.advisorEmpty h2 {
  margin: 8px 0;
}

.advisorEmpty p {
  color: var(--muted);
}

@media (max-width: 800px) {
  .topHeader,
  .advisorHeader {
    align-items: flex-start;
    flex-direction: column;
  }

  .formGrid,
  .formGrid.four,
  .infoGrid,
  .twoColumns,
  .metricGrid,
  .auditGrid {
    grid-template-columns: 1fr;
  }

  .qualityHero {
    flex-direction: column;
    align-items: flex-start;
  }

  .heroStats {
    gap: 20px;
  }

  .historyCard {
    grid-template-columns: 1fr;
  }

  .advisorNav {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .advisorNav button {
    white-space: nowrap;
  }
}

@media print {
  .advisorNav,
  .logoutButton,
  .secondaryButton {
    display: none !important;
  }

  .advisorHeader {
    border-bottom: 0;
  }

  .advisorCard {
    box-shadow: none;
  }
}
`;
