// DOM элементы
const checkboxes = document.querySelectorAll('.checkbox');
const progressFill = document.getElementById('progressFill');
const checkedCount = document.getElementById('checkedCount');
const totalCount = document.getElementById('totalCount');
const progressPercentage = document.getElementById('progressPercentage');

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    totalCount.textContent = checkboxes.length;
    loadProgress();

    // Добавляем обработчики событий для чекбоксов
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });
});

// Функция обновления прогресса
function updateProgress() {
    const checkedBoxes = document.querySelectorAll('.checkbox:checked');
    const checkedCountValue = checkedBoxes.length;
    const totalCountValue = checkboxes.length;
    const percentage = Math.round((checkedCountValue / totalCountValue) * 100);

    // Обновляем счетчики
    checkedCount.textContent = checkedCountValue;
    progressPercentage.textContent = percentage + '%';

    // Анимируем прогресс-бар
    progressFill.style.width = percentage + '%';

    // Добавляем/убираем класс completed для элементов
    checkboxes.forEach(checkbox => {
        const item = checkbox.closest('.item');
        if (checkbox.checked) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
    });

    // Сохраняем прогресс в localStorage
    saveProgress();
}


// Функция сохранения прогресса
function saveProgress() {
    const checkedStates = {};
    checkboxes.forEach(checkbox => {
        checkedStates[checkbox.id] = checkbox.checked;
    });
    localStorage.setItem('checklistProgress', JSON.stringify(checkedStates));
}

// Функция загрузки прогресса
function loadProgress() {
    const savedProgress = localStorage.getItem('checklistProgress');
    if (savedProgress) {
        const checkedStates = JSON.parse(savedProgress);
        checkboxes.forEach(checkbox => {
            if (checkedStates[checkbox.id]) {
                checkbox.checked = true;
                checkbox.closest('.item').classList.add('completed');
            }
        });
        // Обновляем отображение после загрузки
        updateProgressDisplay();
    }
}

// Функция обновления отображения прогресса (без анимации при загрузке)
function updateProgressDisplay() {
    const checkedBoxes = document.querySelectorAll('.checkbox:checked');
    const checkedCountValue = checkedBoxes.length;
    const totalCountValue = checkboxes.length;
    const percentage = Math.round((checkedCountValue / totalCountValue) * 100);

    checkedCount.textContent = checkedCountValue;
    progressPercentage.textContent = percentage + '%';
    progressFill.style.width = percentage + '%';
}

// Функция сброса прогресса
function resetProgress() {
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.item').classList.remove('completed');
    });
    localStorage.removeItem('checklistProgress');
    updateProgressDisplay();
}

// Добавляем кнопку сброса (опционально)
const resetButton = document.createElement('button');
resetButton.innerHTML = '🗑️ Сбросить прогресс';
resetButton.className = 'reset-button';
resetButton.onclick = resetProgress;

// Добавляем кнопку сброса в прогресс-секцию
const progressSection = document.querySelector('.progress-section');
progressSection.appendChild(resetButton);

// Стили для кнопки сброса
const style = document.createElement('style');
style.textContent = `
    .reset-button {
        background: rgba(78, 110, 73, 0.1);
        border: 1px solid #4E6E49;
        color: #4E6E49;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        margin-top: 20px;
        transition: all 0.3s ease;
    }

    .reset-button:hover {
        background: #4E6E49;
        color: #FFFFFF;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(78, 110, 73, 0.3);
    }
`;
document.head.appendChild(style);

// Добавляем плавную прокрутку к разделам при клике на заголовки
document.querySelectorAll('.stage-title').forEach(title => {
    title.style.cursor = 'pointer';
    title.addEventListener('click', function() {
        const stage = this.closest('.stage');
        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Добавляем анимацию появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию ко всем этапам
document.querySelectorAll('.stage').forEach(stage => {
    stage.style.opacity = '0';
    stage.style.transform = 'translateY(30px)';
    stage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(stage);
});

// Добавляем подсказки для чекбоксов
checkboxes.forEach(checkbox => {
    const label = checkbox.nextElementSibling;
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = checkbox.checked ? 'Отменить' : 'Выполнить';

    label.appendChild(tooltip);

    checkbox.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
    });

    checkbox.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
});

// Стили для подсказок
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
    .tooltip {
        position: absolute;
        background: #4E6E49;
        color: #FFFFFF;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        white-space: nowrap;
        top: -35px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
    }

    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: #4E6E49;
    }
`;
document.head.appendChild(tooltipStyle);

