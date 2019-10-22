import React from "react";
import {Alert} from "reactstrap";
import {Deploy} from "./Deploy";
import {PullRequest} from "./PullRequest";

interface EnvironmentProps {
    name: string,
    colour: string,
    deploys: Deploy[],
    pullRequests: PullRequest[]
}

const Environment = (props: EnvironmentProps) => {
    const applicationChanges: {[application: string] : PullRequest[]; } = {};
    props.pullRequests.forEach(pr => {
        if (applicationChanges[pr.application] === undefined) {
            applicationChanges[pr.application] = [];
        }
        applicationChanges[pr.application] = applicationChanges[pr.application].concat(pr)
    });
    return (
        <div style={{backgroundColor: `${props.colour}`, borderStyle: 'solid', borderWidth: '3px', flexBasis: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
                {props.name}
            </div>
            <div>
                {
                    Object.keys(applicationChanges).map(key => (
                        <Alert>
                            <h4 className="alert-heading">{key}</h4>
                            <hr />
                            {applicationChanges[key].map(pullRequest => (
                                <p className="mb-0">{pullRequest.number} - {pullRequest.description}</p>
                            ))}
                        </Alert>
                    ))
                }
            </div>
            <div>
                {props.deploys.map(deploy => (
                    <div key={deploy.application + deploy.version}>
                        {deploy.status == 'Failed' ? (
                            <Alert color="danger">
                                {`Deploy Failed: ${deploy.application} - ${deploy.version} - ${deploy.resultsUrl}`}
                            </Alert>
                        ) : (
                            <Alert color="primary">
                                {`Deploying: ${deploy.application} - ${deploy.version} - ${deploy.resultsUrl}`}
                            </Alert>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Environment