import moment from 'moment';
import _ from 'lodash';
import { APIGatewayEvent, Context } from 'aws-lambda';

import { Tour } from 'src/types/tour';
import { handler as createTourHandler } from 'src/handlers/createTour';

describe('can create tour by handler suite', () => {
  let tourData: Partial<Tour>;
  it('create an upcoming tour', async () => {
    tourData = {
      title: 'title 1',
      reference: 'https://google.com',
      startAt: moment().add(1, 'day').toISOString(),
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

    const event = {
      body: tourData
    } as unknown as APIGatewayEvent;
    const context = {} as Context;
    const res = await createTourHandler(event, context);
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
    const event = {
      body: tourData
    } as unknown as APIGatewayEvent;
    const context = {} as Context;

    const res = await createTourHandler(event, context);
    const { tour: newTour } = JSON.parse(res.body);
    expect(_.omit(newTour, 'id', 'createdAt')).toEqual(
      _.assignIn(tourData, { eventStatus: 'CLOSED' })
    );
  });
});
