export interface Logger {
	log(message: string): void;
	error(message: string): void;
}

export class ConsoleLogger implements Logger {
	private greenBackgroundLabel(label: string): string {
		return `\x1b[42m\x1b[30m${label}\x1b[0m`; // Green background, black text
	}

	private redBackgroundLabel(label: string): string {
		return `\x1b[41m\x1b[30m${label}\x1b[0m`; // Red background, black text
	}

	log(message: string): void {
		console.log(`${this.greenBackgroundLabel("INFO")}: ${message}`);
	}

	error(message: string): void {
		console.error(`${this.redBackgroundLabel("ERROR")}: ${message}`);
	}
}