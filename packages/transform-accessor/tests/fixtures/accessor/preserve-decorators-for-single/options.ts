export default {
  comments: false,
  presets: [require('@babel/preset-typescript')],
  plugins: [
    [
      require('@ast-decorators/core'),
      {
        exclude: {
          nodeModules: ['decorators'],
        },
        transformers: {
          '@ast-decorators/transform-accessor': {
            singleAccessorDecorators: {
              nodeModules: ['decorators']
            },
          },
        },
      },
    ],
    [require('@babel/plugin-syntax-decorators'), {legacy: true}],
    require('@babel/plugin-syntax-class-properties'),
  ],
};
