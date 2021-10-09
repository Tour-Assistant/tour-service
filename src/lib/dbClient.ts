import { DocumentClient } from "aws-sdk/clients/dynamodb";

export const dynamodb =
  process.env.NODE_ENV === "test"
    ? new DocumentClient({
        convertEmptyValues: true,
        endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
        sslEnabled: false,
        region: "local",
      })
    : new DocumentClient();

export const TableName =
  process.env.NODE_ENV === "test"
    ? "TestTourService"
    : process.env.TOUR_SERVICE_TABLE_NAME;
