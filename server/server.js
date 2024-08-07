// Importamos el archivo con las variables de entorno
require("dotenv").config();

require("./middlewares/deleteoldlist.js");

const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares básicos
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// para errores de CORS
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:8080/*",
			"http://127.21.0.2:3000",
		], // dominio del cliente URL o IP
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
		optionsSuccessStatus: 204,
		allowedHeaders: "Content-Type, Authorization",
	})
);

// Servir archivos estáticos desde la carpeta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Si queremos que tenga un prefijo /api o algo así
app.use(require("./routes/routes.js"));

// Conectar o crear la base de datos especificada
mongoose.connect(process.env.LOCAL_MONGO_URL);

const db = mongoose.connection;

db.on("error", (err) => console.log("Connection to database failed:", err));
db.once("open", () => console.log("Connection to database successfully"));

// Middleware para servir el cliente React
app.use(express.static(path.join(__dirname, "build")));

// Servir el archivo index.html para cualquier otra ruta
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT, () => {
	console.log(`Example app listening at port: ${process.env.PORT}`);
});
