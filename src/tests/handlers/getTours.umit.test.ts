import { v4 as uuid } from 'uuid';
import moment from 'moment';

import { Tour } from 'src/types/tour';
import { getTours } from 'src/handlers/getTours';
import { dynamodb } from 'src/lib/dbClient';
import { MiddyRequest } from 'src/types/middy';

describe('should able to get list of tours', () => {
  const tourData: Partial<Tour>[] = [
    {
      id: uuid(),
      title: 'title 1',
      startAt: moment().add(1, 'day').toISOString(),
      reference: 'https://google.com',
      eventStatus: 'UPCOMING',
      createdAt: moment().toISOString()
    },
    {
      id: uuid(),
      title: 'title 2',
      startAt: moment().subtract(1, 'day').toISOString(),
      reference: 'https://google.com',
      eventStatus: 'CLOSED',
      createdAt: moment().toISOString()
    }
  ];

  it('should return empty list if there is no UPCOMING tour', async () => {
    const event: MiddyRequest = {};
    const res = await getTours(event);
    const tourList = JSON.parse(res.body) as Tour[];
    expect(tourList.length).toEqual(0);
  });

  describe('should work when the tour list is not empty', () => {
    beforeEach(async () => {
      await dynamodb
        .batchWrite({
          RequestItems: {
            TestTourService: tourData.map(tour => ({
              PutRequest: {
                Item: tour
              }
            }))
          }
        })
        .promise();
    });

    it('should get list of tours', async () => {
      const event: MiddyRequest = {};
      const res = await getTours(event);
      const tourList = JSON.parse(res.body) as Tour[];
      expect(tourList.length).not.toEqual(0);
      expect(tourList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            eventStatus: 'UPCOMING'
          })
        ])
      );
    });

    it("should not include 'CLOSED' tours", async () => {
      const event: MiddyRequest = {};
      const res = await getTours(event);
      const tourList = JSON.parse(res.body) as Tour[];
      expect(tourList.length).toEqual(1);
      expect(tourList[0].eventStatus).toEqual('UPCOMING');
    });

    it("should include only 'CLOSED' tours", async () => {
      const event: MiddyRequest = {
        queryStringParameters: {
          eventStatus: 'CLOSED'
        }
      };
      const res = await getTours(event);
      const tourList = JSON.parse(res.body) as Tour[];
      expect(tourList.length).toEqual(1);
      expect(tourList[0].eventStatus).toEqual('CLOSED');
    });
  });
});
