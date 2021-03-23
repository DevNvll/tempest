module.exports = {
  plugins: {
    [process.env.NODE_ENV === 'production'
      ? 'tailwindcss'
      : '@tailwindcss/jit']: {},
    autoprefixer: {}
  }
}
