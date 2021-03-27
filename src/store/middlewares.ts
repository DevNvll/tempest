import produce from 'immer'

const immer = (config) => (set, get, api) =>
  config((fn) => set(produce(fn)), get, api)

export { immer }
