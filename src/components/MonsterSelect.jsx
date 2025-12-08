import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export default function MonsterSelect({ monsters, activeMonsterId, onSelect, onAdd }) {
    const { t } = useTranslation();

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {monsters.map(monster => (
                <button
                    key={monster.id}
                    onClick={() => onSelect(monster.id)}
                    className={`
                        whitespace-nowrap px-4 py-2 border-2 
                        ${activeMonsterId === monster.id ? 'bg-white text-black border-white' : 'bg-black text-slate-400 border-slate-700 hover:border-slate-500'}
                        font-dotgothic transition-all
                    `}
                >
                    {monster.name || "UNNAMED"}
                </button>
            ))}

            <button
                onClick={onAdd}
                className="whitespace-nowrap px-4 py-2 border-2 border-dashed border-slate-700 text-slate-500 hover:border-slate-400 hover:text-slate-300 font-dotgothic"
            >
                {t('ADD_NEW')}
            </button>
        </div>
    );
}
