// Creating user Schema and corresponding model.

const mongoose = require("mongoose");
const uniquieValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  // Connecting Schemas and Models with Ref property.
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

userSchema.plugin(uniquieValidator);

module.exports = mongoose.model("User", userSchema);
