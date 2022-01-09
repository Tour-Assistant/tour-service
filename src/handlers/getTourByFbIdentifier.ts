import { APIGatewayProxyResult } from 'aws-lambda';
import createError from 'http-errors';

import commonMiddleware from 'src/lib/commonMiddleware';
import { MiddyRequest } from 'src/types/middy';
import { dynamodb, TableName } from 'src/lib/dbClient';

export async function getTourByFbIdentifier(
  event: MiddyRequest
): Promise<APIGatewayProxyResult> {
  const { fbIdentifier } = event.pathParameters;
  const params = {
    TableName,
    KeyConditionExpression: 'fbIdentifier = :fbIdentifier',
    IndexName: 'fbIdentifier_index',
    ExpressionAttributeValues: {
      ':fbIdentifier': fbIdentifier
    }
  };

  try {
    const { Items } = await dynamodb.query(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(Items)
    };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(getTourByFbIdentifier);
