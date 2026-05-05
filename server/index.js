//taskkill /F /IM node.exe
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "clave_super_segura";

const app = express();

const { getResetPassword, getVerifyAccount } = require("./email");

app.use(cors());
app.use(express.json());

app.get("/test-auth", (req, res) => {
  res.send("AUTH OK");
});

app.get("/auth/google", (req, res) => {
  res.redirect("https://accounts.google.com/");
});

app.post("/auth/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email requerido" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const user = results[0];

      const token = crypto.randomBytes(32).toString("hex");

      db.query(
        "UPDATE usuarios SET reset_token = ?, reset_expires = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE id = ?",
        [token, user.id]
      );

      const link = `http://localhost:3000/reset-password/${token}`;

      const html = getResetPassword(link);

      try {
        await transporter.sendMail({
          from: '"DROPP Security" <villaltavillanuevajcm@gmail.com>',
          to: email,
          subject: "Recuperar contraseña",
          html,
        });

        res.json({ ok: true });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error enviando correo" });
      }
    }
  );
});

app.get("/auth/verify-reset-token/:token", (req, res) => {
  const { token } = req.params;

  db.query(
    "SELECT id FROM usuarios WHERE reset_token = ? AND reset_expires > NOW()",
    [token],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ error: "Token inválido o expirado" });
      }

      res.json({ ok: true });
    }
  );
});

app.post("/auth/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  db.query(
    "SELECT * FROM usuarios WHERE reset_token = ? AND reset_expires > NOW()",
    [token],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ error: "Token inválido o expirado" });
      }

      const user = results[0];

      const hash = await bcrypt.hash(password, 10);

      db.query(
        "UPDATE usuarios SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
        [hash, user.id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Error actualizando contraseña" });
          }

          res.json({ ok: true });
        }
      );
    }
  );
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "Drip",
});

db.connect((err) => {
  if (err) {
    console.error("Error MySQL:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

app.post("/auth/register", async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Campos incompletos" });
  }

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, found) => {
    if (err) {
      return res.status(500).json({ error: "Error servidor" });
    }

    try {
      const hash = await bcrypt.hash(password, 10);
      const verifyToken = crypto.randomBytes(32).toString("hex");

      if (found.length > 0) {
        const existingUser = found[0];

        if (existingUser.is_verified === 1) {
          return res.status(400).json({ error: "Email ya registrado" });
        }

        db.query(
          `UPDATE usuarios 
           SET nombre = ?, password = ?, verify_token = ?, verify_expires = DATE_ADD(NOW(), INTERVAL 30 MINUTE)
           WHERE id = ?`,
          [nombre, hash, verifyToken, existingUser.id],
          async (err) => {
            if (err) {
              return res.status(500).json({ error: "Error actualizando registro" });
            }

            const link = `http://localhost:5001/auth/verify-account/${verifyToken}`;
            const html = getVerifyAccount(link, nombre);

            try {
              await transporter.sendMail({
                from: '"DROPP Security" <villaltavillanuevajcm@gmail.com>',
                to: email,
                subject: "Activa tu cuenta DROPP",
                html,
              });

              return res.json({ ok: true, verify: true });
            } catch {
              return res.status(500).json({ error: "No se pudo enviar verificación" });
            }
          }
        );

        return;
      }

      db.query(
        `INSERT INTO usuarios (nombre, email, password, verify_token, verify_expires, is_verified)
         VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE), 0)`,
        [nombre, email, hash, verifyToken],
        async (err) => {
          if (err) {
            return res.status(500).json({ error: "Error creando cuenta" });
          }

          const link = `http://localhost:5001/auth/verify-account/${verifyToken}`;
          const html = getVerifyAccount(link, nombre);

          try {
            await transporter.sendMail({
              from: '"DROPP Security" <villaltavillanuevajcm@gmail.com>',
              to: email,
              subject: "Activa tu cuenta DROPP",
              html,
            });

            res.json({ ok: true, verify: true });
          } catch {
            res.status(500).json({ error: "No se pudo enviar verificación" });
          }
        }
      );
    } catch {
      res.status(500).json({ error: "Error servidor" });
    }
  });
});

app.get("/auth/verify-account/:token", (req, res) => {
  const { token } = req.params;

  db.query(
    "SELECT * FROM usuarios WHERE verify_token = ? AND verify_expires > NOW()",
    [token],
    (err, results) => {
      if (err || results.length === 0) {
        return res.redirect("http://localhost:3000/verify-expired");
      }

      const user = results[0];

      db.query(
        "UPDATE usuarios SET is_verified = 1, verify_token = NULL, verify_expires = NULL WHERE id = ?",
        [user.id],
        () => {
          res.redirect("http://localhost:3000/account-verified");
        }
      );
    }
  );
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const user = results[0];

      if (user.is_verified === 0) {
        return res.status(403).json({ error: "Debes verificar tu correo antes de ingresar" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, nombre: user.nombre },
        SECRET
      );

      res.json({ token, nombre: user.nombre, email: user.email });
    }
  );
});

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

app.get("/productos", (req, res) => {
  const query = `
    SELECT 
      p.*,
      GROUP_CONCAT(DISTINCT t.nombre) AS tallas
    FROM productos p
    LEFT JOIN producto_talla pt ON p.id = pt.producto_id
    LEFT JOIN tallas t ON pt.talla_id = t.id
    GROUP BY p.id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);

    const formatted = results.map(p => {
      let tallas = p.tallas ? p.tallas.split(",") : [];

      if (p.categoria === "zapatillas") {
        tallas = tallas.filter(t => ["40","41","42","43","44"].includes(t));
      } else if (p.categoria === "ropa") {
        tallas = tallas.filter(t => ["S","M","L","XL"].includes(t));
      } else {
        tallas = [];
      }

      return { ...p, tallas };
    });

    res.json(formatted);
  });
});

app.get("/productos/:id", (req, res) => {
  console.log("RUTA ID FUNCIONANDO");
  const { id } = req.params;

  const query = `
    SELECT 
      p.*,
      GROUP_CONCAT(DISTINCT t.nombre) AS tallas
    FROM productos p
    LEFT JOIN producto_talla pt ON p.id = pt.producto_id
    LEFT JOIN tallas t ON pt.talla_id = t.id
    WHERE p.id = ?
    GROUP BY p.id
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    let p = results[0];

    let tallas = p.tallas ? p.tallas.split(",") : [];

    if (p.categoria === "zapatillas") {
      tallas = tallas.filter(t => ["40","41","42","43","44"].includes(t));
    } else if (p.categoria === "ropa") {
      tallas = tallas.filter(t => ["S","M","L","XL"].includes(t));
    } else {
      tallas = [];
    }

    res.json({ ...p, tallas });
  });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "villaltavillanuevajcm@gmail.com",
    pass: "eqlv zfbs yyia cdde",
  },
});

app.post("/crear-orden", async (req, res) => {
  const { carrito, correo } = req.body;

  if (!carrito || carrito.length === 0) {
    return res.status(400).json({ error: "Carrito vacío" });
  }

  const total = carrito.reduce(
    (acc, p) => acc + Number(p.precio) * Number(p.cantidad),
    0
  );

  const ordenId = Date.now();

  console.log("Orden creada:", ordenId);

  const productosHTML = carrito.map(p => `
    <li>
      ${p.nombre} x${p.cantidad} ${p.size ? `(Talla ${p.size})` : ""}
      - S/ ${(p.precio * p.cantidad).toFixed(2)}
    </li>
  `).join("");

  const html = `
    <h2>Gracias por tu compra</h2>
    <p>Orden #${ordenId}</p>
    <ul>${productosHTML}</ul>
    <h3>Total: S/ ${total.toFixed(2)}</h3>
  `;

  try {
    await transporter.sendMail({
      from: '"DROPP Orders" <villaltavillanuevajcm@gmail.com>',
      to: correo,
      subject: "Confirmación de compra",
      html,
    });

    console.log("Correo enviado");
  } catch (err) {
    console.error("Error enviando correo:", err);
  }

  res.json({
    ok: true,
    ordenId,
    total,
  });
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(` Backend corriendo en http://localhost:${PORT}`);
});