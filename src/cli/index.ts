#!/usr/bin/env node
export type { Config, HtmlFileType, ImageFileType } from "../app/config";

import fs from "fs/promises";
import * as path from "path";
import esbuild from "esbuild";
import { loadConfig } from "../app/load-config";
import { doesDirectoryExist } from "../app/helpers/does-directory-exist";
import { ConsoleLogger } from "../app/common/logger";
import { ConfigToManifest } from "../app/config-to-manifest";
import chokidar from "chokidar";

const logger = new ConsoleLogger();

async function build(arg: { configFilename: string, outdir: string }) {
	const { configFilename, outdir } = arg;

	const configResult = await loadConfig({ filename: configFilename, outdir, });
	if (configResult.hasError()) {
		logger.error(configResult.error.message);
		return;
	}

	const config = configResult.value!;

	const entryPoints: string[] = [];

	const actionEntrypoint = path
		.resolve(`${config.dir}/${config.action.dir}/${config.action.entrypoint}`);
	const htmlFile = path.resolve(`${config.dir}/${config.action.dir}/${config.action.default_popup}`);
	if (await doesDirectoryExist(htmlFile)) {
		await fs.copyFile(htmlFile, `${outdir}/${config.action.default_popup}`);
	}

	if (await doesDirectoryExist(actionEntrypoint.substring(0, actionEntrypoint.length - 3) + ".tsx")) {
		entryPoints.push(actionEntrypoint.substring(0, actionEntrypoint.length - 3) + ".tsx");
	}

	const bgEntrypoint = path.resolve(`${config.dir}/${config.background.service_worker}`);
	if (await doesDirectoryExist(bgEntrypoint.substring(0, bgEntrypoint.length - 3) + ".ts")) {
		entryPoints.push(bgEntrypoint.substring(0, bgEntrypoint.length - 3) + ".ts");
	}

	for (let i = 0; i < (config.content_scripts?.length || 0); i++) {
		const cs = config?.content_scripts?.[i];

		if (cs?.js?.length && cs.js.length > 0) {
			for (let j = 0; j < cs.js.length; j++) {
				const p = cs.js[j].substring(0, cs.js[j].length - 3) + ".ts";


				if (await doesDirectoryExist(path.resolve(`${config.dir}/${p}`))) {
					entryPoints.push(path.resolve(`${config.dir}/${p}`));
				}
			}
		}
	}
	try {
		await esbuild.build({
			entryPoints: entryPoints,
			bundle: true,
			format: "esm",
			write: true,
			logLevel: "silent",
			loader: {
				".png": "file",
				".gif": "file",
				".jpg": "file",
				".jpeg": "file",
				".css": "css",
			},
			assetNames: "[dir]/[name]",
			outdir: outdir,
			outbase: config.dir,
		});
	} catch (error) {
		logger.error((error as Error).message);
	}

	const jsonManifest = ConfigToManifest.toJSON(config);
	await fs.writeFile(`${outdir}/manifest.json`, jsonManifest);
}

async function watch(arg: { configFilename: string, outdir: string }) {
	const watcher = chokidar.watch(".", {
		ignored: [outdir, /(^|[/\\])\../],
		persistent: true,
	});
	await build(arg);
	logger.log("Build finished");
	watcher.on("change", async (filePath) => {
		logger.log(`File ${filePath} has been changed`);
		await build(arg);
		logger.log("Build finished");
	});

	logger.log("Watching for file changes...");
}

const configFilename = process.argv[2] ? process.argv[2] : "src/config.ts";
const outdir = process.argv[3] ? process.argv[3] : "dist";

logger.log("Starting");

if (process.argv.includes("--watch")) {
	watch({ configFilename, outdir });
} else {
	build({ configFilename, outdir });
	logger.log("Build finished");
}
