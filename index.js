import { fetchComments } from './modules/api.js' 
import { updateComments } from './modules/Comments.js' 
import { renderComments } from './modules/renderComments.js'
 
export const fetchAndRenderComments = (isFirstLoading) => { 
   
  if (isFirstLoading){
    document.querySelector('.container').innerHTML = '<p>Пожалуйста подождите, загружаю комментарии...</p>' 
  }

  fetchComments().then(data => {
  updateComments(data) 

  renderComments()
})
}


fetchAndRenderComments (true)