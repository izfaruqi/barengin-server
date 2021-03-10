import { Config } from "koa-joi-router";
import { errorResponseValidator } from ".";

export const getCurrent: Config = {
  validate: {
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}