import Reveal from './Reveal'

function SectionHeader({ eyebrow, title, text }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-4xl text-center md:mb-14">
      <p className="mb-3 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">{text}</p>}
    </Reveal>
  )
}

export default SectionHeader