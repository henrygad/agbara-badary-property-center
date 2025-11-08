import Image from 'next/image'
import headerlogo from "../../public/images/logo.svg"
import footerlogo from "../../public/images/logo_white.svg"
import Link from 'next/link'

export default function CompanyLogo({ location = "Header" }: { location: "Header" | "Footer" }) {
    return <Link href="/">
        {
            location === "Header" ?
                <span className='flex gap-1 w-auto h-auto'>
                    <Image
                        src={headerlogo}
                        alt="Agbara Badagry Property Center Logo"
                        className="object-contain"
                        width={50}
                        height={50}
                    />
                    <span className='flex justify-end flex-1'>
                        <span className='block mt-2'>
                            <h3 className='text-primary text-[14px] font-bold tracking-wide text-shadow-2xs text-shadow-accent'>AGBARA BADAGRY</h3>
                            <p className='pl-[0.5px] text-[12px] -mt-1 font-medium text-gray-500 tracking-wider text-shadow-accent'>property center</p>
                        </span>
                    </span>
               </span> :
                <Image
                    src={footerlogo}
                    alt="Agbara Badagry Property Center Logo"
                    className="object-contain w-auto h-[64px] relative"
                />

        }
    </Link>
};
