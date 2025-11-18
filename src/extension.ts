import * as vscode from "vscode";
import * as path from "path";
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
		vscode.commands.registerTextEditorCommand('runInTerminal.select-selection',
			sendSelectionToTerminal,
		),
		vscode.commands.registerTextEditorCommand('runInTerminal.active-file',
		    sendActiveFileToTerminal,
		),
	];
	context.subscriptions.push(...disposables);
}

export default function deactivate() {}

/**
 * Gets the command to execute based on the file extension.
 * @param fileName The full name of the file.
 * @returns The command string to execute, or undefined if no command is found.
 */
function getCommandForFile(fileName: string): string | undefined {
    const extension = path.extname(fileName).toLowerCase();

    // Get the command map from user settings.
    const config = vscode.workspace.getConfiguration('runInTerminal');
    const commandMap = config.get<{[key: string]: string}>('commandMap');

    if (!commandMap) {
        // This should not happen if defaults are set in package.json, but as a fallback.
        vscode.window.showWarningMessage("Run In Terminal: commandMap not found in settings.");
        return undefined;
    }

    return commandMap[extension];
}

async function sendActiveFileToTerminal(): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage("No active editor found.");
		return;
	}

	const document = editor.document;
	const filePath = document.uri.fsPath;

	if (document.isUntitled) {
		vscode.window.showInformationMessage("Please save the file first.");
		return;
	}

    const command = getCommandForFile(filePath);
    const extension = path.extname(filePath);

    if (!command) {
        vscode.window.showInformationMessage(`No command configured for "${extension}" files. You can add it in the 'runInTerminal.commandMap' setting.`);
        return;
    }

	const fileDirectory = path.dirname(filePath);
	const fileName = path.basename(filePath);

    let terminal = vscode.window.activeTerminal;
    if (!terminal) {
        terminal = vscode.window.createTerminal("Run In Terminal");
    }
    terminal.show();

    // Normalize the path to ensure it's correct for the OS, and wrap in quotes.
    terminal.sendText(`cd "${path.normalize(fileDirectory)}"`);
    // Wrap the filename in quotes to handle spaces.
    terminal.sendText(`${command} "${fileName}"`);
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
	const activeTerminal = vscode.window.activeTerminal;
	if (activeTerminal) {
		return activeTerminal;
	}

	const options: vscode.TerminalOptions = {
		env: env,
	};
	return vscode.window.createTerminal(options);
}