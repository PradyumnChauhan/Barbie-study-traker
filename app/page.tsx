import Link from 'next/link'
import Image from 'next/image'
import { CurvyBackground } from '../components/CurvyBackground'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-200 to-purple-200 relative overflow-hidden">
      <CurvyBackground color="rgba(219, 39, 119, 0.1)" />
      <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-sm relative z-10">
        <CardHeader>
          <CardTitle className="text-5xl font-bold text-center text-pink-600 text-shadow">Welcome to Anupriya's Magical Study Planner</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-8">
          <div className="flex items-center space-x-4">
            <Image 
              src="https://i.pinimg.com/736x/05/31/93/05319342e2c0a9a6ac73d680f21b4871.jpg" 
              alt="Barbie Logo" 
              width={200} 
              height={100}
              className="object-contain"
            />
            <div className="text-5xl font-bold text-pink-600 text-shadow">Anupriya</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <Link href="/todo" className="transform transition-all hover:scale-105">
              <Card className="bg-pink-100 hover:bg-pink-200">
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <h2 className="text-2xl font-bold text-pink-600">Todo List</h2>
                  <p className="text-pink-500">Organize your tasks</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/take-test" className="transform transition-all hover:scale-105">
              <Card className="bg-purple-100 hover:bg-purple-200">
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <h2 className="text-2xl font-bold text-pink-600">Take Test</h2>
                  <p className="text-pink-500">Study your materials</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/analytics" className="transform transition-all hover:scale-105">
              <Card className="bg-pink-100 hover:bg-pink-200">
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <h2 className="text-2xl font-bold text-pink-600">Analytics</h2>
                  <p className="text-pink-500">Track your progress</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/test-analytics" className="transform transition-all hover:scale-105">
              <Card className="bg-purple-100 hover:bg-purple-200">
                <CardContent className="flex flex-col items-center justify-center h-40">
                  <h2 className="text-2xl font-bold text-pink-600">Test Analytics</h2>
                  <p className="text-pink-500">Analyze your test results</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

