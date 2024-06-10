module.exports = {
    content: [
        './src/**/*.{vue,js,ts,jsx,tsx}', 
      ],
    darkMode: "selector",
 

    theme: {
        extend: {
            colors:{
                'default-text': "var(--default-text)",
                'bg-color': "var(--bg-color)",
                'highlight-text': "var(--highlight-text)",
                'bold-text': "var(--bold-text)",  
                'muted-text': "var(--muted-text)",
                'highlight-red': "var(--red)",
                'highlight-green': "var(--green)",  
                "border-color": "var(--border-color)",
                'highlight-blue': "var(--blue)",
                'highlight-yellow': "var(--yellow)",
                'highlight-purple': "var(--purple)",
                'highlight-other': "var(--other)",
              


            }
        }
    }
}