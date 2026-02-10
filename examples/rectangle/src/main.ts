import { Project } from 'hikkaku'
import {
  add,
  and,
  callProcedure,
  changeVariableBy,
  defineProcedure,
  divide,
  equals,
  eraseAll,
  forever,
  getVariable,
  gotoXY,
  gt,
  hide,
  ifElse,
  ifThen,
  lt,
  multiply,
  not,
  penDown,
  penUp,
  procedureLabel,
  repeat,
  setPenColorTo,
  setPenSizeTo,
  setRotationStyle,
  setVariableTo,
  subtract,
  whenFlagClicked,
} from 'hikkaku/blocks'

const project = new Project()
const pen = project.createSprite('pen')

const x1 = pen.createVariable('x1', -140)
const y1 = pen.createVariable('y1', -40)
const x2 = pen.createVariable('x2', 120)
const y2 = pen.createVariable('y2', -120)
const x3 = pen.createVariable('x3', 20)
const y3 = pen.createVariable('y3', 10)
const x4 = pen.createVariable('x4', -130)
const y4 = pen.createVariable('y4', 110)

const yMin = pen.createVariable('yMin', 0)
const yMax = pen.createVariable('yMax', 0)
const scanSteps = pen.createVariable('scanSteps', 1)
const i = pen.createVariable('i', 0)
const yScan = pen.createVariable('yScan', 0)

const minY = pen.createVariable('minY', 0)
const maxY = pen.createVariable('maxY', 0)
const dy = pen.createVariable('dy', 0)
const dx = pen.createVariable('dx', 0)
const t = pen.createVariable('t', 0)
const xHit = pen.createVariable('xHit', 0)

const count = pen.createVariable('count', 0)
const ix1 = pen.createVariable('ix1', 0)
const ix2 = pen.createVariable('ix2', 0)
const ix3 = pen.createVariable('ix3', 0)
const ix4 = pen.createVariable('ix4', 0)
const tmp = pen.createVariable('tmp', 0)

const stepProcCode = 'fill quad concave fast'

pen.run(() => {
  defineProcedure(
    [procedureLabel(stepProcCode)],
    () => {
      eraseAll()

      setVariableTo(yMin, getVariable(y1))
      ifThen(lt(getVariable(y2), getVariable(yMin)), () => {
        setVariableTo(yMin, getVariable(y2))
      })
      ifThen(lt(getVariable(y3), getVariable(yMin)), () => {
        setVariableTo(yMin, getVariable(y3))
      })
      ifThen(lt(getVariable(y4), getVariable(yMin)), () => {
        setVariableTo(yMin, getVariable(y4))
      })

      setVariableTo(yMax, getVariable(y1))
      ifThen(gt(getVariable(y2), getVariable(yMax)), () => {
        setVariableTo(yMax, getVariable(y2))
      })
      ifThen(gt(getVariable(y3), getVariable(yMax)), () => {
        setVariableTo(yMax, getVariable(y3))
      })
      ifThen(gt(getVariable(y4), getVariable(yMax)), () => {
        setVariableTo(yMax, getVariable(y4))
      })

      setVariableTo(
        scanSteps,
        add(subtract(getVariable(yMax), getVariable(yMin)), 1),
      )
      setVariableTo(i, 0)

      repeat(getVariable(scanSteps), () => {
        setVariableTo(yScan, add(getVariable(yMin), getVariable(i)))
        setVariableTo(count, 0)
        setVariableTo(ix1, 0)
        setVariableTo(ix2, 0)
        setVariableTo(ix3, 1000000)
        setVariableTo(ix4, 1000000)

        setVariableTo(minY, getVariable(y1))
        ifThen(gt(getVariable(minY), getVariable(y2)), () => {
          setVariableTo(minY, getVariable(y2))
        })
        setVariableTo(maxY, getVariable(y1))
        ifThen(lt(getVariable(maxY), getVariable(y2)), () => {
          setVariableTo(maxY, getVariable(y2))
        })
        ifThen(
          and(
            not(equals(getVariable(y1), getVariable(y2))),
            and(
              not(lt(getVariable(yScan), getVariable(minY))),
              lt(getVariable(yScan), getVariable(maxY)),
            ),
          ),
          () => {
            setVariableTo(dy, subtract(getVariable(y2), getVariable(y1)))
            setVariableTo(
              t,
              divide(
                subtract(getVariable(yScan), getVariable(y1)),
                getVariable(dy),
              ),
            )
            setVariableTo(dx, subtract(getVariable(x2), getVariable(x1)))
            setVariableTo(
              xHit,
              add(getVariable(x1), multiply(getVariable(dx), getVariable(t))),
            )
            ifElse(
              equals(getVariable(count), 0),
              () => {
                setVariableTo(ix1, getVariable(xHit))
              },
              () => {
                ifElse(
                  equals(getVariable(count), 1),
                  () => {
                    setVariableTo(ix2, getVariable(xHit))
                  },
                  () => {
                    ifElse(
                      equals(getVariable(count), 2),
                      () => {
                        setVariableTo(ix3, getVariable(xHit))
                      },
                      () => {
                        setVariableTo(ix4, getVariable(xHit))
                      },
                    )
                  },
                )
              },
            )
            changeVariableBy(count, 1)
          },
        )

        setVariableTo(minY, getVariable(y2))
        ifThen(gt(getVariable(minY), getVariable(y3)), () => {
          setVariableTo(minY, getVariable(y3))
        })
        setVariableTo(maxY, getVariable(y2))
        ifThen(lt(getVariable(maxY), getVariable(y3)), () => {
          setVariableTo(maxY, getVariable(y3))
        })
        ifThen(
          and(
            not(equals(getVariable(y2), getVariable(y3))),
            and(
              not(lt(getVariable(yScan), getVariable(minY))),
              lt(getVariable(yScan), getVariable(maxY)),
            ),
          ),
          () => {
            setVariableTo(dy, subtract(getVariable(y3), getVariable(y2)))
            setVariableTo(
              t,
              divide(
                subtract(getVariable(yScan), getVariable(y2)),
                getVariable(dy),
              ),
            )
            setVariableTo(dx, subtract(getVariable(x3), getVariable(x2)))
            setVariableTo(
              xHit,
              add(getVariable(x2), multiply(getVariable(dx), getVariable(t))),
            )
            ifElse(
              equals(getVariable(count), 0),
              () => {
                setVariableTo(ix1, getVariable(xHit))
              },
              () => {
                ifElse(
                  equals(getVariable(count), 1),
                  () => {
                    setVariableTo(ix2, getVariable(xHit))
                  },
                  () => {
                    ifElse(
                      equals(getVariable(count), 2),
                      () => {
                        setVariableTo(ix3, getVariable(xHit))
                      },
                      () => {
                        setVariableTo(ix4, getVariable(xHit))
                      },
                    )
                  },
                )
              },
            )
            changeVariableBy(count, 1)
          },
        )

        setVariableTo(minY, getVariable(y3))
        ifThen(gt(getVariable(minY), getVariable(y4)), () => {
          setVariableTo(minY, getVariable(y4))
        })
        setVariableTo(maxY, getVariable(y3))
        ifThen(lt(getVariable(maxY), getVariable(y4)), () => {
          setVariableTo(maxY, getVariable(y4))
        })
        ifThen(
          and(
            not(equals(getVariable(y3), getVariable(y4))),
            and(
              not(lt(getVariable(yScan), getVariable(minY))),
              lt(getVariable(yScan), getVariable(maxY)),
            ),
          ),
          () => {
            setVariableTo(dy, subtract(getVariable(y4), getVariable(y3)))
            setVariableTo(
              t,
              divide(
                subtract(getVariable(yScan), getVariable(y3)),
                getVariable(dy),
              ),
            )
            setVariableTo(dx, subtract(getVariable(x4), getVariable(x3)))
            setVariableTo(
              xHit,
              add(getVariable(x3), multiply(getVariable(dx), getVariable(t))),
            )
            ifElse(
              equals(getVariable(count), 0),
              () => {
                setVariableTo(ix1, getVariable(xHit))
              },
              () => {
                ifElse(
                  equals(getVariable(count), 1),
                  () => {
                    setVariableTo(ix2, getVariable(xHit))
                  },
                  () => {
                    ifElse(
                      equals(getVariable(count), 2),
                      () => {
                        setVariableTo(ix3, getVariable(xHit))
                      },
                      () => {
                        setVariableTo(ix4, getVariable(xHit))
                      },
                    )
                  },
                )
              },
            )
            changeVariableBy(count, 1)
          },
        )

        setVariableTo(minY, getVariable(y4))
        ifThen(gt(getVariable(minY), getVariable(y1)), () => {
          setVariableTo(minY, getVariable(y1))
        })
        setVariableTo(maxY, getVariable(y4))
        ifThen(lt(getVariable(maxY), getVariable(y1)), () => {
          setVariableTo(maxY, getVariable(y1))
        })
        ifThen(
          and(
            not(equals(getVariable(y4), getVariable(y1))),
            and(
              not(lt(getVariable(yScan), getVariable(minY))),
              lt(getVariable(yScan), getVariable(maxY)),
            ),
          ),
          () => {
            setVariableTo(dy, subtract(getVariable(y1), getVariable(y4)))
            setVariableTo(
              t,
              divide(
                subtract(getVariable(yScan), getVariable(y4)),
                getVariable(dy),
              ),
            )
            setVariableTo(dx, subtract(getVariable(x1), getVariable(x4)))
            setVariableTo(
              xHit,
              add(getVariable(x4), multiply(getVariable(dx), getVariable(t))),
            )
            ifElse(
              equals(getVariable(count), 0),
              () => {
                setVariableTo(ix1, getVariable(xHit))
              },
              () => {
                ifElse(
                  equals(getVariable(count), 1),
                  () => {
                    setVariableTo(ix2, getVariable(xHit))
                  },
                  () => {
                    ifElse(
                      equals(getVariable(count), 2),
                      () => {
                        setVariableTo(ix3, getVariable(xHit))
                      },
                      () => {
                        setVariableTo(ix4, getVariable(xHit))
                      },
                    )
                  },
                )
              },
            )
            changeVariableBy(count, 1)
          },
        )

        ifThen(gt(getVariable(count), 1), () => {
          ifThen(gt(getVariable(ix1), getVariable(ix2)), () => {
            setVariableTo(tmp, getVariable(ix1))
            setVariableTo(ix1, getVariable(ix2))
            setVariableTo(ix2, getVariable(tmp))
          })
          ifThen(gt(getVariable(ix3), getVariable(ix4)), () => {
            setVariableTo(tmp, getVariable(ix3))
            setVariableTo(ix3, getVariable(ix4))
            setVariableTo(ix4, getVariable(tmp))
          })
          ifThen(gt(getVariable(ix1), getVariable(ix3)), () => {
            setVariableTo(tmp, getVariable(ix1))
            setVariableTo(ix1, getVariable(ix3))
            setVariableTo(ix3, getVariable(tmp))
          })
          ifThen(gt(getVariable(ix2), getVariable(ix4)), () => {
            setVariableTo(tmp, getVariable(ix2))
            setVariableTo(ix2, getVariable(ix4))
            setVariableTo(ix4, getVariable(tmp))
          })
          ifThen(gt(getVariable(ix2), getVariable(ix3)), () => {
            setVariableTo(tmp, getVariable(ix2))
            setVariableTo(ix2, getVariable(ix3))
            setVariableTo(ix3, getVariable(tmp))
          })

          penUp()
          gotoXY(getVariable(ix1), getVariable(yScan))
          penDown()
          gotoXY(getVariable(ix2), getVariable(yScan))
          penUp()

          ifThen(gt(getVariable(count), 3), () => {
            gotoXY(getVariable(ix3), getVariable(yScan))
            penDown()
            gotoXY(getVariable(ix4), getVariable(yScan))
            penUp()
          })
        })

        changeVariableBy(i, 1)
      })
    },
    true,
  )

  whenFlagClicked(() => {
    hide()
    setRotationStyle("don't rotate")
    setPenSizeTo(1)
    setPenColorTo('#1d9bf0')

    forever(() => {
      callProcedure(stepProcCode, [], {}, true)
    })
  })
})

export default project
