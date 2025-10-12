import { fetchComments } from './modules/api' 
import { updateComments } from './modules/Comments' 
import { renderComments } from './modules/renderComments' 
import { loadUserData } from './api.js'; 
import { initUserSession } from './api.js'; 
 
export const fetchAndRenderComments = (isFirstLoading) => { 
   
  if (isFirstLoading){
    document.querySelector('.container').innerHTML = '<p>Пожалуйста подождите, загружаю комментарии...</p>' 
  }

  fetchComments().then(data => {
  updateComments(data) 

  renderComments()
})
} 

export const initUserSession = () => {
  const { token, name } = loadUserData();
  if (token && name) {
    // Асинхронно произведите любые необходимые действия
    // Например, сохранить их в глобальном состоянии, если используете
    setToken(token);
    setName(name);
  }
}

initUserSession(); 

fetchAndRenderComments (true)