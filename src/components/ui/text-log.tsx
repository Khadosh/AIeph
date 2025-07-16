import Image from "next/image";

export default function TextLogo() {
  return (
    <div className="flex items-baseline mx-auto w-fit px-2">
      <Image src="/favicon.svg" alt="AIeph" width={32} height={32} />
      <p className="text-2xl font-bold mt-0">Ieph</p>
    </div>
  )
}