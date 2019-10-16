using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Yard.Hubs;

namespace Yard.Controllers
{
    [ApiController]
    [Route("BambooDeploy")]
    public class BambooDeployController : ControllerBase
    {
        private readonly IHubContext<DeployHub> _deployHubContext;

        public BambooDeployController(IHubContext<DeployHub> deployHubContext)
        {
            _deployHubContext = deployHubContext;
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
        [Route("end")]
        public IActionResult End(BambooUpdateEvent updateEvent)
        {
            var update = JsonConvert.SerializeObject(updateEvent);
            _deployHubContext.Clients.All.SendAsync("deployEnd", update);
            return Ok();
        }
    }

    public class BambooUpdateEvent
    {
        public string Application { get; set; }
        public string Version { get; set; }
        public string ResultsUrl { get; set; }
    }
}