type CustomPosition = {
  enabled: boolean | null | undefined;
  xPos: string | null | undefined;
  yPos: string | null | undefined;
  hVar: `--${string}`;
  vVar: `--${string}`;
};

type customPositions = Record<`--${string}`, string>;

export const applyCustomPosition = (customPositions: CustomPosition[]): React.CSSProperties => {
  const styles: customPositions = {};

  customPositions.forEach(({ enabled, xPos, yPos, hVar, vVar }) => {
    if (!enabled) {
      return;
    }

    if (xPos != null) {
      styles[hVar] = xPos;
    }

    if (yPos != null) {
      styles[vVar] = yPos;
    }
  });

  return styles as React.CSSProperties;
};
