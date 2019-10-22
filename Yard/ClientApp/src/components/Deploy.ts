import {PullRequest, PullRequestJSON} from "./PullRequest";

export interface Deploy {
    environment: string,
    application: string,
    version: string,
    buildRevision: string,
    previousBuildRevision: string,
    pullRequests: PullRequest[],
    status: string,
    resultsUrl: string
}

export interface DeployJSON {
    Environment: string,
    Application: string,
    Version: string,
    BuildRevision: string,
    PreviousBuildRevision: string,
    PullRequests: PullRequestJSON[],
    Status: string,
    ResultsUrl: string
}