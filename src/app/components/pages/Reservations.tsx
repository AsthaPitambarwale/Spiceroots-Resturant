import { useState, useEffect } from 'react';
import { CalendarIcon, Clock, Users, Phone, User, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import reservationsApi from '../../api/reservations';

type MealSlot = 'breakfast' | 'lunch' | 'dinner';

interface TimeSlot {
  time: string;
  available: boolean;
}

export const Reservations = () => {
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [setLoadingSlots] = useState(false);
  const [showCustomGuests, setShowCustomGuests] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    mealSlot: 'lunch' as MealSlot,
    timeSlot: '',
    guests: 2,
    name: '',
    phone: '',
    specialRequests: '',
  });

  const calendarStyles = `
.react-calendar {
  width: 100% !important;
  max-width: 500px;
  border: none !important;
  border-radius: 16px;
  padding: 12px;
  background: transparent !important;
  font-family: inherit;
}

.react-calendar__navigation {
  margin-bottom: 16px;
}

.react-calendar__navigation button {
  min-width: 44px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
}

.react-calendar__navigation button:enabled:hover,
.react-calendar__navigation button:enabled:focus {
  background: #dbeafe;
}

.react-calendar__month-view__weekdays {
  text-align: center;
  font-weight: 600;
  margin-bottom: 8px;
}

.react-calendar__month-view__weekdays__weekday {
  padding: 8px;
}

.react-calendar__tile {
  height: 52px;
  border-radius: 10px;
  font-weight: 500;
}

.react-calendar__tile:hover {
  background: #bfdbfe !important;
}

.react-calendar__tile--active {
  background: #3b82f6 !important;
  color: white !important;
}

.react-calendar__tile--now {
  background: #dbeafe !important;
  color: #1e3a8a !important;
}

.react-calendar__tile:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* DARK MODE */

.dark .react-calendar {
  color: white;
}

.dark .react-calendar__navigation button {
  color: white;
}

.dark .react-calendar__navigation button:enabled:hover,
.dark .react-calendar__navigation button:enabled:focus {
  background: #374151;
}

.dark .react-calendar__month-view__weekdays {
  color: #d1d5db;
}

.dark .react-calendar__tile {
  color: white;
}

.dark .react-calendar__tile:hover {
  background: #1e40af !important;
}

.dark .react-calendar__tile--active {
  background: #2563eb !important;
  color: white !important;
}

.dark .react-calendar__tile--now {
  background: #1e3a8a !important;
  color: white !important;
}

.dark .react-calendar__tile:disabled {
  color: #6b7280 !important;
}
`;

  const mealSlots = {
    breakfast: { label: 'Breakfast', time: '8:00 AM - 11:00 AM', icon: '🌅' },
    lunch: { label: 'Lunch', time: '12:00 PM - 4:00 PM', icon: '☀️' },
    dinner: { label: 'Dinner', time: '6:00 PM - 11:00 PM', icon: '🌙' },
  };

  const baseTimeSlots: Record<MealSlot, string[]> = {
    breakfast: [
      '8:00 AM',
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
    ],
    lunch: [
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
    ],
    dinner: [
      '6:00 PM',
      '7:00 PM',
      '8:00 PM',
      '9:00 PM',
      '10:00 PM',
    ],
  };

  const availableTimeSlots: TimeSlot[] =
    baseTimeSlots[formData.mealSlot].map(time => ({
      time,
      available: !bookedSlots.includes(time),
    }));

  useEffect(() => {
    if (!formData.date) return;

    const fetchBookedSlots = async () => {
      try {
        setLoadingSlots(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL
          }/api/reservations/slots?date=${formData.date}&mealSlot=${formData.mealSlot}`
        );

        const data = await response.json();

        if (data.success) {
          setBookedSlots(data.bookedSlots || []);
        }
      } catch (error) {
        console.error('Failed to load slots:', error);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [formData.date, formData.mealSlot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.timeSlot) {
      toast.error('Please select date and time');
      return;
    }

    try {
      await reservationsApi.createReservation({
        date: formData.date,
        mealSlot: formData.mealSlot,
        timeSlot: formData.timeSlot,
        guests: formData.guests,
        name: formData.name,
        phone: formData.phone,
        specialRequests: formData.specialRequests,
      });

      toast.success('Reservation created successfully');

      setShowConfirmation(true);

      // Reset form
      setFormData({
        date: '',
        mealSlot: 'lunch',
        timeSlot: '',
        guests: 2,
        name: '',
        phone: '',
        specialRequests: '',
      });

      setBookedSlots([]);
      setShowCustomGuests(false);
      setStep(1);

      setTimeout(() => {
        setShowConfirmation(false);
      }, 5000);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create reservation');
    }
  };

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 dark:from-gray-900 via-white dark:via-gray-800 to-red-50 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 dark:text-white">
            Reserve Your Table
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
            Book a table at Spiceroots for an unforgettable dining experience
          </p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-3 w-fit">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  {/* Step Circle */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= s
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                  >
                    {s}
                  </div>

                  {/* Connector line */}
                  {s < 3 && (
                    <div
                      className={`w-10 h-1 mx-2 rounded-full transition-all ${step > s
                          ? 'bg-blue-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Date & Meal Slot */}
              {step === 1 && (
                <motion.div key="step1" className="space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                    {/* LEFT - Calendar */}
                    <div className="h-full flex flex-col">
                      <label className="block text-sm font-medium mb-3 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Select Date
                      </label>

                      <style>{calendarStyles}</style>

                      <div className="flex-1 bg-white dark:bg-gray-700 p-3 rounded-xl flex items-center justify-center min-h-[360px]">
                        <Calendar
                          onChange={(value) => {
                            if (value instanceof Date) {
                              const d = value.toISOString().split('T')[0];
                              setFormData({ ...formData, date: d });
                            }
                          }}
                          value={formData.date ? new Date(formData.date) : null}
                          minDate={new Date(Date.now() + 86400000)}
                          className="w-full text-sm"
                        />
                      </div>

                      {formData.date && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          {new Date(formData.date).toDateString()}
                        </p>
                      )}
                    </div>

                    {/* RIGHT - Meal Slots */}
                    {/* RIGHT - Meal Slots */}
                    <div className="h-full flex flex-col">
                      <label className="block text-sm font-medium mb-3 dark:text-white">
                        Select Meal Time
                      </label>

                      <div className="flex-1 bg-white dark:bg-gray-700 p-4 rounded-xl min-h-[360px]">

                        <div className="flex flex-col gap-4 h-full justify-between">

                          {(Object.keys(mealSlots) as MealSlot[]).map((slot) => (
                            <motion.button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, mealSlot: slot, timeSlot: '' });
                                setBookedSlots([]);
                              }}
                              className={`flex-1 flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${formData.mealSlot === slot
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Icon */}
                              <div className="text-3xl">{mealSlots[slot].icon}</div>

                              {/* Text */}
                              <div className="flex flex-col">
                                <div className="font-semibold text-sm dark:text-white">
                                  {mealSlots[slot].label}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {mealSlots[slot].time}
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!formData.date}
                      className="w-full md:w-auto md:px-10 bg-blue-500 text-white py-3 rounded-lg font-semibold"
                    >
                      Continue
                    </button>
                  </div>

                </motion.div>
              )}

              {/* Step 2: Time Slot & Guests */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium mb-3 dark:text-white">
                      Select Time Slot
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setFormData({ ...formData, timeSlot: slot.time })}
                          className={`p-4 rounded-lg border-2 font-medium transition-all ${!slot.available
                            ? 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed'
                            : formData.timeSlot === slot.time
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:text-white'
                            }`}
                        >
                          {slot.time}
                          {!slot.available && (
                            <div className="text-xs text-red-500 mt-1">
                              Fully Booked
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      <Users className="inline h-4 w-4 mr-2" />
                      Number of Guests
                    </label>
                    <select
                      value={showCustomGuests ? 'custom' : formData.guests}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setShowCustomGuests(true);
                          setFormData({
                            ...formData,
                            guests: 11,
                          });
                        } else {
                          setShowCustomGuests(false);
                          setFormData({
                            ...formData,
                            guests: Number(e.target.value),
                          });
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}

                      <option value="custom">10+ Guests</option>
                    </select>
                    {showCustomGuests && (
                      <div className="mt-3">
                        <input
                          type="number"
                          min={11}
                          value={formData.guests}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              guests: Number(e.target.value),
                            })
                          }
                          placeholder="Enter number of guests"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-4 rounded-lg font-semibold transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!formData.timeSlot}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-lg font-semibold shadow-lg transition-all"
                    >
                      Continue to Details
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Personal Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      <User className="inline h-4 w-4 mr-2" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Any dietary restrictions or special occasions?"
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-4 rounded-lg font-semibold transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-semibold shadow-lg transition-all"
                    >
                      Confirm Reservation
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Confirmation Popup */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowConfirmation(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 dark:text-white">
                  Reservation Confirmed!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thank you, {formData.name}! Your table for {formData.guests} guests has been reserved for {formData.date} at {formData.timeSlot}.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    A confirmation has been sent to {formData.phone}
                  </p>
                </div>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg transition-all"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};