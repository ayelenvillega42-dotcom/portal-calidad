"use client";

import { useEffect, useMemo, useState } from "react";
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

function MultiSelect({ label, options, value, onChange }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>

      <select
        multiple
        value={value}
        onChange={(e) =>
          onChange(
            Array.from(
              e.target.selectedOptions,
              (option) => option.value
            )
          )
        }
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
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{title}</h2>

        {subtitle && (
          <p style={styles.subtitle}>{subtitle}</p>
        )}
      </div>

      {children}
    </section>
  );
}

export default function AdminPage() {
  const [asesor, setAsesor] = useState("");
  const [semana, setSemana] = useState("Semana 3 - Agosto");

  // CALIDAD
  const [nota, setNota] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [estadoObjetivo, setEstadoObjetivo] = useState("");
  const [desvio, setDesvio] = useState("");
  const [auditoria, setAuditoria] = useState("");
  const [producto, setProducto] = useState("AP");
  const [observacionesCalidad, setObservacionesCalidad] =
    useState("");

  const [itemsCalidadSeleccionados, setItemsCalidadSeleccionados] =
    useState([]);

  const [accionesCalidadSeleccionadas, setAccionesCalidadSeleccionadas] =
    useState([]);

  // AUDIO
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");

  // PRODUCTIVIDAD
  const [sph, setSph] = useState("");
  const [ventas, setVentas] = useState("");
  const [objetivoVentas, setObjetivoVentas] = useState("");

  const [objetivoCampania, setObjetivoCampania] =
    useState("");

  const [descripcionCampania, setDescripcionCampania] =
    useState("");

  const [estadoSph, setEstadoSph] = useState("");
  const [estadoVentas, setEstadoVentas] = useState("");
  const [estadoCampania, setEstadoCampania] =
    useState("");

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

  // TIPIFICACIONES
  const [tipificacion, setTipificacion] = useState("");
  const [desvioTipificacion, setDesvioTipificacion] =
    useState("");

  const [objetivoTipificacion, setObjetivoTipificacion] =
    useState("");

  const [resultadoTipificacion, setResultadoTipificacion] =
    useState("");

  const [
    compromisoTipificacion,
    setCompromisoTipificacion,
  ] = useState("");

  const [
    observacionesTipificacion,
    setObservacionesTipificacion,
  ] = useState("");

  // NO VENTAS
  const [cantidadNoVentas, setCantidadNoVentas] =
    useState("");

  const [principalesOM, setPrincipalesOM] =
    useState([]);

  const [coachingNoVentas, setCoachingNoVentas] =
    useState([]);

  const [registroSistema, setRegistroSistema] =
    useState("");

  const [compromisoNoVentas, setCompromisoNoVentas] =
    useState("");

  const [fortalezasSeleccionadas, setFortalezasSeleccionadas] =
    useState([]);

  const [observacionesNoVentas, setObservacionesNoVentas] =
    useState("");

  // HISTÓRICO
  const [historico, setHistorico] = useState([]);

  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const objetivosSPH = {
    AP: 0.5,
    BM: 0.45,
    SL: 0.55,
    CP: 0,
  };

  const objetivoSPH = objetivosSPH[producto] || 0;

  // CARGAR HISTÓRICO
  useEffect(() => {
    async function cargarHistorico() {
      if (!asesor || !supabase) {
        setHistorico([]);
        return;
      }

      const { data, error } = await supabase
        .from("reportes")
        .select(
          "id,semana,nota,sph,ventas,objetivo_ventas,objetivo_sph"
        )
        .eq("usuario", asesor)
        .order("id", { ascending: true });

      if (!error) {
        setHistorico(data || []);
      }
    }

    cargarHistorico();
  }, [asesor]);

  // PROGRESO SPH
  const porcentajeSPH = useMemo(() => {
    if (!sph || !objetivoSPH) return 0;

    return Math.min(
      100,
      Math.max(
        0,
        (Number(sph) / objetivoSPH) * 100
      )
    );
  }, [sph, objetivoSPH]);

  const faltaSPH = useMemo(() => {
    if (!objetivoSPH) return 0;

    if (!sph) return objetivoSPH;

    return Math.max(
      0,
      objetivoSPH - Number(sph)
    );
  }, [sph, objetivoSPH]);

  // SUBIR AUDIO
  async function subirAudio() {
    if (!audioFile) return "";

    if (!supabase) {
      throw new Error(
        "Supabase no está configurado."
      );
    }

    const extension =
      audioFile.name
        .split(".")
        .pop()
        ?.toLowerCase() || "mp3";

    const nombreArchivo =
      `audios/${asesor}/${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("audios")
      .upload(
        nombreArchivo,
        audioFile,
        {
          cacheControl: "3600",
          upsert: true,
        }
      );

    if (error) throw error;

    const { data } =
      supabase.storage
        .from("audios")
        .getPublicUrl(nombreArchivo);

    return data.publicUrl;
  }

  // GUARDAR
  async function guardarReporte() {
    if (!asesor || !nota) {
      setMensaje(
        "Seleccioná un asesor y cargá la nota de calidad."
      );
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

    try {
      let urlAudioFinal = audioUrl;

      if (audioFile) {
        urlAudioFinal = await subirAudio();
      }

      const asesorSeleccionado = asesores.find(
        ([, usuario]) => usuario === asesor
      );

      const datos = {
        asesor:
          asesorSeleccionado?.[0] || asesor,

        usuario: asesor,
        semana,

        // CALIDAD
        nota: Number(nota),
        objetivo: objetivo
          ? Number(objetivo)
          : null,

        estado_objetivo:
          estadoObjetivo,

        desvio,

        auditoria,
        producto,

        observaciones:
          observacionesCalidad,

        items_trabajados:
          itemsCalidadSeleccionados,

        acciones_realizadas:
          accionesCalidadSeleccionadas,

        audio_url:
          urlAudioFinal || null,

        // PRODUCTIVIDAD
        sph: sph
          ? Number(sph)
          : null,

        objetivo_sph:
          objetivoSPH || null,

        ventas: ventas
          ? Number(ventas)
          : null,

        objetivo_ventas:
          objetivoVentas
            ? Number(objetivoVentas)
            : null,

        objetivo_campania:
          objetivoCampania,

        descripcion_campania:
          descripcionCampania,

        estado_sph:
          estadoSph,

        estado_ventas:
          estadoVentas,

        estado_campania:
          estadoCampania,

        items_productividad:
          itemsProductividadSeleccionados,

        acciones_productividad:
          accionesProductividadSeleccionadas,

        observaciones_productividad:
          observacionesProductividad,

        gestion:
          accionesProductividadSeleccionadas.join(
            ", "
          ),

        // TIPIFICACIONES
        tipificacion,

        desvio_tipificacion:
          desvioTipificacion,

        objetivo_tipificacion:
          objetivoTipificacion
            ? Number(objetivoTipificacion)
            : null,

        resultado_tipificacion:
          resultadoTipificacion,

        compromiso_tipificacion:
          compromisoTipificacion,

        observaciones_tipificacion:
          observacionesTipificacion,

        // NO VENTAS
        cantidad_no_ventas:
          cantidadNoVentas
            ? Number(cantidadNoVentas)
            : null,

        principales_om:
          principalesOM,

        coaching_no_ventas:
          coachingNoVentas,

        registro_sistema:
          registroSistema,

        compromiso_no_ventas:
          compromisoNoVentas,

        fortalezas:
          fortalezasSeleccionadas,

        observaciones_no_ventas:
          observacionesNoVentas,
      };

      const { error } = await supabase
        .from("reportes")
        .upsert(datos, {
          onConflict:
            "usuario,semana",
        });

      if (error) {
        console.error(error);

        setMensaje(
          `❌ No se pudo guardar el reporte: ${error.message}`
        );

        return;
      }

      setAudioUrl(
        urlAudioFinal || ""
      );

      setMensaje(
        "✓ Reporte guardado correctamente."
      );

      const { data: nuevoHistorico } =
        await supabase
          .from("reportes")
          .select(
            "id,semana,nota,sph,ventas,objetivo_ventas,objetivo_sph"
          )
          .eq("usuario", asesor)
          .order("id", {
            ascending: true,
          });

      setHistorico(
        nuevoHistorico || []
      );
    } catch (error) {
      console.error(error);

      setMensaje(
        `❌ Ocurrió un error: ${
          error?.message ||
          "No se pudo guardar."
        }`
      );
    } finally {
      setGuardando(false);
    }
  }

  function limpiarFormulario() {
    setAsesor("");
    setSemana("Semana 3 - Agosto");

    setNota("");
    setObjetivo("");
    setEstadoObjetivo("");
    setDesvio("");
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

    setTipificacion("");
    setDesvioTipificacion("");
    setObjetivoTipificacion("");
    setResultadoTipificacion("");
    setCompromisoTipificacion("");
    setObservacionesTipificacion("");

    setCantidadNoVentas("");
    setPrincipalesOM([]);
    setCoachingNoVentas([]);
    setRegistroSistema("");
    setCompromisoNoVentas("");
    setFortalezasSeleccionadas([]);
    setObservacionesNoVentas("");

    setMensaje("");
    setHistorico([]);
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <header style={styles.hero}>
          <div>
            <div style={styles.badge}>
              🏆 PORTAL DE CALIDAD
            </div>

            <h1 style={styles.heroTitle}>
              Panel de Administración
            </h1>

            <p style={styles.heroText}>
              Gestioná la evolución de calidad,
              productividad y oportunidades de
              mejora de cada asesor.
            </p>
          </div>

          <button
            onClick={() =>
              (window.location.href = "/")
            }
            style={styles.darkButton}
          >
            Cerrar sesión
          </button>
        </header>

        {/* DATOS */}
        <Section
          title="📋 Datos del asesor"
          subtitle="Seleccioná el asesor y completá el reporte semanal."
        >
          <label style={styles.label}>
            Asesor
          </label>

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

          <label style={styles.label}>
            Semana
          </label>

          <input
            value={semana}
            onChange={(e) =>
              setSemana(e.target.value)
            }
            style={styles.input}
          />
        </Section>

        {/* CALIDAD */}
        <Section
          title="📊 Calidad semanal"
          subtitle="Registrá la evaluación, los desvíos y las acciones realizadas."
        >
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
                Objetivo para la próxima semana
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={objetivo}
                onChange={(e) =>
                  setObjetivo(e.target.value)
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

            {estadosObjetivo.map(
              (estado) => (
                <option key={estado}>
                  {estado}
                </option>
              )
            )}
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

          <MultiSelect
            label="Items trabajados"
            options={itemsCalidad}
            value={
              itemsCalidadSeleccionados
            }
            onChange={
              setItemsCalidadSeleccionados
            }
          />

          <MultiSelect
            label="Acción realizada"
            options={accionesCalidad}
            value={
              accionesCalidadSeleccionadas
            }
            onChange={
              setAccionesCalidadSeleccionadas
            }
          />

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
            <option>AP</option>
            <option>BM</option>
            <option>SL</option>
            <option>CP</option>
          </select>

          {/* AUDIO */}
          <div style={styles.audioBox}>
            <h3 style={styles.audioTitle}>
              🎧 Audio de muestra
            </h3>

            <p style={styles.subtitle}>
              Subí el audio de la auditoría
              para que el asesor pueda
              escucharlo desde su portal.
            </p>

            <input
              type="file"
              accept="audio/*"
              onChange={(e) =>
                setAudioFile(
                  e.target.files?.[0] ||
                    null
                )
              }
              style={styles.fileInput}
            />

            {audioFile && (
              <p style={styles.fileName}>
                Archivo seleccionado:{" "}
                {audioFile.name}
              </p>
            )}

            {audioUrl && (
              <audio
                controls
                src={audioUrl}
                style={{
                  width: "100%",
                  marginTop: "12px",
                }}
              />
            )}
          </div>

          <label style={styles.label}>
            Observaciones
          </label>

          <textarea
            value={
              observacionesCalidad
            }
            onChange={(e) =>
              setObservacionesCalidad(
                e.target.value
              )
            }
            style={styles.textarea}
            placeholder="Espacio libre para observaciones..."
          />

          {/* EVOLUCION CALIDAD */}
          {historico.length > 0 && (
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>
                📈 Evolución de calidad
              </h3>

              <div style={styles.chart}>
                {historico.map(
                  (item, index) => {
                    const value =
                      Number(
                        item.nota
                      ) || 0;

                    return (
                      <div
                        key={index}
                        style={
                          styles.chartColumn
                        }
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
                          <span
                            style={
                              styles.chartValue
                            }
                          >
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
                  }
                )}
              </div>
            </div>
          )}
        </Section>

        {/* PRODUCTIVIDAD */}
        <Section
          title="📈 Productividad semanal"
          subtitle="Compará el desempeño del asesor contra los objetivos de su campaña."
        >
          <div style={styles.metricGrid}>
            <div style={styles.metricCard}>
              <span>SPH actual</span>

              <strong>
                {sph || "0,00"}
              </strong>
            </div>

            <div style={styles.metricCard}>
              <span>Objetivo SPH</span>

              <strong>
                {objetivoSPH
                  .toFixed(2)
                  .replace(".", ",")}
              </strong>

              <small>
                Objetivo automático según
                campaña
              </small>
            </div>

            <div style={styles.metricCard}>
              <span>Falta para objetivo</span>

              <strong>
                {faltaSPH
                  .toFixed(2)
                  .replace(".", ",")}
              </strong>
            </div>

            <div style={styles.metricCard}>
              <span>Progreso</span>

              <strong>
                {Math.round(
                  porcentajeSPH
                )}
                %
              </strong>
            </div>
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
              ? Number(sph) >=
                objetivoSPH
                ? "🎯 Objetivo SPH alcanzado."
                : `Te faltan ${faltaSPH.toFixed(
                    2
                  )} puntos de SPH para alcanzar el objetivo.`
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
                value={
                  objetivoSPH
                    ? objetivoSPH.toFixed(
                        2
                      )
                    : "Sin objetivo"
                }
                readOnly
                style={{
                  ...styles.input,
                  background:
                    "#f1f5f9",
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
                  setVentas(
                    e.target.value
                  )
                }
                style={styles.input}
                placeholder="Cantidad de ventas"
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
                  setEstadoSph(
                    e.target.value
                  )
                }
                style={styles.input}
              >
                <option value="">
                  Seleccionar estado
                </option>

                {estados.map(
                  (estado) => (
                    <option
                      key={estado}
                    >
                      {estado}
                    </option>
                  )
                )}
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

                {estados.map(
                  (estado) => (
                    <option
                      key={estado}
                    >
                      {estado}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <label style={styles.label}>
            Objetivo de campaña —
            Resultado semanal
          </label>

          <input
            value={objetivoCampania}
            onChange={(e) =>
              setObjetivoCampania(
                e.target.value
              )
            }
            style={styles.input}
          />

          <label style={styles.label}>
            Descripción / objetivo de
            campaña
          </label>

          <textarea
            value={
              descripcionCampania
            }
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

            {estados.map(
              (estado) => (
                <option
                  key={estado}
                >
                  {estado}
                </option>
              )
            )}
          </select>

          <MultiSelect
            label="Items trabajados"
            options={itemsProductividad}
            value={
              itemsProductividadSeleccionados
            }
            onChange={
              setItemsProductividadSeleccionados
            }
          />

          <MultiSelect
            label="Acción realizada"
            options={
              accionesProductividad
            }
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
            value={
              observacionesProductividad
            }
            onChange={(e) =>
              setObservacionesProductividad(
                e.target.value
              )
            }
            style={styles.textarea}
          />
        </Section>

        {/* COMPARATIVA */}
        <Section
          title="📊 Comparativa de productividad"
          subtitle="Visualizá la evolución del asesor semana a semana."
        >
          {historico.length > 0 ? (
            <>
              <div
                style={
                  styles.productivityChart
                }
              >
                {historico.map(
                  (item, index) => {
                    const value =
                      Number(
                        item.sph
                      ) || 0;

                    const max =
                      Math.max(
                        objetivoSPH ||
                          0.5,
                        ...historico.map(
                          (x) =>
                            Number(
                              x.sph
                            ) || 0
                        ),
                        0.6
                      );

                    return (
                      <div
                        key={index}
                        style={
                          styles.chartColumn
                        }
                      >
                        <div
                          style={{
                            ...styles.chartBar,
                            height: `${Math.max(
                              8,
                              (value /
                                max) *
                                100
                            )}%`,
                          }}
                        >
                          <span
                            style={
                              styles.chartValue
                            }
                          >
                            {value.toFixed(
                              2
                            )}
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
                  }
                )}
              </div>

              <div
                style={
                  styles.comparisonTable
                }
              >
                <div>
                  Semana
                </div>

                <div>
                  SPH
                </div>

                <div>
                  Ventas
                </div>

                <div>
                  Objetivo
                </div>

                {historico.map(
                  (item, index) => (
                    <div
                      key={index}
                      style={
                        styles.tableRow
                      }
                    >
                      <span>
                        {item.semana}
                      </span>

                      <span>
                        {Number(
                          item.sph ||
                            0
                        ).toFixed(
                          2
                        )}
                      </span>

                      <span>
                        {item.ventas ??
                          "-"}
                      </span>

                      <span>
                        {Number(
                          item.objetivo_sph ||
                            objetivoSPH ||
                            0
                        ).toFixed(
                          2
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <div style={styles.empty}>
              Seleccioná un asesor para
              visualizar su evolución.
            </div>
          )}
        </Section>

        {/* TIPIFICACIONES */}
        <Section
          title="📈 Desvíos de tipificaciones"
          subtitle="Registrá el desvío, el objetivo y el resultado del seguimiento."
        >
          <label style={styles.label}>
            Tipificación
          </label>

          <select
            value={tipificacion}
            onChange={(e) =>
              setTipificacion(
                e.target.value
              )
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar tipificación
            </option>

            {tipificaciones.map(
              (item) => (
                <option key={item}>
                  {item}
                </option>
              )
            )}
          </select>

          <label style={styles.label}>
            Desvío
          </label>

          <input
            value={desvioTipificacion}
            onChange={(e) =>
              setDesvioTipificacion(
                e.target.value
              )
            }
            style={styles.input}
            placeholder="Describir el desvío"
          />

          <label style={styles.label}>
            Objetivo para la próxima semana
          </label>

          <input
            type="number"
            value={
              objetivoTipificacion
            }
            onChange={(e) =>
              setObjetivoTipificacion(
                e.target.value
              )
            }
            style={styles.input}
            placeholder="Ejemplo: 90"
          />

          <label style={styles.label}>
            Resultado
          </label>

          <input
            value={
              resultadoTipificacion
            }
            onChange={(e) =>
              setResultadoTipificacion(
                e.target.value
              )
            }
            style={styles.input}
          />

          <label style={styles.label}>
            Compromiso esperado
          </label>

          <select
            value={
              compromisoTipificacion
            }
            onChange={(e) =>
              setCompromisoTipificacion(
                e.target.value
              )
            }
            style={styles.input}
          >
            <option value="">
              Seleccionar
            </option>

            <option>
              APLICA DEVOLUCIÓN
            </option>

            <option>
              SEGUIMIENTO
            </option>

            <option>
              NO APLICA
            </option>
          </select>

          <label style={styles.label}>
            Observaciones
          </label>

          <textarea
            value={
              observacionesTipificacion
            }
            onChange={(e) =>
              setObservacionesTipificacion(
                e.target.value
              )
            }
            style={styles.textarea}
          />
        </Section>

        {/* NO VENTAS */}
        <Section
          title="📈 Auditorías de no ventas"
          subtitle="Analizá oportunidades perdidas y registrá las acciones de coaching."
        >
          <label style={styles.label}>
            Cantidad de auditorías
            realizadas
          </label>

          <input
            type="number"
            value={
              cantidadNoVentas
            }
            onChange={(e) =>
              setCantidadNoVentas(
                e.target.value
              )
            }
            style={styles.input}
          />

          <MultiSelect
            label="Principales O.M. detectadas"
            options={
              itemsProductividad
            }
            value={
              principalesOM
            }
            onChange={
              setPrincipalesOM
            }
          />

          <MultiSelect
            label="Coaching brindado"
            options={
              accionesProductividad
            }
            value={
              coachingNoVentas
            }
            onChange={
              setCoachingNoVentas
            }
          />

          <label style={styles.label}>
            Registro en sistema
          </label>

          <select
            value={
              registroSistema
            }
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

            <option>
              CORRECTA
            </option>

            <option>
              INCORRECTA
            </option>
          </select>

          <label style={styles.label}>
            Compromiso esperado
          </label>

          <select
            value={
              compromisoNoVentas
            }
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

            <option>
              APLICA DEVOLUCIÓN
            </option>

            <option>
              SEGUIMIENTO
            </option>

            <option>
              NO APLICA
            </option>
          </select>

          <MultiSelect
            label="Fortalezas destacadas"
            options={fortalezas}
            value={
              fortalezasSeleccionadas
            }
            onChange={
              setFortalezasSeleccionadas
            }
          />

          <label style={styles.label}>
            Observaciones
          </label>

          <textarea
            value={
              observacionesNoVentas
            }
            onChange={(e) =>
              setObservacionesNoVentas(
                e.target.value
              )
            }
            style={styles.textarea}
          />
        </Section>

        {/* GUARDAR */}
        <div style={styles.saveBox}>
          {mensaje && (
            <div
              style={{
                ...styles.message,
                background:
                  mensaje.startsWith(
                    "❌"
                  )
                    ? "#fff1f2"
                    : "#ecfdf5",
                color:
                  mensaje.startsWith(
                    "❌"
                  )
                    ? "#be123c"
                    : "#047857",
              }}
            >
              {mensaje}
            </div>
          )}

          <button
            onClick={
              guardarReporte
            }
            disabled={guardando}
            style={{
              ...styles.saveButton,
              opacity:
                guardando
                  ? 0.6
                  : 1,
            }}
          >
            {guardando
              ? "GUARDANDO REPORTE..."
              : "💾 GUARDAR REPORTE COMPLETO"}
          </button>

          <button
            onClick={
              limpiarFormulario
            }
            style={
              styles.clearButton
            }
          >
            LIMPIAR FORMULARIO
          </button>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
    padding:
      "30px 16px 60px",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    color: "#172033",
  },

  container: {
    maxWidth: "1150px",
    margin: "0 auto",
  },

  hero: {
    background:
      "linear-gradient(135deg, #111827, #312e81)",
    color: "white",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "22px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 18px 45px rgba(15,23,42,0.18)",
  },

  badge: {
    display: "inline-block",
    background:
      "rgba(255,255,255,0.14)",
    borderRadius: "999px",
    padding:
      "8px 14px",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing:
      "0.5px",
    marginBottom:
      "12px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "32px",
  },

  heroText: {
    marginBottom: 0,
    opacity: 0.82,
  },

  darkButton: {
    border:
      "1px solid rgba(255,255,255,0.25)",
    background:
      "rgba(255,255,255,0.12)",
    color: "white",
    padding:
      "12px 18px",
    borderRadius:
      "12px",
    cursor: "pointer",
    whiteSpace:
      "nowrap",
  },

  section: {
    background: "white",
    borderRadius:
      "22px",
    padding: "26px",
    marginBottom:
      "20px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.07)",
    border:
      "1px solid #eef2f7",
  },

  sectionHeader: {
    marginBottom:
      "22px",
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
    marginBottom:
      "7px",
    marginTop:
      "16px",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding:
      "12px 13px",
    borderRadius:
      "11px",
    border:
      "1px solid #d8dee8",
    fontSize: "14px",
    boxSizing:
      "border-box",
    background:
      "white",
    color:
      "#1e293b",
    outline:
      "none",
  },

  multiSelect: {
    width: "100%",
    minHeight:
      "160px",
    padding:
      "8px",
    borderRadius:
      "11px",
    border:
      "1px solid #d8dee8",
    fontSize:
      "14px",
    boxSizing:
      "border-box",
    background:
      "white",
    color:
      "#1e293b",
  },

  textarea: {
    width: "100%",
    minHeight:
      "105px",
    padding:
      "13px",
    borderRadius:
      "11px",
    border:
      "1px solid #d8dee8",
    fontSize:
      "14px",
    boxSizing:
      "border-box",
    resize:
      "vertical",
    fontFamily:
      "Arial, sans-serif",
  },

  grid2: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },

  help: {
    color:
      "#94a3b8",
    fontSize:
      "12px",
  },

  audioBox: {
    marginTop:
      "22px",
    padding:
      "20px",
    borderRadius:
      "18px",
    background:
      "#f8fafc",
    border:
      "1px dashed #cbd5e1",
  },

  audioTitle: {
    marginTop: 0,
    fontSize:
      "18px",
  },

  fileInput: {
    width: "100%",
    marginTop:
      "10px",
  },

  fileName: {
    fontSize:
      "13px",
    color:
      "#475569",
  },

  metricGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap:
      "14px",
  },

  metricCard: {
    padding:
      "20px",
    borderRadius:
      "18px",
    background:
      "linear-gradient(135deg, #f8fafc, #eef2ff)",
    border:
      "1px solid #e2e8f0",
    display:
      "flex",
    flexDirection:
      "column",
    gap:
      "7px",
  },

  progressOuter: {
    width: "100%",
    height:
      "16px",
    background:
      "#e2e8f0",
    borderRadius:
      "999px",
    overflow:
      "hidden",
    marginTop:
      "20px",
  },

  progressInner: {
    height: "100%",
    background:
      "linear-gradient(90deg, #4f46e5, #7c3aed)",
    borderRadius:
      "999px",
    transition:
      "width 0.4s ease",
  },

  progressText: {
    fontSize:
      "14px",
    color:
      "#475569",
  },

  chartCard: {
    marginTop:
      "24px",
    padding:
      "22px",
    background:
      "#f8fafc",
    borderRadius:
      "18px",
  },

  chartTitle: {
    marginTop: 0,
  },

  chart: {
    height:
      "220px",
    display:
      "flex",
    alignItems:
      "flex-end",
    justifyContent:
      "space-around",
    gap:
      "12px",
    borderBottom:
      "1px solid #cbd5e1",
    padding:
      "20px 10px 0",
  },

  productivityChart: {
    height:
      "250px",
    display:
      "flex",
    alignItems:
      "flex-end",
    justifyContent:
      "space-around",
    gap:
      "15px",
    borderBottom:
      "1px solid #cbd5e1",
    padding:
      "20px 20px 0",
    marginBottom:
      "25px",
  },

  chartColumn: {
    height:
      "100%",
    flex: 1,
    maxWidth:
      "90px",
    display:
      "flex",
    flexDirection:
      "column",
    justifyContent:
      "flex-end",
    alignItems:
      "center",
    gap:
      "7px",
  },

  chartBar: {
    width:
      "55px",
    minHeight:
      "8px",
    borderRadius:
      "10px 10px 3px 3px",
    background:
      "linear-gradient(180deg, #6366f1, #312e81)",
    display:
      "flex",
    alignItems:
      "flex-start",
    justifyContent:
      "center",
    paddingTop:
      "5px",
    transition:
      "height 0.4s ease",
  },

  chartValue: {
    color: "white",
    fontSize:
      "11px",
    fontWeight:
      "bold",
  },

  comparisonTable: {
    display:
      "grid",
    gridTemplateColumns:
      "1.5fr 1fr 1fr 1fr",
    gap: 0,
    border:
      "1px solid #e2e8f0",
    borderRadius:
      "14px",
    overflow:
      "hidden",
    fontSize:
      "14px",
  },

  tableRow: {
    gridColumn:
      "1 / -1",
    display:
      "grid",
    gridTemplateColumns:
      "1.5fr 1fr 1fr 1fr",
    padding:
      "12px",
    borderTop:
      "1px solid #e2e8f0",
  },

  empty: {
    padding:
      "35px",
    textAlign:
      "center",
    color:
      "#64748b",
    background:
      "#f8fafc",
    borderRadius:
      "15px",
  },

  saveBox: {
    background:
      "#111827",
    padding:
      "25px",
    borderRadius:
      "22px",
    marginTop:
      "25px",
  },

  message: {
    padding:
      "14px",
    borderRadius:
      "12px",
    marginBottom:
      "15px",
    fontWeight:
      "bold",
  },

  saveButton: {
    width:
      "100%",
    border:
      "none",
    borderRadius:
      "14px",
    padding:
      "16px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color:
      "white",
    fontWeight:
      "bold",
    fontSize:
      "16px",
    cursor:
      "pointer",
  },

  clearButton: {
    width:
      "100%",
    border:
      "1px solid #475569",
    borderRadius:
      "14px",
    padding:
      "13px",
    marginTop:
      "10px",
    background:
      "transparent",
    color:
      "white",
    cursor:
      "pointer",
  },
};
