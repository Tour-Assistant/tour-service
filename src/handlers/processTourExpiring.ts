import createError from "http-errors";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { ITour } from "src/types/tour";

const dynamodb = new DocumentClient();

async function processTourExpiring(): Promise<void> {
  const now = new Date();
  try {
    // get a list of expired tour
    const params = {
      TableName: process.env.TOUR_SERVICE_TABLE_NAME,
      IndexName: "eventStatus_startAt_index",
      KeyConditionExpression: "eventStatus = :eventStatus AND startAt <= :now",
      ExpressionAttributeValues: {
        ":eventStatus": "UPCOMING",
        ":now": now.toISOString(),
      },
    };
    const { Items } = await dynamodb.query(params).promise();
    const expiredTours = Items as ITour[];

    // Make all expired tours as closed
    const expiredToursPromises = expiredTours.map(async (tour) => {
      console.log(`tour.id: ${tour.id}`);
      const updateParams = {
        TableName: process.env.TOUR_SERVICE_TABLE_NAME,
        Key: { id: tour.id },
        IndexName: "eventStatus_startAt_index",
        UpdateExpression: "set eventStatus = :eventStatus",
        ExpressionAttributeValues: {
          ":eventStatus": "CLOSED",
        },
      };
      await dynamodb.update(updateParams).promise();
    });
    await Promise.all(expiredToursPromises);
    console.log("Done updating the expired tours");
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = processTourExpiring;
