import { doesDirectoryExist } from "../../../src/app/helpers/does-directory-exist";
import fs from "fs";

jest.mock("fs", () => ({
	promises: {
		access: jest.fn()
	}
}));

describe("doesDirectoryExist", () => {
	it("returns true when the directory exists", async () => {
		(fs.promises.access as jest.Mock).mockResolvedValue(undefined);

		const result = await doesDirectoryExist("/path/to/exist");
		expect(result).toBe(true);
	});

	it("returns false when the directory does not exist", async () => {
		(fs.promises.access as jest.Mock).mockRejectedValue(new Error("ENOENT: no such file or directory"));

		const result = await doesDirectoryExist("/path/to/not/exist");
		expect(result).toBe(false);
	});
});