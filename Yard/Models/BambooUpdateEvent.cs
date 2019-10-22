namespace Yard.Models
{
    public class BambooUpdateEvent
    {
        public string Environment { get; set; }
        public string Application { get; set; }
        public string Version { get; set; }
        public string Revision { get; set; }
        public string Status { get; set; }
        public string ResultsUrl { get; set; }
    }
}