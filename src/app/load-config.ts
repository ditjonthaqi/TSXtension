import fs from "fs/promises";
import esbuild from "esbuild";
import { Result } from "./common/result";
import path from "path";
import { Config } from "./config";
import { promisify } from "util";
import { exec } from "child_process";

export const execAsync = promisify(exec);

export async function loadConfig(arg: {
	filename: string;
	outdir: string;
}) {

	const { filename, outdir } = arg;
	try {
		const { stdout, stderr } = await execAsync("tsc --noEmit");
		if (stderr || stdout) {
			return Result.error<Config, Error>(new Error(stderr ?? stdout));
		}

		await esbuild.build({
			entryPoints: [filename],
			bundle: true,
			format: "cjs",
			write: true,
			logLevel: "silent",
			loader: {
				".png": "file",
				".gif": "file",
				".jpg": "file",
				".jpeg": "file"
			},
			assetNames: "[dir]/[name]",
			outdir: outdir
		});
		const splitedDir = filename.split("/");
		const outFilename = splitedDir[splitedDir.length - 1].split(".")[0] + ".js";
		delete require.cache[require.resolve(path.resolve(outdir, outFilename))];
		const module = await require(path.resolve(outdir, outFilename));
		await fs.unlink(path.resolve(outdir, outFilename));
		return Result.value<Config, Error>(module.config);
	} catch (error) {
		if ((error as { stdout: string }).stdout) {
			return Result.error<Config, Error>(new Error((error as { stdout: string }).stdout));
		}
		return Result.error<Config, Error>(<Error>error);
	}
}
