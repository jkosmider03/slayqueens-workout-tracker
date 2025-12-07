// --- Ustawienia ---
// !!! WAŻNE: Wklej tutaj swój adres URL wdrożonego Apps Script !!!
// Jeśli nie działa, sprawdź, czy w linku nie ma znaków Unicode/spacji.
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
            details: ["Bieżnia - 10 min", "Kręcenie stawów stopy", "Wymachy nóg", "Przed każdym ćwiczeniem seria rozgrzewkowa"] 
        },
        { 
            name: "Hip Thrusty", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/9vK4GVohtHE?si=w3_zwDmDIqlUwfQu",
            tip: "Przytrzymaj napięcie pośladków w górze przez 1-2 sekundy. Nie wyginaj odcinka lędźwiowego! Patrz prosto przed siebie lub na lekko uniesiony sufit (nie zginaj szyi), utrzymuj brodę lekko schowaną. W górnej fazie mocno ściskaj pośladki, a w dolnej nie kładź sztangi na podłodze, tylko kontroluj ruch." 
        }, 
        { 
            name: "Suwnica", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/O8s87E60c_U",
            tip: "Nie blokuj kolan w górnej fazie ruchu, utrzymuj je lekko ugięte. Upewnij się, że Twoje pośladki nie odrywają się od siedziska, aby uniknąć nadmiernego zaokrąglenia lędźwiowego odcinka kręgosłupa." 
        }, 
        { 
            name: "Leg Extensions", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/XlK4n44e6jU",
            tip: "Wykonaj ruch powoli i kontroluj go, szczególnie w fazie opuszczania ciężaru. W górnej fazie przytrzymaj skurcz mięśnia czworogłowego na 1-2 sekundy. Upewnij się, że kolana są ustawione zgodnie z osią obrotu maszyny."
        }, 
        { 
            name: "Maszyna do łydek", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/XlK4n44e6jU",
            tip: "Opuść pięty jak najniżej, aby poczuć rozciąganie łydek, a następnie wypchnij się mocno do góry, spinając łydki. Przytrzymaj napięcie na sekundę."
        }, 
        { 
            name: "Wspięcia na palcach", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/XlK4n44e6jU",
            tip: "Uważaj na tempo i kontrolę.Kluczowy jest pełny zakres i kontrola fazy negatywnej (opuszczania). Możesz stanąć na podwyższeniu, aby zwiększyć rozciągnięcie."
        }, 
        { 
            name: "Deska", 
            sets: 3, 
            reps: "Limit", 
            isDataEntry: true 
        } 
    ],
    "TUES": [{ name: "Cardio", sets: 1, reps: "30 min - 1 h", isDataEntry: false }],
    "WED": [
        { 
            name: "Rozgrzewka", 
            sets: 1, 
            reps: "5-10 min", 
            isDataEntry: false, 
            details: ["Bieżnia - 10 min", "Wymachy rąk", "Przed każdym ćwiczeniem seria rozgrzewkowa"] 
        },
        { 
            name: "Lat Pulldown", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/G5k-xWq-9a8",
            tip: "Usiądź prosto lub lekko odchyl tułów (ok. 10-20 stopni). Skup się na przyciąganiu łokci w dół w kierunku bioder. Na początku ruchu opuść barki (depresja) i ściągnij łopatki, zanim zaczniesz ciągnąć." 
        }, 
        { 
            name: "Cable row", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/B-aVd-exU9o",
            tip: "Utrzymuj klatkę wypiętą, a plecy proste przez cały czas. Przyciągaj uchwyt do dolnej części brzucha/pępka, ściskając łopatki razem. Nie 'zarzucaj' ciężarem, ruch powinien być kontrolowany."
        }, 
        { 
            name: "Podciąganie na maszynie", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/rP1jG66e9iU",
            tip: "Skup się na pracy mięśni pleców (najszerszego grzbietu). Wyobraź sobie, że ciągniesz łokcie w dół, a nie po prostu podnosisz się. Utrzymaj kontrolę w fazie opuszczania."
        }, 
        { 
            name: "Wyciskanie na maszynie Smitha", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/tM1lV4kGv9Y",
            tip: "Ustawienie ławki – upewnij się, że sztanga ląduje na środku klatki. Prowadź łokcie pod kątem około 45-60 stopni do tułowia, aby chronić stawy barkowe. Kontroluj ruch w dół i wyciskaj ciężar dynamicznie, ale stabilnie."
        }, 
        { 
            name: "Rozpiętki na maszynie Pec Dec", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/tM1lV4kGv9Y",
            tip: "Zablokuj łopatki (ściągnij je do siebie i w dół) przed rozpoczęciem ruchu. Wyobraź sobie, że przytulasz duże drzewo. Na końcu ruchu (złączeniu rąk) mocno napnij mięśnie klatki. Nie pozwól, aby maszyna rozciągnęła Cię za daleko."
        } 
    ],
    "THU": [{ name: "Cardio", sets: 1, reps: "30 min - 1 h", isDataEntry: false }],
    "FRI": [
        { 
            name: "Rozgrzewka", 
            sets: 1, 
            reps: "5-10 min", 
            isDataEntry: false, 
            details: ["Bieżnia - 10 min", "Wymachy rąk", "Przed każdym ćwiczeniem seria rozgrzewkowa"]
        },
        { 
            name: "Modlitewnik maszyna", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/Q0P9iQf7D1Q",
            tip: "Utrzymuj pełny kontakt ramion z podkładką. Skup się na powolnym opuszczaniu ciężaru (faza negatywna) – to klucz do wzrostu bicepsa. Używaj pełnego zakresu ruchu, ale unikaj przeprostu łokci w dolnej fazie."
        }, 
        { 
            name: "Zginanie przedramion z hantlami", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/Y0rQ1J6lK08",
            tip: "Uważaj na kołysanie tułowiem (cheating). Stój prosto lub lekko pochyl się do przodu. Trzymaj łokcie stabilnie przy tułowiu. Możesz wykonywać ruch naprzemiennie lub jednocześnie. W fazie skurczu obróć dłonie (supinacja) dla mocniejszego zaangażowania bicepsa."
        }, 
        { 
            name: "Maszyna do tricepsa", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/j3ftE2Jd74Y",
            tip: "Utrzymuj łokcie blisko tułowia i nieruchomo – ruch powinien odbywać się tylko w stawie łokciowym. Mocno wyprostuj ręce na dole, spinając triceps, a następnie powoli kontroluj powrót do góry."
        }, 
        { 
            name: "Dipy", 
            sets: 3, 
            reps: "8-12", 
            isDataEntry: true, 
            link: "https://www.youtube.com/embed/7XjF0rYwO3w",
            tip: "Trzymaj tułów pionowo." 
        }, 
        { 
            name: "Brzuszki", 
            sets: 3, 
            reps: "Limit", 
            isDataEntry: true 
        }
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