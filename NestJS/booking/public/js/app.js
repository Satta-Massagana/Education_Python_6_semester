/**
 * Основная логика веб-клиента Workshop Booking System.
 */

const App = {
    user: null,

    async init() {
        this._bindEvents();
        await this._checkAuth();
        await this.loadWorkshops();
    },

    _bindEvents() {
        document.getElementById('btn-show-login').addEventListener('click', () => {
            this._toggleSection('section-login');
        });
        document.getElementById('btn-show-register').addEventListener('click', () => {
            this._toggleSection('section-register');
        });
        document.getElementById('btn-logout').addEventListener('click', () => this.logout());
        document.getElementById('btn-refresh-workshops').addEventListener('click', () => {
            this.loadWorkshops();
        });
        document.getElementById('form-login').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login(new FormData(e.target));
        });
        document.getElementById('form-register').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register(new FormData(e.target));
        });
        document.getElementById('form-workshop').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveWorkshop(new FormData(e.target));
        });
        document.getElementById('btn-cancel-edit').addEventListener('click', () => {
            this._resetWorkshopForm();
        });
    },

    async _checkAuth() {
        if (!API.getToken()) {
            this._showGuestUI();
            return;
        }
        try {
            this.user = await API.getProfile();
            this._showUserUI();
            await this.loadBookings();
        } catch {
            API.clearTokens();
            this._showGuestUI();
        }
    },

    _showGuestUI() {
        document.getElementById('nav-auth').classList.remove('hidden');
        document.getElementById('nav-user').classList.add('hidden');
        document.getElementById('section-bookings').classList.add('hidden');
        document.getElementById('section-admin').classList.add('hidden');
    },

    _showUserUI() {
        document.getElementById('nav-auth').classList.add('hidden');
        document.getElementById('nav-user').classList.remove('hidden');
        document.getElementById('section-bookings').classList.remove('hidden');
        document.getElementById('section-login').classList.add('hidden');
        document.getElementById('section-register').classList.add('hidden');

        const roleLabel = this.user.role === 'admin' ? ' (админ)' : '';
        document.getElementById('user-info').textContent =
            `${this.user.username}${roleLabel}`;

        if (this.user.role === 'admin') {
            document.getElementById('section-admin').classList.remove('hidden');
        } else {
            document.getElementById('section-admin').classList.add('hidden');
        }
    },

    _toggleSection(sectionId) {
        ['section-login', 'section-register'].forEach((id) => {
            document.getElementById(id).classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');
    },

    showAlert(message, type = 'error') {
        const alert = document.getElementById('alert');
        alert.textContent = message;
        alert.className = `alert ${type}`;
        alert.classList.remove('hidden');
        setTimeout(() => alert.classList.add('hidden'), 5000);
    },

    setLoading(isLoading) {
        document.getElementById('loader').classList.toggle('hidden', !isLoading);
    },

    async register(formData) {
        this.setLoading(true);
        try {
            const payload = Object.fromEntries(formData);
            await API.register(payload);
            this.showAlert('Регистрация успешна! Войдите в систему.', 'success');
            document.getElementById('section-register').classList.add('hidden');
            document.getElementById('section-login').classList.remove('hidden');
        } catch (err) {
            this.showAlert(err.message);
        } finally {
            this.setLoading(false);
        }
    },

    async login(formData) {
        this.setLoading(true);
        try {
            await API.login(formData.get('username'), formData.get('password'));
            this.user = await API.getProfile();
            this._showUserUI();
            document.getElementById('section-login').classList.add('hidden');
            this.showAlert('Вход выполнен успешно!', 'success');
            await this.loadBookings();
            await this.loadWorkshops();
        } catch (err) {
            this.showAlert(err.message);
        } finally {
            this.setLoading(false);
        }
    },

    logout() {
        API.clearTokens();
        this.user = null;
        this._showGuestUI();
        document.getElementById('bookings-list').innerHTML = '';
        this.showAlert('Вы вышли из системы.', 'success');
    },

    async loadWorkshops() {
        this.setLoading(true);
        try {
            const workshops = await API.getWorkshops();
            this._renderWorkshops(workshops);
        } catch (err) {
            this.showAlert(err.message);
        } finally {
            this.setLoading(false);
        }
    },

    _renderWorkshops(workshops) {
        const container = document.getElementById('workshops-list');
        if (!workshops.length) {
            container.innerHTML = '<p>Нет доступных мастер-классов.</p>';
            return;
        }

        container.innerHTML = workshops.map((w) => {
            const badge = w.is_full
                ? '<span class="badge full">Мест нет</span>'
                : `<span class="badge available">Свободно: ${w.available_seats}</span>`;
            const date = new Date(w.date).toLocaleString('ru-RU');

            let actions = '';
            if (this.user && this.user.role !== 'admin') {
                actions = `<button onclick="App.bookWorkshop(${w.id})"
                    ${w.is_full ? 'disabled' : ''}>Записаться</button>`;
            }
            if (this.user && this.user.role === 'admin') {
                actions = `
                    <button onclick="App.editWorkshop(${w.id})">Редактировать</button>
                    <button class="danger" onclick="App.removeWorkshop(${w.id})">Удалить</button>`;
            }

            return `
                <div class="workshop-item" data-id="${w.id}">
                    <h3>${w.title}</h3>
                    <p>${w.description}</p>
                    <div class="workshop-meta">
                        <div>Дата: ${date}</div>
                        <div>Вместимость: ${w.capacity} | ${badge}</div>
                    </div>
                    <div class="workshop-actions">${actions}</div>
                </div>`;
        }).join('');
    },

    async bookWorkshop(workshopId) {
        this.setLoading(true);
        try {
            await API.createBooking(workshopId);
            this.showAlert('Вы успешно записались!', 'success');
            await this.loadBookings();
            await this.loadWorkshops();
        } catch (err) {
            this.showAlert(err.message);
        } finally {
            this.setLoading(false);
        }
    },

    async loadBookings() {
        if (!this.user) return;
        this.setLoading(true);
        try {
            const bookings = await API.getBookings();
            this._renderBookings(bookings);
        } catch (err) {
            this.showAlert(err.message);
        } finally {
            this.setLoading(false);
        }
    },

    _renderBookings(bookings) {
        const container = document.getElementById('bookings-list');
        if (!bookings.length) {
            container.innerHTML = '<p>У вас пока нет бронирований.</p>';
            return;
        }

        container.innerHTML = bookings.map((b) => {
            const date = new Date(b.workshop.date).toLocaleString('ru-RU');
            return `
                <div class="booking-item">
                    <h3>${b.workshop.title}</h3>
                    <div class="workshop-meta">Дата: ${date}</div>
                    <button class="danger" onclick="App.cancelBooking(${b.id})">
                        Отменить
                    </button>
                </div>`;
        }).join('');
    },

    async cancelBooking(id) {
        this.setLoading(true);
        try {
            await API.cancelBooking(id);
            this.showAlert('Бронирование отменено.', 'success');
            await this.loadBookings();
            await this.loadWorkshops();
        } catch (err) {
            this.showAlert(err.message);
        } finally {
            this.setLoading(false);
        }
    },

    async saveWorkshop(formData) {
        this.setLoading(true);
        const payload = {
            title: formData.get('title'),
            description: formData.get('description'),
            date: new Date(formData.get('date')).toISOString(),
            capacity: parseInt(formData.get('capacity'), 10),
        };
        const workshopId = formData.get('workshop_id');

        try {
            if (workshopId) {
                await API.updateWorkshop(workshopId, payload);
                this.showAlert('Мастер-класс обновлён.', 'success');
            } else {
                await API.createWorkshop(payload);
                this.showAlert('Мастер-класс создан.', 'success');
            }
            this._resetWorkshopForm();
            await this.loadWorkshops();
        } catch (err) {
            this.showAlert(err.message);
        } finally {
            this.setLoading(false);
        }
    },

    async editWorkshop(id) {
        this.setLoading(true);
        try {
            const workshops = await API.getWorkshops();
            const workshop = workshops.find((w) => w.id === id);
            if (!workshop) return;

            const form = document.getElementById('form-workshop');
            form.querySelector('[name="workshop_id"]').value = id;
            form.querySelector('[name="title"]').value = workshop.title;
            form.querySelector('[name="description"]').value = workshop.description;
            form.querySelector('[name="capacity"]').value = workshop.capacity;

            const date = new Date(workshop.date);
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            form.querySelector('[name="date"]').value = date.toISOString().slice(0, 16);

            document.getElementById('btn-save-workshop').textContent = 'Сохранить';
            document.getElementById('btn-cancel-edit').classList.remove('hidden');
        } catch (err) {
            this.showAlert(err.message);
        } finally {
            this.setLoading(false);
        }
    },

    async removeWorkshop(id) {
        if (!confirm('Удалить мастер-класс?')) return;
        this.setLoading(true);
        try {
            await API.deleteWorkshop(id);
            this.showAlert('Мастер-класс удалён.', 'success');
            await this.loadWorkshops();
        } catch (err) {
            this.showAlert(err.message);
        } finally {
            this.setLoading(false);
        }
    },

    _resetWorkshopForm() {
        const form = document.getElementById('form-workshop');
        form.reset();
        form.querySelector('[name="workshop_id"]').value = '';
        document.getElementById('btn-save-workshop').textContent = 'Создать';
        document.getElementById('btn-cancel-edit').classList.add('hidden');
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());
