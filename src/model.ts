import * as os from "os";

export class TerminalData {
	constructor(private _texts: string[]) {}

	public get texts(): string[] {
		return this._texts;
	}

	public mergeTexts(): string {
		return 0 === this.texts.length ? "" : this.texts.join(os.EOL) + os.EOL
	}
}
