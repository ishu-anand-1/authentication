const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,      // ✅ This already creates index
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
      // ❌ removed index: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false // 🔐 never return password
    }
  },
  {
    timestamps: true
  }
)

//
// 🔐 HASH PASSWORD
//
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

  next()
})

//
// 🔑 COMPARE PASSWORD
//
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

//
// 🧹 CLEAN RESPONSE
//
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password
    delete ret.__v
    return ret
  }
})

module.exports = mongoose.model("User", userSchema)