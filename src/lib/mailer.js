import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWelcomeEmail(toEmail, nickname) {
  // Definimos los colores de tu globals.css para usarlos fácilmente
  const colors = {
    primaryBg: '#2C2E33',
    secondaryBg: '#363940',
    highlight: '#FF0055', // Pink
    accent: '#FFD701',    // Yellow/Gold
    text: '#ffffff',
    secondaryText: '#e0e0e0'
  };

  const mailOptions = {
    from: `"Hygge Rug 🧶" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '¡Ya eres parte de la cultura Hygge Rug! ✨',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        /* Nota: En emails usamos estilos inline, pero algunos clientes leen el tag style */
        .stitched {
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 20px;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${colors.primaryBg}; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${colors.primaryBg}; padding: 40px 10px;">
        <tr>
          <td align="center">
            
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: ${colors.secondaryBg}; border-radius: 24px; overflow: hidden; border: 1px solid #444;">
              
              <tr>
                <td align="center" style="background-color: ${colors.highlight}; padding: 40px 20px;">
                  <div style="border: 3px dashed #ffffff; display: inline-block; padding: 10px 25px; border-radius: 12px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 3px; text-transform: uppercase;">HYGGE RUG</h1>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; color: ${colors.text};">
                  <h2 style="font-size: 26px; margin-bottom: 20px; color: ${colors.text};">¡Hola, ${nickname}! ✨</h2>
                  
                  <p style="font-size: 16px; line-height: 1.6; color: ${colors.secondaryText};">
                    Bienvenido al lado más gamberro y artesanal del diseño. En <strong>Hygge Rug</strong> no solo hacemos alfombras, creamos piezas con actitud para gente que no se conforma con lo aburrido.
                  </p>

                  <div style="margin: 30px 0; padding: 20px; border: 2px dashed rgba(255, 255, 255, 0.2); border-radius: 16px;">
                    <p style="margin: 0; color: ${colors.accent}; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Tu nueva ventaja:</p>
                    <p style="margin: 10px 0 0 0; color: ${colors.text};">Ya puedes gestionar tus pedidos personalizados y acceder a lanzamientos limitados antes que nadie.</p>
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 40px;">
                    <tr>
                      <td align="center">
                        <a href="http://localhost:3000/dashboard" 
                           style="background-color: ${colors.accent}; color: #000000; padding: 18px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; border: 2px solid #000;">
                           ENTRAR A MI PANEL
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 30px; background-color: #1F2124; color: #666; font-size: 12px; border-top: 1px solid #444;">
                  <p style="margin: 0; color: ${colors.secondaryText};">© 2026 HYGGE RUG - Handmade Attitude</p>
                  <p style="margin: 10px 0 0 0;">Has recibido este correo porque te has unido a nuestra familia urbana.</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}