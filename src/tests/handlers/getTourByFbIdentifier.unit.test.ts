import { v4 as uuid } from 'uuid';
import moment from 'moment';
import _ from 'lodash';

import { Tour } from 'src/types/tour';
import { getTourByFbIdentifier } from 'src/handlers/getTourByFbIdentifier';
import { dynamodb, TableName } from 'src/lib/dbClient';
import { MiddyRequest } from 'src/types/middy';

describe('should able to get a tourList by fbIdentifier', () => {
  const id = uuid();
  const tourData: Partial<Tour> = {
    id,
    fbIdentifier: '123',
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

  it('get a tour by fbIdentifier', async () => {
    const event: MiddyRequest = {
      pathParameters: {
        fbIdentifier: '123'
      }
    };

    const res = await getTourByFbIdentifier(event);
    const tourList = JSON.parse(res.body) as Tour[];
    expect(_.size(tourList)).toEqual(1);
    expect(tourList[0].fbIdentifier).toEqual('123');
  });

  it('should return empty list for invalid fbIdentifier', async () => {
    const event: MiddyRequest = {
      pathParameters: {
        fbIdentifier: '1234'
      }
    };

    const res = await getTourByFbIdentifier(event);
    const tourList = JSON.parse(res.body) as Tour[];
    expect(_.size(tourList)).toEqual(0);
  });
});
