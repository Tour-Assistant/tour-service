import { v4 as uuid } from 'uuid';
import moment from 'moment';
import _ from 'lodash';

import { MiddyRequest } from 'src/types/middy';
import { Tour } from 'src/types/tour';
import { updateTour } from 'src/handlers/updateTour';
import { dynamodb, TableName } from 'src/lib/dbClient';

describe('can update tour suite', () => {
  const id = uuid();
  const tourData: Partial<Tour> = {
    id,
    title: 'title 1',
    reference: 'https://google.com',
    startAt: moment().subtract(1, 'day').toISOString(),
    budget: 5000,
    division: 'Dhaka',
    district: 'Dhaka D',
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

  beforeEach(async () => {
    await dynamodb
      .put({
        TableName,
        Item: tourData
      })
      .promise();
  });

  it('should update the tour', async () => {
    const updatedTour = {
      ...tourData,
      title: 'Updated title',
      startAt: moment().add(2, 'days').toISOString(),
      reference: 'https://linkedin.com'
    };

    const event: MiddyRequest = {
      pathParameters: {
        id
      },
      body: updatedTour
    };
    const res = await updateTour(event);
    expect(res.statusCode).toEqual(201);
    const { Item: tour } = await dynamodb
      .get({ TableName, Key: { id } })
      .promise();
    expect(tour.title).toEqual('Updated title');
    expect(tour.eventStatus).toEqual('UPCOMING');
    expect(_.omit(tour, 'createdAt')).toEqual(
      _.assignIn(updatedTour, { eventStatus: 'UPCOMING' })
    );
  });
});
