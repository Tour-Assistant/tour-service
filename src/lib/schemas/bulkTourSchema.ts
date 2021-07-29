import { tourSchema } from "./tourSchema";

const bulkTourSchema = {
  type: "object",
  properties: {
    body: {
      type: "array",
      items: tourSchema,
    },
  },
  required: ["body"],
};

export { bulkTourSchema };

export default bulkTourSchema;
