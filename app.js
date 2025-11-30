// --- Ustawienia ---
// !!! WAŻNE: Wklej tutaj swój adres URL wdrożonego Apps Script !!!
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwsMW-wiQSSpNm2IBh77eUJbl5tkz1sIFspwjnLO8pbXuif4xleLqnmLWID85wOl_7lSw/exec'; 

// --- Schłodzenie Statyczne (Wspólne dla każdego dnia) ---
const COOLDOWN_DETAILS = [
    "Rozciąganie czworogłowych (stojąc, pięta do pośladka) - 30s/noga",
    "Rozciąganie dwugłowych (skłon w przód) - 30s",
    "Pozycja gołębia (na pośladki) - 30s/noga",
    "Rozciąganie klatki piersiowej (przy ścianie) - 30s/strona",
    "Koci grzbiet / Krowa - 1 min",
    "Pozycja dziecka - 1 min (relaks)"
];

// --- Dane Treningowe ---
const WEEKLY_PLAN = {
    "MON": [
        { 
            name: "Rozgrzewka", 
            sets: 1, 
            reps: "5-10 min", 
            isDataEntry: false, 
            details: ["Bieżnia/Orbitrek - 5 min", "Krążenia ramion", "Wymachy nóg", "Przysiady z własnym ciężarem x 15", "Deska (Plank) - 30s"] 
        },
        { 
            name: "Hip Thrusty", 
            sets: 4, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/s-iR9j5Jt_g",
            tip: "Przytrzymaj napięcie pośladków w górze przez 1-2 sekundy. Nie wyginaj odcinka lędźwiowego!" 
        }, 
        { 
            name: "Hamstring Curls (maszyna)", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/O8s87E60c_U",
            tip: "Kontroluj ruch powrotny, nie puszczaj ciężaru gwałtownie." 
        }, 
        { 
            name: "Przysiady ze skokiem", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/XlK4n44e6jU" 
        }, 
        { name: "Schodki", sets: 1, reps: "15 min", isDataEntry: false },
    ],
    "TUES": [{ name: "Odpoczynek", sets: 0, reps: "Full Day Off", isDataEntry: false }],
    "WED": [
        { 
            name: "Rozgrzewka", 
            sets: 1, 
            reps: "5-10 min", 
            isDataEntry: false, 
            details: ["Wioślarz - 5 min", "Rozgrzewka stożków rotatorów (gumy)", "Pompki damskie x 10"] 
        },
        { 
            name: "Drążek do cycków (maszyna)", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/G5k-xWq-9a8",
            tip: "Ściągaj łopatki w dół i do siebie. Nie unoś barków do uszu." 
        }, 
        { 
            name: "Wyciskanie barki", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/B-aVd-exU9o",
            tip: "Łokcie prowadź lekko przed tułowiem, nie w jednej linii z barkami."
        }, 
        { 
            name: "Bent-Over Row (podparcie na pieska)", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/rP1jG66e9iU",
            tip: "Plecy proste! Ruch inicjuj łopatką, nie samą ręką."
        }, 
        { 
            name: "Prostowanie przedramion (maszyna)", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/tM1lV4kGv9Y" 
        }, 
        { name: "Rozpiętki", sets: 1, reps: "5 min", isDataEntry: false },
        { name: "Bieżnia pod górkę", sets: 1, reps: "20 min", isDataEntry: false },
    ],
    "THU": [{ name: "Odpoczynek", sets: 0, reps: "Full Day Off", isDataEntry: false }],
    "FRI": [
        { 
            name: "Full Wszystko (Rozgrzewka)", 
            sets: 1, 
            reps: "5-10 min", 
            isDataEntry: false, 
            details: ["Ogólnorozwojowa: pajacyki, skręty tułowia, wymachy - 5 min"]
        },
        { 
            name: "RDL", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/Q0P9iQf7D1Q",
            tip: "Pamiętaj o prostych plecach! Ruch wychodzi z biodra (wypychasz pupę do tyłu)."
        }, 
        { 
            name: "Chest Press (maszyna)", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/Y0rQ1J6lK08" 
        }, 
        { 
            name: "Wiosłowanie na wyciągu", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/j3ftE2Jd74Y" 
        }, 
        { 
            name: "Zakroki w tył", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/7XjF0rYwO3w",
            tip: "Kolano przedniej nogi nie powinno uciekać do środka." 
        }, 
        { name: "Wznosy ramion w bok", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/39YwW1k31uM" }, 
        { name: "Wypychanie nóg na maszynie", sets: 3, reps: "8-12", isDataEntry: true, link: "https://www.youtube.com/embed/n4sL-B09W2w" }, 
        { name: "Schodki", sets: 1, reps: "15 min", isDataEntry: false },
    ],
    "SAT": [{ name: "Aktywny Wypoczynek", sets: 0, reps: "Spacer/Yoga", isDataEntry: false }],
    "SUN": [{ name: "Odpoczynek", sets: 0, reps: "Rest", isDataEntry: false }],
};

let currentUser = null; 
let currentDayKey = new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase(); 
const todayDate = new Date().toLocaleDateString('pl-PL'); 
let unsavedChanges = false;

// --- 1. RENDEROWANIE PLANU ---
function renderWorkout(dayKey) {
    const trainingContent = document.getElementById('training-content');
    const todayWorkout = WEEKLY_PLAN[dayKey] || [];
    
    // Zresetowanie flagi zmian przy nowym renderowaniu
    unsavedChanges = false;
    
    if(todayWorkout.length === 0) {
        trainingContent.innerHTML = "<p>Brak planu na ten dzień.</p>";
        return;
    }

    let html = '<table><tbody>';
    todayWorkout.forEach((exercise, index) => {
        html += `<tr data-exercise-id="${index}">
            <td class="ex-name">`;
        
        // 1. Nazwa Ćwiczenia (Klikalna jeśli ma wideo lub szczegóły)
        let nameClass = "";
        let dataAttrs = "";
        let icon = "";

        if (exercise.details) {
            // Dla Rozgrzewki (tekst)
            nameClass = "clickable-ex-name";
            dataAttrs = `data-type="details" data-title="${exercise.name}"`;
            icon = ' <span class="info-icon">📋</span>';
        } else if (exercise.link) {
            // Dla Wideo
            nameClass = "clickable-ex-name";
            dataAttrs = `data-type="video" data-link="${exercise.link}" data-title="${exercise.name}"`;
            icon = ' <span class="info-icon">▶️</span>';
        }

        html += `<span class="${nameClass}" ${dataAttrs}>${exercise.name}${icon}</span>`;

        // 2. Wykrzyknik (Tip)
        if (exercise.tip) {
             html += `<span class="tip-icon" data-tip="${exercise.tip}" title="Uwagi">!</span>`;
        }

        html += `</td>
            <td class="ex-sets">${exercise.sets} x ${exercise.reps}</td>`;

        if (exercise.isDataEntry) {
            html += `<td class="input-cell">
                <input type="number" class="weight-input" placeholder="kg" data-ex-name="${exercise.name}" data-sets="${exercise.sets}">
            </td>
            <td class="input-cell">
                <input type="number" class="reps-input" placeholder="powt." data-ex-name="${exercise.name}" data-sets="${exercise.sets}">
            </td>`;
        } else {
            html += `<td colspan="2" class="no-data-cell"></td>`;
        }
        html += `</tr>`;
    });
    html += '</tbody></table>';

    trainingContent.innerHTML = html;
    document.getElementById('save-button').disabled = false;

    // Nasłuchiwanie zmian w inputach (do flagi unsavedChanges)
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => { unsavedChanges = true; });
    });
}

// --- 2. RENDEROWANIE WIDOKU TYGODNIA ---
function renderWeekView() {
    const weekContainer = document.getElementById('week-content');
    let html = '';
    
    const daysOrder = ["MON", "TUES", "WED", "THU", "FRI", "SAT", "SUN"];
    
    daysOrder.forEach(day => {
        const exercises = WEEKLY_PLAN[day];
        html += `<div class="week-day-card">
            <h4>${day}</h4>`;
        
        if (exercises && exercises.length > 0) {
            html += `<ul>`;
            exercises.forEach(ex => {
                html += `<li>${ex.name} (${ex.sets}x${ex.reps})</li>`;
            });
            html += `</ul>`;
        } else {
            html += `<p>Odpoczynek</p>`;
        }
        html += `</div>`;
    });
    
    weekContainer.innerHTML = html;
}

// --- 3. NAWIGACJA I UI ---
const userSelection = document.getElementById('user-selection');
const workoutSchedule = document.getElementById('workout-schedule');
const weekView = document.getElementById('week-view');
const daySelect = document.getElementById('day-select');

// Wypełnienie Selectora Dni
function initDaySelector() {
    const days = ["MON", "TUES", "WED", "THU", "FRI", "SAT", "SUN"];
    daySelect.innerHTML = "";
    days.forEach(day => {
        const option = document.createElement('option');
        option.value = day;
        option.text = day;
        if(day === currentDayKey) option.selected = true;
        daySelect.appendChild(option);
    });
}

// Zmiana Dnia w Selectorze
daySelect.addEventListener('change', (e) => {
    if(unsavedChanges) {
        if(!confirm("Masz niezapisane dane w obecnym dniu. Czy na pewno chcesz zmienić dzień? Utracisz wpisane liczby.")) {
             e.target.value = currentDayKey; // Cofnij wybór
             return;
        }
    }
    currentDayKey = e.target.value;
    renderWorkout(currentDayKey);
});

// Wybór Użytkownika
document.querySelectorAll('.user-button').forEach(button => {
    button.addEventListener('click', (e) => {
        currentUser = e.target.getAttribute('data-user');
        
        userSelection.classList.add('hidden');
        workoutSchedule.classList.remove('hidden');
        document.getElementById('current-user-display').textContent = currentUser;
        
        initDaySelector();
        renderWorkout(currentDayKey);
    });
});

// Powrót z Treningu
document.getElementById('back-from-workout').addEventListener('click', () => {
    if(unsavedChanges) {
        if(!confirm("Masz niezapisane zmiany! Czy na pewno chcesz wyjść bez zapisywania?")) return;
    }
    unsavedChanges = false;
    workoutSchedule.classList.add('hidden');
    userSelection.classList.remove('hidden');
});

// Otwarcie Widoku Tygodnia
document.getElementById('view-week-btn').addEventListener('click', () => {
    renderWeekView();
    userSelection.classList.add('hidden');
    weekView.classList.remove('hidden');
});

// Powrót z Widoku Tygodnia
document.getElementById('back-from-week').addEventListener('click', () => {
    weekView.classList.add('hidden');
    userSelection.classList.remove('hidden');
});


// --- 4. ZAPIS DANYCH ---
document.getElementById('save-button').addEventListener('click', async () => {
    
    if (GAS_URL.includes('YOUR_APPS_SCRIPT')) {
        alert("BŁĄD: Nie ustawiłeś adresu GAS_URL w pliku app.js!");
        return;
    }
    
    const trainingContent = document.getElementById('training-content');
    const weightInputs = trainingContent.querySelectorAll('.weight-input');
    
    let dataToSave = [];
    
    weightInputs.forEach(input => {
        const exName = input.getAttribute('data-ex-name');
        const repsInput = trainingContent.querySelector(`.reps-input[data-ex-name="${exName}"]`);
        
        if (input.value && repsInput.value) {
            dataToSave.push({
                input: input,
                repsInput: repsInput,
                name: exName,
                sets: input.getAttribute('data-sets')
            });
        }
    });

    if (dataToSave.length === 0) {
        alert("Wypełnij przynajmniej jedno ćwiczenie, aby zapisać.");
        return;
    }

    const saveButton = document.getElementById('save-button');
    saveButton.textContent = "Zapisywanie...";
    saveButton.disabled = true;

    let successCount = 0;
    
    for (const item of dataToSave) {
        const seriesData = {
            Uzytkownik: currentUser,
            DataTreningu: todayDate,
            DzienTygodnia: currentDayKey, // Zapisujemy wybrany dzień, niekoniecznie dzisiejszy
            Cwiczenie: item.name,
            Seria: item.sets, 
            Obciazenie: item.input.value,
            Powtorzenia: item.repsInput.value
        };

        const formData = new FormData();
        for (const key in seriesData) {
            formData.append(key, seriesData[key]);
        }
        
        try {
            await fetch(GAS_URL, { method: 'POST', body: formData });
            successCount++;
            item.input.style.borderColor = "green";
            item.repsInput.style.borderColor = "green";
        } catch (error) {
            console.error("Błąd zapisu:", error);
        }
    }
    
    saveButton.textContent = `Zapisano ${successCount} ćwiczeń! ✅`;
    unsavedChanges = false; // Reset flagi po zapisie
    setTimeout(() => {
        saveButton.textContent = "Zapisz Dzień Treningowy";
        saveButton.disabled = false;
    }, 3000);
});


// --- 5. MODAL (OBSŁUGA WSZYSTKIEGO) ---
const modal = document.getElementById('instructionModal');
const closeModalButton = document.querySelector('.close-button');
const modalBody = document.getElementById('modal-body');
const modalTitle = document.getElementById('modal-title');

function showModal(title, contentHtml) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
    modalBody.innerHTML = '<p>Ładowanie...</p>';
}

closeModalButton.addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// GLOBALNY LISTENER KLIKNIĘĆ
document.addEventListener('click', (e) => {
    
    // 1. Obsługa Wideo i Szczegółów (kliknięcie w nazwę)
    const nameTarget = e.target.closest('.clickable-ex-name');
    if (nameTarget) {
        const type = nameTarget.getAttribute('data-type');
        const title = nameTarget.getAttribute('data-title');
        
        if (type === 'video') {
            const link = nameTarget.getAttribute('data-link');
            showModal(title, `<iframe src="${link}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen referrerpolicy="no-referrer"></iframe>`);
        } else if (type === 'details') {
            // Znajdź szczegóły w tablicy
            const exercises = WEEKLY_PLAN[currentDayKey];
            const exData = exercises.find(ex => ex.name === title);
            if(exData && exData.details) {
                let listHtml = '<ul style="text-align:left;">';
                exData.details.forEach(item => listHtml += `<li>${item}</li>`);
                listHtml += '</ul>';
                showModal(title, listHtml);
            }
        }
    }

    // 2. Obsługa Wykrzyknika (Tip)
    const tipTarget = e.target.closest('.tip-icon');
    if (tipTarget) {
        const tipText = tipTarget.getAttribute('data-tip');
        showModal("Wskazówka Treningowa", `<p style="font-size: 1.1rem; color: #333;">${tipText}</p>`);
    }

    // 3. Obsługa Schłodzenia (Kliknięcie w napis)
    const cooldownTarget = e.target.closest('.clickable-details');
    if (cooldownTarget && cooldownTarget.getAttribute('data-type') === 'cooldown') {
        let listHtml = '<ul style="text-align:left;">';
        COOLDOWN_DETAILS.forEach(item => listHtml += `<li>${item}</li>`);
        listHtml += '</ul>';
        showModal("Schłodzenie Statyczne", listHtml);
    }
});


// --- DODATKOWE STYLE JS (Dla Tabeli) ---
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Style dla tabeli generowane przez JS */
        #training-content table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 0.95rem;
            text-align: left;
        }
        #training-content td {
            padding: 12px 8px;
            border-bottom: 1px solid #eee;
            vertical-align: middle;
        }
        .ex-name { font-weight: 600; width: 45%; }
        .ex-sets { color: var(--color-accent); width: 15%; font-size: 0.85rem; text-align: center; }
        .input-cell { width: 20%; text-align: center; }
        .input-cell input {
            width: 80%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 6px;
            text-align: center;
        }
        .clickable-ex-name {
            cursor: pointer;
            border-bottom: 1px dotted var(--color-primary);
            transition: color 0.2s;
            display: inline-block;
        }
        .clickable-ex-name:hover { color: var(--color-accent); border-bottom-style: solid; }
    `;
    document.head.appendChild(style);
});