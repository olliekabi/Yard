import React, {Component} from 'react';
import { Alert } from 'reactstrap';
import {HubConnection, HubConnectionBuilder} from "@aspnet/signalr";

interface Deploy {
    application: string,
    version: string,
    resultsUrl: string
}

interface DashboardState {
    hubConnection: HubConnection | null,
    deploys: Deploy[]
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
                        application: json.Application,
                        version: json.Version,
                        resultsUrl: json.ResultsUrl
                    };
                    this.setState({deploys: this.state.deploys.concat(deploy)})
                });
                this.state.hubConnection.on('deployEnd', (response: string) => {
                    const json = JSON.parse(response);
                    const deploy:Deploy = {
                        application: json.Application,
                        version: json.Version,
                        resultsUrl: json.ResultsUrl
                    };
                    const deploys = this.state.deploys.filter(x => x.application !== deploy.application);
                    this.setState({deploys: deploys})
                })
            }
        });
    }

    render() {
        const { message } = this.state;
        return(
            <div className='full-width' style={{display: 'flex', height:'100%'}}>
                <div style={{backgroundColor: '#2ecc71', flexBasis: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div>
                        Replica
                    </div>
                    <div>
                        
                    </div>                    
                    <div>
                        {this.state.deploys.map((deploy)=> (
                            <div key={deploy.application + deploy.version}>
                                <Alert color="primary">{`Deploying: ${deploy.application} - ${deploy.version} - ${deploy.resultsUrl}`}</Alert>
                            </div>    
                        ))}
                    </div>
                </div>
                <div style={{backgroundColor: '#e74c3c', flexBasis: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>Production</div>
            </div>
        )
    }
}

export default Dashboard;