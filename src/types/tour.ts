export type EVENT_STATUS = "UPCOMING" | "CLOSED";

export interface PLACE {
  name: string;
  alternativeNames?: [string];
  postCode: number;
  area?: string;
  thana?: string;
  district?: string;
  division?: string;
  country?: string;
}

export interface BUDGET {
  total: number;
  advance: number;
}

export interface HOST_AUTHORITY {
  name: string;
  phone: string;
}

export interface HOSTED_BY {
  name: string;
  link: {
    page: string;
    group: string;
  };
  authority: [HOST_AUTHORITY];
}

export interface Tour {
  id: string;
  title: string;
  reference: string;
  eventStatus: EVENT_STATUS;
  startAt: string;
  createdAt: string;
  hostedBy?: HOST_AUTHORITY;
  places: [PLACE];
  budget: BUDGET;
  details?: {
    content: string;
  };
  metaData?: {
    hostedBy: string;
    budget: number;
  };
}

export interface CreateTourPostRequest {
  body: {
    title: string;
    startAt: string;
  };
}
