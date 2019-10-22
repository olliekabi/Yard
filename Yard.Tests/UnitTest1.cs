using Xunit;
using Yard.Services;

namespace Yard.Tests
{
    public class UnitTest1
    {
        [Fact]
        public async void Test1()
        {
            var subject = new GitHubService();
            var result = await subject.GetPullRequestsForRelease("Members", "68502a7298ca92fddd31b338a5eedca60c7d9f23", "2e62aabbbbfb3f05585596194acfb39b07204a29");
        }
    }
}