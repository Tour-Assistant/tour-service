import { APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import createError from "http-errors";

import commonMiddleware from "src/lib/commonMiddleware";
import { MiddyRequest } from "src/types/middy";

const dynamodb = new DocumentClient();

async function deleteTour(event: MiddyRequest): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters;
  const params = {
    TableName: process.env.TOUR_SERVICE_TABLE_NAME,
    Key: { id },
  };
  try {
    await dynamodb.delete(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(id),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(deleteTour);
