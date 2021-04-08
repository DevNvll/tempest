let makeShadow = (name, rgb) => {
  let obj = {}

  obj[name + '-xs'] = `0 0 0 1px rgba(${rgb}, 0.05)`
  obj[name + '-xs'] = `0 0 0 1px rgba(${rgb}, 0.05)`
  obj[name + '-sm'] = `0 1px 2px 0 rgba(${rgb}, 0.05)`
  obj[name] = `0 1px 3px 0 rgba(${rgb}, 0.1), 0 1px 2px 0 rgba(${rgb}, 0.06)`
  obj[
    name + '-md'
  ] = `0 4px 6px -1px rgba(${rgb}, 0.1), 0 2px 4px -1px rgba(${rgb}, 0.06)`
  obj[
    name + '-lg'
  ] = `25px 25px 35px 6px rgba(${rgb}, 0.1), 0 5px 30px -5px rgba(${rgb}, 0.8)`
  obj[
    name + '-xl'
  ] = `0 25px 35px -5px rgba(${rgb}, 0.1), 0 5px 30px -5px rgba(${rgb}, 0.6)`
  obj[name + '-2xl'] = `0 55px 80px -12px rgba(${rgb}, 0.6)`
  obj[name + '-inner'] = `inset 0 2px 4px 0 rgba(${rgb}, 0.06)`
  return obj
}

module.exports = {
  mode: 'jit',
  purge: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}'
  ],
  prefix: '',
  important: false,
  separator: ':',
  darkMode: 'media',
  theme: {
    extend: {
      boxShadow: {
        ...makeShadow('cool-gray', '71, 85, 104'),
        ...makeShadow('gray', '75, 85, 98'),
        ...makeShadow('red', '223, 39, 44'),
        ...makeShadow('orange', '207, 57, 24'),
        ...makeShadow('yellow', '158, 88, 28'),
        ...makeShadow('green', '16, 122, 87'),
        ...makeShadow('teal', '13, 116, 128'),
        ...makeShadow('blue', '29, 100, 236'),
        ...makeShadow('indigo', '87, 81, 230'),
        ...makeShadow('purple', '125, 59, 236'),
        ...makeShadow('pink', '213, 34, 105')
      },
      gridTemplateColumns: {
        'fill-40': 'repeat(auto-fit, 10rem)'
      },
      colors: {
        transparent: 'transparent',
        black: '#000',
        white: '#fff',
        background: {
          100: '#fff'
        },
        gray: {
          DEFAULT: '#202222',
          50: '#114113112',
          100: '#575c5e',
          200: '#404547',
          300: '#363b3d',
          400: '#2b2e30',
          500: '#242729',
          600: '#4C566A',
          700: '#1B1C1F',
          800: '#17171A',
          900: '#0F0F0F'
        },
        primary: {
          100: '#dcd0f0',
          200: '#b9a1e0',
          300: '#9671d1',
          400: '#7342c1',
          500: '#5013b2',
          600: '#400f8e',
          700: '#300b6b',
          800: '#200847',
          900: '#100424'
        },
        secondary: {
          100: '#D8E5FB',
          200: '#B3CBF7',
          300: '#88A7E7',
          400: '#6585D0',
          500: '#3859B2',
          600: '#284499',
          700: '#1C3180',
          800: '#112167',
          900: '#0A1655'
        },
        success: {
          100: '#E9FEE1',
          200: '#CEFDC3',
          300: '#ADFAA4',
          400: '#8DF58C',
          500: '#67EF72',
          600: '#4BCD61',
          700: '#33AC53',
          800: '#208A46',
          900: '#13723D'
        },
        warning: {
          100: '#FEF2D0',
          200: '#FDE2A1',
          300: '#FBCD72',
          400: '#F8B84E',
          500: '#F49716',
          600: '#D17810',
          700: '#AF5C0B',
          800: '#8D4407',
          900: '#753204'
        },
        danger: {
          100: '#FCE7DE',
          200: '#FACBBF',
          300: '#F1A59B',
          400: '#E3817F',
          500: '#D2565E',
          600: '#B43E51',
          700: '#972B45',
          800: '#791B3A',
          900: '#641034'
        },
        silver: {
          100: '#EFF8FC',
          200: '#DFEFF9',
          300: '#C9DFEE',
          400: '#637993',
          500: '#2B384B',
          600: '#1F2B40',
          700: '#152036',
          800: '#0D162B',
          900: '#080E24'
        }
      }
    }
  },
  variants: {
    accessibility: ['responsive', 'focus'],
    alignContent: ['responsive'],
    alignItems: ['responsive'],
    alignSelf: ['responsive'],
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundColor: ['responsive', 'hover', 'focus'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borderCollapse: ['responsive'],
    borderColor: ['responsive', 'hover', 'focus'],
    borderRadius: ['responsive'],
    borderStyle: ['responsive'],
    borderWidth: ['responsive'],
    boxShadow: ['responsive', 'hover', 'focus'],
    boxSizing: ['responsive'],
    cursor: ['responsive'],
    display: ['responsive'],
    fill: ['responsive'],
    flex: ['responsive'],
    flexDirection: ['responsive'],
    flexGrow: ['responsive'],
    flexShrink: ['responsive'],
    flexWrap: ['responsive'],
    float: ['responsive'],
    clear: ['responsive'],
    fontFamily: ['responsive'],
    fontSize: ['responsive'],
    fontSmoothing: ['responsive'],
    fontStyle: ['responsive'],
    fontWeight: ['responsive', 'hover', 'focus'],
    height: ['responsive'],
    inset: ['responsive'],
    justifyContent: ['responsive'],
    letterSpacing: ['responsive'],
    lineHeight: ['responsive'],
    listStylePosition: ['responsive'],
    listStyleType: ['responsive'],
    margin: ['responsive'],
    maxHeight: ['responsive'],
    maxWidth: ['responsive'],
    minHeight: ['responsive'],
    minWidth: ['responsive'],
    objectFit: ['responsive'],
    objectPosition: ['responsive'],
    opacity: ['responsive', 'hover', 'focus'],
    order: ['responsive'],
    outline: ['responsive', 'focus'],
    overflow: ['responsive'],
    padding: ['responsive'],
    placeholderColor: ['responsive', 'focus'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    stroke: ['responsive'],
    strokeWidth: ['responsive'],
    tableLayout: ['responsive'],
    textAlign: ['responsive'],
    textColor: ['responsive', 'hover', 'focus'],
    textDecoration: ['responsive', 'hover', 'focus'],
    textTransform: ['responsive'],
    userSelect: ['responsive'],
    verticalAlign: ['responsive'],
    visibility: ['responsive'],
    whitespace: ['responsive'],
    width: ['responsive'],
    wordBreak: ['responsive'],
    zIndex: ['responsive'],
    gap: ['responsive'],
    gridAutoFlow: ['responsive'],
    gridTemplateColumns: ['responsive'],
    gridColumn: ['responsive'],
    gridColumnStart: ['responsive'],
    gridColumnEnd: ['responsive'],
    gridTemplateRows: ['responsive'],
    gridRow: ['responsive'],
    gridRowStart: ['responsive'],
    gridRowEnd: ['responsive'],
    transform: ['responsive'],
    transformOrigin: ['responsive'],
    scale: ['responsive', 'hover', 'focus'],
    rotate: ['responsive', 'hover', 'focus'],
    translate: ['responsive', 'hover', 'focus'],
    skew: ['responsive', 'hover', 'focus'],
    transitionProperty: ['responsive'],
    transitionTimingFunction: ['responsive'],
    transitionDuration: ['responsive']
  },
  corePlugins: {},
  plugins: [require('@tailwindcss/custom-forms')]
}
