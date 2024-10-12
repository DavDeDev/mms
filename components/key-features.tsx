import { Users, Calendar, BarChart, BookOpen, MessageSquare, Zap } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Mentor-Mentee Matching",
    description: "Intelligent algorithm to pair mentors with mentees based on goals and interests."
  },
  {
    icon: Calendar,
    title: "Session Scheduling",
    description: "Easy-to-use calendar for scheduling and managing mentorship sessions."
  },
  {
    icon: BarChart,
    title: "Progress Tracking",
    description: "Monitor and analyze the impact of your mentorship program with detailed reports."
  },
  {
    icon: BookOpen,
    title: "Resource Library",
    description: "Curated collection of materials to support mentors and mentees throughout their journey."
  },
  {
    icon: MessageSquare,
    title: "Feedback System",
    description: "Collect and analyze feedback from mentors and mentees to continuously improve the program."
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "Streamlined interface for common tasks to save time and increase efficiency."
  }
]

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
          Key Features
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <feature.icon className="h-12 w-12 mb-4 text-brand" />
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}