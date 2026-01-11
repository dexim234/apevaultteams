// Rating calculation utilities
import { RatingData } from '@/types'

export interface RatingBreakdown {
  daysOff: number
  daysOffPoints: number
  sickDays: number
  sickDaysPoints: number
  vacationDays: number
  vacationDaysPoints: number
  absenceDays: number
  absenceDaysPoints: number
  internshipDays: number
  internshipDaysPoints: number
  weeklyHours: number
  weeklyHoursPoints: number
  weeklyEarnings: number
  weeklyEarningsPoints: number
  referrals: number
  referralsPoints: number
  signals: number
  initiatives: number
  poolAmount: number
  truancyDays: number
  totalRating: number
}

export const calculateRating = (
  data: Omit<RatingData, 'rating'>,
  weeklyHours: number = 0,
  weeklyEarnings: number = 0,
  weeklyDaysOff: number = 0,
  weeklySickDays: number = 0,
  ninetyDayVacationDays: number = 0
): number => {
  console.log('calculateRating input:', {
    userId: data.userId,
    weeklyDaysOff,
    weeklySickDays,
    data_sickDays: data.sickDays,
    data_vacationDays: data.vacationDays,
    ninetyDayVacationDays,
    data_absenceDays: data.absenceDays,
    weeklyHours,
    weeklyEarnings
  })
  let rating = 0

  // Выходные: <2 дней в неделю = +5%, >3 дней в неделю = -15%
  let daysOffPoints = 0
  if (weeklyDaysOff < 2) {
    daysOffPoints = 5
    rating += 5
  } else if (weeklyDaysOff > 3) {
    daysOffPoints = -15
    rating -= 15
  }
  console.log('DaysOff calculation:', { weeklyDaysOff, daysOffPoints, currentRating: rating })

  // Больничные: <3 дней в неделю И <=9 дней в месяц = +5%, >4 дней в неделю ИЛИ >10 дней в месяц = -15%
  let sickDaysPoints = 0
  if (weeklySickDays < 3 && data.sickDays <= 9) {
    sickDaysPoints = 5
    rating += 5
  } else if (weeklySickDays > 4 || data.sickDays > 10) {
    sickDaysPoints = -15
    rating -= 15
  }
  console.log('SickDays calculation:', { weeklySickDays, monthlySickDays: data.sickDays, sickDaysPoints, currentRating: rating })

  // Отпуск: <12 дней в месяц И <=30 дней за 90 дней = +10%, >12 дней в месяц ИЛИ >30 дней за 90 дней = -10%
  let vacationDaysPoints = 0
  if (data.vacationDays < 12 && ninetyDayVacationDays <= 30) {
    vacationDaysPoints = 10
    rating += 10
  } else if (data.vacationDays > 12 || ninetyDayVacationDays > 30) {
    vacationDaysPoints = -10
    rating -= 10
  }
  console.log('Vacation calculation:', { monthlyVacationDays: data.vacationDays, ninetyDayVacationDays, vacationDaysPoints, currentRating: rating })

  // Прогулы: >2 в неделю = рейтинг -30%
  let absencePenalty = 0
  if (data.absenceDays > 2) {
    absencePenalty = 30
  }
  console.log('Absence penalty:', { absenceDays: data.absenceDays, absencePenalty, currentRating: rating })

  // Стажировка: без влияния на рейтинг (0%)
  const internshipDaysPoints = 0
  console.log('Internship calculation:', { internshipDays: data.internshipDays, internshipDaysPoints, currentRating: rating })

  // Часы работы в неделю: <15 = 0%, >=15 = 15%, >=20 = 25%
  if (weeklyHours >= 20) {
    rating += 25
  } else if (weeklyHours >= 15) {
    rating += 15
  }

  // Заработок за неделю: >=6000 = 30%, >=3000 = 15%, <3000 = 0%
  if (weeklyEarnings >= 6000) {
    rating += 30
  } else if (weeklyEarnings >= 3000) {
    rating += 15
  }

  // Рефералы: 5% за каждого, но не более 30% (макс 6 рефералов)
  const referralsPoints = Math.min(data.referrals * 5, 30)
  rating += referralsPoints

  // Применяем штраф за прогулы
  rating = Math.max(0, rating - absencePenalty)

  console.log('Final rating calculation:', {
    ratingAfterAbsencePenalty: rating,
    finalRating: Math.min(rating, 100)
  })

  return Math.min(rating, 100)
}

export const getRatingBreakdown = (
  data: Omit<RatingData, 'rating'>,
  weeklyHours: number = 0,
  weeklyEarnings: number = 0,
  weeklyDaysOff: number = 0,
  weeklySickDays: number = 0,
  ninetyDayVacationDays: number = 0
): RatingBreakdown => {
  // Выходные: <2 дней в неделю = +5%, >3 дней в неделю = -15%
  let daysOffPoints = 0
  if (weeklyDaysOff < 2) {
    daysOffPoints = 5
  } else if (weeklyDaysOff > 3) {
    daysOffPoints = -15
  }

  // Больничные: <3 дней в неделю И <=9 дней в месяц = +5%, >4 дней в неделю ИЛИ >10 дней в месяц = -15%
  let sickDaysPoints = 0
  if (weeklySickDays < 3 && data.sickDays <= 9) {
    sickDaysPoints = 5
  } else if (weeklySickDays > 4 || data.sickDays > 10) {
    sickDaysPoints = -15
  }

  // Отпуск: <12 дней в месяц И <=30 дней за 90 дней = +10%, >12 дней в месяц ИЛИ >30 дней за 90 дней = -10%
  let vacationDaysPoints = 0
  if (data.vacationDays < 12 && ninetyDayVacationDays <= 30) {
    vacationDaysPoints = 10
  } else if (data.vacationDays > 12 || ninetyDayVacationDays > 30) {
    vacationDaysPoints = -10
  }

  // Прогулы: >2 в неделю = -30%
  let absenceDaysPoints = 0
  if (data.absenceDays > 2) {
    absenceDaysPoints = -30
  }

  // Стажировка: без влияния на рейтинг
  const internshipDaysPoints = 0

  let weeklyHoursPoints = 0
  if (weeklyHours >= 20) {
    weeklyHoursPoints = 25
  } else if (weeklyHours >= 15) {
    weeklyHoursPoints = 15
  }

  let weeklyEarningsPoints = 0
  if (weeklyEarnings >= 6000) {
    weeklyEarningsPoints = 30
  } else if (weeklyEarnings >= 3000) {
    weeklyEarningsPoints = 15
  }

  const referralsPoints = Math.min(data.referrals * 5, 30)

  // Базовый рейтинг без учета прогулов
  const baseRating = daysOffPoints +
    sickDaysPoints +
    vacationDaysPoints +
    weeklyHoursPoints +
    weeklyEarningsPoints +
    referralsPoints

  // Применяем штраф за прогулы
  const totalRating = Math.min(Math.max(0, baseRating + absenceDaysPoints), 100)

  return {
    daysOff: weeklyDaysOff, // Теперь показываем недельные выходные
    daysOffPoints,
    sickDays: data.sickDays, // Оставляем месячные больничные для отображения
    sickDaysPoints,
    vacationDays: data.vacationDays, // Оставляем месячные отпуска для отображения
    vacationDaysPoints,
    absenceDays: data.absenceDays,
    absenceDaysPoints,
    internshipDays: data.internshipDays,
    internshipDaysPoints,
    weeklyHours,
    weeklyHoursPoints,
    weeklyEarnings,
    weeklyEarningsPoints,
    referrals: data.referrals,
    referralsPoints,
    signals: data.signals,
    initiatives: data.initiatives,
    poolAmount: data.poolAmount,
    truancyDays: data.truancyDays,
    totalRating,
  }
}

export const getRatingColor = (rating: number): string => {
  if (rating >= 80) return '#10b981' // Эталон (зелёный)
  if (rating >= 60) return '#3b82f6' // Уверенно (синий)
  if (rating >= 40) return '#f59e0b' // В пути (янтарный)
  return '#f43f5e' // Зона роста (розовый)
}

export interface ExclusionStatus {
  status: 'excluded' | 'warning' | 'ok'
  label: string
  description: string
  color: string
}

export const getExclusionStatus = (rating: number): ExclusionStatus => {
  if (rating < 20) {
    return {
      status: 'excluded',
      label: 'Исключен',
      description: 'Участник исключается из сообщества',
      color: '#dc2626' // красный
    }
  } else if (rating >= 21 && rating <= 45) {
    return {
      status: 'warning',
      label: 'Исправиться',
      description: 'Необходимо улучшить показатели',
      color: '#f59e0b' // янтарный
    }
  } else {
    return {
      status: 'ok',
      label: 'В команде',
      description: 'Участник в команде',
      color: '#10b981' // зеленый
    }
  }
}



