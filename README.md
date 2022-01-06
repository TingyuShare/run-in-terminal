# Send to Terminal (VS Code Extension)

Send text selection(s) or entire active file as environment variables into a new shell/terminal. With the default configurations, the text sent is assigned to an environment variable named `$VALUE`.

## Examples

### Send selection to a new terminal

1. Make any selection in the editor.
2. Open commands list (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>).
3. Type in `Send to Terminal: Send selection` and press <kbd>Enter</kbd> or <kbd>Return</kbd>. A new terminal opens with the command template:

   ```sh
   echo "$VALUE" | cat
   ```

4. Modify the command as you wish.

⚠️ If there were more than one selection (e.g., by having multi-cursor selections or by selecting all occurrences of a text/pattern), you can access them via `$VALUE_0`, `$VALUE_1`, and so on.

### Send active file to a new terminal

1. Bring the tab you need to send to terminal. It's **not required** to save it beforehand.
2. Open commands list (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>).
3. Type in `Send to Terminal: Send active file` and press <kbd>Enter</kbd> or <kbd>Return</kbd>. A new terminal opens with the command template:

   ```sh
   echo "$VALUE" | cat
   ```

4. Modify the command as you wish.

## Contribution

Please feel free to contribute by submitting PR or opening new issues on the repository and discuss problem or new features. 🍏
