import { cssVariables } from '@/css-variables';
import {
  $isTextNode,
  $setState,
  createState,
  type LexicalNode,
} from '@payloadcms/richtext-lexical/lexical';

const FONT_SIZE_REGEX = /font-size:\s*([^;]+)/;

const fontSizeState = createState('fontSize', {
  parse: Number,
});

/**
 * Extract font size from a given string of CSS styles.
 * @param style CSS styles to extract the font size from.
 * @param defaultSize Default font size to return if no font size is found.
 * @returns Extracted font size, or default size if no font size is found.
 */
export const extractFontSize = (style: string, defaultSize: string): string => {
  const match = style.match(FONT_SIZE_REGEX);

  if (match) {
    const fontSizeValue = match[1].trim();

    // Find the corresponding key in cssVariables.prose that matches the font size value
    const fontSizeKey = Object.keys(cssVariables.prose).find(
      (key) => cssVariables.prose[key as keyof typeof cssVariables.prose] === fontSizeValue,
    );

    if (fontSizeKey) {
      return fontSizeKey;
    }
  }

  return defaultSize;
};

/**
 * Remove the font size from a given string of CSS styles.
 * @param style CSS styles to remove the font size from.
 * @returns CSS styles without the font size.
 */
export const removeFontSizeFromStyle = (style: string): string => {
  return style.replace(FONT_SIZE_REGEX, '').trim();
};

/**
 * Create a new style string with a font size, removes any existing font size to prevent conflicts.
 * @param currentStyle Current CSS styles to modify
 * @param fontSize Font size to apply
 * @returns New style string with a font size
 */
export const createStyleWithFontSize = (currentStyle: string, fontSize: string): string => {
  const realFontSize = cssVariables.prose[fontSize as keyof typeof cssVariables.prose];
  const styleWithoutFontSize = removeFontSizeFromStyle(currentStyle);

  return styleWithoutFontSize
    ? `${styleWithoutFontSize} font-size: ${realFontSize};`
    : `font-size: ${realFontSize};`;
};

/**
 * Get the font size from the first text node in the array
 * @param nodes Array of Lexical nodes to search for a text node
 * @param defaultSize Default font size to return if no text node is found
 * @param selectionStyle Optional CSS style string to use if no text node is found
 * @returns Font size of the first text node, or default size if none found
 */
export const getFirstTextNodeFontSize = (
  nodes: LexicalNode[],
  defaultSize: string,
  selectionStyle?: string,
): string => {
  for (const node of nodes) {
    if ($isTextNode(node)) {
      return extractFontSize(node.getStyle(), defaultSize);
    }
  }

  if (selectionStyle) {
    return extractFontSize(selectionStyle, defaultSize);
  }

  return defaultSize;
};

/**
 * Apply a font size to an array of Lexical nodes.
 * @param nodes Array of Lexical nodes to apply the font size to
 * @param fontSize Font size to apply
 * @param sizes Array of available font sizes
 */
export const applyFontSizeToNodes = (
  nodes: LexicalNode[],
  fontSize: string,
  sizes: string[],
): void => {
  nodes.forEach((node) => {
    if ($isTextNode(node)) {
      const newStyle = createStyleWithFontSize(node.getStyle(), fontSize);
      node.setStyle(newStyle);
      $setState(node, fontSizeState, sizes.indexOf(fontSize));
    }
  });
};
