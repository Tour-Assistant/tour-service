import { tourSchema } from "./tourSchema";

const createTourSchema = {
  type: "object",
  properties: {
    body: tourSchema,
  },
  required: ["body"],
};

export { createTourSchema };

export default createTourSchema;
