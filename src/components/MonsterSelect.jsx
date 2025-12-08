import React from 'react';

export default function MonsterSelect({ monsters, activeMonsterId, onChange }) {
    return (
        <div className="flex overflow-x-auto space-x-4 p-4 pb-2 no-scrollbar">
            {monsters.map(monster => {
                const isActive = monster.id === activeMonsterId;
                return (
                    <button
                        key={monster.id}
                        onClick={() => onChange(monster.id)}
                        className={`
              flex-shrink-0 px-4 py-2 mr-4 rpg-btn text-sm whitespace-nowrap
              ${isActive
                                ? 'bg-white text-black'
                                : 'bg-black text-slate-400 border-slate-600'}
            `}
                    >
                        {isActive ? '▶ ' : ''}{monster.name}
                    </button>
                );
            })}
        </div>
    );
}
