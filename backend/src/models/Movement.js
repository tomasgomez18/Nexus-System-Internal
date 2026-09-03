import mongoose from 'mongoose'

const movementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['ingreso', 'egreso'],
      required: true,
    },
    concept: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    category: { type: String, required: true },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
  },
  { timestamps: true }
)

const Movement = mongoose.model('Movement', movementSchema)

export default Movement