import { useState, useEffect } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  time: string; // HH:MM format
  completed: boolean;
  visible: boolean;
}


const initialTasks: Task[] = [
  { id: 1, title: 'Poranna kawa', description: 'Czas na pierwszą kawę dnia i sprawdzenie wiadomości', time: '00:00', completed: false, visible: false },
  { id: 2, title: 'Przegląd emaili', description: 'Sprawdzenie i odpowiedź na ważne emaile', time: '01:00', completed: false, visible: false },
  { id: 3, title: 'Spotkanie zespołu', description: 'Cotygodniowe spotkanie z zespołem projektowym', time: '01:30', completed: false, visible: false },
  { id: 4, title: 'Przerwa na lunch', description: 'Czas na zdrowy posiłek i krótki spacer', time: '02:00', completed: false, visible: false },
  { id: 5, title: 'Praca nad projektem', description: 'Kontynuacja pracy nad głównym projektem', time: '02:10', completed: false, visible: false },
  { id: 6, title: 'Przegląd dnia', description: 'Podsumowanie wykonanych zadań i planowanie na jutro', time: '17:00', completed: false, visible: false },
  { id: 7, title: 'Czas na relaks', description: 'Moment na odpoczynek i hobby', time: '19:00', completed: false, visible: false },
];

const getCurrentTime = (): string => new Date().toTimeString().slice(0, 5);

const isVisible = (taskTime: string, currentTime: string): boolean => {
  const [h1, m1] = taskTime.split(':').map(Number);
  const [h2, m2] = currentTime.split(':').map(Number);
  return h2 * 60 + m2 >= h1 * 60 + m1;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime());
  const [showModal, setShowModal] = useState<boolean>(false);

  // Check first visit
  useEffect(() => {
    const visited = localStorage.getItem('hasVisited');
    if (!visited) {
      setShowModal(true);
    }
    const saved = localStorage.getItem('completedTasks');
    const completedIds: number[] = saved ? JSON.parse(saved) : [];
    setTasks(initialTasks.map(t => ({ ...t, completed: completedIds.includes(t.id), visible: false })));
  }, []);

  // Update time and visibility
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

  const toggle = (id: number) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      localStorage.setItem('completedTasks', JSON.stringify(updated.filter(t => t.completed).map(t => t.id)));
      return updated;
    });
  };

  const handleStart = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowModal(false);
  };

  const visibleTasks = tasks.filter(t => t.visible && !t.completed);
  const completedTasks = tasks.filter(t => t.visible && t.completed);
  const completedCount = completedTasks.length;
  const totalVisible = visibleTasks.length + completedTasks.length;
  const percent = totalVisible ? (completedCount / totalVisible) * 100 : 0;

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 p-6">
      {/* Welcome Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm text-center shadow-lg">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Witamy!</h2>
            <p className="text-purple-700 mb-6">WIADOMOSC WSTEPNE. Zaczynamy?</p>
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 border-2 border-green-500 rounded-full px-6 py-2 hover:bg-green-50 transition"
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-600 font-semibold">Zaczynamy</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl py-6 px-8 flex justify-between items-center border border-purple-300">
            <h1 className="text-2xl font-extrabold text-purple-800 flex items-center gap-4">
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
            <span>Oczekujące: <strong className="text-pink-600">{visibleTasks.length}</strong></span>
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

        <main className="space-y-8">
          {/* Pending Tasks */}
          {visibleTasks.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">Oczekujące zadania</h2>
              <div className="space-y-6">
                {visibleTasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl shadow-lg p-6 flex gap-4 items-start transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fadeIn"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <button onClick={() => toggle(task.id)} className="mt-1">
                      <Circle className="w-6 h-6 text-pink-500 hover:text-pink-700" />
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-xl font-semibold text-purple-900">{task.title}</h3>
                        <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-3 py-0.5 rounded-full">{task.time}</span>
                      </div>
                      <p className="text-purple-700">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">Zrealizowane zadania</h2>
              <div className="space-y-6">
                {completedTasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className="bg-white/80 rounded-2xl shadow-inner p-6 flex gap-4 items-start opacity-75 grayscale animate-fadeIn"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <button onClick={() => toggle(task.id)} className="mt-1">
                      <CheckCircle className="w-6 h-6 text-green-500 hover:text-green-700" />
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-xl font-semibold text-gray-500 line-through">{task.title}</h3>
                        <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-0.5 rounded-full">{task.time}</span>
                      </div>
                      <p className="text-gray-500 line-through">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
