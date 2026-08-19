```jsx
"use client";

import { useState } from "react";

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

  async function guardarReporte() {
    if (!asesor || !nota) {
      setMensaje("Seleccioná un asesor y cargá la nota.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    try {
      const { createClient } = await import("@supabase/supabase-js");

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        setMensaje(
          "❌ Faltan las variables de conexión de Supabase en Vercel."
        );
        setGuardando(false);
        return;
      }

      const supabase = createClient(
        supabaseUrl,
        supabaseKey
      );

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
        objetivo_sph: objetivoSph
          ? Number(objetivoSph)
          : null,
        ventas: ventas ? Number(ventas) : null,
        objetivo_ventas: objetivoVentas
          ? Number(objetivoVentas)
          : null,
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
          "❌ No se pudo guardar el reporte: " +
            error.message
        );

        setGuardando(false);
        return;
      }

      setMensaje(
        "✓ Reporte guardado correctamente."
      );
    } catch (error) {
      console.error(error);

      setMensaje(
        "❌ Error de conexión con Supabase."
      );
    }

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
          maxWidth: "1100px",
          margin: "auto",
        }}
      >
        <div style={sectionStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
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
              onClick={() =>
                (window.location.href = "/")
              }
              style={{
                padding: "11px 18px",
                border: "none",
                borderRadius: "10px",
                background: "#20242a",
                color: "white",
                cursor: "pointer",
              }}
            >
              Ir al portal
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
            Desde acá vas a poder cargar y actualizar
            la información semanal del equipo.
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
            onChange={(e) =>
              setAsesor(e.target.value)
            }
            style={inputStyle}
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

          <label>Semana</label>

          <input
            value={semana}
            onChange={(e) =>
              setSemana(e.target.value)
            }
            style={inputStyle}
          />

          <label>Nota de calidad</label>

          <input
            type="number"
            min="0"
            max="100"
            value={nota}
            onChange={(e) =>
              setNota(e.target.value)
            }
            placeholder="Ejemplo: 85"
            style={inputStyle}
          />

          <label>Evolución</label>

          <input
            value={evolucion}
            onChange={(e) =>
              setEvolucion(e.target.value)
            }
            placeholder="Ejemplo: Mejora respecto de la semana anterior"
            style={inputStyle}
          />

          <label>Objetivo</label>

          <textarea
            value={objetivo}
            onChange={(e) =>
              setObjetivo(e.target.value)
            }
            placeholder="¿Qué debe trabajar?"
            style={{
              ...inputStyle,
              minHeight: "90px",
            }}
          />

          <label>Desvío principal</label>

          <input
            value={desvio}
            onChange={(e) =>
              setDesvio(e.target.value)
            }
            placeholder="Ejemplo: Validación de datos"
            style={inputStyle}
          />

          <label>Recomendación</label>

          <textarea
            value={recomendacion}
            onChange={(e) =>
              setRecomendacion(e.target.value)
            }
            placeholder="Recomendación para el asesor"
            style={{
              ...inputStyle,
              minHeight: "90px",
            }}
          />

          <label>Auditoría</label>

          <input
            value={auditoria}
            onChange={(e) =>
              setAuditoria(e.target.value)
            }
            placeholder="Ejemplo: Llamada auditada"
            style={inputStyle}
          />

          <label>Producto</label>

          <select
            value={producto}
            onChange={(e) =>
              setProducto(e.target.value)
            }
            style={inputStyle}
          >
            <option>AP</option>
            <option>BM</option>
          </select>

          <label>Observaciones</label>

          <textarea
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
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
            onChange={(e) =>
              setSph(e.target.value)
            }
            placeholder="Ejemplo: 1.25"
            style={inputStyle}
          />

          <label>Objetivo SPH</label>

          <input
            value={objetivoSph}
            onChange={(e) =>
              setObjetivoSph(e.target.value)
            }
            placeholder="Ejemplo: 1.20"
            style={inputStyle}
          />

          <label>Ventas</label>

          <input
            value={ventas}
            onChange={(e) =>
              setVentas(e.target.value)
            }
            placeholder="Cantidad de ventas"
            style={inputStyle}
          />

          <label>Objetivo de ventas</label>

          <input
            value={objetivoVentas}
            onChange={(e) =>
              setObjetivoVentas(e.target.value)
            }
            placeholder="Cantidad objetivo"
            style={inputStyle}
          />

          <label>Objetivo de campaña</label>

          <input
            value={objetivoCampania}
            onChange={(e) =>
              setObjetivoCampania(e.target.value)
            }
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
            onChange={(e) =>
              setEstadoSph(e.target.value)
            }
            style={inputStyle}
          >
            <option value="">
              Seleccionar estado
            </option>
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
            <option value="">
              Seleccionar estado
            </option>
            <option>Cumplido</option>
            <option>Alcanzado</option>
            <option>En proceso</option>
            <option>No alcanzado</option>
          </select>

          <label>
            Estado objetivo de campaña
          </label>

          <select
            value={estadoCampania}
            onChange={(e) =>
              setEstadoCampania(e.target.value)
            }
            style={inputStyle}
          >
            <option value="">
              Seleccionar estado
            </option>
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
            onChange={(e) =>
              setGestion(e.target.value)
            }
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
            {asesores.map(
              ([nombre, usuario]) => (
                <div
                  key={usuario}
                  style={{
                    padding: "16px",
                    border:
                      "1px solid #e5e7eb",
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
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
```
