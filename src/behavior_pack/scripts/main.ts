import { world, system, Player, ItemStack, ItemTypes } from '@minecraft/server'
import { getRandomProbability } from '@mcbe-mods/utils'

const itemTypes = ItemTypes.getAll().map((item) => item.id)
const PROB = 'prob'

world.afterEvents.worldInitialize.subscribe(() => {
  if (world.getDynamicProperty(PROB)) return
  world.setDynamicProperty(PROB, 1)
})

system.afterEvents.scriptEventReceive.subscribe((e) => {
  const { id, message } = e
  const prob = +message
  if (isNaN(prob)) return

  const player = e.sourceEntity as Player
  if (id === 'serendipity:prob' && player?.isOp()) {
    world.setDynamicProperty(PROB, prob)
  }
})

world.afterEvents.playerBreakBlock.subscribe(async (e) => {
  const { dimension, block, player } = e
  const prob = (world.getDynamicProperty(PROB) as number) || 1
  const is = getRandomProbability(prob)
  if (!is) return

  player.playSound('random.orb', { pitch: 0.5, volume: 0.5 })
  const randomIndex = Math.floor(Math.random() * itemTypes.length)
  const randomItemName = itemTypes[randomIndex]

  dimension.spawnItem(new ItemStack(randomItemName), block.location)
})
