import fs from "fs";

export async function doesDirectoryExist(dir: string) {
	try {
		await fs.promises.access(dir);
		return true;
	} catch (error) {
		return false;
	}
}