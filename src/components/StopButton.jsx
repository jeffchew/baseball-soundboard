import { useState } from 'react';
import audioEngine from '../utils/audioEngine';
import StopConfirmationModal from './StopConfirmationModal';

/**
 * Fixed stop button component that appears at the bottom of the screen.
 * Shows a confirmation modal for long-form audio (songs, pregame, anthem).
 * @param {Object} props
 * @param {Function} props.setIsPlaying - Function to update the playing state
 */
export default function StopButton({ setIsPlaying }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  /**
   * Handles the stop button click.
   * Shows confirmation modal for long-form audio, otherwise stops immediately.
   */
  const handleStopClick = () => {
    // Check if current audio requires confirmation
    if (audioEngine.requiresStopConfirmation()) {
      setShowConfirmation(true);
    } else {
      performStop();
    }
  };

  /**
   * Performs the actual stop operation.
   * Stops both foreground and background audio and updates playing state.
   */
  const performStop = () => {
    audioEngine.stop();
    audioEngine.stopBackground();
    setIsPlaying(false);
    setShowConfirmation(false);
  };

  /**
   * Cancels the stop operation and closes the confirmation modal.
   */
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


