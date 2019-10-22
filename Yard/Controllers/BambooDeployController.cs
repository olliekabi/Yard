using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Yard.Hubs;
using Yard.Models;
using Yard.Services;

namespace Yard.Controllers
{
    [ApiController]
    [Route("BambooDeploy")]
    public class BambooDeployController : ControllerBase
    {
        private readonly IHubContext<DeployHub> _deployHubContext;
        private readonly IGitHubService _gitHubService;

        public BambooDeployController(IHubContext<DeployHub> deployHubContext, IGitHubService gitHubService)
        {
            _deployHubContext = deployHubContext;
            _gitHubService = gitHubService;
        }

        [HttpPost]
        [Route("start")]
        public IActionResult Start(BambooUpdateEvent updateEvent)
        {
            var update = JsonConvert.SerializeObject(updateEvent);
            _deployHubContext.Clients.All.SendAsync("deployStart", update);
            return Ok();
        }
        
        [HttpPost]
        [Route("update")]
        public IActionResult Update(BambooUpdateEvent updateEvent)
        {
            var update = JsonConvert.SerializeObject(updateEvent);
            _deployHubContext.Clients.All.SendAsync("deployUpdate", update);
            return Ok();
        }
        
        [HttpPost]
        [Route("end")]
        public IActionResult End(BambooUpdateEvent updateEvent)
        {
            var jsonUpdate = JsonConvert.SerializeObject(updateEvent);
            _deployHubContext.Clients.All.SendAsync("deployEnd", jsonUpdate);

            var pullRequest = _gitHubService.GetPullRequestForRelease(updateEvent.Application, updateEvent.Revision);
            var jsonPullRequest = JsonConvert.SerializeObject(pullRequest);
            _deployHubContext.Clients.All.SendAsync("addPullRequest", jsonPullRequest);
            return Ok();
        }
    }
}