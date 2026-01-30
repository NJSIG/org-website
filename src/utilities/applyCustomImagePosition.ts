type CustomPosition = {
  xPos: string | null | undefined;
  yPos: string | null | undefined;
  hVar: `--${string}`;
  vVar: `--${string}`;
};

type customPositions = Record<`--${string}`, string>;

export const applyCustomPosition = (customPositions: CustomPosition[]): React.CSSProperties => {
  const styles: customPositions = {};

  customPositions.forEach(({ xPos, yPos, hVar, vVar }) => {
    styles[hVar] = xPos || 'center';
    styles[vVar] = yPos || 'bottom';
  });

  return styles as React.CSSProperties;
};
