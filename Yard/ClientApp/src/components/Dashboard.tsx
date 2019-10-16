import React, {Component} from 'react';
import { Alert } from 'reactstrap';
import {HubConnection, HubConnectionBuilder} from "@aspnet/signalr";

interface DashboardState {
    hubConnection: HubConnection | null,
    message: string
}

class Dashboard extends Component<{}, DashboardState> {
    constructor(props: any) {
        super(props);
        this.state = {
            message: "",
            hubConnection: null
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
                    let updateEvent = JSON.parse(response);
                    this.setState({message: `Application: ${updateEvent.Application}, Version: ${updateEvent.Version}, Results: ${updateEvent.ResultsUrl}`})
                });
                this.state.hubConnection.on('deployEnd', (response: string) => {
                    this.setState({message: ""})
                })
            }
        });
    }

    render() {
        const { message } = this.state;
        return(
            <div style={{display: 'flex', height:'100%'}}>
                <div style={{backgroundColor: '#2ecc71', flexGrow: 1}}>
                    Replica 
                    <Alert color="primary">{message}</Alert>
                </div>
                <div style={{backgroundColor: '#e74c3c', flexGrow: 1}}>Production</div>
            </div>
        )
    }
}

export default Dashboard;