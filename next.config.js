module.exports = {
  future: {
    webpack5: true,
    strictPostcssConfiguration: true
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.extensions = ['.web.js', ...config.resolve.extensions]

    return config
  }
}
