import { Project } from 'hikkaku'
import { CATCHER_A } from 'hikkaku/assets'

const project = new Project()

const _stage = project.stage

//bconst player = project.createSprite('プレイヤー')
const catCrowd = project.createSprite('ネコ軍団')

const _catCostume = catCrowd.addCostume({
  ...CATCHER_A,
  name: 'cat',
})

console.dir(project.toScratch(), { depth: null })

export default project
