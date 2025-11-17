

import DisplayImage from '../gallery/DisplayImage'
import Availability from './Availability'
import Status from './Status'
import { Badge } from '../ui/badge'
import { Bath, Bed, Car, MapPin, Ruler } from 'lucide-react'
import { PropertyTypes } from '@/types/property.types'
import { formatCurrency } from '@/utils'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export default function ClientCard({ property }: { property: PropertyTypes }) {
  const router = useRouter();


  return <div
    className="flex gap-2 flex-col hover:shadow hover:bg-red-50"
    onClick={() => router.push("/properties/" + property.id)}
  >

    <div className='relative'>
      <DisplayImage
        src={property.images[0]}
        alt={property.title}
        className="w-full h-30 sm:h-56 object-cover rounded-md"
        useRemove={false}
      />
      <div className="absolute top-2 left-2 flex gap-3">
        <Availability placeViewing="CLIENT" availability={property.availability} />
        <Status status={property.status} />
        <Badge>{property.type}</Badge>
      </div>
    </div>

   
    <div className="p-2">
      {/* Title */}
      <h3 className="text-xl font-semibold max-w-full truncate">
        {property.title}
      </h3>
      {/* Price */}
      <div className="flex gap-2 text-base flex-1 items-center">
        <p className="text-primary font-semibold">{formatCurrency(property.price)}</p> / <span className='text-sm text-muted-foreground'>{property.priceFrequency}</span>
      </div>

      {/* Location */}
      <div className='flex items-center gap-1 mt-1'>
        <MapPin className="w-4 h-4 text-muted-foreground font-medium" />
        <span className='text-sm'>{property.area}, {property.city}, {property.state}</span>
      </div>

      {/* Description */}
      <div className='flex items-center gap-1 mt-1'>
        <p className="text-sm font-normal text-gray-600 max-w-full truncate py-2">
          {property.description}
        </p>
      </div>


      {/* Details */}
      <div className="flex flex-wrap justify-end items-center gap-3 mt-4">
        {property.bedrooms && (
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <Bed size={16} className="text-muted-foreground font-medium" />
            <span>{property.bedrooms}</span>
          </div>
        )}
        {property.bathrooms && (
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <Bath size={16} className="text-muted-foreground font-medium" />
            <span>{property.bathrooms}</span>
          </div>
        )}
        {property.parkingSpaces && (
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <Car size={16} className="text-muted-foreground font-medium" />
            <span>{property.parkingSpaces}</span>
          </div>
        )}
        {property.size && (
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <Ruler size={16} className="text-muted-foreground font-medium" />
            <span>{property.size} {property.sizeUnit}</span>
          </div>
        )}
      </div>
    </div>

    {/* View button */}
    <div className='flex-1 flex items-end'>
      <Button
        variant="outline"
        className="w-full py-2 border border-primary text-primary cursor-pointer rounded-md hover:bg-primary hover:text-white transition"
        onClick={(e) => {
          e.stopPropagation();
          router.push("/properties/" + property.id)
        }}
      >
        View Details
      </Button>
    </div>
  </div>
}
