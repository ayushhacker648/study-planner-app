import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getCalendarData, formatExamStatus } from '../utils/scheduler';

const CalendarView = ({ subjects, onToggleComplete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const calendarData = getCalendarData(subjects);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

 const formatDateKey = (date) => {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // outputs YYYY-MM-DD
};


  const isToday = (date) => {
    return formatDateKey(date) === formatDateKey(today);
  };

  const isPastDate = (date) => {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateOnly < todayOnly;
  };

  const isExamDate = (date) => {
    const dateKey = formatDateKey(date);
    return subjects.some(subject => subject.examDate === dateKey);
  };

  const getExamsOnDate = (date) => {
    const dateKey = formatDateKey(date);
    return subjects.filter(subject => subject.examDate === dateKey);
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Calendar</h1>
        <p className="text-gray-600">View your scheduled topics and track progress</p>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            {monthYear}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="p-3 min-h-[120px]" />;
            }

            const dateKey = formatDateKey(date);
            const dayTasks = calendarData[dateKey] || [];
            const completedTasks = dayTasks.filter(task => task.completed);
            const isCurrentDay = isToday(date);
            const isPast = isPastDate(date);
            const hasExam = isExamDate(date);
            const examsOnDate = getExamsOnDate(date);

            return (
              <div
                key={index}
                className={`p-2 min-h-[120px] border border-gray-200 ${
                  isCurrentDay 
                    ? 'bg-blue-50 border-blue-300' 
                    : isPast 
                    ? 'bg-gray-50' 
                    : hasExam
                    ? 'bg-red-50 border-red-300'
                    : 'bg-white hover:bg-gray-50'
                } transition-colors`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentDay 
                    ? 'text-blue-600' 
                    : isPast 
                    ? 'text-gray-400' 
                    : hasExam
                    ? 'text-red-600'
                    : 'text-gray-900'
                }`}>
                  {date.getDate()}
                  {isCurrentDay && (
                    <span className="ml-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                  {hasExam && (
                    <span className="ml-1 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                      Exam
                    </span>
                  )}
                </div>
                
                {/* Show exam information */}
                {hasExam && (
                  <div className="mb-2">
                    {examsOnDate.map(subject => (
                      <div
                        key={subject.id}
                        className="text-xs p-1.5 rounded bg-red-100 text-red-800 mb-1"
                        title={`${subject.name} Exam`}
                      >
                        <div className="font-medium truncate">
                          📝 {subject.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Show study tasks */}
                {dayTasks.length > 0 && (
                  <div className="space-y-1">
                    {dayTasks.slice(0, hasExam ? 2 : 3).map((task) => (
                      <div
                        key={`${task.subjectId}-${task.topicId}`}
                        className={`text-xs p-1.5 rounded cursor-pointer transition-all ${
                          task.completed
                            ? 'bg-green-100 text-green-800 line-through'
                            : 'text-white hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: task.completed ? undefined : task.subjectColor
                        }}
                        onClick={() => !isPast && onToggleComplete(task.subjectId, task.topicId)}
                        title={`${task.subjectName}: ${task.topicName}`}
                      >
                        <div className="truncate">
                          {task.topicName}
                        </div>
                        <div className="text-xs opacity-75 truncate">
                          {task.subjectName}
                        </div>
                      </div>
                    ))}
                    
                    {dayTasks.length > (hasExam ? 2 : 3) && (
                      <div className="text-xs text-gray-500 px-1.5">
                        +{dayTasks.length - (hasExam ? 2 : 3)} more
                      </div>
                    )}
                    
                    {dayTasks.length > 0 && (
                      <div className="text-xs text-gray-500 px-1.5 pt-1">
                        {completedTasks.length}/{dayTasks.length} done
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map(subject => (
            <div key={subject.id} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: subject.color }}
              />
              <div className="flex-1">
                <span className="text-sm text-gray-700">{subject.name}</span>
                <div className="text-xs text-gray-500">
                  {formatExamStatus(subject.examDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded mr-2" />
              Today
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-50 border border-red-300 rounded mr-2" />
              Exam dates
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 rounded mr-2" />
              Completed tasks
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-50 rounded mr-2" />
              Past dates
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month's Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map(subject => {
            const monthTasks = Object.entries(calendarData)
              .filter(([date]) => {
                const taskDate = new Date(date);
                return taskDate.getMonth() === currentDate.getMonth() && 
                       taskDate.getFullYear() === currentDate.getFullYear();
              })
              .flatMap(([_, tasks]) => tasks.filter(task => task.subjectId === subject.id));
            
            const completedThisMonth = monthTasks.filter(task => task.completed).length;
            const totalThisMonth = monthTasks.length;
            const progress = totalThisMonth > 0 ? (completedThisMonth / totalThisMonth) * 100 : 0;

            return (
              <div key={subject.id} className="text-center">
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: subject.color }}
                />
                <h4 className="font-medium text-gray-900 mb-2">{subject.name}</h4>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {Math.round(progress)}%
                </div>
                <div className="text-sm text-gray-600">
                  {completedThisMonth}/{totalThisMonth} tasks
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: subject.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;