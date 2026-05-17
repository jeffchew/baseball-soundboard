/**
 * Modal dialog that confirms the user wants to stop long-form audio playback.
 * Displays over the main content with a backdrop and provides Cancel/Stop options.
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is currently visible
 * @param {Function} props.onConfirm - Callback when user confirms stop action
 * @param {Function} props.onCancel - Callback when user cancels stop action
 */
export default function StopConfirmationModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-yankee-navy border-2 border-yankee-slate rounded-lg shadow-2xl p-6 max-w-md mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          Stop Audio?
        </h2>
        <p className="text-yankee-slate mb-6">
          Are you sure you want to stop the current audio?
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
