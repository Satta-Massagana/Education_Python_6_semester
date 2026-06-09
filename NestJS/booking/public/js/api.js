/**
 * Модуль для взаимодействия с REST API NestJS.
 */

const API = {
    baseUrl: '/api',

    getToken() {
        return localStorage.getItem('access_token');
    },

    setTokens(access, refresh) {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    },

    clearTokens() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

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
            throw new Error(this._extractError(data));
        }

        return data;
    },

    _extractError(data) {
        if (typeof data === 'string') return data;
        if (data.message) {
            return Array.isArray(data.message)
                ? data.message.join(', ')
                : data.message;
        }
        return 'Произошла ошибка';
    },

    register(payload) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async login(username, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        this.setTokens(data.access, data.refresh);
        return data;
    },

    getProfile() {
        return this.request('/auth/profile');
    },

    getWorkshops() {
        return this.request('/workshops');
    },

    createWorkshop(payload) {
        return this.request('/workshops', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    updateWorkshop(id, payload) {
        return this.request(`/workshops/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },

    deleteWorkshop(id) {
        return this.request(`/workshops/${id}`, { method: 'DELETE' });
    },

    getBookings() {
        return this.request('/bookings');
    },

    createBooking(workshopId) {
        return this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify({ workshop_id: workshopId }),
        });
    },

    cancelBooking(id) {
        return this.request(`/bookings/${id}`, { method: 'DELETE' });
    },
};
