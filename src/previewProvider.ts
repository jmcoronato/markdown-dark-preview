import * as vscode from 'vscode';
import * as path from 'path';
import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';

// Tipos para dependencias sin tipos oficiales
interface HighlightJs {
    getLanguage(lang: string): boolean;
    highlight(code: string, options: { language: string }): { value: string };
}

interface MarkdownItState {
    tokens: Token[];
}

interface MarkdownItCore {
    ruler: {
        push(name: string, fn: (state: MarkdownItState) => void): void;
    };
}

// Type assertion helper para acceder a la propiedad core
type MarkdownItWithCore = MarkdownIt & {
    core: MarkdownItCore;
};

// Tipos para mensajes del webview
interface WebviewMessage {
    command: 'revealLine' | 'updateContent';
    line?: number;
    endLine?: number;
    text?: string;
    content?: string;
}

// Constantes
const DEBOUNCE_DELAY = 150; // ms para debouncing de actualizaciones
const PREVIEW_PANEL_ID = 'markdownPreview';

// HTML template separado para mejor mantenibilidad
const HTML_TEMPLATE = `<!DOCTYPE html>
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
    <div class="markdown-body" id="markdown-content">
        {CONTENT}
    </div>
    <script>
        (function() {
            const vscode = acquireVsCodeApi();
            const contentDiv = document.getElementById('markdown-content');
            
            // Escuchar mensajes para actualizar contenido
            window.addEventListener('message', function(event) {
                const message = event.data;
                if (message.command === 'updateContent' && message.content !== undefined) {
                    if (contentDiv) {
                        contentDiv.innerHTML = message.content;
                    }
                }
            });
            
            document.addEventListener('dblclick', function(event) {
                let node = event.target;
                while (node) {
                    if (node.getAttribute && node.getAttribute('data-line')) {
                        const line = parseInt(node.getAttribute('data-line'), 10);
                        const endLineAttr = node.getAttribute('data-line-end');
                        const endLine = endLineAttr ? parseInt(endLineAttr, 10) : undefined;
                        
                        const selection = window.getSelection();
                        const text = selection && selection.toString().trim() || '';

                        vscode.postMessage({
                            command: 'revealLine',
                            line: line,
                            endLine: endLine,
                            text: text
                        });
                        return;
                    }
                    node = node.parentNode;
                }
            });
        })();
    </script>
</body>
</html>`;

export class MarkdownPreviewProvider {
    private readonly panels: Map<string, vscode.WebviewPanel> = new Map();
    private md: MarkdownIt | null = null;
    private readonly context: vscode.ExtensionContext;
    private readonly updateTimers: Map<string, NodeJS.Timeout> = new Map();
    private readonly contentCache: Map<string, string> = new Map();
    private readonly htmlBaseCache: string;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        // Pre-cachear el HTML base sin contenido (optimización: no regenerar en cada actualización)
        this.htmlBaseCache = HTML_TEMPLATE.replace('{CONTENT}', '');
    }

    private getMarkdownRenderer(): MarkdownIt {
        // Lazy loading: crear el renderer solo cuando se necesite
        if (this.md) {
            return this.md;
        }

        // Importar dependencias con tipos seguros (solo cuando se necesiten)
        const hljs: HighlightJs = require('highlight.js');
        const taskLists = require('markdown-it-task-lists');

        const md = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            breaks: true,
            highlight: (str: string, lang: string): string => {
                if (!lang || !hljs.getLanguage(lang)) {
                    return '';
                }
                try {
                    return hljs.highlight(str, { language: lang }).value;
                } catch (error) {
                    // Silenciosamente fallar al highlighting
                    return '';
                }
            }
        });

        // Agregar plugin para checkboxes
        md.use(taskLists, { enabled: true, label: true, labelAfter: true });

        // Inyectar números de línea para sincronización
        this.injectLineNumbers(md as MarkdownItWithCore);

        this.md = md;
        return md;
    }

    private injectLineNumbers(md: MarkdownItWithCore): void {
        md.core.ruler.push('add_line_numbers', (state: MarkdownItState) => {
            for (const token of state.tokens) {
                if (token.map) {
                    token.attrPush(['data-line', String(token.map[0])]);
                    token.attrPush(['data-line-end', String(token.map[1])]);
                }
            }
        });
    }

    public showPreview(document: vscode.TextDocument): void {
        const uri = document.uri.toString();

        // Si ya existe un panel para este documento, mostrarlo
        const existingPanel = this.panels.get(uri);
        if (existingPanel) {
            existingPanel.reveal(vscode.ViewColumn.Beside);
            this.updatePreviewContent(existingPanel, document);
            return;
        }

        // Crear un nuevo panel
        const panel = vscode.window.createWebviewPanel(
            PREVIEW_PANEL_ID,
            `Preview: ${path.basename(document.fileName)}`,
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.dirname(document.fileName))]
            }
        );

        // Configurar handler de mensajes del webview
        this.setupWebviewMessageHandler(panel, document);

        this.panels.set(uri, panel);

        // Mostrar el webview inmediatamente con HTML base vacío (más rápido)
        if (this.htmlBaseCache) {
            panel.webview.html = this.htmlBaseCache;
        }

        // Renderizar y actualizar el contenido de forma asíncrona
        setImmediate(() => {
            this.updatePreviewContent(panel, document);
        });

        // Limpiar cuando el panel se cierre
        panel.onDidDispose(() => {
            this.panels.delete(uri);
            this.updateTimers.delete(uri);
            this.contentCache.delete(uri);
        });
    }

    private setupWebviewMessageHandler(
        panel: vscode.WebviewPanel,
        document: vscode.TextDocument
    ): void {
        panel.webview.onDidReceiveMessage(
            (message: WebviewMessage) => {
                if (message.command === 'revealLine' && message.line !== undefined) {
                    this.revealLine(document, message.line, message.endLine, message.text);
                }
            },
            undefined,
            this.context.subscriptions
        );
    }

    public updatePreview(document: vscode.TextDocument): void {
        const uri = document.uri.toString();
        const panel = this.panels.get(uri);

        if (!panel) {
            return;
        }

        // Debounce para evitar actualizaciones excesivas
        const existingTimer = this.updateTimers.get(uri);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        const timer = setTimeout(() => {
            this.updateTimers.delete(uri);
            this.updatePreviewContent(panel, document);
        }, DEBOUNCE_DELAY);

        this.updateTimers.set(uri, timer);
    }

    private updatePreviewContent(
        panel: vscode.WebviewPanel,
        document: vscode.TextDocument
    ): void {
        try {
            const markdown = document.getText();
            const uri = document.uri.toString();

            // Cache simple: solo actualizar si el contenido cambió
            const cachedContent = this.contentCache.get(uri);
            if (cachedContent === markdown) {
                return;
            }

            // Obtener el renderer (lazy loading)
            const md = this.getMarkdownRenderer();

            // Renderizar markdown
            const html = md.render(markdown);

            // Si el panel ya tiene el HTML base cargado, usar postMessage para actualizar solo el contenido
            // Esto es mucho más rápido que reemplazar todo el HTML
            const currentHtml = panel.webview.html;
            if (currentHtml && currentHtml.includes('markdown-content')) {
                // Panel ya inicializado, actualizar solo el contenido
                panel.webview.postMessage({
                    command: 'updateContent',
                    content: html
                });
            } else {
                // Primera carga, establecer HTML completo
                const fullHtml = this.getHtmlContent(html);
                panel.webview.html = fullHtml;
            }

            this.contentCache.set(uri, markdown);
        } catch (error) {
            console.error('Error al actualizar el preview:', error);
            vscode.window.showErrorMessage('Error al actualizar el preview de Markdown');
        }
    }

    private revealLine(
        document: vscode.TextDocument,
        line: number,
        endLine?: number,
        text?: string
    ): void {
        try {
            const editor = vscode.window.visibleTextEditors.find(
                e => e.document.uri.toString() === document.uri.toString()
            );

            if (!editor) {
                return;
            }

            let targetLine = Math.max(0, Math.min(line, document.lineCount - 1));
            let targetCol = 0;

            // Si tenemos texto seleccionado, intentar encontrarlo dentro del bloque
            if (text && text.length > 0 && endLine !== undefined) {
                const searchEndLine = Math.min(endLine, document.lineCount);

                // Buscar el texto en el rango de líneas
                for (let i = targetLine; i < searchEndLine; i++) {
                    const lineText = document.lineAt(i).text;
                    const idx = lineText.indexOf(text);

                    if (idx !== -1) {
                        targetLine = i;
                        targetCol = idx;
                        break;
                    }
                }
            }

            const position = new vscode.Position(targetLine, targetCol);
            const range = new vscode.Range(position, position);

            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
        } catch (error) {
            console.error('Error al revelar línea:', error);
        }
    }

    private getHtmlContent(markdownHtml: string): string {
        return HTML_TEMPLATE.replace('{CONTENT}', markdownHtml);
    }

    public dispose(): void {
        // Limpiar todos los timers
        for (const timer of this.updateTimers.values()) {
            clearTimeout(timer);
        }
        this.updateTimers.clear();

        // Limpiar todos los paneles
        for (const panel of this.panels.values()) {
            panel.dispose();
        }
        this.panels.clear();
        this.contentCache.clear();
    }
}
