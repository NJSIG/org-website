type CustomPosition = {
  xPos: string | null | undefined;
  yPos: string | null | undefined;
  hVar: `--${string}`;
  vVar: `--${string}`;
};

type CustomPositionStyles = Record<`--${string}`, string>;

export const applyCustomPosition = (positions: CustomPosition[]): React.CSSProperties => {
  const styles: CustomPositionStyles = {};

  positions.forEach(({ xPos, yPos, hVar, vVar }) => {
    styles[hVar] = xPos || 'center';
    styles[vVar] = yPos || 'bottom';
  });

  return styles as React.CSSProperties;
};
