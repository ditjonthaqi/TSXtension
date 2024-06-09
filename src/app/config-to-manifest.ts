import { Config } from "./config";

export class ConfigToManifest {
	static toJSON(config: Config): string {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { dir, action: { dir: actionDir, entrypoint, ...actionRest }, ...rest } = config;
		const filteredConfig = {
			...rest,
			action: actionRest
		};
		return JSON.stringify(filteredConfig, null, 1);
	}
}
