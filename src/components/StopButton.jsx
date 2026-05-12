import { useState } from 'react';
import audioEngine from '../utils/audioEngine';
import StopConfirmationModal from './StopConfirmationModal';

export default function StopButton({ setIsPlaying }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleStopClick = () => {
    // Check if current audio requires confirmation
    if (audioEngine.requiresStopConfirmation()) {
      setShowConfirmation(true);
    } else {
      performStop();
    }
  };

  const performStop = () => {
    audioEngine.stop();
    audioEngine.stopBackground();
    setIsPlaying(false);
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-yankee-navy border-t-2 border-yankee-slate z-50">
        <button
          onClick={handleStopClick}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 text-xl"
        >
          ⏹ STOP
        </button>
      </div>

      <StopConfirmationModal
        isOpen={showConfirmation}
        onConfirm={performStop}
        onCancel={handleCancel}
      />
    </>
  );
}


