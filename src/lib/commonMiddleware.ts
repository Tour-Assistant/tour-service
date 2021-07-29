import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";

export interface OwnEvent {
  body: {
    name: string;
  };
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export default (handler): middy.MiddyfiedHandler<any, any, Error> =>
  middy(handler).use([
    httpJsonBodyParser(),
    httpEventNormalizer(),
    httpErrorHandler(),
    cors(),
  ]);
