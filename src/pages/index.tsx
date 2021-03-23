import rangeMap from '@lib/range-map'
import { NextSeo } from 'next-seo'

export default function Index() {
  return (
    <>
      <NextSeo
        title="Exsign Studio"
        description="Uma equipe de designers e desenvolvedores de ponta com o objetivo de trazer a experiência e design que seus usuários merecem."
      />
      <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gray-200 ">
        {rangeMap(3, (i) => {
          return <h1 className="text-4xl font-semibold" key={i}>Hello World</h1>
        })}
      </div>
    </>
  )
}
