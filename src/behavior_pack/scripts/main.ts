import {
  world,
  system,
  ItemStack,
  MinecraftItemTypes,
  MinecraftEntityTypes,
  DynamicPropertiesDefinition
} from '@minecraft/server'
import { getRandomProbability } from '@mcbe-mods/utils'
import type { ItemType } from '@minecraft/server'

type MinecraftItemTypesKeys = keyof typeof MinecraftItemTypes

const PROB = 'prob'

world.afterEvents.worldInitialize.subscribe((e) => {
  const def = new DynamicPropertiesDefinition()
  def.defineNumber(PROB, 1)
  e.propertyRegistry.registerEntityTypeDynamicProperties(def, MinecraftEntityTypes.player)
})

system.afterEvents.scriptEventReceive.subscribe((e) => {
  const { id, message } = e
  if (id === 'serendipity:prob') {
    const prob = +message
    if (isNaN(prob)) return
    world.getAllPlayers().forEach((player) => {
      player.setDynamicProperty(PROB, prob)
    })
  }
})

world.afterEvents.blockBreak.subscribe(async (e) => {
  const { dimension, block, player } = e
  const prob = +(player.getDynamicProperty(PROB) || 1)
  if (isNaN(prob)) return
  const is = getRandomProbability(prob)
  if (!is) return

  player.playSound('random.orb', { pitch: 0.5, volume: 0.5 })
  const itemTypes = Object.keys(MinecraftItemTypes) as MinecraftItemTypesKeys[]
  const randomIndex = Math.floor(Math.random() * itemTypes.length)
  const randomKey = itemTypes[randomIndex]

  const item = MinecraftItemTypes[randomKey] as ItemType
  dimension.spawnItem(new ItemStack(item), block.location)
})
