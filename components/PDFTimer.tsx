'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { AlertCircle, Play, Pause, RotateCcw } from 'lucide-react'

interface PDFTimerProps {
  onTimeUpdate: (time: number) => void
  onComplete: () => void
}

export default function PDFTimer({ onTimeUpdate, onComplete }: PDFTimerProps) {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [hasWarned, setHasWarned] = useState(false)
  const maxTime = 3 * 60 * 60 // 3 hours in seconds
  const warningTime = 60 * 60 // 1 hour in seconds

  const playSound = (type: 'tick' | 'warning' | 'complete') => {
    const audio = new Audio()
    switch (type) {
      case 'tick':
        audio.src = '/sounds/tick.mp3'
        audio.volume = 0.1
        break
      case 'warning':
        audio.src = '/sounds/warning.mp3'
        audio.volume = 0.3
        break
      case 'complete':
        audio.src = '/sounds/complete.mp3'
        audio.volume = 0.5
        break
    }
    audio.play().catch(console.error)
  }

  const updateTime = useCallback(() => {
    setTime(prevTime => {
      const newTime = prevTime + 1
      if (newTime === warningTime && !hasWarned) {
        playSound('warning')
        setHasWarned(true)
      }
      if (newTime >= maxTime) {
        setIsRunning(false)
        playSound('complete')
        onComplete()
        return maxTime
      }
      onTimeUpdate(newTime)
      return newTime
    })
  }, [hasWarned, onTimeUpdate, onComplete])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && time < maxTime) {
      interval = setInterval(() => {
        updateTime()
        playSound('tick')
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, time, updateTime])

  const toggleTimer = () => {
    setIsRunning(prev => !prev)
  }

  const resetTimer = () => {
    setTime(0)
    setIsRunning(false)
    setHasWarned(false)
    onTimeUpdate(0)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    if (time >= maxTime) return 'text-red-500'
    if (time >= warningTime) return 'text-yellow-500'
    return 'text-pink-600'
  }

  return (
    <div className="timer-container">
      <div className="flex flex-col items-center gap-4">
        <div className={`timer-display ${getTimeColor()}`}>
          {formatTime(time)}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-pink-200 hover:bg-pink-300 text-pink-600 border-pink-300 font-semibold"
            onClick={toggleTimer}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? ' Pause' : ' Start'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-pink-200 hover:bg-pink-300 text-pink-600 border-pink-300 font-semibold"
            onClick={resetTimer}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
        {time >= warningTime && time < maxTime && (
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertCircle className="w-4 h-4" />
            <span>1 hour has passed!</span>
          </div>
        )}
        {time >= maxTime && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span>Time limit reached!</span>
          </div>
        )}
      </div>
    </div>
  )
}

