module.exports = {
    content: [
        "content/**/*.md",
        "components/**/*.{vue,js,ts}",
        "layouts/**/*.vue",
        "pages/**/*.vue",
        "App.{js,ts,vue}",
        "app.{js,ts,vue}",
        "Error.{js,ts,vue}",
        "error.{js,ts,vue}",
        "content/**/*.md",
      ],
    darkMode: "selector",
    safelist: [
        'text-red',
        'text-green'
    ],

    theme: {
        extend: {
            colors:{
                'default-text': "var(--default-text)",
                'bg-color': "var(--bg-color)",
                'highlight-text': "var(--highlight-text)",
                'bold-text': "var(--bold-text)",    
                red: "var(--red)",
                green: "var(--green)",


            }
        }
    }
}