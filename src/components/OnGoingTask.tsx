import { Search, Filter, Maximize2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion } from 'motion/react';

const tasks = [
  {
    id: 1,
    name: 'Journey Scarves',
    description: 'Rebranding and Website Design',
    icon: 'JS',
    iconBg: 'bg-black',
    status: 'On Going',
    procrastination: '51%',
    dueDate: 'Aug 17, 2024',
    members: [
      'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTM0OTczOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758518727984-17b37f2f0562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzc3xlbnwxfHx8fDE3NjE0MjYyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1585554414787-09b821c321c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MTQ1MTEzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTQwMTY3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
  },
  {
    id: 2,
    name: 'Edifier',
    description: 'Web Design & Development',
    icon: 'E',
    iconBg: 'bg-cyan-500',
    status: 'On Going',
    procrastination: '51%',
    dueDate: 'Aug 17, 2024',
    members: [
      'https://images.unsplash.com/photo-1729558446316-67ed74b26d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVtYmVyJTIwYXZhdGFyfGVufDF8fHx8MTc2MTQ2MTEyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758518727984-17b37f2f0562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzc3xlbnwxfHx8fDE3NjE0MjYyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
  },
  {
    id: 3,
    name: 'Ugreen',
    description: 'Web App & Dashboard',
    icon: 'U',
    iconBg: 'bg-green-600',
    status: 'On Going',
    procrastination: '89%',
    dueDate: 'Aug 15, 2024',
    members: [
      'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTM0OTczOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1585554414787-09b821c321c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MTQ1MTEzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758518727984-17b37f2f0562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzc3xlbnwxfHx8fDE3NjE0MjYyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
  },
  {
    id: 4,
    name: 'CNN',
    description: 'Rebranding and Stained Content',
    icon: 'CNN',
    iconBg: 'bg-red-600',
    status: 'On Going',
    procrastination: '89%',
    dueDate: 'Aug 15, 2024',
    members: [
      'https://images.unsplash.com/photo-1729558446316-67ed74b26d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVtYmVyJTIwYXZhdGFyfGVufDF8fHx8MTc2MTQ2MTEyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTQwMTY3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1585554414787-09b821c321c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MTQ1MTEzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758518727984-17b37f2f0562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzc3xlbnwxfHx8fDE3NjE0MjYyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    ],
  },
];

export function OnGoingTask() {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl p-7 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="font-semibold mb-1">On Going Task</h3>
          <p className="text-sm text-gray-500">Best performing employee ranking.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.95 }}
          className="flex items-center gap-2"
        >
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all"
          >
            <Search size={18} className="text-gray-600" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all"
          >
            <Filter size={18} className="text-gray-600" />
          </motion.button>
        </motion.div>
      </div>

      <div className="space-y-5">
        {tasks.map((task, index) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + (index * 0.1) }}
            whileHover={{ x: 4, backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
            className="flex items-center gap-4 pb-5 border-b border-gray-100 last:border-0 rounded-xl transition-all cursor-pointer px-2 py-2"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1 + (index * 0.1), type: 'spring', stiffness: 200, damping: 15 }}
              className={`w-12 h-12 ${task.iconBg} rounded-2xl flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}
            >
              {task.icon}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold mb-1">{task.name}</div>
              <div className="text-sm text-gray-500">{task.description}</div>
            </div>
            <div className="flex -space-x-2">
              {task.members.map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, x: -20 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ delay: 1.2 + (index * 0.1) + (idx * 0.05), type: 'spring', stiffness: 200, damping: 15 }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                >
                  <Avatar className="w-9 h-9 border-2 border-white ring-1 ring-gray-100 cursor-pointer">
                    <AvatarImage src={member} />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-4 text-center"
      >
        <div>
          <div className="text-xs text-gray-500 mb-1.5 font-medium">Status</div>
          <div className="text-sm font-semibold">{tasks[0].status}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1.5 font-medium">Procrastination</div>
          <div className="text-sm font-semibold">{tasks[0].procrastination}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1.5 font-medium">Due Date</div>
          <div className="text-sm font-semibold">{tasks[0].dueDate}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
