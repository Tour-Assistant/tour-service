import { APIGatewayProxyResult } from "aws-lambda";
import createError from "http-errors";

import commonMiddleware from "src/lib/commonMiddleware";
import { MiddyRequest } from "src/types/middy";
import { TableName, dynamodb } from "src/lib/dbClient";

export async function deleteTour(
  event: MiddyRequest
): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters;
  const params = {
    TableName,
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
