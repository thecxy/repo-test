
import { SVGAttributes } from 'react';

interface Props extends SVGAttributes<SVGSVGElement> {
  color?: string;
}

const Left = ({ color, ...rest } : Props) => {
  return (
    <svg
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="40506"
      width="1em"
      height="1em"
      {...rest}
    >
      <path
        d="M693.76 830.464a41.152 41.152 0 0 1 0 54.272 32.704 32.704 0 0 1-49.344 0l-314.24-345.6a41.152 41.152 0 0 1 0-54.272l314.24-345.6a32.704 32.704 0 0 1 49.344 0 41.152 41.152 0 0 1 0 54.272L404.288 512l289.472 318.464z"
        p-id="40507"
        fill={color || 'currentColor'}
      ></path>
    </svg>
  );
};
export default Left;
