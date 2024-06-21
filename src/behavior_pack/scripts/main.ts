import { world, ItemStack } from '@minecraft/server'
import { MinecraftItemTypes } from '@minecraft/vanilla-data'
import { getRandomProbability } from '@mcbe-mods/utils'

const itemTypes = Object.values(MinecraftItemTypes)
const PROBABILITY = 1

world.afterEvents.playerBreakBlock.subscribe(async (e) => {
  const { dimension, block, player } = e
  const is = getRandomProbability(PROBABILITY)
  if (!is) return

  player.playSound('random.orb', { pitch: 0.5, volume: 0.5 })
  const randomIndex = Math.floor(Math.random() * itemTypes.length)
  const randomItemName = itemTypes[randomIndex]

  dimension.spawnItem(new ItemStack(randomItemName), block.location)
})
