import { useState } from 'react';
import { getLogs, deleteLog, updateLog } from '../lib/storage';
import { RANKS, RANK_COLORS } from '../lib/constants';
import { useTranslation } from '../hooks/useTranslation';

export default function HistoryModal({ logs, monster, onClose, onUpdate }) {
    const { t } = useTranslation();
    const [editingLogId, setEditingLogId] = useState(null);

    const filteredLogs = logs
        .filter(l => l.monsterId === monster.id)
        .sort((a, b) => b.timestamp - a.timestamp);

    const handleUpdate = (logId, rank) => {
        const updated = updateLog(logId, rank);
        onUpdate(updated);
        setEditingLogId(null);
    };

    const handleDelete = (logId) => {
        if (!window.confirm(t('CONFIRM_DELETE'))) return;
        const updated = deleteLog(logId);
        onUpdate(updated);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="rpg-window w-full max-w-md flex flex-col max-h-[80vh] bg-black">
                <div className="p-4 border-b-2 border-white flex justify-between items-center bg-black">
                    <h2 className="text-lg text-white">
                        {t('HISTORY_TITLE')}: {monster.name}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-red-500 px-2 font-bold">X</button>
                </div>

                <div className="overflow-y-auto p-4 space-y-2 flex-1">
                    {filteredLogs.length === 0 && (
                        <p className="text-center text-slate-500 py-10">No history found.</p>
                    )}

                    {filteredLogs.map(log => {
                        const isEditing = editingLogId === log.id;
                        let dateStr = "Unknown";
                        try {
                            const date = new Date(log.timestamp);
                            dateStr = date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        } catch (e) { }

                        return (
                            <div key={log.id} className="border-2 border-slate-700 p-3 flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">{dateStr}</div>
                                    {isEditing ? (
                                        <div className="flex gap-1">
                                            {RANKS.map(r => (
                                                <button
                                                    key={r}
                                                    onClick={() => handleUpdate(log.id, r)}
                                                    className={`px-2 py-1 text-xs border ${r === log.rank ? 'bg-white text-black' : 'border-slate-500 text-slate-500'}`}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className={`text-xl ${RANK_COLORS[log.rank] || 'text-white'}`}>{log.rank}</span>
                                    )}
                                </div>

                                <div className="flex gap-2 text-xs">
                                    {isEditing ? (
                                        <button onClick={() => setEditingLogId(null)} className="text-slate-400">{t('CANCEL')}</button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setEditingLogId(log.id)}
                                                className="text-blue-400"
                                            >
                                                {t('EDIT')}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(log.id)}
                                                className="text-red-400"
                                            >
                                                {t('DELETE')}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
