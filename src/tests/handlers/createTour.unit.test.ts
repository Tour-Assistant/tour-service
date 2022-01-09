import moment from 'moment';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { MiddyRequest } from 'src/types/middy';
import { Tour } from 'src/types/tour';
import { createTour, isDuplicateByFbIdentifier } from 'src/handlers/createTour';
import { dynamodb } from 'src/lib/dbClient';

describe('can create tour', () => {
  let tourData: Partial<Tour>;

  describe('should detect duplicate tour', () => {
    const duplicateTourData = {
      id: uuid(),
      fbIdentifier: '123',
      title: 'title 1',
      startAt: moment().add(1, 'day').toISOString(),
      reference: 'https://google.com',
      eventStatus: 'UPCOMING',
      createdAt: moment().toISOString()
    };
    beforeEach(async () => {
      await dynamodb
        .batchWrite({
          RequestItems: {
            TestTourService: [
              {
                PutRequest: {
                  Item: duplicateTourData
                }
              }
            ]
          }
        })
        .promise();
    });

    it('should not create duplicate event', async () => {
      const isDuplicate = await isDuplicateByFbIdentifier('123');
      expect(isDuplicate).toEqual(true);
    });

    it('should not create duplicate event', async () => {
      const isDuplicate = await isDuplicateByFbIdentifier('1234');
      expect(isDuplicate).toEqual(false);
    });
  });

  it('create an upcoming tour', async () => {
    tourData = {
      title: 'title 1',
      reference: 'https://google.com',
      startAt: moment().add(1, 'day').toISOString(),
      budget: 5000,
      hostedBy: {
        name: 'Hit The Trail',
        link: {
          page: 'https://facebook.com/page/hitthetrail',
          group: 'https://facebook.com/group/hitthetrail'
        },
        authorities: [
          {
            name: 'Masum',
            phone: '+8801711253253'
          },
          {
            name: 'Mamun',
            phone: '+8801722253253'
          }
        ]
      },
      places: ['p1', 'p2'],
      description: 'Some description'
    };
    const event: MiddyRequest = {
      body: tourData
    };
    const res = await createTour(event);
    const { tour: newTour } = JSON.parse(res.body);
    expect(_.omit(newTour, 'id', 'createdAt')).toEqual(
      _.assignIn(tourData, { eventStatus: 'UPCOMING' })
    );
  });

  it('create an closed tour', async () => {
    tourData = {
      title: 'title 1',
      reference: 'https://google.com',
      startAt: moment().subtract(1, 'day').toISOString(),
      budget: 5000,
      hostedBy: {
        name: 'Hit The Trail',
        link: {
          page: 'https://facebook.com/page/hitthetrail',
          group: 'https://facebook.com/group/hitthetrail'
        },
        authorities: [
          {
            name: 'Masum',
            phone: '+8801711253253'
          },
          {
            name: 'Mamun',
            phone: '+8801722253253'
          }
        ]
      },
      places: ['p1', 'p2'],
      description: 'Some description'
    };
    const event: MiddyRequest = {
      body: tourData
    };
    const res = await createTour(event);
    const { tour: newTour } = JSON.parse(res.body);
    expect(_.omit(newTour, 'id', 'createdAt')).toEqual(
      _.assignIn(tourData, { eventStatus: 'CLOSED' })
    );
  });
});
