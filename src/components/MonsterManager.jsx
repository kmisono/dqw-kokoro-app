import React, { useState } from 'react';

export default function MonsterManager({ monsters, onClose, onSave }) {
    // Local state for checkboxes
    const [localMonsters, setLocalMonsters] = useState(monsters);

    const visibleCount = localMonsters.filter(m => m.isVisible !== false).length; // Handle undefined as true for legacy
    const MAX_VISIBLE = 8;

    const toggleVisibility = (id) => {
        setLocalMonsters(prev => prev.map(m => {
            if (m.id !== id) return m;

            // If currently visible, we can always hide it
            if (m.isVisible !== false) {
                return { ...m, isVisible: false };
            }

            // If currently hidden, we can only show it if under limit
            if (visibleCount < MAX_VISIBLE) {
                return { ...m, isVisible: true };
            }

            return m; // Do nothing if limit reached
        }));
    };

    const handleSave = () => {
        onSave(localMonsters);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="rpg-window w-full max-w-md flex flex-col max-h-[80vh] bg-black">
                <div className="p-4 border-b-2 border-white flex justify-between items-center bg-black">
                    <div>
                        <h2 className="text-lg text-white">MONSTER LIST</h2>
                        <p className="text-xs text-slate-400">
                            Select up to {MAX_VISIBLE} ({visibleCount}/{MAX_VISIBLE})
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-red-500 px-2 font-bold">X</button>
                </div>

                <div className="overflow-y-auto p-4 space-y-2 flex-1">
                    {localMonsters.length === 0 && (
                        <p className="text-center text-slate-500 py-10">No monsters found.</p>
                    )}

                    {localMonsters.map(monster => {
                        const isVisible = monster.isVisible !== false;
                        const isDisabled = !isVisible && visibleCount >= MAX_VISIBLE;

                        return (
                            <label
                                key={monster.id}
                                className={`
                                    border-2 p-3 flex items-center justify-between cursor-pointer transition-colors
                                    ${isVisible ? 'border-blue-500 bg-blue-900/20' : 'border-slate-700 bg-black'}
                                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-900'}
                                `}
                            >
                                <span className={isVisible ? 'text-white' : 'text-slate-500'}>
                                    {monster.name}
                                </span>

                                <div className={`
                                    w-6 h-6 border-2 flex items-center justify-center
                                    ${isVisible ? 'border-blue-400 bg-blue-500 text-white' : 'border-slate-600'}
                                `}>
                                    {isVisible && '✓'}
                                </div>

                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isVisible}
                                    onChange={() => !isDisabled && toggleVisibility(monster.id)}
                                    disabled={isDisabled}
                                />
                            </label>
                        )
                    })}
                </div>

                <div className="p-4 border-t-2 border-white flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">CANCEL</button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rpg-btn"
                    >
                        APPLY
                    </button>
                </div>
            </div>
        </div>
    );
}
