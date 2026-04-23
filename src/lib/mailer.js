import nodemailer from "nodemailer";
import { getProducts } from "./db/products";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWelcomeEmail(toEmail, nickname) {
  const brand = {
    url: "https://hyggerug.vercel.app",
    pink: "#FF0055",
    yellow: "#FFD701",
    white: "#FFFFFF",
    offWhite: "#FAFAFA",
    textDark: "#111111",
    textDim: "#666666",
    border: "#EEEEEE",
    bgLight: "#F7F7F7",
  };

  // 1. OBTENER PRODUCTOS DE LA BASE DE DATOS
  let featuredProducts = [];
  try {
    const products = await getProducts();
    featuredProducts = products.slice(0, 2);
  } catch (error) {
    console.error("Error fetching products for email:", error);
  }

  if (featuredProducts.length === 0) {
    featuredProducts = [
      {
        name: "Classic Mario Rug",
        main_image: "/rug-mario.png",
        description: "Nuestra pieza más icónica con relieves 3D.",
      },
      {
        name: "Gorillaz Edition",
        main_image: "/rug-gorillaz.png",
        description: "Lana técnica premium sobre lienzo artesanal.",
      },
    ];
  }

  // 2. HTML DE PRODUCTOS
  const productsHtml = featuredProducts
    .map(
      (product) => `
      <td width="50%" align="center" style="padding: 8px; vertical-align: top;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0"
          style="background-color: #FFFFFF; border: 1px solid #EEEEEE; border-radius: 12px; overflow: hidden;">
          <tr>
            <td align="center" style="padding: 20px 15px 10px 15px;">
              <img
                src="${product.main_image?.startsWith("http") ? product.main_image : brand.url + product.main_image}"
                width="130"
                style="display: block; border-radius: 8px; max-width: 130px;"
                alt="${product.name}"
              />
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 15px 20px 15px; text-align: center;">
              <p style="margin: 0; font-weight: 700; font-size: 14px; color: #111111; line-height: 1.3;">${product.name}</p>
              <p style="margin: 5px 0 0 0; font-size: 10px; color: #999999; text-transform: uppercase; letter-spacing: 1.5px;">Último Drop</p>
            </td>
          </tr>
        </table>
      </td>
    `
    )
    .join("");

  // 3. HTML DEL EMAIL
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a HYGGE RUG</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F0F0F0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111111;">

  <!-- WRAPPER EXTERIOR -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F0F0F0; padding: 40px 10px;">
    <tr>
      <td align="center">

        <!-- CONTENEDOR PRINCIPAL 600px -->
        <table width="600" border="0" cellspacing="0" cellpadding="0"
          style="background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #DDDDDD; max-width: 600px;">

          <!-- ── CABECERA / LOGO ── -->
          <tr>
            <td align="center" style="background-color: ${brand.pink}; padding: 36px 40px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center"
                    style="background-color: #FFFFFF; border-radius: 10px; border: 2px dashed #DDDDDD; padding: 14px 32px;">
                    <p style="margin: 0; font-size: 30px; font-weight: 900; letter-spacing: 2px; color: #111111; line-height: 1;">HYGGE</p>
                    <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; letter-spacing: 7px; color: ${brand.pink}; border-top: 2px solid #111111; padding-top: 4px; text-transform: uppercase;">RUG</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── HERO ── -->
          <tr>
            <td style="padding: 48px 48px 32px 48px; text-align: center;">
              <h1 style="margin: 0; font-size: 30px; font-weight: 900; line-height: 1.25; color: #111111;">
                ¡Tus pies están a punto<br/>de dar un salto de alegría!
              </h1>
              <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.7; color: #555555;">
                Hola <strong style="color: #111111;">${nickname}</strong>, bienvenido a la familia Hygge&nbsp;Rug.
                Somos artesanos en Madrid con una misión clara: que tus suelos dejen de ser aburridos
                y empiecen a tener <strong style="color: #111111;">actitud</strong>.
              </p>
            </td>
          </tr>

          <!-- ── BANNER VENTAJA ── -->
          <tr>
            <td style="padding: 0 48px 40px 48px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0"
                style="background-color: #111111; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px 28px;">
                    <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${brand.yellow};">Tu nueva ventaja</p>
                    <p style="margin: 8px 0 0 0; font-size: 15px; color: #FFFFFF; line-height: 1.6;">
                      Ya puedes gestionar tus pedidos personalizados y acceder a lanzamientos limitados <strong>antes que nadie</strong>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── PRODUCTOS ── -->
          <tr>
            <td style="background-color: #F7F7F7; border-top: 1px solid #EEEEEE; border-bottom: 1px solid #EEEEEE; padding: 36px 32px 40px 32px;">
              <p style="margin: 0 0 24px 0; text-align: center; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: ${brand.pink};">
                Últimos diseños de la comunidad
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  ${productsHtml}
                </tr>
              </table>
              <div style="text-align: center; margin-top: 28px;">
                <a href="${brand.url}/tienda"
                  style="background-color: ${brand.pink}; color: #FFFFFF; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 14px 32px; border-radius: 6px; display: inline-block;">
                  Ver diseños de la comunidad
                </a>
              </div>
            </td>
          </tr>

          <!-- ── PANEL ── -->
          <tr>
            <td style="padding: 44px 48px; text-align: center; border-bottom: 1px solid #EEEEEE;">
              <h2 style="margin: 0; font-size: 22px; font-weight: 900; color: #111111;">Toma las riendas</h2>
              <p style="margin: 12px 0 28px 0; font-size: 15px; color: #555555; line-height: 1.6;">
                Accede a tu panel personal para seguir tus pedidos activos y gestionar tu cuenta.
              </p>
              <a href="${brand.url}/dashboard"
                style="border: 2px solid #111111; color: #111111; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 13px 28px; border-radius: 6px; display: inline-block;">
                Administrar perfil
              </a>
            </td>
          </tr>

          <!-- ── REDES SOCIALES ── -->
          <tr>
            <td align="center" style="padding: 32px 48px;">
              <a href="https://instagram.com/hygge_rug"
                style="text-decoration: none; color: #111111; font-weight: 700; font-size: 13px; letter-spacing: 1px; margin: 0 14px; text-transform: uppercase;">
                Instagram
              </a>
              <a href="https://www.tiktok.com/@hygge_rug"
                style="text-decoration: none; color: #111111; font-weight: 700; font-size: 13px; letter-spacing: 1px; margin: 0 14px; text-transform: uppercase;">
                TikTok
              </a>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background-color: #F7F7F7; border-top: 1px solid #EEEEEE; padding: 32px 48px; text-align: center;">
              <p style="margin: 0; font-size: 13px; font-weight: 900; letter-spacing: 5px; text-transform: uppercase; color: #111111;">HYGGE RUG</p>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: #999999;">Madrid, España · Handmade with Attitude.</p>
              <p style="margin: 16px 0 0 0; font-size: 11px; color: #BBBBBB; line-height: 1.6;">
                Recibiste este correo porque te has registrado en
                <a href="${brand.url}" style="color: #888888; text-decoration: underline;">hyggerug.app</a>.<br/>
                Si deseas dejar de recibirlo, gestiona tus preferencias en el panel de usuario.
              </p>
            </td>
          </tr>

        </table>
        <!-- /CONTENEDOR PRINCIPAL -->

      </td>
    </tr>
  </table>
  <!-- /WRAPPER EXTERIOR -->

</body>
</html>
  `;

  const mailOptions = {
    from: `"HYGGE RUG" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `¡Tus suelos nos han pedido tu número, ${nickname}!`,
    html,
  };

  return transporter.sendMail(mailOptions);
}