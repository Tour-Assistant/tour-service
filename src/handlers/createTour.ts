import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuid } from "uuid";
import validator from "@middy/validator";

import commonMiddleware from "src/lib/commonMiddleware";
import { CreateTourPostRequest, Tour } from "../types/tour";
import { createTourSchema } from "src/lib/schemas/createTourSchema";

async function createTour(
  event: CreateTourPostRequest,
  context: Context
): Promise<APIGatewayProxyResult> {
  const { title, startAt } = event.body;
  // eslint-disable-line
  console.log(event.body);
  const now = new Date();

  const tour: Tour = {
    id: uuid(),
    title,
    eventStatus: "UPCOMING",
    createdAt: now.toISOString(),
    startAt,
  };

  // // eslint-disable-line
  // console.log(tour);

  return {
    statusCode: 201,
    body: JSON.stringify(tour),
  };
}

export const handler = commonMiddleware(createTour).use(
  validator({
    inputSchema: createTourSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  })
);
