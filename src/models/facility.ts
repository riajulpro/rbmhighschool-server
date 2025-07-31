import { Schema, model, models } from "mongoose";

const facilitySchema = new Schema(
  {
    serial: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: String, default: "" },
  },
  { timestamps: true }
);

const Facility = models.Facility || model("Facility", facilitySchema);
export default Facility;
