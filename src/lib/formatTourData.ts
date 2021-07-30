import { v4 as uuid } from "uuid";

import { Tour } from "src/types/tour";

export const formatTourData = (tourData: {
  title: string;
  startAt: string;
  reference: string;
  metaData: Tour["metaData"];
}): Tour => {
  const { title, startAt, reference, metaData } = tourData;
  const currentTime = new Date().toISOString();
  return {
    id: uuid(),
    title,
    startAt,
    reference,
    eventStatus: currentTime < startAt ? "UPCOMING" : "CLOSED",
    createdAt: currentTime,
    metaData,
  };
};
