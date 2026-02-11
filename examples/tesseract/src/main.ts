import { Project, type VariableReference } from 'hikkaku'
import {
  add,
  callProcedure,
  changeVariableBy,
  defineProcedure,
  divide,
  equals,
  eraseAll,
  forEach,
  forever,
  getItemOfList,
  getKeyPressed,
  getMouseDown,
  getMouseX,
  getMouseY,
  getVariable,
  gotoXY,
  gt,
  hide,
  ifElse,
  ifThen,
  lengthOfList,
  lt,
  mathop,
  multiply,
  or,
  penDown,
  penUp,
  procedureLabel,
  replaceItemOfList,
  setDragMode,
  setPenColorTo,
  setPenSizeTo,
  setVariableTo,
  subtract,
  whenFlagClicked,
} from 'hikkaku/blocks'

const TESSERACT_VERTICES = Array.from({ length: 16 }, (_, vertex) => {
  const sign = (bit: number) => {
    return vertex & (1 << bit) ? 1 : -1
  }

  return [sign(0), sign(1), sign(2), sign(3)] as const
})

const TESSERACT_EDGES: Array<[number, number]> = []
for (let vertex = 0; vertex < 16; vertex += 1) {
  for (let bit = 0; bit < 4; bit += 1) {
    const neighbor = vertex ^ (1 << bit)
    if (vertex < neighbor) {
      TESSERACT_EDGES.push([vertex + 1, neighbor + 1])
    }
  }
}

const project = new Project()
const renderer = project.createSprite('renderer')

const modelScale = renderer.createVariable('modelScale', 92)

const wCameraDistance = renderer.createVariable('wCameraDistance', 320)
const wFocalLength = renderer.createVariable('wFocalLength', 180)
const cameraDistance = renderer.createVariable('cameraDistance', 320)
const focalLength = renderer.createVariable('focalLength', 220)

const angleX = renderer.createVariable('angleX', -16)
const angleY = renderer.createVariable('angleY', 24)
const angleW = renderer.createVariable('angleW', 18)
const angleZW = renderer.createVariable('angleZW', -12)

const dragging = renderer.createVariable('dragging', 0)
const lastMouseX = renderer.createVariable('lastMouseX', 0)
const lastMouseY = renderer.createVariable('lastMouseY', 0)

const vertexIndex = renderer.createVariable('vertexIndex', 1)
const edgeIndex = renderer.createVariable('edgeIndex', 1)
const edgeFrom = renderer.createVariable('edgeFrom', 1)
const edgeTo = renderer.createVariable('edgeTo', 1)

const workX = renderer.createVariable('workX', 0)
const workY = renderer.createVariable('workY', 0)
const workZ = renderer.createVariable('workZ', 0)
const workW = renderer.createVariable('workW', 0)

const rotatedX = renderer.createVariable('rotatedX', 0)
const rotatedY = renderer.createVariable('rotatedY', 0)
const rotatedZ = renderer.createVariable('rotatedZ', 0)
const rotatedW = renderer.createVariable('rotatedW', 0)
const perspective4 = renderer.createVariable('perspective4', 1)
const perspective3 = renderer.createVariable('perspective3', 1)

const vertexXList = renderer.createList(
  'vertexX',
  TESSERACT_VERTICES.map(([x]) => x),
)
const vertexYList = renderer.createList(
  'vertexY',
  TESSERACT_VERTICES.map(([, y]) => y),
)
const vertexZList = renderer.createList(
  'vertexZ',
  TESSERACT_VERTICES.map(([, , z]) => z),
)
const vertexWList = renderer.createList(
  'vertexW',
  TESSERACT_VERTICES.map(([, , , w]) => w),
)

const projectedXList = renderer.createList(
  'projectedX',
  TESSERACT_VERTICES.map(() => 0),
)
const projectedYList = renderer.createList(
  'projectedY',
  TESSERACT_VERTICES.map(() => 0),
)

const edgeFromList = renderer.createList(
  'edgeFrom',
  TESSERACT_EDGES.map(([from]) => from),
)
const edgeToList = renderer.createList(
  'edgeTo',
  TESSERACT_EDGES.map(([, to]) => to),
)

const readVar = (variable: VariableReference) => getVariable(variable)
const stepProcCode = '1step'

renderer.run(() => {
  const stepProcedure = defineProcedure(
    [procedureLabel(stepProcCode)],
    () => {
      ifElse(
        getMouseDown(),
        () => {
          ifElse(
            equals(readVar(dragging), 0),
            () => {
              setVariableTo(dragging, 1)
              setVariableTo(lastMouseX, getMouseX())
              setVariableTo(lastMouseY, getMouseY())
            },
            () => {
              changeVariableBy(
                angleY,
                multiply(subtract(getMouseX(), readVar(lastMouseX)), 0.8),
              )
              changeVariableBy(
                angleX,
                multiply(subtract(readVar(lastMouseY), getMouseY()), 0.8),
              )
              setVariableTo(lastMouseX, getMouseX())
              setVariableTo(lastMouseY, getMouseY())
            },
          )
        },
        () => {
          setVariableTo(dragging, 0)
          changeVariableBy(angleY, 0.2)
        },
      )

      ifThen(or(getKeyPressed('left arrow'), getKeyPressed('a')), () => {
        changeVariableBy(angleW, -1.8)
      })
      ifThen(or(getKeyPressed('right arrow'), getKeyPressed('d')), () => {
        changeVariableBy(angleW, 1.8)
      })
      ifThen(or(getKeyPressed('q'), getKeyPressed('z')), () => {
        changeVariableBy(angleZW, -1.6)
      })
      ifThen(or(getKeyPressed('e'), getKeyPressed('c')), () => {
        changeVariableBy(angleZW, 1.6)
      })
      ifThen(or(getKeyPressed('up arrow'), getKeyPressed('w')), () => {
        changeVariableBy(angleX, 0.9)
      })
      ifThen(or(getKeyPressed('down arrow'), getKeyPressed('s')), () => {
        changeVariableBy(angleX, -0.9)
      })

      changeVariableBy(angleW, 0.45)
      changeVariableBy(angleZW, 0.25)

      ifThen(gt(readVar(angleX), 89), () => {
        setVariableTo(angleX, 89)
      })
      ifThen(lt(readVar(angleX), -89), () => {
        setVariableTo(angleX, -89)
      })

      eraseAll()

      forEach(vertexIndex, lengthOfList(vertexXList), () => {
        setVariableTo(
          workX,
          multiply(
            getItemOfList(vertexXList, readVar(vertexIndex)),
            readVar(modelScale),
          ),
        )
        setVariableTo(
          workY,
          multiply(
            getItemOfList(vertexYList, readVar(vertexIndex)),
            readVar(modelScale),
          ),
        )
        setVariableTo(
          workZ,
          multiply(
            getItemOfList(vertexZList, readVar(vertexIndex)),
            readVar(modelScale),
          ),
        )
        setVariableTo(
          workW,
          multiply(
            getItemOfList(vertexWList, readVar(vertexIndex)),
            readVar(modelScale),
          ),
        )

        setVariableTo(
          rotatedX,
          subtract(
            multiply(readVar(workX), mathop('cos', readVar(angleW))),
            multiply(readVar(workW), mathop('sin', readVar(angleW))),
          ),
        )
        setVariableTo(
          rotatedW,
          add(
            multiply(readVar(workX), mathop('sin', readVar(angleW))),
            multiply(readVar(workW), mathop('cos', readVar(angleW))),
          ),
        )

        setVariableTo(
          rotatedZ,
          subtract(
            multiply(readVar(workZ), mathop('cos', readVar(angleZW))),
            multiply(readVar(rotatedW), mathop('sin', readVar(angleZW))),
          ),
        )
        setVariableTo(
          rotatedW,
          add(
            multiply(readVar(workZ), mathop('sin', readVar(angleZW))),
            multiply(readVar(rotatedW), mathop('cos', readVar(angleZW))),
          ),
        )

        setVariableTo(
          perspective4,
          divide(
            readVar(wFocalLength),
            subtract(readVar(wCameraDistance), readVar(rotatedW)),
          ),
        )

        setVariableTo(
          rotatedX,
          multiply(readVar(rotatedX), readVar(perspective4)),
        )
        setVariableTo(rotatedY, multiply(readVar(workY), readVar(perspective4)))
        setVariableTo(
          rotatedZ,
          multiply(readVar(rotatedZ), readVar(perspective4)),
        )

        setVariableTo(
          workX,
          add(
            multiply(readVar(rotatedX), mathop('cos', readVar(angleY))),
            multiply(readVar(rotatedZ), mathop('sin', readVar(angleY))),
          ),
        )
        setVariableTo(
          workW,
          subtract(
            multiply(readVar(rotatedZ), mathop('cos', readVar(angleY))),
            multiply(readVar(rotatedX), mathop('sin', readVar(angleY))),
          ),
        )

        setVariableTo(
          workY,
          subtract(
            multiply(readVar(rotatedY), mathop('cos', readVar(angleX))),
            multiply(readVar(workW), mathop('sin', readVar(angleX))),
          ),
        )
        setVariableTo(
          rotatedZ,
          add(
            multiply(readVar(rotatedY), mathop('sin', readVar(angleX))),
            multiply(readVar(workW), mathop('cos', readVar(angleX))),
          ),
        )

        setVariableTo(
          perspective3,
          divide(
            readVar(focalLength),
            add(readVar(cameraDistance), readVar(rotatedZ)),
          ),
        )

        replaceItemOfList(
          projectedXList,
          readVar(vertexIndex),
          multiply(readVar(workX), readVar(perspective3)),
        )
        replaceItemOfList(
          projectedYList,
          readVar(vertexIndex),
          multiply(readVar(workY), readVar(perspective3)),
        )
      })

      forEach(edgeIndex, lengthOfList(edgeFromList), () => {
        setVariableTo(edgeFrom, getItemOfList(edgeFromList, readVar(edgeIndex)))
        setVariableTo(edgeTo, getItemOfList(edgeToList, readVar(edgeIndex)))

        penUp()
        gotoXY(
          getItemOfList(projectedXList, readVar(edgeFrom)),
          getItemOfList(projectedYList, readVar(edgeFrom)),
        )
        penDown()
        gotoXY(
          getItemOfList(projectedXList, readVar(edgeTo)),
          getItemOfList(projectedYList, readVar(edgeTo)),
        )
        penUp()
      })
    },
    true,
  )

  whenFlagClicked(() => {
    hide()
    setDragMode('not draggable')

    penUp()
    setPenSizeTo(1.2)
    setPenColorTo('#38bdf8')

    setVariableTo(lastMouseX, getMouseX())
    setVariableTo(lastMouseY, getMouseY())
    setVariableTo(dragging, 0)

    forever(() => {
      callProcedure(stepProcedure, {}, true)
    })
  })
})

export default project
