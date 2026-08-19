"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const asesores = [
  ["Acosta, Pamela", "8134", "acostapamela"],
  ["Aguilera, Trinidad", "8196", "aguileratrinidad"],
  ["Bahamonde, Camila", "8135", "bahamondecamila"],
  ["Bustamante, Ailin", "8188", "bustamanteailin"],
  ["Bustos, Jesica", "8141", "bustosjesica"],
  ["Bustos, Nicolas", "8214", "bustosnicolas"],
  ["Cabrera, Antonella", "8187", "cabreraantonella"],
  ["Contreras, Gilary", "8046", "contrerasgilary"],
  ["Cordoba, Tania", "8202", "cordobatania"],
  ["Diaz, Milagros", "8212", "diazmilagros"],
  ["Gomez, Carla", "8126", "gomezcarla"],
  ["Luna, Oriana", "8097", "lunaoriana"],
  ["Malqui, Xiomara", "8092", "malquixiomara"],
  ["Mercado, Chiara", "8209", "mercadochiara"],
  ["Ojeda, Luana", "8200", "ojedaluana"],
  ["Olmedo, Thomas", "8192", "olmedothomas"],
  ["Peralta, Belen", "8207", "peraltabelen"],
  ["Reartes, Maia", "8201", "reartesmaia"],
  ["Rojek, Luna", "8213", "rojekluna"],
  ["Simonetta, Valentina", "8191", "simonettavalentina"],
  ["Tello, Marianela", "8042", "tellomarianela"],
  ["Vasquez, Agustin", "8136", "vasquezagustin"],
  ["Viniegra, Agustín", "8199", "viniegragustin"],
];

export default function AdminPage() {
  const [modo, setModo] = useState("inicio");
  const [asesorPortal, setAsesorPortal] = useState("");

  const [asesor, setAsesor] = useState("");
  const [semana, setSemana] = useState("Semana 3 - Agosto");

  const [nota, setNota] = useState("");
  const [evolucion, setEvolucion] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [desvio, setDesvio] = useState("");
  const [recomendacion, setRecomendacion] = useState("");

  const [auditoria, setAuditoria] = useState("");
  const [producto, setProducto] = useState("AP");
  const [observaciones, setObservaciones] = useState("");

  const [sph, setSph] = useState("");
  const [objetivoSph, setObjetivoSph] = useState("");
  const [ventas, setVentas] = useState("");
  const [objetivoVentas, setObjetivoVentas] = useState("");
  const [objetivoCampania, setObjetivoCampania] = useState("");
  const [descripcionCampania, setDescripcionCampania] = useState("");

  const [estadoSph, setEstadoSph] = useState("");
  const [estadoVentas, setEstadoVentas] = useState("");
  const [estadoCampania, setEstadoCampania] = useState("");

  const [gestion, setGestion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [reportesAsesor, setReportesAsesor] = useState([]);
  const [cargandoReportes, setCargandoReportes] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d9dce3",
    marginTop: "6px",
    marginBottom: "16px",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const sectionStyle = {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
  };

  async function guardarReporte() {
    if (!asesor || !nota) {
      setMensaje("Seleccioná un asesor y cargá la nota.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    const asesorSeleccionado = asesores.find(
      ([, usuario]) => usuario === asesor
    );

    const datos = {
      asesor: asesorSeleccionado?.[0] || asesor,
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
      objetivo_sph: objetivoSph ? Number(objetivoSph) : null,
      ventas: ventas ? Number(ventas) : null,
      objetivo_ventas: objetivoVentas ? Number(objetivoVentas) : null,
      objetivo_campania: objetivoCampania,
      descripcion_campania: descripcionCampania,
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
        "❌ No se pudo guardar el reporte. Revisá la configuración de Supabase."
      );
      setGuardando(false);
      return;
    }

    setMensaje("✓ Reporte guardado correctamente en Supabase.");
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

  async function entrarAlPortal() {
    if (!asesorPortal) return;

    const seleccionado = asesores.find(
      ([nombre]) => nombre === asesorPortal
    );

    if (!seleccionado) return;

    setCargandoReportes(true);
    setReportesAsesor([]);

    const usuario = seleccionado[1];

    const { data, error } = await supabase
      .from("reportes")
      .select("*")
      .eq("usuario", usuario)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setReportesAsesor(data || []);
    }

    setCargandoReportes(false);
    setModo("asesor");
  }

  function volverInicio() {
    setModo("inicio");
    setAsesorPortal("");
    setReportesAsesor([]);
  }

  function volverAdmin() {
    setModo("admin");
  }

  const reporteActual = reportesAsesor[0];

  if (modo === "inicio") {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f4f6f8",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
          color: "#20242a",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "70px auto",
            textAlign: "center",
          }}
        >
          <div style={sectionStyle}>
            <div
              style={{
                width: "70px",
                height: "70px",
                margin: "0 auto 20px",
                borderRadius: "20px",
                background: "#111827",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}
            >
              ✓
            </div>

            <h1 style={{ marginBottom: "8px" }}>
              Portal de Calidad
            </h1>

            <p style={{ color: "#68707b", fontSize: "16px" }}>
              Seguimiento de calidad y productividad del equipo
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px",
                marginTop: "35px",
              }}
            >
              <button
                onClick={() => setModo("portal")}
                style={{
                  padding: "25px",
                  border: "none",
                  borderRadius: "16px",
                  background: "#111827",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                👤
                <br />
                <span
                  style={{
                    display: "block",
                    marginTop: "10px",
                  }}
                >
                  Portal de Asesores
                </span>

                <small
                  style={{
                    display: "block",
                    marginTop: "8px",
                    opacity: 0.75,
                    fontWeight: "normal",
                  }}
                >
                  Consultá tu calidad y evolución
                </small>
              </button>

              <button
                onClick={() => setModo("admin")}
                style={{
                  padding: "25px",
                  border: "1px solid #d9dce3",
                  borderRadius: "16px",
                  background: "white",
                  color: "#20242a",
                  cursor: "pointer",
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                🔐
                <br />
                <span
                  style={{
                    display: "block",
                    marginTop: "10px",
                  }}
                >
                  Administración
                </span>

                <small
                  style={{
                    display: "block",
                    marginTop: "8px",
                    color: "#68707b",
                    fontWeight: "normal",
                  }}
                >
                  Cargar y actualizar reportes
                </small>
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (modo === "portal") {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f4f6f8",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
          color: "#20242a",
        }}
      >
        <div style={{ maxWidth: "850px", margin: "auto" }}>
          <button
            onClick={volverInicio}
            style={{
              marginBottom: "20px",
              padding: "10px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              background: "white",
              cursor: "pointer",
            }}
          >
            ← Volver
          </button>

          <div style={sectionStyle}>
            <h1 style={{ marginTop: 0 }}>
              Portal de Asesores
            </h1>

            <p style={{ color: "#68707b" }}>
              Seleccioná tu nombre para consultar tu información.
            </p>

            <label>Asesor</label>

            <select
              value={asesorPortal}
              onChange={(e) => setAsesorPortal(e.target.value)}
              style={inputStyle}
            >
              <option value="">Seleccionar nombre</option>

              {asesores.map(([nombre, usuario]) => (
                <option key={usuario} value={nombre}>
                  {nombre}
                </option>
              ))}
            </select>

            <button
              onClick={entrarAlPortal}
              disabled={!asesorPortal || cargandoReportes}
              style={{
                width: "100%",
                padding: "15px",
                border: "none",
                borderRadius: "12px",
                background:
                  !asesorPortal || cargandoReportes
                    ? "#94a3b8"
                    : "#111827",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor:
                  !asesorPortal || cargandoReportes
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {cargandoReportes
                ? "CARGANDO..."
                : "INGRESAR A MI PORTAL"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (modo === "asesor") {
    const asesorInfo = asesores.find(
      ([nombre]) => nombre === asesorPortal
    );

    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f4f6f8",
          padding: "30px",
          fontFamily: "Arial, sans-serif",
          color: "#20242a",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setModo("portal")}
              style={{
                padding: "10px 16px",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                background: "white",
                cursor: "pointer",
              }}
            >
              ← Cambiar asesor
            </button>

            <button
              onClick={volverInicio}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: "10px",
                background: "#20242a",
                color: "white",
                cursor: "pointer",
              }}
            >
              Inicio
            </button>
          </div>

          <div style={sectionStyle}>
            <p
              style={{
                color: "#68707b",
                marginBottom: "5px",
              }}
            >
              Bienvenido/a
            </p>

            <h1 style={{ marginTop: 0 }}>
              {asesorInfo?.[0] || asesorPortal}
            </h1>

            <p style={{ color: "#68707b" }}>
              Acá podés consultar tu evolución de calidad y
              productividad.
            </p>
          </div>

          {cargandoReportes ? (
            <div style={sectionStyle}>
              <p>Cargando información...</p>
            </div>
          ) : reportesAsesor.length === 0 ? (
            <div style={sectionStyle}>
              <h2>📋 Todavía no hay reportes cargados</h2>

              <p style={{ color: "#68707b" }}>
                Cuando Calidad cargue tu primer reporte semanal,
                vas a poder verlo desde este portal.
              </p>
            </div>
          ) : (
            <>
              <section style={sectionStyle}>
                <h2>📊 Mi calidad</h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "15px",
                    marginTop: "20px",
                  }}
                >
                  <div
                    style={{
                      padding: "20px",
                      borderRadius: "14px",
                      background: "#f8fafc",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <small>Nota de calidad</small>

                    <div
                      style={{
                        fontSize: "38px",
                        fontWeight: "bold",
                        marginTop: "8px",
                      }}
                    >
                      {reporteActual?.nota ?? "-"}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "20px",
                      borderRadius: "14px",
                      background: "#f8fafc",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <small>Semana</small>

                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginTop: "12px",
                      }}
                    >
                      {reporteActual?.semana || "-"}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "20px",
                      borderRadius: "14px",
                      background: "#f8fafc",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <small>Producto</small>

                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        marginTop: "10px",
                      }}
                    >
                      {reporteActual?.producto || "-"}
                    </div>
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h2>📈 Evolución</h2>

                <p>
                  {reporteActual?.evolucion ||
                    "No hay información cargada."}
                </p>
              </section>

              <section style={sectionStyle}>
                <h2>🎯 Objetivo de trabajo</h2>

                <p>
                  {reporteActual?.objetivo ||
                    "No hay información cargada."}
                </p>
              </section>

              <section style={sectionStyle}>
                <h2>⚠️ Desvío principal</h2>

                <div
                  style={{
                    padding: "18px",
                    borderRadius: "12px",
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                  }}
                >
                  <strong>
                    {reporteActual?.desvio ||
                      "No hay desvíos cargados."}
                  </strong>
                </div>
              </section>

              <section style={sectionStyle}>
                <h2>🛠️ Recomendación</h2>

                <p>
                  {reporteActual?.recomendacion ||
                    "No hay recomendaciones cargadas."}
                </p>
              </section>

              <section style={sectionStyle}>
                <h2>🎧 Auditoría</h2>

                <p>
                  {reporteActual?.auditoria ||
                    "No hay información de auditoría."}
                </p>

                {reporteActual?.observaciones && (
                  <>
                    <h3>Observaciones</h3>

                    <p>{reporteActual.observaciones}</p>
                  </>
                )}
              </section>

              <section style={sectionStyle}>
                <h2>📈 Mi productividad</h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      padding: "18px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                    }}
                  >
                    <small>SPH</small>

                    <strong
                      style={{
                        display: "block",
                        fontSize: "24px",
                        marginTop: "8px",
                      }}
                    >
                      {reporteActual?.sph ?? "-"}
                    </strong>

                    <small>
                      Objetivo:{" "}
                      {reporteActual?.objetivo_sph ?? "-"}
                    </small>
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                    }}
                  >
                    <small>Ventas</small>

                    <strong
                      style={{
                        display: "block",
                        fontSize: "24px",
                        marginTop: "8px",
                      }}
                    >
                      {reporteActual?.ventas ?? "-"}
                    </strong>

                    <small>
                      Objetivo:{" "}
                      {reporteActual?.objetivo_ventas ?? "-"}
                    </small>
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                    }}
                  >
                    <small>Estado SPH</small>

                    <strong
                      style={{
                        display: "block",
                        marginTop: "8px",
                      }}
                    >
                      {reporteActual?.estado_sph || "-"}
                    </strong>
                  </div>

                  <div
                    style={{
                      padding: "18px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                    }}
                  >
                    <small>Estado ventas</small>

                    <strong
                      style={{
                        display: "block",
                        marginTop: "8px",
                      }}
                    >
                      {reporteActual?.estado_ventas || "-"}
                    </strong>
                  </div>
                </div>

                {reporteActual?.objetivo_campania && (
                  <div style={{ marginTop: "20px" }}>
                    <h3>Objetivo de campaña</h3>

                    <p>{reporteActual.objetivo_campania}</p>

                    {reporteActual.descripcion_campania && (
                      <p style={{ color: "#68707b" }}>
                        {reporteActual.descripcion_campania}
                      </p>
                    )}

                    <strong>
                      Estado:{" "}
                      {reporteActual.estado_campania || "-"}
                    </strong>
                  </div>
                )}

                {reporteActual?.gestion && (
                  <div style={{ marginTop: "20px" }}>
                    <h3>¿Qué se realizó durante la semana?</h3>

                    <p>{reporteActual.gestion}</p>
                  </div>
                )}
              </section>

              <section style={sectionStyle}>
                <h2>📚 Historial semanal</h2>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {reportesAsesor.map((reporte, index) => (
                    <div
                      key={`${reporte.usuario}-${reporte.semana}-${index}`}
                      style={{
                        padding: "18px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        background: "#fafafa",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "15px",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong>{reporte.semana}</strong>

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

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        color: "#20242a",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "auto" }}>
        <div style={sectionStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1 style={{ margin: 0 }}>
                Portal de Calidad
              </h1>

              <p style={{ color: "#68707b" }}>
                Panel de Administración
              </p>
            </div>

            <button
              onClick={volverInicio}
              style={{
                padding: "11px 18px",
                border: "none",
                borderRadius: "10px",
                background: "#20242a",
                color: "white",
                cursor: "pointer",
              }}
            >
              ← Volver al inicio
            </button>
          </div>

          <hr
            style={{
              border: 0,
              borderTop: "1px solid #eee",
            }}
          />

          <h2>Bienvenida, Administradora</h2>

          <p>
            Desde acá vas a poder cargar y actualizar la
            información semanal del equipo.
          </p>

          {mensaje && (
            <div
              style={{
                background: mensaje.includes("❌")
                  ? "#fff1f1"
                  : "#eaf7ef",
                border: mensaje.includes("❌")
                  ? "1px solid #f0b5b5"
                  : "1px solid #b8e1c6",
                padding: "14px",
                borderRadius: "10px",
                marginTop: "15px",
              }}
            >
              {mensaje}
            </div>
          )}
        </div>

        <section style={sectionStyle}>
          <h2>📊 Cargar reporte de calidad</h2>

          <p style={{ color: "#68707b" }}>
            Completá la información semanal del asesor.
          </p>

          <label>Asesor</label>

          <select
            value={asesor}
            onChange={(e) => setAsesor(e.target.value)}
            style={inputStyle}
          >
            <option value="">Seleccionar asesor</option>

            {asesores.map(([nombre, usuario]) => (
              <option key={usuario} value={usuario}>
                {nombre} — {usuario}
              </option>
            ))}
          </select>

          <label>Semana</label>

          <input
            value={semana}
            onChange={(e) => setSemana(e.target.value)}
            style={inputStyle}
          />

          <label>Nota de calidad</label>

          <input
            type="number"
            min="0"
            max="100"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ejemplo: 85"
            style={inputStyle}
          />

          <label>Evolución</label>

          <input
            value={evolucion}
            onChange={(e) => setEvolucion(e.target.value)}
            placeholder="Ejemplo: Mejora respecto de la semana anterior"
            style={inputStyle}
          />

          <label>Objetivo</label>

          <textarea
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            placeholder="¿Qué debe trabajar?"
            style={{
              ...inputStyle,
              minHeight: "90px",
            }}
          />

          <label>Desvío principal</label>

          <input
            value={desvio}
            onChange={(e) => setDesvio(e.target.value)}
            placeholder="Ejemplo: Validación de datos"
            style={inputStyle}
          />

          <label>Recomendación</label>

          <textarea
            value={recomendacion}
            onChange={(e) => setRecomendacion(e.target.value)}
            placeholder="Recomendación para el asesor"
            style={{
              ...inputStyle,
              minHeight: "90px",
            }}
          />

          <label>Auditoría</label>

          <input
            value={auditoria}
            onChange={(e) => setAuditoria(e.target.value)}
            placeholder="Ejemplo: Llamada auditada"
            style={inputStyle}
          />

          <label>Producto</label>

          <select
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            style={inputStyle}
          >
            <option>AP</option>
            <option>BM</option>
          </select>

          <label>Observaciones</label>

          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones de la auditoría"
            style={{
              ...inputStyle,
              minHeight: "100px",
            }}
          />

          <button
            onClick={guardarReporte}
            disabled={guardando}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background: guardando
                ? "#94a3b8"
                : "#111827",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: guardando
                ? "not-allowed"
                : "pointer",
            }}
          >
            {guardando
              ? "GUARDANDO..."
              : "GUARDAR REPORTE"}
          </button>
        </section>

        <section style={sectionStyle}>
          <h2>📈 Cargar productividad semanal</h2>

          <label>SPH</label>

          <input
            value={sph}
            onChange={(e) => setSph(e.target.value)}
            placeholder="Ejemplo: 1.25"
            style={inputStyle}
          />

          <label>Objetivo SPH</label>

          <input
            value={objetivoSph}
            onChange={(e) => setObjetivoSph(e.target.value)}
            placeholder="Ejemplo: 1.20"
            style={inputStyle}
          />

          <label>Ventas</label>

          <input
            value={ventas}
            onChange={(e) => setVentas(e.target.value)}
            placeholder="Cantidad de ventas"
            style={inputStyle}
          />

          <label>Objetivo de ventas</label>

          <input
            value={objetivoVentas}
            onChange={(e) => setObjetivoVentas(e.target.value)}
            placeholder="Cantidad objetivo"
            style={inputStyle}
          />

          <label>Objetivo de campaña</label>

          <input
            value={objetivoCampania}
            onChange={(e) => setObjetivoCampania(e.target.value)}
            placeholder="Objetivo de campaña"
            style={inputStyle}
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
              ...inputStyle,
              minHeight: "80px",
            }}
          />

          <label>Estado SPH</label>

          <select
            value={estadoSph}
            onChange={(e) => setEstadoSph(e.target.value)}
            style={inputStyle}
          >
            <option value="">Seleccionar estado</option>
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
            style={inputStyle}
          >
            <option value="">Seleccionar estado</option>
            <option>Cumplido</option>
            <option>Alcanzado</option>
            <option>En proceso</option>
            <option>No alcanzado</option>
          </select>

          <label>Estado objetivo de campaña</label>

          <select
            value={estadoCampania}
            onChange={(e) =>
              setEstadoCampania(e.target.value)
            }
            style={inputStyle}
          >
            <option value="">Seleccionar estado</option>
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
            onChange={(e) => setGestion(e.target.value)}
            placeholder="Contanos qué acciones se realizaron durante la semana."
            style={{
              ...inputStyle,
              minHeight: "100px",
            }}
          />

          <button
            onClick={guardarReporte}
            disabled={guardando}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background: guardando
                ? "#94a3b8"
                : "#334155",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: guardando
                ? "not-allowed"
                : "pointer",
            }}
          >
            {guardando
              ? "GUARDANDO..."
              : "GUARDAR PRODUCTIVIDAD"}
          </button>

          <button
            onClick={limpiarFormulario}
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "12px",
              background: "white",
              cursor: "pointer",
            }}
          >
            LIMPIAR FORMULARIO
          </button>
        </section>

        <section style={sectionStyle}>
          <h2>👥 Asesores registrados</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {asesores.map(([nombre, usuario]) => (
              <div
                key={usuario}
                style={{
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  background: "#fafafa",
                }}
              >
                <strong>{nombre}</strong>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#68707b",
                    marginTop: "5px",
                  }}
                >
                  Usuario: {usuario}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
