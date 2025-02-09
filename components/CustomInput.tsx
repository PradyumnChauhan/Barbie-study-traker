import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CustomInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  label: string
  id: string
}

export default function CustomInput({ value, onChange, placeholder, label, id }: CustomInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border-2 border-pink-300 rounded-full focus:border-pink-500 transition-colors"
      />
    </div>
  )
}

