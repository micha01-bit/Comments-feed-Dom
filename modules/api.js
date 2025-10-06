const host = 'https://wedev-api.sky.pro/api/v2/evgeniy-bespalov'
const authHost = 'https://wedev-api.sky.pro/api/user'

export let token = ''

export const setToken = (newToken) => {
    token = newToken
} 
 
export let name = ''

export const setName = (newName) => {
    name = newName
} 

export const fetchComments = () => {
    return fetch(host + '/comments')
        .then((res) => res.json())
        .then((responseData) => {
            const appComments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isliked: false,
                }
            })
            return appComments
        })
}

export const postComment = (text, name, retries = 3) => {
    return fetch(host + '/comments', {
        method: 'POST', 
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, name, forceError: false }),
    }).then((response) => {
        if (response.status === 500 && retries > 0) {
            // Повторяем запрос после задержки
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(postComment(text, name, retries - 1))
                }, 1000)
            })
        }
        if (response.status === 400) {
            throw new Error('Неверный запрос')
        }
        if (response.status === 201) {
            return response.json()
        }
        // Для других статусов можно выбросить ошибку или обработать по-другому
        throw new Error('Ошибка при отправке комментария')
    })
} 
 
export const login = (login, password) => {
     return fetch(authHost + '/login', {
        method: 'POST', 
        body: JSON.stringify({ login: login, password: password }),
    })
} 

export const registration = (name, login, password) => {
     return fetch(authHost, {
        method: 'POST', 
        body: JSON.stringify({name: name, login: login, password: password }),
    })
} 