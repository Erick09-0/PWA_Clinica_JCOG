import { TrendingUp, ChevronDown, RefreshCw } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion } from 'motion/react';

const performers = [
  {
    rank: '1st',
    name: 'Sarah',
    image: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTM0OTczOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    rank: '2nd',
    name: 'Jonathan',
    image: 'https://images.unsplash.com/photo-1758518727984-17b37f2f0562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzc3xlbnwxfHx8fDE3NjE0MjYyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    rank: '3rd',
    name: 'Yustine',
    image: 'https://images.unsplash.com/photo-1585554414787-09b821c321c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MTQ1MTEzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    rank: '4th',
    name: 'Lucas',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTQwMTY3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export function TopPerformance() {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl p-7 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.3 }}
          className="flex items-center gap-3"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.35, type: 'spring', stiffness: 200, damping: 15 }}
            className="p-3 bg-blue-100 rounded-2xl"
          >
            <TrendingUp size={20} className="text-blue-600" strokeWidth={2} />
          </motion.div>
          <div>
            <h3 className="font-semibold mb-1">Top Performance</h3>
            <p className="text-xs text-gray-500">Best performing employee ranking.</p>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4 }}
          className="flex items-center gap-2"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            Augustus
            <ChevronDown size={16} className="text-gray-400" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all"
          >
            <RefreshCw size={18} className="text-gray-600" />
          </motion.button>
        </motion.div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {performers.map((performer, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 1.5 + (index * 0.1),
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            whileHover={{ y: -8, scale: 1.05 }}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="relative mb-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Avatar className="w-24 h-24 ring-4 ring-gray-100">
                  <AvatarImage src={performer.image} className="object-cover" />
                  <AvatarFallback className="font-semibold">{performer.name[0]}</AvatarFallback>
                </Avatar>
              </motion.div>
              {index === 0 && (
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.8, type: 'spring', stiffness: 200, damping: 15 }}
                  className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <span className="text-xs">👑</span>
                </motion.div>
              )}
            </div>
            <div className="text-sm font-semibold text-gray-500 mb-0.5">{performer.rank}</div>
            <div className="text-sm font-semibold">{performer.name}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
