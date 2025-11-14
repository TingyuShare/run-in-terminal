# Run Script in Terminal

This Visual Studio Code extension allows you to quickly send scripts from your editor to a terminal. You can send either a selected piece of code or the entire content of the active file.

## Features

*   **Run Selection**: Execute only the text you have selected in the active editor.
*   **Run Active File**: Execute the entire content of the currently opened file.
*   **Smart Terminal Reuse**: The extension will always try to use the currently active terminal. If no terminal is active, it will open a new one for you. This keeps your workspace clean and avoids creating unnecessary terminal windows.

## Usage

You can run commands in two ways:

1.  **Command Palette**:
    *   Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac).
    *   Type and select one of the following commands:
        *   `RunInTerminal: Selected selection`
        *   `RunInTerminal: Active file`

2.  **Editor Context Menu**:
    *   Right-click anywhere in the editor.
    *   Choose one of the commands from the context menu:
        *   `RunInTerminal: Selected selection`
        *   `RunInTerminal: Active file`

## Demo

The following animation demonstrates the extension's primary features: running the entire file content and running a selected piece of code in the VS Code integrated terminal.

![Usage Demo](images/demo.gif)

## License

[MIT](LICENSE)