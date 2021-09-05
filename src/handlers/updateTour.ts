import { APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import validator from "@middy/validator";
import createError from "http-errors";

import commonMiddleware from "src/lib/commonMiddleware";
import { createTourSchema } from "src/lib/schemas/createTourSchema";
import { MiddyRequest } from "src/types/middy";
import { formatTourData } from "src/lib/formatTourData";

const dynamodb = new DocumentClient();

async function updateTour(event: MiddyRequest): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters;
  const { title, startAt, reference, metaData } = event.body;

  const tour = formatTourData({ title, startAt, reference, metaData });

  try {
    const params = {
      TableName: process.env.TOUR_SERVICE_TABLE_NAME,
      Key: { id },
      ExpressionAttributeNames: {
        "#r": "reference",
      },
      UpdateExpression:
        "SET title = :title, startAt = :startAt, #r = :r, metaData = :metaData",
      ExpressionAttributeValues: {
        ":title": title,
        ":startAt": startAt,
        ":r": reference,
        ":metaData": metaData,
      },
      ReturnValues: "ALL_NEW",
    };
    await dynamodb.update(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ tour }),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(updateTour).use(
  validator({
    inputSchema: createTourSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  })
);
