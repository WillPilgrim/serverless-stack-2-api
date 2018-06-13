import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };
  console.log('#### ', process.env.tableName,' ####');

  try {
    console.log('#### before await dynamoDbLib ', params,' ####');
    await dynamoDbLib.call("put", params);
    console.log('#### after await dynamoDbLib ', params,' ####');
    callback(null, success(params.Item));
    console.log('#### callback success ', params.Item,' ####');
  } catch (e) {
    console.log('#### before callback failure ####');
    callback(null, failure({ status: false }));
    console.log('#### after callback failure ####');
  }
}
