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
        private readonly int _membersRepositoryId = 67412310;

        public GitHubService()
        {
            var tokenAuth = new Credentials("47e3903d5a00a7fdf749c83b27fb10b219fb781b");
            _gitHubClient = new GitHubClient(new ProductHeaderValue("yard"), new InMemoryCredentialStore(tokenAuth));
        }
        public async Task<List<PullRequest>> GetPullRequestsForRelease(string application, string buildRevision, string previousBuildRevision)
        {
            var compareResult = await _gitHubClient.Repository.Commit.Compare(_membersRepositoryId, previousBuildRevision, buildRevision);
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

                var pullRequest = await _gitHubClient.PullRequest.Get(_membersRepositoryId, pullRequestId);
                
                pullRequests.Add(new PullRequest
                {
                    Id = pullRequest.Id,
                    Description = pullRequest.Title,
                    Url = pullRequest.Url
                });
            }

            var orderedList = pullRequests.OrderBy(pr => pr.Id).ToList();
            return orderedList;
        }
    }
}