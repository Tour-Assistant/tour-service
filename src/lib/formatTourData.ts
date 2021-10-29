import { v4 as uuid } from 'uuid';

import { HostedBy, Tour } from 'src/types/tour';

export const formatTourData = (tourData: {
  title: string;
  reference: string;
  startAt: string;
  budget: number;
  division: string;
  district: string;
  hostedBy: HostedBy;
  places: string[];
  description: string;
}): Partial<Tour> => {
  const currentTime = new Date().toISOString();
  return {
    ...tourData,
    id: uuid(),
    eventStatus: currentTime < tourData.startAt ? 'UPCOMING' : 'CLOSED',
    createdAt: currentTime
  };
};
