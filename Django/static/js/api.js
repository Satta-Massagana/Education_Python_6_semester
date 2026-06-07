/**
 * Модуль для взаимодействия с REST API.
 * Инкапсулирует HTTP-запросы и управление JWT-токеном.
 */

const API = {
    /** Базовый URL API */
    baseUrl: '/api',

    /**
     * Получение access-токена из localStorage.
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('access_token');
    },

    /**
     * Сохранение JWT-токенов в localStorage.
     * @param {string} access - access token
     * @param {string} refresh - refresh token
     */
    setTokens(access, refresh) {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    },

    /** Удаление токенов при выходе */
    clearTokens() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
    },

    /**
     * Универсальный HTTP-запрос к API.
     * @param {string} endpoint - путь эндпоинта
     * @param {object} options - параметры fetch
     * @returns {Promise<object>}
     */
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 204) {
            return null;
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message = this._extractError(data);
            throw new Error(message);
        }

        return data;
    },

    /**
     * Извлечение текста ошибки из ответа API.
     * @param {object} data - тело ответа
     * @returns {string}
     */
    _extractError(data) {
        if (typeof data === 'string') return data;
        if (data.detail) return data.detail;
        if (data.non_field_errors) return data.non_field_errors.join(', ');

        const messages = [];
        for (const [key, value] of Object.entries(data)) {
            if (Array.isArray(value)) {
                messages.push(`${key}: ${value.join(', ')}`);
            } else {
                messages.push(`${key}: ${value}`);
            }
        }
        return messages.join('; ') || 'Произошла ошибка';
    },

    /** Регистрация пользователя */
    register(payload) {
        return this.request('/auth/register/', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    /** Авторизация и получение токена */
    async login(username, password) {
        const data = await this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        this.setTokens(data.access, data.refresh);
        return data;
    },

    /** Получение профиля текущего пользователя */
    getProfile() {
        return this.request('/auth/profile/');
    },

    /** Список мастер-классов */
    getWorkshops() {
        return this.request('/workshops/');
    },

    /** Создание мастер-класса (админ) */
    createWorkshop(payload) {
        return this.request('/workshops/', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    /** Обновление мастер-класса (админ) */
    updateWorkshop(id, payload) {
        return this.request(`/workshops/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },

    /** Удаление мастер-класса (админ) */
    deleteWorkshop(id) {
        return this.request(`/workshops/${id}/`, { method: 'DELETE' });
    },

    /** Список своих бронирований */
    getBookings() {
        return this.request('/bookings/');
    },

    /** Создание бронирования */
    createBooking(workshopId) {
        return this.request('/bookings/', {
            method: 'POST',
            body: JSON.stringify({ workshop_id: workshopId }),
        });
    },

    /** Отмена бронирования */
    cancelBooking(id) {
        return this.request(`/bookings/${id}/`, { method: 'DELETE' });
    },
};
