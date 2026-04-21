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
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,900;1,900&family=Space+Grotesk:wght@700&family=Be+Vietnam+Pro:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Be Vietnam Pro', Helvetica, Arial, sans-serif;">

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #131313; border: 4px solid #000000; border-collapse: collapse;">
        
        <tr>
            <td align="center" bgcolor="#FF006E" style="padding: 40px 20px; position: relative;">
                <div style="display: inline-block; border: 2px dashed #ffffff; padding: 15px 30px; transform: rotate(-1deg);">
                    <h1 style="margin: 0; font-family: 'Epilogue', Arial, sans-serif; font-size: 28px; font-weight: 900; font-style: italic; color: #ffffff; text-transform: uppercase; letter-spacing: -1px;">
                        HYGGE RUG
                    </h1>
                </div>
            </td>
        </tr>

        <tr>
            <td bgcolor="#1c1b1b" style="padding: 40px 30px;">
                
                <h2 style="margin: 0 0 20px 0; font-family: 'Epilogue', Arial, sans-serif; font-size: 38px; font-weight: 800; font-style: italic; color: #ffffff; text-transform: uppercase; line-height: 1;">
                    ¡HOLA, MEMBER! ✨
                </h2>
                <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #d4d4d8;">
                    Bienvenido al lado más gamberro y artesanal del diseño. En <span style="color: #ffffff; font-weight: bold; font-style: italic;">Hygge Rug</span> no solo hacemos alfombras, creamos piezas con actitud.
                </p>

                <div style="margin-bottom: 40px;">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBulYIFcO4T-84ct9SIe2KASQeUU3F_CKFE0M8rdalbGDEkNmgvje3WFSC6j-8AnUkR5rcAD8vJQkW8YIpA6czWocjsQd0Y3ez3GwQ21EotUMQQ2gZZDjmfzNb90Wn32PVF6QxS9Bz_e2CoGoP2uDmFYWbnyzIxC69HboS2AOHOQyAWUoEiLrY-cqezFh2xE6r77H3N-_gfb3MHoQwOSTlFYWsfcaxwj_JxRCPvR7dofOSIu19r4MxHmRio82aT-ikK0Y03o562n4" alt="Streetwear" width="100%" style="display: block; border: 4px solid #ffffff; filter: grayscale(1); box-shadow: 8px 8px 0px #FF006E;">
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; background-color: #0e0e0e; border: 2px dashed #5d3f44; border-radius: 10px;">
                    <tr>
                        <td style="padding: 20px;">
                            <h3 style="margin: 0 0 10px 0; font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; color: #e9c400; text-transform: uppercase; letter-spacing: 2px;">
                                TU NUEVA VENTAJA:
                            </h3>
                            <p style="margin: 0; font-size: 14px; color: #a1a1aa; line-height: 1.5;">
                                Ya puedes gestionar tus pedidos personalizados y acceder a lanzamientos limitados antes que nadie.
                            </p>
                        </td>
                    </tr>
                </table>

                <center style="margin-bottom: 40px;">
                    <a href="#" style="display: inline-block; background-color: #ffe16d; color: #000000; font-family: 'Epilogue', Arial, sans-serif; font-weight: 900; font-size: 18px; font-style: italic; text-decoration: none; padding: 20px 40px; border-radius: 50px; text-transform: uppercase; border: 3px solid #000000; box-shadow: 6px 6px 0px #000000;">
                        ENTRAR A MI PANEL
                    </a>
                </center>

                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FF006E; border: 4px solid #000000; box-shadow: 6px 6px 0px #000000; transform: rotate(-2deg);">
                    <tr>
                        <td style="padding: 20px;">
                            <h3 style="margin: 0 0 5px 0; font-family: 'Epilogue', Arial, sans-serif; font-size: 20px; font-weight: 800; color: #ffffff; text-transform: uppercase;">
                                TUS SUELOS CON ACTITUD
                            </h3>
                            <p style="margin: 0; font-family: 'Space Grotesk', sans-serif; font-size: 10px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
                                Limited drops. Hand-tufted chaos.
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>

        <tr>
            <td align="center" bgcolor="#353534" style="padding: 40px 30px; border-top: 4px solid #FF006E;">
                <div style="font-family: 'Epilogue', sans-serif; font-weight: 900; font-size: 14px; color: #ffffff; text-transform: uppercase; font-style: italic; margin-bottom: 10px;">
                    STREETWEAR COLLECTIVE
                </div>
                <p style="margin: 0; font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; line-height: 1.6;">
                    © 2024 HYGGE RUG - Handmade Attitude.<br>
                    KEEP IT ROUGH. YOUR FLOORS WILL NEVER BE THE SAME.
                </p>
            </td>
        </tr>

    </table>
</body>
</html>
    `,
  };

  return transporter.sendMail(mailOptions);
}