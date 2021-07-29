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
import { Tour } from "../types/tour";
import { MiddyRequest } from "src/types/middy";
import bulkTourSchema from "src/lib/schemas/bulkTourSchema";
import { formatTourData } from "src/lib/formatTourData";

const dynamodb = new DocumentClient();

async function bulkTourInsert(
  event: MiddyRequest
): Promise<APIGatewayProxyResult> {
  const tourDataList = event.body;
  const tourList = event.body.map;
  try {
    // const params = {
    //   TableName: process.env.TOUR_SERVICE_TABLE_NAME,
    //   Item: tour,
    // };
    // await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ body: event.body }),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(bulkTourInsert).use(
  validator({
    inputSchema: bulkTourSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  })
);
