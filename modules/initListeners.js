import { comments, updateComments } from './Comments.js'
import { sanitizeHtml } from './sanitizeHtml.js'
import { renderComments } from './renderComments.js'
import { postComment, fetchComments } from './api.js'

// Вспомогательная функция задержки
function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(resolve, interval);
    });
}

// Обёртка для postComment с автоматическими повторяющимися попытками
function postCommentWithRetries(text, name, retries = 3) {
    return postComment(text, name).catch(async (error) => {
        if (error.message === 'Ошибка сервера' && retries > 0) {
            console.log(`Ошибка 500, повторная попытка. Осталось попыток: ${retries}`);
            await delay(1000); // подождать 1 сек
            return postCommentWithRetries(text, name, retries - 1);
        } else {
            throw error;
        }
    });
}
 
export const initAddCommentListener = () => {
    const name = document.getElementById('name-input');
    const text = document.getElementById('text-input');
    const addButton = document.querySelector('.add-form-button');

    // Вспомогательная функция задержки
    function delay(interval = 1000) {
        return new Promise((resolve) => setTimeout(resolve, interval));
    }

    const handlePostClick = () => {
        if (name.value.trim() === '' || text.value.trim() === '') {
            alert('Пожалуйста, заполните форму!');
            return;
        }

        document.querySelector('.form-loading').style.display = 'block';
        document.querySelector('.add-form').style.display = 'none';

        postComment(
            sanitizeHtml(text.value.trim()),
            sanitizeHtml(name.value.trim())
        )
            .then(() => {
                return fetchComments();
            })
            .then((commentsData) => {
                updateComments(commentsData);
                renderComments();
                name.value = '';
                text.value = '';
                document.querySelector('.form-loading').style.display = 'none';
                document.querySelector('.add-form').style.display = 'flex';
            })
            .catch(async (error) => {
                if (error.message === 'Ошибка сервера') {
                    // При ошибке 500 — ждем секунду и повторяем запрос
                    await delay(1000);
                    handlePostClick();
                    return;
                }

                // При других ошибках показываем форму и выводим алерт
                document.querySelector('.form-loading').style.display = 'none';
                document.querySelector('.add-form').style.display = 'flex';

                if (error.message === 'Failed to fetch') {
                    alert('Нет интернета. Попробуйте снова');
                } else if (error.message === 'Неверный запрос') {
                    alert('Имя и комментарий должны быть не короче 3-х символов');
                    name.classList.add('-error');
                    text.classList.add('-error');
                    setTimeout(() => {
                        name.classList.remove('-error');
                        text.classList.remove('-error');
                    }, 2000);
                } else {
                    alert('Произошла неизвестная ошибка');
                }
            });
    };

    addButton.addEventListener('click', handlePostClick);
};

// Остальной код, как был, без изменений
export const initLikeListeners = () => {
    const likeButtons = document.querySelectorAll('.like-button');

    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', async (event) => {
            event.stopPropagation();

            const index = likeButton.dataset.index;
            const comment = comments[index];

            // автовизуализация анимации
            likeButton.classList.add('-loading-like');

            await delay(500); // задержка в 500мс

            // убираем анимацию
            likeButton.classList.remove('-loading-like');

            // обновляем лайк
            comment.likes = comment.isliked
                ? comment.likes - 1
                : comment.likes + 1;
            comment.isliked = !comment.isliked;

            renderComments();
        });
    }
};

export const initReplyListeners = () => {
    const text = document.getElementById('text-input');
    const commentsElements = document.querySelectorAll('.comment');

    for (const commentElement of commentsElements) {
        commentElement.addEventListener('click', () => {
            const currentComment = comments[commentElement.dataset.index];
            text.value = `${currentComment.name}: ${currentComment.text}`;
        });
    }
};

