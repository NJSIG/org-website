import { Field, GroupField } from "payload";

export type LinkAppearances = 'default'; // TODO: add more appearances

export const appearanceOptions: Record<LinkAppearances, { label: string, value: string }> = {
    default: {
        label: 'Default (Text Link)',
        value: 'default'
    }
};

type LinkType = (options?: {
    appearances?: LinkAppearances[] | false,
    disableLabel?: boolean,
    overrides?: Partial<GroupField>
}) => Field;

export const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
    const linkResult: GroupField = {
        name: 'link',
        type: 'group',
        admin: {
            hideGutter: true,
        },
        fields: [
            {
                type: 'row',
                fields: [
                    {
                        name: 'type',
                        type: 'radio',
                        options: [
                            {
                                label: 'Internal Link',
                                value: 'reference'
                            },
                            {
                                label: 'Custom URL',
                                value: 'custom'
                            }
                        ],
                        defaultValue: 'reference',
                        admin: {
                            layout: 'horizontal',
                            width: '50%',
                        },
                    },
                    {
                        name: 'newTab',
                        label: 'Open in New Tab',
                        type: 'checkbox',
                        admin: {
                            style: {
                                alignSelf: 'flex-end',
                            },
                            width: '50%',
                        },
                    }
                ]
            }
        ]
    }

    const linkTypes: Field[] = [
        {
            name: 'reference',
            label: 'Document to Link To'
            type: 'relationship',
            relationTo: ['pages'], // TODO: add other collections as needed
            admin: {
                condition: (_, siblingData) => siblingData?.type === 'reference'
            }
        }
    ]
}