
// Типы для перечислений (из бэкенда)
export const BODY_REGIONS = [
  { value: 'UPPER', label: 'Верхняя часть тела' },
  { value: 'LOWER', label: 'Нижняя часть тела' },
  { value: 'CORE', label: 'Кор' },
  { value: 'FULL_BODY', label: 'Все тело' },
] as const

export const MUSCLE_GROUPS = [
  { value: 'CHEST', label: 'Грудь' },
  { value: 'BACK', label: 'Спина' },
  { value: 'SHOULDERS', label: 'Плечи' },
  { value: 'BICEPS', label: 'Бицепс' },
  { value: 'TRICEPS', label: 'Трицепс' },
  { value: 'FOREARMS', label: 'Предплечья' },
  { value: 'QUADRICEPS', label: 'Квадрицепсы' },
  { value: 'HAMSTRINGS', label: 'Бицепс бедра' },
  { value: 'GLUTES', label: 'Ягодицы' },
  { value: 'CALVES', label: 'Икры' },
  { value: 'ADDUCTORS', label: 'Приводящие' },
  { value: 'ABDUCTORS', label: 'Отводящие' },
  { value: 'ABS', label: 'Пресс' },
  { value: 'LOWER_BACK', label: 'Поясница' },
  { value: 'OBLIQUES', label: 'Косые мышцы живота' },
  { value: 'FULL_BODY', label: 'Все тело' },
  { value: 'OTHER', label: 'Другое' },
] as const

export const MOVEMENT_PATTERNS = [
  { value: 'PUSH', label: 'Жимовое' },
  { value: 'PULL', label: 'Тяговое' },
  { value: 'SQUAT', label: 'Приседание' },
  { value: 'HINGE', label: 'Сгибание' },
  { value: 'LUNGE', label: 'Выпад' },
  { value: 'ROTATION', label: 'Вращение' },
  { value: 'CARRY', label: 'Перенос' },
  { value: 'EXPLOSIVE', label: 'Взрывное' },
  { value: 'OTHER', label: 'Другое' },
] as const