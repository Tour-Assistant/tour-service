export type EVENT_STATUS = 'UPCOMING' | 'CLOSED';

export interface Budget {
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
  authorities: HostAuthority[];
}

export interface Tour {
  id: string;
  title: string;
  reference: string;
  eventStatus: EVENT_STATUS;
  startAt: string;
  hostedBy: HostedBy;
  places: string[];
  budget: number;
  description: string;
  createdAt: string;
}

export interface CreateTourPostRequest {
  body: {
    title: string;
    startAt: string;
  };
}
