import { useState } from 'react';
import { Plus, BookOpen, Calendar, Trash2, Edit3, Check, X } from 'lucide-react';
import { generateId } from '../utils/storage';
import { formatExamStatus } from '../utils/scheduler';

const SubjectManager = ({ subjects, onUpdateSubjects }) => {
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    examDate: '',
    color: '#3B82F6'
  });
  const [newTopic, setNewTopic] = useState('');
  const [editSubjectData, setEditSubjectData] = useState({
    name: '',
    examDate: '',
    color: ''
  });

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
  ];

  const handleAddSubject = () => {
    if (newSubject.name.trim() && newSubject.examDate) {
      const subject = {
        id: generateId(),
        name: newSubject.name.trim(),
        color: newSubject.color,
        examDate: newSubject.examDate,
        topics: [],
        createdAt: new Date().toISOString()
      };
      
      onUpdateSubjects([...subjects, subject]);
      setNewSubject({ name: '', examDate: '', color: '#3B82F6' });
      setShowAddSubject(false);
    }
  };

  const handleAddTopic = (subjectId) => {
    if (newTopic.trim()) {
      const topic = {
        id: generateId(),
        name: newTopic.trim(),
        completed: false
      };

      const updatedSubjects = subjects.map(subject => 
        subject.id === subjectId 
          ? { ...subject, topics: [...subject.topics, topic] }
          : subject
      );

      onUpdateSubjects(updatedSubjects);
      setNewTopic('');
      setShowAddTopic(null);
    }
  };

  const handleDeleteSubject = (subjectId) => {
    onUpdateSubjects(subjects.filter(subject => subject.id !== subjectId));
  };

  const handleDeleteTopic = (subjectId, topicId) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId
        ? { ...subject, topics: subject.topics.filter(topic => topic.id !== topicId) }
        : subject
    );
    onUpdateSubjects(updatedSubjects);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject.id);
    setEditSubjectData({
      name: subject.name,
      examDate: subject.examDate,
      color: subject.color
    });
  };

  const handleSaveEdit = (subjectId) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === subjectId
        ? { ...subject, ...editSubjectData }
        : subject
    );
    onUpdateSubjects(updatedSubjects);
    setEditingSubject(null);
  };

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
    onUpdateSubjects(updatedSubjects);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Subjects</h1>
        <p className="text-gray-600">Add your subjects, topics, and set exam dates</p>
      </div>

      {/* Add Subject Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAddSubject(true)}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Subject
        </button>
      </div>

      {/* Add Subject Form */}
      {showAddSubject && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Subject</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
              <input
                type="text"
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                placeholder="e.g., Mathematics, Physics..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Date</label>
              <input
                type="date"
                value={newSubject.examDate}
                onChange={(e) => setNewSubject({...newSubject, examDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex space-x-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewSubject({...newSubject, color})}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newSubject.color === color ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddSubject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Subject
              </button>
              <button
                onClick={() => setShowAddSubject(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subjects List */}
      <div className="grid gap-6">
        {subjects.map(subject => {
          const completedTopics = subject.topics.filter(topic => topic.completed).length;
          const totalTopics = subject.topics.length;
          const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

          return (
            <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {editingSubject === subject.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editSubjectData.name}
                    onChange={(e) => setEditSubjectData({...editSubjectData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-lg"
                  />
                  <input
                    type="date"
                    value={editSubjectData.examDate}
                    onChange={(e) => setEditSubjectData({...editSubjectData, examDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex space-x-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setEditSubjectData({...editSubjectData, color})}
                        className={`w-8 h-8 rounded-full border-2 ${
                          editSubjectData.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveEdit(subject.id)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingSubject(null)}
                      className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: subject.color }}
                      />
                      <h3 className="text-xl font-semibold text-gray-900">{subject.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditSubject(subject)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      Exam: {new Date(subject.examDate).toLocaleDateString()} 
                      ({formatExamStatus(subject.examDate)})
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress: {completedTopics}/{totalTopics} topics completed</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: subject.color
                        }}
                      />
                    </div>
                  </div>

                  {/* Topics */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Topics ({subject.topics.length})
                      </h4>
                      <button
                        onClick={() => setShowAddTopic(subject.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        + Add Topic
                      </button>
                    </div>

                    {showAddTopic === subject.id && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          placeholder="Enter topic name..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddTopic(subject.id)}
                        />
                        <button
                          onClick={() => handleAddTopic(subject.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowAddTopic(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {subject.topics.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {subject.topics.map(topic => (
                          <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={topic.completed}
                                onChange={() => handleToggleComplete(subject.id, topic.id)}
                                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className={`${topic.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {topic.name}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteTopic(subject.id, topic.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No topics added yet</p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects yet</h3>
          <p className="text-gray-500">Add your first subject to get started with your study plan</p>
        </div>
      )}
    </div>
  );
};

export default SubjectManager;