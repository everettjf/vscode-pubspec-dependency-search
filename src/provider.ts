import * as vscode from 'vscode';

function readDocumentLines(document: vscode.TextDocument) {
    console.log('filename = ' + document.fileName);

    // ignore other file
    if (! document.fileName.endsWith('pubspec.yaml')) {
        return [];
    }

    let inDependencyScope = false;

    return new Array(document.lineCount).fill('')
    .map((line,idx) => document.lineAt(idx))
    .filter( line => {
        const {text} = line;

        // at lease one space
        if (text.startsWith(' ') && inDependencyScope) {
            if (!text.includes(':')) {
                return false;
            }

            return true;
        }

        if (text.startsWith('dependencies:') && text.trim() === 'dependencies:') {
            inDependencyScope = true;
        } else if (text.startsWith('dev_dependencies:') && text.trim() === 'dev_dependencies:') {
            inDependencyScope = true;
        } else {
            inDependencyScope = false;
        }
        return false;
    });
}

export default class PubspecCodeLensProvider implements vscode.CodeLensProvider {
    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
        let lines = readDocumentLines(document);
        console.log(lines.map((line,idx) => line.text));
        return lines.map( line => {
            let packageName = line.text.trim().split(':')[0].trim();

            return new vscode.CodeLens(line.range, {
                title: `Search ${packageName} in Dart Packages`,
                command: 'extension.pubspecDependencySearchWithParameter',
                arguments: [packageName]
            });
        });
    }
}

