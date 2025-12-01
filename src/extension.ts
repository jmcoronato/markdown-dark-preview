import * as vscode from 'vscode';
import { MarkdownPreviewProvider } from './previewProvider';

let previewProvider: MarkdownPreviewProvider | undefined;

export function activate(context: vscode.ExtensionContext): void {
    console.log('Markdown Dark Previewer está activo');

    previewProvider = new MarkdownPreviewProvider(context);

    // Registrar el comando para abrir el preview
    const disposable = vscode.commands.registerCommand(
        'markdown-dark-previewer.preview',
        () => {
            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showErrorMessage('No hay editor activo');
                return;
            }

            if (editor.document.languageId !== 'markdown') {
                vscode.window.showErrorMessage('El archivo actual no es un archivo Markdown');
                return;
            }

            previewProvider?.showPreview(editor.document);
        }
    );

    context.subscriptions.push(disposable);

    // Observar cambios en los archivos al guardar
    const fileWatcher = vscode.workspace.onDidSaveTextDocument((document) => {
        if (document.languageId === 'markdown') {
            previewProvider?.updatePreview(document);
        }
    });

    context.subscriptions.push(fileWatcher);

    // Observar cambios en tiempo real (con debouncing automático en updatePreview)
    const liveWatcher = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === 'markdown') {
            previewProvider?.updatePreview(event.document);
        }
    });

    context.subscriptions.push(liveWatcher);
}

export function deactivate(): void {
    previewProvider?.dispose();
    previewProvider = undefined;
}
