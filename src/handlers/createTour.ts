import { APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import validator from "@middy/validator";
import createError from "http-errors";

import commonMiddleware from "src/lib/commonMiddleware";
import { createTourSchema } from "src/lib/schemas/createTourSchema";
import { MiddyRequest } from "src/types/middy";
import { formatTourData } from "src/lib/formatTourData";

const dynamodb = new DocumentClient();

async function createTour(event: MiddyRequest): Promise<APIGatewayProxyResult> {
  const { title, startAt, reference, metaData } = event.body;

  const tour = formatTourData({ title, startAt, reference, metaData });

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
