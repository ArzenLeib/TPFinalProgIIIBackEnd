import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  nickname: { type: String, required: true },
  direccion: { type: String, required: true },
  habilitado: { type: Boolean, default: true }
});

export const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;