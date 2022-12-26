import * as vscode from 'vscode'
import PubspecCodeLensProvider from './provider'

function openPackageUrl(packageName: string) {
  // https://pub.dev/packages/name
  let packageUrl =
    vscode.workspace.getConfiguration().get('search.baseUrl') +
    'packages/' +
    encodeURI(packageName)
  vscode.env.openExternal(vscode.Uri.parse(packageUrl))
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      'yaml',
      new PubspecCodeLensProvider()
    )
  )

  let commandSearch = vscode.commands.registerTextEditorCommand(
    'extension.viewDependencyWithParameter',
    async (
      textEditor: vscode.TextEditor,
      edit: vscode.TextEditorEdit,
      packageName: string
    ) => {
      openPackageUrl(packageName)
    }
  )
  context.subscriptions.push(commandSearch)

  let commandInput = vscode.commands.registerCommand(
    'extension.viewDependency',
    () => {
      // The code you place here will be executed every time your command is executed
      vscode.window.showInputBox().then((text) => {
        if (text === undefined || text === '') {
          console.log('no input')
          return
        }
        console.log('input : ' + text)
        openPackageUrl(text)
      })
    }
  )
  context.subscriptions.push(commandInput)
}

// this method is called when your extension is deactivated
export function deactivate() {}
