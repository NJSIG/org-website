'use client'

import React from 'react'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import { Footer } from '@/payload-types'

export const GroupRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['navGroups']>[number]>()

  const label = data?.data?.label
    ? `Group ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.label}`
    : 'Row'

  return <div>{label}</div>
}
