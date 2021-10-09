import { APIGatewayProxyResult } from "aws-lambda";
import createError from "http-errors";

import commonMiddleware from "src/lib/commonMiddleware";
import { MiddyRequest } from "src/types/middy";
import { Tour } from "src/types/tour";
import { dynamodb, TableName } from "src/lib/dbClient";

export const getTourById = async (id: string): Promise<Tour> => {
  const params = {
    TableName,
    Key: { id },
  };

  let tour;

  try {
    const { Item } = await dynamodb.get(params).promise();
    tour = Item as Tour;
    if (!tour) {
      throw new createError.NotFound(`Tour with id ${id} not found!`);
    }
    return tour;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
};

async function getTour(event: MiddyRequest): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters;
  const tour = await getTourById(id);
  return {
    statusCode: 201,
    body: JSON.stringify(tour),
  };
}

export const handler = commonMiddleware(getTour);
