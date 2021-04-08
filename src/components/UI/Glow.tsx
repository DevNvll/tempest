import * as uuid from 'uuid'

export default function Glow({
  color1 = '#5013b2',
  color2 = '#ff7105',
  ...props
}) {
  const idA = uuid.v4()
  const idB = uuid.v4()
  return (
    <svg
      fill="none"
      height="930"
      viewBox="0 0 1541 930"
      width="1541"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <filter
        id={idA}
        color-interpolation-filters="sRGB"
        filterUnits="userSpaceOnUse"
        height="879.021"
        width="1275.09"
        x="132.533"
        y="25.6831"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          in="SourceGraphic"
          in2="BackgroundImageFix"
          mode="normal"
          result="shape"
        />
        <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="124" />
      </filter>
      <linearGradient
        id={idB}
        gradientUnits="userSpaceOnUse"
        x1="380.558"
        x2="1159.32"
        y1="468.057"
        y2="450.153"
      >
        <stop
          offset="0"
          stop-color={color1}
          style={{
            transition: 'all .4s ease'
          }}
        />
        <stop
          offset="1"
          stop-color={color2}
          style={{
            transition: 'fill .4s ease'
          }}
        />
      </linearGradient>
      <g filter={`url(#${idA})`}>
        <path
          d="m1159.6 462.33c-2.43-105.756-178.799-190.207-393.925-188.625-215.125 1.582-387.548 88.596-385.117 194.352 2.432 105.757 178.797 190.207 393.923 188.625 215.125-1.581 387.549-88.596 385.119-194.352z"
          fill={`url(#${idB})`}
          opacity=".4"
        />
      </g>
    </svg>
  )
}
