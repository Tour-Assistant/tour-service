import { MiddyRequest } from "src/types/middy";
import { Tour } from "src/types/tour";
import { createTour } from "src/handlers/createTour";
import moment from "moment";

describe("can create tour", () => {
  let tourData: Partial<Tour>;
  it("create a tour", async () => {
    const startAt = moment().toISOString();
    tourData = {
      title: "title 1",
      startAt,
      reference: "https://google.com",
      metaData: {
        hostedBy: "Hit The Trail",
        budget: 1223,
      },
    };
    const event: MiddyRequest = {
      body: tourData,
    };
    const res = await createTour(event);
    const { tour: newTour } = JSON.parse(res.body);
    expect(newTour.title).toEqual(tourData.title);
    expect(newTour.startAt).toEqual(startAt);
    expect(newTour.reference).toEqual(tourData.reference);
    expect(newTour.metaData).toEqual(tourData.metaData);
  });

  it('should have "CLOSED" status for expired date tour', async () => {
    const startAt = moment().subtract(1, "day").toISOString();
    tourData = {
      title: "title 1",
      startAt,
      reference: "https://google.com",
      metaData: {
        hostedBy: "Hit The Trail",
        budget: 1223,
      },
    };
    const event: MiddyRequest = {
      body: tourData,
    };
    const res = await createTour(event);
    const { tour: newTour } = JSON.parse(res.body);
    expect(newTour.eventStatus).toEqual("CLOSED");
  });

  it('should have "UPCOMING" status for upcoming tour', async () => {
    const startAt = moment().add(1, "day").toISOString();
    tourData = {
      title: "title 1",
      startAt,
      reference: "https://google.com",
      metaData: {
        hostedBy: "Hit The Trail",
        budget: 1223,
      },
    };
    const event: MiddyRequest = {
      body: tourData,
    };
    const res = await createTour(event);
    const { tour: newTour } = JSON.parse(res.body);
    expect(newTour.eventStatus).toEqual("UPCOMING");
  });
});
