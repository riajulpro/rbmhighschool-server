import { Schema, model, models } from "mongoose";

const vacancySchema = new Schema(
  {
    serial: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: String, default: "" },
  },
  { timestamps: true }
);

const Vacancy = models.Vacancy || model("Vacancy", vacancySchema);
export default Vacancy;
