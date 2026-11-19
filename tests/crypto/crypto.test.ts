import { describe, it, expect } from "vitest";
import { randomBytes } from "node:crypto";
import { encrypt, decrypt } from "../../lib/crypto";


/*Valeur de test*/
const input = randomBytes(32).toString("base64");
const secret= encrypt(input);


describe("decrypt", () => {
	it("Test decrypt", () => {
		expect(decrypt(secret)).toBe(input);
	});

});
