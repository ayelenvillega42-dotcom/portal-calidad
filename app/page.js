"use client";

import { useEffect, useMemo, useState } from "react";

/* =========================================================
   PORTAL DE CALIDAD
   ========================================================= */

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const colores = {
  fondo: "#f3f7f8",
  petroleo: "#075e66",
  petroleoOscuro: "#064b52",
  turquesa: "#168b91",
  verde: "#2c9b78",
  amarillo: "#e8ad45",
  rojo: "#c95d5d",
  texto: "#16383d",
  gris: "#6d7f82",
  blanco: "#ffffff",
  borde: "#dce8e9",
};

/* =========================================================
   HELPERS
   ========================================================= */

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

function prettyName(name) {
  if (!name) return "Asesor";

  const parts = name.split(",");

  if (parts.length === 2) {
    return `${parts[1].trim()} ${parts[0].trim()}`;
  }

  return name;
}

function estadoClase(estado) {
  const e = String(estado || "").toUpperCase();

  if (e.includes("ALCANZADO")) return "estado verde";
  if (e.includes("DEBAJO")) return "estado rojo";
  return "estado amarillo";
}

function porcentaje(valor, objetivo) {
  const v = Number(valor) || 0;
  const o = Number(objetivo) || 0;

  if (!o) return 0;

  return Math.min(100, Math.max(0, Math.round((v / o) * 100)));
}

/* =========================================================
   APP
   ========================================================= */

export default function Page() {
  const [pantalla, setPantalla] = useState("login");
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const [asesor, setAsesor] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [pestana, setPestana] = useState("calidad");

  useEffect(() => {
    const guardado = localStorage.getItem("portal_asesor");

    if (guardado) {
      try {
        const datos = JSON.parse(guardado);

        if (datos?.usuario) {
          setAsesor(datos);
          setPantalla("portal");
          cargarReporte(datos.usuario);
        }
      } catch {}
    }
  }, []);

  async function cargarReporte(usuario) {
    if (!usuario) return;

    setCargando(true);

    try {
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        setReporte(null);
        setCargando(false);
        return;
      }

      const url =
        `${SUPABASE_URL}/rest/v1/reportes` +
        `?usuario=eq.${encodeURIComponent(usuario)}` +
        `&order=id.desc` +
        `&limit=1`;

      const respuesta = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!respuesta.ok) {
        setReporte(null);
        setCargando(false);
        return;
      }

      const datos = await respuesta.json();

      setReporte(datos?.length ? datos[0] : null);
    } catch {
      setReporte(null);
    }

    setCargando(false);
  }

  function ingresar() {
    setError("");

    const correo = mail.trim().toLowerCase();

    if (!correo) {
      setError("Ingresá tu mail institucional.");
      return;
    }

    const encontrado = ASESORES.find(
      (a) => a[2].toLowerCase() === correo
    );

    if (!encontrado) {
      setError(
        "No encontramos ese mail. Ingresá el mail institucional asociado a tu portal."
      );
      return;
    }

    const datos = {
      nombre: encontrado[0],
      usuario: encontrado[1],
      email: encontrado[2],
    };

    localStorage.setItem("portal_asesor", JSON.stringify(datos));

    setAsesor(datos);
    setPantalla("portal");
    setPestana("calidad");

    cargarReporte(datos.usuario);
  }

  function cerrarSesion() {
    localStorage.removeItem("portal_asesor");

    setAsesor(null);
    setReporte(null);
    setMail("");
    setError("");
    setPantalla("login");
  }

  /* =========================================================
     LOGIN
     ========================================================= */

  if (pantalla === "login") {
    return (
      <>
        <style>{estilos}</style>

        <main className="loginPage">
          <div className="loginCard">
            <div className="logoMini">PC</div>

            <div className="loginBrand">
              PORTAL DE CALIDAD
            </div>

            <h1>Ingresá a tu portal</h1>

            <p>
              Consultá tu evolución, objetivos y acciones de calidad.
            </p>

            <label>Mail institucional</label>

            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") ingresar();
              }}
              placeholder="nombre.apellido@portalcalidad.com"
            />

            {error && (
              <div className="errorBox">
                {error}
              </div>
            )}

            <button className="btnPrincipal" onClick={ingresar}>
              INGRESAR
            </button>

            <div className="loginHelp">
              Usá el mail institucional asociado a tu portal.
            </div>
          </div>
        </main>
      </>
    );
  }

  /* =========================================================
     PORTAL
     ========================================================= */

  const nombre = prettyName(asesor?.nombre);

  return (
    <>
      <style>{estilos}</style>

      <main className="appPage">

        {/* HEADER */}

        <header className="header">
          <div>
            <div className="brand">PORTAL DE CALIDAD</div>

            <h1>Hola, {nombre}</h1>

            <div className="semana">
              {reporte?.semana || "Semana actual"}
            </div>
          </div>

          <div className="headerRight">
            <div className={estadoClase(reporte?.estado_objetivo)}>
              {reporte?.estado_objetivo || "EN SEGUIMIENTO"}
            </div>

            <button
              className="logout"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* NAVEGACIÓN */}

        <nav className="tabs">

          <button
            className={pestana === "calidad" ? "active" : ""}
            onClick={() => setPestana("calidad")}
          >
            CALIDAD
          </button>

          <button
            className={pestana === "productividad" ? "active" : ""}
            onClick={() => setPestana("productividad")}
          >
            PRODUCTIVIDAD
          </button>

          <button
            className={pestana === "tipificaciones" ? "active" : ""}
            onClick={() => setPestana("tipificaciones")}
          >
            TIPIFICACIONES
          </button>

          <button
            className={pestana === "auditorias" ? "active" : ""}
            onClick={() => setPestana("auditorias")}
          >
            AUDITORÍAS
          </button>

          <button
            className={pestana === "actividades" ? "active" : ""}
            onClick={() => setPestana("actividades")}
          >
            ACTIVIDADES
          </button>

          <button
            className={pestana === "historico" ? "active" : ""}
            onClick={() => setPestana("historico")}
          >
            HISTÓRICO
          </button>

          <button
            className={pestana === "feedback" ? "active" : ""}
            onClick={() => setPestana("feedback")}
          >
            FEEDBACK
          </button>

        </nav>

        {cargando && (
          <div className="loading">
            Cargando reporte...
          </div>
        )}

        {!cargando && !reporte && (
          <section className="emptyReport">
            <div className="emptyIcon">01</div>

            <h2>Todavía no hay un reporte cargado.</h2>

            <p>
              Cuando Calidad cargue tu reporte, aparecerá
              automáticamente acá.
            </p>
          </section>
        )}

        {!cargando && reporte && (
          <>
            {/* =================================================
                CALIDAD
                ================================================= */}

            {pestana === "calidad" && (
              <section className="content">

                <div className="sectionNumber">01</div>

                <div className="sectionHeader">
                  <h2>CALIDAD</h2>
                  <span>{reporte.producto || "AP"}</span>
                </div>

                <div className="qualityTop">

                  <div className="scoreCard">
                    <small>NOTA</small>

                    <div className="score">
                      {reporte.nota || 0}
                      <span>/ 100</span>
                    </div>
                  </div>

                  <div className="metricCard">
                    <small>OBJETIVO</small>
                    <strong>
                      {reporte.objetivo_calidad ||
                        reporte.objetivo ||
                        0}
                    </strong>
                  </div>

                  <div className="metricCard">
                    <small>ESTADO</small>

                    <div
                      className={estadoClase(
                        reporte.estado_objetivo
                      )}
                    >
                      {reporte.estado_objetivo ||
                        "EN SEGUIMIENTO"}
                    </div>
                  </div>

                  <div className="metricCard">
                    <small>PRODUCTO</small>
                    <strong>
                      {reporte.producto || "-"}
                    </strong>
                  </div>

                </div>

                <div className="progressCard">

                  <div className="progressInfo">
                    <span>Progreso hacia el objetivo</span>

                    <strong>
                      {porcentaje(
                        reporte.nota,
                        reporte.objetivo_calidad ||
                          reporte.objetivo
                      )}
                      %
                    </strong>
                  </div>

                  <div className="progressBar">
                    <div
                      style={{
                        width:
                          `${porcentaje(
                            reporte.nota,
                            reporte.objetivo_calidad ||
                              reporte.objetivo
                          )}%`,
                      }}
                    />
                  </div>

                </div>

                <div className="twoColumns">

                  <InfoBox
                    title="CUÁNTO FALTA PARA ALCANZAR EL OBJETIVO"
                    value={
                      Math.max(
                        0,
                        Number(
                          reporte.objetivo_calidad ||
                            reporte.objetivo ||
                            0
                        ) - Number(reporte.nota || 0)
                      ) + " puntos"
                    }
                  />

                  <InfoBox
                    title="DESVÍO PRINCIPAL"
                    value={
                      reporte.desvio || "Sin información"
                    }
                  />

                </div>

                <InfoBox
                  title="COMPARATIVO SEMANAL"
                  value={
                    reporte.evolucion ||
                    "Todavía no hay una semana anterior para comparar."
                  }
                />

                <MultiList
                  title="ITEMS TRABAJADOS"
                  items={parseArray(reporte.items_calidad)}
                />

                <MultiList
                  title="ACCIONES REALIZADAS"
                  items={parseArray(reporte.acciones_calidad)}
                />

                <div className="subSection">

                  <h3>AUDITORÍA</h3>

                  <div className="auditGrid">

                    <InfoBox
                      title="ESTADO DE AUDITORÍA"
                      value={
                        reporte.auditoria ||
                        "No hay información de auditoría."
                      }
                    />

                    <InfoBox
                      title="OBSERVACIONES"
                      value={
                        reporte.observaciones ||
                        "Sin observaciones cargadas."
                      }
                    />

                  </div>

                  {reporte.audio_url && (
                    <div className="audioBox">
                      <strong>Audio de auditoría</strong>

                      <audio
                        controls
                        src={reporte.audio_url}
                      />
                    </div>
                  )}

                </div>

              </section>
            )}

            {/* =================================================
                PRODUCTIVIDAD
                ================================================= */}

            {pestana === "productividad" && (
              <section className="content">

                <div className="sectionNumber">02</div>

                <div className="sectionHeader">
                  <h2>PRODUCTIVIDAD</h2>
                </div>

                <div className="qualityTop">

                  <div className="metricCard large">
                    <small>SPH</small>
                    <strong>{reporte.sph || "0"}</strong>
                    <span>
                      Objetivo SPH:{" "}
                      {reporte.objetivo_sph || "0"}
                    </span>
                  </div>

                  <div className="metricCard large">
                    <small>VENTAS</small>
                    <strong>{reporte.ventas || "0"}</strong>
                    <span>
                      Objetivo ventas:{" "}
                      {reporte.objetivo_ventas || "0"}
                    </span>
                  </div>

                  <div className="metricCard large">
                    <small>OBJETIVO DE CAMPAÑA</small>
                    <strong>
                      {reporte.objetivo_campania || "0"}
                    </strong>
                  </div>

                  <div className="metricCard large">
                    <small>ESTADO</small>
                    <div
                      className={estadoClase(
                        reporte.estado_campania
                      )}
                    >
                      {reporte.estado_campania ||
                        "EN PROCESO"}
                    </div>
                  </div>

                </div>

                <InfoBox
                  title="COMPARATIVO SEMANAL"
                  value={
                    reporte.evolucion ||
                    "Todavía no hay una semana anterior para comparar."
                  }
                />

                <MultiList
                  title="ITEMS TRABAJADOS"
                  items={parseArray(
                    reporte.items_productividad
                  )}
                />

                <MultiList
                  title="ACCIONES REALIZADAS"
                  items={parseArray(
                    reporte.acciones_productividad
                  )}
                />

                <InfoBox
                  title="OBSERVACIONES"
                  value={
                    reporte.observaciones_productividad ||
                    "No hay observaciones cargadas."
                  }
                />

              </section>
            )}

            {/* =================================================
                TIPIFICACIONES
                ================================================= */}

            {pestana === "tipificaciones" && (
              <section className="content">

                <div className="sectionNumber">03</div>

                <div className="sectionHeader">
                  <h2>TIPIFICACIONES</h2>

                  <div
                    className={estadoClase(
                      reporte.estado_tipificaciones
                    )}
                  >
                    {reporte.estado_tipificaciones ||
                      "EN PROCESO"}
                  </div>
                </div>

                <div className="qualityTop">

                  <div className="metricCard">
                    <small>DESVÍO</small>
                    <strong>
                      {reporte.tipificacion_desvio ||
                        reporte.desvio_tipificacion ||
                        "-"}
                    </strong>
                  </div>

                  <div className="metricCard">
                    <small>OBJETIVO</small>
                    <strong>
                      {reporte.tipificacion_objetivo ||
                        reporte.objetivo_tipificacion ||
                        "-"}
                    </strong>
                  </div>

                  <div className="metricCard">
                    <small>RESULTADO</small>
                    <strong>
                      {reporte.tipificacion_resultado ||
                        reporte.resultado_tipificacion ||
                        "-"}
                    </strong>
                  </div>

                </div>

                <MultiList
                  title="TIPIFICACIONES"
                  items={parseArray(
                    reporte.tipificaciones
                  )}
                />

                <InfoBox
                  title="COMPROMISO"
                  value={
                    reporte.tipificacion_compromiso ||
                    reporte.compromiso_tipificacion ||
                    "-"
                  }
                />

                <InfoBox
                  title="OBSERVACIONES"
                  value={
                    reporte.tipificacion_observaciones ||
                    reporte.observaciones_tipificacion ||
                    "Sin observaciones cargadas."
                  }
                />

              </section>
            )}

            {/* =================================================
                AUDITORÍAS
                ================================================= */}

            {pestana === "auditorias" && (
              <section className="content">

                <div className="sectionNumber">04</div>

                <div className="sectionHeader">
                  <h2>AUDITORÍAS DE NO VENTAS</h2>
                </div>

                <div className="qualityTop">

                  <div className="metricCard">
                    <small>CANTIDAD</small>
                    <strong>
                      {reporte.cantidad_no_ventas || "-"}
                    </strong>
                  </div>

                  <div className="metricCard">
                    <small>COACHING</small>
                    <strong>
                      {reporte.coaching_no_ventas || "-"}
                    </strong>
                  </div>

                  <div className="metricCard">
                    <small>REGISTRO EN SISTEMA</small>
                    <strong>
                      {reporte.registro_sistema || "-"}
                    </strong>
                  </div>

                  <div className="metricCard">
                    <small>COMPROMISO</small>
                    <strong>
                      {reporte.compromiso_no_ventas || "-"}
                    </strong>
                  </div>

                </div>

                <MultiList
                  title="PRINCIPALES O.M."
                  items={parseArray(
                    reporte.om_detectadas ||
                      reporte.principales_om
                  )}
                />

                <MultiList
                  title="FORTALEZAS"
                  items={parseArray(
                    reporte.fortalezas
                  )}
                />

                <InfoBox
                  title="OBSERVACIONES"
                  value={
                    reporte.observaciones_no_ventas ||
                    "No hay observaciones cargadas."
                  }
                />

              </section>
            )}

            {/* =================================================
                ACTIVIDADES
                ================================================= */}

            {pestana === "actividades" && (
              <section className="content">

                <div className="sectionNumber">05</div>

                <div className="sectionHeader">
                  <h2>ACTIVIDADES</h2>
                </div>

                <div className="comingSoon">

                  <div className="plus">+</div>

                  <h3>Próximamente</h3>

                  <p>
                    Esta sección quedará disponible para
                    registrar y consultar actividades.
                  </p>

                </div>

              </section>
            )}

            {/* =================================================
                HISTÓRICO
                ================================================= */}

            {pestana === "historico" && (
              <section className="content">

                <div className="sectionNumber">06</div>

                <div className="sectionHeader">
                  <h2>HISTÓRICO</h2>
                </div>

                <div className="historyEmpty">

                  <h3>Evolución de tus reportes</h3>

                  <p>
                    Acá vas a poder consultar tus reportes
                    anteriores y ver tu evolución semanal.
                  </p>

                  <div className="historyLine" />

                  <span>
                    Histórico disponible próximamente.
                  </span>

                </div>

              </section>
            )}

            {/* =================================================
                FEEDBACK
                ================================================= */}

            {pestana === "feedback" && (
              <section className="content feedbackSection">

                <div className="sectionNumber">07</div>

                <div className="sectionHeader">
                  <h2>FEEDBACK DEL ASESOR</h2>
                </div>

                <div className="feedbackCard">

                  <h3>
                    ¿Querés dejar algún comentario sobre tu
                    reporte?
                  </h3>

                  <p>
                    Podés escribir una consulta, comentario o
                    algo que quieras trabajar con Calidad.
                  </p>

                  <textarea
                    placeholder="Escribí tu comentario..."
                    rows={7}
                  />

                  <button className="btnPrincipal">
                    ENVIAR FEEDBACK
                  </button>

                </div>

              </section>
            )}

          </>
        )}

      </main>
    </>
  );
}

/* =========================================================
   COMPONENTES
   ========================================================= */

function InfoBox({ title, value }) {
  return (
    <div className="infoBox">
      <small>{title}</small>
      <div>{value || "-"}</div>
    </div>
  );
}

function MultiList({ title, items }) {
  return (
    <div className="multiList">

      <h3>{title}</h3>

      {items?.length ? (
        <div className="chips">
          {items.map((item, index) => (
            <div className="chip" key={`${item}-${index}`}>
              <span>✓</span>
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div className="noData">
          No hay información cargada.
        </div>
      )}

    </div>
  );
}

/* =========================================================
   ESTILOS
   ========================================================= */

const estilos = `
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: ${colores.fondo};
  color: ${colores.texto};
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

/* LOGIN */

.loginPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background:
    radial-gradient(circle at top left, rgba(22,139,145,.14), transparent 35%),
    linear-gradient(135deg, #edf6f7 0%, #f7faf9 100%);
}

.loginCard {
  width: 100%;
  max-width: 480px;
  background: white;
  border: 1px solid ${colores.borde};
  border-radius: 28px;
  padding: 48px;
  box-shadow: 0 25px 70px rgba(6,75,82,.12);
}

.logoMini {
  width: 52px;
  height: 52px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colores.petroleo};
  color: white;
  font-weight: 900;
  letter-spacing: -1px;
  margin-bottom: 18px;
}

.loginBrand {
  color: ${colores.petroleo};
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 22px;
}

.loginCard h1 {
  margin: 0 0 10px;
  font-size: 34px;
  color: ${colores.petroleoOscuro};
}

.loginCard p {
  margin: 0 0 30px;
  color: ${colores.gris};
  line-height: 1.6;
}

.loginCard label {
  display: block;
  font-weight: 800;
  margin-bottom: 9px;
  font-size: 14px;
}

.loginCard input {
  width: 100%;
  border: 1px solid #ccdcdc;
  border-radius: 12px;
  padding: 15px 16px;
  outline: none;
  transition: .2s;
}

.loginCard input:focus {
  border-color: ${colores.turquesa};
  box-shadow: 0 0 0 4px rgba(22,139,145,.1);
}

.errorBox {
  margin-top: 14px;
  background: #fff0f0;
  border: 1px solid #f0cccc;
  color: #9f3d3d;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
}

.btnPrincipal {
  width: 100%;
  border: none;
  border-radius: 12px;
  background: ${colores.petroleo};
  color: white;
  padding: 15px 20px;
  font-weight: 900;
  margin-top: 18px;
  transition: .2s;
}

.btnPrincipal:hover {
  background: ${colores.petroleoOscuro};
  transform: translateY(-1px);
}

.loginHelp {
  text-align: center;
  color: #87999b;
  font-size: 12px;
  margin-top: 18px;
}

/* APP */

.appPage {
  min-height: 100vh;
  background: ${colores.fondo};
  padding-bottom: 70px;
}

.header {
  background: white;
  border-bottom: 1px solid ${colores.borde};
  padding: 34px 7%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
}

.brand {
  color: ${colores.petroleo};
  font-weight: 900;
  letter-spacing: 2px;
  font-size: 14px;
  margin-bottom: 12px;
}

.header h1 {
  margin: 0;
  color: ${colores.petroleoOscuro};
  font-size: 34px;
  letter-spacing: -.7px;
}

.semana {
  margin-top: 9px;
  color: ${colores.gris};
  font-size: 15px;
}

.headerRight {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 15px;
}

.estado {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 8px 13px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .5px;
}

.estado.verde {
  background: #e5f5ed;
  color: #277b5f;
}

.estado.amarillo {
  background: #fff4dc;
  color: #996d18;
}

.estado.rojo {
  background: #fde9e9;
  color: #a34646;
}

.logout {
  border: none;
  background: transparent;
  color: #718588;
  font-size: 13px;
  font-weight: 700;
}

.logout:hover {
  color: ${colores.petroleo};
}

/* TABS */

.tabs {
  background: white;
  border-bottom: 1px solid ${colores.borde};
  padding: 0 7%;
  display: flex;
  gap: 4px;
  overflow-x: auto;
}

.tabs button {
  border: none;
  background: transparent;
  color: #718588;
  padding: 18px 17px;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
}

.tabs button:hover {
  color: ${colores.petroleo};
}

.tabs button.active {
  color: ${colores.petroleo};
  border-bottom-color: ${colores.petroleo};
}

/* CONTENIDO */

.content {
  width: min(1120px, 86%);
  margin: 35px auto 0;
}

.sectionNumber {
  font-size: 12px;
  color: ${colores.turquesa};
  font-weight: 900;
  margin-bottom: 7px;
}

.sectionHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid ${colores.borde};
  padding-bottom: 22px;
  margin-bottom: 24px;
}

.sectionHeader h2 {
  margin: 0;
  color: ${colores.petroleoOscuro};
  font-size: 28px;
  letter-spacing: -.5px;
}

.sectionHeader > span {
  color: ${colores.petroleo};
  font-weight: 900;
  background: #e4f1f2;
  padding: 8px 13px;
  border-radius: 9px;
  font-size: 12px;
}

/* CARDS */

.qualityTop {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 15px;
}

.scoreCard,
.metricCard,
.infoBox,
.progressCard,
.multiList,
.subSection,
.feedbackCard,
.comingSoon,
.historyEmpty {
  background: white;
  border: 1px solid ${colores.borde};
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(6,75,82,.035);
}

.scoreCard,
.metricCard {
  padding: 22px;
  min-height: 130px;
}

.scoreCard small,
.metricCard small,
.infoBox small {
  display: block;
  color: #799093;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.1px;
  margin-bottom: 12px;
}

.score {
  color: ${colores.petroleo};
  font-size: 42px;
  line-height: 1;
  font-weight: 900;
}

.score span {
  font-size: 14px;
  color: #87999b;
  font-weight: 700;
}

.metricCard strong {
  display: block;
  color: ${colores.petroleoOscuro};
  font-size: 25px;
  font-weight: 900;
}

.metricCard span {
  display: block;
  margin-top: 7px;
  color: ${colores.gris};
  font-size: 12px;
}

.metricCard.large {
  min-height: 145px;
}

/* PROGRESS */

.progressCard {
  padding: 21px;
  margin-bottom: 15px;
}

.progressInfo {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 12px;
  color: ${colores.gris};
  font-weight: 700;
}

.progressInfo strong {
  color: ${colores.petroleo};
}

.progressBar {
  width: 100%;
  height: 9px;
  background: #e6eeee;
  border-radius: 999px;
  overflow: hidden;
}

.progressBar div {
  height: 100%;
  background: linear-gradient(
    90deg,
    ${colores.petroleo},
    ${colores.turquesa}
  );
  border-radius: 999px;
}

/* INFO */

.twoColumns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.infoBox {
  padding: 21px;
  margin-bottom: 15px;
}

.infoBox div {
  color: ${colores.texto};
  font-size: 14px;
  line-height: 1.65;
  font-weight: 600;
}

/* LISTAS */

.multiList {
  padding: 21px;
  margin-bottom: 15px;
}

.multiList h3,
.subSection h3 {
  margin: 0 0 16px;
  color: ${colores.petroleoOscuro};
  font-size: 13px;
  letter-spacing: .5px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #edf6f6;
  border: 1px solid #d7e9ea;
  color: #27575c;
  border-radius: 9px;
  padding: 9px 11px;
  font-size: 12px;
  font-weight: 700;
}

.chip span {
  color: ${colores.turquesa};
  font-weight: 900;
}

.noData {
  color: #87999b;
  font-size: 13px;
}

/* AUDITORIA */

.subSection {
  padding: 21px;
  margin-top: 15px;
}

.auditGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.audioBox {
  margin-top: 5px;
  padding-top: 20px;
  border-top: 1px solid ${colores.borde};
}

.audioBox strong {
  display: block;
  margin-bottom: 10px;
  color: ${colores.petroleoOscuro};
}

.audioBox audio {
  width: 100%;
}

/* EMPTY */

.emptyReport {
  width: min(800px, 86%);
  margin: 80px auto;
  background: white;
  border: 1px solid ${colores.borde};
  border-radius: 20px;
  padding: 45px;
  text-align: center;
}

.emptyIcon {
  color: ${colores.turquesa};
  font-weight: 900;
  font-size: 13px;
  margin-bottom: 18px;
}

.emptyReport h2 {
  margin: 0 0 10px;
  color: ${colores.petroleoOscuro};
}

.emptyReport p {
  margin: 0;
  color: ${colores.gris};
}

/* ACTIVIDADES */

.comingSoon {
  padding: 70px 30px;
  text-align: center;
}

.plus {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e3f1f2;
  color: ${colores.petroleo};
  font-size: 30px;
  font-weight: 400;
}

.comingSoon h3 {
  margin: 0 0 8px;
  color: ${colores.petroleoOscuro};
}

.comingSoon p {
  margin: 0;
  color: ${colores.gris};
}

/* HISTORICO */

.historyEmpty {
  padding: 55px;
  text-align: center;
}

.historyEmpty h3 {
  margin: 0 0 10px;
  color: ${colores.petroleoOscuro};
}

.historyEmpty p {
  max-width: 600px;
  margin: 0 auto 25px;
  color: ${colores.gris};
  line-height: 1.6;
}

.historyLine {
  height: 1px;
  background: ${colores.borde};
  margin: 25px 0;
}

.historyEmpty span {
  color: #87999b;
  font-size: 13px;
}

/* FEEDBACK */

.feedbackCard {
  padding: 28px;
}

.feedbackCard h3 {
  margin: 0 0 8px;
  color: ${colores.petroleoOscuro};
}

.feedbackCard p {
  margin: 0 0 22px;
  color: ${colores.gris};
}

.feedbackCard textarea {
  width: 100%;
  resize: vertical;
  border: 1px solid #d1dfdf;
  border-radius: 12px;
  padding: 15px;
  outline: none;
}

.feedbackCard textarea:focus {
  border-color: ${colores.turquesa};
}

.feedbackCard .btnPrincipal {
  width: auto;
  padding-left: 28px;
  padding-right: 28px;
}

/* LOADING */

.loading {
  width: min(1120px, 86%);
  margin: 35px auto;
  padding: 18px;
  background: white;
  border: 1px solid ${colores.borde};
  border-radius: 14px;
  color: ${colores.petroleo};
  font-weight: 800;
}

/* RESPONSIVE */

@media (max-width: 850px) {

  .header {
    padding: 25px 5%;
    flex-direction: column;
  }

  .headerRight {
    align-items: flex-start;
  }

  .tabs {
    padding: 0 5%;
  }

  .qualityTop {
    grid-template-columns: 1fr 1fr;
  }

  .twoColumns,
  .auditGrid {
    grid-template-columns: 1fr;
  }

  .content {
    width: 90%;
  }
}

@media (max-width: 560px) {

  .loginCard {
    padding: 30px 22px;
  }

  .loginCard h1 {
    font-size: 28px;
  }

  .header h1 {
    font-size: 27px;
  }

  .qualityTop {
    grid-template-columns: 1fr;
  }

  .score {
    font-size: 38px;
  }

  .content {
    width: 92%;
  }
}
`;
