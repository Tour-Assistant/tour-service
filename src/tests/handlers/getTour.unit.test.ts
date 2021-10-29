import { v4 as uuid } from 'uuid';
import moment from 'moment';

import { Tour } from 'src/types/tour';
import { getTourById } from 'src/handlers/getTour';
import { dynamodb, TableName } from 'src/lib/dbClient';

describe('should able to get a tour by ID', () => {
  let id = uuid();
  const tourData: Partial<Tour> = {
    id,
    title: 'title 1',
    startAt: moment().toISOString(),
    reference: 'https://google.com',
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

  it('get a tour by id', async () => {
    const tour = await getTourById(id);
    expect(tour.id).toEqual(id);
  });

  it('should throw error for invalid id', async () => {
    // random uuid
    id = uuid();
    try {
      await getTourById(id);
    } catch (error) {
      expect(error.message.message).toEqual(`Tour with id ${id} not found!`);
    }
  });
});
