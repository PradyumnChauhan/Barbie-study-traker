'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TodoTimerProps {
  todoId: number
  initialTime: number
  onTimeUpdate: (id: number, time: number) => void
}

export default function TodoTimer({ todoId, initialTime, onTimeUpdate }: TodoTimerProps) {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLimit, setTimeLimit] = useState<number | null>(null)
  const [showLimitInput, setShowLimitInput] = useState(false)
  const [tempLimit, setTempLimit] = useState('')

  const updateTime = useCallback(() => {
    setTime(prevTime => {
      const newTime = prevTime + 1
      if (timeLimit && newTime >= timeLimit * 60) {
        setIsRunning(false)
        return timeLimit * 60
      }
      onTimeUpdate(todoId, newTime)
      return newTime
    })
  }, [todoId, onTimeUpdate, timeLimit])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(updateTime, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, updateTime])

  const toggleTimer = () => {
    setIsRunning(prev => !prev)
  }

  const resetTimer = () => {
    setTime(0)
    setIsRunning(false)
    onTimeUpdate(todoId, 0)
  }

  const handleSetTimeLimit = () => {
    const limit = parseInt(tempLimit)
    if (!isNaN(limit) && limit > 0) {
      setTimeLimit(limit)
      setShowLimitInput(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2,'0')}`
  }

  const getProgress = () => {
    if (!timeLimit) return 0
    return (time / (timeLimit * 60)) * 100
  }

  return (
    <div className="timer-container">
      <div className="flex items-center gap-4">
        <div className="timer-display relative">
          {formatTime(time)}
          {timeLimit && (
            <div 
              className="absolute bottom-0 left-0 h-1 bg-pink-400 rounded"
              style={{ width: `${getProgress()}%` }}
            />
          )}
        </div>
        <div className="text-sm text-pink-500">
          {timeLimit ? `${formatTime(time)} / ${formatTime(timeLimit * 60)}` : 'No limit set'}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-pink-200 hover:bg-pink-300 text-pink-600 border-pink-300 font-semibold"
            onClick={toggleTimer}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-pink-200 hover:bg-pink-300 text-pink-600 border-pink-300 font-semibold"
            onClick={resetTimer}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-pink-200 hover:bg-pink-300 text-pink-600 border-pink-300 font-semibold"
              >
                <Clock className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <h4 className="font-semibold">Set Time Limit</h4>
                <Input
                  type="number"
                  placeholder="Minutes"
                  min="1"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(e.target.value)}
                  className="w-full"
                />
                <Button onClick={handleSetTimeLimit} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                  Set
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

