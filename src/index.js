const axios = require("axios");

class App {
    constructor(){
        this.buttonCreate = document.getElementById("btn_create");
        this.title = document.getElementById("input_title");
        this.content = document.getElementById("input_content");
        this.url = 'http://localhost:3000/cards'; 

        this.getScraps(this);
        this.registerEvents();
    }

    registerEvents() {
        this.buttonCreate.onclick = (event) => this.createCard(event);
    }

    getScraps(){
        axios.get(this.url)
            .then (function(response){
                console.log(response.data)
                this.recoveryScraps(response.data);
            })
            .catch(function (error){
                console.log(error);
            })
            .finally(function(){});
    }

    recoveryScraps(data){
        for (item in data){
            const html = this.cardLayout(item.title, item.content);

            this.insertHtml(html)

            document.querySelectorAll('.delete-card').forEach(item => {
                item.onclick = event => this.deleteCard(event);
            });
        }
    }


    createCard(event) {
        event.preventDefault();

        if(this.title.value && this.content.value) {
            this.SendToServer(this);

        } else {
            alert("Preencha os campos!");
        }
       
    }

    SendToServer(app) {
        axios.post(this.url, {
            title: this.title.value,
            content: this.content.value
        })
        .then(function(response){
            const { title, content} = response.data;
            let html = app.cardLayout( title, content);

            app.insertHtml(html);

            app.clearForm();

            document.querySelectorAll('.delete-card').forEach(item => {
                item.onclick = event => app.deleteCard(event);
            })
        })
        .catch(function (error){
            console.log(error);
            alert("Deu ruim!");
        })
        .finally(function(){})
    }

    cardLayout(title, content) {
        const html = `
            <div class="col mt-5">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${content}</p>
                    <button type="button" class="btn btn-danger delete-card">Excluir</button>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    insertHtml(html) {
        document.getElementById("row_cards").innerHTML += html;
    }

    clearForm() {
        this.title.value = "";
        this.content.value = "";
    }

    deleteCard = (event) => {
        const id = event.path[3].getAttribute('Cards');
        
        axios.delete(`${this.url}${id}`)
            .then(function (response){
                event.path[3].remove();
            })
            .catch(function (error){
                console.log(error);
                alert("Error")
            })
            .finally(function(){})
    }

}

new App();