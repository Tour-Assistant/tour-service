import { EVENT_STATUS, ITour } from "./tour";

export interface MiddyRequest {
  body: Partial<ITour>;
  queryStringParameters: {
    eventStatus: EVENT_STATUS;
  };
  pathParameters: {
    id: string;
  };
}
