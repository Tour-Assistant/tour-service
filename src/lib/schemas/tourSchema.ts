export const tourSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
    },
    reference: {
      type: "string",
    },
    eventStatus: {
      type: "string",
    },
    startAt: {
      type: "string",
    },
    createdAt: {
      type: "string",
    },
    // hostedBy: {
    //   type: "string",
    // },
    // places: {
    //   type: "string",
    // },
    // budget: {
    //   type: "string",
    // },
    // details: {
    //   type: "string",
    // },
    metaData: {
      type: "object",
      properties: {
        hostedBy: {
          type: "string",
        },
        budget: {
          type: "string",
        },
      },
      required: [],
    },
  },
  required: ["title", "reference", "startAt"],
};
