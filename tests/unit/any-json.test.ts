import { describe, expect, test } from "vitest";
import { anyJson } from "../../src/lib/form";

describe("AnyJson", () => {
  test("Correct shape", () => {
    const f = new FormData();
    f.set("title", "title");
    const json = anyJson(f);
    expect(json.title).toBe("title");
  });
});
