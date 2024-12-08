import Image from "next/image";

interface MainCardProps {
  title: string;
  subtitle: string;
  firstSrc: string;
  secondSrc: string;
  firstAlt: string;
  secondAlt: string;
  className?: string;
}

export default function MainCard({
  title,
  subtitle,
  firstSrc,
  secondSrc,
  firstAlt,
  secondAlt,
  className,
}: MainCardProps) {
  return (
    <div className="flex w-full flex-col space-y-6">
      <div className="relative h-16 w-16 rounded-full border-[1px] border-lightblue bg-white p-1">
        <div className="bg-smooth flex h-full w-full items-center justify-center rounded-full">
          <Image
            width={32}
            height={32}
            src={firstSrc}
            alt={firstAlt}
            className="h-8 w-8"
          />
        </div>
        <div
          className={`absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center ${className} bg-blue p-0.5`}
        >
          <Image
            width={32}
            height={32}
            src={secondSrc}
            alt={secondAlt}
            className="h-4 w-4"
          />
        </div>
      </div>
      <div className="space-y-4">
        <h6 className="text-2xl font-semibold">{title}</h6>
        <p className="text-black/70">{subtitle}</p>
      </div>
    </div>
  );
}
