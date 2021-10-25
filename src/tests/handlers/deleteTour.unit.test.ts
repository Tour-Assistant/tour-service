import { v4 as uuid } from 'uuid';
import moment from 'moment';

import { Tour } from 'src/types/tour';
import { deleteTour } from 'src/handlers/deleteTour';
import { dynamodb, TableName } from 'src/lib/dbClient';
import { MiddyRequest } from 'src/types/middy';

describe('should delete tour', () => {
  const id = uuid();
  const tourData: Partial<Tour> = {
    id,
    title: 'title 1',
    startAt: moment().toISOString(),
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

  it('should delete the tour', async () => {
    const event: MiddyRequest = {
      pathParameters: {
        id
      }
    };
    await deleteTour(event);
    const { Item: tour } = await dynamodb
      .get({ TableName, Key: { id } })
      .promise();
    expect(tour).toEqual(undefined);
  });

  it('should delete the tour', async () => {
    const randomId = uuid();
    const event: MiddyRequest = {
      pathParameters: {
        id: uuid()
      }
    };
    try {
      await deleteTour(event);
    } catch (error) {
      expect(error.message.message).toEqual(`Tour with id ${id} not found!`);
    }
  });
});
