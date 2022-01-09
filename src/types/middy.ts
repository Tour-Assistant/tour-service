import { EVENT_STATUS, Tour } from './tour';

export interface MiddyRequest {
  body?: Partial<Tour>;
  queryStringParameters?: {
    eventStatus: EVENT_STATUS;
  };
  pathParameters?: {
    id?: string;
    fbIdentifier?: string;
  };
}
