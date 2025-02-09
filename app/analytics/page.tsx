'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { CurvyBackground } from '../../components/CurvyBackground'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts'
import { PieChart, Pie } from 'recharts'

interface Todo {
  id: number
  text: string
  completed: boolean
  subject: string
  class: string
  chapter: string
  timeSpent: number
  createdAt: string
}

const subjects = ['Physics', 'Chemistry', 'Biology']
const classes = ['11', '12']

export default function AnalyticsPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedClass, setSelectedClass] = useState<string>('11')
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics')

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  const getFilteredTodos = () => {
    return todos.filter(todo => {
      const todoDate = new Date(todo.createdAt)
      return (
        (!selectedDate || todoDate.toDateString() === selectedDate.toDateString()) &&
        todo.class === selectedClass &&
        todo.subject === selectedSubject
      )
    })
  }

  const getChartData = () => {
    const filteredTodos = getFilteredTodos()
    const chapterData: { [key: string]: number } = {}

    filteredTodos.forEach(todo => {
      if (!chapterData[todo.chapter]) {
        chapterData[todo.chapter] = 0
      }
      chapterData[todo.chapter] += todo.timeSpent
    })

    return Object.entries(chapterData).map(([chapter, timeSpent]) => ({
      chapter,
      timeSpent: Math.round(timeSpent / 60) // Convert seconds to minutes
    }))
  }

  const getPieChartData = () => {
    const filteredTodos = getFilteredTodos()
    const completed = filteredTodos.filter(todo => todo.completed).length
    const incomplete = filteredTodos.filter(todo => !todo.completed).length

    return [
      { name: 'Completed', value: completed },
      { name: 'Incomplete', value: incomplete }
    ]
  }

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={getChartData()}>
        <XAxis dataKey="chapter" />
        <YAxis
          tickFormatter={(value) => `${value}min`}
          domain={[0, 'dataMax + 10']}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]}
        />
        <Tooltip formatter={(value) => `${value} min`} />
        <Legend />
        <Bar dataKey="timeSpent" name="Time Spent">
          {getChartData().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`hsl(328, 100%, ${75 - index * 5}%)`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )

  const renderPieChart = () => {
    const COLORS = ['#FF69B4', '#FF1493']
    const data = getPieChartData()

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-pink-100 to-purple-100">
      <CurvyBackground color="rgba(219, 39, 119, 0.1)" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 mb-8 text-center">Magical Analytics</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <DatePicker
              selected={selectedDate}
              onSelect={setSelectedDate}
              placeholderText="Filter by date"
            />
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Time Spent per Chapter (Bar Chart)</CardTitle>
            </CardHeader>
            <CardContent>
              {renderBarChart()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Completion Status</CardTitle>
            </CardHeader>
            <CardContent>
              {renderPieChart()}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Todo List Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {getFilteredTodos().map(todo => (
                <li key={todo.id} className="flex justify-between items-center p-2 bg-pink-50 rounded">
                  <span className={todo.completed ? 'line-through text-pink-300' : 'text-pink-600'}>
                    {todo.text}
                  </span>
                  <span className="text-sm text-pink-500">
                    {Math.round(todo.timeSpent / 60)} min
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

