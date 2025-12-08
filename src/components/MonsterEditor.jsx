import React, { useState, useEffect } from 'react';
import { DEFAULT_MONSTER_TEMPLATE } from '../lib/constants';
import { getRankPoints } from '../lib/calculator';

// Simple modal or form for editing a monster
export default function MonsterEditor({ monster, onSave, onCancel, onDelete }) {
    const [formData, setFormData] = useState(DEFAULT_MONSTER_TEMPLATE);

    // Load initial data
    useEffect(() => {
        if (monster) {
            setFormData(monster);
        } else {
            setFormData({
                ...DEFAULT_MONSTER_TEMPLATE,
                id: Date.now().toString(),
                synthesis: { ...DEFAULT_MONSTER_TEMPLATE.synthesis }
            });
        }
    }, [monster]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSynthesisChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            synthesis: {
                ...prev.synthesis,
                [key]: parseInt(value) || 0
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    // Calculate current points for display
    const currentPoints = formData.synthesis ? getRankPoints(formData.synthesis) : { S: 0, A: 0, B: 0, C: 0, D: 0 };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="rpg-window w-full max-w-md p-6 max-h-[90vh] overflow-y-auto bg-black">
                <h2 className="text-xl text-white mb-4 tracking-widest text-center border-b-2 border-white pb-2">
                    {monster ? 'EDIT MONSTER' : 'NEW MONSTER'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase text-slate-400 mb-1">Monster Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black border-2 border-white p-3 text-white focus:outline-none font-dotgothic"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="NAME"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-slate-400 mb-1">Target S Count</label>
                        <input
                            type="number"
                            min="1"
                            required
                            className="w-full bg-black border-2 border-white p-3 text-white focus:outline-none font-dotgothic"
                            value={formData.sTarget}
                            onChange={(e) => handleChange('sTarget', parseInt(e.target.value))}
                        />
                    </div>

                    {/* Synthesis Rules */}
                    <div className="border-2 border-slate-600 p-4 relative mt-6">
                        <h3 className="text-xs text-white absolute -top-3 left-2 bg-black px-2">SYNTHESIS RULES</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <SynthesisInput label="D → C" value={formData.synthesis?.D_to_C} onChange={(v) => handleSynthesisChange('D_to_C', v)} />
                            <SynthesisInput label="C → B" value={formData.synthesis?.C_to_B} onChange={(v) => handleSynthesisChange('C_to_B', v)} />
                            <SynthesisInput label="B → A" value={formData.synthesis?.B_to_A} onChange={(v) => handleSynthesisChange('B_to_A', v)} />
                            <SynthesisInput label="A → S" value={formData.synthesis?.A_to_S} onChange={(v) => handleSynthesisChange('A_to_S', v)} />
                        </div>

                        {/* Calculated Point Values Display */}
                        <div className="mt-4 pt-4 border-t border-slate-800">
                            <h4 className="text-[10px] text-slate-500 uppercase mb-2">Calculated Point Values</h4>
                            <div className="flex justify-between text-xs text-slate-300 font-mono">
                                <span>S:{currentPoints.S}</span>
                                <span>A:{currentPoints.A}</span>
                                <span>B:{currentPoints.B}</span>
                                <span>C:{currentPoints.C}</span>
                                <span>D:{currentPoints.D}</span>
                            </div>
                        </div>
                    </div>

                    {/* Manual EV Override */}
                    <div className="border-2 border-slate-600 p-4 relative mt-4">
                        <h3 className="text-xs text-white absolute -top-3 left-2 bg-black px-2">PREDICTION CONFIG</h3>
                        <div>
                            <label className="block text-[10px] text-slate-500 mb-1">
                                EV Override (Points Per Battle)
                                <span className="block text-[9px] opacity-70">Set to 0 to use Actual Average</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                className="w-full bg-black border border-slate-700 p-2 text-white focus:outline-none font-dotgothic text-right"
                                value={formData.manualEV || 0}
                                onChange={(e) => handleChange('manualEV', parseFloat(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        {onDelete && (
                            <button
                                type="button"
                                onClick={() => onDelete(monster.id)}
                                className="px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rpg-btn"
                            >
                                DELETE
                            </button>
                        )}
                        <div className="flex-1"></div>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-slate-400 hover:text-white"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black rpg-btn"
                        >
                            SAVE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function SynthesisInput({ label, value, onChange }) {
    return (
        <div>
            <label className="block text-[10px] text-slate-500 mb-1">{label}</label>
            <input
                type="number"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-center font-mono"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}
