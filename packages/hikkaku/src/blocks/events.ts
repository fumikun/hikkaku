import type { Input } from 'sb3-types'
import { fromPrimitiveSource } from '../core/block-helper'
import { attachStack, block } from '../core/composer'
import type { PrimitiveSource } from '../core/types'

export const whenFlagClicked = (stack?: () => void) => {
  const res = block('event_whenflagclicked', {
    topLevel: true,
  })
  attachStack(res.id, stack)
  return res
}

export const whenKeyPressed = (key: string, stack?: () => void) => {
  const res = block('event_whenkeypressed', {
    topLevel: true,
    fields: {
      KEY_OPTION: [key, null],
    },
  })
  attachStack(res.id, stack)
  return res
}

export const whenThisSpriteClicked = (stack?: () => void) => {
  const res = block('event_whenthisspriteclicked', {
    topLevel: true,
  })
  attachStack(res.id, stack)
  return res
}

export const whenStageClicked = (stack?: () => void) => {
  const res = block('event_whenstageclicked', {
    topLevel: true,
  })
  attachStack(res.id, stack)
  return res
}

export const whenBackdropSwitchesTo = (
  backdrop: string,
  stack?: () => void,
) => {
  const res = block('event_whenbackdropswitchesto', {
    topLevel: true,
    fields: {
      BACKDROP: [backdrop, null],
    },
  })
  attachStack(res.id, stack)
  return res
}

export const whenBroadcastReceived = (
  broadcast: string,
  stack?: () => void,
) => {
  const res = block('event_whenbroadcastreceived', {
    topLevel: true,
    fields: {
      BROADCAST_OPTION: [broadcast, null],
    },
  })
  attachStack(res.id, stack)
  return res
}

export const whenTouchingObject = (target: string, stack?: () => void) => {
  const res = block('event_whentouchingobject', {
    topLevel: true,
    fields: {
      TOUCHINGOBJECTMENU: [target, null],
    },
  })
  attachStack(res.id, stack)
  return res
}

export const whenGreaterThan = (
  menu: string,
  value: PrimitiveSource<number>,
  stack?: () => void,
) => {
  const res = block('event_whengreaterthan', {
    topLevel: true,
    inputs: {
      VALUE: fromPrimitiveSource(value),
    },
    fields: {
      WHENGREATERTHANMENU: [menu, null],
    },
  })
  attachStack(res.id, stack)
  return res
}

export const broadcast = (message: PrimitiveSource<string>) => {
  return block('event_broadcast', {
    inputs: {
      BROADCAST_INPUT:
        typeof message === 'string'
          ? // @ts-expect-error type issue
            ([1, [11, message]] as Input)
          : fromPrimitiveSource(message),
    },
  })
}

export const broadcastAndWait = (message: PrimitiveSource<string>) => {
  return block('event_broadcastandwait', {
    inputs: {
      BROADCAST_INPUT: fromPrimitiveSource(message),
    },
  })
}
