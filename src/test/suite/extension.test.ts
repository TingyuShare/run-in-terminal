import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension", () => {
	vscode.window.showInformationMessage("Start all tests.");

	async function updateTypeInEcho(value: boolean) {
		return vscode.workspace
			.getConfiguration()
			.update(
				"vscode-send-to-terminal.typeInEcho",
				value,
				vscode.ConfigurationTarget.Global,
			);
	}

	async function updateSingleOrMergedValueVariableName(value: string) {
		return vscode.workspace
			.getConfiguration()
			.update(
				"vscode-send-to-terminal.singleOrMergedValueVariableName",
				value,
				vscode.ConfigurationTarget.Global,
			);
	}

	test("sendActiveFileToTerminal()", async () => {
		await updateTypeInEcho(false);
		await updateSingleOrMergedValueVariableName("SOME_KEY_FOR_VALUE");
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
	});
});
