import React from "react";
import {Alert} from "reactstrap";
import Deploy from "./Deploy";

interface EnvironmentProps {
    name: string,
    colour: string,
    deploys: Deploy[]
}

const Environment = (props: EnvironmentProps) => {
    return (
        <div style={{backgroundColor: `${props.colour}`, flexBasis: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
                {props.name}
            </div>
            <div>

            </div>
            <div>
                {props.deploys.map((deploy)=> (
                    <div key={deploy.application + deploy.version}>
                        <Alert color="primary">{`Deploying: ${deploy.application} - ${deploy.version} - ${deploy.resultsUrl}`}</Alert>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Environment