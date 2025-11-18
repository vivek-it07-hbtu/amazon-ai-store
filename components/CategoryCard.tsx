import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface CategoryCardProps {
  title: string;
  image: string;
  link: string;
  items?: string[];
}

export default function CategoryCard({ title, image, link, items }: CategoryCardProps) {
  return (
    <Link href={link}>
      <div className="bg-white p-4 h-full hover:shadow-xl transition-shadow cursor-pointer">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="relative h-72 mb-3 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded hover:scale-105 transition-transform duration-300"
          />
        </div>
        {items && items.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            {items.slice(0, 4).map((item, index) => (
              <div key={index} className="text-gray-700 hover:text-amazon-orange">
                {item}
              </div>
            ))}
          </div>
        )}
        <div className="text-amazon-blue hover:text-amazon-orange text-sm flex items-center">
          Shop now <FiArrowRight className="ml-1" />
        </div>
      </div>
    </Link>
  );
}
