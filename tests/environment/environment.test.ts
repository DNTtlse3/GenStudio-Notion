import { get_env } from "../../lib/environment";
import { describe, it, expect } from "vitest";



describe("get_env", () => {
	it("Not found", () => {
		expect(() => {
			get_env("FAKE_ENV");
		}).toThrow();
	});

});


describe("Get an env", () => {
	it("Found", () => {
		expect(get_env("APP_URL")).toBe("http://localhost:3000");
	});

});