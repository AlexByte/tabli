module.exports = function (api) {
  api.cache(true);
  const presets = [
      "@babel/preset-react",
      "@babel/preset-flow",
      [ "@babel/preset-env", {
          "targets": "last 2 Chrome versions"
        }
      ]
    ];
  const plugins = [
    [ "@babel/plugin-proposal-class-properties", { "loose": false }],
    [ "emotion", { "sourceMap": true, "autoLabel": true } ],
    "@babel/plugin-transform-runtime"
  ];
  return {
    presets,
    plugins
  };
}
