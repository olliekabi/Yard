namespace Yard.Models
{
    public class DeployEvent
    {
        public string Environment { get; set; }
        public string Application { get; set; }
        public string Version { get; set; }
        public string BuildRevision { get; set; }
        public string PreviousBuildRevision { get; set; }
        public string Status { get; set; }
        public string ResultsUrl { get; set; }
    }
}