import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const BadgeSuccess = ({ children, className }: any) => {
  return (
    <Badge 
      className={cn(
        'border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5',
        className
      )}
    >
      {children}
    </Badge>
  )
}

export default BadgeSuccess