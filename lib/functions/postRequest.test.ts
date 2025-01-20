import { postRequest } from "./postRequest";

describe("postRequest", () => {
  it("should not accept unauthorized requests", async () => {
    const url =
      "https://activepivot-ranch.activeviam.com:6100/activeviam/pivot/rest/v9/cube/query/mdx/queryplan";

    const payload = { mdx: "SELECT * FROM table" };
    const username = "username";
    const password = "password";

    await expect(postRequest(url, payload, username, password)).rejects.toThrow(
      "Request failed with status code 401",
    );
  });

  it("should return a query plan", async () => {
    const url =
      "https://activepivot-ranch.activeviam.com:6100/activeviam/pivot/rest/v9/cube/query/mdx/queryplan";

    const payload = {
      mdx: "SELECT { [Measures].[theta.SUM] } ON COLUMNS, { [CounterParty].[CounterParty].[ALL].[AllMember] } ON ROWS FROM [EquityDerivativesCube]",
    };
    const username = process.env.LOGIN;
    const password = process.env.PASSWORD;

    const result = await postRequest(url, payload, username!, password!);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
