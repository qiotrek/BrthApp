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
  { id: 3, title: 'Spotkanie zespołu', description: 'Cotygodniowe spotkanie z zespołem projektowym', time: '02:10', completed: false, visible: false },
  { id: 4, title: 'Przerwa na lunch', description: 'Czas na zdrowy posiłek i krótki spacer', time: '02:20', completed: false, visible: false },
  { id: 5, title: 'Praca nad projektem', description: 'Kontynuacja pracy nad głównym projektem', time: '02:24', completed: false, visible: false },
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
    <div className="min-h-screen bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl py-6 px-8 flex justify-between items-center border border-purple-300">
            <h1 className="text-3xl font-extrabold text-purple-800 flex items-center gap-4">
              Lista Zadań
            </h1>
            <div className="flex items-center gap-3">
              <span role="img" aria-label="alarm" className="text-3xl">⏰</span>
              <div className="bg-white shadow-md rounded-full px-4 py-2 font-mono text-2xl text-purple-800">
                {currentTime}
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-6 text-purple-700">
            <span>Dostępne: <strong className="text-pink-600">{visibleTasks.length}</strong></span>
            <span>Ukończone: <strong className="text-indigo-600">{completedCount}</strong></span>
            <div className="flex-1">
              <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-700 bg-gradient-to-r from-pink-500 to-indigo-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          {visibleTasks.length === 0 ? (
            <div className="bg-white/90 rounded-3xl shadow-lg p-12 text-center border border-purple-100">
              <Clock className="w-24 h-24 text-purple-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-purple-700 mb-3">Brak zadań</h2>
              <p className="text-purple-500">Zadania pojawią się o odpowiedniej godzinie</p>
            </div>
          ) : (
            visibleTasks.map((task, idx) => (
              <div
                key={task.id}
                className={`relative bg-white rounded-2xl shadow-lg p-6 flex gap-4 items-start transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl ${task.completed ? 'opacity-70 grayscale' : ''}`}
                style={{ animation: `fadeIn 0.5s ease-out`, animationDelay: `${idx * 150}ms` }}
              >
                <button onClick={() => toggle(task.id)} className="mt-1">
                  {task.completed ? <CheckCircle className="w-6 h-6 text-indigo-600" /> : <Circle className="w-6 h-6 text-pink-500 hover:text-pink-700" />}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className={`text-xl font-semibold ${task.completed ? 'line-through text-purple-400' : 'text-purple-900'}`}>{task.title}</h3>
                    <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-3 py-0.5 rounded-full">{task.time}</span>
                  </div>
                  <p className={`${task.completed ? 'line-through text-purple-400' : 'text-purple-700'}`}>{task.description}</p>
                </div>
              </div>
            ))
          )}
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
