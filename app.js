const express = require("express");
const app = express();

app.use(express.json());

const productos = [
  {
    id: 1,
    nombre: "Teclado inalambrico",
    descripcion: "Teclado 101 teclas idioma ingles",
    precio: 1500.0,
  },
  {
    id: 2,
    nombre: "Mouse inalambrico",
    descripcion: "Mouse optico inalambrico.",
    precio: 600.0,
  },
  {
    id: 3,
    nombre: "Monitor 23.5 pulgadas full hd",
    descripcion: "Monitor Full HD panel IPS",
    precio: 6500.0,
  },
];

// GET - Listar todos los productos
app.get("/productos", (req, res) => {
  res.json(productos);
});

// GET - Obtener un producto por id
app.get("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  res.json(producto);
});

// ============================================================
// PRÁCTICA 6: Completa los siguientes métodos de la API
// ============================================================

// TODO: POST /productos - Crear nuevo producto
app.post("/productos", (req, res) => {
  //Lo que usar
  const { nombre, descripcion, precio } = req.body;
  const newId =
    productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
  const newPrice = parseFloat(precio);
  const newProducto = { id: newId, nombre, descripcion, precio: newPrice };

  //validaciones de los campos
  if (camposVacios(newProducto)) {
    return res
      .status(400)
      .json({ mensaje: "TODOS LOS CAMPOS DEBEN ESTAR COMPLETOS" });
  }

  //que el valor del producto sera mayor a 0 y un numero flotanto
  if (isNaN(newPrice) || newPrice <= 0) {
    return res
      .status(400)
      .json({ mensaje: "El precio debe ser un número mayor a 0" });
  }

  productos.push(newProducto);
  res.status(201).json(newProducto);
});

// TODO: PUT /productos/:id - Actualizar producto
app.put("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, descripcion, precio } = req.body || {};
  const newPrice = parseFloat(precio);
  const productoUpdate = { id, nombre, descripcion, precio: newPrice };

  //indice para encontrar/validar el id
  const index = productos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  //validacion de los campos  (queda un poco explicito la verdad, creo que se sobre entiende esto)
  if (camposVacios(productoUpdate)) {
    return res
      .status(400)
      .json({ mensaje: "TODOS LOS CAMPOS DEBEN ESTAR COMPLETOS" });
  }

  //lo mimos que el post, que el precio sea valido y mayor a 0
  if (isNaN(newPrice) || newPrice <= 0) {
    return res
      .status(400)
      .json({ mensaje: "El precio debe ser un número mayor a 0" });
  }

  productos[index] = productoUpdate;
  res.json(productoUpdate);
});

// TODO: DELETE /productos/:id - Eliminar producto

app.delete("/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: "producto no encontrado" });
  }

  const eliminado = productos.splice(index, 1)[0];
  res.json({
    mensaje: "Producto eliminado",
    producto: eliminado,
  });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

///funciones extras
//Esta fincion sirver para comoprobar quq no hayan campos vacios en los objetos, ya sean nulos o inderfinidos y para validar los campos
function camposVacios(obj) {
  //valoramnso que no tenga campos vacios, nulos o indefinidos
  if (
    obj === null ||
    obj === undefined ||
    (typeof obj === "string" && obj.trim() === "")
  ) {
    return true;
  }

  // hacemos una callbackc que comprueba el arreglo de objetos y revisa si tiene algun campo vacio y eso
  if (Array.isArray(obj)) {
    return obj.length === 0 || obj.some((i) => camposVacios(i));
  }

  //lo mismoq ue arriba pero para los objetos json
  if (typeof obj === "object") {
    const valores = Object.values(obj);
    return valores.length === 0 || valores.some((v) => camposVacios(v));
  }

  return false;
}
