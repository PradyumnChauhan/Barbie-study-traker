'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import CustomButton from '../../components/CustomButton'
import CustomInput from '../../components/CustomInput'
// import FloatingTimer from '../../components/FloatingTimer'
import { CurvyBackground } from '../../components/CurvyBackground'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import TodoTimer from '../../components/TodoTimer'

interface Todo {
  id: number
  text: string
  completed: boolean
  subject: string
  class: string
  chapter: string
  timeSpent: number
  createdAt: string
  isTimerRunning: boolean
}

const subjects = {
  11: ['Physics', 'Chemistry', 'Biology'],
  12: ['Physics', 'Chemistry', 'Biology']
}

const subjectChapters = {
  11: {
    Physics: [
      'Physical World and Measurement', 'Kinematics', 'Laws of Motion', 'Work, Energy and Power',
      'Motion of System of Particles and Rigid Body', 'Gravitation', 'Properties of Bulk Matter',
      'Thermodynamics', 'Behaviour of Perfect Gas and Kinetic Theory', 'Oscillations and Waves'
    ],
    Chemistry: [
      'Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements and Periodicity in Properties',
      'Chemical Bonding and Molecular Structure', 'States of Matter', 'Thermodynamics',
      'Equilibrium', 'Redox Reactions', 'Hydrogen', 'The s-Block Elements',
      'The p-Block Elements', 'Organic Chemistry – Some Basic Principles and Techniques', 'Hydrocarbons',
      'Environmental Chemistry'
    ],
    Biology: [
      'Diversity in Living World', 'Structural Organisation in Animals and Plants',
      'Cell Structure and Function', 'Plant Physiology', 'Human Physiology'
    ]
  },
  12: {
    Physics: [
      'Electric Charges and Fields', 'Electrostatic Potential and Capacitance', 'Current Electricity',
      'Moving Charges and Magnetism', 'Magnetism and Matter', 'Electromagnetic Induction',
      'Alternating Current', 'Electromagnetic Waves', 'Ray Optics and Optical Instruments',
      'Wave Optics', 'Dual Nature of Radiation and Matter', 'Atoms', 'Nuclei', 'Semiconductor Electronics'
    ],
    Chemistry: [
      'Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry',
      'General Principles and Processes of Isolation of Elements', 'The p-Block Elements',
      'The d-and f-Block Elements', 'Coordination Compounds', 'Haloalkanes and Haloarenes',
      'Alcohols, Phenols and Ethers', 'Aldehydes, Ketones and Carboxylic Acids',
      'Amines', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life'
    ],
    Biology: [
      'Reproduction', 'Genetics and Evolution', 'Biology and Human Welfare',
      'Biotechnology and Its Applications', 'Ecology and Environment'
    ]
  }
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [rewards, setRewards] = useState(0)
  const [selectedClass, setSelectedClass] = useState('11')
  const [selectedSubject, setSelectedSubject] = useState('Physics')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [filterDate, setFilterDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
    const savedRewards = localStorage.getItem('rewards')
    if (savedRewards) {
      setRewards(JSON.parse(savedRewards))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem('rewards', JSON.stringify(rewards))
  }, [rewards])

  const addTodo = () => {
    if (input.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: input,
        completed: false,
        subject: selectedSubject,
        class: selectedClass,
        chapter: selectedChapter,
        timeSpent: 0,
        createdAt: new Date().toISOString(),
        isTimerRunning: false
      }
      setTodos(prevTodos => [...prevTodos, newTodo])
      setInput('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed, isTimerRunning: false } : todo
    ))
  }

  const completeTodo = (id: number) => {
    toggleTodo(id)
    setRewards(prevRewards => prevRewards + 10)
  }

  const updateTodoTime = useCallback((id: number, newTime: number) => {
    setTodos(prevTodos => prevTodos.map(todo =>
      todo.id === id ? { ...todo, timeSpent: newTime } : todo
    ))
  }, [])

  const filteredTodos = todos.filter(todo => {
    if (!filterDate) return true
    const todoDate = new Date(todo.createdAt)
    return todoDate.toDateString() === filterDate.toDateString()
  })

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-pink-200 to-purple-200 relative">
      <CurvyBackground color="rgba(219, 39, 119, 0.1)" />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-pink-600 mb-8">Barbie's Magical Todo List</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Select onValueChange={setSelectedClass} value={selectedClass}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11">Class 11</SelectItem>
                  <SelectItem value="12">Class 12</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects[selectedClass as keyof typeof subjects].map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedChapter} value={selectedChapter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent>
                  {subjectChapters[selectedClass as keyof typeof subjectChapters][selectedSubject as keyof (typeof subjectChapters)[keyof typeof subjectChapters]].map(chapter => (
                    <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-4">
              <CustomInput
                id="new-task"
                label="New Task"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a new task..."
              />
              <div className="flex items-end">
                <CustomButton onClick={addTodo}>Add Task</CustomButton>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Tasks</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !filterDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterDate ? format(filterDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filterDate}
                    onSelect={setFilterDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.ul className="space-y-2">
              {filteredTodos.map(todo => (
                <motion.li
                  key={todo.id}
                  className={`flex items-center space-x-2 ${todo.completed ? 'line-through text-pink-300' : ''}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => completeTodo(todo.id)}
                    className="form-checkbox h-5 w-5 text-pink-500"
                  />
                  <span>{todo.text}</span>
                  <span className="text-sm text-gray-500">
                    ({todo.class} - {todo.subject} - {todo.chapter})
                  </span>
                  <span className="text-sm text-gray-500">
                    Created: {format(new Date(todo.createdAt), 'yyyy-MM-dd HH:mm')}
                  </span>
                  <span className="text-sm text-gray-500">
                    Time spent: {Math.floor(todo.timeSpent / 60)}:{(todo.timeSpent % 60).toString().padStart(2, '0')}
                  </span>
                  <TodoTimer
                    key={todo.id}
                    todoId={todo.id}
                    initialTime={todo.timeSpent}
                    onTimeUpdate={updateTodoTime}
                  />
                </motion.li>
              ))}
            </motion.ul>
          </CardContent>
        </Card>
        <></>
      </div>
    </div>
  )
}

