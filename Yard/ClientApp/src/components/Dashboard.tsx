import React, {Component} from 'react';
import {HubConnection, HubConnectionBuilder} from "@aspnet/signalr";
import Environment from "./Environment";
import Deploy from "./Deploy";

interface DashboardState {
    hubConnection: HubConnection | null,
    deploys: Deploy[],
    message: string
}

class Dashboard extends Component<{}, DashboardState> {
    constructor(props: any) {
        super(props);
        this.state = {
            hubConnection: null,
            deploys: [],
            message: "",
        }
    }
    
    componentDidMount(): void {
        const hubConnection = new HubConnectionBuilder()
            .withUrl("/deployhub")
            .build();
        
        this.setState({hubConnection: hubConnection, message: ""}, () => {
            if (this.state.hubConnection !== null) {
                this.state.hubConnection
                    .start()
                    .then(function () {console.log("SignalR connected")})
                    .catch(err => console.log('Error while establishing connection :( \n' + err))
                this.state.hubConnection.on('deployStart', (response: string) => {
                    const json = JSON.parse(response);
                    const deploy:Deploy = {
                        environment: json.Environment,
                        application: json.Application,
                        version: json.Version,
                        status: json.Status,
                        resultsUrl: json.ResultsUrl
                    };
                    let deploys = this.state.deploys;
                    const deployToUpdateIndex = this.state.deploys.findIndex(x => x.environment == deploy.environment && x.application == deploy.application);
                    if (deployToUpdateIndex !== -1) {
                        deploys[deployToUpdateIndex].status = deploy.status;
                    } else {
                        deploys = deploys.concat(deploy)
                    }
                    this.setState({deploys: deploys})
                });
                this.state.hubConnection.on('deployUpdate', (response: string) => {
                    const json = JSON.parse(response);
                    const deploy:Deploy = {
                        environment: json.Environment,
                        application: json.Application,
                        version: json.Version,
                        status: json.Status,
                        resultsUrl: json.ResultsUrl
                    };
                    const deploys = this.state.deploys;
                    const deployToUpdateIndex = this.state.deploys.findIndex(x => x.environment == deploy.environment && x.application == deploy.application)
                    deploys[deployToUpdateIndex].status = deploy.status;
                    this.setState({deploys: deploys})
                });
                this.state.hubConnection.on('deployEnd', (response: string) => {
                    const json = JSON.parse(response);
                    const deploy:Deploy = {
                        environment: json.Environment,
                        application: json.Application,
                        version: json.Version,
                        status: json.Status,
                        resultsUrl: json.ResultsUrl
                    };
                    const deploys = this.state.deploys.filter(x => !(x.environment == deploy.environment && x.application == deploy.application));
                    this.setState({deploys: deploys})
                })
            }
        });
    }

    render() {
        const { deploys } = this.state;
        return(
            <div className='full-width' style={{display: 'flex', height:'100%'}}>
                <Environment name="Replica" colour="#2ecc71" deploys={deploys.filter(x => x.environment == "Replica")}/>
                <Environment name="Production" colour="#e74c3c" deploys={deploys.filter(x => x.environment == "Production")}/>
            </div>
        )
    }
}

export default Dashboard;