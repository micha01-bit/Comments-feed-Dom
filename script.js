'use strict'

// Функция для экранирования HTML-символов
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

// Исходный массив комментариев
const commentsData = [
    {
        name: 'Глеб Фокин',
        date: '12.02.22 12:18',
        text: 'Это будет первый комментарий на этой странице',
        likesCount: 3,
        liked: false,
    },
    {
        name: 'Варвара Н.',
        date: '13.02.22 19:22',
        text: 'Мне нравится как оформлена эта страница! ❤',
        likesCount: 75,
        liked: true,
    },
]

// Получаем элементы формы
const nameInput = document.querySelector('.add-form-name')
const textInput = document.querySelector('.add-form-text')
const addButton = document.querySelector('.add-form-button')
const commentsContainer = document.getElementById('comments')

// Валидация
let isNameValid = false
let isTextValid = false

function validateName() {
    isNameValid = nameInput.value.trim() !== ''
}
function validateText() {
    isTextValid = textInput.value.trim() !== ''
}

nameInput.addEventListener('input', validateName)
textInput.addEventListener('input', validateText)

// Функция рендера комментариев
function renderComments() {
    commentsContainer.innerHTML = ''
    commentsData.forEach((comment, index) => {
        const li = document.createElement('li')
        li.className = 'comment'

        li.innerHTML = `
      <div class="comment-header">
        <div>${escapeHtml(comment.name)}</div>
        <div>${comment.date}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text">${escapeHtml(comment.text)}</div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likesCount}</span>
          <button class="like-button ${comment.liked ? '-active-like' : ''}" data-index="${index}"></button>
        </div>
      </div>`

        // Добавляем обработчик клика на сам комментарий (для вставки цитаты)
        li.addEventListener('click', (event) => {
            if (!event.target.closest('.like-button')) {
                // Вставляем цитату в поле текста
                textInput.value += `> ${escapeHtml(comment.text)}\n\n`
                validateText()
            }
        })

        commentsContainer.appendChild(li)
    })
}

// Обработчик лайков с делегированием
commentsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('like-button')) {
        const index = parseInt(event.target.getAttribute('data-index'))

        // Переключение состояния лайка
        if (commentsData[index].liked) {
            commentsData[index].liked = false
            commentsData[index].likesCount -= 1
        } else {
            commentsData[index].liked = true
            commentsData[index].likesCount += 1
        }

        renderComments()
    }
})

// Обработчик кнопки "Написать"
addButton.addEventListener('click', () => {
    validateName()
    validateText()

    if (isNameValid && isTextValid) {
        const now = new Date()

        // Форматирование даты и времени
        const day = String(now.getDate()).padStart(2, '0')
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const yearShort = String(now.getFullYear()).slice(-2)

        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')

        const dateStr = `${day}.${month}.${yearShort} ${hours}:${minutes}`

        // Создаем новый комментарий
        const newComment = {
            name: nameInput.value.trim(),
            date: dateStr,
            text: textInput.value.trim(),
            likesCount: 0,
            liked: false,
        }

        // Добавляем в массив и перерисовываем
        commentsData.push(newComment)

        // Очищаем поля формы
        nameInput.value = ''
        textInput.value = ''

        // Обновляем валидность и рендерим
        validateName()
        validateText()

        renderComments()
    }
})

// Изначальный рендер комментариев при загрузке страницы
renderComments()
