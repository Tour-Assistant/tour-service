import { APIGatewayProxyResult } from "aws-lambda";
import validator from "@middy/validator";
import createError from "http-errors";

import commonMiddleware from "src/lib/commonMiddleware";
import { createTourSchema } from "src/lib/schemas/createTourSchema";
import { MiddyRequest } from "src/types/middy";
import { formatTourData } from "src/lib/formatTourData";
import { dynamodb, TableName } from "src/lib/dbClient";

export async function updateTour(
  event: MiddyRequest
): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters;
  const { title, startAt, reference, metaData } = event.body;

  const tour = formatTourData({ title, startAt, reference, metaData });

  try {
    const params = {
      TableName,
      Key: { id },
      ExpressionAttributeNames: {
        "#r": "reference",
      },
      UpdateExpression:
        "SET title = :title, startAt = :startAt, #r = :r, metaData = :metaData, eventStatus = :eventStatus",
      ExpressionAttributeValues: {
        ":title": title,
        ":startAt": startAt,
        ":r": reference,
        ":eventStatus":
          new Date().toISOString() < startAt ? "UPCOMING" : "CLOSED",
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
