import { FC, useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { useStandby } from '@/app/contexts/StandbyContext';
import { useAuth } from '@/app/auth';
import Bgimg from '@/assets/images/backgrounds/standby-bg.png';

interface PinEntryScreenProps {
  pinLength?: number;
}

/**
 * PinEntryScreen component
 * Displays after clicking standby screen
 * Slides up when correct PIN is entered
 * OTP-style PIN input with auto-focus
 * Uses user's passcode from auth context
 */
const PinEntryScreen: FC<PinEntryScreenProps> = ({ pinLength = 6 }) => {
  const { standbyState, exitStandby } = useStandby();
  const { user } = useAuth();

  // Get passcode from user profile
  const correctPin = user?.profile?.passcode != '000000' ? user?.profile?.passcode || '' : '';
  const actualPinLength = correctPin.length || pinLength;

  const [pin, setPin] = useState<string[]>(Array(actualPinLength).fill(''));
  const [error, setError] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (standbyState === 'pin-entry') {
      setIsAnimatingOut(false);
      // Focus first input when PIN entry screen appears
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } else {
      // Reset PIN when not showing
      setPin(Array(actualPinLength).fill(''));
      setError(false);
    }
  }, [standbyState, actualPinLength]);

  const handleClick = () => {
    inputRefs.current[currentIndex]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError(false);

    // Auto-focus next input
    if (value && index < actualPinLength - 1) {
      inputRefs.current[index + 1]?.focus();
      setCurrentIndex(index + 1);
    }

    // Check PIN when all fields are filled
    if (index === actualPinLength - 1 && value) {
      setCurrentIndex(0);
      const enteredPin = newPin.join('');
      if (enteredPin === correctPin) {
        // Correct PIN - animate out then exit standby
        setIsAnimatingOut(true);
        setTimeout(() => {
          exitStandby();
        }, 500); // Wait for animation to complete
      } else {
        // Wrong PIN - show error and clear
        setError(true);
        setTimeout(() => {
          setPin(Array(actualPinLength).fill(''));
          setError(false);
          inputRefs.current[0]?.focus();
        }, 500);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData?.getData('text').slice(0, actualPinLength) || '';

    if (pastedData && /^\d+$/.test(pastedData)) {
      const newPin = [...pin];
      pastedData.split('').forEach((digit: string, index: number) => {
        if (index < actualPinLength) {
          newPin[index] = digit;
        }
      });
      setPin(newPin);

      // Focus last filled input or check PIN if complete
      const lastFilledIndex = Math.min(pastedData.length - 1, actualPinLength - 1);
      inputRefs.current[lastFilledIndex]?.focus();

      if (pastedData.length === actualPinLength) {
        if (pastedData === correctPin) {
          setIsAnimatingOut(true);
          setTimeout(() => {
            exitStandby();
          }, 500);
        } else {
          setError(true);
          setTimeout(() => {
            setPin(Array(actualPinLength).fill(''));
            setError(false);
            inputRefs.current[0]?.focus();
          }, 500);
        }
      }
    }
  };

  // If no passcode is set, don't render this component
  // The StandbyOverlay will handle exiting directly
  if (!correctPin) {
    return null;
  }

  if (standbyState !== 'pin-entry' && !isAnimatingOut) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center ${
        isAnimatingOut
          ? 'transition-transform duration-500 ease-in-out -translate-y-full'
          : 'translate-y-0'
      }`}
      style={{
        backgroundImage: `url(${Bgimg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={handleClick}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#00000080] backdrop-blur-sm" />

      {/* PIN Entry Card */}
      <div className="relative z-10 text-center">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-md">
            <svg
              className="w-8 h-8 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl font-semibold mb-2 drop-shadow-lg">Enter passcode</h2>

        {/* Dots indicator */}
        <div className="flex gap-3 justify-center my-4">
          {pin.map((digit, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                digit ? 'bg-white scale-125' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* PIN Input Boxes */}
        <div className="flex gap-4 justify-center mb-6 mt-8">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`opacity-0 w-14 h-14 text-center text-2xl font-bold bg-white/90 backdrop-blur-md rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error
                  ? 'border-red-500 bg-red-50 animate-shake'
                  : digit
                  ? 'border-gray-300'
                  : 'border-gray-200'
              }`}
              style={{
                caretColor: 'transparent',
              }}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm font-medium mt-4 drop-shadow-lg animate-pulse">
            Incorrect passcode. Please try again.
          </p>
        )}
      </div>

      {/* Add shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PinEntryScreen;
