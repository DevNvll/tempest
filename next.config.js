module.exports = {
  future: {
    webpack5: true,
    strictPostcssConfiguration: true
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.extensions = ['.web.js', ...config.resolve.extensions]

    return config
  },
  serverRuntimeConfig: {
    AWS_ACCESS_KEY_ID_TEMPEST: process.env.AWS_ACCESS_KEY_ID_TEMPEST,
    AWS_SECRET_ACCESS_KEY_TEMPEST: process.env.AWS_SECRET_ACCESS_KEY_TEMPEST
  }
}
