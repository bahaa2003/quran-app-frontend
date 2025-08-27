// frontend/src/services/quranApi.js
import axios from 'axios';

const QURAN_API_BASE = 'https://api.alquran.cloud/v1';

export const quranApi = {
    // Get surah by number
    getSurah: async (surahNumber, edition = 'ar.alafasy') => {
        try {
            const response = await axios.get(`${QURAN_API_BASE}/surah/${surahNumber}/${edition}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching surah:', error);
            throw error;
        }
    },

    // Get specific ayahs from a surah
    getAyahs: async (surahNumber, fromAyah, toAyah, edition = 'ar.alafasy') => {
        try {
            const response = await axios.get(`${QURAN_API_BASE}/surah/${surahNumber}/${edition}`);
            const surahData = response.data.data;
            
            // Filter ayahs based on range
            const filteredAyahs = surahData.ayahs.filter(ayah => 
                ayah.numberInSurah >= fromAyah && ayah.numberInSurah <= toAyah
            );
            
            return {
                ...surahData,
                ayahs: filteredAyahs
            };
        } catch (error) {
            console.error('Error fetching ayahs:', error);
            throw error;
        }
    },

    // Get surah info (name, number, etc.)
    getSurahInfo: async (surahNumber) => {
        try {
            const response = await axios.get(`${QURAN_API_BASE}/surah/${surahNumber}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching surah info:', error);
            throw error;
        }
    },

    // Get all surahs list
    getAllSurahs: async () => {
        try {
            const response = await axios.get(`${QURAN_API_BASE}/surah`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching surahs list:', error);
            throw error;
        }
    }
};
