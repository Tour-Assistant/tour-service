export type EVENT_STATUS = "UPCOMING" | "CLOSED";

export interface IPlace {
  name: string;
  alternativeNames?: string[];
  postCode: number;
  area?: string;
  thana?: string;
  district?: string;
  division?: string;
  country?: string;
}

export interface IBudget {
  total: number;
  advance: number;
}

export interface IHostAuthority {
  name: string;
  phone: string;
}

export interface IHostedBy {
  name: string;
  link: {
    page: string;
    group: string;
  };
  authority: IHostAuthority[];
}

export interface ITour {
  id: string;
  title: string;
  reference: string; // should be mandatory
  eventStatus: EVENT_STATUS;
  startAt: string;
  createdAt: string;
  hostedBy?: IHostedBy;
  places?: IPlace[]; // should be mandatory
  budget?: IBudget; // should be mandatory
  details?: {
    content: string;
  };
  metaData?: {
    hostedBy: string;
    budget: number;
  };
}

export interface ICreateTourPostRequest {
  body: {
    title: string;
    startAt: string;
  };
}
