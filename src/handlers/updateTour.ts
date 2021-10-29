import { APIGatewayProxyResult } from 'aws-lambda';
import validator from '@middy/validator';
import createError from 'http-errors';
import _ from 'lodash';

import commonMiddleware from 'src/lib/commonMiddleware';
import { createTourSchema } from 'src/lib/schemas/createTourSchema';
import { MiddyRequest } from 'src/types/middy';
import { formatTourData } from 'src/lib/formatTourData';
import { dynamodb, TableName } from 'src/lib/dbClient';

export async function updateTour(
  event: MiddyRequest
): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters;

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

  const {
    title,
    reference,
    startAt,
    eventStatus,
    budget,
    division,
    district,
    hostedBy,
    places,
    description
  } = tour;

  try {
    const params = {
      TableName,
      Key: { id },
      ExpressionAttributeNames: {
        '#r': 'reference'
      },
      UpdateExpression: `
        SET 
          title = :title,
          #r = :r,
          startAt = :startAt,
          budget = :budget,
          eventStatus = :eventStatus,
          division = :division,
          district = :district,
          hostedBy = :hostedBy,
          places = :places,
          description = :description`,
      ExpressionAttributeValues: {
        ':title': title,
        ':r': reference,
        ':startAt': startAt,
        ':eventStatus': eventStatus,
        ':budget': budget,
        ':division': division,
        ':district': district,
        ':hostedBy': hostedBy,
        ':places': places,
        ':description': description
      },
      ReturnValues: 'ALL_NEW'
    };
    await dynamodb.update(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ tour })
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
      strict: false
    }
  })
);
