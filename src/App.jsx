import React, { useState, useEffect, useRef } from 'react';

// --- Injetor de Estilo para Fontes e Animações ---
const StyleInjector = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    *:not(input):not(textarea):not([contenteditable="true"]) {
      user-select: none; -webkit-user-select: none;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .fade-in-animation { animation: fadeIn 0.5s ease-out; }

    .editable-note:empty:before {
      content: attr(data-placeholder);
      color: #6b7280; 
      pointer-events: none;
    }
  `}</style>
);

// --- Componentes de Ícones ---
const IconTrash = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> );
const LogoIcon = ({ className }) => ( <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1"> <stop offset="0%" stopColor="#3b82f6" /> <stop offset="100%" stopColor="#60a5fa" /> </linearGradient> </defs> <path d="M17 5L9.5 12.5L7 10" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> <path d="M17 11.5L9.5 19L7 16.5" stroke="url(#logoGradient)" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /> </svg> );

// --- Componentes UI ---
const ProgressBar = ({ value, color = "bg-blue-600" }) => ( <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2"> <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div> </div> );

// --- Painel de Tarefas ---
function TasksPanel({ tasks, setTasks }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const addTask = () => {
    if (!title.trim()) return;
    const newTask = { id: Date.now(), title, done: false, date, time };
    setTasks(prev => [newTask, ...prev]);
    setTitle("");
    setDate("");
    setTime("");
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.done));
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  
  const formatDate = (dateString) => {
      if (!dateString) return '';
      const dateObj = new Date(dateString + 'T00:00:00'); // Adiciona T00:00 para evitar problemas de fuso
      return new Intl.DateTimeFormat('pt-BR').format(dateObj);
  }

  return (
    <div className="space-y-4 fade-in-animation">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-3">
        <input value={title} onChange={e => setTitle(e.target.value)} onKeyPress={e => e.key === 'Enter' && addTask()} placeholder="Nova tarefa..." className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
        <div className="flex space-x-2">
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-1/2 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-1/2 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <button onClick={addTask} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">Adicionar Tarefa</button>
        <ProgressBar value={progress} />
      </div>
      {completedCount > 0 && <button onClick={clearCompleted} className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Limpar Concluídas</button>}
      <div className="space-y-3">
        {tasks.map(t => (
          <div key={t.id} className={`p-4 rounded-xl shadow-sm flex justify-between items-start transition-all ${t.done ? 'bg-teal-100 dark:bg-teal-900/50' : 'bg-white dark:bg-gray-800'}`}>
            <div className="flex-grow">
              <span onClick={() => toggleTask(t.id)} className={`cursor-pointer ${t.done ? 'line-through text-gray-500' : ''}`}>{t.title}</span>
              {(t.date || t.time) && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(t.date)} {t.time}
                </p>
              )}
            </div>
            <button onClick={() => removeTask(t.id)} className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0"><IconTrash className="w-5 h-5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Painel de Compras ---
function ShoppingPanel({ items, setItems }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Outros");
    const categories = ["Laticínios", "Frutas", "Verduras", "Carnes", "Padaria", "Bebidas", "Grãos", "Snacks", "Higiene", "Outros"];

    const addItem = () => {
        if (!name.trim()) return;
        const newItem = { id: Date.now(), name, category, bought: false };
        setItems(prev => [newItem, ...prev]);
        setName("");
    };
    
    const toggleItem = (id) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, bought: !i.bought } : i));
    };

    const clearBought = () => {
        setItems(prev => prev.filter(i => !i.bought));
    };

    const groupedItems = items.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {});
    
    const progress = items.length > 0 ? (items.filter(i => i.bought).length / items.length) * 100 : 0;

    return (
        <div className="space-y-4 fade-in-animation">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-3">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Novo item..." className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={addItem} className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold">Adicionar Item</button>
                <ProgressBar value={progress} color="bg-orange-500"/>
            </div>
            {items.some(i => i.bought) && <button onClick={clearBought} className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Limpar Comprados</button>}
            <div className="space-y-4">
                {Object.keys(groupedItems).sort().map(cat => (
                    <div key={cat}>
                        <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-300">{cat}</h3>
                        <div className="space-y-2">
                        {groupedItems[cat].map(item => (
                            <div key={item.id} onClick={() => toggleItem(item.id)} className={`p-4 rounded-xl shadow-sm cursor-pointer ${item.bought ? 'bg-orange-100 dark:bg-orange-900/50 line-through text-gray-500 dark:text-gray-400' : 'bg-white dark:bg-gray-800'}`}>
                                {item.name}
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
// --- Painel de Atividades ---
function ActivitiesPanel({ activities, setActivities }) {
    const [name, setName] = useState("");
    const [target, setTarget] = useState(1);

    const addActivity = () => {
        if (!name.trim() || target < 1) return;
        const newActivity = { id: Date.now(), name, today: 0, target: Number(target) };
        setActivities(prev => [newActivity, ...prev]);
        setName("");
        setTarget(1);
    };

    const incrementActivity = (id) => {
        setActivities(prev => prev.map(a => a.id === id ? { ...a, today: a.today + 1 } : a));
    };

    const removeActivity = (id) => {
        setActivities(prev => prev.filter(a => a.id !== id));
    };

    const clearCompleted = () => {
        setActivities(prev => prev.filter(a => a.today < a.target));
    };

    return (
        <div className="space-y-4 fade-in-animation">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-3">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Nova atividade..." className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} min="1" placeholder="Meta" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                <button onClick={addActivity} className="w-full px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-semibold">Adicionar Atividade</button>
            </div>
            {activities.some(a => a.today >= a.target) && <button onClick={clearCompleted} className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Limpar Concluídas</button>}
            <div className="space-y-3">
                {activities.map(act => {
                    const progress = act.target > 0 ? (act.today / act.target) * 100 : 0;
                    return (
                        <div key={act.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            <div className="flex justify-between items-center">
                                <span>{act.name} ({act.today}/{act.target})</span>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => incrementActivity(act.id)} className="px-3 py-1 bg-sky-500 text-white rounded-lg text-sm">+1</button>
                                    <button onClick={() => removeActivity(act.id)} className="text-red-500"><IconTrash className="w-5 h-5" /></button>
                                </div>
                            </div>
                            <ProgressBar value={progress} color="bg-sky-500" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// --- Painel de Notas ---
function NotesPanel({ notes, setNotes }) {
    const addNote = () => {
        const noteColors = ['bg-yellow-200 text-yellow-800', 'bg-blue-200 text-blue-800', 'bg-green-200 text-green-800', 'bg-pink-200 text-pink-800'];
        const newNote = { id: Date.now(), text: "", color: noteColors[notes.length % noteColors.length] };
        setNotes(prev => [...prev, newNote]);
    };

    const updateNoteText = (id, text) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
    };

    const deleteNote = (id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fade-in-animation">
            <button onClick={addNote} className="w-full mb-4 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold">Adicionar Nota</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {notes.map(note => (
                    <div key={note.id} className={`p-4 rounded-lg shadow-md ${note.color} relative`}>
                        <textarea
                            defaultValue={note.text}
                            onBlur={e => updateNoteText(note.id, e.target.value)}
                            placeholder="Escreva algo..."
                            className="w-full h-32 bg-transparent border-none resize-none outline-none"
                        />
                        <button onClick={() => deleteNote(note.id)} className="absolute top-2 right-2 text-red-600 hover:text-red-700"><IconTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Painéis de Viagem e Cuidados ---
function QuickListPanel({ title, items, setItems, categories, color }) {
    const [newItem, setNewItem] = useState("");

    const addItem = (name) => {
        if (!name.trim() || items.some(i => i.name.toLowerCase() === name.trim().toLowerCase())) return;
        const item = { id: Date.now(), name: name.trim(), done: false };
        setItems(prev => [item, ...prev]);
    };

    const addCategoryItems = (categoryName) => {
        const itemsToAdd = categories[categoryName];
        const newItems = itemsToAdd
            .filter(itemName => !items.some(i => i.name.toLowerCase() === itemName.toLowerCase()))
            .map(itemName => ({ id: Date.now() + Math.random(), name: itemName, done: false }));
        setItems(prev => [...newItems, ...prev]);
    };
    
    const toggleItem = (id) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
    };

    const clearDone = () => {
        setItems(prev => prev.filter(i => !i.done));
    };

    return (
        <div className="space-y-4 fade-in-animation">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-3">
                <div className="flex space-x-2">
                    <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Item personalizado..." className="flex-grow p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                    <button onClick={() => { addItem(newItem); setNewItem(''); }} className={`px-4 py-2 ${color} text-white rounded-lg`}>Adicionar</button>
                </div>
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Adicionar categorias rápidas:</p>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(categories).map(category => (
                            <button key={category} onClick={() => addCategoryItems(category)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                                + {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {items.some(i => i.done) && <button onClick={clearDone} className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Limpar Concluídos</button>}
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className={`p-4 rounded-xl shadow-sm flex justify-between items-center transition-all ${item.done ? 'bg-teal-100 dark:bg-teal-900/50' : 'bg-white dark:bg-gray-800'}`}>
                        <span onClick={() => toggleItem(item.id)} className={`cursor-pointer w-full ${item.done ? 'line-through text-gray-500' : ''}`}>{item.name}</span>
                        <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} className="text-red-500 hover:text-red-700"><IconTrash className="w-5 h-5" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}


// --- Tela de Login ---
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.includes('@') && password.length >= 6) {
      setError('');
      onLogin(email); // Passa o e-mail para a função de login
    } else {
      setError('Por favor, insira um e-mail válido e uma senha com pelo menos 6 caracteres.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg fade-in-animation">
        <div className="flex flex-col items-center">
          <LogoIcon className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">Acessar SyncList</h1>
          <p className="text-gray-500 dark:text-gray-400">Suas listas, em qualquer lugar.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">Entrar</button>
        </form>
      </div>
    </div>
  );
}

// --- Hook customizado para usar localStorage de forma isolada por usuário ---
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(initialValue);

    useEffect(() => {
        if (!key) {
            setStoredValue(initialValue);
            return;
        }
        try {
            const item = window.localStorage.getItem(key);
            setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (error) {
            console.error("Erro ao ler do localStorage", error);
            setStoredValue(initialValue);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]); 

    useEffect(() => {
        if (key) {
            try {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            } catch (error) {
                console.error("Erro ao escrever no localStorage", error);
            }
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}


// --- Componente Principal do App ---
export default function SimplePwaMultiListApp() {
  const [currentUser, setCurrentUser] = useLocalStorage('pwa_currentUser', null);
  const [theme, setTheme] = useLocalStorage('theme', 'light'); // Tema pode ser global
  const [tab, setTab] = useState('tasks');

  // Função para criar chaves de armazenamento específicas para o usuário
  const userKey = (dataName) => currentUser ? `${currentUser}_${dataName}` : null;
  
  const [tasks, setTasks] = useLocalStorage(userKey('pwa_tasks'), []);
  const [shoppingItems, setShoppingItems] = useLocalStorage(userKey('pwa_shopping'), []);
  const [activities, setActivities] = useLocalStorage(userKey('pwa_activities'), []);
  const [notes, setNotes] = useLocalStorage(userKey('pwa_notes'), []);
  const [travelItems, setTravelItems] = useLocalStorage(userKey('pwa_travel'), []);
  const [careItems, setCareItems] = useLocalStorage(userKey('pwa_care'), []);
  
  const travelCategories = { 'Higiene': ['Escova de dentes', 'Pasta de dentes'], 'Eletrônicos': ['Carregador', 'Power bank'], 'Documentos': ['Passaporte', 'Identidade'] };
  const careCategories = { 'Casa': ['Levar o lixo', 'Fechar o gás'], 'Carro': ['Verificar óleo', 'Calibrar pneus'], 'Pets': ['Comprar ração', 'Agendar veterinário'] };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const handleLogin = (email) => {
      setCurrentUser(email);
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
  };

  if (!currentUser) {
    return ( <div style={{ fontFamily: 'Inter, sans-serif' }}> <StyleInjector /> <LoginScreen onLogin={handleLogin} /> </div> );
  }

  const tabClasses = (t) => `px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 font-semibold text-sm ${tab === t ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`;
  
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <StyleInjector />
      <div className="max-w-xl mx-auto">
        <header className="flex justify-between items-center mb-6">
            <h1 className="flex items-center text-3xl font-bold"><LogoIcon className="w-8 h-8 mr-2" />SyncList</h1>
            <div className="flex items-center space-x-4">
                <select value={theme} onChange={(e) => setTheme(e.target.value)} className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600">
                    <option value="light">☀️ Claro</option>
                    <option value="dark">🌙 Escuro</option>
                </select>
                <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:underline">Sair</button>
            </div>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <div className={tabClasses("tasks")} onClick={() => setTab("tasks")}>Tarefas</div>
            <div className={tabClasses("shopping")} onClick={() => setTab("shopping")}>Compras</div>
            <div className={tabClasses("atividades")} onClick={() => setTab("atividades")}>Atividades</div>
            <div className={tabClasses("notes")} onClick={() => setTab("notes")}>Notas</div>
            <div className={tabClasses("viagem")} onClick={() => setTab("viagem")}>Viagem</div>
            <div className={tabClasses("cuidados")} onClick={() => setTab("cuidados")}>Cuidados</div>
        </div>

        <div>
            {tab === 'tasks' && <TasksPanel tasks={tasks} setTasks={setTasks} />}
            {tab === 'shopping' && <ShoppingPanel items={shoppingItems} setItems={setShoppingItems} />}
            {tab === 'atividades' && <ActivitiesPanel activities={activities} setActivities={setActivities} />}
            {tab === 'notes' && <NotesPanel notes={notes} setNotes={setNotes} />}
            {tab === 'viagem' && <QuickListPanel title="Viagem" items={travelItems} setItems={setTravelItems} categories={travelCategories} color="bg-cyan-500" />}
            {tab === 'cuidados' && <QuickListPanel title="Cuidados" items={careItems} setItems={setCareItems} categories={careCategories} color="bg-rose-500" />}
        </div>
      </div>
    </div>
  );
}
