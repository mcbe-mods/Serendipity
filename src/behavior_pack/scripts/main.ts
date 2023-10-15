import {
  world,
  system,
  Player,
  ItemStack,
  DynamicPropertiesDefinition,
  PlayerBreakBlockAfterEventSignal
} from '@minecraft/server'
import { MinecraftItemTypes } from '@minecraft/vanilla-data'
import { getRandomProbability } from '@mcbe-mods/utils'

/* ---------- Versions Adaptation ---------- */

/* eslint-disable @typescript-eslint/no-explicit-any */
const afterEvents = ((world.afterEvents as any).playerBreakBlock ||
  (world.afterEvents as any).blockBreak) as PlayerBreakBlockAfterEventSignal
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ---------- Versions Adaptation ---------- */

const itemTypes = Object.values(MinecraftItemTypes)
const PROB = 'prob'

world.afterEvents.worldInitialize.subscribe((e) => {
  const def = new DynamicPropertiesDefinition()
  def.defineNumber(PROB, 1)
  e.propertyRegistry.registerWorldDynamicProperties(def)
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

afterEvents.subscribe(async (e) => {
  const { dimension, block, player } = e
  const prob = (world.getDynamicProperty(PROB) as number) || 1
  const is = getRandomProbability(prob)
  if (!is) return

  player.playSound('random.orb', { pitch: 0.5, volume: 0.5 })
  const randomIndex = Math.floor(Math.random() * itemTypes.length)
  const randomItemName = itemTypes[randomIndex]

  dimension.spawnItem(new ItemStack(randomItemName), block.location)
})
