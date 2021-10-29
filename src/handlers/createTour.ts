import { APIGatewayProxyResult } from 'aws-lambda';
import validator from '@middy/validator';
import createError from 'http-errors';
import _ from 'lodash';

import commonMiddleware from 'src/lib/commonMiddleware';
import { createTourSchema } from 'src/lib/schemas/createTourSchema';
import { MiddyRequest } from 'src/types/middy';
import { formatTourData } from 'src/lib/formatTourData';
import { dynamodb, TableName } from 'src/lib/dbClient';

export async function createTour(
  event: MiddyRequest
): Promise<APIGatewayProxyResult> {
  const { title, startAt, reference } = event.body;

  const tour = formatTourData(
    _.pick(
      event.body,
      'title',
      'reference',
      'startAt',
      'budget',
      'division',
      'district',
      'hostedBy',
      'places',
      'description'
    )
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
    console.error(error);
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
