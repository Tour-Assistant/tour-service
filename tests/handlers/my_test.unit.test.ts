const { DocumentClient } = require("aws-sdk/clients/dynamodb");

const ddb = new DocumentClient({
  convertEmptyValues: true,
  endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
  sslEnabled: false,
  region: "local",
});

const keystore = {
  getItem: async (byId) => {
    const { Item } = await ddb
      .get({ TableName: "keys", Key: { id: byId } })
      .promise();

    return Item && Item.value;
  },
  putItem: (id, value) =>
    ddb.put({ TableName: "keys", Item: { id, value } }).promise(),
};

describe("keystore", () => {
  it("should allow items to be placed in the store", async () => {
    await Promise.all([
      keystore.putItem("1", { name: "value" }),
      keystore.putItem("2", { name: "another value" }),
    ]);

    expect(await keystore.getItem("1")).toEqual({ name: "value" });
    expect(await keystore.getItem("2")).toEqual({ name: "another value" });
  });

  it("should handle no value for key", async () => {
    expect(await keystore.getItem("a")).toBeUndefined();
  });

  it("should contain the existing key from example data", async () => {
    expect(await keystore.getItem("50")).toEqual({ name: "already exists" });
  });
});
