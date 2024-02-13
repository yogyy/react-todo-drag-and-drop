import React from "react";

export const ChevronDownIcon = (
  props: React.SVGProps<SVGSVGElement> & {
    size?: number | string;
  }
) => {
  const { className, size = 20, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      {...rest}>
      <path
        d="M8.292 10.293a1.009 1.009 0 000 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 000-1.419.987.987 0 00-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 00-1.406 0z"
        fill="currentColor"
        fillRule="evenodd"></path>
    </svg>
  );
};