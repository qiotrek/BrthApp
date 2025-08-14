import { useState, useEffect } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  time: string; // HH:MM format
  descTime:string; // HH:MM format
  completed: boolean;
  visible: boolean;
  visibleDesc: boolean;
  canBeFinished: boolean;
}

const brthDay = '2025-08-13';
const initialTasks: Task[] = [
  {
    id: 1,
    title: '🔡 Wprowadzenie',
    description: 'Dzień dobry śpiąca księżniczko i Wszystkiego najlepszego. Na potrzebę dzisiejszej zabawy wcielisz się w rolę jednej z dworskich dam. Każda księżniczka musi znać zasady panujące w jej królestwie. Dokładnie zapoznaj się z treścią regulaminu i zaakceptuj go.',
    time: '09:00',
    descTime: '09:00',
    completed: false,
    visible: true,
    visibleDesc: false,
    canBeFinished: false
  },
  {
    id: 2,
    title: '🥗 Zaspokój swój głód I',
    description: 'Nawet najlepszym księżniczkom trudno świecić blaskiem z pustym żołądkiem. Czeka Cię coś pysznego w miłym towarzystwie. Przygotuj się do wyjścia z domu i pamiętaj, że możesz spędzić poza nim niemal cały dzień. Zabierz ze sobą kilka przedmiotów które pomogą Ci utzymać piękny wygląd w późniejszych godzinach.',
    time: '10:00',
    descTime: '09:10',
    completed: false,
    visible: true,
    visibleDesc: false,
    canBeFinished: false
  },
  {
    id: 3,
    title: '👑 Poczuj się jak księżniczka I',
    description: 'Piękna fryzura to podstawa, by wzbudzać zachwyt. Wybierz dowolną stylizację włosów, a twój nadworny stylista postara się spełnić twoje oczekiwania. O 11:30 zgłoś się do DM Studio przy ul. Andriolliego 40 i zapytaj o Małgosię.',
    time: '11:30',
    descTime: '10:45',
    completed: false,
    visible: true,
    visibleDesc: false,
    canBeFinished: false
  },
  {
    id: 4,
    title: '☕ Przerwa na lunch',
    description: 'Każda księżniczka zasługuje na chwilę wytchnienia po ciężkiej pracy. O wyznaczonej godzinie zaczekaj pod salonem stylisty. Podjedzie pod Ciebie karoca, wiec złap oddech i posil się przed kolejnymi wyzwaniami.',
    time: '13:00',
    descTime: '12:30',
    completed: false,
    visible: true,
    visibleDesc: false,
    canBeFinished: false
  },
  {
    id: 5,
    title: '👑 Poczuj się jak księżniczka II',
    description: 'Nadworny doradca czeka, by pomóc wybrać suknię godną królewskiej postaci - efektowną, a zarazem wygodną. Możesz zabrać ją ze sobą lub od razu ją na siebie nałożyć.',
    time: '14:30',
    descTime: '14:30',
    completed: false,
    visible: true,
    visibleDesc: false,
    canBeFinished: false
  },
  {
    id: 6,
    title: '👑 Poczuj się jak księżniczka III',
    description: 'Oszałamiająca fryzura i wyjątkowa suknia zasługują na uwiecznienie. Przygotuj się na sesję, która podkreśli twoje wewnętrzne piękno. Miejsce spotkania z nadwornym malarzem: Studio Chmury, Hoża 51 Warszawa. Wydobadź z siebie piękno!',
    time: '17:00',
    descTime: '16:15',
    completed: false,
    visible: true,
    visibleDesc: false,
    canBeFinished: false
  },
  {
    id: 7,
    title: '🥗 Zaspokój swój głód II',
    description: 'Kończy się inicjacja księżniczki - czas na królewską ucztę. Jak wiadomo każda księżniczka potrzebuje swojego księcia z bajki. Przygotuj się na jego przybycie.',
    time: '18:30',
    descTime: '18:00',
    completed: false,
    visible: true,
    visibleDesc: false,
    canBeFinished: false
  },
  {
    id: 8,
    title: '❤️ Nagroda',
    description: 'Gratulacje! Przeszłaś samą siebie. Teraz czas zabłysnąć przed poddanymi i wyprawić przyjęcie ku własnej czci.',
    time: '20:30',
    descTime: '20:20',
    completed: false,
    visible: false,
    visibleDesc: false,
    canBeFinished: false
  },
];


const getTimeUntilBirthday = () => {
  const target = new Date(brthDay + 'T07:00:00');
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return '00:00:00';

  const hours = Math.floor(diff / 1000 / 60 / 60).toString().padStart(2, '0');
  const minutes = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
  const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const getCurrentTime = (): string => new Date().toTimeString().slice(0, 5);

const isTaskVisible = (task: Task, currentTime: string): boolean => {
  if (!task.visible) {
    return isVisible(task.time, currentTime);
  } else {
    return true;
  }
};

const isVisible = (taskTime: string, currentTime: string): boolean => {
  const [h1, m1] = taskTime.split(':').map(Number);
  const [h2, m2] = currentTime.split(':').map(Number);
  return h2 * 60 + m2 >= h1 * 60 + m1;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTime());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [regulationsAccepted, setRegulationsAccepted] = useState(false);
  const [countdown, setCountdown] = useState(getTimeUntilBirthday());

  // Check first visit
  useEffect(() => {
    const visited = localStorage.getItem('hasVisited');
    if (visited!== 'true' && isBirthdayToday()) {
      setShowModal(true);
    }
    const saved = localStorage.getItem('completedTasks');
    const completedIds: number[] = saved ? JSON.parse(saved) : [];
    setTasks(initialTasks.map(t => ({ ...t, completed: completedIds.includes(t.id) })));
  }, []);


  useEffect(() => {
    const updateCoundown = () => {
      setCountdown(getTimeUntilBirthday());
    };
    const timer = setInterval(updateCoundown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update time and visibility
  useEffect(() => {
    const update = () => {
      const now = getCurrentTime();
      setCurrentTime(now);
      setTasks(prev => prev.map(t => ({ ...t,  visible: isTaskVisible(t, now),  visibleDesc: isVisible(t.descTime, now) })));
      setTasks(prev => prev.map(t => ({ ...t,  canBeFinished: canBeFinished(t) })));
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  const canBeFinished = (task: Task): boolean => {
    let completedTasks=localStorage.getItem('completedTasks');
    const completedIds: number[] = completedTasks ? JSON.parse(completedTasks) : [];
    if(completedIds.includes(task.id)) {
      return true;
    }
    else if((completedIds.includes(task.id-1) || task.id==1) && task.visibleDesc) {
      return true;
    }
    else{
      return false;
    }
  };

const toggle = (id: number) => {
  setTasks(prev => {
    const updated = prev.map(t => {
      const isTarget = t.id === id && t.canBeFinished;
      const completed = isTarget ? !t.completed : t.completed;
      return { ...t, completed };
    }).map(t => ({
      ...t,
      canBeFinished: canBeFinished(t)
    }));

    localStorage.setItem(
      'completedTasks',
      JSON.stringify(updated.filter(t => t.completed).map(t => t.id))
    );

    return updated;
  });
};

  const handleStart = () => {
    if (!regulationsAccepted) return;
    localStorage.setItem('hasVisited', 'true');
    setShowModal(false);
  };

  const uncompletedTasks = tasks.filter(t => t.visible && !t.completed);
  const completedTasks = tasks.filter(t => t.visible && t.completed);
  const completedCount = completedTasks.length;
  const totalVisible = uncompletedTasks.length + completedTasks.length;
  const percent = totalVisible ? (completedCount / totalVisible) * 100 : 0;

const isBirthdayToday = (): boolean => {
  const now = new Date();
  const [year, month, day] = brthDay.split('-').map(Number);

  const birthdayDate = new Date(year, month - 1, day, 7, 0, 0); 

  return now >= birthdayDate;
};

  return (

    <div className="relative min-h-screen bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 p-6">
    {!isBirthdayToday() && (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 to-pink-700 text-white flex flex-col items-center justify-center text-center p-10 z-50">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">🎉 Gra jeszcze się nie rozpoczęła</h1>
        <div className="bg-white text-purple-800 px-6 py-3 rounded-full text-3xl font-mono shadow-lg">
          {countdown}
        </div>
      </div>
    )}
      {/* Welcome Modal */}
    {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto z-50 pt-10">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto text-left shadow-xl">
        <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">
          Regulamin Uczestnictwa
        </h2>
        <div className="text-black text-sm mb-4 space-y-3">
                <p className="font-semibold">&sect;1. Postanowienia Ogólne</p>
                <ul className="list-decimal list-inside ml-4 space-y-1">
                  <li>Uczestnik zobowiązuje się do dobrej zabawy bez względu na okoliczności.</li>
                  <li>Wszelkie zmartwienia zostają zawieszone na czas trwania zabawy.</li>
                </ul>
                <p className="font-semibold">&sect;2. Zasady Wykonywania Zadań</p>
                <ul className="list-decimal list-inside ml-4 space-y-1">
                  <li>Lista zadań widoczna jest na głownym ekranie.</li>
                  <li>Szczegółowe opisy zadań będą pojawiały się kolejno wraz z upływem czasu zabawy.</li>
                  <li>Uczestnik zobowiązuje się do dokładnego zapoznania się z treścią każdego nowego zadania.</li>
                  <li>Uczestnik zobowiązuje się do wykonania wszystkich zaplanowanych zadań bez wyjątku nie łamiąc przy tym zasad zawartych w &sect;1.</li>
                </ul>
                <p className="font-semibold">&sect;3. Etapy Zabawy</p>
                <ul className="list-decimal list-inside ml-4 space-y-1">
                  <li>Zabawa rozpoczyna się o godzinie 9:00.</li>
                  <li>Uczestnik poprzez aplikację realizuje wyznaczone mu zadania.</li>
                  <li>Zabawa kończy się o godzinie 20:00.</li>
                  <li>Po prawidłowym wykonaniu wszystkich zadań uczestnik zostanie nagrodzony.</li>
                </ul>
                <p className="font-semibold">&sect;4. Wymagania</p>
                <ul className="list-decimal list-inside ml-4 space-y-1">
                  <li>Uczestnik zobowiązuje się do posiadania przy sobie telefonu komórkowego na czas trwania zabawy na którym będzie odchaczał wykonane zadania oraz otrzymywał powiadomienia o nowych zadaniach.</li>
                  <li>Uczestnik zobowiązuje się do posiadania przy sobie wizytówki dostarczonej w kopercie. Może być przydatna do ponownego powrotu na stronę.</li>
                  <li>Uczestnik napotkając jakiekolwiek trudności podczas trwania całej zabawy zobowiązuje się do niezwłocznego powiadomienia organizatora o zaistniałym problemie za pomocą wiadomosci SMS pod numer wskazany na wizytówce.</li>
                </ul>
                <p className="font-semibold">&sect;5. Oświadczenie</p>
                <ul className="list-decimal list-inside ml-4 space-y-1">
                  <li>Uczestnik potwierdza, że roumie humorystyczny zamysł niniejszego regulaminu.</li>
                  <li>Uczestnik potwierdza, że rozumie iż niniejszy regulamin jest wyświetlany jednorazowo</li>
                  <li>Uczestnik potwierdza wykoanie screenów niniejszego regulaminu, w celu uzyskania możliwości powrotu do jego treści w galerii telefonu.</li>
                </ul>
              </div>
              <label className="flex items-center gap-3 text-sm text-black mb-6">
                <input
                  type="checkbox"
                  checked={regulationsAccepted}
                  onChange={e => setRegulationsAccepted(e.target.checked)}
                  className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded-md focus:ring-green-500 focus:outline-none"
                />
                Zapoznałem(-am) się z regulaminem i akceptuję jego warunki
              </label>
              <button
                onClick={handleStart}
                disabled={!regulationsAccepted}
                className={`inline-flex items-center gap-2 border-2 rounded-full px-6 py-2 transition w-full justify-center ${
                  regulationsAccepted
                    ? 'border-green-500 hover:bg-green-50 text-green-600 font-semibold'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle className={`w-5 h-5 ${regulationsAccepted ? 'text-green-500' : 'text-gray-400'}`} />
                Zaczynamy
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
              <span>Oczekujące: <strong className="text-pink-600">{uncompletedTasks.length}</strong></span>
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
            {uncompletedTasks.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-purple-800 mb-4">Oczekujące zadania</h2>
                <div className="space-y-6">
                  {uncompletedTasks.map((task, idx) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-2xl shadow-lg p-6 flex gap-4 items-start transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fadeIn"
                      style={{ animationDelay: `${idx * 150}ms` }}
                    >
                      <button onClick={() => toggle(task.id)} className="mt-1">
                        {task.canBeFinished ? (
                          <Circle className="w-6 h-6 text-pink-500 hover:text-pink-700" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-500 " />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline mb-2">
                          <h3 className="text-xl font-semibold text-purple-900">{task.title}</h3>
                          <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-3 py-0.5 rounded-full">{task.time}</span>
                        </div>
                        {task.visibleDesc && (
                          <p className="text-purple-700">{task.description}</p>
                        )}
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
