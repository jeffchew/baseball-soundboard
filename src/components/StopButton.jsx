import audioEngine from '../utils/audioEngine';

export default function StopButton({ setIsPlaying }) {
  const handleStop = () => {
    audioEngine.stop();
    audioEngine.stopBackground();
    setIsPlaying(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-yankee-navy border-t-2 border-yankee-slate z-50">
      <button
        onClick={handleStop}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 text-xl"
      >
        ⏹ STOP
      </button>
    </div>
  );
}

// Made with Bob
