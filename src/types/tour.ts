export interface Tour {
  id: string;
  title: string;
  eventStatus: "UPCOMING" | "CLOSED";
  startAt: string;
  createdAt: string;
}

export interface CreateTourPostRequest {
  body: {
    title: string;
    startAt: string;
  };
}
