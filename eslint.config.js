export default [
  {
    files: ["js/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        caches: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Audio: "readonly",
        AudioContext: "readonly",
        alert: "readonly",
        confirm: "readonly",
        DOMParser: "readonly",
        Blob: "readonly",
        URL: "readonly",
        AbortController: "readonly",
        L: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
