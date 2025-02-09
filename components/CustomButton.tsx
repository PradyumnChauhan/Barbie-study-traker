import { motion } from 'framer-motion'

interface CustomButtonProps {
  onClick: () => void
  children: React.ReactNode
}

export default function CustomButton({ onClick, children }: CustomButtonProps) {
  return (
    <motion.button
      className="px-4 py-2 bg-pink-400 text-white rounded-full shadow-lg hover:bg-pink-500 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}

