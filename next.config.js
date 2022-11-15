module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  basePath: '',
  images: {
    domains: ['images.unsplash.com'],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true }
    config.module.rules.push({
      test: /\.mdx/,
      use: [
        {loader: 'babel-loader', options: {}},
        {
          loader: '@mdx-js/loader',
          options: {}
        }
      ]
    })
    return config
  },
};
