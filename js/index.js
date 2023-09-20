const infoContainer = document.querySelector("#show-panel")
const pic = document.createElement("img")
const title = document.createElement("h2")
const author = document.createElement("h2")
const description = document.createElement("p")
const usersContainer = document.createElement("ul")
let liked = false
let likedUserArray = []
infoContainer.append(pic,title,author,description,usersContainer)

const loadBooks = () =>{
    fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(body => {
        body.forEach((book)=>{
            addbook(book)
        })
    })
}
const addbook = (book) =>{
    const bookContainter = document.querySelector("#list")
    const bookElement = document.createElement("li")
    
    bookElement.textContent = book.title
    bookElement.addEventListener("click",()=>{
        let likeBook = document.querySelector("button")
        if(!likeBook) {
            likeBook = document.createElement("button")
            infoContainer.append(likeBook)
        }
        book.users.forEach((user)=>{
            if(user.username === "Danner"){
                likeBook.textContent = "UNLIKE"
                like = true
            }else{
                likeBook.textContent = "LIKE"
                like = false
            }
        })
        pic.src = book['img_url']
        title.textContent = book.title
        author.textContent = book.author
        description.textContent = book.description
        usersContainer.innerHTML=""
        book.users.forEach(user=>{
            const userName = document.createElement("li")
            userName.textContent = user.username
            usersContainer.append(userName)
        })
        likedUserArray = book.users
        likeBook.onclick = () =>{
            if(!liked){
                fetch(`http://localhost:3000/books/${book.id}`,{
                    method:"PATCH",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({"users":[...book.users,{"id":11,"username" :"Danner"}]})
                })
                .then(resp => resp.json())
                .then(body =>{
                    const user = document.createElement("li")
                    console.log(body)
                    likedUserArray = body['users']
                    user.textContent = body['users'][body['users'].length-1]['username']
                    usersContainer.append(user)
                    likeBook.textContent = "UNLIKE"
                    liked = !liked
                })
            }else{
                likedUserArray.pop()
                fetch(`http://localhost:3000/books/${book.id}`,{
                    method:"PATCH",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({"users":{...likedUserArray}})
                })
                .then(resp => resp.json())
                .then(body => {
                    console.log(body)
                    likeBook.textContent = "LIKE"
                    usersContainer.children[usersContainer.children.length-1].remove()
                })
                liked = !liked
            }
        }
    })
    bookContainter.append(bookElement)
    
}
loadBooks()