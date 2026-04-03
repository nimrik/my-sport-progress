export interface ExerciseInfo {
  canonical: string
  muscleGroup: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'
}

const EXERCISE_MAP: Record<string, ExerciseInfo> = {
  // Chest
  'жим лёжа': { canonical: 'Жим лёжа', muscleGroup: 'chest' },
  'жим лежа': { canonical: 'Жим лёжа', muscleGroup: 'chest' },
  'жим штанги лежа': { canonical: 'Жим лёжа', muscleGroup: 'chest' },
  'жим лёжа под наклоном': { canonical: 'Жим под наклоном', muscleGroup: 'chest' },
  'жим лежа под наклоном': { canonical: 'Жим под наклоном', muscleGroup: 'chest' },
  'жим под наклоном': { canonical: 'Жим под наклоном', muscleGroup: 'chest' },
  'жим на наклонной': { canonical: 'Жим под наклоном', muscleGroup: 'chest' },
  'наклонный жим гантелями': { canonical: 'Жим гантелей под наклоном', muscleGroup: 'chest' },
  'жим гантелей под наклоном': { canonical: 'Жим гантелей под наклоном', muscleGroup: 'chest' },
  'жим лежа гантелей': { canonical: 'Жим гантелей лёжа', muscleGroup: 'chest' },
  'жим лёжа гантелей': { canonical: 'Жим гантелей лёжа', muscleGroup: 'chest' },
  'жим лежа гантелей под наклоном': { canonical: 'Жим гантелей под наклоном', muscleGroup: 'chest' },
  'жим лёжа гантелей под наклоном': { canonical: 'Жим гантелей под наклоном', muscleGroup: 'chest' },
  'жим гантелей': { canonical: 'Жим гантелей', muscleGroup: 'chest' },
  'жим лёжа без моста': { canonical: 'Жим лёжа без моста', muscleGroup: 'chest' },
  'жим лежа без моста': { canonical: 'Жим лёжа без моста', muscleGroup: 'chest' },
  'жим средним хватом': { canonical: 'Жим средним хватом', muscleGroup: 'chest' },
  'жим средним': { canonical: 'Жим средним хватом', muscleGroup: 'chest' },
  'бабочка': { canonical: 'Бабочка', muscleGroup: 'chest' },
  'бабочка на грудь': { canonical: 'Бабочка', muscleGroup: 'chest' },
  'кроссовер на грудь': { canonical: 'Кроссовер', muscleGroup: 'chest' },
  'брусья в тренажёре': { canonical: 'Брусья', muscleGroup: 'chest' },
  'брусья в тренажере': { canonical: 'Брусья', muscleGroup: 'chest' },
  // Back
  'тяга верхнего блока': { canonical: 'Тяга верхнего блока', muscleGroup: 'back' },
  'тяга верхнего блока обратным хватом': { canonical: 'Тяга верхнего блока обр. хватом', muscleGroup: 'back' },
  'тяга горизонтального блока': { canonical: 'Тяга горизонтального блока', muscleGroup: 'back' },
  'тяга горизонтального блоока': { canonical: 'Тяга горизонтального блока', muscleGroup: 'back' },
  'тяга горизонтального блока широким хватом': { canonical: 'Тяга гориз. блока шир. хватом', muscleGroup: 'back' },
  'тяга штанги в наклоне': { canonical: 'Тяга в наклоне', muscleGroup: 'back' },
  'тяга в наклоне': { canonical: 'Тяга в наклоне', muscleGroup: 'back' },
  'подтягивания': { canonical: 'Подтягивания', muscleGroup: 'back' },
  'подтягивания гравитрон': { canonical: 'Подтягивания (гравитрон)', muscleGroup: 'back' },
  'тяга на прямых': { canonical: 'Тяга на прямых ногах', muscleGroup: 'back' },
  'на прямых': { canonical: 'Тяга на прямых ногах', muscleGroup: 'back' },
  'гиперэкстензия': { canonical: 'Гиперэкстензия', muscleGroup: 'back' },

  // Legs
  'присед': { canonical: 'Присед', muscleGroup: 'legs' },
  'приседания': { canonical: 'Присед', muscleGroup: 'legs' },
  'присяд': { canonical: 'Присед', muscleGroup: 'legs' },
  'приседания в гакке': { canonical: 'Присед в Гакке', muscleGroup: 'legs' },
  'присед на груди': { canonical: 'Присед на груди', muscleGroup: 'legs' },
  'становая': { canonical: 'Становая тяга', muscleGroup: 'legs' },
  'тяга сумо': { canonical: 'Тяга сумо', muscleGroup: 'legs' },
  'разгибания ног сидя': { canonical: 'Разгибания ног', muscleGroup: 'legs' },
  'разгибание ног сидя': { canonical: 'Разгибания ног', muscleGroup: 'legs' },
  'разгибания ног': { canonical: 'Разгибания ног', muscleGroup: 'legs' },
  'разгибание ног': { canonical: 'Разгибания ног', muscleGroup: 'legs' },
  'сгибания ног сидя': { canonical: 'Сгибания ног', muscleGroup: 'legs' },
  'сгибание ног сидя': { canonical: 'Сгибания ног', muscleGroup: 'legs' },
  'сгибания ног лёжа': { canonical: 'Сгибания ног', muscleGroup: 'legs' },
  'сгибание ног лёжа': { canonical: 'Сгибания ног', muscleGroup: 'legs' },
  'сгибания ног': { canonical: 'Сгибания ног', muscleGroup: 'legs' },
  'сгибание ног': { canonical: 'Сгибания ног', muscleGroup: 'legs' },
  'выпады в ходьбе': { canonical: 'Выпады', muscleGroup: 'legs' },
  'наклоны': { canonical: 'Наклоны (гуд морнинг)', muscleGroup: 'legs' },
  'наклоны(гуд морнинг)': { canonical: 'Наклоны (гуд морнинг)', muscleGroup: 'legs' },

  // Shoulders
  'армейский жим': { canonical: 'Армейский жим', muscleGroup: 'shoulders' },
  'армейский': { canonical: 'Армейский жим', muscleGroup: 'shoulders' },
  'жим гантелей сидя': { canonical: 'Жим гантелей сидя', muscleGroup: 'shoulders' },
  'махи в стороны': { canonical: 'Махи в стороны', muscleGroup: 'shoulders' },
  'махи': { canonical: 'Махи в стороны', muscleGroup: 'shoulders' },
  'подъем гантелей перед собой': { canonical: 'Подъём гантелей перед собой', muscleGroup: 'shoulders' },
  'обратная бабочка': { canonical: 'Обратная бабочка', muscleGroup: 'shoulders' },
  'протяжка пустая': { canonical: 'Протяжка', muscleGroup: 'shoulders' },
  'протяжка': { canonical: 'Протяжка', muscleGroup: 'shoulders' },
  'сет махов': { canonical: 'Махи в стороны', muscleGroup: 'shoulders' },
  'суперсет махов вперед и в стороны': { canonical: 'Суперсет махов', muscleGroup: 'shoulders' },

  // Arms
  'сгибание рук со штангой': { canonical: 'Бицепс со штангой', muscleGroup: 'arms' },
  'сгибание рук с штангой': { canonical: 'Бицепс со штангой', muscleGroup: 'arms' },
  'сгибания рук со штангой': { canonical: 'Бицепс со штангой', muscleGroup: 'arms' },
  'сгибания рук': { canonical: 'Бицепс со штангой', muscleGroup: 'arms' },
  'сгибание рук': { canonical: 'Бицепс со штангой', muscleGroup: 'arms' },
  'сгибания предплечья со штангой': { canonical: 'Бицепс со штангой', muscleGroup: 'arms' },
  'бицепс со штангой': { canonical: 'Бицепс со штангой', muscleGroup: 'arms' },
  'бицепс с штангой': { canonical: 'Бицепс со штангой', muscleGroup: 'arms' },
  'бицепс стоя': { canonical: 'Бицепс со штангой', muscleGroup: 'arms' },
  'бицепс машина': { canonical: 'Бицепс (машина)', muscleGroup: 'arms' },
  'молоточки': { canonical: 'Молотки', muscleGroup: 'arms' },
  'молотки': { canonical: 'Молотки', muscleGroup: 'arms' },
  'французский жим': { canonical: 'Французский жим', muscleGroup: 'arms' },
  'французский': { canonical: 'Французский жим', muscleGroup: 'arms' },
  'разгибания рук на блоке': { canonical: 'Разгибания рук на блоке', muscleGroup: 'arms' },
  'разгибание рук на блоке': { canonical: 'Разгибания рук на блоке', muscleGroup: 'arms' },
  'разгибания рук из-за головы': { canonical: 'Разгибания рук из-за головы', muscleGroup: 'arms' },
  'разгибания рук на блоке из-за головы': { canonical: 'Разгибания рук из-за головы', muscleGroup: 'arms' },
  'трицепс на блоке': { canonical: 'Разгибания рук на блоке', muscleGroup: 'arms' },
  'хват на блоке': { canonical: 'Хват на блоке', muscleGroup: 'arms' },
  'хват': { canonical: 'Хват на блоке', muscleGroup: 'arms' },
}

const DAY_HEADERS = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье']
const SKIP_WORDS = ['разминочный', 'заминка', 'дорожка', 'кардио', 'разминка']

export function lookupExercise(name: string): ExerciseInfo | null {
  const normalized = name.toLowerCase().replace(/[:;.!❗️]+$/g, '').trim()

  if (DAY_HEADERS.some(d => normalized.startsWith(d))) return null
  if (SKIP_WORDS.some(w => normalized === w)) return null

  // Direct match
  if (EXERCISE_MAP[normalized]) return EXERCISE_MAP[normalized]

  // Try removing trailing descriptors
  for (const [key, info] of Object.entries(EXERCISE_MAP)) {
    if (normalized.startsWith(key) && normalized.length - key.length < 15) {
      return info
    }
  }

  // Try matching with removed parenthetical
  const withoutParens = normalized.replace(/\(.*?\)/g, '').trim()
  if (EXERCISE_MAP[withoutParens]) return EXERCISE_MAP[withoutParens]

  return null
}

export const MUSCLE_GROUP_LABELS: Record<string, string> = {
  chest: 'Грудь',
  back: 'Спина',
  legs: 'Ноги',
  shoulders: 'Плечи',
  arms: 'Руки',
  core: 'Кор',
}
