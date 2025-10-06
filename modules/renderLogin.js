import { fetchAndRenderComments } from "../index.js"
import { login, setToken, setName } from "./api.js"
import { renderRegistration } from "./renderRegistration.js"

 export const renderLogin = () => {
    const container = document.querySelector('.container') 
    const loginHtml = ` 
    <section class="add-form"> 
    <h1>Форма входа</h1> 
    <input  
    type="text" 
    class="add-form-name" 
    placeholder="Введите логин" 
    id="login" 
    required 
    /> 
    <input 
     type="password" 
    class="add-form-name" 
    placeholder="Введите пароль" 
    id="password" 
    required 
    ></input> 
    <fieldset class="add-form-registry"> 
    <button class="add-form-main button-main" type="submit"> 
    Войти</button> 
    <u class="add-form-button-link registry" > 
    Зарегистрироваться 
    </u> 
    </fieldset> 
    </section>  
    ` 
     
    container.innerHTML = loginHtml 
     
  document.querySelector('.registry').addEventListener('click', () => {
    renderRegistration()
  })
     
  const loginEl = document.querySelector ('#login') 
  const passwordEl = document.querySelector ('#password')  
  const submitButtonElEl = document.querySelector ('.button-main') 
   
  submitButtonElEl.addEventListener('click', () =>{
    login(loginEl.value, passwordEl.value) 
    .then((response) => {
       return response.json()
    }) 
    .then((data) => {
      setToken(data.user.token) 
      setName(data.user.name) 
      fetchAndRenderComments()
    })
  })
}