import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { v4 as uuid } from 'uuid'

export class Team {

    public id: string;
    public name: string;
    public wins: number;
    public score: number;
    public store: TeamStore = null;
    public saveHandler = null
    public autoSave = true;

    constructor(store: TeamStore, id = uuid.v4()) {
        makeAutoObservable(this, {
            id: false,
            store: false,
            autoSave: false,
            saveHandler: false,
            dispose: false,
        })

        this.store = store
        this.id = id

        this.saveHandler = reaction(
            () => this.asJson, // Observe everything that is used in the JSON.
            json => {
                // If autoSave is true, send JSON to the server.
                if (this.autoSave) {
                    this.store.transportLayer.saveTeam(json);
                }
            }
        )
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
        this.name = json.name
        this.wins = json.wins
        this.score = json.score
        this.autoSave = true;
    }

    delete() {
        this.store.transportLayer.deleteTeam(this.id);
        this.store.remove(this);
    }

    dispose() {
        this.saveHandler();
    }
}

export class TeamStore {
    public isLoading = true
    public teams: Team[] = []

    constructor() {
        makeAutoObservable(this)
    }

    async load() {
        this.isLoading = true;
        const teamsData = await fetch('/teams')
        const teams = await teamsData.json() as Team[]
        runInAction(() => {
            teams.forEach(json => this.updateFromServer(json));
            this.isLoading = false;
        });
    }

    updateFromServer(json) {
        let team = this.teams.find(team => team.id === json.id);
        if (!team) {
            team = new Team(this, json.id);
            this.teams.push(team);
        }
        if (json.isDeleted) {
            this.remove(team);
        } else {
            team.updateFromJson(json);
        }
    }

    create() {
        const team = new Team(this);
        this.teams.push(team);
        return team;
    }

    remove(team) {
        this.teams.splice(this.teams.indexOf(team), 1);
        team.dispose();
    }
}
