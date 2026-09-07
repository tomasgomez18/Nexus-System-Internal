import mongoose from 'mongoose'

const personalAccountSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

const PersonalAccount = mongoose.model('PersonalAccount', personalAccountSchema)

export default PersonalAccount