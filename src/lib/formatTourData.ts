import { v4 as uuid } from "uuid";

import { Tour } from "src/types/tour";

export const formatTourData = (tourData: {
  title: string;
  startAt: string;
  reference: string;
}): Tour => {
  const { title, startAt, reference } = tourData;
  const currentTime = new Date().toISOString();
  return {
    id: uuid(),
    title,
    startAt,
    reference,
    eventStatus: currentTime < startAt ? "UPCOMING" : "CLOSED",
    createdAt: currentTime,
  };
};
