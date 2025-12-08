import React from 'react';
import { calculateStats, predictRemainingBattles, calculateDefaultExpectedValue, calculateOptimalInventory } from '../lib/calculator';
import { RANK_COLORS } from '../lib/constants';
import { useTranslation } from '../hooks/useTranslation';

export default function Dashboard({ logs, monster }) {
    const { t } = useTranslation();

    if (!monster) return null;

    const { totalPoints, sProgress, rankPoints, counts, averagePoints, logs: monsterLogs } = calculateStats(logs, monster);
    const targetPoints = monster.sTarget * rankPoints.S;
    const progressPercent = Math.min(100, (totalPoints / targetPoints) * 100);

    // Simulate Synthesis
    const optimizedCounts = calculateOptimalInventory(counts, monster.synthesis);

    // Prediction Logic
    // Use actual average if we have logs, otherwise fallback to theoretical default
    const theoreticalEV = monster.expectedValue || calculateDefaultExpectedValue(monster);

    // Check for Manual Override
    const manualEV = monster.manualEV && monster.manualEV > 0 ? monster.manualEV : null;

    // Use Actual EV if we have history, otherwise Theoretical. Priority to Manual.
    let usedEV = (monsterLogs.length > 0 && averagePoints > 0) ? averagePoints : theoreticalEV;
    if (manualEV) usedEV = manualEV;

    const remainingBattles = predictRemainingBattles(monster.sTarget, totalPoints, monster, usedEV);

    return (
        <div className="p-4 space-y-6">
            {/* Main Progress Card */}
            <div className="rpg-window p-6 text-center">
                <p className="text-white text-sm mb-2">{t('PROGRESS')}</p>

                <h2 className="text-4xl text-white mb-2 tracking-widest">
                    {sProgress.toFixed(1)} <span className="text-lg">/ {monster.sTarget} S</span>
                </h2>

                <div className="text-blue-300 font-mono mb-4 text-xl">
                    PTS: {totalPoints} <span className="text-slate-500">/ {targetPoints}</span>
                </div>

                {/* Pixel Progress Bar */}
                <div className="h-4 border-2 border-white bg-black relative mb-2">
                    <div
                        className="h-full bg-white transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>{Math.round(progressPercent)}%</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4">
                {/* Prediction Card */}
                <div className="rpg-window p-4 flex flex-col items-center">
                    <p className="text-sm mb-2 uppercase">{t('REMAINING_BATTLES')}</p>
                    <div className="text-3xl text-yellow-400 mb-1">
                        {remainingBattles === 0 ? t('COMPLETE') : `~${remainingBattles}`}
                    </div>
                    <p className="text-[10px] text-slate-500">
                        {manualEV ? `${t('MANUAL_SETTING')}: ${manualEV}` :
                            (monsterLogs.length > 0 ? `${t('ACTUAL_AVG')}: ${averagePoints.toFixed(1)}` : `${t('THEORETICAL')}: ${theoreticalEV.toFixed(1)}`)
                        }
                    </p>
                </div>

                {/* Effective Inventory Card */}
                <div className="rpg-window p-4">
                    <p className="text-sm mb-2 text-center uppercase border-b-2 border-slate-700 pb-2">{t('EFFECTIVE_INVENTORY')}</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {['S', 'A', 'B', 'C', 'D'].map(rank => (
                            <RankCountBadge
                                key={rank}
                                rank={rank}
                                count={optimizedCounts[rank]}
                            />
                        ))}
                    </div>
                </div>

                {/* Drop History (Raw) */}
                <div className="rpg-window p-4">
                    <p className="text-sm mb-2 text-center uppercase border-b-2 border-slate-700 pb-2">{t('RAW_DROPS')}</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-2 opacity-70">
                        {['S', 'A', 'B', 'C', 'D'].map(rank => {
                            const count = counts[rank];
                            const totalDrops = monsterLogs.length;
                            const percent = totalDrops > 0 ? ((count / totalDrops) * 100).toFixed(1) : "0.0";
                            return (
                                <RankCountBadge
                                    key={rank}
                                    rank={rank}
                                    count={count}
                                    dimmed={true}
                                    extraLabel={`${percent}%`}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function RankCountBadge({ rank, count, dimmed, extraLabel }) {
    const colorClass = RANK_COLORS[rank] || 'text-white';
    return (
        <span className={`px-3 py-1 text-sm border-2 flex flex-col items-center leading-tight ${count > 0
            ? (dimmed ? `border-slate-500 ${colorClass} opacity-60` : `border-white ${colorClass}`)
            : 'border-slate-800 text-slate-700'
            }`}>
            <span>{rank}:{count}</span>
            {extraLabel && <span className="text-[10px] opacity-70 text-slate-400">{extraLabel}</span>}
        </span>
    )
}
