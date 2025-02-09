import './globals.css'
import { CurvyBackground } from '../components/CurvyBackground'

export const metadata = {
  title: 'Barbie Cinderella Todo App',
  description: 'A magical todo app for students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-pink-200 to-purple-200">
        <CurvyBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}

