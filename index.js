const express = require('express');
const {z} = require("zod");
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const UserBackSchema=z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  edad: z.number().int("Debe ser entero").min(16, "Edad mínima 16").max(60, "Edad máxima 60"),
  isAdmin: z.boolean()  
});

function formatZodErrors(error) {
  if (!error || !error.issues) return ["Error desconocido"]
  return error.issues.map((issue) => {
    const path = issue.path.length ? issue.path.join(".") : "root"
    return `${path}: ${issue.message}`
  })
}

app.get('/', (req, res) => {
  res.json({mensaje: 'API Funcionando' });
});

app.post('/back', (req, res) => {
  const result = UserBackSchema.safeParse(req.body);
  if (result.success) {
    res.json({ ok: true, data: result.data });
  } else {
    res.status(400).json({ ok: false, errores: formatZodErrors(result.error) });
  }
});

app.listen(port, () => {
  console.log(`App escuchando desde http://localhost:${port}`);
});
