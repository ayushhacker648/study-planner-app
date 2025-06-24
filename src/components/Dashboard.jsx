import { Calendar, BookOpen, Target, TrendingUp, Clock } from 'lucide-react';
import { formatExamStatus } from '../utils/scheduler';


const Dashboard = ({ subjects, todayTasks }) => {
  const calculateStats = () => {
    const totalTopics = subjects.reduce((acc, subject) => acc + subject.topics.length, 0);
    const completedTopics = subjects.reduce((acc, subject) => 
      acc + subject.topics.filter(topic => topic.completed).length, 0);
    const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    const today = new Date();
    const upcomingExams = subjects.filter(subject => 
      new Date(subject.examDate) >= today).length;

    return {
      totalTopics,
      completedTopics,
      completionPercentage,
      upcomingExams,
      todayTasks: todayTasks.length
    };
  };

  const stats = calculateStats();

  const getUpcomingExams = () => {
    const today = new Date();
    return subjects
      .filter(subject => new Date(subject.examDate) >= today)
      .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
      .slice(0, 3);
  };

  const upcomingExams = getUpcomingExams();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Dashboard</h1>
        <p className="text-gray-600">Track your progress and stay on top of your studies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completionPercentage}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Topics Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTopics}/{stats.totalTopics}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayTasks}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingExams}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Today's Study Plan
        </h2>
        {todayTasks.length > 0 ? (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div key={`${task.subjectId}-${task.topicId}`} 
                   className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: task.subjectColor }}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.topicName}</p>
                  <p className="text-sm text-gray-600">{task.subjectName}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No tasks scheduled for today! Great job staying ahead!</p>
        )}
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-purple-600" />
          Upcoming Exams
        </h2>
        {upcomingExams.length > 0 ? (
          <div className="space-y-3">
            {upcomingExams.map((subject) => {
              const completedTopics = subject.topics.filter(topic => topic.completed).length;
              const totalTopics = subject.topics.length;
              const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

              return (
                <div key={subject.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: subject.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{subject.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(subject.examDate).toLocaleDateString()} • {formatExamStatus(subject.examDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{Math.round(progress)}% ready</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No upcoming exams scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;