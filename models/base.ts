import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { v4 as uuid } from 'uuid';

export class Model {
    public id: string;
    public name: string;
    public wins: number;
    public score: number;
    public store: Store<Model> = null;
    public saveHandler = null;
    public autoSave = true;

    constructor(store: Store<Model>, id = uuid()) {
        makeAutoObservable(this, {
            id: false,
            store: false,
            autoSave: false,
            saveHandler: false,
            dispose: false,
        });

        this.store = store;
        this.id = id;

        this.saveHandler = reaction(
            () => this.asJson, // Observe everything that is used in the JSON.
            json => {
                // If autoSave is true, send JSON to the server.
                if (this.autoSave) {
                    this.store.save(json);
                }
            }
        );
    }

    get asJson() {
        return {
            id: this.id,
            name: this.name,
            wins: this.wins,
            score: this.score,
        };
    }

    updateFromJson(json) {
        this.autoSave = false; // Prevent sending of our changes back to the server.
        this.name = json.name;
        this.wins = json.wins;
        this.score = json.score;
        this.autoSave = true;
    }

    async delete() {
        await this.store.delete(this)
        await this.store.remove(this);
    }

    dispose() {
        this.saveHandler();
    }
}

class Store<M extends Model> {
    public items: M[] = [];
    public isLoading = true;

    constructor(
        public model: new (store: Store<M>, id?: string) => M,
        public url: string
    ) {
        makeAutoObservable(this);
    }

    create() {
        const item = new this.model(this);
        this.items.push(item);
        return item;
    }


    async load() {
        this.isLoading = true;
        const itemsData = await fetch(this.url);
        const items = await itemsData.json() as M[];
        runInAction(() => {
            items.forEach(json => this.updateFromServer(json));
            this.isLoading = false;
        });
    }

    async save(item){
        const data = await fetch(`${this.url}/${item.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        })
        return await data.json()
    }

    async delete(item: M) {
        const data = await fetch(`${this.url}/${item.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        return await data.json()
    }

    updateFromServer(json) {
        let item = this.items.find(item => item.id === json.id);
        if (!item) {
            item = new this.model(this, json.id);
            this.items.push(item);
        }
        if (json.isDeleted) {
            this.remove(item);
        } else {
            item.updateFromJson(json);
        }
    }

    remove(item) {
        this.items.splice(this.items.indexOf(item), 1);
        item.dispose();
    }
}
