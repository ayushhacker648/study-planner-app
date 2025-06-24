import { CheckCircle, Circle, Calendar, BookOpen } from 'lucide-react';
import { formatExamStatus } from '../utils/scheduler';

const DailyPlanner = ({ subjects, onToggleComplete }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getTodayTasks = () => {
    const tasks = [];
    subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        if (topic.scheduledDate === today) {
          tasks.push({
            subjectId: subject.id,
            subjectName: subject.name,
            subjectColor: subject.color,
            topicId: topic.id,
            topicName: topic.name,
            completed: topic.completed,
            examDate: subject.examDate
          });
        }
      });
    });
    return tasks.sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
  };

  const getUpcomingTasks = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const tasks = [];
    subjects.forEach(subject => {
      subject.topics.forEach(topic => {
        if (topic.scheduledDate === tomorrowStr && !topic.completed) {
          tasks.push({
            subjectId: subject.id,
            subjectName: subject.name,
            subjectColor: subject.color,
            topicId: topic.id,
            topicName: topic.name,
            completed: topic.completed,
            examDate: subject.examDate
          });
        }
      });
    });
    return tasks.sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
  };

  const todayTasks = getTodayTasks();
  const upcomingTasks = getUpcomingTasks();
  const completedToday = todayTasks.filter(task => task.completed).length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Study Plan</h1>
        <p className="text-gray-600">{todayFormatted}</p>
      </div>

      {/* Today's Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Today's Progress
          </h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-900">
              {completedToday}/{todayTasks.length}
            </p>
          </div>
        </div>
        
        {todayTasks.length > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {Math.round(todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0)}% complete
            </p>
          </div>
        )}
      </div>

      {/* Today's Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-green-600" />
          Today's Tasks
        </h2>
        
        {todayTasks.length > 0 ? (
          <div className="space-y-3">
            {todayTasks.map((task) => {
              return (
                <div 
                  key={`${task.subjectId}-${task.topicId}`}
                  className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                    task.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => onToggleComplete(task.subjectId, task.topicId)}
                    className="mr-4 flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: task.subjectColor }}
                      />
                      <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.topicName}
                      </h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>{task.subjectName}</span>
                      <span className="mx-2">•</span>
                      <span>{formatExamStatus(task.examDate)}</span>
                    </div>
                  </div>
                  
                  {task.completed && (
                    <div className="text-sm text-green-600 font-medium">
                      ✓ Completed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks for today!</h3>
            <p className="text-gray-500">
              You're all caught up! Check back tomorrow or add more subjects to get started.
            </p>
          </div>
        )}
      </div>

      {/* Tomorrow's Preview */}
      {upcomingTasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Tomorrow's Preview
          </h2>
          
          <div className="space-y-3">
            {upcomingTasks.slice(0, 3).map((task) => (
              <div 
                key={`${task.subjectId}-${task.topicId}`}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: task.subjectColor }}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.topicName}</p>
                  <p className="text-sm text-gray-600">{task.subjectName}</p>
                </div>
              </div>
            ))}
            
            {upcomingTasks.length > 3 && (
              <p className="text-sm text-gray-500 text-center pt-2">
                +{upcomingTasks.length - 3} more tasks tomorrow
              </p>
            )}
          </div>
        </div>
      )}

      {/* Motivational Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">
            {completedToday === todayTasks.length && todayTasks.length > 0
              ? "🎉 Amazing! You've completed all tasks for today!"
              : completedToday > 0
              ? "🚀 Great progress! Keep it up!"
              : "💪 Ready to start your study session?"}
          </h3>
          <p className="text-blue-100">
            {completedToday === todayTasks.length && todayTasks.length > 0
              ? "You're doing fantastic! Take a well-deserved break."
              : "Every small step brings you closer to your goals. You've got this!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyPlanner;