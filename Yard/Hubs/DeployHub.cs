using Microsoft.AspNetCore.SignalR;

namespace Yard.Hubs
{
    public class DeployHub : Hub
    {
        public void SendToAll(string message)
        {
            Clients.All.SendAsync("sendToAll", message);
        }
    }
}