const STORAGE_KEY_LOGS = 'dqw_battle_logs';
const STORAGE_KEY_MONSTERS = 'dqw_monsters';

// --- LOGS ---
export const getLogs = () => {
    try {
        const logs = localStorage.getItem(STORAGE_KEY_LOGS);
        return logs ? JSON.parse(logs) : [];
    } catch (e) {
        console.error("Failed to load logs", e);
        return [];
    }
};

export const saveLog = (log) => {
    const logs = getLogs();
    const newLogs = [...logs, log];
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(newLogs));
    return newLogs;
};

export const updateLog = (logId, newRank) => {
    const logs = getLogs();
    const newLogs = logs.map(l => l.id === logId ? { ...l, rank: newRank } : l);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(newLogs));
    return newLogs;
};

export const deleteLog = (logId) => {
    const logs = getLogs();
    const newLogs = logs.filter(l => l.id !== logId);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(newLogs));
    return newLogs;
}


// --- MONSTERS ---
export const getMonsters = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY_MONSTERS);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Failed to load monsters", e);
        return [];
    }
};

export const saveMonster = (monster) => {
    const monsters = getMonsters();
    const index = monsters.findIndex(m => m.id === monster.id);
    let newMonsters;

    if (index >= 0) {
        newMonsters = [...monsters];
        newMonsters[index] = monster;
    } else {
        newMonsters = [...monsters, monster];
    }

    localStorage.setItem(STORAGE_KEY_MONSTERS, JSON.stringify(newMonsters));
    return newMonsters;
};

export const deleteMonster = (id) => {
    const monsters = getMonsters();
    const newMonsters = monsters.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY_MONSTERS, JSON.stringify(newMonsters));
    return newMonsters;
}

export const clearLogs = () => {
    localStorage.removeItem(STORAGE_KEY_LOGS);
    return [];
}
