export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      // =========================
      // PRUEBA DE CONEXIÓN D1
      // =========================
      if (url.pathname === "/test-db") {
        const resultado = await env.DB
          .prepare("SELECT COUNT(*) AS cantidad FROM asesores")
          .first();

        return new Response(
          JSON.stringify({
            estado: "ok",
            base: "portal-calidad",
            asesores: resultado?.cantidad ?? 0
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      // =========================
      // API ASESORES
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
            ORDER BY nombre
          `)
          .all();

        return new Response(
          JSON.stringify(resultado.results || []),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      // =========================
      // API REPORTES
      // =========================
      if (url.pathname === "/reportes") {
        const asesorId = url.searchParams.get("asesor_id");

        if (!asesorId) {
          return new Response(
            JSON.stringify({
              error: "Falta asesor_id"
            }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
              }
            }
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
          .bind(Number(asesorId))
          .all();

        return new Response(
          JSON.stringify(resultado.results || []),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      // =========================
      // PÁGINA PRINCIPAL
      // =========================
      if (url.pathname === "/" || url.pathname === "") {
        return new Response(
          `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Portal de Calidad</title>
            <style>
              body {
                margin: 0;
                font-family: Arial, sans-serif;
                background: #f4f7f5;
                color: #30463b;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
              }

              .card {
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,.08);
                text-align: center;
                max-width: 500px;
                width: 90%;
              }

              .logo {
                width: 65px;
                height: 65px;
                border-radius: 50%;
                background: #657f70;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 28px;
                font-weight: bold;
              }

              h1 {
                margin-bottom: 10px;
              }

              p {
                color: #7b8982;
              }

              .ok {
                margin-top: 25px;
                padding: 15px;
                background: #eef4f1;
                border-radius: 12px;
                color: #40534a;
              }
            </style>
          </head>

          <body>
            <div class="card">
              <div class="logo">Q</div>

              <h1>Portal de Calidad</h1>

              <p>
                Seguimiento y evolución de calidad
              </p>

              <div class="ok">
                ✓ Portal conectado correctamente
              </div>
            </div>
          </body>
          </html>
          `,
          {
            headers: {
              "Content-Type": "text/html; charset=UTF-8"
            }
          }
        );
      }

      return new Response("Ruta no encontrada", {
        status: 404
      });

    } catch (error) {
      console.error("ERROR DEL WORKER:", error);

      return new Response(
        JSON.stringify({
          estado: "error",
          mensaje: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }
};
