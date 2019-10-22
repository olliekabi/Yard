using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Yard.Hubs;
using Yard.Models;
using Yard.Services;

namespace Yard.Controllers
{
    [ApiController]
    [Route("deploy")]
    public class DeployController : ControllerBase
    {
        private readonly IHubContext<DeployHub> _deployHubContext;
        private readonly IGitHubService _gitHubService;

        public DeployController(IHubContext<DeployHub> deployHubContext, IGitHubService gitHubService)
        {
            _deployHubContext = deployHubContext;
            _gitHubService = gitHubService;
        }

        [HttpPost]
        [Route("start")]
        public IActionResult Start(DeployEvent deployEvent)
        {
            var update = JsonConvert.SerializeObject(deployEvent);
            _deployHubContext.Clients.All.SendAsync("deployStart", update);
            return Ok();
        }
        
        [HttpPost]
        [Route("update")]
        public IActionResult Update(DeployEvent deployEvent)
        {
            var update = JsonConvert.SerializeObject(deployEvent);
            _deployHubContext.Clients.All.SendAsync("deployUpdate", update);
            return Ok();
        }
        
        [HttpPost]
        [Route("end")]
        public async Task<IActionResult> End(DeployEvent deployEvent)
        {
            var pullRequests = await _gitHubService.GetPullRequestsForRelease(deployEvent.Application, deployEvent.BuildRevision, deployEvent.PreviousBuildRevision);
            var deploy = new Deploy
            {
                Environment = deployEvent.Environment,
                Application = deployEvent.Application,
                Version = deployEvent.Version,
                BuildRevision = deployEvent.BuildRevision,
                PreviousBuildRevision = deployEvent.PreviousBuildRevision,
                PullRequests = pullRequests,
                Status = deployEvent.Status,
                ResultsUrl = deployEvent.ResultsUrl
            };
            var jsonDeploy = JsonConvert.SerializeObject(deploy);

            await _deployHubContext.Clients.All.SendAsync("deployEnd", jsonDeploy);

            return Ok();
        }
    }
}