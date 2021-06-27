import { createGlobalState, useDark } from "@vueuse/core"

export const generateHTML = (payload: Record<string, any>, isDark?: boolean) => {
    return `<html class="${isDark ? 'dark' : ''}">
        <head><style>${payload.css}</style></head>
        <body>
            ${payload.html}
            <script>
                window.addEventListener('message', function(event) {
                    if (event.data === 'theme-dark') {
                        document.documentElement.classList.add('dark')
                    } else if (event.data === 'theme-light') {
                        document.documentElement.classList.remove('dark')
                    }
                })
            </\script>
            <script type="module">${payload.javascript}</\script>
        </body>
    </html`
}

export const useDarkGlobal = createGlobalState(
    () => useDark(),
)
  