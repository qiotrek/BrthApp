import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle, Circle, Calendar } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  time: string; // HH:MM format
  completed: boolean;
  visible: boolean;
}

const initialTasks: Task[] = [
  { id: 1, title: 'Poranna kawa', description: 'Czas na pierwszą kawę dnia i sprawdzenie wiadomości', time: '01:00', completed: false, visible: false },
  { id: 2, title: 'Przegląd emaili', description: 'Sprawdzenie i odpowiedź na ważne emaile', time: '01:30', completed: false, visible: false },
  { id: 3, title: 'Spotkanie zespołu', description: 'Cotygodniowe spotkanie z zespołem projektowym', time: '2:10', completed: false, visible: false },
  { id: 4, title: 'Przerwa na lunch', description: 'Czas na zdrowy posiłek i krótki spacer', time: '12:30', completed: false, visible: false },
  { id: 5, title: 'Praca nad projektem', description: 'Kontynuacja pracy nad głównym projektem', time: '14:00', completed: false, visible: false },
  { id: 6, title: 'Przegląd dnia', description: 'Podsumowanie wykonanych zadań i planowanie na jutro', time: '17:00', completed: false, visible: false },
  { id: 7, title: 'Czas na relaks', description: 'Moment na odpoczynek i hobby', time: '19:00', completed: false, visible: false },
];

const getCurrentTime = (): string => {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
};

const isVisible = (taskTime: string, currentTime: string): boolean => {
  const [h1, m1] = taskTime.split(':').map(Number);
  const [h2, m2] = currentTime.split(':').map(Number);
  return h2 * 60 + m2 >= h1 * 60 + m1;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime());

  // Load tasks and completed from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('completedTasks');
    const completedIds: number[] = saved ? JSON.parse(saved) : [];
    const loaded = initialTasks.map(t => ({
      ...t,
      completed: completedIds.includes(t.id),
      visible: false,
    }));
    setTasks(loaded);
  }, []);

  // Update visibility each minute
  useEffect(() => {
    const update = () => {
      const now = getCurrentTime();
      setCurrentTime(now);
      setTasks(prev => prev.map(t => ({ ...t, visible: isVisible(t.time, now) })));
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  // Toggle and save directly
  const toggle = (id: number) => {
    setTasks(prev => {
      const updated = prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      const completedIds = updated.filter(t => t.completed).map(t => t.id);
      localStorage.setItem('completedTasks', JSON.stringify(completedIds));
      return updated;
    });
  };

  const visibleTasks = tasks.filter(t => t.visible);
  const completedCount = visibleTasks.filter(t => t.completed).length;
  const percent = visibleTasks.length ? (completedCount / visibleTasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-indigo-600" />
              Moja Lista Zadań
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{currentTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Dostępne zadania: <span className="font-semibold text-indigo-600">{visibleTasks.length}</span>
            </div>
            <div className="text-sm text-gray-600">
              Ukończone: <span className="font-semibold text-green-600">{completedCount}</span>
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-purple-600"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-4">
          {visibleTasks.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Brak dostępnych zadań</h3>
              <p className="text-gray-500">Zadania pojawią się automatycznie o odpowiedniej godzinie</p>
            </div>
          ) : (
            visibleTasks.map((task, idx) => (
              <div
                key={task.id}
                className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${task.completed ? 'opacity-75' : ''} animate-slideInUp`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <button onClick={() => toggle(task.id)} className="mt-1 flex-shrink-0 transition-colors duration-200">
                    {task.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-500" />
                    )}
                  </button>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {task.time}
                      </span>
                    </div>
                    <p className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-600'}`}>{task.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Zadania pojawiają się automatycznie o odpowiedniej godzinie
        </div>
      </div>
    </div>
  );
}
