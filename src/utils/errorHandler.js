// Enhanced error handling utilities for روح القرآن - Rooh Al-Quran Platform

export const ErrorTypes = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
    AUDIO_PLAYBACK_ERROR: 'AUDIO_PLAYBACK_ERROR',
    API_ERROR: 'API_ERROR'
};

export const getErrorMessage = (error, type) => {
    // Default Arabic error messages
    const defaultMessages = {
        [ErrorTypes.NETWORK_ERROR]: 'خطأ في الاتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
        [ErrorTypes.VALIDATION_ERROR]: 'يرجى التحقق من صحة البيانات المدخلة.',
        [ErrorTypes.AUTHENTICATION_ERROR]: 'يرجى تسجيل الدخول للمتابعة.',
        [ErrorTypes.AUTHORIZATION_ERROR]: 'ليس لديك صلاحية للوصول إلى هذا المحتوى.',
        [ErrorTypes.SERVER_ERROR]: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
        [ErrorTypes.FILE_UPLOAD_ERROR]: 'فشل في رفع الملف. يرجى التأكد من نوع وحجم الملف.',
        [ErrorTypes.AUDIO_PLAYBACK_ERROR]: 'خطأ في تشغيل الملف الصوتي. يرجى المحاولة مرة أخرى.',
        [ErrorTypes.API_ERROR]: 'خطأ في الاتصال بالخدمة. يرجى المحاولة مرة أخرى.'
    };

    // If error has a custom Arabic message, use it
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    // Check for specific HTTP status codes
    if (error?.response?.status) {
        switch (error.response.status) {
            case 400:
                return 'طلب غير صحيح. يرجى التحقق من البيانات المدخلة.';
            case 401:
                return 'يرجى تسجيل الدخول للمتابعة.';
            case 403:
                return 'ليس لديك صلاحية للوصول إلى هذا المحتوى.';
            case 404:
                return 'المحتوى المطلوب غير موجود.';
            case 409:
                return 'تعارض في البيانات. قد يكون المحتوى موجود مسبقاً.';
            case 413:
                return 'حجم الملف كبير جداً. يرجى اختيار ملف أصغر.';
            case 415:
                return 'نوع الملف غير مدعوم. يرجى اختيار ملف صوتي صحيح.';
            case 429:
                return 'تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.';
            case 500:
                return 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
            case 502:
                return 'الخدمة غير متاحة مؤقتاً. يرجى المحاولة لاحقاً.';
            case 503:
                return 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً.';
            default:
                return defaultMessages[type] || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
        }
    }

    // Check for network errors
    if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error') {
        return defaultMessages[ErrorTypes.NETWORK_ERROR];
    }

    // Return type-specific message or generic message
    return defaultMessages[type] || error?.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
};

export const handleApiError = (error, showToast) => {
    console.error('API Error:', error);
    
    let errorType = ErrorTypes.API_ERROR;
    
    if (error?.response?.status >= 500) {
        errorType = ErrorTypes.SERVER_ERROR;
    } else if (error?.response?.status === 401) {
        errorType = ErrorTypes.AUTHENTICATION_ERROR;
    } else if (error?.response?.status === 403) {
        errorType = ErrorTypes.AUTHORIZATION_ERROR;
    } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
        errorType = ErrorTypes.VALIDATION_ERROR;
    } else if (error?.code === 'NETWORK_ERROR') {
        errorType = ErrorTypes.NETWORK_ERROR;
    }

    const message = getErrorMessage(error, errorType);
    
    if (showToast) {
        showToast(message, 'error');
    }
    
    return { type: errorType, message };
};

export const handleFileUploadError = (error, showToast) => {
    console.error('File Upload Error:', error);
    
    let message = 'فشل في رفع الملف. يرجى المحاولة مرة أخرى.';
    
    if (error?.response?.status === 413) {
        message = 'حجم الملف كبير جداً. الحد الأقصى المسموح هو 50 ميجابايت.';
    } else if (error?.response?.status === 415) {
        message = 'نوع الملف غير مدعوم. يرجى اختيار ملف صوتي (MP3, WAV, M4A).';
    } else if (error?.response?.data?.message) {
        message = error.response.data.message;
    }
    
    if (showToast) {
        showToast(message, 'error');
    }
    
    return { type: ErrorTypes.FILE_UPLOAD_ERROR, message };
};

export const handleAudioError = (error, showToast) => {
    console.error('Audio Error:', error);
    
    let message = 'خطأ في تشغيل الملف الصوتي. يرجى المحاولة مرة أخرى.';
    
    if (error?.target?.error?.code) {
        switch (error.target.error.code) {
            case 1: // MEDIA_ERR_ABORTED
                message = 'تم إلغاء تشغيل الملف الصوتي.';
                break;
            case 2: // MEDIA_ERR_NETWORK
                message = 'خطأ في الشبكة أثناء تحميل الملف الصوتي.';
                break;
            case 3: // MEDIA_ERR_DECODE
                message = 'الملف الصوتي تالف أو غير مدعوم.';
                break;
            case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
                message = 'تنسيق الملف الصوتي غير مدعوم.';
                break;
            default:
                message = 'خطأ غير معروف في تشغيل الملف الصوتي.';
        }
    }
    
    if (showToast) {
        showToast(message, 'error');
    }
    
    return { type: ErrorTypes.AUDIO_PLAYBACK_ERROR, message };
};

export const validateFormData = (data, rules) => {
    const errors = {};
    
    for (const [field, rule] of Object.entries(rules)) {
        const value = data[field];
        
        if (rule.required && (!value || value.toString().trim() === '')) {
            errors[field] = rule.message || `حقل ${field} مطلوب.`;
            continue;
        }
        
        if (value && rule.minLength && value.toString().length < rule.minLength) {
            errors[field] = rule.message || `يجب أن يكون ${field} على الأقل ${rule.minLength} أحرف.`;
            continue;
        }
        
        if (value && rule.maxLength && value.toString().length > rule.maxLength) {
            errors[field] = rule.message || `يجب أن لا يتجاوز ${field} ${rule.maxLength} حرف.`;
            continue;
        }
        
        if (value && rule.pattern && !rule.pattern.test(value)) {
            errors[field] = rule.message || `تنسيق ${field} غير صحيح.`;
            continue;
        }
        
        if (value && rule.min && Number(value) < rule.min) {
            errors[field] = rule.message || `يجب أن يكون ${field} على الأقل ${rule.min}.`;
            continue;
        }
        
        if (value && rule.max && Number(value) > rule.max) {
            errors[field] = rule.message || `يجب أن لا يتجاوز ${field} ${rule.max}.`;
            continue;
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const getSuccessMessage = (action, item = '') => {
    const messages = {
        create: `تم إنشاء ${item} بنجاح! ✨`,
        update: `تم تحديث ${item} بنجاح! 🎉`,
        delete: `تم حذف ${item} بنجاح! 🗑️`,
        upload: `تم رفع ${item} بنجاح! 📤`,
        save: `تم حفظ ${item} بنجاح! 💾`,
        login: 'تم تسجيل الدخول بنجاح! 🎊',
        logout: 'تم تسجيل الخروج بنجاح! 👋',
        copy: 'تم نسخ الرابط بنجاح! 📋',
        download: 'بدأ التحميل بنجاح! ⬇️'
    };
    
    return messages[action] || 'تمت العملية بنجاح! ✅';
};
