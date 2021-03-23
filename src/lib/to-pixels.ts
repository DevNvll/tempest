const toPixels = (value: string | number) => {
  if (typeof value === 'number') {
    return `${value}px`
  }

  return value
}

export default toPixels
