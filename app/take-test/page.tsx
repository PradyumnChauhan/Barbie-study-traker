'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CurvyBackground } from '../../components/CurvyBackground'
import PDFTimer from '../../components/PDFTimer'
import { motion } from 'framer-motion'
import { FileText, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface PDFSession {
  id: number
  filename: string
  timeSpent: number
  completed: boolean
}

export default function TakeTestPage() {
  const [pdfUrl, setPdfUrl] = useState('')
  const [rewards, setRewards] = useState(0)
  const [pdfSessions, setPdfSessions] = useState<PDFSession[]>([])
  const [currentSession, setCurrentSession] = useState<PDFSession | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedSessions = localStorage.getItem('pdfSessions')
    if (savedSessions) {
      setPdfSessions(JSON.parse(savedSessions))
    }
    const savedRewards = localStorage.getItem('rewards')
    if (savedRewards) {
      setRewards(JSON.parse(savedRewards))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('pdfSessions', JSON.stringify(pdfSessions))
  }, [pdfSessions])

  useEffect(() => {
    localStorage.setItem('rewards', JSON.stringify(rewards))
  }, [rewards])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fileUrl = URL.createObjectURL(file)
      setPdfUrl(fileUrl)
      const newSession: PDFSession = {
        id: Date.now(),
        filename: file.name,
        timeSpent: 0,
        completed: false
      }
      setCurrentSession(newSession)
      setPdfSessions([...pdfSessions, newSession])
    }
  }

  const updateSessionTime = (newTime: number) => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        timeSpent: newTime
      })
      setPdfSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === currentSession.id
            ? { ...session, timeSpent: newTime }
            : session
        )
      )
    }
  }

  const completeTest = () => {
    if (currentSession) {
      const completedSession = { ...currentSession, completed: true }
      setPdfSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === completedSession.id ? completedSession : session
        )
      )
      setCurrentSession(null)
      router.push('/test-analytics')
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 relative p-8">
      <CurvyBackground color="rgba(219, 39, 119, 0.1)" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 mb-8 text-center">
          Take Your Magical Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Load Your Test Paper
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-pink-50 file:text-pink-700
                  hover:file:bg-pink-100
                  transition-all duration-300"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Test Timer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PDFTimer onTimeUpdate={updateSessionTime} onComplete={completeTest} />
            </CardContent>
          </Card>
        </div>

        {pdfUrl && (
          <Card className="mb-8">
            <CardContent className="p-0">
              <iframe src={pdfUrl} className="w-full h-[70vh] rounded-lg" />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Previous Test Sessions</span>
              <Link href="/test-analytics">
                <Button variant="outline" className="bg-pink-100 hover:bg-pink-200 text-pink-600">
                  View Analytics
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.ul className="space-y-4">
              {pdfSessions.map(session => (
                <motion.li
                  key={session.id}
                  className="flex justify-between items-center p-4 bg-pink-50 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="font-medium text-pink-600">{session.filename}</span>
                  <span className="text-pink-500">
                    {formatTime(session.timeSpent)} {session.completed ? '(Completed)' : ''}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

