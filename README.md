# osmia

The official Visual Studio Code extension for [osmia](https://github.com/jkutkut/osmia).

Osmia is a clean, expressive templating language library implemented in Rust.
It is designed for building dynamic content in any programming language, allowing developers
to generate HTML, SQL, JSON, configuration files, or code in various languages.

![Code example of an osmia script that formats the output of a docker inspect command](https://raw.githubusercontent.com/Jkutkut/osmia-vscode/refs/heads/main/res/docker-inspect-code.png)

## How to use

Create a osmia file by creating a file with the extension `.osmia` or by selecting the osmia language from the command pallete.

An button with the osmia icon will appear in the editor to run the current file.
You can also invoke the command with right click or by running the following command from the command palette:

```
>osmia: run
```

Optionally, a context file (json) can be added to inject variables.
You will be prompted to select the file if none is detected.

## Features

- Syntax highlighting.
- Intellisense for variables in context.
- Configurable execution engine.
- Fully customizable settings.
- Built-in wasm engine.
- Command to run the current files as a Osmia program.
- Automatic detection of Osmia and context files.

## Requirements

A built-in osmia engine comes with the extension. A custom engine can be used instead by changing the configuration.

## Extension Settings

- `osmia.executionTimeout.enabled`: Enable execution timeout. Code will be aborted if execution takes longer than `osmia.executionTimeout.time`.
- `osmia.executionTimeout.time`: Execution timeout in milliseconds. If the execution takes longer than this, it will be aborted.
- `osmia.executionTimeout.warnTime`: Warning timeout in milliseconds. If the execution takes longer than this, a notification will be shown. The execution can be aborted using this notification.
- `osmia.osmiaEngine.native`: Use the extension's wasm builtin implementation. If set to `false`, the `osmia.osmiaEngine.osmiaCmd` will be used.
- `osmia.osmiaEngine.osmiaCmd`: The command to invoke osmia on the system. Only used if `osmia.osmiaEngine.native` is set to `false`.

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for details.

## Known Issues

- Testing not implemented, yet.
