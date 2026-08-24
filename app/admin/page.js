"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

/* =========================================================
   DATOS DEL PORTAL
========================================================= */

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

const opcionesItemsCalidad = [
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

const opcionesAccionesCalidad = [
  "Feedback individual",
  "Espacio de coaching",
  "Escucha en línea",
  "Devolución mediante Meet",
  "Escucha de llamada de un compañero",
  "Transcripción de venta mediante Word con desvíos marcados",
  "Calibración conjunta de audio",
  "Otros",
];

const opcionesItemsProductividad = [
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

const opcionesAccionesProductividad = [
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

const opcionesTipificaciones = [
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

const opcionesFortalezas = [
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

const estados = [
  "Cumplido",
  "Alcanzado",
  "En proceso",
  "No alcanzado",
];

const estadosObjetivo = [
  "OBJETIVO ALCANZADO",
  "SEGUIMIENTO",
  "DEBAJO DEL OBJETIVO",
];

const compromisos = [
  "APLICA DEVOLUCIÓN",
  "SEGUIMIENTO",
  "NO APLICA",
];

/* =========================================================
   COMPONENTES
========================================================= */

function MultiSelect({ label, options, value, onChange }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>

      <select
        multiple
        value={value || []}
        onChange={(e) => {
          const seleccionados = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          );
          onChange(seleccionados);
        }}
        style={styles.multiSelect}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <small style={styles.help}>
        Podés seleccionar varias opciones manteniendo CTRL.
      </small>

      {value?.length > 0 && (
        <div style={styles.selectedBox}>
          <strong>Seleccionado:</strong> {value.join(" • ")}
        </div>
      )}
    </div>
  );
}

function Section({ number, title, subtitle, children }) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionNumber}>{number}</div>

        <div>
          <h2 style={styles.sectionTitle}>{title}</h2>

          {subtitle && (
            <p style={styles.subtitle}>{subtitle}</p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

function Metric({ title, value, detail }) {
  return (
    <div style={styles.metricCard}>
      <span style={styles.metricTitle}>{title}</span>
      <strong style={styles.metricValue}>{value}</strong>

      {detail && (
        <small style={styles.metricDetail}>{detail}</small>
      )}
    </div>
  );
}

/* =========================================================
   ADMIN
========================================================= */

export default function AdminPage() {
  const [asesor, setAsesor] = useState("");
  const [semana, setSemana] = useState("Semana 3 - Agosto");

  /* CALIDAD */
  const [nota, setNota] = useState("");
  const [objetivoCalidad, setObjetivoCalidad] = useState("");
  const [estadoObjetivo, setEstadoObjetivo] = useState("");
  const [desvio, setDesvio] = useState("");
  const [recomendacion, setRecomendacion] = useState("");
  const [auditoria, setAuditoria] = useState("");
  const [producto, setProducto] = useState("AP");
  const [observacionesCalidad, setObservacionesCalidad] = useState("");

  const [itemsCalidadSeleccionados, setItemsCalidadSeleccionados] =
    useState([]);

  const [accionesCalidadSeleccionadas, setAccionesCalidadSeleccionadas] =
    useState([]);

  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");

  /* PRODUCTIVIDAD */
  const [sph, setSph] = useState("");
  const [ventas, setVentas] = useState("");
  const [objetivoVentas, setObjetivoVentas] = useState("");
  const [objetivoCampania, setObjetivoCampania] = useState("");
  const [descripcionCampania, setDescripcionCampania] = useState("");
  const [estadoSph, setEstadoSph] = useState("");
  const [estadoVentas, setEstadoVentas] = useState("");
  const [estadoCampania, setEstadoCampania] = useState("");

  const [
    itemsProductividadSeleccionados,
    setItemsProductividadSeleccionados,
  ] = useState([]);

  const [
    accionesProductividadSeleccionadas,
    setAccionesProductividadSeleccionadas,
  ] = useState([]);

  const [
    observacionesProductividad,
    setObservacionesProductividad,
  ] = useState("");

  /* TIPIFICACIONES */
  const [objetivoTipificaciones, setObjetivoTipificaciones] = useState("");
  const [tipificacionesSeleccionadas, setTipificacionesSeleccionadas] =
    useState([]);
  const [estadoTipificaciones, setEstadoTipificaciones] = useState("");
  const [tipificacion, setTipificacion] = useState("");
  const [tipificacionDesvio, setTipificacionDesvio] = useState("");
  const [tipificacionObjetivo, setTipificacionObjetivo] = useState("");
  const [tipificacionResultado, setTipificacionResultado] = useState("");
  const [tipificacionCompromiso, setTipificacionCompromiso] = useState("");
  const [tipificacionObservaciones, setTipificacionObservaciones] =
    useState("");

  /* NO VENTAS */
  const [cantidadNoVentas, setCantidadNoVentas] = useState("");
  const [principalesOM, setPrincipalesOM] = useState([]);
  const [coachingNoVentas, setCoachingNoVentas] = useState([]);
  const [registroSistema, setRegistroSistema] = useState("");
  const [compromisoNoVentas, setCompromisoNoVentas] = useState("");
  const [fortalezasSeleccionadas, setFortalezasSeleccionadas] = useState([]);
  const [observacionesNoVentas, setObservacionesNoVentas] = useState("");

  /* GENERAL */
  const [historico, setHistorico] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  /* =========================================================
     OBJETIVOS SPH
  ========================================================= */

  const objetivosSPH = {
    AP: 0.5,
    BM: 0.45,
    SL: 0.55,
    CP: 0,
  };

  const objetivoSPH = objetivosSPH[producto] || 0;

  /* =========================================================
     HISTÓRICO
  ========================================================= */

  useEffect(() => {
    async function cargarHistorico() {
      if (!asesor || !supabase) {
        setHistorico([]);
        return;
      }

      const { data, error } = await supabase
        .from("reportes")
        .select(
          "id,semana,nota,sph,objetivo_sph,ventas,objetivo_ventas"
        )
        .eq("usuario", asesor)
        .order("id", { ascending: true });

      if (!error) {
        setHistorico(data || []);
      } else {
        console.error("Error cargando histórico:", error);
      }
    }

    cargarHistorico();
  }, [asesor]);

  /* =========================================================
     CÁLCULOS
  ========================================================= */

  const porcentajeSPH = useMemo(() => {
    if (!sph || !objetivoSPH) return 0;

    return Math.min(
      100,
      Math.max(0, (Number(sph) / objetivoSPH) * 100)
    );
  }, [sph, objetivoSPH]);

  const faltaSPH = useMemo(() => {
    if (!objetivoSPH) return 0;

    return Math.max(
      0,
      objetivoSPH - Number(sph || 0)
    );
  }, [sph, objetivoSPH]);

  /* =========================================================
     AUDIO
     
     IMPORTANTE:
     Esta función solamente intenta subir el audio.
     Si falla, NO se cae el guardado del reporte.
  ========================================================= */

  async function subirAudio() {
    if (!audioFile) return "";

    if (!supabase) {
      throw new Error("Supabase no está configurado.");
    }

    if (!asesor) {
      throw new Error(
        "Seleccioná un asesor antes de subir el audio."
      );
    }

    const extension =
      audioFile.name.split(".").pop()?.toLowerCase() || "mp3";

    const nombreArchivo =
      `${asesor}/${Date.now()}-${audioFile.name}`;

    const { error } = await supabase.storage
      .from("audios")
      .upload(nombreArchivo, audioFile, {
        cacheControl: "3600",
        upsert: true,
        contentType: audioFile.type || `audio/${extension}`,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("audios")
      .getPublicUrl(nombreArchivo);

    return data?.publicUrl || "";
  }

  /* =========================================================
     GUARDAR REPORTE
  ========================================================= */

  async function guardarReporte() {
    if (!asesor) {
      setMensaje("❌ Seleccioná un asesor.");
      return;
    }

    if (!nota) {
      setMensaje("❌ Cargá la nota de calidad.");
      return;
    }

    if (!supabase) {
      setMensaje(
        "❌ Supabase no está configurado correctamente."
      );
      return;
    }

    setGuardando(true);
    setMensaje("");

    let urlAudioFinal = audioUrl;
    let errorAudio = "";

    try {
      /* =====================================================
         AUDIO: SI FALLA, NO BLOQUEA EL REPORTE
      ===================================================== */

      if (audioFile) {
        try {
          urlAudioFinal = await subirAudio();
        } catch (audioError) {
          console.error(
            "ERROR SUBIENDO AUDIO:",
            audioError
          );

          errorAudio =
            audioError?.message ||
            "No se pudo subir el audio.";

          urlAudioFinal = "";
        }
      }

      const asesorSeleccionado = asesores.find(
        ([, usuario]) => usuario === asesor
      );

      const datos = {
        asesor: asesorSeleccionado?.[0] || asesor,
        usuario: asesor,
        semana,

        nota: Number(nota),

        evolucion: "",

        objetivo: objetivoCalidad
          ? Number(objetivoCalidad)
          : null,

        desvio,
        recomendacion,
        auditoria,
        producto,

        observaciones: observacionesCalidad,

        objetivo_calidad: objetivoCalidad
          ? Number(objetivoCalidad)
          : null,

        estado_objetivo: estadoObjetivo,

        items_calidad: itemsCalidadSeleccionados,

        acciones_calidad: accionesCalidadSeleccionadas,

        audio_url: urlAudioFinal || null,

        sph: sph ? Number(sph) : null,

        objetivo_sph: objetivoSPH || null,

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
          itemsProductividadSeleccionados,

        acciones_productividad:
          accionesProductividadSeleccionadas,

        gestion:
          accionesProductividadSeleccionadas.join(", "),

        objetivo_tipificaciones:
          objetivoTipificaciones
            ? Number(objetivoTipificaciones)
            : null,

        tipificaciones: tipificacionesSeleccionadas,

        estado_tipificaciones:
          estadoTipificaciones,

        tipificacion,

        tipificacion_desvio:
          tipificacionDesvio,

        tipificacion_objetivo:
          tipificacionObjetivo,

        tipificacion_resultado:
          tipificacionResultado,

        tipificacion_compromiso:
          tipificacionCompromiso,

        tipificacion_observaciones:
          tipificacionObservaciones,

        desvio_tipificacion:
          tipificacionDesvio,

        objetivo_tipificacion:
          tipificacionObjetivo,

        resultado_tipificacion:
          tipificacionResultado,

        compromiso_tipificacion:
          tipificacionCompromiso,

        observaciones_tipificacion:
          tipificacionObservaciones,

        cantidad_no_ventas:
          cantidadNoVentas
            ? Number(cantidadNoVentas)
            : null,

        om_detectadas: principalesOM,

        principales_om: principalesOM,

        coaching_no_ventas: coachingNoVentas,

        registro_sistema: registroSistema,

        compromiso_no_ventas:
          compromisoNoVentas,

        fortalezas:
          fortalezasSeleccionadas,

        observaciones_no_ventas:
          observacionesNoVentas,

        items_trabajados:
          itemsCalidadSeleccionados,

        acciones_realizadas:
          accionesCalidadSeleccionadas,
      };

      console.log("DATOS A GUARDAR:", datos);

      /* =====================================================
         GUARDAMOS EL REPORTE AUNQUE EL AUDIO HAYA FALLADO
      ===================================================== */

      const { error } = await supabase
        .from("reportes")
        .upsert(datos, {
          onConflict: "usuario,semana",
        });

      if (error) {
        console.error("ERROR SUPABASE:", error);

        setMensaje(
          `❌ No se pudo guardar: ${error.message}`
        );

        return;
      }

      setAudioUrl(urlAudioFinal || "");

      /* =====================================================
         MENSAJE FINAL
      ===================================================== */

      if (errorAudio) {
        setMensaje(
          `✓ REPORTE GUARDADO CORRECTAMENTE — ⚠️ El audio no se pudo subir: ${errorAudio}`
        );
      } else {
        setMensaje(
          "✓ REPORTE GUARDADO CORRECTAMENTE"
        );
      }

      /* =====================================================
         ACTUALIZAR HISTÓRICO
      ===================================================== */

      const {
        data: historicoNuevo,
        error: errorHistorico,
      } = await supabase
        .from("reportes")
        .select(
          "id,semana,nota,sph,objetivo_sph,ventas,objetivo_ventas"
        )
        .eq("usuario", asesor)
        .order("id", { ascending: true });

      if (!errorHistorico) {
        setHistorico(historicoNuevo || []);
      }
    } catch (error) {
      console.error("ERROR GENERAL:", error);

      setMensaje(
        `❌ Error: ${
          error?.message ||
          "No se pudo guardar el reporte."
        }`
      );
    } finally {
      setGuardando(false);
    }
  }

  /* =========================================================
     LIMPIAR
  ========================================================= */

  function limpiarFormulario() {
    setAsesor("");
    setSemana("Semana 3 - Agosto");

    setNota("");
    setObjetivoCalidad("");
    setEstadoObjetivo("");
    setDesvio("");
    setRecomendacion("");
    setAuditoria("");
    setProducto("AP");
    setObservacionesCalidad("");

    setItemsCalidadSeleccionados([]);
    setAccionesCalidadSeleccionadas([]);

    setAudioFile(null);
    setAudioUrl("");

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

    setObjetivoTipificaciones("");
    setTipificacionesSeleccionadas([]);
    setEstadoTipificaciones("");
    setTipificacion("");
    setTipificacionDesvio("");
    setTipificacionObjetivo("");
    setTipificacionResultado("");
    setTipificacionCompromiso("");
    setTipificacionObservaciones("");

    setCantidadNoVentas("");
    setPrincipalesOM([]);
    setCoachingNoVentas([]);
    setRegistroSistema("");
    setCompromisoNoVentas("");
    setFortalezasSeleccionadas([]);
    setObservacionesNoVentas("");

    setHistorico([]);
    setMensaje("");
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <header style={styles.hero}>
          <div>
            <div style={styles.badge}>
              🏆 PORTAL DE CALIDAD
            </div>

            <h1 style={styles.heroTitle}>
              Panel de Administración
            </h1>

            <p style={styles.heroText}>
              Gestioná calidad, productividad y
              evolución de cada asesor desde un
              solo lugar.
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            style={styles.darkButton}
          >
            Cerrar sesión
          </button>
        </header>

        {/* =================================================
            01 DATOS
        ================================================= */}

        <Section
          number="01"
          title="📋 Datos del asesor"
          subtitle="Seleccioná el asesor y la semana del reporte."
        >
          <div style={styles.grid2}>
            <div>
              <label style={styles.label}>Asesor</label>

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

                {asesores.map(([nombre, usuario]) => (
                  <option key={usuario} value={usuario}>
                    {nombre} — {usuario}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>Semana</label>

              <input
                value={semana}
                onChange={(e) =>
                  setSemana(e.target.value)
                }
                style={styles.input}
              />
            </div>
          </div>
        </Section>

        {/* =================================================
            02 CALIDAD
        ================================================= */}

        <Section
          number="02"
          title="📊 Calidad semanal"
          subtitle="Registrá el resultado de calidad y el objetivo que tendrá el asesor para la próxima semana."
        >
          <div style={styles.metricGrid}>
            <Metric
              title="Nota actual"
              value={nota || "—"}
              detail="Resultado semanal"
            />

            <Metric
              title="Objetivo próximo"
              value={objetivoCalidad || "—"}
              detail="Meta de la próxima semana"
            />

            <Metric
              title="Desvío principal"
              value={desvio || "—"}
              detail="Principal oportunidad"
            />
          </div>

          <div style={styles.grid2}>
            <div>
              <label style={styles.label}>
                Nota de calidad semanal
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={nota}
                onChange={(e) =>
                  setNota(e.target.value)
                }
                style={styles.input}
                placeholder="Ejemplo: 85"
              />
            </div>

            <div>
              <label style={styles.label}>
                🎯 Objetivo para la próxima semana
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={objetivoCalidad}
                onChange={(e) =>
                  setObjetivoCalidad(
                    e.target.value
                  )
                }
                style={styles.input}
                placeholder="Ejemplo: 90"
              />
            </div>
          </div>

          <label style={styles.label}>
            Estado del objetivo
          </label>

          <select
            value={estadoObjetivo}
            onChange={(e) =>
              setEstadoObjetivo(e.target.value)
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar estado
            </option>

            {estadosObjetivo.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>

          <label style={styles.label}>
            Desvío principal
          </label>

          <input
            value={desvio}
            onChange={(e) =>
              setDesvio(e.target.value)
            }
            style={styles.input}
            placeholder="Ejemplo: Validación de datos"
          />

          <label style={styles.label}>
            Recomendación
          </label>

          <textarea
            value={recomendacion}
            onChange={(e) =>
              setRecomendacion(e.target.value)
            }
            style={styles.textarea}
            placeholder="Indicación para que el asesor pueda mejorar..."
          />

          <MultiSelect
            label="Items trabajados"
            options={opcionesItemsCalidad}
            value={itemsCalidadSeleccionados}
            onChange={setItemsCalidadSeleccionados}
          />

          <MultiSelect
            label="Acción realizada"
            options={opcionesAccionesCalidad}
            value={accionesCalidadSeleccionadas}
            onChange={setAccionesCalidadSeleccionadas}
          />

          <div style={styles.grid2}>
            <div>
              <label style={styles.label}>
                Auditoría
              </label>

              <input
                value={auditoria}
                onChange={(e) =>
                  setAuditoria(e.target.value)
                }
                style={styles.input}
                placeholder="Llamada auditada / referencia"
              />
            </div>

            <div>
              <label style={styles.label}>
                Producto
              </label>

              <select
                value={producto}
                onChange={(e) =>
                  setProducto(e.target.value)
                }
                style={styles.input}
              >
                <option value="AP">AP</option>
                <option value="BM">BM</option>
                <option value="SL">SL</option>
                <option value="CP">CP</option>
              </select>
            </div>
          </div>

          {/* AUDIO */}

          <div style={styles.audioBox}>
            <h3 style={styles.audioTitle}>
              🎧 Audio de auditoría
            </h3>

            <p style={styles.subtitle}>
              Subí una llamada para que pueda ser
              escuchada desde el portal.
            </p>

            <input
              type="file"
              accept="audio/*"
              onChange={(e) =>
                setAudioFile(
                  e.target.files?.[0] || null
                )
              }
              style={styles.fileInput}
            />

            {audioFile && (
              <p style={styles.fileName}>
                Archivo: {audioFile.name}
              </p>
            )}

            {audioUrl && (
              <audio
                controls
                src={audioUrl}
                style={{
                  width: "100%",
                  marginTop: "15px",
                }}
              />
            )}
          </div>

          <label style={styles.label}>
            Observaciones
          </label>

          <textarea
            value={observacionesCalidad}
            onChange={(e) =>
              setObservacionesCalidad(
                e.target.value
              )
            }
            style={styles.textarea}
            placeholder="Observaciones de calidad..."
          />

          {historico.length > 0 && (
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>
                📈 Evolución de calidad
              </h3>

              <div style={styles.barChart}>
                {historico.map((item, index) => {
                  const value =
                    Number(item.nota) || 0;

                  return (
                    <div
                      key={index}
                      style={styles.chartColumn}
                    >
                      <div
                        style={{
                          ...styles.chartBar,
                          height: `${Math.max(
                            8,
                            value
                          )}%`,
                        }}
                      >
                        <span style={styles.chartValue}>
                          {value}
                        </span>
                      </div>

                      <small>
                        {item.semana?.replace(
                          "Semana ",
                          "S"
                        )}
                      </small>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Section>

        {/* =================================================
            03 PRODUCTIVIDAD
        ================================================= */}

        <Section
          number="03"
          title="📈 Productividad semanal"
          subtitle="Compará el desempeño del asesor contra sus objetivos."
        >
          <div style={styles.metricGrid}>
            <Metric
              title="SPH"
              value={
                sph
                  ? Number(sph)
                      .toFixed(2)
                      .replace(".", ",")
                  : "0,00"
              }
            />

            <Metric
              title="Objetivo SPH"
              value={objetivoSPH
                .toFixed(2)
                .replace(".", ",")}
              detail={`Producto ${producto}`}
            />

            <Metric
              title="Falta"
              value={faltaSPH
                .toFixed(2)
                .replace(".", ",")}
            />

            <Metric
              title="Progreso"
              value={`${Math.round(
                porcentajeSPH
              )}%`}
            />
          </div>

          <div style={styles.progressOuter}>
            <div
              style={{
                ...styles.progressInner,
                width: `${porcentajeSPH}%`,
              }}
            />
          </div>

          <p style={styles.progressText}>
            {sph
              ? Number(sph) >= objetivoSPH
                ? "🎯 Objetivo SPH alcanzado."
                : `Faltan ${faltaSPH
                    .toFixed(2)
                    .replace(
                      ".",
                      ","
                    )} para alcanzar el objetivo.`
              : "Cargá el SPH para calcular el progreso."}
          </p>

          <div style={styles.grid2}>
            <div>
              <label style={styles.label}>
                SPH
              </label>

              <input
                type="number"
                step="0.01"
                value={sph}
                onChange={(e) =>
                  setSph(e.target.value)
                }
                style={styles.input}
                placeholder="Ejemplo: 0.48"
              />
            </div>

            <div>
              <label style={styles.label}>
                Objetivo SPH automático
              </label>

              <input
                readOnly
                value={
                  objetivoSPH
                    ? objetivoSPH.toFixed(2)
                    : "Sin objetivo"
                }
                style={{
                  ...styles.input,
                  background: "#f1f5f9",
                }}
              />
            </div>
          </div>

          <div style={styles.grid2}>
            <div>
              <label style={styles.label}>
                Ventas
              </label>

              <input
                type="number"
                value={ventas}
                onChange={(e) =>
                  setVentas(e.target.value)
                }
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>
                Objetivo de ventas
              </label>

              <input
                type="number"
                value={objetivoVentas}
                onChange={(e) =>
                  setObjetivoVentas(
                    e.target.value
                  )
                }
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.grid2}>
            <div>
              <label style={styles.label}>
                Estado SPH
              </label>

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

                {estados.map((estado) => (
                  <option
                    key={estado}
                    value={estado}
                  >
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>
                Estado ventas
              </label>

              <select
                value={estadoVentas}
                onChange={(e) =>
                  setEstadoVentas(
                    e.target.value
                  )
                }
                style={styles.input}
              >
                <option value="">
                  Seleccionar estado
                </option>

                {estados.map((estado) => (
                  <option
                    key={estado}
                    value={estado}
                  >
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label style={styles.label}>
            🎯 Objetivo de campaña
          </label>

          <input
            value={objetivoCampania}
            onChange={(e) =>
              setObjetivoCampania(
                e.target.value
              )
            }
            style={styles.input}
            placeholder="Resultado semanal"
          />

          <label style={styles.label}>
            Descripción / objetivo de campaña
          </label>

          <textarea
            value={descripcionCampania}
            onChange={(e) =>
              setDescripcionCampania(
                e.target.value
              )
            }
            style={styles.textarea}
          />

          <label style={styles.label}>
            Estado objetivo de campaña
          </label>

          <select
            value={estadoCampania}
            onChange={(e) =>
              setEstadoCampania(
                e.target.value
              )
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar estado
            </option>

            {estados.map((estado) => (
              <option
                key={estado}
                value={estado}
              >
                {estado}
              </option>
            ))}
          </select>

          <MultiSelect
            label="Items trabajados"
            options={opcionesItemsProductividad}
            value={
              itemsProductividadSeleccionados
            }
            onChange={
              setItemsProductividadSeleccionados
            }
          />

          <MultiSelect
            label="Acción realizada"
            options={opcionesAccionesProductividad}
            value={
              accionesProductividadSeleccionadas
            }
            onChange={
              setAccionesProductividadSeleccionadas
            }
          />

          <label style={styles.label}>
            Observaciones
          </label>

          <textarea
            value={observacionesProductividad}
            onChange={(e) =>
              setObservacionesProductividad(
                e.target.value
              )
            }
            style={styles.textarea}
          />
        </Section>

        {/* =================================================
            04 EVOLUCIÓN
        ================================================= */}

        <Section
          number="04"
          title="📊 Evolución de productividad"
          subtitle="Seguimiento semanal de SPH y ventas."
        >
          {historico.length > 0 ? (
            <>
              <div style={styles.barChartLarge}>
                {historico.map((item, index) => {
                  const value =
                    Number(item.sph) || 0;

                  const max = Math.max(
                    objetivoSPH || 0.5,
                    ...historico.map(
                      (x) =>
                        Number(x.sph) || 0
                    ),
                    0.6
                  );

                  return (
                    <div
                      key={index}
                      style={styles.chartColumn}
                    >
                      <div
                        style={{
                          ...styles.chartBar,
                          height: `${Math.max(
                            8,
                            (value / max) *
                              100
                          )}%`,
                        }}
                      >
                        <span style={styles.chartValue}>
                          {value.toFixed(2)}
                        </span>
                      </div>

                      <small>
                        {item.semana?.replace(
                          "Semana ",
                          "S"
                        )}
                      </small>
                    </div>
                  );
                })}
              </div>

              <div style={styles.comparisonTable}>
                <div>Semana</div>
                <div>SPH</div>
                <div>Ventas</div>
                <div>Objetivo</div>

                {historico.map((item, index) => (
                  <div
                    key={index}
                    style={styles.tableRow}
                  >
                    <span>{item.semana}</span>

                    <span>
                      {Number(
                        item.sph || 0
                      ).toFixed(2)}
                    </span>

                    <span>
                      {item.ventas ?? "-"}
                    </span>

                    <span>
                      {Number(
                        item.objetivo_sph ||
                          objetivoSPH ||
                          0
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={styles.empty}>
              Seleccioná un asesor para visualizar
              su evolución.
            </div>
          )}
        </Section>

        {/* =================================================
            05 TIPIFICACIONES
        ================================================= */}

        <Section
          number="05"
          title="📈 Desvíos de tipificaciones"
          subtitle="Registrá los desvíos y el objetivo de mejora."
        >
          <div style={styles.grid2}>
            <div>
              <label style={styles.label}>
                Objetivo de tipificaciones
              </label>

              <input
                type="number"
                value={objetivoTipificaciones}
                onChange={(e) =>
                  setObjetivoTipificaciones(
                    e.target.value
                  )
                }
                style={styles.input}
              />
            </div>

            <div>
              <label style={styles.label}>
                Estado
              </label>

              <select
                value={estadoTipificaciones}
                onChange={(e) =>
                  setEstadoTipificaciones(
                    e.target.value
                  )
                }
                style={styles.input}
              >
                <option value="">
                  Seleccionar estado
                </option>

                {estados.map((estado) => (
                  <option
                    key={estado}
                    value={estado}
                  >
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <MultiSelect
            label="Tipificaciones trabajadas"
            options={opcionesTipificaciones}
            value={tipificacionesSeleccionadas}
            onChange={
              setTipificacionesSeleccionadas
            }
          />

          <label style={styles.label}>
            Tipificación
          </label>

          <select
            value={tipificacion}
            onChange={(e) =>
              setTipificacion(e.target.value)
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar tipificación
            </option>

            {opcionesTipificaciones.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <label style={styles.label}>
            Desvío
          </label>

          <input
            value={tipificacionDesvio}
            onChange={(e) =>
              setTipificacionDesvio(
                e.target.value
              )
            }
            style={styles.input}
          />

          <label style={styles.label}>
            Objetivo para la próxima semana
          </label>

          <input
            type="number"
            value={tipificacionObjetivo}
            onChange={(e) =>
              setTipificacionObjetivo(
                e.target.value
              )
            }
            style={styles.input}
          />

          <label style={styles.label}>
            Resultado
          </label>

          <input
            value={tipificacionResultado}
            onChange={(e) =>
              setTipificacionResultado(
                e.target.value
              )
            }
            style={styles.input}
          />

          <label style={styles.label}>
            Compromiso esperado
          </label>

          <select
            value={tipificacionCompromiso}
            onChange={(e) =>
              setTipificacionCompromiso(
                e.target.value
              )
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar
            </option>

            {compromisos.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <label style={styles.label}>
            Observaciones
          </label>

          <textarea
            value={tipificacionObservaciones}
            onChange={(e) =>
              setTipificacionObservaciones(
                e.target.value
              )
            }
            style={styles.textarea}
          />
        </Section>

        {/* =================================================
            06 NO VENTAS
        ================================================= */}

        <Section
          number="06"
          title="📈 Auditorías de no ventas"
          subtitle="Analizá oportunidades perdidas y registrá el coaching."
        >
          <label style={styles.label}>
            Cantidad de auditorías realizadas
          </label>

          <input
            type="number"
            value={cantidadNoVentas}
            onChange={(e) =>
              setCantidadNoVentas(
                e.target.value
              )
            }
            style={styles.input}
          />

          <MultiSelect
            label="Principales O.M. detectadas"
            options={opcionesItemsProductividad}
            value={principalesOM}
            onChange={setPrincipalesOM}
          />

          <MultiSelect
            label="Coaching brindado"
            options={opcionesAccionesProductividad}
            value={coachingNoVentas}
            onChange={setCoachingNoVentas}
          />

          <label style={styles.label}>
            Registro en sistema
          </label>

          <select
            value={registroSistema}
            onChange={(e) =>
              setRegistroSistema(
                e.target.value
              )
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar
            </option>

            <option value="CORRECTA">
              CORRECTA
            </option>

            <option value="INCORRECTA">
              INCORRECTA
            </option>
          </select>

          <label style={styles.label}>
            Compromiso esperado
          </label>

          <select
            value={compromisoNoVentas}
            onChange={(e) =>
              setCompromisoNoVentas(
                e.target.value
              )
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar
            </option>

            {compromisos.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          <MultiSelect
            label="Fortalezas destacadas"
            options={opcionesFortalezas}
            value={fortalezasSeleccionadas}
            onChange={
              setFortalezasSeleccionadas
            }
          />

          <label style={styles.label}>
            Observaciones
          </label>

          <textarea
            value={observacionesNoVentas}
            onChange={(e) =>
              setObservacionesNoVentas(
                e.target.value
              )
            }
            style={styles.textarea}
          />
        </Section>

        {/* =================================================
            GUARDAR
        ================================================= */}

        <div style={styles.saveBox}>
          {mensaje && (
            <div
              style={{
                ...styles.message,
                background:
                  mensaje.startsWith("❌")
                    ? "#fff1f2"
                    : "#ecfdf5",
                color:
                  mensaje.startsWith("❌")
                    ? "#be123c"
                    : "#047857",
              }}
            >
              {mensaje}
            </div>
          )}

          <button
            onClick={guardarReporte}
            disabled={guardando}
            style={{
              ...styles.saveButton,
              opacity: guardando ? 0.6 : 1,
            }}
          >
            {guardando
              ? "GUARDANDO..."
              : "💾 GUARDAR REPORTE COMPLETO"}
          </button>

          <button
            onClick={limpiarFormulario}
            style={styles.clearButton}
          >
            LIMPIAR FORMULARIO
          </button>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   ESTILOS
========================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#eef2ff 0%,#f8fafc 45%,#ede9fe 100%)",
    padding: "30px 16px 70px",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#172033",
  },

  container: {
    maxWidth: "1150px",
    margin: "0 auto",
  },

  hero: {
    background:
      "linear-gradient(135deg,#111827,#312e81,#4f46e5)",
    color: "white",
    borderRadius: "25px",
    padding: "32px",
    marginBottom: "22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 20px 50px rgba(15,23,42,.20)",
  },

  badge: {
    display: "inline-block",
    background: "rgba(255,255,255,.15)",
    border:
      "1px solid rgba(255,255,255,.2)",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "12px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "32px",
  },

  heroText: {
    marginBottom: 0,
    opacity: 0.85,
  },

  darkButton: {
    border:
      "1px solid rgba(255,255,255,.25)",
    background:
      "rgba(255,255,255,.12)",
    color: "white",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
  },

  section: {
    background: "white",
    borderRadius: "22px",
    padding: "27px",
    marginBottom: "20px",
    boxShadow:
      "0 10px 35px rgba(15,23,42,.08)",
    border: "1px solid #e5e7eb",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "22px",
  },

  sectionNumber: {
    width: "36px",
    height: "36px",
    minWidth: "36px",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#4f46e5,#7c3aed)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "13px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#111827",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  label: {
    display: "block",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "7px",
    marginTop: "17px",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding: "12px 13px",
    borderRadius: "11px",
    border: "1px solid #d8dee8",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "white",
    color: "#1e293b",
  },

  multiSelect: {
    width: "100%",
    minHeight: "180px",
    padding: "8px",
    borderRadius: "11px",
    border: "1px solid #d8dee8",
    fontSize: "14px",
    boxSizing: "border-box",
    background: "white",
    color: "#1e293b",
  },

  help: {
    color: "#94a3b8",
    fontSize: "12px",
    display: "block",
    marginTop: "7px",
  },

  selectedBox: {
    marginTop: "8px",
    padding: "9px 12px",
    borderRadius: "10px",
    background: "#eef2ff",
    color: "#3730a3",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  textarea: {
    width: "100%",
    minHeight: "105px",
    padding: "13px",
    borderRadius: "11px",
    border: "1px solid #d8dee8",
    fontSize: "14px",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  grid2: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",
    gap: "16px",
  },

  metricGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: "14px",
    marginBottom: "18px",
  },

  metricCard: {
    padding: "20px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg,#f8fafc,#eef2ff)",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  metricTitle: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "bold",
  },

  metricValue: {
    fontSize: "24px",
    color: "#312e81",
  },

  metricDetail: {
    color: "#94a3b8",
  },

  audioBox: {
    marginTop: "22px",
    padding: "20px",
    borderRadius: "18px",
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
  },

  audioTitle: {
    margin: 0,
    fontSize: "17px",
  },

  fileInput: {
    width: "100%",
    marginTop: "10px",
  },

  fileName: {
    fontSize: "13px",
    color: "#475569",
  },

  progressOuter: {
    width: "100%",
    height: "16px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressInner: {
    height: "100%",
    background:
      "linear-gradient(90deg,#4f46e5,#7c3aed)",
    borderRadius: "999px",
    transition: "width .4s ease",
  },

  progressText: {
    fontSize: "14px",
    color: "#475569",
  },

  chartCard: {
    marginTop: "25px",
    padding: "22px",
    background: "#f8fafc",
    borderRadius: "18px",
  },

  chartTitle: {
    marginTop: 0,
  },

  barChart: {
    height: "220px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: "12px",
    borderBottom: "1px solid #cbd5e1",
    padding: "20px 10px 0",
  },

  barChartLarge: {
    height: "270px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: "15px",
    borderBottom: "1px solid #cbd5e1",
    padding: "20px 20px 0",
    marginBottom: "25px",
  },

  chartColumn: {
    height: "100%",
    flex: 1,
    maxWidth: "90px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "7px",
  },

  chartBar: {
    width: "55px",
    minHeight: "8px",
    borderRadius: "10px 10px 3px 3px",
    background:
      "linear-gradient(180deg,#6366f1,#312e81)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: "5px",
    transition: "height .4s ease",
  },

  chartValue: {
    color: "white",
    fontSize: "11px",
    fontWeight: "bold",
  },

  comparisonTable: {
    display: "grid",
    gridTemplateColumns:
      "1.5fr 1fr 1fr 1fr",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    overflow: "hidden",
    fontSize: "14px",
  },

  tableRow: {
    gridColumn: "1 / -1",
    display: "grid",
    gridTemplateColumns:
      "1.5fr 1fr 1fr 1fr",
    padding: "12px",
    borderTop: "1px solid #e2e8f0",
  },

  empty: {
    padding: "35px",
    textAlign: "center",
    color: "#64748b",
    background: "#f8fafc",
    borderRadius: "15px",
  },

  saveBox: {
    background:
      "linear-gradient(135deg,#111827,#1e1b4b)",
    padding: "25px",
    borderRadius: "22px",
    marginTop: "25px",
  },

  message: {
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "15px",
    fontWeight: "bold",
  },

  saveButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "17px",
    background:
      "linear-gradient(135deg,#4f46e5,#7c3aed)",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },

  clearButton: {
    width: "100%",
    border: "1px solid #475569",
    borderRadius: "14px",
    padding: "13px",
    marginTop: "10px",
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },
};
