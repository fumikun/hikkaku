import { Project, type VariableReference } from 'hikkaku'
import { BALL_A, ROCKS } from 'hikkaku/assets'
import {
  add,
  and,
  broadcast,
  CREATE_CLONE_MYSELF,
  changeVariableBy,
  controlStartAsClone,
  createClone,
  deleteThisClone,
  divide,
  equals,
  eraseAll,
  forEach,
  forever,
  getKeyPressed,
  getVariable,
  goToFrontBack,
  gotoXY,
  gt,
  hide,
  ifThen,
  lt,
  mod,
  multiply,
  or,
  penDown,
  penUp,
  random,
  sayForSecs,
  setPenColorTo,
  setPenSizeTo,
  setRotationStyle,
  setSizeTo,
  setVariableTo,
  setX,
  setY,
  show,
  showVariable,
  subtract,
  touchingObject,
  turnRight,
  wait,
  whenBroadcastReceived,
  whenFlagClicked,
} from 'hikkaku/blocks'

const project = new Project()
const gameOverEvent = 'game-over'

const score = project.stage.createVariable('score', 0)
const gameOver = project.stage.createVariable('gameOver', 0)
const speed = project.stage.createVariable('speed', 1.6)
const playerX = project.stage.createVariable('playerX', 0)

const readVar = (variable: VariableReference) => getVariable(variable)

project.stage.run(() => {
  whenFlagClicked(() => {
    showVariable(score)
    setVariableTo(score, 0)
    setVariableTo(gameOver, 0)
    setVariableTo(speed, 1.6)
    setVariableTo(playerX, 0)

    forever(() => {
      ifThen(equals(readVar(gameOver), 0), () => {
        changeVariableBy(score, 1)
        setVariableTo(speed, add(1.6, divide(readVar(score), 260)))
      })
      wait(0.05)
    })
  })
})

const renderer = project.createSprite('renderer')
const roadShift = renderer.createVariable('roadShift', 0)
const stripeIndex = renderer.createVariable('stripeIndex', 1)
const nearDepth = renderer.createVariable('nearDepth', 0)
const farDepth = renderer.createVariable('farDepth', 0)
const stripeY1 = renderer.createVariable('stripeY1', 0)
const stripeY2 = renderer.createVariable('stripeY2', 0)

renderer.run(() => {
  whenFlagClicked(() => {
    hide()
    penUp()
    setVariableTo(roadShift, 0)

    forever(() => {
      eraseAll()

      ifThen(equals(readVar(gameOver), 0), () => {
        changeVariableBy(roadShift, multiply(readVar(speed), 1.4))
      })
      setVariableTo(roadShift, mod(readVar(roadShift), 120))

      setPenColorTo('#334155')
      setPenSizeTo(6)
      gotoXY(-34, 90)
      penDown()
      gotoXY(-210, -176)
      penUp()
      gotoXY(34, 90)
      penDown()
      gotoXY(210, -176)
      penUp()

      setPenColorTo('#facc15')
      forEach(stripeIndex, 12, () => {
        setVariableTo(
          nearDepth,
          mod(add(multiply(readVar(stripeIndex), 10), readVar(roadShift)), 120),
        )
        setVariableTo(farDepth, add(readVar(nearDepth), 7))

        setVariableTo(
          stripeY1,
          subtract(92, multiply(readVar(nearDepth), 2.35)),
        )
        setVariableTo(stripeY2, subtract(92, multiply(readVar(farDepth), 2.35)))

        setPenSizeTo(add(2, multiply(readVar(nearDepth), 0.08)))
        gotoXY(0, readVar(stripeY1))
        penDown()
        gotoXY(0, readVar(stripeY2))
        penUp()
      })

      wait(0.02)
    })
  })
})

const player = project.createSprite('player')
const vx = player.createVariable('vx', 0)

player.addCostume({
  ...BALL_A,
  name: 'player-ball',
})

player.run(() => {
  whenFlagClicked(() => {
    show()
    goToFrontBack('front')
    setRotationStyle('all around')
    setSizeTo(42)
    setVariableTo(vx, 0)
    setVariableTo(playerX, 0)
    setX(0)
    setY(-136)

    forever(() => {
      ifThen(
        and(
          equals(readVar(gameOver), 0),
          or(getKeyPressed('left arrow'), getKeyPressed('a')),
        ),
        () => {
          changeVariableBy(vx, -0.95)
        },
      )
      ifThen(
        and(
          equals(readVar(gameOver), 0),
          or(getKeyPressed('right arrow'), getKeyPressed('d')),
        ),
        () => {
          changeVariableBy(vx, 0.95)
        },
      )

      ifThen(equals(readVar(gameOver), 0), () => {
        setVariableTo(vx, multiply(readVar(vx), 0.82))
        changeVariableBy(playerX, readVar(vx))

        ifThen(lt(readVar(playerX), -175), () => {
          setVariableTo(playerX, -175)
          setVariableTo(vx, 0)
        })
        ifThen(gt(readVar(playerX), 175), () => {
          setVariableTo(playerX, 175)
          setVariableTo(vx, 0)
        })

        setX(readVar(playerX))
        turnRight(multiply(readVar(vx), -2.4))
      })

      wait(0.02)
    })
  })

  whenBroadcastReceived(gameOverEvent, () => {
    sayForSecs('GAME OVER! Green flagでリトライ', 2)
  })
})

const obstacle = project.createSprite('obstacle')
const depth = obstacle.createVariable('depth', 0)
const lane = obstacle.createVariable('lane', 0)
const passed = obstacle.createVariable('passed', 0)

obstacle.addCostume({
  ...ROCKS,
  name: 'rocks',
})

obstacle.run(() => {
  whenFlagClicked(() => {
    hide()
    setRotationStyle("don't rotate")

    forever(() => {
      ifThen(equals(readVar(gameOver), 0), () => {
        wait(divide(1.2, add(1, divide(readVar(speed), 3))))
        createClone(CREATE_CLONE_MYSELF)
      })
      ifThen(equals(readVar(gameOver), 1), () => {
        wait(0.1)
      })
    })
  })

  controlStartAsClone(() => {
    setVariableTo(depth, 0)
    setVariableTo(lane, random(-1, 1))
    setVariableTo(passed, 0)

    setSizeTo(8)
    gotoXY(0, 96)
    show()

    forever(() => {
      ifThen(equals(readVar(gameOver), 1), () => {
        deleteThisClone()
      })

      changeVariableBy(depth, readVar(speed))
      setX(multiply(readVar(lane), add(14, multiply(readVar(depth), 1.45))))
      setY(subtract(95, multiply(readVar(depth), 2.3)))
      setSizeTo(add(9, multiply(readVar(depth), 0.9)))

      ifThen(and(equals(readVar(passed), 0), gt(readVar(depth), 88)), () => {
        setVariableTo(passed, 1)
        changeVariableBy(score, 7)
      })

      ifThen(
        and(equals(readVar(gameOver), 0), touchingObject('player')),
        () => {
          setVariableTo(gameOver, 1)
          broadcast(gameOverEvent)
        },
      )

      ifThen(gt(readVar(depth), 112), () => {
        deleteThisClone()
      })

      wait(0.02)
    })
  })
})

export default project
