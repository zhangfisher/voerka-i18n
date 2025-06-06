import pxtorpx from 'postcss-pxtorpx-pro';

const config = {
  plugins: [
    {
      postcssPlugin: 'postcss-import-css-to-wxss',
      AtRule: {
        import: (atRule) => {
          atRule.params = atRule.params.replace('.css', '.wxss');
        },
      },
    },
    pxtorpx({ transform: (x) => x }),
  ],
};

export default config;
