import { useTranslation } from '../hooks/useTranslation';

export default function AboutModal({ onClose }) {
    const { t } = useTranslation();
    const appVersion = "1.0.0";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="rpg-window w-full max-w-sm flex flex-col bg-black border-2 border-white p-1">
                <div className="p-3 border-b-2 border-white flex justify-between items-center bg-slate-900">
                    <h2 className="text-lg text-white font-bold tracking-wider">
                        {t('ABOUT_TITLE')}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-red-500 px-2 font-bold">X</button>
                </div>

                <div className="p-6 text-center space-y-6 bg-slate-900">
                    <div>
                        <h3 className="text-xl text-yellow-400 font-bold mb-1">{t('APP_TITLE')}</h3>
                        <p className="text-xs text-slate-500">v{appVersion}</p>
                    </div>

                    <div className="text-sm text-slate-300 leading-relaxed text-left border border-slate-700 p-4 rounded bg-black/50">
                        <p className="mb-2">
                            {t('APP_DESCRIPTION')}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <a
                            href="https://github.com/kmisono/dqw-kokoro-app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-2 border-2 border-white text-white hover:bg-white hover:text-black transition-colors font-bold text-sm"
                        >
                            {t('GITHUB_REPOSITORY')}
                        </a>
                    </div>

                    <div className="text-[10px] text-slate-600 border-t border-slate-800 pt-4 mt-4 text-left whitespace-pre-wrap">
                        <p className="mb-2">
                            {t('DISCLAIMER')}
                        </p>
                        <p>
                            &copy; 2025 DQW Kokoro Manager
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
