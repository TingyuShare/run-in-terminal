import * as assert from "assert";
import * as vscode from "vscode";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";

suite("Extension", () => {
	vscode.window.showInformationMessage("Start all tests.");

	async function updateTypeInEcho(value: boolean) {
		return vscode.workspace
			.getConfiguration()
			.update(
				"vscode-send-to-terminal.typeInEcho",
				value,
				vscode.ConfigurationTarget.Workspace,
			);
	}

	async function updateSingleOrMergedValueVariableName(value: string) {
		return vscode.workspace
			.getConfiguration()
			.update(
				"vscode-send-to-terminal.singleOrMergedValueVariableName",
				value,
				vscode.ConfigurationTarget.Workspace,
			);
	}

	async function updateIndexedSelectionVariableNameFormat(value: string) {
		return vscode.workspace
			.getConfiguration()
			.update(
				"vscode-send-to-terminal.indexedSelectionVariableNameFormat",
				value,
				vscode.ConfigurationTarget.Workspace,
			);
	}

	async function makeTemporaryWorkspace() {
		const tempDir = fs.mkdtempSync(
			path.join(os.tmpdir(), "vscode-send-to-terminal-test-"),
		);
		const ws: vscode.WorkspaceFolder = {
			index: 0,
			name: "Test workspace",
			uri: vscode.Uri.file(tempDir),
		};
		const result = new Promise((resolve, reject) => {
			vscode.workspace.onDidChangeWorkspaceFolders((e) => {
				if (e.added.length) {
					resolve(tempDir);
				}
			});
		});
		assert(vscode.workspace.updateWorkspaceFolders(0, undefined, ws));
		return result;
	}

	test("sendActiveFileToTerminal()", async () => {
		const tempDir = await makeTemporaryWorkspace();
		await updateTypeInEcho(false);
		await updateSingleOrMergedValueVariableName("SOME_KEY_FOR_VALUE");
		await updateIndexedSelectionVariableNameFormat("SOME_INDEXED_FORMAT_{0}");
		const doc = await vscode.workspace.openTextDocument({
			content: "Hello World!",
		});
		await vscode.window.showTextDocument(doc);
		const terminal: vscode.Terminal | undefined =
			await vscode.commands.executeCommand(
				"vscode-send-to-terminal.send-active-file",
			);

		assert(terminal);
		const co = terminal.creationOptions;
		assert("env" in co && co.env);
		assert("SOME_KEY_FOR_VALUE" in co.env);
		assert.strictEqual(co.env["SOME_KEY_FOR_VALUE"], "Hello World!");
		assert("SOME_INDEXED_FORMAT_0" in co.env);
		assert.strictEqual(co.env["SOME_INDEXED_FORMAT_0"], "Hello World!");
	});
});
