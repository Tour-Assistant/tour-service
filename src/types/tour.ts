export type EVENT_STATUS = "UPCOMING" | "CLOSED";

export interface PLACE {
  name: string;
  alternativeNames?: string[];
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

export interface HostAuthority {
  name: string;
  phone: string;
}

export interface HostedBy {
  name: string;
  link: {
    page: string;
    group: string;
  };
  authority: HostAuthority[];
}

export interface Tour {
  id: string;
  title: string;
  reference: string; // should be mandatory
  eventStatus: EVENT_STATUS;
  startAt: string;
  createdAt: string;
  hostedBy?: HostedBy;
  places?: PLACE[]; // should be mandatory
  budget?: BUDGET; // should be mandatory
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
