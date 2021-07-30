import { APIGatewayProxyResult } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import validator from "@middy/validator";
import createError from "http-errors";

import commonMiddleware from "src/lib/commonMiddleware";
import { Tour } from "../types/tour";
import bulkTourSchema from "src/lib/schemas/bulkTourSchema";
import { formatTourData } from "src/lib/formatTourData";

const dynamodb = new DocumentClient();

async function bulkTourInsert(event: {
  body: Partial<Tour>[];
}): Promise<APIGatewayProxyResult> {
  const tourList = event.body.map(({ title, startAt, reference, metaData }) =>
    formatTourData({ title, startAt, reference, metaData })
  );
  try {
    const params = {
      RequestItems: {
        [process.env.TOUR_SERVICE_TABLE_NAME]: tourList.map((tour) => ({
          PutRequest: {
            Item: tour,
          },
        })),
      },
    };
    await dynamodb.batchWrite(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ tourList }),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(bulkTourInsert).use(
  validator({
    inputSchema: bulkTourSchema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  })
);
