import React, {Component} from 'react';
import {HubConnection, HubConnectionBuilder} from "@aspnet/signalr";
import Environment from "./Environment";
import {Deploy, DeployJSON} from "./Deploy";
import {PullRequest, PullRequestJSON} from "./PullRequest";

interface DashboardState {
    hubConnection: HubConnection | null,
    deploys: Deploy[],
    pullRequests: PullRequest[],
}

class Dashboard extends Component<{}, DashboardState> {
    constructor(props: any) {
        super(props);
        this.state = {
            hubConnection: null,
            deploys: [],
            pullRequests: [],
        }
    }
    
    mapDeploy(json: DeployJSON): Deploy {
        return {
            environment: json.Environment,
            application: json.Application,
            buildRevision: json.BuildRevision,
            previousBuildRevision: json.PreviousBuildRevision,
            pullRequests: json.PullRequests.map((pullRequest: PullRequestJSON): PullRequest => {
                return {
                    number: pullRequest.Number,
                    application: pullRequest.Application,
                    description: pullRequest.Description,
                    url: pullRequest.Url
                }
            }),
            version: json.Version,
            status: json.Status,
            resultsUrl: json.ResultsUrl
        }
    } 
    
    componentDidMount(): void {
        const hubConnection = new HubConnectionBuilder()
            .withUrl("/deployhub")
            .build();
        
        this.setState({hubConnection: hubConnection}, () => {
            if (this.state.hubConnection !== null) {
                this.state.hubConnection
                    .start()
                    .then(function () {console.log("SignalR connected")})
                    .catch(err => console.log('Error while establishing connection :( \n' + err))
                this.state.hubConnection.on('deployStart', (response: string) => {
                    const json = JSON.parse(response);
                    const deploy:Deploy = this.mapDeploy(json);
                    
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
                    const deploy:Deploy = this.mapDeploy(json);
                    
                    const deploys = this.state.deploys;
                    const deployToUpdateIndex = this.state.deploys.findIndex(x => x.environment == deploy.environment && x.application == deploy.application)
                    deploys[deployToUpdateIndex].status = deploy.status;
                    
                    this.setState({deploys: deploys})
                });
                this.state.hubConnection.on('deployEnd', (response: string) => {
                    const json = JSON.parse(response);
                    const deploy:Deploy = this.mapDeploy(json);
                    
                    const deploys = this.state.deploys.filter(x => !(x.environment == deploy.environment && x.application == deploy.application));
                    const pullRequests = this.state.pullRequests.concat(deploy.pullRequests);
                    this.setState({deploys: deploys, pullRequests: pullRequests})
                });
            }
        });
    }

    render() {
        const { deploys, pullRequests } = this.state;
        return(
            <div className='full-width' style={{display: 'flex', height:'100%'}}>
                <Environment name="Replica" colour="#2ecc71" deploys={deploys.filter(x => x.environment == "Replica")} pullRequests={pullRequests}/>
                <Environment name="Production" colour="#e74c3c" deploys={deploys.filter(x => x.environment == "Production")} pullRequests={[]}/>
            </div>
        )
    }
}

export default Dashboard;