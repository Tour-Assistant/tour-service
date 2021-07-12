import { APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import createError from "http-errors";

import commonMiddleware from "src/lib/commonMiddleware";
import { MiddyRequest } from "src/types/middy";

const dynamodb = new DocumentClient();

async function getTours(event: MiddyRequest): Promise<APIGatewayProxyResult> {
  const { eventStatus = "UPCOMING" } = event.queryStringParameters;

  const params = {
    TableName: process.env.TOUR_SERVICE_TABLE_NAME,
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
