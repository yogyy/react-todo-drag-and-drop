import React from "react";

export const ChecboxIcon = ({
  className,
  size = 16,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  size?: number | string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      version="1.1"
      className={className}
      {...props}>
      <defs />
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd">
        <g id="task">
          <g
            id="Task"
            transform="translate(1.000000, 1.000000)">
            <rect
              id="Rectangle-36"
              fill="#4BADE8"
              x="0"
              y="0"
              width="14"
              height="14"
              rx="2"
            />
            <g
              id="Page-1"
              transform="translate(4.000000, 4.500000)"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round">
              <path
                d="M2,5 L6,0"
                id="Stroke-1"
              />
              <path
                d="M2,5 L0,3"
                id="Stroke-3"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
