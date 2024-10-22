import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import Cliente from './modelos/cliente.js';

const app = express();

app.use(cors())

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-UserId, X-Nonce' +
    ', X-Secret, X-Ts, X-Sig, X-Vendor-Sig, X-Vendor-Apikey, X-Vendor-Nonce, X-Vendor-Ts, X-ProfileId' +
    ', X-Authorization, Authorization, Token, Pragma, Cache-Control, Expires');
  res.header('Access-Control-Allow-Methods', 'HEAD,OPTIONS,GET,PUT,POST,DELETE');
  next();
});

app.use(express.json())

dotenv.config()


// Agarrar clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error });
  }
});

// Agarrar un cliente
app.get('/api/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error });
  }
});

// Actualización del estado del cliente
app.put('/api/cliente/estado/:id', (req, res) => {
  const id = req.params.id;
  const { habilitado } = req.body;

  Cliente.findByIdAndUpdate(id, { habilitado }, { new: true })
    .then(cliente => res.json(cliente))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Crear cliente
app.post('/api/clientes', async (req, res) => {
  try {
    const { nombre, email, telefono, fechaNacimiento, nickname, direccion } = req.body;
    const nuevoCliente = new Cliente({ nombre, email, telefono, fechaNacimiento, nickname, direccion });
    await nuevoCliente.save();
    res.status(201).json({ message: 'Cliente agregado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el cliente', error: error.message });
  }
});

// Editar Cliente
app.put('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, fechaNacimiento, nickname, direccion } = req.body;

  try {
    const clienteActualizado = await Cliente.findByIdAndUpdate(
      id,
      { nombre, email, telefono, fechaNacimiento, nickname, direccion },
      { new: true, runValidators: true }
    );

    if (!clienteActualizado) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.status(200).json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al editar el cliente', error: error.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT;

mongoose.connect(process.env.DB_CONNECTION)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error(err));


app.listen(process.env.PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${process.env.PORT}`);
});
