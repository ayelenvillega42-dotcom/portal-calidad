export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      const url = new URL(request.url);

      // =========================
      // ESTADO
      // =========================

      if (url.pathname === "/estado") {
        const resultado = await env.DB
          .prepare("SELECT COUNT(*) AS cantidad FROM asesores")
          .first();

        return json({
          estado: "ok",
          base: "portal-calidad",
          asesores: resultado?.cantidad ?? 0,
        }, corsHeaders);
      }

      // =========================
      // ASESORES
      // =========================

      if (url.pathname === "/asesores") {
        const resultado = await env.DB
          .prepare(`
            SELECT
              id,
              numero_usuario,
              nombre,
              usuario_login,
              activo
            FROM asesores
            WHERE activo = 1
            ORDER BY nombre ASC
          `)
          .all();

        return json(resultado.results ?? [], corsHeaders);
      }

      // =========================
      // REPORTES
      // =========================

      if (url.pathname === "/reportes") {
        const asesorId = url.searchParams.get("asesor_id");

        if (!asesorId) {
          return json(
            { error: "Falta asesor_id" },
            corsHeaders,
            400
          );
        }

        const resultado = await env.DB
          .prepare(`
            SELECT
              id,
              asesor_id,
              semana,
              nota,
              evolucion,
              objetivos,
              desvio_principal,
              recomendaciones,
              auditoria,
              producto,
              observaciones,
              fecha_carga
            FROM reportes
            WHERE asesor_id = ?
            ORDER BY id DESC
          `)
          .bind(asesorId)
          .all();

        return json(resultado.results ?? [], corsHeaders);
      }

      // =========================
      // CARGAR REPORTE
      // =========================

      if (url.pathname === "/reportes" && request.method === "POST") {
        const datos = await request.json();

        if (!datos.asesor_id || !datos.semana) {
          return json(
            {
              error: "asesor_id y semana son obligatorios",
            },
            corsHeaders,
            400
          );
        }

        const resultado = await env.DB
          .prepare(`
            INSERT INTO reportes (
              asesor_id,
              semana,
              nota,
              evolucion,
              objetivos,
              desvio_principal,
              recomendaciones,
              auditoria,
              producto,
              observaciones
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `)
          .bind(
            datos.asesor_id,
            datos.semana,
            datos.nota ?? null,
            datos.evolucion ?? null,
            datos.objetivos ?? null,
            datos.desvio_principal ?? null,
            datos.recomendaciones ?? null,
            datos.auditoria ?? null,
            datos.producto ?? null,
            datos.observaciones ?? null
          )
          .run();

        return json(
          {
            ok: true,
            mensaje: "Reporte cargado correctamente",
            id: resultado.meta?.last_row_id ?? null,
          },
          corsHeaders,
          201
        );
      }

      // =========================
      // RESPUESTA PRINCIPAL
      // =========================

      return json(
        {
          mensaje: "Portal de Calidad API funcionando",
          endpoints: [
            "/estado",
            "/asesores",
            "/reportes?asesor_id=5"
          ],
        },
        corsHeaders
      );

    } catch (error) {
      return json(
        {
          error: "Error en la API",
          detalle: error.message,
        },
        corsHeaders,
        500
      );
    }
  },
};

function json(data, headers, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
}
