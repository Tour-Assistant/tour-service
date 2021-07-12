import { EVENT_STATUS, Tour } from "./tour";

export interface MiddyRequest {
  body: Tour;
  queryStringParameters: {
    eventStatus: EVENT_STATUS;
  };
}
