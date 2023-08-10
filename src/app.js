const express = require("express");
const mongoose = require('mongoose');
const { auth } = require("express-oauth2-jwt-bearer");
const errorHandler = require("./middlewares/errorHandler");


require('dotenv').config();

// Configuracion Middleware con el Servidor de Autorización 
const autenticacion = auth({
  audience: process.env.OAUTH_AUDIENCE,
  issuerBaseURL: process.env.OAUTH_URL,
  tokenSigningAlg: "RS256",
});

mongoose.connect(process.env.MONGO_DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});


const app = express();
app.use(express.json());

// Importamos el Router de Libros
const librosRouter = require("./routes/librosRoutes");
//Importamos el Router de Usuarios
const usuarioRouter = require("./routes/usuarioRoutes");

//Configuramos el middleware de autenticacion
app.use("/api/libros", autenticacion,  librosRouter);
app.use("/api/usuario", autenticacion, usuarioRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});

module.exports = app;