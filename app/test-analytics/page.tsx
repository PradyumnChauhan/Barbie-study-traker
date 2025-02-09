'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CurvyBackground } from '../../components/CurvyBackground'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DatePicker } from "@/components/ui/date-picker"
import { format } from 'date-fns'

interface TestResult {
  id: number
  filename: string
  physics: number
  chemistry: number
  biology: number
  date: Date
  completed: boolean
}

export default function TestAnalyticsPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [currentTest, setCurrentTest] = useState<TestResult | null>(null)
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    const savedResults = localStorage.getItem('testResults')
    if (savedResults) {
      setTestResults(JSON.parse(savedResults, (key, value) => {
        if (key === 'date') return new Date(value)
        return value
      }))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('testResults', JSON.stringify(testResults))
  }, [testResults])

  const handleInputChange = (subject: 'physics' | 'chemistry' | 'biology', value: string) => {
    if (currentTest) {
      const updatedTest = {
        ...currentTest,
        [subject]: parseInt(value) || 0
      }
      setCurrentTest(updatedTest)
      
      setTestResults(prevResults => 
        prevResults.map(result => 
          result.id === updatedTest.id ? updatedTest : result
        )
      )
    }
  }

  const saveTestResult = () => {
    if (currentTest) {
      setTestResults(prevResults => {
        const index = prevResults.findIndex(result => result.id === currentTest.id)
        if (index !== -1) {
          const updatedResults = [...prevResults]
          updatedResults[index] = currentTest
          return updatedResults
        } else {
          return [...prevResults, currentTest]
        }
      })
      setCurrentTest(null)
      setSelectedTestId(null)
    }
  }

  const addNewTest = () => {
    const newTest = {
      id: Date.now(),
      filename: `Test ${testResults.length + 1}`,
      physics: 0,
      chemistry: 0,
      biology: 0,
      date: selectedDate || new Date(),
      completed: false
    }
    setCurrentTest(newTest)
    setSelectedTestId(null)
  }

  const handleTestSelection = (testId: string) => {
    setSelectedTestId(testId)
    const selected = testResults.find(test => test.id.toString() === testId)
    if (selected) {
      setCurrentTest(selected)
      setSelectedDate(selected.date)
    }
  }

  const getSubjectPercentage = (marks: number, maxMarks: number) => {
    return (marks / maxMarks) * 100
  }

  const chartData = testResults.map(result => ({
    name: format(result.date, 'dd/MM/yyyy'),
    Physics: getSubjectPercentage(result.physics, 180),
    Chemistry: getSubjectPercentage(result.chemistry, 180),
    Biology: getSubjectPercentage(result.biology, 360)
  }))

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 relative p-8">
      <CurvyBackground color="rgba(219, 39, 119, 0.1)" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 mb-8 text-center">
          Magical Test Analytics
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add or Edit Test Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Select onValueChange={handleTestSelection} value={selectedTestId || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a test" />
                </SelectTrigger>
                <SelectContent>
                  {testResults.map(test => (
                    <SelectItem key={test.id} value={test.id.toString()}>
                      {test.filename} - {format(test.date, 'dd/MM/yyyy')} {test.completed ? '(Completed)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DatePicker
                selected={selectedDate}
                onSelect={setSelectedDate}
                placeholderText="Select date"
              />
              <Button onClick={addNewTest} variant="outline" className="bg-pink-100 hover:bg-pink-200 text-pink-600">
                New Test
              </Button>
            </div>
            {currentTest && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  type="number"
                  placeholder="Physics (out of 180)"
                  value={currentTest.physics}
                  onChange={(e) => handleInputChange('physics', e.target.value)}
                  max={180}
                />
                <Input
                  type="number"
                  placeholder="Chemistry (out of 180)"
                  value={currentTest.chemistry}
                  onChange={(e) => handleInputChange('chemistry', e.target.value)}
                  max={180}
                />
                <Input
                  type="number"
                  placeholder="Biology (out of 360)"
                  value={currentTest.biology}
                  onChange={(e) => handleInputChange('biology', e.target.value)}
                  max={360}
                />
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={saveTestResult} className="bg-pink-500 hover:bg-pink-600 text-white">
                Save Result
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Performance Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Physics" fill="#FF69B4" />
                  <Bar dataKey="Chemistry" fill="#FF1493" />
                  <Bar dataKey="Biology" fill="#C71585" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Test Results History</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.ul className="space-y-4">
              {testResults.map(result => (
                <motion.li
                  key={result.id}
                  className="flex justify-between items-center p-4 bg-pink-50 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="font-medium text-pink-600">
                    {result.filename} - {format(result.date, 'dd/MM/yyyy HH:mm')} {result.completed ? '(Completed)' : ''}
                  </span>
                  <div className="flex gap-4">
                    <span className="text-pink-500">Physics: {result.physics}/180</span>
                    <span className="text-pink-500">Chemistry: {result.chemistry}/180</span>
                    <span className="text-pink-500">Biology: {result.biology}/360</span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

