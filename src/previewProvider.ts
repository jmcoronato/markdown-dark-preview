import * as vscode from 'vscode';
import * as path from 'path';
import MarkdownIt from 'markdown-it';

// @ts-ignore
const hljs = require('highlight.js');
// @ts-ignore
const taskLists = require('markdown-it-task-lists');

export class MarkdownPreviewProvider {
    private panels: Map<string, vscode.WebviewPanel> = new Map();
    private md: MarkdownIt;
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.md = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            breaks: true,
            highlight: (str: string, lang: string) => {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(str, { language: lang }).value;
                    } catch (__) { }
                }
                return ''; // use external default escaping
            }
        });

        // Agregar plugin para checkboxes
        this.md.use(taskLists, { enabled: true, label: true, labelAfter: true });
    }

    public showPreview(document: vscode.TextDocument) {
        const uri = document.uri.toString();

        // Si ya existe un panel para este documento, mostrarlo
        if (this.panels.has(uri)) {
            const panel = this.panels.get(uri)!;
            panel.reveal(vscode.ViewColumn.Beside);
            this.updatePreviewContent(panel, document);
            return;
        }

        // Crear un nuevo panel
        const panel = vscode.window.createWebviewPanel(
            'markdownPreview',
            `Preview: ${path.basename(document.fileName)}`,
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.dirname(document.fileName))]
            }
        );

        this.panels.set(uri, panel);

        // Actualizar el contenido
        this.updatePreviewContent(panel, document);

        // Limpiar cuando el panel se cierre
        panel.onDidDispose(() => {
            this.panels.delete(uri);
        });
    }

    public updatePreview(document: vscode.TextDocument) {
        const uri = document.uri.toString();
        const panel = this.panels.get(uri);

        if (panel) {
            this.updatePreviewContent(panel, document);
        }
    }

    private updatePreviewContent(panel: vscode.WebviewPanel, document: vscode.TextDocument) {
        const markdown = document.getText();
        const html = this.md.render(markdown);
        panel.webview.html = this.getHtmlContent(html, document);
    }

    private getHtmlContent(markdownHtml: string, document: vscode.TextDocument): string {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
    <title>Markdown Preview</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
            font-size: 16px;
            line-height: 1.6;
            color: #e6edf3;
            background-color: #0d1117;
            padding: 20px;
            max-width: 980px;
            margin: 0 auto;
        }

        /* Encabezados */
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
            color: #e6edf3;
        }

        h1 {
            font-size: 2em;
            padding-bottom: 0.3em;
            border-bottom: 1px solid #21262d;
        }

        h2 {
            font-size: 1.5em;
            padding-bottom: 0.3em;
            border-bottom: 1px solid #21262d;
        }

        h3 {
            font-size: 1.25em;
        }

        h4 {
            font-size: 1em;
        }

        h5 {
            font-size: 0.875em;
        }

        h6 {
            font-size: 0.85em;
            color: #8b949e;
        }

        /* Párrafos */
        p {
            margin-top: 0;
            margin-bottom: 16px;
        }

        /* Enlaces */
        a {
            color: #58a6ff;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        /* Listas */
        ul, ol {
            margin-top: 0;
            margin-bottom: 16px;
            padding-left: 2em;
        }

        li {
            margin-bottom: 0.25em;
        }

        li > p {
            margin-bottom: 0.25em;
        }

        /* Código */
        code {
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            background-color: rgba(110, 118, 129, 0.4);
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
            color: #e6edf3;
        }

        pre {
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            background-color: #161b22;
            border-radius: 6px;
            margin-bottom: 16px;
        }

        pre code {
            display: block;
            padding: 0;
            margin: 0;
            overflow: visible;
            line-height: inherit;
            word-wrap: normal;
            background-color: transparent;
            border: 0;
        }

        /* Blockquotes */
        blockquote {
            padding: 0 1em;
            color: #8b949e;
            border-left: 0.25em solid #3b434b;
            margin-bottom: 16px;
        }

        blockquote > :first-child {
            margin-top: 0;
        }

        blockquote > :last-child {
            margin-bottom: 0;
        }

        /* Tablas */
        table {
            border-spacing: 0;
            border-collapse: collapse;
            margin-bottom: 16px;
            width: 100%;
            overflow: auto;
        }

        table th {
            font-weight: 600;
            padding: 6px 13px;
            border: 1px solid #3b434b;
            background-color: #161b22;
        }

        table td {
            padding: 6px 13px;
            border: 1px solid #3b434b;
        }

        table tr {
            background-color: #0d1117;
            border-top: 1px solid #21262d;
        }

        table tr:nth-child(2n) {
            background-color: #161b22;
        }

        /* Línea horizontal */
        hr {
            height: 0.25em;
            padding: 0;
            margin: 24px 0;
            background-color: #21262d;
            border: 0;
        }

        /* Imágenes */
        img {
            max-width: 100%;
            height: auto;
            background-color: transparent;
            border-radius: 6px;
        }

        /* Strong y Em */
        strong {
            font-weight: 600;
        }

        em {
            font-style: italic;
        }

        /* Checkbox */
        input[type="checkbox"] {
            margin: 0 0.5em 0 0;
            vertical-align: middle;
            width: 16px;
            height: 16px;
            cursor: pointer;
        }

        .task-list-item {
            list-style-type: none;
            margin-left: -1.5em;
        }

        .task-list-item input[type="checkbox"] {
            margin-right: 0.5em;
        }

        /* Strikethrough */
        del {
            text-decoration: line-through;
        }

        /* Syntax Highlighting - GitHub Dark Theme */
        .hljs {
            display: block;
            overflow-x: auto;
            padding: 0;
            color: #e6edf3;
            background: transparent;
        }

        .hljs-comment,
        .hljs-quote {
            color: #8b949e;
            font-style: italic;
        }

        .hljs-keyword,
        .hljs-selector-tag,
        .hljs-addition {
            color: #ff7b72;
        }

        .hljs-number,
        .hljs-string,
        .hljs-meta .hljs-meta-string,
        .hljs-literal,
        .hljs-doctag,
        .hljs-regexp {
            color: #a5d6ff;
        }

        .hljs-title,
        .hljs-section,
        .hljs-name,
        .hljs-selector-id,
        .hljs-selector-class {
            color: #d2a8ff;
        }

        .hljs-attribute,
        .hljs-attr,
        .hljs-variable,
        .hljs-template-variable,
        .hljs-class .hljs-title,
        .hljs-type {
            color: #79c0ff;
        }

        .hljs-symbol,
        .hljs-bullet,
        .hljs-subst,
        .hljs-meta,
        .hljs-meta .hljs-keyword,
        .hljs-selector-attr,
        .hljs-selector-pseudo,
        .hljs-link {
            color: #79c0ff;
        }

        .hljs-built_in,
        .hljs-deletion {
            color: #ffa657;
        }

        .hljs-formula {
            background-color: #8b949e;
        }

        .hljs-emphasis {
            font-style: italic;
        }

        .hljs-strong {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="markdown-body">
        ${markdownHtml}
    </div>
</body>
</html>`;
    }

    public dispose() {
        this.panels.forEach(panel => panel.dispose());
        this.panels.clear();
    }
}

