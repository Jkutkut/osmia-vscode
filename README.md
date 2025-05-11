# osmia

The official Visual Studio Code extension for [osmia](https://github.com/jkutkut/osmia).

Osmia is a clean, expressive templating language library implemented in Rust.
It is designed for building dynamic content in any programming language, allowing developers
to generate HTML, SQL, JSON, configuration files, or code in various languages.

![Code example of an osmia script that formats the output of a docker inspect command](https://raw.githubusercontent.com/Jkutkut/osmia-vscode/refs/heads/main/res/docker-inspect-code.png)

## How to use

Invoke the command by opening the command pallete and typing:

```
>osmia: run
```

In order to run the extension command, a osmia file is needed. Optionally, a context file (json) can be added to inject variables.
- If no osmia file is open and visible on the editor, you will be prompted to select one.
- If no context file is provided, you will be prompted to select one or run without context.

## Features

- Syntax highlighting.
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
