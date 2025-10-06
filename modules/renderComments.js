 import { comments } from './Comments.js'
import { initAddCommentListener,initLikeListeners, initReplyListeners } from './initListeners.js'
import { renderLogin } from './renderLogin.js' 
import {name, token} from './api.js'

export const renderComments = () => {
    const container = document.querySelector('.container')

    const commentsHTML = comments
        .map((comment, index) => {
            return `
    <li class="comment" data-index="${index}"> 
    <div class="comment-header"> 
    <div>${comment.name}</div> 
    <div>${comment.date.toLocaleDateString()}</div> 
    </div> 
    <div class="comment-body"> 
    <div class="comment-text"> 
    ${comment.text} 
    </div> 
    </div> 
     <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.likes}</span>
          <button data-index="${index}" class="like-button ${comment.isliked ? '-active-like' : ''}"></button>
        </div>
      </div> 
      </li> 
      `
        })
        .join('')
 
        const addCommentsHtml = ` 
 <ul class="comments" id="comments"></ul>
  <div class="add-form">
    <input
      type="text"
      class="add-form-name"
      placeholder="Введите ваше имя" 
      readonly  
      value="${name}"
      id="name-input"
    />
    <textarea  
      type="textarea"
      class="add-form-text"
      placeholder="Введите ваш комментарий"
      rows="4" 
      id="text-input"
    ></textarea>
    <div class="add-form-row">
      <button class="add-form-button">Написать</button>
    </div>
  </div> 
  <div class="form-loading" style="display: none; margin-top: 20px;"> 
  Комментарий добавляется... 
</div> `  
 
const linkToLoginText = `<p>Чтобы отправить комментарий,<span class="link-login">войдите</span></p>`
 
const baseHtml = `<ul class = "comments">${commentsHTML}</ul> 
 ${token ? addCommentsHtml: linkToLoginText}`  
  
 container.innerHTML = baseHtml 
  
 if (token) {
    initLikeListeners(renderComments)
    initReplyListeners()  
    initAddCommentListener(renderComments)
 } else {
        
  document.querySelector('.link-login').addEventListener('click', 
    () => {
       renderLogin ()
    })
 }

}