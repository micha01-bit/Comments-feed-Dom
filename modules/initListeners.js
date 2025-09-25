import { comments } from './Comments.js'
import { sanitizeHtml } from './sanitizeHtml.js'
import { renderComments } from './renderComments.js'

export const initLikeListeners = () => {
    const likeButtons = document.querySelectorAll('.like-button')

    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation()

            const index = likeButton.dataset.index
            const comment = comments[index]

            comment.likes = comment.isliked
                ? comment.likes - 1
                : comment.likes + 1

            comment.isliked = !comment.isliked

            renderComments()
        })
    }
}

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

    addButton.addEventListener('click', () => {
        if (!name.value || !text.value) {
            console.error('заполните форму')
            return
        }

        const newComment = {
            name: sanitizeHtml(name.value.trim()),
            date: new Date(),
            text: sanitizeHtml(text.value.trim()),
            likes: 0,
            isLaked: false,
        }

        comments.push(newComment)

        renderComments()

        name.value = ''
        text.value = ''
    })
}
