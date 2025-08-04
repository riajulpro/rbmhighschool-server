import { Schema, model, models } from "mongoose";

const vacationSchema = new Schema(
  {
    date: { type: String, required: true },
    day: { type: String, required: true },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

const Vacation = models.Vacation || model("Vacation", vacationSchema);
export default Vacation;
