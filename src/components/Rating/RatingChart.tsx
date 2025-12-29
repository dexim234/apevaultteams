import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { formatDate } from '@/utils/dateUtils'
import { TeamRatingHistory } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface RatingChartProps {
  history: TeamRatingHistory[]
  theme: string
}

export const RatingChart: React.FC<RatingChartProps> = ({ history, theme }) => {
  const chartData = useMemo(() => {
    const labels = history.map(item => formatDate(item.date, 'dd MMM'))
    const data = history.map(item => item.averageRating)

    return {
      labels,
      datasets: [
        {
          label: 'Средний рейтинг команды',
          data,
          borderColor: theme === 'dark' ? '#86EFAC' : '#10B981',
          backgroundColor: theme === 'dark' ? 'rgba(134, 239, 172, 0.2)' : 'rgba(16, 185, 129, 0.2)',
          fill: true,
          tension: 0.3,
        },
      ],
    }
  }, [history, theme])

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.7)',
        titleColor: theme === 'dark' ? '#fff' : '#fff',
        bodyColor: theme === 'dark' ? '#fff' : '#fff',
        borderColor: theme === 'dark' ? '#48a35e' : '#10B981',
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
      },
    },
    scales: {
      x: {
        type: 'category',
        display: true,
        grid: {},
        ticks: {
          color: theme === 'dark' ? '#cbd5e1' : '#4b5563',
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
        }
      },
      y: {
        type: 'linear',
        display: true,
        min: 0,
        max: 100,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#cbd5e1' : '#4b5563',
          callback: function (value) {
            return `${value}%`
          }
        }
      },
    },
  }

  return (
    <div className="h-full w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}
