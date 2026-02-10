import { fromPrimitiveSource } from '../core/block-helper'
import { block } from '../core/composer'
import type { PrimitiveSource } from '../core/types'

export type PenColorParam =
  | 'color'
  | 'saturation'
  | 'brightness'
  | 'transparency'

export const eraseAll = () => {
  return block('pen_clear', {})
}

export const clear = eraseAll

export const stamp = () => {
  return block('pen_stamp', {})
}

export const penDown = () => {
  return block('pen_penDown', {})
}

export const penUp = () => {
  return block('pen_penUp', {})
}

export const setPenColorTo = (color: PrimitiveSource<string>) => {
  return block('pen_setPenColorToColor', {
    inputs: {
      COLOR: fromPrimitiveSource(color),
    },
  })
}

export const setPenColorToColor = setPenColorTo

export const changePenColorParamBy = (
  param: PrimitiveSource<PenColorParam>,
  value: PrimitiveSource<number>,
) => {
  return block('pen_changePenColorParamBy', {
    inputs: {
      COLOR_PARAM: fromPrimitiveSource(param),
      VALUE: fromPrimitiveSource(value),
    },
  })
}

export const setPenColorParamTo = (
  param: PrimitiveSource<PenColorParam>,
  value: PrimitiveSource<number>,
) => {
  return block('pen_setPenColorParamTo', {
    inputs: {
      COLOR_PARAM: fromPrimitiveSource(param),
      VALUE: fromPrimitiveSource(value),
    },
  })
}

export const changePenSizeBy = (size: PrimitiveSource<number>) => {
  return block('pen_changePenSizeBy', {
    inputs: {
      SIZE: fromPrimitiveSource(size),
    },
  })
}

export const setPenSizeTo = (size: PrimitiveSource<number>) => {
  return block('pen_setPenSizeTo', {
    inputs: {
      SIZE: fromPrimitiveSource(size),
    },
  })
}

export const setPenShadeToNumber = (shade: PrimitiveSource<number>) => {
  return block('pen_setPenShadeToNumber', {
    inputs: {
      SHADE: fromPrimitiveSource(shade),
    },
  })
}

export const changePenShadeBy = (shade: PrimitiveSource<number>) => {
  return block('pen_changePenShadeBy', {
    inputs: {
      SHADE: fromPrimitiveSource(shade),
    },
  })
}

export const setPenHueToNumber = (hue: PrimitiveSource<number>) => {
  return block('pen_setPenHueToNumber', {
    inputs: {
      HUE: fromPrimitiveSource(hue),
    },
  })
}

export const changePenHueBy = (hue: PrimitiveSource<number>) => {
  return block('pen_changePenHueBy', {
    inputs: {
      HUE: fromPrimitiveSource(hue),
    },
  })
}
