import { CustomIconProps } from '.';

const CarCrash: React.FC<CustomIconProps> = ({ size = 24, className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m17 18 5-2.5-4.5-2 4.5-8-7.5 4.5.5-8-5.5 6L7 3.5 5 5" />
      <path d="M4.969 19.524a2 2 0 1 1 1.414 2.449 2 2 0 0 1-1.414-2.45l-2.898-.776" />
      <path d="m8.833 20.56 1.931.517c.58.155 1.07-.128 1.225-.707l.777-2.898c.232-.87-.237-1.823-.957-2.224a112 112 0 0 0-4.062-2.227 109 109 0 0 0-1.53-2.79c-.38-.517-.882-.962-1.558-1.143l-2.588-.693" />
    </svg>
  );
};

export default CarCrash;
