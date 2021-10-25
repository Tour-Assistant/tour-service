import { v4 as uuid } from 'uuid';
import moment from 'moment';

import { MiddyRequest } from 'src/types/middy';
import { Tour } from 'src/types/tour';
import { updateTour } from 'src/handlers/updateTour';
import { dynamodb, TableName } from 'src/lib/dbClient';

describe('can create tour', () => {
  const id = uuid();
  const tourData: Partial<Tour> = {
    id,
    title: 'title 1',
    startAt: moment().subtract(1, 'day').toISOString(),
    reference: 'https://google.com',
    metaData: {
      hostedBy: 'Hit The Trail',
      budget: 1223
    },
    createdAt: moment().toISOString()
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
    const startAt = moment().subtract(1, 'day').toISOString();

    const event: MiddyRequest = {
      pathParameters: {
        id
      },
      body: {
        title: 'Updated title',
        startAt: moment().add(1, 'day').toISOString(),
        reference: 'https://linkedin.com',
        metaData: {
          hostedBy: 'TGB',
          budget: 350
        }
      }
    };
    const res = await updateTour(event);
    expect(res.statusCode).toEqual(201);
    const { Item: tour } = await dynamodb
      .get({ TableName, Key: { id } })
      .promise();
    expect(tour.title).toEqual('Updated title');
    expect(tour.eventStatus).toEqual('UPCOMING');
    expect(tour.reference).toEqual('https://linkedin.com');
    expect(tour.metaData.hostedBy).toEqual('TGB');
    expect(tour.metaData.budget).toEqual(350);
  });
});
