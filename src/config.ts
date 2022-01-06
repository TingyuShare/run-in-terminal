import * as vscode from "vscode";

export class Configuration {
	_config: vscode.WorkspaceConfiguration;
	constructor() {
		this._config = vscode.workspace.getConfiguration("vscode-send-to-terminal");
	}
	public get indexedVariableNameFormat(): string {
		return this._config.get<string>(
			"indexedSelectionVariableNameFormat",
			"VALUE_{0}",
		);
	}
	public get singleOrMergedValueVariableName(): string {
		return this._config.get<string>("singleOrMergedValueVariableName", "VALUE");
	}
	public get showNewTerminal(): boolean {
		return this._config.get<boolean>("showNewTerminal", true);
	}
	public get typeInEcho(): boolean {
		return this._config.get<boolean>("typeInEcho", true);
	}
	public get echoCommandFormat(): string {
		return this._config.get<string>("echoCommandFormat", 'echo "${0}" | cat');
	}
}
