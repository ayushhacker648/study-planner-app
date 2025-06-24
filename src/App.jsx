import React, { useState, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from './utils/storage';
import { generateStudyPlan, getTodaysPlan } from './utils/scheduler';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SubjectManager from './components/SubjectManager';
import DailyPlanner from './components/DailyPlanner';
import CalendarView from './components/CalendarView';
import PomodoroTimer from './components/PomodoroTimer'; // ✅


function App() {
  const [subjects, setSubjects] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [todayTasks, setTodayTasks] = useState([]);

  // ✅ Request notification permission when app loads
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Load data from storage on component mount
  useEffect(() => {
    const savedSubjects = loadFromStorage();
    if (savedSubjects.length > 0) {
      const updatedSubjects = generateStudyPlan(savedSubjects);
      setSubjects(updatedSubjects);
      setTodayTasks(getTodaysPlan(updatedSubjects));
    }
  }, []);

  // Update subjects and regenerate study plan
  const handleUpdateSubjects = (newSubjects) => {
    const updatedSubjects = generateStudyPlan(newSubjects);
    setSubjects(updatedSubjects);
    setTodayTasks(getTodaysPlan(updatedSubjects));
    saveToStorage(updatedSubjects);
  };

  // Toggle topic completion
  const handleToggleComplete = (subjectId, topicId) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId
        ? {
            ...subject,
            topics: subject.topics.map(topic =>
              topic.id === topicId
                ? { 
                    ...topic, 
                    completed: !topic.completed,
                    completedAt: !topic.completed ? new Date().toISOString() : undefined
                  }
                : topic
            )
          }
        : subject
    );
    
    // Regenerate study plan after toggling completion
    const updatedWithPlan = generateStudyPlan(updatedSubjects);
    setSubjects(updatedWithPlan);
    setTodayTasks(getTodaysPlan(updatedWithPlan));
    saveToStorage(updatedWithPlan);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard subjects={subjects} todayTasks={todayTasks} />;
      case 'subjects':
        return <SubjectManager subjects={subjects} onUpdateSubjects={handleUpdateSubjects} />;
      case 'daily':
        return <DailyPlanner subjects={subjects} onToggleComplete={handleToggleComplete} />;
      case 'calendar':
        return <CalendarView subjects={subjects} onToggleComplete={handleToggleComplete} />;
        case 'pomodoro':
      return <PomodoroTimer />; 
      default:
        return <Dashboard subjects={subjects} todayTasks={todayTasks} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;
