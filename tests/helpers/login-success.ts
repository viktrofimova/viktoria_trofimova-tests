import { APIRequestContext } from "@playwright/test";
import {
  makeUser,
  registerUserViaApi,
  type TestUser,
} from "./user";

export async function prepareLoginSuccess(
  request: APIRequestContext,
): Promise<TestUser> {
  const user = makeUser("login-success", Date.now());

  await registerUserViaApi(request, user);

  return user;
}