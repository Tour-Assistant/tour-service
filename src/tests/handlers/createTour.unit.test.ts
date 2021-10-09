import { MiddyRequest } from "src/types/middy";
import { Tour } from "src/types/tour";
import { createTour } from "src/handlers/createTour";

describe("can create tour", () => {
  it("create a tour", async () => {
    const tourData: Partial<Tour> = {
      title: "title 1",
      startAt: "2021-10-09T14:33:30.736Z",
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
    expect(newTour.startAt).toEqual(tourData.startAt);
    expect(newTour.reference).toEqual(tourData.reference);
    expect(newTour.metaData).toEqual(tourData.metaData);
  });
});
