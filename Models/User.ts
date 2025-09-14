import mongoose, { Document, model, models } from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, select: false},
  image: {type: String},
  //whenever we are protecting a route, we will check the role
  role: {type: String, default: "user"},

  //google & github providers -> when we are using third party providers
  authProviderId: {type: String},
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);