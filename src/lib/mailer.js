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
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        body { margin: 0; padding: 0; background-color: #FAFAFA; font-family: 'Outfit', sans-serif; color: ${brand.text}; }
        .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: ${brand.white}; border: 1px solid #EEE; }
        
        /* LOGO LABEL STYLE */
        .header { padding: 40px; text-align: center; }
        .logo-label {
          display: inline-block;
          background-color: ${brand.pink};
          padding: 0 8px 8px 0;
          border-radius: 12px;
        }
        .logo-inner {
          background-color: #FFF;
          padding: 15px 30px;
          border-radius: 10px;
          border: 2px dashed #DDD;
          margin-top: -4px;
          margin-left: -4px;
        }
        .logo-main { font-weight: 900; font-size: 32px; letter-spacing: 1px; color: #000; margin: 0; line-height: 1; }
        .logo-sub { font-weight: 700; font-size: 14px; letter-spacing: 6px; color: ${brand.pink}; margin-top: 5px; border-top: 2px solid #000; padding-top: 4px; }

        .hero { padding: 0 40px 40px 40px; text-align: center; }
        .h1 { font-size: 32px; font-weight: 900; line-height: 1.2; margin: 0; }
        .p { font-size: 16px; line-height: 1.6; color: ${brand.textDim}; }

        .product-box { padding: 30px 20px 40px 20px; background-color: #FCFCFC; border-top: 1px solid #F5F5F5; border-bottom: 1px solid #F5F5F5; }
        
        .btn-pink { background-color: ${brand.pink}; color: #FFF !important; padding: 15px 30px; text-decoration: none; font-weight: 700; border-radius: 4px; display: inline-block; text-transform: uppercase; letter-spacing: 1px; }
        .btn-outline { border: 2px solid #000; color: #000 !important; padding: 12px 25px; text-decoration: none; font-weight: 700; border-radius: 4px; display: inline-block; font-size: 13px; }

        .social-link { text-decoration: none; color: #000; font-weight: 700; font-size: 13px; margin: 0 10px; }
        .icon-small { width: 16px; height: 16px; vertical-align: middle; margin-right: 5px; }

        .footer { padding: 50px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #EEE; }
      </style>
    </head>
    <body>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 20px 0;">
        <tr>
          <td align="center">
            <table class="wrapper" border="0" cellspacing="0" cellpadding="0">
              
              <!-- LOGO -->
              <tr>
                <td class="header">
                  <div class="logo-label">
                    <div class="logo-inner">
                      <div class="logo-main">HYGGE</div>
                      <div class="logo-sub">RUG</div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- HERO -->
              <tr>
                <td class="hero">
                  <h1 class="h1">¡Tus pies están a punto de dar un salto de alegría!</h1>
                  <div style="height: 20px;"></div>
                  <p class="p">
                    Hola <strong>${nickname}</strong>, bienvenido a la familia Hygge Rug. Somos artesanos en Madrid con una misión clara: que tus suelos dejen de ser aburridos y empiecen a tener <strong>actitud</strong>.
                  </p>
                </td>
              </tr>

              <!-- SHOP PREVIEW -->
              <tr>
                <td class="product-box">
                  <p style="text-align: center; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; font-size: 12px; margin-bottom: 25px; color: ${brand.pink};">Últimas piezas del catálogo</p>
                  
                  <!-- GRILLA DE PRODUCTOS -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      ${productsHtml}
                    </tr>
                  </table>

                  <div style="text-align: center; padding-top: 25px;">
                    <a href="${brand.url}/tienda" class="btn-pink">Ver catálogo completo</a>
                  </div>
                </td>
              </tr>

              <!-- PANEL SECTION -->
              <tr>
                <td style="padding: 50px 40px; text-align: center; border-bottom: 1px solid #EEE;">
                  <h3 style="margin: 0; font-size: 20px; font-weight: 900;">Toma las riendas</h3>
                  <p class="p" style="margin-top: 10px;">
                    Accede a tu panel personal para seguir tus pedidos activos.
                  </p>
                  <div style="height: 25px;"></div>
                  <a href="${brand.url}/dashboard" class="btn-outline">ADMINISTRAR PERFIL</a>
                </td>
              </tr>

              <!-- SOCIAL SECTION -->
              <tr>
                <td align="center" style="padding: 40px 0;">
                   <a href="https://instagram.com/hygge_rug" class="social-link">
                     <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> INSTAGRAM
                   </a>
                   <a href="https://www.tiktok.com/@hygge_rug" class="social-link">
                     <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg> TIKTOK
                   </a>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td class="footer">
                  <p style="margin: 0; font-weight: 900; color: #000; letter-spacing: 5px; text-transform: uppercase;">HYGGE RUG</p>
                  <p style="margin: 10px 0 0 0;">Madrid, España • Handmade with Attitude.</p>
                  <div style="margin-top: 30px; opacity: 0.5;">
                    Recibiste este correo porque te has registrado en <a href="${brand.url}" style="color: #666;">hyggerug.app</a>. <br>
                    Si deseas dejar de recibir estas noticias, gestiona tus preferencias en el panel de usuario.
                  </div>
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