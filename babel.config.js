export default {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }] // for React 17+
  ],
  plugins: [
    // Transform import.meta to a global variable for Jest
    function () {
      return {
        visitor: {
          MetaProperty(path) {
            if (
              path.node.meta.name === 'import' &&
              path.node.property.name === 'meta'
            ) {
              path.replaceWithSourceString('global.importMeta');
            }
          },
        },
      };
    },
  ],
};