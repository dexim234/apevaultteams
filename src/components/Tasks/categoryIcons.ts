import { TaskCategory } from '@/types'
import {
  BookOpen,
  CandlestickChart,
  ClipboardList,
  Cpu,
  FlaskConical,
  LucideIcon,
  Radio,
} from 'lucide-react'

export const CATEGORY_ICONS: Record<TaskCategory, LucideIcon> = {
  trading: CandlestickChart,
  learning: BookOpen,
  technical: Cpu,
  stream: Radio,
  research: FlaskConical,
  organization: ClipboardList,
}
