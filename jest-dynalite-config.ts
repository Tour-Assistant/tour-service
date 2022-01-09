module.exports = {
  tables: [
    {
      TableName: 'keys',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      data: [
        {
          id: '50',
          value: { name: 'already exists' }
        }
      ]
    },
    {
      TableName: 'TestTourService',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'eventStatus', AttributeType: 'S' },
        { AttributeName: 'startAt', AttributeType: 'S' },
        { AttributeName: 'fbIdentifier', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'eventStatus_startAt_index',
          KeySchema: [
            { AttributeName: 'eventStatus', KeyType: 'HASH' },
            { AttributeName: 'startAt', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' }
        },
        {
          IndexName: 'fbIdentifier_index',
          KeySchema: [{ AttributeName: 'fbIdentifier', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' }
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }
  ],
  basePort: 8000
};
