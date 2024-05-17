import * as vscode from "vscode";
import { format } from "./util";
import { TerminalData } from "./model";

type EnvData = { [key: string]: string };

export function activate(context: vscode.ExtensionContext) {
	const disposables = [
		vscode.commands.registerCommand(
			"runInTerminal.select-selection",
			sendSelectionToTerminal,
		),
		vscode.commands.registerCommand(
			"runInTerminal.active-file",
			sendActiveFileToTerminal,
		),
		vscode.commands.registerCommand(
			"runInTerminal.whatisMyip",
			() => {
				return makeTerminal(new TerminalData(["curl cip.cc"]));
			},
		),
	];
	context.subscriptions.push(...disposables);
}

export default function deactivate() {}

function sendActiveFileToTerminal(): vscode.Terminal | undefined {
	const text = vscode.window.activeTextEditor?.document.getText();
	if (undefined === text) {
		return undefined;
	}
	return makeTerminal(new TerminalData([text]));
}

function sendSelectionToTerminal(): vscode.Terminal | undefined {
	const ate = vscode.window.activeTextEditor;
	const selections = vscode.window.activeTextEditor?.selections;
	if (!ate || !selections) {
		return undefined;
	}
	const texts = selections.map((x) => ate.document.getText(x));
	return makeTerminal(new TerminalData(texts));
}

function makeTerminal(
	data: TerminalData
): vscode.Terminal {
	const env = makeEnv(data);
	const result = createTerminalWithEnv(env);
	typeInEcho(result, data);
	result.show();
	return result;
}

function typeInEcho(terminal: vscode.Terminal, data: TerminalData) {
	terminal.sendText(
		data.mergeTexts(),
		false,
	);
}

function makeEnv(data: TerminalData): EnvData {
	const result: EnvData = {};
	for (const [i, v] of data.texts.entries()) {
		const k = format('value', i.toString());
		result[k] = v;
	}
	return result;
}

function createTerminalWithEnv(env: EnvData): vscode.Terminal {
	const options: vscode.TerminalOptions = {
		env: env,
	};
	return vscode.window.createTerminal(options);
}
