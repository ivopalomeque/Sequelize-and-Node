const { Product } = require('./src/modelos/product')
const { Employee } = require('./src/modelos/employee')
const { ProductCategoryView } = require('./src/modelos/productsandcategories')

const { sequelize } = require('./src/conexion/connection')
const { Op } = require('sequelize') //Operadores de sequelize
const express = require('express')
const app = express()
const port = 3001

app.use(express.json())
app.use(async (req,res,next) => {
  try {
    await sequelize.authenticate()
    console.log('Conexión establecida con exito ! =)')
    await Product.sync()
    await Employee.sync()
    next()
  } catch (error) {
    res.status(500).json({error: `Error en el servidor: `,description: error.message})
  } 
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/productosycategorias', async (req, res) => {
  try {
    const products = await Product.findAll(
    )
    products.length > 0 ? res.status(200).json(products)
    : res.status(404).json({error: "No encontramos productos cargados"})
  } catch (error) {
    res.status(500).json({error: `Error en el servidor: `,description: error.message})
  } 
})

//Mostrar productos
app.get('/productos/', async (req, res) => {
  try {
    const products = await Product.findAll(
      {order: [['CategoryID','ASC'],['productName','DESC']]} //Ordenar por nombre y ID
    )
    products.length > 0 ? res.ststus(200).json(products)
    : res.status(404).json({error: 'No encontramos ningun empleado cargado'})
  } catch (error) {
    console.error(500).json({error: `Error en el servidor: `,description: error.message})
  } 
})

//Productos por ID
app.get('/productos/:productID', async (req, res) => {
  try {
    const { productID } = req.params
    const product = await Product.findByPk(productID)
    product ? res.json(product)
    : res.status(404).json({error: "Producto no encontrado"})
  } catch (error) {
    res.status(500).json({error: `Error en el servidor: `,description: error.message})
  } 
})

//Productos por Nombre
app.get('/productos/:productName', async (req, res) => {
  try {
    const {productsName} = req.params
    const products = await Product.findOne({where: {productName}}) //findOne para traer la primer coincidencia
    //Como en este caso productName mantiene el mismo nombre no hace falta aclarar que productName:productName
    product ? res.json(product)
    : res.status(404).json({error: 'Producto no encontrado'}) 
  } catch (error) {
    console.error(500).json({error: `Error en el servidor: `,description: error.message})
  } 
})

//Buscar productos por categoría
app.get('/productos/categoria/:CategoryID', async (req, res) => {
  try {
    const { CategoryID } = req.params
    const products = await Product.findAll({where: {CategoryID}}) //findAll para traer todos los productos
    products ? res.json(products)
    : res.status(404).json({error: "Producto no encontrado"})
  } catch (error) {
    res.status(500).json({error: `Error en el servidor: `,description: error.message})
  } 
})

//Buscar productos por precio mayor a
app.get('/productos/importeMayor/:query', async (req, res) => {
  try {
    const { query } = req.params
    const product = await Product.findAll({
      where: 
        {UnitPrice: { 
          [Op.gt]: query //Filtrar por precio
        }},
      order: [['UnitPrice', 'ASC']] //Ordenar de forma ascendente
    })
    product ? res.json(product)
    : res.status(404).json({error: "Producto no encontrado"})
  } catch (error) {
    res.status(500).json({error: `Error en el servidor: `,description: error.message})
  } 
})

//Buscar productos por consulta
app.get('/productos/:campo/:valor', async (req, res) => {
  try {
    const { campo, valor } = req.params
    const query = {[campo]: valor}
    const product = await Product.findOne({where: {query}})
    product ? res.json(product)
    : res.status(404).json({error: "Producto no encontrado"})
  } catch (error) {
    res.status(500).json({error: `Error en el servidor: `,description: error.message})
  } 
})

//Mostrar empleados
app.get('/empleados', async (req, res) => {
  try {
    const employees = await Employee.findAll()
    employees.length > 0 ? res.status(200).json(employees)
    : res.status(404).json({error: "No encontramos empleados cargados"})
  } catch (error) {
    res.status(500).json({error: `Error en el servidor: `,description: error.message})
  } 
})


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})