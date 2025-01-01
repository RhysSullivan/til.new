'use client'

import { useMemo } from 'react'

export function ContributionHeatmap() {
  const WEEKS = 53
  const DAYS_PER_WEEK = 7

  // Generate random data for the last year
  const contributions = useMemo(() => {
    const data = []
    const now = new Date()
    const startDate = new Date(now)
    startDate.setFullYear(now.getFullYear() - 1)

    for (let week = 0; week < WEEKS; week++) {
      const weekData = []
      for (let day = 0; day < DAYS_PER_WEEK; day++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + (week * 7 + day))
        
        // Only add contributions up to current date
        const isInPast = date <= now
        
        // Generate random count between 0 and 30 for past dates
        const count = isInPast ? Math.floor(Math.random() * 5) : 0
        
        // Calculate intensity based on count
        let intensity = 0
        if (count > 0) {
          if (count >= 4) intensity = 3
          else if (count >= 3) intensity = 2
          else if (count >= 2) intensity = 1
          else if (count >= 1) intensity = 0
          else intensity = 1
        }

        weekData.push({
          date,
          count,
          intensity
        })
      }
      data.push(weekData)
    }
    return data
  }, [])

  // Calculate total contributions
  const totalContributions = useMemo(() => {
    return contributions.flat().reduce((sum, day) => sum + day.count, 0)
  }, [contributions])

  // Get month labels
  const months = useMemo(() => {
    const labels = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now)
      date.setMonth(now.getMonth() - i)
      labels.push(date.toLocaleString('default', { month: 'short' }))
    }
    return labels
  }, [])

  // Get intensity class based on contribution count
  const getIntensityClass = (intensity: number) => {
    switch (intensity) {
      case 1: return 'bg-neutral-700'
      case 2: return 'bg-neutral-600'
      case 3: return 'bg-neutral-500'
      case 4: return 'bg-neutral-400'
      case 5: return 'bg-neutral-300'
      default: return 'bg-neutral-800'
    }
  }

  return (
      <div className="rounded-lg  p-4 max-w-fit">
        
        
        <div className="flex gap-2">
          <div className="flex flex-col justify-between pr-2 text-xs text-neutral-400">
            <div className="h-[15px]" /> {/* Spacing for month labels */}
            <div className="h-[13px] flex items-center">Mon</div>
            <div className="h-[13px]" /> {/* Spacing for Tuesday */}
            <div className="h-[13px] flex items-center">Wed</div>
            <div className="h-[13px]" /> {/* Spacing for Thursday */}
            <div className="h-[13px] flex items-center">Fri</div>
            <div className="h-[13px]" /> {/* Spacing for Saturday */}
          </div>

          <div>
            <div className="mb-2 flex justify-between text-xs text-neutral-400">
              {months.map((month, i) => (
                <div key={i} className="w-[15px] text-center">{month}</div>
              ))}
            </div>

            <div className="flex gap-[3px]">
              {contributions.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`h-[13px] w-[13px] rounded-sm ${getIntensityClass(day.intensity)}`}
                      title={`${day.count} contributions on ${day.date.toDateString()}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}

