import {
  // Context,
  // APIGatewayEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from "uuid";
import validator from "@middy/validator";
import createError from "http-errors";

import commonMiddleware from "src/lib/commonMiddleware";
import { CreateTourPostRequest, Tour } from "../types/tour";
import { createTourSchema } from "src/lib/schemas/createTourSchema";

const dynamodb = new DocumentClient();

async function createTour(
  event: CreateTourPostRequest
): Promise<APIGatewayProxyResult> {
  const { title, startAt } = event.body;
  const now = new Date();

  const tour: Tour = {
    id: uuid(),
    title,
    eventStatus: "UPCOMING",
    createdAt: now.toISOString(),
    startAt,
  };

  try {
    const params = {
      TableName: process.env.TOUR_SERVICE_TABLE_NAME,
      Item: tour,
    };
    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ tour }),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
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
