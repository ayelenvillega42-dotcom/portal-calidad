export const metadata = {
  title: "Portal de Calidad",
  description: "Portal de seguimiento y evolución de calidad"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
