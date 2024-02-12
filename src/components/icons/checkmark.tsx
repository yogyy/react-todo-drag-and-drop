import React from "react";

export const CheckmarkIcon = (
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
      role="presentation"
      {...rest}>
      <path
        d="M6.735 12.322a1 1 0 00-1.47 1.356l3.612 3.919c.537.526 1.337.526 1.834.03l.364-.359a2335.638 2335.638 0 003.939-3.883l.04-.04a492.598 492.598 0 003.658-3.643 1 1 0 00-1.424-1.404 518.42 518.42 0 01-3.64 3.625l-.04.04a2049.114 2049.114 0 01-3.775 3.722l-3.098-3.363z"
        fill="currentColor"></path>
    </svg>
  );
};
