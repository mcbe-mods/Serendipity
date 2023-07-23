import {
  world,
  system,
  ItemType,
  ItemStack,
  MinecraftItemTypes,
  MinecraftEntityTypes,
  DynamicPropertiesDefinition
} from '@minecraft/server'

const PROB = 'prob'

world.afterEvents.worldInitialize.subscribe((e) => {
  const def = new DynamicPropertiesDefinition()
  def.defineNumber(PROB, 1)
  e.propertyRegistry.registerEntityTypeDynamicProperties(def, MinecraftEntityTypes.player)
})

system.afterEvents.scriptEventReceive.subscribe((e) => {
  const { id, message } = e
  const ids = {
    'serendipity:prob'() {
      const prob = +message
      if (isNaN(prob)) return
      world.getAllPlayers().forEach((player) => {
        player.setDynamicProperty(PROB, prob)
      })
    }
  }
  ids[id] && ids[id]()
})

world.afterEvents.blockBreak.subscribe(async (e) => {
  const { dimension, block, player } = e
  const prob = player.getDynamicProperty(PROB) || 1
  const is = simulateProbability(prob)
  if (!is) return

  const itemTypes = Object.keys(MinecraftItemTypes)
  const randomIndex = Math.floor(Math.random() * itemTypes.length)
  const randomKey = itemTypes[randomIndex]

  /** @type {ItemType} */
  const item = MinecraftItemTypes[randomKey]
  dimension.spawnItem(new ItemStack(item), block.location)
})

/**
 *
 * @param {number} probability
 * @returns
 */
function simulateProbability(probability) {
  return Math.random() < probability / 100
}
