import Image from 'next/image'
import headerlogo from "../../public/images/logo_svg.svg"
import footerlogo from "../../public/images/logo_white.svg"
import Link from 'next/link'

export default function CompanyLogo({ location = "Header" }: { location: "Header" | "Footer" }) {
    return <Link href="/">
        {
            location === "Header" ?
                <Image
                    src={headerlogo}
                    alt="Agbara Badagry Property Center Logo"
                    className="object-contain w-auto h-[64px] relative"                
                /> :
                <Image
                    src={footerlogo}
                    alt="Agbara Badagry Property Center Logo"
                    className="object-contain w-auto h-[64px] relative"
                />

        }
    </Link>
};
