import { APIGatewayProxyResult } from 'aws-lambda';
import validator from '@middy/validator';
import createError from 'http-errors';
import _ from 'lodash';

import commonMiddleware from 'src/lib/commonMiddleware';
import { createTourSchema } from 'src/lib/schemas/createTourSchema';
import { MiddyRequest } from 'src/types/middy';
import { formatTourData } from 'src/lib/formatTourData';
import { dynamodb, TableName } from 'src/lib/dbClient';
import { Tour } from 'src/types/tour';

export async function createTour(
  event: MiddyRequest
): Promise<APIGatewayProxyResult> {
  const tour = formatTourData(
    _.pick(
      event.body,
      'title',
      'reference',
      'startAt',
      'budget',
      'hostedBy',
      'places',
      'description'
    ) as Tour
  );

  try {
    const params = {
      TableName,
      Item: tour
    };
    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ tour })
    };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(createTour).use(
  validator({
    inputSchema: createTourSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false
    }
  })
);
