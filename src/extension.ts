import * as vscode from "vscode";
import { format } from "./util";
import { Configuration } from "./config";
import { TerminalData } from "./model";

type EnvData = { [key: string]: string };

export function activate(context: vscode.ExtensionContext) {
	const disposables = [
		vscode.commands.registerCommand(
			"vscode-send-to-terminal.send-selection",
			sendSelectionToTerminal,
		),
		vscode.commands.registerCommand(
			"vscode-send-to-terminal.send-active-file",
			sendActiveFileToTerminal,
		),
	];
	context.subscriptions.push(...disposables);
}

export default function deactivate() {}

function sendActiveFileToTerminal() {
	const text = vscode.window.activeTextEditor?.document.getText();
	if (undefined === text) {
		return;
	}
	makeTerminal(new TerminalData([text]));
}

function sendSelectionToTerminal() {
	const ate = vscode.window.activeTextEditor;
	const selections = vscode.window.activeTextEditor?.selections;
	if (!ate || !selections) {
		return;
	}
	const texts = selections.map((x) => ate.document.getText(x));
	makeTerminal(new TerminalData(texts));
}

function makeTerminal(data: TerminalData, config?: Configuration) {
	const c = config || new Configuration();
	const env = makeEnv(data, c);
	const terminal = createTerminalWithEnv(env);
	if (c.typeInEcho) {
		typeInEcho(terminal, c);
	}
	if (c.showNewTerminal) {
		terminal.show();
	}
}

function typeInEcho(terminal: vscode.Terminal, config: Configuration) {
	terminal.sendText(
		format(config.echoCommandFormat, config.singleOrMergedVariableName),
		false,
	);
}

function makeEnv(data: TerminalData, config: Configuration): EnvData {
	const result: EnvData = {};
	const formatString = config.indexedVariableNameFormat;
	for (const [i, v] of data.texts.entries()) {
		const k = format(formatString, i.toString());
		result[k] = v;
	}
	result[config.singleOrMergedVariableName] = data.mergeTexts();
	return result;
}

function createTerminalWithEnv(env: EnvData): vscode.Terminal {
	const options: vscode.TerminalOptions = {
		env: env,
	};
	return vscode.window.createTerminal(options);
}
