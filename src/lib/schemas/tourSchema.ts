export const tourSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string'
    },
    reference: {
      type: 'string'
    },
    startAt: {
      type: 'string'
    },
    budget: {
      type: 'number'
    },
    division: {
      type: 'string'
    },
    district: {
      type: 'string'
    },
    hostedBy: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        link: {
          type: 'object',
          properties: {
            page: {
              type: 'string'
            },
            group: {
              type: 'string'
            }
          },
          required: ['page', 'group']
        },
        authorities: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              phone: {
                type: 'string'
              }
            },
            required: ['name', 'phone']
          }
        }
      },
      required: ['name', 'link', 'authorities']
    },
    places: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    description: {
      type: 'string'
    },
    createdAt: {
      type: 'string'
    }
  },
  required: ['title', 'reference', 'startAt']
};
