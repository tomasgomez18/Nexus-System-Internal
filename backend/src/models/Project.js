import mongoose from 'mongoose'

const accountSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['MongoDB', 'Cloudinary', 'Dominio', 'Otro'],
    default: 'Otro',
  },
  email: { type: String, trim: true },
  password: { type: String },
  urlDomain: { type: String, trim: true },
  domainSource: { type: String, trim: true },
})

const projectSchema = new mongoose.Schema(
  {
    client: { type: String, required: true, trim: true },
    projectType: { type: String, required: true, trim: true },
    finalPrice: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    paymentMethod: {
      type: String,
      enum: ['Efectivo', 'Transferencia', 'Tarjeta', 'Cripto', 'Otro'],
      default: 'Efectivo',
    },
    initialPayment: { type: Number, default: 0, min: 0 },
    finalPayment: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['pendiente', 'en-progreso', 'finalizado'],
      default: 'pendiente',
    },
    finalizedIncomeCreated: { type: Boolean, default: false },
    accounts: [accountSchema],
  },
  { timestamps: true }
)

const Project = mongoose.model('Project', projectSchema)

export default Project