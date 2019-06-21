module.exports = {
    "env": {
        "browser": true,
        "jquery": true,
        "es6": true,
        "node": true,
        "commonjs": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
      "no-console":0,
      "no-unused-vars": "off",
    },
    "parser": "babel-eslint",
};