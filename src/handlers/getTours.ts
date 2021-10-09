import { APIGatewayProxyResult } from "aws-lambda";
import createError from "http-errors";

import { dynamodb, TableName } from "src/lib/dbClient";
import commonMiddleware from "src/lib/commonMiddleware";
import { MiddyRequest } from "src/types/middy";

export async function getTours(
  event: MiddyRequest
): Promise<APIGatewayProxyResult> {
  const { eventStatus = "UPCOMING" } = event?.queryStringParameters || {};

  const params = {
    TableName,
    KeyConditionExpression: "eventStatus = :eventStatus",
    IndexName: "eventStatus_startAt_index",
    ExpressionAttributeValues: {
      ":eventStatus": eventStatus,
    },
  };
  try {
    const { Items } = await dynamodb.query(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(Items),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(getTours);
