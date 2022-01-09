import moment from 'moment';
import _ from 'lodash';

import { MiddyRequest } from 'src/types/middy';
import { Tour } from 'src/types/tour';
import { createTour } from 'src/handlers/createTour';

describe('can create tour', () => {
  let tourData: Partial<Tour>;
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
