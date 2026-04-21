import nodemailer from 'nodemailer';
import { getProducts } from './db/products';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWelcomeEmail(toEmail, nickname) {
  const brand = {
    white: '#FFFFFF',
    pink: '#FF0055',
    text: '#222222',
    textDim: '#666666',
    border: '#F0F0F0',
    url: 'https://hyggerug.vercel.app'
  };

  // 1. OBTENER PRODUCTOS DE LA BASE DE DATOS
  let featuredProducts = [];
  try {
    const products = await getProducts();
    featuredProducts = products.slice(0, 2);
  } catch (error) {
    console.error('Error fetching products for email:', error);
  }

  // Fallback si no hay productos en la BD para que el email no quede vacío
  if (featuredProducts.length === 0) {
    featuredProducts = [
      { name: 'Classic Mario Rug', main_image: '/rug-mario.png', description: 'Nuestra pieza más icónica con relieves 3D.' },
      { name: 'Gorillaz Edition', main_image: '/rug-gorillaz.png', description: 'Lana técnica premium sobre lienzo artesanal.' }
    ];
  }

  // Generar HTML dinámico para los productos en una cuadrícula de 2 columnas
  const productsHtml = featuredProducts.map(product => `
    <td width="50%" align="center" style="padding: 10px; vertical-align: top;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #FFF; border: 1px solid #F0F0F0; border-radius: 12px; overflow: hidden;">
        <tr>
          <td align="center" style="padding: 20px 10px 10px 10px;">
             <img src="${product.main_image?.startsWith('http') ? product.main_image : brand.url + product.main_image}" width="140" style="display: block; border-radius: 8px; object-fit: cover;" alt="${product.name}">
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 15px 20px 15px; text-align: center;">
             <p style="margin: 0; font-weight: 700; font-size: 15px; color: #000; line-height: 1.2;">${product.name}</p>
             <p style="margin: 5px 0 0 0; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Último Drop</p>
          </td>
        </tr>
      </table>
    </td>
  `).join('');

  const mailOptions = {
    from: `"HYGGE RUG" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `¡Tus suelos nos han pedido tu número, ${nickname}!`,
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