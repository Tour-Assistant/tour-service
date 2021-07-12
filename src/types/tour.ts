export type EVENT_STATUS = "UPCOMING" | "CLOSED";

export interface Tour {
  id: string;
  title: string;
  eventStatus: EVENT_STATUS;
  startAt: string;
  createdAt: string;
}

export interface CreateTourPostRequest {
  body: {
    title: string;
    startAt: string;
  };
}
