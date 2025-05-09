# osmia

- [features](#features)
- [requirements](#requirements)
- [extension settings](#extension-settings)
- [known issues](#known-issues)
- [release notes](#release-notes)

The official Visual Studio Code extension for [osmia](https://github.com/jkutkut/osmia).

## Features

- Syntax highlighting.
- Command to run the current files as a Osmia program.
- Automatic detection of Osmia and context files.
- Configurable execution engine.
- Fully customizable settings.
- Built-in wasm engine.

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
