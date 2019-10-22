using System;
using Octokit;
using PullRequest = Yard.Models.PullRequest;

namespace Yard.Services
{
    public interface IGitHubService
    {
        PullRequest GetPullRequestForRelease(string application, string revision);
    }
    
    public class GitHubService : IGitHubService
    {
        private readonly IGitHubClient _gitHubClient;

        public GitHubService()
        {
            _gitHubClient = new GitHubClient(new ProductHeaderValue("yard"));
            var tokenAuth = new Credentials("47e3903d5a00a7fdf749c83b27fb10b219fb781b");
        }
        public PullRequest GetPullRequestForRelease(string application, string revision)
        {
            throw new NotImplementedException();
        }
    }
}