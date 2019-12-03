using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Octokit;
using Octokit.Internal;
using PullRequest = Yard.Models.PullRequest;

namespace Yard.Services
{
    public interface IGitHubService
    {
        Task<List<PullRequest>> GetPullRequestsForRelease(string application, string buildRevision, string previousBuildRevision);
    }
    
    public class GitHubService : IGitHubService
    {
        private readonly IGitHubClient _gitHubClient;
        private readonly Dictionary<string, int> _applicationIds = new Dictionary<string, int> { {"Members", 67412310}, {"Customers", 67585340}};

        public GitHubService()
        {
            var tokenAuth = new Credentials("placeholder");
            _gitHubClient = new GitHubClient(new ProductHeaderValue("yard"), new InMemoryCredentialStore(tokenAuth));
        }
        public async Task<List<PullRequest>> GetPullRequestsForRelease(string application, string buildRevision, string previousBuildRevision)
        {
            var applicationId = _applicationIds[application];
            var compareResult = await _gitHubClient.Repository.Commit.Compare(applicationId, previousBuildRevision, buildRevision);
            var commits = new List<GitHubCommit>(compareResult.Commits) {compareResult.BaseCommit};

            var pullRequests = new List<PullRequest>();
            foreach (var commit in commits)
            {
                var commitMessage = commit.Commit.Message;
                if (!commitMessage.StartsWith("Merge pull request")) 
                    continue;
                
                var splitMessage = commit.Commit.Message.Split(' ');
                var pullRequestIdString = splitMessage[3].Substring(1);
                var pullRequestId = int.Parse(pullRequestIdString);

                var pullRequest = await _gitHubClient.PullRequest.Get(applicationId, pullRequestId);
                
                pullRequests.Add(new PullRequest
                {
                    Number = pullRequest.Number,
                    Description = pullRequest.Title,
                    Application = application,
                    Url = pullRequest.Url
                });
            }

            var orderedList = pullRequests.OrderBy(pr => pr.Number).ToList();
            return orderedList;
        }
    }
}
