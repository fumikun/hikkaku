import type * as sb3 from '@pnsk-lab/sb3-types'

export const svg = (id: string): sb3.Costume =>
  ({
    name: id,
    dataFormat: 'svg',
    assetId: id,
    md5ext: `${id}.svg`,
  }) as const
export const png = (id: string) =>
  ({
    dataFormat: 'png',
    assetId: id,
  }) as const
