export const generateStudyPlan = (subjects) => {
  const updatedSubjects = subjects.map(subject => {
    const incompleteTopics = subject.topics.filter(topic => !topic.completed);
    if (incompleteTopics.length === 0) return subject;

    const examDate = new Date(subject.examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    examDate.setHours(0, 0, 0, 0);

    const availableDays = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (availableDays <= 0) return subject;

    const topicsPerDay = Math.ceil(incompleteTopics.length / availableDays);
    
    const updatedTopics = subject.topics.map(topic => {
      if (topic.completed) return topic;
      
      const topicIndex = incompleteTopics.findIndex(t => t.id === topic.id);
      const dayOffset = Math.floor(topicIndex / topicsPerDay);
      const scheduledDate = new Date(today);
      scheduledDate.setDate(today.getDate() + dayOffset);
      
      return {
        ...topic,
        scheduledDate: scheduledDate.toISOString().split('T')[0]
      };
    });

    return {
      ...subject,
      topics: updatedTopics
    };
  });

  return updatedSubjects;
};

export const getTodaysPlan = (subjects) => {
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = [];

  subjects.forEach(subject => {
    subject.topics.forEach(topic => {
      if (topic.scheduledDate === today && !topic.completed) {
        todayTasks.push({
          subjectId: subject.id,
          subjectName: subject.name,
          subjectColor: subject.color,
          topicId: topic.id,
          topicName: topic.name,
          completed: topic.completed
        });
      }
    });
  });

  return todayTasks;
};

export const getCalendarData = (subjects) => {
  const calendarData = {};

  subjects.forEach(subject => {
    subject.topics.forEach(topic => {
      if (topic.scheduledDate) {
        if (!calendarData[topic.scheduledDate]) {
          calendarData[topic.scheduledDate] = [];
        }
        calendarData[topic.scheduledDate].push({
          subjectId: subject.id,
          subjectName: subject.name,
          subjectColor: subject.color,
          topicId: topic.id,
          topicName: topic.name,
          completed: topic.completed
        });
      }
    });
  });

  return calendarData;
};

export const getDaysUntilExam = (examDate) => {
  const today = new Date();
  const exam = new Date(examDate);
  today.setHours(0, 0, 0, 0);
  exam.setHours(0, 0, 0, 0);
  
  const diffTime = exam.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const formatExamStatus = (examDate) => {
  const daysUntil = getDaysUntilExam(examDate);
  
  if (daysUntil < 0) {
    return `Exam was ${Math.abs(daysUntil)} days ago`;
  } else if (daysUntil === 0) {
    return 'Exam is today!';
  } else if (daysUntil === 1) {
    return 'Exam is tomorrow';
  } else {
    return `${daysUntil} days until exam`;
  }
};