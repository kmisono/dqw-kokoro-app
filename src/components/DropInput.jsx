import React from 'react';
import { RANKS } from '../lib/constants';
import { useTranslation } from '../hooks/useTranslation';

export default function DropInput({ onDrop }) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-slate-500 text-sm tracking-widest">{t('RECORD_DROP')}</p>
            <div className="flex justify-center gap-2 p-4">
                {RANKS.map(rank => {
                    // Manually map constants to border colors since we can't easily concatenate dynamic classes safely without safelist
                    let colorClasses = '!border-white !text-white';
                    if (rank === 'S') colorClasses = '!border-yellow-400 !text-yellow-400';
                    if (rank === 'A') colorClasses = '!border-pink-400 !text-pink-400';
                    if (rank === 'B') colorClasses = '!border-blue-400 !text-blue-400';
                    if (rank === 'C') colorClasses = '!border-green-400 !text-green-400';

                    return (
                        <button
                            key={rank}
                            onClick={() => onDrop(rank)}
                            className={`
                                w-12 py-3 mr-2 rpg-btn text-xl
                                ${colorClasses}
                                hover:bg-white hover:text-black
                            `}
                        >
                            {rank}
                        </button>
                    )
                })}
            </div>
        </div>
    );
}
