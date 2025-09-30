import { comments, updateComments } from './Comments.js'
import { sanitizeHtml } from './sanitizeHtml.js'
import { renderComments } from './renderComments.js'
import { postComment } from './api.js' 
 
function delay(interval = 300) {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve();
      }, interval);
   });
}
 
export const initLikeListeners = () => {
    const likeButtons = document.querySelectorAll('.like-button');

    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', async (event) => {
            event.stopPropagation();

            const index = likeButton.dataset.index;
            const comment = comments[index];

            // автовизуализация анимации
            likeButton.classList.add('-loading-like');

            await delay(500);  // задержка в 500мс

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
// export const initLikeListeners = () => {
//     const likeButtons = document.querySelectorAll('.like-button')

//     for (const likeButton of likeButtons) {
//         likeButton.addEventListener('click', (event) => {
//             event.stopPropagation()

//             const index = likeButton.dataset.index
//             const comment = comments[index]

//             comment.likes = comment.isliked
//                 ? comment.likes - 1
//                 : comment.likes + 1

//             comment.isliked = !comment.isliked

//             renderComments()
//         })
//     }
// }

export const initReplyListeners = () => {
    const text = document.getElementById('text-input')
    const commentsElements = document.querySelectorAll('.comment')

    for (const commentElement of commentsElements) {
        commentElement.addEventListener('click', () => {
            const currentComment = comments[commentElement.dataset.index]
            text.value = `${currentComment.name}: ${currentComment.text}`
        })
    }
}

export const initAddCommentListener = () => {
    const name = document.getElementById('name-input')
    const text = document.getElementById('text-input')

    const addButton = document.querySelector('.add-form-button')

    addButton.addEventListener('click', function () {
        if (name.value.trim() === '' || text.value.trim() === '') {
            alert('Пожалуйста, заполните форму!')
            return
        }

        document.querySelector('.form-loading').style.display = 'block'
        document.querySelector('.add-form').style.display = 'none'
        // addButton.addEventListener('click', () => {
        //     if (!name.value || !text.value) {
        //         console.error('заполните форму')
        //         return
        //     }

        // const newComment = {
        //     name: sanitizeHtml(name.value.trim()),
        //     date: new Date(),
        //     text: sanitizeHtml(text.value.trim()),
        //     likes: 0,
        //     isLaked: false,
        // }

        postComment(
            sanitizeHtml(text.value.trim()),
            sanitizeHtml(name.value.trim()),
        ).then((data) => { 
             document.querySelector('.form-loading').style.display = 'none'
             document.querySelector('.add-form').style.display = 'flex' 

            updateComments(data)
            renderComments()
            name.value = ''
            text.value = ''
        })

        // comments.push(newComment)

        // renderComments()
    })
}
