import { LogoMark } from './logo-mark'
import { Reveal } from './reveal'
import { SmartImage } from './smart-image'

export function IntroSection() {
  return (
    <section id="intro" aria-labelledby="intro-heading" className="relative">
      <h1 id="intro-heading" className="sr-only">
        門仲どらやき どら山 總本鋪
      </h1>

      <div className="relative h-svh w-full">
        <SmartImage
          src="images/03.jpg"
          alt="銅板の上に並ぶ、焼き色のついたどらやきの皮"
          eager
          className="absolute inset-0 h-full w-full"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/45" />
        <Reveal delay={1400} className="absolute inset-0 flex items-center justify-center">
          <LogoMark size={128} />
        </Reveal>
      </div>

      <div className="flex min-h-svh flex-col items-center justify-center gap-12 px-4 pb-16 pt-24">
        <SmartImage
          src="images/10.jpg"
          alt="銅板で焼き上げた、どら山のどらやき"
          eager
          className="aspect-[4/5] w-[min(68vw,340px)] md:w-[min(30vw,380px)]"
        />
        <Reveal delay={600}>
          <LogoMark size={80} />
        </Reveal>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-16 px-4 pb-40 pt-24 md:grid-cols-3 md:gap-x-12 md:px-10 md:pb-56">
        <SmartImage
          src="images/01.jpg"
          alt="焼き上がったどらやきの皮"
          parallax={0.06}
          className="aspect-[2/3] w-full"
        />
        <div className="flex flex-col items-center gap-24 md:order-none md:mt-56">
          <Reveal className="hidden md:block">
            <LogoMark size={64} />
          </Reveal>
          <SmartImage
            src="images/30.jpg"
            alt="店頭の銅板で手焼きする様子"
            parallax={0.1}
            className="mt-32 aspect-[2/3] w-full md:mt-0"
          />
        </div>
        <Reveal className="col-span-2 flex justify-center md:hidden">
          <LogoMark size={64} />
        </Reveal>
        <SmartImage
          src="images/31.jpg"
          alt="つぶあんを挟んだどらやき"
          parallax={0.04}
          className="col-span-2 mx-auto aspect-[2/3] w-2/3 md:col-span-1 md:mt-24 md:w-full"
        />
      </div>
    </section>
  )
}
