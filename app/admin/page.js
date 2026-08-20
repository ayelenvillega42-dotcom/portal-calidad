"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const asesores = [
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

const itemsCalidad = [
  "Información de otras campañas",
  "Presentación HS",
  "Validación de datos",
  "Cláusula de aceptación",
  "Información",
  "Preexistencia",
  "Negociación",
  "Precio",
  "Suscripción",
];

const accionesCalidad = [
  "Feedback individual",
  "Espacio de coaching",
  "Escucha en línea",
  "Devolución mediante Meet",
  "Escucha de llamada de un compañero",
  "Transcripción de venta mediante Word con desvíos marcados",
  "Calibración conjunta de audio",
  "Otros",
];

const itemsProductividad = [
  "Técnicas manejo de objeciones",
  "Generación de interés",
  "Cambio apertura",
  "Escucha activa",
  "Venta consultiva",
  "Venta conversacional",
  "Ejemplos de P.S.",
  "Cierre con seguridad comercial",
  "Manejo de objeciones",
  "Ofrecimiento",
  "Rebate comercial",
  "Rebate conversacional",
  "Rebate asertivo",
  "Posicionamiento",
  "Manejo de la llamada",
  "Refuerzo de producto",
];

const accionesProductividad = [
  "Feedback individual",
  "Espacio de coaching",
  "Escucha en línea",
  "Roleplay comercial",
  "Roleplay de objeciones",
  "Repaso de speech",
  "Refuerzo de escucha activa",
  "Refuerzo de rebates",
  "Calibración",
  "Simulación de llamada",
  "Acompañamiento en línea",
  "Devolución personalizada",
  "Seguimiento diario",
  "Refuerzo de tipificación",
  "Refuerzo de cierre",
  "Refuerzo de sondeo",
  "Refuerzo de apertura",
  "Repaso de procesos",
  "Capacitación",
  "Escucha de llamadas",
];

const tipificaciones = [
  "Volver a llamar",
  "Volver a llamar argumentando",
  "No permite argumentar",
  "Cliente disconforme con CIA",
  "Cliente disconforme con el Banco",
  "Tiene producto con otra Cía.",
  "No conforme con sumas aseguradas",
  "No interesado - Producto",
  "No interesado - No informa motivo",
  "Problemas económicos",
  "Le parece caro",
  "Dará de baja medio de pago",
  "No elegible / No reúne requisitos",
];

const fortalezas = [
  "Escucha activa",
  "Buen sondeo",
  "Seguridad comercial",
  "Empatía",
  "Buen tono",
  "Manejo de objeciones",
  "Correcta validación",
  "Buen cierre",
  "Impulso comercial",
  "Fluidez conversacional",
  "Adaptabilidad",
  "Buena detección de necesidad",
  "Claridad en explicación",
  "Buen manejo de silencios",
  "Correcta contención",
  "Venta consultiva",
  "Buena apertura",
  "Persistencia comercial",
  "Correcta argumentación",
];

const objetivosSPH = {
  AP: 0.5,
  BM: 0.45,
  SL: 0.55,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d9dee8",
  marginTop: "6px",
  marginBottom: "16px",
  fontSize: "14px",
  boxSizing: "border-box",
  background: "#fff",
};

const sectionStyle = {
  background: "#fff",
  borderRadius: "20px",
  padding: "26px",
  marginBottom: "22px",
  boxShadow: "0 8px 25px rgba(15,23,42,.07)",
};

function MultiSelect({ label, options, value, setValue }) {
  return (
    <div>
      <label style={{ fontWeight: "700" }}>{label}</label>

      <select
        multiple
        value={value}
        onChange={(e) =>
          setValue(Array.from(e.target.selectedOptions, (o) => o.value))
        }
        style={{
          ...inputStyle,
          minHeight: "145px",
          cursor: "pointer",
        }}
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <small style={{ color: "#64748b" }}>
        Mantené presionado CTRL para seleccionar varias opciones.
      </small>
    </div>
  );
}

function BarraProgreso({ actual, objetivo }) {
  const a = Number(actual) || 0;
  const o = Number(objetivo) || 0;

  if (!o) return null;

  const porcentaje = Math.min(Math.max((a / o) * 100, 0), 100);
  const falta = Math.max(o - a, 0);

  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: "15px",
        padding: "18px",
        marginTop: "12px",
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
          fontWeight: "700",
        }}
      >
        <span>{porcentaje.toFixed(0)}% del objetivo</span>
        <span>
          {falta > 0
            ? `Faltan ${falta.toFixed(2)}`
            : "🎯 Objetivo alcanzado"}
        </span>
      </div>

      <div
        style={{
          height: "14px",
          background: "#e2e8f0",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${porcentaje}%`,
            height: "100%",
            background: "#111827",
            borderRadius: "20px",
          }}
        />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [asesor, setAsesor] = useState("");
  const [semana, setSemana] = useState("Semana 3 - Agosto");

  const [nota, setNota] = useState("");
  const [objetivoCalidad, setObjetivoCalidad] = useState("");
  const [estadoObjetivo, setEstadoObjetivo] = useState("");
  const [desvio, setDesvio] = useState("");
  const [itemsCalidadSeleccionados, setItemsCalidadSeleccionados] =
    useState([]);
  const [accionesCalidadSeleccionadas, setAccionesCalidadSeleccionadas] =
    useState([]);
  const [auditoria, setAuditoria] = useState("");
  const [producto, setProducto] = useState("AP");
  const [observaciones, setObservaciones] = useState("");
  const [audio, setAudio] = useState(null);

  const [sph, setSph] = useState("");
  const [ventas, setVentas] = useState("");
  const [objetivoVentas, setObjetivoVentas] = useState("");
  const [objetivoCampania, setObjetivoCampania] = useState("");
  const [descripcionCampania, setDescripcionCampania] = useState("");
  const [estadoSph, setEstadoSph] = useState("");
  const [estadoVentas, setEstadoVentas] = useState("");
  const [estadoCampania, setEstadoCampania] = useState("");

  const [itemsProductividadSeleccionados, setItemsProductividadSeleccionados] =
    useState([]);
  const [accionesProductividadSeleccionadas, setAccionesProductividadSeleccionadas] =
    useState([]);
  const [observacionesProductividad, setObservacionesProductividad] =
    useState("");

  const [cantidadTipificaciones, setCantidadTipificaciones] = useState("");
  const [objetivoTipificaciones, setObjetivoTipificaciones] = useState("");
  const [estadoTipificaciones, setEstadoTipificaciones] = useState("");
  const [tipificacionDesvio, setTipificacionDesvio] = useState("");
  const [tipificacionObjetivo, setTipificacionObjetivo] = useState("");
  const [tipificacionResultado, setTipificacionResultado] = useState("");
  const [tipificacionCompromiso, setTipificacionCompromiso] = useState("");
  const [tipificacionObservaciones, setTipificacionObservaciones] =
    useState("");

  const [cantidadNoVentas, setCantidadNoVentas] = useState("");
  const [omDetectadas, setOmDetectadas] = useState([]);
  const [coachingNoVentas, setCoachingNoVentas] = useState([]);
  const [registroSistema, setRegistroSistema] = useState("");
  const [compromisoNoVentas, setCompromisoNoVentas] = useState("");
  const [fortalezas, setFortalezas] = useState([]);
  const [observacionesNoVentas, setObservacionesNoVentas] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [historial, setHistorial] = useState([]);

  const objetivoSph = objetivosSPH[producto] || 0;

  useEffect(() => {
    if (!asesor) {
      setHistorial([]);
      return;
    }

    cargarHistorial();
  }, [asesor]);

  async function cargarHistorial() {
    const { data, error } = await supabase
      .from("reportes")
      .select("*")
      .eq("usuario", asesor)
      .order("id", { ascending: true });

    if (!error && data) {
      setHistorial(data);
    }
  }

  async function subirAudio() {
    if (!audio) return null;

    const extension = audio.name.split(".").pop();
    const nombreArchivo = `${asesor}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("audios")
      .upload(nombreArchivo, audio);

    if (error) {
      console.error(error);
      return null;
    }

    const { data } = supabase.storage
      .from("audios")
      .getPublicUrl(nombreArchivo);

    return data.publicUrl;
  }

  async function guardarReporte() {
    if (!asesor || !nota) {
      setMensaje("❌ Seleccioná un asesor y cargá la nota de calidad.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    let audioUrl = null;

    if (audio) {
      audioUrl = await subirAudio();
    }

    const asesorSeleccionado = asesores.find(
      ([, usuario]) => usuario === asesor
    );

    const datos = {
      asesor: asesorSeleccionado?.[0] || asesor,
      usuario: asesor,
      semana,

      nota: Number(nota),
      objetivo_calidad: objetivoCalidad
        ? Number(objetivoCalidad)
        : null,
      estado_objetivo: estadoObjetivo,
      desvio,

      items_calidad: itemsCalidadSeleccionados.join(" | "),
      acciones_calidad: accionesCalidadSeleccionadas.join(" | "),

      auditoria,
      producto,
      observaciones,
      audio_url: audioUrl,

      sph: sph ? Number(sph) : null,
      objetivo_sph: objetivoSph || null,
      ventas: ventas ? Number(ventas) : null,
      objetivo_ventas: objetivoVentas
        ? Number(objetivoVentas)
        : null,

      objetivo_campania: objetivoCampania,
      descripcion_campania: descripcionCampania,

      estado_sph: estadoSph,
      estado_ventas: estadoVentas,
      estado_campania: estadoCampania,

      items_productividad:
        itemsProductividadSeleccionados.join(" | "),

      acciones_productividad:
        accionesProductividadSeleccionadas.join(" | "),

      observaciones_productividad:
        observacionesProductividad,

      tipificaciones: cantidadTipificaciones
        ? Number(cantidadTipificaciones)
        : null,

      objetivo_tipificaciones: objetivoTipificaciones
        ? Number(objetivoTipificaciones)
        : null,

      estado_tipificaciones: estadoTipificaciones,
      tipificacion_desvio: tipificacionDesvio,
      tipificacion_objetivo: tipificacionObjetivo,
      tipificacion_resultado: tipificacionResultado,
      tipificacion_compromiso: tipificacionCompromiso,
      tipificacion_observaciones: tipificacionObservaciones,

      cantidad_no_ventas: cantidadNoVentas
        ? Number(cantidadNoVentas)
        : null,

      om_detectadas: omDetectadas.join(" | "),
      coaching_no_ventas: coachingNoVentas.join(" | "),
      registro_sistema: registroSistema,
      compromiso_no_ventas: compromisoNoVentas,
      fortalezas: fortalezas.join(" | "),
      observaciones_no_ventas: observacionesNoVentas,
    };

    const { error } = await supabase
      .from("reportes")
      .upsert(datos, {
        onConflict: "usuario,semana",
      });

    if (error) {
      console.error(error);
      setMensaje(`❌ No se pudo guardar el reporte: ${error.message}`);
      setGuardando(false);
      return;
    }

    await cargarHistorial();

    setMensaje("✓ Reporte guardado correctamente.");
    setGuardando(false);
  }

  function limpiarFormulario() {
    setAsesor("");
    setSemana("Semana 3 - Agosto");

    setNota("");
    setObjetivoCalidad("");
    setEstadoObjetivo("");
    setDesvio("");
    setItemsCalidadSeleccionados([]);
    setAccionesCalidadSeleccionadas([]);
    setAuditoria("");
    setProducto("AP");
    setObservaciones("");
    setAudio(null);

    setSph("");
    setVentas("");
    setObjetivoVentas("");
    setObjetivoCampania("");
    setDescripcionCampania("");
    setEstadoSph("");
    setEstadoVentas("");
    setEstadoCampania("");

    setItemsProductividadSeleccionados([]);
    setAccionesProductividadSeleccionadas([]);
    setObservacionesProductividad("");

    setCantidadTipificaciones("");
    setObjetivoTipificaciones("");
    setEstadoTipificaciones("");
    setTipificacionDesvio("");
    setTipificacionObjetivo("");
    setTipificacionResultado("");
    setTipificacionCompromiso("");
    setTipificacionObservaciones("");

    setCantidadNoVentas("");
    setOmDetectadas([]);
    setCoachingNoVentas([]);
    setRegistroSistema("");
    setCompromisoNoVentas("");
    setFortalezas([]);
    setObservacionesNoVentas("");

    setMensaje("");
  }

  const promedioHistorial =
    historial.length > 0
      ? historial.reduce((sum, r) => sum + Number(r.nota || 0), 0) /
        historial.length
      : 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f8fafc 0%,#eef2ff 50%,#f8fafc 100%)",
        padding: "30px 18px",
        fontFamily: "Arial, sans-serif",
        color: "#172033",
      }}
    >
      <div style={{ maxWidth: "1150px", margin: "auto" }}>

        {/* HEADER */}

        <section style={sectionStyle}>
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
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  letterSpacing: "1px",
                  color: "#64748b",
                }}
              >
                PORTAL DE CALIDAD
              </div>

              <h1 style={{ margin: "5px 0" }}>
                🏆 Panel de Administración
              </h1>

              <p style={{ color: "#64748b", marginBottom: 0 }}>
                Calidad · Productividad · Tipificaciones · No ventas
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/")}
              style={{
                padding: "11px 18px",
                border: "none",
                borderRadius: "10px",
                background: "#111827",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Ir al portal
            </button>
          </div>

          {mensaje && (
            <div
              style={{
                marginTop: "20px",
                padding: "14px",
                borderRadius: "12px",
                background: mensaje.includes("❌")
                  ? "#fff1f2"
                  : "#ecfdf5",
                border: mensaje.includes("❌")
                  ? "1px solid #fecdd3"
                  : "1px solid #bbf7d0",
                fontWeight: "700",
              }}
            >
              {mensaje}
            </div>
          )}
        </section>

        {/* DATOS */}

        <section style={sectionStyle}>
          <h2>📋 Datos del asesor</h2>

          <label style={{ fontWeight: "700" }}>Asesor</label>

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
        </section>

        {/* CALIDAD */}

        <section style={sectionStyle}>
          <h2>📊 Calidad semanal</h2>

          <label>Semana</label>
          <input
            value={semana}
            onChange={(e) => setSemana(e.target.value)}
            style={inputStyle}
          />

          <label>Nota de calidad semanal</label>
          <input
            type="number"
            min="0"
            max="100"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ejemplo: 85"
            style={inputStyle}
          />

          <label>
            Objetivo de calidad para la próxima semana
          </label>

          <input
            type="number"
            min="0"
            max="100"
            value={objetivoCalidad}
            onChange={(e) => setObjetivoCalidad(e.target.value)}
            placeholder="Ejemplo: 90"
            style={inputStyle}
          />

          <label>Estado del objetivo</label>

          <select
            value={estadoObjetivo}
            onChange={(e) => setEstadoObjetivo(e.target.value)}
            style={inputStyle}
          >
            <option value="">Seleccionar estado</option>
            <option>✅ OBJETIVO ALCANZADO</option>
            <option>⚠️ SEGUIMIENTO</option>
            <option>❌ DEBAJO DEL OBJETIVO</option>
          </select>

          <label>Desvío principal</label>

          <input
            value={desvio}
            onChange={(e) => setDesvio(e.target.value)}
            placeholder="Ejemplo: Validación de datos"
            style={inputStyle}
          />

          <MultiSelect
            label="Items trabajados"
            options={itemsCalidad}
            value={itemsCalidadSeleccionados}
            setValue={setItemsCalidadSeleccionados}
          />

          <MultiSelect
            label="Acción realizada"
            options={accionesCalidad}
            value={accionesCalidadSeleccionadas}
            setValue={setAccionesCalidadSeleccionadas}
          />

          <label>Auditoría</label>

          <input
            value={auditoria}
            onChange={(e) => setAuditoria(e.target.value)}
            placeholder="Llamada auditada / referencia"
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
            <option>SL</option>
            <option>CP</option>
          </select>

          <div
            style={{
              padding: "18px",
              borderRadius: "14px",
              background: "#f8fafc",
              marginBottom: "18px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>🎧 Audio de muestra</h3>

            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudio(e.target.files?.[0] || null)}
              style={{ marginBottom: "10px" }}
            />

            {audio && (
              <div style={{ marginTop: "10px" }}>
                <audio
                  controls
                  src={URL.createObjectURL(audio)}
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div>

          <label>Observaciones</label>

          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Espacio para escribir"
            style={{ ...inputStyle, minHeight: "110px" }}
          />

          {historial.length > 0 && (
            <div
              style={{
                padding: "18px",
                borderRadius: "15px",
                background: "#f8fafc",
                marginTop: "20px",
              }}
            >
              <h3>📈 Evolución de calidad</h3>

              <p>
                Promedio histórico:{" "}
                <strong>{promedioHistorial.toFixed(1)}</strong>
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  gap: "8px",
                  height: "150px",
                  borderBottom: "1px solid #cbd5e1",
                  padding: "10px",
                }}
              >
                {historial.map((r, i) => (
                  <div
                    key={r.id}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ fontSize: "12px" }}>
                      {Number(r.nota || 0)}
                    </strong>

                    <div
                      style={{
                        width: "100%",
                        maxWidth: "45px",
                        height: `${Math.max(
                          Number(r.nota || 0),
                          5
                        )}%`,
                        background: "#111827",
                        borderRadius: "7px 7px 0 0",
                      }}
                    />

                    <small>S{i + 1}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* PRODUCTIVIDAD */}

        <section style={sectionStyle}>
          <h2>📈 Productividad semanal</h2>

          <label>SPH</label>

          <input
            type="number"
            step="0.01"
            value={sph}
            onChange={(e) => setSph(e.target.value)}
            placeholder="Ejemplo: 0.48"
            style={inputStyle}
          />

          <label>Objetivo SPH</label>

          <input
            value={objetivoSph || ""}
            readOnly
            style={{
              ...inputStyle,
              background: "#f1f5f9",
              fontWeight: "700",
            }}
          />

          {sph && objetivoSph > 0 && (
            <BarraProgreso
              actual={Number(sph)}
              objetivo={objetivoSph}
            />
          )}

          <label>Ventas</label>

          <input
            type="number"
            value={ventas}
            onChange={(e) => setVentas(e.target.value)}
            style={inputStyle}
          />

          <label>Objetivo de ventas</label>

          <input
            type="number"
            value={objetivoVentas}
            onChange={(e) => setObjetivoVentas(e.target.value)}
            style={inputStyle}
          />

          {ventas && objetivoVentas && (
            <BarraProgreso
              actual={Number(ventas)}
              objetivo={Number(objetivoVentas)}
            />
          )}

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
            onChange={(e) => setEstadoVentas(e.target.value)}
            style={inputStyle}
          >
            <option value="">Seleccionar estado</option>
            <option>Cumplido</option>
            <option>Alcanzado</option>
            <option>En proceso</option>
            <option>No alcanzado</option>
          </select>

          <label>Objetivo de campaña: Resultado semanal</label>

          <input
            value={objetivoCampania}
            onChange={(e) => setObjetivoCampania(e.target.value)}
            style={inputStyle}
          />

          <label>Objetivo de campaña</label>

          <textarea
            value={descripcionCampania}
            onChange={(e) => setDescripcionCampania(e.target.value)}
            style={{ ...inputStyle, minHeight: "80px" }}
          />

          <label>Estado objetivo de campaña</label>

          <select
            value={estadoCampania}
            onChange={(e) => setEstadoCampania(e.target.value)}
            style={inputStyle}
          >
            <option value="">Seleccionar estado</option>
            <option>Cumplido</option>
            <option>Alcanzado</option>
            <option>En proceso</option>
            <option>No alcanzado</option>
          </select>

          <MultiSelect
            label="Items trabajados"
            options={itemsProductividad}
            value={itemsProductividadSeleccionados}
            setValue={setItemsProductividadSeleccionados}
          />

          <MultiSelect
            label="Acción realizada"
            options={accionesProductividad}
            value={accionesProductividadSeleccionadas}
            setValue={setAccionesProductividadSeleccionadas}
          />

          <label>Observaciones</label>

          <textarea
            value={observacionesProductividad}
            onChange={(e) =>
              setObservacionesProductividad(e.target.value)
            }
            style={{ ...inputStyle, minHeight: "100px" }}
          />
        </section>

        {/* TIPIFICACIONES */}

        <section style={sectionStyle}>
          <h2>📈 Desvíos de tipificaciones</h2>

          <label>Tipificaciones</label>

          <select
            value={tipificacionDesvio}
            onChange={(e) => setTipificacionDesvio(e.target.value)}
            style={inputStyle}
          >
            <option value="">Seleccionar tipificación</option>

            {tipificaciones.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label>Cantidad de tipificaciones</label>

          <input
            type="number"
            value={cantidadTipificaciones}
            onChange={(e) => setCantidadTipificaciones(e.target.value)}
            style={inputStyle}
          />

          <label>Objetivo de tipificaciones</label>

          <input
            type="number"
            value={objetivoTipificaciones}
            onChange={(e) =>
              setObjetivoTipificaciones(e.target.value)
            }
            style={inputStyle}
          />

          {cantidadTipificaciones && objetivoTipificaciones && (
            <BarraProgreso
              actual={Number(cantidadTipificaciones)}
              objetivo={Number(objetivoTipificaciones)}
            />
          )}

          <label>Desvío</label>

          <textarea
            value={tipificacionDesvio}
            onChange={(e) => setTipificacionDesvio(e.target.value)}
            style={{ ...inputStyle, minHeight: "70px" }}
          />

          <label>Objetivo</label>

          <input
            value={tipificacionObjetivo}
            onChange={(e) => setTipificacionObjetivo(e.target.value)}
            style={inputStyle}
          />

          <label>Resultado</label>

          <input
            value={tipificacionResultado}
            onChange={(e) =>
              setTipificacionResultado(e.target.value)
            }
            style={inputStyle}
          />

          <label>Compromiso esperado</label>

          <select
            value={tipificacionCompromiso}
            onChange={(e) =>
              setTipificacionCompromiso(e.target.value)
            }
            style={inputStyle}
          >
            <option value="">Seleccionar</option>
            <option>✅ APLICA DEVOLUCIÓN</option>
            <option>⚠️ SEGUIMIENTO</option>
            <option>❌ NO APLICA</option>
          </select>

          <label>Observaciones</label>

          <textarea
            value={tipificacionObservaciones}
            onChange={(e) =>
              setTipificacionObservaciones(e.target.value)
            }
            style={{ ...inputStyle, minHeight: "100px" }}
          />
        </section>

        {/* NO VENTAS */}

        <section style={sectionStyle}>
          <h2>📈 Auditorías de no ventas</h2>

          <label>Cantidad de auditorías realizadas</label>

          <input
            type="number"
            value={cantidadNoVentas}
            onChange={(e) => setCantidadNoVentas(e.target.value)}
            style={inputStyle}
          />

          <MultiSelect
            label="Principales O.M. detectadas"
            options={itemsProductividad}
            value={omDetectadas}
            setValue={setOmDetectadas}
          />

          <MultiSelect
            label="Coaching brindado"
            options={accionesProductividad}
            value={coachingNoVentas}
            setValue={setCoachingNoVentas}
          />

          <label>Registro en sistema</label>

          <select
            value={registroSistema}
            onChange={(e) => setRegistroSistema(e.target.value)}
            style={inputStyle}
          >
            <option value="">Seleccionar</option>
            <option>✅ CORRECTA</option>
            <option>❌ INCORRECTA</option>
          </select>

          <label>Compromiso esperado</label>

          <select
            value={compromisoNoVentas}
            onChange={(e) =>
              setCompromisoNoVentas(e.target.value)
            }
            style={inputStyle}
          >
            <option value="">Seleccionar</option>
            <option>✅ APLICA DEVOLUCIÓN</option>
            <option>⚠️ SEGUIMIENTO</option>
            <option>❌ NO APLICA</option>
          </select>

          <MultiSelect
            label="Fortalezas destacadas"
            options={fortalezas}
            value={fortalezas}
            setValue={setFortalezas}
          />

          <label>Observaciones</label>

          <textarea
            value={observacionesNoVentas}
            onChange={(e) =>
              setObservacionesNoVentas(e.target.value)
            }
            style={{ ...inputStyle, minHeight: "120px" }}
          />
        </section>

        {/* BOTONES */}

        <section style={sectionStyle}>
          <button
            onClick={guardarReporte}
            disabled={guardando}
            style={{
              width: "100%",
              padding: "17px",
              border: "none",
              borderRadius: "13px",
              background: guardando ? "#94a3b8" : "#111827",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "800",
              cursor: guardando ? "not-allowed" : "pointer",
            }}
          >
            {guardando ? "GUARDANDO..." : "💾 GUARDAR REPORTE COMPLETO"}
          </button>

          <button
            onClick={limpiarFormulario}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "13px",
              background: "#fff",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            LIMPIAR FORMULARIO
          </button>
        </section>
      </div>
    </main>
  );
}
