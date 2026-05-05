const getResetPassword = (link) => {
  return `
  <div style="
    margin:0;
    padding:50px 20px;
    background:#efefef;
    font-family:Arial, Helvetica, sans-serif;
    color:#111111;
  ">
    <div style="
      max-width:620px;
      margin:0 auto;
      background:#ffffff;
      border-radius:28px;
      overflow:hidden;
      box-shadow:0 18px 50px rgba(0,0,0,0.08);
    ">

      <!-- HEADER -->
      <div style="
        background:#000000;
        padding:38px 30px 34px;
        text-align:center;
      ">
        <img 
          src="https://dripstore.mx/cdn/shop/files/Drip_Favicon_D_f638d01f-9339-44df-8146-dacfcb283621.webp?v=1742008533"
          alt="DROPP"
          style="
            width:52px;
            height:52px;
            object-fit:contain;
            margin-bottom:14px;
            filter:brightness(0) invert(1);
          "
        />

        <h1 style="
          margin:0;
          color:#ffffff;
          font-size:30px;
          letter-spacing:10px;
          font-weight:800;
        ">
          DROPP
        </h1>

        <p style="
          margin:10px 0 0;
          color:#888;
          font-size:11px;
          letter-spacing:3px;
          text-transform:uppercase;
        ">
          Centro de Seguridad de Cuenta
        </p>
      </div>

      <!-- BODY -->
      <div style="
        padding:55px 48px 50px;
        text-align:center;
      ">

        <p style="
          margin:0;
          font-size:11px;
          letter-spacing:4px;
          color:#9a9a9a;
          text-transform:uppercase;
        ">
          Recuperacion Segura
        </p>

        <h2 style="
          margin:18px 0 18px;
          font-size:34px;
          line-height:1.2;
          font-weight:800;
          color:#111;
        ">
          Restablece tu contraseña
        </h2>

        <p style="
          margin:0 auto 34px;
          max-width:430px;
          font-size:14px;
          line-height:1.9;
          color:#666666;
        ">
          Recibimos una solicitud para restablecer el acceso a tu cuenta.
          Utiliza el siguiente botón para continuar con el proceso de forma segura y establecer una nueva contraseña.
        </p>

        <a href="${link}" style="
          display:inline-block;
          background:#000;
          color:#fff;
          text-decoration:none;
          padding:17px 42px;
          border-radius:16px;
          font-size:13px;
          font-weight:700;
          letter-spacing:1.5px;
        ">
          RESTABLECER ACCESO
        </a>

        <div style="
          margin:38px auto 0;
          max-width:430px;
          background:#fafafa;
          border:1px solid #efefef;
          border-radius:18px;
          padding:18px 20px;
        ">
          <p style="
            margin:0;
            font-size:12px;
            color:#777;
            line-height:1.8;
          ">
            Este enlace protegido expirará automáticamente en <strong>15 minutos</strong>
            por motivos de seguridad.
          </p>
        </div>

        <p style="
          margin:28px 0 0;
          font-size:12px;
          color:#a0a0a0;
          line-height:1.8;
        ">
          Si no reconoces esta solicitud, puedes ignorar este mensaje.
          No se realizará ningún cambio sin tu confirmación.
        </p>

        <div style="
          margin-top:38px;
          padding-top:28px;
          border-top:1px solid #eeeeee;
        ">
          <p style="
            margin:0 0 10px;
            font-size:11px;
            color:#b5b5b5;
            letter-spacing:1px;
            text-transform:uppercase;
          ">
            Enlace
          </p>

          <p style="
            margin:0;
            font-size:11px;
            color:#bdbdbd;
            line-height:1.7;
            word-break:break-all;
          ">
            ${link}
          </p>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="
        background:#fafafa;
        padding:22px;
        text-align:center;
        border-top:1px solid #f0f0f0;
      ">
        <p style="
          margin:0;
          font-size:10px;
          color:#b0b0b0;
          letter-spacing:2px;
          text-transform:uppercase;
        ">
          © 2026 DROPP — Todos los derechos reservados
        </p>
      </div>
    </div>
  </div>
  `;
};

//--------------------------------------------------------------//

const getVerifyAccount = (link, nombre) => {
  return `
  <div style="margin:0;padding:50px 20px;background:#efefef;font-family:Arial,sans-serif;color:#111;">
    <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,0.08);">

      <div style="background:#000;padding:38px 30px;text-align:center;">
        <img 
          src="https://dripstore.mx/cdn/shop/files/Drip_Favicon_D_f638d01f-9339-44df-8146-dacfcb283621.webp?v=1742008533"
          style="width:52px;height:52px;object-fit:contain;margin-bottom:14px;filter:brightness(0) invert(1);"
        />
        <h1 style="margin:0;color:#fff;font-size:30px;letter-spacing:10px;font-weight:800;">DROPP</h1>
        <p style="margin:10px 0 0;color:#888;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
          Centro de verificación
        </p>
      </div>

      <div style="padding:55px 48px;text-align:center;">
        <p style="margin:0;font-size:11px;letter-spacing:4px;color:#9a9a9a;text-transform:uppercase;">
          Activación de cuenta
        </p>

        <h2 style="margin:18px 0;font-size:34px;font-weight:800;color:#111;">
          Bienvenido ${nombre}
        </h2>

        <p style="margin:0 auto 34px;max-width:430px;font-size:14px;line-height:1.9;color:#666;">
          Ya casi terminas tu registro. Confirma tu correo electrónico para activar tu cuenta y acceder a la experiencia completa de DROPP.
        </p>

        <a href="${link}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:17px 42px;border-radius:16px;font-size:13px;font-weight:700;letter-spacing:1.5px;">
          ACTIVAR MI CUENTA
        </a>

        <p style="margin:30px 0 0;font-size:12px;color:#999;">
          Este enlace expirará en 30 minutos.
        </p>
      </div>

      <div style="background:#fafafa;padding:22px;text-align:center;border-top:1px solid #f0f0f0;">
        <p style="margin:0;font-size:10px;color:#b0b0b0;letter-spacing:2px;text-transform:uppercase;">
          © 2026 DROPP
        </p>
      </div>
    </div>
  </div>
  `;
};

module.exports = {
  getResetPassword,
  getVerifyAccount,
};


