import * as os from "os";
import * as assert from "assert";
import { TerminalData } from "../../model";

suite("Model/TerminalData", () => {
	test("texts property returns provided texts", () => {
		assert.deepStrictEqual(new TerminalData([]).texts, []);
		assert.deepStrictEqual(new TerminalData(["a", "b"]).texts, ["a", "b"]);
	});

	test("mergeTexts()", () => {
		const eol = os.EOL;
		const sut = (texts: string[]) => new TerminalData(texts).mergeTexts();

		assert.strictEqual(sut([]), "");
		assert.strictEqual(sut([""]), eol);
		assert.strictEqual(sut(["", ""]), eol + eol);
		assert.strictEqual(sut(["a"]), "a" + eol);
		assert.strictEqual(sut(["\n"]), "\n" + eol);
		assert.strictEqual(sut(["\n", ""]), `\n${eol}${eol}`);
		assert.strictEqual(sut(["\n", "\n"]), `\n${eol}\n${eol}`);
		assert.strictEqual(sut(["a", "b"]), `a${eol}b${eol}`);
		assert.strictEqual(sut(["a", "", "b"]), `a${eol}${eol}b${eol}`);
	});
});
