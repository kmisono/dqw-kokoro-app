import { useState, useEffect } from 'react';
import { getLogs, saveLog, getMonsters, saveMonster, deleteMonster } from './lib/storage';
import { RANK_COLORS } from './lib/constants';
import { useTranslation } from './hooks/useTranslation';
import MonsterSelect from './components/MonsterSelect';
// ... (imports)

// ... (App component code)


import DropInput from './components/DropInput';
import Dashboard from './components/Dashboard';
import MonsterEditor from './components/MonsterEditor';
import HistoryModal from './components/HistoryModal';
import MonsterManager from './components/MonsterManager';
import AboutModal from './components/AboutModal';

function App() {
  const { t } = useTranslation();
  const [monsters, setMonsters] = useState([]);
  const [activeMonsterId, setActiveMonsterId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Editor State
  const [showEditor, setShowEditor] = useState(false);
  const [editingMonster, setEditingMonster] = useState(null); // If null, creating new

  // Manager State
  const [showManager, setShowManager] = useState(false);

  // History State
  const [showHistory, setShowHistory] = useState(false);

  // About Modal State
  const [showAbout, setShowAbout] = useState(false);

  const [initError, setInitError] = useState(null);

  useEffect(() => {
    console.log("App mounted, loading data...");
    try {
      loadData();
    } catch (e) {
      console.error("Critical error in loadData", e);
      setInitError(e.message);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const loadData = () => {
    const loadedLogs = getLogs();
    const loadedMonsters = getMonsters();
    setLogs(loadedLogs);
    setMonsters(loadedMonsters);

    // Filter visible monsters for auto-select
    const visibleMonsters = loadedMonsters.filter(m => m.isVisible !== false);

    // Auto-select first monster if none selected
    if (visibleMonsters.length > 0 && !activeMonsterId) {
      setActiveMonsterId(visibleMonsters[0].id);
    }
  };

  const handleSaveMonster = (monster) => {
    // Ensure isVisible is set for new monsters
    if (monster.isVisible === undefined) monster.isVisible = true;

    const updatedMonsters = saveMonster(monster);
    setMonsters(updatedMonsters);
    setActiveMonsterId(monster.id); // Select the edited/created one
    setShowEditor(false);
    setEditingMonster(null);
  };

  const handleDeleteMonster = (id) => {
    if (!window.confirm("Are you sure? Logs will remain but monster config will be lost.")) return;
    const updated = deleteMonster(id);
    setMonsters(updated);
    setShowEditor(false);
    setEditingMonster(null);

    const visibleMonsters = updated.filter(m => m.isVisible !== false);
    if (visibleMonsters.length > 0) setActiveMonsterId(visibleMonsters[0].id);
    else setActiveMonsterId(null);
  };

  const handleUpdateVisibility = (updatedMonsters) => {
    // We need to save ALL monsters back to storage, replacing the old list
    // But saveMonster saves one by one. We should probably add a bulk save or just iterate.
    // Since `updatedMonsters` contains all monsters with updated visibility:
    // We can just use it to update state and storage.
    // However, `saveMonster` appends/updates.
    // Let's create a bulk update in storage or just iterate here.
    // Easiest is to manually update storage here since it's just a JSON dump.
    // But it's better to add a `saveAllMonsters` to storage.js.
    // For now, let's just use a loop or direct localStorage for simplicity since we are in App.jsx?
    // No, I didn't import the key.
    // Let's iterate `saveMonster`? No that's inefficient.
    // I will update `setMonsters` and effectively rewrite storage.

    // WAIT: `updatedMonsters` from MonsterManager is the FULL list with modified flags.
    // I can just save them.
    // Let's modify storage.js to accept `saveMonsters` list. 
    // Actually `saveMonster` reads, modifies, writes.
    // I will just add `saveMonstersList` to storage.js.

    // For now, let's assume I'll add `saveMonstersList`.
    // I will add it in the next step.

    setMonsters(updatedMonsters);
    // We need to trigger storage update. I'll do this properly.
    localStorage.setItem('dqw_monsters', JSON.stringify(updatedMonsters));
    setShowManager(false);
  };

  const handleDrop = (rank) => {
    if (!activeMonsterId) return;
    const newLog = {
      id: Date.now().toString(),
      monsterId: activeMonsterId,
      rank,
      timestamp: Date.now()
    };
    const updatedLogs = saveLog(newLog);
    setLogs(updatedLogs);
  };

  const activeMonster = monsters.find(m => m.id === activeMonsterId);
  const visibleMonsters = monsters.filter(m => m.isVisible !== false);

  if (!isLoaded) return <div className="p-10 text-center">Loading...</div>;

  if (initError) return (
    <div className="p-10 text-center text-red-500">
      <h2 className="text-xl font-bold mb-2">Startup Error</h2>
      <p>{initError}</p>
      <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-slate-800 rounded">Retry</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-safe relative font-dotgothic">
      <header className="px-4 py-4 sm:py-6 sticky top-0 z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-black border-b-2 border-white gap-2 sm:gap-4">
        <div className="w-full sm:w-auto flex justify-between sm:justify-start items-center">
          <h1 className="text-xl text-white tracking-widest text-left">
            {t('APP_TITLE')}
          </h1>
          {/* Mobile Info Button (visible only on mobile if space is tight, or just same layout) */}
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
          <button
            onClick={() => setShowAbout(true)}
            className="text-xs rpg-btn px-2 py-1.5 border-slate-500 text-slate-400 hover:text-white"
            title="About"
          >
            ?
          </button>
          <button
            onClick={() => setShowManager(true)}
            className="text-xs rpg-btn px-3 py-1.5 border-slate-500 text-slate-400 hover:text-white flex-1 sm:flex-none justify-center"
          >
            {t('MANAGE_VISIBILITY')}
          </button>

          <button
            onClick={() => { setEditingMonster(null); setShowEditor(true); }}
            className="text-xs rpg-btn px-3 py-1.5 flex-1 sm:flex-none justify-center"
          >
            {t('ADD_NEW')}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-20">

        {/* Zero State */}
        {monsters.length === 0 && (
          <div className="text-center p-10 mt-10 opacity-70">
            <div className="text-4xl mb-4">🐉</div>
            <p className="mb-4">No monsters configured.</p>
            <button
              onClick={() => setShowEditor(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
            >
              Add Your First Monster
            </button>
          </div>
        )}

        {monsters.length > 0 && (
          <>
            <div className="flex items-center justify-between pr-4">
              <div className="flex-1 overflow-hidden">
                <MonsterSelect
                  monsters={visibleMonsters}
                  activeMonsterId={activeMonsterId}
                  onSelect={setActiveMonsterId}
                />
              </div>
              {/* Edit Current Monster Button */}
              {activeMonster && (
                <button
                  onClick={() => { setEditingMonster(activeMonster); setShowEditor(true); }}
                  className="text-slate-500 hover:text-white p-2"
                  title="Edit Monster"
                >
                  ⚙️
                </button>
              )}
            </div>

            <div className="mt-4 mb-6">
              <DropInput onDrop={handleDrop} />
            </div>

            <Dashboard logs={logs} monster={activeMonster} />

            {/* Recent Drops List */}
            <div className="px-6 py-4 mt-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-slate-600 text-xs uppercase">{t('RECENT_DROPS')} ({activeMonster?.name})</div>
                <button
                  onClick={() => setShowHistory(true)}
                  className="text-blue-400 text-xs font-bold hover:underline"
                >
                  {t('VIEW_ALL')} ({logs.filter(l => l.monsterId === activeMonsterId).length})
                </button>
              </div>

              <div className="space-y-2">
                {logs
                  .filter(l => l.monsterId === activeMonsterId)
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .slice(0, 5)
                  .map(log => {
                    let dateStr = "Unknown Date";
                    try {
                      if (log.timestamp) {
                        const date = new Date(log.timestamp);
                        if (!isNaN(date.getTime())) {
                          dateStr = date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        }
                      }
                    } catch (e) {
                      console.error("Date parse error", e);
                    }
                    return (
                      <div key={log.id} className="flex justify-between text-sm text-slate-400 border-b border-white/5 pb-1">
                        <span>{dateStr}</span>
                        <span className={`font-bold ${log.rank === 'S' ? 'text-yellow-400' :
                          log.rank === 'A' ? 'text-pink-400' : 'text-slate-300'
                          }`}>{log.rank}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Editor Modal */}
      {showEditor && (
        <MonsterEditor
          monster={editingMonster}
          onSave={handleSaveMonster}
          onCancel={() => { setShowEditor(false); setEditingMonster(null); }}
          onDelete={editingMonster ? handleDeleteMonster : null}
        />
      )}

      {/* Manager Modal */}
      {showManager && (
        <MonsterManager
          monsters={monsters}
          onClose={() => setShowManager(false)}
          onSave={handleUpdateVisibility}
        />
      )}

      {/* History Modal */}
      {showHistory && activeMonster && (
        <HistoryModal
          logs={logs}
          monster={activeMonster}
          onClose={() => setShowHistory(false)}
          onUpdate={(newLogs) => setLogs(newLogs)}
        />
      )}

      {/* About Modal */}
      {showAbout && (
        <AboutModal
          onClose={() => setShowAbout(false)}
        />
      )}
    </div>
  );
}

export default App;
