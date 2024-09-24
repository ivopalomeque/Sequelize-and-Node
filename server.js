const { Product } = require('./src/modelos/product')
const { Employee } = require('./src/modelos/employee')
const { sequelize } = require('./src/conexion/connection')
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/productos', async (req, res) => {
  try {
    await sequelize.authenticate()
    console.log('Conexión establecida con exito ! =)')
    await Product.sync()
    const products = await Product.findAll()
    const productsData = products.map((p) => p.dataValues)
    // console.table(productsData)
    res.status(200).json(productsData)
  } catch (error) {
    console.error('No me pude conectar porque sucedió: ', error)
  } 
})

app.get('/empleados', async (req, res) => {
  try {
    await sequelize.authenticate()
    console.log('Conexión establecida con exito ! =)')
    await Employee.sync()
    const Employees = await Employee.findAll()
    const EmployeesData = Employees.map((p) => p.dataValues)
    // console.table(EmployeesData)
    res.status(200).json(EmployeesData)
  } catch (error) {
    console.error('No me pude conectar porque sucedió: ', error)
  } 
})


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})