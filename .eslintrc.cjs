module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:react-hooks/recommended" // react-hooks 推荐的 eslint 配置
  ],
  "overrides": [
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint",
    "react-hooks"
  ],
  "rules": {
    'indent': [ 2, 2 ], // 缩进2个空格
    "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": "warn", // 检查 effect 的依赖
    "react/jsx-uses-react": "off", // 单独使用 JSX 而无需引入 React
    "react/react-in-jsx-scope": "off", // 单独使用 JSX 而无需引入 React
    // "array-bracket-spacing": [ "error","always" ], // 中括号两侧空格
    "object-curly-spacing": [ "error","always" ], // 大括号两侧空格
    "space-before-blocks": 2,  // if function等的大括号之前需要有空格
    "space-infix-ops": 2,
  }
};
