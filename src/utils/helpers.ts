import { createGlobalState, useDark } from "@vueuse/core"

export const generateHTML = (payload: Record<string, any>, isDark?: boolean) => {
    return `<html class="${isDark ? 'dark' : ''}">
        <head>
            <style id="playground-style">${payload.css}</style>
            <script type="module" id="playground-script">
                ${payload.javascript}
            </\script>
            <script>
                window.addEventListener('message', function(event) {
                    console.log(event.data)
                    if (event.data === 'theme-dark') {
                        document.documentElement.classList.add('dark')
                    } else if (event.data === 'theme-light') {
                        document.documentElement.classList.remove('dark')
                    } else if (event.data.html !== undefined) {
                        console.log('html updateds', event.data.html)
                        document.body.innerHTML = event.data.html
                    } else if (event.data.css !== undefined) {
                        document.querySelector('#playground-style').innerHTML = event.data.css
                    } else if (event.data.javascript !== undefined) {
                        console.log('js updated')
                        document.querySelector('#playground-script').innerHTML = event.data.javascript
                    } else {
                        console.log('Unknown message received')
                    }
                })
            </\script>
        </head>
        <body>
            ${payload.html}
        </body>
    </html`
}

export const useDarkGlobal = createGlobalState(
    () => useDark(),
)
  
export const initialEditorValue = {
    "html": "<div id=\"app\" class=\"min-h-screen bg-gray-300 dark:bg-gray-600 py-6 flex flex-col sm:py-12 space-y-4\">\n    <div v-for=\"(post, index) in posts\" :key=\"index\" class=\"max-w-2xl mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800\">\n        <img class=\"object-cover w-full h-64\" :src=\"post.cover\" alt=\"Article\">\n\n        <div class=\"p-6\">\n            <div>\n                <span class=\"text-xs font-medium text-blue-600 uppercase dark:text-blue-400\">Product</span>\n                <a href=\"#\" class=\"block mt-2 text-2xl font-semibold text-gray-800 dark:text-white hover:text-gray-600 hover:underline\" v-text=\"post.title\"></a>\n                <p class=\"mt-2 text-sm text-gray-600 dark:text-gray-400\" v-text=\"post.body\"></p>\n            </div>\n\n            <div class=\"mt-4\">\n                <div class=\"flex items-center\">\n                    <div class=\"flex items-center\">\n                        <img class=\"object-cover h-10 rounded-full\" :src=\"post.avatar\" alt=\"Avatar\">\n                        <a href=\"#\" class=\"mx-2 font-semibold text-gray-700 dark:text-gray-200\" v-text=\"post.name\"></a>\n                    </div>\n                    <span class=\"mx-1 text-xs text-gray-600 dark:text-gray-300\">21 SEP 2015</span>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>",
    "javascript": "import { setup as twindSetup } from 'https://cdn.skypack.dev/twind/shim'\nimport { \n    createApp, \n    ref \n} from 'https://cdn.skypack.dev/vue@next/dist/vue.esm-browser.js'\nimport faker from 'https://cdn.skypack.dev/faker'\n\ntwindSetup({\n    darkMode: 'class'\n})\n\nconst generateFakePosts = (count) => {\n    return [...Array(count).keys()].map(() => ({\n        name: faker.name.findName(),\n        avatar: faker.image.avatar(),\n        cover: faker.image.image(),\n        title: faker.lorem.words(5),\n        body: faker.lorem.sentences(5)\n    }))\n}\n\nconst App = {\n    setup() {\n        const posts = ref(generateFakePosts(10))\n\n        return {\n            posts\n        }\n    }\n}\n\ncreateApp(App).mount('#app')",
    "css": ""
}