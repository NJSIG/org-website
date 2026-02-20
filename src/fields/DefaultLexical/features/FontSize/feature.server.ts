import { createServerFeature } from '@payloadcms/richtext-lexical';
import { DEFAULT_SIZE, DEFAULT_SIZES } from './defaults';
import { FontSizeFeatureProps, FontSizesSchema } from './types';

export const FontSizeFeature = createServerFeature<
  FontSizeFeatureProps,
  FontSizeFeatureProps,
  FontSizeFeatureProps
>({
  key: 'fontSize',
  feature: ({ props }) => {
    const enabledSizes = props?.enabledSizes || DEFAULT_SIZES;
    const defaultSize = props?.defaultSize || DEFAULT_SIZE;

    // Validate default size
    if (!enabledSizes.includes(defaultSize)) {
      console.warn(
        `Lexical FontSizeFeature: The defaultSize "${defaultSize}" is not included in the enableSizes array. Using the first size in the enableSizes array as the default size: ${enabledSizes[0]}.`,
      );
    }

    // Validate the provided sizes against the FontSizeSchema. If any invalid sizes are found, log a warning and fall back to the default sizes.
    if (!FontSizesSchema.safeParse(enabledSizes).success) {
      console.warn(
        `Lexical FontSizeFeature: One or more of the provided sizes "${enabledSizes}" are invalid. Using default sizes: ${DEFAULT_SIZES.join(', ')}.`,
      );

      return {
        ClientFeature:
          '@/fields/DefaultLexical/features/FontSize/feature.client#FontSizeFeatureClient',
        clientFeatureProps: {
          enableSizes: DEFAULT_SIZES,
          defaultSize: DEFAULT_SIZE,
        },
      };
    }

    return {
      ClientFeature:
        '@/fields/DefaultLexical/features/FontSize/feature.client#FontSizeFeatureClient',
      clientFeatureProps: {
        enableSizes: enabledSizes,
        defaultSize: enabledSizes.includes(defaultSize) ? defaultSize : enabledSizes[0],
      },
    };
  },
});
