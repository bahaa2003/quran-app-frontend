/**
 * Utility functions for time formatting
 */

/**
 * Convert 24-hour format to 12-hour format with AM/PM
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} - Time in 12-hour format with AM/PM
 */
export const formatTime12Hour = (time24) => {
    if (!time24) return '--:--';
    
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Convert 12-hour format to 24-hour format
 * @param {string} time12 - Time in 12-hour format (H:MM AM/PM)
 * @returns {string} - Time in 24-hour format (HH:MM)
 */
export const formatTime24Hour = (time12) => {
    if (!time12) return '--:--';
    
    const [time, ampm] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours, 10);
    
    if (ampm === 'PM' && hour24 !== 12) {
        hour24 += 12;
    } else if (ampm === 'AM' && hour24 === 12) {
        hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
};

/**
 * Get current time in 12-hour format
 * @returns {string} - Current time in 12-hour format with AM/PM
 */
export const getCurrentTime12Hour = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Check if a prayer time is currently active (within 30 minutes)
 * @param {string} prayerTime - Prayer time in 24-hour format
 * @returns {boolean} - True if prayer time is active
 */
export const isPrayerTimeActive = (prayerTime) => {
    if (!prayerTime) return false;
    
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':');
    const prayerDate = new Date();
    prayerDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    
    const timeDiff = Math.abs(now - prayerDate);
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    return timeDiff <= thirtyMinutes;
};
